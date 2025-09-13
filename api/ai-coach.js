import { Redis } from '@upstash/redis';

// Initialize Redis for premium user verification
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
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
    const isPremium = await verifyPremiumAccess(userEmail, accessToken);
    if (!isPremium) {
      return res.status(403).json({
        error: 'Premium access required. Upgrade to use AI Coach.'
      });
    }

    // Check rate limit
    const isAllowed = await checkRateLimit(userEmail);
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

    // Log usage for monitoring
    await logUsage(userEmail);

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
    const userKey = `user:${email}`;
    const userData = await redis.hgetall(userKey);

    if (!userData || !userData.access_token) {
      return false;
    }

    // Check if access token matches
    if (userData.access_token !== accessToken) {
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

// Log usage for analytics
async function logUsage(email) {
  try {
    const timestamp = Date.now();
    const logKey = `usage:${email}:${new Date().toISOString().split('T')[0]}`;
    await redis.incr(logKey);
    await redis.expire(logKey, 86400 * 30); // 30 days
  } catch (error) {
    console.error('Usage logging error:', error);
  }
}