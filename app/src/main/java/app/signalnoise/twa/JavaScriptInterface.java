package app.signalnoise.twa;

import android.content.Context;
import android.content.Intent;
import android.webkit.JavascriptInterface;
import android.util.Log;

public class JavaScriptInterface {
    private Context context;

    public JavaScriptInterface(Context context) {
        this.context = context;
    }

    @JavascriptInterface
    public void updateWidget(int ratio, boolean isSignal) {
        try {
            Log.d("JSInterface", "Updating widget with ratio: " + ratio);

            // Send broadcast to update widget
            Intent intent = new Intent("app.signalnoise.twa.UPDATE_WIDGET");
            intent.putExtra("ratio", ratio);
            intent.putExtra("is_signal", isSignal);
            context.sendBroadcast(intent);
        } catch (Exception e) {
            Log.e("JSInterface", "Error updating widget: " + e.getMessage());
        }
    }

    @JavascriptInterface
    public void updateRatio(int ratio) {
        updateWidget(ratio, ratio >= 50);
    }
}