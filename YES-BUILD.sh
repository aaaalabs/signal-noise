#!/bin/bash

# THE SIMPLEST POSSIBLE BUILD SCRIPT
# Uses yes command to provide all answers

echo "🚀 Building with yes command..."
echo "Password: Singal-Noise2027!! (with typo)"

# Kill any stuck processes
pkill -f "npx @bubblewrap" 2>/dev/null
pkill -f expect 2>/dev/null

# Clean build directory
rm -rf app/build

# Use yes to provide: n, then password twice
yes $'n\nSingal-Noise2027!!\nSingal-Noise2027!!' | npx @bubblewrap/cli build --skipPwaValidation

# Check if APK was created
if [ -f "app/build/outputs/apk/release/app-release-unsigned.apk" ]; then
    echo "✅ APK created successfully!"

    # Copy to Downloads
    TIMESTAMP=$(date +%Y%m%d-%H%M)
    cp app/build/outputs/apk/release/app-release-unsigned.apk ~/Downloads/signal-noise-${TIMESTAMP}.apk

    echo "📱 APK ready at: ~/Downloads/signal-noise-${TIMESTAMP}.apk"
else
    echo "❌ Build failed - no APK created"
    exit 1
fi