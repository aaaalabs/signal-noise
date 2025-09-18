package app.signalnoise.twa.widget;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.SharedPreferences;
import android.widget.RemoteViews;
import app.signalnoise.twa.R;

/**
 * Quantum Particles - Ratio as particle density visualization
 * High signal = dense dots: ●●●●●●●
 * Low signal = sparse dots: ● ● ●
 */
public class QuantumParticles extends AppWidgetProvider {
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

            // Create particle field based on ratio
            String particles = generateParticleField(ratio);

            views.setTextViewText(R.id.widget_ratio, ratio + "%");
            views.setTextViewText(R.id.widget_progress, particles);

            appWidgetManager.updateAppWidget(appWidgetId, views);
        } catch (Exception e) {
            // Silent fail
        }
    }

    private String generateParticleField(int ratio) {
        int density = ratio / 10; // 0-10 particles
        StringBuilder field = new StringBuilder();

        for (int i = 0; i < 10; i++) {
            if (i < density) {
                field.append("●"); // Dense particles for high signal
            } else {
                field.append(" "); // Empty space for low signal
            }
        }

        return field.toString();
    }
}