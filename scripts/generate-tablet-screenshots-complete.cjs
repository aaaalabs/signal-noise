const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Emma's complete data (from generate-final-screenshots.js)
function generateEmmaCompleteData() {
  const tasks = [];
  const now = new Date();

  const dayPlans = [
    // Week 1: Chaos
    { day: -25, signals: ['Product roadmap review'], noise: ['Email cleanup', 'Slack messages', 'Random meetings', 'Social media check', 'News reading'] },
    { day: -24, signals: ['User interviews'], noise: ['Team chat', 'LinkedIn scrolling', 'Coffee chat', 'Email threads'] },
    { day: -23, signals: ['Feature prioritization', 'Sprint planning'], noise: ['Notifications', 'Inbox zero attempt', 'Twitter', 'News'] },
    { day: -22, signals: ['Customer feedback analysis'], noise: ['Slack overflow', 'Meeting prep', 'Email chaos', 'Social media'] },
    { day: -21, signals: ['Wireframe review', 'Stakeholder meeting'], noise: ['Messages', 'Random calls', 'Email'] },
    { day: -20, signals: [], noise: ['Weekend emails', 'Planning for week'] },
    { day: -19, signals: ['Market research'], noise: ['Sunday prep', 'Email cleanup'] },
    // Week 2-4 continue...
    { day: -18, signals: ['User story writing', 'Product metrics review'], noise: ['Team sync', 'Emails', 'Slack'] },
    { day: -17, signals: ['A/B test planning', 'Design review'], noise: ['Status updates', 'Messages', 'Coffee chat'] },
    { day: -16, signals: ['Competitor analysis', 'Feature specs'], noise: ['Email threads', 'Notifications'] },
    { day: -15, signals: ['Customer interviews', 'Roadmap update', 'KPI review'], noise: ['Slack', 'Random meeting'] },
    { day: -14, signals: ['Sprint review', 'Backlog grooming'], noise: ['Team chat', 'Email cleanup'] },
    { day: -13, signals: ['Product strategy'], noise: ['Weekend planning'] },
    { day: -12, signals: [], noise: ['Email check', 'Week prep'] },
    { day: -11, signals: ['Feature launch prep', 'User testing', 'Metrics dashboard'], noise: ['Morning email', 'Team sync'] },
    { day: -10, signals: ['Stakeholder presentation', 'Product demo', 'Analytics review'], noise: ['Quick Slack check'] },
    { day: -9, signals: ['Customer success sync', 'Feature prioritization', 'Tech debt review'], noise: ['Status update'] },
    { day: -8, signals: ['User research synthesis', 'Roadmap planning', 'Design sprint'], noise: ['Email batch'] },
    { day: -7, signals: ['Product review', 'Team 1:1s', 'Strategy doc', 'Beta feedback'], noise: ['Messages'] },
    { day: -6, signals: ['Market analysis', 'Feature specs'], noise: [] },
    { day: -5, signals: ['Product vision work'], noise: ['Quick email check'] },
    { day: -4, signals: ['Q2 planning', 'User journey mapping', 'Feature validation', 'Metrics review'], noise: ['Team check-in'] },
    { day: -3, signals: ['Executive review prep', 'Product strategy', 'Customer insights', 'Roadmap update'], noise: [] },
    { day: -2, signals: ['Launch planning', 'Success metrics', 'User feedback review', 'Team alignment'], noise: ['Quick sync'] },
    { day: -1, signals: ['Product demo', 'Stakeholder alignment', 'Feature specs review'], noise: ['Email batch'] },
    { day: 0, signals: ['Strategic planning', 'User research', 'Product review', 'Team coaching'], noise: ['Morning check'] }
  ];

  dayPlans.forEach(plan => {
    const date = new Date(now);
    date.setDate(date.getDate() + plan.day);
    date.setHours(9, 0, 0, 0);

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

// Tablet configurations (PORTRAIT)
const tabletConfigs = [
  {
    name: '7inch',
    viewport: { width: 600, height: 1024 },  // Portrait 7-inch
    deviceScaleFactor: 2,
    deviceFrame: 'iPad Mini 4',
    outputDir: 'screenshots-7inch-tablet',
    zoom: 0.8  // Zoom out to show more content
  },
  {
    name: '10inch',
    viewport: { width: 800, height: 1280 },  // Portrait 10-inch
    deviceScaleFactor: 2,
    deviceFrame: 'iPad Pro',
    outputDir: 'screenshots-10inch-tablet',
    zoom: 0.85  // Slightly less zoom out for larger screen
  }
];

// Overlays from final screenshots (adapted for tablets)
const overlays = {
  hero: null, // Pure interface

  value: {
    html: `
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 18px 36px;
        background: rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(40px);
        -webkit-backdrop-filter: blur(40px);
        border-radius: 12px;
        font-size: 24px;
        font-weight: 300;
        color: rgba(255, 255, 255, 0.9);
        font-family: -apple-system, system-ui, sans-serif;
        letter-spacing: 0.3px;
        z-index: 1000;
      ">
        Your focus, visualized
      </div>
    `
  },

  streak: {
    html: `
      <div style="
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        padding: 8px 16px;
        background: rgba(0, 255, 136, 0.06);
        border: 0.5px solid rgba(0, 255, 136, 0.12);
        border-radius: 16px;
        font-size: 14px;
        font-weight: 400;
        color: rgba(0, 255, 136, 0.9);
        font-family: -apple-system, system-ui, sans-serif;
        letter-spacing: 0.2px;
        z-index: 1000;
      ">
        7-day streak
      </div>
    `
  },

  transformation: {
    html: `
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 28px 48px;
        background: rgba(0, 0, 0, 0.35);
        backdrop-filter: blur(50px);
        -webkit-backdrop-filter: blur(50px);
        border-radius: 14px;
        z-index: 1000;
      ">
        <div style="
          font-size: 48px;
          font-weight: 100;
          color: rgba(255, 255, 255, 0.9);
          font-family: -apple-system, system-ui, sans-serif;
          letter-spacing: -0.5px;
        ">
          45% → 85%
        </div>
      </div>
    `
  },

  insight: {
    html: `
      <div style="
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        padding: 10px 20px;
        background: rgba(17, 17, 17, 0.8);
        backdrop-filter: blur(40px);
        -webkit-backdrop-filter: blur(40px);
        border: 0.5px solid rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.65);
        font-family: -apple-system, system-ui, sans-serif;
        z-index: 1000;
      ">
        Peak productivity: <span style="color: #00ff88;">9-11 AM</span>
      </div>
    `
  },

  foundation: {
    html: `
      <div style="
        position: fixed;
        bottom: 90px;
        left: 50%;
        transform: translateX(-50%);
        padding: 8px 18px;
        background: rgba(0, 255, 136, 0.04);
        border: 0.5px solid rgba(0, 255, 136, 0.1);
        border-radius: 6px;
        font-size: 12px;
        font-weight: 500;
        color: rgba(0, 255, 136, 0.85);
        font-family: -apple-system, system-ui, sans-serif;
        letter-spacing: 0.2px;
        z-index: 1000;
      ">
        Foundation · #37
      </div>
    `
  }
};

// Screenshot definitions
const screenshots = [
  { name: '01-hero', overlay: overlays.hero },
  { name: '02-value', overlay: overlays.value, focusInput: true },
  { name: '03-streak', overlay: overlays.streak },
  { name: '04-insights', overlay: overlays.insight, show30Day: true },
  { name: '05-transformation', overlay: overlays.transformation, show30Day: true },
  { name: '06-foundation', overlay: overlays.foundation }
];

async function generateTabletScreenshots() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-blink-features=AutomationControlled']
  });

  for (const config of tabletConfigs) {
    console.log(`\n📱 Generating ${config.name} tablet screenshots...`);

    // Create output directory
    const outputDir = path.join(__dirname, config.outputDir);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    for (const screenshot of screenshots) {
      const context = await browser.newContext({
        viewport: config.viewport,
        deviceScaleFactor: config.deviceScaleFactor,
        isMobile: false,
        hasTouch: true,
        locale: 'en-US',
        timezoneId: 'America/Los_Angeles',
        colorScheme: 'dark'
      });

      const page = await context.newPage();

      try {
        // Navigate to app
        await page.goto('http://localhost:5176', { waitUntil: 'networkidle' });

        // Inject Emma's data
        const emmaData = generateEmmaCompleteData();
        await page.evaluate((data) => {
          localStorage.clear();
          localStorage.setItem('signal_noise_onboarded', 'true');
          localStorage.setItem('signal_noise_data', JSON.stringify(data));
          localStorage.setItem('onboarding_complete', 'true');
          localStorage.setItem('hasSeenWelcome', 'true');
          localStorage.setItem('premium_status', JSON.stringify({
            isActive: true,
            tier: 'foundation',
            email: 'emma.chen@techcorp.io',
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
          }));
          location.reload();
        }, emmaData);

        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        // Apply zoom if specified (tablets need to show more content)
        if (config.zoom) {
          await page.evaluate((zoom) => {
            document.body.style.zoom = zoom.toString();
          }, config.zoom);
        }

        // Focus input if needed (to show Signal/Noise buttons)
        if (screenshot.focusInput) {
          await page.focus('input[type="text"]');
          await page.fill('input[type="text"]', 'Strategic planning session');
          await page.waitForTimeout(500);
        }

        // Show 30-day analytics if needed
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

        // Add overlay if specified
        if (screenshot.overlay && screenshot.overlay.html) {
          await page.evaluate((html) => {
            const overlay = document.createElement('div');
            overlay.innerHTML = html;
            document.body.appendChild(overlay);
          }, screenshot.overlay.html);
          await page.waitForTimeout(300);
        }

        // Take screenshot
        const filepath = path.join(outputDir, `${screenshot.name}.png`);
        await page.screenshot({ path: filepath, fullPage: false });
        console.log(`  ✓ ${screenshot.name}`);

      } catch (error) {
        console.error(`  ✗ ${screenshot.name}: ${error.message}`);
      } finally {
        await context.close();
      }
    }
  }

  await browser.close();

  // Add device frames
  console.log('\n🖼️ Adding device frames...');

  for (const config of tabletConfigs) {
    const inputDir = path.join(__dirname, config.outputDir);
    const outputDir = path.join(__dirname, `${config.outputDir}-framed`);

    try {
      const cmd = `npx deviceframe ${inputDir}/*.png --frame "${config.deviceFrame}" --output ${outputDir}`;
      console.log(`  Running: ${cmd}`);
      await execAsync(cmd);
      console.log(`  ✓ ${config.name} frames added`);
    } catch (error) {
      console.error(`  ✗ Failed to add frames for ${config.name}: ${error.message}`);
    }
  }

  console.log('\n✅ Tablet screenshots complete!');
  console.log('\n📁 Output directories:');
  console.log('   - screenshots-7inch-tablet-framed/');
  console.log('   - screenshots-10inch-tablet-framed/');
}

// Run the generator
generateTabletScreenshots().catch(console.error);