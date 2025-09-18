package app.signalnoise.twa.widget;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.app.PendingIntent;
import android.widget.RemoteViews;
import android.util.Log;
import app.signalnoise.twa.R;
import app.signalnoise.twa.LauncherActivity;

/**
 * Ultra-simple widget that will definitely work
 */
public class SimpleSignalWaveProvider extends AppWidgetProvider {
    private static final String TAG = "SimpleSignalWave";

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        Log.d(TAG, "onUpdate called for " + appWidgetIds.length + " widgets");

        for (int appWidgetId : appWidgetIds) {
            try {
                // Create the most basic RemoteViews possible
                RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_signal_wave_simple);

                // Just set simple text values
                views.setTextViewText(R.id.simple_ratio, "87%");
                views.setTextViewText(R.id.simple_status, "Signal/Noise");

                // Set click to open app
                Intent intent = new Intent(context, LauncherActivity.class);
                PendingIntent pendingIntent = PendingIntent.getActivity(
                    context, 0, intent,
                    PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
                );
                views.setOnClickPendingIntent(R.id.simple_ratio, pendingIntent);

                // Update the widget
                appWidgetManager.updateAppWidget(appWidgetId, views);
                Log.d(TAG, "Widget " + appWidgetId + " updated successfully");

            } catch (Exception e) {
                Log.e(TAG, "Failed to update widget " + appWidgetId, e);
            }
        }
    }
}