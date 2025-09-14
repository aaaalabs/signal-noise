import { useState, useRef } from 'react';
import type { Task } from '../types';
import { useTranslation } from '../contexts/LanguageContext';
import { formatTime } from '../i18n/translations';

interface TaskGridProps {
  tasks: Task[];
  onTransfer: (id: number) => void;
  onDelete: (id: number) => void;
}

function TaskItem({ task, onTransfer, onDelete }: { task: Task; onTransfer: (id: number) => void; onDelete: (id: number) => void }) {
  const t = useTranslation();
  const [isPressed, setIsPressed] = useState(false);
  const [deleteProgress, setDeleteProgress] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [isTransferring, setIsTransferring] = useState(false);
  const deleteStartTime = useRef<number>(0);
  const deleteAnimationId = useRef<number | null>(null);
  const hasMilestoneVibrated = useRef(false);
  const tapTimeoutId = useRef<number | null>(null);
  const lastTapTime = useRef<number>(0);

  const formatTaskTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return t.timeJustNow;
    if (minutes < 60) return formatTime('timeMinutesAgo', { n: minutes });
    if (minutes < 1440) return formatTime('timeHoursAgo', { n: Math.floor(minutes / 60) });
    return date.toLocaleDateString();
  };

  const HOLD_DURATION = 2500; // 2.5 seconds to complete deletion

  const startDeleteProgress = () => {
    deleteStartTime.current = performance.now();
    setIsDeleting(true);
    setDeleteProgress(0);
    hasMilestoneVibrated.current = false;

    // Initial vibration feedback
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }

    const updateProgress = () => {
      const elapsed = performance.now() - deleteStartTime.current;
      const progress = Math.min((elapsed / HOLD_DURATION) * 100, 100);

      setDeleteProgress(progress);

      // Milestone vibration at 50%
      if (progress >= 50 && !hasMilestoneVibrated.current) {
        hasMilestoneVibrated.current = true;
        if (navigator.vibrate) {
          navigator.vibrate(5);
        }
      }

      if (progress >= 100) {
        // Deletion complete - strong vibration
        if (navigator.vibrate) {
          navigator.vibrate(20);
        }
        onDelete(task.id);
        resetDeleteState();
      } else {
        deleteAnimationId.current = requestAnimationFrame(updateProgress);
      }
    };

    deleteAnimationId.current = requestAnimationFrame(updateProgress);
  };

  const resetDeleteState = () => {
    if (deleteAnimationId.current) {
      cancelAnimationFrame(deleteAnimationId.current);
      deleteAnimationId.current = null;
    }
    setIsDeleting(false);
    setDeleteProgress(0);
    setIsPressed(false);
    hasMilestoneVibrated.current = false;
  };

  const resetTapState = () => {
    if (tapTimeoutId.current) {
      clearTimeout(tapTimeoutId.current);
      tapTimeoutId.current = null;
    }
    setTapCount(0);
    lastTapTime.current = 0;
  };

  const handleTap = () => {
    const now = performance.now();

    // If more than 1 second since last tap, reset count
    if (now - lastTapTime.current > 1000) {
      setTapCount(1);
    } else {
      setTapCount(prev => prev + 1);
    }

    lastTapTime.current = now;

    // Visual feedback - subtle pulse
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 100);

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(5);
    }

    // Clear existing timeout
    if (tapTimeoutId.current) {
      clearTimeout(tapTimeoutId.current);
    }

    // Check if third tap within window
    if (tapCount >= 2) {
      // Third tap - trigger transfer
      setIsTransferring(true);
      if (navigator.vibrate) {
        navigator.vibrate(15);
      }

      setTimeout(() => {
        onTransfer(task.id);
        setIsTransferring(false);
        resetTapState();
      }, 100);
    } else {
      // Set timeout to reset tap count
      tapTimeoutId.current = window.setTimeout(resetTapState, 1000);
    }
  };

  const handlePressStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsPressed(true);
    startDeleteProgress();
  };

  const handlePressEnd = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();

    if (isDeleting && deleteProgress < 100) {
      // Release before completion - cancel deletion
      resetDeleteState();
    } else if (!isDeleting) {
      // Quick tap - handle triple-tap logic
      setIsPressed(false);
      handleTap();
    }
  };

  const handlePressCancel = () => {
    // Mouse leave or touch cancel - stop deletion
    resetDeleteState();
  };


  return (
    <div
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressCancel}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      onTouchCancel={handlePressCancel}
      className={`task-item ${task.type}-item ${isPressed ? 'pressing' : ''} ${isDeleting ? 'deleting' : ''} ${isTransferring ? 'transferring' : ''}`}
      style={{
        opacity: 1, // Always full opacity - no completed state
        transform: isPressed ? 'scale(0.95)' : 'scale(1)',
        transition: isTransferring ? 'all 0.3s ease-out' : 'transform 0.1s ease',
        cursor: isDeleting ? 'pointer' : 'default',
        position: 'relative',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        ...(isDeleting ? {
          border: '1px solid #ff3b30',
          backgroundColor: 'rgba(255, 59, 48, 0.03)',
          borderRadius: '8px'
        } : isTransferring ? {
          border: '1px solid var(--signal)',
          backgroundColor: 'rgba(0, 255, 136, 0.05)',
          borderRadius: '8px'
        } : {
          border: '1px solid #222'
        }),
        overflow: 'hidden'
      }}
    >
      {/* Smooth progress indicator */}
      {isDeleting && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: `${deleteProgress}%`,
            backgroundColor: 'rgba(255, 59, 48, 0.15)',
            transition: 'none', // Smooth via requestAnimationFrame
            zIndex: 0
          }}
        />
      )}
      <div className="task-text" style={{ position: 'relative', zIndex: 1 }}>{task.text}</div>
      <div className="task-time" style={{ position: 'relative', zIndex: 1 }}>{formatTaskTime(task.timestamp)}</div>
    </div>
  );
}

export default function TaskGrid({ tasks, onTransfer, onDelete }: TaskGridProps) {
  const t = useTranslation();
  const signalTasks = tasks.filter(task => task.type === 'signal');
  const noiseTasks = tasks.filter(task => task.type === 'noise');

  return (
    <>
      <div className="tasks-grid">
        <div className="task-column signal-column">
          <h3>{t.signalsHeader}</h3>
          <div>
            {signalTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onTransfer={onTransfer}
                onDelete={onDelete}
              />
            ))}
            {signalTasks.length === 0 && (
              <div style={{ textAlign: 'center', padding: '32px 0', color: '#666', fontSize: '14px' }}>
                {t.noSignalTasks}
              </div>
            )}
          </div>
        </div>

        <div className="task-column noise-column">
          <h3>{t.noiseHeader}</h3>
          <div>
            {noiseTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onTransfer={onTransfer}
                onDelete={onDelete}
              />
            ))}
            {noiseTasks.length === 0 && (
              <div style={{ textAlign: 'center', padding: '32px 0', color: '#666', fontSize: '14px' }}>
                {t.noNoiseTasks}
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        .task-item.pressing {
          opacity: 0.8;
        }
      `}</style>
    </>
  );
}