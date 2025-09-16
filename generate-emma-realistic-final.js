import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Generate Emma's realistic 26-day journey
function generateEmmaData() {
  const now = Date.now();
  const tasks = [];

  // Today (Day 26) - 85% ratio: 5 signal, 1 noise
  const todayTasks = [
    { text: "Design review - mobile app v3", type: "signal", hoursAgo: 1 },
    { text: "Slack - team updates", type: "noise", hoursAgo: 2 },
    { text: "Customer call - €500k enterprise deal", type: "signal", hoursAgo: 3 },
    { text: "Product vision 2025 workshop", type: "signal", hoursAgo: 5 },
    { text: "Data analysis - activation funnel", type: "signal", hoursAgo: 7 },
    { text: "Blog post: Reducing churn by 40%", type: "signal", hoursAgo: 9 }
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

  // Yesterday (Day 25) - 82% ratio: 5 signal, 1 noise
  const yesterday = [
    { text: "Quarterly review presentation", type: "signal" },
    { text: "1:1 with engineering lead", type: "signal" },
    { text: "Email processing - 30 min", type: "noise" },
    { text: "Feature prioritization", type: "signal" },
    { text: "Customer interview", type: "signal" },
    { text: "API documentation review", type: "signal" }
  ];

  // 2 days ago (Day 24) - 80% ratio: 4 signal, 1 noise
  const day24 = [
    { text: "Board deck preparation", type: "signal" },
    { text: "LinkedIn browsing", type: "noise" },
    { text: "Pricing workshop", type: "signal" },
    { text: "Team retrospective", type: "signal" },
    { text: "Technical debt planning", type: "signal" }
  ];

  // Week 3 (Day 18) - 73% ratio: 4 signal, 2 noise
  const day18 = [
    { text: "OKR planning session", type: "signal" },
    { text: "Unnecessary vendor call", type: "noise" },
    { text: "Customer advisory prep", type: "signal" },
    { text: "Team lunch - extended", type: "noise" },
    { text: "Partnership proposal", type: "signal" },
    { text: "Feature specs writing", type: "signal" }
  ];

  // Week 2 bad day (Day 11) - 60% ratio: 3 signal, 2 noise
  const day11 = [
    { text: "Production incident response", type: "signal" },
    { text: "Slack firefighting - 2 hours", type: "noise" },
    { text: "Status updates", type: "signal" },
    { text: "Email overflow", type: "noise" },
    { text: "Post-mortem planning", type: "signal" }
  ];

  // Week 1 (Day 4) - 55% ratio: 3 signal, 3 noise
  const day4 = [
    { text: "Endless Slack messages", type: "noise" },
    { text: "Random vendor demo", type: "noise" },
    { text: "Q4 roadmap draft", type: "signal" },
    { text: "Email triage - 90 min", type: "noise" },
    { text: "Customer interview prep", type: "signal" },
    { text: "ProductHunt browsing", type: "noise" },
    { text: "Finally: PRD writing", type: "signal" }
  ];

  // Week 1 (Day 2) - 45% ratio: 2 signal, 3 noise
  const day2 = [
    { text: "Notion reorganizing", type: "noise" },
    { text: "Meeting about meetings", type: "noise" },
    { text: "Sprint planning", type: "signal" },
    { text: "Twitter scrolling", type: "noise" },
    { text: "User research", type: "signal" }
  ];

  // Add all previous days with proper timestamps
  const addDayTasks = (dayTasks, daysAgo) => {
    const dayTimestamp = now - (daysAgo * 86400000);
    dayTasks.forEach((task, index) => {
      const hourOfDay = 8 + index * 1.5;
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

  addDayTasks(yesterday, 1);
  addDayTasks(day24, 2);
  addDayTasks(day18, 8);
  addDayTasks(day11, 15);
  addDayTasks(day4, 22);
  addDayTasks(day2, 24);

  // Generate 26-day history - realistic progression
  const history = [];
  const today = new Date();

  for (let day = 25; day >= 0; day--) {
    const date = new Date(today);
    date.setDate(date.getDate() - day);
    const dayOfWeek = date.getDay();
    const weekNum = Math.floor((25 - day) / 7);

    let ratio, signalCount, noiseCount;

    // Week 1: Struggling (45-60%)
    if (day >= 20) {
      ratio = 45 + ((25 - day) * 3);
      signalCount = 2 + Math.floor(Math.random() * 2); // 2-3 signal
      noiseCount = 3 + Math.floor(Math.random() * 2); // 3-4 noise

      // Weekends even worse
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        ratio -= 10;
        signalCount = 1;
        noiseCount = 2;
      }
    }
    // Week 2: Learning (60-70%)
    else if (day >= 14) {
      ratio = 60 + ((19 - day) * 2);
      signalCount = 3 + Math.floor(Math.random() * 2); // 3-4 signal
      noiseCount = 2 + Math.floor(Math.random() * 2); // 2-3 noise

      // Day 11: Bad day
      if (day === 11) {
        ratio = 50;
        signalCount = 3;
        noiseCount = 3;
      }

      if (dayOfWeek === 0 || dayOfWeek === 6) {
        ratio -= 8;
        signalCount = 2;
        noiseCount = 2;
      }
    }
    // Week 3: Building momentum (70-78%)
    else if (day >= 7) {
      ratio = 70 + ((13 - day) * 1.3);
      signalCount = 4 + Math.floor(Math.random() * 2); // 4-5 signal
      noiseCount = 1 + Math.floor(Math.random() * 2); // 1-2 noise

      if (dayOfWeek === 1) ratio -= 5; // Monday adjustment
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        ratio -= 10;
        signalCount = 2;
        noiseCount = 1;
      }
    }
    // Week 4: Mastery (78-85%)
    else {
      ratio = 78 + ((6 - day) * 1.2);
      signalCount = 4 + Math.floor(Math.random() * 2); // 4-5 signal
      noiseCount = 1; // Usually just 1 noise

      // Daily patterns
      if (dayOfWeek === 1) {
        ratio = 75; // Monday meetings
        signalCount = 4;
        noiseCount = 2;
      }
      if (dayOfWeek === 2 || dayOfWeek === 3) {
        ratio = 85 + Math.random() * 3; // Peak days
        signalCount = 5;
        noiseCount = 1;
      }
      if (dayOfWeek === 5) {
        ratio = 78; // Friday wind-down
        signalCount = 4;
        noiseCount = 1;
      }
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        ratio = 65; // Weekend
        signalCount = 2;
        noiseCount = 1;
      }
    }

    // Add small variance
    ratio += (Math.random() - 0.5) * 3;
    ratio = Math.min(90, Math.max(40, ratio));

    history.push({
      date: date.toISOString().split('T')[0],
      ratio: Math.round(ratio),
      signalCount: signalCount,
      noiseCount: noiseCount
    });
  }

  return {
    tasks: tasks,
    history: history,
    badges: ["early_bird", "streak_7", "comeback_kid", "focused_friday"],
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
  console.log('\n🎯 Emma Chen - Realistic Product Manager Journey\n');
  console.log('━'.repeat(60));
  console.log('📊 26 days: 45% → 85% (with struggles!)');
  console.log('📈 Realistic: 4-5 signal tasks max per day');
  console.log('📉 Balanced: More noise in early days');
  console.log('━'.repeat(60) + '\n');

  const dir = path.join(__dirname, 'screenshots-final');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const browser = await chromium.launch({
    headless: false,
    args: ['--disable-blink-features=AutomationControlled']
  });

  const screenshots = [
    { name: '01-hero-dashboard', caption: '85% Productive' },
    { name: '02-week-progress', caption: null },
    { name: '03-30-day-journey', caption: '+40% Improvement', clickAnalytics: true }
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

      // Inject Emma's realistic data
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

      if (screenshot.clickAnalytics) {
        // Try to click 30-day view
        const buttons = await page.$$('button');
        for (const button of buttons) {
          const text = await button.textContent();
          if (text && (text.includes('30') || text.includes('History'))) {
            await button.click();
            break;
          }
        }
        await page.waitForTimeout(2000);
      }

      // Add caption
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

  console.log('\n✨ Realistic screenshots complete!');
  console.log('\n📊 Emma\'s Realistic Journey:');
  console.log('   Week 1: 2-3 signal, 3-4 noise daily (45-60%)');
  console.log('   Week 2: 3-4 signal, 2-3 noise daily (60-70%)');
  console.log('   Week 3: 4-5 signal, 1-2 noise daily (70-78%)');
  console.log('   Week 4: 4-5 signal, 1 noise daily (78-85%)');
  console.log('\n   Today: 5 signal, 1 noise = 85% productive!');
  console.log('\n📁 Screenshots in: screenshots-final/\n');
}

// Run
(async () => {
  console.log('Starting in 3 seconds...\n');
  await new Promise(resolve => setTimeout(resolve, 3000));
  await generateScreenshots();
})();