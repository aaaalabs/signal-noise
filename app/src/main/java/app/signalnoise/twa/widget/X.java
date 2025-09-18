package app.signalnoise.twa.widget;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.SharedPreferences;
import android.widget.RemoteViews;
import app.signalnoise.twa.R;

/**
 * X - eXceptional gradient masterpiece
 * KWGT-inspired sophistication with native Android typography
 * Dynamic backgrounds + perfect font rendering
 */
public class X extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            SharedPreferences prefs = context.getSharedPreferences("signal_noise_widget_data", Context.MODE_PRIVATE);
            int ratio = prefs.getInt("current_ratio", 43);

            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_exceptional);

            views.setTextViewText(R.id.x_ratio, ratio + "%");

            // Dynamic visual state
            String state = getExceptionalState(ratio);
            views.setTextViewText(R.id.x_state, state);

            // Productivity level indicator
            String level = ratio > 80 ? "Exceptional" : ratio > 60 ? "Strong" : ratio > 40 ? "Moderate" : "Weak";
            views.setTextViewText(R.id.x_level, level);

            appWidgetManager.updateAppWidget(appWidgetId, views);
        }
        RedisDataFetcher.fetchAndUpdateWidgetData(context, "thomas.seiger@gmail.com");
    }

    private String getExceptionalState(int ratio) {
        if (ratio > 90) return "🔥 Peak";
        if (ratio > 80) return "⚡ Flow";
        if (ratio > 60) return "🎯 Focus";
        if (ratio > 40) return "🌀 Drift";
        return "💫 Scatter";
    }
}