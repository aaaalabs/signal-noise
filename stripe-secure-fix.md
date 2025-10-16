# Stripe Security Fix for LibraLab Store

## CRITICAL: Emergency Fix Required

**Date:** October 16, 2025
**Priority:** P0 - Deploy Immediately
**Affected Project:** LibraLab Store
**Vulnerable File:** `app/api/stripe/create-payment-intent.ts`

---

## The Vulnerability

**Line 109** in `create-payment-intent.ts` exposes Payment Intent client_secrets publicly:

```typescript
return NextResponse.json({
  client_secret: paymentIntent.client_secret,  // ❌ SECURITY RISK
  payment_intent_id: paymentIntent.id
});
```

**Impact:** Attackers harvest unlimited client_secrets to test stolen credit cards.

---

## Option 1: Quick Fix (Rate Limiting + CAPTCHA)

Deploy this TODAY to stop ongoing attacks while maintaining current architecture.

### Step 1: Add Rate Limiting

Create new file: `app/api/stripe/rate-limiter.ts`

```typescript
// app/api/stripe/rate-limiter.ts
const rateLimits = new Map<string, { count: number; resetAt: number }>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimits.entries()) {
    if (now > data.resetAt) {
      rateLimits.delete(ip);
    }
  }
}, 300000);

export function checkRateLimit(ip: string, maxRequests = 3, windowMs = 60000): boolean {
  const now = Date.now();
  const record = rateLimits.get(ip);

  if (!record || now > record.resetAt) {
    // New window
    rateLimits.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    // Rate limit exceeded
    return false;
  }

  // Increment count
  record.count++;
  return true;
}

export function getRateLimitInfo(ip: string): { remaining: number; resetAt: number } {
  const record = rateLimits.get(ip);
  if (!record || Date.now() > record.resetAt) {
    return { remaining: 3, resetAt: Date.now() + 60000 };
  }
  return { remaining: Math.max(0, 3 - record.count), resetAt: record.resetAt };
}
```

### Step 2: Update Payment Intent Endpoint

Replace `app/api/stripe/create-payment-intent.ts` with this secured version:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { checkRateLimit, getRateLimitInfo } from './rate-limiter';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const VAT_RATES = {
  AT: 0.20,
  DE: 0.19,
  CH: 0.00,
  DEFAULT: 0.20
} as const;

const TEMPLATE_PRICES = {
  'wien-corporate': 2417,
  'tirol-alpine': 3250,
  'steiermark-industry': 2917,
  'handwerk-classic': 2083,
  'gastgewerbe-restaurant': 3333,
  'rechtsanwalt-formal': 4167,
} as const;

// Block disposable email domains
const DISPOSABLE_EMAIL_DOMAINS = [
  'tempmail.com', 'guerrillamail.com', '10minutemail.com',
  'mailinator.com', 'throwaway.email', 'example.com'
];

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;

  const domain = email.split('@')[1]?.toLowerCase();
  return !DISPOSABLE_EMAIL_DOMAINS.some(d => domain?.includes(d));
}

interface CreatePaymentIntentRequest {
  templateId: keyof typeof TEMPLATE_PRICES;
  customerEmail: string;
  companyName: string;
  country: keyof typeof VAT_RATES;
  captchaToken?: string; // Optional for now, required in Phase 2
}

