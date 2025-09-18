package app.signalnoise.twa.widget;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.SharedPreferences;
import android.widget.RemoteViews;
import app.signalnoise.twa.R;

public class T extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            SharedPreferences prefs = context.getSharedPreferences("signal_noise_widget_data", Context.MODE_PRIVATE);
            int ratio = prefs.getInt("current_ratio", 43);
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_sn2x1p);
            views.setTextViewText(R.id.widget_ratio, ratio + "%");
            views.setTextViewText(R.id.widget_progress, "Signal Rate");
            appWidgetManager.updateAppWidget(appWidgetId, views);
        }
        RedisDataFetcher.fetchAndUpdateWidgetData(context, "thomas.seiger@gmail.com");
    }
}
