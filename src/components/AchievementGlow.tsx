import { useEffect, useState } from 'react';

interface AchievementGlowProps {
  trigger: boolean;
}

export default function AchievementGlow({ trigger }: AchievementGlowProps) {
  const [showGlow, setShowGlow] = useState(false);

  useEffect(() => {
    if (trigger) {
      setShowGlow(true);
      const timer = setTimeout(() => {
        setShowGlow(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <div
      className={`achievement-glow ${showGlow ? 'animate' : ''}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: 'linear-gradient(90deg, transparent, var(--signal), transparent)',
        opacity: 0,
        pointerEvents: 'none',
        zIndex: 1000,
        transformOrigin: 'center',
        ...(showGlow && {
          animation: 'achievementPulse 2s ease-out'
        })
      }}
    />
  );
}