export async function POST(request: NextRequest) {
  try {
    // SECURITY: Extract client IP
    const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                     request.headers.get('x-real-ip') ||
                     'unknown';

    // SECURITY: Rate limiting (3 requests per minute per IP)
    if (!checkRateLimit(clientIP, 3, 60000)) {
      const { resetAt } = getRateLimitInfo(clientIP);
      const waitSeconds = Math.ceil((resetAt - Date.now()) / 1000);

      console.warn(`⚠️ Rate limit exceeded for IP: ${clientIP}`);

      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: `Zu viele Anfragen. Bitte versuchen Sie es in ${waitSeconds} Sekunden erneut.`,
          retry_after: waitSeconds
        },
        {
          status: 429,
          headers: {
            'Retry-After': waitSeconds.toString(),
            'X-RateLimit-Limit': '3',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': resetAt.toString()
          }
        }
      );
    }

    const body: CreatePaymentIntentRequest = await request.json();
    const { templateId, customerEmail, companyName, country } = body;

    // SECURITY: Enhanced validation
    if (!templateId || !customerEmail || !companyName || !country) {
      return NextResponse.json(
        { error: 'Missing required fields: templateId, customerEmail, companyName, country' },
        { status: 400 }
      );
    }

    // SECURITY: Email validation (block disposables)
    if (!isValidEmail(customerEmail)) {
      console.warn(`⚠️ Invalid/disposable email rejected: ${customerEmail} from IP: ${clientIP}`);
      return NextResponse.json(
        {
          error: 'Invalid email address',
          message: 'Bitte verwenden Sie eine gültige geschäftliche E-Mail-Adresse.'
        },
        { status: 400 }
      );
    }

    // SECURITY: Company name validation (minimum 2 characters)
    if (companyName.length < 2) {
      return NextResponse.json(
        { error: 'Invalid company name' },
        { status: 400 }
      );
    }

    // Get template price
    const netAmountCents = TEMPLATE_PRICES[templateId];
    if (!netAmountCents) {
      return NextResponse.json(
        { error: `Template ${templateId} not found` },
        { status: 404 }
      );
    }

    // Calculate VAT
    const vatRate = VAT_RATES[country] || VAT_RATES.DEFAULT;
    const vatAmountCents = Math.round(netAmountCents * vatRate);
    const totalAmountCents = netAmountCents + vatAmountCents;

    // Create Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmountCents,
      currency: 'eur',

      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'always'
      },

      metadata: {
        template_id: templateId,
        customer_email: customerEmail,
        company_name: companyName,
        country: country,
        business_name: process.env.BUSINESS_NAME || 'LibraLab',
        business_country: 'AT',
        product_type: 'digital_template',
        net_amount: netAmountCents.toString(),
        vat_rate: vatRate.toString(),
        vat_amount: vatAmountCents.toString(),
        created_by: 'libralab-template-store',
        client_ip: clientIP, // Track for fraud detection
        created_at: new Date().toISOString()
      },

      capture_method: 'automatic',
      confirmation_method: 'automatic',
      description: `LibraLab Template: ${templateId} für ${companyName}`,
      statement_descriptor: 'LIBRALAB TEMPLATE',
      statement_descriptor_suffix: templateId.toUpperCase().substring(0, 10),
      receipt_email: customerEmail,
      shipping: null
    });

    // SECURITY: Log creation for monitoring
    console.log(`✅ Payment Intent created: ${paymentIntent.id}, Email: ${customerEmail}, Template: ${templateId}, IP: ${clientIP}, Amount: €${totalAmountCents/100}`);

    const { remaining } = getRateLimitInfo(clientIP);

    return NextResponse.json({
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id,

      pricing: {
        net_amount: netAmountCents / 100,
        vat_rate: vatRate,
        vat_amount: vatAmountCents / 100,
        total_amount: totalAmountCents / 100,
        currency: 'EUR'
      },

      customer_context: {
        country,
        company_name: companyName,
        email: customerEmail
      }
    }, {
      headers: {
        'X-RateLimit-Limit': '3',
        'X-RateLimit-Remaining': remaining.toString()
      }
    });

  } catch (error: any) {
    console.error('❌ Payment Intent creation failed:', error);

    return NextResponse.json(
      {
        error: 'Payment initialization failed',
        message: 'Zahlung konnte nicht initialisiert werden. Bitte versuchen Sie es erneut oder kontaktieren Sie thomas@libralab.ai'
      },
      { status: 500 }
    );
  }
}
```

### Step 3: Add Monitoring (Optional but Recommended)

Create `app/api/stripe/fraud-monitor.ts`:

```typescript
// app/api/stripe/fraud-monitor.ts
interface FraudAlert {
  ip: string;
  count: number;
  lastSeen: number;
}

const fraudAlerts = new Map<string, FraudAlert>();

export function trackSuspiciousActivity(ip: string, email: string, reason: string) {
  const alert = fraudAlerts.get(ip) || { ip, count: 0, lastSeen: Date.now() };
  alert.count++;
  alert.lastSeen = Date.now();
  fraudAlerts.set(ip, alert);

  if (alert.count >= 5) {
    console.error(`🚨 FRAUD ALERT: IP ${ip} has ${alert.count} suspicious activities. Reason: ${reason}`);
    // TODO: Send email alert to admin
    // TODO: Add to IP blocklist
  }
}

