import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generateFeatureGraphic() {
  console.log('\n🎨 Generating Play Store Feature Graphic\n');
  console.log('━'.repeat(60));
  console.log('Dimensions: 1024x500 (Google Play Store requirement)');
  console.log('━'.repeat(60) + '\n');

  const browser = await chromium.launch({
    headless: true, // Can be headless for static HTML
  });

  const context = await browser.newContext({
    viewport: { width: 1024, height: 500 },
    deviceScaleFactor: 2, // High quality
    colorScheme: 'dark'
  });

  const page = await context.newPage();

  try {
    // Load the HTML file
    const htmlPath = `file://${path.join(__dirname, 'feature-graphic.html')}`;
    await page.goto(htmlPath);

    // Wait for animations to settle
    await page.waitForTimeout(2000);

    // Create directory if it doesn't exist
    const dir = path.join(__dirname, 'play-store-assets');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Capture the feature graphic
    const filepath = path.join(dir, 'feature-graphic-1024x500.png');
    await page.screenshot({
      path: filepath,
      fullPage: false,
      clip: { x: 0, y: 0, width: 1024, height: 500 }
    });

    console.log(`✅ Feature graphic saved to: ${filepath}`);
    console.log('\n📊 Asset specifications:');
    console.log('  • Dimensions: 1024x500 pixels');
    console.log('  • Format: PNG');
    console.log('  • DPI: 2x for high quality');
    console.log('  • Style: Minimalist with Jony Ive aesthetics');

  } catch (error) {
    console.error('❌ Error generating feature graphic:', error);
  } finally {
    await browser.close();
  }

  console.log('\n✨ Feature graphic ready for Play Store upload!\n');
}

// Run
(async () => {
  await generateFeatureGraphic();
})();