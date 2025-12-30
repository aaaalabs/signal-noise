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
  firstName?: string;
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
  const [promoCode, setPromoCode] = useState('');
  const [promoActivated, setPromoActivated] = useState(false);

  useEffect(() => {
    if (show) {
      fetchFoundationStats();
      setIsLoginMode(startInLoginMode);
    }
  }, [show, startInLoginMode]);

  const handlePromoCode = async () => {
    if (promoCode.toUpperCase().trim() === 'PH-PRELAUNCH') {
      setLoading(true);

      try {
        // Create proper Redis user account with magic link
        const response = await fetch('/api/auth/create-promo-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email.trim(),
            firstName: firstName.trim(),
            promoCode: promoCode.toUpperCase().trim(),
            tier: 'ph_prelaunch'
          }),
        });

        if (response.ok) {
          const result = await response.json();
          console.log('✅ Promo user created:', result);

          setPromoActivated(true);
          setLoading(false);

          // Set to magic link sent state (user will receive email)
          setTimeout(() => {
            setMagicLinkSent(true);
          }, 1000);

        } else {
          const error = await response.json();
          console.error('❌ Promo activation failed:', error);
          alert('Promo code activation failed. Please try again.');
          setLoading(false);
        }
      } catch (error) {
        console.error('❌ Promo code error:', error);
        alert('Network error. Please try again.');
        setLoading(false);
      }
    } else {
      alert('Invalid promo code. Try "PH-PRELAUNCH"');
    }
  };

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
      // Check if user exists in Redis (just for pricing display)
      const response = await fetch(`/api/check-premium?email=${encodeURIComponent(emailAddress.trim().toLowerCase())}`, {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        return {
          exists: data.isActive, // User exists if they have active premium
          isActive: data.isActive,
          tier: data.tier, // Use correct tier field from database
          firstName: data.firstName // Add firstName for personalized greeting
        };
      } else {
        // For non-200 responses, assume user doesn't exist (new user)
        return { exists: false, isActive: false };
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

    // Check if in waitlist mode
    const isWaitlistMode = import.meta.env.VITE_WAITLIST_MODE === 'true';

    if (isWaitlistMode) {
      // Waitlist mode: Join beta list
      try {
        const response = await fetch('/api/waitlist-join', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email.trim(),
            firstName: firstName.trim() || ''
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        // Show success state
        setMagicLinkSent(true);
        setLoading(false);

        // Store position for display
        if (data.position) {
          localStorage.setItem('waitlistPosition', data.position.toString());
        }

      } catch (error) {
        console.error('Waitlist join error:', error);
        setLoading(false);
        alert('Failed to join waitlist. Please try again.');
      }
      return;
    }

    // Original payment flow
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

  // Minimal promo email verification modal (Jony Ive style)
  if (promoActivated && magicLinkSent) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          backdropFilter: 'blur(12px)'
        }}
        onClick={onClose}
      >
        <div
          style={{
            background: '#000',
            border: '1px solid #333',
            borderRadius: '16px',
            padding: '48px 32px',
            maxWidth: '320px',
            width: '90%',
            textAlign: 'center'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Clean header */}
          <div style={{
            fontSize: '24px',
            fontWeight: 300,
            color: '#fff',
            marginBottom: '32px',
            letterSpacing: '1px'
          }}>
            {import.meta.env.VITE_WAITLIST_MODE === 'true' ? `You're on the list!` : 'Check Your Email'}
          </div>

          {/* User's email confirmation */}
          <div style={{
            fontSize: '14px',
            color: '#00ff88',
            marginBottom: '16px',
            fontWeight: 300,
            padding: '12px 16px',
            background: 'rgba(0, 255, 136, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(0, 255, 136, 0.2)'
          }}>
            {email}
          </div>

          {/* Simple explanation */}
          <div style={{
            fontSize: '13px',
            color: '#888',
            lineHeight: '1.5',
            marginBottom: '32px'
          }}>
            {import.meta.env.VITE_WAITLIST_MODE === 'true' ? (
              <>
                You're #{localStorage.getItem('waitlistPosition') || '?'} of 15 beta testers.<br/>
                We'll reach out when beta testing begins.
              </>
            ) : (
              <>
                We sent your premium access link.<br/>
                Click it to activate your Signal/Noise cloud account.
              </>
            )}
          </div>

          {/* Clean close */}
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: '1px solid #333',
              color: '#666',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 400,
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

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
              {import.meta.env.VITE_WAITLIST_MODE === 'true' ? 'Join 15 Beta Testers' : t.foundationTagline}
            </div>
          )}
        </div>

        {/* Features / Beta Benefits - Only show in purchase mode */}
        {!isLoginMode && (
          <div style={{ marginBottom: '32px' }}>
            {import.meta.env.VITE_WAITLIST_MODE === 'true' ? (
              <>
                <div style={{ fontSize: '14px', color: '#ccc', fontWeight: 300, marginBottom: '8px' }}>
                  ✓ Shape the future of Signal/Noise
                </div>
                <div style={{ fontSize: '14px', color: '#ccc', fontWeight: 300, marginBottom: '8px' }}>
                  ✓ Free lifetime access after beta
                </div>
                <div style={{ fontSize: '14px', color: '#ccc', fontWeight: 300 }}>
                  ✓ Direct feedback channel with founders
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: '14px', color: '#ccc', fontWeight: 300, marginBottom: '8px' }}>
                  {t.foundationFeature1}
                </div>
                <div style={{ fontSize: '14px', color: '#ccc', fontWeight: 300, marginBottom: '8px' }}>
                  {t.foundationFeature2}
                </div>
                <div style={{ fontSize: '14px', color: '#ccc', fontWeight: 300 }}>
                  {t.foundationFeature3}
                </div>
              </>
            )}
          </div>
        )}

        {/* Pricing / Waitlist Counter - Only show in purchase mode */}
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
              {import.meta.env.VITE_WAITLIST_MODE === 'true' ? 'Free Beta' : `€${stats.currentPrice}`}
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
                ? `${t.welcomeBack}${userStatus.firstName ? `, ${userStatus.firstName}` : ''} - ${userStatus.tier === 'foundation' ? t.foundationMember : t.earlyAdopter}!`
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
                outline: 'none',
                marginBottom: '12px'
              }}
              onFocus={(e) => e.target.style.borderColor = '#555'}
              onBlur={(e) => e.target.style.borderColor = '#333'}
            />
          )}

          {/* Promo Code Section - only show in purchase mode for new users (not in waitlist mode) */}
          {!isLoginMode && import.meta.env.VITE_WAITLIST_MODE !== 'true' && (!userStatus?.exists || !userStatus.isActive) && !magicLinkSent && (
            <div style={{ marginBottom: '16px' }}>
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Promo code (optional)"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: '#222',
                  border: '1px solid #333',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 300,
                  marginBottom: '8px',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#555'}
                onBlur={(e) => e.target.style.borderColor = '#333'}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && promoCode.trim()) {
                    handlePromoCode();
                  }
                }}
              />
              {promoCode.trim() && !promoActivated && (
                <button
                  onClick={handlePromoCode}
                  disabled={loading || !email.trim()}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: '#00ff88',
                    color: '#000',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading || !email.trim() ? 0.5 : 1
                  }}
                >
                  {loading ? 'Activating...' : 'Apply Promo Code'}
                </button>
              )}
            </div>
          )}

          {/* Promo Success Message - Jony Ive conscious transition */}
          {promoActivated && !magicLinkSent && (
            <div style={{
              background: 'rgba(0, 255, 136, 0.1)',
              border: '1px solid #00ff88',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              <div style={{ color: '#00ff88', fontWeight: '500', marginBottom: '8px', fontSize: '16px' }}>
                🎉 Product Hunt Access Granted!
              </div>
              <div style={{ color: '#ccc', fontSize: '13px', marginBottom: '12px', lineHeight: '1.4' }}>
                You now have premium access until October 31st, including:<br/>
                AI Coach • Cloud Sync • Premium Analytics
              </div>
              <div style={{ color: '#888', fontSize: '11px' }}>
                Check your email for secure cloud access
              </div>
            </div>
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
            {loading ? t.processing : isLoginMode ? t.accessAccount : (import.meta.env.VITE_WAITLIST_MODE === 'true' ? 'Join Beta Waitlist' : t.continuePurchase)}
          </button>
        )}

        {/* Foundation Counter / Beta Counter - Only show in purchase mode */}
        {!isLoginMode && import.meta.env.VITE_WAITLIST_MODE !== 'true' && (
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

        {/* Timeline info - Only show in purchase mode (not in waitlist mode) */}
        {!isLoginMode && import.meta.env.VITE_WAITLIST_MODE !== 'true' && stats.isAvailable && (
          <div style={{ fontSize: '10px', color: '#444', fontWeight: 300, marginTop: '12px' }}>
            {t.foundationTimeline}
          </div>
        )}

        {/* Foundation Member / Beta identifier - Only show in login mode */}
        {isLoginMode && import.meta.env.VITE_WAITLIST_MODE !== 'true' && (
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