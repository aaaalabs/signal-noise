package app.signalnoise.twa.widget;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.SharedPreferences;
import android.widget.RemoteViews;
import app.signalnoise.twa.R;

/**
 * Nothing Minimal - Ultimate minimalism inspired by Nothing Phone
 * Shows nothing unless meaningful (ratio > 50)
 * "Less is exponentially more"
 */
public class NothingMinimal extends AppWidgetProvider {
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

            // Nothing OS philosophy: only show if meaningful
            if (ratio > 50) {
                views.setTextViewText(R.id.widget_ratio, String.valueOf(ratio));
                views.setTextViewText(R.id.widget_progress, ratio > 80 ? "·" : ""); // Tiny accent if excellent
            } else {
                // Show literally nothing - true to Nothing philosophy
                views.setTextViewText(R.id.widget_ratio, "");
                views.setTextViewText(R.id.widget_progress, "");
            }

            appWidgetManager.updateAppWidget(appWidgetId, views);
        } catch (Exception e) {
            // Silent fail
        }
    }
}