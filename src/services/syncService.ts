import { checkPremiumStatus } from './premiumService';

interface SyncIndicatorState {
  element: HTMLElement | null;
  timeout: number | null;
}

let syncState: SyncIndicatorState = {
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
    indicator.style.opacity = '0.5';
    indicator.style.color = '#999';

    syncState.timeout = setTimeout(() => {
      indicator.style.opacity = '0';
    }, 500);
  } else if (state === 'success') {
    // Show green dot for 1000ms
    indicator.textContent = '•';
    indicator.style.opacity = '1';
    indicator.style.color = 'var(--signal)';

    syncState.timeout = setTimeout(() => {
      indicator.style.opacity = '0';
    }, 1000);
  }
}

// Get local data timestamp
function getLocalTimestamp(): number {
  try {
    const stored = localStorage.getItem('signal_noise_data');
    if (!stored) return 0;

    const data = JSON.parse(stored);
    return data.lastModified || data.tasks?.reduce((latest: number, task: any) => {
      return Math.max(latest, task.timestamp || 0);
    }, 0) || 0;
  } catch {
    return 0;
  }
}

// Sync data to server
export async function syncData() {
  const premium = checkPremiumStatus();
  if (!premium.isActive || !premium.email) return false;

  try {
    showSyncIndicator('syncing');

    const data = localStorage.getItem('signal_noise_data');
    const firstName = localStorage.getItem('userFirstName');
    const language = localStorage.getItem('signal_noise_language');
    const timestamp = Date.now();

    // Create email hash for privacy
    const emailHash = btoa(premium.email).replace(/[^a-zA-Z0-9]/g, '').substring(0, 12);

    const payload = {
      emailHash,
      data: data ? JSON.parse(data) : {},
      firstName: firstName || '',
      language: language || 'en',
      timestamp,
      lastSync: new Date().toISOString()
    };

    const response = await fetch('/api/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      // Update local data with sync timestamp
      if (data) {
        const localData = JSON.parse(data);
        localData.lastSynced = timestamp;
        localStorage.setItem('signal_noise_data', JSON.stringify(localData));
      }

      showSyncIndicator('success');
      return true;
    }
  } catch (error) {
    // Silent fail - sync will retry on next interval
    console.debug('Sync failed, will retry:', error);
  }

  return false;
}

// Restore data from server on login
export async function restoreData(): Promise<boolean> {
  const premium = checkPremiumStatus();
  if (!premium.isActive || !premium.email) return false;

  try {
    const emailHash = btoa(premium.email).replace(/[^a-zA-Z0-9]/g, '').substring(0, 12);

    const response = await fetch(`/api/sync?emailHash=${emailHash}`);
    if (!response.ok) return false;

    const serverData = await response.json();
    if (!serverData || !serverData.data) return false;

    const localTimestamp = getLocalTimestamp();
    const serverTimestamp = serverData.timestamp || 0;

    // Only restore if server data is newer
    if (serverTimestamp > localTimestamp) {
      localStorage.setItem('signal_noise_data', JSON.stringify(serverData.data));

      if (serverData.firstName) {
        localStorage.setItem('userFirstName', serverData.firstName);
      }

      if (serverData.language) {
        localStorage.setItem('signal_noise_language', serverData.language);
      }

      return true; // Data was restored
    }
  } catch (error) {
    console.debug('Restore failed:', error);
  }

  return false;
}

// Start automatic sync (every 5 minutes if data changed)
let syncInterval: number | null = null;
let lastDataHash: string | null = null;

export function startAutoSync() {
  const premium = checkPremiumStatus();
  if (!premium.isActive) return;

  // Stop any existing sync
  stopAutoSync();

  // Check for changes every 5 minutes
  syncInterval = setInterval(async () => {
    const currentData = localStorage.getItem('signal_noise_data');
    const currentHash = currentData ? btoa(currentData).substring(0, 20) : null;

    // Only sync if data actually changed
    if (currentHash !== lastDataHash) {
      const synced = await syncData();
      if (synced) {
        lastDataHash = currentHash;
      }
    }
  }, 5 * 60 * 1000); // 5 minutes

  // Also sync immediately if we haven't synced yet
  if (!lastDataHash) {
    syncData().then((synced) => {
      if (synced) {
        const currentData = localStorage.getItem('signal_noise_data');
        lastDataHash = currentData ? btoa(currentData).substring(0, 20) : null;
      }
    });
  }
}

export function stopAutoSync() {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
  }
}

// Export user data as JSON
export function exportData() {
  try {
    const data = localStorage.getItem('signal_noise_data');
    const firstName = localStorage.getItem('userFirstName');
    const language = localStorage.getItem('signal_noise_language');
    const premiumStatus = checkPremiumStatus();

    const exportData = {
      exported_at: new Date().toISOString(),
      version: "1.0.0",
      user: {
        firstName: firstName || '',
        language: language || 'en',
        premium: premiumStatus.isActive
      },
      data: data ? JSON.parse(data) : {}
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `signal-noise-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();

    // Cleanup
    setTimeout(() => URL.revokeObjectURL(url), 100);

    return true;
  } catch (error) {
    console.error('Export failed:', error);
    return false;
  }
}