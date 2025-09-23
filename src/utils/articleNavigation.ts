// Article navigation utilities
// Jony Ive Principle: Function serves user need without complexity

import { blogPosts } from '../components/BlogIndex';

export interface ArticleInfo {
  slug: string;
  title: string;
  titleDe?: string;
}

/**
 * Get the previous article in chronological order (published articles only)
 */
export function getPreviousArticle(currentSlug: string): ArticleInfo | undefined {
  // Filter to only published articles and sort by publication date (newest first)
  const publishedArticles = blogPosts
    .filter(post => post.isPublished)
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());

  const currentIndex = publishedArticles.findIndex(article => article.slug === currentSlug);

  if (currentIndex === -1 || currentIndex === publishedArticles.length - 1) {
    return undefined; // No previous article
  }

  const previousPost = publishedArticles[currentIndex + 1];
  return {
    slug: previousPost.slug,
    title: previousPost.title,
    titleDe: previousPost.titleDe
  };
}

/**
 * Get the next article in chronological order (published articles only)
 */
export function getNextArticle(currentSlug: string): ArticleInfo | undefined {
  // Filter to only published articles and sort by publication date (newest first)
  const publishedArticles = blogPosts
    .filter(post => post.isPublished)
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());

  const currentIndex = publishedArticles.findIndex(article => article.slug === currentSlug);

  if (currentIndex === -1 || currentIndex === 0) {
    return undefined; // No next article
  }

  const nextPost = publishedArticles[currentIndex - 1];
  return {
    slug: nextPost.slug,
    title: nextPost.title,
    titleDe: nextPost.titleDe
  };
}

/**
 * Get article position in series for context
 */
export function getArticlePosition(currentSlug: string): { current: number; total: number } {
  const publishedArticles = blogPosts
    .filter(post => post.isPublished)
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());

  const currentIndex = publishedArticles.findIndex(article => article.slug === currentSlug);

  return {
    current: currentIndex + 1,
    total: publishedArticles.length
  };
}