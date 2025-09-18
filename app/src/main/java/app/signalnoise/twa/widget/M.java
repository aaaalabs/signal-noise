package app.signalnoise.twa.widget;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Typeface;
import android.widget.RemoteViews;
import app.signalnoise.twa.R;

/**
 * M - Minimal Apple-Grade Widget
 * Pure typography + color psychology
 * Jony Ive approved: "Less is exponentially more"
 */
public class M extends AppWidgetProvider {
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

            // Generate Apple-grade minimal design
            Bitmap minimal = generateMinimal(ratio, 146, 146);

            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_minimal);

            // Set minimal design as background
            views.setImageViewBitmap(R.id.minimal_field, minimal);

            // Add tap-to-sync
            android.content.Intent syncIntent = new android.content.Intent(context, M.class);
            syncIntent.setAction(android.appwidget.AppWidgetManager.ACTION_APPWIDGET_UPDATE);
            android.app.PendingIntent syncPendingIntent = android.app.PendingIntent.getBroadcast(
                context, appWidgetId + 3000, syncIntent,
                android.app.PendingIntent.FLAG_UPDATE_CURRENT | android.app.PendingIntent.FLAG_IMMUTABLE);
            views.setOnClickPendingIntent(R.id.minimal_field, syncPendingIntent);

            appWidgetManager.updateAppWidget(appWidgetId, views);

        } catch (Exception e) {
            // Apple-grade fallback
            RemoteViews fallback = new RemoteViews(context.getPackageName(), R.layout.widget_sn2x1p);
            fallback.setTextViewText(R.id.widget_ratio, "M");
            appWidgetManager.updateAppWidget(appWidgetId, fallback);
        }
    }

    /**
     * Generate Apple-grade minimal design - pure typography + color psychology
     */
    private Bitmap generateMinimal(int ratio, int width, int height) {
        Bitmap bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(bitmap);

        // Pure black void - Apple minimal
        canvas.drawColor(Color.parseColor("#000000"));

        // Color psychology based on ratio
        int textColor = getAppleColor(ratio);

        Paint textPaint = new Paint();
        textPaint.setAntiAlias(true);
        textPaint.setColor(textColor);
        textPaint.setTypeface(Typeface.create("sans-serif-thin", Typeface.NORMAL));
        textPaint.setTextSize(48);
        textPaint.setTextAlign(Paint.Align.CENTER);

        // Typography-as-art - just the percentage
        String text = ratio + "%";
        float centerX = width / 2.0f;
        float centerY = height / 2.0f + 12; // Optical center adjustment

        canvas.drawText(text, centerX, centerY, textPaint);

        // Subtle signal indicator (only if meaningful)
        if (ratio > 70) {
            textPaint.setTextSize(8);
            textPaint.setColor(Color.argb(80, 255, 255, 255));
            canvas.drawText("Signal", centerX, centerY + 25, textPaint);
        }

        return bitmap;
    }

    private int getAppleColor(int ratio) {
        // Apple color psychology - red to green spectrum
        if (ratio > 80) return Color.parseColor("#34C759"); // Apple green
        if (ratio > 60) return Color.parseColor("#FF9500"); // Apple orange
        if (ratio > 40) return Color.parseColor("#FF9500"); // Apple orange
        return Color.parseColor("#FF3B30"); // Apple red
    }
}