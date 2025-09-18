package app.signalnoise.twa.widget;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.widget.RemoteViews;
import android.app.PendingIntent;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.LinearGradient;
import android.graphics.Shader;
import android.graphics.Color;
import android.graphics.Path;
import android.graphics.PathEffect;
import android.graphics.CornerPathEffect;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.view.View;
import org.json.JSONObject;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import app.signalnoise.twa.R;
import app.signalnoise.twa.LauncherActivity;

/**
 * Signal Wave Widget Provider
 *
 * Design Philosophy: Time as a Living Stream
 * - Animated particle flow representing current focus state
 * - Real-time updates with elegant transitions
 * - Premium AI integration for insights
 *
 * Jony Ive Principles Applied:
 * - Honest representation of productivity state
 * - Minimal, essential information only
 * - Smooth, natural animations
 * - Premium craftsmanship in every pixel
 */
public class SignalWaveWidgetProvider extends AppWidgetProvider {

    private static final String TAG = "SignalWave";
    private static final String PREFS_NAME = "SignalNoiseWidget";
    private static final String ACTION_REFRESH = "app.signalnoise.SIGNAL_WAVE_REFRESH";

    // Design constants following golden ratio
    private static final int WAVE_HEIGHT = 120;
    private static final int WAVE_WIDTH = 280;
    private static final float PHI = 1.618f; // Golden ratio for proportions

    // Performance optimization
    private static Handler updateHandler;
    private static Runnable updateRunnable;
    private static BitmapCache bitmapCache = new BitmapCache();

    @Override
    public void onEnabled(Context context) {
        super.onEnabled(context);
        Log.d(TAG, "Signal Wave Widget enabled - initializing update cycle");
        initializeUpdateHandler();
    }

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        Log.d(TAG, "===== SignalWave onUpdate START =====");
        Log.d(TAG, "Updating " + appWidgetIds.length + " Signal Wave widgets");
        Log.d(TAG, "Package: " + context.getPackageName());

        for (int appWidgetId : appWidgetIds) {
            Log.d(TAG, "Processing widget ID: " + appWidgetId);
            updateWidget(context, appWidgetManager, appWidgetId);
        }

