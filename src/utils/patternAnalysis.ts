import type { Task, PatternInsight } from '../types';
import { currentLang } from '../i18n/translations';

export function calculateDailyRatios(tasks: Task[], days: number = 30): number[] {
  const ratios: number[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayTasks = tasks.filter(t =>
      new Date(t.timestamp).toDateString() === date.toDateString()
    );

    if (dayTasks.length > 0) {
      const signals = dayTasks.filter(t => t.type === 'signal').length;
      ratios.push(Math.round((signals / dayTasks.length) * 100));
    } else {
      ratios.push(0);
    }
  }
  return ratios;
}

export function getBestProductiveHour(tasks: Task[]): number | null {
  const hourCounts: Record<number, number> = {};

  tasks.forEach(t => {
    const hour = new Date(t.timestamp).getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });

  const entries = Object.entries(hourCounts);
  if (entries.length === 0) return null;

  const bestHour = entries.sort((a, b) => parseInt(b[1].toString()) - parseInt(a[1].toString()))[0];
  return parseInt(bestHour[0]);
}

export function getWeeklyTrend(tasks: Task[]): { trend: number, direction: 'improving' | 'stable' | 'declining' } {
  const ratios = calculateDailyRatios(tasks, 14);
  const recent = ratios.slice(-7);
  const older = ratios.slice(0, 7);

  if (recent.length === 0 || older.length === 0) {
    return { trend: 0, direction: 'stable' };
  }

  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
  const trend = Math.round(recentAvg - olderAvg);

  let direction: 'improving' | 'stable' | 'declining' = 'stable';
  if (trend > 10) direction = 'improving';
  else if (trend < -10) direction = 'declining';

  return { trend, direction };
}

export function getWorstDayOfWeek(tasks: Task[]): { day: string, ratio: number } | null {
  const dayRatios: Record<number, { signal: number, total: number }> = {};
  const dayNames = currentLang === 'de'
    ? ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  tasks.forEach(t => {
    const day = new Date(t.timestamp).getDay();
    if (!dayRatios[day]) dayRatios[day] = { signal: 0, total: 0 };
    dayRatios[day].total++;
    if (t.type === 'signal') dayRatios[day].signal++;
  });

  let worstDay = null;
  let worstRatio = 100;

  Object.entries(dayRatios).forEach(([day, counts]) => {
    const ratio = (counts.signal / counts.total) * 100;
    if (ratio < worstRatio && counts.total > 3) {
      worstRatio = ratio;
      worstDay = { day: dayNames[parseInt(day)], ratio: Math.round(ratio) };
    }
  });

  return worstDay;
}

export function generatePatternInsights(tasks: Task[]): PatternInsight[] {
  const insights: PatternInsight[] = [];

  // Best productive hour
  const bestHour = getBestProductiveHour(tasks);
  if (bestHour !== null) {
    const message = currentLang === 'de'
      ? `Du bist am produktivsten um <strong>${bestHour} Uhr</strong>`
      : `You're most productive at <strong>${bestHour} o'clock</strong>`;
    insights.push({ type: 'neutral', message });
  }

  // Weekly trend analysis
  const { trend, direction } = getWeeklyTrend(tasks);
  if (direction === 'improving') {
    const message = currentLang === 'de'
      ? `Dein Fokus hat sich um <strong>+${trend}%</strong> verbessert diese Woche!`
      : `Your focus improved by <strong>+${trend}%</strong> this week!`;
    insights.push({ type: 'positive', message });
  } else if (direction === 'declining') {
    const message = currentLang === 'de'
      ? `Achtung: Dein Signal-Ratio ist um <strong>${trend}%</strong> gefallen.`
      : `Warning: Your Signal ratio dropped by <strong>${trend}%</strong>.`;
    insights.push({ type: 'warning', message });
  }

  // Worst day analysis
  const worstDay = getWorstDayOfWeek(tasks);
  if (worstDay) {
    const message = currentLang === 'de'
      ? `<strong>${worstDay.day}</strong> ist dein schwächster Tag (${worstDay.ratio}% Signal)`
      : `<strong>${worstDay.day}</strong> is your weakest day (${worstDay.ratio}% Signal)`;
    insights.push({ type: 'warning', message });
  }

  return insights;
}

export function getHourlyDistribution(tasks: Task[]): number[] {
  const distribution = Array(24).fill(0);

  tasks.forEach(t => {
    const hour = new Date(t.timestamp).getHours();
    distribution[hour]++;
  });

  return distribution;
}

export function getWeeklyPattern(tasks: Task[]): { signal: number; noise: number }[] {
  const pattern = Array(7).fill(null).map(() => ({ signal: 0, noise: 0 }));

  tasks.forEach(t => {
    const day = new Date(t.timestamp).getDay();
    if (t.type === 'signal') {
      pattern[day].signal++;
    } else {
      pattern[day].noise++;
    }
  });

  return pattern;
}

export function getConsistencyScore(tasks: Task[]): number {
  const ratios = calculateDailyRatios(tasks, 30).filter(r => r > 0);
  if (ratios.length === 0) return 0;

  const avg = ratios.reduce((a, b) => a + b, 0) / ratios.length;
  const variance = ratios.reduce((acc, ratio) => acc + Math.pow(ratio - avg, 2), 0) / ratios.length;
  const standardDeviation = Math.sqrt(variance);

  // Higher consistency = lower deviation. Scale to 0-100
  return Math.max(0, Math.round(100 - (standardDeviation / avg) * 100));
}