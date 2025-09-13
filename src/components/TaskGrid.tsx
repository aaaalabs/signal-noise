import type { Task } from '../types';

interface TaskGridProps {
  tasks: Task[];
  onToggle: (id: number) => void;
}

function TaskItem({ task, onToggle }: { task: Task; onToggle: (id: number) => void }) {
  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'gerade eben';
    if (minutes < 60) return `vor ${minutes}m`;
    if (minutes < 1440) return `vor ${Math.floor(minutes / 60)}h`;
    return date.toLocaleDateString('de-DE');
  };

  return (
    <div
      onClick={() => onToggle(task.id)}
      className={`task-item ${task.type}-item ${task.completed ? 'completed' : ''}`}
      style={{ opacity: task.completed ? 0.3 : 1 }}
    >
      <div className="task-text">{task.text}</div>
      <div className="task-time">{formatTime(task.timestamp)}</div>
    </div>
  );
}

export default function TaskGrid({ tasks, onToggle }: TaskGridProps) {
  const signalTasks = tasks.filter(task => task.type === 'signal');
  const noiseTasks = tasks.filter(task => task.type === 'noise');

  return (
    <div className="tasks-grid">
      <div className="task-column signal-column">
        <h3>Signals</h3>
        <div>
          {signalTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggle}
            />
          ))}
          {signalTasks.length === 0 && (
            <div style={{ textAlign: 'center', padding: '32px 0', color: '#666', fontSize: '14px' }}>
              Noch keine Signal-Aufgaben heute
            </div>
          )}
        </div>
      </div>

      <div className="task-column noise-column">
        <h3>Noise</h3>
        <div>
          {noiseTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggle}
            />
          ))}
          {noiseTasks.length === 0 && (
            <div style={{ textAlign: 'center', padding: '32px 0', color: '#666', fontSize: '14px' }}>
              Noch keine Ablenkungen heute
            </div>
          )}
        </div>
      </div>
    </div>
  );
}