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
 * V1 - Font Weight Variation (light vs thin)
 */
public class V1 extends AppWidgetProvider {
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
        int ratio = prefs.getInt("current_ratio", -1);
        int signal = prefs.getInt("signal_count", -1);
        int noise = prefs.getInt("noise_count", -1);

        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_v1);

        if (ratio == -1 || signal == -1 || noise == -1) {
            views.setInt(R.id.ratio_text, "setVisibility", android.view.View.INVISIBLE);
            views.setInt(R.id.signal_text, "setVisibility", android.view.View.INVISIBLE);
            views.setInt(R.id.noise_text, "setVisibility", android.view.View.INVISIBLE);
            views.setInt(R.id.trend_text, "setVisibility", android.view.View.INVISIBLE);
            views.setInt(R.id.widget_container, "setBackgroundResource", R.drawable.compact_glow);
        } else {
            String ratioColor = ratio >= 80 ? "#00FF88" : "#FF8800";
            int glowBackground = ratio >= 80 ? R.drawable.compact_glow_green : R.drawable.compact_glow_orange;

            views.setInt(R.id.widget_container, "setBackgroundResource", glowBackground);
            views.setTextColor(R.id.ratio_text, android.graphics.Color.parseColor(ratioColor));
            views.setTextViewText(R.id.ratio_text, ratio + "%");
            views.setTextViewText(R.id.signal_text, signal + " signal");
            views.setTextViewText(R.id.noise_text, noise + " noise");

            String trend = signal > noise ? "trending up" : "needs focus";
            views.setTextViewText(R.id.trend_text, trend);

            views.setInt(R.id.ratio_text, "setVisibility", android.view.View.VISIBLE);
            views.setInt(R.id.signal_text, "setVisibility", android.view.View.VISIBLE);
            views.setInt(R.id.noise_text, "setVisibility", android.view.View.VISIBLE);
            views.setInt(R.id.trend_text, "setVisibility", android.view.View.VISIBLE);
        }

        Intent launchIntent = new Intent(context, LauncherActivity.class);
        launchIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, launchIntent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        views.setOnClickPendingIntent(R.id.widget_container, pendingIntent);

        appWidgetManager.updateAppWidget(appWidgetId, views);
    }
}