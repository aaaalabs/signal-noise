import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Generate Emma's complete 26-day journey with correct schema
function generateEmmaData() {
  const now = Date.now();
  const tasks = [];

  // Today's tasks (Day 26) - Working backwards from now
  const todayTasks = [
    { text: "Revenue impact analysis - Q1 features", type: "signal", hoursAgo: 0.25 },
    { text: "Tomorrow's deep work planning", type: "signal", hoursAgo: 0.5 },
    { text: "Sprint planning prep - story points review", type: "signal", hoursAgo: 1 },
    { text: "Slack - team check-in", type: "noise", hoursAgo: 1.5 },
    { text: "Mentor session - career development plan", type: "signal", hoursAgo: 2 },
    { text: "Design review - mobile app v3", type: "signal", hoursAgo: 3 },
    { text: "Write blog: How we reduced churn by 40%", type: "signal", hoursAgo: 4 },
    { text: "Lunch walk + audiobook: Thinking Fast and Slow", type: "signal", hoursAgo: 5 },
    { text: "Email - quick responses only", type: "noise", hoursAgo: 5.5 },
    { text: "Engineering sync - technical debt prioritization", type: "signal", hoursAgo: 6 },
    { text: "Data analysis - user activation funnel optimization", type: "signal", hoursAgo: 7 },
    { text: "Product vision 2025 - first principles thinking", type: "signal", hoursAgo: 8 },
    { text: "Customer call - €500k enterprise deal requirements", type: "signal", hoursAgo: 9 }
  ];

  // Add today's tasks
  todayTasks.forEach((task, index) => {
    const timestamp = new Date(now - (task.hoursAgo * 3600000));
    tasks.push({
      id: now - (index * 1000),
      text: task.text,
      type: task.type,
      timestamp: timestamp.toISOString(),
      completed: false
    });
  });

  // Previous days - Mix of signal and noise with decreasing ratio as we go back
  const previousDaysTasks = {
    // Yesterday (Day 25) - 83% ratio
    day25: [
      { text: "Quarterly business review prep", type: "signal" },
      { text: "Customer success metrics deep dive", type: "signal" },
      { text: "Platform migration planning", type: "signal" },
      { text: "1:1 with engineering lead", type: "signal" },
      { text: "Competitive intelligence report", type: "signal" },
      { text: "LinkedIn - shared team wins", type: "noise" },
      { text: "Feature prioritization matrix", type: "signal" },
      { text: "API documentation review", type: "signal" },
      { text: "Team retrospective facilitation", type: "signal" },
      { text: "Slack - general channel", type: "noise" }
    ],
    // 2 days ago (Day 24) - 82% ratio
    day24: [
      { text: "Board deck iterations - Q3 results", type: "signal" },
      { text: "User interview - enterprise segment", type: "signal" },
      { text: "Pricing strategy workshop", type: "signal" },
      { text: "Email batch processing", type: "noise" },
      { text: "Product roadmap refinement", type: "signal" },
      { text: "Cross-functional alignment meeting", type: "signal" },
      { text: "Technical debt assessment", type: "signal" },
      { text: "Market analysis - APAC expansion", type: "signal" }
    ],
    // Week 3 sample (Day 18) - 76% ratio
    day18: [
      { text: "OKR planning session", type: "signal" },
      { text: "Customer advisory board prep", type: "signal" },
      { text: "Unnecessary vendor call", type: "noise" },
      { text: "Feature specification writing", type: "signal" },
      { text: "Team building lunch", type: "noise" },
      { text: "Analytics dashboard design", type: "signal" },
      { text: "Partnership proposal draft", type: "signal" }
    ],
    // Week 2 sample (Day 11) - 68% ratio
    day11: [
      { text: "Emergency - production incident", type: "signal" },
      { text: "Slack firefighting - 2 hours", type: "noise" },
      { text: "Status updates to stakeholders", type: "signal" },
      { text: "Email overflow from incident", type: "noise" },
      { text: "Post-mortem preparation", type: "signal" },
      { text: "Missed focus time - meetings", type: "noise" }
    ],
    // Week 1 sample (Day 4) - 60% ratio
    day4: [
      { text: "Drowning in Slack messages", type: "noise" },
      { text: "Random vendor demo", type: "noise" },
      { text: "Q4 roadmap attempt #1", type: "signal" },
      { text: "Email triage - 2 hours", type: "noise" },
      { text: "Customer interview", type: "signal" },
      { text: "ProductHunt browsing", type: "noise" },
      { text: "Reorganizing Notion", type: "noise" },
      { text: "Finally - deep work on PRD", type: "signal" }
    ]
  };

  // Add previous days tasks with proper timestamps
  const addDayTasks = (dayTasks, daysAgo) => {
    const dayTimestamp = now - (daysAgo * 86400000);
    dayTasks.forEach((task, index) => {
      const hourOfDay = 8 + index * 1.5; // Spread throughout workday
      const timestamp = new Date(dayTimestamp);
      timestamp.setHours(hourOfDay, Math.floor(Math.random() * 60), 0, 0);

      tasks.push({
        id: dayTimestamp - (index * 1000),
        text: task.text,
        type: task.type,
        timestamp: timestamp.toISOString(),
        completed: false
      });
    });
  };

  addDayTasks(previousDaysTasks.day25, 1);
  addDayTasks(previousDaysTasks.day24, 2);
  addDayTasks(previousDaysTasks.day18, 8);
  addDayTasks(previousDaysTasks.day11, 15);
  addDayTasks(previousDaysTasks.day4, 22);

  // Generate 26-day history with Emma's journey
  const history = [];
  const today = new Date();

  for (let day = 25; day >= 0; day--) {
    const date = new Date(today);
    date.setDate(date.getDate() - day);
    const dayOfWeek = date.getDay();
    const weekNum = Math.floor((25 - day) / 7);

    let ratio, signalCount, noiseCount;

    // Week 1: Chaos (58-65%)
    if (weekNum === 0) {
      ratio = 58 + (6 - day) * 1.2;
      if (dayOfWeek === 1) ratio -= 3; // Monday struggle
      if (dayOfWeek === 0 || dayOfWeek === 6) ratio -= 5; // Weekend
      signalCount = 3 + Math.floor(Math.random() * 3);
    }
    // Week 2: Learning (65-74%)
    else if (weekNum === 1) {
      ratio = 65 + ((13 - day) * 1.5);
      if (day === 11) ratio = 62; // Bad day - production issue
      if (dayOfWeek === 2 || dayOfWeek === 3) ratio += 3;
      if (dayOfWeek === 0 || dayOfWeek === 6) ratio -= 8;
      signalCount = 5 + Math.floor(Math.random() * 4);
    }
    // Week 3: Momentum (74-81%)
    else if (weekNum === 2) {
      ratio = 74 + ((20 - day) * 1.2);
      if (day === 7) ratio = 68; // Monday adjustment
      if (dayOfWeek === 2 || dayOfWeek === 3) ratio += 4;
      if (dayOfWeek === 0 || dayOfWeek === 6) ratio -= 10;
      signalCount = 7 + Math.floor(Math.random() * 5);
    }
    // Week 4: Mastery (81-85%)
    else {
      ratio = 81 + ((25 - day) * 0.8);
      if (dayOfWeek === 1) ratio = 78; // Monday
      if (dayOfWeek === 2 || dayOfWeek === 3) ratio = 87 + Math.random() * 2;
      if (dayOfWeek === 4) ratio = 85;
      if (dayOfWeek === 5) ratio = 80;
      if (dayOfWeek === 0 || dayOfWeek === 6) ratio = 70;
      signalCount = 9 + Math.floor(Math.random() * 6);
    }

    // Add variance
    ratio += (Math.random() - 0.5) * 4;
    ratio = Math.min(92, Math.max(55, ratio));
    noiseCount = Math.max(1, Math.floor(signalCount * (100 - ratio) / ratio));

    history.push({
      date: date.toISOString().split('T')[0],
      ratio: Math.round(ratio),
      signalCount: Math.max(2, signalCount),
      noiseCount: noiseCount
    });
  }

  return {
    tasks: tasks,
    history: history,
    badges: ["early_bird", "streak_7", "perfect_ratio", "focused_friday", "comeback_kid", "pattern_master"],
    patterns: {
      mostProductiveHour: 9,
      leastProductiveHour: 15,
      bestDay: "Tuesday",
      averageSignalDuration: 52
    },
    settings: {
      targetRatio: 80,
      notifications: true,
      firstName: "Emma"
    }
  };
}

