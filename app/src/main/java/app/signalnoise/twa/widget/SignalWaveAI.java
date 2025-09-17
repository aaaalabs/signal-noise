package app.signalnoise.twa.widget;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;
import org.json.JSONObject;
import org.json.JSONArray;
import java.util.ArrayList;
import java.util.List;
import java.util.HashMap;
import java.util.Map;
import java.util.Calendar;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * Signal Wave AI Intelligence Engine
 *
 * Phase 3: Intelligence Layer
 * Provides pattern recognition, predictions, and AI coaching
 *
 * Design Philosophy: Intelligent insights without overwhelming
 * Privacy First: All analysis done locally, only insights shared
 */
public class SignalWaveAI {

    private static final String TAG = "SignalWaveAI";
    private static final String PREFS_NAME = "SignalNoiseAI";

    // AI Configuration
    private static final double CONFIDENCE_THRESHOLD = 0.75;
    private static final int MIN_DATA_POINTS = 20;
    private static final int PATTERN_WINDOW_HOURS = 168; // 7 days

    private Context context;
    private SharedPreferences prefs;
    private PatternAnalyzer patternAnalyzer;
    private PredictionEngine predictionEngine;
    private InsightGenerator insightGenerator;
    private ScheduledExecutorService analysisScheduler;

    public SignalWaveAI(Context context) {
        this.context = context;
        this.prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        this.patternAnalyzer = new PatternAnalyzer();
        this.predictionEngine = new PredictionEngine();
        this.insightGenerator = new InsightGenerator();

        initializeAnalysisScheduler();
    }

    /**
     * Initialize background analysis scheduler
     */
    private void initializeAnalysisScheduler() {
        analysisScheduler = Executors.newSingleThreadScheduledExecutor();

        // Run analysis every hour
        analysisScheduler.scheduleAtFixedRate(() -> {
            try {
                analyzePatterns();
                generatePredictions();
                updateInsights();
            } catch (Exception e) {
                Log.e(TAG, "Analysis failed", e);
            }
        }, 0, 1, TimeUnit.HOURS);
    }

    /**
     * Analyze user patterns for insights
     */
    public PatternAnalysis analyzePatterns() {
        List<TaskData> taskHistory = loadTaskHistory();

        if (taskHistory.size() < MIN_DATA_POINTS) {
            return PatternAnalysis.INSUFFICIENT_DATA;
        }

        PatternAnalysis analysis = new PatternAnalysis();

        // Hourly productivity patterns
        analysis.hourlyPatterns = patternAnalyzer.analyzeHourlyPatterns(taskHistory);

        // Day of week patterns
        analysis.weeklyPatterns = patternAnalyzer.analyzeWeeklyPatterns(taskHistory);

        // Streak and consistency analysis
        analysis.streakAnalysis = patternAnalyzer.analyzeStreaks(taskHistory);

        // Productivity trends
        analysis.trends = patternAnalyzer.analyzeTrends(taskHistory);

        // Behavioral patterns
        analysis.behaviors = patternAnalyzer.analyzeBehaviors(taskHistory);

        // Store analysis
        storeAnalysis(analysis);

        Log.d(TAG, "Pattern analysis complete: " + analysis.getSummary());

        return analysis;
    }

    /**
     * Generate predictions based on patterns
     */
    public Prediction generatePredictions() {
        PatternAnalysis patterns = loadStoredAnalysis();

        if (patterns == null) {
            return Prediction.NO_PREDICTION;
        }

        Prediction prediction = new Prediction();

        // Predict next task type
        prediction.nextTaskType = predictionEngine.predictNextTaskType(patterns);
        prediction.taskConfidence = predictionEngine.calculateConfidence(patterns);

        // Predict optimal work time
        prediction.optimalWorkTime = predictionEngine.predictOptimalWorkTime(patterns);

        // Predict productivity for next hour
        prediction.nextHourProductivity = predictionEngine.predictNextHourProductivity(patterns);

        // Predict end-of-day ratio
        prediction.endOfDayRatio = predictionEngine.predictEndOfDayRatio(patterns);

        // Store predictions
        storePrediction(prediction);

        Log.d(TAG, "Predictions generated: " + prediction.getSummary());

        return prediction;
    }

