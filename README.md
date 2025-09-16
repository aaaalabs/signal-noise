# Signal/Noise

A minimalist productivity app that transforms decision-making through the 80/20 principle. Built with Jony Ive-inspired design philosophy: honest, simple, and beautiful.

## 🎯 Core Philosophy

**Every task is either Signal or Noise.** No gray areas. This binary decision framework forces clarity and eliminates decision fatigue.

- **Signal**: Important tasks that move you forward (80% target)
- **Noise**: Distractions and busywork to minimize (20% max)

## ✨ Complete Feature Set

### 🎮 Core Functionality (Free Forever)
- **Binary Task Classification**: Signal or Noise - no middle ground
- **Real-Time Ratio Display**: Live feedback with color-coded states
  - Green (≥80%): Optimal productivity
  - Yellow (60-79%): Warning zone
  - Red (<60%): Critical - too much noise
- **30-Day History Visualization**: Interactive bar chart with daily ratios
- **Smart Input System**:
  - Enter confirms visual selection (revolutionary UX fix)
  - Tab/Arrow keys for navigation
  - Shift+Enter for power users
  - Mouse hover updates selection state
- **Task Management**:
  - Click to complete tasks
  - Separate Signal/Noise columns
  - Timestamps for all decisions
  - Clean, distraction-free interface

### 📊 Analytics Dashboard
- **Expandable/Collapsible View**: Smooth Jony Ive-inspired animations
- **Key Metrics**:
  - 30-day average Signal ratio
  - Total tasks completed
  - Current streak counter
- **Pattern Insights**:
  - Best productive hours detection
  - Weakest days identification
  - Trend analysis (improving/declining)
  - Behavioral pattern recognition
- **Visual History**: 30-day bar chart with:
  - Color-coded performance (green/yellow/red)
  - Hover tooltips with exact dates and ratios
  - Future day placeholders

### 🏆 Achievement System
Eight carefully designed milestones:
1. **🌱 First Decision**: Your journey begins
2. **🔥 7-Day Streak**: One week of 80%+ Signal
3. **⚡ Signal Master**: 30-day average ≥80%
4. **💎 Perfect Day**: 100% Signal ratio achieved
5. **🏆 30-Day Hero**: Month-long excellence
6. **🌅 Early Bird**: Productive before 9 AM
7. **🎯 100 Decisions**: Experienced practitioner
8. **💪 Comeback Kid**: Return after 3+ day break

### 🌍 Internationalization
- **Auto-Detection**: Browser language preference
- **Manual Switch**: Click language code to toggle
- **Supported Languages**:
  - English (EN)
  - German (DE)
- **Smart Persistence**: Remembers your choice

### 💎 Premium Features (Foundation Membership)

#### Pricing Tiers
- **Foundation Members**: €29 one-time (first 100 users)
- **Early Adopters**: €49 one-time (after Foundation sold out)
- **Benefits**: Lifetime access, all features, no subscriptions

#### AI Coach (Powered by Groq)
- **Personalized Insights**:
  - Daily coaching based on your patterns
  - Real-time interventions when ratio drops
  - Weekly performance summaries
  - Actionable recommendations
- **Privacy-First**:
  - Only first name stored
  - Anonymized pattern data
  - No personal details shared
  - Full control over data

#### Cloud Sync & Multi-Device
- **Automatic Synchronization**:
  - Real-time sync across all devices
  - Pull-on-focus updates
  - Version conflict resolution
  - Offline-first architecture
- **Session Management**:
  - 30-day sessions with auto-refresh
  - Session backup for recovery
  - Clean slate on expiry
  - Magic link authentication

#### Premium Menu Options
- **Export Data**: Download complete history as JSON
- **Invoice Access**: View and download payment receipts
- **Session Info**: Monitor sync status and usage
- **Sign Out**: Secure logout with data preservation options

### 🔐 Security & Privacy Features
- **Local-First Architecture**:
  - All data in browser localStorage
  - No tracking or analytics
  - GDPR compliant by design
  - No cookies required
- **Premium Security**:
  - Token-based authentication
  - Secure session management
  - Encrypted API communication
  - Automatic session refresh
- **Data Control**:
  - Export anytime
  - Delete on demand
  - No vendor lock-in
  - Full data ownership

### 📱 Progressive Web App (PWA)
- **Native App Experience**:
  - Install to home screen
  - Offline functionality
  - Push notifications (coming soon)
  - Full-screen mode
- **Service Worker**:
  - Background sync
  - Cache management
  - Offline fallback
  - Auto-updates

