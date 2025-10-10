/**
 * Extract published blog routes for prerendering
 * Used by vite-plugin-prerender to generate static HTML for SEO
 */

// Import blog posts from the actual source
import { blogPosts } from '../src/components/BlogIndex.tsx';

// Generate routes for published articles only
const blogRoutes = blogPosts
  .filter(post => post.isPublished === true)
  .map(post => `/blog/${post.slug}`);

const allRoutes = [
  '/',
  '/about',
  '/blog',
  ...blogRoutes
];

console.log(JSON.stringify(allRoutes, null, 2));
