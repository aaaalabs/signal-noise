package app.signalnoise.twa.widget;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.SharedPreferences;
import android.widget.RemoteViews;
import app.signalnoise.twa.R;

/**
 * J2 - Emotional Color Immersion
 * JONY IVE MASTERPIECE: Entire widget becomes the productivity color
 * Background transforms based on emotional state
 * Typography floats in emotional color space
 */
public class J2 extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        // CRITICAL: Force immediate Redis fetch for first widget
        RedisDataFetcher.fetchAndUpdateWidgetData(context, "thomas.seiger@gmail.com");

        for (int appWidgetId : appWidgetIds) {
            SharedPreferences prefs = context.getSharedPreferences("signal_noise_widget_data", Context.MODE_PRIVATE);
            int ratio = prefs.getInt("current_ratio", 43);

            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_emotional);

            views.setTextViewText(R.id.emotional_ratio, ratio + "%");

            // Entire widget becomes the emotional color
            if (ratio > 80) {
                // Flow state - calm green immersion
                views.setInt(R.id.emotional_container, "setBackgroundColor",
                    android.graphics.Color.parseColor("#1a34C759"));
                views.setTextColor(R.id.emotional_ratio, android.graphics.Color.parseColor("#FFFFFF"));
            } else if (ratio > 60) {
                // Focus state - warm orange immersion
                views.setInt(R.id.emotional_container, "setBackgroundColor",
                    android.graphics.Color.parseColor("#1aFF9500"));
                views.setTextColor(R.id.emotional_ratio, android.graphics.Color.parseColor("#FFFFFF"));
            } else if (ratio > 40) {
                // Neutral state - soft gray
                views.setInt(R.id.emotional_container, "setBackgroundColor",
                    android.graphics.Color.parseColor("#1a666666"));
                views.setTextColor(R.id.emotional_ratio, android.graphics.Color.parseColor("#FFFFFF"));
            } else {
                // Chaos state - gentle red immersion
                views.setInt(R.id.emotional_container, "setBackgroundColor",
                    android.graphics.Color.parseColor("#1aFF3B30"));
                views.setTextColor(R.id.emotional_ratio, android.graphics.Color.parseColor("#FFFFFF"));
            }

            appWidgetManager.updateAppWidget(appWidgetId, views);
        }
    }
}