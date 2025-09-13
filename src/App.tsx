import { useState, useEffect } from 'react';
import type { Task, AppData } from './types';
import RatioDisplay from './components/RatioDisplay';
import TaskInput from './components/TaskInput';
import TaskGrid from './components/TaskGrid';
import Analytics from './components/Analytics';
import PremiumBanner from './components/PremiumBanner';
import AICoach from './components/AICoach';

const DATA_KEY = 'signal_noise_data';

const initialData: AppData = {
  tasks: [],
  history: [],
  badges: [],
  patterns: {},
  settings: {
    targetRatio: 80,
    notifications: false,
    firstName: ''
  }
};

function App() {
  const [data, setData] = useState<AppData>(initialData);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(DATA_KEY);
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to load stored data:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save data to localStorage whenever data changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(DATA_KEY, JSON.stringify(data));
    }
  }, [data, isLoaded]);

  const addTask = (text: string, type: 'signal' | 'noise') => {
    const newTask: Task = {
      id: Date.now(),
      text: text.trim(),
      type,
      timestamp: new Date().toISOString(),
      completed: false
    };

    setData(prev => ({
      ...prev,
      tasks: [newTask, ...prev.tasks]
    }));
  };

  const toggleTask = (id: number) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    }));
  };

  const getTodayTasks = (): Task[] => {
    const today = new Date().toDateString();
    return data.tasks.filter(task =>
      new Date(task.timestamp).toDateString() === today
    );
  };

  const calculateRatio = (): number => {
    const todayTasks = getTodayTasks();
    const activeTasks = todayTasks.filter(task => !task.completed);
    const signals = activeTasks.filter(task => task.type === 'signal').length;

    return activeTasks.length > 0 ? Math.round((signals / activeTasks.length) * 100) : 0;
  };

  const currentRatio = calculateRatio();
  const todayTasks = getTodayTasks();

  return (
    <div className="container">
      {/* Header with Ratio */}
      <header className="header">
        <RatioDisplay ratio={currentRatio} totalTasks={todayTasks.length} />
        <div className="ratio-label">Signal Ratio</div>
      </header>

      {/* Input Section */}
      <TaskInput onAdd={addTask} />

      {/* Tasks Grid */}
      <TaskGrid
        tasks={todayTasks}
        onToggle={toggleTask}
      />

      {/* AI Coach */}
      <AICoach
        tasks={data.tasks}
        currentRatio={currentRatio}
        firstName={data.settings.firstName}
      />

      {/* Analytics */}
      <Analytics
        tasks={data.tasks}
        history={data.history}
      />

      {/* Premium Banner */}
      <PremiumBanner />
    </div>
  );
}

export default App;