package app.signalnoise.twa;

import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.webkit.JavascriptInterface;
import android.widget.RemoteViews;
import android.util.Log;
import org.json.JSONObject;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

/**
 * Bridge between React app and Android widgets
 * Handles data synchronization for Signal/Noise ratio
 */
public class SignalNoiseDataBridge {
    private static final String TAG = "SignalNoiseDataBridge";
    private static final String PREFS_NAME = "signal_noise_widget_data";
    private static final String KEY_RATIO = "current_ratio";
    private static final String KEY_STATUS = "current_status";
    private static final String KEY_STREAK = "current_streak";
    private static final String KEY_TIMESTAMP = "last_update";
    private static final String KEY_PREMIUM = "is_premium";
    private static final String KEY_PATTERN_INSIGHT = "pattern_insight";

    private Context context;

    public SignalNoiseDataBridge(Context context) {
        this.context = context;
    }

    /**
     * JavaScript interface method to update widget data from React app
     * Called via: window.AndroidBridge.updateWidgetData(JSON.stringify(data))
     */
    @JavascriptInterface
    public void updateWidgetData(String jsonData) {
        try {
            Log.d(TAG, "Received data from React: " + jsonData);
            JSONObject data = new JSONObject(jsonData);

            // Extract data from React app
            int ratio = data.optInt("ratio", 50);
            String status = data.optString("status", "Unknown");
            int streak = data.optInt("streak", 0);
            boolean isPremium = data.optBoolean("premium", false);
            String patternInsight = data.optString("pattern", "");

            // Store in SharedPreferences
            SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
            SharedPreferences.Editor editor = prefs.edit();
            editor.putInt(KEY_RATIO, ratio);
            editor.putString(KEY_STATUS, status);
            editor.putInt(KEY_STREAK, streak);
            editor.putLong(KEY_TIMESTAMP, System.currentTimeMillis());
            editor.putBoolean(KEY_PREMIUM, isPremium);
            editor.putString(KEY_PATTERN_INSIGHT, patternInsight);
            editor.apply();

            // Trigger widget update
            updateAllWidgets();

            Log.d(TAG, "Widget data updated - Ratio: " + ratio + "%, Status: " + status);
        } catch (Exception e) {
            Log.e(TAG, "Error updating widget data", e);
        }
    }

    /**
     * Get current ratio from SharedPreferences
     */
    public static int getCurrentRatio(Context context) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        return prefs.getInt(KEY_RATIO, 80); // Default to 80% if no data
    }

    /**
     * Get current status from SharedPreferences
     */
    public static String getCurrentStatus(Context context) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        int ratio = prefs.getInt(KEY_RATIO, 80);

        // Determine status based on ratio
        if (ratio >= 80) {
            return "Signal";
        } else if (ratio >= 60) {
            return "Balanced";
        } else {
            return "Noise";
        }
    }

    /**
     * Get current streak from SharedPreferences
     */
    public static int getCurrentStreak(Context context) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        return prefs.getInt(KEY_STREAK, 0);
    }

    /**
     * Get last update time formatted
     */
    public static String getLastUpdateTime(Context context) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        long timestamp = prefs.getLong(KEY_TIMESTAMP, System.currentTimeMillis());
        SimpleDateFormat sdf = new SimpleDateFormat("HH:mm", Locale.getDefault());
        return sdf.format(new Date(timestamp));
    }

    /**
     * Check if user is premium
     */
    public static boolean isPremium(Context context) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        return prefs.getBoolean(KEY_PREMIUM, false);
    }

    /**
     * Get pattern insight for premium users
     */
    public static String getPatternInsight(Context context) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        return prefs.getString(KEY_PATTERN_INSIGHT, "");
    }

    /**
     * Update all widgets with current data
     */
    private void updateAllWidgets() {
        try {
            Intent intent = new Intent(context, app.signalnoise.twa.widget.SN2x1R.class);
            intent.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);

            // Get all widget IDs for SN2x1R
            AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
            ComponentName component = new ComponentName(context, app.signalnoise.twa.widget.SN2x1R.class);
            int[] widgetIds = appWidgetManager.getAppWidgetIds(component);

            intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, widgetIds);
            context.sendBroadcast(intent);

            // Also update other widget types
            updateWidgetType(app.signalnoise.twa.widget.SignalWaveWidgetProvider.class);
            updateWidgetType(app.signalnoise.twa.widget.MinimalTestWidget.class);
            updateWidgetType(app.signalnoise.twa.widget.UltraSimpleWidget.class);

            Log.d(TAG, "Broadcast sent to update all widgets");
        } catch (Exception e) {
            Log.e(TAG, "Error updating widgets", e);
        }
    }

    /**
     * Update specific widget type
     */
    private void updateWidgetType(Class<?> widgetClass) {
        try {
            Intent intent = new Intent(context, widgetClass);
            intent.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);

            AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
            ComponentName component = new ComponentName(context, widgetClass);
            int[] widgetIds = appWidgetManager.getAppWidgetIds(component);

            if (widgetIds.length > 0) {
                intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, widgetIds);
                context.sendBroadcast(intent);
            }
        } catch (Exception e) {
            Log.e(TAG, "Error updating widget type: " + widgetClass.getSimpleName(), e);
        }
    }
}