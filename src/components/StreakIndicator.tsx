import { useEffect, useState } from 'react';
import type { Task } from '../types';
import { getStreakData } from '../utils/achievements';
import { useLanguage } from '../contexts/LanguageContext';

interface StreakIndicatorProps {
  tasks: Task[];
}

export default function StreakIndicator({ tasks }: StreakIndicatorProps) {
  const { currentLanguage } = useLanguage();
  const [showMilestone, setShowMilestone] = useState(false);
  const { streak, isMilestone } = getStreakData(tasks);

  // Calculate total unique days with tasks
  const totalDays = new Set(
    tasks.map(t => new Date(t.timestamp).toDateString())
  ).size;

  useEffect(() => {
    if (isMilestone) {
      setShowMilestone(true);
      const timer = setTimeout(() => {
        setShowMilestone(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isMilestone]);

  // Don't show anything if no days recorded
  if (totalDays === 0) {
    return null;
  }

  const dayText = currentLanguage === 'de' ? 'Tag' : 'Day';
  const totalText = currentLanguage === 'de' ? 'Gesamt' : 'Total';

  return (
    <span
      className={`streak-text ${showMilestone ? 'milestone' : 'active'}`}
      style={{
        color: showMilestone ? 'var(--signal)' : '#666',
        transition: 'color 0.5s',
        ...(showMilestone && {
          animation: 'streakPulse 3s ease-out'
        })
      }}
    >
      {streak > 0 ? (
        <>{' • '}{dayText} {streak} • {totalText} {totalDays}</>
      ) : (
        <>{' • '}{totalText} {totalDays}</>
      )}
    </span>
  );
}