/*
 * Copyright 2020 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package app.signalnoise.twa;

import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.ActivityInfo;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import app.signalnoise.twa.widget.SignalNoiseWidgetProvider;



public class LauncherActivity
        extends com.google.androidbrowserhelper.trusted.LauncherActivity {
    

    

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Setting an orientation crashes the app due to the transparent background on Android 8.0
        // Oreo and below. We only set the orientation on Oreo and above. This only affects the
        // splash screen and Chrome will still respect the orientation.
        // See https://github.com/GoogleChromeLabs/bubblewrap/issues/496 for details.
        if (Build.VERSION.SDK_INT > Build.VERSION_CODES.O) {
            setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_USER_PORTRAIT);
        } else {
            setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED);
        }
    }

    @Override
    protected Uri getLaunchingUrl() {
        // Check if launched from a shortcut with data
        Intent intent = getIntent();
        if (intent != null && intent.getData() != null) {
            // Return the shortcut URL directly
            return intent.getData();
        }

        // Otherwise return the default launch URL
        return super.getLaunchingUrl();
    }

    @Override
    protected void onResume() {
        super.onResume();

        // When app is opened from widget, simulate a ratio update
        // This helps sync the widget with the current app state
        try {
            // Get the last known ratio from preferences (if any)
            SharedPreferences prefs = getSharedPreferences("SignalNoiseWidget", MODE_PRIVATE);
            int currentRatio = prefs.getInt("current_ratio", 80);

            // You can update this with a more recent value if needed
            // For now, just trigger a widget refresh with current stored value
            SignalNoiseWidgetProvider.updateAllWidgets(this, currentRatio, currentRatio >= 50);
        } catch (Exception e) {
            // Widget update failed, that's OK
        }
    }
}
