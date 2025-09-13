import { t } from '../i18n/translations';

interface OnboardingProps {
  show: boolean;
  onComplete: () => void;
}

export default function Onboarding({ show, onComplete }: OnboardingProps) {
  if (!show) return null;

  return (
    <div
      className="onboarding"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.95)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        transition: 'opacity 0.4s ease-out'
      }}
    >
      <div
        className="onboarding-content"
        style={{
          maxWidth: '400px',
          padding: '60px',
          textAlign: 'center'
        }}
      >
        <h1
          style={{
            fontSize: '48px',
            fontWeight: 200,
            letterSpacing: '0.5px',
            lineHeight: 1.4,
            marginBottom: '30px',
            color: '#00e68c'
          }}
        >
          {t.onboardingTitle}
        </h1>

        <p
          style={{
            fontSize: '16px',
            lineHeight: 1.4,
            color: '#a8a8a8',
            marginBottom: '40px'
          }}
          dangerouslySetInnerHTML={{ __html: t.onboardingText }}
        />

        <button
          onClick={onComplete}
          style={{
            background: 'transparent',
            color: '#00e68c',
            padding: '14px 28px',
            border: '1px solid #00e68c',
            borderRadius: '2px',
            fontSize: '14px',
            fontWeight: 400,
            cursor: 'pointer',
            transition: 'opacity 0.2s',
            letterSpacing: '0.3px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.8';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          {t.onboardingStart}
        </button>
      </div>
    </div>
  );
}