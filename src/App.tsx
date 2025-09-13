import { useState, useEffect } from 'react';
import type { Task, AppData } from './types';
import { t } from './i18n/translations';
import RatioDisplay from './components/RatioDisplay';
import TaskInput from './components/TaskInput';
import TaskGrid from './components/TaskGrid';
import Analytics from './components/Analytics';
import AICoach from './components/AICoach';
import Onboarding from './components/Onboarding';
import AchievementGlow from './components/AchievementGlow';
import PatternWhisper from './components/PatternWhisper';
import StreakIndicator from './components/StreakIndicator';
import PremiumLanding from './components/PremiumLanding';
import SuccessPage from './components/SuccessPage';
import { checkAchievements } from './utils/achievements';
import { handleStripeReturn } from './services/premiumService';

const DATA_KEY = 'signal_noise_data';
const ONBOARDING_KEY = 'signal_noise_onboarded';

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
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [achievementGlow, setAchievementGlow] = useState(false);
  const [whisperMessage, setWhisperMessage] = useState('');
  const [showWhisper, setShowWhisper] = useState(false);
  const [hasAchievement, setHasAchievement] = useState(false);
  const [showPremiumLanding, setShowPremiumLanding] = useState(false);
  const [showSuccessPage, setShowSuccessPage] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    // Check for success page
    if (urlParams.get('session_id')) {
      setShowSuccessPage(true);
      return;
    }

    // Check for premium landing request
    if (urlParams.get('premium') === 'true') {
      setShowPremiumLanding(true);
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
      return;
    }

    // Check for Stripe return and activate premium if successful
    const premiumActivated = handleStripeReturn();
    if (premiumActivated) {
      setWhisperMessage('Premium activated!');
      setShowWhisper(true);
    }

    // Check onboarding first
    const hasOnboarded = localStorage.getItem(ONBOARDING_KEY);
    if (!hasOnboarded) {
      setShowOnboarding(true);
      return;
    }

    const stored = localStorage.getItem(DATA_KEY);
    const userName = localStorage.getItem('userFirstName');

    if (stored) {
      try {
        const parsedData = JSON.parse(stored);

        // Migrate old data structure if needed
        if (!parsedData.badges) parsedData.badges = [];
        if (!parsedData.patterns) parsedData.patterns = {};
        if (!parsedData.settings) parsedData.settings = { targetRatio: 80, notifications: false, firstName: '' };

        // Merge saved name if not already present
        if (userName && !parsedData.settings.firstName) {
          parsedData.settings.firstName = userName;
        }
        setData(parsedData);
      } catch (error) {
        console.error('Failed to load stored data:', error);
      }
    } else if (userName) {
      // Even for new users, keep saved name
      setData(prev => ({
        ...prev,
        settings: { ...prev.settings, firstName: userName }
      }));
    }
    setIsLoaded(true);
  }, []);

  // Save data to localStorage whenever data changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(DATA_KEY, JSON.stringify(data));
    }
  }, [data, isLoaded]);

  const handleOnboardingComplete = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setShowOnboarding(false);
    setIsLoaded(true);
  };

  const triggerAchievementFeedback = (newBadges: any[]) => {
    if (newBadges.length > 0) {
      setAchievementGlow(true);
      setHasAchievement(true);

      // Show whisper for major achievements
      const majorAchievements = ['week_warrior', 'month_hero', 'perfect_day'];
      const majorBadge = newBadges.find(badge => majorAchievements.includes(badge.id));

      if (majorBadge) {
        setWhisperMessage(majorBadge.name);
        setShowWhisper(true);
      }

      // Reset achievement state after animation
      setTimeout(() => {
        setHasAchievement(false);
      }, 3000);
    }
  };

  const addTask = (text: string, type: 'signal' | 'noise') => {
    const newTask: Task = {
      id: Date.now(),
      text: text.trim(),
      type,
      timestamp: new Date().toISOString(),
      completed: false
    };

    setData(prev => {
      const newData = {
        ...prev,
        tasks: [newTask, ...prev.tasks]
      };

      // Check for achievements
      const { newBadges } = checkAchievements(newData);

      if (newBadges.length > 0) {
        // Add new badges
        newData.badges = [...prev.badges, ...newBadges.map(b => b.id)];

        // Trigger visual feedback
        triggerAchievementFeedback(newBadges);
      }

      return newData;
    });

    // Haptic feedback on mobile
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
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
  const { earnedCount } = checkAchievements(data);

  // Show Success Page if coming from Stripe
  if (showSuccessPage) {
    return (
      <SuccessPage
        onContinue={() => {
          setShowSuccessPage(false);
          // Clean URL
          window.history.replaceState({}, '', window.location.pathname);
        }}
      />
    );
  }

  // Show Premium Landing if requested
  if (showPremiumLanding) {
    return (
      <PremiumLanding
        onBack={() => setShowPremiumLanding(false)}
      />
    );
  }

  return (
    <>
      {/* Onboarding */}
      <Onboarding
        show={showOnboarding}
        onComplete={handleOnboardingComplete}
      />

      {/* Achievement Glow */}
      <AchievementGlow trigger={achievementGlow} />

      {/* Pattern Whisper */}
      <PatternWhisper
        message={whisperMessage}
        show={showWhisper}
      />

      <div className="container">
        {/* Header with Ratio */}
        <header className="header">
          <RatioDisplay
            ratio={currentRatio}
            totalTasks={todayTasks.length}
            data={data}
            earnedCount={earnedCount}
            hasAchievement={hasAchievement}
          />
          <div className="ratio-label">
            {t.ratioLabel}
            <StreakIndicator tasks={data.tasks} />
          </div>
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
          data={data}
          onNameUpdate={(name) => setData(prev => ({
            ...prev,
            settings: { ...prev.settings, firstName: name }
          }))}
        />

        {/* Analytics */}
        <Analytics
          tasks={data.tasks}
          history={data.history}
        />
      </div>
    </>
  );
}

export default App;