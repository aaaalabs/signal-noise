import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import type { Task, DayRatio } from '../types';
import { useTranslation } from '../contexts/LanguageContext';
import PatternInsights from './PatternInsights';

interface AnalyticsProps {
  tasks: Task[];
  history: DayRatio[];
}

export default function Analytics({ tasks }: AnalyticsProps) {
  const t = useTranslation();
  const [isExpanded, setIsExpanded] = useState(() => {
    const stored = localStorage.getItem('analytics_expanded');
    return stored !== 'false'; // Default to expanded
  });
  const [isAnimating, setIsAnimating] = useState(false);

  // Persist expansion preference
  useEffect(() => {
    localStorage.setItem('analytics_expanded', String(isExpanded));
  }, [isExpanded]);

  const calculateDailyRatios = (): number[] => {
    const ratios: number[] = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayTasks = tasks.filter(task =>
        new Date(task.timestamp).toDateString() === date.toDateString()
      );

      if (dayTasks.length > 0) {
        const signals = dayTasks.filter(task => task.type === 'signal').length;
        ratios.push(Math.round((signals / dayTasks.length) * 100));
      } else {
        ratios.push(0);
      }
    }
    return ratios;
  };

  const calculateStreak = (): number => {
    let streak = 0;
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dayTasks = tasks.filter(task =>
        new Date(task.timestamp).toDateString() === date.toDateString()
      );

      if (dayTasks.length > 0) {
        const signals = dayTasks.filter(task => task.type === 'signal').length;
        const ratio = (signals / dayTasks.length) * 100;
        if (ratio >= 80) {
          streak++;
        } else {
          break;
        }
      } else if (i === 0) {
        // Today has no tasks yet, continue streak
        continue;
      } else {
        break;
      }
    }
    return streak;
  };

  const dailyRatios = useMemo(() => calculateDailyRatios(), [tasks]);
  const avgRatio = dailyRatios.length > 0
    ? Math.round(dailyRatios.reduce((a, b) => a + b, 0) / dailyRatios.length)
    : 0;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentTasks = tasks.filter(task =>
    new Date(task.timestamp) > thirtyDaysAgo
  );

  const handleToggle = () => {
    if (isAnimating) return; // Prevent interruption
    setIsAnimating(true);
    setIsExpanded(!isExpanded);

    // Reset animation lock after animation completes
    setTimeout(() => setIsAnimating(false), 600);
  };

  // Don't render if no data
  if (dailyRatios.every(ratio => ratio === 0)) {
    return null;
  }

  return (
    <LayoutGroup>
      <motion.div
        className={`analytics ${isExpanded ? '' : 'analytics-minimal'}`}
        initial={false}
        animate={{
          height: isExpanded ? 'auto' : '60px',
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          duration: 0.6
        }}
        onClick={!isExpanded ? handleToggle : undefined}
        style={{
          cursor: !isExpanded ? 'pointer' : 'default',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <>
              {/* Expanded View - Full Analytics */}
              <motion.div
                key="expanded-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h2>{t.analyticsTitle}</h2>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleToggle}
                    style={{
                      background: 'transparent',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      fontSize: '11px',
                      color: 'rgba(255, 255, 255, 0.4)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.2)';
                      (e.target as HTMLElement).style.color = 'rgba(255, 255, 255, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      (e.target as HTMLElement).style.color = 'rgba(255, 255, 255, 0.4)';
                    }}
                  >
                    minimize
                  </motion.button>
                </div>

                <div className="stat-grid">
                  <div className="stat">
                    <div className="stat-value">
                      {avgRatio > 0 ? `${avgRatio}%` : '—'}
                    </div>
                    <div className="stat-label">{t.avgRatio}</div>
                  </div>
                  <div className="stat">
                    <div className="stat-value">{recentTasks.length}</div>
                    <div className="stat-label">{t.tasksTotal}</div>
                  </div>
                  <div className="stat">
                    <div className="stat-value">{calculateStreak()}</div>
                    <div className="stat-label">{t.dayStreak}</div>
                  </div>
                </div>
              </motion.div>

              {/* Chart Container - Expanded */}
              <motion.div
                className="history-chart"
                style={{ position: 'relative' }}
              >
                {dailyRatios.map((ratio, index) => (
                  <motion.div
                    key={index}
                    layoutId={`bar-${index}`}
                    className={`history-bar ${ratio >= 80 ? '' : ratio >= 60 ? 'medium' : ratio > 0 ? 'low' : ''}`}
                    initial={false}
                    animate={{
                      height: `${Math.max(4, ratio)}%`,
                    }}
                    transition={{
                      layout: {
                        type: "spring",
                        stiffness: 300,
                        damping: 30
                      }
                    }}
                    title={`Day ${index - 29}: ${ratio}%`}
                  />
                ))}
              </motion.div>

              {/* Pattern Insights - Only in expanded view */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <PatternInsights tasks={tasks} />
              </motion.div>
            </>
          ) : (
            <>
              {/* Collapsed View - Minimal Chart */}
              <motion.div
                key="collapsed-content"
                className="history-chart-minimal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                style={{
                  height: '60px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px',
                  padding: '10px 20px',
                  position: 'relative'
                }}
              >
                {/* Bars in minimal mode */}
                {dailyRatios.map((ratio, index) => {
                  const color = ratio >= 80 ? 'var(--signal)' :
                               ratio >= 60 ? '#ffaa00' :
                               ratio > 0 ? 'rgba(255, 68, 68, 0.6)' :
                               'rgba(255, 255, 255, 0.05)';

                  return (
                    <motion.div
                      key={index}
                      layoutId={`bar-${index}`}
                      className="mini-bar"
                      initial={false}
                      animate={{
                        height: `${Math.max(10, Math.min(40, ratio * 0.4))}px`,
                        backgroundColor: color,
                      }}
                      transition={{
                        layout: {
                          type: "spring",
                          stiffness: 300,
                          damping: 30
                        },
                        backgroundColor: {
                          duration: 0.3
                        }
                      }}
                      style={{
                        flex: 1,
                        minWidth: '2px',
                        borderRadius: '1px',
                      }}
                    />
                  );
                })}

                {/* Subtle pulse hint */}
                <motion.div
                  className="expand-hint"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.2, 0.4, 0.2] }}
                  transition={{
                    repeat: Infinity,
                    duration: 4,
                    ease: "easeInOut"
                  }}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '10px',
                    color: 'var(--signal)',
                    pointerEvents: 'none'
                  }}
                >
                  ⋯
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </LayoutGroup>
  );
}