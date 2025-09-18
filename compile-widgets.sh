#!/bin/bash

# Compile widgets separately and inject into Bubblewrap APK

echo "🔧 Compiling Signal/Noise Widgets..."

# Step 1: Find Android SDK
ANDROID_JAR="/Users/libra/.bubblewrap/android_sdk/platforms/android-34/android.jar"
if [ ! -f "$ANDROID_JAR" ]; then
    echo "❌ Android SDK not found"
    exit 1
fi

# Step 2: Compile widget Java files
echo "📦 Compiling widget classes..."
mkdir -p build/widget-classes

javac -cp "$ANDROID_JAR:app/build/intermediates/classes/release" \
    -d build/widget-classes \
    app/src/main/java/app/signalnoise/twa/widget/*.java

# Step 3: Convert to DEX format
echo "🔄 Converting to DEX..."
/Users/libra/.bubblewrap/android_sdk/build-tools/34.0.0/d8 \
    --output build/widget-dex \
    build/widget-classes/**/*.class

# Step 4: Extract APK
echo "📂 Extracting APK..."
unzip -q app-release-unsigned.apk -d build/apk-extract

# Step 5: Add widget DEX
echo "💉 Injecting widget classes..."
cp build/widget-dex/classes.dex build/apk-extract/classes2.dex

# Step 6: Repackage APK
echo "📦 Repackaging APK..."
cd build/apk-extract
zip -qr ../app-with-widgets-unsigned.apk *
cd ../..

# Step 7: Align and sign
echo "✍️ Signing APK..."
/Users/libra/.bubblewrap/android_sdk/build-tools/34.0.0/zipalign -v 4 \
    build/app-with-widgets-unsigned.apk \
    build/app-with-widgets-aligned.apk

/Users/libra/.bubblewrap/jdk/jdk-17.0.11+9/Contents/Home/bin/java \
    -jar /Users/libra/.bubblewrap/android_sdk/build-tools/34.0.0/lib/apksigner.jar \
    sign --ks ./android.keystore \
    --ks-pass "pass:Singal-Noise2027!!" \
    --key-pass "pass:Singal-Noise2027!!" \
    --out app-release-with-widgets.apk \
    build/app-with-widgets-aligned.apk

echo "✅ Success! Widgets compiled and injected into: app-release-with-widgets.apk"