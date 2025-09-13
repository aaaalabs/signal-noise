import { useState, useEffect } from 'react';
import { getCoachAdvice } from '../services/groqService';
import type { CoachResponse } from '../services/groqService';
import type { Task, CoachPayload } from '../types';
import { useTranslation } from '../contexts/LanguageContext';
import { calculateStreak, getAverageRatio } from '../utils/achievements';
import {
  getBestProductiveHour,
  getWeeklyTrend,
  getWorstDayOfWeek,
  getHourlyDistribution,
  getWeeklyPattern,
  getConsistencyScore,
  calculateDailyRatios
} from '../utils/patternAnalysis';
import PremiumModal from './PremiumModal';
import FoundationModal from './FoundationModal';
import FirstNameModal from './FirstNameModal';
import { checkPremiumStatus } from '../services/premiumService';

import type { AppData } from '../types';

interface AICoachProps {
  tasks: Task[];
  currentRatio: number;
  firstName?: string;
  onNameUpdate: (name: string) => void;
  data: AppData;
}

export default function AICoach({ tasks, currentRatio, firstName, onNameUpdate, data }: AICoachProps) {
  const t = useTranslation();
  const [coachResponse, setCoachResponse] = useState<CoachResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCoach, setShowCoach] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showFoundationModal, setShowFoundationModal] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [activationEmail, setActivationEmail] = useState('');
  const [activationLoading, setActivationLoading] = useState(false);

  // Check premium status on mount and listen for changes
  useEffect(() => {
    const checkPremium = () => {
      const premiumStatus = checkPremiumStatus();
      setIsPremium(premiumStatus.isActive);
    };

    // Initial check
    checkPremium();

    // Listen for storage changes (when SuccessModal activates premium)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'premiumStatus' || e.key === 'premiumActive') {
        checkPremium();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also check periodically in case storage event doesn't fire
    const interval = setInterval(checkPremium, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleCoachClick = () => {
    // If not premium, show Foundation modal
    if (!isPremium) {
      setShowFoundationModal(true);
      return;
    }

    // If premium, proceed with coaching
    getCoachingAdvice();
  };

  const handleNameSave = (name: string) => {
    // Save to localStorage AND update app state
    localStorage.setItem('userFirstName', name);
    onNameUpdate(name);

    // Now proceed with coaching advice
    getCoachingAdvice();
  };

  const getCoachingAdvice = async () => {
    let userName = firstName || localStorage.getItem('userFirstName');

    if (!userName) {
      // Show name modal instead of prompt
      setShowNameModal(true);
      return;
    }

    setIsLoading(true);
    setShowCoach(true);

    try {
      // Calculate real metrics and patterns
      const currentStreak = calculateStreak(tasks);
      const averageRatio7Days = getAverageRatio(tasks, 7);
      const averageRatio30Days = getAverageRatio(tasks, 30);
      const bestHour = getBestProductiveHour(tasks);
      const weeklyTrend = getWeeklyTrend(tasks);
      const worstDay = getWorstDayOfWeek(tasks);
      const hourlyDistribution = getHourlyDistribution(tasks);
      const weeklyPattern = getWeeklyPattern(tasks);
      const consistencyScore = getConsistencyScore(tasks);
      const dailyRatios = calculateDailyRatios(tasks, 30).map((ratio, index) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - index));
        return {
          date: date.toISOString(),
          ratio,
          taskCount: tasks.filter(t =>
            new Date(t.timestamp).toDateString() === date.toDateString()
          ).length
        };
      });

      // Count perfect days (100% signal ratio)
      const perfectDays = dailyRatios.filter(d => d.ratio === 100 && d.taskCount > 0).length;

      // Calculate longest streak
      const longestStreak = Math.max(currentStreak,
        dailyRatios.reduce((maxStreak, _, index) => {
          let streak = 0;
          for (let i = index; i < dailyRatios.length; i++) {
            if (dailyRatios[i].ratio >= 80 && dailyRatios[i].taskCount > 0) {
              streak++;
            } else {
              break;
            }
          }
          return Math.max(maxStreak, streak);
        }, 0)
      );

      // Generate coaching payload with REAL data
      const payload: CoachPayload = {
        firstName: userName,
        timestamp: new Date().toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        context: {
          triggerType: 'manual',
          currentRatio,
          todayTasks: tasks.filter(t =>
            new Date(t.timestamp).toDateString() === new Date().toDateString()
          ).length,
          lastInteraction: new Date().toISOString()
        },
        metrics: {
          currentStreak,
          longestStreak,
          averageRatio7Days,
          averageRatio30Days,
          totalDecisions: tasks.length,
          perfectDays,
          badges: data.badges
        },
        patterns: {
          bestHour: bestHour || 9,
          worstDay: worstDay?.day || (weeklyTrend.direction === 'declining' ? 'Mo' : 'Fr'),
          hourlyDistribution,
          weeklyPattern,
          trendDirection: weeklyTrend.direction,
          consistencyScore
        },
        history: {
          recentTasks: tasks.slice(0, 10).map(t => ({
            text: t.text,
            type: t.type,
            timestamp: t.timestamp
          })),
          dailyRatios
        }
      };

      const response = await getCoachAdvice(payload);
      setCoachResponse(response);
    } catch (error) {
      console.error('Coaching error:', error);
      setCoachResponse({
        message: t.coachUnavailable,
        type: 'insight',
        emotionalTone: 'supportive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getResponseClass = (type: string) => {
    switch (type) {
      case 'celebration': return 'celebration';
      case 'warning': return 'warning';
      default: return '';
    }
  };

  const handleActivatePremium = async () => {
    if (!activationEmail) return;

    setActivationLoading(true);
    try {
      const response = await fetch('/api/activate-premium', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: activationEmail }),
      });

      const result = await response.json();

      if (result.isPremium) {
        // Store premium status locally
        localStorage.setItem('premiumStatus', JSON.stringify({
          isActive: true,
          email: result.email,
          activatedAt: result.activatedAt,
          subscriptionId: result.subscriptionId || '',
        }));
        localStorage.setItem('premiumActive', 'true');

        // Update first name if available
        if (result.firstName && result.firstName !== firstName) {
          onNameUpdate(result.firstName);
        }

        // Update UI
        setIsPremium(true);
        setActivationEmail('');

        // Show success message (could add a toast here)
        console.log('✅ Premium activated successfully');
      } else {
        // Show error message (could add a toast here)
        console.log('❌ Email not found or not premium');
      }
    } catch (error) {
      console.error('Activation error:', error);
    } finally {
      setActivationLoading(false);
    }
  };

  return (
    <div className="ai-coach">
      {/* Premium Modal */}
      <PremiumModal
        show={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
      />

      {/* Foundation Modal */}
      <FoundationModal
        show={showFoundationModal}
        onClose={() => setShowFoundationModal(false)}
      />

      {/* First Name Modal */}
      <FirstNameModal
        show={showNameModal}
        onClose={() => setShowNameModal(false)}
        onSave={handleNameSave}
      />

      {!showCoach && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {isPremium ? (
            // Premium user: Show AI Coach button
            <button
              onClick={handleCoachClick}
              className="ai-coach-button"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                justifyContent: 'center'
              }}
            >
              <img
                src="/sn-icon_grey.svg"
                alt="AI Coach"
                style={{ width: '16px', height: '16px' }}
              />
              {t.aiCoachBtn}
            </button>
          ) : (
            // Non-premium: Show email activation OR foundation access
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{
                display: 'flex',
                gap: '6px',
                alignItems: 'center',
                fontSize: '12px'
              }}>
                <input
                  type="email"
                  value={activationEmail}
                  onChange={(e) => setActivationEmail(e.target.value)}
                  placeholder="Already premium? Enter email"
                  style={{
                    flex: 1,
                    padding: '6px 8px',
                    fontSize: '12px',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '4px',
                    color: '#fff',
                    outline: 'none'
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleActivatePremium()}
                />
                <button
                  onClick={handleActivatePremium}
                  disabled={!activationEmail || activationLoading}
                  style={{
                    padding: '6px 10px',
                    fontSize: '12px',
                    backgroundColor: activationLoading ? '#444' : 'var(--signal)',
                    color: '#000',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: activationLoading ? 'wait' : 'pointer',
                    fontWeight: '500'
                  }}
                >
                  {activationLoading ? '...' : 'Activate'}
                </button>
              </div>

              <button
                onClick={() => setShowFoundationModal(true)}
                className="ai-coach-button"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  justifyContent: 'center',
                  opacity: 0.7
                }}
              >
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#666"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <circle cx="12" cy="7" r="4"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                €29 FOUNDATION ACCESS
              </button>
            </div>
          )}
        </div>
      )}

      {showCoach && (
        <div className={`coach-response ${coachResponse ? getResponseClass(coachResponse.type) : ''}`}>
          {isLoading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '20px',
                height: '20px',
                border: '2px solid var(--signal)',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              <span style={{ color: '#999' }}>{t.coachLoading}</span>
            </div>
          ) : coachResponse ? (
            <div>
              <div style={{ fontSize: '14px', lineHeight: '1.5', marginBottom: '12px' }}>
                {coachResponse.message}
              </div>

              {coachResponse.suggestions && coachResponse.suggestions.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{
                    fontSize: '12px',
                    color: '#666',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '8px'
                  }}>
                    {t.coachRecommendations}
                  </div>
                  {coachResponse.suggestions.map((suggestion, index) => (
                    <div key={index} style={{
                      fontSize: '12px',
                      padding: '8px',
                      backgroundColor: 'rgba(0,0,0,0.2)',
                      borderRadius: '6px',
                      marginBottom: '4px'
                    }}>
                      <div style={{ fontWeight: '500' }}>{suggestion.action}</div>
                      <div style={{ color: '#999', marginTop: '4px' }}>{suggestion.reasoning}</div>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => setShowCoach(false)}
                style={{
                  fontSize: '12px',
                  color: '#666',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => (e.target as HTMLButtonElement).style.color = '#999'}
                onMouseLeave={(e) => (e.target as HTMLButtonElement).style.color = '#666'}
              >
                {t.coachClose}
              </button>
            </div>
          ) : null}
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}