// SLC Redis Helper for Signal/Noise
// Simple, clean key management for LibraLab projects

const PREFIX = 'sn:';

// Key generators - ultra simple
export const keys = {
  fcount: () => `${PREFIX}fcount`,
  user: (email) => `${PREFIX}u:${email}`,
  core: () => `${PREFIX}core`,
  magic: (token) => `${PREFIX}magic:${token}`,
  invoice: (invoiceNumber, token) => token ? `lib:invoice:${invoiceNumber}:${token}` : `lib:invoice:${invoiceNumber}`,
  invoiceSeq: () => `lib:ivnr`
};

// Foundation counter operations
export async function getFoundationCount(redis) {
  const count = await redis.get(keys.fcount());
  return parseInt(count) || 0;
}

export async function incrementFoundation(redis) {
  return await redis.incr(keys.fcount());
}

// User operations
export async function getUser(redis, email) {
  return await redis.hgetall(keys.user(email));
}

export async function setUser(redis, email, data) {
  return await redis.hset(keys.user(email), data);
}

export async function userExists(redis, email) {
  const result = await redis.exists(keys.user(email));
  return result === 1;
}

// Core stats operations
export async function getCore(redis) {
  return await redis.get(keys.core());
}

export async function setCore(redis, data) {
  return await redis.set(keys.core(), data);
}

// Magic link operations
export async function createMagicToken(redis, email, token, expiryMinutes = 15) {
  const expirySeconds = expiryMinutes * 60;
  return await redis.setex(keys.magic(token), expirySeconds, email);
}

export async function verifyMagicToken(redis, token) {
  const email = await redis.get(keys.magic(token));
  if (email) {
    // Delete token after use (one-time use)
    await redis.del(keys.magic(token));
    return email;
  }
  return null;
}

export async function deleteMagicToken(redis, token) {
  return await redis.del(keys.magic(token));
}

// Invoice operations
export async function generateInvoiceNumber(redis) {
  const sequence = await redis.incr('lib:ivnr');
  return `A${sequence}`;
}

export async function getInvoice(redis, invoiceNumber) {
  // First try legacy format (without token)
  const legacyData = await redis.hgetall(keys.invoice(invoiceNumber));
  if (legacyData && Object.keys(legacyData).length > 0) {
    return legacyData;
  }

  // If not found, search for token-embedded format
  const pattern = `lib:invoice:${invoiceNumber}:*`;
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    return await redis.hgetall(keys[0]);
  }

  // No invoice found
  return null;
}

export async function setInvoice(redis, invoiceNumber, data, token = null) {
  const key = token ? keys.invoice(invoiceNumber, token) : keys.invoice(invoiceNumber);
  return await redis.hset(key, data);
}

// Invoice token operations
export async function generateInvoiceToken(invoiceNumber, customerEmail) {
  const crypto = await import('crypto');
  const tokenData = `${invoiceNumber}:${customerEmail}:${Date.now()}`;
  return crypto.createHash('sha256').update(tokenData).digest('hex').substring(0, 32);
}

export async function getInvoiceByToken(redis, token) {
  // Search for invoice with this token in key structure
  const pattern = `lib:invoice:*:${token}`;
  const keys = await redis.keys(pattern);
  if (keys.length === 0) return null;

  // Extract invoice number from key: lib:invoice:A123:token -> A123
  const invoiceNumber = keys[0].split(':')[2];
  return await redis.hgetall(keys[0]);
}

// Get user's invoice directly from their email
export async function getUserInvoice(redis, email) {
  const user = await getUser(redis, email);
  if (!user) return null;

  // Prioritize token-based retrieval for security
  if (user.invoice_token) {
    return await getInvoiceByToken(redis, user.invoice_token);
  }

  // Fallback to invoice number lookup (for backward compatibility)
  if (user.invoice_number) {
    return await getInvoice(redis, user.invoice_number);
  }

  return null;
}

// Get user's secure invoice token
export async function getUserInvoiceToken(redis, email) {
  const user = await getUser(redis, email);
  return user?.invoice_token || null;
}

// LibraLab unified invoice aggregation functions
export async function getAllInvoices(redis) {
  const pattern = 'lib:invoice:*';
  const keys = await redis.keys(pattern);

  const invoices = [];
  for (const key of keys) {
    const invoiceData = await redis.hgetall(key);
    if (invoiceData && Object.keys(invoiceData).length > 0) {
      invoices.push(invoiceData);
    }
  }

  return invoices;
}

