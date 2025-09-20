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

          {/* Android Beta Testing Call-to-Action */}
          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            backgroundColor: 'rgba(0, 255, 136, 0.05)',
            border: '1px solid rgba(0, 255, 136, 0.2)',
            borderRadius: '0.25rem'
          }}>
            <h3 style={{
              color: '#00ff88',
              fontSize: '1rem',
              fontWeight: '300',
              marginBottom: '0.5rem',
              marginTop: '0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00ff88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M4 10l0 6" />
                <path d="M20 10l0 6" />
                <path d="M7 9h10v8a1 1 0 0 1 -1 1h-8a1 1 0 0 1 -1 -1v-8a5 5 0 0 1 10 0" />
                <path d="M8 3l1 2" />
                <path d="M16 3l-1 2" />
                <path d="M9 18l0 3" />
                <path d="M15 18l0 3" />
              </svg>
              Android Beta Testers Needed
            </h3>
            <p style={{
              color: '#d1d5db',
              fontSize: '0.85rem',
              lineHeight: '1.5',
              marginBottom: '0.75rem'
            }}>
              We're looking for <strong>10 Official Android Users</strong> to test our Android App Version.
              Includes free premium trial with AI Coach and exclusive features like Widgets!
            </p>
            <p style={{
              color: '#9ca3af',
              fontSize: '0.8rem',
              fontStyle: 'italic',
              margin: '0'
            }}>
              Interested? Please drop me a DM via WhatsApp or Email above 📱
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}