#!/bin/bash

# Widget Log Capture Script
ADB="/Users/libra/.bubblewrap/android_sdk/platform-tools/adb"
OUTPUT_FILE="widget-debug-log.txt"

echo "📱 Widget Debug Log Capture"
echo "==========================="
echo ""

# Check device
echo "Checking device connection..."
$ADB devices
echo ""

# Clear old logs
$ADB logcat -c
echo "Cleared old logs. Now please:"
echo "1. Add the Signal Wave widget to your home screen"
echo "2. Wait for it to show the error"
echo "3. Press Enter here when done..."
read -p ""

echo "Capturing logs..."

# Capture all relevant logs
{
    echo "====== WIDGET DEBUG LOG ======"
    echo "Date: $(date)"
    echo "=============================="
    echo ""

    echo "===== WIDGET ERRORS ====="
    $ADB logcat -d | grep -E "SignalWave|AppWidget|RemoteViews|app.signalnoise" | grep -E "Error|Exception|Failed|Can't"
    echo ""

    echo "===== ALL WIDGET ACTIVITY ====="
    $ADB logcat -d | grep -E "SignalWave|widget.*signalnoise|app.signalnoise.*widget"
    echo ""

    echo "===== CRASH INFO ====="
    $ADB logcat -d -b crash | grep -A 10 -B 2 "app.signalnoise"
    echo ""

    echo "===== FULL SIGNALNOISE LOGS (Last 200 lines) ====="
    $ADB logcat -d | grep "app.signalnoise" | tail -200
} > "$OUTPUT_FILE" 2>&1

echo ""
echo "✅ Logs saved to: $OUTPUT_FILE"
echo ""
echo "📋 To share with Claude, run:"
echo "   cat widget-debug-log.txt | head -100"
echo ""
echo "Or upload the full file if needed."