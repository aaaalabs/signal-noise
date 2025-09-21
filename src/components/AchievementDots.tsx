import { useState } from 'react';
import type { AppData, Task } from '../types';
import { createBadgeDefinitions } from '../utils/achievements';
import { useTranslation } from '../contexts/LanguageContext';

interface AchievementDotsProps {
  data: AppData;
  earnedCount: number;
}

// Helper function to count completed signals after commitment
function getCompletedSignalsAfterCommitment(tasks: Task[], commitDate: string): number {
  const commitTime = new Date(commitDate);
  return tasks.filter(task =>
    task.type === 'signal' &&
    task.completed &&
    new Date(task.timestamp) >= commitTime
  ).length;
}

// Create post-commitment achievements
function createPostCommitmentAchievements(data: AppData) {
  const completedSignals = data.settings.commitModeActivatedAt
    ? getCompletedSignalsAfterCommitment(data.tasks, data.settings.commitModeActivatedAt)
    : 0;

  return [
    {
      id: 'signal_master',
      icon: '⚡',
      name: 'Signal Master',
      earned: data.badges.includes('signal_master')
    },
    {
      id: 'perfect_day',
      icon: '💎',
      name: 'Perfect Day',
      earned: data.badges.includes('perfect_day')
    },
    {
      id: 'week_warrior',
      icon: '🔥',
      name: '7 Day Streak',
      earned: data.badges.includes('week_warrior')
    },
    {
      id: 'month_hero',
      icon: '🏆',
      name: '30 Day Hero',
      earned: data.badges.includes('month_hero')
    },
    {
      id: '200_shipped',
      icon: '🎯',
      name: '200 Signals Shipped',
      earned: completedSignals >= 200
    },
    {
      id: '500_shipped',
      icon: '📍',
      name: '500 Signals Shipped',
      earned: completedSignals >= 500
    },
    {
      id: '1000_shipped',
      icon: '🚀',
      name: '1000 Signals Shipped',
      earned: completedSignals >= 1000
    },
    {
      id: '2000_shipped',
      icon: '⭐',
      name: '2000 Signals Shipped',
      earned: completedSignals >= 2000
    }
  ];
}

export default function AchievementDots({ data, earnedCount }: AchievementDotsProps) {
  const t = useTranslation();
  const [showTooltip, setShowTooltip] = useState(false);

  const isCommitmentMode = !!data.settings.commitModeActivatedAt;
  const basicBadges = createBadgeDefinitions(data);

  // Determine which achievements to show
  let displayAchievements;
  let totalCount;

  if (isCommitmentMode) {
    // Post-commitment: Show elite achievements only
    displayAchievements = createPostCommitmentAchievements(data);
    totalCount = displayAchievements.filter(a => a.earned).length;
  } else {
    // Pre-commitment: Show basic achievements
    displayAchievements = basicBadges.slice(0, 8);
    totalCount = earnedCount;
  }

  // No achievements = no dots
  if (totalCount === 0 && !isCommitmentMode) {
    return null;
  }

  const handleDotsClick = () => {
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 2000);
  };


  return (
    <div className="achievement-dots" onClick={handleDotsClick}>
      {displayAchievements.map((badge, index) => {
        const isEarned = ('earned' in badge ? badge.earned : false) || data.badges.includes(badge.id);
        const isRecent = index === totalCount - 1;

        return (
          <div
            key={badge.id}
            className={`achievement-dot ${isEarned ? 'earned' : ''} ${isRecent ? 'recent' : ''}`}
            title={isEarned ? badge.name : t.achievementLocked || 'Locked'}
          />
        );
      })}

      <div className={`achievement-tooltip ${showTooltip ? 'show' : ''}`}>
        <span>{totalCount}</span> / {displayAchievements.length} {t.achievementMilestones || 'milestones'}
      </div>
    </div>
  );
}