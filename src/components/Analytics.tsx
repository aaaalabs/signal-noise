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
  const activeDays = dailyRatios.filter(ratio => ratio > 0);
  const avgRatio = activeDays.length > 0
    ? Math.round(activeDays.reduce((a, b) => a + b, 0) / activeDays.length)
    : 0;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentTasks = tasks.filter(task =>
    new Date(task.timestamp) > thirtyDaysAgo
  );

  // Fixed heights for predictable animations (Jony Ive approved)
  const HEIGHTS = {
    collapsed: 64,
    expanded: 340  // Same height for both mobile and desktop now
  };

  const expandedHeight = HEIGHTS.expanded;

  const handleToggle = () => {
    if (isAnimating) return; // Prevent interruption
    setIsAnimating(true);
    setIsExpanded(prev => !prev);

    // Reset animation lock after animation completes
    setTimeout(() => setIsAnimating(false), 1000); // Precisely timed for spring physics
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
          height: isExpanded ? expandedHeight : HEIGHTS.collapsed,
        }}
        transition={{
          type: "spring",
          stiffness: 40,     // Soft like pressing quality aluminum
          damping: 25,       // Higher damping for controlled motion
          mass: 2.0,         // Heavier for deliberate, weighted feel
          restDelta: 0.01   // Precision without over-optimization
        }}
        onClick={handleToggle}
        style={{
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          padding: isExpanded ? '30px 24px 24px 24px' : '0',
          background: 'var(--surface)',
          borderRadius: isExpanded ? '16px' : '12px',
          border: isExpanded ? '1px solid #222' : '1px solid rgba(255, 255, 255, 0.05)',
          transition: 'padding 0.8s cubic-bezier(0.2, 0, 0.1, 1.3), border-color 0.8s ease, border-radius 0.8s cubic-bezier(0.2, 0, 0.1, 1.3)',
          boxSizing: 'border-box'
        }}
      >
        {/* Content that fades in/out - render first when expanded */}
        {isExpanded && (
          <AnimatePresence>
            <motion.div
              key="expanded-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              style={{ position: 'relative', zIndex: 2 }}
            >
              <h2 style={{ userSelect: 'none' }}>
                {t.analyticsTitle}
              </h2>

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

            {/* Pattern Insights - Only in expanded view */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              style={{ position: 'relative', zIndex: 2 }}
            >
              <PatternInsights tasks={tasks} />
            </motion.div>
          </AnimatePresence>
        )}

        {/* Bars always rendered - at bottom when expanded */}
        <motion.div
          className={isExpanded ? "history-chart" : "history-chart-minimal"}
          initial={false}
          animate={{
            height: isExpanded ? 80 : 40,  // Reduced expanded height for tighter layout
            opacity: 1
          }}
          transition={{
            type: "spring",
            stiffness: 40,
            damping: 25,
            mass: 1.8,
            restDelta: 0.01
          }}
          style={{
            position: isExpanded ? 'absolute' : 'absolute',
            bottom: isExpanded ? '40px' : 'auto',
            top: isExpanded ? 'auto' : '50%',
            left: isExpanded ? '24px' : '0',
            right: isExpanded ? '24px' : '0',
            transform: isExpanded ? 'none' : 'translateY(-50%)',
            display: 'flex',
            alignItems: 'flex-end',
            gap: '2px',
            padding: isExpanded ? '0' : '0 10px',
            boxSizing: 'border-box'
          }}
        >
          {dailyRatios.map((ratio, index) => {
            // Determine if this is a future day (no data possible yet)
            const dayOffset = 29 - index;
            const targetDate = new Date();
            targetDate.setDate(targetDate.getDate() - dayOffset);
            const isFutureDay = targetDate > new Date();

            // Use full opacity colors - ALL empty days get signal color when expanded
            const color = ratio >= 80 ? 'var(--signal)' :
                         ratio >= 60 ? '#ffaa00' :
                         ratio > 0 ? '#ff4444' :  // Full opacity red
                         isExpanded ? 'var(--signal)' :  // ALL empty days green when expanded
                         'rgba(255, 255, 255, 0.05)';  // Subtle background for empty days when collapsed

            return (
              <motion.div
                key={index}
                layoutId={`bar-${index}`}
                className={isExpanded ? `history-bar ${ratio >= 80 ? '' : ratio >= 60 ? 'medium' : ratio > 0 ? 'low' : ''}` : 'mini-bar'}
                initial={false}
                animate={{
                  height: isExpanded
                    ? `${Math.max(4, ratio)}%`
                    : ratio === 0 || isFutureDay
                      ? '8px'  // Fixed height for empty/future days
                      : `${Math.max(15, Math.min(35, ratio * 0.35))}px`,
                  backgroundColor: color,
                  borderRadius: isExpanded ? '2px 2px 0 0' : '1px',
                  scaleY: isExpanded ? 1 : 1,  // No compression needed with proper sizing
                }}
                transition={{
                  type: "spring",
                  stiffness: 38,
                  damping: 24,
                  mass: 1.5,
                  delay: index * 0.008,  // Subtle wave effect (8ms)
                  restDelta: 0.01
                }}
                style={{
                  flex: 1,
                  minWidth: '2px',
                  transformOrigin: 'bottom center',
                  opacity: 1,
                  willChange: 'height, transform'
                }}
                title={isExpanded ? `${targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: ${isFutureDay ? 'Future' : ratio > 0 ? `${ratio}%` : 'No tasks'}` : undefined}
              />
            );
          })}
        </motion.div>

      </motion.div>
    </LayoutGroup>
  );
}