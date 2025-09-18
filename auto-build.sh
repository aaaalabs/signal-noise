#!/bin/bash

echo "🚀 Building Signal/Noise with automated password handling..."

# Load credentials
source .keystore-credentials

# Use expect to handle all prompts
expect << EOF
set timeout 300
spawn npx @bubblewrap/cli build --skipPwaValidation

expect {
    "*would you like to regenerate your project*" {
        send "n\r"
        exp_continue
    }
    "Password for the Key Store:" {
        send "$KEYSTORE_PASSWORD\r"
        exp_continue
    }
    "Password for *" {
        send "$KEY_PASSWORD\r"
        exp_continue
    }
    "BUILD SUCCESSFUL" {
        puts "\n✅ Build completed successfully!"
    }
    eof
}
wait
EOF

# Sign and copy to Downloads
if [ -f "app/build/outputs/apk/release/app-release-unsigned.apk" ]; then
    echo "✅ APK built successfully"

    # Sign it
    echo "$KEYSTORE_PASSWORD" | /Users/libra/.bubblewrap/jdk/jdk-17.0.11+9/Contents/Home/bin/jarsigner \
        -verbose \
        -sigalg SHA256withRSA \
        -digestalg SHA-256 \
        -keystore ./android.keystore \
        -storepass:env KEYSTORE_PASSWORD \
        app/build/outputs/apk/release/app-release-unsigned.apk \
        android

    # Copy to Downloads
    cp app/build/outputs/apk/release/app-release-unsigned.apk ~/Downloads/signal-noise-debug.apk
    cp app/build/outputs/bundle/release/app-release.aab ~/Downloads/signal-noise-debug.aab 2>/dev/null

    echo "📱 APK copied to ~/Downloads/"
    echo ""
    echo "✅ Build complete with logging enabled:"
    echo "   - MinimalTestWidget"
    echo "   - SignalWaveWidgetProvider"
else
    echo "❌ Build failed"
fi