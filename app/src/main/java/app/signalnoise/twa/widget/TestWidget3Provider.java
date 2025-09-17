package app.signalnoise.twa.widget;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.widget.RemoteViews;
import app.signalnoise.twa.R;

/**
 * Test Widget 3: RelativeLayout with centered text
 */
public class TestWidget3Provider extends AppWidgetProvider {

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            try {
                RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_test3);
                views.setTextViewText(R.id.test3_text, "T3");
                appWidgetManager.updateAppWidget(appWidgetId, views);
            } catch (Exception e) {
                // Silent fail
            }
        }
    }
}