import { useState, useEffect, useRef } from 'react';
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
import { getPersonalCoaching } from './PersonalAICoach';
import { checkPremiumStatus } from '../services/premiumService';
// hasPersonalAIAccess replaced with checkAndActivatePersonalAI
import { checkAndActivateBetaPremium, checkAndActivatePersonalAI } from '../utils/betaPremiumHack'; // TODO: Remove in production

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
  const [isPersonalMode, setIsPersonalMode] = useState(false);
  const [lastCoachingTimestamp, setLastCoachingTimestamp] = useState<number>(0);

  // Use ref to track previous personal mode state (for logging changes only)
  const previousPersonalModeRef = useRef<boolean>(false);

  // Check premium status and personal AI mode on mount and listen for changes
  useEffect(() => {
    const checkPremium = () => {
      // Check for beta premium hack (TODO: Remove in production)
      if (checkAndActivateBetaPremium()) {
        setIsPremium(true);
        setIsPersonalMode(true); // Beta users get Personal AI
        return;
      }

      const premiumStatus = checkPremiumStatus();

      setIsPremium(premiumStatus.isActive);

      // Personal AI is now DEFAULT for all premium users
      // Beta flag can still override if needed
      const hasBetaFlag = checkAndActivatePersonalAI();
      const personalAIActive = hasBetaFlag || premiumStatus.isActive;
      setIsPersonalMode(personalAIActive);

      // Only log when mode CHANGES (use ref for reliable prev value)
      if (personalAIActive && !previousPersonalModeRef.current) {
        console.log('✅ Personal AI mode activated', {
          reason: hasBetaFlag ? 'beta flag' : 'premium default',
          isPremium: premiumStatus.isActive,
          email: premiumStatus.email
        });
        previousPersonalModeRef.current = true;
      } else if (!personalAIActive && previousPersonalModeRef.current) {
        previousPersonalModeRef.current = false;
      }
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

  // Check if user has enough data for meaningful coaching
  const hasEnoughDataForCoaching = () => {
    // Premium users always see the coach button
    if (isPremium) {
      return true;
    }

    // Beta testing override
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('beta') === 'streak') {
      return true;
    }

    const currentStreak = calculateStreak(tasks);
    const totalTasks = tasks.length;
    const daysWithTasks = new Set(tasks.map(t => new Date(t.timestamp).toDateString())).size;

    // Require at least 3 days of streak OR 7+ days with tasks OR 20+ total tasks
    return currentStreak >= 3 || daysWithTasks >= 7 || totalTasks >= 20;
  };

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

  // Deep task pattern analysis for Personal AI
  const analyzeTaskPatterns = (tasks: Task[]) => {
    const signals = tasks.filter(t => t.type === 'signal');
    const completedSignals = signals.filter(t => t.completed);

    // Find abandoned signals (>3 days old, uncompleted)
    const abandonedSignals = signals.filter(t => {
      if (t.completed) return false;
      const age = (Date.now() - new Date(t.timestamp).getTime()) / (1000 * 60 * 60 * 24);
      return age > 3;
    }).map(t => ({
      text: t.text,
      ageInDays: Math.floor((Date.now() - new Date(t.timestamp).getTime()) / (1000 * 60 * 60 * 24))
    }));

    // Get oldest uncompleted signal
    const oldestSignal = signals
      .filter(t => !t.completed)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())[0];

    return {
      totalSignals: signals.length,
      completedSignals: completedSignals.length,
      completionRate: signals.length > 0 ? (completedSignals.length / signals.length * 100).toFixed(1) : '0',
      abandonedSignals,
      oldestUncompletedSignal: oldestSignal ? {
        text: oldestSignal.text,
        ageInDays: Math.floor((Date.now() - new Date(oldestSignal.timestamp).getTime()) / (1000 * 60 * 60 * 24))
      } : null
    };
  };

  const getCoachingAdvice = async () => {
    let userName = firstName || localStorage.getItem('userFirstName');

    if (!userName) {
      // Show name modal instead of prompt
      setShowNameModal(true);
      return;
    }

    // Detect rapid re-requests without task changes (same data = repetitive advice)
    const now = Date.now();
    const timeSinceLastCoaching = now - lastCoachingTimestamp;

    if (timeSinceLastCoaching < 60000) { // Less than 1 minute
      const uncompletedSignals = tasks.filter(t => t.type === 'signal' && !t.completed);
      if (uncompletedSignals.length > 0) {
        console.warn('⚠️ Rapid re-request detected. Task data unchanged. AI will give similar advice.');
      }
    }

    setLastCoachingTimestamp(now);
    setIsLoading(true);
    setShowCoach(true);

    try {
      // Smart AI Selection: Use Personal AI for premium users, Pattern AI for others
      if (isPersonalMode) {
        console.log('✨ Using Personal AI for enhanced insights');
        const personalResponse = await getPersonalCoaching(tasks, currentRatio, userName, data);
        if (personalResponse) {
          setCoachResponse(personalResponse);
          return;
        }
        console.log('📊 Personal AI failed, falling back to Pattern AI');
      } else {
        console.log('📊 Using Pattern AI (no Personal AI access)');
      }
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

      // Prepare Personal AI analysis if enabled
      let personalAIData = {};
      if (isPersonalMode) {
        const analysis = analyzeTaskPatterns(tasks);
        personalAIData = {
          deepTaskAnalysis: {
            allTasks: tasks.map(t => ({
              text: t.text,
              type: t.type,
              completed: t.completed,
              ageInDays: Math.floor((Date.now() - new Date(t.timestamp).getTime()) / (1000 * 60 * 60 * 24))
            })),
            completionReality: analysis
          }
        };
      }

      // Generate coaching payload with REAL data
      const payload: CoachPayload & any = {
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
          worstDay: worstDay?.day || (weeklyTrend?.direction === 'declining' ? 'Mo' : 'Fr'),
          hourlyDistribution,
          weeklyPattern,
          trendDirection: weeklyTrend?.direction || 'stable',
          consistencyScore
        },
        history: {
          recentTasks: tasks.slice(0, 10).map(t => ({
            text: t.text,
            type: t.type,
            timestamp: t.timestamp
          })),
          dailyRatios
        },
        ...personalAIData
      };

      // DEV: Log payload for debugging
      if (import.meta.env.DEV) {
        const payloadHash = JSON.stringify(payload).substring(0, 50);
        console.log('🎯 AI Coach Payload:', {
          mode: isPersonalMode ? 'Personal AI' : 'Pattern AI',
          firstName: userName,
          currentRatio,
          taskCount: tasks.length,
          payloadPreview: payloadHash + '...',
          timestamp: new Date().toISOString()
        });
      }

      const response = await getCoachAdvice(payload, { isPersonalMode });
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

      {/* PersonalAI Coach logic now integrated into main AI Coach button */}

      {!showCoach && hasEnoughDataForCoaching() && (
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
            // Non-premium: Show coach button that triggers foundation modal
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
              {t.premiumModalTitle}
            </button>
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