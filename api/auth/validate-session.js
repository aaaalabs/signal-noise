import { Redis } from '@upstash/redis';
import { validateSession } from '../session-helper.js';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const sessionToken = authHeader.substring(7);

    console.log('🔍 Validating session:', sessionToken.substring(0, 8) + '...');

    // Use new multi-session validation
    const result = await validateSession(redis, sessionToken);

    if (!result.valid) {
      console.log('❌ Session validation failed:', result.error);
      return res.status(result.error === 'Session expired' ? 401 : 404).json({
        error: result.error,
        valid: false
      });
    }

    console.log('✅ Session validated for:', result.user.email, 'on', result.session.deviceType);

    // Return session validation result
    return res.status(200).json({
      valid: true,
      user: {
        email: result.user.email,
        firstName: result.user.firstName,
        tier: result.user.tier,
        paymentType: result.user.paymentType,
        lastActive: result.session.lastActive,
        expires: result.session.expires,
        syncedFromLocal: result.user.syncedFromLocal
      }
    });

  } catch (error) {
    console.error('❌ Session validation error:', error);
    return res.status(500).json({
      error: 'Failed to validate session',
      valid: false
    });
  }
}