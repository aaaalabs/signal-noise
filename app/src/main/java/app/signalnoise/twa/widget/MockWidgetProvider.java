package app.signalnoise.twa.widget;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.widget.RemoteViews;
import android.util.Log;
import app.signalnoise.twa.R;

/**
 * Ultra-simple mock widget for testing
 * No SharedPreferences, no intents, just hardcoded text
 */
public class MockWidgetProvider extends AppWidgetProvider {

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        Log.d("MockWidget", "onUpdate called");

        for (int appWidgetId : appWidgetIds) {
            try {
                // Create the simplest possible RemoteViews
                RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_mock);

                // Just set hardcoded text - no dynamic data
                views.setTextViewText(R.id.mock_text, "42");

                // Update the widget
                appWidgetManager.updateAppWidget(appWidgetId, views);

                Log.d("MockWidget", "Widget " + appWidgetId + " updated successfully");
            } catch (Exception e) {
                Log.e("MockWidget", "Failed to update widget: " + e.getMessage());
                e.printStackTrace();
            }
        }
    }

    @Override
    public void onEnabled(Context context) {
        Log.d("MockWidget", "First widget added");
        super.onEnabled(context);
    }

    @Override
    public void onDisabled(Context context) {
        Log.d("MockWidget", "Last widget removed");
        super.onDisabled(context);
    }
}