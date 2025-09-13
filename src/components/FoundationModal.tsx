import { useState, useEffect } from 'react';

interface FoundationModalProps {
  show: boolean;
  onClose: () => void;
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

export default function FoundationModal({ show, onClose }: FoundationModalProps) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [stats, setStats] = useState<FoundationStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [userStatus, setUserStatus] = useState<UserStatus | null>(null);
  const [checkingUser, setCheckingUser] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  useEffect(() => {
    if (show) {
      fetchFoundationStats();
    }
  }, [show]);

  const fetchFoundationStats = async () => {
    // In dev mode, skip API and use fallback immediately
    if (window.location.hostname === 'localhost') {
      setStats({
        foundationMembers: 0,
        spotsLeft: 100,
        totalSpots: 100,
        isAvailable: true,
        currentTier: 'foundation',
        currentPrice: 29
      });
      return;
    }

    try {
      const response = await fetch('/api/foundation-stats');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch foundation stats:', error);
      // Production fallback
      setStats({
        foundationMembers: 0,
        spotsLeft: 100,
        totalSpots: 100,
        isAvailable: true,
        currentTier: 'foundation',
        currentPrice: 29
      });
    }
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
            Loading...
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
        <div style={{ marginBottom: '24px' }}>
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
          <div
            style={{
              fontSize: '14px',
              color: '#999',
              fontWeight: 300
            }}
          >
            Focus on what matters
          </div>
        </div>

        {/* Features - Minimal */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '14px', color: '#ccc', fontWeight: 300, marginBottom: '8px' }}>
            AI Coach included
          </div>
          <div style={{ fontSize: '14px', color: '#ccc', fontWeight: 300, marginBottom: '8px' }}>
            Lifetime updates
          </div>
          <div style={{ fontSize: '14px', color: '#ccc', fontWeight: 300 }}>
            No subscription
          </div>
        </div>

        {/* Pricing */}
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
            {stats.isAvailable ? 'Foundation Access' : 'Early Adopter'}
          </div>
        </div>

        {/* Form */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="email"
              placeholder="your@email.com"
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
                ? `Welcome back, ${userStatus.tier === 'foundation' ? 'Foundation Member' : 'Early Adopter'}!`
                : userStatus.exists
                ? 'Account found but inactive'
                : 'New member - welcome!'}
            </div>
          )}

          {/* First name input - only show for new users or if magic link not sent */}
          {(!userStatus?.exists || !userStatus.isActive) && !magicLinkSent && (
            <input
              type="text"
              placeholder="First name (optional)"
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
              Recovery link sent!
            </div>
            <div style={{
              fontSize: '12px',
              color: '#999',
              fontWeight: 300,
              lineHeight: 1.4
            }}>
              Check your email for the access link.
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
            {loading ? 'Sending...' : 'Send access link'}
          </button>
        ) : (
          // Purchase button for new users
          <button
            onClick={handlePurchase}
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
            {loading ? 'Processing...' : 'Continue with purchase'}
          </button>
        )}

        {/* Foundation Counter - Subtle */}
        <div style={{ fontSize: '11px', color: '#555', fontWeight: 300 }}>
          {stats.isAvailable ? (
            <div>
              <div style={{ marginBottom: '8px' }}>
                {stats.foundationMembers} of {stats.totalSpots} Foundation members
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
            <div>Foundation tier complete - {stats.foundationMembers} members joined</div>
          )}
        </div>

        {/* Timeline info */}
        {stats.isAvailable && (
          <div style={{ fontSize: '10px', color: '#444', fontWeight: 300, marginTop: '12px' }}>
            Foundation pricing available through January
          </div>
        )}

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