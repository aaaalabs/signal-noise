import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Realistic, interesting tasks that tell a story
const REALISTIC_TASKS = {
  signal: [
    // Strategic & Leadership
    'Quarterly OKR planning with leadership team',
    'Pitch deck for Series A funding round',
    'Strategic partnership negotiation - Microsoft',
    'Board presentation Q4 results',
    'Team hiring interviews - Senior Engineer',
    'Product roadmap 2025 planning',
    'Customer success strategy review',
    'Competitive analysis - market positioning',

    // Deep Work & Creation
    'Write technical blog post on AI ethics',
    'Design system architecture refactor',
    'Machine learning model optimization',
    'API v2.0 documentation',
    'Patent application draft - innovation',
    'Keynote preparation - Tech Summit Vienna',
    'Book chapter: Productivity in remote teams',
    'Research paper - quantum computing',

    // High-Impact Meetings
    'Client demo - €500k enterprise deal',
    'Investor update call - monthly',
    'Team 1:1 - performance coaching',
    'Customer interview - product feedback',
    'Mentor session with startup founders',
    'Sales strategy with revenue team',
    'Partnership kick-off - Amazon AWS',
    'Advisory board meeting',

    // Technical Excellence
    'Code review - payment system security',
    'Database performance optimization',
    'Deploy critical infrastructure update',
    'Incident post-mortem analysis',
    'Security audit preparation',
    'Technical debt sprint planning',
    'Algorithm optimization - 10x speedup',
    'System architecture documentation'
  ],

  noise: [
    'Check Twitter mentions',
    'Browse LinkedIn feed',
    'Email newsletter cleanup',
    'Slack casual conversations',
    'Read tech news on HackerNews',
    'YouTube tutorial rabbit hole',
    'Shopping for office supplies',
    'Coffee chat - non-work',
    'Reddit browsing',
    'Instagram stories check',
    'Clear spam folder',
    'Update social media bio',
    'Browse productivity apps',
    'Watch conference recordings',
    'Organize desktop files'
  ]
};

// Generate realistic 30-day history with patterns
function generateRealistic30DayHistory() {
  const history = [];
  const now = new Date();

  // Create a story: started at 65%, improved to 85% over 30 days
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    const dayOfWeek = date.getDay();
    const weekNumber = Math.floor((29 - i) / 7);

    // Base ratio improves week by week
    let baseRatio;
    if (weekNumber === 0) baseRatio = 65; // Week 1: Learning phase
    if (weekNumber === 1) baseRatio = 72; // Week 2: Getting better
    if (weekNumber === 2) baseRatio = 78; // Week 3: Good progress
    if (weekNumber === 3) baseRatio = 83; // Week 4: Excellent
    if (weekNumber === 4) baseRatio = 85; // Current: Maintaining

    // Natural patterns
    let dayAdjustment = 0;

    // Mondays are slightly lower (recovery from weekend)
    if (dayOfWeek === 1) dayAdjustment = -5;

    // Tuesday-Thursday are peak days
    if (dayOfWeek >= 2 && dayOfWeek <= 4) dayAdjustment = 3;

    // Fridays taper off
    if (dayOfWeek === 5) dayAdjustment = -2;

    // Weekends are lower but still productive
    if (dayOfWeek === 0 || dayOfWeek === 6) dayAdjustment = -8;

    // Add realistic variance
    const randomVariance = (Math.random() - 0.5) * 6;

    // Calculate final ratio
    let ratio = baseRatio + dayAdjustment + randomVariance;
    ratio = Math.min(95, Math.max(55, ratio));

    // Task counts based on day type
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const signalCount = isWeekend ?
      4 + Math.floor(Math.random() * 3) :
      8 + Math.floor(Math.random() * 6);

    const noiseCount = Math.round((signalCount * (100 - ratio)) / ratio);

    history.push({
      date: date.toISOString().split('T')[0],
      ratio: Math.round(ratio),
      signalCount,
      noiseCount: Math.max(1, noiseCount)
    });
  }

  return history;
}

