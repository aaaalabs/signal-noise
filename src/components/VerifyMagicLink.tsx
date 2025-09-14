import { useState, useEffect, useCallback } from 'react';
import { activatePremiumSession, type SessionData } from '../services/premiumService';

interface VerifyMagicLinkProps {
  token: string;
  onSuccess: (sessionData?: SessionData) => void;
  onError: () => void;
}

interface VerificationResult {
  success: boolean;
  session?: SessionData;
  error?: string;
  message?: string;
}

export default function VerifyMagicLink({ token, onSuccess, onError }: VerifyMagicLinkProps) {
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);

  const verifyMagicLink = useCallback(async () => {
    try {
      const response = await fetch(`/api/auth/verify-magic-link?token=${encodeURIComponent(token)}`);
      const data: VerificationResult = await response.json();

      if (data.success && data.session) {
        // Store session data using new session management
        activatePremiumSession(data.session);

        setSuccess(true);
        setIsVerifying(false);

        // Auto-redirect after 2 seconds
        setTimeout(() => {
          onSuccess(data.session);
        }, 2000);
      } else {
        throw new Error(data.error || data.message || 'Verification failed');
      }
    } catch (err) {
      console.error('Magic link verification failed:', err);
      setError(err instanceof Error ? err.message : 'Verification failed');
      setIsVerifying(false);

      // Auto-redirect to error state after 3 seconds
      setTimeout(() => {
        onError();
      }, 3000);
    }
  }, [token, onSuccess, onError]);

  useEffect(() => {
    verifyMagicLink();
  }, [verifyMagicLink]);

  return (
    <div className="container" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      textAlign: 'center'
    }}>
      {isVerifying && (
        <>
          <div className="loading-spinner" style={{
            width: '32px',
            height: '32px',
            border: '3px solid var(--surface)',
            borderTop: '3px solid var(--signal)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '24px'
          }} />
          <h2 style={{
            fontSize: '18px',
            fontWeight: '300',
            margin: '0 0 12px 0',
            color: 'var(--text)'
          }}>
            Verifying your access...
          </h2>
          <p style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            margin: 0
          }}>
            Please wait while we verify your premium access.
          </p>
        </>
      )}

      {success && (
        <>
          <div style={{
            width: '48px',
            height: '48px',
            backgroundColor: 'var(--signal)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
            fontSize: '24px'
          }}>
            ✓
          </div>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '300',
            margin: '0 0 12px 0',
            color: 'var(--text)'
          }}>
            Premium Access Verified!
          </h2>
          <p style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            margin: '0 0 16px 0'
          }}>
            Your premium features have been activated.
          </p>
          <p style={{
            fontSize: '12px',
            color: 'var(--text-secondary)',
            margin: 0
          }}>
            Redirecting to Signal/Noise...
          </p>
        </>
      )}

      {error && (
        <>
          <div style={{
            width: '48px',
            height: '48px',
            backgroundColor: '#ff4757',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
            fontSize: '24px'
          }}>
            ✗
          </div>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '300',
            margin: '0 0 12px 0',
            color: 'var(--text)'
          }}>
            Verification Failed
          </h2>
          <p style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            margin: '0 0 16px 0'
          }}>
            {error}
          </p>
          <p style={{
            fontSize: '12px',
            color: 'var(--text-secondary)',
            margin: 0
          }}>
            Returning to Signal/Noise...
          </p>
        </>
      )}

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}