# LibraLab Store Integration Guide
## Unified Invoice & Payment System

This guide consolidates all learnings from Signal/Noise payment system implementation to enable LibraLab.ai/store to use the same unified Upstash invoice storage and Stripe webhook management system.

## Overview

The LibraLab Store will integrate with the existing unified invoice system developed for Signal/Noise, using the same Redis namespace structure, invoice generation, and Stripe webhook handling patterns.

### Core Benefits
- **Unified Invoice System**: All LibraLab projects share the same invoice storage
- **GDPR Compliance**: Token-based secure invoice access
- **Cross-Project Analytics**: Aggregate revenue and customer insights
- **Proven Architecture**: Battle-tested patterns from Signal/Noise implementation

---

## Architecture Integration

### Redis Namespace Strategy

**Existing System** (from Signal/Noise):
```
sn:fcount                    → Foundation counter (Signal/Noise specific)
sn:u:{email}                 → User premium data (Signal/Noise specific)
sn:core                      → Core stats/metadata (Signal/Noise specific)
lib:invoice:A123:token       → Secure invoices (SHARED across all LibraLab projects)
lib:ivnr                     → Invoice sequence counter (SHARED across all LibraLab projects)
```

**LibraLab Store Addition**:
```
store:u:{email}              → LibraLab Store user data
store:inventory              → Product inventory/catalog
store:orders:{orderId}       → Order management data
store:core                   → Store-specific stats
lib:invoice:A456:token       → Store invoices (same namespace as Signal/Noise)
```

### Integration Points

1. **Shared Invoice System**: Both Signal/Noise and LibraLab Store use `lib:invoice:*` namespace
2. **Independent User Management**: Each project maintains its own user namespace
3. **Unified Analytics**: Cross-project revenue aggregation through `lib:` prefix
4. **Common Infrastructure**: Same Redis helpers, Stripe webhooks, email system

---

## File Structure for LibraLab Store

### Required API Endpoints (to be created)
```
libralab/
├── api/
│   ├── store-webhook.js         # Store-specific Stripe webhook handler
│   ├── create-store-checkout.js # Store checkout session creation
│   ├── store-inventory.js       # Product catalog management
│   ├── store-orders.js          # Order management
│   ├── redis-helper.js          # Import from Signal/Noise (shared utilities)
│   ├── email-helper.js          # Import from Signal/Noise (shared email system)
│   └── invoice-secure.js        # Import from Signal/Noise (shared secure access)
```

### Shared Dependencies
- **Redis Helper**: `/signal-noise/api/redis-helper.js` (contains all invoice functions)
- **Email System**: `/signal-noise/api/email-helper.js` (Resend integration)
- **Invoice Security**: `/signal-noise/api/invoice-secure.js` (token-based access)

---

## Implementation Steps

### Step 1: Copy Shared Infrastructure

**Copy these files from Signal/Noise to LibraLab Store**:
```bash
# Core shared utilities (modify namespace prefixes as needed)
cp signal-noise/api/redis-helper.js libralab/api/
cp signal-noise/api/email-helper.js libralab/api/
cp signal-noise/api/invoice-secure.js libralab/api/
```

**Modify namespace prefixes in LibraLab's redis-helper.js**:
```javascript
// LibraLab Store-specific prefixes
const STORE_PREFIX = 'store:';

export const storeKeys = {
  user: (email) => `${STORE_PREFIX}u:${email}`,
  inventory: () => `${STORE_PREFIX}inventory`,
  order: (orderId) => `${STORE_PREFIX}orders:${orderId}`,
  core: () => `${STORE_PREFIX}core`
};

// Keep invoice functions unchanged (shared lib: namespace)
// lib:invoice:* functions remain identical to Signal/Noise
```

### Step 2: Store-Specific Webhook Handler

