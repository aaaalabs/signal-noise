# Resend Domain Setup für Signal/Noise

## Problem: Emails landen im Spam
Die Test-Emails landeten im Spam-Ordner wegen fehlender Domain-Authentifizierung.

## Lösung: Domain-Authentifizierung einrichten

### 1. **Domain in Resend Dashboard hinzufügen**
```
https://resend.com/domains
→ Add Domain
→ Enter: signal-noise.app (statt my.signal-noise.app)
```

### 2. **DNS Records hinzufügen**
Resend wird diese DNS Records bereitstellen:

#### SPF Record
```
Type: TXT
Name: @
Value: v=spf1 include:_spf.resend.com ~all
```

#### DKIM Records
```
Type: TXT
Name: resend._domainkey
Value: [wird von Resend bereitgestellt]
```

#### DMARC Record (optional aber empfohlen)
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@signal-noise.app
```

### 3. **Email-Konfiguration aktualisieren**

#### Aktuelle (problematische) Konfiguration:
```javascript
// api/email-helper.js
const SENDER_EMAIL = 'noreply@my.signal-noise.app'; // ❌ Sub-Domain
```

#### Neue (korrekte) Konfiguration:
```javascript
// api/email-helper.js
const SENDER_EMAIL = 'noreply@signal-noise.app'; // ✅ Hauptdomain
const SENDER_NAME = 'Signal/Noise';
const FROM_ADDRESS = `${SENDER_NAME} <${SENDER_EMAIL}>`;
```

### 4. **Domain-Verifizierung abwarten**
- DNS-Propagation: 24-48 Stunden
- Resend zeigt "Verified" Status an
- Erst dann Emails versenden

### 5. **Best Practices für bessere Zustellbarkeit**

#### Email-Content Optimierung:
- ✅ Plain-Text Version vorhanden
- ✅ Gute HTML-zu-Text Ratio
- ✅ Keine Spam-Trigger-Wörter
- ✅ Klare Abmelde-Links
- ❌ Zu viele Links (aktuell OK)
- ❌ Übermäßige Bilder (SVG ist OK)

#### Sender-Reputation aufbauen:
- Start mit kleinem Volumen (10-50 Emails/Tag)
- Kontinuierlich steigern über 4-6 Wochen
- Engagement-Rate beobachten (Öffnungsrate >20%)
- Bounce-Rate niedrig halten (<2%)

### 6. **Monitoring & Testing**

#### Tools für Email-Testing:
- **Mail-tester.com**: Spam-Score checken (Ziel: >8/10)
- **MXToolbox**: DNS-Records validieren
- **Google Postmaster**: Gmail-spezifische Metriken

#### Resend Analytics nutzen:
```javascript
// Email-Tracking Tags hinzufügen
tags: [
  { name: 'category', value: 'welcome' },
  { name: 'tier', value: 'foundation' },
  { name: 'version', value: 'v1' }
]
```

### 7. **Alternative: Established Domain verwenden**

Falls `signal-noise.app` nicht verfügbar:
- `libralab.ai` verwenden (bereits etabliert)
- Sender: `Signal/Noise Team <noreply@libralab.ai>`
- Bessere Reputation, sofortige Zustellbarkeit

## Nächste Schritte:
1. Domain in Resend Dashboard hinzufügen
2. DNS Records beim Domain-Provider eintragen
3. Verifizierung abwarten
4. Email-Helper aktualisieren
5. Erneute Tests durchführen

## Status Tracking:
- [ ] Domain zu Resend hinzugefügt
- [ ] DNS Records konfiguriert
- [ ] Domain verifiziert (24-48h)
- [ ] Email-Helper Code aktualisiert
- [ ] Test-Emails erfolgreich (nicht im Spam)