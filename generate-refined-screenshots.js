import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Jony Ive Design Principles Applied
const DESIGN_PRINCIPLES = {
  // 1. Simplicity: Remove everything unnecessary
  // 2. Clarity: Make the important obvious
  // 3. Deference: Content first, UI second
  // 4. Depth: Subtle layers create hierarchy
  // 5. Integrity: Honest representation of the product
};

// Play Store Best Practices
const SCREENSHOT_STRATEGY = {
  // 1. First 2 screenshots are most important (visible without scrolling)
  // 2. Show core value proposition immediately
  // 3. Use device frames sparingly (Google auto-adds them)
  // 4. Text should be readable at thumbnail size
  // 5. Show real UI with subtle enhancements
  // 6. Progressive disclosure of features
};

// Refined overlays with Jony Ive's feedback incorporated
const REFINED_OVERLAYS = {
  // ITERATION 1 FEEDBACK: "Too heavy, obscures the interface"
  // ITERATION 2: Lighter gradients, centered messaging

  hero: {
    // No overlay - pure interface speaks for itself
    html: null,
    description: 'Pure interface - the design is the message'
  },

  coreValue: {
    // Ultra-subtle gradient with centered value prop
    html: `
      <div style="
        position: fixed;
        inset: 0;
        background: linear-gradient(
          to bottom,
          rgba(10, 10, 10, 0) 0%,
          rgba(10, 10, 10, 0.2) 50%,
          rgba(10, 10, 10, 0) 100%
        );
        pointer-events: none;
        z-index: 998;
      "></div>
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        z-index: 999;
        pointer-events: none;
      ">
        <div style="
          padding: 16px 32px;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
        ">
          <div style="
            font-size: 20px;
            font-weight: 300;
            color: rgba(255, 255, 255, 0.95);
            font-family: -apple-system, system-ui, sans-serif;
            letter-spacing: 0.5px;
          ">
            Your focus, visualized
          </div>
        </div>
      </div>
    `,
    description: 'Centered value with interface visible'
  },

  streakCelebration: {
    // Minimalist achievement indicator
    html: `
      <div style="
        position: fixed;
        top: 120px;
        left: 50%;
        transform: translateX(-50%);
        text-align: center;
        z-index: 999;
        pointer-events: none;
      ">
        <div style="
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(0, 255, 136, 0.1);
          border: 1px solid rgba(0, 255, 136, 0.2);
          border-radius: 20px;
        ">
          <span style="
            font-size: 16px;
          ">🔥</span>
          <span style="
            font-size: 14px;
            font-weight: 400;
            color: #00ff88;
            font-family: -apple-system, system-ui, sans-serif;
            letter-spacing: 0.5px;
          ">7-day streak</span>
        </div>
      </div>
    `,
    description: 'Subtle achievement without disruption'
  },

  patternInsight: {
    // Bottom-aligned insight that doesn't block content
    html: `
      <div style="
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        text-align: center;
        z-index: 999;
        pointer-events: none;
      ">
        <div style="
          display: inline-block;
          padding: 12px 20px;
          background: rgba(17, 17, 17, 0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
        ">
          <div style="
            font-size: 13px;
            color: rgba(255, 255, 255, 0.7);
            font-family: -apple-system, system-ui, sans-serif;
          ">
            Peak productivity: <span style="color: #00ff88;">9-11 AM</span>
          </div>
        </div>
      </div>
    `,
    description: 'Insight placement that respects the interface'
  },

  transformation: {
    // Very subtle before/after indicator
    html: `
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        z-index: 999;
        pointer-events: none;
      ">
        <div style="
          padding: 20px 40px;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(30px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
        ">
          <div style="
            font-size: 14px;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.5);
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 12px;
            font-family: -apple-system, system-ui, sans-serif;
          ">
            Week 1 → Week 4
          </div>
          <div style="
            font-size: 36px;
            font-weight: 100;
            color: rgba(255, 255, 255, 0.95);
            font-family: -apple-system, system-ui, sans-serif;
          ">
            35% → 82%
          </div>
        </div>
      </div>
    `,
    description: 'Transformation story, centered and clear'
  },

  premiumValue: {
    // Foundation program, minimal and centered
    html: `
      <div style="
        position: fixed;
        bottom: 140px;
        left: 50%;
        transform: translateX(-50%);
        text-align: center;
        z-index: 999;
        pointer-events: none;
      ">
        <div style="
          padding: 10px 20px;
          background: rgba(0, 255, 136, 0.08);
          border: 1px solid rgba(0, 255, 136, 0.15);
          border-radius: 8px;
        ">
          <div style="
            font-size: 12px;
            font-weight: 500;
            color: #00ff88;
            font-family: -apple-system, system-ui, sans-serif;
            letter-spacing: 0.5px;
          ">
            Foundation Member #37 of 100
          </div>
        </div>
      </div>
    `,
    description: 'Exclusivity without ostentation'
  }
};

