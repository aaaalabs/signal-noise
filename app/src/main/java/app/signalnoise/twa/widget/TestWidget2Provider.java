package app.signalnoise.twa.widget;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.widget.RemoteViews;
import app.signalnoise.twa.R;

/**
 * Test Widget 2: LinearLayout container with TextView
 */
public class TestWidget2Provider extends AppWidgetProvider {

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_test2);
            views.setTextViewText(R.id.test2_text, "T2");
            appWidgetManager.updateAppWidget(appWidgetId, views);
        }
    }
}