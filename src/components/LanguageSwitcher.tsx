import { useLanguage } from '../contexts/LanguageContext';

export default function LanguageSwitcher() {
  const { currentLanguage, toggleLanguage } = useLanguage();

  return (
    <div
      className="language-switcher"
      onClick={toggleLanguage}
      style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        fontSize: '14px',
        fontWeight: 100,
        color: 'rgba(255, 255, 255, 0.15)',
        opacity: 0,
        animation: 'fadeInLang 2s ease-out 1.2s forwards',
        zIndex: 1,
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