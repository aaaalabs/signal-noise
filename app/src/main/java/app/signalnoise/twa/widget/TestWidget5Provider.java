package app.signalnoise.twa.widget;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.widget.RemoteViews;
import app.signalnoise.twa.R;

/**
 * Test Widget 5: Using Android system layout
 */
public class TestWidget5Provider extends AppWidgetProvider {

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            // Use Android's simple list item layout as a test
            RemoteViews views = new RemoteViews(context.getPackageName(),
                android.R.layout.simple_list_item_1);
            views.setTextViewText(android.R.id.text1, "T5");
            appWidgetManager.updateAppWidget(appWidgetId, views);
        }
    }
}