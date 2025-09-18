#!/bin/bash

echo "=========================================="
echo "Signal/Noise v1.1.1 - Automated Build"
echo "Widget Fix Release"
echo "=========================================="
echo ""

# Load keystore credentials from secure file
if [ -f ".keystore-credentials" ]; then
    source .keystore-credentials
    echo "✅ Loaded keystore credentials"
else
    echo "❌ Keystore credentials file not found!"
    echo "   Please ensure .keystore-credentials exists"
    exit 1
fi

# Use expect to automate the interactive build
expect << EOF
set timeout 300

spawn npx @bubblewrap/cli build

# Answer "no" to regeneration prompt
expect {
    "would you like to regenerate" {
        send "n\r"
    }
}

# Enter keystore password
expect {
    "Password for the Key Store:" {
        send "$KEYSTORE_PASSWORD\r"
    }
}

# Enter key password
expect {
    "Password for the Key:" {
        send "$KEY_PASSWORD\r"
    }
}

# Wait for build to complete
expect eof
EOF

echo ""
echo "=========================================="
echo "Build completed!"
echo ""

# Check if APK was built
if [ -f "app/build/outputs/apk/release/app-release.apk" ]; then
    echo "✅ APK built successfully!"

    # Get file size
    APK_SIZE=$(ls -lh app/build/outputs/apk/release/app-release.apk | awk '{print $5}')
    echo "📦 APK Size: $APK_SIZE"

    # Copy to Downloads with new version name
    cp app/build/outputs/apk/release/app-release.apk ~/Downloads/signal-noise-v1.1.1-widget-fixed.apk
    echo "✅ Copied to ~/Downloads/signal-noise-v1.1.1-widget-fixed.apk"
else
    echo "❌ APK build failed"
    exit 1
fi

# Check if AAB was built
if [ -f "app/build/outputs/bundle/release/app-release.aab" ]; then
    echo "✅ Bundle built successfully!"

    # Copy to Downloads
    cp app/build/outputs/bundle/release/app-release.aab ~/Downloads/signal-noise-v1.1.1-widget-fixed.aab
    echo "✅ Copied to ~/Downloads/signal-noise-v1.1.1-widget-fixed.aab"
else
    echo "⚠️  Bundle not found (may need separate build)"
fi

echo ""
echo "=========================================="
echo "Ready for deployment!"
echo "=========================================="