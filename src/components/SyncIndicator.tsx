import { useState, useEffect } from 'react';
import { checkPremiumStatus } from '../services/premiumService';
import PremiumMenu from './PremiumMenu';
import type { AppData } from '../types';

interface SyncIndicatorProps {
  data: AppData;
}

export default function SyncIndicator({ data }: SyncIndicatorProps) {
  const [premiumStatus, setPremiumStatus] = useState(() => checkPremiumStatus());
  const [showPremiumMenu, setShowPremiumMenu] = useState(false);
  const [syncState, setSyncState] = useState<'idle' | 'syncing' | 'success' | 'error' | 'checking' | 'receiving'>('idle');

  // Sync feedback functions that can be called from outside
  const showSyncFeedback = (state: 'syncing' | 'success' | 'error') => {
    setSyncState(state);

    if (state === 'success') {
      // Add haptic feedback on mobile
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }

      // Reset to idle after animation completes
      setTimeout(() => {
        setSyncState('idle');
      }, 2000);
    } else if (state === 'error') {
      // Reset to idle after error animation
      setTimeout(() => {
        setSyncState('idle');
      }, 3000);
    }
    // 'syncing' state needs to be manually cleared
  };

  // Make sync feedback available globally
  useEffect(() => {
    // Attach sync feedback functions to window for global access (photon metaphor)
    (window as unknown as { signalNoiseSyncFeedback?: object }).signalNoiseSyncFeedback = {
      showSyncing: () => showSyncFeedback('syncing'),
      showSuccess: () => showSyncFeedback('success'),
      showError: () => showSyncFeedback('error'),
      showIdle: () => setSyncState('idle'),
      showChecking: () => setSyncState('checking'),
      showReceiving: () => setSyncState('receiving'),
      showDeviceWhisper: (device: string) => {
        // Create and show device whisper
        const whisper = document.createElement('div');
        whisper.className = 'device-whisper';
        whisper.textContent = `↓ ${device}`;
        whisper.style.cssText = `
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          font-size: 9px;
          opacity: 0;
          animation: deviceWhisper 2s forwards;
          color: var(--signal);
          white-space: nowrap;
          pointer-events: none;
          margin-top: 2px;
        `;

        const dot = document.querySelector('.premium-dot');
        if (dot && dot.parentElement) {
          const container = dot.parentElement;
          if (container.style.position !== 'relative') {
            container.style.position = 'relative';
          }
          container.appendChild(whisper);
          setTimeout(() => whisper.remove(), 2000);
        }
      }
    };

    return () => {
      // Cleanup
      delete (window as unknown as { signalNoiseSyncFeedback?: object }).signalNoiseSyncFeedback;
    };
  }, []);

  useEffect(() => {
    // Check premium status periodically for updates
    const checkStatus = () => {
      setPremiumStatus(checkPremiumStatus());
    };

    // Check immediately and then every 5 seconds
    checkStatus();
    const interval = setInterval(checkStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!premiumStatus.isActive) return null;

  return (
    <>
      <div style={{ position: 'relative' }}>
        <span
          className={`premium-dot ${syncState !== 'idle' ? `sync-${syncState}` : ''}`}
          onClick={() => setShowPremiumMenu(!showPremiumMenu)}
          title={`Premium: ${premiumStatus.email || 'Active'} ${syncState !== 'idle' ? ` (${syncState})` : ''}`}
          style={{
            fontSize: '8px',
            color: 'var(--signal)',
            opacity: showPremiumMenu ? 0.6 : 0.2,
            cursor: 'pointer',
            userSelect: 'none',
            padding: '2px',
            transition: 'all 0.3s ease',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '8px',
            height: '8px',
            lineHeight: '8px'
          }}
          onMouseEnter={(e) => {
            if (syncState === 'idle') { // Only apply hover effects when not animating
              (e.target as HTMLElement).style.opacity = '0.4';
              (e.target as HTMLElement).style.transform = 'scale(1.2)';
            }
          }}
          onMouseLeave={(e) => {
            if (syncState === 'idle') { // Only apply hover effects when not animating
              (e.target as HTMLElement).style.opacity = showPremiumMenu ? '0.6' : '0.2';
              (e.target as HTMLElement).style.transform = 'scale(1)';
            }
          }}
        >
          ●
        </span>

        <PremiumMenu
          show={showPremiumMenu}
          onClose={() => setShowPremiumMenu(false)}
          email={premiumStatus.email || ''}
          tier={premiumStatus.subscriptionId?.includes('foundation') ? 'foundation' : 'early_adopter'}
          data={data}
        />
      </div>

      <style>{`
        /* Photon metaphor animations */
        @keyframes syncPulse {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.05);
          }
        }

        @keyframes syncGlow {
          0% {
            opacity: 0.8;
            transform: scale(1.1);
            box-shadow: 0 0 8px var(--signal);
          }
          100% {
            opacity: 0.2;
            transform: scale(1);
            box-shadow: none;
          }
        }

        @keyframes syncError {
          0%, 100% { opacity: 0.2; }
          25%, 75% { opacity: 0.4; }
          50% { opacity: 0.2; }
        }

        @keyframes syncChecking {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.4;
          }
        }

        @keyframes syncReceiving {
          0% {
            opacity: 0.3;
            transform: scale(1);
            box-shadow: none;
          }
          30% {
            opacity: 0.6;
            transform: scale(1.2);
          }
          100% {
            opacity: 1;
            transform: scale(1);
            box-shadow: 0 0 4px rgba(0, 255, 136, 0.3);
          }
        }

        @keyframes deviceWhisper {
          0%, 100% {
            opacity: 0;
            transform: translateX(-50%) translateY(0);
          }
          50% {
            opacity: 0.3;
            transform: translateX(-50%) translateY(2px);
          }
        }

        /* Sync state classes for premium dot */
        .premium-dot.sync-syncing {
          animation: syncPulse 1.5s ease-in-out infinite;
        }

        .premium-dot.sync-success {
          animation: syncGlow 2s ease-out forwards;
        }

        .premium-dot.sync-error {
          animation: syncError 1s ease-in-out 3;
        }

        .premium-dot.sync-checking {
          animation: syncChecking 2s ease-in-out infinite;
        }

        .premium-dot.sync-receiving {
          animation: syncReceiving 0.8s ease forwards;
        }
      `}</style>
    </>
  );
}