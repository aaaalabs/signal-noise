package app.signalnoise.twa.widget;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.SystemClock;
import android.util.Log;
import android.widget.RemoteViews;
import app.signalnoise.twa.R;
import app.signalnoise.twa.LauncherActivity;

/**
 * SN2x1R - 2x1 Redis Live Data (WINNER from previous batch)
 * Now with AUTOMATIC REFRESH every 30 seconds!
 */
public class SN2x1R extends AppWidgetProvider {
    private static final String TAG = "SN2x1R";
    private static final String PREFS_NAME = "signal_noise_widget_data";
    private static final String ACTION_AUTO_UPDATE = "app.signalnoise.twa.AUTO_UPDATE_SN2x1R";

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateWidget(context, appWidgetManager, appWidgetId);

            // Set up auto-refresh alarm
            setupAutoRefresh(context, appWidgetId);
        }

        // Also fetch fresh data from Redis
        RedisDataFetcher.fetchAndUpdateWidgetData(context, "thomas.seiger@gmail.com");
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        super.onReceive(context, intent);

        if (ACTION_AUTO_UPDATE.equals(intent.getAction())) {
            Log.d(TAG, "Auto-refresh triggered!");

            // Fetch fresh data from Redis
            RedisDataFetcher.fetchAndUpdateWidgetData(context, "thomas.seiger@gmail.com");

            // Update all widgets
            AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
            int[] appWidgetIds = appWidgetManager.getAppWidgetIds(
                new android.content.ComponentName(context, SN2x1R.class));

            // Get the specific widget ID that triggered this alarm
            int triggeringWidgetId = intent.getIntExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, -1);

            for (int appWidgetId : appWidgetIds) {
                updateWidget(context, appWidgetManager, appWidgetId);
            }

            // Only the triggering widget schedules the next alarm to avoid conflicts
            if (triggeringWidgetId != -1) {
                setupAutoRefresh(context, triggeringWidgetId);
                Log.d(TAG, "Next refresh scheduled by widget " + triggeringWidgetId);
            } else {
                // Fallback: schedule for the first widget if no specific ID
                if (appWidgetIds.length > 0) {
                    setupAutoRefresh(context, appWidgetIds[0]);
                    Log.d(TAG, "Fallback: Next refresh scheduled by widget " + appWidgetIds[0]);
                }
            }
        }
    }

    private void setupAutoRefresh(Context context, int appWidgetId) {
        try {
            AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);

            Intent intent = new Intent(context, SN2x1R.class);
            intent.setAction(ACTION_AUTO_UPDATE);
            intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId);

            PendingIntent pendingIntent = PendingIntent.getBroadcast(
                context,
                appWidgetId,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );

            // Schedule next update in 5 minutes (BATTERY SAFE!)
            long triggerTime = SystemClock.elapsedRealtime() + 300000;
            alarmManager.setExact(AlarmManager.ELAPSED_REALTIME, triggerTime, pendingIntent);

            Log.d(TAG, "Auto-refresh scheduled for widget " + appWidgetId);

        } catch (Exception e) {
            Log.e(TAG, "Failed to setup auto-refresh", e);
        }
    }

    @Override
    public void onDeleted(Context context, int[] appWidgetIds) {
        // Cancel alarms for deleted widgets
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);

        for (int appWidgetId : appWidgetIds) {
            Intent intent = new Intent(context, SN2x1R.class);
            intent.setAction(ACTION_AUTO_UPDATE);
            PendingIntent pendingIntent = PendingIntent.getBroadcast(
                context, appWidgetId, intent, PendingIntent.FLAG_NO_CREATE | PendingIntent.FLAG_IMMUTABLE);

            if (pendingIntent != null) {
                alarmManager.cancel(pendingIntent);
                pendingIntent.cancel();
            }
        }
    }

    private void updateWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        try {
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_sn2x1r);

            // Get data from SharedPreferences (updated by RedisDataFetcher)
            SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
            int ratio = prefs.getInt("current_ratio", -1);
            String dataSource = prefs.getString("data_source", "UNKNOWN");
            long lastUpdate = prefs.getLong("last_update", 0);

            // Display ratio or loading state
            String displayText;
            if (ratio >= 0) {
                displayText = ratio + "%";
            } else {
                displayText = "⟳";  // Loading symbol
            }

            views.setTextViewText(R.id.widget_ratio, displayText);
            views.setTextViewText(R.id.widget_label, "SN2x1R • " + dataSource);

            // Set click to open app
            Intent intent = new Intent(context, LauncherActivity.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
            PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
            views.setOnClickPendingIntent(R.id.widget_container, pendingIntent);

            appWidgetManager.updateAppWidget(appWidgetId, views);

            Log.d(TAG, "Widget updated - Ratio: " + ratio + "%, Source: " + dataSource);

        } catch (Exception e) {
            Log.e(TAG, "Error updating widget", e);

            // Fallback display
            RemoteViews fallback = new RemoteViews(context.getPackageName(), R.layout.widget_sn2x1r);
            fallback.setTextViewText(R.id.widget_ratio, "ERR");
            fallback.setTextViewText(R.id.widget_label, "SN2x1R");
            appWidgetManager.updateAppWidget(appWidgetId, fallback);
        }
    }
}