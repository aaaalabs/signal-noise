import { Redis } from '@upstash/redis';
import { incrementUserUsage } from './redis-helper.js';

// Initialize Redis for premium user verification
const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

// Rate limiting per user
const RATE_LIMIT = 10; // requests per hour
const RATE_WINDOW = 3600; // 1 hour in seconds

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, userEmail, accessToken } = req.body;

    // Validate required fields
    if (!messages || !userEmail || !accessToken) {
      return res.status(400).json({
        error: 'Missing required fields: messages, userEmail, accessToken'
      });
    }

    // Verify premium access
    const isDev = process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV !== 'production';
    const isDevUser = userEmail === 'dev@signal-noise.test';
    const isBetaUser = userEmail === 'beta@signal-noise.test';

    // Allow beta users in both dev and production for testing
    const isPremium = (isDev && isDevUser) || isBetaUser || await verifyPremiumAccess(userEmail, accessToken);
    if (!isPremium) {
      return res.status(403).json({
        error: 'Premium access required. Upgrade to use AI Coach.'
      });
    }

    // Check rate limit (skip for dev users and beta users everywhere)
    const isAllowed = (isDev && isDevUser) || isBetaUser || await checkRateLimit(userEmail);
    if (!isAllowed) {
      return res.status(429).json({
        error: 'Rate limit exceeded. Premium users get 10 requests per hour.'
      });
    }

    // Call Groq API
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are a personal productivity coach for Signal/Noise app. Be encouraging, specific, and actionable. Address the user personally but keep responses under 200 words. Focus on the 80/20 principle - help them identify what truly matters (Signal) vs distractions (Noise).`
          },
          ...messages
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!groqResponse.ok) {
      throw new Error(`Groq API error: ${groqResponse.status}`);
    }

    const data = await groqResponse.json();

    // Log usage for monitoring (in user hash)
    await incrementUserUsage(redis, userEmail);

    return res.status(200).json({
      message: data.choices[0]?.message?.content || 'No response generated',
      usage: data.usage,
    });

  } catch (error) {
    console.error('AI Coach API Error:', error);
    return res.status(500).json({
      error: 'Internal server error. Please try again later.'
    });
  }
}

// Verify premium access using Redis
async function verifyPremiumAccess(email, accessToken) {
  try {
    const userKey = `sn:u:${email}`;
    const userData = await redis.hgetall(userKey);

    if (!userData) {
      return false;
    }

    // Temporary MVP fallback: accept legacy-token or subscription IDs
    if (accessToken === 'legacy-token') {
      // Check if user has any premium status
      return userData.status === 'active' || userData.payment_status === 'paid';
    }

    // Standard access token verification
    if (userData.access_token && userData.access_token !== accessToken) {
      return false;
    }

    // Check if access is still valid
    const now = Date.now();
    const expiresAt = parseInt(userData.expires_at || '0');

    // For lifetime access, expires_at can be 0 or very far in future
    if (userData.payment_type === 'lifetime') {
      return userData.status === 'active';
    }

    // For subscription, check expiry
    return userData.status === 'active' && (expiresAt === 0 || expiresAt > now);

  } catch (error) {
    console.error('Premium verification error:', error);
    return false;
  }
}

// Rate limiting using Redis
async function checkRateLimit(email) {
  try {
    const key = `rate_limit:${email}`;
    const current = await redis.get(key);

    if (!current) {
      // First request in window
      await redis.setex(key, RATE_WINDOW, 1);
      return true;
    }

    const count = parseInt(current);
    if (count >= RATE_LIMIT) {
      return false;
    }

    // Increment counter
    await redis.incr(key);
    return true;

  } catch (error) {
    console.error('Rate limit error:', error);
    return true; // Allow on error
  }
}

