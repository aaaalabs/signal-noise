# AI Improvements Backlog

**Status:** Future enhancements beyond SLC v1
**Created:** 2025-11-04
**Context:** Advanced semantic analysis features deferred in favor of SLC weekly insights

---

## Current Implementation (v1 - SLC)

**What we built:**
- ONE weekly insight per user
- 3 questions answered: theme, why, next
- Conversational coaching messages
- Simple 3-function implementation

**Storage:**
```javascript
app_ai_data: {
  weeklyInsights: [
    {
      week: "2025-11-04",
      theme: "VoiceLoop launch prep",
      message: "Thomas, hier ist was ich sehe...",
      confidence: 0.87,
      suggestedTask: {...}
    }
    // Keep last 8 weeks only
  ]
}
```

---

## Future Enhancements (Backlog)

### 1. Semantic Clustering (Beyond Keywords)

**Problem:** Keyword matching is brittle and context-blind.

**Solution:** Contextual relationship analysis

```javascript
function analyzeSemanticClusters(tasks) {
  // Group tasks by co-occurrence patterns, not keywords
  const clusters = buildTaskGraph(tasks);

  // Example: If "VoiceLoop MVP" appears with "Figma mockup", "user testing", "launch plan"
  // → Infer: This is a product in late-stage development
  // But if it appears with "pitch deck", "competitor analysis", "market research"
  // → Infer: This is early-stage exploration

  return {
    cluster: 'VoiceLoop Product Development',
    phase: inferFromTaskRelationships(cluster), // Not from keywords alone
    confidence: calculateRelationshipStrength(cluster.connections)
  };
}
```

**Benefits:**
- More accurate phase detection
- Understands context, not just words
- Handles ambiguous terms (MVP, launch, etc.)

**Complexity:** Medium
**Value:** High for users with diverse vocabulary

---

### 2. Temporal Momentum Analysis

**Problem:** Current analysis is static - doesn't track velocity changes over time.

**Solution:** Multi-window velocity tracking

```javascript
function analyzeProjectMomentum(projectTasks) {
  const timeWindows = [7, 14, 30]; // days

  return timeWindows.map(window => {
    const recentTasks = filterByWindow(projectTasks, window);
    return {
      window: `${window}d`,
      taskCount: recentTasks.length,
      completionRate: recentTasks.filter(t => t.completed).length / recentTasks.length,
      velocity: recentTasks.length / window, // tasks per day
      trend: compareToNextWindow(window), // accelerating or decelerating?
      signal: {
        stalled: velocity < 0.1 && window === 30,
        breakthrough: velocity > 1.0 && trend === 'accelerating',
        maintenance: velocity < 0.3 && completionRate > 0.7
      }
    };
  });
}
```

**Example output:**
```javascript
{
  VoiceLoop: {
    7d: { velocity: 2.1, trend: 'accelerating', signal: 'breakthrough' },
    30d: { velocity: 0.8, trend: 'stable', signal: 'healthy' }
  },
  DigitalLotsen: {
    7d: { velocity: 0.1, trend: 'decelerating', signal: 'stalled' },
    30d: { velocity: 1.2, trend: 'decelerating', signal: 'losing_momentum' }
  }
}
```

**AI Coaching:**
> "VoiceLoop hatte Breakthrough-Momentum letzte Woche, aber Digital Lotsen stagniert.
> Überlege: Fokussieren oder explizit beenden?"

**Benefits:**
- Detect momentum shifts early
- Identify stalled projects before user realizes
- Validate "breakthrough" vs "grinding" patterns

**Complexity:** Medium
**Value:** Very high for project prioritization

---

### 3. Task Dependency Graphs

**Problem:** Tasks analyzed in isolation, missing critical path relationships.

**Solution:** Graph-based dependency analysis

