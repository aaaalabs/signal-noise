package app.signalnoise.twa.widget;

import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.util.Log;
import android.appwidget.AppWidgetManager;
import android.content.ComponentName;

/**
 * Service that polls for data updates and updates widgets
 * Since TWA doesn't allow JavaScript injection, we use a different approach:
 * 1. Generate random realistic values that change over time
 * 2. Store them in SharedPreferences
 * 3. Update widgets with the new values
 */
public class DataPollingService extends Service {
    private static final String TAG = "DataPollingService";
    private static final String PREFS_NAME = "signal_noise_widget_data";
    private static final long POLL_INTERVAL = 30000; // 30 seconds

    private Handler handler;
    private Runnable pollRunnable;

    @Override
    public void onCreate() {
        super.onCreate();
        handler = new Handler(Looper.getMainLooper());

        pollRunnable = new Runnable() {
            @Override
            public void run() {
                updateData();
                handler.postDelayed(this, POLL_INTERVAL);
            }
        };
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        // Start polling
        handler.post(pollRunnable);
        return START_STICKY;
    }

    private void updateData() {
        try {
            SharedPreferences prefs = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);

            // Get stored user email (this should be set when user logs in)
            String userEmail = prefs.getString("user_email", "thomas.seiger@gmail.com"); // Using your email as default

            // Try to fetch from Redis first
            Log.d(TAG, "Fetching data from Redis for: " + userEmail);
            RedisDataFetcher.fetchAndUpdateWidgetData(this, userEmail);

            // After Redis fetch attempt, always trigger widget updates
            // The RedisDataFetcher will update SharedPreferences if successful
            // The widgets will read whatever is in SharedPreferences
            updateAllWidgets();

        } catch (Exception e) {
            Log.e(TAG, "Error updating data", e);
        }
    }

    private void updateAllWidgets() {
        try {
            Context context = getApplicationContext();

            // Update all widget types
            Intent intent = new Intent(context, SN2x1R.class);
            intent.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
            ComponentName component = new ComponentName(context, SN2x1R.class);
            AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
            int[] appWidgetIds = appWidgetManager.getAppWidgetIds(component);
            intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, appWidgetIds);
            context.sendBroadcast(intent);

        } catch (Exception e) {
            Log.e(TAG, "Error updating widgets", e);
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (handler != null && pollRunnable != null) {
            handler.removeCallbacks(pollRunnable);
        }
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}