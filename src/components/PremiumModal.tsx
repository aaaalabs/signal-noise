import { useState } from 'react';
import { useTranslation } from '../contexts/LanguageContext';

interface PremiumModalProps {
  show: boolean;
  onClose: () => void;
}

export default function PremiumModal({ show, onClose }: PremiumModalProps) {
  const t = useTranslation();
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);

  if (!show) return null;

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (value) {
      setIsValidEmail(validateEmail(value));
    }
  };

  const handleUpgrade = () => {
    if (!email.trim()) {
      setIsValidEmail(false);
      return;
    }

    if (!validateEmail(email)) {
      setIsValidEmail(false);
      return;
    }

    // Store email for payment link
    localStorage.setItem('premiumEmail', email);

    // Construct Stripe Payment Link with email prefill
    // For production: Replace with actual Stripe Payment Link
    const paymentUrl = `https://buy.stripe.com/test_28o3eWbxu1x4g8MaEE?prefilled_email=${encodeURIComponent(email)}`;

    // Redirect to Stripe Payment Link
    window.location.href = paymentUrl;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleUpgrade();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        backdropFilter: 'blur(8px)'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid #333',
          borderRadius: '12px',
          padding: '40px',
          maxWidth: '380px',
          width: '90%',
          textAlign: 'center'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Minimal Title */}
        <h2
          style={{
            fontSize: '24px',
            fontWeight: 300,
            color: '#fff',
            marginBottom: '8px'
          }}
        >
          {t.premiumModalTitle || (t.premiumTitle === 'Groq Intelligence' ? 'Your Coach' : t.premiumTitle)}
        </h2>

        {/* Simple Value Prop */}
        <p
          style={{
            fontSize: '14px',
            color: '#888',
            marginBottom: '32px',
            lineHeight: 1.5
          }}
        >
          {t.premiumModalDesc || 'Personal coaching with real insights from your data. €9/month.'}
        </p>

        {/* Email Input */}
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          onKeyDown={handleKeyDown}
          placeholder={t.emailPlaceholder || 'your@email.com'}
          autoFocus
          style={{
            width: '100%',
            padding: '16px',
            marginBottom: '4px',
            background: 'transparent',
            border: `1px solid ${isValidEmail ? '#333' : '#ff4444'}`,
            borderRadius: '8px',
            color: '#fff',
            fontSize: '16px',
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
        />

        {!isValidEmail && (
          <div
            style={{
              fontSize: '12px',
              color: '#ff4444',
              marginBottom: '16px',
              textAlign: 'left'
            }}
          >
            {t.emailError || 'Please enter a valid email address'}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '12px',
              background: 'transparent',
              border: '1px solid #333',
              borderRadius: '8px',
              color: '#888',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#555';
              e.currentTarget.style.color = '#aaa';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#333';
              e.currentTarget.style.color = '#888';
            }}
          >
            {t.cancelBtn || 'Cancel'}
          </button>

          <button
            onClick={handleUpgrade}
            style={{
              flex: 1,
              padding: '12px',
              background: 'var(--signal)',
              border: 'none',
              borderRadius: '8px',
              color: '#000',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,255,136,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {t.upgradeBtn || 'Upgrade'}
          </button>
        </div>
      </div>
    </div>
  );
}