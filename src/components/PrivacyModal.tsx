import { useEffect } from 'react';
import { PrivacyContent } from './shared/PrivacyContent';

interface PrivacyModalProps {
  show: boolean;
  onClose: () => void;
}

export default function PrivacyModal({ show, onClose }: PrivacyModalProps) {
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
          maxWidth: '48rem',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
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
            marginBottom: '1.5rem',
            marginTop: '0'
          }}>
            Privacy Policy
          </h2>

          <div style={{ color: '#d1d5db', fontSize: '0.9rem', lineHeight: '1.6' }}>
            <PrivacyContent />
          </div>

          {/* Footer */}
          <div style={{
            borderTop: '1px solid #374151',
            paddingTop: '1.5rem',
            textAlign: 'center',
            marginTop: '2rem'
          }}>
            <div style={{
              color: '#9ca3af',
              fontSize: '0.8rem',
              marginBottom: '1rem'
            }}>
              Entwickelt von{' '}
              <a
                href="https://libralab.ai"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#00ff88',
                  textDecoration: 'none',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
              >
                Libralab.ai
              </a>
            </div>
            <div style={{
              color: '#6b7280',
              fontSize: '0.75rem',
              fontStyle: 'italic'
            }}>
              "Privatsphäre ist ein Grundrecht." - Signal/Noise Team
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}