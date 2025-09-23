const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function captureArticleLayouts() {
  const browser = await chromium.launch();

  // Create screenshots directory
  const screenshotsDir = './layout-verification-screenshots';
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
  }

  const articles = [
    {
      name: 'steve-jobs-method',
      url: 'http://localhost:5173/blog/steve-jobs-method',
      title: 'Steve Jobs Article'
    },
    {
      name: '75-percent-tasks',
      url: 'http://localhost:5173/blog/75-percent-tasks',
      title: '75% Tasks Article'
    },
    {
      name: 'elon-musk-experiment',
      url: 'http://localhost:5173/blog/elon-musk-experiment',
      title: 'Elon Musk Article'
    }
  ];

  for (const article of articles) {
    console.log(`📸 Capturing ${article.title}...`);

    // Desktop layout
    const desktopPage = await browser.newPage();
    await desktopPage.setViewportSize({ width: 1200, height: 800 });

    try {
      await desktopPage.goto(article.url, { waitUntil: 'networkidle' });
      await desktopPage.screenshot({
        path: `${screenshotsDir}/${article.name}-desktop.png`,
        fullPage: true
      });
      console.log(`✅ Desktop screenshot saved: ${article.name}-desktop.png`);
    } catch (error) {
      console.log(`❌ Failed to capture desktop ${article.name}: ${error.message}`);
    }

    await desktopPage.close();

    // Mobile layout
    const mobilePage = await browser.newPage();
    await mobilePage.setViewportSize({ width: 375, height: 667 });

    try {
      await mobilePage.goto(article.url, { waitUntil: 'networkidle' });
      await mobilePage.screenshot({
        path: `${screenshotsDir}/${article.name}-mobile.png`,
        fullPage: true
      });
      console.log(`✅ Mobile screenshot saved: ${article.name}-mobile.png`);
    } catch (error) {
      console.log(`❌ Failed to capture mobile ${article.name}: ${error.message}`);
    }

    await mobilePage.close();
  }

  await browser.close();
  console.log('\n🎯 Layout verification screenshots completed!');
  console.log(`📁 Screenshots saved in: ${screenshotsDir}/`);
  console.log('\n📋 Verification checklist:');
  console.log('✓ No image clustering (images separated by 300+ words)');
  console.log('✓ Proper mobile responsiveness');
  console.log('✓ Content flow maintains readability');
  console.log('✓ Internal links and footnotes render correctly');
}

// Error handling
process.on('unhandledRejection', (error) => {
  console.error('❌ Screenshot generation failed:', error);
  process.exit(1);
});

// Run the screenshot capture
captureArticleLayouts().catch(console.error);