import type { Task } from '../types';
import { useState } from 'react';

interface MorningReviewModalProps {
  show: boolean;
  unfinishedTasks: Task[];
  yesterdayCompleted: number;
  yesterdayTotal: number;
  onRollover: (taskId: number) => void;
  onMarkDone: (taskId: number) => void;
  onReclassifyAsNoise: (taskId: number) => void;
  onArchive: (taskId: number) => void;
  onClose: () => void;
}

export default function MorningReviewModal({
  show,
  unfinishedTasks,
  yesterdayCompleted,
  yesterdayTotal,
  onRollover,
  onMarkDone,
  onReclassifyAsNoise,
  onArchive,
  onClose
}: MorningReviewModalProps) {
  const [processedTasks, setProcessedTasks] = useState<Set<number>>(new Set());

  if (!show) return null;

  const handleAction = (taskId: number, action: 'rollover' | 'markDone' | 'noise' | 'archive') => {
    // Add to processed set immediately
    setProcessedTasks(prev => new Set(prev).add(taskId));

    // Execute action with slight delay for visual feedback
    setTimeout(() => {
      if (action === 'rollover') {
        onRollover(taskId);
      } else if (action === 'markDone') {
        onMarkDone(taskId);
      } else if (action === 'noise') {
        onReclassifyAsNoise(taskId);
      } else {
        onArchive(taskId);
      }
    }, 200);
  };

  // Dynamic "Tag starten" button
  const unreviewedCount = unfinishedTasks.length - processedTasks.size;
  const allProcessed = unreviewedCount === 0;

  const handleClose = () => {
    // Auto-rollover unprocessed tasks
    unfinishedTasks.forEach(task => {
      if (!processedTasks.has(task.id)) {
        onRollover(task.id);
      }
    });

    onClose();
  };

  return (
    <div
      className="modal-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
        animation: 'fadeIn 300ms ease-out'
      }}
    >
      <div
        className="modal-content"
        style={{
          backgroundColor: 'var(--bg)',
          border: '1px solid #333',
          borderRadius: '12px',
          padding: '40px',
          maxWidth: '500px',
          width: '100%',
          maxHeight: '80vh',
          overflowY: 'auto',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{
            fontWeight: 300,
            fontSize: '24px',
            marginBottom: '12px',
            color: 'var(--signal)'
          }}>
            Morning Review
          </h2>

          <p style={{
            color: '#666',
            fontSize: '14px',
            fontWeight: 100
          }}>
            Gestern: {yesterdayCompleted} von {yesterdayTotal} Signal erledigt
          </p>
        </div>

        {/* Unfinished Tasks */}
        <div style={{ marginBottom: '20px' }}>
          {unfinishedTasks.map((task) => {
            const isProcessed = processedTasks.has(task.id);

            // Collapsed view for processed tasks
            if (isProcessed) {
              return (
                <div
                  key={task.id}
                  style={{
                    marginBottom: '8px',
                    padding: '8px 12px',
                    backgroundColor: '#0a0a0a',
                    border: '1px solid #222',
                    borderRadius: '6px',
                    opacity: 0.5,
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '12px',
                    color: '#666',
                    transition: 'all 200ms ease',
                    overflow: 'hidden'
                  }}
                >
                  ✓ {task.text}
                </div>
              );
            }

            // Full view for unprocessed tasks
            return (
              <div
                key={task.id}
                style={{
                  marginBottom: '20px',
                  padding: '16px',
                  backgroundColor: '#111',
                  border: '1px solid #222',
                  borderRadius: '8px',
                  transition: 'all 200ms ease'
                }}
              >
                {/* Optional: "War eigentlich erledigt" - tiny, above task */}
                <div
                  onClick={() => handleAction(task.id, 'markDone')}
                  style={{
                    fontSize: '10px',
                    color: '#555',
                    marginBottom: '8px',
                    cursor: 'pointer',
                    transition: 'color 0.2s ease',
                    userSelect: 'none'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#888'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#555'}
                >
                  ✓ War eigentlich erledigt
                </div>

                {/* Task Text */}
                <p style={{
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 300,
                  marginBottom: '12px',
                  lineHeight: 1.4
                }}>
                  {task.text}
                </p>

                {/* Primary Button: "Heute Signal" */}
                <button
                  onClick={() => handleAction(task.id, 'rollover')}
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--signal)',
                    color: '#000',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    marginBottom: '12px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#00ff88';
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--signal)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  Heute Signal
                </button>

                {/* Secondary Options: War Noise • Erledigt sich */}
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'center',
                  fontSize: '13px'
                }}>
                  <span
                    onClick={() => handleAction(task.id, 'noise')}
                    style={{
                      color: '#666',
                      cursor: 'pointer',
                      transition: 'color 0.2s ease',
                      fontWeight: 300
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#aaa'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
                  >
                    War Noise
                  </span>

                  <span style={{ color: '#333' }}>•</span>

                  <span
                    onClick={() => handleAction(task.id, 'archive')}
                    style={{
                      color: '#666',
                      cursor: 'pointer',
                      transition: 'color 0.2s ease',
                      fontWeight: 300
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#aaa'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
                  >
                    Erledigt sich
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic "Tag starten" Button */}
        <button
          onClick={handleClose}
          style={{
            width: '100%',
            backgroundColor: allProcessed ? 'var(--signal)' : '#222',
            color: allProcessed ? '#000' : '#fff',
            border: 'none',
            padding: '16px 24px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: allProcessed ? 500 : 300,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            textAlign: 'center',
            animation: allProcessed ? 'pulse 2s ease-in-out infinite' : 'none'
          }}
          onMouseEnter={(e) => {
            if (allProcessed) {
              e.currentTarget.style.backgroundColor = '#00ff88';
              e.currentTarget.style.transform = 'scale(1.02)';
            } else {
              e.currentTarget.style.backgroundColor = '#333';
            }
          }}
          onMouseLeave={(e) => {
            if (allProcessed) {
              e.currentTarget.style.backgroundColor = 'var(--signal)';
              e.currentTarget.style.transform = 'scale(1)';
            } else {
              e.currentTarget.style.backgroundColor = '#222';
            }
          }}
        >
          {allProcessed ? (
            <div>Tag starten</div>
          ) : (
            <div>
              <div style={{ fontWeight: 500 }}>
                {unreviewedCount} Signal{unreviewedCount > 1 ? 's' : ''} übernehmen
              </div>
              <div style={{ fontWeight: 100, fontSize: '12px', marginTop: '4px' }}>
                & Tag starten
              </div>
            </div>
          )}
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.01);
          }
        }
      `}</style>
    </div>
  );
}
