#!/bin/bash

# Build script for fixed widgets
# Automates password entry for keystore

# Load credentials
source .keystore-credentials

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -f app-release-signed.apk
rm -f app/build/outputs/apk/release/*.apk

# Build with automated password entry
echo "🔨 Building APK with fixed widgets..."
{
  echo "n"                      # Don't regenerate project
  sleep 1
  echo "$KEYSTORE_PASSWORD"     # Keystore password
  sleep 1
  echo "$KEY_PASSWORD"          # Key password
} | npx @bubblewrap/cli build --skipPwaValidation

# Check if build succeeded
if [ -f "app-release-signed.apk" ]; then
    echo "✅ Build successful!"

    # Copy to Downloads
    echo "📱 Copying to Downloads..."
    cp app-release-signed.apk ~/Downloads/signal-noise-fixed-widgets.apk

    # Also copy AAB if it exists
    if [ -f "app-release-bundle.aab" ]; then
        cp app-release-bundle.aab ~/Downloads/signal-noise-fixed-widgets.aab
        echo "📦 AAB also copied to Downloads"
    fi

    echo "✨ Fixed widget APK ready in ~/Downloads/signal-noise-fixed-widgets.apk"

    # Show file info
    ls -lh ~/Downloads/signal-noise-fixed-widgets.*
else
    echo "❌ Build failed - check output above"
    exit 1
fi