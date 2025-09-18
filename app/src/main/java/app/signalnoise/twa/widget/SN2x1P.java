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
 * SN2x1P - 2x1 Progress Bar Widget
 * EXPERIMENT: Visual progress bar representation (█░░░░░░░░░)
 */
public class SN2x1P extends AppWidgetProvider {
    private static final String TAG = "SN2x1P";
    private static final String PREFS_NAME = "signal_noise_widget_data";
    private static final String ACTION_AUTO_UPDATE = "app.signalnoise.twa.AUTO_UPDATE_SN2x1P";

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateWidget(context, appWidgetManager, appWidgetId);
            setupAutoRefresh(context, appWidgetId);
        }
        RedisDataFetcher.fetchAndUpdateWidgetData(context, "thomas.seiger@gmail.com");
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        super.onReceive(context, intent);

        if (ACTION_AUTO_UPDATE.equals(intent.getAction())) {
            RedisDataFetcher.fetchAndUpdateWidgetData(context, "thomas.seiger@gmail.com");

            AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
            int[] appWidgetIds = appWidgetManager.getAppWidgetIds(
                new android.content.ComponentName(context, SN2x1P.class));

            // Get the specific widget ID that triggered this alarm
            int triggeringWidgetId = intent.getIntExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, -1);

            for (int appWidgetId : appWidgetIds) {
                updateWidget(context, appWidgetManager, appWidgetId);
            }

            // Only the triggering widget schedules the next alarm to avoid conflicts
            if (triggeringWidgetId != -1) {
                setupAutoRefresh(context, triggeringWidgetId);
            } else {
                // Fallback: schedule for the first widget if no specific ID
                if (appWidgetIds.length > 0) {
                    setupAutoRefresh(context, appWidgetIds[0]);
                }
            }
        }
    }

    private void setupAutoRefresh(Context context, int appWidgetId) {
        try {
            AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
            Intent intent = new Intent(context, SN2x1P.class);
            intent.setAction(ACTION_AUTO_UPDATE);
            PendingIntent pendingIntent = PendingIntent.getBroadcast(
                context, appWidgetId + 2000, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);

            long triggerTime = SystemClock.elapsedRealtime() + 600000; // 10 minutes (CONSERVATIVE)
            alarmManager.setExact(AlarmManager.ELAPSED_REALTIME, triggerTime, pendingIntent);
        } catch (Exception e) {
            Log.e(TAG, "Failed to setup auto-refresh", e);
        }
    }

    private void updateWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        try {
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_sn2x1p);

            SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
            int ratio = prefs.getInt("current_ratio", -1);

            String displayText = ratio >= 0 ? ratio + "%" : "⟳";
            views.setTextViewText(R.id.widget_ratio, displayText);

            // Create progress bar visualization
            String progressBar = createProgressBar(ratio);
            views.setTextViewText(R.id.widget_progress, progressBar);

            Intent intent = new Intent(context, LauncherActivity.class);
            PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
            views.setOnClickPendingIntent(R.id.widget_container, pendingIntent);

            appWidgetManager.updateAppWidget(appWidgetId, views);

        } catch (Exception e) {
            Log.e(TAG, "Error updating progress widget", e);
        }
    }

    private String createProgressBar(int ratio) {
        if (ratio < 0) return "░░░░░░░░░░";

        int filled = ratio / 10; // 0-10 blocks
        StringBuilder progress = new StringBuilder();

        for (int i = 0; i < 10; i++) {
            if (i < filled) {
                progress.append("█");
            } else {
                progress.append("░");
            }
        }

        return progress.toString();
    }
}