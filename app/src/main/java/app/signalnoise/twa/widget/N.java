package app.signalnoise.twa.widget;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.SharedPreferences;
import android.widget.RemoteViews;
import app.signalnoise.twa.R;

/**
 * N - Nothing-grade minimalism
 * Shows literally nothing unless ratio > 60%
 * Pure negative space mastery
 */
public class N extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            SharedPreferences prefs = context.getSharedPreferences("signal_noise_widget_data", Context.MODE_PRIVATE);
            int ratio = prefs.getInt("current_ratio", 43);

            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_nothing);

            if (ratio > 60) {
                views.setTextViewText(R.id.nothing_text, String.valueOf(ratio));
                views.setViewVisibility(R.id.nothing_text, android.view.View.VISIBLE);
            } else {
                views.setViewVisibility(R.id.nothing_text, android.view.View.INVISIBLE);
            }

            appWidgetManager.updateAppWidget(appWidgetId, views);
        }
        RedisDataFetcher.fetchAndUpdateWidgetData(context, "thomas.seiger@gmail.com");
    }
}