```javascript
function buildTaskGraph(tasks) {
  const graph = new Map();

  tasks.forEach(task => {
    const relatedTasks = findRelatedTasks(task, tasks);
    graph.set(task.id, {
      task,
      upstreamDependencies: relatedTasks.filter(rt => rt.timestamp < task.timestamp),
      downstreamEffects: relatedTasks.filter(rt => rt.timestamp > task.timestamp),
      blockingIssues: relatedTasks.filter(rt => !rt.completed && rt.timestamp < task.timestamp)
    });
  });

  return graph;
}

function findCriticalPath(graph) {
  // Identify the longest chain of dependent tasks
  // These are the "bottleneck" tasks that block everything else

  return {
    criticalTasks: [...], // Tasks that must be completed first
    blockedTasks: [...],  // Tasks waiting on critical path
    orphanedTasks: [...]  // Tasks with no relationships (might be noise?)
  };
}
```

**AI Coaching:**
> "Du hast 12 VoiceLoop Tasks, aber 8 sind blockiert durch 'Finalize BPMN diagram'.
> Dieser eine Task ist dein Critical Path - er unlockt 67% deines Projekts."

**Benefits:**
- Identify bottleneck tasks
- Reveal hidden dependencies
- Prioritize work that unblocks others

**Complexity:** High
**Value:** Very high for complex projects

---

### 4. Predictive Validation System

**Problem:** No feedback loop to validate if AI predictions are accurate.

**Solution:** Track predictions and measure accuracy

```javascript
function generatePredictionsWithValidation(historicalData) {
  const predictions = [];

  // Example: AI predicted last week that "user testing" was next
  const lastWeekPrediction = predictions.find(p => p.timestamp > Date.now() - 7*24*60*60*1000);
  const actualTasks = getTasks(lastWeekPrediction.timestamp, Date.now());

  const predictionAccuracy = {
    predicted: lastWeekPrediction.nextSteps,
    actual: actualTasks.map(t => t.text),
    matchRate: calculateSimilarity(predicted, actual),
    insight: matchRate > 0.7
      ? "AI predictions are aligned with your actual behavior"
      : "AI predictions don't match reality - recalibrating model"
  };

  // Store this for model improvement
  await storeValidation(predictionAccuracy);

  return predictionAccuracy;
}
```

**Storage:**
```javascript
app_ai_data: {
  weeklyInsights: [...],
  validationHistory: [
    {
      week: "2025-10-28",
      predicted: "Start VoiceLoop user testing",
      actual: ["VoiceLoop user testing session 1", "Fix critical bug"],
      accuracy: 0.85,
      learnings: "User testing prediction correct, didn't anticipate critical bug"
    }
  ]
}
```

**Benefits:**
- AI learns from mistakes
- Builds user trust through transparency
- Continuous improvement of predictions

**Complexity:** High
**Value:** Critical for long-term AI quality

---

### 5. Multi-Dimensional Task Scoring

**Problem:** Current analysis only looks at themes, not impact/effort/urgency.

**Solution:** Score tasks across multiple dimensions

```javascript
function scoreTask(task, context) {
  return {
    impact: inferImpact(task, context),          // 1-10: Revenue? Milestone? Learning?
    effort: inferEffort(task, context),          // 1-10: Hours? Complexity?
    urgency: inferUrgency(task, context),        // 1-10: Deadline? Blocking?
    strategicFit: inferAlignment(task, context), // 1-10: Aligned with meta-goals?

    // Composite scores
    roi: impact / effort,                        // Bang for buck
    priority: (impact * urgency * strategicFit) / effort,

    recommendation: generateRecommendation(scores)
  };
}
```

**Example output:**
```javascript
// Task: "Fix CRM pagination bug"
{
  impact: 3,         // Minor UX improvement
  effort: 7,         // Requires debugging, testing
  urgency: 2,        // No deadline
  strategicFit: 4,   // Maintenance, not growth
  roi: 0.43,         // LOW
  priority: 3.4,     // LOW
  recommendation: "Consider deferring - this is low-impact maintenance work"
}

// Task: "Launch VoiceLoop MVP"
{
  impact: 10,        // Revenue milestone
  effort: 8,         // Significant work
  urgency: 9,        // Market timing critical
  strategicFit: 10,  // Core business goal
  roi: 1.25,         // HIGH
  priority: 112.5,   // CRITICAL
  recommendation: "This is your highest-leverage task - prioritize ruthlessly"
}
```

