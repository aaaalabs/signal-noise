
interface CommitmentModeModalProps {
  show: boolean;
  onClose: () => void;
  onActivate: () => void;

export default function CommitmentModeModal({ show, onClose, onActivate }: CommitmentModeModalProps) {

  if (!show) return null;

  const handleActivate = () => {
    // Haptic feedback
    vibrate(5);
      vibrate(15);
    onActivate();
  };

  return (
    <div
      className="modal-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        className="modal-content"
        style={{
          backgroundColor: 'var(--bg)',
          border: '1px solid #333',
          borderRadius: '12px',
          padding: '40px',
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Lock Icon */}
        <div style={{ marginBottom: '20px' }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--signal)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ margin: '0 auto' }}
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M3 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
            <path d="M9 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
            <path d="M13 11v-4a4 4 0 1 1 8 0v4" />
          </svg>
        </div>

        {/* Title */}
        <h2 style={{
          fontWeight: 300,
          fontSize: '24px',
          marginBottom: '20px',
          color: 'var(--signal)'
        }}>
          Commitment Mode
        </h2>

        {/* Achievement Progress */}
        <p style={{
          color: '#666',
          marginBottom: '20px',
          fontSize: '14px',
          fontWeight: 100
        }}>
          You've earned 6 of 8 achievements.
        </p>

        <p style={{
          color: '#999',
          marginBottom: '20px',
          fontSize: '14px',
          fontWeight: 100
        }}>
          You're ready.
        </p>

        {/* Steve Jobs Quote */}
        <div style={{ marginBottom: '30px' }}>
          <p style={{
            fontSize: '18px',
            fontWeight: 100,
            color: '#fff',
            marginBottom: '8px',
            fontStyle: 'italic'
          }}>
            "Real artists ship."
          </p>
          <p style={{
            fontSize: '12px',
            color: '#666',
            fontWeight: 100
          }}>
            — Steve Jobs
          </p>
        </div>

        {/* Explanation */}
        <p style={{
          color: '#999',
          marginBottom: '30px',
          fontSize: '14px',
          fontWeight: 100,
          lineHeight: 1.4
        }}>
          From this moment forward:<br />
          Only completed signals count.
        </p>

        {/* Buttons */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <button
            onClick={handleActivate}
            style={{
              backgroundColor: 'var(--signal)',
              color: '#000',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#00ff88';
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--signal)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            ACTIVATE FOREVER
          </button>

          <button
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              color: '#666',
              border: '1px solid #333',
              padding: '12px 24px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 300,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#555';
              e.currentTarget.style.color = '#999';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#333';
              e.currentTarget.style.color = '#666';
            }}
          >
            Not Yet
          </button>
        </div>
      </div>
    </div>
  );
