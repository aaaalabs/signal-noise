#!/bin/bash

# Signal/Noise APK Build Script - WORKING VERSION
# This script ACTUALLY WORKS for building the Android APK

echo "================================================"
echo "Signal/Noise APK Builder v1.0"
echo "================================================"

# Step 1: Clean any existing builds
echo "🧹 Cleaning old builds..."
rm -rf app/build 2>/dev/null

# Step 2: Create a simple expect wrapper for the build
echo "🔧 Creating build wrapper..."
cat > /tmp/build-apk.exp << 'EOF'
#!/usr/bin/expect -f
set timeout 300

spawn npx @bubblewrap/cli build --skipPwaValidation

expect {
    "would you like to regenerate" {
        send "n\r"
        exp_continue
    }
    "Password for the Key Store:" {
        send "Singal-Noise2027!!\r"
        exp_continue
    }
    "Password for android:" {
        send "Singal-Noise2027!!\r"
        exp_continue
    }
    eof
}
EOF

chmod +x /tmp/build-apk.exp

# Step 3: Run the build
echo "🚀 Building APK..."
/tmp/build-apk.exp

# Step 4: Check if build succeeded
if [ -f "app/build/outputs/apk/release/app-release-unsigned.apk" ]; then
    echo "✅ Build successful!"

    # Step 5: Sign the APK
    echo "🔏 Signing APK..."
    /Users/libra/.bubblewrap/jdk/jdk-17.0.11+9/Contents/Home/bin/jarsigner \
        -verbose \
        -sigalg SHA256withRSA \
        -digestalg SHA-256 \
        -keystore android.keystore \
        -storepass "Singal-Noise2027!!" \
        app/build/outputs/apk/release/app-release-unsigned.apk \
        android 2>&1 | tail -3

    # Step 6: Copy to Downloads with timestamp
    TIMESTAMP=$(date +%Y%m%d-%H%M%S)
    cp app/build/outputs/apk/release/app-release-unsigned.apk ~/Downloads/signal-noise-${TIMESTAMP}.apk

    echo ""
    echo "================================================"
    echo "✅ BUILD COMPLETE!"
    echo "================================================"
    echo "📱 APK: ~/Downloads/signal-noise-${TIMESTAMP}.apk"
    echo "📦 Size: $(ls -lh ~/Downloads/signal-noise-${TIMESTAMP}.apk | awk '{print $5}')"
    echo ""
    echo "To install on device:"
    echo "adb install -r ~/Downloads/signal-noise-${TIMESTAMP}.apk"
    echo "================================================"
else
    echo "❌ Build failed - no APK generated"
    echo "Check app/build/outputs/ for error logs"
    exit 1
fi