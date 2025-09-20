import { useState, useRef, useEffect } from 'react';
import type { Task } from '../types';
import { useTranslation } from '../contexts/LanguageContext';
import { formatTime } from '../i18n/translations';

interface TaskGridProps {
  tasks: Task[];
  onTransfer: (id: number) => void;
  onDelete: (id: number) => void;
  onToggleComplete: (id: number) => void;
}

function TaskItem({ task, onTransfer, onDelete, onToggleComplete }: { task: Task; onTransfer: (id: number) => void; onDelete: (id: number) => void; onToggleComplete: (id: number) => void }) {
  const t = useTranslation();
  const [isPressed, setIsPressed] = useState(false);
  const [deleteProgress, setDeleteProgress] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [isTransferring, setIsTransferring] = useState(false);
  const [showTapFeedback, setShowTapFeedback] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwipingData, setIsSwipingData] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const deleteStartTime = useRef<number>(0);
  const deleteAnimationId = useRef<number | null>(null);
  const hasMilestoneVibrated = useRef(false);
  const tapTimeoutId = useRef<number | null>(null);
  const lastTapTime = useRef<number>(0);
  const currentPressId = useRef<number>(0);
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const isDragging = useRef<boolean>(false);

  // Viewport detection for responsive swipe behavior
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 600);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
    setShowTapFeedback(false);
    lastTapTime.current = 0;
  };

  const handleTap = () => {
    const now = performance.now();

    // Calculate current tap count
    const currentTapCount = now - lastTapTime.current > 1000 ? 1 : tapCount + 1;

    // Update state
    setTapCount(currentTapCount);
    setShowTapFeedback(currentTapCount > 0);
    lastTapTime.current = now;

    // Visual feedback - progressive pulse in destination category color
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), currentTapCount === 1 ? 150 : currentTapCount === 2 ? 200 : 300);

    // Progressive haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(currentTapCount === 1 ? 5 : currentTapCount === 2 ? 8 : 15);
    }

    // Clear existing timeout
    if (tapTimeoutId.current) {
      clearTimeout(tapTimeoutId.current);
    }

    // Handle double tap for completion
    if (currentTapCount === 2) {
      // Second tap - trigger completion toggle
      setTimeout(() => {
        onToggleComplete(task.id);
        resetTapState();
      }, 100);
    } else {
      // Set timeout to reset tap count
      tapTimeoutId.current = window.setTimeout(resetTapState, 1000);
    }
  };

  const handlePressStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();

    // Record touch start position for swipe detection
    if (e.type === 'touchstart') {
      const touch = (e as React.TouchEvent).touches[0];
      touchStartX.current = touch.clientX;
      touchStartY.current = touch.clientY;
    } else {
      const mouse = e as React.MouseEvent;
      touchStartX.current = mouse.clientX;
      touchStartY.current = mouse.clientY;
    }

    isDragging.current = false;
    setSwipeOffset(0);
    setIsSwipingData(false);

    // Generate unique ID for this specific press
    const pressId = Date.now();
    currentPressId.current = pressId;
    setIsPressed(true);

    // Delay deletion start to allow quick taps to escape
    setTimeout(() => {
      // Only start deletion if THIS SPECIFIC press is still active and not swiping
      if (currentPressId.current === pressId && !isDeleting && !isTransferring && !isDragging.current) {
        startDeleteProgress();
      }
    }, 150); // 150ms delay before deletion mode starts
  };

  const handleSwipeMove = (e: React.TouchEvent | React.MouseEvent) => {
    // Only handle swipe if we have a valid press start and are actually pressed/touching
    if (!touchStartX.current || currentPressId.current === 0) return;

    let currentX: number;
    if (e.type === 'touchmove') {
      const touches = (e as React.TouchEvent).touches;
      if (touches.length === 0) return;
      currentX = touches[0].clientX;
    } else {
      // For mouse events, only process if mouse button is down
      if ((e as React.MouseEvent).buttons === 0) return;
      currentX = (e as React.MouseEvent).clientX;
    }

    const deltaX = currentX - touchStartX.current;
    const absDeltaX = Math.abs(deltaX);

    // Start dragging mode if moved more than 10px horizontally
    if (absDeltaX > 10 && !isDragging.current) {
      isDragging.current = true;
      setIsSwipingData(true);

      // Cancel deletion if we start swiping
      if (isDeleting) {
        resetDeleteState();
      }
    }

    if (isDragging.current) {
      // Update swipe offset with some resistance
      const resistance = Math.min(absDeltaX / 100, 1);
      setSwipeOffset(deltaX * resistance);
    }
  };

  const handlePressEnd = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();

    // Clear the current press ID to prevent late deletion triggers
    currentPressId.current = 0;

    // Handle swipe completion
    if (isDragging.current && Math.abs(swipeOffset) > 50) {
      // Swipe completed - trigger transfer
      setIsTransferring(true);

      setTimeout(() => {
        onTransfer(task.id);
        setIsTransferring(false);
        setSwipeOffset(0);
        setIsSwipingData(false);
        isDragging.current = false;
      }, 100);
    } else if (isDragging.current) {
      // Swipe cancelled - reset
      setSwipeOffset(0);
      setIsSwipingData(false);
      isDragging.current = false;
      setIsPressed(false);
    } else if (isDeleting && deleteProgress < 100) {
      // Release before completion - cancel deletion
      resetDeleteState();
    } else if (!isDeleting && !isTransferring) {
      // Quick tap - handle tap logic
      setIsPressed(false);
      handleTap();
    } else {
      // Just reset pressed state if transferring
      setIsPressed(false);
    }
  };

  const handlePressCancel = () => {
    // Clear the current press ID to prevent late deletion triggers
    currentPressId.current = 0;
    // Reset all states
    resetDeleteState();
    setSwipeOffset(0);
    setIsSwipingData(false);
    isDragging.current = false;
  };


  return (
    <div
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseMove={handleSwipeMove}
      onMouseLeave={handlePressCancel}
      onTouchStart={handlePressStart}
      onTouchMove={handleSwipeMove}
      onTouchEnd={handlePressEnd}
      onTouchCancel={handlePressCancel}
      className={`task-item ${task.type}-item ${task.completed ? 'completed' : ''} ${isPressed ? 'pressing' : ''} ${isDeleting ? 'deleting' : ''} ${isTransferring ? 'transferring' : ''} ${isSwipingData ? 'swiping' : ''}`}
      style={{
        opacity: task.completed ? 0.6 : 1, // Fade completed tasks
        transform: isSwipingData
          ? isMobile
            ? 'scale(0.98)' // Mobile: just scale, no horizontal movement
            : `translateX(${swipeOffset}px) scale(0.98)` // Desktop: slide horizontally
          : isPressed
          ? `scale(${tapCount === 1 ? 0.98 : tapCount === 2 ? 1.02 : 1.05})`
          : 'scale(1)',
        transition: isTransferring ? 'all 0.3s ease-out' : 'all 0.3s ease',
        cursor: isDeleting ? 'pointer' : 'default',
        position: 'relative',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        ...(isDeleting ? {
          border: '1px solid #ff3b30',
          backgroundColor: 'rgba(255, 59, 48, 0.03)',
          borderRadius: '8px'
        } : isTransferring ? {
          border: `2px solid ${task.type === 'signal' ? 'var(--noise)' : 'var(--signal)'}`,
          backgroundColor: task.type === 'signal'
            ? 'rgba(255, 159, 10, 0.08)'
            : 'rgba(0, 255, 136, 0.08)',
          borderRadius: '8px'
        } : showTapFeedback ? {
          border: `${tapCount === 1 ? '1px' : '2px'} solid ${task.type === 'signal' ? 'var(--noise)' : 'var(--signal)'}`,
          backgroundColor: task.type === 'signal'
            ? `rgba(102, 102, 102, ${tapCount === 1 ? 0.03 : 0.06})`
            : `rgba(0, 255, 136, ${tapCount === 1 ? 0.03 : 0.06})`,
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

      {/* Completion indicator - appears on second tap */}
      {showTapFeedback && tapCount === 2 && !isSwipingData && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            right: '12px',
            transform: 'translateY(-50%)',
            fontSize: '18px',
            color: task.completed ? '#666' : 'var(--signal)',
            fontWeight: 600,
            zIndex: 2,
            animation: 'pulseArrow 0.2s ease-out'
          }}
        >
          {task.completed ? '↺' : '✓'}
        </div>
      )}

      {/* Swipe direction indicator - appears during swipe */}
      {isSwipingData && Math.abs(swipeOffset) > 20 && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            right: swipeOffset > 0 ? '12px' : 'auto',
            left: swipeOffset < 0 ? '12px' : 'auto',
            transform: 'translateY(-50%)',
            fontSize: '20px',
            color: task.type === 'signal' ? 'var(--noise)' : 'var(--signal)',
            fontWeight: 600,
            zIndex: 2,
            opacity: Math.min(Math.abs(swipeOffset) / 50, 1)
          }}
        >
          <span className="arrow-desktop">
            {swipeOffset > 0 ? '→' : '←'}
          </span>
          <span className="arrow-mobile">
            {task.type === 'signal' ? (swipeOffset > 0 ? '↓' : '↑') : (swipeOffset > 0 ? '↑' : '↓')}
          </span>
        </div>
      )}

      <div className="task-text" style={{ position: 'relative', zIndex: 1 }}>{task.text}</div>
      <div className="task-time" style={{ position: 'relative', zIndex: 1 }}>{formatTaskTime(task.timestamp)}</div>
    </div>
  );
}

export default function TaskGrid({ tasks, onTransfer, onDelete, onToggleComplete }: TaskGridProps) {
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
                onToggleComplete={onToggleComplete}
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
                onToggleComplete={onToggleComplete}
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
          opacity: 0.9;
        }

        /* Desktop arrows (horizontal) */
        .arrow-desktop {
          display: inline;
        }
        .arrow-mobile {
          display: none;
        }

        /* Mobile arrows (vertical) */
        @media (max-width: 600px) {
          .arrow-desktop {
            display: none;
          }
          .arrow-mobile {
            display: inline;
          }
        }

        @keyframes pulseArrow {
          0% {
            opacity: 0;
            transform: translateY(-50%) scale(0.8);
          }
          50% {
            opacity: 1;
            transform: translateY(-50%) scale(1.1);
          }
          100% {
            opacity: 1;
            transform: translateY(-50%) scale(1);
          }
        }
      `}</style>
    </>
  );
}