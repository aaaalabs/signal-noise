import { useEffect, useState } from 'react';

interface SuccessPageProps {
  onContinue: () => void;
}

export default function SuccessPage({ onContinue }: SuccessPageProps) {
  const [sessionDetails, setSessionDetails] = useState<any>(null);

  useEffect(() => {
    // Get session ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');

    if (sessionId) {
      // Fetch session details from Stripe
      fetchSessionDetails(sessionId);
    }
  }, []);

  const fetchSessionDetails = async (sessionId: string) => {
    try {
      // In a real implementation, you'd call your backend to get session details
      // For now, just show a success message
      setSessionDetails({ tier: 'foundation', amount: 29 });
      console.log('Session ID:', sessionId); // Temporary to avoid unused warning
    } catch (error) {
      console.error('Failed to fetch session details:', error);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#000',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
      }}
    >
      <div
        style={{
          maxWidth: '28rem',
          margin: '0 auto',
          padding: '2rem',
          textAlign: 'center'
        }}
      >
        {/* Simple success indicator */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            fontSize: '4rem',
            fontWeight: '100',
            marginBottom: '1rem',
            color: '#00ff88'
          }}>✓</div>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: '300',
            marginBottom: '0.5rem'
          }}>Welcome to Signal/Noise</h1>
          <div style={{
            fontSize: '0.875rem',
            color: '#9ca3af',
            fontWeight: '300'
          }}>
            Premium access activated
          </div>
        </div>

        {/* Simple instructions */}
        <div style={{
          marginBottom: '2rem',
          fontSize: '0.875rem',
          color: '#9ca3af',
          fontWeight: '300'
        }}>
          <div style={{ marginBottom: '1rem' }}>Check your email for access instructions</div>
          <div style={{ marginBottom: '1rem' }}>Your AI Coach is ready</div>
          <div>All features unlocked</div>
        </div>

        {/* Continue button */}
        <button
          onClick={onContinue}
          style={{
            width: '100%',
            border: '1px solid #374151',
            padding: '0.75rem',
            fontSize: '0.875rem',
            fontWeight: '300',
            backgroundColor: 'transparent',
            color: '#fff',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
          }}
          onMouseOver={(e) => (e.target as HTMLElement).style.backgroundColor = '#111827'}
          onMouseOut={(e) => (e.target as HTMLElement).style.backgroundColor = 'transparent'}
        >
          Start using Signal/Noise
        </button>

        {/* Subtle foundation badge if applicable */}
        {sessionDetails?.tier === 'foundation' && (
          <div style={{
            marginTop: '1.5rem',
            fontSize: '0.75rem',
            color: '#6b7280',
            fontWeight: '300'
          }}>
            Foundation Member
          </div>
        )}
      </div>
    </div>
  );
}