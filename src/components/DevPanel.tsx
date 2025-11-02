import { useState, useEffect } from 'react';
import type { AppData } from '../types';
import { checkPremiumStatus } from '../services/premiumService';

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

  // Check if user is Premium
  const isPremium = checkPremiumStatus().isActive;

  // Keyboard shortcut: Cmd+K (secret shortcut for Premium users only)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();

        // DEV mode: Always allow
        if (import.meta.env.DEV) {
          if (!enabled) {
            setEnabled(true);
            localStorage.setItem('dev_panel_enabled', 'true');
          }
          setIsOpen(prev => !prev);
          return;
        }

        // Production: Only Premium users
        if (!isPremium) {
          console.log('🔒 DevPanel requires Premium access');
          return;
        }

        // Secret shortcut: Enable panel for Premium users
        if (!enabled) {
          setEnabled(true);
          localStorage.setItem('dev_panel_enabled', 'true');
        }

        setIsOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, isPremium]);

  // Only render if enabled AND (DEV mode OR Premium)
  if (!enabled || (!import.meta.env.DEV && !isPremium)) {
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

  // Scenario 2: Reset to Clean State
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
    localStorage.removeItem('sessionData'); // Clear premium simulation

    console.log('✅ Reset complete. Reloading app...');
    window.location.reload();
  };

  // Custom JSON Injection
  const [showJsonInput, setShowJsonInput] = useState(false);
  const [jsonInput, setJsonInput] = useState('');

  const injectCustomJsonTasks = async () => {
    console.log('🚀 Injecting custom JSON tasks...');

    if (!isPremium) {
      console.log('❌ This function requires Premium access');
      alert('This function requires Premium access');
      return;
    }

    try {
      // Parse JSON input
      const customTasks = JSON.parse(jsonInput);

      if (!Array.isArray(customTasks)) {
        alert('JSON must be an array of tasks');
        return;
      }

      console.log('✅ Parsed', customTasks.length, 'tasks from JSON');

      // Get session token
      const sessionData = JSON.parse(localStorage.getItem('sessionData') || '{}');
      const sessionToken = sessionData.sessionToken;
      const email = sessionData.email;

      if (!sessionToken || !email) {
        console.error('❌ No session found');
        alert('No session found. Please log in.');
        return;
      }

      // Fetch current data from Redis
      console.log('📥 Fetching current data from Redis...');
      const response = await fetch('/api/tasks', {
        headers: { 'Authorization': `Bearer ${sessionToken}` }
      });

      if (!response.ok) {
        console.error('❌ Failed to fetch:', response.status);
        alert('Failed to fetch current data');
        return;
      }

      const { data: cloudData, version: serverVersion } = await response.json();
      console.log('✅ Current tasks:', cloudData.tasks.length);
      console.log('📦 Server version:', serverVersion);

      // Get highest task ID
      const maxId = Math.max(...cloudData.tasks.map((t: any) => t.id), 0);

      // Create task objects with validation
      const newTasks = customTasks.map((task: any, i: number) => {
        if (!task.date || !task.text) {
          throw new Error('Each task must have "date" and "text" fields');
        }

        return {
          id: maxId + i + 1,
          text: task.text,
          type: task.type || 'signal',
          completed: task.completed !== undefined ? task.completed : true,
          timestamp: task.date,
          important: task.important || false
        };
      });

      // Log tasks
      console.log('📦 Creating', newTasks.length, 'tasks:\n');
      newTasks.forEach(t => {
        console.log(`  ${t.completed ? '✅' : '⏳'} [${t.timestamp.slice(0, 10)}] ${t.text} (${t.type})`);
      });

      // Merge and sort
      const allTasks = [...cloudData.tasks, ...newTasks];
      allTasks.sort((a, b) => {
        const dateA = new Date(a.timestamp);
        const dateB = new Date(b.timestamp);
        return dateB.getTime() - dateA.getTime();
      });

      console.log('\n📊 Total:', allTasks.length, '(was', cloudData.tasks.length, ')');

      // Update data
      const updatedData = { ...cloudData, tasks: allTasks };

      // Upload to Redis
      console.log('📤 Uploading to Redis with version:', serverVersion);
      const uploadResponse = await fetch('/api/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`
        },
        body: JSON.stringify({
          email,
          data: updatedData,
          firstName: cloudData.settings?.firstName || '',
          clientVersion: serverVersion
        })
      });

      if (uploadResponse.ok) {
        console.log('✅ SUCCESS! Reloading in 2 seconds...');
        alert(`Success! Added ${newTasks.length} tasks. Page will reload.`);
        setJsonInput('');
        setShowJsonInput(false);
        setTimeout(() => window.location.reload(), 2000);
      } else if (uploadResponse.status === 409) {
        console.log('⚠️ Version conflict - reloading...');
        alert('Version conflict detected. Reloading...');
        setTimeout(() => window.location.reload(), 1000);
      } else {
        console.error('❌ Upload failed:', uploadResponse.status);
        alert('Upload failed: ' + uploadResponse.status);
      }
    } catch (error) {
      console.error('❌ Error:', error);
      alert('Error: ' + (error instanceof Error ? error.message : 'Unknown'));
    }
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

            {/* Custom JSON Injection */}
            {isPremium && (
              <>
                <button
                  onClick={() => setShowJsonInput(!showJsonInput)}
                  style={{
                    backgroundColor: '#111',
                    color: '#ff8800',
                    border: '1px solid #ff8800',
                    padding: '12px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '300',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                    marginTop: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1a1a1a';
                    e.currentTarget.style.borderColor = '#ffaa00';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#111';
                    e.currentTarget.style.borderColor = '#ff8800';
                  }}
                >
                  <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                    📝 Custom JSON Inject
                  </div>
                  <div style={{ fontSize: '11px', color: '#666' }}>
                    {showJsonInput ? 'Hide input' : 'Paste JSON array of tasks'}
                  </div>
                </button>

                {showJsonInput && (
                  <div style={{ marginTop: '8px' }}>
                    <textarea
                      value={jsonInput}
                      onChange={(e) => setJsonInput(e.target.value)}
                      placeholder='[
  {"date": "2025-10-28T10:00:00Z", "text": "Task 1", "type": "signal", "completed": true},
  {"date": "2025-10-29T14:00:00Z", "text": "Task 2", "type": "signal", "completed": true}
]'
                      style={{
                        width: '100%',
                        height: '200px',
                        backgroundColor: '#0a0a0a',
                        border: '1px solid #333',
                        borderRadius: '6px',
                        padding: '8px',
                        fontSize: '11px',
                        fontFamily: 'monospace',
                        color: '#fff',
                        resize: 'vertical'
                      }}
                    />
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      marginTop: '8px'
                    }}>
                      <button
                        onClick={injectCustomJsonTasks}
                        style={{
                          flex: 1,
                          backgroundColor: '#ff8800',
                          color: '#000',
                          border: 'none',
                          padding: '10px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#ffaa00';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#ff8800';
                        }}
                      >
                        🚀 Inject Tasks
                      </button>
                      <button
                        onClick={() => {
                          setJsonInput('');
                          setShowJsonInput(false);
                        }}
                        style={{
                          flex: 0,
                          backgroundColor: 'transparent',
                          color: '#666',
                          border: '1px solid #333',
                          padding: '10px 16px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '300',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#444';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#333';
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                    <div style={{
                      marginTop: '8px',
                      fontSize: '10px',
                      color: '#444',
                      lineHeight: '1.4'
                    }}>
                      Required: <span style={{ color: '#666' }}>date, text</span><br/>
                      Optional: <span style={{ color: '#666' }}>type (signal/noise), completed (true/false)</span>
                    </div>
                  </div>
                )}
              </>
            )}

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
