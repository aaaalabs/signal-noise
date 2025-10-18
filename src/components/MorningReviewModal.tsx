import { Task } from '../types';
import { useState } from 'react';

interface MorningReviewModalProps {
  show: boolean;
  unfinishedTasks: Task[];
  yesterdayCompleted: number;
  yesterdayTotal: number;
  onRollover: (taskId: number) => void;
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
  onReclassifyAsNoise,
  onArchive,
  onClose
}: MorningReviewModalProps) {
  const [processedTasks, setProcessedTasks] = useState<Set<number>>(new Set());

  if (!show) return null;

  const handleAction = (taskId: number, action: 'rollover' | 'noise' | 'archive') => {
    // Add to processed set
    setProcessedTasks(prev => new Set(prev).add(taskId));

    // Execute action with slight delay for visual feedback
    setTimeout(() => {
      if (action === 'rollover') {
        onRollover(taskId);
      } else if (action === 'noise') {
        onReclassifyAsNoise(taskId);
      } else {
        onArchive(taskId);
      }

      // Check if all tasks are processed
      if (processedTasks.size + 1 === unfinishedTasks.length) {
        setTimeout(onClose, 300);
      }
    }, 200);
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

            return (
              <div
                key={task.id}
                style={{
                  marginBottom: '20px',
                  padding: '16px',
                  backgroundColor: isProcessed ? '#0a0a0a' : '#111',
                  border: '1px solid #222',
                  borderRadius: '8px',
                  opacity: isProcessed ? 0.5 : 1,
                  transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
                  pointerEvents: isProcessed ? 'none' : 'auto'
                }}
              >
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

                {/* Action Buttons */}
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  flexWrap: 'wrap'
                }}>
                  {/* Rollover to Today */}
                  <button
                    onClick={() => handleAction(task.id, 'rollover')}
                    style={{
                      flex: '1 1 auto',
                      backgroundColor: 'var(--signal)',
                      color: '#000',
                      border: 'none',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      minWidth: '120px'
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

                  {/* Reclassify as Noise */}
                  <button
                    onClick={() => handleAction(task.id, 'noise')}
                    style={{
                      flex: '1 1 auto',
                      backgroundColor: 'transparent',
                      color: '#888',
                      border: '1px solid #333',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 300,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      minWidth: '120px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#555';
                      e.currentTarget.style.color = '#aaa';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#333';
                      e.currentTarget.style.color = '#888';
                    }}
                  >
                    War Noise
                  </button>

                  {/* Archive */}
                  <button
                    onClick={() => handleAction(task.id, 'archive')}
                    style={{
                      flex: '1 1 auto',
                      backgroundColor: 'transparent',
                      color: '#555',
                      border: '1px solid #222',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 100,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      minWidth: '120px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#333';
                      e.currentTarget.style.color = '#666';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#222';
                      e.currentTarget.style.color = '#555';
                    }}
                  >
                    Archivieren
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Skip for Now Button */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            backgroundColor: 'transparent',
            color: '#444',
            border: '1px solid #222',
            padding: '12px 24px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 300,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#333';
            e.currentTarget.style.color = '#666';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#222';
            e.currentTarget.style.color = '#444';
          }}
        >
          Später
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
      `}</style>
    </div>
  );
}
