#!/bin/bash

# Signal Wave Widget Production Build Script
# Version 1.1.0

echo "=========================================="
echo "Signal/Noise v1.1.0 - Production Build"
echo "Featuring: Signal Wave Premium Widget"
echo "=========================================="
echo ""

# Navigate to app directory
cd app

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf build/outputs/apk/release/*
rm -rf build/outputs/bundle/release/*

# Build release APK with gradle command
echo "🔨 Building release APK..."
if [ -f "../gradlew" ]; then
    ../gradlew clean assembleRelease
elif [ -f "gradlew" ]; then
    ./gradlew clean assembleRelease
else
    # Use gradle directly
    gradle clean assembleRelease
fi

# Build release bundle for Play Store
echo "📦 Building release bundle (AAB)..."
if [ -f "../gradlew" ]; then
    ../gradlew bundleRelease
elif [ -f "gradlew" ]; then
    ./gradlew bundleRelease
else
    gradle bundleRelease
fi

# Check if builds were successful
if [ -f "build/outputs/apk/release/app-release.apk" ]; then
    echo "✅ APK built successfully!"

    # Copy to Downloads folder
    cp build/outputs/apk/release/app-release.apk ~/Downloads/signal-noise-v1.1.0-signal-wave.apk
    echo "📱 APK copied to ~/Downloads/signal-noise-v1.1.0-signal-wave.apk"
else
    echo "❌ APK build failed"
fi

if [ -f "build/outputs/bundle/release/app-release.aab" ]; then
    echo "✅ Bundle built successfully!"

    # Copy to Downloads folder
    cp build/outputs/bundle/release/app-release.aab ~/Downloads/signal-noise-v1.1.0-signal-wave.aab
    echo "🏪 Bundle copied to ~/Downloads/signal-noise-v1.1.0-signal-wave.aab"
else
    echo "❌ Bundle build failed"
fi

echo ""
echo "=========================================="
echo "Build complete!"
echo ""
echo "What's New in v1.1.0:"
echo "✨ Signal Wave Widget - Beautiful animated productivity visualization"
echo "🌊 60fps wave animations with particle effects"
echo "🎨 Multiple widget sizes (1x1, 2x2, 4x2)"
echo "🤖 AI-powered insights for premium users"
echo "⚡ Battery-optimized real-time updates"
echo ""
echo "Next Steps:"
echo "1. Test the APK on your device"
echo "2. Upload the AAB to Google Play Console"
echo "3. Update release notes with widget features"
echo "=========================================="