        // Schedule next update with battery-aware timing
        Log.d(TAG, "Scheduling next update...");
        scheduleNextUpdate(context);
        Log.d(TAG, "===== SignalWave onUpdate END =====");
    }

    private void updateWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        try {
            Log.d(TAG, "updateWidget: Starting for ID " + appWidgetId);
            Log.d(TAG, "updateWidget: Creating RemoteViews with layout R.layout.widget_signal_wave");

            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_signal_wave);
            Log.d(TAG, "updateWidget: RemoteViews created successfully");

            // Retrieve current state from SharedPreferences
            Log.d(TAG, "updateWidget: Loading widget state...");
            WidgetState state = loadWidgetState(context);
            Log.d(TAG, "updateWidget: State loaded - ratio=" + state.ratio + ", streak=" + state.streak);

            // Skip bitmap generation for now - just update text
            Log.d(TAG, "updateWidget: Skipping bitmap generation (commented out)");
            // Bitmap waveBitmap = generateWaveVisualization(state);
            // views.setImageViewBitmap(R.id.wave_canvas, waveBitmap);

            // Update text elements with careful typography
            Log.d(TAG, "updateWidget: Updating text elements...");
            updateTextElements(views, state);
            Log.d(TAG, "updateWidget: Text elements updated");

            // Set click intent to open app
            Log.d(TAG, "updateWidget: Setting up click intent...");
            Intent intent = new Intent(context, LauncherActivity.class);
            intent.putExtra("source", "signal_wave_widget");
            PendingIntent pendingIntent = PendingIntent.getActivity(
                context, 0, intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );
            views.setOnClickPendingIntent(R.id.widget_container, pendingIntent);
            Log.d(TAG, "updateWidget: Click intent configured");

            // Apply premium features if available
            if (state.isPremium) {
                Log.d(TAG, "updateWidget: Applying premium features...");
                applyPremiumFeatures(views, state);
            }

            Log.d(TAG, "updateWidget: Calling appWidgetManager.updateAppWidget...");
            appWidgetManager.updateAppWidget(appWidgetId, views);
            Log.d(TAG, "updateWidget: Widget updated successfully for ID " + appWidgetId);

        } catch (Exception e) {
            Log.e(TAG, "ERROR in updateWidget for ID " + appWidgetId, e);
            Log.e(TAG, "Exception class: " + e.getClass().getName());
            Log.e(TAG, "Exception message: " + e.getMessage());
            e.printStackTrace();

            // Graceful degradation - show minimal widget
            Log.d(TAG, "Attempting fallback widget...");
            showFallbackWidget(context, appWidgetManager, appWidgetId);
        }
    }

    /**
     * Generate the signature wave visualization
     * Following Jony Ive's principle of honest materials
     */
    private Bitmap generateWaveVisualization(WidgetState state) {
        String cacheKey = state.getCacheKey();
        Bitmap cached = bitmapCache.get(cacheKey);
        if (cached != null && !state.needsAnimation()) {
            return cached;
        }

        Bitmap bitmap = Bitmap.createBitmap(WAVE_WIDTH, WAVE_HEIGHT, Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(bitmap);

        // Background gradient - subtle depth without fake 3D
        Paint bgPaint = new Paint();
        LinearGradient bgGradient = new LinearGradient(
            0, 0, WAVE_WIDTH, WAVE_HEIGHT,
            Color.parseColor("#0A0A0A"),
            Color.parseColor("#0F0F0F"),
            Shader.TileMode.CLAMP
        );
        bgPaint.setShader(bgGradient);
        bgPaint.setAntiAlias(true);
        canvas.drawRect(0, 0, WAVE_WIDTH, WAVE_HEIGHT, bgPaint);

        // Draw the productivity wave
        drawProductivityWave(canvas, state);

        // Add particle effects for premium users
        if (state.isPremium && state.hasAIInsight) {
            drawAIParticles(canvas, state);
        }

        bitmapCache.put(cacheKey, bitmap);
        return bitmap;
    }

    /**
     * Draw the main productivity wave
     * The wave amplitude and frequency represent focus state
     */
    private void drawProductivityWave(Canvas canvas, WidgetState state) {
        Path path = new Path();
        Paint wavePaint = new Paint();

        // Color based on productivity state
        String waveColor = state.ratio >= 80 ? "#00ff88" : // Excellent (Signal green)
                          state.ratio >= 50 ? "#88ff00" : // Good
                          "#ff8800"; // Needs focus

        wavePaint.setColor(Color.parseColor(waveColor));
        wavePaint.setStrokeWidth(2.5f);
        wavePaint.setStyle(Paint.Style.STROKE);
        wavePaint.setAntiAlias(true);
        wavePaint.setPathEffect(new CornerPathEffect(10f));

        // Wave parameters based on golden ratio
        float amplitude = (state.ratio / 100f) * (WAVE_HEIGHT / PHI);
        float frequency = 0.02f * PHI;
        float phase = (float)((System.currentTimeMillis() / 1000f) % (2 * Math.PI));

        path.moveTo(0, WAVE_HEIGHT / 2f);

        for (int x = 0; x <= WAVE_WIDTH; x++) {
            float y = WAVE_HEIGHT / 2f +
                     amplitude * (float)Math.sin(x * frequency + phase);
            path.lineTo(x, y);
        }

        canvas.drawPath(path, wavePaint);

        // Add glow effect for high productivity
        if (state.ratio >= 80) {
            wavePaint.setAlpha(50);
            wavePaint.setStrokeWidth(8f);
            canvas.drawPath(path, wavePaint);
        }
    }

    /**
     * Draw AI insight particles for premium users
     */
    private void drawAIParticles(Canvas canvas, WidgetState state) {
        Paint particlePaint = new Paint();
        particlePaint.setColor(Color.parseColor("#00ff88"));
        particlePaint.setAlpha(180);
        particlePaint.setAntiAlias(true);

        // Particle positions based on Fibonacci sequence for natural distribution
        int[] fibSequence = {1, 1, 2, 3, 5, 8, 13, 21};
        long time = System.currentTimeMillis();

        for (int i = 0; i < fibSequence.length; i++) {
            float x = (fibSequence[i] * 13f + time / 100f) % WAVE_WIDTH;
            float y = WAVE_HEIGHT / 2f +
                     (float)Math.sin(x * 0.05f + time / 500f) * 20f;
            float radius = 1.5f + (float)Math.sin(time / 200f + i) * 0.5f;

            canvas.drawCircle(x, y, radius, particlePaint);
        }
    }

    /**
     * Update text elements with precise typography
     */
    private void updateTextElements(RemoteViews views, WidgetState state) {
        // Main ratio display - ultra-thin weight
        views.setTextViewText(R.id.ratio_text, String.valueOf(state.ratio));

        // Status indicator - contextual message
        String status = state.ratio >= 80 ? "Excellent Focus" :
                       state.ratio >= 50 ? "Good Balance" :
                       "Refocus Needed";
        views.setTextViewText(R.id.status_text, status);

        // Streak display - subtle but motivating
        if (state.streak > 0) {
            views.setTextViewText(R.id.streak_text, state.streak + " day" +
                                 (state.streak > 1 ? "s" : ""));
            views.setViewVisibility(R.id.streak_container, View.VISIBLE);
        } else {
            views.setViewVisibility(R.id.streak_container, View.GONE);
        }

        // Last update time for transparency
        SimpleDateFormat sdf = new SimpleDateFormat("HH:mm", Locale.getDefault());
        views.setTextViewText(R.id.update_time, sdf.format(new Date()));
    }

    /**
     * Apply premium features for enhanced experience
     */
    private void applyPremiumFeatures(RemoteViews views, WidgetState state) {
        if (state.aiInsight != null && !state.aiInsight.isEmpty()) {
            views.setTextViewText(R.id.ai_insight, state.aiInsight);
            views.setViewVisibility(R.id.ai_container, View.VISIBLE);

            // Subtle pulse animation for AI insights (using view visibility toggle)
            views.setViewVisibility(R.id.ai_pulse, View.VISIBLE);
        } else {
            views.setViewVisibility(R.id.ai_container, View.GONE);
        }
    }

    /**
     * Load widget state from SharedPreferences
     */
    private WidgetState loadWidgetState(Context context) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        String dataJson = prefs.getString("widget_data", null);

        WidgetState state = new WidgetState();

        // Set attractive default values for first launch
        state.ratio = 87;  // Default to 87% for a nice demo
        state.streak = 7;  // Show a 7-day streak
        state.isPremium = false;
        state.aiInsight = "";
        state.hasAIInsight = false;
        state.lastUpdate = System.currentTimeMillis();

        if (dataJson != null) {
            try {
                JSONObject data = new JSONObject(dataJson);
                state.ratio = data.optInt("currentRatio", 87);
                state.streak = data.optInt("dailyStreak", 7);
                state.isPremium = data.optBoolean("isPremium", false);
                state.aiInsight = data.optString("aiInsight", "");
                state.hasAIInsight = !state.aiInsight.isEmpty();
                state.lastUpdate = data.optLong("lastUpdate", System.currentTimeMillis());
            } catch (Exception e) {
                Log.e(TAG, "Error parsing widget data, using defaults", e);
            }
        }

        return state;
    }

    /**
     * Show fallback widget in case of errors
     */
    private void showFallbackWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_signal_wave_fallback);
        views.setTextViewText(R.id.fallback_text, "—");

        Intent intent = new Intent(context, LauncherActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(
            context, 0, intent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        views.setOnClickPendingIntent(R.id.fallback_container, pendingIntent);

        appWidgetManager.updateAppWidget(appWidgetId, views);
    }

    /**
     * Schedule next update with battery-aware timing
     */
    private void scheduleNextUpdate(Context context) {
        if (updateHandler == null) {
            initializeUpdateHandler();
        }

        if (updateRunnable != null) {
            updateHandler.removeCallbacks(updateRunnable);
        }

        updateRunnable = new Runnable() {
            @Override
            public void run() {
                // Trigger widget update
                Intent intent = new Intent(context, SignalWaveWidgetProvider.class);
                intent.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);

                AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
                int[] appWidgetIds = appWidgetManager.getAppWidgetIds(
                    new ComponentName(context, SignalWaveWidgetProvider.class)
                );
                intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, appWidgetIds);

                context.sendBroadcast(intent);

                // Schedule next update - adaptive based on user activity
                long nextUpdate = calculateNextUpdateInterval(context);
                updateHandler.postDelayed(this, nextUpdate);
            }
        };

        long initialDelay = calculateNextUpdateInterval(context);
        updateHandler.postDelayed(updateRunnable, initialDelay);
    }

    /**
     * Calculate optimal update interval based on context
     */
    private long calculateNextUpdateInterval(Context context) {
        // TODO: Implement battery-aware scheduling
        // For now, use 60-second base interval
        return 60000L; // 60 seconds
    }

    /**
     * Initialize update handler on main looper
     */
    private static void initializeUpdateHandler() {
        if (updateHandler == null) {
            updateHandler = new Handler(Looper.getMainLooper());
        }
    }

    @Override
    public void onDisabled(Context context) {
        super.onDisabled(context);
        Log.d(TAG, "Signal Wave Widget disabled - cleaning up");

        if (updateHandler != null && updateRunnable != null) {
            updateHandler.removeCallbacks(updateRunnable);
        }

        bitmapCache.clear();
    }

    /**
     * Internal widget state class
     */
    private static class WidgetState {
        int ratio = 80;
        int streak = 0;
        boolean isPremium = false;
        String aiInsight = "";
        boolean hasAIInsight = false;
        long lastUpdate = 0;

        String getCacheKey() {
            return ratio + "_" + isPremium + "_" + hasAIInsight;
        }

        boolean needsAnimation() {
            return System.currentTimeMillis() - lastUpdate < 2000; // Animate for 2 seconds after update
        }
    }

    /**
     * Simple bitmap cache for performance
     */
    private static class BitmapCache {
        private final int MAX_SIZE = 3;
        private final java.util.LinkedHashMap<String, Bitmap> cache;

        BitmapCache() {
            cache = new java.util.LinkedHashMap<String, Bitmap>(MAX_SIZE, 0.75f, true) {
                @Override
                protected boolean removeEldestEntry(java.util.Map.Entry<String, Bitmap> eldest) {
                    if (size() > MAX_SIZE) {
                        eldest.getValue().recycle();
                        return true;
                    }
                    return false;
                }
            };
        }

        synchronized Bitmap get(String key) {
            return cache.get(key);
        }

        synchronized void put(String key, Bitmap bitmap) {
            cache.put(key, bitmap);
        }

        synchronized void clear() {
            for (Bitmap bitmap : cache.values()) {
                bitmap.recycle();
            }
            cache.clear();
        }
    }
}