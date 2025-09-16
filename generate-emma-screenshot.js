import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Emma's complete 26-day journey data
const EMMA_JOURNEY = {
  week1: {
    signal: [
      "Customer interview - churn analysis",
      "Q4 roadmap first draft",
      "1:1 with struggling engineer",
      "Product spec review - payments",
      "User research planning",
      "Sprint retro facilitation"
    ],
    noise: [
      "Slack - replied to 47 messages",
      "Email triage - 2 hours",
      "Random vendor demo I didn't need",
      "Browsed ProductHunt for 'inspiration'",
      "LinkedIn scrolling during lunch",
      "Unnecessary sync meeting - could've been async",
      "Reorganized Notion workspace (procrastination)",
      "Watched competitor webinar (not relevant)",
      "HackerNews rabbit hole - 45 min",
      "Cleaned up Google Drive folders"
    ]
  },
  week2: {
    signal: [
      "User research synthesis - 5 key insights",
      "Wrote PRD for payment feature",
      "Strategic pricing model analysis",
      "Mentored junior PM on stakeholder management",
      "API design review with engineering",
      "Competitive analysis - Stripe vs Adyen",
      "Customer success metrics dashboard",
      "Quarterly planning session prep",
      "Feature flag strategy document"
    ],
    noise: [
      "Twitter/X - checked tech news",
      "Slack - general channel banter",
      "Meeting that should've been email",
      "Coffee chat - turned into gossip",
      "Debugging my personal productivity setup",
      "Reading about productivity tools"
    ]
  },
  week3: {
    signal: [
      "Board deck - Q3 metrics narrative",
      "Customer success playbook v2",
      "Feature prioritization framework",
      "Partnership proposal - potential 200k ARR",
      "Team OKRs workshop facilitation",
      "Technical spec review - infrastructure",
      "Pricing experiment design",
      "Stakeholder alignment - launch strategy",
      "Customer advisory board prep",
      "Migration plan - legacy features",
      "Onboarding flow optimization",
      "Data pipeline requirements"
    ],
    noise: [
      "Email batch - 25 min",
      "Slack check - 15 min blocks",
      "Team standup (necessary but not deep work)",
      "Office birthday celebration"
    ]
  },
  week4: {
    signal: [
      "Customer call - €500k enterprise deal requirements",
      "Product vision 2025 - first principles thinking",
      "Data analysis - user activation funnel optimization",
      "Engineering sync - technical debt prioritization",
      "Write blog: How we reduced churn by 40%",
      "Design review - mobile app v3",
      "Mentor session - career development plan",
      "Sprint planning prep - story points review",
      "Tomorrow's deep work planning",
      "Market research - emerging competitors",
      "Customer journey mapping workshop",
      "Revenue impact analysis",
      "Platform architecture decisions",
      "Go-to-market strategy refinement"
    ],
    noise: [
      "Email - quick responses only",
      "Slack - team check-in",
      "LinkedIn - posted article, logged off",
      "Quick Twitter scan - 5 min"
    ]
  }
};

