package app.signalnoise.twa.widget;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import org.json.JSONObject;

/**
 * Fetches Signal/Noise data directly from Vercel Redis
 * This bypasses the localStorage isolation issue completely!
 */
public class RedisDataFetcher {
    private static final String TAG = "RedisDataFetcher";
    private static final String PREFS_NAME = "signal_noise_widget_data";

    // Your Vercel API endpoint that reads from Redis
    private static final String API_URL = "https://signal-noise.app/api/widget-data";

    public static void fetchAndUpdateWidgetData(Context context, String userEmail) {
        new Thread(() -> {
            try {
                // Circuit breaker: Don't fetch if we just did (prevent crash)
                SharedPreferences circuitPrefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
                long lastFetch = circuitPrefs.getLong("last_fetch_time", 0);
                long now = System.currentTimeMillis();

                // Minimum 30 seconds between API calls (circuit breaker)
                if (now - lastFetch < 30000) {
                    Log.d(TAG, "Circuit breaker: Skipping fetch (too recent)");
                    return;
                }

                // Update last fetch time immediately
                circuitPrefs.edit().putLong("last_fetch_time", now).apply();

                Log.d(TAG, "Fetching from Redis API...");
                // Build URL with email parameter
                URL url = new URL(API_URL + "?email=" + userEmail);
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("GET");
                conn.setConnectTimeout(5000);
                conn.setReadTimeout(5000);

                int responseCode = conn.getResponseCode();
                if (responseCode == HttpURLConnection.HTTP_OK) {
                    BufferedReader reader = new BufferedReader(
                        new InputStreamReader(conn.getInputStream())
                    );
                    StringBuilder response = new StringBuilder();
                    String line;
                    while ((line = reader.readLine()) != null) {
                        response.append(line);
                    }
                    reader.close();

                    // Parse JSON response
                    JSONObject json = new JSONObject(response.toString());
                    int ratio = json.optInt("ratio", -1);
                    int signalCount = json.optInt("signalCount", 0);
                    int noiseCount = json.optInt("noiseCount", 0);
                    int streak = json.optInt("streak", 0);
                    String lastUpdate = json.optString("lastUpdate", "");

                    // Save to SharedPreferences
                    SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
                    SharedPreferences.Editor editor = prefs.edit();
                    editor.putInt("current_ratio", ratio);
                    editor.putInt("signal_count", signalCount);
                    editor.putInt("noise_count", noiseCount);
                    editor.putInt("streak", streak);
                    editor.putLong("last_update", System.currentTimeMillis());
                    editor.putString("data_source", "REDIS");
                    editor.apply();

                    Log.d(TAG, "Updated from Redis - Ratio: " + ratio + "%");

                    // Trigger widget update
                    WidgetUpdateHelper.updateAllWidgets(context);

                } else {
                    Log.e(TAG, "Failed to fetch data. Response code: " + responseCode);
                }

                conn.disconnect();

            } catch (Exception e) {
                Log.e(TAG, "Error fetching Redis data", e);

                // On error, mark as error state
                SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
                prefs.edit().putString("data_source", "ERROR").apply();
            }
        }).start();
    }
}