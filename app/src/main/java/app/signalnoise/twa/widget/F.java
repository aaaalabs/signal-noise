package app.signalnoise.twa.widget;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.RadialGradient;
import android.graphics.Shader;
import android.widget.RemoteViews;
import app.signalnoise.twa.R;

/**
 * F - Flow State Widget
 * REVOLUTIONARY: First Android widget that guides users toward flow state
 * Perfect circle = Flow achieved, Fragmented = Distracted
 * Breathing animation guides meditation toward peak performance
 * Jony Ive would love this: emotionally resonant + functionally honest
 */
public class F extends AppWidgetProvider {
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

            // Generate breathing flow state circle with animation
            long time = System.currentTimeMillis();
            Bitmap flowState = generateFlowState(ratio, 146, 146, time);

            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_flow);

            // Set flow state circle as background
            views.setImageViewBitmap(R.id.flow_field, flowState);

            // Overlay state and ratio
            String flowLevel = getFlowLevel(ratio);
            views.setTextViewText(R.id.flow_ratio, "F: " + ratio + "%");
            views.setTextViewText(R.id.flow_state, flowLevel);

            // Add tap-to-sync
            android.content.Intent syncIntent = new android.content.Intent(context, F.class);
            syncIntent.setAction(android.appwidget.AppWidgetManager.ACTION_APPWIDGET_UPDATE);
            syncIntent.putExtra(android.appwidget.AppWidgetManager.EXTRA_APPWIDGET_IDS, new int[]{appWidgetId});

            android.app.PendingIntent syncPendingIntent = android.app.PendingIntent.getBroadcast(
                context, appWidgetId + 2000, syncIntent,
                android.app.PendingIntent.FLAG_UPDATE_CURRENT | android.app.PendingIntent.FLAG_IMMUTABLE);

            views.setOnClickPendingIntent(R.id.flow_field, syncPendingIntent);

            appWidgetManager.updateAppWidget(appWidgetId, views);

        } catch (Exception e) {
            // Fallback
            RemoteViews fallback = new RemoteViews(context.getPackageName(), R.layout.widget_sn2x1p);
            fallback.setTextViewText(R.id.widget_ratio, "F: ERR");
            fallback.setTextViewText(R.id.widget_progress, "○");
            appWidgetManager.updateAppWidget(appWidgetId, fallback);
        }
    }

    /**
     * Generate flow state breathing circle - REVOLUTIONARY DESIGN
     * Perfect circle = Flow state achieved
     * Fragmented circle = Distracted state
     * Breathing animation guides meditation
     */
    private Bitmap generateFlowState(int ratio, int width, int height, long time) {
        Bitmap bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(bitmap);

        // Deep meditation background
        canvas.drawColor(Color.parseColor("#0a0a0a"));

        Paint circlePaint = new Paint();
        circlePaint.setAntiAlias(true);

        float centerX = width / 2.0f;
        float centerY = height / 2.0f;
        float signalStrength = ratio / 100.0f;

        // Breathing animation - golden ratio breathing rhythm
        float breathingPhase = (float)Math.sin((time % 8000) / 8000.0 * 2 * Math.PI) * 0.1f + 1.0f;
        float baseRadius = Math.min(width, height) * 0.25f * breathingPhase;

        // Circle completeness based on Signal/Noise balance
        float completeness = signalStrength;

        if (completeness > 0.8f) {
            // FLOW STATE - Perfect breathing circle
            // Warm gradient (flow temperature)
            RadialGradient flowGradient = new RadialGradient(
                centerX, centerY, baseRadius * 1.5f,
                Color.argb(200, 0, 255, 150), // Center: bright cyan-green
                Color.argb(50, 100, 200, 100), // Edge: warm flow
                Shader.TileMode.CLAMP
            );
            circlePaint.setShader(flowGradient);
            canvas.drawCircle(centerX, centerY, baseRadius, circlePaint);

            // Add flow state glow
            circlePaint.setShader(null);
            circlePaint.setColor(Color.argb(30, 0, 255, 150));
            canvas.drawCircle(centerX, centerY, baseRadius * 1.5f, circlePaint);

        } else {
            // DISTRACTED STATE - Fragmented circle
            circlePaint.setShader(null);

            // Cool gradient (distraction temperature)
            int fragmentCount = (int)((1.0f - completeness) * 8) + 2; // 2-10 fragments

            for (int i = 0; i < fragmentCount; i++) {
                float angle = (i / (float)fragmentCount) * 2 * (float)Math.PI;
                float fragmentX = centerX + (float)Math.cos(angle) * baseRadius * 0.7f;
                float fragmentY = centerY + (float)Math.sin(angle) * baseRadius * 0.7f;
                float fragmentSize = baseRadius * 0.3f * completeness;

                // Fragment color based on distraction level
                int alpha = (int)(completeness * 255);
                circlePaint.setColor(Color.argb(alpha, 255, 100, 50)); // Orange distraction

                canvas.drawCircle(fragmentX, fragmentY, fragmentSize, circlePaint);
            }
        }

        // Add subtle golden ratio guides (meditation aid)
        if (completeness > 0.6f) {
            circlePaint.setColor(Color.argb(20, 255, 255, 255));
            circlePaint.setStrokeWidth(0.5f);
            circlePaint.setStyle(Paint.Style.STROKE);

            // Golden ratio spiral (1.618)
            float goldenRadius = baseRadius * 0.618f;
            canvas.drawCircle(centerX, centerY, goldenRadius, circlePaint);

            circlePaint.setStyle(Paint.Style.FILL);
        }

        return bitmap;
    }

    private String getFlowLevel(int ratio) {
        if (ratio > 85) return "Flow";
        if (ratio > 70) return "Focus";
        if (ratio > 50) return "Drift";
        if (ratio > 30) return "Scatter";
        return "Chaos";
    }
}