export function isBlockedIP(ip: string): boolean {
  const alert = fraudAlerts.get(ip);
  return alert ? alert.count >= 10 : false;
}
```

### Step 4: Deploy Immediately

```bash
cd /Users/libra/GitHub/libralab-store
git add app/api/stripe/
git commit -m "SECURITY: Add rate limiting to prevent card testing attacks"
git push
# Deploy via Vercel dashboard or: vercel --prod
```

---

## Option 2: Best Practice Fix (Checkout Sessions)

This is the **recommended long-term solution** used by Signal/Noise. Deploy after Option 1.

### Benefits:
- ✅ No client_secret exposure
- ✅ Stripe handles all security
- ✅ PCI compliance built-in
- ✅ Better fraud detection
- ✅ Hosted payment page

### Implementation:

Replace `create-payment-intent.ts` with `create-checkout-session.ts`:

```typescript
// app/api/stripe/create-checkout-session.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { checkRateLimit } from './rate-limiter';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const VAT_RATES = {
  AT: 0.20,
  DE: 0.19,
  CH: 0.00,
  DEFAULT: 0.20
} as const;

const TEMPLATE_PRICES = {
  'wien-corporate': 2417,
  'tirol-alpine': 3250,
  'steiermark-industry': 2917,
  'handwerk-classic': 2083,
  'gastgewerbe-restaurant': 3333,
  'rechtsanwalt-formal': 4167,
} as const;

export async function POST(request: NextRequest) {
  try {
    const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';

    // Rate limiting
    if (!checkRateLimit(clientIP, 3, 60000)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { templateId, customerEmail, companyName, country } = body;

    // Validation
    if (!templateId || !customerEmail || !companyName || !country) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const netAmountCents = TEMPLATE_PRICES[templateId];
    if (!netAmountCents) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    const vatRate = VAT_RATES[country] || VAT_RATES.DEFAULT;
    const vatAmountCents = Math.round(netAmountCents * vatRate);
    const totalAmountCents = netAmountCents + vatAmountCents;

    // Get origin for redirect URLs
    const origin = request.headers.get('origin') || 'https://libralab-store.vercel.app';

    // Create Checkout Session (SECURE - no client_secret exposure)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'sepa_debit', 'sofort', 'giropay'],
      mode: 'payment',
      customer_email: customerEmail,

      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `LibraLab Template: ${templateId}`,
              description: `Professionelle Website-Vorlage für ${companyName}`,
              images: [`${origin}/templates/${templateId}/preview.png`],
            },
            unit_amount: totalAmountCents,
          },
          quantity: 1,
        },
      ],

      metadata: {
        template_id: templateId,
        customer_email: customerEmail,
        company_name: companyName,
        country: country,
        net_amount: netAmountCents.toString(),
        vat_rate: vatRate.toString(),
        vat_amount: vatAmountCents.toString(),
        client_ip: clientIP,
        created_by: 'libralab-template-store'
      },

      success_url: `${origin}/purchase/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/templates/${templateId}?cancelled=true`,

      // Austrian business config
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['AT', 'DE', 'CH']
      },
    });

    console.log(`✅ Checkout Session created: ${session.id}, Email: ${customerEmail}, Template: ${templateId}`);

    // Return only the URL - NO client_secret exposure
    return NextResponse.json({
      sessionId: session.id,
      url: session.url,  // ✅ SECURE - redirect to Stripe

      pricing: {
        net_amount: netAmountCents / 100,
        vat_rate: vatRate,
        vat_amount: vatAmountCents / 100,
        total_amount: totalAmountCents / 100,
        currency: 'EUR'
      }
    });

  } catch (error: any) {
    console.error('❌ Checkout Session creation failed:', error);
    return NextResponse.json(
      { error: 'Checkout initialization failed' },
      { status: 500 }
    );
  }
}
```

### Frontend Changes for Checkout Sessions:

```typescript
// Example: components/TemplateCheckout.tsx
async function handlePurchase() {
  const response = await fetch('/api/stripe/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      templateId: 'wien-corporate',
      customerEmail: email,
      companyName: company,
      country: 'AT'
    })
  });

  const data = await response.json();

  if (data.url) {
    // Redirect to Stripe Checkout (secure hosted page)
    window.location.href = data.url;
  }
}
```

---

## Stripe Radar Configuration

Enable automatic fraud detection in Stripe Dashboard:

### Go to: https://dashboard.stripe.com/radar/rules

### Add These Rules:

```
Block if ::card_fingerprint_count:: > 3 within 1 hour
Review if ::payment_rate:: > 5 per 10 minutes per ::ip_address::
Block if ::email:: contains "test@example.com"
Block if ::email:: contains "disposable"
Review if ::ip_country:: != ::card_country::
Block if ::risk_score:: > 75
```

### Enable Radar for Fraud Prevention:

1. Go to: https://dashboard.stripe.com/settings/radar
2. Enable "Radar for Fraud Prevention"
3. Set threshold: "Block high risk payments automatically"
4. Enable 3D Secure for EU cards

---

## API Key Rotation

**CRITICAL:** Deploy new Stripe keys to all projects using LibraStore account:

### Projects to Update:
1. **LibraLab Store** (where fix is deployed)
2. **Signal/Noise** (already has new key in `.env` line 16)
3. **mapper**
4. **libra-landing**

### Rotation Steps:

1. **Go to Stripe Dashboard:**
   - https://dashboard.stripe.com/apikeys

2. **Delete OLD Live Secret Key:**
   - Find: `sk_live_51QZlByETQ5DH8MLbVI9y...`
   - Click "Delete" → Confirm

3. **Verify NEW Key is Active:**
   - The new key from Signal/Noise `.env` line 16 should already be created
   - If not, create new restricted key with permissions:
     - ✅ Charges: Write
     - ✅ Payment Intents: Write
     - ✅ Checkout Sessions: Write
     - ❌ All other: Read only

4. **Update Environment Variables:**
   ```bash
   # For each project:
   STRIPE_SECRET_KEY=sk_live_51QZlByETQ5DH8MLb... # NEW KEY
   ```

5. **Deploy to Production:**
   - Use Vercel dashboard to update env vars
   - Or: `vercel env add STRIPE_SECRET_KEY production`
   - Redeploy: `vercel --prod`

---

## Testing the Fix

### Test Rate Limiting:

```bash
# Should succeed 3 times, then fail with 429
for i in {1..5}; do
  curl -X POST https://libralab-store.vercel.app/api/stripe/create-payment-intent \
    -H "Content-Type: application/json" \
    -d '{
      "templateId": "wien-corporate",
      "customerEmail": "test@valid-domain.com",
      "companyName": "Test Company",
      "country": "AT"
    }'
  echo "\nAttempt $i\n"
  sleep 1