// Generate Emma's 26-day history with realistic patterns
function generateEmmaHistory() {
  const history = [];
  const today = new Date();

  // Start 26 days ago
  for (let day = 25; day >= 0; day--) {
    const date = new Date(today);
    date.setDate(date.getDate() - day);
    const dayOfWeek = date.getDay();
    const weekNum = Math.floor((25 - day) / 7);

    let baseRatio, signalCount, noiseCount;

    // Week 1: Struggling (58-65%)
    if (weekNum === 0) {
      baseRatio = 58 + (day % 7) * 1;
      if (dayOfWeek === 1) baseRatio -= 3; // Monday struggle
      if (dayOfWeek === 0 || dayOfWeek === 6) baseRatio -= 5; // Weekend lower

      signalCount = 3 + Math.floor(Math.random() * 3);
      noiseCount = Math.floor(signalCount * (100 - baseRatio) / baseRatio);
    }

    // Week 2: Learning (65-74%)
    else if (weekNum === 1) {
      baseRatio = 65 + ((day - 7) % 7) * 1.5;

      // Thursday week 2: Bad day - production issue
      if (day === 11) baseRatio = 62;

      if (dayOfWeek === 2 || dayOfWeek === 3) baseRatio += 3; // Tue/Wed good
      if (dayOfWeek === 0 || dayOfWeek === 6) baseRatio -= 8;

      signalCount = 5 + Math.floor(Math.random() * 4);
      noiseCount = Math.floor(signalCount * (100 - baseRatio) / baseRatio);
    }

    // Week 3: Momentum (74-81%)
    else if (weekNum === 2) {
      baseRatio = 74 + ((day - 14) % 7) * 1;

      // Monday week 3: Post-weekend adjustment
      if (day === 7) baseRatio = 68;

      if (dayOfWeek === 2 || dayOfWeek === 3) baseRatio += 4;
      if (dayOfWeek === 0 || dayOfWeek === 6) baseRatio -= 10;

      signalCount = 7 + Math.floor(Math.random() * 5);
      noiseCount = Math.floor(signalCount * (100 - baseRatio) / baseRatio);
    }

    // Week 4: Mastery (81-85%)
    else {
      baseRatio = 81 + ((day - 21) % 7) * 0.7;

      // Natural patterns
      if (dayOfWeek === 1) baseRatio = 78; // Monday meetings
      if (dayOfWeek === 2 || dayOfWeek === 3) baseRatio = 87 + Math.random() * 2; // Peak
      if (dayOfWeek === 4) baseRatio = 85;
      if (dayOfWeek === 5) baseRatio = 80;
      if (dayOfWeek === 0 || dayOfWeek === 6) baseRatio = 70; // Weekend learning

      signalCount = 9 + Math.floor(Math.random() * 6);
      noiseCount = Math.floor(signalCount * (100 - baseRatio) / baseRatio);
    }

    // Add natural variance
    baseRatio += (Math.random() - 0.5) * 4;
    baseRatio = Math.min(92, Math.max(55, baseRatio));

    history.push({
      date: date.toISOString().split('T')[0],
      ratio: Math.round(baseRatio),
      signalCount: Math.max(2, signalCount),
      noiseCount: Math.max(1, noiseCount)
    });
  }

  return history;
}

// Generate today's tasks for Emma (Day 26)
function generateEmmaToday() {
  const tasks = [];
  const now = Date.now();

  // Morning golden hours (6:30-11:30)
  tasks.push({
    type: 'signal',
    title: 'Customer call - €500k enterprise deal requirements',
    timestamp: now - (9 * 3600000), // 9 hours ago
    id: 't1'
  });

  tasks.push({
    type: 'signal',
    title: 'Product vision 2025 - first principles thinking',
    timestamp: now - (8 * 3600000),
    id: 't2'
  });

  tasks.push({
    type: 'signal',
    title: 'Data analysis - user activation funnel optimization',
    timestamp: now - (7 * 3600000),
    id: 't3'
  });

  tasks.push({
    type: 'signal',
    title: 'Engineering sync - technical debt prioritization',
    timestamp: now - (6 * 3600000),
    id: 't4'
  });

  // Midday transition
  tasks.push({
    type: 'noise',
    title: 'Email - quick responses only',
    timestamp: now - (5.5 * 3600000),
    id: 't5'
  });

  tasks.push({
    type: 'signal',
    title: 'Lunch walk + audiobook: Thinking Fast and Slow',
    timestamp: now - (5 * 3600000),
    id: 't6'
  });

  // Afternoon deep work
  tasks.push({
    type: 'signal',
    title: 'Write blog: How we reduced churn by 40%',
    timestamp: now - (4 * 3600000),
    id: 't7'
  });

  tasks.push({
    type: 'signal',
    title: 'Design review - mobile app v3',
    timestamp: now - (3 * 3600000),
    id: 't8'
  });

  tasks.push({
    type: 'signal',
    title: 'Mentor session - career development plan',
    timestamp: now - (2 * 3600000),
    id: 't9'
  });

  tasks.push({
    type: 'noise',
    title: 'Slack - team check-in',
    timestamp: now - (1.5 * 3600000),
    id: 't10'
  });

  tasks.push({
    type: 'signal',
    title: 'Sprint planning prep - story points review',
    timestamp: now - (1 * 3600000),
    id: 't11'
  });

  // Recent
  tasks.push({
    type: 'signal',
    title: "Tomorrow's deep work planning",
    timestamp: now - (30 * 60000), // 30 min ago
    id: 't12'
  });

  tasks.push({
    type: 'signal',
    title: 'Revenue impact analysis - Q1 features',
    timestamp: now - (15 * 60000), // 15 min ago
    id: 't13'
  });

  return tasks;
}

