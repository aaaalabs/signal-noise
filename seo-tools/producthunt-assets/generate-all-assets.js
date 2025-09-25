import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generate all ProductHunt assets using Playwright
 * Jony Ive Principle: Perfect execution for brand representation
 */

const assetConfigurations = [
    // Logo Assets
    {
        name: 'logo-static',
        htmlFile: 'logo/logo-generator.html',
        outputDir: 'logo',
        fileName: 'signal-noise-logo-240x240.png',
        viewport: { width: 240, height: 240 },
        action: null // Static version by default
    },
    {
        name: 'logo-animated-frame1',
        htmlFile: 'logo/logo-generator.html',
        outputDir: 'logo',
        fileName: 'signal-noise-logo-animated-frame1.png',
        viewport: { width: 240, height: 240 },
        action: 'click' // Trigger animation for capture
    },

    // Screenshot Assets
    {
        name: 'screenshot-hero',
        htmlFile: 'screenshots/screenshot-generator.html',
        outputDir: 'screenshots',
        fileName: 'signal-noise-hero-interface.png',
        viewport: { width: 300, height: 600 },
        action: async (page) => {
            await page.keyboard.press('1'); // Hero interface
            await page.waitForTimeout(500);
        }
    },
    {
        name: 'screenshot-classification',
        htmlFile: 'screenshots/screenshot-generator.html',
        outputDir: 'screenshots',
        fileName: 'signal-noise-task-classification.png',
        viewport: { width: 300, height: 600 },
        action: async (page) => {
            await page.keyboard.press('2'); // Classification view
            await page.waitForTimeout(500);
        }
    },
    {
        name: 'screenshot-analytics',
        htmlFile: 'screenshots/screenshot-generator.html',
        outputDir: 'screenshots',
        fileName: 'signal-noise-analytics-view.png',
        viewport: { width: 300, height: 600 },
        action: async (page) => {
            await page.keyboard.press('3'); // Analytics view
            await page.waitForTimeout(500);
        }
    },
    {
        name: 'screenshot-achievement',
        htmlFile: 'screenshots/screenshot-generator.html',
        outputDir: 'screenshots',
        fileName: 'signal-noise-achievement-system.png',
        viewport: { width: 300, height: 600 },
        action: async (page) => {
            await page.keyboard.press('4'); // Achievement view
            await page.waitForTimeout(500);
        }
    },

    // Demo Flow Frames for GIF Creation
    {
        name: 'demo-step1',
        htmlFile: 'demo-gifs/demo-flow-generator.html',
        outputDir: 'demo-gifs',
        fileName: 'demo-step-1-initial.png',
        viewport: { width: 300, height: 600 },
        action: async (page) => {
            await page.keyboard.press('1');
            await page.waitForTimeout(300);
        }
    },
    {
        name: 'demo-step2',
        htmlFile: 'demo-gifs/demo-flow-generator.html',
        outputDir: 'demo-gifs',
        fileName: 'demo-step-2-typing.png',
        viewport: { width: 300, height: 600 },
        action: async (page) => {
            await page.keyboard.press('2');
            await page.waitForTimeout(300);
        }
    },
    {
        name: 'demo-step3',
        htmlFile: 'demo-gifs/demo-flow-generator.html',
        outputDir: 'demo-gifs',
        fileName: 'demo-step-3-noise-classified.png',
        viewport: { width: 300, height: 600 },
        action: async (page) => {
            await page.keyboard.press('3');
            await page.waitForTimeout(300);
        }
    },
    {
        name: 'demo-step4',
        htmlFile: 'demo-gifs/demo-flow-generator.html',
        outputDir: 'demo-gifs',
        fileName: 'demo-step-4-signal-task.png',
        viewport: { width: 300, height: 600 },
        action: async (page) => {
            await page.keyboard.press('4');
            await page.waitForTimeout(300);
        }
    },
    {
        name: 'demo-step5',
        htmlFile: 'demo-gifs/demo-flow-generator.html',
        outputDir: 'demo-gifs',
        fileName: 'demo-step-5-improved-ratio.png',
        viewport: { width: 300, height: 600 },
        action: async (page) => {
            await page.keyboard.press('5');
            await page.waitForTimeout(300);
        }
    }
];

