import { useEffect, useRef, useState } from 'react';
import type { AppData } from '../types';
import { calculateStreak, createBadgeDefinitions, getAverageRatio, getTodayRatio } from '../utils/achievements';
import { useTranslation } from '../contexts/LanguageContext';

// Extended achievement type that includes both regular achievements and commitment mode
type ExtendedAchievement = {
  id: string;
  name: string;
  progress: number;
  // Regular achievement properties
  icon?: string;
  condition?: () => boolean;
  // Commitment mode specific properties
  isCommitmentMode?: boolean;
  canActivate?: boolean;
  isActivated?: boolean;
};

interface PremiumMenuProps {
  show: boolean;
  onClose: () => void;
  email: string;
  tier: string;
  data?: AppData;
  earnedCount?: number;
  onCommitmentModeClick?: () => void;
}

export default function PremiumMenu({
  show,
  onClose,
  email,
  tier,
  data,
  earnedCount = 0,
  onCommitmentModeClick
}: PremiumMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const t = useTranslation();

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
    return (t as any).successCriteria?.[achievementId] || '';
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

  // Create Commitment Mode achievement item
  const isCommitmentMode = !!data?.settings?.commitModeActivatedAt;
  const canActivateCommitment = earnedCount >= 6;

  const commitmentAchievement: ExtendedAchievement = {
    id: 'commitment_mode',
    name: 'Commitment Mode',
    progress: isCommitmentMode ? 100 : (canActivateCommitment ? 90 : Math.min((earnedCount / 6) * 80, 80)),
    isCommitmentMode: true,
    canActivate: canActivateCommitment,
    isActivated: isCommitmentMode
  };

  // Filter and sort achievements with progress, then add commitment mode
  const achievementsWithProgress: ExtendedAchievement[] = achievements
    .map(achievement => ({
      ...achievement,
      progress: getProgress(achievement)
    }))
    .filter(achievement => achievement.progress > 0)
    .sort((a, b) => b.progress - a.progress);

  // Add commitment mode as the last item (9th achievement)
  const allAchievements: ExtendedAchievement[] = [...achievementsWithProgress, commitmentAchievement];

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

  const handleSignOut = async () => {
    try {
      console.log('🚪 Global sign out initiated...');

      // Get current session token
      const sessionData = JSON.parse(localStorage.getItem('sessionData') || '{}');

      if (sessionData.sessionToken && !sessionData.sessionToken.startsWith('dev-session-token-')) {
        // Call global revoke endpoint
        const response = await fetch('/api/auth/revoke-access', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${sessionData.sessionToken}`
          }
        });

        if (response.ok) {
          const result = await response.json();
          console.log('✅ Global access revoked:', result.message);
        } else {
          console.log('⚠️ Revoke API failed, proceeding with local cleanup');
        }
      }
    } catch (error) {
      console.log('⚠️ Revoke request failed, proceeding with local cleanup:', error);
    }

    // Clear ALL localStorage (not just session-specific items)
    localStorage.clear();

    // Also clear sessionStorage if any data exists there
    sessionStorage.clear();

    // Clear any cookies (if any exist for this domain)
    document.cookie.split(";").forEach((c) => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

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
        {allAchievements.length > 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            fontSize: '10px'
          }}>
            {allAchievements.map(achievement => (
              <div key={achievement.id}>
                <div
                  onClick={() => {
                    if (achievement.isCommitmentMode && achievement.canActivate && !achievement.isActivated && onCommitmentModeClick) {
                      onCommitmentModeClick();
                      onClose(); // Close the menu after clicking
                    } else {
                      handleTooltipToggle(achievement.id);
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '1px 0',
                    cursor: achievement.isCommitmentMode && achievement.canActivate && !achievement.isActivated ? 'pointer' : 'default',
                    transition: 'opacity 0.2s ease',
                    opacity: achievement.isCommitmentMode && !achievement.canActivate && !achievement.isActivated ? 0.5 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!achievement.isCommitmentMode || achievement.canActivate || achievement.isActivated) {
                      (e.currentTarget as HTMLElement).style.opacity = '0.7';
                    }
                  }}
                  onMouseLeave={(e) => {
                    const opacity = achievement.isCommitmentMode && !achievement.canActivate && !achievement.isActivated ? 0.5 : 1;
                    (e.currentTarget as HTMLElement).style.opacity = opacity.toString();
                  }}
                >
                  {achievement.isCommitmentMode ? (
                    // Special lock icon for Commitment Mode
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px' }}>
{achievement.isActivated ? (
                        // Locked padlock (green) - commitment is active/locked in
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#00ff88"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                          <path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6z" />
                          <path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
                          <path d="M8 11v-4a4 4 0 1 1 8 0v4" />
                        </svg>
                      ) : achievement.canActivate ? (
                        // Unlocked padlock (green, pulsing) - ready to activate
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#00ff88"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{
                            animation: 'lockPulse 2s infinite'
                          }}
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                          <path d="M3 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
                          <path d="M9 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
                          <path d="M13 11v-4a4 4 0 1 1 8 0v4" />
                        </svg>
                      ) : (
                        // Locked padlock (grey) - not yet eligible
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#666"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ opacity: 0.6 }}
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                          <path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6z" />
                          <path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
                          <path d="M8 11v-4a4 4 0 1 1 8 0v4" />
                        </svg>
                      )}
                    </div>
                  ) : (
                    <ProgressBar progress={achievement.progress} />
                  )}
                  <span style={{
                    color: achievement.isCommitmentMode && achievement.isActivated ? '#00ff88' : '#ccc',
                    fontWeight: achievement.isCommitmentMode && achievement.isActivated ? 400 : 300,
                    fontSize: '10px',
                    flex: 1
                  }}>
                    {achievement.name}
                    {achievement.isCommitmentMode && achievement.isActivated && ' ✓'}
                  </span>
                  <span style={{
                    color: '#666',
                    fontWeight: 300,
                    fontSize: '9px'
                  }}>
                    {achievement.isCommitmentMode ?
                      (achievement.isActivated ? 'Active' : achievement.canActivate ? 'Ready' : `${earnedCount}/6`) :
                      `${Math.round(achievement.progress)}%`
                    }
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
                    {achievement.isCommitmentMode ?
                      (achievement.isActivated ? 'Only completed signals count from activation date' :
                       achievement.canActivate ? 'Click to activate irreversible productivity mode' :
                       'Earn 6 achievements to unlock Commitment Mode') :
                      getSuccessCriteria(achievement.id)
                    }
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
          title="Revokes access on all devices - use magic link to restore"
        >
          Global Logout
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