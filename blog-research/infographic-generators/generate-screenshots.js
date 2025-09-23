import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Jony Ive Principle: Perfect execution through attention to detail
 * Generate pixel-perfect infographic screenshots with mathematical precision
 */

const infographics = [
  {
    name: '80-20-signal-noise-circle',
    htmlFile: 'signal-noise-80-20-circle.html',
    description: '80/20 Signal vs Noise Circle Visualization',
    aspectRatios: [
      { name: 'square', width: 800, height: 800 },
      { name: 'wide', width: 1200, height: 800 },
      { name: 'standard', width: 1000, height: 600 },
      { name: 'hero', width: 1400, height: 600 }
    ]
  },
  {
    name: 'task-value-distribution',
    htmlFile: 'task-value-distribution-chart.html',
    description: 'Task Value Distribution Chart (75% vs 25%)',
    aspectRatios: [
      { name: 'wide', width: 1200, height: 800 },
      { name: 'standard', width: 1000, height: 600 },
      { name: 'banner', width: 1400, height: 500 }
    ]
  },
  {
    name: '100-percent-signal',
    htmlFile: '100-percent-signal-indicator.html',
    description: '100% Signal Achievement Indicator',
    aspectRatios: [
      { name: 'square', width: 600, height: 600 },
      { name: 'standard', width: 800, height: 600 },
      { name: 'compact', width: 400, height: 400 }
    ]
  },
  {
    name: 'pareto-mathematical-proof',
    htmlFile: 'pareto-mathematical-proof.html',
    description: 'Pareto Distribution Mathematical Curve',
    aspectRatios: [
      { name: 'wide', width: 1200, height: 800 },
      { name: 'standard', width: 1000, height: 700 },
      { name: 'academic', width: 1000, height: 800 }
    ]
  },
  {
    name: 'signal-noise-waveform',
    htmlFile: 'signal-noise-waveform.html',
    description: 'Information Theory Signal vs Noise Waveform',
    aspectRatios: [
      { name: 'wide', width: 1200, height: 600 },
      { name: 'standard', width: 1000, height: 500 },
      { name: 'banner', width: 1400, height: 600 }
    ]
  },
  {
    name: 'productivity-before-after',
    htmlFile: 'productivity-before-after.html',
    description: '90-Day Transformation Before vs After',
    aspectRatios: [
      { name: 'wide', width: 1200, height: 800 },
      { name: 'standard', width: 1000, height: 600 },
      { name: 'comparison', width: 1400, height: 700 }
    ]
  },
  {
    name: 'daily-signal-dashboard',
    htmlFile: 'daily-signal-dashboard.html',
    description: 'Daily Signal Ratio Dashboard UI',
    aspectRatios: [
      { name: 'square', width: 800, height: 800 },
      { name: 'standard', width: 1000, height: 700 },
      { name: 'mobile', width: 600, height: 800 }
    ]
  },
  {
    name: 'focus-vs-distraction',
    htmlFile: 'focus-vs-distraction.html',
    description: 'Focus vs Distraction Attention Economy',
    aspectRatios: [
      { name: 'wide', width: 1200, height: 800 },
      { name: 'standard', width: 1000, height: 600 },
      { name: 'comparison', width: 1400, height: 800 }
    ]
  },
  {
    name: 'founder-journey-timeline',
    htmlFile: 'founder-journey-timeline.html',
    description: 'Founder Journey from Crisis to App',
    aspectRatios: [
      { name: 'timeline', width: 1400, height: 600 },
      { name: 'standard', width: 1200, height: 700 },
      { name: 'wide', width: 1600, height: 800 }
    ]
  },
  {
    name: 'jobs-musk-comparison',
    htmlFile: 'steve-jobs-elon-comparison.html',
    description: 'Steve Jobs vs Elon Musk Methodology Comparison',
    aspectRatios: [
      { name: 'comparison', width: 1200, height: 800 },
      { name: 'wide', width: 1400, height: 900 },
      { name: 'standard', width: 1000, height: 700 }
    ]
  }
];

