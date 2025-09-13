import { useEffect, useState } from 'react';
import { activatePremium } from '../services/premiumService';
import { startAutoSync, restoreData } from '../services/syncService';

interface SuccessModalProps {
  show: boolean;
  onClose: () => void;
  sessionId?: string;
}

export default function SuccessModal({ show, onClose, sessionId }: SuccessModalProps) {
  const [sessionData, setSessionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (show && sessionId) {
      fetchSessionData();
    }
  }, [show, sessionId]);

  const fetchSessionData = async () => {
    try {
      const response = await fetch(`/api/get-session?session_id=${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setSessionData(data);
      } else {
        console.warn('Failed to fetch session data, using localStorage fallback');
      }
    } catch (error) {
      console.warn('Session fetch error, using localStorage fallback:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = async () => {
    // Get email from session data (most reliable) or localStorage fallback
    const email = sessionData?.email || localStorage.getItem('purchaseEmail');

    if (email && sessionId) {
      // Activate premium in localStorage
      activatePremium(email, sessionId);

      // BACKUP: Ensure user is created on server if webhook missed
      try {
        await ensureUserCreated(email, sessionId);
      } catch (error) {
        console.warn('Backup user creation failed (might already exist):', error);
      }

      // Clean up stored email
      localStorage.removeItem('purchaseEmail');

      // Start auto-sync for premium users
      startAutoSync();

      // Try to restore data from server (if available)
      restoreData();

      console.log('Premium activated for:', email);
    }

    onClose();
  };

  const ensureUserCreated = async (email: string, sessionId: string) => {
    // Call our backup endpoint that mimics webhook logic
    const response = await fetch('/api/ensure-user-created', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        sessionId: sessionId,
        source: 'success_modal_backup'
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return response.json();
  };

  if (!show) return null;

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
      >
        {/* Main Success Message */}
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
            Welcome
          </div>
          <div
            style={{
              fontSize: '14px',
              color: '#999',
              fontWeight: 300
            }}
          >
            Premium access activated
          </div>
        </div>

        {/* Features - Minimal */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '14px', color: '#ccc', fontWeight: 300, marginBottom: '8px' }}>
            AI Coach ready
          </div>
          <div style={{ fontSize: '14px', color: '#ccc', fontWeight: 300, marginBottom: '8px' }}>
            Data sync activated
          </div>
          <div style={{ fontSize: '14px', color: '#ccc', fontWeight: 300, marginBottom: '8px' }}>
            Export with Cmd+E
          </div>
          <div style={{ fontSize: '14px', color: '#ccc', fontWeight: 300 }}>
            Confirmation email sent
          </div>
        </div>

        {/* Continue button */}
        <button
          onClick={handleClose}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px 24px',
            background: 'var(--signal)',
            color: '#000',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          {loading ? 'Loading...' : 'Continue'}
        </button>
      </div>
    </div>
  );
}