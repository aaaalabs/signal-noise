/**
 * Redis Data Inspector - Find the exact task causing AI repetition
 * Shows ACTUAL data from Redis that AI sees
 */

import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

export default async function handler(req, res) {
  // Only allow in development or with admin token
  const isDev = process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV !== 'production';
  const adminToken = req.headers['x-admin-token'];

  if (!isDev && adminToken !== process.env.ADMIN_DEBUG_TOKEN) {
    return res.status(403).json({ error: 'Forbidden - Admin access required' });
  }

  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email parameter required' });
  }

  try {
    const userKey = `sn:u:${email}`;
    const userData = await redis.hgetall(userKey);

    if (!userData) {
      return res.status(404).json({
        error: 'User not found',
        searchedKey: userKey
      });
    }

    // Parse app_data to inspect tasks
    const appData = userData.app_data || { tasks: [] };
    const tasks = appData.tasks || [];

    // Find tasks matching "Lead Outreach" pattern
    const leadTasks = tasks.filter(t =>
      t.text && (
        t.text.toLowerCase().includes('lead') ||
        t.text.toLowerCase().includes('outreach') ||
        t.text.toLowerCase().includes('outrach')
      )
    );

    // Find the EXACT task from screenshot
    const exactTask = tasks.find(t => t.text === "min 3 personalisiere Lead Outraches");

    // Find uncompleted signals
    const uncompletedSignals = tasks.filter(t => t.type === 'signal' && !t.completed);

    // Recent tasks (last 7 days)
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const recentTasks = tasks.filter(t =>
      new Date(t.timestamp).getTime() > sevenDaysAgo
    );

    return res.json({
      summary: {
        email,
        userKey,
        firstName: userData.first_name || 'Not set',
        tier: userData.tier || 'unknown',
        totalTasks: tasks.length,
        uncompletedSignals: uncompletedSignals.length,
        recentTasks: recentTasks.length,
        hasExactTask: !!exactTask,
        exactTaskStatus: exactTask ? {
          id: exactTask.id,
          text: exactTask.text,
          type: exactTask.type,
          completed: exactTask.completed,
          timestamp: exactTask.timestamp,
          ageInDays: Math.floor((Date.now() - new Date(exactTask.timestamp).getTime()) / (1000 * 60 * 60 * 24))
        } : null
      },
      leadRelatedTasks: leadTasks.map(t => ({
        id: t.id,
        text: t.text,
        type: t.type,
        completed: t.completed,
        timestamp: t.timestamp,
        ageInDays: Math.floor((Date.now() - new Date(t.timestamp).getTime()) / (1000 * 60 * 60 * 24))
      })),
      uncompletedSignals: uncompletedSignals.slice(0, 10).map(t => ({
        id: t.id,
        text: t.text,
        ageInDays: Math.floor((Date.now() - new Date(t.timestamp).getTime()) / (1000 * 60 * 60 * 24))
      })),
      recentActivity: recentTasks.map(t => ({
        text: t.text,
        type: t.type,
        completed: t.completed,
        timestamp: t.timestamp
      }))
    });

  } catch (error) {
    console.error('❌ Redis inspection error:', error);
    return res.status(500).json({
      error: 'Failed to inspect Redis data',
      details: error.message
    });
  }
}
