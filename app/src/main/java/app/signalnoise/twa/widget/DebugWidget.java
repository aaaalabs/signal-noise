package app.signalnoise.twa.widget;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.widget.RemoteViews;
import app.signalnoise.twa.R;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

/**
 * Debug widget showing all data sources for troubleshooting
 * Shows where data comes from and why it might not be updating
 */
public class DebugWidget extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateDebugWidget(context, appWidgetManager, appWidgetId);
        }
    }

    private void updateDebugWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_simple_fix);

        // Check ALL possible data sources
        android.content.SharedPreferences prefs1 = context.getSharedPreferences("signal_noise_widget_data", Context.MODE_PRIVATE);
        android.content.SharedPreferences prefs2 = context.getSharedPreferences("SignalNoiseWidget", Context.MODE_PRIVATE);
        android.content.SharedPreferences prefs3 = context.getSharedPreferences("WebViewLocalStorage", Context.MODE_PRIVATE);

        int ratio1 = prefs1.getInt("current_ratio", -1);
        int ratio2 = prefs2.getInt("current_ratio", -1);
        String webRatio = prefs3.getString("android.widget.ratio", "N/A");
        long lastUpdate = prefs1.getLong("last_update", 0);

        // Format debug information
        SimpleDateFormat sdf = new SimpleDateFormat("HH:mm:ss", Locale.US);
        String timeStr = lastUpdate > 0 ? sdf.format(new Date(lastUpdate)) : "Never";

        String debugInfo = String.format(
            "SP1:%d|SP2:%d|WEB:%s|T:%s",
            ratio1, ratio2, webRatio, timeStr
        );

        // Set color based on data availability
        int color;
        if (ratio1 > 0 || ratio2 > 0) {
            color = android.graphics.Color.parseColor("#00ff88"); // Green - has data
        } else if (!webRatio.equals("N/A")) {
            color = android.graphics.Color.parseColor("#ffaa00"); // Orange - web data only
        } else {
            color = android.graphics.Color.parseColor("#ff4444"); // Red - no data
        }

        views.setTextViewText(R.id.text, debugInfo);
        views.setTextColor(R.id.text, color);

        appWidgetManager.updateAppWidget(appWidgetId, views);
    }
}