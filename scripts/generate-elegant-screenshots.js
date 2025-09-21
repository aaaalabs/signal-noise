import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Elegant screenshot annotations that Jony Ive would approve
const ELEGANT_OVERLAYS = {
  achievement: {
    // Subtle corner badge instead of banner
    html: `
      <div style="
        position: fixed;
        top: 120px;
        right: 24px;
        background: linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 255, 136, 0.05));
        border: 1px solid rgba(0, 255, 136, 0.3);
        border-radius: 20px;
        padding: 8px 16px;
        font-size: 13px;
        font-weight: 500;
        color: #00ff88;
        backdrop-filter: blur(20px);
        font-family: -apple-system, system-ui, sans-serif;
        letter-spacing: 0.5px;
      ">
        7-DAY STREAK
      </div>
    `
  },

  insights: {
    // Floating insight card
    html: `
      <div style="
        position: fixed;
        bottom: 140px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(17, 17, 17, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 16px;
        padding: 12px 20px;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.7);
        backdrop-filter: blur(30px);
        font-family: -apple-system, system-ui, sans-serif;
        max-width: 280px;
        text-align: center;
      ">
        <span style="color: #00ff88; font-weight: 500;">Peak hours:</span> 9-11 AM
      </div>
    `
  },

  milestone: {
    // Subtle celebration
    html: `
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 80px;
        opacity: 0.08;
        color: #00ff88;
        pointer-events: none;
        font-weight: 100;
      ">
        ✓
      </div>
    `
  },

  coachHint: {
    // Replace button with subtle hint
    html: `
      <div style="
        position: fixed;
        bottom: 160px;
        right: 24px;
        width: 56px;
        height: 56px;
        background: rgba(0, 255, 136, 0.1);
        border: 1px solid rgba(0, 255, 136, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        backdrop-filter: blur(20px);
      ">
        <span style="opacity: 0.8;">✨</span>
      </div>
      <div style="
        position: fixed;
        bottom: 150px;
        right: 90px;
        font-size: 11px;
        color: rgba(255, 255, 255, 0.4);
        font-family: -apple-system, system-ui, sans-serif;
      ">
        AI Coach
      </div>
    `
  }
};

