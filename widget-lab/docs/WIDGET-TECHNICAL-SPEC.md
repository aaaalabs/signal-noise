# Technical Implementation Specification
## Signal/Noise Premium Widget System

### Architecture Overview

```ascii
┌──────────────────────────────────────────────────────┐
│                   SIGNAL/NOISE APP                    │
├──────────────────────────────────────────────────────┤
│                                                       │
│  React App          Bridge Layer        Android       │
│  ┌──────────┐      ┌──────────┐      ┌──────────┐  │
│  │          │      │          │      │          │  │
│  │  State   │─────▶│  Local   │◀────▶│  Widget  │  │
│  │  Manager │      │  Storage │      │  Service │  │
│  │          │      │          │      │          │  │
│  └──────────┘      └──────────┘      └──────────┘  │
│       │                  │                  │        │
│       ▼                  ▼                  ▼        │
│  ┌──────────┐      ┌──────────┐      ┌──────────┐  │
│  │  Groq    │      │  Room    │      │  Widget  │  │
│  │   API    │      │    DB    │      │  Manager │  │
│  └──────────┘      └──────────┘      └──────────┘  │
│                                                       │
└──────────────────────────────────────────────────────┘
                            │
                            ▼
            ┌───────────────────────────────┐
            │      ANDROID HOME SCREEN      │
            ├───────────────────────────────┤
            │  ┌─────┐  ┌─────┐  ┌─────┐  │
            │  │ W1  │  │ W2  │  │ W3  │  │
            │  └─────┘  └─────┘  └─────┘  │
            └───────────────────────────────┘
```

---

## PHASE 1: Enhanced Foundation (Week 1)

### 1.1 Data Bridge Implementation

```java
// JavaScriptInterface.java - Enhanced for real-time updates
package app.signalnoise.twa;

import android.webkit.JavascriptInterface;
import android.content.Intent;
import androidx.room.Room;
import com.google.gson.Gson;

public class SignalNoiseInterface {
    private SignalNoiseDatabase db;
    private WebSocketManager wsManager;

    @JavascriptInterface
    public void updateState(String jsonState) {
        // Parse state from React
        AppState state = gson.fromJson(jsonState, AppState.class);

        // Store in Room database
        db.stateDao().insertOrUpdate(state);

        // Broadcast to widgets
        Intent intent = new Intent(WIDGET_UPDATE_ACTION);
        intent.putExtra("state", jsonState);
        context.sendBroadcast(intent);

        // Push to WebSocket for premium users
        if (state.isPremium) {
            wsManager.broadcast(state);
        }
    }

    @JavascriptInterface
    public void requestAIInsight(String context) {
        // Premium feature: Get AI insights
        if (isPremiumUser()) {
            groqService.getInsight(context, result -> {
                evaluateJavascript("window.receiveAIInsight('" + result + "')", null);
            });
        }
    }
}
```

### 1.2 Room Database Schema

```kotlin
// SignalNoiseDatabase.kt
@Database(
    entities = [AppState::class, TaskEntry::class, Pattern::class],
    version = 1,
    exportSchema = false
)
@TypeConverters(Converters::class)
abstract class SignalNoiseDatabase : RoomDatabase() {

    @Entity(tableName = "app_state")
    data class AppState(
        @PrimaryKey val id: Int = 0,
        val currentRatio: Int,
        val dailyStreak: Int,
        val totalTasks: Int,
        val lastUpdate: Long,
        val isPremium: Boolean,
        val aiInsights: String?
    )

    @Entity(tableName = "tasks")
    data class TaskEntry(
        @PrimaryKey(autoGenerate = true) val id: Long,
        val timestamp: Long,
        val type: String, // "signal" or "noise"
        val predicted: Boolean = false,
        val confidence: Float = 0f
    )

    @Entity(tableName = "patterns")
    data class Pattern(
        @PrimaryKey val hour: Int,
        val avgRatio: Float,
        val sampleCount: Int
    )
}
```

### 1.3 Widget Service Architecture

```kotlin
// SignalNoiseWidgetService.kt
class SignalNoiseWidgetService : RemoteViewsService() {

    override fun onGetViewFactory(intent: Intent): RemoteViewsFactory {
        return SignalNoiseViewFactory(applicationContext, intent)
    }

    inner class SignalNoiseViewFactory(
        private val context: Context,
        private val intent: Intent
    ) : RemoteViewsFactory {

        private val db = SignalNoiseDatabase.getInstance(context)
        private val renderer = WidgetRenderer(context)

        override fun getViewAt(position: Int): RemoteViews {
            val widgetType = intent.getStringExtra("widget_type")

            return when (widgetType) {
                "signal_wave" -> renderer.renderSignalWave(db.getState())
                "focus_ring" -> renderer.renderFocusRing(db.getState())
                "quantum_state" -> renderer.renderQuantumState(db.getState())
                else -> renderer.renderDefault(db.getState())
            }
        }
    }
}
```

