# CLAUDE.md - Widget Lab

## 📝 CRITICAL DOCUMENTATION REMINDER

**ALWAYS UPDATE THESE FILES AFTER ANY CHANGES:**
1. **`plan.md`** - Update project status, milestones, and next actions
2. **`changelog.md`** - Document all changes, fixes, and lessons learned

This ensures we maintain a complete history of our progress, challenges, and solutions. These documents are essential for:
- Tracking what works and what doesn't
- Preserving hard-won debugging insights
- Maintaining project momentum
- Onboarding future developers

**Update frequency**: After every significant change, debugging session, or milestone achievement.

---

## Project Overview

Widget Lab is the dedicated development environment for Signal/Noise premium Android widgets. This subproject implements three revolutionary widget concepts that combine Jony Ive's minimalist aesthetic philosophy with cutting-edge Android capabilities.

## Core Principles

### Design Philosophy (Jony Ive Standards)
- **Honesty**: No deceptive animations or false progress indicators
- **Simplicity**: Single-glance comprehension, essential information only
- **Innovation**: Novel visualization techniques that advance the medium
- **Craft**: Obsessive attention to detail, pixel-perfect alignment

### Technical Standards (Google Engineering Excellence)
- **Performance**: <100ms UI response, 60fps animations
- **Battery**: <1% daily impact through adaptive refresh
- **Memory**: <10MB footprint per widget
- **Reliability**: Graceful degradation, robust error handling

## Widget Concepts

### 1. Signal Wave
*Time as a Living Stream* - Animated particle flow representing focus state with real-time WebSocket updates and AI-powered insights for premium users.

### 2. Focus Ring
*Planetary Motion of Attention* - Tasks orbit around focus center with gravity physics. Signal tasks pull inward, noise drifts outward.

### 3. Quantum State
*Productivity as Quantum Probability* - Shows task history and AI-predicted future with Schrödinger tasks in superposition until observed.

## Architecture

```
widget-lab/
├── docs/               # Comprehensive documentation
├── src/
│   ├── signal-wave/    # Widget 1 implementation
│   ├── focus-ring/     # Widget 2 implementation
│   └── quantum-state/  # Widget 3 implementation
├── assets/            # Shared resources, icons, gradients
├── tests/             # Unit and integration tests
└── tools/             # Build scripts and utilities
```

## APK Build Process (CRITICAL - USE GRADLE DIRECTLY!)

### ⚠️ IMPORTANT: Skip Bubblewrap Interactive Prompts
**DO NOT use expect scripts or try to automate Bubblewrap password prompts!** They send passwords character-by-character causing validation errors. Use gradle directly instead.

### Keystore Credentials
- **Keystore Password**: `Singal-Noise2027!!` (YES, "Singal" not "Signal" - intentional!)
- **Alias Password**: `Singal-Noise2027!!` (same password)
- **Alias Name**: `android`
- **Keystore Path**: `/Users/libra/GitHub/_quicks/_signalnoise/signal-noise/android.keystore`

### ✅ WORKING Build Process (Gradle Direct - KISS Principle)
```bash
#!/bin/bash
# Set up Java environment
export JAVA_HOME=/Users/libra/.bubblewrap/jdk/jdk-17.0.11+9/Contents/Home

# Clean previous builds
rm -rf app/build

# Build with gradle directly - NO INTERACTIVE PROMPTS!
./gradlew -Pandroid.injected.signing.store.file=/Users/libra/GitHub/_quicks/_signalnoise/signal-noise/android.keystore \
         -Pandroid.injected.signing.store.password="Singal-Noise2027!!" \
         -Pandroid.injected.signing.key.alias=android \
         -Pandroid.injected.signing.key.password="Singal-Noise2027!!" \
         assembleRelease

# APK will be at: app/build/outputs/apk/release/app-release.apk
```

### ❌ DO NOT USE These Approaches
- **Expect scripts**: Send password character-by-character, causing "Minimum length is 6 but input is 1" error
- **Echo/printf piping**: Same character-by-character issue
- **Bubblewrap interactive**: Hangs or fails with password validation
- **Node.js automation**: Still sends characters individually