// Generate screenshots with subtle marketing elements
async function generateElegantScreenshots() {
  console.log('\n✨ Generating Elegant Play Store Screenshots\n');
  console.log('━'.repeat(60));
  console.log('Philosophy: Show value without disrupting beauty');
  console.log('━'.repeat(60) + '\n');

  const dir = path.join(__dirname, 'screenshots-elegant');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const browser = await chromium.launch({
    headless: false,
    args: ['--disable-blink-features=AutomationControlled']
  });

  const screenshots = [
    {
      name: '01-hero-clean',
      overlay: null, // Pure, unmodified interface
      description: 'Clean dashboard view'
    },
    {
      name: '02-hero-streak',
      overlay: ELEGANT_OVERLAYS.achievement,
      description: 'Subtle achievement indicator'
    },
    {
      name: '03-insights',
      overlay: ELEGANT_OVERLAYS.insights,
      scrollTo: 'tasks',
      description: 'Pattern insights overlay'
    },
    {
      name: '04-milestone',
      overlay: ELEGANT_OVERLAYS.milestone,
      show30Day: true,
      description: 'Milestone celebration (subtle)'
    },
    {
      name: '05-ai-coach',
      overlay: ELEGANT_OVERLAYS.coachHint,
      description: 'AI Coach hint (non-intrusive)'
    }
  ];

  for (const screenshot of screenshots) {
    const context = await browser.newContext({
      viewport: { width: 1080, height: 1920 },
      deviceScaleFactor: 2.5,
      isMobile: true,
      hasTouch: true,
      colorScheme: 'dark'
    });

    const page = await context.newPage();

    try {
      await page.goto('http://localhost:5176', { waitUntil: 'networkidle' });

      // Use existing Emma data
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
      await page.waitForTimeout(2000);

      // More aggressive zoom for mobile screenshots
      await page.evaluate(() => {
        document.body.style.zoom = '1.25';  // Increased from 1.1 to 1.25
      });

      // Navigate to specific views
      if (screenshot.scrollTo === 'tasks') {
        await page.evaluate(() => {
          const tasks = document.querySelector('.task-grid, [class*="task"]');
          if (tasks) tasks.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        await page.waitForTimeout(1000);
      }

      if (screenshot.show30Day) {
        const buttons = await page.$$('button');
        for (const button of buttons) {
          const text = await button.textContent();
          if (text && text.includes('30')) {
            await button.click();
            break;
          }
        }
        await page.waitForTimeout(1500);
      }

      // Add elegant overlay for screenshots only
      if (screenshot.overlay) {
        await page.evaluate((html) => {
          const overlay = document.createElement('div');
          overlay.innerHTML = html;
          document.body.appendChild(overlay);
        }, screenshot.overlay.html);
        await page.waitForTimeout(300);
      }

      const filepath = path.join(dir, `${screenshot.name}.png`);
      await page.screenshot({ path: filepath, fullPage: false });

      console.log(`✅ ${screenshot.name}: ${screenshot.description}`);

    } catch (error) {
      console.error(`❌ Failed ${screenshot.name}: ${error.message}`);
    } finally {
      await context.close();
    }
  }

  await browser.close();

  console.log('\n✨ Elegant screenshots complete!');
  console.log('\nDesign principles applied:');
  console.log('  • Subtle overlays that don\'t disrupt');
  console.log('  • Information hierarchy preserved');
  console.log('  • Marketing value without sacrificing aesthetics');
  console.log('  • Screenshot-only enhancements\n');
}

// Emma's complete data generator with 26-day journey
function generateEmmaCompleteData() {
  const tasks = [];
  const now = new Date();

  // Emma's 26-day journey - Product Manager at tech startup
  const dayPlans = [
    // Week 1: Chaos mode - lots of noise
    { day: -25, signals: ['Product roadmap review'], noise: ['Email cleanup', 'Slack messages', 'Random meetings', 'Social media check', 'News reading'] },
    { day: -24, signals: ['User interviews'], noise: ['Team chat', 'LinkedIn scrolling', 'Coffee chat', 'Email threads'] },
    { day: -23, signals: ['Feature prioritization', 'Sprint planning'], noise: ['Notifications', 'Inbox zero attempt', 'Twitter', 'News'] },
    { day: -22, signals: ['Customer feedback analysis'], noise: ['Slack overflow', 'Meeting prep', 'Email chaos', 'Social media'] },
    { day: -21, signals: ['Wireframe review', 'Stakeholder meeting'], noise: ['Messages', 'Random calls', 'Email'] },
    { day: -20, signals: [], noise: ['Weekend emails', 'Planning for week'] }, // Weekend
    { day: -19, signals: ['Market research'], noise: ['Sunday prep', 'Email cleanup'] }, // Weekend

    // Week 2: Starting to find balance
    { day: -18, signals: ['User story writing', 'Product metrics review'], noise: ['Team sync', 'Emails', 'Slack'] },
    { day: -17, signals: ['A/B test planning', 'Design review'], noise: ['Status updates', 'Messages', 'Coffee chat'] },
    { day: -16, signals: ['Competitor analysis', 'Feature specs'], noise: ['Email threads', 'Notifications'] },
    { day: -15, signals: ['Customer interviews', 'Roadmap update', 'KPI review'], noise: ['Slack', 'Random meeting'] },
    { day: -14, signals: ['Sprint review', 'Backlog grooming'], noise: ['Team chat', 'Email cleanup'] },
    { day: -13, signals: ['Product strategy'], noise: ['Weekend planning'] }, // Weekend
    { day: -12, signals: [], noise: ['Email check', 'Week prep'] }, // Weekend

    // Week 3: Finding rhythm
    { day: -11, signals: ['Feature launch prep', 'User testing', 'Metrics dashboard'], noise: ['Morning email', 'Team sync'] },
    { day: -10, signals: ['Stakeholder presentation', 'Product demo', 'Analytics review'], noise: ['Quick Slack check'] },
    { day: -9, signals: ['Customer success sync', 'Feature prioritization', 'Tech debt review'], noise: ['Status update'] },
    { day: -8, signals: ['User research synthesis', 'Roadmap planning', 'Design sprint'], noise: ['Email batch'] },
    { day: -7, signals: ['Product review', 'Team 1:1s', 'Strategy doc', 'Beta feedback'], noise: ['Messages'] },
    { day: -6, signals: ['Market analysis', 'Feature specs'], noise: [] }, // Focused weekend
    { day: -5, signals: ['Product vision work'], noise: ['Quick email check'] }, // Weekend

    // Week 4: Mastery - mostly signals
    { day: -4, signals: ['Q2 planning', 'User journey mapping', 'Feature validation', 'Metrics review'], noise: ['Team check-in'] },
    { day: -3, signals: ['Executive review prep', 'Product strategy', 'Customer insights', 'Roadmap update'], noise: [] },
    { day: -2, signals: ['Launch planning', 'Success metrics', 'User feedback review', 'Team alignment'], noise: ['Quick sync'] },
    { day: -1, signals: ['Product demo', 'Stakeholder alignment', 'Feature specs review'], noise: ['Email batch'] },
    { day: 0, signals: ['Strategic planning', 'User research', 'Product review', 'Team coaching'], noise: ['Morning check'] }
  ];

  // Generate tasks for each day
  dayPlans.forEach(plan => {
    const date = new Date(now);
    date.setDate(date.getDate() + plan.day);
    date.setHours(9, 0, 0, 0); // Start at 9 AM

    // Add signal tasks
    plan.signals.forEach((taskText, index) => {
      const taskDate = new Date(date);
      taskDate.setHours(9 + index * 2, Math.floor(Math.random() * 60), 0, 0);

      tasks.push({
        id: `task-${taskDate.getTime()}`,
        text: taskText,
        type: 'signal',
        timestamp: taskDate.toISOString(),
        completed: true
      });
    });

    // Add noise tasks
    plan.noise.forEach((taskText, index) => {
      const taskDate = new Date(date);
      taskDate.setHours(10 + index * 2, Math.floor(Math.random() * 60), 0, 0);

      tasks.push({
        id: `task-${taskDate.getTime()}-n`,
        text: taskText,
        type: 'noise',
        timestamp: taskDate.toISOString(),
        completed: true
      });
    });
  });

  return {
    tasks,
    history: [],
    badges: ["early_bird", "streak_7", "pattern_master", "perfect_day", "comeback"],
    patterns: {
      peakHours: [9, 10, 11],
      mostProductiveDay: 'Tuesday',
      averageSignalsPerDay: 3.2,
      trendsUpward: true
    },
    settings: {
      targetRatio: 80,
      notifications: true,
      firstName: "Emma"
    }
  };
}

// Run
(async () => {
  console.log('Starting in 3 seconds...\n');
  await new Promise(resolve => setTimeout(resolve, 3000));
  await generateElegantScreenshots();
})();