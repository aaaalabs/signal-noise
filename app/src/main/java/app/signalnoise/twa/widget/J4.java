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
 * J4 - Honest Materials: Authentic glass/metal textures
 * Jony Ive principle: Materials should be honest to their nature
 */
public class J4 extends AppWidgetProvider {
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
        int ratio = prefs.getInt("current_ratio", 43);
        int signal = prefs.getInt("signal_count", 2);
        int noise = prefs.getInt("noise_count", 3);

        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_j4);

        // Honest materials: Color and opacity reflect true state
        String ratioColor = ratio >= 80 ? "#00FF88" : "#FF8800";
        views.setTextColor(R.id.ratio_text, android.graphics.Color.parseColor(ratioColor));
        views.setTextViewText(R.id.ratio_text, ratio + "%");
        views.setTextViewText(R.id.signal_text, signal + " signal");
        views.setTextViewText(R.id.noise_text, noise + " noise");

        String trend = signal > noise ? "trending up" : "needs focus";
        views.setTextViewText(R.id.trend_text, trend);

        Intent launchIntent = new Intent(context, LauncherActivity.class);
        launchIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, launchIntent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        views.setOnClickPendingIntent(R.id.widget_container, pendingIntent);

        appWidgetManager.updateAppWidget(appWidgetId, views);
    }
}