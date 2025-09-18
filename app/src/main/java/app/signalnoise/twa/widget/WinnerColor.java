package app.signalnoise.twa.widget;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.SharedPreferences;
import android.widget.RemoteViews;
import app.signalnoise.twa.R;

/**
 * Color Adaptive - Background adapts to productivity state
 * Cool colors (stress/noise) → Warm colors (flow/signal)
 * Color psychology meets real-time data
 */
public class WinnerColor extends AppWidgetProvider {
    private static final String PREFS_NAME = "signal_noise_widget_data";

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateWidget(context, appWidgetManager, appWidgetId);
        }
        RedisDataFetcher.fetchAndUpdateWidgetData(context, "thomas.seiger@gmail.com");
    }

    private void updateWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        try {
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_sn2x1p);

            SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
            int ratio = prefs.getInt("current_ratio", 75);

            // Adaptive color state
            String state = getColorState(ratio);
            String emoji = getStateEmoji(ratio);

            views.setTextViewText(R.id.widget_ratio, ratio + "%");
            views.setTextViewText(R.id.widget_progress, emoji + " " + state);

            appWidgetManager.updateAppWidget(appWidgetId, views);
        } catch (Exception e) {
            // Silent fail
        }
    }

    private String getColorState(int ratio) {
        if (ratio > 85) return "Excellence";
        if (ratio > 70) return "Flow";
        if (ratio > 50) return "Focus";
        if (ratio > 30) return "Scatter";
        return "Chaos";
    }

    private String getStateEmoji(int ratio) {
        if (ratio > 85) return "⚡";
        if (ratio > 70) return "🎯";
        if (ratio > 50) return "⚖️";
        if (ratio > 30) return "🌀";
        return "🌪️";
    }
}