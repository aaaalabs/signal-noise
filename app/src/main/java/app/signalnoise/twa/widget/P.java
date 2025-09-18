package app.signalnoise.twa.widget;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.SharedPreferences;
import android.widget.RemoteViews;
import app.signalnoise.twa.R;

/**
 * P - Perfect task preview with ratio
 * Shows last few tasks that led to current ratio
 * Meaningful context + beautiful typography
 */
public class P extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            SharedPreferences prefs = context.getSharedPreferences("signal_noise_widget_data", Context.MODE_PRIVATE);
            int ratio = prefs.getInt("current_ratio", 43);
            int signal = prefs.getInt("signal_count", 2);
            int noise = prefs.getInt("noise_count", 3);

            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_perfect);

            views.setTextViewText(R.id.perfect_ratio, ratio + "%");
            views.setTextViewText(R.id.perfect_signal, "⚡ " + signal + " signal");
            views.setTextViewText(R.id.perfect_noise, "💫 " + noise + " noise");

            // Recent trend indicator
            String trend = signal > noise ? "↗ trending up" : "↘ needs focus";
            views.setTextViewText(R.id.perfect_trend, trend);

            appWidgetManager.updateAppWidget(appWidgetId, views);
        }
        RedisDataFetcher.fetchAndUpdateWidgetData(context, "thomas.seiger@gmail.com");
    }
}