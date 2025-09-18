package app.signalnoise.twa.widget;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.widget.RemoteViews;
import app.signalnoise.twa.LauncherActivity;
import app.signalnoise.twa.R;

/**
 * J1 - Pure Zen Number
 * JONY IVE MASTERPIECE: Just the ratio, nothing else
 * Ultimate minimalism - "Design is not just what it looks like, design is how it works"
 * Invisible until ratio is meaningful (>50), pure emotional honesty
 */
public class J1 extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        // CRITICAL: Force immediate Redis fetch for first widget
        RedisDataFetcher.fetchAndUpdateWidgetData(context, "thomas.seiger@gmail.com");

        for (int appWidgetId : appWidgetIds) {
            SharedPreferences prefs = context.getSharedPreferences("signal_noise_widget_data", Context.MODE_PRIVATE);
            int ratio = prefs.getInt("current_ratio", 43);

            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_zen_pure);

            // Jony Ive principle: Only show if meaningful
            if (ratio > 50) {
                views.setTextViewText(R.id.zen_pure_number, String.valueOf(ratio));
                views.setViewVisibility(R.id.zen_pure_number, android.view.View.VISIBLE);

                // Color based on Apple design system
                if (ratio > 80) {
                    views.setTextColor(R.id.zen_pure_number, android.graphics.Color.parseColor("#34C759")); // Apple green
                } else if (ratio > 60) {
                    views.setTextColor(R.id.zen_pure_number, android.graphics.Color.parseColor("#FF9500")); // Apple orange
                } else {
                    views.setTextColor(R.id.zen_pure_number, android.graphics.Color.parseColor("#FFFFFF")); // Neutral
                }
            } else {
                // Show nothing - true to minimalist philosophy
                views.setViewVisibility(R.id.zen_pure_number, android.view.View.INVISIBLE);
            }

            // Add tap-to-open functionality
            Intent launchIntent = new Intent(context, LauncherActivity.class);
            launchIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
            PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, launchIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
            views.setOnClickPendingIntent(R.id.zen_pure_number, pendingIntent);

            appWidgetManager.updateAppWidget(appWidgetId, views);
        }
    }
}