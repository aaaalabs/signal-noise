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
    private static final int UPDATE_THRESHOLD = 5;

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        // Try to read from the app's main SharedPreferences first
        SharedPreferences appPrefs = context.getSharedPreferences(
            context.getPackageName() + "_preferences", Context.MODE_PRIVATE);
        String ratioStr = appPrefs.getString("widget_ratio", null);

        // Fallback to widget-specific prefs
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        int ratio = 0;
        if (ratioStr != null) {
            try {
                ratio = Integer.parseInt(ratioStr);
                // Save to widget prefs for next time
                prefs.edit().putInt(PREF_RATIO, ratio).apply();
            } catch (NumberFormatException e) {
                ratio = prefs.getInt(PREF_RATIO, 0);
            }
        } else {
            ratio = prefs.getInt(PREF_RATIO, 0);
        }

        boolean isSignal = ratio >= 80;

        for (int appWidgetId : appWidgetIds) {
            updateWidget(context, appWidgetManager, appWidgetId, ratio, isSignal);
        }
    }

    static void updateWidget(Context context, AppWidgetManager appWidgetManager,
                            int appWidgetId, int ratio, boolean isSignal) {
        // For simplicity, always use 1x1 layout for new widgets
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_1x1);

        // Update ratio text - show dash if no data
        String displayText = ratio > 0 ? String.valueOf(ratio) : "—";
        views.setTextViewText(R.id.widget_ratio, displayText);

        // Set click intent to open app
        Intent intent = new Intent(context, LauncherActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        views.setOnClickPendingIntent(R.id.widget_ratio, pendingIntent);

        appWidgetManager.updateAppWidget(appWidgetId, views);
    }

    public static void updateAllWidgets(Context context, int ratio, boolean isSignal) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        int oldRatio = prefs.getInt(PREF_RATIO, 0);

        // Only update if change is significant (5% threshold)
        if (Math.abs(ratio - oldRatio) < UPDATE_THRESHOLD && ratio != 0) {
            return;
        }

        // Save new values
        prefs.edit()
            .putInt(PREF_RATIO, ratio)
            .putBoolean(PREF_IS_SIGNAL, isSignal)
            .apply();

        // Update all widget instances
        AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
        ComponentName widgetComponent = new ComponentName(context, SignalNoiseWidgetProvider.class);
        int[] appWidgetIds = appWidgetManager.getAppWidgetIds(widgetComponent);

        for (int appWidgetId : appWidgetIds) {
            updateWidget(context, appWidgetManager, appWidgetId, ratio, isSignal);
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