/**
 * Test Data Generator
 * Creates realistic task data for AI coach benchmarking
 */

/**
 * Generate task array from scenario task patterns
 */
export function generateTasks(taskPatterns, baseDate = new Date()) {
  const tasks = [];
  let taskId = 1;

  taskPatterns.forEach(pattern => {
    // Generate occurrences of this task pattern
    for (let i = 0; i < pattern.occurrences; i++) {
      const ageVariation = i * Math.floor(pattern.daysOld / Math.max(pattern.occurrences, 1));
      const taskDate = new Date(baseDate);
      taskDate.setDate(taskDate.getDate() - ageVariation);

      // Add some time variation within the day
      taskDate.setHours(
        taskDate.getHours() + Math.floor(Math.random() * 12) + 6
      );

      tasks.push({
        id: `task_${taskId++}`,
        text: pattern.text,
        type: pattern.type,
        completed: pattern.completed || false,
        timestamp: taskDate.toISOString(),
        metadata: {
          occurrenceIndex: i + 1,
          totalOccurrences: pattern.occurrences
        }
      });
    }
  });

  // Sort by timestamp (oldest first)
  return tasks.sort((a, b) =>
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
}

/**
 * Calculate metrics from task array
 */
export function calculateMetrics(tasks) {
  const now = new Date();
  const signals = tasks.filter(t => t.type === 'signal');
  const completedSignals = signals.filter(t => t.completed);

  // Calculate current ratio (today's tasks)
  const today = new Date().toDateString();
  const todaySignals = signals.filter(t =>
    new Date(t.timestamp).toDateString() === today
  );
  const todayCompletedSignals = todaySignals.filter(t => t.completed);
  const currentRatio = todaySignals.length > 0
    ? Math.round((todayCompletedSignals.length / todaySignals.length) * 100)
    : 0;

  // Calculate streak
  let streak = 0;
  let checkDate = new Date(now);
  const dailyRatios = calculateDailyRatios(tasks, 30);

  for (let i = dailyRatios.length - 1; i >= 0; i--) {
    if (dailyRatios[i].ratio >= 80 && dailyRatios[i].taskCount > 0) {
      streak++;
    } else if (dailyRatios[i].taskCount > 0) {
      break;
    }
  }

  // Calculate averages
  const last7Days = dailyRatios.slice(-7).filter(d => d.taskCount > 0);
  const last30Days = dailyRatios.filter(d => d.taskCount > 0);

  const averageRatio7Days = last7Days.length > 0
    ? Math.round(last7Days.reduce((sum, d) => sum + d.ratio, 0) / last7Days.length)
    : 0;

  const averageRatio30Days = last30Days.length > 0
    ? Math.round(last30Days.reduce((sum, d) => sum + d.ratio, 0) / last30Days.length)
    : 0;

  // Count perfect days
  const perfectDays = dailyRatios.filter(d => d.ratio === 100 && d.taskCount > 0).length;

  return {
    currentRatio,
    currentStreak: streak,
    longestStreak: streak, // Simplified
    averageRatio7Days,
    averageRatio30Days,
    totalDecisions: tasks.length,
    perfectDays,
    completionRate: signals.length > 0
      ? Math.round((completedSignals.length / signals.length) * 100)
      : 0
  };
}

/**
 * Calculate daily ratios for the last N days
 */
function calculateDailyRatios(tasks, days) {
  const ratios = [];
  const now = new Date();

  for (let i = 0; i < days; i++) {
    const checkDate = new Date(now);
    checkDate.setDate(checkDate.getDate() - (days - 1 - i));
    const dateString = checkDate.toDateString();

    const dayTasks = tasks.filter(t =>
      new Date(t.timestamp).toDateString() === dateString
    );

    const daySignals = dayTasks.filter(t => t.type === 'signal');
    const completedSignals = daySignals.filter(t => t.completed);

    const ratio = daySignals.length > 0
      ? Math.round((completedSignals.length / daySignals.length) * 100)
      : 0;

    ratios.push({
      date: checkDate.toISOString(),
      ratio,
      taskCount: dayTasks.length
    });
  }

  return ratios;
}

/**
 * Analyze patterns in tasks
 */
export function analyzePatterns(tasks) {
  const signals = tasks.filter(t => t.type === 'signal');

  // Hourly distribution
  const hourlyDistribution = new Array(24).fill(0);
  tasks.forEach(t => {
    const hour = new Date(t.timestamp).getHours();
    hourlyDistribution[hour]++;
  });

  // Best productive hour
  let bestHour = 9;
  let maxSignals = 0;
  hourlyDistribution.forEach((count, hour) => {
    const hourSignals = tasks.filter(t => {
      const taskHour = new Date(t.timestamp).getHours();
      return taskHour === hour && t.type === 'signal';
    }).length;

    if (hourSignals > maxSignals) {
      maxSignals = hourSignals;
      bestHour = hour;
    }
  });

  // Weekly pattern
  const weeklyPattern = new Array(7).fill(null).map(() => ({
    signal: 0,
    noise: 0
  }));

  tasks.forEach(t => {
    const day = new Date(t.timestamp).getDay();
    if (t.type === 'signal') {
      weeklyPattern[day].signal++;
    } else {
      weeklyPattern[day].noise++;
    }
  });

  // Trend direction (last 7 days vs previous 7 days)
  const dailyRatios = calculateDailyRatios(tasks, 14);
  const recentAvg = dailyRatios.slice(-7).reduce((sum, d) => sum + d.ratio, 0) / 7;
  const previousAvg = dailyRatios.slice(0, 7).reduce((sum, d) => sum + d.ratio, 0) / 7;

  let trendDirection = 'stable';
  if (recentAvg > previousAvg + 10) trendDirection = 'improving';
  else if (recentAvg < previousAvg - 10) trendDirection = 'declining';

  // Consistency score (variation in daily ratios)
  const ratioVariance = dailyRatios.reduce((sum, d) => {
    const diff = Math.abs(d.ratio - recentAvg);
    return sum + diff;
  }, 0) / dailyRatios.length;

  const consistencyScore = Math.max(0, 100 - ratioVariance);

  return {
    bestHour,
    worstDay: findWorstDay(weeklyPattern),
    hourlyDistribution,
    weeklyPattern,
    trendDirection,
    consistencyScore: Math.round(consistencyScore)
  };
}

function findWorstDay(weeklyPattern) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  let worstDay = 'Mon';
  let lowestRatio = 100;

  weeklyPattern.forEach((pattern, index) => {
    const total = pattern.signal + pattern.noise;
    if (total > 0) {
      const ratio = (pattern.signal / total) * 100;
      if (ratio < lowestRatio) {
        lowestRatio = ratio;
        worstDay = days[index];
      }
    }
  });

  return { day: worstDay, ratio: Math.round(lowestRatio) };
}

