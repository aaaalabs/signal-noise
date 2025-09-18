package app.signalnoise.twa.widget;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.widget.RemoteViews;
import app.signalnoise.twa.R;

/**
 * T1 - Elegant 1x1 logo widget (ID spacer)
 * Shows Signal/Noise logo as minimal brand presence
 */
public class T1 extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_t1);
            // Logo widget needs no text updates - just shows icon
            appWidgetManager.updateAppWidget(appWidgetId, views);
        }
    }
}