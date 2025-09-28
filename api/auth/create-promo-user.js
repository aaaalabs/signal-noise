import { Redis } from '@upstash/redis';
import { randomBytes } from 'crypto';
import { setUser } from '../redis-helper.js';
import { sendWelcomeEmail } from '../email-helper.js';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, firstName, promoCode, tier } = req.body;

    if (!email || !promoCode) {
      return res.status(400).json({ error: 'Email and promo code required' });
    }

    // Validate promo code
    if (promoCode.toUpperCase().trim() !== 'PH-PRELAUNCH') {
      return res.status(400).json({ error: 'Invalid promo code' });
    }

    console.log('🎁 Creating promo user:', { email, firstName, tier });

    // Generate access token (same format as Stripe users)
    const accessToken = 'snk_' + randomBytes(32).toString('hex');

    // Default app data structure (same as Stripe webhook)
    const defaultAppData = {
      tasks: [],
      history: [],
      badges: [],
      patterns: {},
      settings: {
        targetRatio: 80,
        notifications: false,
        firstName: firstName || ''
      },
      signal_ratio: 0
    };

    // Create user data exactly like Stripe webhook
    const userData = {
      email: email,
      access_token: accessToken,
      payment_type: 'promo_code',
      tier: tier || 'ph_prelaunch',
      status: 'active',
      created_at: Date.now().toString(),
      expires_at: new Date('2025-10-31 23:59:59').getTime().toString(),
      stripe_customer_id: '', // No Stripe customer for promo users
      payment_amount: '0', // Free access
      first_name: firstName || '',
      last_payment: Date.now().toString(),
      app_data: JSON.stringify(defaultAppData),
      app_data_initialized: new Date().toISOString(),
      promo_code: promoCode.toUpperCase(),
      source: 'product_hunt_prelaunch'
    };

    // Store user in Redis (same as Stripe webhook)
    await setUser(redis, email, userData);
    console.log('✅ Promo user successfully stored in Redis');

    // Verify user was stored
    const storedUser = await redis.hgetall(`sn:u:${email}`);
    console.log('🔍 Verification - Promo user stored:', storedUser);

    // Send welcome email with magic link (same as Stripe users)
    try {
      const tierName = 'Product Hunt Early Access';
      await sendWelcomeEmail(email, firstName, tierName, 'PROMO', accessToken);
      console.log('✅ Welcome email sent to promo user');
    } catch (error) {
      console.error('❌ Failed to send welcome email:', error);
      // Don't fail the entire request for email issues
    }

    console.log(`🎉 Product Hunt promo access granted for ${email} (expires Oct 31, 2025)`);

    return res.json({
      success: true,
      message: 'Premium access activated! Check your email for cloud access.',
      tier: tier || 'ph_prelaunch',
      expiresAt: '2025-10-31'
    });

  } catch (error) {
    console.error('❌ Promo user creation failed:', error);
    return res.status(500).json({
      error: 'Failed to activate promo code',
      details: error.message
    });
  }
}