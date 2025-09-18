package app.signalnoise.twa.widget;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.widget.RemoteViews;
import app.signalnoise.twa.R;

/**
 * T2 - Test static background (no dynamic setInt calls)
 */
public class T2 extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_t2);
            views.setTextViewText(R.id.ratio_text, "75%");
            views.setTextViewText(R.id.signal_text, "3 signal");
            appWidgetManager.updateAppWidget(appWidgetId, views);
        }
    }
}