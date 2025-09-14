import { useState, useEffect, useCallback } from 'react';
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
import VerifyMagicLink from './components/VerifyMagicLink';
import Footer from './components/Footer';
import BrandIcon from './components/BrandIcon';
import LanguageSwitcher from './components/LanguageSwitcher';
import { LanguageProvider } from './contexts/LanguageContext';
import { checkAchievements } from './utils/achievements';
import { handleStripeReturn, getSessionData, type SessionData } from './services/premiumService';

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
  const [isPremiumMode, setIsPremiumMode] = useState(false);
  const [sessionToken, setSessionToken] = useState<string>('');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [achievementGlow, setAchievementGlow] = useState(false);
  const [whisperMessage, setWhisperMessage] = useState('');
  const [showWhisper, setShowWhisper] = useState(false);
  const [hasAchievement, setHasAchievement] = useState(false);
  const [showSuccessPage, setShowSuccessPage] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [paymentSessionId, setPaymentSessionId] = useState<string>('');
  const [showInvoicePage, setShowInvoicePage] = useState(false);
  const [invoiceId] = useState<string>('');
  const [invoiceToken, setInvoiceToken] = useState<string>('');
  const [showFoundationModal, setShowFoundationModal] = useState(false);
  const [foundationModalLoginMode, setFoundationModalLoginMode] = useState(false);
  const [showVerifyMagicLink, setShowVerifyMagicLink] = useState(false);
  const [verifyToken, setVerifyToken] = useState<string>('');

  // Load data from localStorage on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    // Check for magic link verification (/verify?token=...)
    const pathname = window.location.pathname;
    if (pathname === '/verify') {
      const token = urlParams.get('token');
      if (token) {
        setVerifyToken(token);
        setShowVerifyMagicLink(true);
        return;
      }
    }

    // Check for invoice page routes (secure access only)

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

    // Development: Auto-activate premium for testing with magic link session
    if (import.meta.env.DEV && !localStorage.getItem('dev_premium_initialized')) {
      const devSessionData: SessionData = {
        email: 'dev@signal-noise.test',
        token: 'dev-token-12345',
        sessionToken: 'dev-session-token-' + Date.now(),
        created: Date.now(),
        lastActive: Date.now(),
        expires: Date.now() + (30 * 24 * 60 * 60 * 1000),
        firstName: 'Dev User',
        tier: 'early_adopter',
        paymentType: 'lifetime',
        syncedFromLocal: null
      };

      localStorage.setItem('sessionData', JSON.stringify(devSessionData));
      localStorage.setItem('userEmail', devSessionData.email);
      localStorage.setItem('dev_premium_initialized', 'true');
      console.log('🚧 Development: Premium session created for testing');
    }

    // Check for premium session first
    const checkPremiumSession = async () => {
      const sessionData = getSessionData();
      console.log('🔍 Checking premium session:', {
        hasSessionData: !!sessionData,
        sessionToken: sessionData?.sessionToken?.substring(0, 8) + '...' || 'none'
      });

      if (sessionData && sessionData.sessionToken) {
        try {
          // Validate session with server
          const response = await fetch('/api/auth/validate-session', {
            headers: {
              'Authorization': `Bearer ${sessionData.sessionToken}`
            }
          });

          if (response.ok) {
            const { valid, user } = await response.json();
            if (valid) {
              console.log('✅ Premium session validated');
              setIsPremiumMode(true);
              setSessionToken(sessionData.sessionToken);

              // Load data from cloud instead of localStorage
              const cloudResponse = await fetch('/api/tasks', {
                headers: {
                  'Authorization': `Bearer ${sessionData.sessionToken}`
                }
              });

              if (cloudResponse.ok) {
                const { data: cloudData } = await cloudResponse.json();
                console.log('✅ Premium data loaded from cloud:', {
                  taskCount: cloudData.tasks?.length || 0,
                  premium: true,
                  email: user.firstName || 'Unknown'
                });

                // Migrate cloud data structure if needed
                if (!cloudData.badges) cloudData.badges = [];
                if (!cloudData.patterns) cloudData.patterns = {};
                if (!cloudData.settings) cloudData.settings = { targetRatio: 80, notifications: false, firstName: user.firstName || '' };

                setData(cloudData);
                setIsLoaded(true);
                return;
              }
            }
          }

          console.log('❌ Premium session invalid, falling back to localStorage');
        } catch (error) {
          console.error('❌ Premium session check failed:', error);
        }
      }

      // Fall back to local storage mode (free users or invalid session)
      setIsPremiumMode(false);
      loadLocalData();
    };

    const loadLocalData = () => {
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
    };

    checkPremiumSession();
  }, []);

  // Helper functions defined before use
  const saveToCloud = useCallback(async (appData: AppData) => {
    if (!sessionToken) return;

    try {
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`
        },
        body: JSON.stringify({
          email: localStorage.getItem('userEmail'),
          data: appData,
          firstName: appData.settings.firstName
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Cloud sync successful:', {
          taskCount: appData.tasks?.length || 0,
          timestamp: result.timestamp,
          premium: result.premium || false
        });
      } else {
        console.error('❌ Failed to save data to cloud:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('❌ Cloud save error:', error);
    }
  }, [sessionToken]);

  // Save data to localStorage or cloud whenever data changes
  useEffect(() => {
    if (isLoaded) {
      console.log('🔍 Sync decision check:', {
        isPremiumMode,
        hasSessionToken: !!sessionToken,
        sessionTokenLength: sessionToken?.length || 0
      });

      if (isPremiumMode && sessionToken) {
        // Save to cloud for premium users
        console.log('☁️ Using cloud sync...');
        saveToCloud(data);
      } else {
        // Save to localStorage for free users
        localStorage.setItem(DATA_KEY, JSON.stringify(data));
        console.log('💾 LocalStorage sync successful:', {
          taskCount: data.tasks?.length || 0,
          premium: false,
          reason: !isPremiumMode ? 'not premium' : 'no session token'
        });
      }
    }
  }, [data, isLoaded, isPremiumMode, sessionToken, saveToCloud]);

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

  const handleOneTimeSyncToCloud = async (sessionData: SessionData) => {
    try {
      console.log('🔄 Starting one-time sync to cloud storage');

      // Get current localStorage data
      const localData = localStorage.getItem(DATA_KEY);
      if (!localData) {
        console.log('✅ No local data to sync');
        return;
      }

      const parsedData = JSON.parse(localData);

      // Sync to cloud using authenticated endpoint
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionData.sessionToken}`
        },
        body: JSON.stringify({
          email: sessionData.email,
          data: parsedData,
          firstName: sessionData.firstName,
          syncType: 'initial'
        })
      });

      if (response.ok) {
        console.log('✅ One-time sync completed successfully');

        // Clear localStorage since we're now cloud-based
        localStorage.removeItem(DATA_KEY);

        // Show success message
        setWhisperMessage('Data synced to cloud!');
        setShowWhisper(true);
      } else {
        console.error('❌ Failed to sync data to cloud');
      }
    } catch (error) {
      console.error('❌ One-time sync error:', error);
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

  // Show Magic Link Verification if navigated to verify route
  if (showVerifyMagicLink) {
    return (
      <VerifyMagicLink
        token={verifyToken}
        onSuccess={(sessionData?: SessionData) => {
          setShowVerifyMagicLink(false);

          // Handle one-time sync for new premium users
          if (sessionData && !sessionData.syncedFromLocal) {
            // Trigger one-time sync from localStorage to cloud
            handleOneTimeSyncToCloud(sessionData);
          }

          // Clean URL and redirect to main app
          window.history.replaceState({}, '', '/');

          // Trigger app reload to show premium features
          setIsLoaded(false);
          setTimeout(() => setIsLoaded(true), 100);
        }}
        onError={() => {
          setShowVerifyMagicLink(false);
          // Clean URL and redirect to main app
          window.history.replaceState({}, '', '/');
        }}
      />
    );
  }

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
        onClose={() => {
          setShowFoundationModal(false);
          setFoundationModalLoginMode(false);
        }}
        startInLoginMode={foundationModalLoginMode}
      />

      <div className="container" style={{ position: 'relative' }}>
        {/* Brand Icon - Subtle Watermark */}
        <BrandIcon onLoginClick={() => {
          setFoundationModalLoginMode(true);
          setShowFoundationModal(true);
        }} />

        {/* Language Switcher - Ultra-minimal toggle */}
        <LanguageSwitcher
          onPremiumClick={() => {
            setFoundationModalLoginMode(true);
            setShowFoundationModal(true);
          }}
          tasks={data.tasks}
          currentRatio={currentRatio}
          totalTasks={todayTasks.length}
          data={data}
        />


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
        <Footer onFoundationClick={() => {
          setFoundationModalLoginMode(true);
          setShowFoundationModal(true);
        }} />
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