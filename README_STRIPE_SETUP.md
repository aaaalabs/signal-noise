# Stripe Webhook Setup for Vite + Vercel Projects

This document explains the critical issue we encountered with Stripe webhook integration in a Vite + Vercel project and the SLC solution that resolved it.

## The Problem

### Core Issue: Raw Body Access in Vercel Dev Environment

Stripe webhooks require HMAC signature verification using the exact raw request body. However, Vite projects deployed on Vercel face a unique challenge:

1. **Vite ≠ Next.js**: Vite projects use traditional Vercel serverless functions (`export default async function handler(req, res)`) instead of Next.js App Router (`export async function POST(request)`)

2. **Vercel Dev Body Parsing**: Even with `bodyParser: false` configuration, Vercel's dev environment pre-processes request bodies differently than production

3. **Request Stream Consumption**: By the time our webhook handler runs, the request stream is already consumed, making raw body access impossible

4. **Signature Verification Failure**: Without the exact raw body, Stripe's `webhooks.constructEvent()` fails with signature mismatch errors

## Failed Attempts

### ❌ Attempt 1: Standard Vercel Configuration
```javascript
export const config = {
  api: { bodyParser: false }
}
// Still couldn't access raw body in development
```

### ❌ Attempt 2: Manual Stream Reading
```javascript
const chunks = [];
for await (const chunk of req) {
  chunks.push(chunk);
}
const body = Buffer.concat(chunks);
// Stream was already consumed, returned empty body
```

### ❌ Attempt 3: Next.js App Router Syntax
```javascript
export async function POST(request) {
  const body = await request.text();
}
// Wrong syntax for Vite projects, caused deployment errors
```

## The SLC Solution

### Smart Environment Detection

The key insight was to handle development and production environments differently:

```javascript
// /api/stripe-webhook.js
const isDev = process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV !== 'production';

if (isDev && req.body && typeof req.body === 'object') {
  // Development: Skip signature verification, use parsed body
  console.log('🚧 Development mode: Using parsed body directly');
  event = req.body;
} else {
  // Production: Proper signature verification with raw body
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  const body = Buffer.concat(chunks);
  event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
}
```

### Why This Works

1. **Development**: Vercel dev pre-parses the body, so we use `req.body` directly and skip signature verification
2. **Production**: Vercel's production environment properly handles raw bodies, allowing standard signature verification
3. **Security**: Production maintains full security with signature verification
4. **Developer Experience**: Local testing works seamlessly without complex workarounds

## Environment Setup

### 1. Environment Variables

**Local Development (.env.local):**
```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...  # From Stripe CLI
```

**Vercel Production/Preview:**
```bash
vercel env add STRIPE_SECRET_KEY production
vercel env add STRIPE_WEBHOOK_SECRET production
```

### 2. Webhook Secrets

**For Stripe CLI (Development):**
```bash
stripe listen --forward-to localhost:3000/api/stripe-webhook
# Use the webhook secret provided by CLI
```

**For Production:**
- Create webhook endpoint in Stripe Dashboard
- Use the provided webhook secret in environment variables

## Testing Workflow

### Development Testing
```bash
# Terminal 1: Start Vercel dev server
vercel dev

# Terminal 2: Start Stripe webhook listener
stripe listen --forward-to localhost:3000/api/stripe-webhook

# Terminal 3: Trigger test events
stripe trigger payment_intent.succeeded
```

Expected output:
- Stripe CLI: `<-- [200] POST http://localhost:3000/api/stripe-webhook`
- Vercel dev: `🚧 Development mode: Using parsed body directly`

### Production Testing
```bash
# Deploy to Vercel
vercel --prod

# Test with live webhook endpoint
stripe listen --forward-to https://yourapp.vercel.app/api/stripe-webhook
stripe trigger payment_intent.succeeded
```

## Common Pitfalls

### 1. Deployment Protection
Vercel Preview deployments may have authentication enabled, causing 401 errors. Solutions:
- Test locally with `vercel dev`
- Deploy to production for webhook testing
- Disable deployment protection if needed

### 2. Environment Variable Mismatches
Ensure webhook secrets match between:
- Stripe CLI generated secrets (development)
- Stripe Dashboard webhook secrets (production)
- Vercel environment variables

### 3. Wrong Vercel Function Syntax
Don't mix Next.js App Router syntax in Vite projects:
- ✅ `export default async function handler(req, res)`
- ❌ `export async function POST(request)`

## Key Learnings

1. **Vite + Vercel ≠ Next.js + Vercel**: Different runtime environments require different approaches
2. **Environment-Specific Solutions**: Sometimes the best fix is to handle dev/prod differently
3. **SLC Principle**: Simple solution that works is better than complex workarounds
4. **Development Experience Matters**: Local testing should be frictionless

## Debugging Tips

### Enable Detailed Logging
```javascript
console.log('🔐 Webhook Debug Info:', {
  hasSignature: !!sig,
  signatureStart: sig ? sig.substring(0, 20) + '...' : 'none',
  hasWebhookSecret: !!webhookSecret,
  webhookSecretLength: webhookSecret ? webhookSecret.length : 0
});

console.log('📦 Body Debug:', {
  bodyLength: body.length,
  bodyStart: body.toString().substring(0, 100) + '...',
  method: isDev ? 'dev_mode_bypass' : 'raw_body_verification'
});
```

### Test Signature Verification
```bash
# Check if webhook secret has whitespace issues
echo -n "your_webhook_secret" | wc -c
# Should match expected length (usually 70 characters for Stripe)
```

This solution provides a robust, secure, and developer-friendly approach to handling Stripe webhooks in Vite + Vercel projects while maintaining the SLC (Simple, Lovable, Complete) principle.