### Why This Works
- Gradle accepts passwords as complete command-line parameters
- No interactive prompts = no character-by-character issues
- Proven working solution (Sept 2025)

### Common Issues
- **Wrong password**: It's `Singal-Noise2027!!` NOT `Signal-Noise2027!!`
- **Java not found**: Use Bubblewrap's JDK: `export JAVA_HOME=/Users/libra/.bubblewrap/jdk/jdk-17.0.11+9/Contents/Home`
- **Keystore not found**: Use absolute path to keystore file

## Widget Naming Convention (CRITICAL for Troubleshooting)

**ALWAYS use unique, descriptive names for widgets during development instead of generic production names.**

### Naming Pattern (KEEP IT SHORT!):
```
SN[Size][DataSource]
```
Where:
- Size: 1x1, 2x1, 2x2, 4x1, 4x2
- DataSource: R (Redis), M (Mock), S (Static), F (Fast update)

### Examples:
- `SN1x1R` - 1x1 size, Redis live data
- `SN2x1R` - 2x1 size, Redis live data
- `SN2x2M` - 2x2 size, Mock data
- `SN4x1F` - 4x1 size, Fast updates
- `SN1x1S` - 1x1 size, Static baseline

### Benefits:
1. **Easy identification** in widget picker when multiple versions exist
2. **Clear data source** understanding (Redis, Mock, API, Static)
3. **Version tracking** for iterative development
4. **Debug vs Production** differentiation
5. **Troubleshooting** - immediately know which widget implementation is being used

### In AndroidManifest.xml:
```xml
<!-- Good: Descriptive development name -->
<receiver android:name=".widget.WorkingWidget"
    android:label="SN_Redis_Live_v1">

<!-- Bad: Generic production name during development -->
<receiver android:name=".widget.WorkingWidget"
    android:label="Signal/Noise">
```

### Widget Class Naming:
```java
// Good: Descriptive class names
public class SNRedisWidget extends AppWidgetProvider { }
public class SNMockWidget extends AppWidgetProvider { }
public class SNDebugWidget extends AppWidgetProvider { }

// Bad: Generic names
public class WorkingWidget extends AppWidgetProvider { }
public class Widget1 extends AppWidgetProvider { }
```

### Widget Data Source Identification

Always log the data source in widget updates:
```java
Log.d(TAG, "Widget: SN_Redis_v1, Source: " + dataSource + ", Value: " + ratio);
```

This makes debugging much easier when checking logs:
```bash
adb logcat | grep "SN_Redis"
```

## Testing Email for Redis Data

**ALWAYS use `thomas.seiger@gmail.com` for widget testing.** This email has real user data in Redis.

```java
// In RedisDataFetcher.java - use this email for testing
RedisDataFetcher.fetchAndUpdateWidgetData(context, "thomas.seiger@gmail.com");
```

This ensures widgets sync with actual live data from the Signal/Noise React app.

## Critical Widget Development Principles (MANDATORY)

### ⚡ SPEED & EFFICIENCY RULES

1. **NEVER deploy just one widget** - Always provide multiple variants to test
2. **ALWAYS try things that get us faster to our goals** - No incremental baby steps
3. **ALWAYS remove previously tested widget iterations** - Clean up old versions
4. **ALWAYS keep only ONE WINNER from the previous batch** - Maximum efficiency
   - Keep ONLY the best performing widget (e.g., SN2x1R if it worked best)
   - DELETE all other old variants before creating new ones
   - Each APK = 1 winner + 4-5 new experiments

### Widget Deployment Strategy

#### Each APK Should Include:
- **Minimum 3-5 widget variants** for A/B testing
- **Different layouts** (1x1, 2x1, 2x2, 4x1, 4x2)
- **Different data sources** (Redis, Mock, Static, API)
- **Different update frequencies** (30s, 60s, 5min)
- **Different visual styles** (Text-only, with icons, with colors)

