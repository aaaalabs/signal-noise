package app.signalnoise.twa.widget;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.SharedPreferences;
import android.widget.RemoteViews;
import app.signalnoise.twa.R;

/**
 * Star Field - Productivity constellation
 * Signal tasks = bright stars: ⭐⭐⭐
 * Noise tasks = dim stars: ✦✦
 */
public class StarField extends AppWidgetProvider {
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
            int signalCount = prefs.getInt("signal_count", 3);
            int noiseCount = prefs.getInt("noise_count", 1);

            String constellation = generateConstellation(signalCount, noiseCount);

            views.setTextViewText(R.id.widget_ratio, ratio + "%");
            views.setTextViewText(R.id.widget_progress, constellation);

            appWidgetManager.updateAppWidget(appWidgetId, views);
        } catch (Exception e) {
            // Silent fail
        }
    }

    private String generateConstellation(int signal, int noise) {
        StringBuilder stars = new StringBuilder();
        
        // Signal stars (bright)
        for (int i = 0; i < Math.min(signal, 5); i++) {
            stars.append("⭐");
        }
        
        stars.append(" ");
        
        // Noise stars (dim)
        for (int i = 0; i < Math.min(noise, 3); i++) {
            stars.append("✦");
        }

        return stars.toString();
    }
}
