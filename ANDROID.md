# Android Play Store Integration Guide

This document contains comprehensive knowledge and procedures for building, testing, and deploying the Signal/Noise app to the Google Play Store.

## Table of Contents
- [Prerequisites](#prerequisites)
- [TWA (Trusted Web Activity) Setup](#twa-trusted-web-activity-setup)
- [Building the Android App](#building-the-android-app)
- [Digital Asset Links](#digital-asset-links)
- [Testing on Android](#testing-on-android)
- [Play Store Submission](#play-store-submission)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Google Developer Account
- **Cost**: $25 one-time registration fee
- **URL**: https://play.google.com/console
- **Verification**: 2-5 days for identity verification

### Bubblewrap Installation
```bash
npm i -g @bubblewrap/cli
# This also installs JDK and Android SDK automatically
```

## TWA (Trusted Web Activity) Setup

### Configuration Files

#### `twa-manifest.json`
Critical configuration for the Android app:
```json
{
  "packageId": "app.signalnoise.twa",
  "host": "signal-noise.app",
  "name": "Signal/Noise - Focus Tracker",
  "launcherName": "Signal/Noise",
  "display": "standalone",
  "themeColor": "#0A0A0A",
  "navigationColor": "#000000",
  "backgroundColor": "#0A0A0A",
  "startUrl": "/",
  "iconUrl": "https://signal-noise.app/icon-512.png",
  "maskableIconUrl": "https://signal-noise.app/icon-512.png",
  "appVersionName": "2",
  "appVersionCode": 2,
  "minSdkVersion": 21,
  "orientation": "portrait"
}
```

#### `app/build.gradle`
Key settings for the Android build:
```gradle
def twaManifest = [
    applicationId: 'app.signalnoise.twa',
    hostName: 'signal-noise.app',
    launchUrl: '/',
    name: 'Signal/Noise - Focus Tracker',
    launcherName: 'Signal/Noise',
    versionCode: 2,
    versionName: "2"
]
```

## Building the Android App

### Initial Setup
```bash
# Initialize Bubblewrap project (first time only)
npx @bubblewrap/cli init --manifest https://signal-noise.app/manifest.json

# Or with local manifest
npx @bubblewrap/cli init --manifest ./public/manifest.json
```

### Creating the Keystore
**CRITICAL**: Store these credentials securely!
```bash
# Password used: Singal-Noise2027!!
# Alias: android
# Store the keystore file safely and create backups
cp android.keystore android.keystore.backup
```

### Build Commands

#### Build APK (for testing)
```bash
export JAVA_HOME=~/.bubblewrap/jdk/jdk-17.0.11+9/Contents/Home
export ANDROID_HOME=~/.bubblewrap/android_sdk
cd app
../gradlew assembleRelease \
  -Pandroid.injected.signing.store.file=../android.keystore \
  -Pandroid.injected.signing.store.password="Singal-Noise2027!!" \
  -Pandroid.injected.signing.key.alias=android \
  -Pandroid.injected.signing.key.password="Singal-Noise2027!!"
```

#### Build AAB (for Play Store)
```bash
../gradlew bundleRelease \
  -Pandroid.injected.signing.store.file=../android.keystore \
  -Pandroid.injected.signing.store.password="Singal-Noise2027!!" \
  -Pandroid.injected.signing.key.alias=android \
  -Pandroid.injected.signing.key.password="Singal-Noise2027!!"
```

### Output Files
- **APK**: `app/build/outputs/apk/release/app-release.apk`
- **AAB**: `app/build/outputs/bundle/release/app-release.aab`

## Digital Asset Links

### Purpose
Digital Asset Links are REQUIRED for TWA apps to run in standalone mode without browser UI.

### Setup Process

1. **Get SHA256 Fingerprint**:
```bash
~/.bubblewrap/jdk/jdk-17.0.11+9/Contents/Home/bin/keytool \
  -list -v -keystore android.keystore \
  -storepass "Singal-Noise2027!!" | grep SHA256
```

2. **Create `public/.well-known/assetlinks.json`**:
```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "app.signalnoise.twa",
      "sha256_cert_fingerprints": [
        "52:D6:86:4C:78:C2:D1:44:E0:FC:34:95:A6:BF:2F:49:54:35:82:47:9A:CB:CD:B9:C6:CA:62:EA:5D:3C:12:BF"
      ]
    }
  }
]
```

3. **Deploy to Production**:
```bash
git add public/.well-known/assetlinks.json
git commit -m "Add Digital Asset Links"
git push
```

4. **Verify Deployment**:
```bash
curl https://signal-noise.app/.well-known/assetlinks.json
```

### How It Works
```
App Launch → Android checks signal-noise.app/.well-known/assetlinks.json
           → Verifies SHA256 matches app signature
           → Match: Runs in standalone mode (no browser UI)
           → No match: Shows browser UI for security
```

## Testing on Android

### Install APK on Device
1. Transfer APK to device: `~/Downloads/signal-noise-production.apk`
2. Enable "Install from unknown sources" in Settings > Security
3. Open APK file to install
4. App runs in standalone mode (no browser UI visible)

### Testing Checklist
- [ ] App launches without browser UI
- [ ] Icons display correctly
- [ ] Splash screen appears
- [ ] PWA features work (offline, etc.)
- [ ] App orientation locked to portrait

## Play Store Submission

### Required Assets

#### Screenshots
Located in `play-store-submission/` folder:
- **Phone**: 2-8 screenshots (1080x1920 or similar)
- **7-inch tablet**: At least 1 screenshot (600x1024)
- **10-inch tablet**: At least 1 screenshot (800x1280)

#### Graphics
- **App Icon**: 512x512 PNG (already in manifest)
- **Feature Graphic**: 1024x500 PNG (optional but recommended)

#### Store Listing Texts
- **Short Description** (80 chars max):
  "Track your focus with the 80/20 principle. Transform productivity."

- **Full Description** (4000 chars max):
  ```
  Signal/Noise helps you achieve laser focus by applying the 80/20 principle
  to your daily tasks. Classify everything as either Signal (important) or
  Noise (distraction) and watch your productivity transform.

  Features:
  • Simple binary classification system
  • Real-time Signal/Noise ratio tracking
  • 30-day analytics and patterns
  • Achievement system with 8 badges
  • AI Coach for premium members
  • Privacy-first: all data stays on your device
  • Works offline
  • Dark mode interface
  ```

### Submission Process
1. Log in to [Google Play Console](https://play.google.com/console)
2. Create new app
3. Fill in app details
4. Upload AAB file: `app-release.aab`
5. Add screenshots and graphics
6. Set content rating (likely "Everyone")
7. Set pricing (Free)
8. Submit for review

## Troubleshooting

### Common Issues

#### Browser UI Still Visible
**Problem**: App shows browser interface instead of standalone mode
**Solution**:
1. Verify Digital Asset Links are deployed
2. Check SHA256 fingerprint matches
3. Uninstall and reinstall app
4. Wait 5-10 minutes for Google to cache asset links

#### Build Fails with Icon Error
**Problem**: `error: resource mipmap/ic_maskable not found`
**Solution**: Ensure all icon files exist in mipmap directories:
```bash
ls app/src/main/res/mipmap-*/ic_*.png
```

#### Gradle Build Issues
**Problem**: Various Gradle errors
**Solution**:
```bash
# Clean and rebuild
cd app
../gradlew clean
../gradlew assembleRelease
```

#### URL Verification Failed
**Problem**: PWA doesn't validate
**Solution**: Ensure production deployment:
```bash
vercel --prod
# Verify manifest accessible
curl https://signal-noise.app/manifest.json
```

### Development vs Production URLs

Always ensure production URLs in:
- `twa-manifest.json`: host, webManifestUrl
- `app/build.gradle`: hostName, webManifestUrl
- Digital Asset Links must be on production domain

### Version Management

When updating the app:
1. Increment `versionCode` (integer)
2. Update `versionName` (string)
3. Update in both `twa-manifest.json` and `app/build.gradle`

## Security Notes

### Keystore Protection
- **NEVER** commit keystore to public repos
- Keep multiple secure backups
- Store password in password manager
- Required for all future app updates

### Sensitive Information
- Package name: `app.signalnoise.twa`
- SHA256: `52:D6:86:4C:78:C2:D1:44:E0:FC:34:95:A6:BF:2F:49:54:35:82:47:9A:CB:CD:B9:C6:CA:62:EA:5D:3C:12:BF`
- These are public once app is published

## Automated Screenshot Generation

### Setup
```bash
npm install -D playwright @playwright/test
npx playwright install chromium
```

### Generate Screenshots
```bash
# Phone screenshots
node generate-final-screenshots.js

# Tablet screenshots
node generate-tablet-screenshots-complete.cjs
```

### Add Device Frames
```bash
npx deviceframe screenshots/*.png --output screenshots-framed/
```

## File Structure
```
signal-noise/
├── android.keystore              # Signing certificate (KEEP SECURE)
├── android.keystore.backup       # Backup of keystore
├── twa-manifest.json            # TWA configuration
├── app/                         # Android project
│   ├── build.gradle            # Build configuration
│   └── src/main/              # Source files
├── play-store-submission/      # Store assets
│   ├── signal-noise.aab       # App bundle for upload
│   ├── screenshots/            # All screenshots
│   └── feature-graphic.png    # Store graphic
└── public/
    └── .well-known/
        └── assetlinks.json    # Digital Asset Links
```

## Quick Commands Reference

```bash
# Build APK for testing
npm run build:apk

# Build AAB for Play Store
npm run build:aab

# Test Digital Asset Links
curl https://signal-noise.app/.well-known/assetlinks.json

# Copy APK to Downloads
cp app/build/outputs/apk/release/app-release.apk ~/Downloads/

# Get SHA256 fingerprint
keytool -list -v -keystore android.keystore | grep SHA256
```

## Support & Updates

- Google Play Console: https://play.google.com/console
- Bubblewrap Documentation: https://github.com/GoogleChromeLabs/bubblewrap
- TWA Documentation: https://developers.google.com/web/android/trusted-web-activity

---

Last Updated: September 2025
Version: 2.0