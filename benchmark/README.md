# AI Coach Benchmark System

Comprehensive testing framework for comparing **Pattern AI** and **Personal AI** coaching effectiveness.

## Quick Start

```bash
# Run full benchmark (all scenarios)
npm run benchmark

# Quick test (single scenario)
npm run benchmark:quick

# Generate HTML report from latest results
npm run benchmark:report

# Test specific scenario
npm run benchmark -- --scenario perfectionist_trap

# Test with specific user
npm run benchmark -- --user Tom

# Test at specific time
npm run benchmark -- --time morning
```

## Architecture

### 🎯 Test Scenarios

The benchmark includes **8 comprehensive scenarios** covering real-world productivity patterns:

1. **Perfectionist Trap** - Uncompleted "finalize" tasks pile up
2. **Momentum Builder** - Strong completion rate, building streak
3. **Context Switcher** - Too many different task types
4. **Deadline Pressure** - Time-sensitive tasks creating stress
5. **Recurring Avoider** - Same task appearing repeatedly
6. **Early Starter** - Minimal data, new user
7. **Ratio Crisis** - Dangerously low signal ratio
8. **Perfect Week** - Exceptional performance across all metrics

### 🔬 Quality Metrics

Each AI response is scored across 5 dimensions (0-100):

| Metric | Weight | What It Measures |
|--------|--------|------------------|
| **Personalization** | 25% | Uses firstName, references specific tasks, acknowledges context |
| **Actionability** | 30% | Concrete next steps, time-bound actions, 2-minute starters |
| **Pattern Recognition** | 25% | Identifies behavioral patterns, completion reality |
| **Emotional Tone** | 10% | Appropriate tone for situation, balanced encouragement |
| **Brevity** | 10% | Under 3 sentences, under 200 words, no repetition |

### 🔍 Mock Data Detection

Automatically flags generic/fake responses:

- **Generic phrases**: "keep up the good work", "stay focused"
- **Vague actions**: "try harder", "maintain focus"
- **Lack of specificity**: References "your tasks" instead of actual task names
- **Missing personalization**: Doesn't use user's firstName

## File Structure

```
benchmark/
├── config.js                    # Test scenarios and quality metrics
├── benchmarkRunner.js           # Main orchestrator
├── cli.js                       # Command-line interface
├── utils/
│   ├── testDataGenerator.js    # Generates realistic task data
│   ├── qualityAnalyzer.js       # Scores responses and detects mock data
│   └── reportGenerator.js       # Creates HTML reports
├── scenarios/                   # (Auto-generated test data)
└── results/
    ├── latest.json             # Most recent benchmark results
    ├── benchmark-TIMESTAMP.json # Historical results
    └── report.html             # Interactive visual report
```

## How It Works

### 1. Test Data Generation

For each scenario, the system:
- Generates realistic task arrays with timestamps
- Calculates metrics (ratio, streak, averages)
- Analyzes patterns (best hour, trends, consistency)
- Builds deep task analysis for Personal AI

### 2. AI Coach Invocation

Both coaches receive identical payloads:
- **Pattern AI**: Standard coaching prompt with summary metrics
- **Personal AI**: Enhanced prompt with full task visibility and completion reality

### 3. Quality Analysis

Each response is evaluated for:
- **Personalization**: Does it use the user's name? Reference specific tasks?
- **Actionability**: Does it provide concrete, time-bound next steps?
- **Pattern Recognition**: Does it correctly identify behavioral patterns?
- **Mock Data**: Does it use generic phrases or actual user data?

### 4. Comparison & Reporting

Results are:
- Scored on 0-100 scale with letter grades (A-F)
- Compared side-by-side with detailed breakdowns
- Saved as JSON for analysis
- Rendered as interactive HTML report

## Example Scenario: Recurring Avoider

