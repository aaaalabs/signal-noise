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

  // Check if task is locked (30+ minutes old)
  const isTaskLocked = (timestamp: string): boolean => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    return diffMinutes >= 30;
  };

  const formatTaskTime = (timestamp: string): { text: string; isLocked: boolean } => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const locked = minutes >= 30;

    let timeText: string;
    if (minutes < 1) timeText = t.timeJustNow;
    else if (minutes < 60) timeText = formatTime('timeMinutesAgo', { n: minutes });
    else if (minutes < 1440) timeText = formatTime('timeHoursAgo', { n: Math.floor(minutes / 60) });
    else timeText = date.toLocaleDateString();

    return { text: timeText, isLocked: locked };
  };

  const HOLD_DURATION = 2500; // 2.5 seconds to complete deletion
  const taskLocked = isTaskLocked(task.timestamp);

  const startDeleteProgress = () => {
    // Don't allow deletion if task is locked
    if (taskLocked) {
      // Vibrate to indicate locked
      if (navigator.vibrate) {
        navigator.vibrate([50, 30, 50]); // Double vibrate pattern
      }
      return;
    }
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
      // Second tap - trigger completion toggle immediately
      // Hide tap feedback before triggering to prevent flash
      setShowTapFeedback(false);
      setTapCount(0);
      // Small delay for animation to start hiding
      setTimeout(() => {
        onToggleComplete(task.id);
        resetTapState();
      }, 50);
    } else {
      // Set timeout to reset tap count
      tapTimeoutId.current = window.setTimeout(resetTapState, 1000);
    }
  };

  const handlePressStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();

    // For locked tasks, only allow completion toggle on double tap
    if (taskLocked) {
      // Don't start deletion or swipe for locked tasks
      setIsPressed(true);
      return;
    }

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

    // Desktop: Only allow swipes toward the destination
    if (!isMobile) {
      const isValidDirection =
        (task.type === 'signal' && deltaX > 0) ||  // Signal → right only
        (task.type === 'noise' && deltaX < 0);      // Noise → left only

      if (!isValidDirection) return; // Ignore wrong direction swipes
    }

    // Start dragging mode if moved more than 10px horizontally (unless locked)
    if (absDeltaX > 10 && !isDragging.current && !taskLocked) {
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
    const isValidSwipe = isMobile ||
      (task.type === 'signal' && swipeOffset > 0) ||
      (task.type === 'noise' && swipeOffset < 0);

    if (isDragging.current && Math.abs(swipeOffset) > 50 && isValidSwipe && !taskLocked) {
      // Swipe completed - trigger transfer (unless locked)
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
          className="completion-indicator"
          style={{
            position: 'absolute',
            top: '50%',
            right: '12px',
            transform: 'translateY(-50%)',
            fontSize: '18px',
            color: task.completed ? '#666' : 'var(--signal)',
            fontWeight: 600,
            zIndex: 2,
            animation: 'elegantFadeCheck 0.6s ease-out forwards'
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
            top: isMobile ? '50%' : '50%', // Centered across both text elements on mobile
            // Mobile: Always left, Desktop: Based on swipe direction
            left: isMobile ? '12px' : (swipeOffset < 0 ? '12px' : 'auto'),
            right: isMobile ? 'auto' : (swipeOffset > 0 ? '12px' : 'auto'),
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
            {/* Mobile: SVG arrows based on task type */}
            {task.type === 'noise' ? (
              // Up arrow in green for noise → signal with subtle upward drift
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--signal)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  animation: 'subtleUpward 2s ease-in-out infinite'
                }}
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M12 5l0 14" />
                <path d="M18 11l-6 -6" />
                <path d="M6 11l6 -6" />
              </svg>
            ) : (
              // Down arrow in grey for signal → noise with subtle downward drift
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#666"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  animation: 'subtleDownward 2s ease-in-out infinite'
                }}
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M12 5l0 14" />
                <path d="M18 13l-6 6" />
                <path d="M6 13l6 6" />
              </svg>
            )}
          </span>
        </div>
      )}

      <div
        className="task-text"
        style={{
          position: 'relative',
          zIndex: 1,
          // Progressive push animation on mobile
          paddingLeft: isMobile && isSwipingData && Math.abs(swipeOffset) > 20
            ? `${Math.min(32, Math.abs(swipeOffset) * 0.8)}px`
            : undefined,
          transition: 'padding 0.1s ease'
        }}
      >
        {task.text}
      </div>
      <div
        className="task-time"
        style={{
          position: 'relative',
          zIndex: 1,
          // Progressive push animation on mobile
          paddingLeft: isMobile && isSwipingData && Math.abs(swipeOffset) > 20
            ? `${Math.min(32, Math.abs(swipeOffset) * 0.8)}px`
            : undefined,
          transition: 'padding 0.1s ease',
          color: formatTaskTime(task.timestamp).isLocked ? '#666' : '#00ff88',
          opacity: formatTaskTime(task.timestamp).isLocked ? 0.8 : 0.9,
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}
      >
        {formatTaskTime(task.timestamp).text}
        {formatTaskTime(task.timestamp).isLocked && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#666"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ opacity: 0.7, marginLeft: '2px' }}
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6z" />
            <path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
            <path d="M8 11v-4a4 4 0 1 1 8 0v4" />
          </svg>
        )}
      </div>
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

        @keyframes elegantFadeCheck {
          0% {
            opacity: 0;
            transform: translateY(-50%) scale(0.6);
          }
          40% {
            opacity: 1;
            transform: translateY(-50%) scale(1.1);
          }
          60% {
            opacity: 1;
            transform: translateY(-50%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-50%) scale(0.9);
          }
        }

        /* Subtle directional drift animations - Jony Ive inspired */
        @keyframes subtleUpward {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-3px);
          }
        }

        @keyframes subtleDownward {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(3px);
          }
        }
      `}</style>
    </>
  );
}