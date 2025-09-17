import type { BadgeDefinition, Task, AppData } from '../types';
import { currentLang } from '../i18n/translations';

export function calculateStreak(tasks: Task[]): number {
  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    const dayTasks = tasks.filter(t =>
      new Date(t.timestamp).toDateString() === date.toDateString()
    );

    if (dayTasks.length > 0) {
      const signals = dayTasks.filter(t => t.type === 'signal').length;
      const ratio = (signals / dayTasks.length) * 100;
      if (ratio >= 80) {
        streak++;
      } else {
        // Only break if we're not on the first day (today)
        // If today doesn't meet 80%, streak is 0
        break;
      }
    } else if (i === 0) {
      // Today has no tasks yet, continue checking yesterday
      continue;
    } else {
      // No tasks on a previous day breaks the streak
      break;
    }
  }

  return streak;
}

export function getAverageRatio(tasks: Task[], days: number): number {
  const ratios = [];
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
  return ratios.length > 0 ? Math.round(ratios.reduce((a, b) => a + b, 0) / ratios.length) : 0;
}

export function getTodayRatio(tasks: Task[]): number {
  const today = new Date().toDateString();
  const todayTasks = tasks.filter(t =>
    new Date(t.timestamp).toDateString() === today && !t.completed
  );
  const signals = todayTasks.filter(t => t.type === 'signal').length;
  return todayTasks.length > 0 ? Math.round((signals / todayTasks.length) * 100) : 0;
}

export function hasTaskBefore(tasks: Task[], hour: number): boolean {
  return tasks.some(t => {
    const taskHour = new Date(t.timestamp).getHours();
    return taskHour < hour;
  });
}

export function hasComeback(tasks: Task[]): boolean {
  const dates = [...new Set(tasks.map(t =>
    new Date(t.timestamp).toDateString()
  ))].sort();

  for (let i = 1; i < dates.length; i++) {
    const diff = (new Date(dates[i]).getTime() - new Date(dates[i-1]).getTime()) / (1000 * 60 * 60 * 24);
    if (diff >= 3) return true;
  }
  return false;
}

export function createBadgeDefinitions(data: AppData): BadgeDefinition[] {
  const badges = currentLang === 'de' ? {
    first_day: { icon: '🌟', name: 'Erste Entscheidung' },
    week_warrior: { icon: '🔥', name: '7 Tage Streak' },
    signal_master: { icon: '⚡', name: 'Signal Master' },
    perfect_day: { icon: '💎', name: 'Perfect Day' },
    month_hero: { icon: '🏆', name: '30 Tage Held' },
    early_bird: { icon: '🌅', name: 'Frühstarter' },
    decision_maker: { icon: '🎯', name: '100 Entscheidungen' },
    comeback: { icon: '💪', name: 'Comeback Kid' }
  } : {
    first_day: { icon: '🌟', name: 'First Decision' },
    week_warrior: { icon: '🔥', name: '7 Day Streak' },
    signal_master: { icon: '⚡', name: 'Signal Master' },
    perfect_day: { icon: '💎', name: 'Perfect Day' },
    month_hero: { icon: '🏆', name: '30 Day Hero' },
    early_bird: { icon: '🌅', name: 'Early Bird' },
    decision_maker: { icon: '🎯', name: '100 Decisions' },
    comeback: { icon: '💪', name: 'Comeback Kid' }
  };

  return [
    {
      id: 'first_day',
      icon: badges.first_day.icon,
      name: badges.first_day.name,
      condition: () => data.tasks.length >= 1
    },
    {
      id: 'week_warrior',
      icon: badges.week_warrior.icon,
      name: badges.week_warrior.name,
      condition: () => calculateStreak(data.tasks) >= 7
    },
    {
      id: 'signal_master',
      icon: badges.signal_master.icon,
      name: badges.signal_master.name,
      condition: () => getAverageRatio(data.tasks, 7) >= 80
    },
    {
      id: 'perfect_day',
      icon: badges.perfect_day.icon,
      name: badges.perfect_day.name,
      condition: () => getTodayRatio(data.tasks) === 100 && getTodayTasks(data.tasks).length >= 3
    },
    {
      id: 'month_hero',
      icon: badges.month_hero.icon,
      name: badges.month_hero.name,
      condition: () => calculateStreak(data.tasks) >= 30
    },
    {
      id: 'early_bird',
      icon: badges.early_bird.icon,
      name: badges.early_bird.name,
      condition: () => hasTaskBefore(data.tasks, 9)
    },
    {
      id: 'decision_maker',
      icon: badges.decision_maker.icon,
      name: badges.decision_maker.name,
      condition: () => data.tasks.length >= 100
    },
    {
      id: 'comeback',
      icon: badges.comeback.icon,
      name: badges.comeback.name,
      condition: () => hasComeback(data.tasks)
    }
  ];
}

function getTodayTasks(tasks: Task[]): Task[] {
  const today = new Date().toDateString();
  return tasks.filter(t =>
    new Date(t.timestamp).toDateString() === today
  );
}

export function checkAchievements(data: AppData): { newBadges: BadgeDefinition[], earnedCount: number } {
  const badgeDefinitions = createBadgeDefinitions(data);
  const newBadges: BadgeDefinition[] = [];

  badgeDefinitions.forEach(badge => {
    if (badge.condition() && !data.badges.includes(badge.id)) {
      newBadges.push(badge);
    }
  });

  return {
    newBadges,
    earnedCount: data.badges.length + newBadges.length
  };
}

export function getStreakData(tasks: Task[]): { streak: number, isMilestone: boolean } {
  const streak = calculateStreak(tasks);
  const isMilestone = streak === 7 || streak === 30 || streak === 100;
  return { streak, isMilestone };
}