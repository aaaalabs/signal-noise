# Signal/Noise - Play Store Launch Plan

## 🚀 Launch Status: READY FOR BUILD
Last Updated: September 2025

---

## ✅ Phase 1: Design & Content (COMPLETE)

### Feedback System
- ✅ Elegant feedback modal implemented
- ✅ WhatsApp integration (+43 660 123 8172)
- ✅ Email support (feedback@signal-noise.app)
- ✅ Merged Legal/Terms to maintain 5 footer items

### UI/UX Improvements
- ✅ Fixed 30-day overview container height
- ✅ Dynamic height based on PatternInsights
- ✅ Animations refined (Framer Motion)
- ✅ 1.8x zoom for mobile screenshots (Jony Ive approved)

---

## ✅ Phase 2: Screenshots & Marketing Assets (COMPLETE)

### Screenshots Generated
- ✅ Emma Chen persona (26-day journey)
- ✅ iPhone screenshots (1170×2532 @ 1.8x zoom)
- ✅ Android screenshots (1080×2400)
- ✅ Tablet screenshots (2048×2732)
- ✅ Device frames added (iPhone X & Google Pixel)

### Marketing Assets
- ✅ Feature graphic (1024×500)
- ✅ 7 Hormozi-style marketing visuals
- ✅ Elegant overlays (subtle, centered)
- ✅ All assets in `/play-store-submission/`

### Store Listing Content
- ✅ App title: "Signal/Noise - Focus Tracker"
- ✅ Short description (72 chars)
- ✅ Full description (~1800 chars)
- ✅ Keywords strategy documented
- ✅ Privacy policy summary
- ✅ What's new text
- ✅ Contact information

---

## ✅ Phase 3: TWA Setup (COMPLETE)

### Configuration
- ✅ `twa-manifest.json` created
- ✅ Package ID: `app.signalnoise.twa`
- ✅ Icon assets generated
- ✅ Offline support configured

### Google Play Setup
- ✅ Developer account created
- ✅ $25 registration fee paid
- ⏳ JDK installation in progress
- ⏳ Bubblewrap CLI ready

---

## 🔄 Phase 4: Build & Testing (IN PROGRESS)

### Build Process
- [ ] Generate signed APK/AAB with Bubblewrap
  ```bash
  npx @bubblewrap/cli build
  ```
- [ ] Create keystore for app signing
- [ ] Build production AAB file

### Device Testing
- [ ] Install APK on physical Android device
- [ ] Verify offline functionality
- [ ] Test PWA features (install prompt, offline mode)
- [ ] Test Foundation payment flow
- [ ] Verify all screenshots load correctly

---

## 📝 Phase 5: Google Play Console (NEXT)

### App Setup
- [ ] Create new application
- [ ] Upload AAB file
- [ ] Configure app details:
  - Category: Productivity
  - Content rating: Everyone
  - Target audience: 18+

### Store Listing
- [ ] Upload feature graphic
- [ ] Upload all screenshots (6 per device type)
- [ ] Add app icon (512×512)
- [ ] Copy all text content from `/texts/`
- [ ] Add privacy policy URL
- [ ] Add terms of service URL

### In-App Purchase
- [ ] Create Foundation membership product (€29)
- [ ] Configure one-time purchase
- [ ] Set up license testing

---

## 🚦 Phase 6: Production Readiness (TODO)

### Backend Services
- [ ] Stripe production mode
  - [ ] Add production API keys to Vercel
  - [ ] Test payment flow
  - [ ] Configure webhook endpoints

- [ ] Redis/Upstash verification
  - [ ] Verify Foundation counter works
  - [ ] Test increment on purchase
  - [ ] Monitor first 100 limit

### URLs & Support
- [ ] Deploy privacy policy to signal-noise.app/privacy
- [ ] Deploy terms to signal-noise.app/terms
- [ ] Set up feedback@signal-noise.app forwarding
- [ ] Test WhatsApp support number

---

## 🎯 Phase 7: Launch (TODO)

### Pre-Launch Checklist
- [ ] Run final UI/UX testing
- [ ] Verify all API endpoints
- [ ] Test complete user journey
- [ ] Review all store content for typos
- [ ] Prepare launch announcement

### Submission
- [ ] Complete content rating questionnaire
- [ ] Select countries for release
- [ ] Set pricing (Free with IAP)
- [ ] Submit for review
- [ ] Expected review time: 2-3 hours to 2 days

### Post-Launch
- [ ] Monitor crash reports
- [ ] Track Foundation signups
- [ ] Respond to user feedback
- [ ] Plan first update based on feedback

---

## 📊 Success Metrics

### Launch Goals
- 🎯 First 100 Foundation members
- 🎯 4.5+ star rating
- 🎯 <0.1% crash rate
- 🎯 80% retention after 7 days

### Foundation Program Status
- Current members: 0 of 100
- Price: €29 (then €49)
- Features: AI Coach, lifetime updates

---

## 🛠 Technical Stack

### Frontend
- React 18 + TypeScript + Vite
- PWA with offline support
- TWA for Android wrapper

### Backend
- Vercel serverless functions
- Stripe for payments
- Upstash Redis for data
- Groq AI for coaching

### Distribution
- Google Play Store (TWA)
- Web app (signal-noise.app)
- iOS (future - Safari PWA)

---

## 📅 Timeline

- **Week 1** (Current): Build & Testing
- **Week 2**: Play Console setup & submission
- **Week 3**: Launch & initial feedback
- **Week 4**: First update based on feedback

---

## 🔗 Resources

- Play Store Submission: `/play-store-submission/`
- TWA Config: `twa-manifest.json`
- Screenshots: `/screenshots-framed-iphone/` & `/screenshots-framed-android/`
- Marketing: `/screenshots-marketing/`
- Support: feedback@signal-noise.app / +43 660 123 8172

---

**Next Immediate Step**: Complete Bubblewrap JDK installation and run `npx @bubblewrap/cli build`