    /**
     * Update AI insights for premium users
     */
    public AIInsight updateInsights() {
        if (!isPremiumUser()) {
            return null;
        }

        PatternAnalysis patterns = loadStoredAnalysis();
        Prediction predictions = loadStoredPrediction();

        if (patterns == null || predictions == null) {
            return null;
        }

        // Generate contextual insight
        AIInsight insight = insightGenerator.generate(patterns, predictions, getCurrentContext());

        // Store insight
        storeInsight(insight);

        Log.d(TAG, "AI insight generated: " + insight.message);

        return insight;
    }

    /**
     * Get current AI insight for widget display
     */
    public String getCurrentInsight() {
        AIInsight insight = loadStoredInsight();

        if (insight == null || insight.isExpired()) {
            return null;
        }

        return insight.message;
    }

    /**
     * Get prediction confidence for current context
     */
    public float getPredictionConfidence() {
        Prediction prediction = loadStoredPrediction();

        if (prediction == null) {
            return 0f;
        }

        return prediction.taskConfidence;
    }

    /**
     * Pattern Analyzer - Identifies behavioral patterns
     */
    private class PatternAnalyzer {

        HourlyPattern[] analyzeHourlyPatterns(List<TaskData> tasks) {
            HourlyPattern[] patterns = new HourlyPattern[24];

            // Initialize patterns
            for (int hour = 0; hour < 24; hour++) {
                patterns[hour] = new HourlyPattern(hour);
            }

            // Analyze each task
            for (TaskData task : tasks) {
                int hour = task.getHour();
                patterns[hour].addTask(task);
            }

            // Calculate statistics
            for (HourlyPattern pattern : patterns) {
                pattern.calculateStats();
            }

            return patterns;
        }

        WeeklyPattern analyzeWeeklyPatterns(List<TaskData> tasks) {
            WeeklyPattern pattern = new WeeklyPattern();

            Map<Integer, List<TaskData>> dayTasks = new HashMap<>();

            for (TaskData task : tasks) {
                int dayOfWeek = task.getDayOfWeek();
                dayTasks.computeIfAbsent(dayOfWeek, k -> new ArrayList<>()).add(task);
            }

            for (Map.Entry<Integer, List<TaskData>> entry : dayTasks.entrySet()) {
                pattern.setDayStats(entry.getKey(), calculateDayStats(entry.getValue()));
            }

            return pattern;
        }

        StreakAnalysis analyzeStreaks(List<TaskData> tasks) {
            StreakAnalysis analysis = new StreakAnalysis();

            int currentStreak = 0;
            int maxStreak = 0;
            int totalDays = 0;

            // Group tasks by day and analyze
            Map<String, List<TaskData>> dailyTasks = groupByDay(tasks);

            for (List<TaskData> dayTasks : dailyTasks.values()) {
                float dayRatio = calculateRatio(dayTasks);

                if (dayRatio >= 50) {
                    currentStreak++;
                    maxStreak = Math.max(maxStreak, currentStreak);
                } else {
                    currentStreak = 0;
                }

                totalDays++;
            }

            analysis.currentStreak = currentStreak;
            analysis.longestStreak = maxStreak;
            analysis.consistency = (float) currentStreak / Math.max(totalDays, 1);

            return analysis;
        }

        TrendAnalysis analyzeTrends(List<TaskData> tasks) {
            TrendAnalysis trends = new TrendAnalysis();

            // Calculate moving averages
            List<Float> ratios = calculateDailyRatios(tasks);

            if (ratios.size() >= 7) {
                trends.weekTrend = calculateTrend(ratios.subList(ratios.size() - 7, ratios.size()));
            }

            if (ratios.size() >= 30) {
                trends.monthTrend = calculateTrend(ratios.subList(ratios.size() - 30, ratios.size()));
            }

            // Momentum calculation
            if (ratios.size() >= 3) {
                float recent = average(ratios.subList(ratios.size() - 3, ratios.size()));
                float previous = average(ratios.subList(Math.max(0, ratios.size() - 6), ratios.size() - 3));
                trends.momentum = recent - previous;
            }

            return trends;
        }

        BehaviorAnalysis analyzeBehaviors(List<TaskData> tasks) {
            BehaviorAnalysis behaviors = new BehaviorAnalysis();

            // Identify work patterns
            behaviors.isEarlyBird = checkEarlyBird(tasks);
            behaviors.isNightOwl = checkNightOwl(tasks);
            behaviors.isConsistent = checkConsistency(tasks);
            behaviors.isBursty = checkBurstiness(tasks);

            // Identify optimal conditions
            behaviors.optimalHour = findOptimalHour(tasks);
            behaviors.optimalDayOfWeek = findOptimalDayOfWeek(tasks);

            return behaviors;
        }

