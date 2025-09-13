// Comprehensive Playwright Test Suite for Signal/Noise Email Templates
// Extracts templates from email-helper.js and tests across all viewports
// Tests: Mobile (375x667), Tablet (768x1024), Desktop (1200x800)

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Viewport configurations for comprehensive testing
const viewports = [
    {
        name: 'mobile',
        width: 375,
        height: 667,
        device: 'iPhone SE',
        scaleFactor: 2,
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
    },
    {
        name: 'tablet',
        width: 768,
        height: 1024,
        device: 'iPad',
        scaleFactor: 2,
        userAgent: 'Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
    },
    {
        name: 'desktop',
        width: 1200,
        height: 800,
        device: 'Desktop',
        scaleFactor: 1,
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
];

// Test data for template injection
const testData = {
    verifyUrl: 'https://signal-noise.app/verify/test-token-abc123def456',
    tierName: 'Foundation Member',
    firstName: 'Alex',
    userEmail: 'alex@example.com'
};

/**
 * Extract HTML templates from email-helper.js
 */
function extractTemplatesFromEmailHelper() {
    console.log('📄 Extracting templates from email-helper.js...');

    const emailHelperPath = path.join(__dirname, 'api', 'email-helper.js');
    const emailHelperContent = fs.readFileSync(emailHelperPath, 'utf8');

    const templates = [];

    // Extract Magic Link template
    const magicLinkMatch = emailHelperContent.match(/const html = `\s*(<!DOCTYPE html>.*?)<\/html>\s*`/s);
    if (magicLinkMatch) {
        let magicLinkHtml = magicLinkMatch[1] + '</html>';
        // Replace template variables
        magicLinkHtml = magicLinkHtml
            .replace(/\$\{verifyUrl\}/g, testData.verifyUrl)
            .replace(/\$\{tierName\}/g, testData.tierName);

        templates.push({
            name: 'magic-link',
            type: 'Magic Link Recovery',
            html: magicLinkHtml
        });
    }

    // Extract Welcome template (look for the second html template)
    const welcomeMatches = emailHelperContent.match(/const html = `\s*(<!DOCTYPE html>.*?)<\/html>\s*`/gs);
    if (welcomeMatches && welcomeMatches.length > 1) {
        let welcomeHtml = welcomeMatches[1].replace('const html = `', '').replace('`', '');
        welcomeHtml = welcomeHtml.trim() + '</html>';
        // Replace template variables
        welcomeHtml = welcomeHtml
            .replace(/\$\{firstName \|\| 'there'\}/g, testData.firstName)
            .replace(/\$\{tierName\}/g, testData.tierName);

        templates.push({
            name: 'welcome-email',
            type: 'Welcome Email',
            html: welcomeHtml
        });
    }

    console.log(`✅ Extracted ${templates.length} templates`);
    return templates;
}

/**
 * Create temporary HTML files for testing
 */
function createTestFiles(templates) {
    console.log('📁 Creating temporary test files...');

    const testDir = path.join(__dirname, 'temp-email-tests');
    if (!fs.existsSync(testDir)) {
        fs.mkdirSync(testDir, { recursive: true });
    }

    const testFiles = [];

    templates.forEach(template => {
        const filePath = path.join(testDir, `${template.name}.html`);
        fs.writeFileSync(filePath, template.html);
        testFiles.push({
            ...template,
            filePath
        });
        console.log(`  ✅ Created ${template.name}.html`);
    });

    return testFiles;
}

/**
 * Test individual template on specific viewport
 */
async function testTemplate(browser, template, viewport) {
    console.log(`📱 Testing ${template.name} on ${viewport.name} (${viewport.width}x${viewport.height})`);

    try {
        // Create browser context with viewport settings
        const context = await browser.newContext({
            viewport: { width: viewport.width, height: viewport.height },
            deviceScaleFactor: viewport.scaleFactor,
            hasTouch: viewport.name !== 'desktop',
            isMobile: viewport.name === 'mobile',
            userAgent: viewport.userAgent
        });

        const page = await context.newPage();

        // Load the template HTML file
        await page.goto(`file://${template.filePath}`, { waitUntil: 'networkidle' });

        // Wait for fonts and styles to load
        await page.waitForTimeout(2000);

        // Create screenshots directory
        const screenshotDir = path.join(__dirname, 'email-template-screenshots');
        if (!fs.existsSync(screenshotDir)) {
            fs.mkdirSync(screenshotDir, { recursive: true });
        }

        // Take comprehensive screenshot
        const screenshotPath = path.join(screenshotDir, `${template.name}_${viewport.name}.png`);
        await page.screenshot({
            path: screenshotPath,
            fullPage: true,
            type: 'png'
        });

        // Comprehensive design validation
        const results = await page.evaluate(() => {
            const results = {
                designValidation: {
                    hasSignalGreen: false,
                    signalGreenAccuracy: false,
                    darkTheme: false,
                    brandIcon: false,
                    properTypography: false,
                    buttonPresent: false,
                    buttonStyling: false,
                    responsiveDesign: false,
                    emailCompatibility: false
                },
                measurements: {
                    containerWidth: 0,
                    brandIconSize: 0,
                    buttonPadding: '',
                    fontSize: ''
                },
                colorAnalysis: {
                    backgroundColor: '',
                    primaryText: '',
                    brandColor: '',
                    buttonColor: ''
                },
                errors: []
            };

            try {
                // Check dark theme
                const body = document.body;
                const container = document.querySelector('.email-container');
                const bodyStyle = window.getComputedStyle(body);
                const containerStyle = container ? window.getComputedStyle(container) : null;

                results.colorAnalysis.backgroundColor = bodyStyle.backgroundColor;
                results.designValidation.darkTheme = bodyStyle.backgroundColor.includes('rgb(0, 0, 0)') ||
                                                    bodyStyle.backgroundColor.includes('#000');

                // Check Signal Green (#00ff88)
                const signalElements = document.querySelectorAll('*');
                let hasAccurateSignalGreen = false;
                let signalGreenCount = 0;

                signalElements.forEach(el => {
                    const styles = window.getComputedStyle(el);
                    const bgColor = styles.backgroundColor;
                    const color = styles.color;
                    const borderColor = styles.borderColor;
                    const fill = el.getAttribute('fill');

                    // Check for exact #00ff88 or rgb(0, 255, 136)
                    if (bgColor.includes('rgb(0, 255, 136)') ||
                        color.includes('rgb(0, 255, 136)') ||
                        borderColor.includes('rgb(0, 255, 136)') ||
                        fill === '#00ff88') {
                        hasAccurateSignalGreen = true;
                        signalGreenCount++;
                    }
                });

                results.designValidation.hasSignalGreen = signalGreenCount > 0;
                results.designValidation.signalGreenAccuracy = hasAccurateSignalGreen;

                // Check brand icon
                const brandIcon = document.querySelector('.brand-icon svg, .brand-icon');
                if (brandIcon) {
                    results.designValidation.brandIcon = true;
                    const iconStyle = window.getComputedStyle(brandIcon);
                    results.measurements.brandIconSize = iconStyle.fontSize || iconStyle.width;
                }

                // Check typography (Apple system fonts)
                const brandTitle = document.querySelector('.brand-title, h1');
                if (brandTitle) {
                    const titleStyle = window.getComputedStyle(brandTitle);
                    results.designValidation.properTypography = titleStyle.fontFamily.includes('-apple-system') ||
                                                               titleStyle.fontFamily.includes('system-ui');
                    results.measurements.fontSize = titleStyle.fontSize;
                    results.colorAnalysis.primaryText = titleStyle.color;
                }

                // Check CTA button
                const ctaButton = document.querySelector('.cta-button');
                if (ctaButton) {
                    results.designValidation.buttonPresent = true;
                    const buttonStyle = window.getComputedStyle(ctaButton);

                    results.designValidation.buttonStyling = buttonStyle.background.includes('linear-gradient') ||
                                                           buttonStyle.backgroundColor.includes('rgb(0, 255, 136)');
                    results.measurements.buttonPadding = buttonStyle.padding;
                    results.colorAnalysis.buttonColor = buttonStyle.backgroundColor;
                }

                // Check responsive design elements
                const emailContainer = document.querySelector('.email-container');
                if (emailContainer) {
                    const containerStyle = window.getComputedStyle(emailContainer);
                    results.measurements.containerWidth = parseInt(containerStyle.maxWidth);
                    results.designValidation.responsiveDesign = containerStyle.maxWidth &&
                                                             parseFloat(containerStyle.maxWidth) <= 600;
                }

                // Check email client compatibility elements
                const hasMSOElements = document.querySelector('[mso-table-lspace]') !== null;
                const hasWebkitFixes = document.documentElement.innerHTML.includes('-webkit-text-size-adjust');
                results.designValidation.emailCompatibility = hasMSOElements && hasWebkitFixes;

                // Additional color analysis
                const signalBrandElements = document.querySelectorAll('.brand-subtitle, .footer-link, .info-label');
                if (signalBrandElements.length > 0) {
                    const brandElement = signalBrandElements[0];
                    const brandStyle = window.getComputedStyle(brandElement);
                    results.colorAnalysis.brandColor = brandStyle.color;
                }

            } catch (error) {
                results.errors.push(`Design validation error: ${error.message}`);
            }

            return results;
        });

        // Generate test score
        const validationKeys = Object.keys(results.designValidation);
        const passedTests = validationKeys.filter(key => results.designValidation[key]).length;
        const testScore = Math.round((passedTests / validationKeys.length) * 100);

        // Enhanced logging
        const status = testScore >= 80 ? '✅' : testScore >= 60 ? '⚠️' : '❌';
        console.log(`  ${status} Test Score: ${testScore}% (${passedTests}/${validationKeys.length})`);
        console.log(`  ${results.designValidation.darkTheme ? '✅' : '❌'} Dark Theme: ${results.colorAnalysis.backgroundColor}`);
        console.log(`  ${results.designValidation.signalGreenAccuracy ? '✅' : '❌'} Signal Green: ${results.designValidation.hasSignalGreen ? 'Present' : 'Missing'}`);
        console.log(`  ${results.designValidation.brandIcon ? '✅' : '❌'} Brand Icon: ${results.measurements.brandIconSize || 'N/A'}`);
        console.log(`  ${results.designValidation.properTypography ? '✅' : '❌'} Typography: Apple System Fonts`);
        console.log(`  ${results.designValidation.buttonPresent ? '✅' : '❌'} CTA Button: ${results.measurements.buttonPadding || 'N/A'}`);
        console.log(`  ${results.designValidation.responsiveDesign ? '✅' : '❌'} Responsive: ${results.measurements.containerWidth}px max`);
        console.log(`  📸 Screenshot: ${screenshotPath}`);

        if (results.errors.length > 0) {
            console.log(`  ❌ Errors:`, results.errors);
        }

        await context.close();

        return {
            ...results,
            testScore,
            passedTests,
            totalTests: validationKeys.length,
            screenshot: screenshotPath,
            viewport: viewport.name,
            template: template.name
        };

    } catch (error) {
        console.error(`  ❌ Error testing ${template.name} on ${viewport.name}:`, error.message);
        return {
            error: error.message,
            template: template.name,
            viewport: viewport.name,
            testScore: 0
        };
    }
}

/**
 * Generate comprehensive test report
 */
async function generateTestReport(allResults, templates) {
    const timestamp = new Date().toISOString();

    const report = {
        timestamp,
        summary: {
            totalTests: allResults.length,
            passed: 0,
            failed: 0,
            averageScore: 0,
            templates: templates.length,
            viewports: viewports.length
        },
        templates: {},
        viewports: {},
        designValidation: {
            darkThemeConsistency: true,
            signalGreenAccuracy: true,
            brandIconPresent: true,
            responsiveDesign: true,
            emailCompatibility: true
        },
        recommendations: [],
        results: allResults
    };

    // Calculate statistics
    let totalScore = 0;
    allResults.forEach(result => {
        if (result.error) {
            report.summary.failed++;
            return;
        }

        const score = result.testScore || 0;
        totalScore += score;

        if (score >= 80) {
            report.summary.passed++;
        } else {
            report.summary.failed++;
        }

        // Group by template
        if (!report.templates[result.template]) {
            report.templates[result.template] = { scores: [], average: 0 };
        }
        report.templates[result.template].scores.push(score);

        // Group by viewport
        if (!report.viewports[result.viewport]) {
            report.viewports[result.viewport] = { scores: [], average: 0 };
        }
        report.viewports[result.viewport].scores.push(score);

        // Check design consistency
        if (result.designValidation) {
            if (!result.designValidation.darkTheme) report.designValidation.darkThemeConsistency = false;
            if (!result.designValidation.signalGreenAccuracy) report.designValidation.signalGreenAccuracy = false;
            if (!result.designValidation.brandIcon) report.designValidation.brandIconPresent = false;
            if (!result.designValidation.responsiveDesign) report.designValidation.responsiveDesign = false;
            if (!result.designValidation.emailCompatibility) report.designValidation.emailCompatibility = false;
        }
    });

    report.summary.averageScore = Math.round(totalScore / allResults.length);

    // Calculate template averages
    Object.keys(report.templates).forEach(template => {
        const scores = report.templates[template].scores;
        report.templates[template].average = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    });

    // Calculate viewport averages
    Object.keys(report.viewports).forEach(viewport => {
        const scores = report.viewports[viewport].scores;
        report.viewports[viewport].average = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    });

    // Generate recommendations
    if (!report.designValidation.darkThemeConsistency) {
        report.recommendations.push("Ensure consistent #000000 background across all templates");
    }
    if (!report.designValidation.signalGreenAccuracy) {
        report.recommendations.push("Verify Signal Green (#00ff88) color accuracy in all brand elements");
    }
    if (!report.designValidation.brandIconPresent) {
        report.recommendations.push("Add Signal/Noise brand icon to all email templates");
    }
    if (!report.designValidation.responsiveDesign) {
        report.recommendations.push("Improve mobile responsiveness with better breakpoints");
    }
    if (report.summary.averageScore < 85) {
        report.recommendations.push("Overall design quality needs improvement for Jony Ive standards");
    }

    // Save comprehensive report
    const reportPath = path.join(__dirname, 'playwright-email-test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // Generate summary markdown report
    const markdownReport = generateMarkdownReport(report);
    const markdownPath = path.join(__dirname, 'EMAIL_TEMPLATE_ANALYSIS.md');
    fs.writeFileSync(markdownPath, markdownReport);

    return { report, reportPath, markdownPath };
}

/**
 * Generate markdown summary report
 */
function generateMarkdownReport(report) {
    const avgScore = report.summary.averageScore;
    const scoreEmoji = avgScore >= 85 ? '🟢' : avgScore >= 70 ? '🟡' : '🔴';

    let markdown = `# Signal/Noise Email Template Analysis Report

${scoreEmoji} **Overall Score: ${avgScore}%** (${report.summary.passed}/${report.summary.totalTests} tests passed)

*Generated: ${new Date(report.timestamp).toLocaleString()}*

## Summary

- **Templates Tested**: ${report.summary.templates}
- **Viewports**: Mobile (375x667), Tablet (768x1024), Desktop (1200x800)
- **Total Tests**: ${report.summary.totalTests}
- **Average Score**: ${avgScore}%

## Template Performance

`;

    Object.entries(report.templates).forEach(([template, data]) => {
        const emoji = data.average >= 85 ? '🟢' : data.average >= 70 ? '🟡' : '🔴';
        markdown += `### ${emoji} ${template}\n- Average Score: ${data.average}%\n- Scores: ${data.scores.join('%, ')}%\n\n`;
    });

    markdown += `## Viewport Performance

`;

    Object.entries(report.viewports).forEach(([viewport, data]) => {
        const emoji = data.average >= 85 ? '🟢' : data.average >= 70 ? '🟡' : '🔴';
        markdown += `### ${emoji} ${viewport.charAt(0).toUpperCase() + viewport.slice(1)}\n- Average Score: ${data.average}%\n- Scores: ${data.scores.join('%, ')}%\n\n`;
    });

    if (report.recommendations.length > 0) {
        markdown += `## Recommendations

`;
        report.recommendations.forEach(rec => {
            markdown += `- ${rec}\n`;
        });
    }

    markdown += `
## Design Validation Results

- Dark Theme Consistency: ${report.designValidation.darkThemeConsistency ? '✅' : '❌'}
- Signal Green Accuracy: ${report.designValidation.signalGreenAccuracy ? '✅' : '❌'}
- Brand Icon Present: ${report.designValidation.brandIconPresent ? '✅' : '❌'}
- Responsive Design: ${report.designValidation.responsiveDesign ? '✅' : '❌'}
- Email Client Compatibility: ${report.designValidation.emailCompatibility ? '✅' : '❌'}

## Screenshots

Screenshots for all template-viewport combinations are available in the \`email-template-screenshots/\` directory.
`;

    return markdown;
}

/**
 * Cleanup temporary files
 */
function cleanup() {
    const testDir = path.join(__dirname, 'temp-email-tests');
    if (fs.existsSync(testDir)) {
        fs.rmSync(testDir, { recursive: true, force: true });
        console.log('🧹 Cleaned up temporary test files');
    }
}

/**
 * Main test runner
 */
async function runComprehensiveEmailTests() {
    console.log('🎯 Signal/Noise Email Template Testing Suite');
    console.log('=============================================');
    console.log('Testing viewports: Mobile, Tablet, Desktop');
    console.log('Validating: Design, Colors, Typography, Responsiveness\n');

    let browser;
    const allResults = [];

    try {
        // Extract templates from email helper
        const templates = extractTemplatesFromEmailHelper();
        if (templates.length === 0) {
            throw new Error('No templates found in email-helper.js');
        }

        // Create test files
        const testFiles = createTestFiles(templates);

        // Launch browser
        console.log('🚀 Launching browser...\n');
        browser = await chromium.launch({
            headless: true,
            args: ['--disable-web-security', '--disable-features=VizDisplayCompositor']
        });

        // Test each template on each viewport
        for (const template of testFiles) {
            console.log(`\n📧 Testing ${template.type}: ${template.name}`);
            console.log('='.repeat(60));

            for (const viewport of viewports) {
                const result = await testTemplate(browser, template, viewport);
                allResults.push(result);
                console.log(''); // Add spacing between viewport tests
            }
        }

        // Generate comprehensive report
        console.log('\n📊 Generating comprehensive test report...');
        const { report, reportPath, markdownPath } = await generateTestReport(allResults, templates);

        // Display final summary
        console.log('\n🎉 EMAIL TEMPLATE TESTING COMPLETE');
        console.log('=====================================');
        console.log(`Overall Score: ${report.summary.averageScore}%`);
        console.log(`Tests Passed: ${report.summary.passed}/${report.summary.totalTests}`);
        console.log(`JSON Report: ${reportPath}`);
        console.log(`Markdown Report: ${markdownPath}`);
        console.log(`Screenshots: email-template-screenshots/`);

        if (report.recommendations.length > 0) {
            console.log('\n💡 Key Recommendations:');
            report.recommendations.forEach(rec => console.log(`  • ${rec}`));
        }

        return report;

    } catch (error) {
        console.error('❌ Test suite error:', error);
        throw error;
    } finally {
        if (browser) {
            await browser.close();
        }
        cleanup();
    }
}

// Export for module use
export { runComprehensiveEmailTests, testTemplate };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runComprehensiveEmailTests().catch(console.error);
}