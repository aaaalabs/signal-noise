package app.signalnoise.twa.widget;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.widget.RemoteViews;
import app.signalnoise.twa.R;

/**
 * W - Wave Interference Widget
 * REVOLUTIONARY: Mathematical wave interference patterns
 * High signal = constructive interference (bright)
 * Low signal = destructive interference (dark)
 * First Android widget showing live physics equations
 */
public class W extends AppWidgetProvider {
    private static final String PREFS_NAME = "signal_noise_widget_data";

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateWidget(context, appWidgetManager, appWidgetId);
        }
        RedisDataFetcher.fetchAndUpdateWidgetData(context, "thomas.seiger@gmail.com");
    }

    private void updateWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        try {
            SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
            int ratio = prefs.getInt("current_ratio", 43);

            // Generate wave interference pattern with animation frame
            long time = System.currentTimeMillis();
            Bitmap waveField = generateWaveInterference(ratio, 292, 146, time);

            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_wave);

            // Set wave field as background
            views.setImageViewBitmap(R.id.wave_field, waveField);

            // Show ratio and wave type
            String interferenceType = ratio > 60 ? "Constructive" : "Destructive";
            views.setTextViewText(R.id.wave_ratio, "W: " + ratio + "%");
            views.setTextViewText(R.id.wave_type, interferenceType);

            // Add tap-to-sync functionality
            android.content.Intent syncIntent = new android.content.Intent(context, W.class);
            syncIntent.setAction(android.appwidget.AppWidgetManager.ACTION_APPWIDGET_UPDATE);
            syncIntent.putExtra(android.appwidget.AppWidgetManager.EXTRA_APPWIDGET_IDS, new int[]{appWidgetId});

            android.app.PendingIntent syncPendingIntent = android.app.PendingIntent.getBroadcast(
                context, appWidgetId + 1000, syncIntent,
                android.app.PendingIntent.FLAG_UPDATE_CURRENT | android.app.PendingIntent.FLAG_IMMUTABLE);

            views.setOnClickPendingIntent(R.id.wave_field, syncPendingIntent);

            appWidgetManager.updateAppWidget(appWidgetId, views);

        } catch (Exception e) {
            // Fallback
            RemoteViews fallback = new RemoteViews(context.getPackageName(), R.layout.widget_sn2x1p);
            fallback.setTextViewText(R.id.widget_ratio, "W: ERR");
            fallback.setTextViewText(R.id.widget_progress, "∿∿∿∿");
            appWidgetManager.updateAppWidget(appWidgetId, fallback);
        }
    }

    /**
     * Generate mathematical wave interference pattern
     * REVOLUTIONARY: Live physics equation rendering in Android widget
     */
    private Bitmap generateWaveInterference(int ratio, int width, int height, long time) {
        Bitmap bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(bitmap);

        // Deep ocean background for wave propagation
        canvas.drawColor(Color.parseColor("#001122"));

        Paint wavePaint = new Paint();
        wavePaint.setAntiAlias(true);

        float signalStrength = ratio / 100.0f;
        float noiseStrength = (100 - ratio) / 100.0f;

        // Animation phase based on time
        float timePhase = (time % 10000) / 10000.0f * 2.0f * (float)Math.PI;

        // Generate interference pattern pixel by pixel
        for (int x = 0; x < width; x += 2) {
            for (int y = 0; y < height; y += 2) {

                // Signal wave (coherent, organized) - ψ₁
                double signalWave1 = Math.sin((x * 0.02) + timePhase) * signalStrength;
                double signalWave2 = Math.sin((y * 0.025) + timePhase * 0.8) * signalStrength;

                // Noise wave (chaotic, random phase) - ψ₂
                double noiseWave1 = Math.sin((x * 0.045) + (ratio * 0.1)) * noiseStrength;
                double noiseWave2 = Math.cos((y * 0.04) + (ratio * 0.15)) * noiseStrength;

                // Wave interference calculation: |ψ₁ + ψ₂|²
                double totalInterference = signalWave1 + signalWave2 + noiseWave1 + noiseWave2;
                double intensity = Math.abs(totalInterference);

                // Convert to color intensity
                int colorValue = (int)(intensity * 255);
                colorValue = Math.max(0, Math.min(255, colorValue));

                // Color based on wave type dominance
                int color;
                if (signalWave1 + signalWave2 > noiseWave1 + noiseWave2) {
                    // Constructive interference = bright cyan-green
                    color = Color.argb(colorValue / 2, 0, colorValue, (int)(colorValue * 0.8));
                } else {
                    // Destructive interference = dim orange-red
                    color = Color.argb(colorValue / 3, colorValue, (int)(colorValue * 0.4), 0);
                }

                wavePaint.setColor(color);
                canvas.drawRect(x, y, x + 2, y + 2, wavePaint);
            }
        }

        // Add mathematical notation (for physics authenticity)
        wavePaint.setColor(Color.argb(100, 0, 255, 136));
        wavePaint.setTextSize(8);
        String equation = "ψ = Σ A·sin(ωt + φ)";
        canvas.drawText(equation, 10, height - 10, wavePaint);

        return bitmap;
    }
}