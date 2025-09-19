package app.signalnoise.twa.widget;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.util.Log;

/**
 * ScreenWakeSyncReceiver - SLC First Principles Solution
 * Triggers instant widget sync when user unlocks phone
 * Simple, Lovable, Complete approach to real-time widget updates
 */
public class ScreenWakeSyncReceiver extends BroadcastReceiver {
    private static final String TAG = "ScreenWakeSync";
    private static final String PREFS_NAME = "screen_wake_sync";
    private static final long THROTTLE_MS = 10000; // 10 seconds throttling

    @Override
    public void onReceive(Context context, Intent intent) {
        if (Intent.ACTION_SCREEN_ON.equals(intent.getAction())) {

            // Smart throttling - max 1 sync per 10s
            SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
            long lastSync = prefs.getLong("last_sync_time", 0);
            long now = System.currentTimeMillis();

            if (now - lastSync > THROTTLE_MS) {
                Log.d(TAG, "Screen wake - triggering instant widget sync");

                // Save throttle timestamp
                prefs.edit().putLong("last_sync_time", now).apply();

                // Trigger instant Redis fetch (reuse existing system)
                RedisDataFetcher.fetchAndUpdateWidgetData(context, "thomas.seiger@gmail.com");

            } else {
                Log.d(TAG, "Screen wake - throttled (last sync " + (now - lastSync) + "ms ago)");
            }
        }
    }
}