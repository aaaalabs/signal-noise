package app.signalnoise.twa.widget;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.widget.RemoteViews;
import app.signalnoise.twa.R;

/**
 * T1 - Ultra minimal test for Android 15
 * No fontFamily, no dynamic calls, just basic TextView
 */
public class T1 extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_t1);
            views.setTextViewText(R.id.simple_text, "TEST");
            appWidgetManager.updateAppWidget(appWidgetId, views);
        }
    }
}