        private float calculateRatio(List<TaskData> tasks) {
            if (tasks.isEmpty()) return 50f;

            int signalCount = 0;
            for (TaskData task : tasks) {
                if (task.isSignal) signalCount++;
            }

            return (float) signalCount / tasks.size() * 100f;
        }

        private Map<String, List<TaskData>> groupByDay(List<TaskData> tasks) {
            Map<String, List<TaskData>> grouped = new HashMap<>();
            for (TaskData task : tasks) {
                String day = task.getDateString();
                grouped.computeIfAbsent(day, k -> new ArrayList<>()).add(task);
            }
            return grouped;
        }

        private List<Float> calculateDailyRatios(List<TaskData> tasks) {
            Map<String, List<TaskData>> dailyTasks = groupByDay(tasks);
            List<Float> ratios = new ArrayList<>();

            for (List<TaskData> dayTasks : dailyTasks.values()) {
                ratios.add(calculateRatio(dayTasks));
            }

            return ratios;
        }

        private float calculateTrend(List<Float> values) {
            if (values.size() < 2) return 0f;

            // Simple linear regression
            float sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
            int n = values.size();

            for (int i = 0; i < n; i++) {
                sumX += i;
                sumY += values.get(i);
                sumXY += i * values.get(i);
                sumX2 += i * i;
            }

            return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        }

        private float average(List<Float> values) {
            float sum = 0;
            for (float value : values) {
                sum += value;
            }
            return sum / values.size();
        }

        private boolean checkEarlyBird(List<TaskData> tasks) {
            int morningTasks = 0;
            int totalTasks = 0;

            for (TaskData task : tasks) {
                if (task.getHour() >= 5 && task.getHour() < 9) {
                    morningTasks++;
                }
                totalTasks++;
            }

            return (float) morningTasks / totalTasks > 0.3f;
        }

        private boolean checkNightOwl(List<TaskData> tasks) {
            int nightTasks = 0;
            int totalTasks = 0;

            for (TaskData task : tasks) {
                if (task.getHour() >= 21 || task.getHour() < 3) {
                    nightTasks++;
                }
                totalTasks++;
            }

            return (float) nightTasks / totalTasks > 0.3f;
        }

        private boolean checkConsistency(List<TaskData> tasks) {
            List<Float> dailyRatios = calculateDailyRatios(tasks);
            if (dailyRatios.size() < 7) return false;

            // Calculate standard deviation
            float mean = average(dailyRatios);
            float variance = 0;

            for (float ratio : dailyRatios) {
                variance += Math.pow(ratio - mean, 2);
            }

            float stdDev = (float) Math.sqrt(variance / dailyRatios.size());

            // Consistent if standard deviation is low
            return stdDev < 15f;
        }

        private boolean checkBurstiness(List<TaskData> tasks) {
            // Group tasks by hour
            Map<String, Integer> hourlyCount = new HashMap<>();

            for (TaskData task : tasks) {
                String hourKey = task.getDateString() + "_" + task.getHour();
                hourlyCount.put(hourKey, hourlyCount.getOrDefault(hourKey, 0) + 1);
            }

            // Check for burst patterns
            int bursts = 0;
            for (int count : hourlyCount.values()) {
                if (count > 5) bursts++;
            }

            return bursts > hourlyCount.size() * 0.2f;
        }

        private int findOptimalHour(List<TaskData> tasks) {
            HourlyPattern[] patterns = analyzeHourlyPatterns(tasks);
            int optimalHour = 9; // Default
            float maxRatio = 0;

            for (HourlyPattern pattern : patterns) {
                if (pattern.averageRatio > maxRatio) {
                    maxRatio = pattern.averageRatio;
                    optimalHour = pattern.hour;
                }
            }

            return optimalHour;
        }

        private int findOptimalDayOfWeek(List<TaskData> tasks) {
            WeeklyPattern pattern = analyzeWeeklyPatterns(tasks);
            return pattern.getOptimalDay();
        }

        private DayStats calculateDayStats(List<TaskData> tasks) {
            DayStats stats = new DayStats();
            stats.taskCount = tasks.size();
            stats.ratio = calculateRatio(tasks);
            return stats;
        }
    }

    /**
     * Prediction Engine - Generates future predictions
     */
    private class PredictionEngine {

