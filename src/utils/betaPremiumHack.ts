// Beta Premium Hack - Development testing utility
// This file contains all beta premium testing logic
// Can be easily removed in production by deleting this file and its imports

import { activatePremiumSession } from '../services/premiumService';
import type { SessionData } from '../services/premiumService';
import type { AppData, Task as TaskType, DayRatio } from '../types';

/**
 * Checks if beta premium hack should be activated
 * @returns true if beta premium was activated or already exists
 */
export function checkAndActivateBetaPremium(): boolean {
  // Check for beta URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('beta') !== 'premium2027!') {
    return false;
  }

  // Check if beta session already exists
  const existingSession = localStorage.getItem('sessionData');
  if (existingSession) {
    try {
      const sessionData = JSON.parse(existingSession);
      // If it's already a beta session, don't recreate
      if (sessionData.email === 'beta@leodin.com') {
        console.log('🚀 Beta premium already active');
        return true;
      }
    } catch (e) {
      // Invalid session data, proceed with creation
    }
  }

  console.log('🎯 Creating new beta premium session for first time...');
  createBetaPremiumSession();
  return true;
}

/**
 * Creates a complete beta premium session with all necessary data
 */
function createBetaPremiumSession(): void {
  // Generate tokens like the real system
  const sessionToken = Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  const accessToken = 'snk_' + Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  const invoiceToken = Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  // Create full SessionData like a real Stripe payment would
  const betaSessionData: SessionData = {
    email: 'beta@leodin.com',
    token: accessToken, // This should be the access_token
    sessionToken: sessionToken, // The actual session token for auth
    created: Date.now(),
    lastActive: Date.now(),
    expires: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days
    firstName: 'Beta Tester',
    tier: 'foundation', // Simulate Foundation member
    paymentType: 'lifetime',
    syncedFromLocal: Date.now().toString()
  };

  // Create realistic app data with tasks and history
  const betaAppData = createBetaAppData();

  // Create additional metadata that would be in Redis (for complete simulation)
  const betaUserMetadata = {
    access_token: accessToken,
    app_data: JSON.stringify(betaAppData),
    app_data_initialized: new Date().toISOString(),
    created_at: Date.now().toString(),
    email: 'beta@leodin.com',
    expires_at: '0', // Lifetime
    first_name: 'Beta Tester',
    invoice_date: new Date().toLocaleDateString('en-US'),
    invoice_number: 'BETA-2027',
    invoice_token: invoiceToken,
    last_active: Date.now().toString(),
    last_payment: Date.now().toString(),
    login_count: '1',
    payment_amount: '29',
    payment_type: 'lifetime',
    session_token: sessionToken,
    status: 'active',
    stripe_customer_id: null,
    synced_from_local: Date.now().toString(),
    tier: 'foundation',
    usage_total: '0'
  };

  // Set all necessary localStorage items (mimics Stripe payment flow)
  localStorage.setItem('signal_noise_data', JSON.stringify(betaAppData));
  localStorage.setItem('signal_noise_onboarded', 'true'); // Skip onboarding
  localStorage.setItem('userFirstName', 'Beta Tester');
  localStorage.setItem('userEmail', 'beta@leodin.com');
  localStorage.setItem('beta_user_metadata', JSON.stringify(betaUserMetadata)); // Store for debugging

  // Activate the premium session (triggers reload automatically)
  activatePremiumSession(betaSessionData);

  console.log('🚀 Beta premium activated with full data and session');
}

/**
 * Creates realistic app data for beta testing
 */
