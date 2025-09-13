import type { Task, DayRatio } from '../types';

interface AnalyticsProps {
  tasks: Task[];
  history: DayRatio[];
}

export default function Analytics({ tasks }: AnalyticsProps) {
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

  const dailyRatios = calculateDailyRatios();
  const avgRatio = dailyRatios.length > 0
    ? Math.round(dailyRatios.reduce((a, b) => a + b, 0) / dailyRatios.length)
    : 0;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentTasks = tasks.filter(task =>
    new Date(task.timestamp) > thirtyDaysAgo
  );

  return (
    <div className="analytics">
      <h2>30-Tage Überblick</h2>

      <div className="stat-grid">
        <div className="stat">
          <div className="stat-value">
            {avgRatio > 0 ? `${avgRatio}%` : '—'}
          </div>
          <div className="stat-label">Ø Ratio</div>
        </div>
        <div className="stat">
          <div className="stat-value">{recentTasks.length}</div>
          <div className="stat-label">Tasks Total</div>
        </div>
        <div className="stat">
          <div className="stat-value">{calculateStreak()}</div>
          <div className="stat-label">Tage Streak</div>
        </div>
      </div>

      <div className="history-chart">
        {dailyRatios.map((ratio, index) => (
          <div
            key={index}
            className={`history-bar ${ratio >= 80 ? '' : ratio >= 60 ? 'medium' : ratio > 0 ? 'low' : ''}`}
            style={{
              height: `${Math.max(4, ratio)}%`,
            }}
            title={`Tag ${index - 29}: ${ratio}%`}
          />
        ))}
      </div>
    </div>
  );
}