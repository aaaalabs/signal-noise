package app.signalnoise.twa.widget;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.widget.RemoteViews;
import android.util.Log;
import app.signalnoise.twa.R;
import app.signalnoise.twa.LauncherActivity;

public class SignalNoiseWidgetProvider extends AppWidgetProvider {

    private static final String PREFS_NAME = "SignalNoiseWidget";
    private static final String PREF_RATIO = "current_ratio";
    private static final String PREF_IS_SIGNAL = "is_signal";
    private static final int UPDATE_THRESHOLD = 5;

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        try {
            Log.d("SignalNoiseWidget", "onUpdate called with " + appWidgetIds.length + " widgets");

            // Get ratio with multiple fallbacks
            int ratio = 0;
            try {
                // Try to read from widget prefs first (simplest approach)
                SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
                ratio = prefs.getInt(PREF_RATIO, 0);
                Log.d("SignalNoiseWidget", "Got ratio from prefs: " + ratio);
            } catch (Exception e) {
                Log.e("SignalNoiseWidget", "Error reading preferences: " + e.getMessage());
                ratio = 0;
            }

            // Update each widget
            for (int appWidgetId : appWidgetIds) {
                try {
                    updateWidget(context, appWidgetManager, appWidgetId, ratio);
                } catch (Exception e) {
                    Log.e("SignalNoiseWidget", "Error updating widget " + appWidgetId + ": " + e.getMessage());
                    // Try to show error widget
                    showErrorWidget(context, appWidgetManager, appWidgetId);
                }
            }
        } catch (Exception e) {
            Log.e("SignalNoiseWidget", "Critical error in onUpdate: " + e.getMessage());
            // Last resort - try to update with fallback for all widgets
            for (int appWidgetId : appWidgetIds) {
                showErrorWidget(context, appWidgetManager, appWidgetId);
            }
        }
    }

    static void updateWidget(Context context, AppWidgetManager appWidgetManager,
                            int appWidgetId, int ratio) {
        try {
            Log.d("SignalNoiseWidget", "updateWidget called for widget " + appWidgetId + " with ratio " + ratio);

            // Create RemoteViews with defensive programming
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_1x1);

            // Update ratio text - show dash if no data
            String displayText = ratio > 0 ? String.valueOf(ratio) : "—";
            views.setTextViewText(R.id.widget_ratio, displayText);

            // Set click intent to open app (use root view for click)
            try {
                Intent intent = new Intent(context, LauncherActivity.class);
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
                PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent,
                    PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
                views.setOnClickPendingIntent(R.id.widget_container, pendingIntent);
            } catch (Exception e) {
                Log.e("SignalNoiseWidget", "Error setting click intent: " + e.getMessage());
            }

            // Update the widget
            appWidgetManager.updateAppWidget(appWidgetId, views);
            Log.d("SignalNoiseWidget", "Widget updated successfully");
        } catch (Exception e) {
            Log.e("SignalNoiseWidget", "Error in updateWidget: " + e.getMessage());
            // Fallback to error widget
            showErrorWidget(context, appWidgetManager, appWidgetId);
        }
    }

    private static void showErrorWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        try {
            Log.d("SignalNoiseWidget", "Showing error widget for " + appWidgetId);
            // Create a simple fallback view
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_1x1);
            views.setTextViewText(R.id.widget_ratio, "S/N");

            // Try to set click intent
            try {
                Intent intent = new Intent(context, LauncherActivity.class);
                PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent,
                    PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
                views.setOnClickPendingIntent(R.id.widget_container, pendingIntent);
            } catch (Exception e) {
                // Ignore click intent errors
            }

            appWidgetManager.updateAppWidget(appWidgetId, views);
        } catch (Exception e) {
            Log.e("SignalNoiseWidget", "Failed to show error widget: " + e.getMessage());
        }
    }

    public static void updateAllWidgets(Context context, int ratio, boolean isSignal) {
        try {
            Log.d("SignalNoiseWidget", "updateAllWidgets called with ratio: " + ratio);

            // Save new values
            SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
            prefs.edit()
                .putInt(PREF_RATIO, ratio)
                .putBoolean(PREF_IS_SIGNAL, isSignal)
                .apply();

            // Update all widget instances
            AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
            ComponentName widgetComponent = new ComponentName(context, SignalNoiseWidgetProvider.class);
            int[] appWidgetIds = appWidgetManager.getAppWidgetIds(widgetComponent);

            Log.d("SignalNoiseWidget", "Found " + appWidgetIds.length + " widgets to update");

            for (int appWidgetId : appWidgetIds) {
                updateWidget(context, appWidgetManager, appWidgetId, ratio);
            }
        } catch (Exception e) {
            Log.e("SignalNoiseWidget", "Error in updateAllWidgets: " + e.getMessage());
        }
    }

    @Override
    public void onEnabled(Context context) {
        // Widget added to home screen
        super.onEnabled(context);
    }

    @Override
    public void onDisabled(Context context) {
        // Last widget removed
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        prefs.edit().clear().apply();
        super.onDisabled(context);
    }
}