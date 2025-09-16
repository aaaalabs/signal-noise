import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import mock data
import mockDataScenarios from './screenshot-mock-data.js';

// Marketing insights from top ASO experts:
// - First 2 screenshots get 90% of views (optimize these!)
// - Show value proposition immediately
// - Use contrast and clear visual hierarchy
// - Include social proof (badges, streaks)
// - Show the "aha moment" quickly

const SCREENSHOT_CONFIGS = [
  {
    name: 'phone',
    width: 1080,
    height: 1920,
    deviceScaleFactor: 2,
    folder: 'screenshots/phone'
  },
  {
    name: 'tablet7',
    width: 1600,
    height: 2560,
    deviceScaleFactor: 2,
    folder: 'screenshots/tablet7'
  },
  {
    name: 'tablet10',
    width: 1600,
    height: 2560,
    deviceScaleFactor: 2,
    folder: 'screenshots/tablet10'
  }
];

// Screenshot scenarios in order of marketing impact
const SCREENSHOT_SCENARIOS = [
  {
    id: '01-hero-ratio',
    scenario: 'perfectDay',
    title: 'Track Your 80/20 Focus',
    subtitle: 'See your productivity ratio in real-time',
    description: 'Main dashboard with 85% signal ratio',
    waitForElement: '.ratio-display',
    highlight: '.ratio-display',
    captionPosition: 'top',
    captionText: '85% Focused Today 🎯'
  },
  {
    id: '02-achievement',
    scenario: 'perfectDay',
    title: 'Earn Productivity Badges',
    subtitle: 'Stay motivated with achievements',
    description: 'Achievement system showing streaks',
    clickElement: '.achievement-dots',
    waitForElement: '.achievement-modal',
    highlight: '.achievement-list',
    captionPosition: 'bottom',
    captionText: '7-Day Streak Achieved! 🔥'
  },
  {
    id: '03-analytics',
    scenario: 'analyticsView',
    title: '30-Day Productivity Insights',
    subtitle: 'Track your improvement over time',
    description: 'Analytics view with upward trend',
    showAnalytics: true,
    waitForElement: '.analytics-container',
    captionPosition: 'top',
    captionText: '25% Improvement This Month 📈'
  },
  {
    id: '04-ai-coach',
    scenario: 'aiCoachActive',
    title: 'AI-Powered Coaching',
    subtitle: 'Get personalized productivity tips',
    description: 'AI Coach providing insights',
    showAICoach: true,
    waitForElement: '.ai-coach-message',
    captionPosition: 'bottom',
    captionText: 'Premium Feature: Personal AI Coach 🤖'
  },
  {
    id: '05-quick-entry',
    scenario: 'perfectDay',
    title: 'Lightning-Fast Task Entry',
    subtitle: 'Signal or Noise? One tap to decide',
    description: 'Task input interface',
    clickElement: '.add-task-button',
    waitForElement: '.task-input',
    highlight: '.task-buttons',
    captionPosition: 'center',
    captionText: 'Classify Tasks Instantly ⚡'
  },
  {
    id: '06-patterns',
    scenario: 'improvementStory',
    title: 'Discover Your Patterns',
    subtitle: 'Learn when you\'re most productive',
    description: 'Pattern insights view',
    showPatterns: true,
    waitForElement: '.pattern-insights',
    captionPosition: 'top',
    captionText: 'Peak Productivity: 9-11 AM 🌅'
  },
  {
    id: '07-dark-mode',
    scenario: 'perfectDay',
    title: 'Beautiful Dark Interface',
    subtitle: 'Easy on the eyes, focused on productivity',
    description: 'Full app in dark mode',
    waitForElement: '.app-container',
    captionPosition: 'none'
  },
  {
    id: '08-privacy',
    scenario: 'newUser',
    title: '100% Private',
    subtitle: 'Your data never leaves your device',
    description: 'Privacy-first approach',
    showPrivacyBadge: true,
    waitForElement: '.app-container',
    captionPosition: 'center',
    captionText: '🔒 No Cloud • No Tracking • No Ads'
  }
];

