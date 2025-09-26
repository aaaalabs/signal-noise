import { getCoachAdvice } from '../services/groqService';
import type { CoachResponse } from '../services/groqService';
import type { Task, AppData } from '../types';
import { calculateStreak, getAverageRatio } from '../utils/achievements';
import { checkAndActivatePersonalAI } from '../utils/betaPremiumHack';
import { checkPremiumStatus } from '../services/premiumService';

interface TaskAnalysis {
  totalSignals: number;
  completedSignals: number;
  completionRate: string;
  abandonedSignals: Array<{
    text: string;
    ageInDays: number;
  }>;
  oldestUncompletedSignal: {
    text: string;
    ageInDays: number;
  } | null;
}

/**
 * Personal AI Coach - Pure logic component for AICoach.tsx
 * No UI rendering - only provides enhanced AI coaching logic
 */
export default function PersonalAICoach() {
  return null;
}

/**
 * Deep task pattern analysis for Personal AI
 */
function analyzeTaskPatterns(tasks: Task[]): TaskAnalysis {
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
  const oldestSignal = signals
    .filter(t => !t.completed)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())[0];

  return {
    totalSignals: signals.length,
    completedSignals: completedSignals.length,
    completionRate: signals.length > 0 ? (completedSignals.length / signals.length * 100).toFixed(1) : '0',
    abandonedSignals,
    oldestUncompletedSignal: oldestSignal ? {
      text: oldestSignal.text,
      ageInDays: Math.floor((Date.now() - new Date(oldestSignal.timestamp).getTime()) / (1000 * 60 * 60 * 24))
    } : null
  };
}

/**
 * Get Personal AI coaching response - exported for AICoach.tsx
 */
export async function getPersonalCoaching(
  tasks: Task[],
  currentRatio: number,
  firstName: string,
  data: AppData
): Promise<CoachResponse | null> {
  // Check if personal AI is available
  const isActive = checkAndActivatePersonalAI();
  if (!isActive) return null;

  // Check premium status
  const premiumStatus = checkPremiumStatus();
  if (!premiumStatus.isActive) {
    console.log('Personal AI requires premium access');
    return null;
  }

  let userName = firstName || localStorage.getItem('userFirstName');
  if (!userName) {
    console.log('Personal AI requires user name');
    return null;
  }

  try {
    const analysis = analyzeTaskPatterns(tasks);

    // Build enhanced payload with full task visibility
    const currentStreak = calculateStreak(tasks);
    const averageRatio7Days = getAverageRatio(tasks, 7);

    const personalPayload = {
      firstName: userName,
      timestamp: new Date().toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      context: {
        triggerType: 'manual' as const,
        currentRatio,
        todayTasks: tasks.filter(t => {
          const today = new Date().toDateString();
          return new Date(t.timestamp).toDateString() === today;
        }).length,
        lastInteraction: new Date().toISOString(),
      },
      metrics: {
        currentStreak,
        longestStreak: currentStreak, // Simplified for now
        averageRatio7Days,
        averageRatio30Days: getAverageRatio(tasks, 30),
        totalDecisions: tasks.length,
        perfectDays: 0, // Simplified for now
        badges: data.badges,
      },
      patterns: {
        bestHour: 9, // Default values for now
        worstDay: 'Monday',
        hourlyDistribution: new Array(24).fill(0),
        weeklyPattern: new Array(7).fill({ signal: 0, noise: 0 }),
        trendDirection: 'stable' as const,
        consistencyScore: 0.8,
      },
      history: {
        recentTasks: tasks.slice(-10).map(t => ({
          text: t.text,
          type: t.type,
          timestamp: t.timestamp
        })),
        dailyRatios: []
      },
      // Personal AI specific data
      deepTaskAnalysis: {
        allTasks: tasks.map(t => ({
          text: t.text,
          type: t.type,
          completed: t.completed,
          ageInDays: Math.floor((Date.now() - new Date(t.timestamp).getTime()) / (1000 * 60 * 60 * 24))
        })),
        completionReality: analysis
      }
    };

    // Call groqService with personal AI flag
    const response = await getCoachAdvice(personalPayload, { isPersonalMode: true });
    return response;
  } catch (error) {
    console.error('Personal AI coaching error:', error);
    return {
      message: `Sorry, ${userName}. Personal AI coaching is temporarily unavailable.`,
      type: 'insight',
      emotionalTone: 'supportive'
    };
  }
}