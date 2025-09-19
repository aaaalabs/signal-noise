package app.signalnoise.twa.widget;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.widget.RemoteViews;
import app.signalnoise.twa.LauncherActivity;
import app.signalnoise.twa.R;

/**
 * T1 - 1x1 Ratio Widget with SVG background
 * Shows just the ratio number (no %) with Signal/Noise outline
 */
public class T1 extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        RedisDataFetcher.fetchAndUpdateWidgetData(context, "thomas.seiger@gmail.com");

        for (int appWidgetId : appWidgetIds) {
            updateWidget(context, appWidgetManager, appWidgetId);
        }

        try {
            Thread.sleep(1000);
            RedisDataFetcher.fetchAndUpdateWidgetData(context, "thomas.seiger@gmail.com");
            for (int appWidgetId : appWidgetIds) {
                updateWidget(context, appWidgetManager, appWidgetId);
            }
        } catch (InterruptedException e) {
            // Continue without delay
        }
    }

    private void updateWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        SharedPreferences prefs = context.getSharedPreferences("signal_noise_widget_data", Context.MODE_PRIVATE);
        int ratio = prefs.getInt("current_ratio", 75);

        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_t1);

        // Show just the number (no %) with dynamic color
        String ratioColor = ratio >= 80 ? "#00FF88" : "#FF8800";
        views.setTextColor(R.id.ratio_number, android.graphics.Color.parseColor(ratioColor));
        views.setTextViewText(R.id.ratio_number, String.valueOf(ratio));

        // Add tap-to-open
        Intent launchIntent = new Intent(context, LauncherActivity.class);
        launchIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, launchIntent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        views.setOnClickPendingIntent(R.id.ratio_number, pendingIntent);

        appWidgetManager.updateAppWidget(appWidgetId, views);
    }
}