#!/bin/bash

echo "🔍 ANDROID 15 WIDGET DEBUGGING SCRIPT"
echo "=====================================s"

echo ""
echo "📱 DEVICE INFO:"
adb shell getprop ro.build.version.release
adb shell getprop ro.build.version.sdk

echo ""
echo "🔍 WIDGET REGISTRATION CHECK:"
adb shell dumpsys appwidget | grep -A15 "signalnoise"

echo ""
echo "⚠️  WIDGET ERRORS (last 50 lines):"
adb logcat -d | grep -i -E "(can.*load|widget.*error|remoteviews.*error)" | tail -50

echo ""
echo "🔧 REMOTEVIEWS INFLATION ERRORS:"
adb logcat -d | grep -i -E "(remoteviews|inflation)" | tail -20

echo ""
echo "📊 SIGNALNOISE SPECIFIC LOGS:"
adb logcat -d | grep -i "signalnoise" | tail -20

echo ""
echo "🎯 LIVE MONITORING (run in separate terminal):"
echo "adb logcat -c && adb logcat | grep -E '(signalnoise|RemoteViews|widget)'"

echo ""
echo "📋 MANUAL TESTS:"
echo "1. Install APK: ~/Downloads/signal-noise-android15-debug-20250918-2130.apk"
echo "2. Test T1 Minimal - should show 'TEST'"
echo "3. Test T2 Static - should show '75%' + '3 signal'"
echo "4. Test W4 Winner - check if 'Can't load widget'"
echo "5. Report which widgets work vs fail"