#### Example Batch:
```
SN_Redis_1x1_v1    - Minimal size, live data
SN_Redis_2x1_v1    - Medium size, live data
SN_Redux_2x2_v1    - Large visual, live data
SN_Mock_2x1_Fast   - Mock data, 10s updates
SN_Static_1x1_Test - Static for baseline
```

### Cleanup Protocol
After each test round:
1. Delete non-performing variants
2. Keep the best performer
3. Create new variants based on learnings
4. Never keep more than 1 old version

## Development Process

Each widget follows a rigorous 5-phase development cycle:

1. **Foundation** - Core widget service, data pipeline, base layouts
2. **Visual Excellence** - Animations, custom rendering, Material You
3. **Intelligence** - AI predictions, pattern recognition, premium features
4. **Validation** - Google engineer review, performance optimization
5. **Deployment** - Production release, monitoring, iteration

## Quality Gates

Before any widget ships:
- ✅ Jony Ive design review (aesthetics, simplicity, innovation)
- ✅ Google engineer approval (performance, battery, code quality)
- ✅ User testing validation (comprehension <500ms, retention >80%)
- ✅ Accessibility audit (WCAG AAA compliance)

## Integration Points

### React App Communication
- LocalStorage bridge for data persistence
- JavaScriptInterface for real-time updates
- WebSocket service for premium features

### Android System
- RemoteViews for widget rendering
- WorkManager for background updates
- Room database for offline persistence
- ContentProvider for data access

## Success Metrics

- Widget retention: >80% after 30 days
- Average glances: >20 per day
- Premium conversion: >15% from widget users
- Performance: <100ms update latency
- Battery impact: <1% daily

## Development Guidelines

1. **Always start with the simplest implementation** (KISS principle)
2. **Test on real devices** early and often
3. **Profile performance** before optimization
4. **Document decisions** for future reference
5. **Maintain backward compatibility** (Android 12+ minimum)

## Current Status

See `plan.md` for detailed progress tracking and `changelog.md` for version history.

## Critical Learnings (September 2025)

### 🎉 Widget Victory (Sept 18, 2025)
**WIDGETS ARE NOW DISPLAYING ON DEVICE!** After intensive debugging:
- ✅ All 4 widget types showing on screen (99%, 87%, 80, TEST OK)
- ✅ Fixed "package appears to be invalid" error
- ✅ Removed incompatible `doNotCompress` from build.gradle
- ✅ Fixed icon references (@mipmap instead of @drawable)
- 🔧 Data bridge implementation in progress for real-time sync

### Widget Implementation Discovery
After extensive debugging, we discovered crucial insights about Android widgets in TWA/Bubblewrap environments:

#### ✅ What Works
1. **Compilation**: Bubblewrap DOES compile Java files in subdirectories (contrary to initial assumptions)
2. **Registration**: Widgets are properly registered and appear in Android widget picker
3. **System Integration**: Android system recognizes and attempts to instantiate our widgets
4. **Multiple Instances**: System successfully tracks multiple widget instances (tested with 4+ active)

#### ❌ Common Failure Points
1. **RemoteViews Limitations**: Many standard Android views are NOT supported in widgets
   - No ConstraintLayout, include tags, or custom views
   - Only basic views: TextView, ImageView, Button, LinearLayout, RelativeLayout, FrameLayout
   - Missing view IDs referenced in Java code cause silent failures

2. **Android 30+ APK Requirements**:
   - `resources.arsc` MUST be uncompressed and 4-byte aligned
   - Standard jarsigner recompresses the file, breaking installation
   - Solution: Target SDK 29 or use apksigner with proper flags

3. **Error Visibility**: Widget errors don't appear in standard logcat
   - Use `adb shell dumpsys appwidget` to verify widget registration
   - Check for RemoteViews instances to confirm widget is running
   - "Can't load widget" usually means layout rendering failure, not code issues

#### 🎯 KISS Solution Template
```java
// Minimal working widget - guaranteed to display
public class WorkingWidget extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.simple_widget);
            views.setTextViewText(R.id.text, "87%");
            appWidgetManager.updateAppWidget(appWidgetId, views);
        }
    }
}
```

