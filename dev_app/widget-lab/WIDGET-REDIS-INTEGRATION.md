# Signal/Noise Android Widget Redis Integration

## Summary
Successfully implemented real-time data synchronization between Signal/Noise React app and Android widgets using Vercel Redis as the data source.

## What Was Fixed

### 1. Build Pipeline ✅
- **Problem**: Bubblewrap expect scripts were sending passwords character-by-character
- **Solution**: Use gradle directly with command-line parameters (BUILD-APK-FINAL.sh)
- **Key**: Password is intentionally "Singal-Noise2027!!" (with typo)

### 2. Data Bridge ✅
- **Problem**: TWA localStorage is isolated from Android SharedPreferences
- **Solution**: Fetch data directly from Vercel Redis via API endpoint
- **Implementation**:
  - Created `/api/widget-data.js` endpoint
  - Reads from `sn:u:{email}` hash in Redis
  - Extracts data from `app_data` field (contains tasks, history, badges, etc.)
  - Calculates real-time Signal/Noise ratio from today's tasks

### 3. Widget Updates ✅
- **Components Created**:
  - `RedisDataFetcher.java` - Fetches from widget-data API
  - `DataPollingService.java` - Polls every 30 seconds for updates
  - `DebugWidget.java` - Shows data source and sync status
  - `WidgetUpdateHelper.java` - Updates all widget types

## Current Status

### API Endpoint
- **URL**: https://signal-noise.app/api/widget-data
- **Test**: `curl "https://signal-noise.app/api/widget-data?email=thomas.seiger@gmail.com"`
- **Response**: Returns ratio, signalCount, noiseCount, streak, badges, tier

### APK Build
- **Latest APK**: ~/Downloads/signal-noise-20250918-0721.apk
- **Build Script**: ./BUILD-APK-FINAL.sh
- **Widgets Included**:
  - WorkingWidget (main widget)
  - DebugWidget (shows sync status)

## Installation Instructions

1. **Install APK on device**:
   ```bash
   # If ADB is available:
   adb install ~/Downloads/signal-noise-20250918-0721.apk

   # Or transfer APK to phone and install manually
   ```

2. **Add Widget to Home Screen**:
   - Long press on home screen
   - Select "Widgets"
   - Find "Signal/Noise" widget
   - Add to home screen

3. **Widget will show**:
   - Real-time Signal/Noise ratio from your app data
   - Updates every 30 seconds automatically
   - Debug widget shows data source (REDIS/GENERATED/ERROR)

## How It Works

1. **Data Flow**:
   ```
   React App → Saves to Redis → Widget polls API → Updates display
   ```

2. **Redis Structure**:
   - Key: `sn:u:{email}` (e.g., `sn:u:thomas.seiger@gmail.com`)
   - Field: `app_data` contains JSON with tasks, history, badges
   - Widget calculates today's ratio from tasks array

3. **Polling Service**:
   - Runs every 30 seconds
   - Fetches from https://signal-noise.app/api/widget-data
   - Updates SharedPreferences
   - Triggers widget UI refresh

## Testing

1. **Check API is working**:
   ```bash
   curl -s "https://signal-noise.app/api/widget-data?email=thomas.seiger@gmail.com" | python3 -m json.tool
   ```

2. **Expected response**:
   ```json
   {
     "ratio": 50,
     "signalCount": 1,
     "noiseCount": 1,
     "streak": 0,
     "tier": "foundation",
     "badges": ["first_day", "early_bird"],
     "firstName": "Tom"
   }
   ```

## Troubleshooting

- **Widget shows "NO DATA"**: Check if email is correct in DataPollingService.java
- **Widget shows "ERROR"**: API endpoint might be down, check Vercel logs
- **Widget shows old data**: Force refresh by removing and re-adding widget
- **Debug info**: Add Debug Widget to see data source and last update time

## Next Steps

- [ ] Add user email configuration in widget settings
- [ ] Implement OAuth for secure API access
- [ ] Add widget tap action to open app
- [ ] Create different widget sizes (2x2, 4x1, etc.)