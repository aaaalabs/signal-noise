import { useState } from 'react';
import { syncPremiumStatus, checkPremiumStatus } from '../services/premiumService';
import { startAutoSync } from '../services/syncService';

export default function DebugPremium() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Only show in development mode
  if (import.meta.env.MODE !== 'development') {
    return null;
  }

  const handleCheck = async () => {
    if (!email) return;

    setLoading(true);
    try {
      const serverStatus = await syncPremiumStatus(email);
      setStatus(serverStatus);

      if (serverStatus.isActive) {
        startAutoSync();
      }
    } catch (error) {
      setStatus({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
    setLoading(false);
  };

  const localStatus = checkPremiumStatus();

  return (
    <div style={{
      position: 'fixed',
      top: '60px',
      left: '20px',
      background: '#1f2937',
      border: '1px solid #374151',
      borderRadius: '8px',
      padding: '16px',
      fontSize: '12px',
      color: '#e5e7eb',
      zIndex: 999,
      maxWidth: '300px'
    }}>
      <div style={{ marginBottom: '12px', fontWeight: 'bold' }}>
        🐛 Debug Premium Status
      </div>

      <div style={{ marginBottom: '8px' }}>
        <strong>Local:</strong> {localStatus.isActive ? '✅ Active' : '❌ Inactive'}
        {localStatus.email && <div>Email: {localStatus.email}</div>}
      </div>

      <div style={{ marginBottom: '12px' }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email to check"
          style={{
            width: '100%',
            padding: '4px',
            background: '#374151',
            border: '1px solid #4b5563',
            borderRadius: '4px',
            color: '#fff',
            fontSize: '12px'
          }}
        />
      </div>

      <button
        onClick={handleCheck}
        disabled={loading || !email}
        style={{
          width: '100%',
          padding: '6px',
          background: loading ? '#6b7280' : '#059669',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          fontSize: '12px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Checking...' : 'Check Server Status'}
      </button>

      {status && (
        <div style={{ marginTop: '8px', padding: '8px', background: '#111827', borderRadius: '4px' }}>
          <pre style={{ fontSize: '10px', margin: 0, whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(status, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}