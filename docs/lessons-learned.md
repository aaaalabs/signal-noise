# Signal/Noise Development Lessons Learned

This document captures critical technical lessons and debugging insights from developing the Signal/Noise productivity application.

## Magic Link Authentication (September 2024)

### Critical Redirect Timing Issue & Fix

**Problem**: Magic link verification succeeded but app didn't redirect, leading to 404 errors after cache expiration.

**Root Cause Analysis**:
1. Backend caches successful verification for 3 minutes (by design for handling duplicate requests)
2. Frontend waited 2 seconds before redirecting after success
3. During those 2 seconds, React re-renders/effects triggered additional API calls
4. Multiple cached responses returned while user waited
5. After 3 minutes, cache expired → subsequent calls returned 404

**SLC Fix** (`VerifyMagicLink.tsx:40-42`):
```javascript
// OLD: 2 second delay allowed duplicate calls
setTimeout(() => onSuccess(data.session); }, 2000);

// NEW: 500ms - just enough for user feedback, prevents duplicates
setTimeout(() => onSuccess(data.session); }, 500);
```

**Key Implementation Details**:
- **Backend**: 3-minute cache with `setex(180)` for handling legitimate polling
- **Frontend**: Immediate redirect after brief success message prevents unnecessary API calls
- **UX Balance**: 500ms shows success state without frustrating delays

**Debug Pattern Recognition**:
- Single success log followed by multiple "cached" responses = timing issue
- 404s after initial success = cache expiration, not authentication failure
- Check frontend delay timers when backend caching is involved

**Files Changed**:
- `src/components/VerifyMagicLink.tsx` - Reduced redirect delay
- `api/auth/verify-magic-link.js` - Backend caching implementation

---

## Stripe Webhook Integration (September 2024)

### Vercel Dev Environment Body Parsing Issue

**Problem**: Stripe webhook signature verification failed in development with Vercel dev environment.

**Root Cause**: Unlike Next.js App Router, Vite projects with Vercel serverless functions have different request body parsing behavior. Vercel dev was consuming the request stream before webhook could read raw body for signature verification.

**SLC Solution** (`/api/stripe-webhook.js`):
```javascript
const isDev = process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV !== 'production';

if (isDev && req.body && typeof req.body === 'object') {
  console.log('🚧 Development mode: Using parsed body directly');
  event = req.body; // Skip signature verification locally
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

**Testing Workflow**:
- Development: `vercel dev` + `stripe listen --forward-to localhost:3000/api/stripe-webhook`
- Production: Deploy and test with live webhook URLs
- Always test locally first due to potential preview/production auth

---

## Foundation Member System Architecture

### Redis Namespace Strategy for Multi-Project Separation

**Pattern**: Clean LibraLab project separation using SLC namespace structure:

```
sn:fcount                    → Foundation counter (Signal/Noise members)
sn:u:{email}                 → User premium data (Hash format with usage tracking)
sn:core                      → Core stats/metadata (JSON)
lib:invoice:A123:token       → Secure invoices with embedded tokens
lib:ivnr                     → Invoice sequence counter (LibraLab compatible)
```

**Benefits**:
- Clear project separation (sn: vs lib:)
- Consistent data organization
- Easy maintenance and debugging
- Cross-project compatibility

---

## Usage Tracking Migration Pattern

### Hash Consolidation for Performance

**Old Pattern**: `usage:email:2024-01-15` → "3" (separate keys per day)
**New Pattern**: User hash fields `usage_2024_01_15: "3"` (consolidated)

**Benefits**:
- Reduced Redis key count
- Automatic 30-day cleanup
- Centralized user data
- Better performance at scale

**Implementation Details**:
- Auto-cleanup: Old usage fields >30 days removed probabilistically (10% chance per call)
- Backward compatibility maintained during migration
- Usage tracked in user hash for consistency

---

## React State Management Patterns

### Premium Status Real-time Updates

**Challenge**: Multiple components need to react to premium status changes from magic link verification.

**Solution**: Combined localStorage + storage events + periodic checking:
```javascript
// Listen for storage changes (when SuccessModal activates premium)
const handleStorageChange = (e: StorageEvent) => {
  if (e.key === 'premiumStatus' || e.key === 'premiumActive') {
    checkPremium();
  }
};

// Also check periodically in case storage event doesn't fire
const interval = setInterval(checkPremium, 1000);
```

**Key Insight**: Storage events don't always fire reliably across all browsers/contexts, so periodic checking provides fallback reliability.

---

## Error Handling Philosophy Applied

### "keine fallbacks. fail early, fail fast and fix what is broken"

**Examples**:
- Magic link timing: Fixed root cause instead of adding retry logic
- Webhook parsing: Clear development vs production paths
- Premium status: Explicit error states rather than silent failures

**Benefits**:
- Easier debugging
- Clearer error reporting
- Faster problem identification
- More reliable system behavior

---

## Production System Architecture (September 2024)

### Complete Signal/Noise Foundation Payment System

**Final Architecture Status:**
- ✅ **Primary Path**: Stripe webhook (`checkout.session.completed`) → user creation + invoice + email
- ✅ **Backup Path**: `ensure-user-created` endpoint with grandfathering to prevent duplicates
- ✅ **Secure Invoices**: Token-based access with GDPR compliance
- ✅ **Foundation Pricing**: €29 lifetime access (first 100 users), €49 Early Adopter
- ✅ **Email Integration**: Welcome emails with embedded secure invoice links

**Production Files (Essential Only):**
```
api/
├── stripe-webhook.js          # Primary webhook handler
├── ensure-user-created.js     # Grandfathered backup system
├── invoice-secure.js          # Token-based secure invoice access
├── email-helper.js            # Resend API integration
├── redis-helper.js            # Redis utilities with SLC namespace
├── create-checkout.js         # Stripe checkout session creation
└── foundation-stats.js        # Foundation member counting
```

**Archived Development Files:**
All `test-*.js` debugging scripts and `invoice.deprecated.js` moved to `archive/development-scripts/` with documentation. Production system now contains only essential files with integrated logging.

**Key Achievement:**
Complete payment processing system with dual-path redundancy, preventing any payment loss while maintaining clean production codebase.