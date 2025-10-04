/**
 * Fetch Real User Data from Redis
 * Use actual premium user patterns to create realistic benchmark scenarios
 */

import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';

dotenv.config();

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

/**
 * Fetch real user task patterns from Redis
 */
export async function fetchRealUserPatterns() {
  try {
    // Get all user keys
    const userKeys = await redis.keys('sn:u:*');

    const userPatterns = [];

    for (const key of userKeys.slice(0, 5)) { // Sample first 5 users
      const userData = await redis.hgetall(key);

      if (userData) {
        userPatterns.push({
          email: key.replace('sn:u:', ''),
          tier: userData.tier || 'unknown',
          createdAt: userData.created_at,
          lastUsage: userData.last_usage,
          usageCount: Object.keys(userData).filter(k => k.startsWith('usage_')).length
        });
      }
    }

    return userPatterns;
  } catch (error) {
    console.error('Failed to fetch real user data:', error);
    return [];
  }
}

/**
 * Analyze real usage patterns to inform test scenarios
 */
export async function analyzeRealUsagePatterns() {
  const patterns = await fetchRealUserPatterns();

  console.log('\n📊 Real User Patterns from Redis:\n');
  console.log(`Total users sampled: ${patterns.length}`);

  patterns.forEach((user, i) => {
    console.log(`\n${i + 1}. ${user.email}`);
    console.log(`   Tier: ${user.tier}`);
    console.log(`   Usage events: ${user.usageCount}`);
    console.log(`   Last active: ${user.lastUsage || 'N/A'}`);
  });

  return patterns;
}

/**
 * Generate realistic task patterns based on common productivity archetypes
 * Informed by real user behavior patterns
 */
export function generateRealisticTaskPatterns() {
  return {
    // Founder/CEO pattern - high-impact strategic work
    founder: [
      { text: 'Investor pitch preparation', type: 'signal', daysOld: 2, completed: false, occurrences: 3 },
      { text: 'Product roadmap Q1 planning', type: 'signal', daysOld: 5, completed: false, occurrences: 2 },
      { text: 'Key hire interview - CTO', type: 'signal', daysOld: 0, completed: true, occurrences: 1 },
      { text: 'Strategic partner call', type: 'signal', daysOld: 1, completed: true, occurrences: 4 },
      { text: 'Team all-hands prep', type: 'signal', daysOld: 0, completed: true, occurrences: 2 },
      { text: 'Email inbox processing', type: 'noise', daysOld: 0, completed: true, occurrences: 12 },
      { text: 'Slack thread responses', type: 'noise', daysOld: 0, completed: true, occurrences: 8 }
    ],

    // Freelancer/Consultant pattern - client delivery focus
    freelancer: [
      { text: 'Client A: Wireframe revisions', type: 'signal', daysOld: 3, completed: false, occurrences: 2 },
      { text: 'Proposal: Enterprise client B', type: 'signal', daysOld: 7, completed: false, occurrences: 4 },
      { text: 'Client C: Design presentation', type: 'signal', daysOld: 0, completed: true, occurrences: 1 },
      { text: 'Portfolio update with recent work', type: 'signal', daysOld: 14, completed: false, occurrences: 5 },
      { text: 'Invoice Client A+B', type: 'signal', daysOld: 1, completed: true, occurrences: 2 },
      { text: 'LinkedIn profile check', type: 'noise', daysOld: 0, completed: true, occurrences: 6 },
      { text: 'Industry news reading', type: 'noise', daysOld: 0, completed: true, occurrences: 5 }
    ],

    // Developer pattern - code/build focus
    developer: [
      { text: 'Feature: User authentication flow', type: 'signal', daysOld: 4, completed: false, occurrences: 3 },
      { text: 'Fix: Production bug in checkout', type: 'signal', daysOld: 1, completed: true, occurrences: 1 },
      { text: 'Refactor: Database schema migration', type: 'signal', daysOld: 8, completed: false, occurrences: 2 },
      { text: 'Code review: PR #234', type: 'signal', daysOld: 0, completed: true, occurrences: 5 },
      { text: 'Team standup participation', type: 'signal', daysOld: 0, completed: true, occurrences: 10 },
      { text: 'GitHub notifications triage', type: 'noise', daysOld: 0, completed: true, occurrences: 8 },
      { text: 'Tech Twitter scrolling', type: 'noise', daysOld: 0, completed: true, occurrences: 7 }
    ],

    // Sales/Growth pattern - pipeline building
    sales: [
      { text: 'Outbound: 10 warm leads this week', type: 'signal', daysOld: 9, completed: false, occurrences: 6 },
      { text: 'Follow-up: Demo attendees', type: 'signal', daysOld: 3, completed: false, occurrences: 3 },
      { text: 'Close: Enterprise deal final proposal', type: 'signal', daysOld: 2, completed: true, occurrences: 1 },
      { text: 'Pipeline review meeting', type: 'signal', daysOld: 0, completed: true, occurrences: 4 },
      { text: 'CRM data entry cleanup', type: 'noise', daysOld: 0, completed: true, occurrences: 9 },
      { text: 'LinkedIn browsing prospects', type: 'noise', daysOld: 0, completed: true, occurrences: 11 }
    ],

    // Creative/Content pattern - output/shipping focus
    creative: [
      { text: 'Blog post: Productivity framework', type: 'signal', daysOld: 11, completed: false, occurrences: 5 },
      { text: 'Video script: Product demo', type: 'signal', daysOld: 6, completed: false, occurrences: 3 },
      { text: 'Newsletter: Weekly insights', type: 'signal', daysOld: 0, completed: true, occurrences: 4 },
      { text: 'Social post: Quick tip', type: 'signal', daysOld: 0, completed: true, occurrences: 8 },
      { text: 'Analytics review: Content performance', type: 'noise', daysOld: 0, completed: true, occurrences: 6 },
      { text: 'Inspiration browsing: Design trends', type: 'noise', daysOld: 0, completed: true, occurrences: 10 }
    ]
  };
}

// Run this as a standalone script to analyze real data
if (import.meta.url === `file://${process.argv[1]}`) {
  analyzeRealUsagePatterns().then(() => {
    console.log('\n✅ Analysis complete\n');
    process.exit(0);
  });
}