async function generateProductHuntAssets() {
    console.log('🚀 Generating ProductHunt assets...');
    console.log('Jony Ive Principle: Perfect execution for brand representation\n');

    const browser = await chromium.launch({
        headless: true,
        args: [
            '--font-render-hinting=none',
            '--disable-font-subpixel-positioning'
        ]
    });

    const context = await browser.newContext({
        deviceScaleFactor: 2, // Retina/high-DPI
        colorScheme: 'dark'
    });

    try {
        for (const asset of assetConfigurations) {
            console.log(`📸 Generating: ${asset.name}`);

            const htmlFilePath = path.join(__dirname, asset.htmlFile);
            const htmlExists = await fs.access(htmlFilePath).then(() => true).catch(() => false);

            if (!htmlExists) {
                console.log(`   ❌ HTML file not found: ${htmlFilePath}`);
                continue;
            }

            // Create output directory
            const outputDir = path.join(__dirname, asset.outputDir);
            await fs.mkdir(outputDir, { recursive: true });

            const page = await context.newPage();

            try {
                // Load HTML file
                await page.goto(`file://${htmlFilePath}`, {
                    waitUntil: 'networkidle'
                });

                // Set viewport
                await page.setViewportSize(asset.viewport);
                await page.waitForTimeout(1000);

                // Execute any required actions
                if (asset.action) {
                    if (typeof asset.action === 'function') {
                        await asset.action(page);
                    } else if (asset.action === 'click') {
                        await page.click('body');
                        await page.waitForTimeout(500);
                    }
                }

                // Capture screenshot
                const outputPath = path.join(outputDir, asset.fileName);
                await page.screenshot({
                    path: outputPath,
                    type: 'png',
                    clip: {
                        x: 0,
                        y: 0,
                        width: asset.viewport.width,
                        height: asset.viewport.height
                    },
                    omitBackground: false
                });

                console.log(`   ✅ Generated: ${asset.fileName}`);

            } catch (error) {
                console.error(`   ❌ Error generating ${asset.name}:`, error.message);
            } finally {
                await page.close();
            }
        }

    } catch (error) {
        console.error('❌ Fatal error during asset generation:', error);
    } finally {
        await browser.close();
    }

    // Generate asset inventory
    await generateAssetInventory();

    console.log('\n🏆 ProductHunt asset generation complete!');
    console.log('Ready for ProductHunt submission and launch promotion.');
}

async function generateAssetInventory() {
    const inventory = {
        generated_date: new Date().toISOString(),
        total_assets: assetConfigurations.length,
        asset_categories: {
            logo: {
                static: 'logo/signal-noise-logo-240x240.png',
                animated_frame: 'logo/signal-noise-logo-animated-frame1.png',
                usage: 'ProductHunt thumbnail and branding'
            },
            screenshots: {
                hero: 'screenshots/signal-noise-hero-interface.png',
                classification: 'screenshots/signal-noise-task-classification.png',
                analytics: 'screenshots/signal-noise-analytics-view.png',
                achievement: 'screenshots/signal-noise-achievement-system.png',
                usage: 'ProductHunt gallery and social media'
            },
            demo_frames: {
                frame_1: 'demo-gifs/demo-step-1-initial.png',
                frame_2: 'demo-gifs/demo-step-2-typing.png',
                frame_3: 'demo-gifs/demo-step-3-noise-classified.png',
                frame_4: 'demo-gifs/demo-step-4-signal-task.png',
                frame_5: 'demo-gifs/demo-step-5-improved-ratio.png',
                usage: 'Combine into animated GIF for ProductHunt demo'
            }
        },
        next_steps: [
            'Create animated GIF from demo frames',
            'Generate social media variants',
            'Prepare press kit materials',
            'Create ProductHunt maker profile'
        ]
    };

    const inventoryPath = path.join(__dirname, 'asset-inventory.json');
    await fs.writeFile(inventoryPath, JSON.stringify(inventory, null, 2));

    console.log('📋 Asset inventory created: asset-inventory.json');
}

// Execute if run directly
generateProductHuntAssets().catch(error => {
    console.error('💥 Asset generation failed:', error);
    process.exit(1);
});

export { generateProductHuntAssets };