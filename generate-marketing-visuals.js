import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Alex Hormozi meets Jony Ive: Value-driven minimalism
const MARKETING_OVERLAYS = {
  // 1. Pain Agitation: What founders struggle with
  painPoint: {
    html: `
      <div style="
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(10px);
        z-index: 999;
      "></div>
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        z-index: 1000;
      ">
        <div style="
          font-size: 72px;
          font-weight: 100;
          color: rgba(255, 255, 255, 0.95);
          letter-spacing: -2px;
          margin-bottom: 24px;
          font-family: -apple-system, system-ui, sans-serif;
        ">
          12 hours working.<br/>
          2 hours of progress.
        </div>
        <div style="
          font-size: 24px;
          font-weight: 300;
          color: rgba(0, 255, 136, 0.9);
          letter-spacing: 0.5px;
        ">
          Sound familiar?
        </div>
      </div>
    `
  },

  // 2. Dream State: What they really want
  dreamOutcome: {
    html: `
      <div style="
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(10px);
        z-index: 999;
      "></div>
      <div style="
        position: fixed;
        top: 40%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        z-index: 1000;
      ">
        <div style="
          font-size: 48px;
          font-weight: 100;
          color: #00ff88;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 32px;
          font-family: -apple-system, system-ui, sans-serif;
        ">
          FLOW STATE
        </div>
        <div style="
          font-size: 144px;
          font-weight: 100;
          color: rgba(255, 255, 255, 0.95);
          letter-spacing: -4px;
          margin: 32px 0;
        ">
          4 hours.
        </div>
        <div style="
          font-size: 28px;
          font-weight: 300;
          color: rgba(255, 255, 255, 0.7);
          letter-spacing: 1px;
        ">
          Full day's output.
        </div>
      </div>
      <div style="
        position: fixed;
        bottom: 60px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 16px;
        color: rgba(0, 255, 136, 0.6);
        font-family: -apple-system, system-ui, sans-serif;
      ">
        The 80/20 principle, perfected.
      </div>
    `
  },

  // 3. Social Proof: Foundation members
  socialProof: {
    html: `
      <div style="
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(10px);
        z-index: 999;
      "></div>
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        z-index: 1000;
        max-width: 400px;
      ">
        <div style="
          font-size: 20px;
          font-weight: 500;
          color: #00ff88;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 24px;
          font-family: -apple-system, system-ui, sans-serif;
        ">
          Foundation Member #037
        </div>
        <div style="
          font-size: 36px;
          font-weight: 100;
          color: rgba(255, 255, 255, 0.95);
          line-height: 1.4;
          margin-bottom: 32px;
          letter-spacing: -0.5px;
        ">
          "Finally, I can see exactly<br/>
          where my time goes.<br/>
          My focus 3x'd in a week."
        </div>
        <div style="
          font-size: 16px;
          font-weight: 300;
          color: rgba(255, 255, 255, 0.5);
        ">
          — Alex, Startup Founder
        </div>
      </div>
      <div style="
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        padding: 12px 24px;
        background: rgba(0, 255, 136, 0.1);
        border: 1px solid rgba(0, 255, 136, 0.3);
        border-radius: 24px;
        font-size: 14px;
        color: #00ff88;
        font-family: -apple-system, system-ui, sans-serif;
      ">
        63 of 100 Foundation spots remain
      </div>
    `
  },

  // 4. Time Value: What's your hour worth?
  timeValue: {
    html: `
      <div style="
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(10px);
        z-index: 999;
      "></div>
      <div style="
        position: fixed;
        top: 45%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        z-index: 1000;
      ">
        <div style="
          font-size: 24px;
          font-weight: 300;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 24px;
          font-family: -apple-system, system-ui, sans-serif;
        ">
          Your hourly value:
        </div>
        <div style="
          font-size: 96px;
          font-weight: 100;
          color: rgba(255, 255, 255, 0.95);
          letter-spacing: -2px;
          margin-bottom: 32px;
        ">
          €250/hour
        </div>
        <div style="
          font-size: 20px;
          font-weight: 300;
          color: rgba(255, 255, 255, 0.5);
          line-height: 1.6;
        ">
          You waste 3 hours daily on noise.<br/>
          That's <span style="color: #ff4444;">€15,000/month</span> lost.
        </div>
        <div style="
          margin-top: 48px;
          font-size: 28px;
          font-weight: 300;
          color: #00ff88;
        ">
          Fix it for €29. Once.
        </div>
      </div>
    `
  },

  // 5. Transformation: Before/After split
  transformation: {
    html: `
      <div style="
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(10px);
        z-index: 999;
      "></div>
      <div style="
        position: fixed;
        inset: 0;
        display: flex;
        z-index: 1000;
      ">
        <div style="
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: rgba(255, 68, 68, 0.05);
          border-right: 1px solid rgba(255, 255, 255, 0.1);
        ">
          <div style="
            font-size: 18px;
            font-weight: 500;
            color: #ff4444;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 24px;
            font-family: -apple-system, system-ui, sans-serif;
          ">
            Before
          </div>
          <div style="
            font-size: 72px;
            font-weight: 100;
            color: rgba(255, 255, 255, 0.9);
            margin-bottom: 16px;
          ">
            35%
          </div>
          <div style="
            font-size: 16px;
            color: rgba(255, 255, 255, 0.5);
            text-align: center;
            padding: 0 20px;
            line-height: 1.4;
          ">
            Busy all day<br/>
            Nothing done
          </div>
        </div>
        <div style="
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: rgba(0, 255, 136, 0.05);
        ">
          <div style="
            font-size: 18px;
            font-weight: 500;
            color: #00ff88;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 24px;
            font-family: -apple-system, system-ui, sans-serif;
          ">
            After 7 Days
          </div>
          <div style="
            font-size: 72px;
            font-weight: 100;
            color: #00ff88;
            margin-bottom: 16px;
          ">
            82%
          </div>
          <div style="
            font-size: 16px;
            color: rgba(255, 255, 255, 0.5);
            text-align: center;
            padding: 0 20px;
            line-height: 1.4;
          ">
            Deep work<br/>
            Real progress
          </div>
        </div>
      </div>
    `
  },

  // 6. The Promise: What we guarantee
  promise: {
    html: `
      <div style="
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(10px);
        z-index: 999;
      "></div>
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        z-index: 1000;
        max-width: 500px;
      ">
        <div style="
          font-size: 64px;
          font-weight: 100;
          color: rgba(255, 255, 255, 0.95);
          margin-bottom: 40px;
          line-height: 1.2;
          letter-spacing: -2px;
          font-family: -apple-system, system-ui, sans-serif;
        ">
          Know exactly<br/>
          what matters.<br/>
          <span style="color: #00ff88;">Every day.</span>
        </div>
        <div style="
          font-size: 18px;
          font-weight: 300;
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.6;
        ">
          No complex systems. No courses.<br/>
          Just one number that changes everything.
        </div>
      </div>
      <div style="
        position: fixed;
        bottom: 60px;
        left: 50%;
        transform: translateX(-50%);
        width: 300px;
        height: 1px;
        background: linear-gradient(90deg, transparent, #00ff88, transparent);
      "></div>
    `
  },

  // 7. Exclusivity: Foundation program
  exclusivity: {
    html: `
      <div style="
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(10px);
        z-index: 999;
      "></div>
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        z-index: 1000;
      ">
        <div style="
          display: inline-block;
          padding: 8px 20px;
          background: rgba(0, 255, 136, 0.1);
          border: 1px solid rgba(0, 255, 136, 0.3);
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          color: #00ff88;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 32px;
          font-family: -apple-system, system-ui, sans-serif;
        ">
          Foundation Program
        </div>
        <div style="
          font-size: 56px;
          font-weight: 100;
          color: rgba(255, 255, 255, 0.95);
          margin-bottom: 24px;
          letter-spacing: -1px;
        ">
          First 100 founders
        </div>
        <div style="
          font-size: 20px;
          font-weight: 300;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 40px;
          line-height: 1.5;
        ">
          Lifetime access. No subscription.<br/>
          Shape the product with us.
        </div>
        <div style="
          font-size: 32px;
          font-weight: 100;
          color: #00ff88;
          margin-bottom: 16px;
        ">
          €29 <span style="font-size: 20px; color: rgba(255, 255, 255, 0.4); text-decoration: line-through;">€49</span>
        </div>
        <div style="
          font-size: 14px;
          color: rgba(255, 255, 255, 0.4);
        ">
          Then €49 for everyone else.
        </div>
      </div>
    `
  }
};

