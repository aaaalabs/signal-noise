# Stripe CLI Testing für Signal/Noise Foundation

## Setup Stripe CLI

### Installation
```bash
# macOS
brew install stripe/stripe-cli/stripe

# Verify installation
stripe --version
```

### Login und Konfiguration
```bash
# Login to Stripe account
stripe login

# Set test mode
stripe config --set test_mode=true

# Verify connection
stripe config --list
```

## Webhook Testing mit Stripe CLI

### 1. Lokalen Webhook Endpoint starten
```bash
# Terminal 1: Start development server
npm run dev

# Terminal 2: Start Stripe webhook forwarding
stripe listen --forward-to localhost:3000/api/stripe-webhook
```

### 2. Test Events senden

#### Foundation Purchase Test
```bash
# Test successful Foundation payment
stripe trigger checkout.session.completed \
  --override checkout.session.payment_status=paid \
  --override checkout.session.customer_email=test@foundation.com \
  --override checkout.session.amount_total=2900 \
  --override checkout.session.metadata.tier=foundation \
  --override checkout.session.metadata.firstName=TestUser
```

#### Early Adopter Purchase Test
```bash
# Test successful Early Adopter payment
stripe trigger checkout.session.completed \
  --override checkout.session.payment_status=paid \
  --override checkout.session.customer_email=test@earlyadopter.com \
  --override checkout.session.amount_total=4900 \
  --override checkout.session.metadata.tier=early_adopter \
  --override checkout.session.metadata.firstName=EarlyUser
```

#### Failed Payment Test
```bash
# Test failed payment
stripe trigger checkout.session.async_payment_failed \
  --override checkout.session.customer_email=test@failed.com \
  --override checkout.session.amount_total=2900
```

### 3. Webhook Event Logs überwachen
```bash
# Monitor webhook events
stripe logs tail

# Filter for specific events
stripe logs tail --filter-event-type=checkout.session.completed
```

## Integration Testing

### Manual Test Flow
1. **Start Services**:
   ```bash
   # Terminal 1: Dev server
   npm run dev

   # Terminal 2: Stripe CLI listener
   stripe listen --forward-to localhost:3000/api/stripe-webhook
   ```

2. **Test Foundation Purchase**:
   - Open http://localhost:3000
   - Click "Your Coach" (ohne Premium)
   - Foundation Modal öffnet sich
   - Email eingeben und "Continue with purchase"
   - Stripe Checkout Session wird erstellt

3. **Simulate Payment Success**:
   ```bash
   # Use the session ID from checkout
   stripe trigger checkout.session.completed \
     --override checkout.session.id=cs_test_YOUR_SESSION_ID
   ```

4. **Verify Results**:
   - Check Foundation counter: GET /api/foundation-stats
   - Check user premium status in Redis
   - Verify success page redirect

## Environment Variables

### Required for Testing
```bash
# .env.local
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... # From stripe listen command
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...
```

### Stripe CLI Commands für Environment Setup
```bash
# Get webhook secret
stripe listen --print-secret

# Test specific webhook endpoint
stripe listen --forward-to localhost:3000/api/stripe-webhook --print-secret
```

## Debugging

### Common Issues

1. **Webhook nicht erhalten**:
   ```bash
   # Check if webhook endpoint is accessible
   curl -X POST http://localhost:3000/api/stripe-webhook \
     -H "Content-Type: application/json" \
     -d '{"test": true}'
   ```

2. **Invalid signature**:
   - Verify `STRIPE_WEBHOOK_SECRET` in .env.local
   - Use secret from `stripe listen --print-secret`

3. **Redis connection issues**:
   ```bash
   # Test Redis connection
   node test-redis.js
   ```

### Debugging Commands
```bash
# Test webhook processing
node test-stripe-webhook.js

# Test Redis operations
node test-redis.js

# Test API logic
node test-api-logic.js
```

## Test Scenarios

### Scenario 1: Foundation Member Limit
```bash
# Simulate 99 foundation members
for i in {1..99}; do
  stripe trigger checkout.session.completed \
    --override checkout.session.customer_email=user$i@test.com \
    --override checkout.session.metadata.tier=foundation
done

# Test 100th member (last Foundation spot)
stripe trigger checkout.session.completed \
  --override checkout.session.customer_email=user100@test.com \
  --override checkout.session.metadata.tier=foundation

# Test 101st member (should be Early Adopter pricing)
stripe trigger checkout.session.completed \
  --override checkout.session.customer_email=user101@test.com \
  --override checkout.session.metadata.tier=early_adopter
```

### Scenario 2: Duplicate Email
```bash
# Test same email multiple times
stripe trigger checkout.session.completed \
  --override checkout.session.customer_email=duplicate@test.com \
  --override checkout.session.metadata.tier=foundation

# Should update existing user, not increment counter
```

### Scenario 3: Error Handling
```bash
# Test missing metadata
stripe trigger checkout.session.completed \
  --override checkout.session.customer_email=error@test.com

# Test invalid tier
stripe trigger checkout.session.completed \
  --override checkout.session.customer_email=invalid@test.com \
  --override checkout.session.metadata.tier=invalid_tier
```

## Monitoring und Logs

### Webhook Event Log
- Stripe Dashboard → Developers → Webhooks → View logs
- Event status: Succeeded/Failed
- Response codes und Details

### Local Logs
```bash
# Watch API logs
tail -f api/stripe-webhook.js

# Watch Redis operations
tail -f test-redis.js

# Monitor all webhook events
stripe logs tail --format=JSON
```

## Production Testing

### Before Go-Live
1. Test with real Stripe account (not test mode)
2. Verify production webhook endpoint
3. Test with real payment methods
4. Verify VAT calculation (Austrian customers)
5. Test Foundation counter persistence

### Production Webhook Setup
```bash
# Create production webhook
stripe webhooks create \
  --url https://signal-noise.vercel.app/api/stripe-webhook \
  --events checkout.session.completed
```