**Create `/libralab/api/store-webhook.js`**:
```javascript
import Stripe from 'stripe';
import {
  generateInvoiceNumber,
  setInvoice,
  generateInvoiceToken,
  setUser,
  storeKeys
} from './redis-helper.js';
import { sendOrderConfirmationEmail } from './email-helper.js';
import { Redis } from '@upstash/redis';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Stripe webhook signature verification (same pattern as Signal/Noise)
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;
    const isDev = process.env.NODE_ENV === 'development';

    if (isDev && req.body && typeof req.body === 'object') {
      event = req.body; // Skip signature verification locally
    } else {
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
      }
      const body = Buffer.concat(chunks);
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    }

    // Handle store-specific events
    switch (event.type) {
      case 'checkout.session.completed':
        await handleStoreCheckoutCompleted(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Store webhook error:', error);
    res.status(400).json({ error: error.message });
  }
}

async function handleStoreCheckoutCompleted(session) {
  const { customer_email, amount_total, metadata } = session;

  // Generate unified LibraLab invoice (same system as Signal/Noise)
  const invoiceNumber = await generateInvoiceNumber(redis);
  const invoiceToken = await generateInvoiceToken(invoiceNumber, customer_email);

  const invoiceData = {
    invoiceNumber,
    customerEmail: customer_email,
    customerName: session.customer_details?.name || customer_email,
    amount: (amount_total / 100).toString(),
    invoiceDate: new Date().toLocaleDateString('en-US'),
    paymentDate: new Date().toLocaleDateString('en-US'),
    dueDate: new Date().toLocaleDateString('en-US'),

    // Payment information
    paymentMethod: "Stripe (Kreditkarte/SEPA)",
    paymentIntentId: session.payment_intent,
    sessionId: session.id,

    // LibraLab Store classification
    type: "libralab-store",
    domain: "libralab.ai",
    tier: metadata?.product_type || "store_purchase",

    // Security & Access
    secureLink: `https://libralab.ai/invoice/secure/${invoiceToken}`,
    invoiceLink: `https://libralab.ai/invoice/secure/${invoiceToken}`,

    // Customer details
    customer: {
      email: customer_email,
      name: session.customer_details?.name || customer_email,
      company: "Privatperson",
      address: {
        country: session.customer_details?.address?.country || "Unknown"
      }
    },

    // Line items (store products)
    items: [{
      description: metadata?.product_name || "LibraLab Store Purchase",
      quantity: parseInt(metadata?.quantity || "1"),
      templateId: metadata?.product_id || "store-product",
      unitPrice: (amount_total / 100),
      totalNet: (amount_total / 100),
      totalGross: (amount_total / 100),
      vatAmount: 0,
      vatRate: 0
    }],

    // Financial totals
    subtotal: (amount_total / 100),
    totalAmount: (amount_total / 100),
    totalVat: 0
  };

  // Store invoice in unified system (lib: namespace)
  await setInvoice(redis, invoiceNumber, invoiceData, invoiceToken);

  // Store user data in store-specific namespace
  const userData = {
    email: customer_email,
    order_id: session.id,
    product_type: metadata?.product_type || 'unknown',
    status: 'completed',
    created_at: Date.now().toString(),
    payment_amount: (amount_total / 100).toString(),
    invoice_number: invoiceNumber,
    invoice_token: invoiceToken,
    invoice_date: invoiceData.invoiceDate
  };

  await setUser(redis, storeKeys.user(customer_email), userData);

  // Send order confirmation email with invoice link
  await sendOrderConfirmationEmail(customer_email, {
    customerName: invoiceData.customerName,
    productName: metadata?.product_name,
    amount: invoiceData.amount,
    invoiceNumber,
    invoiceToken
  });

  console.log(`✅ Store order completed: ${customer_email}, Invoice: ${invoiceNumber}`);
}
```

### Step 3: Store Checkout Creation

**Create `/libralab/api/create-store-checkout.js`**:
```javascript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      productName,
      productPrice,
      productId,
      quantity = 1,
      customerEmail
    } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'sepa_debit'],
      customer_email: customerEmail,
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: productName,
            metadata: {
              product_id: productId
            }
          },
          unit_amount: Math.round(productPrice * 100) // Convert to cents
        },
        quantity: quantity
      }],
      mode: 'payment',
      metadata: {
        product_name: productName,
        product_id: productId,
        product_type: 'store_purchase',
        quantity: quantity.toString()
      },
      success_url: `${req.headers.origin}/store/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/store/cancel`
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Store checkout creation error:', error);
    res.status(500).json({ error: error.message });
  }
}
```

### Step 4: Environment Variables

**Add to LibraLab `.env.local`**:
```bash
# Stripe Configuration (same as Signal/Noise)
STRIPE_SECRET_KEY=sk_test_...  # or sk_live_... for production
STRIPE_WEBHOOK_SECRET=whsec_... # Store-specific webhook secret

# Upstash Redis (shared with Signal/Noise)
UPSTASH_REDIS_URL=https://fluent-toucan-15890.upstash.io
UPSTASH_REDIS_TOKEN=...

