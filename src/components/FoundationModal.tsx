import { useState, useEffect } from 'react';
import { useTranslation } from '../contexts/LanguageContext';

interface FoundationModalProps {
  show: boolean;
  onClose: () => void;
  startInLoginMode?: boolean;
}

interface FoundationStats {
  foundationMembers: number;
  spotsLeft: number;
  totalSpots: number;
  isAvailable: boolean;
  currentTier: 'foundation' | 'early_adopter';
  currentPrice: number;
}

interface UserStatus {
  exists: boolean;
  isActive: boolean;
  tier?: string;
}

export default function FoundationModal({ show, onClose, startInLoginMode = false }: FoundationModalProps) {
  const t = useTranslation();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [stats, setStats] = useState<FoundationStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [userStatus, setUserStatus] = useState<UserStatus | null>(null);
  const [checkingUser, setCheckingUser] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(false);

  useEffect(() => {
    if (show) {
      fetchFoundationStats();
      setIsLoginMode(startInLoginMode);
    }
  }, [show, startInLoginMode]);

  const fetchFoundationStats = async () => {
    // Simple: Development = preview mode, Production = live data
    if (window.location.hostname === 'localhost') {
      // Preview mode: Show what the UI looks like with realistic data
      setStats({
        foundationMembers: 12,
        spotsLeft: 88,
        totalSpots: 100,
        isAvailable: true,
        currentTier: 'foundation',
        currentPrice: 29
      });
      return;
    }

    // Production: Real Redis data
    const response = await fetch('/api/foundation-stats');
    if (!response.ok) {
      throw new Error(`Foundation stats API failed: HTTP ${response.status}`);
    }
    const data = await response.json();
    setStats(data);
  };

  const checkUserStatus = async (emailAddress: string): Promise<UserStatus | null> => {
    if (!validateEmail(emailAddress)) {
      return null;
    }

    try {
      // Use the existing verify-access endpoint to check if user exists
      const response = await fetch('/api/verify-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailAddress.trim().toLowerCase() }),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          exists: true,
          isActive: data.status === 'active',
          tier: data.tier
        };
      } else if (response.status === 404) {
        return { exists: false, isActive: false };
      } else {
        return null;
      }
    } catch (error) {
      console.error('User status check error:', error);
      return null;
    }
  };

  const sendMagicLink = async (userEmail: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/send-magic-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail.trim().toLowerCase() }),
      });

      if (response.ok) {
        setMagicLinkSent(true);
        return true;
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send magic link');
      }
    } catch (error) {
      console.error('Magic link error:', error);
      alert('Failed to send recovery link. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setUserStatus(null); // Reset user status on email change
    setMagicLinkSent(false); // Reset magic link state

    if (value) {
      setIsValidEmail(validateEmail(value));

      // Debounce user status check
      if (validateEmail(value)) {
        setCheckingUser(true);

        // Clear existing timeout
        clearTimeout((window as any)._statusCheckTimeout);

        // Set new timeout for user status check
        (window as any)._statusCheckTimeout = setTimeout(async () => {
          const status = await checkUserStatus(value);
          setUserStatus(status);
          setCheckingUser(false);
        }, 800); // 800ms debounce
      }
    } else {
      setIsValidEmail(true);
    }
  };

  const handlePurchase = async () => {
    if (!email.trim()) {
      setIsValidEmail(false);
      return;
    }

    if (!validateEmail(email)) {
      setIsValidEmail(false);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': window.location.origin
        },
        body: JSON.stringify({
          email: email.trim(),
          firstName: firstName.trim() || undefined,
          paymentType: 'foundation'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.url) {
        // Store email for premium activation after payment success
        localStorage.setItem('purchaseEmail', email.trim());

        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      setLoading(false);

      // Allow real Stripe testing in localhost with sandbox keys
      alert('Failed to start purchase. Please try again.');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePurchase();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!stats) {
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
          <div style={{ fontSize: '14px', color: '#999', fontWeight: 300 }}>
            {t.loading}
          </div>
        </div>
      </div>
    );
  }

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
          maxWidth: '420px',
          width: '90%',
          textAlign: 'center'
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Main Value Proposition */}
        <div style={{ marginBottom: isLoginMode ? '32px' : '24px' }}>
          <div
            style={{
              fontSize: '48px',
              fontWeight: 100,
              color: '#fff',
              lineHeight: '1',
              letterSpacing: '-1px',
              marginBottom: '8px'
            }}
          >
            80/20
          </div>
          {!isLoginMode && (
            <div
              style={{
                fontSize: '14px',
                color: '#999',
                fontWeight: 300
              }}
            >
              {t.foundationTagline}
            </div>
          )}
        </div>

        {/* Features - Only show in purchase mode */}
        {!isLoginMode && (
          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: '14px', color: '#ccc', fontWeight: 300, marginBottom: '8px' }}>
              {t.foundationFeature1}
            </div>
            <div style={{ fontSize: '14px', color: '#ccc', fontWeight: 300, marginBottom: '8px' }}>
              {t.foundationFeature2}
            </div>
            <div style={{ fontSize: '14px', color: '#ccc', fontWeight: 300 }}>
              {t.foundationFeature3}
            </div>
          </div>
        )}

        {/* Pricing - Only show in purchase mode */}
        {!isLoginMode && (
          <div style={{ marginBottom: '32px' }}>
            <div
              style={{
                fontSize: '32px',
                fontWeight: 100,
                color: '#fff',
                marginBottom: '4px'
              }}
            >
              €{stats.currentPrice}
            </div>
            <div
              style={{
                fontSize: '12px',
                color: '#666',
                fontWeight: 300,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              {stats.isAvailable ? t.foundationAccess : t.earlyAdopter}
            </div>
          </div>
        )}

        {/* Form */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="email"
              placeholder={t.emailPlaceholder}
              value={email}
              onChange={handleEmailChange}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: isValidEmail ? '1px solid #333' : '1px solid #ff4444',
                background: 'transparent',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 300,
                borderRadius: '6px',
                marginBottom: '12px',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#555'}
              onBlur={(e) => e.target.style.borderColor = isValidEmail ? '#333' : '#ff4444'}
              required
            />

            {/* Checking indicator */}
            {checkingUser && (
              <div style={{
                position: 'absolute',
                right: '16px',
                top: '12px',
                fontSize: '12px',
                color: '#666',
                fontWeight: 300
              }}>
                •••
              </div>
            )}
          </div>

          {/* User status feedback */}
          {userStatus && (
            <div style={{
              fontSize: '12px',
              color: userStatus.exists && userStatus.isActive ? 'var(--signal)' : '#666',
              marginBottom: '12px',
              fontWeight: 300,
              opacity: 0,
              animation: 'fadeIn 0.3s ease forwards'
            }}>
              {userStatus.exists && userStatus.isActive
                ? `${t.welcomeBack}, ${userStatus.tier === 'foundation' ? t.foundationMember : t.earlyAdopter}!`
                : userStatus.exists
                ? t.accountInactive
                : t.newMember}
            </div>
          )}

          {/* First name input - only show in purchase mode and for new users */}
          {!isLoginMode && (!userStatus?.exists || !userStatus.isActive) && !magicLinkSent && (
            <input
              type="text"
              placeholder={t.firstNamePlaceholder}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #333',
                background: 'transparent',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 300,
                borderRadius: '6px',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#555'}
              onBlur={(e) => e.target.style.borderColor = '#333'}
            />
          )}
        </div>

        {/* Action Button */}
        {magicLinkSent ? (
          // Magic link sent confirmation
          <div style={{
            textAlign: 'center',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <div style={{
              fontSize: '14px',
              color: 'var(--signal)',
              marginBottom: '8px',
              fontWeight: 300
            }}>
              {t.recoveryLinkSent}
            </div>
            <div style={{
              fontSize: '12px',
              color: '#999',
              fontWeight: 300,
              lineHeight: 1.4
            }}>
              {t.checkEmail}
            </div>
          </div>
        ) : userStatus?.exists && userStatus.isActive ? (
          // Magic link button for existing users
          <button
            onClick={() => sendMagicLink(email)}
            disabled={loading || !email.trim() || !isValidEmail}
            style={{
              width: '100%',
              padding: '12px 24px',
              background: 'var(--signal)',
              color: '#000',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: (loading || !email.trim() || !isValidEmail) ? 0.5 : 1,
              transition: 'all 0.2s ease',
              marginBottom: '20px'
            }}
          >
            {loading ? t.sending : t.sendAccessLink}
          </button>
        ) : (
          // Purchase/Login button
          <button
            onClick={isLoginMode ? () => sendMagicLink(email) : handlePurchase}
            disabled={loading || !email.trim() || !isValidEmail}
            style={{
              width: '100%',
              padding: '12px 24px',
              background: 'var(--signal)',
              color: '#000',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: (loading || !email.trim() || !isValidEmail) ? 0.5 : 1,
              transition: 'all 0.2s ease',
              marginBottom: '20px'
            }}
          >
            {loading ? t.processing : isLoginMode ? t.accessAccount : t.continuePurchase}
          </button>
        )}

        {/* Foundation Counter - Only show in purchase mode */}
        {!isLoginMode && (
          <div style={{ fontSize: '11px', color: '#555', fontWeight: 300 }}>
            {stats.isAvailable ? (
              <div>
                <div style={{ marginBottom: '8px' }}>
                  {stats.foundationMembers} of {stats.totalSpots} {t.foundationMembers}
                </div>
                <div
                  style={{
                    height: '1px',
                    background: '#222',
                    borderRadius: '1px',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      height: '1px',
                      background: '#444',
                      width: `${(stats.foundationMembers / stats.totalSpots) * 100}%`,
                      transition: 'width 0.8s ease'
                    }}
                  />
                </div>
              </div>
            ) : (
              <div>{t.foundationComplete.replace('{count}', stats.foundationMembers.toString())}</div>
            )}
          </div>
        )}

        {/* Timeline info - Only show in purchase mode */}
        {!isLoginMode && stats.isAvailable && (
          <div style={{ fontSize: '10px', color: '#444', fontWeight: 300, marginTop: '12px' }}>
            {t.foundationTimeline}
          </div>
        )}

        {/* Foundation Member identifier - Only show in login mode */}
        {isLoginMode && (
          <div style={{
            fontSize: '11px',
            color: '#555',
            fontWeight: 300,
            textAlign: 'center',
            marginBottom: '16px'
          }}>
            Foundation Member
          </div>
        )}

        {/* Ultra-minimal login toggle */}
        <div
          style={{
            fontSize: '12px',
            color: 'rgba(255,255,255,0.4)',
            marginTop: '8px',
            cursor: 'pointer',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
          onClick={() => setIsLoginMode(!isLoginMode)}
        >
          {isLoginMode ? t.newMemberToggle : t.alreadyMember}
        </div>

        <style>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-4px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </div>
  );
}