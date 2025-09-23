import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generate placeholder images for all missing blog article content
 * Following Jony Ive principles: honest placeholders without deception
 */

const placeholders = [
    // Article 1: Steve Jobs
    { name: 'steve-jobs-portrait', title: 'Steve Jobs Portrait', description: 'Contemplative leader in black turtleneck, minimalist workspace', type: 'portrait', article: 'article-1-steve-jobs' },
    { name: 'apple-minimalist-workspace', title: 'Apple Workspace', description: 'Clean desk with single laptop, natural lighting', type: 'landscape', article: 'article-1-steve-jobs' },
    { name: 'stanford-speech-moment', title: 'Stanford Speech', description: 'Commencement address, inspirational moment', type: 'landscape', article: 'article-1-steve-jobs' },

    // Article 2: 75% Tasks
    { name: 'overwhelmed-professional', title: 'Overwhelmed Professional', description: 'Multiple tasks, authentic work stress', type: 'portrait', article: 'article-2-75-percent' },
    { name: 'productivity-statistics', title: 'Productivity Research', description: 'Workplace efficiency data, research insights', type: 'landscape', article: 'article-2-75-percent' },

    // Article 3: Elon Musk
    { name: 'elon-musk-portrait', title: 'Elon Musk Portrait', description: 'Technology leader, intense focus, innovation', type: 'portrait', article: 'article-3-elon-musk' },
    { name: 'time-blocking-visual', title: 'Time Blocking Method', description: '5-minute blocks, extreme efficiency', type: 'landscape', article: 'article-3-elon-musk' },

    // Article 4: Philosophy
    { name: 'claude-shannon-tribute', title: 'Claude Shannon', description: 'Information theory pioneer, Bell Labs', type: 'portrait', article: 'article-4-philosophy' },
    { name: 'information-theory-diagram', title: 'Information Theory', description: 'Signal processing, communication systems', type: 'landscape', article: 'article-4-philosophy' },

    // Article 5: 90-Day Tracking
    { name: '90-day-calendar', title: '90-Day Calendar', description: 'Progress tracking, daily improvements', type: 'square', article: 'article-5-90-day' },
    { name: 'tracking-experiment-setup', title: 'Tracking Setup', description: 'Personal experiment, methodology testing', type: 'landscape', article: 'article-5-90-day' },

    // Article 6: Founders Paradox
    { name: 'jeff-bezos-portrait', title: 'Jeff Bezos Portrait', description: 'Entrepreneur, innovative workspace', type: 'portrait', article: 'article-6-founders' },
    { name: 'freedom-vs-structure', title: 'Freedom vs Structure', description: 'Entrepreneurial challenge, decision fatigue', type: 'landscape', article: 'article-6-founders' },

    // Article 7: Kevin O'Leary
    { name: 'kevin-oleary-portrait', title: 'Kevin O\'Leary', description: 'Business authority, Shark Tank investor', type: 'portrait', article: 'article-7-oleary' },
    { name: 'shark-tank-meeting', title: 'Executive Meeting', description: 'Strategic planning, corporate environment', type: 'landscape', article: 'article-7-oleary' },

    // Article 8: Focus Age Distraction
    { name: 'digital-overwhelm-scene', title: 'Digital Overwhelm', description: 'Multiple screens, modern work challenges', type: 'landscape', article: 'article-8-focus' },
    { name: 'digital-minimalism-workspace', title: 'Minimalism Workspace', description: 'Single device, peaceful productivity', type: 'landscape', article: 'article-8-focus' },

    // Article 9: Mathematics
    { name: 'mathematical-researcher', title: 'Math Researcher', description: 'Scientist, whiteboard formulas', type: 'portrait', article: 'article-9-mathematics' },
    { name: 'power-law-visualization', title: 'Power Law Visual', description: 'Statistical distribution, mathematical proof', type: 'landscape', article: 'article-9-mathematics' },

    // Article 10: Building Story
    { name: 'startup-founder-scene', title: 'Startup Founder', description: 'Authentic work moment, app development', type: 'portrait', article: 'article-10-story' },
    { name: 'app-development-screen', title: 'App Development', description: 'Code interface, Signal/Noise creation', type: 'landscape', article: 'article-10-story' }
];

const dimensions = {
    portrait: { width: 300, height: 400 },
    landscape: { width: 500, height: 300 },
    square: { width: 350, height: 350 }
};

async function generatePlaceholders() {
    console.log('🎯 Generating placeholder images...');
    console.log('Jony Ive Principle: Honest placeholders without deception\n');

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ deviceScaleFactor: 2 });

    try {
        const page = await context.newPage();
        const htmlFile = path.join(__dirname, 'placeholder-generator.html');
        await page.goto(`file://${htmlFile}`);

        for (const placeholder of placeholders) {
            console.log(`📷 Creating: ${placeholder.title}`);

            const dim = dimensions[placeholder.type];

            // Update placeholder content via JavaScript
            await page.evaluate((config) => {
                const container = document.getElementById('placeholder');
                container.className = `placeholder-container ${config.type}-placeholder`;
                container.innerHTML = `
                    <div class="placeholder-icon">📷</div>
                    <div class="placeholder-title">${config.title}</div>
                    <div class="placeholder-description">${config.description}</div>
                    <div class="coming-soon">Signal/Noise Blog</div>
                `;
            }, placeholder);

            // Set appropriate dimensions
            await page.setViewportSize(dim);
            await page.waitForTimeout(200);

            // Create output path
            const outputPath = path.join(__dirname, '..', '..', 'public', 'blog-images', placeholder.article, `${placeholder.name}.jpg`);

            // Generate screenshot
            await page.screenshot({
                path: outputPath,
                type: 'png',
                clip: {
                    x: 0,
                    y: 0,
                    width: dim.width,
                    height: dim.height
                }
            });

            console.log(`   ✅ Generated: ${placeholder.name}.jpg`);
        }

        await page.close();
    } catch (error) {
        console.error('❌ Error generating placeholders:', error);
    } finally {
        await browser.close();
    }

    console.log('🏆 Placeholder generation complete!');
    console.log(`Generated ${placeholders.length} placeholder images`);
}

generatePlaceholders().catch(error => {
    console.error('❌ Placeholder generation failed:', error);
    process.exit(1);
});

export { generatePlaceholders };