        String predictNextTaskType(PatternAnalysis patterns) {
            int currentHour = Calendar.getInstance().get(Calendar.HOUR_OF_DAY);

            if (patterns.hourlyPatterns != null && patterns.hourlyPatterns[currentHour] != null) {
                HourlyPattern pattern = patterns.hourlyPatterns[currentHour];
                return pattern.averageRatio >= 50 ? "signal" : "noise";
            }

            return "signal"; // Default optimistic
        }

        float calculateConfidence(PatternAnalysis patterns) {
            // Base confidence on data quality and consistency
            float confidence = 0.5f;

            if (patterns.streakAnalysis != null) {
                confidence += patterns.streakAnalysis.consistency * 0.3f;
            }

            if (patterns.behaviors != null && patterns.behaviors.isConsistent) {
                confidence += 0.2f;
            }

            return Math.min(confidence, 0.95f);
        }

        int predictOptimalWorkTime(PatternAnalysis patterns) {
            if (patterns.behaviors != null) {
                return patterns.behaviors.optimalHour;
            }
            return 9; // Default morning
        }

        float predictNextHourProductivity(PatternAnalysis patterns) {
            int nextHour = (Calendar.getInstance().get(Calendar.HOUR_OF_DAY) + 1) % 24;

            if (patterns.hourlyPatterns != null && patterns.hourlyPatterns[nextHour] != null) {
                return patterns.hourlyPatterns[nextHour].averageRatio;
            }

            return 70f; // Default optimistic
        }

        float predictEndOfDayRatio(PatternAnalysis patterns) {
            // Based on current performance and typical patterns
            float currentRatio = getCurrentRatio();
            float typicalEndRatio = 75f;

            if (patterns.trends != null) {
                typicalEndRatio += patterns.trends.momentum * 5f;
            }

            // Weighted average
            return currentRatio * 0.7f + typicalEndRatio * 0.3f;
        }
    }

    /**
     * Insight Generator - Creates human-readable insights
     */
    private class InsightGenerator {

        AIInsight generate(PatternAnalysis patterns, Prediction predictions, Context context) {
            AIInsight insight = new AIInsight();

            // Choose most relevant insight type
            InsightType type = selectInsightType(patterns, predictions);

            switch (type) {
                case STREAK_CELEBRATION:
                    insight = generateStreakInsight(patterns.streakAnalysis);
                    break;
                case OPTIMAL_TIME:
                    insight = generateOptimalTimeInsight(patterns.behaviors);
                    break;
                case TREND_ALERT:
                    insight = generateTrendInsight(patterns.trends);
                    break;
                case PREDICTION:
                    insight = generatePredictionInsight(predictions);
                    break;
                case ENCOURAGEMENT:
                default:
                    insight = generateEncouragementInsight(patterns);
                    break;
            }

            insight.timestamp = System.currentTimeMillis();
            insight.confidence = predictions.taskConfidence;

            return insight;
        }

        InsightType selectInsightType(PatternAnalysis patterns, Prediction predictions) {
            // Priority logic for insight selection
            if (patterns.streakAnalysis != null && patterns.streakAnalysis.currentStreak >= 7) {
                return InsightType.STREAK_CELEBRATION;
            }

            if (patterns.trends != null && Math.abs(patterns.trends.momentum) > 10) {
                return InsightType.TREND_ALERT;
            }

            if (predictions.taskConfidence > CONFIDENCE_THRESHOLD) {
                return InsightType.PREDICTION;
            }

            if (patterns.behaviors != null && patterns.behaviors.optimalHour != -1) {
                int currentHour = Calendar.getInstance().get(Calendar.HOUR_OF_DAY);
                if (Math.abs(currentHour - patterns.behaviors.optimalHour) <= 1) {
                    return InsightType.OPTIMAL_TIME;
                }
            }

            return InsightType.ENCOURAGEMENT;
        }

        AIInsight generateStreakInsight(StreakAnalysis streak) {
            AIInsight insight = new AIInsight();
            insight.type = InsightType.STREAK_CELEBRATION;
            insight.message = String.format("%d day streak! Your longest was %d days.",
                                           streak.currentStreak, streak.longestStreak);
            insight.emotion = "celebration";
            return insight;
        }

        AIInsight generateOptimalTimeInsight(BehaviorAnalysis behaviors) {
            AIInsight insight = new AIInsight();
            insight.type = InsightType.OPTIMAL_TIME;
            insight.message = String.format("Your peak performance is at %d:00. Schedule important tasks now.",
                                           behaviors.optimalHour);
            insight.emotion = "informative";
            return insight;
        }

