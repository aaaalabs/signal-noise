# LibraLab Invoice Schema Documentation

## Overview

This document defines the unified invoice schema used across LibraLab projects for storing payment and invoice data in Upstash Redis. The schema is designed to be compatible across multiple payment systems (Stripe, PayPal, bank transfers, etc.) while maintaining GDPR compliance through secure token-based access.

## Redis Database Connection

### Upstash Redis Configuration
```javascript
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});
```

### Environment Variables Required
```bash
KV_REST_API_URL=https://[your-database-url].upstash.io
KV_REST_API_TOKEN=[your-redis-token]
```

## Key Structure & Namespacing

### LibraLab Invoice Keys
```
lib:invoice:A[number]            # Legacy format (backward compatibility)
lib:invoice:A[number]:[TOKEN]    # Secure format with embedded token
lib:ivnr                        # Invoice sequence counter
```

### Project-Specific Keys
```
sn:u:[email]                    # Signal/Noise user data
sn:fcount                       # Signal/Noise Foundation counter
sn:core                         # Signal/Noise core stats
```

## Invoice Data Schema

### Core Invoice Structure
```javascript
const invoiceData = {
  // Basic Invoice Information
  invoiceNumber: string,          // "A123" format
  customerEmail: string,          // Primary customer identifier
  customerName: string,           // Display name or email fallback
  amount: string,                 // Total amount as string (e.g., "29.00")
  invoiceDate: string,           // MM/DD/YYYY format
  paymentDate: string,           // MM/DD/YYYY format
  dueDate: string,               // MM/DD/YYYY format

  // Payment & Session Information
  paymentMethod: string,          // "Stripe (Kreditkarte/SEPA)", "PayPal", "Bank Transfer"
  paymentIntentId: string,        // Payment system transaction ID
  sessionId: string,              // Checkout session ID (if applicable)

  // Project Classification
  type: string,                   // Project type: "signal-noise", "libralab", etc.
  domain: string,                 // "signal-noise.app", "libralab.at", etc.
  tier: string,                   // "foundation", "early_adopter", "premium", etc.

  // Security & Access
  secureLink: string,             // "https://domain.com/invoice/secure/[TOKEN]"
  invoiceLink: string,            // Same as secureLink (GDPR compliance)

  // Customer Details (Expanded)
  customer: {
    email: string,
    name: string,
    company: string,              // "Privatperson" for individuals
    address: {
      country: string,            // "Austria", "Germany", "Unknown"
      // Additional address fields as needed
    }
  },

  // Line Items
  items: [{
    description: string,          // "Signal/Noise Premium: foundation"
    quantity: number,             // Usually 1
    templateId: string,           // "signal-noise-foundation"
    unitPrice: number,            // Price per unit
    totalNet: number,             // Net total (before VAT)
    totalGross: number,           // Gross total (after VAT)
    vatAmount: number,            // VAT amount
    vatRate: number               // VAT percentage (0-100)
  }],

  // Financial Totals
  subtotal: number,               // Sum of line items (net)
  totalAmount: number,            // Final total amount
  totalVat: number                // Total VAT amount
};
```

## Helper Functions for Redis Operations

### Import Statement
```javascript
import {
  generateInvoiceNumber,
  setInvoice,
  getInvoice,
  getInvoiceByToken,
  generateInvoiceToken
} from './redis-helper.js';
```

### Core Invoice Operations

#### Generate Invoice Number
```javascript
const invoiceNumber = await generateInvoiceNumber(redis);
// Returns: "A1", "A2", "A3", etc.
// Uses Redis counter at key: lib:ivnr
```

#### Store Invoice with Token Security
```javascript
// Generate secure token
const invoiceToken = await generateInvoiceToken(invoiceNumber, customerEmail);

// Store invoice with embedded token in key
await setInvoice(redis, invoiceNumber, invoiceData, invoiceToken);
// Creates key: lib:invoice:A123:[TOKEN]
```

#### Retrieve Invoice (Dual-Pattern Support)
```javascript
// By invoice number (supports both legacy and token formats)
const invoice = await getInvoice(redis, "A123");

// By secure token (GDPR-compliant access)
const invoice = await getInvoiceByToken(redis, token);
```

#### Generate Secure Token
```javascript
const token = await generateInvoiceToken(invoiceNumber, customerEmail);
// Returns: 32-character SHA256 hash based on invoice + email + timestamp
```

## Payment System Integration Examples

