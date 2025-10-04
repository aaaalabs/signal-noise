/**
 * AI Coach Benchmark Runner
 * Tests both Pattern AI and Personal AI across multiple scenarios
 */

import { BENCHMARK_CONFIG } from './config.js';
import { buildCoachingPayload } from './utils/testDataGenerator.js';
import { analyzeResponseQuality, compareResponses } from './utils/qualityAnalyzer.js';
import fs from 'fs';
import path from 'path';

const RESULTS_DIR = './benchmark/results';
const API_BASE_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

/**
 * Main benchmark execution
 */
export async function runBenchmark(options = {}) {
  const {
    scenarios = BENCHMARK_CONFIG.scenarios,
    users = BENCHMARK_CONFIG.users.slice(0, 1), // Default: first user only
    variations = { timeOfDay: [BENCHMARK_CONFIG.variations.timeOfDay[0]] },
    language = 'en'
  } = options;

  console.log('🚀 Starting AI Coach Benchmark');
  console.log(`📊 Scenarios: ${scenarios.length}`);
  console.log(`👥 Users: ${users.length}`);
  console.log(`🕐 Time variations: ${variations.timeOfDay?.length || 1}`);
  console.log(`🌍 Language: ${language}\n`);

  const results = {
    metadata: {
      timestamp: new Date().toISOString(),
      totalTests: scenarios.length * users.length * (variations.timeOfDay?.length || 1),
      config: options
    },
    scenarios: [],
    summary: {
      patternAI: { wins: 0, totalScore: 0, avgScore: 0 },
      personalAI: { wins: 0, totalScore: 0, avgScore: 0 }
    }
  };

  let testNumber = 0;

  for (const scenario of scenarios) {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`📋 Scenario: ${scenario.name}`);
    console.log(`${'='.repeat(80)}`);

    for (const user of users) {
      for (const timeVariation of variations.timeOfDay || [{}]) {
        testNumber++;
        console.log(`\n[Test ${testNumber}/${results.metadata.totalTests}] ${user.firstName} at ${timeVariation.label || 'default'} time`);

        try {
          // Build payload
          const payload = buildCoachingPayload(scenario, user, {
            timeOfDay: timeVariation,
            language
          });

          // Test Pattern AI
          console.log('  🔵 Testing Pattern AI...');
          const patternAIResponse = await callPatternAI(payload, user.email);
          const patternAIAnalysis = analyzeResponseQuality(
            patternAIResponse,
            payload,
            scenario
          );

          // Test Personal AI
          console.log('  🟣 Testing Personal AI...');
          const personalAIResponse = await callPersonalAI(payload, user.email);
          const personalAIAnalysis = analyzeResponseQuality(
            personalAIResponse,
            payload,
            scenario
          );

          // Compare results
          const comparison = compareResponses(patternAIAnalysis, personalAIAnalysis);

          // Store results
          results.scenarios.push({
            scenarioId: scenario.id,
            scenarioName: scenario.name,
            user: user.firstName,
            timeOfDay: timeVariation.label || 'default',
            patternAI: {
              response: patternAIResponse,
              analysis: patternAIAnalysis
            },
            personalAI: {
              response: personalAIResponse,
              analysis: personalAIAnalysis
            },
            comparison
          });

          // Update summary
          if (comparison.winner === 'Pattern AI') {
            results.summary.patternAI.wins++;
          } else {
            results.summary.personalAI.wins++;
          }
          results.summary.patternAI.totalScore += patternAIAnalysis.overallScore;
          results.summary.personalAI.totalScore += personalAIAnalysis.overallScore;

          // Print quick results
          console.log(`  ✅ Pattern AI: ${patternAIAnalysis.overallScore}/100 (${patternAIAnalysis.grade})`);
          console.log(`  ✅ Personal AI: ${personalAIAnalysis.overallScore}/100 (${personalAIAnalysis.grade})`);
          console.log(`  🏆 Winner: ${comparison.winner}`);

          if (patternAIAnalysis.hasMockData) {
            console.log(`  ⚠️  Pattern AI mock data flags: ${patternAIAnalysis.mockDataFlags.length}`);
          }
          if (personalAIAnalysis.hasMockData) {
            console.log(`  ⚠️  Personal AI mock data flags: ${personalAIAnalysis.mockDataFlags.length}`);
          }

          // Rate limiting delay
          await delay(3000);

        } catch (error) {
          console.error(`  ❌ Test failed: ${error.message}`);
          results.scenarios.push({
            scenarioId: scenario.id,
            scenarioName: scenario.name,
            user: user.firstName,
            error: error.message
          });
        }
      }
    }
  }

  // Calculate final averages
  const totalTests = results.scenarios.filter(s => !s.error).length;
  results.summary.patternAI.avgScore = Math.round(
    results.summary.patternAI.totalScore / totalTests
  );
  results.summary.personalAI.avgScore = Math.round(
    results.summary.personalAI.totalScore / totalTests
  );

  // Save results
  await saveResults(results);

  // Print summary
  printSummary(results);

  return results;
}

