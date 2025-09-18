#!/bin/bash

# Build Signal/Noise with automated password entry using expect
# Uses .keystore-credentials for passwords

# Source credentials
source .keystore-credentials

# Kill any existing build processes
pkill -f "npx @bubblewrap" 2>/dev/null
sleep 2

echo "🧹 Cleaning previous builds..."
rm -f app-release-signed.apk
rm -f app-release-bundle.aab

echo "🔨 Building with Bubblewrap using expect..."

# Use expect to automate password entry
/usr/bin/expect <<EOF
set timeout 300
spawn npx @bubblewrap/cli build --skipPwaValidation

# Wait for project regeneration prompt
expect {
    "then you may enter" {
        send "n\r"
    }
}

# Wait for keystore password prompt
expect {
    "Password for the Key Store:" {
        send "$KEYSTORE_PASSWORD\r"
    }
}

# Wait for key password prompt
expect {
    "Password for the Key:" {
        send "$KEY_PASSWORD\r"
    }
}

# Wait for build to complete
expect {
    "Build completed" {
        puts "\n✅ Build completed successfully!"
    }
    "BUILD SUCCESSFUL" {
        puts "\n✅ Gradle build successful!"
    }
    timeout {
        puts "\n⏱️ Build taking longer than expected..."
        exp_continue
    }
    eof {
        puts "\n✅ Build process finished"
    }
}

wait
EOF

echo ""
echo "🔍 Checking build results..."

if [ -f "app-release-signed.apk" ]; then
    echo "✅ APK built successfully!"

    # Copy to Downloads
    cp app-release-signed.apk ~/Downloads/signal-noise-widgets-fixed.apk
    echo "📱 APK copied to ~/Downloads/signal-noise-widgets-fixed.apk"

    if [ -f "app-release-bundle.aab" ]; then
        cp app-release-bundle.aab ~/Downloads/signal-noise-widgets-fixed.aab
        echo "📦 AAB also copied to Downloads"
    fi

    ls -lh ~/Downloads/signal-noise-widgets-fixed.*
else
    echo "❌ Build failed - APK not found"
    echo "Checking for error logs..."
    ls -la app/build/outputs/apk/release/ 2>/dev/null || echo "No release directory"
fi