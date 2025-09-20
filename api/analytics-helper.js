// Signal/Noise Analytics - SLC Simple Redis Tracking

import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN,
});

// Track page view
export const trackView = async (path = '/') => {
  const today = new Date().toISOString().split('T')[0];
  await redis.hincrby(`sn:analytics:${today}`, 'views', 1);
  await redis.hincrby(`sn:analytics:${today}`, `page:${path}`, 1);
};

// Get weekly data for intel report
export const getWeeklyData = async () => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(date.toISOString().split('T')[0]);
  }

  let totalViews = 0;
  const pages = {};

  for (const day of days) {
    const data = await redis.hgetall(`sn:analytics:${day}`);
    if (data.views) totalViews += parseInt(data.views);

    Object.entries(data).forEach(([key, value]) => {
      if (key.startsWith('page:')) {
        const page = key.substring(5);
        pages[page] = (pages[page] || 0) + parseInt(value);
      }
    });
  }

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