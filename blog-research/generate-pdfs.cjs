#!/usr/bin/env node

/**
 * Generate PDFs from HTML downloadable templates
 * Uses Playwright to open HTML files and save as PDF
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const downloadablesDir = path.join(__dirname, 'article-11-three-things-productivity-system/downloadables');
const outputDir = path.join(__dirname, '../public/downloads/article-11');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const files = [
  {
    input: '01-daily-three-things-planner.html',
    output: 'Daily-Three-Things-Planner.pdf',
    format: 'A4',
    landscape: false
  },
  {
    input: '02-30-day-transformation-tracker.html',
    output: '30-Day-Transformation-Tracker.pdf',
    format: 'A4',
    landscape: true
  },
  {
    input: '03-task-categorization-worksheet.html',
    output: 'Task-Categorization-Worksheet.pdf',
    format: 'A4',
    landscape: false
  },
  {
    input: '04-weekly-strategic-planner.html',
    output: 'Weekly-Strategic-Planner.pdf',
    format: 'A4',
    landscape: false
  },
  {
    input: '05-delegation-decision-matrix.html',
    output: 'Delegation-Decision-Matrix.pdf',
    format: 'A4',
    landscape: false
  }
];

(async () => {
  console.log('🚀 Starting PDF generation...\n');

  const browser = await chromium.launch();
  const page = await browser.newPage();

  for (const file of files) {
    const inputPath = path.join(downloadablesDir, file.input);
    const outputPath = path.join(outputDir, file.output);

    console.log(`📄 Processing: ${file.input}`);
    console.log(`   → ${file.output}`);

    // Load HTML file
    await page.goto(`file://${inputPath}`, { waitUntil: 'networkidle' });

    // Generate PDF
    await page.pdf({
      path: outputPath,
      format: file.format,
      landscape: file.landscape,
      printBackground: true,
      margin: {
        top: '15mm',
        right: '15mm',
        bottom: '15mm',
        left: '15mm'
      }
    });

    const stats = fs.statSync(outputPath);
    const sizeKB = (stats.size / 1024).toFixed(1);
    console.log(`   ✅ Generated (${sizeKB} KB)\n`);
  }

  await browser.close();

  console.log('✨ All PDFs generated successfully!');
  console.log(`📂 Location: ${outputDir}`);
})();
