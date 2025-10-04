/**
 * Remove Specific Task from Redis
 * Allows admin/dev to remove the problematic task
 */

import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Only allow in development or with admin token
  const isDev = process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV !== 'production';
  const adminToken = req.headers['x-admin-token'];

  if (!isDev && adminToken !== process.env.ADMIN_DEBUG_TOKEN) {
    return res.status(403).json({ error: 'Forbidden - Admin access required' });
  }

  const { email, taskId, taskText } = req.body;

  if (!email || (!taskId && !taskText)) {
    return res.status(400).json({
      error: 'Email and (taskId OR taskText) required'
    });
  }

  try {
    const userKey = `sn:u:${email}`;
    const userData = await redis.hgetall(userKey);

    if (!userData) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Parse app_data
    const appData = userData.app_data || { tasks: [] };
    const tasksBefore = appData.tasks.length;

    // Filter out the specific task
    appData.tasks = appData.tasks.filter(t => {
      if (taskId && t.id === taskId) return false;
      if (taskText && t.text === taskText) return false;
      return true;
    });

    const tasksAfter = appData.tasks.length;
    const removed = tasksBefore - tasksAfter;

    if (removed === 0) {
      return res.status(404).json({
        error: 'Task not found',
        searchedBy: taskId ? `ID: ${taskId}` : `Text: ${taskText}`
      });
    }

    // Save back to Redis
    await redis.hset(userKey, {
      app_data: appData,
      last_modified: new Date().toISOString()
    });

    console.log(`✅ Removed ${removed} task(s) for ${email}`);

    return res.json({
      success: true,
      removed,
      tasksBefore,
      tasksAfter,
      message: `Removed ${removed} task(s) from Redis. User should refresh app to see changes.`
    });

  } catch (error) {
    console.error('❌ Task removal error:', error);
    return res.status(500).json({
      error: 'Failed to remove task',
      details: error.message
    });
  }
}
