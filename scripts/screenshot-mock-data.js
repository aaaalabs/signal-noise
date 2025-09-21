// Marketing-optimized mock data for Play Store screenshots
// Based on advice from ASO experts like Steve P. Young, Gabriel Machuret, and Thomas Petit

const mockDataScenarios = {
  // Scenario 1: Perfect productive day (shows achievement)
  perfectDay: {
    tasks: [
      { type: 'signal', title: 'Complete Q4 strategy presentation', timestamp: new Date().setHours(9, 0) },
      { type: 'signal', title: 'Review team performance metrics', timestamp: new Date().setHours(10, 30) },
      { type: 'signal', title: 'Client proposal finalization', timestamp: new Date().setHours(11, 0) },
      { type: 'signal', title: 'Product roadmap planning', timestamp: new Date().setHours(14, 0) },
      { type: 'noise', title: 'Check social media', timestamp: new Date().setHours(15, 30) },
      { type: 'signal', title: 'Code review for release', timestamp: new Date().setHours(16, 0) }
    ],
    history: generateHistory(85, 30), // 85% average over 30 days
    badges: ['early-bird', 'streak-7', 'perfect-ratio', 'focused-Friday'],
    settings: {
      targetRatio: 80,
      notifications: true,
      firstName: 'Alex'
    }
  },

  // Scenario 2: Improvement journey (shows progress)
  improvementStory: {
    tasks: [
      { type: 'signal', title: 'Morning deep work session', timestamp: new Date().setHours(6, 0) },
      { type: 'signal', title: 'Write blog post', timestamp: new Date().setHours(8, 0) },
      { type: 'signal', title: 'Customer interviews', timestamp: new Date().setHours(10, 0) },
      { type: 'noise', title: 'Email cleanup', timestamp: new Date().setHours(11, 30) },
      { type: 'signal', title: 'Sprint planning', timestamp: new Date().setHours(13, 0) }
    ],
    history: generateProgressiveHistory(), // Shows improvement from 60% to 85%
    badges: ['comeback-kid', 'improving', 'streak-3'],
    settings: {
      targetRatio: 80,
      notifications: true,
      firstName: 'Sarah'
    }
  },

  // Scenario 3: AI Coach interaction (Premium feature highlight)
  aiCoachActive: {
    tasks: [
      { type: 'signal', title: 'Design system updates', timestamp: new Date().setHours(9, 0) },
      { type: 'signal', title: 'User research analysis', timestamp: new Date().setHours(10, 0) },
      { type: 'signal', title: 'API documentation', timestamp: new Date().setHours(11, 0) },
      { type: 'noise', title: 'Team chat', timestamp: new Date().setHours(12, 0) },
      { type: 'signal', title: 'Feature development', timestamp: new Date().setHours(13, 0) }
    ],
    history: generateHistory(82, 30),
    badges: ['early-bird', 'consistent', 'streak-14', 'pattern-master'],
    settings: {
      targetRatio: 80,
      notifications: true,
      firstName: 'Marcus',
      premium: true,
      lastCoachMessage: "Great focus this morning! You're 2% above your target. Keep this momentum through lunch."
    }
  },

  // Scenario 4: Analytics view (shows insights)
  analyticsView: {
    tasks: generateRealisticWeek(),
    history: generateRealisticHistory(),
    badges: ['streak-30', 'early-bird', 'perfect-ratio', 'pattern-master', 'milestone-100'],
    settings: {
      targetRatio: 80,
      notifications: true,
      firstName: 'Emma'
    }
  },

  // Scenario 5: Onboarding (first experience)
  newUser: {
    tasks: [
      { type: 'signal', title: 'Set quarterly goals', timestamp: new Date().setHours(9, 0) },
      { type: 'signal', title: 'Team standup', timestamp: new Date().setHours(9, 30) },
      { type: 'noise', title: 'Browse news', timestamp: new Date().setHours(10, 0) }
    ],
    history: [],
    badges: [],
    settings: {
      targetRatio: 80,
      notifications: true,
      firstName: ''
    }
  }
};

// Helper functions
function generateHistory(averageRatio, days) {
  const history = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Add some variance for realism
    const variance = (Math.random() - 0.5) * 10;
    const ratio = Math.min(100, Math.max(60, averageRatio + variance));

    history.push({
      date: date.toISOString().split('T')[0],
      ratio: Math.round(ratio),
      signalCount: Math.floor(Math.random() * 8) + 12,
      noiseCount: Math.floor(Math.random() * 3) + 2
    });
  }

  return history;
}

function generateProgressiveHistory() {
  const history = [];
  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Progressive improvement from 60% to 85%
    const baseRatio = 60 + ((29 - i) / 29) * 25;
    const variance = (Math.random() - 0.5) * 5;
    const ratio = Math.min(95, Math.max(55, baseRatio + variance));

    history.push({
      date: date.toISOString().split('T')[0],
      ratio: Math.round(ratio),
      signalCount: Math.floor(Math.random() * 8) + 10,
      noiseCount: Math.floor(Math.random() * 4) + 1
    });
  }

  return history;
}

function generateRealisticWeek() {
  const tasks = [];
  const now = new Date();
  const productiveTasks = [
    'Strategic planning session',
    'Code review and refactoring',
    'Customer success calls',
    'Product feature specs',
    'Team 1:1 meetings',
    'Quarterly report writing',
    'Design system review',
    'API development',
    'User research synthesis',
    'Performance optimization'
  ];

  const distractionTasks = [
    'Check emails',
    'Social media',
    'News reading',
    'Slack messages'
  ];

  for (let day = 6; day >= 0; day--) {
    const taskDate = new Date(now);
    taskDate.setDate(taskDate.getDate() - day);

    // Add 4-8 productive tasks per day
    const signalCount = Math.floor(Math.random() * 5) + 4;
    for (let i = 0; i < signalCount; i++) {
      const hour = 8 + Math.floor(Math.random() * 10);
      tasks.push({
        type: 'signal',
        title: productiveTasks[Math.floor(Math.random() * productiveTasks.length)],
        timestamp: taskDate.setHours(hour, Math.floor(Math.random() * 60))
      });
    }

    // Add 1-2 distractions per day
    const noiseCount = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < noiseCount; i++) {
      const hour = 9 + Math.floor(Math.random() * 10);
      tasks.push({
        type: 'noise',
        title: distractionTasks[Math.floor(Math.random() * distractionTasks.length)],
        timestamp: taskDate.setHours(hour, Math.floor(Math.random() * 60))
      });
    }
  }

  return tasks.sort((a, b) => b.timestamp - a.timestamp);
}

function generateRealisticHistory() {
  const history = [];
  const now = new Date();

  // Generate a month of realistic data with weekly patterns
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dayOfWeek = date.getDay();

    // Weekends typically have lower ratios
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseRatio = isWeekend ? 70 : 82;

    // Monday and Friday often have more distractions
    const dayVariance = (dayOfWeek === 1 || dayOfWeek === 5) ? -5 : 0;

    const variance = (Math.random() - 0.5) * 8;
    const ratio = Math.min(95, Math.max(60, baseRatio + dayVariance + variance));

    history.push({
      date: date.toISOString().split('T')[0],
      ratio: Math.round(ratio),
      signalCount: isWeekend ? Math.floor(Math.random() * 5) + 3 : Math.floor(Math.random() * 8) + 10,
      noiseCount: Math.floor(Math.random() * 4) + 1
    });
  }

  return history;
}

// Export for use in screenshot script
export default mockDataScenarios;