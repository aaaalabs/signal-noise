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

export default function FoundationModal({ show, onClose }: FoundationModalProps) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [stats, setStats] = useState<FoundationStats | null>(null);
  const [loading, setLoading] = useState(false);

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
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      setLoading(false);

      // Dev environment - show what would happen
      if (window.location.hostname === 'localhost') {
        alert(`DEV MODE: Would redirect to Stripe checkout for ${email} - €${stats?.currentPrice || 29} Foundation`);
        return;
      }

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
        </div>

        {/* Purchase Button */}
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
      </div>
    </div>
  );
}