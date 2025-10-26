import { useState, useEffect } from 'react';
import type { AppData } from '../types';

/**
 * DevPanel - SLC Development Testing Panel
 *
 * Only visible in DEV mode
 * Keyboard shortcut: Cmd+Shift+T
 *
 * Features:
 * - Quick scenario loading (Morning Review, AI Coach Debug, Reset)
 * - Direct localStorage manipulation
 * - Minimal UI
 */

const DATA_KEY = 'signal_noise_data';

export default function DevPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [enabled, setEnabled] = useState(
    import.meta.env.DEV || localStorage.getItem('dev_panel_enabled') === 'true'
  );

  // Keyboard shortcut: Cmd+K (secret shortcut in production)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();

        // Secret shortcut: Enable panel in production on first press
        if (!enabled) {
          setEnabled(true);
          localStorage.setItem('dev_panel_enabled', 'true');
        }

        setIsOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled]);

  // Only render if enabled
  if (!enabled) {
    return null;
  }

  // Scenario 1: Morning Review Test
  const loadMorningReviewScenario = () => {
    console.log('🧪 Loading Morning Review Scenario...');

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(10, 0, 0, 0);

    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const scenario: AppData = {
      tasks: [
        // Unfinished Signal tasks from yesterday
        {
          id: Date.now() - 1000,
          text: 'Review Q4 Strategy Deck',
          type: 'signal',
          timestamp: yesterday.toISOString(),
          completed: false
        },
        {
          id: Date.now() - 2000,
          text: 'Call with key client',
          type: 'signal',
          timestamp: yesterday.toISOString(),
          completed: false
        },
        {
          id: Date.now() - 3000,
          text: 'Finalize hiring decision',
          type: 'signal',
          timestamp: yesterday.toISOString(),
          completed: false
        },
        // Completed Signal tasks from yesterday
        {
          id: Date.now() - 4000,
          text: 'Team standup',
          type: 'signal',
          timestamp: yesterday.toISOString(),
          completed: true
        },
        {
          id: Date.now() - 5000,
          text: 'Budget review',
          type: 'signal',
          timestamp: yesterday.toISOString(),
          completed: true
        }
      ],
      history: [],
      badges: [],
      patterns: {},
      settings: {
        targetRatio: 80,
        notifications: false,
        firstName: 'Dev',
        commitModeActivatedAt: new Date().toISOString(), // CRITICAL: Activates Commitment Mode
        lastReviewedDate: twoDaysAgo.toISOString().split('T')[0] // 2 days ago → triggers modal
      },
      signal_ratio: 40
    };

    localStorage.setItem(DATA_KEY, JSON.stringify(scenario));
    console.log('✅ Morning Review scenario loaded. Reloading app...');
    console.log('📊 Scenario details:', {
      unfinishedSignals: 3,
      completedSignals: 2,
      commitModeActive: true,
      lastReviewedDate: scenario.settings.lastReviewedDate,
      shouldShowModal: true
    });

    window.location.reload();
  };

  // Scenario 2: AI Coach Debug
  const loadAICoachDebugScenario = () => {
    console.log('🧪 Loading AI Coach Debug Scenario...');

    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);

    const scenario: AppData = {
      tasks: [
        // Today's tasks
        {
          id: Date.now() - 100,
          text: 'Ship MVP features',
          type: 'signal',
          timestamp: now.toISOString(),
          completed: false
        },
        {
          id: Date.now() - 200,
          text: 'Social media check',
          type: 'noise',
          timestamp: now.toISOString(),
          completed: false
        },
        // Old abandoned tasks (for Personal AI pattern detection)
        {
          id: Date.now() - 1000,
          text: 'Lead Outreach',
          type: 'signal',
          timestamp: threeDaysAgo.toISOString(),
          completed: false
        },
        {
          id: Date.now() - 2000,
          text: 'Lead Outreach', // Duplicate → pattern
          type: 'signal',
          timestamp: fiveDaysAgo.toISOString(),
          completed: false
        },
        {
          id: Date.now() - 3000,
          text: 'Update investor deck',
          type: 'signal',
          timestamp: threeDaysAgo.toISOString(),
          completed: false
        }
      ],
      history: [],
      badges: ['first_signal'],
      patterns: {},
      settings: {
        targetRatio: 80,
        notifications: false,
        firstName: 'Thomas'
      },
      signal_ratio: 60
    };

    localStorage.setItem(DATA_KEY, JSON.stringify(scenario));
    localStorage.setItem('userFirstName', 'Thomas');

    console.log('✅ AI Coach Debug scenario loaded. Reloading app...');
    console.log('📊 Scenario details:', {
      totalTasks: scenario.tasks.length,
      abandonedSignals: 3,
      repeatingTask: 'Lead Outreach (appears 2x)',
      firstName: 'Thomas',
      readyForAICoach: true
    });

    // Enable verbose logging for next AI Coach request
    localStorage.setItem('dev_verbose_ai_logging', 'true');

    window.location.reload();
  };

  // Scenario 3: Reset to Clean State
  const resetToClean = () => {
    console.log('🧪 Resetting to clean state...');

    const cleanState: AppData = {
      tasks: [],
      history: [],
      badges: [],
      patterns: {},
      settings: {
        targetRatio: 80,
        notifications: false,
        firstName: ''
      },
      signal_ratio: 0
    };

    localStorage.setItem(DATA_KEY, JSON.stringify(cleanState));
    localStorage.removeItem('userFirstName');
    localStorage.removeItem('dev_verbose_ai_logging');

    console.log('✅ Reset complete. Reloading app...');
    window.location.reload();
  };

  // Export current state
  const exportCurrentState = () => {
    const data = localStorage.getItem(DATA_KEY);
    if (!data) {
      console.log('❌ No data to export');
      return;
    }

    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `signal-noise-state-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log('✅ State exported');
  };

  // Disable dev panel (production only)
  const disableDevPanel = () => {
    if (import.meta.env.DEV) {
      console.log('Cannot disable in DEV mode');
      return;
    }
    localStorage.removeItem('dev_panel_enabled');
    setEnabled(false);
    setIsOpen(false);
    console.log('✅ Dev Panel disabled - reload to re-enable with Cmd+K');
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: '#111',
          border: '1px solid #333',
          color: '#00ff88',
          fontSize: '20px',
          cursor: 'pointer',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
          fontWeight: '300'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#1a1a1a';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#111';
          e.currentTarget.style.transform = 'scale(1)';
        }}
        title="Dev Panel (Cmd+K)"
      >
        🧪
      </button>

      {/* Dev Panel */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            width: '320px',
            backgroundColor: '#0a0a0a',
            border: '1px solid #333',
            borderRadius: '12px',
            padding: '20px',
            zIndex: 9998,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
            animation: 'slideUp 200ms ease-out'
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            paddingBottom: '12px',
            borderBottom: '1px solid #222'
          }}>
            <h3 style={{
              margin: 0,
              fontSize: '14px',
              fontWeight: '500',
              color: '#00ff88',
              letterSpacing: '1px'
            }}>
              DEV PANEL
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#666',
                cursor: 'pointer',
                fontSize: '18px',
                padding: '0',
                width: '24px',
                height: '24px'
              }}
            >
              ×
            </button>
          </div>

          {/* Scenarios */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={loadMorningReviewScenario}
              style={{
                backgroundColor: '#111',
                color: '#fff',
                border: '1px solid #333',
                padding: '12px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '300',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1a1a1a';
                e.currentTarget.style.borderColor = '#444';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#111';
                e.currentTarget.style.borderColor = '#333';
              }}
            >
              <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                🌅 Morning Review
              </div>
              <div style={{ fontSize: '11px', color: '#666' }}>
                Commitment Mode + unfinished tasks
              </div>
            </button>

            <button
              onClick={loadAICoachDebugScenario}
              style={{
                backgroundColor: '#111',
                color: '#fff',
                border: '1px solid #333',
                padding: '12px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '300',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1a1a1a';
                e.currentTarget.style.borderColor = '#444';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#111';
                e.currentTarget.style.borderColor = '#333';
              }}
            >
              <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                🤖 AI Coach Debug
              </div>
              <div style={{ fontSize: '11px', color: '#666' }}>
                Abandoned tasks + verbose logging
              </div>
            </button>

            <button
              onClick={resetToClean}
              style={{
                backgroundColor: '#111',
                color: '#fff',
                border: '1px solid #333',
                padding: '12px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '300',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1a1a1a';
                e.currentTarget.style.borderColor = '#444';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#111';
                e.currentTarget.style.borderColor = '#333';
              }}
            >
              <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                🔄 Reset to Clean
              </div>
              <div style={{ fontSize: '11px', color: '#666' }}>
                Factory defaults
              </div>
            </button>

            {/* Export State */}
            <button
              onClick={exportCurrentState}
              style={{
                backgroundColor: 'transparent',
                color: '#666',
                border: '1px solid #222',
                padding: '8px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '300',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s ease',
                marginTop: '8px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#333';
                e.currentTarget.style.color = '#888';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#222';
                e.currentTarget.style.color = '#666';
              }}
            >
              💾 Export Current State
            </button>

            {/* Disable Panel (production only) */}
            {!import.meta.env.DEV && (
              <button
                onClick={disableDevPanel}
                style={{
                  backgroundColor: 'transparent',
                  color: '#444',
                  border: '1px solid #1a1a1a',
                  padding: '6px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: '300',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                  marginTop: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#222';
                  e.currentTarget.style.color = '#666';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#1a1a1a';
                  e.currentTarget.style.color = '#444';
                }}
              >
                🔒 Disable Dev Panel
              </button>
            )}
          </div>

          {/* Info */}
          <div style={{
            marginTop: '16px',
            paddingTop: '12px',
            borderTop: '1px solid #222',
            fontSize: '11px',
            color: '#444',
            textAlign: 'center'
          }}>
            {import.meta.env.DEV ? 'DEV Mode' : 'Secret Mode'} · Cmd+K
          </div>
        </div>
      )}

      {/* Animation */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
