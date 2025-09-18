package app.signalnoise.twa.widget;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.SharedPreferences;
import android.widget.RemoteViews;
import app.signalnoise.twa.R;

/**
 * E - Elegant KWGT-inspired gradient design
 * Native typography + XML gradients for crisp rendering
 */
public class E extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            SharedPreferences prefs = context.getSharedPreferences("signal_noise_widget_data", Context.MODE_PRIVATE);
            int ratio = prefs.getInt("current_ratio", 43);

            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_elegant);

            views.setTextViewText(R.id.ratio_main, String.valueOf(ratio));
            views.setTextViewText(R.id.ratio_percent, "%");
            views.setTextViewText(R.id.signal_label, "Signal Rate");

            // Dynamic background color based on ratio
            if (ratio > 70) {
                views.setInt(R.id.elegant_container, "setBackgroundResource", R.drawable.gradient_flow);
            } else if (ratio > 50) {
                views.setInt(R.id.elegant_container, "setBackgroundResource", R.drawable.gradient_focus);
            } else {
                views.setInt(R.id.elegant_container, "setBackgroundResource", R.drawable.gradient_drift);
            }

            appWidgetManager.updateAppWidget(appWidgetId, views);
        }
        RedisDataFetcher.fetchAndUpdateWidgetData(context, "thomas.seiger@gmail.com");
    }
}