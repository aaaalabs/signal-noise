#!/bin/bash

# Signal/Noise APK Build - WORKING VERSION
# Uses the CORRECT password: Singal-Noise2027!! (YES, "Singal" not "Signal")

echo "================================================"
echo "Signal/Noise APK Builder - RELIABLE VERSION"
echo "================================================"
echo ""
echo "IMPORTANT: Password is 'Singal-Noise2027!!' with intentional typo!"
echo ""

# Step 1: Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf app/build 2>/dev/null
rm -f /tmp/build-android.exp 2>/dev/null

# Step 2: Create expect script with CORRECT password
echo "📝 Creating expect script with CORRECT password..."
cat > /tmp/build-android.exp << 'EOF'
#!/usr/bin/expect -f
set timeout 30

# THE CORRECT PASSWORD WITH TYPO
set password "Singal-Noise2027!!"

spawn npx @bubblewrap/cli build --skipPwaValidation

expect {
    "regenerate" {
        send "n\r"
        exp_continue
    }
    "Y/n" {
        send "n\r"
        exp_continue
    }
    "Password for the Key Store:" {
        send "$password\r"
        exp_continue
    }
    "Password for android:" {
        send "$password\r"
        exp_continue
    }
    "Password for the Key:" {
        send "$password\r"
        exp_continue
    }
    "BUILD SUCCESSFUL" {
        puts "\n✅ Build completed successfully!"
    }
    "BUILD FAILED" {
        puts "\n❌ Build failed!"
        exit 1
    }
    timeout {
        puts "\n⏱️ Build timed out - checking if APK was created anyway..."
    }
    eof
}
EOF

chmod +x /tmp/build-android.exp

# Step 3: Run the build
echo "🚀 Starting build with password: Singal-Noise2027!!"
echo "================================================"
/tmp/build-android.exp

# Step 4: Check if APK was created
if [ -f "app/build/outputs/apk/release/app-release-unsigned.apk" ]; then
    echo ""
    echo "✅ APK created successfully!"

    # Step 5: Sign the APK
    echo "🔏 Signing APK with jarsigner..."
    /Users/libra/.bubblewrap/jdk/jdk-17.0.11+9/Contents/Home/bin/jarsigner \
        -verbose \
        -sigalg SHA256withRSA \
        -digestalg SHA-256 \
        -keystore android.keystore \
        -storepass "Singal-Noise2027!!" \
        app/build/outputs/apk/release/app-release-unsigned.apk \
        android

    # Step 6: Copy to Downloads
    TIMESTAMP=$(date +%Y%m%d-%H%M%S)
    FILENAME="signal-noise-${TIMESTAMP}.apk"
    cp app/build/outputs/apk/release/app-release-unsigned.apk ~/Downloads/${FILENAME}

    echo ""
    echo "================================================"
    echo "✅ BUILD COMPLETE!"
    echo "================================================"
    echo "📱 APK Location: ~/Downloads/${FILENAME}"
    echo "📦 Size: $(ls -lh ~/Downloads/${FILENAME} | awk '{print $5}')"
    echo ""
    echo "To install on connected device:"
    echo "adb install -r ~/Downloads/${FILENAME}"
    echo "================================================"
else
    echo ""
    echo "❌ Build failed - APK not created"
    echo "Check app/build/outputs/ for error logs"
    exit 1
fi