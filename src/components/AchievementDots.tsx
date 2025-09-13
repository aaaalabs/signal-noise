import { useState } from 'react';
import type { AppData } from '../types';
import { createBadgeDefinitions } from '../utils/achievements';
import { useTranslation } from '../contexts/LanguageContext';

interface AchievementDotsProps {
  data: AppData;
  earnedCount: number;
}

export default function AchievementDots({ data, earnedCount }: AchievementDotsProps) {
  const t = useTranslation();
  const [showTooltip, setShowTooltip] = useState(false);
  const badgeDefinitions = createBadgeDefinitions(data);
  const totalBadges = badgeDefinitions.length;

  // No achievements = no dots
  if (earnedCount === 0) {
    return null;
  }

  const handleDotsClick = () => {
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 2000);
  };

  return (
    <div className="achievement-dots" onClick={handleDotsClick}>
      {badgeDefinitions.slice(0, Math.min(totalBadges, 8)).map((badge, index) => {
        const isEarned = data.badges.includes(badge.id);
        const isRecent = index === earnedCount - 1;

        return (
          <div
            key={badge.id}
            className={`achievement-dot ${isEarned ? 'earned' : ''} ${isRecent ? 'recent' : ''}`}
            title={isEarned ? badge.name : t.achievementLocked || 'Locked'}
          />
        );
      })}

      <div className={`achievement-tooltip ${showTooltip ? 'show' : ''}`}>
        <span>{earnedCount}</span> / {totalBadges} {t.achievementMilestones || 'milestones'}
      </div>
    </div>
  );
}