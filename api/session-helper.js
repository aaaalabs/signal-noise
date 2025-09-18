import { randomBytes } from 'crypto';

/**
 * Multi-Session Management Helper
 * Replaces single session_token per user with multiple concurrent sessions
 */

/**
 * Generate device type from user agent
 */
export function getDeviceType(userAgent = '') {
  if (userAgent.includes('iPhone')) return 'iPhone';
  if (userAgent.includes('iPad')) return 'iPad';
  if (userAgent.includes('Android')) return 'Android';
  if (userAgent.includes('Mac')) return 'Mac';
  if (userAgent.includes('Windows')) return 'Windows';
  return 'Desktop';
}

/**
 * Generate unique device ID (or use provided one)
 */
export function generateDeviceId() {
  return randomBytes(8).toString('hex');
}

/**
 * Create a new session for a user
 */
export async function createUserSession(redis, userEmail, userAgent = '', deviceId = null) {
  const sessionToken = randomBytes(32).toString('hex');
  const deviceType = getDeviceType(userAgent);
  const now = Date.now();

  const sessionData = {
    user_email: userEmail,
    device_type: deviceType,
    device_id: deviceId || generateDeviceId(),
    created: now.toString(),
    last_active: now.toString(),
    expires: (now + (30 * 24 * 60 * 60 * 1000)).toString() // 30 days
  };

  // Store session
  const sessionKey = `sn:session:${sessionToken}`;
  await redis.hset(sessionKey, sessionData);

  // Add to user's session list
  const userSessionsKey = `sn:u:${userEmail}:sessions`;
  await redis.sadd(userSessionsKey, sessionToken);

  console.log('✅ Session created:', {
    email: userEmail,
    device: deviceType,
    sessionToken: sessionToken.substring(0, 8) + '...'
  });

  return {
    sessionToken,
    deviceType,
    deviceId: sessionData.device_id,
    created: now,
    expires: parseInt(sessionData.expires)
  };
}

/**
 * Validate a session token and return user + session info
 */
export async function validateSession(redis, sessionToken) {
  // Handle development sessions
  if (sessionToken.startsWith('dev-session-token-')) {
    return {
      valid: true,
      user: {
        email: 'dev@signal-noise.test',
        firstName: 'Dev User',
        tier: 'early_adopter'
      },
      session: {
        deviceType: 'Development',
        lastActive: Date.now()
      }
    };
  }

  const sessionKey = `sn:session:${sessionToken}`;
  const sessionData = await redis.hgetall(sessionKey);

  if (!sessionData || Object.keys(sessionData).length === 0) {
    return { valid: false, error: 'Session not found' };
  }

  const now = Date.now();
  const expires = parseInt(sessionData.expires || '0');

  // Check if session expired
  if (now > expires) {
    // Clean up expired session
    await cleanupSession(redis, sessionToken);
    return { valid: false, error: 'Session expired' };
  }

  // Get user data
  const userKey = `sn:u:${sessionData.user_email}`;
  const userData = await redis.hgetall(userKey);

  if (!userData || Object.keys(userData).length === 0) {
    return { valid: false, error: 'User not found' };
  }

  if (userData.status !== 'active') {
    return { valid: false, error: 'User account not active' };
  }

  // Update session last_active
  await redis.hset(sessionKey, {
    last_active: now.toString()
  });

  return {
    valid: true,
    user: {
      email: userData.email,
      firstName: userData.first_name || '',
      tier: userData.tier || 'early_adopter',
      paymentType: userData.payment_type || 'lifetime',
      syncedFromLocal: userData.synced_from_local || null
    },
    session: {
      deviceType: sessionData.device_type,
      deviceId: sessionData.device_id,
      created: parseInt(sessionData.created),
      lastActive: now,
      expires: expires
    }
  };
}

/**
 * Find user by session token (for backward compatibility)
 */
export async function findUserBySession(redis, sessionToken) {
  const result = await validateSession(redis, sessionToken);
  return result.valid ? result.user : null;
}

/**
 * Clean up a single session
 */
export async function cleanupSession(redis, sessionToken) {
  const sessionKey = `sn:session:${sessionToken}`;
  const sessionData = await redis.hgetall(sessionKey);

  if (sessionData && sessionData.user_email) {
    // Remove from user's session list
    const userSessionsKey = `sn:u:${sessionData.user_email}:sessions`;
    await redis.srem(userSessionsKey, sessionToken);
  }

  // Delete session
  await redis.del(sessionKey);
}

/**
 * Get all active sessions for a user
 */
export async function getUserSessions(redis, userEmail) {
  const userSessionsKey = `sn:u:${userEmail}:sessions`;
  const sessionTokens = await redis.smembers(userSessionsKey);

  const sessions = [];
  const now = Date.now();

  for (const token of sessionTokens) {
    const sessionKey = `sn:session:${token}`;
    const sessionData = await redis.hgetall(sessionKey);

    if (sessionData && Object.keys(sessionData).length > 0) {
      const expires = parseInt(sessionData.expires || '0');

      if (now <= expires) {
        sessions.push({
          token: token.substring(0, 8) + '...',
          deviceType: sessionData.device_type,
          created: parseInt(sessionData.created),
          lastActive: parseInt(sessionData.last_active),
          expires: expires
        });
      } else {
        // Clean up expired session
        await cleanupSession(redis, token);
      }
    }
  }

  return sessions;
}

/**
 * Revoke all sessions for a user (for logout all devices)
 */
export async function revokeAllUserSessions(redis, userEmail) {
  const userSessionsKey = `sn:u:${userEmail}:sessions`;
  const sessionTokens = await redis.smembers(userSessionsKey);

  // Delete all sessions
  for (const token of sessionTokens) {
    const sessionKey = `sn:session:${token}`;
    await redis.del(sessionKey);
  }

  // Clear session list
  await redis.del(userSessionsKey);

  console.log('🗑️ All sessions revoked for user:', userEmail);
}

/**
 * Migrate legacy user from single session_token to multi-session
 */
export async function migrateLegacyUser(redis, userEmail, legacySessionToken, userAgent = '') {
  const userKey = `sn:u:${userEmail}`;

  // Check if user has legacy session_token
  const userData = await redis.hgetall(userKey);
  if (!userData.session_token) {
    return null; // Already migrated or no session
  }

  console.log('🔄 Migrating legacy user session:', userEmail);

  // Create new session from legacy token
  const sessionData = {
    user_email: userEmail,
    device_type: getDeviceType(userAgent),
    device_id: generateDeviceId(),
    created: userData.last_active || Date.now().toString(),
    last_active: userData.last_active || Date.now().toString(),
    expires: (Date.now() + (30 * 24 * 60 * 60 * 1000)).toString()
  };

  // Store new session using legacy token
  const sessionKey = `sn:session:${legacySessionToken}`;
  await redis.hset(sessionKey, sessionData);

  // Add to user's session list
  const userSessionsKey = `sn:u:${userEmail}:sessions`;
  await redis.sadd(userSessionsKey, legacySessionToken);

  // Remove legacy session_token from user data
  await redis.hdel(userKey, 'session_token');

  console.log('✅ Legacy user migrated:', userEmail);

  return legacySessionToken;
}