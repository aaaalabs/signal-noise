// Signal/Noise Analytics - SLC Single Key Redis Tracking

import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN,
});

const ANALYTICS_KEY = 'sn:analytics';

// Track page view
export const trackView = async (path = '/') => {
  await redis.hincrby(ANALYTICS_KEY, 'views', 1);
  await redis.hincrby(ANALYTICS_KEY, `page:${path}`, 1);
};

// Get all analytics data
export const getWeeklyData = async () => {
  const data = await redis.hgetall(ANALYTICS_KEY);

  if (!data || !data.views) {
    return {
      pageViews: 0,
      uniqueVisitors: 0,
      sessions: 0,
      topPages: []
    };
  }

  const totalViews = parseInt(data.views);
  const pages = {};

  Object.entries(data).forEach(([key, value]) => {
    if (key.startsWith('page:')) {
      const page = key.substring(5);
      pages[page] = parseInt(value);
    }
  });

  const topPages = Object.entries(pages)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([path, views]) => ({ path, views }));

  return {
    pageViews: totalViews,
    uniqueVisitors: Math.floor(totalViews * 0.7), // Estimate
    sessions: Math.floor(totalViews * 0.8), // Estimate
    topPages
  };
};