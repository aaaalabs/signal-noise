#!/usr/bin/env node

/**
 * CLI for AI Coach Benchmark
 *
 * Usage:
 *   npm run benchmark              # Run all scenarios
 *   npm run benchmark -- --quick   # Run quick test (1 scenario)
 *   npm run benchmark -- --scenario perfectionist_trap
 *   npm run benchmark -- --user Tom
 *   npm run benchmark -- --report  # Generate HTML report from latest results
 */

import runBenchmark from './benchmarkRunner.js';
import { BENCHMARK_CONFIG } from './config.js';
import { generateHTMLReport } from './utils/reportGenerator.js';
import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);

// Parse CLI arguments
const options = {
  quick: args.includes('--quick'),
  report: args.includes('--report'),
  scenario: getArgValue('--scenario'),
  user: getArgValue('--user'),
  time: getArgValue('--time'),
  language: getArgValue('--lang') || 'en'
};

function getArgValue(flag) {
  const index = args.indexOf(flag);
  return index !== -1 && args[index + 1] ? args[index + 1] : null;
}

async function main() {
  console.log('🎯 AI Coach Benchmark Tool\n');

  // Generate report mode
  if (options.report) {
    console.log('📄 Generating HTML report from latest results...\n');
    const latestPath = './benchmark/results/latest.json';
    if (!fs.existsSync(latestPath)) {
      console.error('❌ No benchmark results found. Run benchmark first.');
      process.exit(1);
    }
    const results = JSON.parse(fs.readFileSync(latestPath, 'utf8'));
    await generateHTMLReport(results);
    console.log('✅ Report generated successfully');
    return;
  }

  // Configure benchmark run
  const benchmarkOptions = {
    language: options.language
  };

  // Filter scenarios
  if (options.quick) {
    benchmarkOptions.scenarios = [BENCHMARK_CONFIG.scenarios[0]];
    benchmarkOptions.users = [BENCHMARK_CONFIG.users[0]];
    benchmarkOptions.variations = {
      timeOfDay: [BENCHMARK_CONFIG.variations.timeOfDay[0]]
    };
    console.log('⚡ Quick mode: Running single scenario\n');
  } else if (options.scenario) {
    const scenario = BENCHMARK_CONFIG.scenarios.find(s => s.id === options.scenario);
    if (!scenario) {
      console.error(`❌ Scenario "${options.scenario}" not found`);
      console.log('\nAvailable scenarios:');
      BENCHMARK_CONFIG.scenarios.forEach(s => console.log(`  - ${s.id}`));
      process.exit(1);
    }
    benchmarkOptions.scenarios = [scenario];
    console.log(`📋 Testing scenario: ${scenario.name}\n`);
  }

  // Filter users
  if (options.user) {
    const user = BENCHMARK_CONFIG.users.find(u => u.firstName === options.user);
    if (!user) {
      console.error(`❌ User "${options.user}" not found`);
      console.log('\nAvailable users:');
      BENCHMARK_CONFIG.users.forEach(u => console.log(`  - ${u.firstName}`));
      process.exit(1);
    }
    benchmarkOptions.users = [user];
  }

  // Filter time variations
  if (options.time) {
    const time = BENCHMARK_CONFIG.variations.timeOfDay.find(t => t.label === options.time);
    if (!time) {
      console.error(`❌ Time "${options.time}" not found`);
      console.log('\nAvailable times:');
      BENCHMARK_CONFIG.variations.timeOfDay.forEach(t => console.log(`  - ${t.label}`));
      process.exit(1);
    }
    benchmarkOptions.variations = { timeOfDay: [time] };
  }

  // Run benchmark
  try {
    const results = await runBenchmark(benchmarkOptions);

    // Auto-generate HTML report
    console.log('\n📄 Generating HTML report...');
    await generateHTMLReport(results);

    console.log('\n✅ Benchmark complete!');
    console.log(`   View detailed report at: benchmark/results/report.html`);
  } catch (error) {
    console.error('\n❌ Benchmark failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
