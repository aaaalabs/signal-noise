import { useState, useRef, useEffect } from 'react';
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
  const [isRevealed, setIsRevealed] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);

  const ACTIVATION_THRESHOLD = 50;
  const OPEN_HEIGHT = 400;
  const CLOSE_THRESHOLD = -30;
  const ELASTIC_FACTOR = 0.5;

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

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    startYRef.current = touch.clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const touch = e.touches[0];
    const deltaY = touch.clientY - startYRef.current;

    if (!isOpen && deltaY > 0) {
      // Opening gesture
      let distance = deltaY;
      if (distance > ACTIVATION_THRESHOLD) {
        distance = ACTIVATION_THRESHOLD + (distance - ACTIVATION_THRESHOLD) * ELASTIC_FACTOR;
      }
      distance = Math.min(distance, OPEN_HEIGHT);
      setPullDistance(distance);

      if (distance > ACTIVATION_THRESHOLD && !isRevealed) {
        if (navigator.vibrate) {
          navigator.vibrate(5);
        }
        setIsRevealed(true);
      }
    } else if (isOpen && deltaY < 0) {
      // Closing gesture when open
      const currentHeight = OPEN_HEIGHT + deltaY;
      setPullDistance(Math.max(40, currentHeight));
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);

    if (!isOpen) {
      // Opening logic
      if (pullDistance > ACTIVATION_THRESHOLD) {
        setPullDistance(OPEN_HEIGHT);
        setIsOpen(true);
        setIsRevealed(true);
      } else {
        setPullDistance(0);
        setIsRevealed(false);
      }
    } else {
      // Closing logic when already open
      const deltaY = pullDistance - OPEN_HEIGHT;
      if (deltaY < CLOSE_THRESHOLD) {
        setPullDistance(0);
        setIsOpen(false);
        setIsRevealed(false);
      } else {
        setPullDistance(OPEN_HEIGHT);
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    startYRef.current = e.clientY;
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const deltaY = e.clientY - startYRef.current;

    if (!isOpen && deltaY > 0) {
      // Opening gesture
      let distance = deltaY;
      if (distance > ACTIVATION_THRESHOLD) {
        distance = ACTIVATION_THRESHOLD + (distance - ACTIVATION_THRESHOLD) * ELASTIC_FACTOR;
      }
      distance = Math.min(distance, OPEN_HEIGHT);
      setPullDistance(distance);

      if (distance > ACTIVATION_THRESHOLD && !isRevealed) {
        setIsRevealed(true);
      }
    } else if (isOpen && deltaY < 0) {
      // Closing gesture when open
      const currentHeight = OPEN_HEIGHT + deltaY;
      setPullDistance(Math.max(40, currentHeight));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);

    if (!isOpen) {
      // Opening logic
      if (pullDistance > ACTIVATION_THRESHOLD) {
        setPullDistance(OPEN_HEIGHT);
        setIsOpen(true);
        setIsRevealed(true);
      } else {
        setPullDistance(0);
        setIsRevealed(false);
      }
    } else {
      // Closing logic when already open
      const deltaY = pullDistance - OPEN_HEIGHT;
      if (deltaY < CLOSE_THRESHOLD) {
        setPullDistance(0);
        setIsOpen(false);
        setIsRevealed(false);
      } else {
        setPullDistance(OPEN_HEIGHT);
      }
    }
  };

  const handleClose = () => {
    setPullDistance(0);
    setIsRevealed(false);
    setIsOpen(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  const historicalTasks = getHistoricalTasks();
  const groupedTasks: { [key: string]: HistoricalTask[] } = {};

  historicalTasks.forEach(task => {
    if (!groupedTasks[task.dateLabel]) {
      groupedTasks[task.dateLabel] = [];
    }
    groupedTasks[task.dateLabel].push(task);
  });

  const opacity = isOpen ? 0.3 : Math.min(pullDistance / ACTIVATION_THRESHOLD, 1);
  const contentOpacity = isRevealed ? 1 : 0;

  return (
    <div
      ref={containerRef}
      className="temporal-fold"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      style={{
        height: isOpen && !isDragging ? `${OPEN_HEIGHT}px` : `${Math.max(40, pullDistance)}px`,
        transition: isDragging ? 'none' : 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      <div className="fold-handle" style={{ opacity: opacity * 0.3 }} />

      <div
        className="fold-content"
        style={{
          opacity: contentOpacity,
          transform: `translateY(${isRevealed ? 0 : -20}px)`,
          transition: isDragging ? 'none' : 'all 0.4s ease-out',
          height: isOpen && !isDragging ? `${OPEN_HEIGHT - 40}px` : `${Math.max(0, pullDistance - 40)}px`,
          overflow: 'auto'
        }}
      >
        {isRevealed && (
          <>
            <div className="fold-header">
              <h3>{t.historicalTasks || 'Historical Tasks'}</h3>
              <button className="fold-close" onClick={handleClose}>×</button>
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