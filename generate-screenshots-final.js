import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Marketing-optimized mock data following ASO best practices
const MOCK_DATA_SCENARIOS = {
  hero: {
    tasks: [
      { type: 'signal', title: 'Launch product strategy meeting', timestamp: Date.now() - 25200000, id: '1' },
      { type: 'signal', title: 'Review Q4 revenue metrics', timestamp: Date.now() - 21600000, id: '2' },
      { type: 'signal', title: 'Customer interview synthesis', timestamp: Date.now() - 18000000, id: '3' },
      { type: 'signal', title: 'Write API documentation', timestamp: Date.now() - 14400000, id: '4' },
      { type: 'signal', title: 'Team performance reviews', timestamp: Date.now() - 10800000, id: '5' },
      { type: 'noise', title: 'Check Twitter mentions', timestamp: Date.now() - 9000000, id: '6' },
      { type: 'signal', title: 'Design system audit', timestamp: Date.now() - 7200000, id: '7' },
      { type: 'signal', title: 'Sprint planning session', timestamp: Date.now() - 3600000, id: '8' },
      { type: 'signal', title: 'Code deployment review', timestamp: Date.now() - 1800000, id: '9' },
      { type: 'noise', title: 'Slack notifications', timestamp: Date.now() - 900000, id: '10' },
      { type: 'signal', title: 'Feature prioritization', timestamp: Date.now() - 300000, id: '11' }
    ],
    history: generateRealisticHistory(85),
    badges: ['early-bird', 'streak-7', 'perfect-ratio', 'focused-friday'],
    patterns: {},
    settings: {
      targetRatio: 80,
      notifications: true,
      firstName: 'Sarah'
    }
  },
  improvement: {
    tasks: [
      { type: 'signal', title: 'Deep work: Algorithm optimization', timestamp: Date.now() - 14400000, id: '1' },
      { type: 'signal', title: 'Write technical blog post', timestamp: Date.now() - 10800000, id: '2' },
      { type: 'signal', title: 'Mentor junior developers', timestamp: Date.now() - 7200000, id: '3' },
      { type: 'noise', title: 'Email cleanup', timestamp: Date.now() - 5400000, id: '4' },
      { type: 'signal', title: 'Architecture review', timestamp: Date.now() - 3600000, id: '5' },
      { type: 'signal', title: 'Customer success call', timestamp: Date.now() - 1800000, id: '6' }
    ],
    history: generateImprovementHistory(),
    badges: ['comeback-kid', 'improving', 'streak-3'],
    patterns: {},
    settings: {
      targetRatio: 80,
      notifications: true,
      firstName: 'Marcus'
    }
  }
};

function generateRealisticHistory(avgRatio) {
  const history = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(Date.now() - i * 86400000);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const baseRatio = isWeekend ? avgRatio - 10 : avgRatio;
    const variance = (Math.random() - 0.5) * 10;

    history.push({
      date: date.toISOString().split('T')[0],
      ratio: Math.round(Math.min(95, Math.max(65, baseRatio + variance))),
      signalCount: isWeekend ? 4 + Math.floor(Math.random() * 4) : 8 + Math.floor(Math.random() * 6),
      noiseCount: 1 + Math.floor(Math.random() * 3)
    });
  }
  return history;
}

