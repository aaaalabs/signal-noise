package app.signalnoise.twa.widget;

import android.content.Context;
import android.content.Intent;
import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.util.Log;

/**
 * Helper to update all widget types
 */
public class WidgetUpdateHelper {
    private static final String TAG = "WidgetUpdateHelper";

    public static void updateAllWidgets(Context context) {
        try {
            // Update all widget types
            updateWidgetType(context, SN2x1R.class); // Winner - kept
            updateWidgetType(context, SN4x1R.class);
            updateWidgetType(context, SN1x1F.class);
            updateWidgetType(context, SN2x1P.class);
            updateWidgetType(context, SN3x1R.class);
            updateWidgetType(context, SN2x1C.class);

            // Update DebugWidget
            updateWidgetType(context, DebugWidget.class);

            // Update enhanced SignalNoiseWidget
            updateWidgetType(context, SignalNoiseWidget.class);

            Log.d(TAG, "All widgets updated");

        } catch (Exception e) {
            Log.e(TAG, "Error updating widgets", e);
        }
    }

    private static void updateWidgetType(Context context, Class<?> widgetClass) {
        try {
            Intent intent = new Intent(context, widgetClass);
            intent.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);

            ComponentName component = new ComponentName(context, widgetClass);
            AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
            int[] appWidgetIds = appWidgetManager.getAppWidgetIds(component);

            if (appWidgetIds != null && appWidgetIds.length > 0) {
                intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, appWidgetIds);
                context.sendBroadcast(intent);
                Log.d(TAG, "Updated " + appWidgetIds.length + " " + widgetClass.getSimpleName() + " widgets");
            }
        } catch (Exception e) {
            Log.e(TAG, "Error updating widget type: " + widgetClass.getSimpleName(), e);
        }
    }
}