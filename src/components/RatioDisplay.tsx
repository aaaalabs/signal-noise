import type { AppData } from '../types';
import AchievementDots from './AchievementDots';

interface RatioDisplayProps {
  ratio: number;
  totalTasks: number;
  data: AppData;
  earnedCount: number;
  hasAchievement?: boolean;
}

export default function RatioDisplay({ ratio, totalTasks, data, earnedCount, hasAchievement }: RatioDisplayProps) {
  const getRatioClass = () => {
    if (totalTasks === 0) return '';
    if (ratio >= 80) return 'optimal';
    if (ratio >= 60) return 'warning';
    return 'critical';
  };

  const displayText = totalTasks > 0 ? `${ratio}%` : '—';

  // Calculate progress ring
  const circumference = 879; // 2 * PI * 140
  const progress = totalTasks > 0 ? ratio : 0;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="ratio-container" style={{ position: 'relative' }}>
      {/* Progress Ring Background */}
      <svg
        className="progress-ring"
        width="280"
        height="280"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      >
        <circle
          className="progress-ring-circle"
          cx="140"
          cy="140"
          r="140"
          fill="none"
          stroke="rgba(0, 255, 136, 0.05)"
          strokeWidth="1"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: 'stroke-dashoffset 1s ease-out',
            transform: 'rotate(-90deg)',
            transformOrigin: 'center'
          }}
        />
      </svg>

      {/* Ratio Display */}
      <div
        className={`ratio-display ${getRatioClass()} ${hasAchievement ? 'has-achievement' : ''}`}
        style={{
          position: 'relative',
          zIndex: 1
        }}
      >
        {displayText}
      </div>

      {/* Achievement Dots */}
      <div
        style={{
          position: 'absolute',
          bottom: '-40px',
          left: '50%',
          transform: 'translateX(-50%)'
        }}
      >
        <AchievementDots data={data} earnedCount={earnedCount} />
      </div>
    </div>
  );
}