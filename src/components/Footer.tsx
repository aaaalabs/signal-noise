import { useState, useEffect } from 'react';
import AboutModal from './AboutModal';
import FAQModal from './FAQModal';
import FeedbackModal from './FeedbackModal';
import { checkPremiumStatus } from '../services/premiumService';

// Legal modals
const LegalModal = ({ show, onClose, title, children }: {
  show: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 3000,
        backdropFilter: 'blur(8px)'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--bg)',
          border: '1px solid #333',
          borderRadius: '12px',
          padding: '40px',
          maxWidth: '600px',
          width: '90%',
          maxHeight: '80vh',
          overflow: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 300, color: '#fff', margin: 0 }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#666',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '8px'
            }}
          >
            ×
          </button>
        </div>
        <div style={{ color: '#ccc', lineHeight: 1.6, fontSize: '14px' }}>
          {children}
        </div>
      </div>
    </div>
  );
};


const LegalContent = () => (
  <div>
    {/* Impressum Section */}
    <section style={{ marginBottom: '32px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 500, marginBottom: '16px', color: '#fff' }}>
        Angaben gemäß § 5 TMG
      </h3>
      <div style={{ lineHeight: 1.8 }}>
        <p><strong>Firmenname:</strong> Libra Innovation FlexCo</p>
        <p><strong>Rechtsform:</strong> Flexible Company (FlexCo)</p>
        <p>
          <strong>Firmensitz:</strong><br />
          Kristeneben 49<br />
          6094 Kristen<br />
          Österreich
        </p>
      </div>
    </section>

    <section style={{ marginBottom: '32px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 500, marginBottom: '16px', color: '#fff' }}>
        Kontakt
      </h3>
      <div style={{ lineHeight: 1.8 }}>
        <p><strong>E-Mail:</strong> kontakt@libralab.ai</p>
        <p><strong>Website:</strong> libralab.ai</p>
      </div>
    </section>

    <section style={{ marginBottom: '32px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 500, marginBottom: '16px', color: '#fff' }}>
        Geschäftsführung
      </h3>
      <div style={{ lineHeight: 1.8 }}>
        <p><strong>Geschäftsführer:</strong> Thomas Seiger & Stefan Seiger</p>
        <p><strong>Kaufmännischer Leiter:</strong> Hr. Stefan Seiger</p>
      </div>
    </section>

    <section style={{ marginBottom: '32px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 500, marginBottom: '16px', color: '#fff' }}>
        Registereintrag
      </h3>
      <div style={{ lineHeight: 1.8 }}>
        <p><strong>Firmenbuchnummer:</strong> FN 503145w</p>
        <p><strong>Firmenbuchgericht:</strong> Landesgericht Innsbruck</p>
        <p><strong>UID-Nummer:</strong> ATU74236828</p>
        <p><strong>Steuernummer:</strong> 81 417/7937</p>
      </div>
    </section>

    <section style={{ marginBottom: '48px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 500, marginBottom: '16px', color: '#fff' }}>
        Datenschutzbeauftragter
      </h3>
      <div style={{ lineHeight: 1.8 }}>
        <p><strong>Name:</strong> Thomas Seiger</p>
        <p><strong>E-Mail:</strong> privacy@libralab.ai</p>
      </div>
    </section>

    {/* Visual Separator */}
    <div style={{ borderTop: '1px solid #374151', marginBottom: '48px' }} />

    {/* Terms Section */}
    <section style={{ marginBottom: '32px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 500, marginBottom: '16px', color: '#fff' }}>
        Nutzungsbedingungen
      </h3>
      <div style={{ lineHeight: 1.8 }}>
        <p>Signal/Noise ist eine produktivitätsfokussierte Webanwendung für die persönliche Zeitverwaltung.</p>
      </div>
    </section>

    <section style={{ marginBottom: '32px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 500, marginBottom: '16px', color: '#fff' }}>
        Kostenlose Nutzung
      </h3>
      <div style={{ lineHeight: 1.8 }}>
        <p>Die Grundfunktionen der App sind dauerhaft kostenlos verfügbar. Alle Daten werden lokal in Ihrem Browser gespeichert.</p>
      </div>
    </section>

    <section style={{ marginBottom: '32px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 500, marginBottom: '16px', color: '#fff' }}>
        Premium Features
      </h3>
      <div style={{ lineHeight: 1.8 }}>
        <p>AI-Coach Funktionen sind kostenpflichtig (€29 einmalig, Foundation-Tarif). Die Zahlung erfolgt über Stripe.</p>
        <p>Widerrufsrecht gemäß § 11 FAGG: 14 Tage ab Kauf ohne Angabe von Gründen.</p>
      </div>
    </section>

    <section style={{ marginBottom: '32px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 500, marginBottom: '16px', color: '#fff' }}>
        Haftungsausschluss
      </h3>
      <div style={{ lineHeight: 1.8 }}>
        <p>Die Nutzung erfolgt auf eigene Verantwortung. Wir übernehmen keine Haftung für Datenverlust oder Produktivitätsentscheidungen.</p>
      </div>
    </section>

    <section>
      <h3 style={{ fontSize: '18px', fontWeight: 500, marginBottom: '16px', color: '#fff' }}>
        Geltendes Recht
      </h3>
      <div style={{ lineHeight: 1.8 }}>
        <p>Es gilt österreichisches Recht. Gerichtsstand ist Innsbruck.</p>
      </div>
    </section>
  </div>
);

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

export default function Footer({ onFoundationClick }: { onFoundationClick?: () => void }) {
  const [showLegal, setShowLegal] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    // Check premium status on mount and periodically
    const checkStatus = () => {
      const status = checkPremiumStatus();
      setIsPremium(status.isActive);
    };

    checkStatus();
    const interval = setInterval(checkStatus, 5000);

    // Check URL hash for privacy modal
    if (window.location.hash === '#privacy') {
      setShowPrivacy(true);
      // Clean up the hash
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <footer style={{
        padding: '30px 20px 16px',
        textAlign: 'center',
        marginTop: '40px'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          fontSize: '12px',
          color: '#666'
        }}>
          {/* Legal Links */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px'
          }}>
            <button
              onClick={() => setShowAbout(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#666',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => (e.target as HTMLButtonElement).style.color = '#999'}
              onMouseLeave={(e) => (e.target as HTMLButtonElement).style.color = '#666'}
            >
              About
            </button>
            <button
              onClick={() => setShowFAQ(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#666',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => (e.target as HTMLButtonElement).style.color = '#999'}
              onMouseLeave={(e) => (e.target as HTMLButtonElement).style.color = '#666'}
            >
              FAQ
            </button>
            <button
              onClick={() => setShowFeedback(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#666',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => (e.target as HTMLButtonElement).style.color = '#999'}
              onMouseLeave={(e) => (e.target as HTMLButtonElement).style.color = '#666'}
            >
              Feedback
            </button>
            <button
              onClick={() => setShowLegal(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#666',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => (e.target as HTMLButtonElement).style.color = '#999'}
              onMouseLeave={(e) => (e.target as HTMLButtonElement).style.color = '#666'}
            >
              Legal
            </button>
            <button
              onClick={() => setShowPrivacy(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#666',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => (e.target as HTMLButtonElement).style.color = '#999'}
              onMouseLeave={(e) => (e.target as HTMLButtonElement).style.color = '#666'}
            >
              Privacy
            </button>
          </div>

          {/* Foundation Member - Only show when not logged in */}
          {!isPremium && (
            <div
              style={{
                fontSize: '11px',
                color: '#555',
                cursor: onFoundationClick ? 'pointer' : 'default',
                transition: 'color 0.2s'
              }}
              onClick={onFoundationClick}
              onMouseEnter={(e) => onFoundationClick && (e.currentTarget.style.color = '#888')}
              onMouseLeave={(e) => onFoundationClick && (e.currentTarget.style.color = '#555')}
            >
              Foundation Member
            </div>
          )}
        </div>
      </footer>

      {/* About Modal */}
      <AboutModal show={showAbout} onClose={() => setShowAbout(false)} />

      {/* FAQ Modal */}
      <FAQModal show={showFAQ} onClose={() => setShowFAQ(false)} />

      {/* Feedback Modal */}
      <FeedbackModal show={showFeedback} onClose={() => setShowFeedback(false)} />

      {/* Legal Modal - Combined Impressum and Terms */}
      <LegalModal show={showLegal} onClose={() => setShowLegal(false)} title="Legal / Rechtliches">
        <LegalContent />
      </LegalModal>

      <LegalModal show={showPrivacy} onClose={() => setShowPrivacy(false)} title="Privacy Policy">
        <PrivacyContent />
      </LegalModal>
    </>
  );
}