// Complete mock data for Emma
function getEmmaMockData() {
  return {
    tasks: generateEmmaToday(),
    history: generateEmmaHistory(),
    badges: ['early-bird', 'streak-7', 'perfect-ratio', 'focused-friday', 'comeback-kid'],
    patterns: {
      mostProductiveHour: 9,
      leastProductiveHour: 15,
      bestDay: 'Tuesday',
      averageSignalDuration: 52,
      weeklyImprovement: 7
    },
    settings: {
      targetRatio: 80,
      notifications: true,
      firstName: 'Emma'
    }
  };
}

async function generatePerfectScreenshot() {
  console.log('\n🎯 Generating Emma\'s Perfect Screenshot\n');
  console.log('━'.repeat(60));
  console.log('Persona: Emma Chen - Senior Product Manager');
  console.log('Journey: 26 days from chaos (58%) to mastery (85%)');
  console.log('Story: Realistic transformation with natural patterns');
  console.log('━'.repeat(60) + '\n');

  const dir = path.join(__dirname, 'screenshots-emma');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const browser = await chromium.launch({
    headless: false,
    args: ['--disable-blink-features=AutomationControlled']
  });

  const context = await browser.newContext({
    viewport: {
      width: 1080,
      height: 1920
    },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    colorScheme: 'dark',
    locale: 'en-US'
  });

  const page = await context.newPage();

  try {
    // Navigate to app
    await page.goto('http://localhost:5176', { waitUntil: 'networkidle' });

    // Inject Emma's data
    const emmaData = getEmmaMockData();
    await page.evaluate((data) => {
      localStorage.clear();
      localStorage.setItem('signal_noise_onboarded', 'true');
      localStorage.setItem('signal_noise_data', JSON.stringify(data));
      localStorage.setItem('onboarding_complete', 'true');
      localStorage.setItem('hasSeenWelcome', 'true');

      // Add current time display
      const now = new Date();
      now.setHours(15, 47); // 3:47 PM
      localStorage.setItem('screenshot_time', now.toISOString());

      location.reload();
    }, emmaData);

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Add subtle highlight to ratio display
    await page.evaluate(() => {
      const ratioElement = document.querySelector('.ratio-display, [class*="ratio"]');
      if (ratioElement) {
        ratioElement.style.transform = 'scale(1.02)';
        ratioElement.style.transition = 'all 0.3s ease';
      }
    });

    // Take the perfect screenshot
    const filepath = path.join(dir, 'emma-perfect-dashboard.png');
    await page.screenshot({
      path: filepath,
      fullPage: false
    });

    console.log('✅ Perfect screenshot generated!\n');
    console.log('📊 Emma\'s Current Stats:');
    console.log('   • Today: 85% productive (11 signal, 2 noise)');
    console.log('   • Week 1: Started at 58% (chaos)');
    console.log('   • Week 4: Maintaining 85% (mastery)');
    console.log('   • 7-day streak above 80%');
    console.log('   • Peak hours: 9-11am, 2-4pm\n');

    console.log('📝 Today\'s Highlight Tasks:');
    console.log('   • "€500k enterprise deal requirements"');
    console.log('   • "Product vision 2025 - first principles"');
    console.log('   • "How we reduced churn by 40%" blog\n');

    console.log('🎯 Why This Works:');
    console.log('   • Relatable persona (PM struggling with focus)');
    console.log('   • Realistic 26-day transformation arc');
    console.log('   • Natural daily patterns (not robotic)');
    console.log('   • Authentic task names from real PM work');
    console.log('   • Shows measurable improvement\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await context.close();
    await browser.close();
  }

  console.log('📁 Screenshot saved to: screenshots-emma/\n');
  console.log('Next steps: Review and approve, then generate remaining screenshots.\n');
}

// Run
(async () => {
  console.log('⚠️  Ensure dev server is running on http://localhost:5176');
  console.log('Starting in 3 seconds...\n');
  await new Promise(resolve => setTimeout(resolve, 3000));

  await generatePerfectScreenshot();
})();