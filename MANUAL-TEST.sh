#!/bin/bash

echo "====================================="
echo "MANUAL TEST BUILD SCRIPT"
echo "====================================="
echo ""
echo "Password is: Singal-Noise2027!! (with intentional typo!)"
echo ""

# Kill any stuck processes
echo "Cleaning up stuck processes..."
pkill -f "npx @bubblewrap" 2>/dev/null
pkill -f expect 2>/dev/null

# Clean build directory
echo "Cleaning build directory..."
rm -rf app/build

echo ""
echo "====================================="
echo "Option 1: Try direct gradle build (no prompts)"
echo "====================================="
echo "Press Enter to try gradle build or Ctrl+C to skip..."
read

export JAVA_HOME=/Users/libra/.bubblewrap/jdk/jdk-17.0.11+9/Contents/Home
./gradlew -Pandroid.injected.signing.store.file=/Users/libra/GitHub/_quicks/_signalnoise/signal-noise/android.keystore \
         -Pandroid.injected.signing.store.password="Singal-Noise2027!!" \
         -Pandroid.injected.signing.key.alias=android \
         -Pandroid.injected.signing.key.password="Singal-Noise2027!!" \
         assembleRelease

if [ -f "app/build/outputs/apk/release/app-release.apk" ]; then
    echo "✅ SUCCESS! APK created with gradle!"
    cp app/build/outputs/apk/release/app-release.apk ~/Downloads/signal-noise-gradle-$(date +%H%M).apk
    echo "Copied to ~/Downloads/"
    exit 0
fi

echo ""
echo "====================================="
echo "Option 2: Try manual bubblewrap (you type password)"
echo "====================================="
echo "When prompted:"
echo "1. Type 'n' for regenerate prompt"
echo "2. Type 'Singal-Noise2027!!' for both password prompts"
echo ""
echo "Press Enter to start..."
read

npx @bubblewrap/cli build --skipPwaValidation

if [ -f "app/build/outputs/apk/release/app-release-signed.apk" ]; then
    echo "✅ SUCCESS! APK created with bubblewrap!"
    cp app/build/outputs/apk/release/app-release-signed.apk ~/Downloads/signal-noise-bubblewrap-$(date +%H%M).apk
    echo "Copied to ~/Downloads/"
fi