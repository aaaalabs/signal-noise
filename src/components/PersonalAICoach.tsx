import { useState, useEffect } from 'react';
import { getCoachAdvice } from '../services/groqService';
import type { CoachResponse } from '../services/groqService';
import type { Task, AppData } from '../types';
import { useTranslation } from '../contexts/LanguageContext';
import { calculateStreak, getAverageRatio } from '../utils/achievements';
import { checkAndActivatePersonalAI } from '../utils/betaPremiumHack';
import { checkPremiumStatus } from '../services/premiumService';

interface PersonalAICoachProps {
  tasks: Task[];
  currentRatio: number;
  firstName?: string;
  data: AppData;
}

interface TaskAnalysis {
  totalSignals: number;
  completedSignals: number;
  completionRate: string;
  abandonedSignals: Array<{
    text: string;
    ageInDays: number;
  }>;
  oldestUncompletedSignal: {
    text: string;
    ageInDays: number;
  } | null;
}

export default function PersonalAICoach({ tasks, currentRatio, firstName, data }: PersonalAICoachProps) {
  const t = useTranslation();
  const [isPersonalMode, setIsPersonalMode] = useState(false);
  const [coachResponse, setCoachResponse] = useState<CoachResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCoach, setShowCoach] = useState(false);

  // Check for personal AI mode
  useEffect(() => {
    const isActive = checkAndActivatePersonalAI();
    setIsPersonalMode(isActive);
  }, []);

  // Deep task pattern analysis
  const analyzeTaskPatterns = (tasks: Task[]): TaskAnalysis => {
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

  const getPersonalCoaching = async () => {
    if (!isPersonalMode) return;

    // Check premium status
    const premiumStatus = checkPremiumStatus();
    if (!premiumStatus.isActive) {
      console.log('Personal AI requires premium access');
      return;
    }

    let userName = firstName || localStorage.getItem('userFirstName');
    if (!userName) {
      console.log('Personal AI requires user name');
      return;
    }

    setIsLoading(true);
    setShowCoach(true);

    try {
      const analysis = analyzeTaskPatterns(tasks);

      // Build enhanced payload with full task visibility
      const currentStreak = calculateStreak(tasks);
      const averageRatio7Days = getAverageRatio(tasks, 7);

      const personalPayload = {
        firstName: userName,
        timestamp: new Date().toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        context: {
          triggerType: 'manual' as const,
          currentRatio,
          todayTasks: tasks.filter(t => {
            const today = new Date().toDateString();
            return new Date(t.timestamp).toDateString() === today;
          }).length,
          lastInteraction: new Date().toISOString(),
        },
        metrics: {
          currentStreak,
          longestStreak: currentStreak, // Simplified for now
          averageRatio7Days,
          averageRatio30Days: getAverageRatio(tasks, 30),
          totalDecisions: tasks.length,
          perfectDays: 0, // Simplified for now
          badges: data.badges,
        },
        patterns: {
          bestHour: 9, // Default values for now
          worstDay: 'Monday',
          hourlyDistribution: new Array(24).fill(0),
          weeklyPattern: new Array(7).fill({ signal: 0, noise: 0 }),
          trendDirection: 'stable' as const,
          consistencyScore: 0.8,
        },
        history: {
          recentTasks: tasks.slice(-10).map(t => ({
            text: t.text,
            type: t.type,
            timestamp: t.timestamp
          })),
          dailyRatios: []
        },
        // Personal AI specific data
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

      // Call groqService with personal AI flag
      const response = await getCoachAdvice(personalPayload, { isPersonalMode: true });
      setCoachResponse(response);
    } catch (error) {
      console.error('Personal AI coaching error:', error);
      setCoachResponse({
        message: `Sorry, ${userName}. Personal AI coaching is temporarily unavailable.`,
        type: 'insight',
        emotionalTone: 'supportive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setShowCoach(false);
    setCoachResponse(null);
  };

  // Don't render anything if not in personal mode
  if (!isPersonalMode) {
    return null;
  }

  return (
    <>
      {/* Personal AI Coach Button - only visible in personal mode */}
      <button
        onClick={getPersonalCoaching}
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          opacity: isLoading ? 0.7 : 1
        }}
        disabled={isLoading}
      >
        {isLoading ? 'Analyzing...' : 'Personal AI Coach'}
      </button>

      {/* Coach Response Modal */}
      {showCoach && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            backdropFilter: 'blur(8px)'
          }}
          onClick={handleClose}
        >
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid #333',
              borderRadius: '12px',
              padding: '32px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: 300,
                color: '#fff',
                margin: 0,
                marginBottom: '8px'
              }}>
                Personal AI Analysis
              </h3>
            </div>

            {/* Coach Response */}
            {coachResponse ? (
              <div>
                <div style={{
                  fontSize: '16px',
                  lineHeight: 1.6,
                  color: '#fff',
                  marginBottom: '24px',
                  fontWeight: 300
                }}>
                  {coachResponse.message}
                </div>

                {/* Suggestions */}
                {coachResponse.suggestions && coachResponse.suggestions.length > 0 && (
                  <div style={{ marginBottom: '24px' }}>
                    <h4 style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: 'var(--signal)',
                      margin: '0 0 12px 0'
                    }}>
                      Recommendations:
                    </h4>
                    {coachResponse.suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        style={{
                          background: '#111',
                          border: '1px solid #222',
                          borderRadius: '6px',
                          padding: '12px',
                          marginBottom: '8px'
                        }}
                      >
                        <div style={{
                          fontSize: '13px',
                          fontWeight: 400,
                          color: '#fff',
                          marginBottom: '4px'
                        }}>
                          {suggestion.action}
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: '#999',
                          fontWeight: 300
                        }}>
                          {suggestion.reasoning}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                color: '#999',
                fontSize: '14px',
                fontWeight: 300
              }}>
                Analyzing your task patterns...
              </div>
            )}

            {/* Close Button */}
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <button
                onClick={handleClose}
                style={{
                  background: 'transparent',
                  border: '1px solid #333',
                  borderRadius: '6px',
                  color: '#999',
                  padding: '10px 24px',
                  fontSize: '14px',
                  fontWeight: 300,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = '#666';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#333';
                  e.currentTarget.style.color = '#999';
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}