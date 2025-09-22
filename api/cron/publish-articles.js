// Auto-publish scheduled blog articles
// Runs every Monday at 9 AM UTC (0 9 * * 1)

export default async function handler(req, res) {
  // Verify this is a cron request
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    // Articles to be published (in chronological order)
    const scheduledArticles = [
      {
        slug: 'kevin-oleary-was-right',
        publishDate: '2025-09-29',
        title: 'Kevin O\'Leary Was Right About Productivity',
        keywords: ['kevin oleary productivity', 'shark tank productivity', 'signal vs noise']
      },
      {
        slug: 'founders-paradox',
        publishDate: '2025-10-06',
        title: 'The Founder\'s Paradox: When Freedom Kills Focus',
        keywords: ['founder productivity', 'entrepreneur focus', 'startup productivity']
      },
      {
        slug: 'signal-vs-noise-philosophy',
        publishDate: '2025-10-13',
        title: 'Signal vs Noise: A Philosophy for Modern Life',
        keywords: ['signal vs noise meaning', 'productivity philosophy', 'information theory']
      },
      {
        slug: 'tracked-ratio-90-days',
        publishDate: '2025-10-20',
        title: 'I Tracked My Signal Ratio for 90 Days - Here\'s What Happened',
        keywords: ['productivity tracking', '90 day challenge', 'signal ratio experiment']
      },
      {
        slug: 'focus-age-distraction',
        publishDate: '2025-10-27',
        title: 'Maintaining Focus in the Age of Distraction',
        keywords: ['digital minimalism', 'deep work', 'focus strategies']
      },
      {
        slug: 'mathematics-productivity',
        publishDate: '2025-11-03',
        title: 'The Mathematics of Productivity: Why 80/20 Actually Works',
        keywords: ['pareto principle', '80/20 rule mathematics', 'productivity statistics']
      },
      {
        slug: 'building-signal-noise-story',
        publishDate: '2025-11-10',
        title: 'Building Signal/Noise: From Productivity Crisis to App',
        keywords: ['startup story', 'productivity app development', 'founder journey']
      }
    ];

    // Find articles to publish today
    const articlesToPublish = scheduledArticles.filter(article =>
      article.publishDate === today
    );

    if (articlesToPublish.length === 0) {
      return res.status(200).json({
        message: 'No articles scheduled for today',
        date: today
      });
    }

    // Log publishing activity
    console.log(`Publishing ${articlesToPublish.length} articles on ${today}:`,
      articlesToPublish.map(a => a.title)
    );

    // Update sitemap with newly published articles
    const fs = require('fs').promises;
    const path = require('path');

    for (const article of articlesToPublish) {
      // Read current sitemap
      const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
      const sitemapContent = await fs.readFile(sitemapPath, 'utf-8');

      // Check if article already exists in sitemap
      if (!sitemapContent.includes(`/blog/${article.slug}`)) {
        // Add new article to sitemap
        const newEntry = `
  <url>
    <loc>https://signal-noise.app/blog/${article.slug}</loc>
    <lastmod>${article.publishDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="en" href="https://signal-noise.app/blog/${article.slug}" />
    <xhtml:link rel="alternate" hreflang="de" href="https://signal-noise.app/blog/${article.slug}" />
  </url>

</urlset>`;

        const updatedSitemap = sitemapContent.replace('</urlset>', newEntry);
        await fs.writeFile(sitemapPath, updatedSitemap, 'utf-8');

        console.log(`Added ${article.slug} to sitemap`);
      }
    }

    const results = articlesToPublish.map(article => ({
      slug: article.slug,
      title: article.title,
      publishDate: article.publishDate,
      status: 'published',
      seoKeywords: article.keywords,
      sitemapUpdated: true
    }));

    return res.status(200).json({
      message: `Successfully published ${articlesToPublish.length} articles`,
      date: today,
      published: results
    });

  } catch (error) {
    console.error('Error in publish-articles cron:', error);
    return res.status(500).json({
      error: 'Failed to publish articles',
      details: error.message
    });
  }
}