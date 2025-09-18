package app.signalnoise.twa;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.widget.RemoteViews;

public class BasicWidget extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_signal_wave_simple);
            views.setTextViewText(R.id.simple_ratio, "99%");
            views.setTextViewText(R.id.simple_status, "WORKS!");
            appWidgetManager.updateAppWidget(appWidgetId, views);
        }
    }
}