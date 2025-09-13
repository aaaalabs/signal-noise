// SLC Redis Helper for Signal/Noise
// Simple, clean key management for LibraLab projects

const PREFIX = 'sn:';

// Key generators - ultra simple
export const keys = {
  fcount: () => `${PREFIX}fcount`,
  user: (email) => `${PREFIX}u:${email}`,
  core: () => `${PREFIX}core`
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