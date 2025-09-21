import { useState, useEffect } from 'react';
import { getPersonalAIAdvice, hasPersonalAIAccess } from '../services/personalAIService';
import type { PersonalAIResponse } from '../types';
import type { Task, CoachPayload, AppData } from '../types';
// Removed useTranslation import - not needed in minimal design
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
// Removed checkPremiumStatus import - not used in simplified design

interface PersonalAICoachProps {
  tasks: Task[];
  currentRatio: number;
  firstName?: string;
  onNameUpdate?: (name: string) => void; // Optional since not used in minimal design
  data: AppData;
}

export default function PersonalAICoach({ tasks, currentRatio, firstName, data }: PersonalAICoachProps) {
  // Removed useTranslation since no translated text in minimal design
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
        action: 'focus',
        priority: 'normal',
        message: 'Analysis temporarily unavailable. Try again in a moment.',
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

  // Removed getActionColor, getPriorityBadge, getActionIcon - Jony Ive approved design uses minimal typography only

  if (!isPersonalAIAvailable) {
    return null; // Don't show if PersonalAI not available
  }

  return (
    <div className="personal-ai-coach">
      {!showPersonalAI && (
        <button
          onClick={handlePersonalAIClick}
          className="advanced-analysis-button"
          style={{
            background: 'none',
            border: 'none',
            color: '#666',
            fontSize: '14px',
            fontWeight: '300',
            cursor: 'pointer',
            padding: '4px 0',
            borderBottom: '1px solid transparent',
            transition: 'opacity 0.2s ease',
            textAlign: 'left'
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.opacity = '0.8';
            (e.target as HTMLButtonElement).style.borderBottomColor = '#333';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.opacity = '1';
            (e.target as HTMLButtonElement).style.borderBottomColor = 'transparent';
          }}
        >
          Advanced Analysis
        </button>
      )}

      {showPersonalAI && (
        <div
          className="advanced-analysis-response"
          style={{
            border: '1px solid #333',
            borderRadius: '8px',
            padding: '16px',
            backgroundColor: 'rgba(0,0,0,0.2)',
            marginTop: '8px'
          }}
        >
          {isLoading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '16px',
                height: '16px',
                border: '1px solid #666',
                borderTop: '1px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              <span style={{ color: '#999', fontSize: '13px', fontWeight: '300' }}>Analyzing patterns</span>
            </div>
          ) : personalAIResponse ? (
            <div>
              {/* Main Message - Primary Focus */}
              <div style={{
                fontSize: '14px',
                fontWeight: '300',
                lineHeight: '1.4',
                color: '#fff',
                marginBottom: '12px'
              }}>
                {personalAIResponse.message}
              </div>

              {/* Key Insight - Single Line */}
              {personalAIResponse.analysis.patternDetected !== 'baseline_analysis' && (
                <div style={{
                  fontSize: '12px',
                  color: '#999',
                  fontStyle: 'italic',
                  marginBottom: '12px'
                }}>
                  {personalAIResponse.analysis.patternDetected.replace(/_/g, ' ')}
                </div>
              )}

              {/* Single Critical Metric */}
              <div style={{
                fontSize: '12px',
                color: '#999',
                marginBottom: '16px'
              }}>
                Momentum <span style={{
                  color: '#fff',
                  fontWeight: '100',
                  fontSize: '13px'
                }}>{personalAIResponse.metrics.momentumScore}%</span>
              </div>

              {/* Primary Intervention Only */}
              {personalAIResponse.interventions && personalAIResponse.interventions.length > 0 && personalAIResponse.interventions[0].estimatedImpact > 50 && (
                <div style={{
                  fontSize: '12px',
                  color: '#999',
                  marginBottom: '16px'
                }}>
                  Next: <span style={{ color: '#fff' }}>{personalAIResponse.interventions[0].taskRef}</span>
                </div>
              )}

              {/* Minimal Dismiss */}
              <div style={{ textAlign: 'right' }}>
                <button
                  onClick={() => setShowPersonalAI(false)}
                  style={{
                    fontSize: '11px',
                    color: '#666',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '300',
                    opacity: 0.7
                  }}
                  onMouseEnter={(e) => (e.target as HTMLButtonElement).style.opacity = '1'}
                  onMouseLeave={(e) => (e.target as HTMLButtonElement).style.opacity = '0.7'}
                >
                  dismiss
                </button>
              </div>
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