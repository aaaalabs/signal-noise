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
import java.util.Random;

/**
 * Q - Quantum Signal State Widget
 * REVOLUTIONARY: Productivity as quantum probability cloud
 * High signal = dense organized particles, High noise = chaotic scatter
 * First Android widget with real-time mathematical visualization
 */
public class Q extends AppWidgetProvider {
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

            // Generate quantum probability field bitmap
            Bitmap quantumField = generateQuantumField(ratio, 146, 146);

            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_quantum);

            // Set quantum field as ImageView background
            views.setImageViewBitmap(R.id.quantum_field, quantumField);

            // Overlay ratio text
            views.setTextViewText(R.id.quantum_ratio, "Q: " + ratio + "%");

            appWidgetManager.updateAppWidget(appWidgetId, views);

        } catch (Exception e) {
            // Fallback to simple display
            RemoteViews fallback = new RemoteViews(context.getPackageName(), R.layout.widget_sn2x1p);
            fallback.setTextViewText(R.id.widget_ratio, "Q: ERR");
            fallback.setTextViewText(R.id.widget_progress, "●●●");
            appWidgetManager.updateAppWidget(appWidgetId, fallback);
        }
    }

    /**
     * Generate quantum probability field visualization
     * REVOLUTIONARY: First mathematical widget visualization in Android
     */
    private Bitmap generateQuantumField(int ratio, int width, int height) {
        Bitmap bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(bitmap);

        // Dark quantum void background
        canvas.drawColor(Color.parseColor("#0a0a0a"));

        Paint particlePaint = new Paint();
        particlePaint.setAntiAlias(true);

        Random random = new Random(ratio); // Deterministic based on ratio
        float signalStrength = ratio / 100.0f;

        int particleCount = (int)(signalStrength * 200 + 30); // 30-230 particles

        for (int i = 0; i < particleCount; i++) {
            float x, y;

            if (random.nextFloat() < signalStrength) {
                // Signal particles - organized around center (quantum coherence)
                float centerX = width / 2.0f;
                float centerY = height / 2.0f;
                float radius = (1.0f - signalStrength) * width * 0.25f;

                float angle = (float)(random.nextGaussian() * Math.PI / 6 + (i * 2 * Math.PI / particleCount));
                x = centerX + (float)Math.cos(angle) * radius * random.nextFloat();
                y = centerY + (float)Math.sin(angle) * radius * random.nextFloat();

                // Signal particles are bright green-cyan (high coherence)
                int alpha = (int)(signalStrength * 255);
                particlePaint.setColor(Color.argb(alpha, 0, 255, 200));
                canvas.drawCircle(x, y, 1.0f + signalStrength * 1.5f, particlePaint);

            } else {
                // Noise particles - scattered randomly (quantum decoherence)
                x = random.nextFloat() * width;
                y = random.nextFloat() * height;

                // Noise particles are dim red-orange (decoherence)
                int alpha = (int)((1.0f - signalStrength) * 150);
                particlePaint.setColor(Color.argb(alpha, 255, 100, 20));
                canvas.drawCircle(x, y, 0.5f + (1.0f - signalStrength), particlePaint);
            }
        }

        // Add quantum uncertainty principle visualization (Heisenberg limit)
        if (signalStrength > 0.7f) {
            Paint uncertaintyPaint = new Paint();
            uncertaintyPaint.setColor(Color.argb(40, 0, 255, 200));
            canvas.drawCircle(width/2, height/2, signalStrength * 25, uncertaintyPaint);
        }

        return bitmap;
    }
}