function createBetaAppData(): AppData {
  const now = Date.now();

  return {
    tasks: [
      // Today's tasks
      { id: now - 1000, text: "Review quarterly goals", type: "signal", timestamp: new Date().toISOString(), completed: false },
      { id: now - 2000, text: "Check social media", type: "noise", timestamp: new Date().toISOString(), completed: false },
      { id: now - 3000, text: "Strategic planning session", type: "signal", timestamp: new Date().toISOString(), completed: false },
      { id: now - 4000, text: "Deep work on project", type: "signal", timestamp: new Date().toISOString(), completed: false },
      // Yesterday's tasks
      { id: now - 86400000, text: "Team standup", type: "signal", timestamp: new Date(now - 86400000).toISOString(), completed: true },
      { id: now - 86401000, text: "Reply to emails", type: "noise", timestamp: new Date(now - 86400000).toISOString(), completed: true },
      { id: now - 86402000, text: "Code review", type: "signal", timestamp: new Date(now - 86400000).toISOString(), completed: true },
      // 2 days ago
      { id: now - 172800000, text: "Product review", type: "signal", timestamp: new Date(now - 172800000).toISOString(), completed: true },
      { id: now - 172801000, text: "Browse news", type: "noise", timestamp: new Date(now - 172800000).toISOString(), completed: true },
      { id: now - 172802000, text: "Customer call", type: "signal", timestamp: new Date(now - 172800000).toISOString(), completed: true },
      // 3 days ago
      { id: now - 259200000, text: "Sprint planning", type: "signal", timestamp: new Date(now - 259200000).toISOString(), completed: true },
      { id: now - 259201000, text: "Slack messages", type: "noise", timestamp: new Date(now - 259200000).toISOString(), completed: true },
      // 4 days ago
      { id: now - 345600000, text: "Design review", type: "signal", timestamp: new Date(now - 345600000).toISOString(), completed: true },
      { id: now - 345601000, text: "Social media check", type: "noise", timestamp: new Date(now - 345600000).toISOString(), completed: true },
      // 5 days ago
      { id: now - 432000000, text: "Strategy meeting", type: "signal", timestamp: new Date(now - 432000000).toISOString(), completed: true },
      { id: now - 432001000, text: "Random browsing", type: "noise", timestamp: new Date(now - 432000000).toISOString(), completed: true },
      // 6 days ago
      { id: now - 518400000, text: "Documentation", type: "signal", timestamp: new Date(now - 518400000).toISOString(), completed: true },
      { id: now - 518401000, text: "Chat distractions", type: "noise", timestamp: new Date(now - 518400000).toISOString(), completed: true },
    ] as TaskType[],
    history: [
      // 7 days of ratio history for analytics
      { date: new Date(now).toISOString().split('T')[0], ratio: 85, taskCount: 12 },
      { date: new Date(now - 86400000).toISOString().split('T')[0], ratio: 78, taskCount: 8 },
      { date: new Date(now - 172800000).toISOString().split('T')[0], ratio: 92, taskCount: 15 },
      { date: new Date(now - 259200000).toISOString().split('T')[0], ratio: 80, taskCount: 10 },
      { date: new Date(now - 345600000).toISOString().split('T')[0], ratio: 75, taskCount: 6 },
      { date: new Date(now - 432000000).toISOString().split('T')[0], ratio: 88, taskCount: 9 },
      { date: new Date(now - 518400000).toISOString().split('T')[0], ratio: 81, taskCount: 11 },
    ] as DayRatio[],
    badges: ["early_bird", "week_warrior"], // Some earned badges
    patterns: {
      bestHour: 9,
      worstDay: "Monday",
      consistencyScore: 0.78
    },
    settings: {
      targetRatio: 80,
      notifications: false,
      firstName: "Beta Tester"
    }
  };
}

/**
 * Cleans up beta premium session (for testing)
 */
export function cleanupBetaPremium(): void {
  const sessionData = localStorage.getItem('sessionData');
  if (sessionData) {
    try {
      const session = JSON.parse(sessionData);
      if (session.email === 'beta@leodin.com') {
        localStorage.removeItem('sessionData');
        localStorage.removeItem('beta_user_metadata');
        console.log('🧹 Beta premium session cleaned up');
      }
    } catch (e) {
      // Invalid session data
    }
  }
}