        AIInsight generateTrendInsight(TrendAnalysis trends) {
            AIInsight insight = new AIInsight();
            insight.type = InsightType.TREND_ALERT;

            if (trends.momentum > 0) {
                insight.message = "Productivity trending up! Keep the momentum going.";
                insight.emotion = "encouraging";
            } else {
                insight.message = "Time to refocus. Small wins build big victories.";
                insight.emotion = "supportive";
            }

            return insight;
        }

        AIInsight generatePredictionInsight(Prediction prediction) {
            AIInsight insight = new AIInsight();
            insight.type = InsightType.PREDICTION;
            insight.message = String.format("Next hour productivity: %.0f%%. Stay focused!",
                                           prediction.nextHourProductivity);
            insight.emotion = "predictive";
            return insight;
        }

        AIInsight generateEncouragementInsight(PatternAnalysis patterns) {
            AIInsight insight = new AIInsight();
            insight.type = InsightType.ENCOURAGEMENT;

            String[] encouragements = {
                "Every signal task moves you forward.",
                "Focus on progress, not perfection.",
                "You're building great habits!",
                "Small steps, big impact."
            };

            int index = (int) (System.currentTimeMillis() % encouragements.length);
            insight.message = encouragements[index];
            insight.emotion = "supportive";

            return insight;
        }
    }

    // Data structures and helper methods continue...

    private List<TaskData> loadTaskHistory() {
        // Load from SharedPreferences or database
        List<TaskData> tasks = new ArrayList<>();
        // Implementation would load actual task history
        return tasks;
    }

    private void storeAnalysis(PatternAnalysis analysis) {
        try {
            JSONObject json = new JSONObject();
            json.put("analysis", analysis.toJson());
            json.put("timestamp", System.currentTimeMillis());

            prefs.edit().putString("pattern_analysis", json.toString()).apply();
        } catch (Exception e) {
            Log.e(TAG, "Failed to store analysis", e);
        }
    }

    private PatternAnalysis loadStoredAnalysis() {
        try {
            String json = prefs.getString("pattern_analysis", null);
            if (json != null) {
                return PatternAnalysis.fromJson(new JSONObject(json));
            }
        } catch (Exception e) {
            Log.e(TAG, "Failed to load analysis", e);
        }
        return null;
    }

    private void storePrediction(Prediction prediction) {
        try {
            prefs.edit().putString("prediction", prediction.toJson().toString()).apply();
        } catch (Exception e) {
            Log.e(TAG, "Failed to store prediction", e);
        }
    }

    private Prediction loadStoredPrediction() {
        try {
            String json = prefs.getString("prediction", null);
            if (json != null) {
                return Prediction.fromJson(new JSONObject(json));
            }
        } catch (Exception e) {
            Log.e(TAG, "Failed to load prediction", e);
        }
        return null;
    }

    private void storeInsight(AIInsight insight) {
        try {
            prefs.edit().putString("ai_insight", insight.toJson().toString()).apply();
        } catch (Exception e) {
            Log.e(TAG, "Failed to store insight", e);
        }
    }

    private AIInsight loadStoredInsight() {
        try {
            String json = prefs.getString("ai_insight", null);
            if (json != null) {
                return AIInsight.fromJson(new JSONObject(json));
            }
        } catch (Exception e) {
            Log.e(TAG, "Failed to load insight", e);
        }
        return null;
    }

    private boolean isPremiumUser() {
        return prefs.getBoolean("is_premium", false);
    }

    private Context getCurrentContext() {
        return context;
    }

    private float getCurrentRatio() {
        return prefs.getFloat("current_ratio", 80f);
    }

    public void cleanup() {
        if (analysisScheduler != null && !analysisScheduler.isShutdown()) {
            analysisScheduler.shutdown();
        }
    }

    // Inner classes for data structures

    private static class TaskData {
        long timestamp;
        boolean isSignal;

        int getHour() {
            Calendar cal = Calendar.getInstance();
            cal.setTimeInMillis(timestamp);
            return cal.get(Calendar.HOUR_OF_DAY);
        }

        int getDayOfWeek() {
            Calendar cal = Calendar.getInstance();
            cal.setTimeInMillis(timestamp);
            return cal.get(Calendar.DAY_OF_WEEK);
        }

        String getDateString() {
            Calendar cal = Calendar.getInstance();
            cal.setTimeInMillis(timestamp);
            return String.format("%d-%02d-%02d",
                cal.get(Calendar.YEAR),
                cal.get(Calendar.MONTH) + 1,
                cal.get(Calendar.DAY_OF_MONTH));
        }
    }

