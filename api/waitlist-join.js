import { Redis } from '@upstash/redis';

// Initialize Redis client
const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, firstName } = req.body;

  // Validate email
  if (!email || !email.trim()) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  const userEmail = email.trim().toLowerCase();

  try {
    // Check if already on waitlist
    const existingUser = await redis.hgetall(`wl:u:${userEmail}`);
    if (existingUser && Object.keys(existingUser).length > 0) {
      return res.status(200).json({
        success: true,
        message: 'Already on the list!',
        position: existingUser.position || 0,
        alreadyExists: true
      });
    }

    // Check if waitlist is full
    const isFull = await redis.get('wl:full');
    if (isFull === 'true') {
      return res.status(200).json({
        success: false,
        message: 'Beta list is full (15/15). Please check back later!',
        waitlistFull: true
      });
    }

    // Add to waitlist
    const position = await redis.incr('wl:count');

    // Store user data
    await redis.hset(`wl:u:${userEmail}`, {
      email: userEmail,
      firstName: firstName || '',
      position: position,
      timestamp: Date.now(),
      source: 'web'
    });

    // Check if we've hit the limit
    if (position >= 15) {
      await redis.set('wl:full', 'true');
    }

    console.log(`✅ Added to waitlist: ${userEmail} (position #${position})`);

    // Return success response
    return res.status(200).json({
      success: true,
      message: `You're #${position} of 15!`,
      position: position,
      spotsLeft: Math.max(0, 15 - position)
    });

  } catch (error) {
    console.error('❌ Waitlist error:', error);
    return res.status(500).json({
      error: 'Failed to join waitlist',
      message: 'Please try again later'
    });
  }
}