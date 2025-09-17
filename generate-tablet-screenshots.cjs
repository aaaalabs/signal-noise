const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Emma Chen's 26-day journey data
const emmaData = {
  tasks: [
    // Day 26 (today) - Emma at her best
    { id: '26-1', text: 'Review Q1 product roadmap with team', type: 'signal', timestamp: new Date('2024-02-14T09:00:00').toISOString() },
    { id: '26-2', text: 'Define success metrics for launch', type: 'signal', timestamp: new Date('2024-02-14T10:30:00').toISOString() },
    { id: '26-3', text: 'User interview synthesis', type: 'signal', timestamp: new Date('2024-02-14T14:00:00').toISOString() },
    { id: '26-4', text: 'Strategic planning session', type: 'signal', timestamp: new Date('2024-02-14T15:30:00').toISOString() },
    { id: '26-5', text: 'Reply to Slack overflow', type: 'noise', timestamp: new Date('2024-02-14T11:45:00').toISOString() },

    // Day 25 - Strong focus
    { id: '25-1', text: 'Feature prioritization workshop', type: 'signal', timestamp: new Date('2024-02-13T09:30:00').toISOString() },
    { id: '25-2', text: 'Customer feedback analysis', type: 'signal', timestamp: new Date('2024-02-13T11:00:00').toISOString() },
    { id: '25-3', text: 'Sprint planning session', type: 'signal', timestamp: new Date('2024-02-13T14:00:00').toISOString() },
    { id: '25-4', text: 'Random vendor emails', type: 'noise', timestamp: new Date('2024-02-13T13:00:00').toISOString() },
    { id: '25-5', text: 'Office birthday party', type: 'noise', timestamp: new Date('2024-02-13T16:00:00').toISOString() },

    // Day 24 - Good momentum
    { id: '24-1', text: 'Design review for new feature', type: 'signal', timestamp: new Date('2024-02-12T10:00:00').toISOString() },
    { id: '24-2', text: 'Stakeholder alignment meeting', type: 'signal', timestamp: new Date('2024-02-12T11:30:00').toISOString() },
    { id: '24-3', text: 'Market research deep dive', type: 'signal', timestamp: new Date('2024-02-12T14:00:00').toISOString() },
    { id: '24-4', text: 'Update JIRA tickets', type: 'noise', timestamp: new Date('2024-02-12T09:00:00').toISOString() },
    { id: '24-5', text: 'Organize desktop files', type: 'noise', timestamp: new Date('2024-02-12T16:30:00').toISOString() },
  ],
  history: [
    { date: '2024-01-20', signalPercentage: 45 },
    { date: '2024-01-21', signalPercentage: 40 },
    { date: '2024-01-22', signalPercentage: 48 },
    { date: '2024-01-23', signalPercentage: 52 },
    { date: '2024-01-24', signalPercentage: 55 },
    { date: '2024-01-25', signalPercentage: 50 },
    { date: '2024-01-26', signalPercentage: 58 },
    { date: '2024-01-27', signalPercentage: 62 },
    { date: '2024-01-28', signalPercentage: 65 },
    { date: '2024-01-29', signalPercentage: 60 },
    { date: '2024-01-30', signalPercentage: 68 },
    { date: '2024-01-31', signalPercentage: 70 },
    { date: '2024-02-01', signalPercentage: 72 },
    { date: '2024-02-02', signalPercentage: 65 },
    { date: '2024-02-03', signalPercentage: 75 },
    { date: '2024-02-04', signalPercentage: 78 },
    { date: '2024-02-05', signalPercentage: 73 },
    { date: '2024-02-06', signalPercentage: 80 },
    { date: '2024-02-07', signalPercentage: 82 },
    { date: '2024-02-08', signalPercentage: 77 },
    { date: '2024-02-09', signalPercentage: 83 },
    { date: '2024-02-10', signalPercentage: 85 },
    { date: '2024-02-11', signalPercentage: 80 },
    { date: '2024-02-12', signalPercentage: 82 },
    { date: '2024-02-13', signalPercentage: 85 },
    { date: '2024-02-14', signalPercentage: 88 }
  ],
  badges: ['early_adopter', 'perfect_day', 'week_warrior', 'focus_master', 'noise_filter', 'pattern_breaker', 'comeback_king'],
  patterns: {
    lastSync: new Date().toISOString(),
    streakDays: 7,
    bestRatio: 88,
    totalTasks: 347,
    weeklyAverage: 82
  },
  settings: {
    targetRatio: 80,
    notifications: true,
    firstName: 'Emma'
  }
};

// Screen configurations
const tabletConfigs = [
  {
    name: '7-inch-tablet',
    width: 600,
    height: 1024,
    deviceScaleFactor: 2,
    isMobile: false,
    hasTouch: true,
    outputDir: 'screenshots-7inch-tablet'
  },
  {
    name: '10-inch-tablet',
    width: 800,
    height: 1280,
    deviceScaleFactor: 2,
    isMobile: false,
    hasTouch: true,
    outputDir: 'screenshots-10inch-tablet'
  }
];

