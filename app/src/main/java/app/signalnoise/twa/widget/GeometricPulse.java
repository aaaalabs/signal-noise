package app.signalnoise.twa.widget;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.SharedPreferences;
import android.widget.RemoteViews;
import app.signalnoise.twa.R;

/**
 * Geometric Pulse - Sacred geometry meets productivity
 * Ratio visualized through geometric patterns
 * High signal = complex geometry, low signal = simple forms
 */
public class GeometricPulse extends AppWidgetProvider {
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

            String geometry = generateGeometry(ratio);
            String pattern = generatePattern(ratio);

            views.setTextViewText(R.id.widget_ratio, ratio + "% " + geometry);
            views.setTextViewText(R.id.widget_progress, pattern);

            appWidgetManager.updateAppWidget(appWidgetId, views);
        } catch (Exception e) {
            // Silent fail
        }
    }

    private String generateGeometry(int ratio) {
        if (ratio > 90) return "◆"; // Diamond - perfection
        if (ratio > 80) return "◇"; // Diamond outline - excellence
        if (ratio > 70) return "○"; // Circle - flow state
        if (ratio > 60) return "□"; // Square - structure
        if (ratio > 40) return "△"; // Triangle - basic order
        return "▢"; // Broken square - chaos
    }

    private String generatePattern(int ratio) {
        if (ratio > 80) return "◆◇○□△"; // Complex sacred geometry
        if (ratio > 60) return "○□△"; // Balanced forms
        if (ratio > 40) return "△▢"; // Simple order
        return "▢ ▢"; // Scattered chaos
    }
}