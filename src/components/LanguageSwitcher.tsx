import { useLanguage } from '../contexts/LanguageContext';
import { useEffect, useState } from 'react';
import { initSyncIndicator } from '../services/syncService';
import { checkPremiumStatus } from '../services/premiumService';
import PremiumMenu from './PremiumMenu';
import type { Task } from '../types';

interface LanguageSwitcherProps {
  onPremiumClick?: () => void;
  tasks?: Task[];
  currentRatio?: number;
  totalTasks?: number;
}

export default function LanguageSwitcher({ onPremiumClick, tasks = [], currentRatio = 0, totalTasks = 0 }: LanguageSwitcherProps) {
  const { currentLanguage, toggleLanguage } = useLanguage();
  const [premiumStatus, setPremiumStatus] = useState(() => checkPremiumStatus());
  const [showPremiumMenu, setShowPremiumMenu] = useState(false);

  useEffect(() => {
    // Initialize sync indicator reference after component mounts
    const timer = setTimeout(() => {
      initSyncIndicator();
    }, 100);

    return () => clearTimeout(timer);
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

  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      right: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      zIndex: 100
    }}>
      {/* Sync Indicator - Left of language switcher */}
      <span
        id="sync-indicator"
        title="Protected"
        style={{
          opacity: 0,
          transition: 'opacity 0.3s ease',
          fontSize: '12px',
          width: '12px',
          height: '14px',
          textAlign: 'center',
          lineHeight: '14px',
          color: 'var(--signal)',
          fontWeight: 400,
          userSelect: 'none',
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
        }}
      />

      {/* Premium Status Indicator */}
      {premiumStatus.isActive && (
        <div style={{ position: 'relative' }}>
          <span
            onClick={() => setShowPremiumMenu(!showPremiumMenu)}
            title={`Premium: ${premiumStatus.email || 'Active'}`}
            style={{
              fontSize: '8px',
              color: 'var(--signal)',
              opacity: showPremiumMenu ? 0.6 : 0.2,
              cursor: 'pointer',
              userSelect: 'none',
              fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '8px',
              height: '8px',
              lineHeight: '8px'
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.opacity = '0.4';
              (e.target as HTMLElement).style.transform = 'scale(1.2)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.opacity = showPremiumMenu ? '0.6' : '0.2';
              (e.target as HTMLElement).style.transform = 'scale(1)';
            }}
          >
            ●
          </span>

          <PremiumMenu
            show={showPremiumMenu}
            onClose={() => setShowPremiumMenu(false)}
            email={premiumStatus.email || ''}
            tier={premiumStatus.subscriptionId?.includes('foundation') ? 'foundation' : 'early_adopter'}
            tasks={tasks}
            currentRatio={currentRatio}
            totalTasks={totalTasks}
          />
        </div>
      )}

      {/* Language Switcher */}
      <div
        className="language-switcher"
        onClick={toggleLanguage}
        style={{
          fontSize: '14px',
          fontWeight: 100,
          color: 'rgba(255, 255, 255, 0.15)',
          opacity: 0,
          animation: 'fadeInLang 2s ease-out 1.2s forwards',
          cursor: 'pointer',
          userSelect: 'none',
          transition: 'all 0.3s ease',
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
          letterSpacing: '0.5px'
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLElement).style.color = 'rgba(255, 255, 255, 0.3)';
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLElement).style.color = 'rgba(255, 255, 255, 0.15)';
        }}
      >
        {currentLanguage.toUpperCase()}
      </div>

      <style>{`
        @keyframes fadeInLang {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .language-switcher:hover {
          transform: translateY(-1px);
        }

        .language-switcher:active {
          transform: translateY(0px);
          color: rgba(0, 255, 136, 0.4) !important;
          transition: all 0.1s ease;
        }
      `}</style>
    </div>
  );
}