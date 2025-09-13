# Signal/Noise

A Jony Ive-inspired productivity app for mindful decision making. Transform your daily tasks into clear signals vs. noise decisions with beautiful, honest design.

## ✨ Features

- **Mindful Productivity**: Categorize tasks as Signal (important) or Noise (distractions)
- **Visual Selection**: Honest UX where visual prominence matches behavior
- **Achievement System**: 8 badges to motivate consistent good decisions
- **Pattern Analysis**: AI insights into your productivity patterns
- **Streak Tracking**: Build momentum with daily consistency
- **Multilingual**: Automatic DE/EN detection based on browser settings
- **PWA Ready**: Install as native app with offline support

## 🎯 Philosophy

Following **SLC principles** (Simple, Loveable, Complete):
- **Simple**: Clean, minimal interface inspired by Jony Ive's design philosophy
- **Loveable**: Delightful micro-interactions and thoughtful UX
- **Complete**: Full-featured productivity system with AI coaching

## 💡 Key UX Innovation

The app solves a common UX problem: **Enter key behavior now matches visual selection**. When "Signal" appears prominent, pressing Enter correctly selects Signal instead of defaulting to the wrong option.

### Smart Input Controls
- **Enter**: Confirms visually selected type
- **Tab**: Switches between Signal/Noise
- **Arrow Keys**: Direct selection
- **Shift+Enter**: Power user shortcut for opposite selection
- **Mouse Hover**: Updates selection state

## ✨ Features (Free & Forever)

### Core Functionality
- **Binary Decision:** Every task is either Signal or Noise
- **Live Ratio Display:** See your current Signal-to-Noise ratio instantly
- **30-Day History:** Track your productivity development
- **Offline Capable:** Works without internet connection (PWA)
- **100% Private:** All data stays in your browser (LocalStorage)

### Motivation System
- **8 Milestones:** Unlockable achievements for consistent use
  - 🌟 First Decision - Your start into focused productivity
  - 🔥 7 Day Streak - One week of constant focus
  - ⚡ Signal Master - 80% average achieved
  - 💎 Perfect Day - 100% Signal, zero distraction
  - 🏆 30 Day Hero - One month of excellence
  - 🌅 Early Bird - Productive before 9 AM
  - 🎯 100 Decisions - Experienced focus master
  - 💪 Comeback Kid - Strong return after a break

### Intelligent Pattern Recognition (Locally Computed)
- **Best Working Hours:** When are you most productive?
- **Weak Days:** Which weekdays need more focus?
- **Trend Analysis:** Are you improving or declining?
- **Consistency Score:** How stable is your productivity?

### Minimalist Design
- **Dark Mode:** Easy on the eyes and focus-promoting
- **No Distractions:** No social feed, no ads, no popups
- **Subtle Achievements:** Only appear on hover, never disturb
- **Responsive:** Works on desktop, tablet and mobile

## 🚀 Premium: Your Personal AI Coach ($9/month)

### What Does the AI Coach Do?
The optional AI Coach (powered by Groq) acts as your personal accountability partner - no comparisons with others, just you and your goals:

#### Daily Support
- **Personal Address:** Only knows your first name, nothing more
- **Morning Check-in:** Motivating start with focus on your top priorities
- **Evening Review:** Daily reflection and tomorrow's preparation
- **Real-time Interventions:** Alerts when your Signal ratio drops below 60%

#### Intelligent Analysis
- **Recognize Your Patterns:** When are YOU most productive?
- **Individual Trends:** Are you improving or do you need support?
- **Personal Predictions:** When will you likely need help?
- **Weekly Reports:** Detailed analysis of your progress

#### What the Coach DOES NOT Do
- ❌ **No Team Comparisons:** It's about you, not others
- ❌ **No Leaderboards:** No competition, only personal improvement
- ❌ **No Social Sharing:** Your productivity stays private
- ❌ **No Surveillance:** You decide when and how often

### Privacy is a Core Feature
- **One Data Point:** Only your first name for personal address
- **Local Data:** Everything stays in your browser
- **Anonymized Patterns:** AI only sees patterns, no personal details
- **Full Control:** Cancel anytime, data immediately deleted

### Example Coach Messages

**Morning:**
> "Good morning Sarah! Yesterday you achieved 87% Signal - strong! Your data shows: Between 9-11 AM you're most focused. What's today's most important task for this time window?"

**When ratio drops:**
> "Hey Tom, your Signal dropped from 75% to 45% in the last hour. The last 3 tasks were all Noise. Time for a reset: What's REALLY important NOW?"

**Weekly insight:**
> "This week you were 78% in Signal range, +12% better than last week! Mondays remain your challenge. Tip: Plan Monday evening's Top 3 for Tuesday."

## 🛠 Technical Details

### Technology Stack
- **Frontend:** React + TypeScript + Vite
- **Data Storage:** Browser LocalStorage
- **Offline Support:** Service Worker & PWA
- **AI Integration:** Groq API (Premium only)
- **Styling:** Tailwind CSS

### Browser Compatibility
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

### Data Storage
```javascript
{
  tasks: [],        // All decisions
  history: [],      // 30-day archive
  badges: [],       // Unlocked achievements
  patterns: {},     // Recognized patterns
  settings: {       // User preferences
    targetRatio: 80,
    firstName: ''   // Premium only
  }
}
```

## 🎯 Usage Guide

### Getting Started
1. **Open the app** in your browser
2. **No registration** needed - just start
3. **Type a task**
4. **Decide:** Signal (S) or Noise (N)?
5. **Watch your ratio** - aim for 80% Signal

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🏗 Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development
- **PWA** with service worker
- **LocalStorage** for client-side persistence
- **Groq AI** for coaching insights (premium)
- **Stripe** for premium subscriptions

