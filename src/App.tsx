import { useState, useEffect } from 'react';
import type { Task, AppData } from './types';
import { useTranslation } from './contexts/LanguageContext';
import RatioDisplay from './components/RatioDisplay';
import TaskInput from './components/TaskInput';
import TaskGrid from './components/TaskGrid';
import Analytics from './components/Analytics';
import AICoach from './components/AICoach';
import Onboarding from './components/Onboarding';
import AchievementGlow from './components/AchievementGlow';
import PatternWhisper from './components/PatternWhisper';
import StreakIndicator from './components/StreakIndicator';
import SuccessPage from './components/SuccessPage';
import SuccessModal from './components/SuccessModal';
import InvoicePage from './components/InvoicePage';
import FoundationModal from './components/FoundationModal';
import Footer from './components/Footer';
import BrandIcon from './components/BrandIcon';
import LanguageSwitcher from './components/LanguageSwitcher';
import { LanguageProvider } from './contexts/LanguageContext';
import { checkAchievements } from './utils/achievements';
import { handleStripeReturn, activatePremiumForDev } from './services/premiumService';

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

function AppContent() {
  const t = useTranslation();
  const [data, setData] = useState<AppData>(initialData);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [achievementGlow, setAchievementGlow] = useState(false);
  const [whisperMessage, setWhisperMessage] = useState('');
  const [showWhisper, setShowWhisper] = useState(false);
  const [hasAchievement, setHasAchievement] = useState(false);
  const [showSuccessPage, setShowSuccessPage] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [paymentSessionId, setPaymentSessionId] = useState<string>('');
  const [showInvoicePage, setShowInvoicePage] = useState(false);
  const [invoiceId, setInvoiceId] = useState<string>('');
  const [invoiceToken, setInvoiceToken] = useState<string>('');
  const [showFoundationModal, setShowFoundationModal] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    // Check for invoice page routes
    const pathname = window.location.pathname;
    // Direct invoice route (/invoice/A00000001)
    const invoiceMatch = pathname.match(/^\/invoice\/([A-Z]\d{8})$/);
    if (invoiceMatch) {
      setInvoiceId(invoiceMatch[1]);
      setShowInvoicePage(true);
      return;
    }

    // Secure token route (/invoice/secure/[token])
    const secureInvoiceMatch = pathname.match(/^\/invoice\/secure\/([a-f0-9]{32})$/);
    if (secureInvoiceMatch) {
      setInvoiceToken(secureInvoiceMatch[1]);
      setShowInvoicePage(true);
      return;
    }

    // Check for payment success - show modal instead of separate page
    const sessionId = urlParams.get('session_id');
    if (urlParams.get('payment') === 'success' && sessionId) {
      setPaymentSessionId(sessionId);
      setShowSuccessModal(true);
      // Clean URL after showing modal
      window.history.replaceState({}, '', window.location.pathname);
      return;
    }

    // Fallback: Check for success page (old URLs)
    if (urlParams.get('session_id')) {
      setShowSuccessPage(true);
      return;
    }

    // Check for Stripe return and activate premium if successful
    const premiumActivated = handleStripeReturn();
    if (premiumActivated) {
      setWhisperMessage('Premium activated!');
      setShowWhisper(true);
    }

    // Development: Auto-activate premium for testing
    if (import.meta.env.DEV) {
      activatePremiumForDev();
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd+E for data export
      if ((event.metaKey || event.ctrlKey) && event.key === 'e') {
        event.preventDefault();

        // Import exportData function and call it
        import('./services/syncService').then(({ exportData }) => {
          exportData();
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  const transferTask = (id: number) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(task =>
        task.id === id ? {
          ...task,
          type: task.type === 'signal' ? 'noise' : 'signal'
        } : task
      )
    }));
  };

  const deleteTask = (id: number) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.filter(task => task.id !== id)
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
    // All tasks now count toward ratio - no completed state
    const signals = todayTasks.filter(task => task.type === 'signal').length;

    return todayTasks.length > 0 ? Math.round((signals / todayTasks.length) * 100) : 0;
  };

  const currentRatio = calculateRatio();
  const todayTasks = getTodayTasks();
  const { earnedCount } = checkAchievements(data);

  // Show Invoice Page if navigated to invoice route
  if (showInvoicePage) {
    return <InvoicePage invoiceId={invoiceId} token={invoiceToken} />;
  }

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

      {/* Success Modal */}
      <SuccessModal
        show={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        sessionId={paymentSessionId}
      />

      {/* Foundation Modal */}
      <FoundationModal
        show={showFoundationModal}
        onClose={() => setShowFoundationModal(false)}
      />

      <div className="container" style={{ position: 'relative' }}>
        {/* Brand Icon - Subtle Watermark */}
        <BrandIcon onLoginClick={() => setShowFoundationModal(true)} />

        {/* Language Switcher - Ultra-minimal toggle */}
        <LanguageSwitcher />


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
          onTransfer={transferTask}
          onDelete={deleteTask}
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

        {/* Footer */}
        <Footer onFoundationClick={() => setShowFoundationModal(true)} />
      </div>
    </>
  );
}

// Main App component that provides the LanguageProvider
function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;