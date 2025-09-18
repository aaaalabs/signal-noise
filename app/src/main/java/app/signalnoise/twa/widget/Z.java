package app.signalnoise.twa.widget;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.SharedPreferences;
import android.widget.RemoteViews;
import app.signalnoise.twa.R;

/**
 * Z - Zen absolute perfection
 * Single number, perfect spacing, crisp native typography
 * What Jony Ive would put on his lock screen
 */
public class Z extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            SharedPreferences prefs = context.getSharedPreferences("signal_noise_widget_data", Context.MODE_PRIVATE);
            int ratio = prefs.getInt("current_ratio", 43);

            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_zen);

            views.setTextViewText(R.id.zen_number, String.valueOf(ratio));

            // Color based on state - Apple system colors
            if (ratio > 80) {
                views.setTextColor(R.id.zen_number, android.graphics.Color.parseColor("#34C759")); // Apple green
            } else if (ratio > 60) {
                views.setTextColor(R.id.zen_number, android.graphics.Color.parseColor("#FF9500")); // Apple orange
            } else {
                views.setTextColor(R.id.zen_number, android.graphics.Color.parseColor("#FF3B30")); // Apple red
            }

            appWidgetManager.updateAppWidget(appWidgetId, views);
        }
        RedisDataFetcher.fetchAndUpdateWidgetData(context, "thomas.seiger@gmail.com");
    }
}