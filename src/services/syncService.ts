// Minimal sync service - Only UI indicators and data export
// REMOVED: All cloud sync functions that were causing conflicts with App.tsx

import { checkPremiumStatus } from './premiumService';

interface SyncIndicatorState {
  element: HTMLElement | null;
  timeout: number | null;
}

const syncState: SyncIndicatorState = {
  element: null,
  timeout: null
};

// Initialize sync indicator reference
export function initSyncIndicator() {
  syncState.element = document.getElementById('sync-indicator');
}

// Show sync feedback using the premium dot (Jony Ive style)
export function showSyncIndicator(state: 'syncing' | 'success' | 'error') {
  console.log('🔄 Sync feedback:', state);

  // Use the new premium dot feedback system
  const feedbackSystem = (window as any).signalNoiseSyncFeedback;

  if (feedbackSystem) {
    switch (state) {
      case 'syncing':
        feedbackSystem.showSyncing();
        break;
      case 'success':
        feedbackSystem.showSuccess();
        break;
      case 'error':
        feedbackSystem.showError();
        break;
    }
  } else {
    // Fallback for development/debugging
    console.log('⚠️ Sync feedback system not available yet');
  }

  // Legacy indicator (kept for potential future use)
  const indicator = syncState.element || document.getElementById('sync-indicator');
  if (indicator) {
    // Clear any existing timeout
    if (syncState.timeout) {
      clearTimeout(syncState.timeout);
      syncState.timeout = null;
    }
    // Keep the element hidden since we're using the premium dot now
    indicator.style.opacity = '0';
  }
}

// Get today's ratio for sync stats
function getTodayRatio(): number {
  try {
    const data = localStorage.getItem('signal_noise_data');
    if (!data) return 0;
    const parsedData = JSON.parse(data);
    const today = new Date().toDateString();
    const todayTasks = (parsedData.tasks || []).filter((task: any) =>
      new Date(task.timestamp).toDateString() === today
    );
    if (todayTasks.length === 0) return 0;
    const signalTasks = todayTasks.filter((task: any) => task.type === 'signal');
    return Math.round((signalTasks.length / todayTasks.length) * 100);
  } catch {
    return 0;
  }
}

// REMOVED: syncData(), loadFromCloud(), restoreData(), startAutoSync()
// These functions were causing conflicts with App.tsx cloud sync
// App.tsx already handles all cloud synchronization correctly

// Convenience functions for common sync scenarios
export function syncStart() {
  showSyncIndicator('syncing');
}

export function syncSuccess() {
  showSyncIndicator('success');
}

export function syncError() {
  showSyncIndicator('error');
}

export function syncIdle() {
  const feedbackSystem = (window as any).signalNoiseSyncFeedback;
  if (feedbackSystem) {
    feedbackSystem.showIdle();
  }
}

export function syncChecking() {
  const feedbackSystem = (window as any).signalNoiseSyncFeedback;
  if (feedbackSystem && feedbackSystem.showChecking) {
    feedbackSystem.showChecking();
  } else {
    // Fallback to regular sync indicator
    showSyncIndicator('syncing');
  }
}

export function syncReceiving() {
  const feedbackSystem = (window as any).signalNoiseSyncFeedback;
  if (feedbackSystem && feedbackSystem.showReceiving) {
    feedbackSystem.showReceiving();
  } else {
    // Fallback to success indicator
    showSyncIndicator('success');
  }
}

export function showDeviceWhisper(device: string) {
  const feedbackSystem = (window as any).signalNoiseSyncFeedback;
  if (feedbackSystem && feedbackSystem.showDeviceWhisper) {
    feedbackSystem.showDeviceWhisper(device);
  }
}

// Export data to JSON file (KEPT - this is useful)
export async function exportData(): Promise<boolean> {
  try {
    const data = localStorage.getItem('signal_noise_data');
    if (!data) {
      alert('No data to export');
      return false;
    }

    const parsedData = JSON.parse(data);
    const premium = checkPremiumStatus();

    const exportData = {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      premium: premium.isActive,
      email: premium.email,
      data: parsedData,
      stats: {
        totalTasks: parsedData.tasks?.length || 0,
        todayRatio: getTodayRatio(),
        badges: parsedData.badges?.length || 0
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `signal-noise-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();

    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Export failed:', error);
    return false;
  }
}