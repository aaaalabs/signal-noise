import { useEffect, useRef, useState } from 'react';
import type { AppData } from '../types';
import { calculateStreak, createBadgeDefinitions, getAverageRatio, getTodayRatio } from '../utils/achievements';
import { deactivatePremium } from '../services/premiumService';

interface PremiumMenuProps {
  show: boolean;
  onClose: () => void;
  email: string;
  tier: string;
  data?: AppData;
}

export default function PremiumMenu({
  show,
  onClose,
  email,
  tier,
  data
}: PremiumMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  if (!data) return null;

  const achievements = createBadgeDefinitions(data);
  const streak = calculateStreak(data.tasks);
  const todayRatio = getTodayRatio(data.tasks);
  const weekAvg = getAverageRatio(data.tasks, 7);

  // Calculate progress for each achievement (0-100)
  const getProgress = (achievement: any): number => {
    switch (achievement.id) {
      case 'first_day':
        return data.tasks.length >= 1 ? 100 : 0;
      case 'week_warrior':
        return Math.min((streak / 7) * 100, 100);
      case 'signal_master':
        return Math.min((weekAvg / 80) * 100, 100);
      case 'perfect_day':
        const todayTasks = data.tasks.filter(t =>
          new Date(t.timestamp).toDateString() === new Date().toDateString()
        );
        return todayTasks.length >= 3 && todayRatio === 100 ? 100 : (todayRatio / 100) * 100;
      case 'month_hero':
        return Math.min((streak / 30) * 100, 100);
      case 'early_bird':
        const earlyTasks = data.tasks.filter(t => new Date(t.timestamp).getHours() < 9);
        return earlyTasks.length > 0 ? 100 : 0;
      case 'decision_maker':
        return Math.min((data.tasks.length / 100) * 100, 100);
      case 'comeback':
        return achievement.condition() ? 100 : 0;
      default:
        return 0;
    }
  };

  // Get success criteria text
  const getSuccessCriteria = (achievementId: string): string => {
    switch (achievementId) {
      case 'first_day': return 'Add one task';
      case 'week_warrior': return 'Daily 80%+ ratio';
      case 'signal_master': return 'Week average 80%';
      case 'perfect_day': return '100% ratio today';
      case 'month_hero': return 'Month-long streak';
      case 'early_bird': return 'Task before 9am';
      case 'decision_maker': return 'Reach 100 tasks';
      case 'comeback': return 'Return after break';
      default: return '';
    }
  };

  // Handle tooltip display with auto-hide
  const handleTooltipToggle = (achievementId: string) => {
    if (showTooltip === achievementId) {
      setShowTooltip(null);
    } else {
      setShowTooltip(achievementId);
      // Auto-hide after 2.5 seconds
      setTimeout(() => {
        setShowTooltip(null);
      }, 2500);
    }
  };

  // Filter and sort achievements with progress
  const achievementsWithProgress = achievements
    .map(achievement => ({
      ...achievement,
      progress: getProgress(achievement)
    }))
    .filter(achievement => achievement.progress > 0)
    .sort((a, b) => b.progress - a.progress);

  const ProgressBar = ({ progress }: { progress: number }) => {
    const filledBars = Math.floor((progress / 100) * 5);
    return (
      <div style={{ display: 'flex', gap: '1px', alignItems: 'center' }}>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            style={{
              width: '4px',
              height: '4px',
              backgroundColor: i < filledBars ? 'rgba(0, 255, 136, 0.8)' : 'rgba(255, 255, 255, 0.1)',
              borderRadius: '1px'
            }}
          />
        ))}
      </div>
    );
  };

  useEffect(() => {
    if (!show) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [show, onClose]);

  const handleSignOut = () => {
    deactivatePremium();
    onClose();
    // Refresh to update the UI
    window.location.reload();
  };

  const handleExportData = () => {
    onClose();
    // Trigger the same export function used by Cmd+E
    import('../services/syncService').then(({ exportData }) => {
      exportData();
    });
  };

  if (!show) return null;

  return (
    <div
      ref={menuRef}
      style={{
        position: 'absolute',
        top: '100%',
        right: '0',
        marginTop: '8px',
        minWidth: '220px',
        backgroundColor: 'rgba(17, 17, 17, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        zIndex: 99999,
        padding: '16px',
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        fontSize: '13px',
        animation: 'fadeIn 0.2s ease-out',
        backdropFilter: 'blur(16px) saturate(1.2)',
        WebkitBackdropFilter: 'blur(16px) saturate(1.2)'
      }}
    >
      {/* Identity Section */}
      <div style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <div style={{ color: '#999', fontSize: '11px', marginBottom: '2px', fontWeight: 300 }}>
          {email}
        </div>
        <div style={{ color: '#fff', fontSize: '12px', fontWeight: 400 }}>
          {tier === 'foundation' ? 'Foundation Member' : 'Early Adopter'}
        </div>
      </div>

      {/* Achievement Progress */}
      <div style={{ marginBottom: '16px' }}>
        {achievementsWithProgress.length > 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            fontSize: '10px'
          }}>
            {achievementsWithProgress.map(achievement => (
              <div key={achievement.id}>
                <div
                  onClick={() => handleTooltipToggle(achievement.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '1px 0',
                    cursor: 'pointer',
                    transition: 'opacity 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.opacity = '0.7';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.opacity = '1';
                  }}
                >
                  <ProgressBar progress={achievement.progress} />
                  <span style={{
                    color: '#ccc',
                    fontWeight: 300,
                    fontSize: '10px',
                    flex: 1
                  }}>
                    {achievement.name}
                  </span>
                  <span style={{
                    color: '#666',
                    fontWeight: 300,
                    fontSize: '9px'
                  }}>
                    {Math.round(achievement.progress)}%
                  </span>
                </div>
                {showTooltip === achievement.id && (
                  <div style={{
                    color: '#999',
                    fontSize: '9px',
                    fontWeight: 300,
                    paddingLeft: '20px',
                    paddingTop: '2px',
                    paddingBottom: '2px',
                    animation: 'tooltipFadeIn 0.2s ease-out',
                    fontStyle: 'italic'
                  }}>
                    {getSuccessCriteria(achievement.id)}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            color: '#666',
            fontSize: '10px',
            fontWeight: 300,
            textAlign: 'center',
            padding: '12px 0',
            fontStyle: 'italic'
          }}>
            Start your first task to begin
          </div>
        )}
      </div>

      {/* Actions Section */}
      <div>
        <button
          onClick={handleExportData}
          style={{
            width: '100%',
            padding: '8px 12px',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#ccc',
            fontSize: '12px',
            fontWeight: 300,
            textAlign: 'left',
            cursor: 'pointer',
            borderRadius: '4px',
            marginBottom: '4px',
            transition: 'all 0.15s ease',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#1a1a1a';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#ccc';
          }}
        >
          <span>Export Data</span>
          <span style={{ fontSize: '10px', color: '#666' }}>⌘E</span>
        </button>

        <button
          onClick={handleSignOut}
          style={{
            width: '100%',
            padding: '8px 12px',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#ccc',
            fontSize: '12px',
            fontWeight: 300,
            textAlign: 'left',
            cursor: 'pointer',
            borderRadius: '4px',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#1a1a1a';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#ccc';
          }}
        >
          Sign Out
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes tooltipFadeIn {
          from {
            opacity: 0;
            transform: translateY(-2px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}