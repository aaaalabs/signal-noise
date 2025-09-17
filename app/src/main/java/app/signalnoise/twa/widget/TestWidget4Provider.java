package app.signalnoise.twa.widget;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.widget.RemoteViews;
import android.graphics.Color;
import app.signalnoise.twa.R;

/**
 * Test Widget 4: FrameLayout with programmatic color
 */
public class TestWidget4Provider extends AppWidgetProvider {

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_test4);
            // Try setting text programmatically
            views.setTextViewText(R.id.test4_text, "44");
            // Try setting color programmatically
            views.setTextColor(R.id.test4_text, Color.WHITE);
            appWidgetManager.updateAppWidget(appWidgetId, views);
        }
    }
}