package app.signalnoise.twa.widget.signalwave;

import android.content.Context;
import android.content.SharedPreferences;
import android.content.Intent;
import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.webkit.JavascriptInterface;
import android.util.Log;
import org.json.JSONObject;
import org.json.JSONArray;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * Signal Wave Data Bridge
 *
 * Manages communication between React app and Signal Wave widget
 * Implements real-time updates with battery efficiency in mind
 *
 * Design Principle: Transparent, efficient data flow
 */
public class SignalWaveDataBridge {

    private static final String TAG = "SignalWaveDataBridge";
    private static final String PREFS_NAME = "SignalNoiseWidget";

    private Context context;
    private SharedPreferences prefs;
    private ScheduledExecutorService updateScheduler;
    private WidgetUpdateThrottler throttler;

    public SignalWaveDataBridge(Context context) {
        this.context = context;
        this.prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        this.throttler = new WidgetUpdateThrottler();
        initializeUpdateScheduler();
    }

    /**
     * JavaScript interface for React app to update widget data
     */
    @JavascriptInterface
    public void updateWidgetData(String jsonData) {
        try {
            Log.d(TAG, "Received widget update from React");

            // Parse and validate data
            JSONObject data = new JSONObject(jsonData);
            WidgetData widgetData = parseWidgetData(data);

            // Store in SharedPreferences
            storeWidgetData(widgetData);

            // Trigger widget update with throttling
            if (throttler.shouldUpdate()) {
                updateWidget();
            }

        } catch (Exception e) {
            Log.e(TAG, "Error updating widget data", e);
        }
    }

    /**
     * JavaScript interface for premium features
     */
    @JavascriptInterface
    public void updateAIInsight(String insight, int confidence) {
        try {
            JSONObject aiData = new JSONObject();
            aiData.put("insight", insight);
            aiData.put("confidence", confidence);
            aiData.put("timestamp", System.currentTimeMillis());

            SharedPreferences.Editor editor = prefs.edit();
            editor.putString("ai_insight", aiData.toString());
            editor.apply();

            // AI insights trigger immediate update
            updateWidget();

        } catch (Exception e) {
            Log.e(TAG, "Error updating AI insight", e);
        }
    }

    /**
     * Parse widget data from JSON
     */
    private WidgetData parseWidgetData(JSONObject data) throws Exception {
        WidgetData widgetData = new WidgetData();

        widgetData.currentRatio = data.optInt("currentRatio", 80);
        widgetData.dailyStreak = data.optInt("dailyStreak", 0);
        widgetData.totalSignal = data.optInt("totalSignal", 0);
        widgetData.totalNoise = data.optInt("totalNoise", 0);
        widgetData.isPremium = data.optBoolean("isPremium", false);
        widgetData.lastUpdate = System.currentTimeMillis();

        // Parse patterns for visualization
        if (data.has("patterns")) {
            JSONObject patterns = data.getJSONObject("patterns");
            widgetData.bestHour = patterns.optInt("bestHour", 9);
            widgetData.worstHour = patterns.optInt("worstHour", 15);

            // Hourly averages for wave generation
            if (patterns.has("hourlyAverage")) {
                JSONArray hourlyAvg = patterns.getJSONArray("hourlyAverage");
                widgetData.hourlyAverages = new int[24];
                for (int i = 0; i < Math.min(24, hourlyAvg.length()); i++) {
                    widgetData.hourlyAverages[i] = hourlyAvg.getInt(i);
                }
            }
        }

        // Parse AI insight if available
        if (data.has("aiInsight")) {
            widgetData.aiInsight = data.getString("aiInsight");
        }

        return widgetData;
    }

    /**
     * Store widget data in SharedPreferences
     */
    private void storeWidgetData(WidgetData data) {
        try {
            JSONObject json = new JSONObject();
            json.put("currentRatio", data.currentRatio);
            json.put("dailyStreak", data.dailyStreak);
            json.put("totalSignal", data.totalSignal);
            json.put("totalNoise", data.totalNoise);
            json.put("isPremium", data.isPremium);
            json.put("lastUpdate", data.lastUpdate);
            json.put("bestHour", data.bestHour);
            json.put("worstHour", data.worstHour);

            if (data.aiInsight != null) {
                json.put("aiInsight", data.aiInsight);
            }

            if (data.hourlyAverages != null) {
                JSONArray hourlyArray = new JSONArray();
                for (int avg : data.hourlyAverages) {
                    hourlyArray.put(avg);
                }
                json.put("hourlyAverages", hourlyArray);
            }

            SharedPreferences.Editor editor = prefs.edit();
            editor.putString("widget_data", json.toString());
            editor.apply();

            Log.d(TAG, "Widget data stored successfully");

        } catch (Exception e) {
            Log.e(TAG, "Error storing widget data", e);
        }
    }

    /**
     * Trigger widget update
     */
    private void updateWidget() {
        Intent intent = new Intent(context, SignalWaveWidgetProvider.class);
        intent.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);

        AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
        int[] appWidgetIds = appWidgetManager.getAppWidgetIds(
            new ComponentName(context, SignalWaveWidgetProvider.class)
        );

        if (appWidgetIds.length > 0) {
            intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, appWidgetIds);
            context.sendBroadcast(intent);
            Log.d(TAG, "Widget update broadcast sent");
        }
    }

    /**
     * Initialize scheduled updates for premium users
     */
    private void initializeUpdateScheduler() {
        updateScheduler = Executors.newSingleThreadScheduledExecutor();

        // Schedule periodic sync for premium users
        updateScheduler.scheduleAtFixedRate(() -> {
            if (isPremiumUser()) {
                syncWithCloud();
            }
        }, 1, 5, TimeUnit.MINUTES);
    }

    /**
     * Check if user is premium
     */
    private boolean isPremiumUser() {
        return prefs.getBoolean("isPremium", false);
    }

    /**
     * Sync with cloud for premium features
     */
    private void syncWithCloud() {
        // TODO: Implement cloud sync for premium users
        // This would fetch AI insights, pattern analysis, etc.
        Log.d(TAG, "Cloud sync placeholder for premium features");
    }

    /**
     * Clean up resources
     */
    public void cleanup() {
        if (updateScheduler != null && !updateScheduler.isShutdown()) {
            updateScheduler.shutdown();
        }
    }

    /**
     * Internal widget data structure
     */
    private static class WidgetData {
        int currentRatio = 80;
        int dailyStreak = 0;
        int totalSignal = 0;
        int totalNoise = 0;
        boolean isPremium = false;
        long lastUpdate = 0;
        int bestHour = 9;
        int worstHour = 15;
        int[] hourlyAverages = null;
        String aiInsight = null;
    }

    /**
     * Widget update throttler to prevent battery drain
     */
    private static class WidgetUpdateThrottler {
        private static final long MIN_UPDATE_INTERVAL = 30000; // 30 seconds
        private long lastUpdate = 0;

        boolean shouldUpdate() {
            long now = System.currentTimeMillis();
            if (now - lastUpdate > MIN_UPDATE_INTERVAL) {
                lastUpdate = now;
                return true;
            }
            return false;
        }
    }
}