// Generate refined screenshots with multiple device formats
async function generateRefinedScreenshots() {
  console.log('\n🎨 Generating Refined Screenshots (Jony Ive Approved)\n');
  console.log('━'.repeat(60));
  console.log('Design Philosophy: Simplicity, Clarity, Deference');
  console.log('━'.repeat(60) + '\n');

  const browser = await chromium.launch({
    headless: false,
    args: ['--disable-blink-features=AutomationControlled']
  });

  // Device configurations
  const devices = [
    {
      name: 'iphone',
      viewport: { width: 1170, height: 2532 }, // iPhone 14 Pro
      deviceScaleFactor: 3,
      zoom: 1.35, // More zoom as requested
      folder: 'screenshots-refined-iphone'
    },
    {
      name: 'pixel',
      viewport: { width: 1080, height: 2400 }, // Pixel 7
      deviceScaleFactor: 2.5,
      zoom: 1.3,
      folder: 'screenshots-refined-android'
    },
    {
      name: 'ipad',
      viewport: { width: 2048, height: 2732 }, // iPad Pro 12.9"
      deviceScaleFactor: 2,
      zoom: 1.1,
      folder: 'screenshots-refined-tablet'
    }
  ];

  // Screenshot sequence (Play Store best practices)
  const screenshots = [
    {
      name: '01-hero',
      overlay: REFINED_OVERLAYS.hero,
      description: 'Clean interface, no distractions'
    },
    {
      name: '02-core-value',
      overlay: REFINED_OVERLAYS.coreValue,
      description: 'Value proposition, subtly presented'
    },
    {
      name: '03-streak',
      overlay: REFINED_OVERLAYS.streakCelebration,
      show30Day: false,
      description: 'Achievement system, minimal celebration'
    },
    {
      name: '04-insights',
      overlay: REFINED_OVERLAYS.patternInsight,
      show30Day: true,
      description: 'Data insights, information hierarchy'
    },
    {
      name: '05-transformation',
      overlay: REFINED_OVERLAYS.transformation,
      show30Day: true,
      description: 'Progress story, centered narrative'
    },
    {
      name: '06-foundation',
      overlay: REFINED_OVERLAYS.premiumValue,
      description: 'Premium offering, understated'
    }
  ];

  for (const device of devices) {
    console.log(`\n📱 Generating ${device.name.toUpperCase()} screenshots...`);

    const dir = path.join(__dirname, device.folder);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    for (const screenshot of screenshots) {
      const context = await browser.newContext({
        viewport: device.viewport,
        deviceScaleFactor: device.deviceScaleFactor,
        isMobile: device.name !== 'ipad',
        hasTouch: true,
        colorScheme: 'dark'
      });

      const page = await context.newPage();

      try {
        await page.goto('http://localhost:5176', { waitUntil: 'networkidle' });

        // Load Emma's data
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

        // Apply appropriate zoom for device
        await page.evaluate((zoom) => {
          document.body.style.zoom = zoom.toString();
        }, device.zoom);

        // Show 30-day overview if needed
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

        // Apply overlay if specified
        if (screenshot.overlay && screenshot.overlay.html) {
          await page.evaluate((html) => {
            const overlay = document.createElement('div');
            overlay.innerHTML = html;
            document.body.appendChild(overlay);
          }, screenshot.overlay.html);
          await page.waitForTimeout(300);
        }

        const filepath = path.join(dir, `${screenshot.name}.png`);
        await page.screenshot({ path: filepath, fullPage: false });

        console.log(`  ✅ ${screenshot.name}: ${screenshot.description}`);

      } catch (error) {
        console.error(`  ❌ Failed ${screenshot.name}: ${error.message}`);
      } finally {
        await context.close();
      }
    }
  }

  await browser.close();

  console.log('\n');
  console.log('━'.repeat(60));
  console.log('\n✨ Refined screenshots complete!');
  console.log('\n🎨 Jony Ive Design Review:');
  console.log('  • Simplicity: Interface speaks for itself');
  console.log('  • Clarity: Value propositions are centered and clear');
  console.log('  • Deference: UI visible through subtle overlays');
  console.log('  • Depth: Layered information hierarchy');
  console.log('  • Integrity: Honest representation of the product');
  console.log('\n📱 Device Coverage:');
  console.log('  • iPhone (1.35x zoom for optimal mobile view)');
  console.log('  • Android (Pixel-optimized dimensions)');
  console.log('  • iPad (Tablet layout preserved)');
  console.log('\n');
}