# Email (shared with Signal/Noise)
RESEND_API_KEY=re_...
```

---

## Email Templates for Store

### Order Confirmation Email

**Add to `/libralab/api/email-helper.js`**:
```javascript
export async function sendOrderConfirmationEmail(customerEmail, orderData) {
  const { customerName, productName, amount, invoiceNumber, invoiceToken } = orderData;

  const emailContent = {
    from: 'LibraLab Store <noreply@libralab.ai>',
    to: customerEmail,
    subject: `Order Confirmation - ${productName}`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Thank you for your order!</h2>
        <p>Hi ${customerName},</p>
        <p>Your order has been confirmed and payment processed successfully.</p>

        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Order Details</h3>
          <p><strong>Product:</strong> ${productName}</p>
          <p><strong>Amount:</strong> €${amount}</p>
          <p><strong>Invoice:</strong> ${invoiceNumber}</p>
        </div>

        <p>
          <a href="https://libralab.ai/invoice/secure/${invoiceToken}"
             style="display: inline-block; background: #0066cc; color: white;
                    padding: 12px 24px; text-decoration: none; border-radius: 6px;">
            View Invoice
          </a>
        </p>

        <p>Thank you for choosing LibraLab!</p>
        <p>Best regards,<br>The LibraLab Team</p>
      </div>
    `
  };

  return await sendEmail(emailContent);
}
```

---

## Stripe Dashboard Configuration

### Webhook Setup for LibraLab Store

**Create separate webhook endpoint in Stripe Dashboard**:
- **URL**: `https://libralab.ai/api/store-webhook`
- **Events**: `checkout.session.completed`
- **Description**: "LibraLab Store Orders"

**This maintains separation from Signal/Noise webhooks while using shared infrastructure.**

---

## Analytics & Cross-Project Insights

### Unified Invoice Analytics

**The existing `getInvoiceStats()` function automatically includes LibraLab Store data**:
```javascript
// This function in redis-helper.js aggregates ALL lib:invoice:* data
const stats = await getInvoiceStats(redis);

// Results include both Signal/Noise and Store data:
// {
//   total: 150,
//   byType: {
//     "signal-noise": 45,
//     "libralab-store": 105
//   },
//   byDomain: {
//     "signal-noise.app": 45,
//     "libralab.ai": 105
//   },
//   totalRevenue: 4350,
//   recentInvoices: [...]
// }
```

### Store-Specific Analytics

**Create `/libralab/api/store-analytics.js`**:
```javascript
import { getAllInvoices } from './redis-helper.js';

export async function getStoreAnalytics(redis) {
  const allInvoices = await getAllInvoices(redis);

  // Filter for store-specific invoices
  const storeInvoices = allInvoices.filter(inv => inv.type === 'libralab-store');

  return {
    totalOrders: storeInvoices.length,
    totalRevenue: storeInvoices.reduce((sum, inv) => sum + parseFloat(inv.totalAmount || 0), 0),
    productBreakdown: storeInvoices.reduce((acc, inv) => {
      const productId = inv.items?.[0]?.templateId || 'unknown';
      acc[productId] = (acc[productId] || 0) + 1;
      return acc;
    }, {}),
    recentOrders: storeInvoices.slice(0, 10)
  };
}
```

---

## Testing & Deployment

### Development Testing

**Same patterns as Signal/Noise**:
```bash
# Terminal 1: Start LibraLab dev server
cd libralab && npm run dev

# Terminal 2: Stripe webhook listener for store
stripe listen --forward-to localhost:3000/api/store-webhook
```

### Production Deployment

1. **Deploy LibraLab Store with new API endpoints**
2. **Create production webhook in Stripe Dashboard**
3. **Test with real payment to verify invoice generation**
4. **Confirm unified analytics include store data**

---

## Key Advantages of This Integration

### 1. **Unified Customer Experience**
- Single invoice system across all LibraLab services
- Consistent invoice numbering (A1, A2, A3...)
- Same secure access patterns

### 2. **Business Intelligence**
- Cross-project revenue analytics
- Customer behavior across Signal/Noise + Store
- Unified financial reporting

### 3. **Operational Efficiency**
- Shared infrastructure reduces maintenance
- Consistent patterns across projects
- Same debugging and monitoring tools

### 4. **GDPR Compliance**
- Token-based invoice access (no predictable URLs)
- Secure customer data handling
- Unified privacy practices

---

## Migration Strategy

### Phase 1: Infrastructure Setup
- Copy shared utilities to LibraLab
- Create store-specific API endpoints
- Set up environment variables

### Phase 2: Webhook Integration
- Create store webhook handler
- Configure Stripe Dashboard
- Test payment flows

### Phase 3: Frontend Integration
- Implement checkout process
- Add order management UI
- Create customer invoice access

### Phase 4: Analytics & Monitoring
- Implement store analytics
- Set up unified reporting
- Monitor cross-project metrics

---

## Conclusion

This integration leverages all lessons learned from Signal/Noise payment system development:

- **Magic Link Authentication Patterns**: Proven timing solutions
- **Stripe Webhook Reliability**: Dual-path processing with grandfathering
- **Redis Namespace Strategy**: Clean separation with shared invoice system
- **GDPR-Compliant Invoice Access**: Token-based security
- **Production-Ready Architecture**: Battle-tested infrastructure

The result is a unified LibraLab invoice system that scales across all projects while maintaining clean separation of concerns and operational efficiency.

**Next Step**: Implement Phase 1 infrastructure setup in LibraLab Store codebase.