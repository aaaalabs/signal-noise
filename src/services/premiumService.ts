// Premium service for managing subscription status

export interface PremiumStatus {
  isActive: boolean;
  email?: string;
  activatedAt?: string;
  subscriptionId?: string;
}

// Check if user has premium access
export function checkPremiumStatus(): PremiumStatus {
  const premiumData = localStorage.getItem('premiumStatus');

  if (!premiumData) {
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
  } catch (error) {
    console.log('Premium sync failed, using local status');
  }

  // Fallback to local status
  return checkPremiumStatus();
}