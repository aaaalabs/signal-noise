import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Google Play Store Requirements:
// Phone: 2 to 8 screenshots, 16:9 or 9:16 aspect ratio
// 7-inch tablet: Optional, same requirements
// 10-inch tablet: Optional, same requirements

const DEVICES = {
  phone: {
    width: 1080,
    height: 1920,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    folder: 'screenshots/phone'
  },
  tablet7: {
    width: 1600,
    height: 2560,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    folder: 'screenshots/tablet7'
  }
};

const SCREENSHOTS = [
  {
    id: '01-hero',
    name: 'Main Dashboard',
    setup: async (page) => {
      // Main view is default
      await page.waitForSelector('[class*="ratio"]', { timeout: 10000 });
    },
    caption: {
      text: '85% Focused Today',
      position: 'bottom'
    }
  },
  {
    id: '02-tasks',
    name: 'Task List',
    setup: async (page) => {
      await page.waitForSelector('[class*="task-grid"]', { timeout: 10000 });
      // Scroll to show tasks
      await page.evaluate(() => {
        const taskGrid = document.querySelector('[class*="task-grid"]');
        if (taskGrid) taskGrid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
      await page.waitForTimeout(1000);
    },
    caption: {
      text: 'Track Every Decision',
      position: 'top'
    }
  },
  {
    id: '03-analytics',
    name: 'Analytics View',
    setup: async (page) => {
      // Click analytics button if exists
      const analyticsBtn = await page.$('button:has-text("Analytics"), [aria-label*="Analytics"], button:has-text("30-Day")');
      if (analyticsBtn) {
        await analyticsBtn.click();
        await page.waitForTimeout(2000);
      }
    },
    caption: {
      text: '30-Day Progress',
      position: 'top'
    }
  },
  {
    id: '04-achievements',
    name: 'Achievements',
    setup: async (page) => {
      // Click on achievement dots if visible
      const achievementDots = await page.$('[class*="achievement"]');
      if (achievementDots) {
        await achievementDots.click();
        await page.waitForTimeout(1500);
      }
    },
    caption: {
      text: 'Earn Productivity Badges',
      position: 'center'
    }
  },
  {
    id: '05-dark-mode',
    name: 'Dark Interface',
    setup: async (page) => {
      // Show full interface
      await page.waitForTimeout(1000);
    },
    caption: null // No caption for this one
  }
];

async function setupMockData(page) {
  // Inject comprehensive mock data
  await page.evaluate(() => {
    const mockData = {
      tasks: [
        { type: 'signal', title: 'Strategic planning session', timestamp: Date.now() - 28800000, id: 'a1' },
        { type: 'signal', title: 'Code review - v2.0 release', timestamp: Date.now() - 25200000, id: 'a2' },
        { type: 'signal', title: 'Customer success calls', timestamp: Date.now() - 21600000, id: 'a3' },
        { type: 'signal', title: 'Product roadmap review', timestamp: Date.now() - 18000000, id: 'a4' },
        { type: 'signal', title: 'Team performance reviews', timestamp: Date.now() - 14400000, id: 'a5' },
        { type: 'noise', title: 'Email triage', timestamp: Date.now() - 10800000, id: 'a6' },
        { type: 'signal', title: 'API documentation', timestamp: Date.now() - 7200000, id: 'a7' },
        { type: 'signal', title: 'Sprint planning', timestamp: Date.now() - 3600000, id: 'a8' },
        { type: 'signal', title: 'Design system updates', timestamp: Date.now() - 1800000, id: 'a9' },
        { type: 'noise', title: 'Slack messages', timestamp: Date.now() - 900000, id: 'a10' },
        { type: 'signal', title: 'Feature development', timestamp: Date.now() - 300000, id: 'a11' }
      ],
      history: Array.from({length: 30}, (_, i) => {
        const dayOffset = 29 - i;
        const date = new Date(Date.now() - dayOffset * 86400000);
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        const baseRatio = isWeekend ? 70 : 82;
        const variance = Math.random() * 10 - 5;

        return {
          date: date.toISOString().split('T')[0],
          ratio: Math.round(Math.max(60, Math.min(95, baseRatio + variance))),
          signalCount: isWeekend ? 5 + Math.floor(Math.random() * 3) : 10 + Math.floor(Math.random() * 5),
          noiseCount: 2 + Math.floor(Math.random() * 3)
        };
      }),
      badges: ['early-bird', 'streak-7', 'perfect-ratio', 'pattern-master'],
      patterns: {
        mostProductiveHour: 9,
        leastProductiveHour: 15,
        bestDay: 'Tuesday',
        averageSignalDuration: 45
      },
      settings: {
        targetRatio: 80,
        notifications: true,
        firstName: 'Alex'
      }
    };

    // Force set the data
    localStorage.setItem('signal_noise_data', JSON.stringify(mockData));
    localStorage.setItem('onboarding_completed', 'true');
    localStorage.setItem('screenshot_mode', 'true');

    // Trigger storage event to notify React
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'signal_noise_data',
      newValue: JSON.stringify(mockData),
      storageArea: localStorage
    }));
  });
}

