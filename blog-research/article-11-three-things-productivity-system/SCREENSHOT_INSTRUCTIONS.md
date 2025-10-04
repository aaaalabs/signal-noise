# Screenshot Instructions for Infographics

## How to Generate Screenshots from HTML Files

### Step 1: Open HTML Files in Browser

Navigate to the infographic generators:
```bash
cd blog-research/infographic-generators/
```

Open each file in Chrome/Firefox:
- `Three-Levels-Pyramid.html`
- `Compound-Effect-Chart.html`
- `Time-Blocking-Template.html`
- `Context-Switching-Cost.html`

### Step 2: Screenshot at Correct Dimensions

#### Three-Levels-Pyramid.html
- **Dimensions:** 1200×800px
- **Browser window:** Set to exactly 1200×800
- **Zoom:** 100%
- **Screenshot:** Full page capture
- **Save as:** `three-levels-pyramid.png`

#### Compound-Effect-Chart.html
- **Dimensions:** 1200×600px
- **Browser window:** Set to exactly 1200×600
- **Zoom:** 100%
- **Wait:** Chart animation to complete (~2 seconds)
- **Screenshot:** Full page capture
- **Save as:** `compound-effect-chart.png`

#### Time-Blocking-Template.html
- **Dimensions:** 800×1000px
- **Browser window:** Set to exactly 800×1000
- **Zoom:** 100%
- **Screenshot:** Full page capture
- **Save as:** `time-blocking-template.png`

#### Context-Switching-Cost.html
- **Dimensions:** 1200×800px
- **Browser window:** Set to exactly 1200×800
- **Zoom:** 100%
- **Screenshot:** Full page capture
- **Save as:** `context-switching-cost.png`

### Step 3: Optimize Images

Using ImageMagick or online tools:

```bash
# Convert to WebP (modern browsers)
magick three-levels-pyramid.png -quality 85 three-levels-pyramid.webp
magick compound-effect-chart.png -quality 85 compound-effect-chart.webp
magick time-blocking-template.png -quality 85 time-blocking-template.webp
magick context-switching-cost.png -quality 85 context-switching-cost.webp

# Create JPG fallback (compressed)
magick three-levels-pyramid.png -quality 80 -resize 1200x800 three-levels-pyramid.jpg
magick compound-effect-chart.png -quality 80 -resize 1200x600 compound-effect-chart.jpg
magick time-blocking-template.png -quality 80 -resize 800x1000 time-blocking-template.jpg
magick context-switching-cost.png -quality 80 -resize 1200x800 context-switching-cost.jpg
```

### Step 4: Verify File Sizes

Target: <200KB per image

Check sizes:
```bash
ls -lh *.webp *.jpg
```

If over 200KB, reduce quality:
```bash
magick input.png -quality 70 output.webp
```

### Step 5: Move to Images Folder

```bash
mv *.webp *.jpg blog-research/article-11-three-things-productivity-system/images/
```

## Alternative: Automated Screenshot with Playwright

If you have Node.js installed:

```javascript
// screenshot-infographics.js
const playwright = require('playwright');

(async () => {
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();

  // Three Levels Pyramid
  await page.setViewportSize({ width: 1200, height: 800 });
  await page.goto('file:///path/to/Three-Levels-Pyramid.html');
  await page.screenshot({ path: 'three-levels-pyramid.png' });

  // Compound Effect Chart
  await page.setViewportSize({ width: 1200, height: 600 });
  await page.goto('file:///path/to/Compound-Effect-Chart.html');
  await page.waitForTimeout(2000); // Wait for animation
  await page.screenshot({ path: 'compound-effect-chart.png' });

  // Time Blocking Template
  await page.setViewportSize({ width: 800, height: 1000 });
  await page.goto('file:///path/to/Time-Blocking-Template.html');
  await page.screenshot({ path: 'time-blocking-template.png' });

  // Context Switching Cost
  await page.setViewportSize({ width: 1200, height: 800 });
  await page.goto('file:///path/to/Context-Switching-Cost.html');
  await page.screenshot({ path: 'context-switching-cost.png' });

  await browser.close();
})();
```

Run:
```bash
npm install playwright
node screenshot-infographics.js
```

## Quality Checklist

Before finalizing screenshots:
- [ ] All text is readable
- [ ] Colors are accurate (not washed out)
- [ ] No browser UI elements visible
- [ ] Charts/animations fully rendered
- [ ] File size <200KB
- [ ] Both WebP and JPG formats created
- [ ] Images saved in correct folder