done
```

### Test Email Validation:

```bash
# Should be rejected
curl -X POST https://libralab-store.vercel.app/api/stripe/create-payment-intent \
  -H "Content-Type: application/json" \
  -d '{
    "templateId": "wien-corporate",
    "customerEmail": "test@tempmail.com",
    "companyName": "Test",
    "country": "AT"
  }'
```

---

## Monitoring & Alerts

### Set up log monitoring:

```typescript
// Add to your monitoring service (Vercel Analytics, Sentry, etc.)
if (process.env.NODE_ENV === 'production') {
  console.log = (msg: string) => {
    // Send to monitoring service
    if (msg.includes('Rate limit exceeded') || msg.includes('FRAUD ALERT')) {
      // Send alert email to admin
      sendAlert(msg);
    }
  };
}
```

### Key Metrics to Track:
- Payment Intent creation rate (should drop from 100+/hour to <10/hour)
- Rate limit hits per IP (should be <5% of requests)
- Email validation rejections (track disposable domain attempts)
- Geographic patterns (alert on unusual countries)

---

## Deployment Checklist

- [ ] **Option 1 deployed** (Rate limiting + validation)
- [ ] **Rate limiter tested** (3 req/min limit works)
- [ ] **Email validation tested** (disposables blocked)
- [ ] **Stripe keys rotated** (old key deleted, new key active)
- [ ] **All 4 projects updated** (mapper, libra-landing, signal-noise, libralab-store)
- [ ] **Stripe Radar enabled** (fraud rules active)
- [ ] **Monitoring configured** (alerts for suspicious activity)
- [ ] **Documentation updated** (team knows about new security measures)
- [ ] **Stripe support notified** (explain fix and key rotation)

---

## Timeline

| Action | Priority | Time Estimate |
|--------|----------|---------------|
| Deploy Option 1 (Rate Limiting) | P0 - CRITICAL | 30 minutes |
| Rotate Stripe keys | P0 - CRITICAL | 15 minutes |
| Enable Stripe Radar | P1 - HIGH | 10 minutes |
| Update all 4 projects | P1 - HIGH | 30 minutes |
| Test deployment | P1 - HIGH | 20 minutes |
| Notify Stripe support | P2 - MEDIUM | 10 minutes |
| Deploy Option 2 (Checkout Sessions) | P3 - LOW | 2-4 hours |

**Total time for critical fixes:** ~1.5 hours

---

## Questions?

Contact: thomas@libralab.ai
Stripe Support: Already contacted, waiting for response
Documentation: STRIPE-ATTACK-ROOT-CAUSE.md

---

**Last Updated:** October 16, 2025
**Status:** Ready for deployment
**Risk Level After Fix:** LOW (attacks will be blocked)
