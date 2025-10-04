const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const infographics = [
    {
      file: 'Time-Blocking-Template.html',
      output: 'time-blocking-template.jpg',
      width: 800,
      height: 1680
    },
    {
      file: 'Three-Levels-Pyramid.html',
      output: 'three-levels-pyramid.jpg',
      width: 1200,
      height: 850
    },
    {
      file: 'Compound-Effect-Chart.html',
      output: 'compound-effect-chart.jpg',
      width: 1200,
      height: 1361
    }
  ];

  for (const info of infographics) {
    console.log(`📸 Capturing ${info.file} at ${info.width}×${info.height}px`);
    
    await page.setViewportSize({ width: info.width, height: info.height });
    await page.goto(`file://${__dirname}/${info.file}`);
    
    // Wait for any animations
    await page.waitForTimeout(2000);
    
    // Full page screenshot
    await page.screenshot({
      path: `../../public/blog-images/article-11/${info.output}`,
      type: 'jpeg',
      quality: 80,
      fullPage: true
    });
    
    console.log(`   ✅ Saved to public/blog-images/article-11/${info.output}`);
  }

  await browser.close();
  console.log('\n✨ All infographics re-captured at correct dimensions!');
})();