## 🎨 Design System

- **Colors**: Signal Green (`#00ff88`), Noise Gray (`#666`), Dark Background (`#000`)
- **Typography**: Apple system fonts with careful hierarchy
- **Interactions**: Subtle animations with haptic feedback
- **Responsive**: Mobile-first design with desktop enhancements

### Best Practices
1. **Morning Ritual:** Start each day with 3 Signal tasks
2. **Binary Thinking:** No gray area - only Signal or Noise
3. **Be Honest:** Self-deception doesn't help
4. **Consistency:** Daily use for best results
5. **80/20 Rule:** Perfectionism isn't the goal

## 📊 Scientific Background

### The 80/20 Rule (Pareto Principle)
- 20% of tasks generate 80% of results
- Focus on the critical 20% maximizes productivity
- Reduction of "busy work" in favor of "deep work"

### Signal vs. Noise Theory
- Origin in information theory
- Application to time management by tech leaders
- Demonstrable productivity increase through clear prioritization

### Gamification & Habit Building
- Streak mechanics promote consistency
- Subtle badges avoid overstimulation
- Immediate feedback reinforces positive habits

## 💰 Pricing Model

### Free Forever
- ✅ All core features
- ✅ Unlimited tasks
- ✅ 30-day history
- ✅ All 8 achievements
- ✅ Pattern recognition
- ✅ PWA & offline support
- **Cost:** $0

### Premium AI Coach
- ✅ Everything from Free
- ✅ Personal AI coach
- ✅ Daily check-ins
- ✅ Deep pattern analysis
- ✅ Real-time interventions
- ✅ Weekly reports
- **Cost:** $9/month

## 🎨 Design Philosophy

> "The best interface is no interface. The best AI is invisible."

Signal/Noise follows the principles of minimalist design:

- **Reduction:** Only the essential is visible
- **Clarity:** Every element has a clear purpose
- **Respect:** The app respects your time and attention
- **Privacy:** Your data belongs to you alone

Achievement dots only appear on hover. The AI Coach only speaks when necessary. Everything is designed to support you without disturbing.

## 🚀 Development

### Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Project Structure

```
src/
├── components/         # React components
├── hooks/             # Custom React hooks
├── utils/             # Utility functions
├── types/             # TypeScript type definitions
└── styles/            # Global styles
```

### Key Technologies
- **React 18:** Modern React with hooks and concurrent features
- **TypeScript:** Type-safe development
- **Vite:** Fast development and build tool
- **Tailwind CSS:** Utility-first CSS framework
- **PWA:** Progressive Web App capabilities

## 🚀 Future Roadmap

### Planned Features
- [ ] PWA improvements (better offline sync)
- [ ] Export functions (CSV, PDF reports)
- [ ] More languages (DE, ES, FR)
- [ ] Voice input (tasks by voice)
- [ ] Focus timer integration

### Never Planned
- ❌ Social features or team comparisons
- ❌ Advertising or tracking
- ❌ Account requirement or cloud sync
- ❌ Complex project management tools
- ❌ Feature creep

## 🏆 Why Signal/Noise?

### For Individuals
- **Clarity:** Instantly know what's important
- **Focus:** Eliminate distractions
- **Progress:** Measurable improvement
- **Privacy:** Your data stays with you

### For Companies
- **Productivity:** Employees focus on what matters
- **No IT costs:** Runs in browser
- **Data protection:** GDPR compliant by design
- **ROI:** Measurable time savings from day one

## 💬 Support & Contact

## 🤖 AI Coaching (Premium)

Get personalized insights based on your actual data:
- Pattern recognition in your decisions
- Best productive hours analysis
- Weekly trend analysis
- Consistency scoring
- Actionable recommendations

## 📱 Installation

### As PWA
1. Visit the app in your browser
2. Look for "Install" or "Add to Home Screen"
3. Enjoy native app experience

### Development
```bash
git clone https://github.com/aaaalabs/signal-noise.git
cd signal-noise
npm install
npm run dev
```

## 🌍 Deployment

Optimized for **Vercel** with zero configuration:

```bash
npm run build
# Deploy dist/ folder to any static host
```

## 🔐 Privacy

- **Local First**: All data stored in browser localStorage
- **No Tracking**: No analytics or third-party scripts
- **Premium Only**: AI features require opt-in subscription
- **Secure**: No sensitive data logged or transmitted

## 🏆 Achievement System

Unlock 8 carefully designed badges:
- **First Steps**: Complete your first decision
- **Week Warrior**: 7-day streak
- **Month Hero**: 30-day streak
- **Perfect Day**: 100% signal ratio
- **Decision Master**: 100 total decisions
- **Consistency King**: High consistency score
- **Signal Surfer**: 500 signal tasks
- **Zen Master**: Ultimate achievement

## 🎯 Roadmap

- [ ] Team collaboration features
- [ ] Advanced pattern visualization
- [ ] Integration with calendar apps
- [ ] Custom achievement goals
- [ ] Export/import functionality

## 🤝 Contributing

This is a focused, opinionated productivity tool. Contributions welcome for:
- Bug fixes
- Performance improvements
- Accessibility enhancements
- Translation improvements

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Inspiration

Designed with deep respect for Jony Ive's principles of honest, simple, and beautiful product design. Every interaction is intentional and meaningful.

---

*"Simplicity is the ultimate sophistication"* - Leonardo da Vinci

Made with ❤️ for mindful productivity
