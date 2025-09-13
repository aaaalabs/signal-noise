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
sn:fcount         → Foundation counter (Signal/Noise members)
sn:u:{email}      → User premium data (Hash format)
sn:core           → Core stats/metadata (JSON)
lib               → LibraLab store data (unchanged)
```

**Helper Functions** (`api/redis-helper.js`):
- `getFoundationCount(redis)` → Get current Foundation members
- `incrementFoundation(redis)` → Add new Foundation member
- `getUser(redis, email)` → Get user premium status
- `setUser(redis, email, data)` → Store user data
- `getCore(redis)` / `setCore(redis, data)` → Core stats management

### Achievement System
- 8 progressive badges for user engagement
- Streak calculations (daily, weekly patterns)
- Pattern-based achievements (early bird, comeback, perfect day)
- Visual feedback without overwhelming the interface

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

This React application represents a complete productivity solution focused on simplicity, user privacy, and effective behavioral change through the 80/20 principle.