/**
 * Build deep task analysis for Personal AI
 */
export function buildDeepTaskAnalysis(tasks) {
  const signals = tasks.filter(t => t.type === 'signal');
  const completedSignals = signals.filter(t => t.completed);

  // Find abandoned signals (>3 days old, uncompleted)
  const abandonedSignals = signals.filter(t => {
    if (t.completed) return false;
    const age = (Date.now() - new Date(t.timestamp).getTime()) / (1000 * 60 * 60 * 24);
    return age > 3;
  }).map(t => ({
    text: t.text,
    ageInDays: Math.floor((Date.now() - new Date(t.timestamp).getTime()) / (1000 * 60 * 60 * 24))
  }));

  // Get oldest uncompleted signal
  const uncompletedSignals = signals.filter(t => !t.completed);
  const oldestSignal = uncompletedSignals.length > 0
    ? uncompletedSignals.sort((a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      )[0]
    : null;

  return {
    allTasks: tasks.map(t => ({
      text: t.text,
      type: t.type,
      completed: t.completed || false,
      ageInDays: Math.floor((Date.now() - new Date(t.timestamp).getTime()) / (1000 * 60 * 60 * 24))
    })),
    completionReality: {
      totalSignals: signals.length,
      completedSignals: completedSignals.length,
      completionRate: signals.length > 0
        ? ((completedSignals.length / signals.length) * 100).toFixed(1)
        : '0',
      abandonedSignals,
      oldestUncompletedSignal: oldestSignal ? {
        text: oldestSignal.text,
        ageInDays: Math.floor((Date.now() - new Date(t.timestamp).getTime()) / (1000 * 60 * 60 * 24))
      } : null
    }
  };
}

/**
 * Build complete coaching payload from scenario
 */
export function buildCoachingPayload(scenario, user, variation = {}) {
  const tasks = generateTasks(scenario.taskPatterns);
  const metrics = calculateMetrics(tasks);
  const patterns = analyzePatterns(tasks);
  const deepAnalysis = buildDeepTaskAnalysis(tasks);

  const now = new Date();
  const hour = variation.timeOfDay?.hour || now.getHours();
  now.setHours(hour);

  return {
    firstName: user.firstName,
    timestamp: now.toISOString(),
    timezone: variation.timezone || 'Europe/Vienna',
    context: {
      triggerType: variation.triggerType || 'manual',
      currentRatio: scenario.profile.currentRatio,
      todayTasks: tasks.filter(t =>
        new Date(t.timestamp).toDateString() === new Date().toDateString()
      ).length,
      lastInteraction: now.toISOString()
    },
    metrics: {
      ...metrics,
      badges: [] // Empty for benchmark
    },
    patterns,
    history: {
      recentTasks: tasks.slice(-10).map(t => ({
        text: t.text,
        type: t.type,
        timestamp: t.timestamp,
        completed: t.completed
      })),
      dailyRatios: calculateDailyRatios(tasks, 30)
    },
    // Personal AI specific data
    deepTaskAnalysis: deepAnalysis,

    // Full tasks array for analysis
    _tasks: tasks
  };
}
