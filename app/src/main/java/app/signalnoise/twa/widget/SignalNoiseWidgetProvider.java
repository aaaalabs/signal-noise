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
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        int ratio = prefs.getInt(PREF_RATIO, 0);
        boolean isSignal = prefs.getBoolean(PREF_IS_SIGNAL, true);

        for (int appWidgetId : appWidgetIds) {
            updateWidget(context, appWidgetManager, appWidgetId, ratio, isSignal);
        }
    }

    static void updateWidget(Context context, AppWidgetManager appWidgetManager,
                            int appWidgetId, int ratio, boolean isSignal) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_signal_noise);

        // Update ratio text - pure white, no percentage symbol
        views.setTextViewText(R.id.widget_ratio, String.valueOf(ratio));

        // Update status text with appropriate color
        String status = isSignal ? "signal" : "noise";
        views.setTextViewText(R.id.widget_status, status);
        views.setTextColor(R.id.widget_status,
            context.getResources().getColor(isSignal ? R.color.signalGreen : R.color.noiseGray));

        // Set click intent to open app
        Intent intent = new Intent(context, LauncherActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        views.setOnClickPendingIntent(R.id.widget_container, pendingIntent);

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