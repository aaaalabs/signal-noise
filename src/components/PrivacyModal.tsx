import { useEffect } from 'react';

interface PrivacyModalProps {
  show: boolean;
  onClose: () => void;
}

const PrivacyContent = () => (
  <div>
    <section style={{ marginBottom: '32px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 500, marginBottom: '16px', color: '#fff' }}>
        Datenverarbeitung
      </h3>
      <div style={{ lineHeight: 1.8 }}>
        <p>Signal/Noise ist privacy-by-design konzipiert. Ihre Produktivitätsdaten bleiben vollständig in Ihrem Browser (LocalStorage).</p>
        <p><strong>Premium Sync:</strong> Mit Premium werden Ihre Daten zusätzlich verschlüsselt über HTTPS/TLS synchronisiert,
        damit Sie sie auf mehreren Geräten nutzen können. Dabei wird Ihre E-Mail zu einem anonymen Hash umgewandelt.</p>
      </div>
    </section>

    <section style={{ marginBottom: '32px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 500, marginBottom: '16px', color: '#fff' }}>
        Keine Datensammlung
      </h3>
      <div style={{ lineHeight: 1.8 }}>
        <p>Wir sammeln keine persönlichen Daten, keine Nutzungsstatistiken und verwenden keine Tracking-Cookies.</p>
        <p><strong>Kostenlos:</strong> Ihre Tasks und Produktivitätsmuster verlassen niemals Ihr Gerät.</p>
        <p><strong>Premium:</strong> Nur bei aktiviertem Premium-Sync werden verschlüsselte Daten temporär zur Synchronisation gespeichert.</p>
      </div>
    </section>

    <section style={{ marginBottom: '32px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 500, marginBottom: '16px', color: '#fff' }}>
        AI-Coach (Premium)
      </h3>
      <div style={{ lineHeight: 1.8 }}>
        <p>Für AI-Coach Funktionen wird nur Ihr Vorname und anonymisierte Nutzungsmuster an Groq AI übertragen.</p>
        <p>Keine konkreten Tasks oder persönlichen Inhalte werden geteilt.</p>
      </div>
    </section>

    <section style={{ marginBottom: '32px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 500, marginBottom: '16px', color: '#fff' }}>
        Datenexport & Sync-Technologie
      </h3>
      <div style={{ lineHeight: 1.8 }}>
        <p><strong>Export:</strong> Sie können Ihre Daten jederzeit via Cmd+E als JSON-Datei exportieren.</p>
        <p><strong>Sync-Sicherheit:</strong> Premium-Sync nutzt Vercel KV (Redis) mit 1-Jahr-Aufbewahrung und automatischer Löschung.</p>
        <p><strong>Verschlüsselung:</strong> Datenübertragung erfolgt ausschließlich über HTTPS/TLS-verschlüsselte Verbindungen.</p>
      </div>
    </section>

    <section style={{ marginBottom: '32px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 500, marginBottom: '16px', color: '#fff' }}>
        Zahlungsdaten
      </h3>
      <div style={{ lineHeight: 1.8 }}>
        <p>Zahlungen werden über Stripe abgewickelt. Wir speichern keine Kreditkarten- oder Zahlungsdaten.</p>
        <p>Stripe Privacy Policy: <a href="https://stripe.com/privacy" style={{ color: 'var(--signal)' }}>stripe.com/privacy</a></p>
      </div>
    </section>

    <section>
      <h3 style={{ fontSize: '18px', fontWeight: 500, marginBottom: '16px', color: '#fff' }}>
        Ihre Rechte
      </h3>
      <div style={{ lineHeight: 1.8 }}>
        <p>Da wir keine persönlichen Daten speichern, entfallen die meisten DSGVO-Anfragen.</p>
        <p>Bei Fragen: privacy@libralab.ai</p>
      </div>
    </section>
  </div>
);

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