**AI Coaching:**
> "Du hast 'Fix CRM bug' als Signal markiert, aber der ROI ist 0.43 (niedrig).
> Das fühlt sich an wie Noise - maintenance ohne strategischen Impact."

**Benefits:**
- Explain WHY tasks feel like noise
- Quantify intuition about priority
- Help users make ruthless prioritization decisions

**Complexity:** Medium
**Value:** High for productivity optimization

---

### 6. Signal → Noise Transition Analysis

**Problem:** Don't track WHY tasks get reclassified as noise.

**Solution:** Analyze reclassification patterns

```javascript
function analyzeTransitions(tasks) {
  const transitions = tasks
    .filter(t => t.reclassified)
    .map(t => ({
      original: t.originalType,
      new: t.type,
      reason: inferReason(t, tasks),
      pattern: findPattern(t, tasks)
    }));

  return {
    signalToNoise: transitions.filter(t => t.original === 'signal' && t.new === 'noise'),
    commonPatterns: [
      {
        pattern: 'Maintenance tasks without deadlines',
        frequency: 12,
        examples: ['Fix CRM bug', 'Update LinkedIn'],
        insight: 'You reclassify ambiguous maintenance work as noise - consider batching these'
      },
      {
        pattern: 'Tasks from stalled projects',
        frequency: 8,
        examples: ['Digital Lotsen feature X', 'Bürgerstrom update Y'],
        insight: 'When projects lose momentum, their tasks become noise - consider explicit shutdown'
      }
    ]
  };
}
```

**AI Coaching:**
> "Interessantes Pattern: Du reklassifizierst Tasks von Digital Lotsen als Noise,
> sobald das Projekt stagniert. Das deutet darauf hin, dass du bereit bist loszulassen.
> Willst du das Projekt explizit beenden?"

**Benefits:**
- Understand user's actual priorities (revealed preference)
- Identify projects user has mentally abandoned
- Surface cognitive dissonance

**Complexity:** Medium
**Value:** High for self-awareness

---

### 7. Stated vs. Inferred Goal Comparison

**Problem:** Current system infers goals but doesn't compare to what user SAYS they want.

**Solution:** Alignment analysis

```javascript
function compareStatedVsInferredGoals(userData) {
  const statedGoals = userData.settings.goals || []; // User explicitly sets these
  const inferredGoals = extractMetaGoals(userData.tasks);

  return {
    aligned: findOverlap(statedGoals, inferredGoals),
    misaligned: {
      statedButNotPursued: statedGoals.filter(g => !isActiveInTasks(g, userData.tasks)),
      pursuedButNotStated: inferredGoals.filter(g => !isInStatedGoals(g, statedGoals))
    },
    coaching: {
      statedButNotPursued: "You say you want X, but your actions show Y - let's discuss",
      pursuedButNotStated: "You're actively working on X, but it's not in your stated goals - is this intentional?"
    }
  };
}
```

**Example:**
```javascript
// Stated: ["Launch VoiceLoop", "Secure funding", "Build team"]
// Inferred: ["Launch VoiceLoop" ✅, "Systematize operations", "Build visibility"]
//
// Misalignment:
// - "Secure funding" stated but only 2 tasks in 30 days (not really pursued)
// - "Systematize operations" inferred but not in stated goals (hidden priority?)
```

**AI Coaching:**
> "Du sagst, du willst Funding sichern, aber nur 2 Tasks in 30 Tagen.
> Gleichzeitig arbeitest du intensiv an 'Operations systematisieren' -
> ist das dein eigentliches Ziel?"

**Benefits:**
- Reveal cognitive dissonance
- Challenge user's self-perception
- Surface hidden priorities

**Complexity:** Low (if user sets goals)
**Value:** Very high for strategic clarity

**Prerequisite:** Add "goals" field to user settings

---

### 8. Energy Pattern Recognition

**Problem:** Don't track which task TYPES get completed vs. abandoned.

**Solution:** Completion rate analysis by task characteristics

