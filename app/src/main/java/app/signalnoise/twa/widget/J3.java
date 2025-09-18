package app.signalnoise.twa.widget;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.SharedPreferences;
import android.widget.RemoteViews;
import app.signalnoise.twa.R;

/**
 * J3 - Negative Space Mastery
 * JONY IVE MASTERPIECE: Breathing space around typography
 * Golden ratio spacing that "breathes" based on productivity
 * High signal = more space (calm), Low signal = compressed (stress)
 * "Simplicity is the ultimate sophistication"
 */
public class J3 extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        // CRITICAL: Force immediate Redis fetch for first widget
        RedisDataFetcher.fetchAndUpdateWidgetData(context, "thomas.seiger@gmail.com");

        for (int appWidgetId : appWidgetIds) {
            SharedPreferences prefs = context.getSharedPreferences("signal_noise_widget_data", Context.MODE_PRIVATE);
            int ratio = prefs.getInt("current_ratio", 43);

            // Choose layout based on "breathing space" needed
            RemoteViews views;
            if (ratio > 70) {
                // Flow state - maximum breathing space
                views = new RemoteViews(context.getPackageName(), R.layout.widget_breathing_calm);
            } else if (ratio > 50) {
                // Focus state - moderate space
                views = new RemoteViews(context.getPackageName(), R.layout.widget_breathing_focus);
            } else {
                // Stress state - compressed space
                views = new RemoteViews(context.getPackageName(), R.layout.widget_breathing_stress);
            }

            views.setTextViewText(R.id.breathing_number, String.valueOf(ratio));

            // Subtle color temperature
            if (ratio > 70) {
                views.setTextColor(R.id.breathing_number, android.graphics.Color.parseColor("#E8F5E8")); // Warm white
            } else if (ratio > 50) {
                views.setTextColor(R.id.breathing_number, android.graphics.Color.parseColor("#FFFFFF")); // Pure white
            } else {
                views.setTextColor(R.id.breathing_number, android.graphics.Color.parseColor("#F5E8E8")); // Cool white
            }

            appWidgetManager.updateAppWidget(appWidgetId, views);
        }
    }
}