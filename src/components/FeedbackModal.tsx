import { useEffect } from 'react';

interface FeedbackModalProps {
  show: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ show, onClose }: FeedbackModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (show) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [show, onClose]);

  if (!show) return null;

  const handleWhatsApp = () => {
    const message = encodeURIComponent('Hi! I\'m using Signal/Noise and wanted to share some feedback about...');
    const whatsappUrl = `https://wa.me/436601238172?text=${message}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleEmail = () => {
    const subject = encodeURIComponent('Signal/Noise Feedback');
    const mailtoUrl = `mailto:feedback@signal-noise.app?subject=${subject}`;
    window.location.href = mailtoUrl;
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
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
        padding: '1rem'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#111827',
          border: '1px solid #374151',
          maxWidth: '24rem',
          width: '100%',
          position: 'relative',
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            color: '#9ca3af',
            fontSize: '1.5rem',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          ×
        </button>

        {/* Content */}
        <div style={{ padding: '2rem' }}>
          <h2 style={{
            color: '#fff',
            fontSize: '1.5rem',
            fontWeight: '300',
            marginBottom: '0.5rem',
            marginTop: '0'
          }}>
            Feedback
          </h2>

          <p style={{
            color: '#d1d5db',
            fontSize: '0.9rem',
            marginBottom: '1.5rem'
          }}>
            Your insights shape this tool
          </p>

          <div style={{
            borderTop: '1px solid #374151',
            paddingTop: '1.5rem',
            marginBottom: '1.5rem'
          }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* WhatsApp Option */}
            <button
              onClick={handleWhatsApp}
              style={{
                background: 'none',
                border: '1px solid #374151',
                padding: '0.75rem 1rem',
                borderRadius: '0.25rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#00ff88';
                e.currentTarget.style.backgroundColor = 'rgba(0, 255, 136, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#374151';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <span style={{
                color: '#fff',
                fontSize: '0.9rem',
                marginBottom: '0.25rem',
                fontWeight: '300'
              }}>
                WhatsApp
              </span>
              <span style={{
                color: '#9ca3af',
                fontSize: '0.8rem',
                fontWeight: '100'
              }}>
                +43 660 1238172
              </span>
            </button>

            {/* Email Option */}
            <button
              onClick={handleEmail}
              style={{
                background: 'none',
                border: '1px solid #374151',
                padding: '0.75rem 1rem',
                borderRadius: '0.25rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#00ff88';
                e.currentTarget.style.backgroundColor = 'rgba(0, 255, 136, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#374151';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <span style={{
                color: '#fff',
                fontSize: '0.9rem',
                marginBottom: '0.25rem',
                fontWeight: '300'
              }}>
                Email
              </span>
              <span style={{
                color: '#9ca3af',
                fontSize: '0.8rem',
                fontWeight: '100'
              }}>
                feedback@signal-noise.app
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}