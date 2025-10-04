# AI Coach Benchmark - Quick Start Guide

## Installation

No additional dependencies needed - uses existing project packages.

## Run Your First Benchmark

### 1. Quick Test (1 scenario, ~30 seconds)

```bash
npm run benchmark:quick
```

This will:
- Test the "Perfectionist Trap" scenario
- Call both Pattern AI and Personal AI
- Generate quality scores and mock data analysis
- Create an HTML report

### 2. View Results

Open in your browser:
```bash
open benchmark/results/report.html
```

Or check the JSON data:
```bash
cat benchmark/results/latest.json | jq '.summary'
```

## What You'll See

### Console Output

```
🚀 Starting AI Coach Benchmark
📊 Scenarios: 1
👥 Users: 1
🕐 Time variations: 1
🌍 Language: en

================================================================================
📋 Scenario: Perfectionist Trap - Many uncompleted "finalize" tasks
================================================================================

[Test 1/1] Alex at morning time
  🔵 Testing Pattern AI...
  🟣 Testing Personal AI...
  ✅ Pattern AI: 72/100 (C)
  ✅ Personal AI: 89/100 (B)
  🏆 Winner: Personal AI
  ⚠️  Pattern AI mock data flags: 2

📊 BENCHMARK SUMMARY
================================================================================

Total Tests: 1
Successful: 1
Failed: 0

🔵 PATTERN AI:
  Wins: 0
  Average Score: 72/100
  Grade: C

🟣 PERSONAL AI:
  Wins: 1
  Average Score: 89/100
  Grade: B

🏆 OVERALL WINNER: PERSONAL AI

🔍 MOCK DATA DETECTION:
  Pattern AI flags: 2
  Personal AI flags: 0
```

### HTML Report Features

The generated report shows:

1. **Summary Cards**: Win/loss ratio, average scores, letter grades
2. **Side-by-Side Comparison**: Both AI responses with full analysis
3. **Quality Breakdown**: 5 category scores (0-100) for each response
4. **Mock Data Flags**: Detected generic phrases, vague actions
5. **Strengths/Weaknesses**: Specific feedback for each AI
6. **Recommendations**: How to improve prompt engineering

## Common Use Cases

### Test Specific Scenario

```bash
# See all available scenarios
npm run benchmark -- --help

# Test specific one
npm run benchmark -- --scenario recurring_avoider
npm run benchmark -- --scenario momentum_builder
npm run benchmark -- --scenario ratio_crisis
```

### Test at Different Times

```bash
npm run benchmark -- --time morning    # 7am - peak energy
npm run benchmark -- --time productive # 11am - momentum time
npm run benchmark -- --time declining  # 3pm - afternoon slump
npm run benchmark -- --time rest       # 7pm - evening wind-down
```

### Full Benchmark (All 8 Scenarios)

```bash
npm run benchmark

# Takes ~5 minutes (3s delay between API calls)
# Tests all productivity patterns
# Generates comprehensive comparison
```

## Understanding Results

### Quality Score Categories

| Category | Weight | Good Score | What to Look For |
|----------|--------|------------|------------------|
| **Personalization** | 25% | 80+ | Uses firstName, mentions specific task names |
| **Actionability** | 30% | 80+ | "Open X NOW", concrete 2-minute starter step |
| **Pattern Recognition** | 25% | 80+ | Identifies perfectionism, momentum, etc. |
| **Emotional Tone** | 10% | 80+ | Matches situation (celebrate vs warn) |
| **Brevity** | 10% | 80+ | Under 3 sentences, no fluff |

### Mock Data Red Flags

**Critical Issues:**
- ❌ Missing user's firstName
- ❌ No specific task references when expected
- ❌ Generic "your tasks" instead of actual task names

**High Priority:**
- ⚠️ Vague actions: "stay motivated", "try harder"
- ⚠️ Lack of specificity: "your productivity patterns"

**Medium Priority:**
- ℹ️ Generic phrases: "keep up the good work", "stay focused"

### Grade Interpretation

- **A (90-100)**: Production-ready, highly personalized
- **B (80-89)**: Good quality, minor improvements needed
- **C (70-79)**: Functional but generic
- **D (60-69)**: Significant gaps in coaching quality
- **F (<60)**: Mock data detected, needs major rework

## Iterative Improvement Workflow

1. **Run benchmark** → Identify mock data flags
2. **Review HTML report** → See specific weaknesses
3. **Update AI prompts** in `src/services/groqService.ts`
4. **Re-run benchmark** → Compare before/after scores
5. **Document findings** in benchmark/FINDINGS.md

## Example: Fixing Mock Data

### Before (Score: 65/100)

```json
{
  "message": "Great job on your productivity! Keep up the good work and stay focused.",
  "mockDataFlags": [
    { "detected": "keep up the good work", "severity": "medium" },
    { "detected": "stay focused", "severity": "medium" },
    { "detected": "no firstName usage", "severity": "critical" }
  ]
}
```

### After (Score: 92/100)

```json
{
  "message": "Tom, I see 'Lead Outreach' keeps appearing. Open LinkedIn NOW and message one person.",
  "suggestions": [{
    "action": "Set 5-minute timer and reach out to first warm contact",
    "reasoning": "Starting removes the resistance"
  }],
  "mockDataFlags": []
}
```

**Changes Made:**
1. ✅ Added firstName ("Tom")
2. ✅ Mentioned specific task ("Lead Outreach")
3. ✅ Time-bound action ("NOW")
4. ✅ Concrete starter step ("message one person")
5. ✅ Removed generic phrases

## Troubleshooting

### "API error: 403 Premium access required"

Update test user credentials:
- Dev user: `dev@signal-noise.test`
- Beta user: `beta@signal-noise.test`
- Personal AI: `personal-ai@signal-noise.test`

### "Rate limit exceeded"

Built-in 3-second delay should prevent this. If it happens:
- Use `--quick` flag for single scenario
- Wait 1 hour between full benchmark runs
- Check API rate limits in config

### Server Not Running

The benchmark calls API endpoints that need Vercel dev or production:

```bash
# Local testing
vercel dev

# Then in another terminal
npm run benchmark:quick
```

## Next Steps

1. **Run full benchmark**: `npm run benchmark`
2. **Review HTML report**: Open `benchmark/results/report.html`
3. **Identify top 3 weaknesses** from report
4. **Update prompts** in groqService.ts
5. **Re-run** and compare scores
6. **Document improvements** in FINDINGS.md

## Pro Tips

- 🎯 Focus on **actionability** first (30% weight)
- 💬 Always use **firstName** and **specific task names**
- ⏰ Include **time-bound actions** (TODAY, NOW)
- 🔍 Test **all 8 scenarios** before production
- 📊 Track **score trends** over multiple runs
- 🚫 Eliminate **all critical mock data flags**

## Questions?

See the full [README.md](./README.md) for architecture details and advanced usage.