---

## PHASE 2: Visual Excellence (Week 2)

### 2.1 Custom Canvas Rendering

```kotlin
// WidgetCanvasRenderer.kt
class WidgetCanvasRenderer(private val context: Context) {

    fun renderSignalWave(state: AppState): Bitmap {
        val width = 400
        val height = 200
        val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
        val canvas = Canvas(bitmap)

        // Background gradient
        val gradient = LinearGradient(
            0f, 0f, width.toFloat(), height.toFloat(),
            Color.parseColor("#0A0A0A"),
            Color.parseColor("#1A1A1A"),
            Shader.TileMode.CLAMP
        )

        val paint = Paint().apply {
            shader = gradient
            isAntiAlias = true
        }

        canvas.drawRect(0f, 0f, width.toFloat(), height.toFloat(), paint)

        // Draw wave based on ratio
        drawProductivityWave(canvas, state.currentRatio)

        // Draw particle effects for premium
        if (state.isPremium) {
            drawParticles(canvas, state)
        }

        return bitmap
    }

    private fun drawProductivityWave(canvas: Canvas, ratio: Int) {
        val path = Path()
        val paint = Paint().apply {
            color = Color.parseColor("#00ff88")
            strokeWidth = 3f
            style = Paint.Style.STROKE
            pathEffect = CornerPathEffect(10f)
        }

        // Generate wave based on ratio
        val amplitude = ratio * 2f
        val frequency = 0.02f

        path.moveTo(0f, canvas.height / 2f)

        for (x in 0..canvas.width) {
            val y = canvas.height / 2f +
                    amplitude * sin(x * frequency + System.currentTimeMillis() / 1000f)
            path.lineTo(x.toFloat(), y)
        }

        canvas.drawPath(path, paint)
    }
}
```

### 2.2 Animation System

```kotlin
// WidgetAnimationEngine.kt
class WidgetAnimationEngine {
    private val interpolator = AccelerateDecelerateInterpolator()
    private var animationProgress = 0f

    fun createTransition(
        fromState: AppState,
        toState: AppState,
        duration: Long = 500L
    ): List<RemoteViews> {
        val frames = mutableListOf<RemoteViews>()
        val frameCount = (duration / 16).toInt() // 60fps

        for (i in 0..frameCount) {
            val progress = i.toFloat() / frameCount
            val interpolatedProgress = interpolator.getInterpolation(progress)

            val intermediateState = interpolateState(
                fromState,
                toState,
                interpolatedProgress
            )

            frames.add(renderFrame(intermediateState))
        }

        return frames
    }
}
```

---

## PHASE 3: AI Intelligence Layer (Week 3)

### 3.1 On-Device ML Integration

```kotlin
// ProductivityPredictor.kt
class ProductivityPredictor(context: Context) {
    private val interpreter: Interpreter

    init {
        val model = loadModelFile(context, "productivity_model.tflite")
        interpreter = Interpreter(model)
    }

    fun predictNextTask(history: List<TaskEntry>): Prediction {
        // Prepare input tensor
        val inputArray = preprocessHistory(history)
        val outputArray = Array(1) { FloatArray(2) }

        // Run inference
        interpreter.run(inputArray, outputArray)

        val signalProbability = outputArray[0][0]
        val noiseProbability = outputArray[0][1]

        return Prediction(
            type = if (signalProbability > noiseProbability) "signal" else "noise",
            confidence = maxOf(signalProbability, noiseProbability)
        )
    }

    private fun preprocessHistory(history: List<TaskEntry>): Array<FloatArray> {
        // Convert last 24 hours of tasks to feature vectors
        val features = mutableListOf<FloatArray>()

        val hourlyBuckets = history.groupBy {
            TimeUnit.MILLISECONDS.toHours(it.timestamp) % 24
        }

        for (hour in 0..23) {
            val bucket = hourlyBuckets[hour] ?: emptyList()
            val signalRatio = bucket.count { it.type == "signal" }.toFloat() /
                             maxOf(bucket.size, 1)

            features.add(floatArrayOf(
                hour.toFloat() / 24f,  // Normalized hour
                signalRatio,            // Historical ratio
                bucket.size.toFloat() / 10f  // Normalized activity level
            ))
        }

        return features.toTypedArray()
    }
}
```

### 3.2 Premium AI Coach Integration