async function generateScreenshots() {
  console.log('🎯 Starting infographic screenshot generation...');
  console.log('Jony Ive Principle: Perfect execution through attention to detail\n');

  // Launch browser with optimal settings for screenshot quality
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--font-render-hinting=none', // Prevent font hinting artifacts
      '--disable-font-subpixel-positioning',
      '--disable-gpu-rasterization'
    ]
  });

  const context = await browser.newContext({
    deviceScaleFactor: 2, // Retina/high-DPI screenshots
    // Set to dark theme to match Signal/Noise app
    colorScheme: 'dark'
  });

  try {
    for (const infographic of infographics) {
      console.log(`📊 Processing: ${infographic.description}`);

      const htmlFilePath = path.join(__dirname, infographic.htmlFile);
      const htmlExists = await fs.access(htmlFilePath).then(() => true).catch(() => false);

      if (!htmlExists) {
        console.log(`   ❌ HTML file not found: ${htmlFilePath}`);
        continue;
      }

      // Create output directory for this infographic
      const outputDir = path.join(__dirname, '..', 'generated-infographics', infographic.name);
      await fs.mkdir(outputDir, { recursive: true });

      const page = await context.newPage();

      try {
        // Load HTML file with proper file:// protocol
        await page.goto(`file://${htmlFilePath}`, {
          waitUntil: 'networkidle' // Wait for any fonts or resources to load
        });

        // Wait for any JavaScript calculations to complete
        await page.waitForTimeout(1000);

        // Generate screenshots for each aspect ratio
        for (const ratio of infographic.aspectRatios) {
          console.log(`   📷 Capturing ${ratio.name} (${ratio.width}x${ratio.height})`);

          // Set viewport to exact dimensions
          await page.setViewportSize({
            width: ratio.width,
            height: ratio.height
          });

          // Wait for reflow
          await page.waitForTimeout(500);

          // Capture screenshot with maximum quality
          const screenshotPath = path.join(outputDir, `${infographic.name}-${ratio.name}.png`);
          await page.screenshot({
            path: screenshotPath,
            type: 'png',
            clip: {
              x: 0,
              y: 0,
              width: ratio.width,
              height: ratio.height
            },
            omitBackground: false // Keep the black background
          });

          // Also generate WebP version for web optimization
          const webpPath = path.join(outputDir, `${infographic.name}-${ratio.name}.webp`);
          await page.screenshot({
            path: webpPath,
            type: 'png', // Generate PNG first, we'll convert to WebP
            clip: {
              x: 0,
              y: 0,
              width: ratio.width,
              height: ratio.height
            },
            omitBackground: false
          });

          console.log(`   ✅ Generated: ${ratio.name} variant`);
        }

        await page.close();
        console.log(`   🎯 Completed: ${infographic.description}\n`);

      } catch (error) {
        console.error(`   ❌ Error processing ${infographic.name}:`, error.message);
        await page.close();
      }
    }

  } catch (error) {
    console.error('❌ Fatal error during screenshot generation:', error);
  } finally {
    await browser.close();
  }

  console.log('🏆 Screenshot generation complete!');
  console.log('\nGenerated files:');

  // List all generated files
  try {
    const generatedDir = path.join(__dirname, '..', 'generated-infographics');
    const subdirs = await fs.readdir(generatedDir);

    for (const subdir of subdirs) {
      const subdirPath = path.join(generatedDir, subdir);
      const files = await fs.readdir(subdirPath);
      console.log(`\n📁 ${subdir}:`);
      files.forEach(file => {
        console.log(`   📷 ${file}`);
      });
    }
  } catch (error) {
    console.log('Files generated but listing failed:', error.message);
  }
}

// Execute with error handling
generateScreenshots().catch(error => {
  console.error('❌ Screenshot generation failed:', error);
  process.exit(1);
});

export { generateScreenshots };