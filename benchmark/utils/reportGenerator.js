/**
 * HTML Report Generator
 * Creates detailed visual reports of benchmark results
 */

import fs from 'fs';
import path from 'path';

export async function generateHTMLReport(results) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Coach Benchmark Report - ${new Date(results.metadata.timestamp).toLocaleString()}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #0a0a0a;
      color: #e0e0e0;
      padding: 40px 20px;
      line-height: 1.6;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
    }

    h1 {
      font-size: 36px;
      font-weight: 100;
      margin-bottom: 10px;
      color: #00ff88;
    }

    h2 {
      font-size: 24px;
      font-weight: 300;
      margin: 40px 0 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid #333;
    }

    h3 {
      font-size: 18px;
      font-weight: 500;
      margin: 20px 0 10px;
      color: #00ff88;
    }

    .metadata {
      color: #666;
      font-size: 14px;
      margin-bottom: 40px;
    }

    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin: 30px 0;
    }

    .summary-card {
      background: #1a1a1a;
      padding: 24px;
      border-radius: 12px;
      border: 1px solid #333;
    }

    .summary-card h3 {
      margin-top: 0;
    }

    .metric {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #222;
    }

    .metric:last-child {
      border-bottom: none;
    }

    .metric-label {
      color: #888;
    }

    .metric-value {
      font-weight: 500;
      color: #fff;
    }

    .grade-A { color: #00ff88; }
    .grade-B { color: #00d4ff; }
    .grade-C { color: #ffaa00; }
    .grade-D { color: #ff6600; }
    .grade-F { color: #ff3333; }

    .scenario-result {
      background: #1a1a1a;
      margin: 20px 0;
      padding: 24px;
      border-radius: 12px;
      border: 1px solid #333;
    }

    .scenario-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .scenario-title {
      font-size: 20px;
      font-weight: 500;
    }

    .winner-badge {
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      background: #00ff8820;
      color: #00ff88;
    }

    .ai-comparison {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .ai-result {
      background: #0f0f0f;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #222;
    }

    .ai-result.pattern-ai {
      border-left: 3px solid #0088ff;
    }

    .ai-result.personal-ai {
      border-left: 3px solid #aa00ff;
    }

    .ai-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .ai-name {
      font-weight: 500;
      font-size: 16px;
    }

    .score {
      font-size: 24px;
      font-weight: 100;
    }

    .message-box {
      background: #000;
      padding: 16px;
      border-radius: 6px;
      margin: 12px 0;
      font-size: 14px;
      line-height: 1.6;
      border-left: 3px solid #333;
    }

    .quality-scores {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 12px;
      margin: 16px 0;
    }

    .quality-metric {
      background: #0a0a0a;
      padding: 12px;
      border-radius: 6px;
      text-align: center;
    }

    .quality-label {
      font-size: 11px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .quality-score {
      font-size: 20px;
      font-weight: 500;
      margin-top: 4px;
    }

    .mock-flags {
      background: #1a0a0a;
      border: 1px solid #442222;
      border-radius: 6px;
      padding: 12px;
      margin: 12px 0;
    }

    .mock-flag {
      padding: 6px 0;
      font-size: 13px;
      color: #ff8888;
    }

    .flag-critical { color: #ff3333; font-weight: 500; }
    .flag-high { color: #ff8800; }
    .flag-medium { color: #ffaa00; }

    .recommendations {
      background: #0a1a0a;
      border: 1px solid #224422;
      border-radius: 6px;
      padding: 12px;
      margin: 12px 0;
    }

    .recommendation {
      padding: 6px 0;
      font-size: 13px;
      color: #88ff88;
    }

    .strengths {
      background: #0a1a0a;
      border: 1px solid #224422;
      border-radius: 6px;
      padding: 12px;
      margin: 12px 0;
    }

    .strength {
      padding: 4px 0;
      font-size: 13px;
      color: #88ff88;
    }

    .weaknesses {
      background: #1a0a0a;
      border: 1px solid #442222;
      border-radius: 6px;
      padding: 12px;
      margin: 12px 0;
    }

    .weakness {
      padding: 4px 0;
      font-size: 13px;
      color: #ff8888;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🎯 AI Coach Benchmark Report</h1>
    <div class="metadata">
      Generated: ${new Date(results.metadata.timestamp).toLocaleString()}<br>
      Total Tests: ${results.metadata.totalTests}<br>
      Successful: ${results.scenarios.filter(s => !s.error).length} | Failed: ${results.scenarios.filter(s => s.error).length}
    </div>

    <div class="summary">
      <div class="summary-card">
        <h3>🔵 Pattern AI</h3>
        <div class="metric">
          <span class="metric-label">Wins</span>
          <span class="metric-value">${results.summary.patternAI.wins}</span>
        </div>
        <div class="metric">
          <span class="metric-label">Average Score</span>
          <span class="metric-value grade-${getGrade(results.summary.patternAI.avgScore)}">${results.summary.patternAI.avgScore}/100</span>
        </div>
        <div class="metric">
          <span class="metric-label">Grade</span>
          <span class="metric-value grade-${getGrade(results.summary.patternAI.avgScore)}">${getGrade(results.summary.patternAI.avgScore)}</span>
        </div>
      </div>

      <div class="summary-card">
        <h3>🟣 Personal AI</h3>
        <div class="metric">
          <span class="metric-label">Wins</span>
          <span class="metric-value">${results.summary.personalAI.wins}</span>
        </div>
        <div class="metric">
          <span class="metric-label">Average Score</span>
          <span class="metric-value grade-${getGrade(results.summary.personalAI.avgScore)}">${results.summary.personalAI.avgScore}/100</span>
        </div>
        <div class="metric">
          <span class="metric-label">Grade</span>
          <span class="metric-value grade-${getGrade(results.summary.personalAI.avgScore)}">${getGrade(results.summary.personalAI.avgScore)}</span>
        </div>
      </div>
    </div>

    <h2>📊 Detailed Results</h2>
    ${results.scenarios.filter(s => !s.error).map(scenario => generateScenarioHTML(scenario)).join('\n')}
  </div>
</body>
</html>`;

  const reportPath = './benchmark/results/report.html';
  fs.writeFileSync(reportPath, html);
  console.log(`📄 HTML report saved to: ${reportPath}`);
}

function generateScenarioHTML(scenario) {
  return `
    <div class="scenario-result">
      <div class="scenario-header">
        <div class="scenario-title">${scenario.scenarioName} - ${scenario.user}</div>
        <div class="winner-badge">🏆 ${scenario.comparison.winner}</div>
      </div>

      <div class="ai-comparison">
        <div class="ai-result pattern-ai">
          <div class="ai-header">
            <span class="ai-name">🔵 Pattern AI</span>
            <span class="score grade-${scenario.patternAI.analysis.grade}">${scenario.patternAI.analysis.overallScore}/100</span>
          </div>

          <div class="message-box">
            ${scenario.patternAI.response.message || 'No message'}
          </div>

          <div class="quality-scores">
            ${Object.entries(scenario.patternAI.analysis.scores).map(([key, value]) => `
              <div class="quality-metric">
                <div class="quality-label">${key}</div>
                <div class="quality-score grade-${getScoreGrade(value)}">${value}</div>
              </div>
            `).join('')}
          </div>

          ${scenario.patternAI.analysis.mockDataFlags.length > 0 ? `
            <div class="mock-flags">
              <strong>⚠️ Mock Data Flags:</strong>
              ${scenario.patternAI.analysis.mockDataFlags.map(flag => `
                <div class="mock-flag flag-${flag.severity}">${flag.detected} (${flag.severity})</div>
              `).join('')}
            </div>
          ` : ''}

          ${scenario.patternAI.analysis.details.strengths.length > 0 ? `
            <div class="strengths">
              <strong>✅ Strengths:</strong>
              ${scenario.patternAI.analysis.details.strengths.map(s => `
                <div class="strength">• ${s}</div>
              `).join('')}
            </div>
          ` : ''}

          ${scenario.patternAI.analysis.details.weaknesses.length > 0 ? `
            <div class="weaknesses">
              <strong>❌ Weaknesses:</strong>
              ${scenario.patternAI.analysis.details.weaknesses.map(w => `
                <div class="weakness">• ${w}</div>
              `).join('')}
            </div>
          ` : ''}
        </div>

        <div class="ai-result personal-ai">
          <div class="ai-header">
            <span class="ai-name">🟣 Personal AI</span>
            <span class="score grade-${scenario.personalAI.analysis.grade}">${scenario.personalAI.analysis.overallScore}/100</span>
          </div>

          <div class="message-box">
            ${scenario.personalAI.response.message || 'No message'}
          </div>

          <div class="quality-scores">
            ${Object.entries(scenario.personalAI.analysis.scores).map(([key, value]) => `
              <div class="quality-metric">
                <div class="quality-label">${key}</div>
                <div class="quality-score grade-${getScoreGrade(value)}">${value}</div>
              </div>
            `).join('')}
          </div>

          ${scenario.personalAI.analysis.mockDataFlags.length > 0 ? `
            <div class="mock-flags">
              <strong>⚠️ Mock Data Flags:</strong>
              ${scenario.personalAI.analysis.mockDataFlags.map(flag => `
                <div class="mock-flag flag-${flag.severity}">${flag.detected} (${flag.severity})</div>
              `).join('')}
            </div>
          ` : ''}

          ${scenario.personalAI.analysis.details.strengths.length > 0 ? `
            <div class="strengths">
              <strong>✅ Strengths:</strong>
              ${scenario.personalAI.analysis.details.strengths.map(s => `
                <div class="strength">• ${s}</div>
              `).join('')}
            </div>
          ` : ''}

          ${scenario.personalAI.analysis.details.weaknesses.length > 0 ? `
            <div class="weaknesses">
              <strong>❌ Weaknesses:</strong>
              ${scenario.personalAI.analysis.details.weaknesses.map(w => `
                <div class="weakness">• ${w}</div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

function getGrade(score) {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

function getScoreGrade(score) {
  if (score >= 80) return 'A';
  if (score >= 60) return 'B';
  if (score >= 40) return 'C';
  return 'D';
}
