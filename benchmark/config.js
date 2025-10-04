/**
 * AI Coach Benchmark Configuration
 * Comprehensive test scenarios for Pattern AI vs Personal AI comparison
 */

export const BENCHMARK_CONFIG = {
  // Test user profiles
  users: [
    { firstName: 'Alex', email: 'alex@test.com' },
    { firstName: 'Maria', email: 'maria@test.com' },
    { firstName: 'Tom', email: 'tom@test.com' }
  ],

  // Test scenarios with different task patterns
  scenarios: [
    {
      id: 'perfectionist_trap',
      name: 'Perfectionist Trap - Many uncompleted "finalize" tasks',
      description: 'User keeps creating tasks like "finalize report", "complete project" but never marks them done',
      profile: {
        currentRatio: 65,
        streak: 5,
        totalTasks: 45
      },
      taskPatterns: [
        { text: 'Finalize Q4 report', type: 'signal', daysOld: 5, completed: false, occurrences: 3 },
        { text: 'Complete website redesign', type: 'signal', daysOld: 8, completed: false, occurrences: 2 },
        { text: 'Perfect pitch deck', type: 'signal', daysOld: 3, completed: false, occurrences: 4 },
        { text: 'Social media scrolling', type: 'noise', daysOld: 0, completed: true, occurrences: 5 },
        { text: 'Quick email check', type: 'signal', daysOld: 0, completed: true, occurrences: 8 },
        { text: 'Review design mockups', type: 'signal', daysOld: 2, completed: true, occurrences: 2 }
      ],
      expectedInsights: [
        'should detect perfectionism pattern',
        'should suggest breaking down large tasks',
        'should reference specific uncompleted tasks by name'
      ]
    },

    {
      id: 'momentum_builder',
      name: 'Momentum Builder - Strong completion rate, building streak',
      description: 'User completing most signals, building consistent daily streak',
      profile: {
        currentRatio: 85,
        streak: 12,
        totalTasks: 78
      },
      taskPatterns: [
        { text: 'Morning workout', type: 'signal', daysOld: 0, completed: true, occurrences: 12 },
        { text: 'Client outreach - 3 calls', type: 'signal', daysOld: 0, completed: true, occurrences: 8 },
        { text: 'Product feature planning', type: 'signal', daysOld: 1, completed: true, occurrences: 5 },
        { text: 'Team standup', type: 'signal', daysOld: 0, completed: true, occurrences: 10 },
        { text: 'Email triage', type: 'noise', daysOld: 0, completed: true, occurrences: 6 },
        { text: 'Coffee break chat', type: 'noise', daysOld: 0, completed: true, occurrences: 4 }
      ],
      expectedInsights: [
        'should celebrate streak and momentum',
        'should acknowledge specific completed tasks',
        'should encourage maintaining the pattern'
      ]
    },

    {
      id: 'context_switcher',
      name: 'Context Switcher - Too many different task types',
      description: 'User jumping between unrelated tasks, low completion rate',
      profile: {
        currentRatio: 55,
        streak: 3,
        totalTasks: 62
      },
      taskPatterns: [
        { text: 'Design logo concept', type: 'signal', daysOld: 4, completed: false, occurrences: 1 },
        { text: 'Write blog post', type: 'signal', daysOld: 5, completed: false, occurrences: 1 },
        { text: 'Fix website bug', type: 'signal', daysOld: 3, completed: false, occurrences: 1 },
        { text: 'Plan marketing campaign', type: 'signal', daysOld: 6, completed: false, occurrences: 1 },
        { text: 'Update LinkedIn', type: 'signal', daysOld: 2, completed: true, occurrences: 1 },
        { text: 'Check analytics', type: 'noise', daysOld: 0, completed: true, occurrences: 8 },
        { text: 'Browse design inspiration', type: 'noise', daysOld: 0, completed: true, occurrences: 7 },
        { text: 'Read industry news', type: 'noise', daysOld: 0, completed: true, occurrences: 6 }
      ],
      expectedInsights: [
        'should detect context switching pattern',
        'should recommend focus on one area',
        'should identify scattered energy'
      ]
    },

    {
      id: 'deadline_pressure',
      name: 'Deadline Pressure - Time-sensitive tasks piling up',
      description: 'Multiple urgent tasks with deadline keywords, high stress pattern',
      profile: {
        currentRatio: 70,
        streak: 4,
        totalTasks: 38
      },
      taskPatterns: [
        { text: 'Urgent: Client proposal due Friday', type: 'signal', daysOld: 2, completed: false, occurrences: 1 },
        { text: 'ASAP: Fix production bug', type: 'signal', daysOld: 1, completed: true, occurrences: 1 },
        { text: 'Deadline: Submit tax forms', type: 'signal', daysOld: 4, completed: false, occurrences: 2 },
        { text: 'Emergency meeting prep', type: 'signal', daysOld: 0, completed: true, occurrences: 2 },
        { text: 'Quick status update', type: 'signal', daysOld: 0, completed: true, occurrences: 5 },
        { text: 'Stress relief - walk', type: 'noise', daysOld: 0, completed: true, occurrences: 3 }
      ],
      expectedInsights: [
        'should detect deadline pressure pattern',
        'should prioritize urgent uncompleted tasks',
        'should suggest stress management'
      ]
    },

    {
      id: 'recurring_avoider',
      name: 'Recurring Avoider - Same task appearing repeatedly',
      description: 'Specific task keeps reappearing without completion',
      profile: {
        currentRatio: 60,
        streak: 7,
        totalTasks: 54
      },
      taskPatterns: [
        { text: 'Lead Outreach', type: 'signal', daysOld: 8, completed: false, occurrences: 6 },
        { text: 'Update portfolio', type: 'signal', daysOld: 12, completed: false, occurrences: 5 },
        { text: 'Daily standup', type: 'signal', daysOld: 0, completed: true, occurrences: 7 },
        { text: 'Code review', type: 'signal', daysOld: 0, completed: true, occurrences: 6 },
        { text: 'Slack messages', type: 'noise', daysOld: 0, completed: true, occurrences: 9 },
        { text: 'Twitter check', type: 'noise', daysOld: 0, completed: true, occurrences: 8 }
      ],
      expectedInsights: [
        'should identify recurring task "Lead Outreach"',
        'should mention task by exact name',
        'should give specific action for TODAY'
      ]
    },

    {
      id: 'early_starter',
      name: 'Early Starter - Few tasks, just beginning journey',
      description: 'New user with minimal data, testing coach threshold',
      profile: {
        currentRatio: 75,
        streak: 1,
        totalTasks: 12
      },
      taskPatterns: [
        { text: 'Plan weekly goals', type: 'signal', daysOld: 0, completed: true, occurrences: 1 },
        { text: 'Morning review', type: 'signal', daysOld: 0, completed: true, occurrences: 2 },
        { text: 'Focus work block', type: 'signal', daysOld: 0, completed: false, occurrences: 1 },
        { text: 'Email inbox zero', type: 'noise', daysOld: 0, completed: true, occurrences: 2 }
      ],
      expectedInsights: [
        'should encourage building habit',
        'should be supportive, not overwhelming',
        'should avoid complex pattern analysis with limited data'
      ]
    },

    {
      id: 'ratio_crisis',
      name: 'Ratio Crisis - Very low signal ratio, needs intervention',
      description: 'Mostly noise tasks, signal ratio dangerously low',
      profile: {
        currentRatio: 25,
        streak: 1,
        totalTasks: 48
      },
      taskPatterns: [
        { text: 'Strategic planning session', type: 'signal', daysOld: 7, completed: false, occurrences: 1 },
        { text: 'Important client call', type: 'signal', daysOld: 5, completed: false, occurrences: 1 },
        { text: 'Email marathon', type: 'noise', daysOld: 0, completed: true, occurrences: 12 },
        { text: 'Slack responding', type: 'noise', daysOld: 0, completed: true, occurrences: 15 },
        { text: 'Meeting attendance', type: 'noise', daysOld: 0, completed: true, occurrences: 8 },
        { text: 'Social media', type: 'noise', daysOld: 0, completed: true, occurrences: 10 }
      ],
      expectedInsights: [
        'should trigger warning or reset action',
        'should be direct about ratio problem',
        'should prioritize immediate action'
      ]
    },

    {
      id: 'perfect_week',
      name: 'Perfect Week - Crushing it across all metrics',
      description: 'High ratio, long streak, strong completion rate',
      profile: {
        currentRatio: 95,
        streak: 21,
        totalTasks: 125
      },
      taskPatterns: [
        { text: 'Deep work: Product development', type: 'signal', daysOld: 0, completed: true, occurrences: 15 },
        { text: 'Client strategy calls', type: 'signal', daysOld: 0, completed: true, occurrences: 12 },
        { text: 'Team leadership 1on1s', type: 'signal', daysOld: 0, completed: true, occurrences: 8 },
        { text: 'Content creation', type: 'signal', daysOld: 0, completed: true, occurrences: 10 },
        { text: 'Quick admin tasks', type: 'noise', daysOld: 0, completed: true, occurrences: 3 }
      ],
      expectedInsights: [
        'should celebrate exceptional performance',
        'should acknowledge specific achievements',
        'should encourage maintaining excellence'
      ]
    }
  ],

  // Quality metrics for evaluation
  qualityMetrics: {
    personalization: {
      weight: 25,
      checks: [
        'uses user firstName',
        'references specific task by exact text',
        'acknowledges user context (time of day, streak, etc.)'
      ]
    },
    actionability: {
      weight: 30,
      checks: [
        'provides concrete next step',
        'includes time-bound action (TODAY, NOW, etc.)',
        'suggests specific 2-minute starter step'
      ]
    },
    patternRecognition: {
      weight: 25,
      checks: [
        'identifies behavioral patterns correctly',
        'references completion reality vs intentions',
        'detects recurring tasks or themes'
      ]
    },
    emotionalTone: {
      weight: 10,
      checks: [
        'matches appropriate tone for situation',
        'balances encouragement with honesty',
        'avoids generic platitudes'
      ]
    },
    brevity: {
      weight: 10,
      checks: [
        'main message under 3 sentences',
        'total response under 200 words',
        'no repetition or filler'
      ]
    }
  },

  // Mock data detection patterns
  mockDataDetectors: {
    genericPhrases: [
      'you can do it',
      'keep up the good work',
      'stay focused',
      'great job',
      'nice work',
      'well done',
      'proud of you'
    ],
    vagueActions: [
      'try harder',
      'stay motivated',
      'keep going',
      'maintain focus',
      'stay on track'
    ],
    lackOfSpecificity: [
      'your tasks', // should mention actual task names
      'recent work', // should be specific
      'productivity patterns', // should name the pattern
      'current progress' // should include actual numbers
    ]
  },

  // Test variations
  variations: {
    timeOfDay: [
      { hour: 7, label: 'morning', context: 'peak energy' },
      { hour: 11, label: 'productive', context: 'momentum time' },
      { hour: 15, label: 'declining', context: 'afternoon slump' },
      { hour: 19, label: 'rest', context: 'evening wind-down' }
    ],
    triggerTypes: [
      'manual',
      'streak_milestone',
      'ratio_warning',
      'perfect_day'
    ],
    languages: ['en', 'de']
  }
};

export const RATE_LIMIT = {
  patternAI: 10, // requests per hour
  personalAI: 20  // requests per hour
};