// Generate tasks for a specific time period
function generateTasksForPeriod(daysBack = 7) {
  const tasks = [];
  const now = Date.now();

  // Distribute tasks across the period
  for (let day = daysBack - 1; day >= 0; day--) {
    const dayStart = now - (day * 86400000);

    // Determine task count for this day
    const isToday = day === 0;
    const signalCount = isToday ? 8 : 3 + Math.floor(Math.random() * 4);
    const noiseCount = isToday ? 2 : 1 + Math.floor(Math.random() * 2);

    // Morning block (6 AM - 12 PM) - Most productive
    for (let i = 0; i < Math.floor(signalCount * 0.5); i++) {
      const hour = 6 + Math.floor(Math.random() * 6);
      const taskIndex = Math.floor(Math.random() * REALISTIC_TASKS.signal.length);
      tasks.push({
        type: 'signal',
        title: REALISTIC_TASKS.signal[taskIndex],
        timestamp: dayStart + (hour * 3600000) + Math.floor(Math.random() * 3600000),
        id: `s${day}-${i}`
      });
    }

    // Afternoon (12 PM - 6 PM) - Mixed
    for (let i = 0; i < Math.ceil(signalCount * 0.3); i++) {
      const hour = 12 + Math.floor(Math.random() * 6);
      const taskIndex = Math.floor(Math.random() * REALISTIC_TASKS.signal.length);
      tasks.push({
        type: 'signal',
        title: REALISTIC_TASKS.signal[taskIndex],
        timestamp: dayStart + (hour * 3600000) + Math.floor(Math.random() * 3600000),
        id: `s${day}-a${i}`
      });
    }

    // Add noise throughout the day
    for (let i = 0; i < noiseCount; i++) {
      const hour = 8 + Math.floor(Math.random() * 10);
      const taskIndex = Math.floor(Math.random() * REALISTIC_TASKS.noise.length);
      tasks.push({
        type: 'noise',
        title: REALISTIC_TASKS.noise[taskIndex],
        timestamp: dayStart + (hour * 3600000) + Math.floor(Math.random() * 3600000),
        id: `n${day}-${i}`
      });
    }

    // Evening productive session (6 PM - 10 PM)
    if (day === 0 || Math.random() > 0.5) {
      for (let i = 0; i < Math.floor(signalCount * 0.2); i++) {
        const hour = 18 + Math.floor(Math.random() * 4);
        const taskIndex = Math.floor(Math.random() * REALISTIC_TASKS.signal.length);
        tasks.push({
          type: 'signal',
          title: REALISTIC_TASKS.signal[taskIndex],
          timestamp: dayStart + (hour * 3600000) + Math.floor(Math.random() * 3600000),
          id: `s${day}-e${i}`
        });
      }
    }
  }

  // Sort by timestamp (most recent first)
  return tasks.sort((a, b) => b.timestamp - a.timestamp);
}

// Mock data scenarios with realistic content
const SCENARIOS = {
  highPerformer: {
    data: {
      tasks: generateTasksForPeriod(3), // Last 3 days of tasks
      history: generateRealistic30DayHistory(),
      badges: ['early-bird', 'streak-7', 'perfect-ratio', 'focused-friday', 'pattern-master'],
      patterns: {
        mostProductiveHour: 9,
        leastProductiveHour: 15,
        bestDay: 'Tuesday',
        averageSignalDuration: 45,
        weeklyImprovement: 12
      },
      settings: {
        targetRatio: 80,
        notifications: true,
        firstName: 'Alex'
      }
    },
    description: 'High performer with consistent improvement'
  },

  growthStory: {
    data: {
      tasks: generateTasksForPeriod(7), // Full week
      history: generateRealistic30DayHistory(),
      badges: ['comeback-kid', 'improving', 'streak-3', 'early-bird'],
      patterns: {
        mostProductiveHour: 10,
        leastProductiveHour: 14,
        bestDay: 'Wednesday',
        averageSignalDuration: 38,
        weeklyImprovement: 18
      },
      settings: {
        targetRatio: 80,
        notifications: true,
        firstName: 'Sarah'
      }
    },
    description: 'Growth story showing clear improvement'
  }
};

const DEVICES = {
  phone: {
    width: 1080,
    height: 1920,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  },
  tablet7: {
    width: 1600,
    height: 2560,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  }
};

const SCREENSHOTS = [
  {
    id: '01-hero',
    name: 'Todays Focus - 85 Percent',
    scenario: 'highPerformer',
    caption: '85% Productive Today',
    waitTime: 2000
  },
  {
    id: '02-tasks',
    name: 'Real World Tasks',
    scenario: 'highPerformer',
    caption: 'Track Important Work',
    scrollToTasks: true,
    waitTime: 2000
  },
  {
    id: '03-analytics',
    name: '30 Day Improvement Journey',
    scenario: 'growthStory',
    caption: '+20% This Month',
    clickAnalytics: true,
    waitTime: 3000
  },
  {
    id: '04-achievement',
    name: 'Earned Productivity Badges',
    scenario: 'highPerformer',
    caption: '7-Day Streak!',
    clickAchievements: true,
    waitTime: 2000
  },
  {
    id: '05-clean',
    name: 'Minimalist Interface',
    scenario: 'highPerformer',
    caption: null,
    waitTime: 1000
  }
];

async function injectMockData(page, scenario) {
  const scenarioData = SCENARIOS[scenario].data;

  await page.evaluate((data) => {
    // Clear and set all required flags
    localStorage.clear();
    localStorage.setItem('signal_noise_onboarded', 'true');
    localStorage.setItem('signal_noise_data', JSON.stringify(data));
    localStorage.setItem('onboarding_complete', 'true');
    localStorage.setItem('hasSeenWelcome', 'true');
    localStorage.setItem('tutorial_complete', 'true');
    localStorage.setItem('screenshot_mode', 'true');

    // Reload to apply
    location.reload();
  }, scenarioData);

  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
}

