#!/bin/bash

echo "Building Signal/Noise v1.2.1 with widget data fix..."

# Use expect to handle password prompts
expect -c '
set timeout 300
spawn npx @bubblewrap/cli build --skipPwaValidation

expect {
    "regenerate your" {
        expect "(Y/n)"
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
    "Password for the Key:" {
        send "Singal-Noise2027!!\r"
        exp_continue
    }
    "BUILD SUCCESSFUL" {
        puts "\nBuild completed successfully!"
    }
    "BUILD FAILED" {
        puts "\nBuild failed!"
        exit 1
    }
    eof
}
'

echo "Copying APK to Downloads..."
cp app/build/outputs/apk/release/app-release-unsigned.apk ~/Downloads/signal-noise-v1.2.1-widget-fix.apk 2>/dev/null || echo "APK copy failed"

echo "Done! Check ~/Downloads/signal-noise-v1.2.1-widget-fix.apk"