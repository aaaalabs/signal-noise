package app.signalnoise.twa.widget;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.SharedPreferences;
import android.widget.RemoteViews;
import app.signalnoise.twa.R;

/**
 * Wave Pattern - Mathematical wave visualization
 * Signal = smooth waves ∿∿∿∿
 * Noise = chaotic waves ⩙⩚⩛
 */
public class WavePattern extends AppWidgetProvider {
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

            String waves = generateWavePattern(ratio);

            views.setTextViewText(R.id.widget_ratio, ratio + "%");
            views.setTextViewText(R.id.widget_progress, waves);

            appWidgetManager.updateAppWidget(appWidgetId, views);
        } catch (Exception e) {
            // Silent fail
        }
    }

    private String generateWavePattern(int ratio) {
        if (ratio > 70) return "∿∿∿∿∿∿"; // Smooth constructive waves
        if (ratio > 50) return "∿∿ ∿∿"; // Partial interference
        return "⩙⩚⩛ ⩙"; // Chaotic destructive waves
    }
}
