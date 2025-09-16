# Signal/Noise Android App Setup Guide

## Current Status
Your PWA is ready to be packaged as a Trusted Web Activity (TWA) for Google Play Store.

## Prerequisites Completed
- ✅ Bubblewrap CLI installed
- ✅ Asset links file created at `public/.well-known/assetlinks.json`
- ✅ TWA manifest configuration ready

## Next Steps

### 1. Install Java Development Kit (JDK 17)
```bash
# On macOS with Homebrew:
brew install openjdk@17

# Or download from: https://adoptium.net/
```

### 2. Initialize Bubblewrap Project
```bash
# Create Android app directory
mkdir -p android-app
cd android-app

# Initialize with your config
bubblewrap init --manifest ../twa-manifest.json
```

When prompted:
- Choose "Yes" to install Android SDK (if not installed)
- Use default locations for Android tools
- For signing key: Create new one for production

### 3. Generate Signing Key (Production)
```bash
keytool -genkey -v -keystore android.keystore -alias android -keyalg RSA -keysize 2048 -validity 10000
```

**IMPORTANT**: Save these credentials securely:
- Keystore password
- Key alias password
- Keep `android.keystore` file backed up (you'll need it for all future updates)

### 4. Update Asset Links
After generating your signing key, get the SHA256 fingerprint:
```bash
keytool -list -v -keystore android.keystore -alias android | grep SHA256
```

Update `public/.well-known/assetlinks.json` with the real SHA256 fingerprint.

### 5. Build the APK
```bash
bubblewrap build
```

This creates:
- `app-release-signed.apk` - Ready for Google Play Store
- `app-release-bundle.aab` - Android App Bundle (preferred by Google)

### 6. Test on Device
```bash
# Install on connected Android device
adb install app-release-signed.apk

# Or use Android Studio emulator
```

## Google Play Console Setup

### Developer Account
1. Go to https://play.google.com/console
2. Pay $25 one-time registration fee
3. Complete identity verification

### App Listing Requirements

#### Store Listing
- **App name**: Signal/Noise - 80/20 Productivity
- **Short description** (80 chars): Focus on what matters. Track your 80/20 productivity ratio in real-time.
- **Full description** (4000 chars): Use your existing app description
- **Category**: Productivity
- **Content rating**: Everyone

#### Graphic Assets Needed
1. **App Icon**: ✅ Already have (512x512)
2. **Feature Graphic** (1024x500): Create minimalist banner
3. **Screenshots** (min 2):
   - Main app view
   - Analytics view
   - Premium AI Coach
4. **Privacy Policy**: ✅ Already have at signal-noise.app/privacy

#### Monetization
- **Pricing**: Free with in-app purchases
- **In-app product**: "Foundation Member - €29"
- Google fee: 15% (for first $1M revenue/year)

### Testing Track
1. Start with "Internal testing" (up to 100 testers)
2. Move to "Closed testing" (up to 1000)
3. Then "Open testing" or "Production"

## Estimated Timeline
- **Build & Test**: 1-2 hours
- **Play Console Setup**: 2-3 hours
- **Review Process**: 2-24 hours
- **Total**: Same day to 2 days

## Pro Tips
1. **Version Management**: Always increment `appVersionCode` for updates
2. **64-bit Requirement**: Bubblewrap handles this automatically
3. **Target API Level**: Keep updated (current minimum is API 33)
4. **App Bundles**: Use `.aab` format for smaller downloads

## Future Enhancements
- Push notifications (via Firebase)
- Native share integration
- App shortcuts for quick task entry
- Widgets for home screen

## Revenue Potential
With your €29 Foundation pricing:
- After Google's 15%: €24.65 per sale
- 100 sales = €2,465
- 1000 sales = €24,650

Your minimalist productivity angle is perfect for Play Store's productivity category!