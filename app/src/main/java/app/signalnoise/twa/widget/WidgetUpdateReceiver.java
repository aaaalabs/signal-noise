package app.signalnoise.twa.widget;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

public class WidgetUpdateReceiver extends BroadcastReceiver {
    public static final String ACTION_UPDATE_WIDGET = "app.signalnoise.twa.UPDATE_WIDGET";
    public static final String EXTRA_RATIO = "ratio";
    public static final String EXTRA_IS_SIGNAL = "is_signal";

    @Override
    public void onReceive(Context context, Intent intent) {
        if (ACTION_UPDATE_WIDGET.equals(intent.getAction())) {
            int ratio = intent.getIntExtra(EXTRA_RATIO, 0);
            boolean isSignal = intent.getBooleanExtra(EXTRA_IS_SIGNAL, true);

            // Update all widgets
            SignalNoiseWidgetProvider.updateAllWidgets(context, ratio, isSignal);
        }
    }
}