async function generateScreenshots() {
  // Create screenshot directories
  SCREENSHOT_CONFIGS.forEach(config => {
    const dir = path.join(__dirname, config.folder);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  console.log('🚀 Starting Signal/Noise screenshot generation...');

  const browser = await chromium.launch({
    headless: false // Set to true for production
  });

  for (const config of SCREENSHOT_CONFIGS) {
    console.log(`\n📱 Generating ${config.name} screenshots (${config.width}x${config.height})...`);

    for (const screenshot of SCREENSHOT_SCENARIOS) {
      const context = await browser.newContext({
        viewport: { width: config.width, height: config.height },
        deviceScaleFactor: config.deviceScaleFactor,
        colorScheme: 'dark'
      });

      const page = await context.newPage();

      try {
        // Load the app
        await page.goto('http://localhost:5176');
        await page.waitForTimeout(2000); // Wait for app to initialize

        // Inject mock data
        const mockData = mockDataScenarios[screenshot.scenario];
        await page.evaluate((data) => {
          // Store mock data in localStorage
          localStorage.setItem('signal_noise_data', JSON.stringify(data));
          localStorage.setItem('screenshot_mode', 'true');

          // Reload to apply mock data
          window.location.reload();
        }, mockData);

        await page.waitForTimeout(3000); // Wait for reload and render

        // Execute scenario-specific actions
        if (screenshot.clickElement) {
          const element = await page.$(screenshot.clickElement);
          if (element) {
            await element.click();
            await page.waitForTimeout(1000);
          }
        }

        if (screenshot.showAnalytics) {
          // Click analytics button or navigate to analytics view
          const analyticsBtn = await page.$('.analytics-button, [aria-label="Analytics"]');
          if (analyticsBtn) {
            await analyticsBtn.click();
            await page.waitForTimeout(1500);
          }
        }

        if (screenshot.showAICoach) {
          // Trigger AI coach display
          await page.evaluate(() => {
            // Show AI coach message
            const event = new CustomEvent('show-ai-coach', {
              detail: {
                message: "Great focus this morning! You're 2% above your target. Keep this momentum through lunch.",
                type: 'celebration'
              }
            });
            window.dispatchEvent(event);
          });
          await page.waitForTimeout(1500);
        }

        if (screenshot.showPatterns) {
          // Show pattern insights
          const patternsBtn = await page.$('.patterns-button, [aria-label="Patterns"]');
          if (patternsBtn) {
            await patternsBtn.click();
            await page.waitForTimeout(1500);
          }
        }

        // Wait for specific element if specified
        if (screenshot.waitForElement) {
          await page.waitForSelector(screenshot.waitForElement, { timeout: 5000 }).catch(() => {
            console.log(`⚠️ Element ${screenshot.waitForElement} not found, continuing...`);
          });
        }

        // Add marketing caption overlay if specified
        if (screenshot.captionPosition !== 'none' && screenshot.captionText) {
          await page.evaluate((caption) => {
            const overlay = document.createElement('div');
            overlay.style.cssText = `
              position: fixed;
              ${caption.position === 'top' ? 'top: 100px;' : ''}
              ${caption.position === 'bottom' ? 'bottom: 100px;' : ''}
              ${caption.position === 'center' ? 'top: 50%; transform: translateY(-50%);' : ''}
              left: 50%;
              transform: translateX(-50%) ${caption.position === 'center' ? 'translateY(-50%)' : ''};
              background: linear-gradient(135deg, #00ff88 0%, #00cc6a 100%);
              color: #000;
              padding: 20px 40px;
              border-radius: 50px;
              font-size: 32px;
              font-weight: 600;
              font-family: -apple-system, system-ui, sans-serif;
              box-shadow: 0 10px 40px rgba(0, 255, 136, 0.3);
              z-index: 10000;
              animation: pulse 2s ease-in-out infinite;
            `;
            overlay.textContent = caption.text;
            document.body.appendChild(overlay);

            // Add pulse animation
            const style = document.createElement('style');
            style.textContent = `
              @keyframes pulse {
                0%, 100% { transform: translateX(-50%) ${caption.position === 'center' ? 'translateY(-50%)' : ''} scale(1); }
                50% { transform: translateX(-50%) ${caption.position === 'center' ? 'translateY(-50%)' : ''} scale(1.05); }
              }
            `;
            document.head.appendChild(style);
          }, { position: screenshot.captionPosition, text: screenshot.captionText });

          await page.waitForTimeout(500); // Let animation start
        }

        // Add privacy badge for privacy screenshot
        if (screenshot.showPrivacyBadge) {
          await page.evaluate(() => {
            const badge = document.createElement('div');
            badge.style.cssText = `
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              background: rgba(0, 0, 0, 0.9);
              border: 3px solid #00ff88;
              color: #fff;
              padding: 60px;
              border-radius: 20px;
              text-align: center;
              z-index: 10000;
              backdrop-filter: blur(10px);
            `;
            badge.innerHTML = `
              <div style="font-size: 80px; margin-bottom: 20px;">🔒</div>
              <div style="font-size: 48px; font-weight: 300; margin-bottom: 20px;">100% Private</div>
              <div style="font-size: 32px; color: #00ff88;">No Cloud • No Tracking • No Ads</div>
              <div style="font-size: 24px; color: #999; margin-top: 20px;">Your data never leaves your device</div>
            `;
            document.body.appendChild(badge);
          });
          await page.waitForTimeout(500);
        }

        // Highlight element if specified
        if (screenshot.highlight) {
          await page.evaluate((selector) => {
            const element = document.querySelector(selector);
            if (element) {
              element.style.boxShadow = '0 0 0 4px #00ff88, 0 0 40px rgba(0, 255, 136, 0.5)';
              element.style.transition = 'all 0.3s ease';
              element.style.transform = 'scale(1.02)';
            }
          }, screenshot.highlight);
          await page.waitForTimeout(300);
        }

        // Take screenshot
        const screenshotPath = path.join(__dirname, config.folder, `${screenshot.id}-${screenshot.title.toLowerCase().replace(/\s+/g, '-')}.png`);
        await page.screenshot({
          path: screenshotPath,
          fullPage: false
        });

        console.log(`  ✅ ${screenshot.id} - ${screenshot.title}`);

      } catch (error) {
        console.error(`  ❌ Error generating ${screenshot.id}:`, error.message);
      } finally {
        await context.close();
      }
    }
  }

  await browser.close();
  console.log('\n🎉 Screenshot generation complete!');
  console.log('📁 Screenshots saved to:');
  SCREENSHOT_CONFIGS.forEach(config => {
    console.log(`  - ${config.folder}/`);
  });
}

// Feature graphic generator (1024x500)
async function generateFeatureGraphic() {
  console.log('\n🎨 Generating feature graphic...');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1024, height: 500 },
    deviceScaleFactor: 2
  });

  const page = await context.newPage();

  // Create a custom feature graphic
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          width: 1024px;
          height: 500px;
          background: linear-gradient(135deg, #000 0%, #111 50%, #000 100%);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 60px;
          font-family: -apple-system, system-ui, sans-serif;
          overflow: hidden;
          position: relative;
        }

        .noise-pattern {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          opacity: 0.03;
          background-image: repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,.1) 2px, rgba(255,255,255,.1) 4px);
        }

        .left-section {
          flex: 1;
          z-index: 2;
        }

        .app-icon {
          width: 80px;
          height: 80px;
          background: #00ff88;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          margin-bottom: 30px;
          box-shadow: 0 10px 40px rgba(0, 255, 136, 0.3);
        }

        .app-name {
          font-size: 56px;
          font-weight: 300;
          color: #fff;
          margin-bottom: 10px;
          letter-spacing: -1px;
        }

        .tagline {
          font-size: 24px;
          color: #00ff88;
          margin-bottom: 30px;
          font-weight: 400;
        }

        .description {
          font-size: 18px;
          color: #999;
          line-height: 1.5;
          max-width: 400px;
        }

        .right-section {
          display: flex;
          align-items: center;
          gap: 20px;
          z-index: 2;
        }

        .phone-mockup {
          width: 200px;
          height: 400px;
          background: #1a1a1a;
          border-radius: 30px;
          border: 3px solid #333;
          padding: 15px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          position: relative;
        }

        .phone-screen {
          width: 100%;
          height: 100%;
          background: #000;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .ratio-circle {
          width: 120px;
          height: 120px;
          border: 8px solid #00ff88;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          position: relative;
        }

        .ratio-text {
          font-size: 36px;
          color: #00ff88;
          font-weight: 100;
        }

        .stats {
          display: flex;
          gap: 30px;
          margin-top: 20px;
        }

        .stat {
          text-align: center;
        }

        .stat-value {
          font-size: 32px;
          color: #fff;
          font-weight: 100;
        }

        .stat-label {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-top: 5px;
        }

        .badge {
          position: absolute;
          top: -10px;
          right: -10px;
          background: linear-gradient(135deg, #FFD700, #FFA500);
          color: #000;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          transform: rotate(15deg);
        }
      </style>
    </head>
    <body>
      <div class="noise-pattern"></div>

      <div class="left-section">
        <div class="app-icon">S/N</div>
        <div class="app-name">Signal/Noise</div>
        <div class="tagline">Focus on what matters</div>
        <div class="description">
          Track your 80/20 productivity ratio.<br>
          Spend 80% on Signal, 20% on Noise.<br>
          Simple. Private. Powerful.
        </div>
      </div>

      <div class="right-section">
        <div class="phone-mockup">
          <div class="badge">NEW</div>
          <div class="phone-screen">
            <div class="ratio-circle">
              <div class="ratio-text">85%</div>
            </div>
            <div style="color: #666; font-size: 14px; margin-bottom: 10px;">Today's Focus</div>
            <div class="stats">
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
  `);

  await page.waitForTimeout(2000);

  const dir = path.join(__dirname, 'screenshots/feature-graphic');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  await page.screenshot({
    path: path.join(dir, 'feature-graphic.png'),
    fullPage: true
  });

  await browser.close();
  console.log('  ✅ Feature graphic generated');
}

// Run the screenshot generation
(async () => {
  try {
    // Check if dev server is running
    console.log('⚠️  Make sure your dev server is running (npm run dev)');
    console.log('Starting in 5 seconds...\n');
    await new Promise(resolve => setTimeout(resolve, 5000));

    await generateScreenshots();
    await generateFeatureGraphic();

    console.log('\n✨ All Play Store assets generated successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Review screenshots in screenshots/ folder');
    console.log('2. Select best 2-8 screenshots per device type');
    console.log('3. Upload to Google Play Console');
    console.log('4. Order screenshots with highest impact first');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
})();