```kotlin
// AICoachWidget.kt
class AICoachWidget {
    private val groqClient = GroqClient(apiKey = BuildConfig.GROQ_API_KEY)

    suspend fun getContextualInsight(state: AppState): AIInsight {
        val prompt = buildPrompt(state)

        val response = groqClient.complete(
            model = "llama-3.3-70b-versatile",
            messages = listOf(
                Message(role = "system", content = getCoachPersonality()),
                Message(role = "user", content = prompt)
            ),
            temperature = 0.7,
            maxTokens = 100
        )

        return AIInsight(
            message = response.content,
            type = determineInsightType(state),
            urgency = calculateUrgency(state),
            displayDuration = 5000L
        )
    }

    private fun buildPrompt(state: AppState): String {
        return """
        User ${state.firstName} has:
        - Current ratio: ${state.currentRatio}%
        - Streak: ${state.dailyStreak} days
        - Time: ${getCurrentHour()}:00
        - Pattern: ${detectPattern(state)}

        Provide a brief, actionable insight (max 15 words).
        """.trimIndent()
    }
}
```

---

## PERFORMANCE OPTIMIZATIONS

### Battery Management

```kotlin
// BatteryOptimizedUpdater.kt
class BatteryOptimizedUpdater(context: Context) {
    private val powerManager = context.getSystemService(Context.POWER_SERVICE) as PowerManager
    private val batteryManager = context.getSystemService(Context.BATTERY_SERVICE) as BatteryManager

    fun scheduleUpdate() {
        val updateInterval = calculateOptimalInterval()

        val workRequest = PeriodicWorkRequestBuilder<WidgetUpdateWorker>(
            updateInterval, TimeUnit.MINUTES
        ).setConstraints(
            Constraints.Builder()
                .setRequiredNetworkType(NetworkType.NOT_REQUIRED)
                .setRequiresBatteryNotLow(true)
                .build()
        ).build()

        WorkManager.getInstance(context).enqueue(workRequest)
    }

    private fun calculateOptimalInterval(): Long {
        return when {
            powerManager.isPowerSaveMode -> 60L  // 1 hour in power save
            batteryManager.isCharging -> 1L      // 1 minute when charging
            isUserActive() -> 5L                 // 5 minutes when active
            else -> 30L                          // 30 minutes otherwise
        }
    }
}
```

### Memory Management

```kotlin
// MemoryEfficientRenderer.kt
object MemoryEfficientRenderer {
    private val bitmapCache = LruCache<String, Bitmap>(4 * 1024 * 1024) // 4MB cache

    fun renderWidget(state: AppState, type: String): RemoteViews {
        val cacheKey = "${type}_${state.currentRatio}_${state.isPremium}"

        val bitmap = bitmapCache.get(cacheKey) ?: run {
            val newBitmap = renderBitmap(state, type)
            bitmapCache.put(cacheKey, newBitmap)
            newBitmap
        }

        return RemoteViews(BuildConfig.APPLICATION_ID, R.layout.widget_canvas).apply {
            setImageViewBitmap(R.id.canvas, bitmap)
        }
    }
}
```

---

## DEPLOYMENT STRATEGY

### Rollout Phases

```yaml
Phase 1 - Alpha (Week 1-2):
  - Internal testing team (5 users)
  - All 3 widget types enabled
  - Extensive logging and analytics
  - Daily builds with rapid iteration

Phase 2 - Beta (Week 3-4):
  - Foundation members (100 users)
  - A/B testing different widget styles
  - Performance monitoring
  - Weekly releases

Phase 3 - Production (Week 5+):
  - Gradual rollout (10% → 50% → 100%)
  - Feature flags for premium features
  - Continuous monitoring
  - Bi-weekly update cycle
```

### Success Metrics Dashboard

```kotlin
// WidgetAnalytics.kt
class WidgetAnalytics {
    fun trackWidgetMetrics() {
        Firebase.Analytics.logEvent("widget_interaction") {
            param("widget_type", currentWidgetType)
            param("interaction_type", "tap")
            param("current_ratio", currentRatio)
            param("time_since_last_interaction", timeSinceLastInteraction)
            param("battery_level", batteryLevel)
            param("is_premium", isPremium)
        }
    }
}
```

---

## CONCLUSION

This technical specification provides a comprehensive roadmap for implementing world-class widgets for Signal/Noise. The architecture prioritizes:

1. **Performance**: Battery-efficient, memory-optimized
2. **Beauty**: Jony Ive-approved aesthetics
3. **Intelligence**: AI-powered insights for premium users
4. **Reliability**: Robust error handling and fallbacks

The modular design allows for independent development of each widget type while sharing core infrastructure. With proper execution, these widgets will set a new standard for productivity tools on Android.