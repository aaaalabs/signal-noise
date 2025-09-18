package app.signalnoise.twa.widget;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.app.PendingIntent;
import android.widget.RemoteViews;
import android.util.Log;
import app.signalnoise.twa.R;
import app.signalnoise.twa.LauncherActivity;

/**
 * Enhanced Signal/Noise Widget with visual design
 * Shows ratio, signal/noise counts, and status
 */
public class SignalNoiseWidget extends AppWidgetProvider {
    private static final String TAG = "SignalNoiseWidget";
    private static final String PREFS_NAME = "signal_noise_widget_data";

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        // Start the data polling service
        Intent serviceIntent = new Intent(context, DataPollingService.class);
        context.startService(serviceIntent);

        for (int appWidgetId : appWidgetIds) {
            updateWidget(context, appWidgetManager, appWidgetId);
        }
    }

    private void updateWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        try {
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_signal_noise_2x1);

            // Get data from SharedPreferences
            SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);

            int ratio = prefs.getInt("current_ratio", -1);
            int signalCount = prefs.getInt("signal_count", 0);
            int noiseCount = prefs.getInt("noise_count", 0);
            int streak = prefs.getInt("streak", 0);
            String dataSource = prefs.getString("data_source", "NONE");

            // Update ratio display
            if (ratio == -1) {
                views.setTextViewText(R.id.widget_ratio, "---%");
                views.setTextColor(R.id.widget_ratio, 0xFF888888);
                views.setTextViewText(R.id.widget_status, "NO DATA");
            } else {
                views.setTextViewText(R.id.widget_ratio, ratio + "%");

                // Set color and status based on ratio
                int color;
                String status;
                if (ratio >= 80) {
                    color = 0xFF00FF88; // Green
                    status = "SIGNAL";
                } else if (ratio >= 60) {
                    color = 0xFFFFAA00; // Orange
                    status = "BALANCED";
                } else {
                    color = 0xFFFF4444; // Red
                    status = "NOISE";
                }

                views.setTextColor(R.id.widget_ratio, color);
                views.setTextViewText(R.id.widget_status, status);
            }

            // Update counts
            views.setTextViewText(R.id.widget_signal_count, "S: " + signalCount);
            views.setTextViewText(R.id.widget_noise_count, "N: " + noiseCount);

            // Add streak indicator if > 0
            if (streak > 0) {
                views.setTextViewText(R.id.widget_title, "S/N 🔥" + streak);
            } else {
                views.setTextViewText(R.id.widget_title, "S/N");
            }

            // Set up click intent to launch the app
            Intent intent = new Intent(context, LauncherActivity.class);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
            PendingIntent pendingIntent = PendingIntent.getActivity(
                context, 0, intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );
            views.setOnClickPendingIntent(R.id.widget_container, pendingIntent);

            // Update the widget
            appWidgetManager.updateAppWidget(appWidgetId, views);

            Log.d(TAG, String.format("Widget updated - Ratio: %d%%, Signal: %d, Noise: %d, Streak: %d",
                ratio, signalCount, noiseCount, streak));

        } catch (Exception e) {
            Log.e(TAG, "Error updating widget", e);
        }
    }
}