async function addCaption(page, caption) {
  if (!caption) return;

  await page.evaluate((cap) => {
    // Remove any existing captions
    const existing = document.querySelector('.screenshot-caption');
    if (existing) existing.remove();

    const captionEl = document.createElement('div');
    captionEl.className = 'screenshot-caption';
    captionEl.style.cssText = `
      position: fixed;
      ${cap.position === 'top' ? 'top: 80px;' : ''}
      ${cap.position === 'bottom' ? 'bottom: 80px;' : ''}
      ${cap.position === 'center' ? 'top: 50%; transform: translateY(-50%) translateX(-50%);' : 'transform: translateX(-50%);'}
      left: 50%;
      background: linear-gradient(135deg, #00ff88, #00cc6a);
      color: #000;
      padding: 16px 32px;
      border-radius: 40px;
      font-size: 28px;
      font-weight: 600;
      font-family: -apple-system, system-ui, sans-serif;
      box-shadow: 0 8px 32px rgba(0, 255, 136, 0.4);
      z-index: 99999;
      white-space: nowrap;
    `;
    captionEl.textContent = cap.text;
    document.body.appendChild(captionEl);
  }, caption);
}

async function generateScreenshots() {
  console.log('🚀 Starting screenshot generation...');

  // Create directories
  Object.values(DEVICES).forEach(device => {
    const dir = path.join(__dirname, device.folder);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  const browser = await chromium.launch({
    headless: false // Set to true for production
  });

  for (const [deviceName, device] of Object.entries(DEVICES)) {
    console.log(`\n📱 Generating ${deviceName} screenshots...`);

    for (const screenshot of SCREENSHOTS) {
      const context = await browser.newContext({
        viewport: {
          width: device.width,
          height: device.height
        },
        deviceScaleFactor: device.deviceScaleFactor,
        isMobile: device.isMobile,
        hasTouch: device.hasTouch,
        locale: 'en-US',
        colorScheme: 'dark'
      });

      const page = await context.newPage();

      try {
        // Go to the app
        await page.goto('http://localhost:5176');

        // Wait for app to load
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        // Setup mock data
        await setupMockData(page);

        // Reload to apply mock data
        await page.reload();
        await page.waitForTimeout(3000);

        // Execute screenshot-specific setup
        await screenshot.setup(page);

        // Add caption if needed
        if (screenshot.caption) {
          await addCaption(page, screenshot.caption);
          await page.waitForTimeout(500);
        }

        // Take screenshot
        const filename = `${screenshot.id}-${screenshot.name.toLowerCase().replace(/\s+/g, '-')}.png`;
        const filepath = path.join(__dirname, device.folder, filename);

        await page.screenshot({
          path: filepath,
          fullPage: false
        });

        console.log(`  ✅ ${screenshot.id} - ${screenshot.name}`);

      } catch (error) {
        console.error(`  ❌ Error with ${screenshot.id}:`, error.message);
      } finally {
        await context.close();
      }
    }
  }

  await browser.close();
}

async function generateFeatureGraphic() {
  console.log('\n🎨 Generating feature graphic...');

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.setViewportSize({ width: 1024, height: 500 });

  const html = `
    <!DOCTYPE html>
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
          font-family: -apple-system, system-ui, sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* Gradient background */
        .bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 20% 50%, rgba(0,255,136,0.15) 0%, transparent 50%),
                      radial-gradient(circle at 80% 50%, rgba(0,255,136,0.1) 0%, transparent 50%),
                      linear-gradient(180deg, #000 0%, #0a0a0a 100%);
        }

        .content {
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 80px;
          z-index: 1;
        }

        .left {
          flex: 1;
        }

        .logo {
          width: 80px;
          height: 80px;
          background: #00ff88;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-weight: 300;
          color: #000;
          margin-bottom: 24px;
        }

        .title {
          font-size: 56px;
          font-weight: 200;
          color: #fff;
          margin-bottom: 12px;
          letter-spacing: -1px;
        }

        .tagline {
          font-size: 24px;
          color: #00ff88;
          margin-bottom: 24px;
        }

        .features {
          display: flex;
          gap: 24px;
          color: #999;
          font-size: 14px;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .right {
          position: relative;
          width: 240px;
          height: 480px;
        }

        .phone {
          width: 240px;
          height: 480px;
          background: #111;
          border-radius: 32px;
          border: 2px solid #222;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .ratio-circle {
          width: 140px;
          height: 140px;
          border: 6px solid #00ff88;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          position: relative;
        }

        .ratio-text {
          font-size: 48px;
          color: #00ff88;
          font-weight: 100;
        }

        .mini-stats {
          display: flex;
          gap: 32px;
        }

        .stat {
          text-align: center;
        }

        .stat-value {
          font-size: 28px;
          color: #fff;
          font-weight: 100;
        }

        .stat-label {
          font-size: 10px;
          color: #666;
          text-transform: uppercase;
          margin-top: 4px;
        }

        .badge {
          position: absolute;
          top: -12px;
          right: -12px;
          background: #00ff88;
          color: #000;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="bg"></div>
      <div class="content">
        <div class="left">
          <div class="logo">S/N</div>
          <div class="title">Signal/Noise</div>
          <div class="tagline">Focus on what matters</div>
          <div class="features">
            <div class="feature">
              <span>✓</span>
              <span>80/20 Tracking</span>
            </div>
            <div class="feature">
              <span>✓</span>
              <span>100% Private</span>
            </div>
            <div class="feature">
              <span>✓</span>
              <span>No Ads</span>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="phone">
            <div class="badge">FREE</div>
            <div class="ratio-circle">
              <div class="ratio-text">85%</div>
            </div>
            <div class="mini-stats">
              <div class="stat">
                <div class="stat-value">12</div>
                <div class="stat-label">Signal</div>
              </div>
              <div class="stat">
                <div class="stat-value">2</div>
                <div class="stat-label">Noise</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  await page.setContent(html);
  await page.waitForTimeout(1000);

  const dir = path.join(__dirname, 'screenshots/feature-graphic');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  await page.screenshot({
    path: path.join(dir, 'feature-graphic.png')
  });

  console.log('  ✅ Feature graphic created');

  await browser.close();
}

// Main execution
(async () => {
  try {
    console.log('⚠️  Ensure dev server is running on http://localhost:5176');
    console.log('Starting in 3 seconds...\n');
    await new Promise(resolve => setTimeout(resolve, 3000));

    await generateScreenshots();
    await generateFeatureGraphic();

    console.log('\n✨ All screenshots generated successfully!');
    console.log('\n📁 Assets saved to:');
    console.log('  - screenshots/phone/');
    console.log('  - screenshots/tablet7/');
    console.log('  - screenshots/feature-graphic/');

    console.log('\n📋 Manual steps required:');
    console.log('1. Review and select best 2-8 screenshots');
    console.log('2. Order by impact (hero shot first)');
    console.log('3. Upload to Google Play Console');
    console.log('4. Add app icon if not already uploaded');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
})();