### ⚡ Performance Optimizations
- **Instant Response**: <100ms UI interactions
- **Smooth Animations**: 60fps spring physics
- **Code Splitting**: Lazy loading for premium features
- **Optimized Rendering**: React 18 with memoization
- **Small Bundle**: <200KB initial load

### 🎨 Design System
- **Color Palette**:
  - Signal Green: `#00ff88`
  - Warning Yellow: `#ffaa00`
  - Critical Red: `#ff4444`
  - Dark Background: `#000000`
  - Surface: `#0a0a0a`
- **Typography**:
  - System fonts for performance
  - Weight hierarchy: 100/300/500
  - Responsive sizing
- **Animations**:
  - Spring physics for natural feel
  - Stagger effects for lists
  - Smooth expand/collapse
  - Haptic feedback on mobile

### ⌨️ Keyboard Shortcuts
- **Enter**: Confirm selected type
- **Tab**: Toggle Signal/Noise
- **↑/↓**: Navigate selection
- **Shift+Enter**: Quick opposite selection
- **Cmd/Ctrl+E**: Export data
- **Escape**: Cancel input

### 🔄 Data Sync Architecture
- **Multi-Layer Sync**:
  1. Local changes saved immediately
  2. Cloud sync within seconds
  3. Other devices pull updates on focus
  4. Version control prevents conflicts
- **Resilience Features**:
  - Automatic retry on failure
  - Offline queue for changes
  - Session recovery system
  - 7-day backup retention

## 🚀 Getting Started

### Installation
```bash
# Clone repository
git clone https://github.com/yourusername/signal-noise.git
cd signal-noise

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment Variables
```env
# Required for premium features
VITE_GROQ_API_KEY=your_groq_api_key
STRIPE_SECRET_KEY=your_stripe_key
UPSTASH_REDIS_URL=your_redis_url
UPSTASH_REDIS_TOKEN=your_redis_token
```

## 🛠 Technical Stack

### Frontend
- **React 18**: Latest features with TypeScript
- **Vite**: Lightning-fast build tool
- **Framer Motion**: Smooth animations
- **CSS Modules**: Scoped styling

### Backend (Serverless)
- **Vercel Functions**: API endpoints
- **Upstash Redis**: User data & sessions
- **Stripe**: Payment processing
- **Groq AI**: Coaching intelligence

### Infrastructure
- **Vercel**: Hosting & deployment
- **GitHub Actions**: CI/CD pipeline
- **PWA**: Service workers
- **CDN**: Global distribution

## 📊 Usage Patterns

### Best Practices
1. **Morning Ritual**: Start with 3 Signal tasks
2. **Binary Thinking**: No "maybe" - decide immediately
3. **Honest Assessment**: Self-deception defeats the purpose
4. **Daily Consistency**: Better than perfection
5. **80% Target**: Sustainable, not perfectionist

### Common Workflows
```
Morning:
1. Open app
2. Brain dump all tasks
3. Classify each as Signal/Noise
4. Focus on Signal tasks only

Evening:
1. Review daily ratio
2. Check pattern insights
3. Plan tomorrow's Signals
4. Clear completed Noise
```

## 🔮 Roadmap

### Coming Soon
- [ ] Voice input for hands-free operation
- [ ] Calendar integration
- [ ] Time tracking per task
- [ ] Export to CSV/PDF
- [ ] Team accounts (separate app)

### Under Consideration
- [ ] Pomodoro timer integration
- [ ] Webhook notifications
- [ ] API for developers
- [ ] Browser extensions
- [ ] Native mobile apps

### Never Planned
- ❌ Social features or comparisons
- ❌ Advertising or tracking
- ❌ Complex project management
- ❌ Gamification beyond achievements
- ❌ Feature creep

## 🤝 Contributing

We welcome contributions that align with our minimalist philosophy:

1. **Bug Fixes**: Always welcome
2. **Performance**: Optimization PRs appreciated
3. **Accessibility**: Help us reach everyone
4. **Translations**: Expand language support
5. **Documentation**: Clarity improvements

### Guidelines
- Maintain simplicity
- Respect user privacy
- Follow existing patterns
- Write tests for new features
- Update documentation

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- Inspired by Jony Ive's design philosophy
- Built on the shoulders of open source
- Powered by the React ecosystem
- AI coaching via Groq's incredible speed

## 📞 Support

- **Documentation**: [docs.signal-noise.app](https://signal-noise.app)
- **Email**: support@signal-noise.app
- **GitHub Issues**: Bug reports and features
- **Twitter**: [@signalnoise_app](https://twitter.com/signalnoise_app)

---

*"Simplicity is not the absence of clutter, but the perfectly organized essence."*

**Made with focus for focused minds.**