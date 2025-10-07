import { useLanguage } from '../contexts/LanguageContext';
import { useState, useEffect } from 'react';

export default function LanguageSwitcher() {
  const { currentLanguage, toggleLanguage } = useLanguage();
  const [hasBeenUsed, setHasBeenUsed] = useState(false);

  // Check if language has been toggled before
  useEffect(() => {
    const used = localStorage.getItem('language_switcher_used');
    if (used === 'true') {
      setHasBeenUsed(true);
    }
  }, []);

  const handleClick = () => {
    toggleLanguage();
    if (!hasBeenUsed) {
      setHasBeenUsed(true);
      localStorage.setItem('language_switcher_used', 'true');
    }
  };

  return (
    <div
      className="language-switcher"
      onClick={handleClick}
      style={{
        fontSize: '14px',
        fontWeight: 100,
        color: hasBeenUsed ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.5)',
        opacity: 0,
        animation: 'fadeInLang 2s ease-out 1.2s forwards',
        cursor: 'pointer',
        userSelect: 'none',
        transition: 'all 0.3s ease',
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        letterSpacing: '0.5px'
      }}
      onMouseEnter={(e) => {
        (e.target as HTMLElement).style.color = 'rgba(255, 255, 255, 0.7)';
      }}
      onMouseLeave={(e) => {
        (e.target as HTMLElement).style.color = hasBeenUsed ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.5)';
      }}
    >
      {currentLanguage.toUpperCase()}

      <style>{`
        @keyframes fadeInLang {
          from {
            opacity: 0;
          }
          to {
            opacity: 0.7;
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