import { useState } from 'react';
import type { Task } from '../types';
import { useTranslation } from '../contexts/LanguageContext';
import { formatTime } from '../i18n/translations';

interface TaskGridProps {
  tasks: Task[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

function TaskItem({ task, onToggle, onDelete }: { task: Task; onToggle: (id: number) => void; onDelete: (id: number) => void }) {
  const t = useTranslation();
  const [isPressed, setIsPressed] = useState(false);
  const [pressTimer, setPressTimer] = useState<number | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteCountdown, setDeleteCountdown] = useState<number | null>(null);
  const [countdownTimer, setCountdownTimer] = useState<number | null>(null);

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

  const handlePressStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsPressed(true);
    const timer = setTimeout(() => {
      setShowDelete(true);
    }, 700);
    setPressTimer(timer);
  };

  const handlePressEnd = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsPressed(false);
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
    if (showDelete && !deleteCountdown) {
      // Start 3-second countdown
      startDeleteCountdown();
    } else if (deleteCountdown) {
      // Cancel deletion if countdown is active
      cancelDeleteCountdown();
    } else {
      onToggle(task.id);
    }
  };

  const handlePressCancel = () => {
    setIsPressed(false);
    setShowDelete(false);
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
    cancelDeleteCountdown();
  };

  const startDeleteCountdown = () => {
    setDeleteCountdown(3);
    const timer = setInterval(() => {
      setDeleteCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          setCountdownTimer(null);
          // Execute deletion
          onDelete(task.id);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    setCountdownTimer(timer);
  };

  const cancelDeleteCountdown = () => {
    if (countdownTimer) {
      clearInterval(countdownTimer);
      setCountdownTimer(null);
    }
    setDeleteCountdown(null);
    setShowDelete(false);
  };


  return (
    <div
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressCancel}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      onTouchCancel={handlePressCancel}
      className={`task-item ${task.type}-item ${task.completed ? 'completed' : ''} ${isPressed ? 'pressing' : ''} ${showDelete ? 'delete-mode' : ''} ${deleteCountdown ? 'countdown-active' : ''}`}
      style={{
        opacity: task.completed ? 0.3 : 1,
        transform: isPressed ? 'scale(0.98)' : 'scale(1)',
        transition: 'all 0.2s ease',
        cursor: showDelete || deleteCountdown ? 'pointer' : 'default',
        position: 'relative',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        ...(showDelete || deleteCountdown ? {
          border: '2px solid #ff3b30',
          backgroundColor: 'rgba(255, 59, 48, 0.05)',
          borderRadius: '8px'
        } : {}),
        overflow: 'hidden'
      }}
    >
      {/* Visual countdown indicator */}
      {deleteCountdown && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            height: '100%',
            width: `${((4 - deleteCountdown) / 3) * 100}%`,
            backgroundColor: 'rgba(255, 59, 48, 0.2)',
            transition: 'width 1s linear',
            zIndex: 0
          }}
        />
      )}
      <div className="task-text" style={{ position: 'relative', zIndex: 1 }}>{task.text}</div>
      <div className="task-time" style={{ position: 'relative', zIndex: 1 }}>{formatTaskTime(task.timestamp)}</div>
    </div>
  );
}

export default function TaskGrid({ tasks, onToggle, onDelete }: TaskGridProps) {
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
                onToggle={onToggle}
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
                onToggle={onToggle}
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