```javascript
function analyzeEnergyPatterns(tasks) {
  const patterns = {
    highEnergy: {
      characteristics: ['concrete outcome', 'deadline', 'breakthrough', 'ship'],
      examples: [],
      completionRate: 0
    },
    lowEnergy: {
      characteristics: ['vague', 'maintenance', 'open-ended', 'bugfix'],
      examples: [],
      completionRate: 0
    }
  };

  tasks.forEach(task => {
    const isHighEnergy = patterns.highEnergy.characteristics.some(c =>
      task.text.toLowerCase().includes(c)
    );

    if (isHighEnergy) {
      patterns.highEnergy.examples.push(task);
      if (task.completed) patterns.highEnergy.completionRate++;
    } else {
      patterns.lowEnergy.examples.push(task);
      if (task.completed) patterns.lowEnergy.completionRate++;
    }
  });

  patterns.highEnergy.completionRate /= patterns.highEnergy.examples.length;
  patterns.lowEnergy.completionRate /= patterns.lowEnergy.examples.length;

  return patterns;
}
```

**Example:**
```javascript
{
  highEnergy: {
    completionRate: 0.87, // 87% completion
    examples: ["Launch VoiceLoop MVP", "Ship user testing v1", "Close Digital Lotsen deal"]
  },
  lowEnergy: {
    completionRate: 0.34, // 34% completion
    examples: ["Fix CRM bug", "Update documentation", "Review competitor analysis"]
  }
}
```

**AI Coaching:**
> "Du completest 87% deiner 'ship/launch' Tasks, aber nur 34% deiner 'bugfix/maintenance' Tasks.
> Du hast high energy für concrete outcomes, low energy für vage maintenance.
> Batche maintenance oder delegiere es."

**Benefits:**
- Understand personal work preferences
- Optimize task framing (make vague tasks concrete)
- Guide delegation decisions

**Complexity:** Medium
**Value:** High for productivity optimization

---

## Implementation Priority

### Phase 1 (Done)
- ✅ SLC Weekly Insight (v1)

### Phase 2 (High Value, Low Complexity)
- [ ] Energy Pattern Recognition (#8)
- [ ] Signal → Noise Transition Analysis (#6)
- [ ] Stated vs. Inferred Goal Comparison (#7)

### Phase 3 (High Value, Medium Complexity)
- [ ] Temporal Momentum Analysis (#2)
- [ ] Multi-Dimensional Task Scoring (#5)
- [ ] Semantic Clustering (#1)

### Phase 4 (High Value, High Complexity)
- [ ] Task Dependency Graphs (#3)
- [ ] Predictive Validation System (#4)

---

## Storage Impact

**Current (v1 SLC):**
```javascript
app_ai_data: {
  weeklyInsights: [/* 8 weeks */] // ~16KB
}
```

**With all enhancements:**
```javascript
app_ai_data: {
  weeklyInsights: [/* 8 weeks */],           // ~16KB
  energyPatterns: {/* rolling window */},     // ~4KB
  transitionAnalysis: [/* 30 days */],        // ~8KB
  goalAlignment: {/* current */},             // ~2KB
  momentumTracking: {/* per project */},      // ~6KB
  taskScores: {/* last 100 tasks */},         // ~20KB
  validationHistory: [/* 8 weeks */],         // ~12KB
  taskGraph: {/* relationships */}            // ~30KB
  // TOTAL: ~98KB (still reasonable for localStorage)
}
```

---

## Key Decision Points

1. **When to build momentum tracking?**
   - Trigger: When users have 3+ parallel projects
   - Value: Helps prioritize/sunset projects

2. **When to build dependency graphs?**
   - Trigger: When average project has 20+ tasks
   - Value: Critical path analysis becomes valuable

3. **When to build validation system?**
   - Trigger: After 1000+ users actively using AI coach
   - Value: Continuous improvement becomes critical

4. **When to build task scoring?**
   - Trigger: When users complain about noise classification
   - Value: Quantifies intuition, helps explain decisions

---

## References

- **Session Summary:** `SESSION-SUMMARY-2025-11-02.md`
- **Current Implementation:** `src/components/DevPanel.tsx`
- **AI Schema:** `signal-noise-payload-schema.md`
- **AI Prompts:** `signal-noise-groq-prompt.md`

---

**Next Steps:** Implement SLC v1 first, validate with users, then revisit backlog based on actual usage patterns.
