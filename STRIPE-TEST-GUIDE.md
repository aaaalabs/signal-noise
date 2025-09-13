# Stripe Test Guide - Standard App Flow

## 🎯 Echte App-Testen mit Stripe Test-Keys

### Setup (einmalig)
```bash
# Dev-Server starten
npm run dev
```

### 🧪 Test-Szenario 1: Foundation Purchase

#### 1. App öffnen
→ `http://localhost:3000`

#### 2. Premium-Flow triggern
→ Click "Your Coach" Button (falls nicht premium)
→ Foundation Modal öffnet sich

#### 3. Test-Daten eingeben
- **Email**: `test-foundation@stripe.com`
- **Name**: `Test User` (optional)
→ Click "Continue with purchase"

#### 4. Stripe Checkout Test
- **Test Card**: `4242 4242 4242 4242`
- **Expiry**: Any future date
- **CVC**: Any 3 digits
- **ZIP**: Any postal code

#### 5. Erfolg prüfen
→ Redirect zurück zu Signal/Noise
→ Success Page sollte erscheinen
→ Foundation Counter sollte +1 sein

### 🧪 Test-Szenario 2: Foundation Limit

#### Counter auf 99 setzen
```bash
# Redis direkt setzen
redis-cli SET sn:fcount 99
```

#### Test 100. Member
- Email: `member100@test.com`
- Sollte noch Foundation Price (€29) bekommen

#### Test 101. Member
- Email: `member101@test.com`
- Sollte Early Adopter Price (€49) bekommen

### 🧪 Test-Szenario 3: Failed Payment

#### Test Decline
- **Card**: `4000 0000 0000 0002` (always declines)
- Payment sollte fehlschlagen
- Kein Foundation Counter increment
- Kein User Data gespeichert

#### Test Authentication
- **Card**: `4000 0025 0000 3155` (requires 3D Secure)
- Zusätzlicher Auth-Schritt
- Bei Success: Normal increment

### 📊 Monitoring während Tests

#### Foundation Stats checken
```bash
curl http://localhost:3000/api/foundation-stats
```

#### Redis Status checken
```bash
# Foundation Counter
redis-cli GET sn:fcount

# User Data
redis-cli HGETALL sn:u:test-foundation@stripe.com

# Alle Signal/Noise Keys
redis-cli KEYS sn:*
```

### 🎯 NPM Test Commands

```bash
# Basis-Tests (ohne Dev-Server)
npm run test:redis     # Redis operations
npm run test:stripe    # API logic
npm run test:scenarios # Edge cases

# Webhook-Tests (mit Dev-Server)
npm run test:webhook   # Simulate webhooks
```

### 🔧 Dev-Tools für Testing

#### Browser DevTools
- **Network Tab**: Checkout session creation
- **Console**: Frontend errors
- **Application**: LocalStorage premium status

#### Stripe Test Dashboard
→ `https://dashboard.stripe.com/test`
- **Payments**: Alle Test-Payments
- **Events**: Webhook events
- **Logs**: Webhook delivery

### ✅ Success Criteria

**Foundation Purchase funktioniert:**
- [x] Modal erscheint bei "Your Coach" click
- [x] Stripe Checkout Session erstellt
- [x] Test-Payment erfolgreich
- [x] Foundation Counter +1
- [x] User Premium Status gespeichert
- [x] Success Page angezeigt

**Edge Cases funktionieren:**
- [x] Foundation Limit (100 → Early Adopter)
- [x] Failed Payments (kein increment)
- [x] Duplicate Emails (update existing)

### 🚀 Production-Ready Checks

Bevor Go-Live:
1. **Stripe Keys**: Test → Live keys umstellen
2. **Webhook**: Production endpoint registrieren
3. **Real Payment**: Mit echter Kreditkarte testen
4. **Foundation Limit**: Bei 100 Members testen

**Dann ist alles ready für Production!** 🎉