```javascript
{
  id: 'recurring_avoider',
  profile: { currentRatio: 60, streak: 7, totalTasks: 54 },
  taskPatterns: [
    { text: 'Lead Outreach', type: 'signal', daysOld: 8, completed: false, occurrences: 6 }
    // ... more tasks
  ],
  expectedInsights: [
    'should identify recurring task "Lead Outreach"',
    'should mention task by exact name',
    'should give specific action for TODAY'
  ]
}
```

**Expected Personal AI Response:**
```json
{
  "message": "Tom, I see 'Lead Outreach' keeps appearing in your signals. Open LinkedIn NOW and find one warm contact.",
  "type": "motivation",
  "suggestions": [{
    "action": "Open LinkedIn and message one person you already know",
    "reasoning": "Starting with warm contacts removes the cold-call resistance"
  }]
}
```

**Quality Score Breakdown:**
- ✅ **Personalization: 100/100** - Uses firstName, mentions exact task name
- ✅ **Actionability: 100/100** - "NOW", "Open LinkedIn", specific action
- ✅ **Pattern Recognition: 100/100** - Identifies recurring task pattern
- ✅ **Emotional Tone: 90/100** - Direct but caring
- ✅ **Brevity: 95/100** - Concise, under 3 sentences

## Interpreting Results

### Overall Score Grades
- **A (90-100)**: Exceptional - Highly personalized, actionable, pattern-aware
- **B (80-89)**: Good - Solid coaching with minor gaps
- **C (70-79)**: Acceptable - Generic but functional
- **D (60-69)**: Weak - Missing key elements
- **F (<60)**: Failing - Mock data or irrelevant response

### Mock Data Severity Levels
- **Critical**: Missing firstName, no task references when expected
- **High**: Vague actions ("stay motivated"), lack of specificity
- **Medium**: Generic phrases ("keep up the good work")

### Category Winners
The comparison shows which AI excels at:
- **Personalization**: Using user data effectively
- **Actionability**: Providing concrete next steps
- **Pattern Recognition**: Identifying behavioral insights
- **Emotional Tone**: Matching appropriate coaching style
- **Brevity**: Staying concise and focused

## Advanced Usage

### Custom Scenarios

Create your own scenario in `config.js`:

```javascript
{
  id: 'my_scenario',
  name: 'Custom Test Case',
  description: 'Description of what you're testing',
  profile: {
    currentRatio: 75,
    streak: 5,
    totalTasks: 30
  },
  taskPatterns: [
    { text: 'Task name', type: 'signal', daysOld: 2, completed: false, occurrences: 3 }
  ],
  expectedInsights: [
    'what pattern should be detected',
    'what specific mention expected'
  ]
}
```

### Filter by Time of Day

Test coaching effectiveness at different times:

```bash
npm run benchmark -- --time morning    # 7am peak energy
npm run benchmark -- --time productive # 11am momentum
npm run benchmark -- --time declining  # 3pm afternoon slump
npm run benchmark -- --time rest       # 7pm evening
```

### Multiple Runs for Statistical Analysis

```bash
# Run 3 times and compare results
npm run benchmark && npm run benchmark && npm run benchmark
```

## Troubleshooting

### "API error: 403"
- Check that dev/beta user credentials are configured
- Verify environment variables (GROQ_API_KEY, etc.)
- Ensure premium access is granted to test users

### "No benchmark results found"
- Run `npm run benchmark` before generating report
- Check `benchmark/results/latest.json` exists

### Rate Limiting
- Pattern AI: 10 requests/hour
- Personal AI: 20 requests/hour
- Built-in 3-second delay between requests
- Use `--quick` flag for faster testing

## Key Findings (Update After Each Run)

Track improvements over time by documenting:

1. **Mock Data Patterns Identified**
2. **Specific Weaknesses Found**
3. **Prompt Engineering Changes Made**
4. **Score Improvements Achieved**

## Contributing

When adding new test scenarios:
1. Define clear expected insights
2. Include realistic task patterns with exact text
3. Specify appropriate ratio/streak/metrics
4. Document what coaching behavior you're testing

## License

Internal testing framework for Signal/Noise AI coach development.