function generateImprovementHistory() {
  const history = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(Date.now() - i * 86400000);
    // Show clear improvement trend from 65% to 85%
    const progress = (29 - i) / 29;
    const baseRatio = 65 + (progress * 20);
    const variance = (Math.random() - 0.5) * 8;

    history.push({
      date: date.toISOString().split('T')[0],
      ratio: Math.round(Math.min(92, Math.max(60, baseRatio + variance))),
      signalCount: 6 + Math.floor(Math.random() * 8),
      noiseCount: 1 + Math.floor(Math.random() * 4)
    });
  }
  return history;
}

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
    name: 'Track Your 80-20 Focus',
    scenario: 'hero',
    setup: async (page) => {
      // Main dashboard view
      await page.waitForTimeout(1000);
    },
    highlight: '.ratio-display',
    caption: '85% Productive Today'
  },
  {
    id: '02-tasks',
    name: 'Signal vs Noise Tasks',
    scenario: 'hero',
    setup: async (page) => {
      // Scroll to task grid
      await page.evaluate(() => {
        const taskSection = document.querySelector('.task-grid, [class*="task"], .tasks-container');
        if (taskSection) {
          taskSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
      await page.waitForTimeout(1500);
    },
    caption: 'Classify Every Decision'
  },
  {
    id: '03-analytics',
    name: '30 Day Analytics',
    scenario: 'improvement',
    setup: async (page) => {
      // Click analytics or 30-day view
      const buttons = await page.$$('button');
      for (const button of buttons) {
        const text = await button.textContent();
        if (text && (text.includes('30') || text.includes('Analytics') || text.includes('History'))) {
          await button.click();
          break;
        }
      }
      await page.waitForTimeout(2000);
    },
    caption: '20% Improvement'
  },
  {
    id: '04-achievements',
    name: 'Productivity Badges',
    scenario: 'hero',
    setup: async (page) => {
      // Try to show achievements
      const achievementElements = await page.$$('[class*="achievement"], [class*="badge"], [class*="streak"]');
      if (achievementElements.length > 0) {
        await achievementElements[0].click();
        await page.waitForTimeout(1500);
      }
    },
    caption: '7-Day Streak!'
  },
  {
    id: '05-dark-interface',
    name: 'Beautiful Dark Mode',
    scenario: 'hero',
    setup: async (page) => {
      await page.waitForTimeout(500);
    },
    caption: null
  }
];

async function injectMockData(page, scenario) {
  const mockData = MOCK_DATA_SCENARIOS[scenario];

  await page.evaluate((data) => {
    // Clear all existing data
    localStorage.clear();

    // Set all required flags
    localStorage.setItem('signal_noise_onboarded', 'true');
    localStorage.setItem('signal_noise_data', JSON.stringify(data));
    localStorage.setItem('onboarding_complete', 'true');
    localStorage.setItem('hasSeenWelcome', 'true');
    localStorage.setItem('tutorial_complete', 'true');

    // Force reload to apply changes
    location.reload();
  }, mockData);

  // Wait for reload
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
}

async function addMarketingCaption(page, text) {
  if (!text) return;

  await page.evaluate((captionText) => {
    const caption = document.createElement('div');
    caption.style.cssText = `
      position: fixed;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #00ff88, #00cc6a);
      color: #000;
      padding: 16px 32px;
      border-radius: 50px;
      font-size: 32px;
      font-weight: 600;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      box-shadow: 0 10px 40px rgba(0, 255, 136, 0.4);
      z-index: 999999;
      white-space: nowrap;
    `;
    caption.textContent = captionText;
    document.body.appendChild(caption);
  }, text);
}

async function generateScreenshots() {
  console.log('🚀 Starting Play Store screenshot generation...\n');

  // Create directories
  for (const device of Object.keys(DEVICES)) {
    const dir = path.join(__dirname, `screenshots/${device}`);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  const browser = await chromium.launch({
    headless: false,
    args: ['--disable-blink-features=AutomationControlled']
  });

  for (const [deviceName, device] of Object.entries(DEVICES)) {
    console.log(`📱 Generating ${deviceName} screenshots (${device.width}x${device.height})...\n`);

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

        // Navigate to app
        await page.goto('http://localhost:5176', { waitUntil: 'networkidle' });

        // Inject mock data for this scenario
        await injectMockData(page, screenshot.scenario);

        // Execute screenshot-specific setup
        await screenshot.setup(page);

        // Add highlight effect if specified
        if (screenshot.highlight) {
          await page.evaluate((selector) => {
            const element = document.querySelector(selector);
            if (element) {
              element.style.boxShadow = '0 0 0 4px #00ff88, 0 0 60px rgba(0, 255, 136, 0.6)';
              element.style.transform = 'scale(1.02)';
              element.style.transition = 'all 0.3s ease';
            }
          }, screenshot.highlight);
        }

        // Add marketing caption
        if (screenshot.caption) {
          await addMarketingCaption(page, screenshot.caption);
          await page.waitForTimeout(500);
        }

        // Take screenshot
        const filename = `${screenshot.id}-${screenshot.name.toLowerCase().replace(/\s+/g, '-')}.png`;
        const filepath = path.join(__dirname, `screenshots/${deviceName}`, filename);

        await page.screenshot({
          path: filepath,
          fullPage: false
        });

        console.log(`  ✅ ${screenshot.id}: ${screenshot.name}`);

        await context.close();
      } catch (error) {
        console.error(`  ❌ Failed ${screenshot.id}: ${error.message}`);
      }
    }
    console.log('');
  }

  await browser.close();
}

async function generateFeatureGraphic() {
  console.log('🎨 Creating feature graphic (1024x500)...\n');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.setViewportSize({ width: 1024, height: 500 });

  const html = `<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; }
  body {
    width: 1024px;
    height: 500px;
    background: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: -apple-system, system-ui, sans-serif;
    position: relative;
  }

  .gradient-bg {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 30% 50%, rgba(0,255,136,0.2) 0%, transparent 40%),
                radial-gradient(circle at 70% 50%, rgba(0,255,136,0.15) 0%, transparent 40%),
                linear-gradient(90deg, #000 0%, #0a0a0a 50%, #000 100%);
  }

  .content {
    position: relative;
    display: flex;
    align-items: center;
    gap: 80px;
    z-index: 1;
  }

  .text-section {
    text-align: left;
  }

  .logo {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    background: #00ff88;
    border-radius: 20px;
    font-size: 36px;
    font-weight: 300;
    color: #000;
    margin-bottom: 24px;
  }

  .title {
    font-size: 64px;
    font-weight: 200;
    color: #fff;
    margin-bottom: 16px;
    letter-spacing: -2px;
  }

  .subtitle {
    font-size: 28px;
    color: #00ff88;
    margin-bottom: 32px;
  }

  .features {
    display: flex;
    gap: 32px;
  }

  .feature {
    color: #888;
    font-size: 16px;
  }

  .visual {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .phone-mock {
    width: 200px;
    height: 400px;
    background: linear-gradient(180deg, #1a1a1a, #111);
    border-radius: 24px;
    border: 2px solid #333;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0 30px 60px rgba(0,0,0,0.5);
  }

  .ratio-ring {
    width: 120px;
    height: 120px;
    border: 6px solid #00ff88;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 32px;
  }

  .ratio-value {
    font-size: 42px;
    font-weight: 100;
    color: #00ff88;
  }

  .stats {
    display: flex;
    gap: 40px;
  }

  .stat {
    text-align: center;
  }

  .stat-num {
    font-size: 24px;
    color: #fff;
    font-weight: 100;
  }

  .stat-label {
    font-size: 11px;
    color: #666;
    text-transform: uppercase;
    margin-top: 4px;
  }
</style>
</head>
<body>
  <div class="gradient-bg"></div>
  <div class="content">
    <div class="text-section">
      <div class="logo">S/N</div>
      <h1 class="title">Signal/Noise</h1>
      <p class="subtitle">Focus on what matters</p>
      <div class="features">
        <div class="feature">✓ 80/20 Tracking</div>
        <div class="feature">✓ 100% Private</div>
        <div class="feature">✓ No Ads</div>
      </div>
    </div>
    <div class="visual">
      <div class="phone-mock">
        <div class="ratio-ring">
          <span class="ratio-value">85%</span>
        </div>
        <div class="stats">
          <div class="stat">
            <div class="stat-num">12</div>
            <div class="stat-label">Signal</div>
          </div>
          <div class="stat">
            <div class="stat-num">2</div>
            <div class="stat-label">Noise</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

  await page.setContent(html);
  await page.waitForTimeout(1000);

  const dir = path.join(__dirname, 'screenshots/feature-graphic');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  await page.screenshot({
    path: path.join(dir, 'feature-graphic.png')
  });

  console.log('  ✅ Feature graphic created\n');

  await browser.close();
}

// Main execution
(async () => {
  try {
    console.log('\n🎯 Signal/Noise - Play Store Asset Generator\n');
    console.log('━'.repeat(50));
    console.log('Based on ASO best practices from:');
    console.log('• Steve P. Young (App Masters)');
    console.log('• Gabriel Machuret (ASO Stack)');
    console.log('• Thomas Petit (Growth Consultant)');
    console.log('━'.repeat(50) + '\n');

    await generateScreenshots();
    await generateFeatureGraphic();

    console.log('✨ All Play Store assets generated!\n');
    console.log('📁 Output locations:');
    console.log('  • Phone: screenshots/phone/');
    console.log('  • Tablet: screenshots/tablet7/');
    console.log('  • Feature: screenshots/feature-graphic/\n');

    console.log('📋 Next Steps:');
    console.log('1. Review all screenshots');
    console.log('2. Select 2-8 best screenshots per device');
    console.log('3. Order by impact (hero shot first!)');
    console.log('4. Upload to Google Play Console\n');

    console.log('💡 Pro Tips:');
    console.log('• First 2 screenshots get 90% of views');
    console.log('• Show your value prop immediately');
    console.log('• Use captions to highlight benefits');
    console.log('• A/B test different screenshot orders\n');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
})();