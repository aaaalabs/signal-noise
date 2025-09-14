# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with the Signal/Noise React application.

## Project Overview

Signal/Noise is a minimalistic React-based productivity application implementing the 80/20 principle. Users classify tasks as either "Signal" (important, 80% of time) or "Noise" (distractions, 20% of time) to achieve optimal focus.

### Core Philosophy
- **keine fallbacks. fail early, fail fast and fix what is broken**
- Minimalist design following Jony Ive principles
- Privacy-first with local data storage
- Premium AI coaching with Foundation member pricing

## Technical Architecture

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: CSS modules with custom properties (--signal, --surface, --bg)
- **State Management**: React useState/useEffect with localStorage persistence
- **AI Integration**: Groq API (llama-3.3-70b-versatile model)
- **Payments**: Stripe Checkout with webhook handling
- **Database**: Upstash Redis for premium user management
- **Deployment**: Vercel with serverless functions

### Key Design Principles
- **No External Dependencies**: Minimal third-party libraries
- **Dark Theme**: Consistent dark UI with green accent (--signal: #00ff88)
- **Modal-First**: All interactions stay within app context (no page redirects)
- **Font Hierarchy**: font-weight: 100 for numbers, 300 for text, 500 for CTAs

## Core Components

### Data Structure (`src/types.ts`)
```typescript
interface AppData {
  tasks: Task[];        // All user tasks with timestamps
  history: any[];       // 30-day archived ratios
  badges: string[];     // Achievement system IDs
  patterns: object;     // Behavioral pattern recognition
  settings: {
    targetRatio: number;
    notifications: boolean;
    firstName: string;   // For AI coach personalization
  };
}
```

### Main Components
- **App.tsx**: Main application container with data management
- **TaskInput.tsx**: Input interface for task classification
- **TaskGrid.tsx**: Visual display of Signal/Noise tasks
- **RatioDisplay.tsx**: Real-time percentage calculation with achievements
- **AICoach.tsx**: Premium AI coaching integration
- **FoundationModal.tsx**: Premium upgrade modal (€29 Foundation pricing)
- **Analytics.tsx**: Historical data visualization
- **Footer.tsx**: Simple footer component

## Premium Features & Pricing Strategy

### Foundation Member Program
- **Pricing**: €29 one-time payment (first 100 users)
- **After Foundation**: €49 Early Adopter pricing
- **Features**: AI Coach access, lifetime updates, no subscription
- **Implementation**: Modal overlay (not separate page) maintaining app context

### AI Coach Integration
- **Model**: Groq llama-3.3-70b-versatile
- **Data Privacy**: Only anonymized patterns + firstName sent to AI
- **Coaching Types**: celebration, warning, insight with emotional tones
- **Real-time Analysis**: Productivity patterns, streaks, behavioral insights

## API Endpoints

### `/api/create-checkout.js`
- Creates Stripe checkout sessions
- Handles Foundation vs Early Adopter pricing logic
- Checks Foundation member availability in Redis

### `/api/stripe-webhook.js`
- Processes Stripe payment confirmations
- Increments Foundation member counter
- Stores user tier data in Redis

### `/api/foundation-stats.js`
- Returns current Foundation member count
- Used for "X of 100 Foundation members" display

## Development Workflow

### File Structure
```
src/
├── components/           # React components
│   ├── AICoach.tsx      # Premium AI coaching
│   ├── FoundationModal.tsx  # Premium upgrade modal
│   ├── TaskInput.tsx    # Task classification input
│   └── ...
├── services/            # External integrations
│   ├── groqService.ts   # AI coaching API
│   └── premiumService.ts # Premium user management
├── utils/               # Helper functions
│   ├── achievements.ts  # Badge/streak calculations
│   └── patternAnalysis.ts # User behavior analysis
├── types.ts             # TypeScript definitions
└── App.tsx              # Main application
```

### Key Commands
```bash
npm install              # Install dependencies
npm run dev              # Development server (user controls when to run)
npm run build            # Production build
npm run preview          # Preview production build
npm run lint             # ESLint checking
npm run typecheck        # TypeScript validation
npm run test:redis       # Test Redis operations
npm run test:stripe      # Test Stripe API logic
npm run test:webhook     # Test webhook processing
npm run test:scenarios   # Comprehensive scenario tests
npm run test:all         # Run Redis + Stripe tests
```

### Environment Variables
```bash
VITE_GROQ_API_KEY=       # Groq AI API key
STRIPE_SECRET_KEY=       # Stripe payments
UPSTASH_REDIS_URL=       # Redis database
UPSTASH_REDIS_TOKEN=     # Redis authentication
```

## UI/UX Guidelines

### Design System
- **Colors**: Dark theme with --signal green accent
- **Typography**: System fonts, weight hierarchy (100/300/500)
- **Interactions**: Subtle hover effects, no aggressive UI patterns
- **Modals**: Overlay approach, maintain app context
- **Responsive**: Mobile-first design with touch-friendly interactions

### Jony Ive Design Approval
All UI changes must follow these principles:
- Honest, minimal design without deceptive urgency
- Consistent visual hierarchy and spacing
- Subtle interactions that feel natural
- No emojis or overwhelming visual elements
- Function-first approach with elegant aesthetics

## Data Management

### LocalStorage Schema (Frontend)
- **Key**: 'signal_noise_data'
- **Migration**: Handle backwards compatibility for existing users
- **Backup**: Automatic data persistence on state changes
- **Privacy**: No cloud storage, everything client-side

### Redis Namespace (Backend)
**SLC Structure** for clean LibraLab project separation:
```
sn:fcount                    → Foundation counter (Signal/Noise members)
sn:u:{email}                 → User premium data (Hash format with usage tracking)
sn:core                      → Core stats/metadata (JSON)
lib:invoice:A123:token       → Secure invoices with embedded tokens
lib:ivnr                     → Invoice sequence counter (LibraLab compatible)
```

**Helper Functions** (`api/redis-helper.js`):
- `getFoundationCount(redis)` → Get current Foundation members
- `incrementFoundation(redis)` → Add new Foundation member
- `getUser(redis, email)` → Get user premium status
- `setUser(redis, email, data)` → Store user data
- `getCore(redis)` / `setCore(redis, data)` → Core stats management
- `incrementUserUsage(redis, email, date)` → Track AI coach usage in user hash
- `getUserUsage(redis, email, date)` → Get daily usage from user hash
- `getInvoice(redis, invoiceNumber)` → Dual-pattern invoice retrieval (legacy + token)
- `getInvoiceByToken(redis, token)` → Secure token-based invoice access

### Achievement System
- 8 progressive badges for user engagement
- Streak calculations (daily, weekly patterns)
- Pattern-based achievements (early bird, comeback, perfect day)
- Visual feedback without overwhelming the interface

### Usage Tracking System (Sept 2024)
**Migration from separate keys to user hash consolidation:**
- **Old Pattern**: `usage:email:2024-01-15` → "3" (separate keys per day)
- **New Pattern**: User hash fields `usage_2024_01_15: "3"` (consolidated)
- **Benefits**: Reduced Redis key count, automatic 30-day cleanup, centralized user data
- **Auto-cleanup**: Old usage fields >30 days removed probabilistically (10% chance per call)

## Testing & Quality

### Development Testing
- Manual testing across browsers (Chrome, Firefox, Safari)
- Mobile device testing for touch interactions
- LocalStorage migration testing
- Stripe payment flow testing (dev mode alerts)

### Performance Targets
- Fast UI response (<100ms for interactions)
- Minimal bundle size with code splitting
- Efficient localStorage operations
- Battery-conscious animations

## Deployment

### Vercel Configuration
- Automatic deployments from git pushes
- Serverless functions for API endpoints
- Environment variables via Vercel dashboard
- PWA icon integration for progressive web app

### Stripe Integration
- Webhook endpoint for payment confirmations
- Test mode handling in development environment
- Foundation member counter persistence in Redis
- Secure payment flow with proper error handling

#### Critical Webhook Issue & Solution (Sept 2025)
**Problem**: Vercel dev environment couldn't handle raw request bodies for Stripe signature verification. The issue was:

1. **Vite + Vercel Serverless Functions**: Unlike Next.js App Router, Vite projects use traditional serverless function syntax but Vercel dev parses request bodies differently
2. **Body Parsing Conflict**: Even with `bodyParser: false`, Vercel dev was consuming the request stream before our webhook could read the raw body
3. **Signature Verification**: Stripe requires the exact raw body for HMAC signature verification - any JSON parsing breaks the signature

**SLC Solution**: Development mode bypass in `/api/stripe-webhook.js`:
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
- Deployment Protection: Preview/Production URLs may have auth - test locally first

## Critical Implementation Notes

### Modal vs Page Navigation
- **Always use modals** for premium features (FoundationModal.tsx)
- Maintain user context within the app
- No external redirects that break the experience
- CSS consistency with main app styling

### Error Handling Philosophy
- **"keine fallbacks. fail early, fail fast and fix what is broken"**
- Explicit error states rather than silent failures
- Development mode: Clear error messages and alerts
- Production: Graceful degradation with user feedback

### Pattern Recognition
- Hourly productivity analysis for AI coaching
- Weekly performance trends
- Task categorization insights
- Behavioral consistency scoring for personalized advice

## Magic Link Authentication Lessons (Sept 2024)

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

### Key Implementation Details
- **Backend**: 3-minute cache with `setex(180)` for handling legitimate polling
- **Frontend**: Immediate redirect after brief success message prevents unnecessary API calls
- **UX Balance**: 500ms shows success state without frustrating delays

### Debug Pattern Recognition
- Single success log followed by multiple "cached" responses = timing issue
- 404s after initial success = cache expiration, not authentication failure
- Check frontend delay timers when backend caching is involved

This React application represents a complete productivity solution focused on simplicity, user privacy, and effective behavioral change through the 80/20 principle.