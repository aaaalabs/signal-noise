# Manual Stripe Purchase Testing Guide

## Prerequisites

### 1. Start Development Environment
```bash
# Terminal 1: Start development server
npm run dev

# Terminal 2: Start Stripe webhook listener (if testing real webhooks)
stripe listen --forward-to localhost:3000/api/stripe-webhook
```

### 2. Environment Setup
Ensure `.env.local` contains:
```bash
STRIPE_SECRET_KEY=sk_test_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...
```

## Test Scenarios

### Scenario 1: Foundation Purchase (Happy Path)

#### Step 1: Open Application
```bash
open http://localhost:3000
```

#### Step 2: Trigger Premium Purchase
1. Click "Your Coach" button (should show Foundation modal if not premium)
2. Enter test email: `test@foundation.com`
3. Click "Continue with purchase"

#### Step 3: Expected Behavior
- Redirects to Stripe Checkout
- URL should contain `checkout.stripe.com`
- Price shows €29.00 for Foundation

#### Step 4: Test Payment (Stripe Test Mode)
Use Stripe test cards:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Authentication**: `4000 0025 0000 3155`

Any future date, any 3-digit CVC, any ZIP code.

#### Step 5: Verify Results
After successful payment:
1. Should redirect back to Signal/Noise with `?session_id=...`
2. Check Foundation stats: `GET /api/foundation-stats`
3. Verify user data in Redis: `sn:u:test@foundation.com`

### Scenario 2: Foundation Limit Test

#### Setup: Fill Foundation to 99 members
```bash
node test-scenarios.js    # Fill to near limit
```

#### Test: 100th Foundation member
1. Purchase with email: `member100@test.com`
2. Should still get Foundation price (€29)
3. After purchase, Foundation should be "full"

#### Test: 101st member (Early Adopter)
1. Purchase with email: `member101@test.com`
2. Should get Early Adopter price (€49)
3. Modal should show "Early Adopter" tier

### Scenario 3: Webhook Failure Simulation

#### Test Failed Payment
1. Use declining card: `4000 0000 0000 0002`
2. Payment should fail at Stripe
3. No webhook sent = no Foundation counter increment
4. No user data should be stored

#### Test Webhook Endpoint Down
1. Stop development server during payment
2. Stripe will retry webhook multiple times
3. When server restarts, check webhook logs in Stripe dashboard

## Automated Testing

### Quick Test Suite
```bash
# Test Redis operations
npm run test:redis

# Test API logic
npm run test:stripe

# Test complete purchase flow (requires dev server)
node test-complete-purchase.js

# Test edge cases
node test-stripe-scenarios.js
```

### Stripe CLI Testing
```bash
# Test Foundation purchase webhook
stripe trigger checkout.session.completed \
  --override checkout.session.customer_email=cli-test@foundation.com \
  --override checkout.session.amount_total=2900 \
  --override checkout.session.metadata.tier=foundation

# Test Early Adopter purchase
stripe trigger checkout.session.completed \
  --override checkout.session.customer_email=cli-test@early.com \
  --override checkout.session.amount_total=4900 \
  --override checkout.session.metadata.tier=early_adopter
```

## Production Testing

### Before Go-Live Checklist

1. **Environment Variables**
   ```bash
   # Switch to production Stripe keys
   STRIPE_SECRET_KEY=sk_live_...
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
   ```

2. **Webhook Endpoint**
   ```bash
   # Create production webhook in Stripe Dashboard
   # Endpoint: https://your-domain.vercel.app/api/stripe-webhook
   # Events: checkout.session.completed
   ```

3. **Test Real Payment**
   - Use real credit card (small amount)
   - Verify Foundation counter increments
   - Check user receives access

4. **Test Edge Cases**
   - Foundation limit (100 members)
   - Duplicate email purchases
   - Failed payments
   - Webhook retries

## Monitoring & Debugging

### Check Redis Data
```bash
# Foundation counter
redis-cli GET sn:fcount

# User data
redis-cli HGETALL sn:u:test@foundation.com

# All Signal/Noise keys
redis-cli KEYS sn:*
```

### Stripe Dashboard
- **Payments**: Monitor successful/failed transactions
- **Webhooks**: Check delivery status and retries
- **Events**: View all Stripe events
- **Logs**: Debug webhook processing

### Application Logs
```bash
# API logs (if using Vercel)
vercel logs

# Local development
# Check browser console for frontend errors
# Check terminal for API errors
```

## Common Issues & Solutions

### Issue: "Foundation not available" when < 100 members
**Solution**: Check Redis `sn:fcount` value, might be null instead of 0

### Issue: User data not stored after payment
**Solution**: Check webhook is receiving `checkout.session.completed` events

### Issue: Foundation counter not incrementing
**Solution**: Verify webhook is calling `incrementFoundation()` function

### Issue: Wrong pricing tier
**Solution**: Check Foundation availability logic in `create-checkout.js`

### Issue: Webhook signature verification failed
**Solution**: Ensure `STRIPE_WEBHOOK_SECRET` matches Stripe CLI or Dashboard

## Success Criteria

✅ **Foundation Purchase Works**
- Creates Stripe checkout session
- Processes payment successfully
- Increments Foundation counter
- Stores user premium data

✅ **Edge Cases Handled**
- Foundation limit (100 → Early Adopter)
- Duplicate emails
- Failed payments
- Webhook failures

✅ **Data Consistency**
- Redis data persists correctly
- No race conditions
- Atomic counter increments
- Clean error handling

Ready for production when all scenarios pass! 🚀