    static class PatternAnalysis {
        static final PatternAnalysis INSUFFICIENT_DATA = new PatternAnalysis();

        HourlyPattern[] hourlyPatterns;
        WeeklyPattern weeklyPatterns;
        StreakAnalysis streakAnalysis;
        TrendAnalysis trends;
        BehaviorAnalysis behaviors;

        String getSummary() {
            return "Patterns analyzed";
        }

        JSONObject toJson() throws Exception {
            return new JSONObject();
        }

        static PatternAnalysis fromJson(JSONObject json) {
            return new PatternAnalysis();
        }
    }

    static class HourlyPattern {
        int hour;
        float averageRatio;
        int taskCount;

        HourlyPattern(int hour) {
            this.hour = hour;
        }

        void addTask(TaskData task) {
            taskCount++;
        }

        void calculateStats() {
            // Calculate average ratio for this hour
        }
    }

    static class WeeklyPattern {
        Map<Integer, DayStats> dayStats = new HashMap<>();

        void setDayStats(int day, DayStats stats) {
            dayStats.put(day, stats);
        }

        int getOptimalDay() {
            int optimalDay = Calendar.MONDAY;
            float maxRatio = 0;

            for (Map.Entry<Integer, DayStats> entry : dayStats.entrySet()) {
                if (entry.getValue().ratio > maxRatio) {
                    maxRatio = entry.getValue().ratio;
                    optimalDay = entry.getKey();
                }
            }

            return optimalDay;
        }
    }

    static class DayStats {
        int taskCount;
        float ratio;
    }

    static class StreakAnalysis {
        int currentStreak;
        int longestStreak;
        float consistency;
    }

    static class TrendAnalysis {
        float weekTrend;
        float monthTrend;
        float momentum;
    }

    static class BehaviorAnalysis {
        boolean isEarlyBird;
        boolean isNightOwl;
        boolean isConsistent;
        boolean isBursty;
        int optimalHour = -1;
        int optimalDayOfWeek = -1;
    }

    static class Prediction {
        static final Prediction NO_PREDICTION = new Prediction();

        String nextTaskType = "signal";
        float taskConfidence = 0.5f;
        int optimalWorkTime = 9;
        float nextHourProductivity = 70f;
        float endOfDayRatio = 75f;

        String getSummary() {
            return String.format("Next: %s (%.0f%% confidence)", nextTaskType, taskConfidence * 100);
        }

        JSONObject toJson() throws Exception {
            JSONObject json = new JSONObject();
            json.put("nextTaskType", nextTaskType);
            json.put("taskConfidence", taskConfidence);
            json.put("optimalWorkTime", optimalWorkTime);
            json.put("nextHourProductivity", nextHourProductivity);
            json.put("endOfDayRatio", endOfDayRatio);
            return json;
        }

        static Prediction fromJson(JSONObject json) {
            Prediction p = new Prediction();
            p.nextTaskType = json.optString("nextTaskType", "signal");
            p.taskConfidence = (float) json.optDouble("taskConfidence", 0.5);
            p.optimalWorkTime = json.optInt("optimalWorkTime", 9);
            p.nextHourProductivity = (float) json.optDouble("nextHourProductivity", 70);
            p.endOfDayRatio = (float) json.optDouble("endOfDayRatio", 75);
            return p;
        }
    }

    static class AIInsight {
        InsightType type;
        String message;
        String emotion;
        float confidence;
        long timestamp;

        boolean isExpired() {
            // Insights expire after 1 hour
            return System.currentTimeMillis() - timestamp > 3600000;
        }

        JSONObject toJson() throws Exception {
            JSONObject json = new JSONObject();
            json.put("type", type.name());
            json.put("message", message);
            json.put("emotion", emotion);
            json.put("confidence", confidence);
            json.put("timestamp", timestamp);
            return json;
        }

        static AIInsight fromJson(JSONObject json) {
            AIInsight insight = new AIInsight();
            insight.type = InsightType.valueOf(json.optString("type", "ENCOURAGEMENT"));
            insight.message = json.optString("message", "");
            insight.emotion = json.optString("emotion", "supportive");
            insight.confidence = (float) json.optDouble("confidence", 0.5);
            insight.timestamp = json.optLong("timestamp", System.currentTimeMillis());
            return insight;
        }
    }

    enum InsightType {
        STREAK_CELEBRATION,
        OPTIMAL_TIME,
        TREND_ALERT,
        PREDICTION,
        ENCOURAGEMENT
    }
}