#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import blog posts data - matching the structure from BlogIndex.tsx
const blogPosts = [
  {
    slug: 'steve-jobs-method',
    publishDate: '2025-09-21',
    isPublished: true
  },
  {
    slug: '75-percent-tasks',
    publishDate: '2025-09-14',
    isPublished: true
  },
  {
    slug: 'elon-musk-100-signal',
    publishDate: '2025-09-07',
    isPublished: true
  },
  {
    slug: 'kevin-oleary-was-right',
    publishDate: '2025-09-29',
    isPublished: false
  },
  {
    slug: 'founder-productivity-paradox',
    publishDate: '2025-10-06',
    isPublished: false
  },
  {
    slug: 'signal-vs-noise-philosophy',
    publishDate: '2025-10-13',
    isPublished: false
  },
  {
    slug: '90-day-tracking-experiment',
    publishDate: '2025-10-20',
    isPublished: false
  },
  {
    slug: 'focus-age-distraction',
    publishDate: '2025-10-27',
    isPublished: false
  },
  {
    slug: 'mathematics-productivity',
    publishDate: '2025-11-03',
    isPublished: false
  },
  {
    slug: 'building-signal-noise-story',
    publishDate: '2025-11-10',
    isPublished: false
  }
];

function generateSitemap() {
  const baseUrl = 'https://signal-noise.app';
  const today = new Date().toISOString().split('T')[0];

  // Filter only published articles
  const publishedArticles = blogPosts.filter(post => post.isPublished);

  // Generate blog article URLs
  const blogUrls = publishedArticles.map(article => `
  <url>
    <loc>${baseUrl}/blog/${article.slug}</loc>
    <lastmod>${article.publishDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/blog/${article.slug}" />
    <xhtml:link rel="alternate" hreflang="de" href="${baseUrl}/blog/${article.slug}" />
  </url>`).join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">

  <!-- Main App -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/" />
    <xhtml:link rel="alternate" hreflang="de" href="${baseUrl}/" />
  </url>

  <!-- About Page (SEO-optimized information page) -->
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/about" />
    <xhtml:link rel="alternate" hreflang="de" href="${baseUrl}/about" />
  </url>

  <!-- Success Page (for completed purchases) -->
  <url>
    <loc>${baseUrl}/success</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>

  <!-- Invoice Routes (dynamic but crawlable pattern) -->
  <url>
    <loc>${baseUrl}/invoice/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.2</priority>
  </url>

  <!-- Alternative URL patterns (if accessed directly) -->
  <url>
    <loc>${baseUrl}/app</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Blog Index -->
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/blog" />
    <xhtml:link rel="alternate" hreflang="de" href="${baseUrl}/blog" />
  </url>

  <!-- Blog Articles (Only Published) -->${blogUrls}

</urlset>`;

  // Write sitemap to public directory
  const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemap);

  console.log(`✅ Sitemap generated with ${publishedArticles.length} published articles`);
  console.log(`📍 Location: ${sitemapPath}`);
  console.log(`📊 Published articles:`);
  publishedArticles.forEach(article => {
    console.log(`   - ${article.slug} (${article.publishDate})`);
  });
}

// Run the generator
generateSitemap();