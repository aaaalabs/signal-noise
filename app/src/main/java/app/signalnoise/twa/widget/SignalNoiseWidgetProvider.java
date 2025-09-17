package app.signalnoise.twa.widget;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.widget.RemoteViews;
import app.signalnoise.twa.R;
import app.signalnoise.twa.LauncherActivity;

public class SignalNoiseWidgetProvider extends AppWidgetProvider {

    private static final String PREFS_NAME = "SignalNoiseWidget";
    private static final String PREF_RATIO = "current_ratio";
    private static final String PREF_IS_SIGNAL = "is_signal";

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateWidget(context, appWidgetManager, appWidgetId);
        }
    }

    static void updateWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        // Get ratio from preferences (default 80)
        int ratio = 80;
        try {
            SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
            ratio = prefs.getInt(PREF_RATIO, 80);
        } catch (Exception e) {
            // Use default if error
        }

        updateWidget(context, appWidgetManager, appWidgetId, ratio);
    }

    static void updateWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId, int ratio) {
        try {
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_1x1);

            // Set text - show dash if no data
            String displayText = ratio > 0 ? String.valueOf(ratio) : "—";
            views.setTextViewText(R.id.widget_ratio, displayText);

            // Set click to open app
            try {
                Intent intent = new Intent(context, LauncherActivity.class);
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
                PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent,
                    PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
                views.setOnClickPendingIntent(R.id.widget_ratio, pendingIntent);
            } catch (Exception e) {
                // Widget works without click
            }

            appWidgetManager.updateAppWidget(appWidgetId, views);
        } catch (Exception e) {
            // Fallback to simple text
            try {
                RemoteViews fallback = new RemoteViews(context.getPackageName(), R.layout.widget_1x1);
                fallback.setTextViewText(R.id.widget_ratio, "S/N");
                appWidgetManager.updateAppWidget(appWidgetId, fallback);
            } catch (Exception ignored) {
                // Give up gracefully
            }
        }
    }

    public static void updateAllWidgets(Context context, int ratio, boolean isSignal) {
        try {
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

            for (int appWidgetId : appWidgetIds) {
                updateWidget(context, appWidgetManager, appWidgetId, ratio);
            }
        } catch (Exception e) {
            // Silent fail - widget will show last known value
        }
    }
}