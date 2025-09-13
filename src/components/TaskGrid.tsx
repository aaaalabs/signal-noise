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
    if (showDelete) {
      handleDelete();
    } else {
      onToggle(task.id);
    }
    setShowDelete(false);
  };

  const handlePressCancel = () => {
    setIsPressed(false);
    setShowDelete(false);
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  const handleDelete = () => {
    onDelete(task.id);
  };

  return (
    <div
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressCancel}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      onTouchCancel={handlePressCancel}
      className={`task-item ${task.type}-item ${task.completed ? 'completed' : ''} ${isPressed ? 'pressing' : ''} ${showDelete ? 'delete-mode' : ''}`}
      style={{
        opacity: task.completed ? 0.3 : 1,
        transform: isPressed ? 'scale(0.98)' : 'scale(1)',
        transition: 'all 0.2s ease',
        cursor: showDelete ? 'pointer' : 'default',
        position: 'relative',
        userSelect: 'none',
        WebkitUserSelect: 'none'
      }}
    >
      <div className="task-text">{task.text}</div>
      <div className="task-time">{formatTaskTime(task.timestamp)}</div>
      {showDelete && (
        <div
          className="delete-indicator"
          style={{
            position: 'absolute',
            right: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#ff3b30',
            fontSize: '18px',
            fontWeight: 'bold',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          ×
        </div>
      )}
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

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-50%) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translateY(-50%) scale(1);
          }
        }
      `}</style>
    </>
  );
}