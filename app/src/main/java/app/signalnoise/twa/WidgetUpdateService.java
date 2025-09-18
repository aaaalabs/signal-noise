package app.signalnoise.twa;

import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Handler;
import android.os.IBinder;
import android.util.Log;
import android.webkit.WebView;
import android.webkit.ValueCallback;
import android.appwidget.AppWidgetManager;
import android.content.ComponentName;

/**
 * Service that periodically syncs data between the React app and widgets
 * Uses WebView to execute JavaScript and get data from localStorage
 */
public class WidgetUpdateService extends Service {
    private static final String TAG = "WidgetUpdateService";
    private static final long UPDATE_INTERVAL = 30000; // 30 seconds
    private Handler handler = new Handler();
    private WebView hiddenWebView;

    private Runnable updateTask = new Runnable() {
        @Override
        public void run() {
            fetchDataFromWebApp();
            handler.postDelayed(this, UPDATE_INTERVAL);
        }
    };

    @Override
    public void onCreate() {
        super.onCreate();

        // Create a hidden WebView to execute JavaScript
        hiddenWebView = new WebView(this);
        hiddenWebView.getSettings().setJavaScriptEnabled(true);
        hiddenWebView.getSettings().setDomStorageEnabled(true);

        // Start periodic updates
        handler.post(updateTask);
        Log.d(TAG, "Widget update service started");
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        // Check if this is a manual update request
        if (intent != null && "UPDATE_NOW".equals(intent.getAction())) {
            fetchDataFromWebApp();
        }
        return START_STICKY;
    }

    private void fetchDataFromWebApp() {
        // Load the app URL to access localStorage
        hiddenWebView.loadUrl("https://signal-noise.app");

        // Wait for page to load, then extract data
        hiddenWebView.postDelayed(new Runnable() {
            @Override
            public void run() {
                extractDataFromLocalStorage();
            }
        }, 2000);
    }

    private void extractDataFromLocalStorage() {
        // JavaScript to extract Signal/Noise data from localStorage
        String jsCode = "(function() {" +
            "try {" +
            "  var data = localStorage.getItem('signal_noise_data');" +
            "  if (data) {" +
            "    var parsed = JSON.parse(data);" +
            "    var todayTasks = parsed.tasks || [];" +
            "    var today = new Date().toDateString();" +
            "    var todaySignal = todayTasks.filter(function(t) {" +
            "      return new Date(t.timestamp).toDateString() === today && t.type === 'signal';" +
            "    }).length;" +
            "    var todayNoise = todayTasks.filter(function(t) {" +
            "      return new Date(t.timestamp).toDateString() === today && t.type === 'noise';" +
            "    }).length;" +
            "    var total = todaySignal + todayNoise;" +
            "    var ratio = total > 0 ? Math.round((todaySignal / total) * 100) : 80;" +
            "    var streak = parsed.settings ? (parsed.settings.streak || 0) : 0;" +
            "    return JSON.stringify({" +
            "      ratio: ratio," +
            "      signal: todaySignal," +
            "      noise: todayNoise," +
            "      streak: streak," +
            "      timestamp: Date.now()" +
            "    });" +
            "  }" +
            "  return JSON.stringify({ratio: 80, signal: 0, noise: 0, streak: 0});" +
            "} catch(e) {" +
            "  return JSON.stringify({ratio: 80, error: e.message});" +
            "}" +
            "})()";

        hiddenWebView.evaluateJavascript(jsCode, new ValueCallback<String>() {
            @Override
            public void onReceiveValue(String value) {
                try {
                    // Parse the JSON response (it's wrapped in quotes)
                    String jsonStr = value.substring(1, value.length() - 1)
                        .replace("\\\"", "\"")
                        .replace("\\\\", "\\");

                    // Parse to get the ratio
                    int ratio = 80;
                    int streak = 0;

                    if (jsonStr.contains("\"ratio\":")) {
                        String ratioStr = jsonStr.substring(jsonStr.indexOf("\"ratio\":") + 8);
                        ratio = Integer.parseInt(ratioStr.substring(0, ratioStr.indexOf(",")));
                    }

                    if (jsonStr.contains("\"streak\":")) {
                        String streakStr = jsonStr.substring(jsonStr.indexOf("\"streak\":") + 9);
                        streak = Integer.parseInt(streakStr.substring(0,
                            streakStr.contains(",") ? streakStr.indexOf(",") : streakStr.indexOf("}")));
                    }

                    // Update SharedPreferences
                    updateSharedPreferences(ratio, streak);

                    // Update all widgets
                    updateAllWidgets();

                    Log.d(TAG, "Updated widgets with ratio: " + ratio + "%, streak: " + streak);

                } catch (Exception e) {
                    Log.e(TAG, "Error parsing data from web app", e);
                }
            }
        });
    }

    private void updateSharedPreferences(int ratio, int streak) {
        SharedPreferences prefs = getSharedPreferences("signal_noise_widget_data", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = prefs.edit();
        editor.putInt("current_ratio", ratio);
        editor.putInt("current_streak", streak);
        editor.putLong("last_update", System.currentTimeMillis());
        editor.apply();
    }

    private void updateAllWidgets() {
        try {
            // Broadcast to all widget types to update themselves
            Context context = getApplicationContext();

            // Update SN2x1R
            Intent intent = new Intent(context, app.signalnoise.twa.widget.SN2x1R.class);
            intent.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
            AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
            ComponentName component = new ComponentName(context, app.signalnoise.twa.widget.SN2x1R.class);
            int[] widgetIds = appWidgetManager.getAppWidgetIds(component);
            intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, widgetIds);
            context.sendBroadcast(intent);

            Log.d(TAG, "Sent update broadcast to widgets");
        } catch (Exception e) {
            Log.e(TAG, "Error updating widgets", e);
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        handler.removeCallbacks(updateTask);
        if (hiddenWebView != null) {
            hiddenWebView.destroy();
        }
        Log.d(TAG, "Widget update service stopped");
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}