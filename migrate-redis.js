// One-time migration script: Old Redis keys → New SLC structure
// Run once and delete this file
import { Redis } from '@upstash/redis';
import { config } from 'dotenv';
import { keys } from './api/redis-helper.js';

// Load environment variables
config({ path: '.env.local' });

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

async function migrate() {
  console.log('🚀 Starting Redis migration to SLC structure...\n');

  try {
    // 1. Migrate Foundation counter
    console.log('📊 Migrating Foundation counter...');
    const oldCount = await redis.get('foundation_members_count');
    if (oldCount !== null) {
      console.log(`Found old counter: ${oldCount}`);
      await redis.set(keys.fcount(), oldCount);
      console.log(`✅ Migrated to ${keys.fcount()}: ${oldCount}`);

      // Keep old key for 7 days as backup
      console.log('📦 Keeping old key as backup for 7 days');
    } else {
      console.log('No old foundation counter found');
      // Initialize new counter
      await redis.set(keys.fcount(), 0);
      console.log(`✅ Initialized ${keys.fcount()}: 0`);
    }

    // 2. Migrate user data
    console.log('\n👥 Migrating user data...');
    const oldUserKeys = await redis.keys('user:*');
    console.log(`Found ${oldUserKeys.length} old user keys`);

    let migratedUsers = 0;
    for (const oldKey of oldUserKeys) {
      const email = oldKey.replace('user:', '');
      console.log(`Migrating user: ${email}`);

      // Try both JSON and Hash formats
      let userData = null;
      try {
        // First try as JSON object
        userData = await redis.get(oldKey);
        if (userData && typeof userData === 'object') {
          await redis.hset(keys.user(email), userData);
          console.log(`✅ Migrated JSON to ${keys.user(email)}`);
          migratedUsers++;
        }
      } catch (error) {
        try {
          // Fallback: try as Hash
          userData = await redis.hgetall(oldKey);
          if (userData && Object.keys(userData).length > 0) {
            await redis.hset(keys.user(email), userData);
            console.log(`✅ Migrated Hash to ${keys.user(email)}`);
            migratedUsers++;
          }
        } catch (hashError) {
          console.log(`⚠️  Skipping ${oldKey}: ${error.message}`);
        }
      }
    }

    // 3. Initialize stats if needed
    console.log('\n📈 Setting up stats...');
    const statsData = {
      lastMigration: new Date().toISOString(),
      version: '1.0.0',
      migratedUsers: migratedUsers,
      foundationMembers: await redis.get(keys.fcount())
    };
    await redis.set(keys.core(), JSON.stringify(statsData));
    console.log(`✅ Core stats initialized at ${keys.core()}`);

    // 4. Verification
    console.log('\n🔍 Verifying migration...');
    const newCount = await redis.get(keys.fcount());
    const newCore = await redis.get(keys.core());

    console.log(`Foundation count: ${newCount}`);
    console.log(`Migrated users: ${migratedUsers}`);
    console.log(`Core stats: ${newCore}`);

    console.log('\n🎉 Migration completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`├── Foundation counter: ${oldCount || 0} → ${newCount}`);
    console.log(`├── Users migrated: ${migratedUsers}`);
    console.log(`└── New keys created: ${keys.fcount()}, ${keys.core()}, ${migratedUsers} user keys`);

    console.log('\n⚠️  Old keys preserved as backup for 7 days');
    console.log('💡 Test the application, then run cleanup script if everything works');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

async function cleanup() {
  console.log('🧹 Cleaning up old keys...');

  // Remove old keys
  const oldCount = await redis.del('foundation_members_count');
  const oldUserKeys = await redis.keys('user:*');

  if (oldUserKeys.length > 0) {
    await redis.del(...oldUserKeys);
  }

  console.log(`✅ Cleaned up: foundation_members_count + ${oldUserKeys.length} user keys`);
}

async function status() {
  console.log('📊 Current Redis Status:\n');

  const foundationCount = await redis.get(keys.fcount());
  const coreStats = await redis.get(keys.core());
  const userKeys = await redis.keys(keys.user('*'));

  console.log(`Foundation count: ${foundationCount || 'Not set'}`);
  console.log(`Active users: ${userKeys.length}`);
  console.log(`Core stats: ${coreStats || 'Not set'}`);

  // Check for old keys
  const oldCount = await redis.get('foundation_members_count');
  const oldUsers = await redis.keys('user:*');

  if (oldCount !== null || oldUsers.length > 0) {
    console.log('\n⚠️  Old keys still present:');
    if (oldCount !== null) console.log(`├── foundation_members_count: ${oldCount}`);
    if (oldUsers.length > 0) console.log(`└── user:* keys: ${oldUsers.length}`);
  } else {
    console.log('\n✅ Migration complete - no old keys found');
  }
}

// Command line interface
const command = process.argv[2];

switch (command) {
  case 'migrate':
    migrate();
    break;
  case 'cleanup':
    cleanup();
    break;
  case 'status':
    status();
    break;
  default:
    console.log('Usage:');
    console.log('  node migrate-redis.js migrate  # Run migration');
    console.log('  node migrate-redis.js status   # Check status');
    console.log('  node migrate-redis.js cleanup  # Remove old keys');
}