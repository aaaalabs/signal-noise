# CLAUDE.md - Widget Lab

## Project Overview

Widget Lab is the dedicated development environment for Signal/Noise premium Android widgets. This subproject implements three revolutionary widget concepts that combine Jony Ive's minimalist aesthetic philosophy with cutting-edge Android capabilities.

## Core Principles

### Design Philosophy (Jony Ive Standards)
- **Honesty**: No deceptive animations or false progress indicators
- **Simplicity**: Single-glance comprehension, essential information only
- **Innovation**: Novel visualization techniques that advance the medium
- **Craft**: Obsessive attention to detail, pixel-perfect alignment

### Technical Standards (Google Engineering Excellence)
- **Performance**: <100ms UI response, 60fps animations
- **Battery**: <1% daily impact through adaptive refresh
- **Memory**: <10MB footprint per widget
- **Reliability**: Graceful degradation, robust error handling

## Widget Concepts

### 1. Signal Wave
*Time as a Living Stream* - Animated particle flow representing focus state with real-time WebSocket updates and AI-powered insights for premium users.

### 2. Focus Ring
*Planetary Motion of Attention* - Tasks orbit around focus center with gravity physics. Signal tasks pull inward, noise drifts outward.

### 3. Quantum State
*Productivity as Quantum Probability* - Shows task history and AI-predicted future with Schrödinger tasks in superposition until observed.

## Architecture

```
widget-lab/
├── docs/               # Comprehensive documentation
├── src/
│   ├── signal-wave/    # Widget 1 implementation
│   ├── focus-ring/     # Widget 2 implementation
│   └── quantum-state/  # Widget 3 implementation
├── assets/            # Shared resources, icons, gradients
├── tests/             # Unit and integration tests
└── tools/             # Build scripts and utilities
```

## Development Process

Each widget follows a rigorous 5-phase development cycle:

1. **Foundation** - Core widget service, data pipeline, base layouts
2. **Visual Excellence** - Animations, custom rendering, Material You
3. **Intelligence** - AI predictions, pattern recognition, premium features
4. **Validation** - Google engineer review, performance optimization
5. **Deployment** - Production release, monitoring, iteration

## Quality Gates

Before any widget ships:
- ✅ Jony Ive design review (aesthetics, simplicity, innovation)
- ✅ Google engineer approval (performance, battery, code quality)
- ✅ User testing validation (comprehension <500ms, retention >80%)
- ✅ Accessibility audit (WCAG AAA compliance)

## Integration Points

### React App Communication
- LocalStorage bridge for data persistence
- JavaScriptInterface for real-time updates
- WebSocket service for premium features

### Android System
- RemoteViews for widget rendering
- WorkManager for background updates
- Room database for offline persistence
- ContentProvider for data access

## Success Metrics

- Widget retention: >80% after 30 days
- Average glances: >20 per day
- Premium conversion: >15% from widget users
- Performance: <100ms update latency
- Battery impact: <1% daily

## Development Guidelines

1. **Always start with the simplest implementation** (KISS principle)
2. **Test on real devices** early and often
3. **Profile performance** before optimization
4. **Document decisions** for future reference
5. **Maintain backward compatibility** (Android 12+ minimum)

## Current Status

See `plan.md` for detailed progress tracking and `changelog.md` for version history.

---

*"The best design is as little design as possible" - Dieter Rams*