// Screenshots to capture
const screenshots = [
  {
    name: '1-dashboard',
    title: 'Focus Dashboard',
    subtitle: 'Track your Signal/Noise ratio in real-time',
    setup: async (page) => {
      // Main dashboard view
    }
  },
  {
    name: '2-adding-signal',
    title: 'Add Signal Tasks',
    subtitle: 'Capture what truly matters',
    setup: async (page) => {
      await page.fill('input[type="text"]', 'Strategic planning session');
    }
  },
  {
    name: '3-achievements',
    title: 'Unlock Achievements',
    subtitle: 'Celebrate your focus milestones',
    setup: async (page) => {
      // Trigger achievement display
      const achButton = await page.$('text=/Achievement/i');
      if (achButton) await achButton.click();
    }
  },
  {
    name: '4-analytics',
    title: '30-Day Analytics',
    subtitle: 'See your productivity evolution',
    setup: async (page) => {
      // Click to expand analytics
      const analyticsSection = await page.$('text=/30-Day Overview/');
      if (analyticsSection) await analyticsSection.click();
      await page.waitForTimeout(500);
    }
  },
  {
    name: '5-focus-mode',
    title: 'Perfect Focus',
    subtitle: "You're in the zone at 85%+ Signal",
    setup: async (page) => {
      // Show high performance state
    }
  },
  {
    name: '6-ai-coach',
    title: 'AI Coach Insights',
    subtitle: 'Get personalized productivity guidance',
    setup: async (page) => {
      // Simulate AI coach message
      await page.evaluate(() => {
        const coachDiv = document.createElement('div');
        coachDiv.innerHTML = `
          <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 255, 136, 0.05));
            border: 1px solid rgba(0, 255, 136, 0.3);
            border-radius: 12px;
            padding: 16px;
            max-width: 300px;
            z-index: 1000;
            backdrop-filter: blur(10px);
          ">
            <div style="color: #00ff88; font-size: 11px; margin-bottom: 8px; opacity: 0.8;">
              AI COACH
            </div>
            <div style="color: #fff; font-size: 14px; line-height: 1.4;">
              Emma, your 7-day streak is impressive! You're consistently hitting 85%+ Signal ratio. This is elite performance territory. 🎯
            </div>
          </div>
        `;
        document.body.appendChild(coachDiv);
      });
      await page.waitForTimeout(500);
    }
  }
];

async function generateTabletScreenshots() {
  const browser = await chromium.launch({ headless: true });

  for (const config of tabletConfigs) {
    console.log(`\n📱 Generating ${config.name} screenshots...`);

    // Create output directory
    const outputDir = path.join(__dirname, config.outputDir);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const context = await browser.newContext({
      viewport: { width: config.width, height: config.height },
      deviceScaleFactor: config.deviceScaleFactor,
      isMobile: config.isMobile,
      hasTouch: config.hasTouch,
      locale: 'en-US',
      timezoneId: 'America/Los_Angeles',
      colorScheme: 'dark'
    });

    const page = await context.newPage();

    // Inject Emma's data into localStorage
    await page.addInitScript((data) => {
      localStorage.setItem('signal_noise_data', JSON.stringify(data));
      localStorage.setItem('signal_noise_onboarded', 'true');
      localStorage.setItem('premium_status', JSON.stringify({
        isActive: true,
        tier: 'foundation',
        email: 'emma.chen@techcorp.io',
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      }));
    }, emmaData);

    // Navigate to the app
    await page.goto('http://localhost:5176', { waitUntil: 'networkidle' });

    // Force reload to ensure localStorage is applied
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Verify data is loaded
    const hasData = await page.evaluate(() => {
      const data = localStorage.getItem('signal_noise_data');
      return data && JSON.parse(data).tasks.length > 0;
    });

    if (!hasData) {
      console.log('  ⚠️ Warning: Data not loaded, retrying...');
      await page.reload({ waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);
    }

    // Take screenshots
    for (const shot of screenshots) {
      console.log(`  📸 ${shot.name}...`);

      // Setup the specific view
      if (shot.setup) {
        await shot.setup(page);
      }

      // Add overlay for Play Store
      await page.evaluate(({ title, subtitle }) => {
        // Remove any existing overlay
        const existing = document.getElementById('screenshot-overlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'screenshot-overlay';
        overlay.innerHTML = `
          <div style="
            position: fixed;
            bottom: 60px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(10, 10, 10, 0.95);
            border: 1px solid rgba(0, 255, 136, 0.2);
            border-radius: 16px;
            padding: 20px 32px;
            text-align: center;
            backdrop-filter: blur(20px);
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8);
            z-index: 10000;
          ">
            <div style="
              color: #00ff88;
              font-size: 20px;
              font-weight: 300;
              margin-bottom: 8px;
              letter-spacing: 0.5px;
            ">${title}</div>
            <div style="
              color: #999;
              font-size: 14px;
              font-weight: 300;
            ">${subtitle}</div>
          </div>
        `;
        document.body.appendChild(overlay);
      }, { title: shot.title, subtitle: shot.subtitle });

      await page.waitForTimeout(500);

      // Take screenshot
      const screenshotPath = path.join(outputDir, `${shot.name}.png`);
      await page.screenshot({
        path: screenshotPath,
        fullPage: false
      });

      // Clean up overlay
      await page.evaluate(() => {
        const overlay = document.getElementById('screenshot-overlay');
        if (overlay) overlay.remove();
      });
    }

    await context.close();
  }

  await browser.close();

  console.log('\n✅ Tablet screenshots generated successfully!');
  console.log('\n📁 Output directories:');
  console.log('   - screenshots-7inch-tablet/');
  console.log('   - screenshots-10inch-tablet/');
}

// Run the generator
generateTabletScreenshots().catch(console.error);