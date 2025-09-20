// Signal/Noise Analytics Tracking Endpoint

import { trackView } from './analytics-helper.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { path = '/' } = req.body;
    await trackView(path);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Track error:', error);
    return res.status(500).json({ error: 'Tracking failed' });
  }
}