### Stripe Checkout Integration
```javascript
// In stripe-webhook.js
async function handleCheckoutCompleted(session) {
  const { customer_email, amount_total, metadata } = session;

  // Generate invoice
  const invoiceNumber = await generateInvoiceNumber(redis);
  const invoiceToken = await generateInvoiceToken(invoiceNumber, customer_email);

  const invoiceData = {
    invoiceNumber,
    customerEmail: customer_email,
    amount: (amount_total / 100).toString(), // Convert from cents
    paymentMethod: "Stripe (Kreditkarte/SEPA)",
    paymentIntentId: session.payment_intent,
    sessionId: session.id,
    type: metadata?.tier || "unknown",
    domain: "signal-noise.app",
    tier: metadata?.tier || "early_adopter",
    secureLink: `https://signal-noise.app/invoice/secure/${invoiceToken}`,
    // ... rest of invoice data
  };

  // Store with embedded token
  await setInvoice(redis, invoiceNumber, invoiceData, invoiceToken);
}
```

### PayPal Integration Template
```javascript
// In paypal-webhook.js
async function handlePayPalPayment(paymentData) {
  const invoiceNumber = await generateInvoiceNumber(redis);
  const invoiceToken = await generateInvoiceToken(invoiceNumber, paymentData.payer.email_address);

  const invoiceData = {
    invoiceNumber,
    customerEmail: paymentData.payer.email_address,
    amount: paymentData.amount.value,
    paymentMethod: "PayPal",
    paymentIntentId: paymentData.id,
    sessionId: paymentData.id,
    type: "signal-noise",
    domain: "signal-noise.app",
    // ... rest of invoice data
  };

  await setInvoice(redis, invoiceNumber, invoiceData, invoiceToken);
}
```

### Bank Transfer Integration Template
```javascript
// In bank-transfer-handler.js
async function processBankTransfer(transferData) {
  const invoiceNumber = await generateInvoiceNumber(redis);
  const invoiceToken = await generateInvoiceToken(invoiceNumber, transferData.customerEmail);

  const invoiceData = {
    invoiceNumber,
    customerEmail: transferData.customerEmail,
    amount: transferData.amount,
    paymentMethod: "Bank Transfer (SEPA)",
    paymentIntentId: transferData.referenceNumber,
    sessionId: transferData.referenceNumber,
    type: "signal-noise",
    domain: "signal-noise.app",
    // ... rest of invoice data
  };

  await setInvoice(redis, invoiceNumber, invoiceData, invoiceToken);
}
```

## User Data Integration

### Storing User Premium Status
```javascript
import { setUser } from './redis-helper.js';

const userData = {
  email: customer_email,
  access_token: 'snk_' + randomBytes(32).toString('hex'),
  payment_type: 'lifetime', // or 'subscription'
  tier: 'foundation',
  status: 'active',
  created_at: Date.now().toString(),
  expires_at: '0', // 0 = lifetime access
  payment_amount: amount.toString(),
  invoice_number: invoiceNumber,
  invoice_token: invoiceToken,
  invoice_date: invoiceDate
};

await setUser(redis, customer_email, userData);
```

## Security & GDPR Compliance

### Secure Invoice Access Only
```javascript
// ✅ SECURE: Token-based access
app.get('/api/invoice-secure', async (req, res) => {
  const { token } = req.query;
  const invoice = await getInvoiceByToken(redis, token);
  return res.json(invoice);
});

// ❌ INSECURE: Predictable invoice number access (deprecated)
// app.get('/api/invoice/:number', ...) // REMOVED for GDPR compliance
```

### Token Generation Security
- Uses SHA256 hash of `invoiceNumber:customerEmail:timestamp`
- 32-character hex string output
- Unpredictable without knowing all inputs
- Single-use recommended for maximum security

## Data Aggregation & Analytics

### LibraLab Invoice Statistics
```javascript
import { getAllInvoices, getInvoiceStats } from './redis-helper.js';

// Get all invoices across projects
const allInvoices = await getAllInvoices(redis);

// Get comprehensive statistics
const stats = await getInvoiceStats(redis);
// Returns: { total, byType, byDomain, byCountry, totalRevenue, recentInvoices }
```

## Migration & Backward Compatibility

### Legacy Support
The system supports both formats:
- **Legacy**: `lib:invoice:A123` (backward compatibility)
- **Secure**: `lib:invoice:A123:[TOKEN]` (current standard)

The `getInvoice()` function automatically tries both patterns:
1. First attempts legacy format lookup
2. If not found, searches for token-embedded format
3. Returns null if neither found

### Data Migration Strategy
When migrating existing invoices to the new format:
1. Generate tokens for existing invoices
2. Create new keys with embedded tokens
3. Keep legacy keys for transition period
4. Gradually phase out legacy access

## Error Handling

### Common Patterns
```javascript
try {
  const invoice = await getInvoiceByToken(redis, token);
  if (!invoice || Object.keys(invoice).length === 0) {
    return res.status(404).json({ error: 'Invoice not found' });
  }
  return res.json(invoice);
} catch (error) {
  console.error('Invoice retrieval error:', error);
  return res.status(500).json({ error: 'Failed to retrieve invoice' });
}
```

## Testing & Development

### Development Environment
- Use `vercel dev` for local serverless function testing
- Stripe CLI for webhook testing: `stripe listen --forward-to localhost:3000/api/stripe-webhook`
- Redis operations can be tested with the helper functions directly

### Production Deployment
- Deploy to Vercel with proper environment variables
- Set up webhook endpoints with live URLs
- Test payment flows end-to-end before going live

## Cross-Project Compatibility

This schema is designed to work across LibraLab projects:
- **Signal/Noise**: Foundation member payments, AI coach subscriptions
- **LibraLab**: Co-living rental payments, deposit handling
- **Future Projects**: Any payment-enabled LibraLab service

The unified approach ensures consistent invoice data structure and secure access patterns across all LibraLab services.