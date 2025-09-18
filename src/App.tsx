import { useState, useEffect, useCallback, useRef } from 'react';
import type { Task, AppData } from './types';
import { useTranslation } from './contexts/LanguageContext';
import RatioDisplay from './components/RatioDisplay';
import TaskInput from './components/TaskInput';
import TaskGrid from './components/TaskGrid';
import TemporalFold from './components/TemporalFold';
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
import SyncIndicator from './components/SyncIndicator';
import { LanguageProvider } from './contexts/LanguageContext';
import { checkAchievements, getTodayRatio } from './utils/achievements';
import { handleStripeReturn, getSessionData, type SessionData } from './services/premiumService';
import { syncStart, syncSuccess, syncError, syncIdle, syncChecking, syncReceiving } from './services/syncService';

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
  },
  signal_ratio: 0
};

function AppContent() {
  const t = useTranslation();
  const [data, setData] = useState<AppData>(initialData);
  const [isLoaded, setIsLoaded] = useState(false);
  const [_localVersion, setLocalVersion] = useState(0);

  // Sync tracking variables
  const syncTracker = useRef({
    counter: 0,
    lastSyncTime: 0,
    lastDataSize: 0,
    version: 0
  });

  // Flag to prevent auto-sync during cloud data loading
  const [isLoadingFromCloud, setIsLoadingFromCloud] = useState(false);
  const [hasAttemptedCloudLoad, setHasAttemptedCloudLoad] = useState(false);
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

    // Handle Android app shortcuts
    const action = urlParams.get('action');
    if (action === 'add-signal' || action === 'add-noise') {
      // Store the action for processing after data loads
      sessionStorage.setItem('pendingShortcutAction', action);
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }

    // Check for magic link verification (/auth/verify?token=... or legacy /verify?token=...)
    const pathname = window.location.pathname;
    if (pathname === '/auth/verify' || pathname === '/verify') {
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
      setIsLoadingFromCloud(true); // CRITICAL: Prevent auto-sync during cloud load
      const sessionData = getSessionData();
      console.log('🔍 Session data from getSessionData():', {
        hasSessionData: !!sessionData,
        sessionToken: sessionData?.sessionToken?.substring(0, 8) + '...' || 'none',
        email: sessionData?.email || 'none',
        expires: sessionData?.expires ? new Date(sessionData.expires).toISOString() : 'none',
        isExpired: sessionData?.expires ? sessionData.expires < Date.now() : 'unknown'
      });

      if (sessionData && sessionData.sessionToken) {
        console.log('✅ VALID SESSION FOUND - Setting React state immediately...');

        // Set React state immediately to prevent contradictions
        setIsPremiumMode(true);
        setSessionToken(sessionData.sessionToken);

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
              console.log('✅ Premium session validated by server');

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

                // Parse cloudData if it's a string (Redis returns JSON strings)
                const parsedData = typeof cloudData === 'string' ? JSON.parse(cloudData) : cloudData;

                console.log('✅ Premium data loaded from cloud:', {
                  taskCount: parsedData.tasks?.length || 0,
                  premium: true,
                  email: user.firstName || 'Unknown'
                });

                // Migrate cloud data structure if needed
                if (!parsedData.badges) parsedData.badges = [];
                if (!parsedData.patterns) parsedData.patterns = {};
                if (!parsedData.settings) parsedData.settings = { targetRatio: 80, notifications: false, firstName: user.firstName || '' };
                if (parsedData.signal_ratio === undefined) parsedData.signal_ratio = getTodayRatio(parsedData.tasks || []);

                // CRITICAL: Get server version to sync client tracking
                try {
                  const metaResponse = await fetch('/api/sync-meta', {
                    headers: {
                      'Authorization': `Bearer ${sessionData.sessionToken}`
                    }
                  });

                  if (metaResponse.ok) {
                    const metadata = await metaResponse.json();
                    syncTracker.current.version = metadata.version || 0;
                    setLocalVersion(metadata.version || 0);
                    console.log('🔄 Sync version initialized from server:', metadata.version);
                  }
                } catch (error) {
                  console.log('⚠️ Could not get initial server version:', error);
                }

                setData(parsedData);
                setIsLoaded(true);
                setIsLoadingFromCloud(false); // CRITICAL: Re-enable auto-sync after cloud load success
                setHasAttemptedCloudLoad(true); // Mark that we've attempted cloud loading
                console.log('🔄 Cloud data loaded successfully - auto-sync re-enabled');
                return;
              } else {
                console.error('❌ Failed to load cloud data:', cloudResponse.status, cloudResponse.statusText);
                // Keep premium mode active but load local data
                loadLocalData();
                setIsLoadingFromCloud(false); // CRITICAL: Re-enable auto-sync after fallback to local
                setHasAttemptedCloudLoad(true); // Mark that we've attempted cloud loading
                return;
              }
            } else {
              console.log('❌ Server returned invalid session');
            }
          } else {
            console.error('❌ Server validation failed:', response.status, response.statusText);
            // For now, continue with premium mode if localStorage session exists
            // This handles server errors gracefully
            console.log('🔄 Server validation failed, using localStorage session...');
            loadLocalData();
            setIsLoadingFromCloud(false); // CRITICAL: Re-enable auto-sync after server error fallback
            setHasAttemptedCloudLoad(true); // Mark that we've attempted cloud loading
            return;
          }
        } catch (error) {
          console.error('❌ Premium session check failed:', error);
          // Continue with premium mode if localStorage session exists
          console.log('🔄 Validation error, using localStorage session...');
          loadLocalData();
          setIsLoadingFromCloud(false); // CRITICAL: Re-enable auto-sync after exception fallback
          setHasAttemptedCloudLoad(true); // Mark that we've attempted cloud loading
          return;
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
      setIsLoadingFromCloud(false); // CRITICAL: Re-enable auto-sync for free users
      setHasAttemptedCloudLoad(true); // Mark that we've attempted cloud loading
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
          if (parsedData.signal_ratio === undefined) parsedData.signal_ratio = getTodayRatio(parsedData.tasks || []);

          // Merge saved name if not already present
          if (userName && !parsedData.settings.firstName) {
            parsedData.settings.firstName = userName;
          }
          setData(parsedData);
        } catch (error) {
          console.error('Failed to load stored data:', error);
        }
      } else if (userName) {
        // Even for new users, keep saved name and initialize signal_ratio
        setData(prev => ({
          ...prev,
          settings: { ...prev.settings, firstName: userName },
          signal_ratio: getTodayRatio(prev.tasks)
        }));
      }

      setIsLoaded(true);

      // Process pending shortcut action if any
      const pendingAction = sessionStorage.getItem('pendingShortcutAction');
      if (pendingAction) {
        sessionStorage.removeItem('pendingShortcutAction');
        // Add default task based on shortcut
        if (pendingAction === 'add-signal') {
          const newTask: Task = {
            id: Date.now(),
            text: 'Quick Signal',
            type: 'signal',
            timestamp: new Date().toISOString(),
            completed: false
          };
          setData(prev => ({
            ...prev,
            tasks: [newTask, ...prev.tasks]
          }));
        } else if (pendingAction === 'add-noise') {
          const newTask: Task = {
            id: Date.now(),
            text: 'Quick Noise',
            type: 'noise',
            timestamp: new Date().toISOString(),
            completed: false
          };
          setData(prev => ({
            ...prev,
            tasks: [newTask, ...prev.tasks]
          }));
        }
      }
    };

    checkPremiumSession();

    // Listen for premium session updates (from magic link login)
    const handlePremiumSessionUpdate = (event: CustomEvent) => {
      console.log('🎯 Premium session update detected, reloading session data...', event.detail);
      checkPremiumSession();
    };

    window.addEventListener('premiumSessionUpdated', handlePremiumSessionUpdate as EventListener);

    return () => {
      window.removeEventListener('premiumSessionUpdated', handlePremiumSessionUpdate as EventListener);
    };
  }, []);

  // Helper functions defined before use

  const saveToCloud = useCallback(async (appData: AppData) => {
    const startTime = performance.now();
    const payloadSize = JSON.stringify(appData).length;
    const payloadSizeKB = (payloadSize / 1024).toFixed(2);

    console.log('🚀 CLOUD SYNC INITIATED', {
      timestamp: new Date().toISOString(),
      syncAttempt: syncTracker.current.counter,
      sessionTokenPresent: !!sessionToken,
      sessionTokenLength: sessionToken?.length || 0,
      sessionTokenPreview: sessionToken ? sessionToken.substring(0, 8) + '...' : 'none',
      isPremiumMode,
      payloadSize: `${payloadSize} bytes`,
      payloadSizeKB: `${payloadSizeKB}KB`,
      taskCount: appData.tasks?.length || 0,
      historyEntries: appData.history?.length || 0,
      badgeCount: appData.badges?.length || 0,
      patternsKeys: appData.patterns ? Object.keys(appData.patterns).length : 0,
      hasFirstName: !!appData.settings?.firstName
    });

    if (!sessionToken) {
      console.log('❌ CLOUD SYNC ABORTED: No session token available');
      return;
    }

    if (!isPremiumMode) {
      console.log('❌ CLOUD SYNC ABORTED: Not in premium mode');
      return;
    }

    try {
      // Get email from localStorage to avoid infinite loops
      const email = localStorage.getItem('userEmail') || '';

      console.log('📤 SENDING CLOUD SYNC REQUEST', {
        endpoint: '/api/sync',
        method: 'POST',
        email: email?.substring(0, 3) + '...' || 'none',
        fullEmail: email || 'missing',
        authHeader: `Bearer ${sessionToken.substring(0, 8)}...`,
        bodyKeys: ['email', 'data', 'firstName'],
        localVersion: syncTracker.current.version,
        requestStartTime: Date.now()
      });

      const requestPayload = {
        email,
        data: appData,
        firstName: appData.settings.firstName || ''
      };

      // 🔄 Start sync feedback animation
      syncStart();

      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`
        },
        body: JSON.stringify(requestPayload)
      });

      const responseTime = performance.now() - startTime;

      console.log('📥 CLOUD SYNC RESPONSE RECEIVED', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        responseTimeMs: `${responseTime.toFixed(2)}ms`,
        contentType: response.headers.get('content-type'),
        contentLength: response.headers.get('content-length')
      });

      if (response.ok) {
        const result = await response.json();

        // ✅ Success sync feedback animation with haptic
        syncSuccess();

        // Increment local version to match what server just saved
        syncTracker.current.version++;
        setLocalVersion(syncTracker.current.version);

        console.log('✅ CLOUD SYNC SUCCESS - REDIS WRITE CONFIRMED', {
          serverResponse: result,
          tasksSynced: appData.tasks?.length || 0,
          dataSizeKB: payloadSizeKB + 'KB',
          serverTimestamp: result.timestamp,
          premium: result.premium || false,
          syncedAt: result.synced,
          newVersion: syncTracker.current.version,
          totalResponseTime: `${(performance.now() - startTime).toFixed(2)}ms`,
          redisOperationSuccess: true
        });
      } else {
        // ❌ Error sync feedback animation
        syncError();

        console.error('❌ CLOUD SYNC FAILED - SERVER ERROR', {
          httpStatus: response.status,
          httpStatusText: response.statusText,
          url: response.url,
          responseTimeMs: `${responseTime.toFixed(2)}ms`,
          payloadSizeKB: payloadSizeKB + 'KB'
        });

        // Try to get error details from response
        try {
          const errorBody = await response.text();
          console.error('📝 SERVER ERROR DETAILS:', errorBody);
        } catch (e) {
          console.error('Could not parse error response:', e);
        }

        // If unauthorized, the session might be expired
        if (response.status === 401 || response.status === 403) {
          console.log('🔄 Session expired - clearing auth state...');
          localStorage.removeItem('sessionData');
          setIsPremiumMode(false);
          setSessionToken('');
        }
      }
    } catch (error) {
      const totalTime = performance.now() - startTime;

      // ❌ Network error sync feedback animation
      syncError();

      console.error('❌ CLOUD SYNC NETWORK ERROR', {
        error: error instanceof Error ? error.message : 'Unknown error',
        errorType: error instanceof Error ? error.constructor.name : typeof error,
        totalTimeMs: `${totalTime.toFixed(2)}ms`,
        payloadSizeKB: payloadSizeKB + 'KB',
        timestamp: new Date().toISOString()
      });
    }
  }, [sessionToken, isPremiumMode]);

  // Save data to localStorage or cloud whenever data changes
  useEffect(() => {
    // CRITICAL: Don't auto-sync until we've attempted to load from cloud first!
    if (isLoaded && data && !isLoadingFromCloud && hasAttemptedCloudLoad) {
      const currentTime = Date.now();

      // Calculate signal_ratio and update React state if needed
      const ratio = getTodayRatio(data.tasks);

      // Only update state if signal_ratio has changed to prevent infinite loops
      if (data.signal_ratio !== ratio) {
        setData(prev => ({ ...prev, signal_ratio: ratio }));
        return; // Exit early - the state update will trigger this effect again
      }

      const dataSize = JSON.stringify(data).length;
      const dataSizeKB = (dataSize / 1024).toFixed(2);
      const timeSinceLastSync = syncTracker.current.lastSyncTime ?
        currentTime - syncTracker.current.lastSyncTime : 0;

      syncTracker.current.counter++;

      console.log('📊 DATA CHANGE DETECTED - SYNC TRIGGER', {
        trigger: 'useEffect data dependency change',
        syncCounter: syncTracker.current.counter,
        timestamp: new Date(currentTime).toISOString(),
        timeSinceLastSync: timeSinceLastSync ? `${timeSinceLastSync}ms` : 'first sync',
        dataSize: `${dataSize} bytes`,
        dataSizeKB: `${dataSizeKB}KB`,
        dataSizeDelta: syncTracker.current.lastDataSize ?
          `${dataSize - syncTracker.current.lastDataSize} bytes` : 'initial',
        taskCount: data?.tasks?.length || 0,
        currentSignalRatio: ratio,
        hasPatterns: !!data?.patterns && Object.keys(data.patterns).length > 0,
        hasHistory: !!data?.history && data.history.length > 0,
        hasSettings: !!data?.settings,
        isLoaded,
        isPremiumMode,
        hasSessionToken: !!sessionToken,
        sessionTokenLength: sessionToken?.length || 0
      });

      if (isPremiumMode && sessionToken) {
        // Save to cloud for premium users
        console.log('☁️ CLOUD SYNC PATH ACTIVATED - Premium user authenticated', {
          syncAttempt: syncTracker.current.counter,
          email: localStorage.getItem('userEmail')?.substring(0, 3) + '...' || 'unknown'
        });
        saveToCloud(data);
        syncTracker.current.lastSyncTime = currentTime;
      } else {
        // Save to localStorage for free users
        localStorage.setItem(DATA_KEY, JSON.stringify(data));
        console.log('💾 LOCALSTORAGE SYNC PATH - Free user or no auth', {
          syncAttempt: syncTracker.current.counter,
          taskCount: data.tasks?.length || 0,
          dataSizeKB: `${dataSizeKB}KB`,
          signalRatio: data.signal_ratio,
          premium: false,
          reason: !isPremiumMode ? 'not premium mode' : 'no session token'
        });
        syncTracker.current.lastSyncTime = currentTime;
      }

      syncTracker.current.lastDataSize = dataSize;

      // Update Android widget data - SLC approach
      try {
        // Store in multiple places for maximum compatibility
        localStorage.setItem('android.widget.ratio', ratio.toString());
        localStorage.setItem('widget_ratio', ratio.toString());

        // Also try to communicate via Android interface if available
        if ('Android' in window) {
          try {
            (window as any).Android?.updateWidgetData?.(ratio);
          } catch (e) {
            // Interface not available, that's OK
          }
        }
      } catch (e) {
        // Widget update not available in browser
      }
    }
  }, [data, isLoaded, isPremiumMode, sessionToken, saveToCloud, hasAttemptedCloudLoad]);

  // Comprehensive state verification utility
  const verifyAuthState = useCallback(() => {
    console.log('\n🔍 === COMPREHENSIVE AUTH STATE VERIFICATION ===');

    // Get fresh session data - TEMPORARILY DISABLE TO STOP LOOP
    // const freshSessionData = getSessionData();

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
      freshSessionData: null,
      consistency: {
        reactVsLocalStorage: isPremiumMode === (localStorage.getItem('premiumActive') === 'true'),
        reactVsFreshSession: true,
        sessionTokensMatch: true,
        expectedCloudSync: isPremiumMode && !!sessionToken,
        hasContradiction: false
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

  // Sign out function
  const handleSignOut = useCallback(() => {
    console.log('🚪 Signing out - clearing ALL browser storage...');

    // Clear ALL localStorage (not just session-specific items)
    localStorage.clear();

    // Also clear sessionStorage if any data exists there
    sessionStorage.clear();

    // Clear any cookies (if any exist for this domain)
    document.cookie.split(";").forEach((c) => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // Reset React state
    setIsPremiumMode(false);
    setSessionToken('');

    console.log('✅ All browser storage cleared, reloading page...');
    // Force reload to reinitialize app state
    window.location.reload();
  }, []);

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

      // Cmd+Shift+L for logout/signout
      if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key === 'L') {
        event.preventDefault();
        if (isPremiumMode) {
          handleSignOut();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [verifyAuthState, handleSignOut, isPremiumMode]);

  // Pull-on-focus for multi-device sync
  useEffect(() => {
    const handleVisibilityChange = async () => {
      // Only check when becoming visible and premium mode is active
      if (document.visibilityState === 'visible' && isPremiumMode && sessionToken && isLoaded && !isLoadingFromCloud) {
        console.log('🔍 App regained focus - checking for cloud updates...');

        try {
          // Show checking animation
          syncChecking();

          // Check cloud metadata
          const response = await fetch('/api/sync-meta', {
            headers: {
              'Authorization': `Bearer ${sessionToken}`
            }
          });

          if (response.ok) {
            const metadata = await response.json();

            // More robust sync decision logic
            const cloudVersion = metadata.version || 0;
            const localVersion = syncTracker.current.version || 0;
            const cloudTimestamp = metadata.lastModified || 0;
            const timeSinceLastSync = syncTracker.current.lastSyncTime || 0;
            const isCloudNewer = cloudVersion > localVersion;

            // Timestamp-based fallback: if cloud was modified after our last sync
            const timestampSyncNeeded = cloudTimestamp > timeSinceLastSync;

            console.log('📊 Focus sync analysis:', {
              cloudVersion,
              localVersion,
              isCloudNewer,
              cloudTimestamp: new Date(cloudTimestamp).toISOString(),
              lastSyncTime: timeSinceLastSync ? new Date(timeSinceLastSync).toISOString() : 'never',
              timestampSyncNeeded,
              lastDevice: metadata.lastDevice,
              decision: isCloudNewer || timestampSyncNeeded ? 'SYNC' : 'SKIP'
            });

            // Sync if version OR timestamp indicates newer data
            if (isCloudNewer || timestampSyncNeeded) {
              console.log('⬇️ Cloud has newer data - pulling updates...', {
                reason: isCloudNewer ? 'version-based' : 'timestamp-based',
                cloudAge: cloudTimestamp ? `${Date.now() - cloudTimestamp}ms ago` : 'unknown'
              });

              // Show receiving animation
              syncReceiving();

              // Fetch full data from cloud
              const dataResponse = await fetch('/api/tasks', {
                headers: {
                  'Authorization': `Bearer ${sessionToken}`
                }
              });

              if (dataResponse.ok) {
                const { data: cloudData } = await dataResponse.json();

                // Migrate cloud data if needed
                if (!cloudData.badges) cloudData.badges = [];
                if (!cloudData.patterns) cloudData.patterns = {};
                if (!cloudData.settings) cloudData.settings = { targetRatio: 80, notifications: false };
                if (cloudData.signal_ratio === undefined) cloudData.signal_ratio = getTodayRatio(cloudData.tasks || []);

                console.log('✅ Cloud data received via focus sync:', {
                  taskCount: cloudData.tasks?.length || 0,
                  fromDevice: metadata.lastDevice,
                  version: cloudVersion,
                  syncMethod: isCloudNewer ? 'version' : 'timestamp'
                });

                // Update local data with cloud data
                setData(cloudData);
                syncTracker.current.version = cloudVersion;
                syncTracker.current.lastSyncTime = Date.now();
                setLocalVersion(cloudVersion);

                // Show success with device whisper
                syncSuccess();

                // Show device whisper if different device
                if (metadata.lastDevice && metadata.lastDevice !== 'Unknown' && metadata.lastDevice !== 'Development') {
                  import('./services/syncService').then(({ showDeviceWhisper }) => {
                    showDeviceWhisper(metadata.lastDevice);
                  });
                }
              } else {
                console.error('❌ Failed to fetch cloud data:', {
                  status: dataResponse.status,
                  statusText: dataResponse.statusText
                });
                syncError();
              }
            } else {
              console.log('✅ Local data is up to date');
              syncIdle();
            }
          } else {
            console.error('❌ Failed to check cloud metadata:', {
              status: response.status,
              statusText: response.statusText
            });
            syncIdle();
          }
        } catch (error) {
          console.error('❌ Error checking for cloud updates:', {
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined
          });
          syncIdle();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isPremiumMode, sessionToken, isLoaded, isLoadingFromCloud]);

  // Smart background sync - checks every 2 minutes when tab is active
  useEffect(() => {
    // Only run for premium users with active sessions
    if (!isPremiumMode || !sessionToken || !isLoaded || isLoadingFromCloud) {
      return;
    }

    console.log('🕐 Starting smart background sync (2-min intervals)');

    const backgroundSyncCheck = async () => {
      // Only sync if tab is visible (user is actively using app)
      if (document.visibilityState !== 'visible') {
        console.log('🔍 Background sync skipped - tab not visible');
        return;
      }

      // Check if enough time has passed since last sync (avoid spam)
      const timeSinceLastSync = Date.now() - (syncTracker.current.lastSyncTime || 0);
      if (timeSinceLastSync < 60000) { // Skip if last sync was < 1 minute ago
        console.log('🔍 Background sync skipped - recent sync activity');
        return;
      }

      console.log('🔍 Background sync check - looking for updates...');

      try {
        // Use same logic as visibilitychange but with minimal logging
        const response = await fetch('/api/sync-meta', {
          headers: {
            'Authorization': `Bearer ${sessionToken}`
          }
        });

        if (response.ok) {
          const metadata = await response.json();
          const cloudVersion = metadata.version || 0;
          const localVersion = syncTracker.current.version || 0;
          const cloudTimestamp = metadata.lastModified || 0;
          const timeSinceLastSync = syncTracker.current.lastSyncTime || 0;
          const isCloudNewer = cloudVersion > localVersion;
          const timestampSyncNeeded = cloudTimestamp > timeSinceLastSync;

          if (isCloudNewer || timestampSyncNeeded) {
            console.log('⬇️ Background sync found updates - pulling...', {
              reason: isCloudNewer ? 'version' : 'timestamp',
              cloudVersion,
              localVersion
            });

            // Silent sync without animations for background operation
            const dataResponse = await fetch('/api/tasks', {
              headers: {
                'Authorization': `Bearer ${sessionToken}`
              }
            });

            if (dataResponse.ok) {
              const { data: cloudData } = await dataResponse.json();

              // Migrate cloud data if needed
              if (!cloudData.badges) cloudData.badges = [];
              if (!cloudData.patterns) cloudData.patterns = {};
              if (!cloudData.settings) cloudData.settings = { targetRatio: 80, notifications: false };
              if (cloudData.signal_ratio === undefined) cloudData.signal_ratio = getTodayRatio(cloudData.tasks || []);

              // Update local data silently
              setData(cloudData);
              syncTracker.current.version = cloudVersion;
              syncTracker.current.lastSyncTime = Date.now();
              setLocalVersion(cloudVersion);

              console.log('✅ Background sync completed:', {
                taskCount: cloudData.tasks?.length || 0,
                fromDevice: metadata.lastDevice
              });
            }
          } else {
            console.log('✅ Background sync - no updates needed');
          }
        }
      } catch (error) {
        console.log('❌ Background sync check failed:', error instanceof Error ? error.message : String(error));
        // Fail silently for background operations
      }
    };

    // Set up 2-minute interval
    const interval = setInterval(backgroundSyncCheck, 120000); // 2 minutes

    return () => {
      clearInterval(interval);
      console.log('🕐 Smart background sync stopped');
    };
  }, [isPremiumMode, sessionToken, isLoaded, isLoadingFromCloud]);

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

      // 🔄 Start sync feedback animation for one-time sync
      syncStart();

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

        // ✅ Success sync feedback animation with haptic
        syncSuccess();

        console.log('✅ One-time sync completed successfully:', result);

        // Clear localStorage since we're now cloud-based
        localStorage.removeItem(DATA_KEY);
        console.log('🗑️ localStorage cleared - now using cloud storage');

        // Show success message
        setWhisperMessage('Data synced to cloud!');
        setShowWhisper(true);
      } else {
        // ❌ Error sync feedback for failed response
        syncError();

        console.error('❌ Failed to sync data to cloud:', response.status, response.statusText);
      }
    } catch (error) {
      // ❌ Network error sync feedback
      syncError();

      console.error('❌ One-time sync error:', error);
    }
  };

  // Update Android widget with current ratio
  const updateAndroidWidget = (ratio: number) => {
    try {
      // Store in localStorage for widget to potentially read
      localStorage.setItem('widget_current_ratio', ratio.toString());
      localStorage.setItem('widget_last_update', new Date().toISOString());

      // Try to communicate with Android app if available
      // This uses a special intent URL that the Android app can intercept
      if (window.location.hostname === 'localhost' || window.location.hostname === 'signal-noise.app') {
        // Create a hidden iframe to trigger the intent
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = `intent://widget/update?ratio=${ratio}#Intent;scheme=signalnoise;package=app.signalnoise.twa;end`;
        document.body.appendChild(iframe);

        // Remove after a short delay
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 100);
      }
    } catch (e) {
      // Widget update not critical, fail silently
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

      // Update Android widget with new ratio
      const ratio = getTodayRatio(newData.tasks);
      updateAndroidWidget(ratio);

      return newData;
    });

    // Haptic feedback on mobile
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const transferTask = (id: number) => {
    setData(prev => {
      const newData = {
        ...prev,
        tasks: prev.tasks.map(task =>
          task.id === id ? {
            ...task,
            type: (task.type === 'signal' ? 'noise' : 'signal') as 'signal' | 'noise'
          } : task
        )
      };

      // Update Android widget
      const ratio = getTodayRatio(newData.tasks);
      updateAndroidWidget(ratio);

      return newData;
    });
  };

  const deleteTask = (id: number) => {
    setData(prev => {
      const newData = {
        ...prev,
        tasks: prev.tasks.filter(task => task.id !== id)
      };

      // Update Android widget
      const ratio = getTodayRatio(newData.tasks);
      updateAndroidWidget(ratio);

      return newData;
    });
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

        {/* Top-right controls container */}
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 100
        }}>
          {/* Sync Indicator - Premium status and sync feedback */}
          <SyncIndicator data={data} />

          {/* Language Switcher - Ultra-minimal toggle */}
          <LanguageSwitcher />
        </div>


        {/* Header with Ratio */}
        <header className="header">
          <RatioDisplay
            ratio={currentRatio}
            totalTasks={todayTasks.length}
            data={data}
            earnedCount={earnedCount}
            hasAchievement={hasAchievement}
            onDataUpdate={(newData) => {
              setData(newData);
              // Update sync tracker version from server
              const fetchVersion = async () => {
                try {
                  const sessionData = JSON.parse(localStorage.getItem('sessionData') || '{}');
                  if (sessionData.sessionToken) {
                    const response = await fetch('/api/sync-meta', {
                      headers: { 'Authorization': `Bearer ${sessionData.sessionToken}` }
                    });
                    if (response.ok) {
                      const metadata = await response.json();
                      syncTracker.current.version = metadata.version || 0;
                      syncTracker.current.lastSyncTime = Date.now();
                      setLocalVersion(metadata.version || 0);
                    }
                  }
                } catch (error) {
                  console.log('Could not update version after manual sync:', error);
                }
              };
              fetchVersion();
            }}
          />
          <div className="ratio-label">
            {t.ratioLabel}
            <StreakIndicator tasks={data.tasks} />
          </div>
        </header>

        {/* Input Section */}
        <TaskInput onAdd={addTask} />

        {/* Temporal Fold - Historical Tasks */}
        <TemporalFold tasks={data.tasks} />

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