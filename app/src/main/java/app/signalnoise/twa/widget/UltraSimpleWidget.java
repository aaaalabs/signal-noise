package app.signalnoise.twa.widget;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.widget.RemoteViews;

public class UltraSimpleWidget extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            // Use Android's built-in simple layout - can't fail
            RemoteViews views = new RemoteViews(context.getPackageName(),
                android.R.layout.simple_list_item_1);

            // Use Android's built-in text view ID
            views.setTextViewText(android.R.id.text1, "WIDGET WORKS!");

            appWidgetManager.updateAppWidget(appWidgetId, views);
        }
    }
}