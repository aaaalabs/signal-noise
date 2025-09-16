import { useState, useRef } from 'react';
import type { Task } from '../types';
import { useTranslation } from '../contexts/LanguageContext';

interface TemporalFoldProps {
  tasks: Task[];
}

interface HistoricalTask extends Task {
  daysAgo: number;
  dateLabel: string;
}

export default function TemporalFold({ tasks }: TemporalFoldProps) {
  const t = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const CLOSED_HEIGHT = 40;
  const OPEN_HEIGHT = 400;

  const getHistoricalTasks = (): HistoricalTask[] => {
    const now = new Date();
    const historicalTasks: HistoricalTask[] = [];

    tasks.forEach(task => {
      const taskDate = new Date(task.timestamp);
      const daysDiff = Math.floor((now.getTime() - taskDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff > 0 && daysDiff <= 30) {
        let dateLabel = '';
        if (daysDiff === 1) {
          dateLabel = t.yesterday || 'Yesterday';
        } else if (daysDiff <= 7) {
          dateLabel = `${daysDiff} ${t.daysAgo || 'days ago'}`;
        } else {
          dateLabel = taskDate.toLocaleDateString();
        }

        historicalTasks.push({
          ...task,
          daysAgo: daysDiff,
          dateLabel
        });
      }
    });

    return historicalTasks.sort((a, b) => b.daysAgo - a.daysAgo);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    // Optional haptic feedback on mobile
    if (navigator.vibrate) {
      navigator.vibrate(5);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const historicalTasks = getHistoricalTasks();
  const groupedTasks: { [key: string]: HistoricalTask[] } = {};

  historicalTasks.forEach(task => {
    if (!groupedTasks[task.dateLabel]) {
      groupedTasks[task.dateLabel] = [];
    }
    groupedTasks[task.dateLabel].push(task);
  });

  return (
    <div
      ref={containerRef}
      className="temporal-fold"
      onClick={handleToggle}
      style={{
        height: isOpen ? `${OPEN_HEIGHT}px` : `${CLOSED_HEIGHT}px`,
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer'
      }}
    >
      <div
        className="fold-handle"
        style={{
          opacity: isOpen ? 0.1 : 0.3,
          transition: 'opacity 0.3s ease'
        }}
      />

      <div
        className="fold-content"
        style={{
          opacity: isOpen ? 1 : 0,
          transform: `translateY(${isOpen ? 0 : -20}px)`,
          transition: 'all 0.4s ease-out',
          height: isOpen ? `${OPEN_HEIGHT - CLOSED_HEIGHT}px` : '0px',
          overflow: 'auto'
        }}
      >
        {isOpen && (
          <>
            <div className="fold-header">
              <h3>{t.historicalTasks || 'Historical Tasks'}</h3>
              <button
                className="fold-close"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClose();
                }}
              >
                ×
              </button>
            </div>

            <div className="fold-tasks">
              {Object.entries(groupedTasks).map(([date, dateTasks]) => (
                <div key={date} className="fold-date-group">
                  <div className="fold-date-label">{date}</div>
                  <div className="fold-task-list">
                    {dateTasks.map(task => (
                      <div
                        key={task.id}
                        className={`fold-task ${task.type}`}
                      >
                        <span className="fold-task-text">{task.text}</span>
                        <span className={`fold-task-type ${task.type}`}>
                          {task.type === 'signal' ? 'S' : 'N'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {historicalTasks.length === 0 && (
                <div className="fold-empty">
                  {t.noHistoricalTasks || 'No historical tasks yet'}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}