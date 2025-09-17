package app.signalnoise.twa.widget.signalwave;

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
import org.json.JSONObject;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

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
        Log.d(TAG, "Updating " + appWidgetIds.length + " Signal Wave widgets");

        for (int appWidgetId : appWidgetIds) {
            updateWidget(context, appWidgetManager, appWidgetId);
        }

        // Schedule next update with battery-aware timing
        scheduleNextUpdate(context);
    }

    private void updateWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        try {
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_signal_wave);

            // Retrieve current state from SharedPreferences
            WidgetState state = loadWidgetState(context);

            // Generate wave visualization
            Bitmap waveBitmap = generateWaveVisualization(state);
            views.setImageViewBitmap(R.id.wave_canvas, waveBitmap);

            // Update text elements with careful typography
            updateTextElements(views, state);

            // Set click intent to open app
            Intent intent = new Intent(context, LauncherActivity.class);
            intent.putExtra("source", "signal_wave_widget");
            PendingIntent pendingIntent = PendingIntent.getActivity(
                context, 0, intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );
            views.setOnClickPendingIntent(R.id.widget_container, pendingIntent);

            // Apply premium features if available
            if (state.isPremium) {
                applyPremiumFeatures(views, state);
            }

            appWidgetManager.updateAppWidget(appWidgetId, views);

        } catch (Exception e) {
            Log.e(TAG, "Error updating widget", e);
            // Graceful degradation - show minimal widget
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
        float phase = (System.currentTimeMillis() / 1000f) % (2 * Math.PI);

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
            views.setViewVisibility(R.id.streak_container, RemoteViews.VISIBLE);
        } else {
            views.setViewVisibility(R.id.streak_container, RemoteViews.GONE);
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
            views.setViewVisibility(R.id.ai_container, RemoteViews.VISIBLE);

            // Subtle pulse animation for AI insights (using view visibility toggle)
            views.setViewVisibility(R.id.ai_pulse, RemoteViews.VISIBLE);
        } else {
            views.setViewVisibility(R.id.ai_container, RemoteViews.GONE);
        }
    }

    /**
     * Load widget state from SharedPreferences
     */
    private WidgetState loadWidgetState(Context context) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        String dataJson = prefs.getString("widget_data", null);

        WidgetState state = new WidgetState();

        if (dataJson != null) {
            try {
                JSONObject data = new JSONObject(dataJson);
                state.ratio = data.optInt("currentRatio", 80);
                state.streak = data.optInt("dailyStreak", 0);
                state.isPremium = data.optBoolean("isPremium", false);
                state.aiInsight = data.optString("aiInsight", "");
                state.hasAIInsight = !state.aiInsight.isEmpty();
                state.lastUpdate = data.optLong("lastUpdate", System.currentTimeMillis());
            } catch (Exception e) {
                Log.e(TAG, "Error parsing widget data", e);
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