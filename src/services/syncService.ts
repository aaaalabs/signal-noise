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

// Show sync indicator with different states
function showSyncIndicator(state: 'syncing' | 'success') {
  const indicator = syncState.element || document.getElementById('sync-indicator');
  if (!indicator) return;

  // Clear any existing timeout
  if (syncState.timeout) {
    clearTimeout(syncState.timeout);
    syncState.timeout = null;
  }

  if (state === 'syncing') {
    // Show infinity symbol for 500ms
    indicator.textContent = '∞';
    indicator.style.color = '#fbbf24'; // amber-400

    syncState.timeout = window.setTimeout(() => {
      indicator.textContent = '∞';
    }, 500);
  } else if (state === 'success') {
    // Show checkmark briefly
    indicator.textContent = '✓';
    indicator.style.color = '#00ff88'; // signal green

    syncState.timeout = window.setTimeout(() => {
      indicator.textContent = '';
    }, 2000);
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