// Generate marketing screenshots with Emma's data
async function generateMarketingVisuals() {
  console.log('\n🚀 Generating High-Converting Marketing Visuals\n');
  console.log('━'.repeat(60));
  console.log('Strategy: Alex Hormozi value × Jony Ive aesthetics');
  console.log('━'.repeat(60) + '\n');

  const dir = path.join(__dirname, 'screenshots-marketing');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const browser = await chromium.launch({
    headless: false,
    args: ['--disable-blink-features=AutomationControlled']
  });

  const screenshots = [
    {
      name: '01-pain-agitation',
      overlay: MARKETING_OVERLAYS.painPoint,
      description: 'Pain point: Working hard but not smart'
    },
    {
      name: '02-dream-outcome',
      overlay: MARKETING_OVERLAYS.dreamOutcome,
      description: 'Dream state: Flow state productivity'
    },
    {
      name: '03-social-proof',
      overlay: MARKETING_OVERLAYS.socialProof,
      description: 'Social proof: Foundation member testimonial'
    },
    {
      name: '04-time-value',
      overlay: MARKETING_OVERLAYS.timeValue,
      description: 'ROI: Your time is worth more'
    },
    {
      name: '05-transformation',
      overlay: MARKETING_OVERLAYS.transformation,
      description: 'Before/After: Clear transformation'
    },
    {
      name: '06-promise',
      overlay: MARKETING_OVERLAYS.promise,
      description: 'The promise: Clarity every day'
    },
    {
      name: '07-exclusivity',
      overlay: MARKETING_OVERLAYS.exclusivity,
      description: 'Exclusivity: Foundation program'
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

      // Use Emma's data
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

      // Apply zoom for mobile
      await page.evaluate(() => {
        document.body.style.zoom = '1.25';
      });

      // Special handling for certain overlays
      if (screenshot.name.includes('transformation') || screenshot.name.includes('pain')) {
        // Show the 30-day overview for context
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

      // Add marketing overlay
      if (screenshot.overlay) {
        await page.evaluate((html) => {
          const overlay = document.createElement('div');
          overlay.style.cssText = 'position: fixed; inset: 0; z-index: 9999;';
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

  console.log('\n🎯 Marketing visuals complete!');
  console.log('\nValue propositions covered:');
  console.log('  • Pain agitation (busy but not productive)');
  console.log('  • Dream outcomes (flow state, 10x productivity)');
  console.log('  • Social proof (Foundation member success)');
  console.log('  • ROI calculation (time value proposition)');
  console.log('  • Transformation (before/after clarity)');
  console.log('  • Core promise (daily clarity)');
  console.log('  • Exclusivity (Foundation program scarcity)\n');
}

// Emma's data (reuse from previous)
function generateEmmaCompleteData() {
  const tasks = [];
  const now = new Date();

  // Emma's 26-day journey
  const dayPlans = [
    // Week 1: Chaos mode
    { day: -25, signals: ['Product roadmap review'], noise: ['Email cleanup', 'Slack messages', 'Random meetings', 'Social media check', 'News reading'] },
    { day: -24, signals: ['User interviews'], noise: ['Team chat', 'LinkedIn scrolling', 'Coffee chat', 'Email threads'] },
    { day: -23, signals: ['Feature prioritization', 'Sprint planning'], noise: ['Notifications', 'Inbox zero attempt', 'Twitter', 'News'] },
    { day: -22, signals: ['Customer feedback analysis'], noise: ['Slack overflow', 'Meeting prep', 'Email chaos', 'Social media'] },
    { day: -21, signals: ['Wireframe review', 'Stakeholder meeting'], noise: ['Messages', 'Random calls', 'Email'] },
    { day: -20, signals: [], noise: ['Weekend emails', 'Planning for week'] },
    { day: -19, signals: ['Market research'], noise: ['Sunday prep', 'Email cleanup'] },

    // Week 2: Finding balance
    { day: -18, signals: ['User story writing', 'Product metrics review'], noise: ['Team sync', 'Emails', 'Slack'] },
    { day: -17, signals: ['A/B test planning', 'Design review'], noise: ['Status updates', 'Messages', 'Coffee chat'] },
    { day: -16, signals: ['Competitor analysis', 'Feature specs'], noise: ['Email threads', 'Notifications'] },
    { day: -15, signals: ['Customer interviews', 'Roadmap update', 'KPI review'], noise: ['Slack', 'Random meeting'] },
    { day: -14, signals: ['Sprint review', 'Backlog grooming'], noise: ['Team chat', 'Email cleanup'] },
    { day: -13, signals: ['Product strategy'], noise: ['Weekend planning'] },
    { day: -12, signals: [], noise: ['Email check', 'Week prep'] },

    // Week 3: Finding rhythm
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

  // Generate tasks
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

// Run
(async () => {
  console.log('Starting in 3 seconds...\n');
  await new Promise(resolve => setTimeout(resolve, 3000));
  await generateMarketingVisuals();
})();