// Playwright test runner for Signal/Noise email templates
// Tests all 3 iterations across mobile, tablet, and desktop viewports

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Viewport configurations
const viewports = [
    { name: 'mobile', width: 375, height: 667, device: 'iPhone SE' },
    { name: 'tablet', width: 768, height: 1024, device: 'iPad' },
    { name: 'desktop', width: 1920, height: 1080, device: 'Desktop' }
];

// Template configurations
const templates = [
    { name: 'magic-link-v1', file: 'magic-link-v1.html', type: 'Magic Link' },
    { name: 'magic-link-v2', file: 'magic-link-v2.html', type: 'Magic Link' },
    { name: 'magic-link-v3', file: 'magic-link-v3.html', type: 'Magic Link' },
    { name: 'welcome-v1', file: 'welcome-v1.html', type: 'Welcome' },
    { name: 'welcome-v2', file: 'welcome-v2.html', type: 'Welcome' },
    { name: 'welcome-v3', file: 'welcome-v3.html', type: 'Welcome' }
];

// Test data for template injection
const testData = {
    VERIFY_URL: 'https://signal-noise.app/verify/test-token-123',
    TIER_NAME: 'Premium Member',
    FIRST_NAME: 'Alex'
};

async function injectTestData(htmlContent) {
    let injected = htmlContent;

    // Replace template variables
    Object.entries(testData).forEach(([key, value]) => {
        const placeholder = `{{${key}}}`;
        injected = injected.replaceAll(placeholder, value);
    });

    return injected;
}

async function testTemplate(browser, template, viewport) {
    console.log(`📱 Testing ${template.name} on ${viewport.name} (${viewport.width}x${viewport.height})`);

    try {
        // Read template file
        const templatePath = path.join(__dirname, 'email-templates', template.file);
        const htmlContent = fs.readFileSync(templatePath, 'utf8');
        const injectedHtml = await injectTestData(htmlContent);

        // Create browser context with viewport
        const context = await browser.newContext({
            viewport: { width: viewport.width, height: viewport.height },
            deviceScaleFactor: viewport.name === 'mobile' ? 2 : 1,
            hasTouch: viewport.name !== 'desktop',
            isMobile: viewport.name === 'mobile'
        });

        const page = await context.newPage();

        // Set content and wait for load
        await page.setContent(injectedHtml, { waitUntil: 'networkidle' });

        // Wait for fonts and styles to load
        await page.waitForTimeout(1000);

        // Create screenshots directory
        const screenshotDir = path.join(__dirname, 'email-template-screenshots');
        if (!fs.existsSync(screenshotDir)) {
            fs.mkdirSync(screenshotDir, { recursive: true });
        }

        // Take screenshot
        const screenshotPath = path.join(screenshotDir, `${template.name}_${viewport.name}.png`);
        await page.screenshot({
            path: screenshotPath,
            fullPage: true,
            type: 'png'
        });

        // Test accessibility and responsive elements
        const results = await page.evaluate(() => {
            const results = {
                hasSignalGreen: false,
                hasProperContrast: false,
                hasResponsiveText: false,
                buttonClickable: false,
                darkTheme: false,
                errors: []
            };

            try {
                // Check for Signal green color
                const signalElements = document.querySelectorAll('[style*="#00ff88"], [style*="rgb(0, 255, 136)"]');
                const signalClasses = document.querySelectorAll('.brand-signal, .cta-button');
                results.hasSignalGreen = signalElements.length > 0 || signalClasses.length > 0;

                // Check background is dark
                const body = document.body;
                const bodyStyle = window.getComputedStyle(body);
                const bgColor = bodyStyle.backgroundColor;
                results.darkTheme = bgColor.includes('rgb(0, 0, 0)') || bgColor.includes('#000');

                // Check button exists and is clickable
                const button = document.querySelector('.cta-button, a[href*="signal-noise"], a[href*="verify"]');
                results.buttonClickable = button && button.style.display !== 'none';

                // Check responsive text sizing
                const headings = document.querySelectorAll('h1, h2, .brand-title');
                results.hasResponsiveText = headings.length > 0;

                // Basic contrast check (simplified)
                results.hasProperContrast = results.darkTheme && results.hasSignalGreen;

            } catch (error) {
                results.errors.push(`Evaluation error: ${error.message}`);
            }

            return results;
        });

        // Log results
        const status = results.hasSignalGreen && results.darkTheme && results.buttonClickable ? '✅' : '⚠️';
        console.log(`  ${status} Signal Green: ${results.hasSignalGreen}`);
        console.log(`  ${status} Dark Theme: ${results.darkTheme}`);
        console.log(`  ${status} Button Clickable: ${results.buttonClickable}`);
        console.log(`  ${status} Screenshot: ${screenshotPath}`);

        if (results.errors.length > 0) {
            console.log(`  ❌ Errors:`, results.errors);
        }

        await context.close();
        return results;

    } catch (error) {
        console.error(`  ❌ Error testing ${template.name} on ${viewport.name}:`, error.message);
        return { error: error.message };
    }
}

async function generateTestReport(allResults) {
    const report = {
        timestamp: new Date().toISOString(),
        summary: {
            totalTests: 0,
            passed: 0,
            failed: 0
        },
        results: allResults
    };

    allResults.forEach(result => {
        report.summary.totalTests++;
        if (result.error || !result.hasSignalGreen || !result.darkTheme || !result.buttonClickable) {
            report.summary.failed++;
        } else {
            report.summary.passed++;
        }
    });

    // Save report
    const reportPath = path.join(__dirname, 'email-template-test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log('\n📊 TEST SUMMARY');
    console.log(`Total Tests: ${report.summary.totalTests}`);
    console.log(`✅ Passed: ${report.summary.passed}`);
    console.log(`❌ Failed: ${report.summary.failed}`);
    console.log(`📄 Report: ${reportPath}`);

    return report;
}

async function runTests() {
    console.log('🎯 Signal/Noise Email Template Testing');
    console.log('=====================================\n');

    const browser = await chromium.launch({ headless: true });
    const allResults = [];

    try {
        for (const template of templates) {
            console.log(`\n📧 Testing ${template.type}: ${template.name}`);
            console.log('-'.repeat(50));

            for (const viewport of viewports) {
                const result = await testTemplate(browser, template, viewport);
                allResults.push({
                    template: template.name,
                    type: template.type,
                    viewport: viewport.name,
                    ...result
                });
            }
        }

        await generateTestReport(allResults);

    } catch (error) {
        console.error('❌ Test runner error:', error);
    } finally {
        await browser.close();
    }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runTests().catch(console.error);
}

export { runTests, testTemplate };