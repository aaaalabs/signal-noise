import { useLanguage } from '../contexts/LanguageContext';
import { useEffect } from 'react';
import { initSyncIndicator } from '../services/syncService';

export default function LanguageSwitcher() {
  const { currentLanguage, toggleLanguage } = useLanguage();

  useEffect(() => {
    // Initialize sync indicator reference after component mounts
    const timer = setTimeout(() => {
      initSyncIndicator();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      right: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      zIndex: 1
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