async function generateScreenshots() {
  console.log('\n🎯 Emma Chen - Product Manager Screenshot Suite\n');
  console.log('━'.repeat(60));
  console.log('📊 Journey: 26 days | 58% → 85% productivity');
  console.log('👤 Persona: Senior PM at Series B startup');
  console.log('📈 Story: From chaos to mastery with natural patterns');
  console.log('━'.repeat(60) + '\n');

  const dir = path.join(__dirname, 'screenshots-emma-final');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const browser = await chromium.launch({
    headless: false,
    args: ['--disable-blink-features=AutomationControlled']
  });

  const screenshots = [
    { name: '01-hero-dashboard', caption: '85% Productive Today' },
    { name: '02-tasks-view', caption: null, scrollToTasks: true },
    { name: '03-analytics', caption: '+27% This Month', clickAnalytics: true },
    { name: '04-achievements', caption: '7-Day Streak!', clickAchievements: true },
    { name: '05-clean-interface', caption: null }
  ];

  for (const screenshot of screenshots) {
    const context = await browser.newContext({
      viewport: { width: 1080, height: 1920 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
      colorScheme: 'dark',
      locale: 'en-US'
    });

    const page = await context.newPage();

    try {
      await page.goto('http://localhost:5176', { waitUntil: 'networkidle' });

      // Inject Emma's data
      const emmaData = generateEmmaData();
      await page.evaluate((data) => {
        localStorage.clear();
        localStorage.setItem('signal_noise_onboarded', 'true');
        localStorage.setItem('signal_noise_data', JSON.stringify(data));
        localStorage.setItem('onboarding_complete', 'true');
        localStorage.setItem('hasSeenWelcome', 'true');
        location.reload();
      }, emmaData);

      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);

      // Handle specific screenshot actions
      if (screenshot.scrollToTasks) {
        await page.evaluate(() => {
          const tasks = document.querySelector('.task-grid, [class*="task"]');
          if (tasks) tasks.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
        await page.waitForTimeout(1500);
      }

      if (screenshot.clickAnalytics) {
        const buttons = await page.$$('button');
        for (const button of buttons) {
          const text = await button.textContent();
          if (text && text.includes('30')) {
            await button.click();
            break;
          }
        }
        await page.waitForTimeout(2000);
      }

      if (screenshot.clickAchievements) {
        const achievements = await page.$('[class*="achievement"], [class*="badge"], [class*="dots"]');
        if (achievements) {
          await achievements.click();
          await page.waitForTimeout(1500);
        }
      }

      // Add caption if needed
      if (screenshot.caption) {
        await page.evaluate((text) => {
          const caption = document.createElement('div');
          caption.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #00ff88, #00cc6a);
            color: #000;
            padding: 16px 36px;
            border-radius: 50px;
            font-size: 28px;
            font-weight: 600;
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            box-shadow: 0 10px 40px rgba(0, 255, 136, 0.4);
            z-index: 999999;
          `;
          caption.textContent = text;
          document.body.appendChild(caption);
        }, screenshot.caption);
        await page.waitForTimeout(500);
      }

      const filepath = path.join(dir, `${screenshot.name}.png`);
      await page.screenshot({ path: filepath, fullPage: false });
      console.log(`✅ ${screenshot.name}`);

    } catch (error) {
      console.error(`❌ Failed ${screenshot.name}: ${error.message}`);
    } finally {
      await context.close();
    }
  }

  await browser.close();

  console.log('\n✨ Complete screenshot suite generated!');
  console.log('\n📝 Emma\'s Story Highlights:');
  console.log('   Week 1: "Drowning in Slack" → 58% productive');
  console.log('   Week 2: "Emergency production incident" → Learning from chaos');
  console.log('   Week 3: "OKR planning" → Building momentum');
  console.log('   Week 4: "€500k enterprise deal" → Peak performance');
  console.log('\n📁 Screenshots saved to: screenshots-emma-final/\n');
}

// Run
(async () => {
  console.log('⚠️  Ensure dev server is running on http://localhost:5176');
  console.log('Starting in 3 seconds...\n');
  await new Promise(resolve => setTimeout(resolve, 3000));

  await generateScreenshots();
})();