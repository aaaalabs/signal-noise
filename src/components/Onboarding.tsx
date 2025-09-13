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
        backdropFilter: 'blur(10px)'
      }}
    >
      <div
        className="onboarding-content"
        style={{
          maxWidth: '400px',
          padding: '40px',
          textAlign: 'center'
        }}
      >
        <h1
          style={{
            fontSize: '48px',
            fontWeight: 100,
            marginBottom: '20px',
            color: 'var(--signal)'
          }}
        >
          {t.onboardingTitle}
        </h1>

        <p
          style={{
            fontSize: '18px',
            lineHeight: 1.6,
            color: '#999',
            marginBottom: '30px'
          }}
          dangerouslySetInnerHTML={{ __html: t.onboardingText }}
        />

        <button
          onClick={onComplete}
          style={{
            background: 'var(--signal)',
            color: '#000',
            padding: '16px 32px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {t.onboardingStart}
        </button>
      </div>
    </div>
  );
}