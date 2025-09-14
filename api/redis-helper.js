// SLC Redis Helper for Signal/Noise
// Simple, clean key management for LibraLab projects

const PREFIX = 'sn:';

// Key generators - ultra simple
export const keys = {
  fcount: () => `${PREFIX}fcount`,
  user: (email) => `${PREFIX}u:${email}`,
  core: () => `${PREFIX}core`,
  magic: (token) => `${PREFIX}magic:${token}`,
  invoice: (invoiceNumber) => `${PREFIX}invoice:${invoiceNumber}`,
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
  return await redis.hgetall(keys.invoice(invoiceNumber));
}

export async function setInvoice(redis, invoiceNumber, data) {
  return await redis.hset(keys.invoice(invoiceNumber), data);
}

// Invoice token operations
export async function generateInvoiceToken(invoiceNumber, customerEmail) {
  const crypto = await import('crypto');
  const tokenData = `${invoiceNumber}:${customerEmail}:${Date.now()}`;
  return crypto.createHash('sha256').update(tokenData).digest('hex').substring(0, 32);
}

export async function setInvoiceToken(redis, token, invoiceNumber) {
  const tokenKey = `${PREFIX}itoken:${token}`;
  return await redis.set(tokenKey, invoiceNumber);
}

export async function getInvoiceByToken(redis, token) {
  const tokenKey = `${PREFIX}itoken:${token}`;
  const invoiceNumber = await redis.get(tokenKey);
  if (!invoiceNumber) return null;
  return await getInvoice(redis, invoiceNumber);
}

// Get user's invoice directly from their email
export async function getUserInvoice(redis, email) {
  const user = await getUser(redis, email);
  if (!user || !user.invoice_number) return null;
  return await getInvoice(redis, user.invoice_number);
}

// Get user's secure invoice token
export async function getUserInvoiceToken(redis, email) {
  const user = await getUser(redis, email);
  return user?.invoice_token || null;
}