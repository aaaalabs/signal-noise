import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1200, height: 800 }
  });
  const page = await context.newPage();

  try {
    // Screenshot 1: Compound Effect Chart
    console.log('Taking screenshot of Compound Effect Chart...');
    const compoundPath = path.resolve(__dirname, 'Compound-Effect-Chart.html');
    await page.goto(`file://${compoundPath}`);
    await page.waitForTimeout(1000); // Wait for Chart.js to render
    await page.screenshot({
      path: path.resolve(__dirname, 'screenshots/compound-effect-chart.jpg'),
      type: 'jpeg',
      quality: 90,
      fullPage: false
    });
    console.log('✅ Compound Effect Chart screenshot saved');

    // Screenshot 2: Three Levels Pyramid
    console.log('Taking screenshot of Three Levels Pyramid...');
    const pyramidPath = path.resolve(__dirname, 'Three-Levels-Pyramid.html');
    await page.goto(`file://${pyramidPath}`);
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.resolve(__dirname, 'screenshots/pyramid-comparison.jpg'),
      type: 'jpeg',
      quality: 90,
      fullPage: false
    });
    console.log('✅ Pyramid Comparison screenshot saved');

  } catch (error) {
    console.error('Error taking screenshots:', error);
  } finally {
    await browser.close();
    console.log('\n🎉 Both screenshots complete!');
    console.log('📁 Saved to: blog-research/infographic-generators/screenshots/');
  }
})();
