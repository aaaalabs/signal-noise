import { useState } from 'react';
import { getCoachAdvice } from '../services/groqService';
import type { CoachResponse } from '../services/groqService';
import type { Task, CoachPayload } from '../types';

interface AICoachProps {
  tasks: Task[];
  currentRatio: number;
  firstName?: string;
}

export default function AICoach({ tasks, currentRatio, firstName }: AICoachProps) {
  const [coachResponse, setCoachResponse] = useState<CoachResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCoach, setShowCoach] = useState(false);

  const getCoachingAdvice = async () => {
    if (!firstName) {
      // Prompt for first name if not set
      const name = prompt('Wie heißt du? (Für persönliche Ansprache)');
      if (!name) return;
      // In a real app, you'd save this to localStorage/state
    }

    setIsLoading(true);
    setShowCoach(true);

    try {
      // Generate coaching payload (simplified)
      const payload: CoachPayload = {
        firstName: firstName || 'Du',
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
          currentStreak: 0, // Simplified
          longestStreak: 0, // Simplified
          averageRatio7Days: currentRatio,
          averageRatio30Days: currentRatio,
          totalDecisions: tasks.length,
          perfectDays: 0,
          badges: []
        },
        patterns: {
          bestHour: 9,
          worstDay: 'Mo',
          hourlyDistribution: Array(24).fill(0),
          weeklyPattern: Array(7).fill(null).map(() => ({ signal: 0, noise: 0 })),
          trendDirection: 'stable',
          consistencyScore: 75
        },
        history: {
          recentTasks: tasks.slice(0, 10).map(t => ({
            text: t.text,
            type: t.type,
            timestamp: t.timestamp
          })),
          dailyRatios: []
        }
      };

      const response = await getCoachAdvice(payload);
      setCoachResponse(response);
    } catch (error) {
      console.error('Coaching error:', error);
      setCoachResponse({
        message: 'Coaching temporär nicht verfügbar. Fokussiere dich auf deine wichtigsten 3 Aufgaben!',
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
      {!showCoach && (
        <button
          onClick={getCoachingAdvice}
          className="ai-coach-button"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}
        >
          <img
            src="/sn-icon-grey.svg"
            alt="AI Coach"
            style={{ width: '16px', height: '16px' }}
          />
          AI Coach fragen
        </button>
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
              <span style={{ color: '#999' }}>AI Coach analysiert deine Patterns...</span>
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
                    Empfehlungen:
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
                Schließen
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