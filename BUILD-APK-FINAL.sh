#!/bin/bash

# ============================================
# WORKING APK BUILD SCRIPT - GRADLE DIRECT
# ============================================
# This bypasses Bubblewrap's interactive prompts
# Password: Singal-Noise2027!! (intentional typo!)
# ============================================

echo "🚀 Building Signal/Noise APK - STABLE BATTERY-SAFE v0.7.3"
echo "✅ FIXED: Now using thomas.seiger@gmail.com for live Redis data (60% ratio)"
echo "🔧 FIXED: AlarmManager conflicts - only triggering widget schedules next alarm"
echo "🔋 FIXED: Conservative refresh rates to prevent crashes (5min/2min/10min)"
echo "⚡ ADDED: 30-second circuit breaker to prevent API overload"
echo "✨ Widgets: SN2x1R (5min), SN1x1F (2min), SN2x1P (10min), SN4x1R, SN3x1R, SN2x1C"

# Set up Java environment
export JAVA_HOME=/Users/libra/.bubblewrap/jdk/jdk-17.0.11+9/Contents/Home

# Clean previous builds
echo "Cleaning previous builds..."
rm -rf app/build

# Build with gradle directly
echo "Building APK with gradle..."
./gradlew -Pandroid.injected.signing.store.file=/Users/libra/GitHub/_quicks/_signalnoise/signal-noise/android.keystore \
         -Pandroid.injected.signing.store.password="Singal-Noise2027!!" \
         -Pandroid.injected.signing.key.alias=android \
         -Pandroid.injected.signing.key.password="Singal-Noise2027!!" \
         assembleRelease

# Check if build succeeded
if [ -f "app/build/outputs/apk/release/app-release.apk" ]; then
    echo "✅ BUILD SUCCESSFUL!"

    # Copy to Downloads with timestamp
    TIMESTAMP=$(date +%Y%m%d-%H%M)
    cp app/build/outputs/apk/release/app-release.apk ~/Downloads/signal-noise-${TIMESTAMP}.apk

    echo "📱 APK saved to: ~/Downloads/signal-noise-${TIMESTAMP}.apk"
    echo ""
    echo "🎯 WIDGET BATCH v0.7.2 READY FOR TESTING!"
    echo "✅ SHOULD NOW SHOW: 60% ratio from Tom's real data"
    echo "🔧 FIXED: Last widget added should now auto-refresh properly"
    echo "📋 Test Plan:"
    echo "  1. Install APK: adb install ~/Downloads/signal-noise-${TIMESTAMP}.apk"
    echo "  2. Add ONE widget first, verify it updates"
    echo "  3. Add more widgets, verify LAST one updates too"
    echo "  4. Verify auto-refresh: 30s (SN2x1R), 10s (SN1x1F), 45s (SN2x1P)"
else
    echo "❌ Build failed - check error messages above"
    exit 1
fi