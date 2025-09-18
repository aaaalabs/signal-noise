#!/bin/bash

echo "📱 Signal/Noise Widget Debugger"
echo "================================"
echo ""
echo "Starting logcat monitoring for widget errors..."
echo "Try adding a widget to see the error messages."
echo ""

# Monitor for any widget-related errors
/Users/libra/.bubblewrap/android_sdk/platform-tools/adb logcat -c
/Users/libra/.bubblewrap/android_sdk/platform-tools/adb logcat | grep -E -i "(widget|appwidget|signalnoise|RemoteViews|signal.*noise|app\.signalnoise|Exception.*widget)"
