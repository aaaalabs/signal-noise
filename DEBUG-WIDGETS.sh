#!/bin/bash

echo "====================================="
echo "WIDGET DEBUG & DATA SYNC SCRIPT"
echo "====================================="
echo ""

# Check if device is connected
if ! adb devices | grep -q "device$"; then
    echo "❌ No Android device connected via USB"
    echo "Please connect your device and enable USB debugging"
    exit 1
fi

echo "✅ Device connected"
echo ""

# Function to update SharedPreferences via ADB
update_widget_data() {
    local ratio=$1
    echo "📝 Setting widget ratio to: $ratio%"

    # Method 1: Using am broadcast
    adb shell "am broadcast -a app.signalnoise.twa.UPDATE_WIDGET --ei ratio $ratio" 2>/dev/null

    # Method 2: Direct SharedPreferences update (requires root or app debug mode)
    # Note: This won't work on production devices
    # adb shell "echo '<?xml version=\"1.0\" encoding=\"utf-8\" standalone=\"yes\" ?><map><int name=\"current_ratio\" value=\"$ratio\" /></map>' > /data/data/app.signalnoise.twa/shared_prefs/signal_noise_widget_data.xml" 2>/dev/null

    echo "✅ Broadcast sent"
}

# Function to check SharedPreferences
check_shared_prefs() {
    echo "🔍 Checking SharedPreferences..."

    # Try to dump app info
    adb shell "dumpsys package app.signalnoise.twa | grep -A5 sharedUser" 2>/dev/null

    # Check if we can access the app's data (only works on debug builds)
    adb shell "run-as app.signalnoise.twa ls -la shared_prefs/" 2>/dev/null

    if [ $? -eq 0 ]; then
        echo "📂 SharedPreferences files found:"
        adb shell "run-as app.signalnoise.twa ls shared_prefs/"

        # Try to read the content
        echo ""
        echo "📄 Content of signal_noise_widget_data.xml:"
        adb shell "run-as app.signalnoise.twa cat shared_prefs/signal_noise_widget_data.xml" 2>/dev/null || echo "Cannot read (not debug build)"
    else
        echo "⚠️ Cannot access SharedPreferences (app not debuggable)"
    fi
}

# Function to monitor widget updates in real-time
monitor_widgets() {
    echo "📱 Monitoring widget updates (Ctrl+C to stop)..."
    adb logcat -c  # Clear previous logs
    adb logcat | grep -E "WorkingWidget|DebugWidget|DataPolling|SharedPref|widget" --color=always
}

# Function to extract Chrome localStorage
extract_localstorage() {
    echo "🌐 Attempting to extract Chrome localStorage..."

    # This only works if the app is debuggable
    adb shell "run-as app.signalnoise.twa ls app_chrome/Default/" 2>/dev/null

    if [ $? -eq 0 ]; then
        echo "✅ Chrome data directory found"

        # Try to find localStorage
        adb shell "run-as app.signalnoise.twa find app_chrome -name '*localStorage*' -o -name '*Local Storage*'" 2>/dev/null
    else
        echo "⚠️ Cannot access Chrome data (app not debuggable)"
    fi
}

# Function to trigger widget update
trigger_update() {
    echo "🔄 Triggering widget update..."

    # Send APPWIDGET_UPDATE broadcast
    adb shell "am broadcast -a android.appwidget.action.APPWIDGET_UPDATE -n app.signalnoise.twa/.widget.WorkingWidget"
    adb shell "am broadcast -a android.appwidget.action.APPWIDGET_UPDATE -n app.signalnoise.twa/.widget.DebugWidget"

    echo "✅ Update broadcasts sent"
}

# Main menu
while true; do
    echo ""
    echo "====================================="
    echo "Choose an action:"
    echo "1. Update widget data (set ratio)"
    echo "2. Check SharedPreferences"
    echo "3. Extract localStorage from Chrome"
    echo "4. Trigger widget update"
    echo "5. Monitor widget logs (real-time)"
    echo "6. Install debug APK"
    echo "0. Exit"
    echo "====================================="
    read -p "Enter choice: " choice

    case $choice in
        1)
            read -p "Enter ratio value (0-100): " ratio
            update_widget_data $ratio
            ;;
        2)
            check_shared_prefs
            ;;
        3)
            extract_localstorage
            ;;
        4)
            trigger_update
            ;;
        5)
            monitor_widgets
            ;;
        6)
            if [ -f ~/Downloads/signal-noise-*.apk ]; then
                latest_apk=$(ls -t ~/Downloads/signal-noise-*.apk | head -1)
                echo "📦 Installing: $latest_apk"
                adb install -r "$latest_apk"
            else
                echo "❌ No APK found in ~/Downloads/"
            fi
            ;;
        0)
            echo "👋 Goodbye!"
            exit 0
            ;;
        *)
            echo "❌ Invalid choice"
            ;;
    esac
done