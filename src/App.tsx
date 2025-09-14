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
    // Only create if no existing real session and explicitly enabled
    if (import.meta.env.DEV) {
      const existingSessionData = localStorage.getItem('sessionData');
      const forceDevSession = localStorage.getItem('force_dev_session') === 'true';
      const hasDevSession = localStorage.getItem('dev_premium_initialized') === 'true';

      console.log('🚧 Development session check:', {
        hasExistingSession: !!existingSessionData,
        forceDevSession,
        hasDevSession,
        existingSessionPreview: existingSessionData?.substring(0, 50) + '...' || 'none'
      });

      // Only create dev session if:
      // 1. No existing session data, OR
      // 2. Explicitly forced via localStorage.setItem('force_dev_session', 'true')
      if ((!existingSessionData && !hasDevSession) || forceDevSession) {
        console.log('🚧 Creating development session...');

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

        // Clear the force flag after using it
        if (forceDevSession) {
          localStorage.removeItem('force_dev_session');
        }

        console.log('🚧 Development session created for testing');
      } else if (existingSessionData) {
        const existingSession = JSON.parse(existingSessionData);
        const isDevSession = existingSession.sessionToken?.startsWith('dev-session-token-');
        console.log('🚧 Existing session found:', {
          email: existingSession.email,
          isDevSession,
          message: isDevSession ? 'Development session active' : 'Real premium session active'
        });

        // If real session exists, ensure dev flag doesn't interfere
        if (!isDevSession) {
          localStorage.removeItem('dev_premium_initialized');
          console.log('🚧 Removed dev flag - real premium session takes precedence');
        }
      }
    }

    // Check for premium session first
    const checkPremiumSession = async () => {
      console.log('🔍 Starting checkPremiumSession...');
      const sessionData = getSessionData();
      console.log('🔍 Session data from getSessionData():', {
        hasSessionData: !!sessionData,
        sessionToken: sessionData?.sessionToken?.substring(0, 8) + '...' || 'none',
        email: sessionData?.email || 'none',
        expires: sessionData?.expires ? new Date(sessionData.expires).toISOString() : 'none',
        isExpired: sessionData?.expires ? sessionData.expires < Date.now() : 'unknown'
      });

      if (sessionData && sessionData.sessionToken) {
        console.log('🔍 Valid session data found, validating with server...');
        try {
          // Validate session with server
          const response = await fetch('/api/auth/validate-session', {
            headers: {
              'Authorization': `Bearer ${sessionData.sessionToken}`
            }
          });

          console.log('🔍 Server validation response:', {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok
          });

          if (response.ok) {
            const { valid, user } = await response.json();
            console.log('🔍 Server validation result:', { valid, user });

            if (valid) {
              console.log('✅ Premium session validated - setting React state...');
              setIsPremiumMode(true);
              setSessionToken(sessionData.sessionToken);

              console.log('🔍 React state updated:', {
                isPremiumMode: true,
                hasSessionToken: true,
                sessionTokenLength: sessionData.sessionToken.length
              });

              // Load data from cloud instead of localStorage
              const cloudResponse = await fetch('/api/tasks', {
                headers: {
                  'Authorization': `Bearer ${sessionData.sessionToken}`
                }
              });

              console.log('🔍 Cloud data fetch response:', {
                status: cloudResponse.status,
                ok: cloudResponse.ok
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
              } else {
                console.error('❌ Failed to load cloud data:', cloudResponse.status, cloudResponse.statusText);
              }
            } else {
              console.log('❌ Server returned invalid session');
            }
          } else {
            console.error('❌ Server validation failed:', response.status, response.statusText);
          }
        } catch (error) {
          console.error('❌ Premium session check failed:', error);
        }
      } else {
        console.log('❌ No valid session data found:', {
          hasSessionData: !!sessionData,
          hasSessionToken: !!(sessionData?.sessionToken)
        });
      }

      // Fall back to local storage mode (free users or invalid session)
      console.log('🔄 Falling back to localStorage mode...');
      setIsPremiumMode(false);
      setSessionToken('');
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
    console.log('🔍 saveToCloud called:', {
      hasSessionToken: !!sessionToken,
      sessionTokenLength: sessionToken?.length || 0,
      isPremiumMode,
      taskCount: appData.tasks?.length || 0
    });

    if (!sessionToken) {
      console.log('❌ saveToCloud: No session token available');
      return;
    }

    if (!isPremiumMode) {
      console.log('❌ saveToCloud: Not in premium mode');
      return;
    }

    try {
      // Get email from session data rather than localStorage
      const sessionData = getSessionData();
      const email = sessionData?.email || localStorage.getItem('userEmail') || '';

      console.log('🔄 Saving to cloud...', {
        email: email?.substring(0, 3) + '...' || 'none',
        taskCount: appData.tasks?.length || 0,
        firstName: appData.settings.firstName || 'none'
      });

      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`
        },
        body: JSON.stringify({
          email,
          data: appData,
          firstName: appData.settings.firstName || ''
        })
      });

      console.log('🔍 Cloud sync response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Cloud sync successful:', {
          taskCount: appData.tasks?.length || 0,
          timestamp: result.timestamp,
          premium: result.premium || false,
          synced: result.synced
        });
      } else {
        console.error('❌ Failed to save data to cloud:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url
        });

        // If unauthorized, the session might be expired
        if (response.status === 401 || response.status === 403) {
          console.log('🔄 Session may be expired, clearing session...');
          localStorage.removeItem('sessionData');
          setIsPremiumMode(false);
          setSessionToken('');
        }
      }
    } catch (error) {
      console.error('❌ Cloud save error:', error);
    }
  }, [sessionToken, isPremiumMode]);

  // Save data to localStorage or cloud whenever data changes
  useEffect(() => {
    if (isLoaded) {
      // Get fresh session data to ensure we have latest state
      const currentSessionData = getSessionData();

      console.log('🔍 Sync decision check (CRITICAL):', {
        isLoaded,
        isPremiumMode,
        hasSessionToken: !!sessionToken,
        sessionTokenLength: sessionToken?.length || 0,
        sessionTokenPreview: sessionToken?.substring(0, 8) + '...' || 'none',
        currentSessionExists: !!currentSessionData,
        currentSessionTokenExists: !!currentSessionData?.sessionToken,
        currentSessionEmail: currentSessionData?.email?.substring(0, 3) + '...' || 'none',
        premiumActiveLS: localStorage.getItem('premiumActive'),
        sessionDataLS: !!localStorage.getItem('sessionData'),
        dataTaskCount: data.tasks?.length || 0
      });

      // Double-check session validity if we have sessionData but no React state
      if (!isPremiumMode && !sessionToken && currentSessionData?.sessionToken) {
        console.log('⚠️  CONTRADICTION DETECTED: Session exists in localStorage but not in React state');
        console.log('🔄 Attempting to restore session state from localStorage...');

        // Try to restore the premium state
        setIsPremiumMode(true);
        setSessionToken(currentSessionData.sessionToken);

        // Don't save yet, let the next cycle handle it with correct state
        console.log('🔄 Session state restored, will sync on next cycle');
        return;
      }

      if (isPremiumMode && sessionToken) {
        // Save to cloud for premium users
        console.log('☁️ USING CLOUD SYNC - Premium user authenticated');
        saveToCloud(data);
      } else {
        // Save to localStorage for free users
        localStorage.setItem(DATA_KEY, JSON.stringify(data));
        console.log('💾 USING LOCALSTORAGE SYNC:', {
          taskCount: data.tasks?.length || 0,
          premium: false,
          reason: !isPremiumMode ? 'not premium mode' : 'no session token',
          isPremiumMode,
          hasSessionToken: !!sessionToken,
          fallbackReason: 'Free user or session invalid'
        });
      }
    }
  }, [data, isLoaded, isPremiumMode, sessionToken, saveToCloud]);

  // Comprehensive state verification utility
  const verifyAuthState = useCallback(() => {
    console.log('\n🔍 === COMPREHENSIVE AUTH STATE VERIFICATION ===');

    // Get fresh session data
    const freshSessionData = getSessionData();

    const authState = {
      timestamp: new Date().toISOString(),
      reactState: {
        isPremiumMode,
        hasSessionToken: !!sessionToken,
        sessionTokenLength: sessionToken?.length || 0,
        sessionTokenPreview: sessionToken?.substring(0, 12) + '...' || 'none',
        isLoaded
      },
      localStorage: {
        sessionData: !!localStorage.getItem('sessionData'),
        premiumActive: localStorage.getItem('premiumActive'),
        userEmail: localStorage.getItem('userEmail'),
        devPremiumInitialized: localStorage.getItem('dev_premium_initialized'),
        forceDevSession: localStorage.getItem('force_dev_session'),
        appData: !!localStorage.getItem(DATA_KEY)
      },
      freshSessionData: freshSessionData ? {
        email: freshSessionData.email,
        hasSessionToken: !!freshSessionData.sessionToken,
        sessionTokenPreview: freshSessionData.sessionToken?.substring(0, 12) + '...' || 'none',
        expires: new Date(freshSessionData.expires).toISOString(),
        isExpired: freshSessionData.expires < Date.now(),
        firstName: freshSessionData.firstName,
        tier: freshSessionData.tier,
        isDevSession: freshSessionData.sessionToken?.startsWith('dev-session-token-') || false
      } : null,
      consistency: {
        reactVsLocalStorage: isPremiumMode === (localStorage.getItem('premiumActive') === 'true'),
        reactVsFreshSession: !!(isPremiumMode === !!freshSessionData?.sessionToken),
        sessionTokensMatch: sessionToken === freshSessionData?.sessionToken,
        expectedCloudSync: isPremiumMode && !!sessionToken,
        hasContradiction: !isPremiumMode && !!freshSessionData?.sessionToken
      },
      appData: {
        taskCount: data.tasks?.length || 0,
        hasHistory: data.history?.length > 0,
        hasBadges: data.badges?.length > 0,
        hasFirstName: !!data.settings?.firstName
      }
    };

    console.log('📊 Auth State Report:', authState);

    // Highlight issues
    if (authState.consistency.hasContradiction) {
      console.error('🚨 CONTRADICTION: Session exists in localStorage but not in React state!');
    }

    if (!authState.consistency.sessionTokensMatch) {
      console.error('🚨 TOKEN MISMATCH: React sessionToken differs from localStorage sessionToken!');
    }

    if (authState.consistency.expectedCloudSync) {
      console.log('✅ EXPECTED: Should use cloud sync');
    } else {
      console.log('💾 EXPECTED: Should use localStorage sync');
    }

    console.log('🔍 === END STATE VERIFICATION ===\n');

    return authState;
  }, [isPremiumMode, sessionToken, isLoaded, data]);

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

      // Cmd+Shift+D for debug state verification
      if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key === 'D') {
        event.preventDefault();
        verifyAuthState();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [verifyAuthState]);

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
      console.log('🔄 Starting one-time sync to cloud storage...');

      // Get current localStorage data
      const localData = localStorage.getItem(DATA_KEY);
      console.log('🔍 Local data check:', {
        exists: !!localData,
        length: localData?.length || 0,
        preview: localData?.substring(0, 100) || 'none'
      });

      if (!localData) {
        console.log('✅ No local data to sync');
        return;
      }

      let parsedData;
      try {
        parsedData = JSON.parse(localData);
      } catch (parseError) {
        console.error('❌ Failed to parse local data:', parseError);
        return;
      }

      // Check if there's meaningful data to sync (not empty)
      const hasRealData = parsedData.tasks?.length > 0 ||
                         parsedData.history?.length > 0 ||
                         parsedData.badges?.length > 0 ||
                         (parsedData.settings?.firstName && parsedData.settings.firstName !== '');

      console.log('🔍 Local data analysis:', {
        taskCount: parsedData.tasks?.length || 0,
        historyCount: parsedData.history?.length || 0,
        badgeCount: parsedData.badges?.length || 0,
        hasFirstName: !!(parsedData.settings?.firstName),
        hasRealData
      });

      if (!hasRealData) {
        console.log('✅ No meaningful local data to sync');
        return;
      }

      console.log('🔄 Syncing local data to cloud...');

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
          firstName: sessionData.firstName || parsedData.settings?.firstName || '',
          syncType: 'initial'
        })
      });

      console.log('🔍 Sync response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ One-time sync completed successfully:', result);

        // Clear localStorage since we're now cloud-based
        localStorage.removeItem(DATA_KEY);
        console.log('🗑️ localStorage cleared - now using cloud storage');

        // Show success message
        setWhisperMessage('Data synced to cloud!');
        setShowWhisper(true);
      } else {
        console.error('❌ Failed to sync data to cloud:', response.status, response.statusText);
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