```xml
<!-- simple_widget.xml - RemoteViews-compatible layout -->
<TextView xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/text"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="#000000"
    android:gravity="center"
    android:text="--"
    android:textColor="#00FF88"
    android:textSize="24sp"
    android:padding="16dp" />
```

#### 📊 Debug Commands
```bash
# Check if widgets are registered and running
adb shell dumpsys appwidget | grep -A10 "signalnoise"

# Look for RemoteViews instances (confirms widget is active)
adb shell dumpsys appwidget | grep "views=android.widget.RemoteViews"

# Monitor widget-specific errors
adb logcat | grep -E "(appwidget|RemoteViews|signalnoise)"
```

#### 🏗️ Build Configuration
```gradle
android {
    compileSdkVersion 36

    packagingOptions {
        // Critical for Android 30+ but doesn't work with jarsigner
        doNotCompress 'resources.arsc'
    }

    defaultConfig {
        targetSdkVersion 29  // Stay below 30 to avoid compression issues
        // OR use apksigner instead of jarsigner for SDK 30+
    }
}
```

### Key Takeaways
1. **Start with the absolute simplest widget** - single TextView, no complex layouts
2. **Verify widget registration first** - use dumpsys before assuming code problems
3. **RemoteViews are very limited** - stick to basic Android views only
4. **Build issues != Runtime issues** - compilation success doesn't guarantee display
5. **NEVER deploy single widget alone** - Widget ID conflicts cause "Can't load widget"
6. **Always include ID spacer widget** - Prevents AlarmManager/RedisDataFetcher collisions
7. **Android 15 SDK 36 compatible** - Modern Android support achieved

---

## 🔥 CRITICAL DISCOVERY: Widget ID Conflicts (Sept 18, 2025)

### ⚠️ THE SINGLE WIDGET PROBLEM
**NEVER deploy a single widget alone!** This causes "Can't load widget" errors due to AlarmManager/RedisDataFetcher ID conflicts.

#### Root Cause Analysis:
- **Single Widget**: All Redis fetch calls use same AlarmManager ID → overload → crash
- **Multiple Widgets**: IDs distributed across widgets → each works independently
- **Android 15**: More strict about widget resource management

#### ✅ PROVEN SOLUTION: ID Spacer Pattern
```xml
<!-- Production widget -->
<receiver android:name=".widget.W4" android:label="Signal/Noise">

<!-- Minimal ID spacer (prevents conflicts) -->
<receiver android:name=".widget.T1" android:label="• spacer">
```

#### Why This Works:
1. **ID Distribution**: AlarmManager IDs spread across multiple widgets
2. **Resource Isolation**: Each widget gets dedicated background service slots
3. **Android Compatibility**: System expects multiple widget ecosystem

### 🎯 MANDATORY WIDGET DEPLOYMENT RULE
**NEVER ship single widget APKs in production!** Always include:
- **1 Production Widget** (main functionality)
- **1+ ID Spacer Widgets** (minimal, can be hidden in picker)

### Android SDK Evolution Impact
- **SDK 29**: Widget ID conflicts masked by looser resource management
- **SDK 36**: Stricter widget isolation exposes single-widget problems
- **Solution**: ID spacer pattern works across all Android versions

*"The best design is as little design as possible" - Dieter Rams*

## 🔄 MANDATORY APK DEPLOYMENT WORKFLOW

**After EVERY successful APK build, follow this EXACT sequence:**

### 1. Commit APK Build
```bash
git add -A
git commit -m "claude: [widget_name] APK - [filename] - [brief_description]"
```

### 2. Update Changelog
- Add entry to widget-lab/changelog.md with version, changes, learnings, APK filename

### 3. Update Plan
- Update widget-lab/plan.md with current batch status, winner selection, APK location

### 4. Documentation Commit
```bash
git add -A
git commit -m "claude: update documentation for [APK_version]"
```

**NO EXCEPTIONS - This prevents losing progress and ensures complete project tracking.**

