export interface Task {
  id: number;
  text: string;
  type: 'signal' | 'noise';
  timestamp: string;
  completed: boolean;
}

export interface Badge {
  id: string;
  icon: string;
  name: string;
  earned: boolean;
}

export interface BadgeDefinition {
  id: string;
  icon: string;
  name: string;
  condition: () => boolean;
}

export interface PatternInsight {
  type: 'positive' | 'warning' | 'neutral';
  message: string;
}

export interface AchievementState {
  newBadge?: BadgeDefinition;
  showGlow: boolean;
  showWhisper: boolean;
  whisperMessage: string;
}

export interface DayRatio {
  date: string;
  ratio: number;
  taskCount: number;
}

export interface AppData {
  tasks: Task[];
  history: DayRatio[];
  badges: string[];
  patterns: Record<string, any>;
  settings: {
    targetRatio: number;
    notifications: boolean;
    firstName?: string;
  };
}

export interface CoachPayload {
  firstName: string;
  timestamp: string;
  timezone: string;
  context: {
    triggerType: 'morning' | 'evening' | 'intervention' | 'milestone' | 'manual';
    currentRatio: number;
    todayTasks: number;
    lastInteraction: string;
  };
  metrics: {
    currentStreak: number;
    longestStreak: number;
    averageRatio7Days: number;
    averageRatio30Days: number;
    totalDecisions: number;
    perfectDays: number;
    badges: string[];
  };
  patterns: {
    bestHour: number;
    worstDay: string;
    hourlyDistribution: number[];
    weeklyPattern: { signal: number; noise: number }[];
    trendDirection: 'improving' | 'stable' | 'declining';
    consistencyScore: number;
  };
  history: {
    recentTasks: Array<{ text: string; type: string; timestamp: string }>;
    dailyRatios: Array<{ date: string; ratio: number; taskCount: number }>;
  };
}