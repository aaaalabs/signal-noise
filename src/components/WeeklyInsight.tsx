import { useState, useEffect } from 'react';
import './WeeklyInsight.css';

interface WeeklyInsightData {
  week: string;
  theme: string;
  why: string;
  next: string;
  confidence: number;
  suggestedTask: {
    text: string;
    reasoning: string;
  } | null;
}

interface WeeklyInsightProps {
  email: string | null;
  sessionToken: string | null;
  isPremium: boolean;
  onAddTask?: (taskText: string) => void;
}

export default function WeeklyInsight({ email, sessionToken, isPremium, onAddTask }: WeeklyInsightProps) {
  const [insight, setInsight] = useState<WeeklyInsightData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!isPremium || !email || !sessionToken || dismissed) {
      return;
    }

    // Check if we should fetch (once per week on load)
    const lastFetchKey = 'weekly_insight_last_fetch';
    const lastFetch = localStorage.getItem(lastFetchKey);
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    // Fetch weekly insight once per day max (check if we need new one)
    if (lastFetch && (now - parseInt(lastFetch)) < oneDay) {
      return;
    }

    const fetchWeeklyInsight = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/weekly-insight', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionToken}`
          },
          body: JSON.stringify({
            userEmail: email,
            accessToken: sessionToken
          })
        });

        if (!response.ok) {
          if (response.status === 403) {
            // Not premium - silently ignore
            return;
          }
          throw new Error(`Failed to fetch insight: ${response.status}`);
        }

        const data = await response.json();
        setInsight(data.insight);
        localStorage.setItem(lastFetchKey, now.toString());

      } catch (err) {
        console.error('Weekly insight error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load insight');
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyInsight();
  }, [email, sessionToken, isPremium, dismissed]);

  // Don't show if not premium, dismissed, or loading
  if (!isPremium || dismissed || loading || !insight) {
    return null;
  }

  // Don't show if there's an error
  if (error) {
    console.log('Weekly insight hidden due to error:', error);
    return null;
  }

  return (
    <div className="weekly-insight">
      <div className="weekly-insight-header">
        <h3>📊 Diese Woche</h3>
        <button
          className="weekly-insight-dismiss"
          onClick={() => setDismissed(true)}
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <div className="weekly-insight-content">
        <div className="weekly-insight-section">
          <strong>Thema:</strong> {insight.theme}
        </div>

        <div className="weekly-insight-section">
          {insight.why}
        </div>

        <div className="weekly-insight-section">
          <strong>Nächster Schritt:</strong> {insight.next}
        </div>

        {insight.suggestedTask && onAddTask && (
          <div className="weekly-insight-action">
            <button
              className="weekly-insight-add-task"
              onClick={() => {
                onAddTask(insight.suggestedTask!.text);
                setDismissed(true);
              }}
            >
              ➕ Quick Win: {insight.suggestedTask.text}
            </button>
            <div className="weekly-insight-reasoning">
              {insight.suggestedTask.reasoning}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