/**
 * Call Pattern AI endpoint
 */
async function callPatternAI(payload, userEmail) {
  try {
    // Build messages for Pattern AI format
    const response = await fetch(`${API_BASE_URL}/api/ai-coach`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: `Analyze these productivity data for ${payload.firstName}:

CONTEXT:
- Current Ratio: ${payload.context.currentRatio}%
- Today's Tasks: ${payload.context.todayTasks}
- Trigger: ${payload.context.triggerType}

METRICS:
- Streak: ${payload.metrics.currentStreak} days
- 7-day Average: ${payload.metrics.averageRatio7Days}%
- Trend: ${payload.patterns.trendDirection}
- Best Hour: ${payload.patterns.bestHour} o'clock

Return a personalized coaching message.`
          }
        ],
        userEmail: userEmail || 'beta@signal-noise.test',
        accessToken: 'legacy-token'
      })
    });

    if (!response.ok) {
      throw new Error(`Pattern AI API error: ${response.status}`);
    }

    const data = await response.json();

    // Parse JSON response if needed
    try {
      const content = data.message || data.choices?.[0]?.message?.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return { message: content, type: 'insight', emotionalTone: 'supportive' };
    } catch (e) {
      return { message: data.message || 'No response', type: 'insight', emotionalTone: 'supportive' };
    }
  } catch (error) {
    console.error('Pattern AI call failed:', error.message);
    return {
      message: 'Pattern AI unavailable',
      type: 'error',
      emotionalTone: 'supportive',
      _error: error.message
    };
  }
}

/**
 * Call Personal AI endpoint
 */
async function callPersonalAI(payload, userEmail) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/personal-ai-coach`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        payload,
        userEmail: userEmail || 'personal-ai@signal-noise.test',
        accessToken: 'legacy-token'
      })
    });

    if (!response.ok) {
      throw new Error(`Personal AI API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Personal AI call failed:', error.message);
    return {
      action: 'error',
      message: 'Personal AI unavailable',
      _error: error.message
    };
  }
}

/**
 * Save results to file
 */
async function saveResults(results) {
  if (!fs.existsSync(RESULTS_DIR)) {
    fs.mkdirSync(RESULTS_DIR, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `benchmark-${timestamp}.json`;
  const filepath = path.join(RESULTS_DIR, filename);

  fs.writeFileSync(filepath, JSON.stringify(results, null, 2));
  console.log(`\n💾 Results saved to: ${filepath}`);

  // Also save a "latest" file for easy access
  const latestPath = path.join(RESULTS_DIR, 'latest.json');
  fs.writeFileSync(latestPath, JSON.stringify(results, null, 2));
}

/**
 * Print summary report
 */
function printSummary(results) {
  console.log(`\n${'='.repeat(80)}`);
  console.log('📊 BENCHMARK SUMMARY');
  console.log(`${'='.repeat(80)}\n`);

  console.log(`Total Tests: ${results.metadata.totalTests}`);
  console.log(`Successful: ${results.scenarios.filter(s => !s.error).length}`);
  console.log(`Failed: ${results.scenarios.filter(s => s.error).length}\n`);

  console.log('🔵 PATTERN AI:');
  console.log(`  Wins: ${results.summary.patternAI.wins}`);
  console.log(`  Average Score: ${results.summary.patternAI.avgScore}/100`);
  console.log(`  Grade: ${getGrade(results.summary.patternAI.avgScore)}\n`);

  console.log('🟣 PERSONAL AI:');
  console.log(`  Wins: ${results.summary.personalAI.wins}`);
  console.log(`  Average Score: ${results.summary.personalAI.avgScore}/100`);
  console.log(`  Grade: ${getGrade(results.summary.personalAI.avgScore)}\n`);

  const winner = results.summary.patternAI.avgScore > results.summary.personalAI.avgScore
    ? 'PATTERN AI'
    : 'PERSONAL AI';
  console.log(`🏆 OVERALL WINNER: ${winner}\n`);

  // Mock data analysis
  const patternAIMockCount = results.scenarios.reduce(
    (sum, s) => sum + (s.patternAI?.analysis?.mockDataFlags?.length || 0),
    0
  );
  const personalAIMockCount = results.scenarios.reduce(
    (sum, s) => sum + (s.personalAI?.analysis?.mockDataFlags?.length || 0),
    0
  );

  console.log('🔍 MOCK DATA DETECTION:');
  console.log(`  Pattern AI flags: ${patternAIMockCount}`);
  console.log(`  Personal AI flags: ${personalAIMockCount}\n`);

  console.log(`${'='.repeat(80)}\n`);
}

function getGrade(score) {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Export for CLI usage
export default runBenchmark;
