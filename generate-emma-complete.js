import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Generate Emma's complete 26-day journey with tasks for almost every day
function generateEmmaCompleteData() {
  const now = Date.now();
  const tasks = [];

  // Task templates for variety
  const signalTasks = [
    // Strategic work
    "Customer call - enterprise deal", "Product vision workshop", "Board deck preparation",
    "Q4 roadmap planning", "OKR alignment session", "Pricing strategy review",
    "Partnership proposal draft", "Market analysis - competitors", "Revenue forecast model",

    // Deep work
    "Feature spec writing", "Data analysis - churn metrics", "User research synthesis",
    "API documentation", "Blog post: Product insights", "Case study writing",
    "Technical architecture review", "Migration plan design", "Security audit prep",

    // Leadership
    "1:1 with team member", "Team workshop facilitation", "Mentor junior PM",
    "Cross-functional sync", "Stakeholder alignment", "Performance reviews",
    "Hiring interviews", "Team offsite planning", "Culture initiative",

    // Execution
    "Sprint planning", "Customer interview", "Design review session",
    "Launch plan finalization", "QA test scenarios", "Release notes",
    "Demo preparation", "User feedback analysis", "A/B test results"
  ];

  const noiseTasks = [
    "Slack messages", "Email triage", "Random vendor call", "LinkedIn browsing",
    "Twitter/X scrolling", "Newsletter reading", "Team chat", "Coffee break extended",
    "Meeting that could be email", "Notion reorganizing", "Calendar tetris",
    "Browser tab cleanup", "Slack reactions", "News reading", "YouTube tutorial",
    "ProductHunt browsing", "Medium articles", "Unnecessary sync", "Water cooler chat",
    "Desktop cleanup", "App notifications", "Instagram check", "Reddit thread"
  ];

  // Generate tasks for each day (26 days total)
  for (let daysAgo = 25; daysAgo >= 0; daysAgo--) {
    const dayTimestamp = now - (daysAgo * 86400000);
    const weekNum = Math.floor(daysAgo / 7);
    const dayOfWeek = new Date(dayTimestamp).getDay();

    let signalCount, noiseCount;

    // Determine task counts based on progression
    if (daysAgo >= 21) { // Week 1: Struggling
      signalCount = dayOfWeek === 0 || dayOfWeek === 6 ? 1 : 2 + Math.floor(Math.random() * 2);
      noiseCount = dayOfWeek === 0 || dayOfWeek === 6 ? 1 : 3 + Math.floor(Math.random() * 3);
    } else if (daysAgo >= 14) { // Week 2: Learning
      signalCount = dayOfWeek === 0 || dayOfWeek === 6 ? 1 : 3 + Math.floor(Math.random() * 2);
      noiseCount = dayOfWeek === 0 || dayOfWeek === 6 ? 1 : 2 + Math.floor(Math.random() * 2);
    } else if (daysAgo >= 7) { // Week 3: Building
      signalCount = dayOfWeek === 0 || dayOfWeek === 6 ? 2 : 4 + Math.floor(Math.random() * 2);
      noiseCount = dayOfWeek === 0 || dayOfWeek === 6 ? 1 : 1 + Math.floor(Math.random() * 2);
    } else { // Week 4: Mastery
      signalCount = dayOfWeek === 0 || dayOfWeek === 6 ? 2 : 4 + Math.floor(Math.random() * 2);
      noiseCount = 1;

      // Today gets special attention
      if (daysAgo === 0) {
        signalCount = 5;
        noiseCount = 1;
      }
    }

    // Skip some weekend days randomly for realism
    if ((dayOfWeek === 0 || dayOfWeek === 6) && Math.random() < 0.3 && daysAgo > 7) {
      continue; // Skip this weekend day
    }

    // Generate signal tasks for this day
    for (let i = 0; i < signalCount; i++) {
      const taskIndex = Math.floor(Math.random() * signalTasks.length);
      const hourOfDay = 7 + Math.floor(Math.random() * 12); // 7am to 7pm
      const timestamp = new Date(dayTimestamp);
      timestamp.setHours(hourOfDay, Math.floor(Math.random() * 60), 0, 0);

      tasks.push({
        id: dayTimestamp + i * 1000,
        text: signalTasks[taskIndex],
        type: "signal",
        timestamp: timestamp.toISOString(),
        completed: false
      });
    }

    // Generate noise tasks for this day
    for (let i = 0; i < noiseCount; i++) {
      const taskIndex = Math.floor(Math.random() * noiseTasks.length);
      const hourOfDay = 8 + Math.floor(Math.random() * 11); // 8am to 7pm
      const timestamp = new Date(dayTimestamp);
      timestamp.setHours(hourOfDay, Math.floor(Math.random() * 60), 0, 0);

      tasks.push({
        id: dayTimestamp + (signalCount + i) * 1000,
        text: noiseTasks[taskIndex],
        type: "noise",
        timestamp: timestamp.toISOString(),
        completed: false
      });
    }
  }

  // Generate 26-day history with natural progression
  const history = [];
  const today = new Date();

  for (let day = 25; day >= 0; day--) {
    const date = new Date(today);
    date.setDate(date.getDate() - day);
    const dayOfWeek = date.getDay();
    const weekProgress = (25 - day) / 25; // 0 to 1 over the period

    let ratio;

    // Base progression from 45% to 85%
    const baseProgression = 45 + (weekProgress * 40);

    // Add weekly patterns
    if (day >= 21) { // Week 1: 45-55%
      ratio = 45 + Math.random() * 10;
    } else if (day >= 14) { // Week 2: 55-68%
      ratio = 55 + Math.random() * 13;
      if (day === 15) ratio = 50; // Bad day
    } else if (day >= 7) { // Week 3: 68-78%
      ratio = 68 + Math.random() * 10;
    } else { // Week 4: 75-87%
      ratio = 75 + Math.random() * 12;
    }

    // Day of week adjustments
    if (dayOfWeek === 1) ratio -= 5; // Monday struggle
    if (dayOfWeek === 2 || dayOfWeek === 3) ratio += 3; // Peak days
    if (dayOfWeek === 5) ratio -= 2; // Friday wind down
    if (dayOfWeek === 0 || dayOfWeek === 6) ratio -= 10; // Weekends

    // Add natural variance
    ratio += (Math.random() - 0.5) * 5;
    ratio = Math.min(92, Math.max(35, ratio));

    // Calculate task counts based on ratio
    const totalTasks = 4 + Math.floor(Math.random() * 4); // 4-7 tasks per day
    const signalCount = Math.round(totalTasks * ratio / 100);
    const noiseCount = totalTasks - signalCount;

    history.push({
      date: date.toISOString().split('T')[0],
      ratio: Math.round(ratio),
      signalCount: Math.max(1, signalCount),
      noiseCount: Math.max(0, noiseCount)
    });
  }

  // Sort tasks by timestamp (most recent first)
  tasks.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return {
    tasks: tasks.slice(0, 100), // Keep last 100 tasks
    history: history,
    badges: ["early_bird", "streak_7", "comeback_kid", "pattern_master"],
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
  console.log('\n🎯 Emma\'s Complete 26-Day Journey\n');
  console.log('━'.repeat(60));
  console.log('📊 Full timeline with tasks almost every day');
  console.log('📈 Natural progression: 45% → 85%');
  console.log('📱 Optimized zoom for mobile viewing');
  console.log('━'.repeat(60) + '\n');

  const dir = path.join(__dirname, 'screenshots-play-store');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const browser = await chromium.launch({
    headless: false,
    args: ['--disable-blink-features=AutomationControlled']
  });

  // Phone screenshots with better zoom
  const phoneContext = await browser.newContext({
    viewport: { width: 1080, height: 1920 },
    deviceScaleFactor: 2.5, // Increased for better zoom
    isMobile: true,
    hasTouch: true,
    colorScheme: 'dark',
    locale: 'en-US'
  });

  const page = await phoneContext.newPage();

  try {
    await page.goto('http://localhost:5176', { waitUntil: 'networkidle' });

    // Inject Emma's complete data
    const emmaData = generateEmmaCompleteData();
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

    // Add zoom for better mobile display
    await page.evaluate(() => {
      document.body.style.zoom = '1.15';
    });

    // Screenshot 1: Main dashboard
    await page.screenshot({
      path: path.join(dir, '01-main-dashboard.png'),
      fullPage: false
    });
    console.log('✅ Main dashboard');

    // Screenshot 2: Scroll to show tasks
    await page.evaluate(() => {
      const tasksSection = document.querySelector('.task-grid, [class*="task"], #tasks');
      if (tasksSection) {
        tasksSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      window.scrollBy(0, -50); // Adjust position
    });
    await page.waitForTimeout(1500);

    await page.screenshot({
      path: path.join(dir, '02-tasks-view.png'),
      fullPage: false
    });
    console.log('✅ Tasks view');

    // Screenshot 3: 30-day overview
    await page.evaluate(() => {
      window.scrollTo(0, 0);
    });

    // Try to open 30-day view
    const buttons = await page.$$('button, [class*="overview"]');
    for (const button of buttons) {
      const text = await button.textContent();
      if (text && (text.includes('30') || text.includes('Overview'))) {
        await button.click();
        break;
      }
    }
    await page.waitForTimeout(2000);

    await page.screenshot({
      path: path.join(dir, '03-30-day-progress.png'),
      fullPage: false
    });
    console.log('✅ 30-day progress');

    // Screenshot 4: With achievement notification
    await page.evaluate(() => {
      // Create achievement popup
      const achievement = document.createElement('div');
      achievement.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #00ff88, #00cc6a);
        color: #000;
        padding: 20px 40px;
        border-radius: 50px;
        font-size: 24px;
        font-weight: 600;
        box-shadow: 0 10px 40px rgba(0, 255, 136, 0.5);
        z-index: 999999;
        animation: slideIn 0.5s ease;
      `;
      achievement.innerHTML = '🔥 7-Day Streak!';
      document.body.appendChild(achievement);
    });
    await page.waitForTimeout(500);

    await page.screenshot({
      path: path.join(dir, '04-achievement.png'),
      fullPage: false
    });
    console.log('✅ Achievement notification');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await phoneContext.close();
    await browser.close();
  }

  console.log('\n✨ Play Store screenshots ready!');
  console.log('\n📊 Data Summary:');
  console.log('   • 26 days of realistic data');
  console.log('   • Tasks on 22+ days');
  console.log('   • Natural progression from chaos to mastery');
  console.log('   • Mixed red/green bars showing real struggle');
  console.log('   • Mobile-optimized zoom (115%)');
  console.log('\n📁 Screenshots in: screenshots-play-store/\n');
}

// Run
(async () => {
  console.log('Starting in 3 seconds...\n');
  await new Promise(resolve => setTimeout(resolve, 3000));
  await generateScreenshots();
})();