// Emma's data generator
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

    // Week 2: Balance
    { day: -18, signals: ['User story writing', 'Product metrics review'], noise: ['Team sync', 'Emails', 'Slack'] },
    { day: -17, signals: ['A/B test planning', 'Design review'], noise: ['Status updates', 'Messages', 'Coffee chat'] },
    { day: -16, signals: ['Competitor analysis', 'Feature specs'], noise: ['Email threads', 'Notifications'] },
    { day: -15, signals: ['Customer interviews', 'Roadmap update', 'KPI review'], noise: ['Slack', 'Random meeting'] },
    { day: -14, signals: ['Sprint review', 'Backlog grooming'], noise: ['Team chat', 'Email cleanup'] },
    { day: -13, signals: ['Product strategy'], noise: ['Weekend planning'] },
    { day: -12, signals: [], noise: ['Email check', 'Week prep'] },

    // Week 3: Rhythm
    { day: -11, signals: ['Feature launch prep', 'User testing', 'Metrics dashboard'], noise: ['Morning email', 'Team sync'] },
    { day: -10, signals: ['Stakeholder presentation', 'Product demo', 'Analytics review'], noise: ['Quick Slack check'] },
    { day: -9, signals: ['Customer success sync', 'Feature prioritization', 'Tech debt review'], noise: ['Status update'] },
    { day: -8, signals: ['User research synthesis', 'Roadmap planning', 'Design sprint'], noise: ['Email batch'] },
    { day: -7, signals: ['Product review', 'Team 1:1s', 'Strategy doc', 'Beta feedback'], noise: ['Messages'] },
    { day: -6, signals: ['Market analysis', 'Feature specs'], noise: [] },
    { day: -5, signals: ['Product vision work'], noise: ['Quick email check'] },

    // Week 4: Mastery
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

// Run with iterations
(async () => {
  console.log('Starting in 3 seconds...\n');
  await new Promise(resolve => setTimeout(resolve, 3000));

  console.log('🎨 ITERATION 1: Initial Design\n');
  await generateRefinedScreenshots();

  console.log('\n💭 Jony Ive Feedback Session 1:');
  console.log('"The overlays are still competing with the interface.');
  console.log(' Make them whisper, not shout. Center everything.');
  console.log(' Remove any element that doesn\'t add clarity."\n');

  // In real scenario, we'd adjust based on feedback and run again
  // For now, the overlays are already refined based on these principles
})();