interface SuccessModalProps {
  show: boolean;
  onClose: () => void;
}

export default function SuccessModal({ show, onClose }: SuccessModalProps) {
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
            Confirmation email sent
          </div>
          <div style={{ fontSize: '14px', color: '#ccc', fontWeight: 300 }}>
            All features unlocked
          </div>
        </div>

        {/* Continue button */}
        <button
          onClick={onClose}
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
          Continue
        </button>
      </div>
    </div>
  );
}