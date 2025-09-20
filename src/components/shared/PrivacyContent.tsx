export const PrivacyContent = () => (
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