export async function getInvoiceStats(redis) {
  const invoices = await getAllInvoices(redis);

  const stats = {
    total: invoices.length,
    byType: {},
    byDomain: {},
    byCountry: {},
    totalRevenue: 0,
    recentInvoices: []
  };

  invoices.forEach(invoice => {
    // Count by type
    const type = invoice.type || 'unknown';
    stats.byType[type] = (stats.byType[type] || 0) + 1;

    // Count by domain
    const domain = invoice.domain || 'unknown';
    stats.byDomain[domain] = (stats.byDomain[domain] || 0) + 1;

    // Count by country
    const country = invoice.customer?.address?.country || 'Unknown';
    stats.byCountry[country] = (stats.byCountry[country] || 0) + 1;

    // Add to revenue
    const amount = parseFloat(invoice.totalAmount || invoice.amount || 0);
    stats.totalRevenue += amount;
  });

  // Sort by invoice number (most recent first) and take top 10
  stats.recentInvoices = invoices
    .sort((a, b) => (b.invoiceNumber || '').localeCompare(a.invoiceNumber || ''))
    .slice(0, 10);

  return stats;
}

// Usage tracking operations (in user hash)
export async function incrementUserUsage(redis, email, date = null) {
  const usageDate = date || new Date().toISOString().split('T')[0];
  const usageField = `usage_${usageDate.replace(/-/g, '_')}`;

  try {
    // Increment daily usage in user hash
    await redis.hincrby(keys.user(email), usageField, 1);

    // Also increment total usage counter
    await redis.hincrby(keys.user(email), 'usage_total', 1);

    // Cleanup old usage fields (>30 days) - run occasionally
    if (Math.random() < 0.1) { // 10% chance to run cleanup
      await cleanupOldUsageFields(redis, email);
    }
  } catch (error) {
    console.error('Usage increment error:', error);
  }
}

export async function getUserUsage(redis, email, date = null) {
  const usageDate = date || new Date().toISOString().split('T')[0];
  const usageField = `usage_${usageDate.replace(/-/g, '_')}`;

  try {
    const usage = await redis.hget(keys.user(email), usageField);
    return parseInt(usage) || 0;
  } catch (error) {
    console.error('Usage retrieval error:', error);
    return 0;
  }
}

// Clean up usage fields older than 30 days
async function cleanupOldUsageFields(redis, email) {
  try {
    const userData = await getUser(redis, email);
    if (!userData) return;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const cutoffDate = thirtyDaysAgo.toISOString().split('T')[0].replace(/-/g, '_');

    const fieldsToDelete = [];
    Object.keys(userData).forEach(field => {
      if (field.startsWith('usage_') && field !== 'usage_total') {
        // Extract date from field name (usage_2024_01_15)
        const fieldDate = field.substring(6); // Remove 'usage_'
        if (fieldDate < cutoffDate) {
          fieldsToDelete.push(field);
        }
      }
    });

    if (fieldsToDelete.length > 0) {
      await redis.hdel(keys.user(email), ...fieldsToDelete);
    }
  } catch (error) {
    console.error('Usage cleanup error:', error);
  }
}

// Rate limiting operations (consolidated in user hash)
export async function checkUserRateLimit(redis, email, rateLimitPerHour = 10) {
  try {
    const currentHour = new Date().toISOString().substring(0, 13); // YYYY-MM-DDTHH
    const rateLimitField = `rate_limit_${currentHour.replace(/[-:T]/g, '_')}`; // rate_limit_2024_01_15_14

    const currentCount = await redis.hget(keys.user(email), rateLimitField);
    const count = parseInt(currentCount) || 0;

    if (count >= rateLimitPerHour) {
      return false; // Rate limit exceeded
    }

    // Increment rate limit counter in user hash
    await redis.hincrby(keys.user(email), rateLimitField, 1);

    // Clean up old rate limit fields occasionally (>24 hours old)
    if (Math.random() < 0.1) { // 10% chance to run cleanup
      await cleanupOldRateLimitFields(redis, email);
    }

    return true;
  } catch (error) {
    console.error('Rate limit check error:', error);
    return true; // Allow on error
  }
}

// Clean up rate limit fields older than 24 hours
async function cleanupOldRateLimitFields(redis, email) {
  try {
    const userData = await getUser(redis, email);
    if (!userData) return;

    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
    const cutoffHour = twentyFourHoursAgo.toISOString().substring(0, 13).replace(/[-:T]/g, '_');

    const fieldsToDelete = [];
    Object.keys(userData).forEach(field => {
      if (field.startsWith('rate_limit_')) {
        // Extract hour from field name (rate_limit_2024_01_15_14)
        const fieldHour = field.substring(11); // Remove 'rate_limit_'
        if (fieldHour < cutoffHour) {
          fieldsToDelete.push(field);
        }
      }
    });

    if (fieldsToDelete.length > 0) {
      await redis.hdel(keys.user(email), ...fieldsToDelete);
    }
  } catch (error) {
    console.error('Rate limit cleanup error:', error);
  }
}