#!/bin/bash

echo "🚀 Building Signal/Noise TWA with Widget Logging..."

# Use expect to auto-answer prompts
expect << 'EOF'
set timeout 300
spawn npx @bubblewrap/cli build --skipPwaValidation

# Handle checksum prompt
expect {
    "*would you like to regenerate your project*" {
        send "n\r"
        exp_continue
    }
    "BUILD SUCCESSFUL" {
        puts "\n✅ Build completed successfully!"
    }
    "BUILD FAILED" {
        puts "\n❌ Build failed!"
        exit 1
    }
    eof {
        puts "\n✅ Build process completed"
    }
}
wait
EOF

# Check if unsigned APK was created
if [ -f "app/build/outputs/apk/release/app-release-unsigned.apk" ]; then
    echo "📦 Unsigned APK created successfully"

    # Sign the APK
    echo "🔐 Signing APK..."

    # Load credentials
    source .keystore-credentials

    # Use expect to handle password prompts
    expect << EOF
set timeout 60
spawn /Users/libra/.bubblewrap/jdk/jdk-17.0.11+9/Contents/Home/bin/jarsigner \
    -verbose \
    -sigalg SHA256withRSA \
    -digestalg SHA-256 \
    -keystore ./android.keystore \
    app/build/outputs/apk/release/app-release-unsigned.apk \
    android

expect "Enter Passphrase for keystore:" {
    send "$KEYSTORE_PASSWORD\r"
}

expect eof
wait
EOF

    # Create signed copy
    cp app/build/outputs/apk/release/app-release-unsigned.apk app-release-signed-v1.1.5.apk

    echo "✅ APK signed: app-release-signed-v1.1.5.apk"

    # Copy to Downloads
    cp app-release-signed-v1.1.5.apk ~/Downloads/signal-noise-widget-debug.apk
    echo "📱 APK copied to ~/Downloads/signal-noise-widget-debug.apk"

    # Build AAB
    echo "📦 Building AAB..."
    if [ -f "app/build/outputs/bundle/release/app-release.aab" ]; then
        cp app/build/outputs/bundle/release/app-release.aab ~/Downloads/signal-noise-widget-debug.aab
        echo "✅ AAB copied to ~/Downloads/signal-noise-widget-debug.aab"
    fi

    echo ""
    echo "✅ Build complete! Widget logging enabled in:"
    echo "   - MinimalTestWidget (TAG: MinimalTestWidget)"
    echo "   - SignalWaveWidgetProvider (TAG: SignalWave)"
    echo ""
    echo "📱 To install and view logs:"
    echo "   adb install ~/Downloads/signal-noise-widget-debug.apk"
    echo "   adb logcat | grep -E '(MinimalTestWidget|SignalWave)'"
else
    echo "❌ Build failed - no unsigned APK found"
    exit 1
fi