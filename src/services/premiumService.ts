// Premium service for managing subscription status and sessions

export interface PremiumStatus {
  isActive: boolean;
  email?: string;
  activatedAt?: string;
  subscriptionId?: string;
}

export interface SessionData {
  email: string;
  token: string;
  sessionToken: string;
  created: number;
  lastActive: number;
  expires: number;
  firstName: string;
  tier: string;
  paymentType: string;
  syncedFromLocal: string | null;
}

// Check if user has premium access (legacy)
export function checkPremiumStatus(): PremiumStatus {
  const premiumData = localStorage.getItem('premiumStatus');

  if (!premiumData) {
    // Also check for new session-based premium
    const sessionData = getSessionData();
    if (sessionData && sessionData.expires > Date.now()) {
      return {
        isActive: true,
        email: sessionData.email,
        activatedAt: new Date(sessionData.created).toISOString(),
        subscriptionId: sessionData.token
      };
    }
    return { isActive: false };
  }

  try {
    const status = JSON.parse(premiumData);
    return {
      isActive: status.isActive || false,
      email: status.email,
      activatedAt: status.activatedAt,
      subscriptionId: status.subscriptionId
    };
  } catch {
    return { isActive: false };
  }
}

// Session management functions
export function getSessionData(): SessionData | null {
  console.log('🔍 getSessionData called');

  const sessionData = localStorage.getItem('sessionData');
  console.log('🔍 sessionData from localStorage:', {
    exists: !!sessionData,
    length: sessionData?.length || 0,
    preview: sessionData?.substring(0, 100) + '...'
  });

  if (!sessionData) {
    console.log('❌ No sessionData in localStorage');
    return null;
  }

  try {
    const session = JSON.parse(sessionData);
    console.log('✅ Parsed sessionData:', {
      email: session.email,
      hasSessionToken: !!session.sessionToken,
      sessionTokenLength: session.sessionToken?.length || 0,
      expires: session.expires,
      expiresDate: new Date(session.expires).toISOString(),
      isExpired: session.expires < Date.now(),
      now: Date.now(),
      firstName: session.firstName,
      tier: session.tier
    });

    // Check if session is expired
    if (session.expires < Date.now()) {
      console.log('❌ Session expired, clearing session');
      clearSession();
      return null;
    }

    console.log('✅ Returning valid session data');
    return session;
  } catch (error) {
    console.log('❌ Failed to parse sessionData:', error);
    clearSession();
    return null;
  }
}

export function activatePremiumSession(sessionData: SessionData): void {
  // Store session data
  localStorage.setItem('sessionData', JSON.stringify(sessionData));

  // Store user info for app compatibility
  localStorage.setItem('userEmail', sessionData.email);
  localStorage.setItem('userFirstName', sessionData.firstName);

  // Legacy support for simple boolean check
  localStorage.setItem('premiumActive', 'true');

  console.log('✅ Premium session activated:', sessionData.email, sessionData.tier);
}

export function clearSession(): void {
  localStorage.removeItem('sessionData');
  localStorage.removeItem('premiumStatus');
  localStorage.removeItem('premiumActive');
  localStorage.removeItem('userEmail');
  console.log('🚪 Session cleared');
}

// Development helper - activate premium for testing
export function activatePremiumForDev(): void {
  const devEmail = 'dev@signal-noise.test';
  activatePremium(devEmail, 'dev-subscription-test');
  console.log('🚧 Development: Premium activated for testing');
}

// Activate premium features (called after successful payment)
export function activatePremium(email: string, subscriptionId?: string): void {
  const premiumStatus: PremiumStatus = {
    isActive: true,
    email,
    activatedAt: new Date().toISOString(),
    subscriptionId
  };

  localStorage.setItem('premiumStatus', JSON.stringify(premiumStatus));

  // Legacy support for simple boolean check
  localStorage.setItem('premiumActive', 'true');
}

// Deactivate premium features
export function deactivatePremium(): void {
  localStorage.removeItem('premiumStatus');
  localStorage.removeItem('premiumActive');
}

// Check if user returned from successful Stripe payment
export function handleStripeReturn(): boolean {
  const urlParams = new URLSearchParams(window.location.search);
  const success = urlParams.get('success');
  const email = localStorage.getItem('premiumEmail');

  if (success === 'true' && email) {
    // Activate premium with stored email
    activatePremium(email);

    // Clean up URL and stored email
    localStorage.removeItem('premiumEmail');
    window.history.replaceState({}, document.title, window.location.pathname);

    return true; // Successfully activated
  }

  return false; // No activation
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Check premium status against server (future enhancement)
export async function syncPremiumStatus(email: string): Promise<PremiumStatus> {
  try {
    // For MVP: just return local status
    // In future: call API to verify with Vercel KV
    const response = await fetch(`/api/check-premium?email=${encodeURIComponent(email)}`);

    if (response.ok) {
      const serverStatus = await response.json();

      if (serverStatus.isActive) {
        activatePremium(email, serverStatus.subscriptionId);
        return serverStatus;
      } else {
        deactivatePremium();
        return { isActive: false };
      }
    }
  } catch {
    console.log('Premium sync failed, using local status');
  }

  // Fallback to local status
  return checkPremiumStatus();
}