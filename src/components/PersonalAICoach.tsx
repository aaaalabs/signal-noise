import { useState, useEffect } from 'react';
import { getPersonalAIAdvice, hasPersonalAIAccess } from '../services/personalAIService';
import type { PersonalAIResponse } from '../types';
import type { Task, CoachPayload, AppData } from '../types';
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
import { checkPremiumStatus } from '../services/premiumService';

interface PersonalAICoachProps {
  tasks: Task[];
  currentRatio: number;
  firstName?: string;
  onNameUpdate: (name: string) => void;
  data: AppData;
}

export default function PersonalAICoach({ tasks, currentRatio, firstName, onNameUpdate, data }: PersonalAICoachProps) {
  const t = useTranslation();
  const [personalAIResponse, setPersonalAIResponse] = useState<PersonalAIResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPersonalAI, setShowPersonalAI] = useState(false);
  const [isPersonalAIAvailable, setIsPersonalAIAvailable] = useState(false);

  // Check PersonalAI availability on mount
  useEffect(() => {
    setIsPersonalAIAvailable(hasPersonalAIAccess());
  }, []);

  // Deep task pattern analysis for PersonalAI
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

  const handlePersonalAIClick = async () => {
    let userName = firstName || localStorage.getItem('userFirstName');

    if (!userName) {
      // For now, use a default name. In future, could show name modal
      userName = 'there';
    }

    setIsLoading(true);
    setShowPersonalAI(true);

    try {
      // Calculate comprehensive metrics and patterns
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

      // Prepare deep task analysis for PersonalAI
      const deepTaskAnalysis = {
        allTasks: tasks.map(t => ({
          text: t.text,
          type: t.type,
          completed: t.completed,
          ageInDays: Math.floor((Date.now() - new Date(t.timestamp).getTime()) / (1000 * 60 * 60 * 24))
        })),
        completionReality: analyzeTaskPatterns(tasks)
      };

      // Generate PersonalAI payload with REAL data
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
        }
      };

      const response = await getPersonalAIAdvice(payload, { deepTaskAnalysis });
      setPersonalAIResponse(response);
    } catch (error) {
      console.error('PersonalAI error:', error);
      setPersonalAIResponse({
        action: 'analyze',
        priority: 'normal',
        message: 'PersonalAI is temporarily unavailable. Try again in a moment.',
        analysis: {
          patternDetected: 'service_unavailable',
          completionReality: currentRatio,
          focusLevel: 'moderate',
          timeContext: 'productive'
        },
        interventions: [],
        metrics: {
          momentumScore: Math.min(currentRatio, 100),
          decisionQuality: 70,
          predictedSuccess: 75
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getActionColor = (action: PersonalAIResponse['action']) => {
    switch (action) {
      case 'celebrate': return 'var(--signal)';
      case 'warn': return '#ff6b6b';
      case 'reset': return '#ff4757';
      case 'focus': return '#3742fa';
      case 'nudge': return '#ffa502';
      default: return '#999';
    }
  };

  const getPriorityBadge = (priority: PersonalAIResponse['priority']) => {
    const colors = {
      urgent: '#ff4757',
      high: '#ff6b6b',
      normal: '#ffa502',
      low: '#999'
    };

    return (
      <span
        style={{
          fontSize: '10px',
          color: colors[priority],
          textTransform: 'uppercase',
          letterSpacing: '1px',
          fontWeight: '500'
        }}
      >
        {priority}
      </span>
    );
  };

  const getActionIcon = (action: PersonalAIResponse['action']) => {
    switch (action) {
      case 'celebrate': return '🎉';
      case 'warn': return '⚠️';
      case 'reset': return '🔄';
      case 'focus': return '🎯';
      case 'nudge': return '👆';
      default: return '🤖';
    }
  };

  if (!isPersonalAIAvailable) {
    return null; // Don't show if PersonalAI not available
  }

  return (
    <div className="personal-ai-coach">
      {!showPersonalAI && (
        <button
          onClick={handlePersonalAIClick}
          className="personal-ai-button"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            padding: '10px 16px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(102, 126, 234, 0.2)'
          }}
        >
          <span style={{ fontSize: '16px' }}>🤖</span>
          PersonalAI
        </button>
      )}

      {showPersonalAI && (
        <div
          className="personal-ai-response"
          style={{
            border: personalAIResponse ? `1px solid ${getActionColor(personalAIResponse.action)}` : '1px solid #333',
            borderRadius: '12px',
            padding: '16px',
            backgroundColor: 'rgba(0,0,0,0.3)',
            backdropFilter: 'blur(10px)'
          }}
        >
          {isLoading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '20px',
                height: '20px',
                border: '2px solid #667eea',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              <span style={{ color: '#999' }}>PersonalAI analyzing patterns...</span>
            </div>
          ) : personalAIResponse ? (
            <div>
              {/* Action Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px' }}>{getActionIcon(personalAIResponse.action)}</span>
                  <span style={{
                    color: getActionColor(personalAIResponse.action),
                    fontWeight: '500',
                    textTransform: 'capitalize'
                  }}>
                    {personalAIResponse.action}
                  </span>
                </div>
                {getPriorityBadge(personalAIResponse.priority)}
              </div>

              {/* Main Message */}
              <div style={{
                fontSize: '14px',
                lineHeight: '1.5',
                marginBottom: '16px',
                color: '#fff'
              }}>
                {personalAIResponse.message}
              </div>

              {/* Analysis Section */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{
                  fontSize: '11px',
                  color: '#666',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '8px'
                }}>
                  Analysis
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div style={{ fontSize: '12px' }}>
                    <div style={{ color: '#999' }}>Focus Level</div>
                    <div style={{ color: '#fff', textTransform: 'capitalize' }}>
                      {personalAIResponse.analysis.focusLevel}
                    </div>
                  </div>
                  <div style={{ fontSize: '12px' }}>
                    <div style={{ color: '#999' }}>Pattern</div>
                    <div style={{ color: '#fff' }}>
                      {personalAIResponse.analysis.patternDetected.replace(/_/g, ' ')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{
                  fontSize: '11px',
                  color: '#666',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '8px'
                }}>
                  Metrics
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  <div style={{ fontSize: '12px', textAlign: 'center' }}>
                    <div style={{ color: '#999' }}>Momentum</div>
                    <div style={{ color: '#fff', fontWeight: '500' }}>
                      {personalAIResponse.metrics.momentumScore}%
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', textAlign: 'center' }}>
                    <div style={{ color: '#999' }}>Quality</div>
                    <div style={{ color: '#fff', fontWeight: '500' }}>
                      {personalAIResponse.metrics.decisionQuality}%
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', textAlign: 'center' }}>
                    <div style={{ color: '#999' }}>Success</div>
                    <div style={{ color: '#fff', fontWeight: '500' }}>
                      {personalAIResponse.metrics.predictedSuccess}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Interventions */}
              {personalAIResponse.interventions && personalAIResponse.interventions.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{
                    fontSize: '11px',
                    color: '#666',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '8px'
                  }}>
                    Interventions
                  </div>
                  {personalAIResponse.interventions.map((intervention, index) => (
                    <div key={index} style={{
                      fontSize: '12px',
                      padding: '8px',
                      backgroundColor: 'rgba(0,0,0,0.2)',
                      borderRadius: '6px',
                      marginBottom: '4px',
                      borderLeft: `3px solid ${getActionColor(personalAIResponse.action)}`
                    }}>
                      <div style={{
                        fontWeight: '500',
                        color: '#fff',
                        textTransform: 'capitalize',
                        marginBottom: '2px'
                      }}>
                        {intervention.action.replace(/_/g, ' ')}: {intervention.taskRef}
                      </div>
                      <div style={{ color: '#999' }}>{intervention.reasoning}</div>
                      <div style={{
                        color: getActionColor(personalAIResponse.action),
                        fontSize: '11px',
                        marginTop: '4px'
                      }}>
                        Impact: {intervention.estimatedImpact}%
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => setShowPersonalAI(false)}
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
                Close PersonalAI
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

        .personal-ai-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
      `}</style>
    </div>
  );
}