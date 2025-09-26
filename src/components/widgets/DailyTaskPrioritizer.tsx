import { useState } from 'react';

interface Task {
  text: string;
  isSignal: boolean;
}

export default function DailyTaskPrioritizer({ isGerman }: { isGerman: boolean }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showResults, setShowResults] = useState(false);

  const addTask = () => {
    if (inputValue.trim() && tasks.length < 10) {
      setTasks([...tasks, { text: inputValue.trim(), isSignal: false }]);
      setInputValue('');
    }
  };

  const toggleTaskSignal = (index: number) => {
    const updated = [...tasks];
    updated[index].isSignal = !updated[index].isSignal;
    setTasks(updated);
  };

  const removeTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const calculatePriority = () => {
    setShowResults(true);
  };

  const signalCount = tasks.filter(t => t.isSignal).length;
  const noiseCount = tasks.filter(t => !t.isSignal).length;
  const ratio = tasks.length > 0 ? Math.round((signalCount / tasks.length) * 100) : 0;

  const reset = () => {
    setTasks([]);
    setShowResults(false);
    setInputValue('');
  };

  return (
    <div style={{
      backgroundColor: '#0f0f0f',
      border: '2px solid #00ff88',
      borderRadius: '12px',
      padding: '2rem',
      margin: '3rem 0'
    }}>
      <h3 style={{
        color: '#00ff88',
        fontSize: '1.3rem',
        marginBottom: '1rem',
        fontWeight: '400',
        textAlign: 'center'
      }}>
        🎯 {isGerman ? 'Finde deine 3 Signal-Aufgaben' : 'Find Your 3 Signal Tasks'}
      </h3>

      <p style={{
        color: '#b8b8b8',
        fontSize: '0.9rem',
        marginBottom: '1.5rem',
        textAlign: 'center',
        lineHeight: '1.5'
      }}>
        {isGerman
          ? 'Liste alle Aufgaben für heute auf. Markiere dann die 3 wichtigsten als "Signal".'
          : 'List all your tasks for today. Then mark the 3 most important ones as "Signal".'}
      </p>

      {!showResults && (
        <>
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '1.5rem'
          }}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              placeholder={isGerman ? "Aufgabe eingeben..." : "Enter task..."}
              style={{
                flex: 1,
                padding: '0.75rem',
                backgroundColor: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '6px',
                color: '#e8e8e8',
                fontSize: '1rem'
              }}
              disabled={tasks.length >= 10}
            />
            <button
              onClick={addTask}
              disabled={tasks.length >= 10}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: tasks.length >= 10 ? '#333' : '#00ff88',
                color: tasks.length >= 10 ? '#666' : '#000',
                border: 'none',
                borderRadius: '6px',
                cursor: tasks.length >= 10 ? 'not-allowed' : 'pointer',
                fontWeight: '500'
              }}
            >
              {isGerman ? 'Hinzufügen' : 'Add'}
            </button>
          </div>

          {tasks.length > 0 && (
            <div style={{
              marginBottom: '1.5rem'
            }}>
              {tasks.map((task, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.75rem',
                    marginBottom: '0.5rem',
                    backgroundColor: task.isSignal ? 'rgba(0, 255, 136, 0.1)' : '#1a1a1a',
                    border: `1px solid ${task.isSignal ? '#00ff88' : '#333'}`,
                    borderRadius: '6px',
                    transition: 'all 0.2s'
                  }}
                >
                  <button
                    onClick={() => toggleTaskSignal(index)}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      border: `2px solid ${task.isSignal ? '#00ff88' : '#666'}`,
                      backgroundColor: task.isSignal ? '#00ff88' : 'transparent',
                      cursor: 'pointer',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem'
                    }}
                  >
                    {task.isSignal && '✓'}
                  </button>
                  <span style={{
                    flex: 1,
                    color: task.isSignal ? '#00ff88' : '#e8e8e8',
                    fontSize: '0.95rem'
                  }}>
                    {task.text}
                  </span>
                  <button
                    onClick={() => removeTask(index)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#666',
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      padding: '0 0.5rem'
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {tasks.length >= 3 && (
            <button
              onClick={calculatePriority}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#00ff88',
                color: '#000',
                border: 'none',
                borderRadius: '6px',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#00cc6a';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#00ff88';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {isGerman ? 'Prioritäten analysieren' : 'Analyze Priorities'}
            </button>
          )}

          {tasks.length < 3 && tasks.length > 0 && (
            <p style={{
              textAlign: 'center',
              color: '#666',
              fontSize: '0.85rem',
              marginTop: '1rem'
            }}>
              {isGerman
                ? `Füge noch ${3 - tasks.length} Aufgabe(n) hinzu`
                : `Add ${3 - tasks.length} more task(s)`}
            </p>
          )}
        </>
      )}

      {showResults && (
        <div style={{
          textAlign: 'center'
        }}>
          <div style={{
            marginBottom: '2rem'
          }}>
            <div style={{
              fontSize: '3rem',
              fontWeight: '100',
              color: ratio >= 30 ? '#00ff88' : '#ff6b6b',
              marginBottom: '0.5rem'
            }}>
              {ratio}%
            </div>
            <div style={{
              fontSize: '1.1rem',
              color: ratio >= 30 ? '#00ff88' : '#ff6b6b',
              marginBottom: '1rem'
            }}>
              {ratio >= 30
                ? (isGerman ? 'Gut priorisiert!' : 'Well prioritized!')
                : (isGerman ? 'Zu viel Noise!' : 'Too much noise!')}
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '2rem',
            textAlign: 'left'
          }}>
            <div style={{
              padding: '1rem',
              backgroundColor: 'rgba(0, 255, 136, 0.1)',
              border: '1px solid rgba(0, 255, 136, 0.3)',
              borderRadius: '6px'
            }}>
              <div style={{
                color: '#00ff88',
                fontSize: '0.9rem',
                marginBottom: '0.5rem',
                fontWeight: '500'
              }}>
                Signal ({signalCount})
              </div>
              {tasks.filter(t => t.isSignal).map((task, i) => (
                <div key={i} style={{
                  color: '#e8e8e8',
                  fontSize: '0.85rem',
                  marginBottom: '0.25rem'
                }}>
                  • {task.text}
                </div>
              ))}
              {signalCount === 0 && (
                <div style={{ color: '#666', fontSize: '0.85rem' }}>
                  {isGerman ? 'Keine Signal-Aufgaben' : 'No signal tasks'}
                </div>
              )}
            </div>

            <div style={{
              padding: '1rem',
              backgroundColor: 'rgba(255, 107, 107, 0.05)',
              border: '1px solid rgba(255, 107, 107, 0.2)',
              borderRadius: '6px'
            }}>
              <div style={{
                color: '#ff6b6b',
                fontSize: '0.9rem',
                marginBottom: '0.5rem',
                fontWeight: '500'
              }}>
                Noise ({noiseCount})
              </div>
              {tasks.filter(t => !t.isSignal).map((task, i) => (
                <div key={i} style={{
                  color: '#b8b8b8',
                  fontSize: '0.85rem',
                  marginBottom: '0.25rem'
                }}>
                  • {task.text}
                </div>
              ))}
              {noiseCount === 0 && (
                <div style={{ color: '#666', fontSize: '0.85rem' }}>
                  {isGerman ? 'Keine Noise-Aufgaben' : 'No noise tasks'}
                </div>
              )}
            </div>
          </div>

          <div style={{
            padding: '1rem',
            backgroundColor: 'rgba(0, 255, 136, 0.05)',
            borderRadius: '6px',
            marginBottom: '1.5rem'
          }}>
            <p style={{
              color: signalCount === 3 ? '#00ff88' : '#ff8800',
              fontSize: '0.9rem',
              fontWeight: '500',
              marginBottom: '0.5rem'
            }}>
              {signalCount === 3
                ? (isGerman ? '✓ Perfekt! Genau 3 Signal-Aufgaben wie Steve Jobs' : '✓ Perfect! Exactly 3 Signal tasks like Steve Jobs')
                : signalCount < 3
                ? (isGerman ? `⚠️ Du hast nur ${signalCount} Signal-Aufgabe(n). Jobs hatte immer 3.` : `⚠️ You have only ${signalCount} Signal task(s). Jobs always had 3.`)
                : (isGerman ? `⚠️ Du hast ${signalCount} Signal-Aufgaben. Fokussiere auf die Top 3!` : `⚠️ You have ${signalCount} Signal tasks. Focus on the top 3!`)}
            </p>
            {signalCount !== 3 && (
              <p style={{
                color: '#888',
                fontSize: '0.85rem'
              }}>
                {isGerman
                  ? 'Die 3-5 Regel: Wähle maximal 3-5 kritische Aufgaben pro Tag'
                  : 'The 3-5 Rule: Choose maximum 3-5 critical tasks per day'}
              </p>
            )}
          </div>

          <button
            onClick={reset}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'transparent',
              color: '#00ff88',
              border: '1px solid #00ff88',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 255, 136, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {isGerman ? 'Neu starten' : 'Start Over'}
          </button>
        </div>
      )}
    </div>
  );
}