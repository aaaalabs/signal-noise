#!/bin/bash

echo "🚀 Building Signal/Noise with widgets and logging..."

# Use printf to provide all answers
printf "n\nSingal-Noise2027!!\nSingal-Noise2027!!\n" | npx @bubblewrap/cli build --skipPwaValidation

if [ -f "app/build/outputs/apk/release/app-release-unsigned.apk" ]; then
    echo "✅ APK built successfully"

    # Sign the APK
    echo "🔐 Signing APK..."
    /Users/libra/.bubblewrap/jdk/jdk-17.0.11+9/Contents/Home/bin/jarsigner \
        -verbose \
        -sigalg SHA256withRSA \
        -digestalg SHA-256 \
        -keystore ./android.keystore \
        -storepass 'Singal-Noise2027!!' \
        app/build/outputs/apk/release/app-release-unsigned.apk \
        android

    # Copy to Downloads
    cp app/build/outputs/apk/release/app-release-unsigned.apk ~/Downloads/signal-noise-with-logging.apk

    if [ -f "app/build/outputs/bundle/release/app-release.aab" ]; then
        cp app/build/outputs/bundle/release/app-release.aab ~/Downloads/signal-noise-with-logging.aab
    fi

    echo "✅ Build complete!"
    echo "📱 APK: ~/Downloads/signal-noise-with-logging.apk"
    echo ""
    echo "📝 Logging enabled for:"
    echo "   - MinimalTestWidget (TAG: MinimalTestWidget)"
    echo "   - SignalWaveWidgetProvider (TAG: SignalWave)"
    echo ""
    echo "To view logs after installing:"
    echo "   adb logcat | grep -E '(MinimalTestWidget|SignalWave)'"
else
    echo "❌ Build failed"
fi