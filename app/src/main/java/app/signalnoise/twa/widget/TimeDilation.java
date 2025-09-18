package app.signalnoise.twa.widget;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.SharedPreferences;
import android.widget.RemoteViews;
import app.signalnoise.twa.R;
import java.util.Calendar;

/**
 * Time Dilation - Interstellar-inspired time display
 * High signal = time slows (focus gravity well)
 * Low signal = time speeds (scattered attention)
 */
public class TimeDilation extends AppWidgetProvider {
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

            // Current time
            Calendar cal = Calendar.getInstance();
            String time = String.format("%02d:%02d", cal.get(Calendar.HOUR_OF_DAY), cal.get(Calendar.MINUTE));

            // Time dilation factor
            String dilation = calculateDilation(ratio);

            views.setTextViewText(R.id.widget_ratio, time);
            views.setTextViewText(R.id.widget_progress, ratio + "% " + dilation);

            appWidgetManager.updateAppWidget(appWidgetId, views);
        } catch (Exception e) {
            // Silent fail
        }
    }

    private String calculateDilation(int ratio) {
        if (ratio > 80) return "⏳0.5x"; // Time slows with deep focus
        if (ratio > 60) return "⏱️0.8x"; // Slight time dilation
        if (ratio > 40) return "⏰1.0x"; // Normal time flow
        return "⏰1.5x"; // Time speeds with scattered attention
    }
}
