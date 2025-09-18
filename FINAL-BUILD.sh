#!/bin/bash

# Signal/Noise APK Build - FINAL WORKING VERSION
# PASSWORD: Singal-Noise2027!! (with intentional typo "Singal")

echo "================================================"
echo "Signal/Noise FINAL Build Script"
echo "Password: Singal-Noise2027!! (YES with typo!)"
echo "================================================"

# Clean old builds
rm -rf app/build 2>/dev/null

# Use printf to pipe passwords directly - this worked before!
echo "🚀 Building APK..."
printf "n\nSingal-Noise2027!!\nSingal-Noise2027!!\n" | npx @bubblewrap/cli build --skipPwaValidation

# Check if APK was created
if [ -f "app/build/outputs/apk/release/app-release-unsigned.apk" ]; then
    echo "✅ APK created!"

    # Sign it
    echo "🔏 Signing APK..."
    /Users/libra/.bubblewrap/jdk/jdk-17.0.11+9/Contents/Home/bin/jarsigner \
        -verbose \
        -sigalg SHA256withRSA \
        -digestalg SHA-256 \
        -keystore android.keystore \
        -storepass "Singal-Noise2027!!" \
        app/build/outputs/apk/release/app-release-unsigned.apk \
        android

    # Copy to Downloads
    TIMESTAMP=$(date +%Y%m%d-%H%M)
    cp app/build/outputs/apk/release/app-release-unsigned.apk ~/Downloads/signal-noise-${TIMESTAMP}.apk

    echo "================================================"
    echo "✅ SUCCESS! APK ready in Downloads"
    echo "📱 ~/Downloads/signal-noise-${TIMESTAMP}.apk"
    echo "================================================"
else
    echo "❌ Build failed - no APK created"
    exit 1
fi