async function addCaption(page, text) {
  if (!text) return;

  await page.evaluate((captionText) => {
    const existing = document.querySelector('.screenshot-caption');
    if (existing) existing.remove();

    const caption = document.createElement('div');
    caption.className = 'screenshot-caption';
    caption.style.cssText = `
      position: fixed;
      bottom: 120px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #00ff88, #00cc6a);
      color: #000;
      padding: 18px 36px;
      border-radius: 50px;
      font-size: 32px;
      font-weight: 600;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      box-shadow: 0 10px 40px rgba(0, 255, 136, 0.4);
      z-index: 999999;
      white-space: nowrap;
      animation: pulse 2s ease-in-out infinite;
    `;
    caption.textContent = captionText;
    document.body.appendChild(caption);

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0%, 100% { transform: translateX(-50%) scale(1); }
        50% { transform: translateX(-50%) scale(1.02); }
      }
    `;
    document.head.appendChild(style);
  }, text);
}

async function generateScreenshots() {
  console.log('\n🎯 Signal/Noise - Realistic Screenshots Generator\n');
  console.log('━'.repeat(50));
  console.log('Creating screenshots with:');
  console.log('• Real-world professional tasks');
  console.log('• 30-day improvement journey');
  console.log('• Natural productivity patterns');
  console.log('━'.repeat(50) + '\n');

  // Create directories
  for (const device of Object.keys(DEVICES)) {
    const dir = path.join(__dirname, `screenshots-final/${device}`);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  const browser = await chromium.launch({
    headless: false,
    args: ['--disable-blink-features=AutomationControlled']
  });

  for (const [deviceName, device] of Object.entries(DEVICES)) {
    console.log(`📱 ${deviceName.toUpperCase()} (${device.width}x${device.height})\n`);

    for (const screenshot of SCREENSHOTS) {
      try {
        const context = await browser.newContext({
          viewport: {
            width: device.width,
            height: device.height
          },
          deviceScaleFactor: device.deviceScaleFactor,
          isMobile: device.isMobile,
          hasTouch: device.hasTouch,
          colorScheme: 'dark',
          locale: 'en-US'
        });

        const page = await context.newPage();

        // Navigate and inject data
        await page.goto('http://localhost:5176', { waitUntil: 'networkidle' });
        await injectMockData(page, screenshot.scenario);

        // Handle specific screenshot actions
        if (screenshot.scrollToTasks) {
          await page.evaluate(() => {
            const tasks = document.querySelector('.task-grid, [class*="task"], .tasks-container');
            if (tasks) tasks.scrollIntoView({ behavior: 'smooth', block: 'center' });
          });
        }

        if (screenshot.clickAnalytics) {
          const buttons = await page.$$('button');
          for (const button of buttons) {
            const text = await button.textContent();
            if (text && (text.includes('30') || text.includes('Analytics'))) {
              await button.click();
              break;
            }
          }
        }

        if (screenshot.clickAchievements) {
          const achievements = await page.$('[class*="achievement"], [class*="badge"]');
          if (achievements) {
            await achievements.click();
          }
        }

        // Wait for UI to settle
        await page.waitForTimeout(screenshot.waitTime);

        // Add caption if specified
        if (screenshot.caption) {
          await addCaption(page, screenshot.caption);
          await page.waitForTimeout(500);
        }

        // Take screenshot
        const filename = `${screenshot.id}-${screenshot.name.toLowerCase().replace(/\s+/g, '-')}.png`;
        const filepath = path.join(__dirname, `screenshots-final/${deviceName}`, filename);

        await page.screenshot({
          path: filepath,
          fullPage: false
        });

        console.log(`  ✅ ${screenshot.name}`);

        await context.close();
      } catch (error) {
        console.error(`  ❌ Failed: ${error.message}`);
      }
    }
    console.log('');
  }

  await browser.close();

  console.log('✨ Screenshots generated with realistic data!\n');
  console.log('📁 Output: screenshots-final/\n');
  console.log('Features:');
  console.log('• Strategic tasks like "Pitch deck for Series A"');
  console.log('• Natural 30-day progression (65% → 85%)');
  console.log('• Realistic weekly patterns');
  console.log('• Peak productivity on Tue-Thu');
  console.log('• Lower but consistent weekend activity\n');
}

// Run generator
(async () => {
  try {
    console.log('⚠️  Start dev server first: npm run dev');
    console.log('Starting in 3 seconds...\n');
    await new Promise(resolve => setTimeout(resolve, 3000));

    await generateScreenshots();

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
})();