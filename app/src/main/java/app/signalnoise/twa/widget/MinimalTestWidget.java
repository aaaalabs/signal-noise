package app.signalnoise.twa.widget;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.widget.RemoteViews;
import android.util.Log;
import app.signalnoise.twa.R;

public class MinimalTestWidget extends AppWidgetProvider {
    private static final String TAG = "MinimalTestWidget";

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        Log.d(TAG, "===== onUpdate called =====");
        Log.d(TAG, "Number of widget IDs: " + appWidgetIds.length);

        try {
            for (int appWidgetId : appWidgetIds) {
                Log.d(TAG, "Updating widget ID: " + appWidgetId);

                // Log package name
                String packageName = context.getPackageName();
                Log.d(TAG, "Package name: " + packageName);

                // Try to create RemoteViews
                Log.d(TAG, "Creating RemoteViews...");
                RemoteViews views = new RemoteViews(packageName, R.layout.widget_minimal_test);
                Log.d(TAG, "RemoteViews created successfully");

                // Set basic text - no complex operations
                Log.d(TAG, "Setting text view text...");
                views.setTextViewText(R.id.minimal_text, "TEST OK");
                Log.d(TAG, "Text set successfully");

                // Update widget
                Log.d(TAG, "Calling updateAppWidget...");
                appWidgetManager.updateAppWidget(appWidgetId, views);
                Log.d(TAG, "Widget updated successfully for ID: " + appWidgetId);
            }
            Log.d(TAG, "===== onUpdate completed successfully =====");
        } catch (Exception e) {
            Log.e(TAG, "ERROR in onUpdate: " + e.getMessage(), e);
            e.printStackTrace();
        }
    }

    @Override
    public void onEnabled(Context context) {
        super.onEnabled(context);
        Log.d(TAG, "===== onEnabled called - First widget added =====");
    }

    @Override
    public void onDisabled(Context context) {
        super.onDisabled(context);
        Log.d(TAG, "===== onDisabled called - Last widget removed =====");
    }

    @Override
    public void onDeleted(Context context, int[] appWidgetIds) {
        super.onDeleted(context, appWidgetIds);
        Log.d(TAG, "===== onDeleted called - Widget removed =====");
    }
}