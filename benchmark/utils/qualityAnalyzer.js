/**
 * Quality Analyzer
 * Evaluates AI coach responses for quality, personalization, and mock data detection
 */

import { BENCHMARK_CONFIG } from '../config.js';

/**
 * Analyze coach response quality across multiple dimensions
 */
export function analyzeResponseQuality(response, payload, scenario) {
  const scores = {
    personalization: scorePersonalization(response, payload, scenario),
    actionability: scoreActionability(response, payload),
    patternRecognition: scorePatternRecognition(response, payload, scenario),
    emotionalTone: scoreEmotionalTone(response, payload),
    brevity: scoreBrevity(response)
  };

  const mockDataFlags = detectMockData(response, payload, scenario);

  // Calculate weighted overall score
  const overallScore = Object.keys(scores).reduce((total, key) => {
    const weight = BENCHMARK_CONFIG.qualityMetrics[key].weight;
    return total + (scores[key] * weight / 100);
  }, 0);

  return {
    scores,
    overallScore: Math.round(overallScore),
    mockDataFlags,
    hasMockData: mockDataFlags.length > 0,
    grade: getGrade(overallScore),
    details: {
      strengths: identifyStrengths(scores, mockDataFlags),
      weaknesses: identifyWeaknesses(scores, mockDataFlags),
      recommendations: generateRecommendations(scores, mockDataFlags, scenario)
    }
  };
}

/**
 * Score personalization (0-100)
 */
function scorePersonalization(response, payload, scenario) {
  let score = 0;
  const message = response.message || '';

  // Uses firstName (30 points)
  if (message.includes(payload.firstName)) {
    score += 30;
  }

  // References specific task by exact text (40 points)
  const taskTexts = scenario.taskPatterns.map(p => p.text);
  const referencesSpecificTask = taskTexts.some(text => {
    // Check if task name appears in quotes or standalone
    return message.includes(`"${text}"`) ||
           message.includes(`'${text}'`) ||
           message.toLowerCase().includes(text.toLowerCase());
  });
  if (referencesSpecificTask) {
    score += 40;
  }

  // Acknowledges user context (30 points)
  const contextKeywords = [
    'streak', 'ratio', 'completion', 'pattern', 'today',
    String(payload.metrics.currentStreak),
    String(payload.context.currentRatio)
  ];
  const acknowledgesContext = contextKeywords.some(keyword =>
    message.toLowerCase().includes(keyword.toLowerCase())
  );
  if (acknowledgesContext) {
    score += 30;
  }

  return Math.min(score, 100);
}

/**
 * Score actionability (0-100)
 */
function scoreActionability(response, payload) {
  let score = 0;
  const message = response.message || '';
  const suggestions = response.suggestions || response.interventions || [];

  // Provides concrete next step (40 points)
  if (suggestions.length > 0) {
    score += 40;
  }

  // Includes time-bound action keywords (30 points)
  const timeKeywords = ['TODAY', 'NOW', 'JETZT', 'HEUTE', 'right now', 'sofort'];
  const hasTimebound = timeKeywords.some(keyword =>
    message.toUpperCase().includes(keyword.toUpperCase())
  );
  if (hasTimebound) {
    score += 30;
  }

  // Suggests specific starter step (30 points)
  const actionKeywords = ['open', 'start', 'write', 'call', 'message', 'öffnen', 'schreib', 'ruf'];
  const hasSpecificAction = actionKeywords.some(keyword =>
    message.toLowerCase().includes(keyword.toLowerCase())
  );
  if (hasSpecificAction) {
    score += 30;
  }

  return Math.min(score, 100);
}

/**
 * Score pattern recognition (0-100)
 */
function scorePatternRecognition(response, payload, scenario) {
  let score = 0;
  const message = response.message || '';
  const analysis = response.analysis || {};

  // Identifies behavioral pattern correctly (50 points)
  // Check BOTH message text AND analysis.patternDetected field
  const expectedPatterns = scenario.expectedInsights || [];

  // Check if pattern is in analysis field (Personal AI format)
  const patternInAnalysis = analysis.patternDetected && expectedPatterns.some(expected => {
    const detectedPattern = analysis.patternDetected.toLowerCase();
    if (expected.includes('perfectionism')) {
      return detectedPattern.includes('perfectionism') || detectedPattern.includes('perfect');
    }
    if (expected.includes('momentum')) {
      return detectedPattern.includes('momentum') || detectedPattern.includes('building');
    }
    if (expected.includes('context switching')) {
      return detectedPattern.includes('switch') || detectedPattern.includes('context');
    }
    if (expected.includes('recurring')) {
      return detectedPattern.includes('avoid') || detectedPattern.includes('recurring');
    }
    return false;
  });

  // Check if pattern is in message text (Pattern AI format)
  const patternInMessage = expectedPatterns.some(expected => {
    if (expected.includes('perfectionism')) {
      return message.toLowerCase().includes('perfekt') ||
             message.toLowerCase().includes('perfect') ||
             message.toLowerCase().includes('finalize') ||
             message.toLowerCase().includes('complete');
    }
    if (expected.includes('momentum')) {
      return message.toLowerCase().includes('momentum') ||
             message.toLowerCase().includes('streak');
    }
    if (expected.includes('context switching')) {
      return message.toLowerCase().includes('switch') ||
             message.toLowerCase().includes('scattered') ||
             message.toLowerCase().includes('focus');
    }
    if (expected.includes('recurring')) {
      return message.toLowerCase().includes('wieder') ||
             message.toLowerCase().includes('keeps appearing') ||
             message.toLowerCase().includes('repeatedly') ||
             message.toLowerCase().includes('old');
    }
    return false;
  });

  if (patternInAnalysis || patternInMessage) {
    score += 50;
  }

  // References completion reality (30 points)
  const completionKeywords = ['completed', 'erledigt', 'done', 'finished', 'abgeschlossen'];
  const addressesCompletion = completionKeywords.some(keyword =>
    message.toLowerCase().includes(keyword.toLowerCase())
  );
  if (addressesCompletion) {
    score += 30;
  }

  // Detects recurring tasks or themes (20 points)
  if (analysis.patternDetected || message.includes('taucht') || message.includes('keeps')) {
    score += 20;
  }

  return Math.min(score, 100);
}

/**
 * Score emotional tone appropriateness (0-100)
 */
function scoreEmotionalTone(response, payload) {
  let score = 50; // Start neutral
  const message = response.message || '';
  const tone = response.emotionalTone || response.analysis?.focusLevel || '';

  // Check tone matches ratio level
  const ratio = payload.context.currentRatio;

  if (ratio >= 80 && (tone.includes('celebrat') || tone.includes('encouraging'))) {
    score += 30;
  } else if (ratio < 50 && (tone.includes('direct') || tone.includes('warn'))) {
    score += 30;
  } else if (ratio >= 50 && ratio < 80 && tone.includes('supportive')) {
    score += 30;
  }

  // Balances encouragement with honesty (20 points)
  const hasBalance = message.length > 50 && !isOverlyGeneric(message);
  if (hasBalance) {
    score += 20;
  }

  return Math.min(score, 100);
}

/**
 * Score brevity and conciseness (0-100)
 */
function scoreBrevity(response) {
  let score = 100;
  const message = response.message || '';

  const words = message.split(/\s+/).length;
  const sentences = (message.match(/[.!?]+/g) || []).length;

  // Penalize if over 3 sentences in main message (-30 points)
  if (sentences > 3) {
    score -= 30;
  }

  // Penalize if over 200 words total (-40 points)
  if (words > 200) {
    score -= 40;
  }

  // Penalize repetition (-30 points)
  const uniqueWords = new Set(message.toLowerCase().split(/\s+/));
  const repetitionRatio = uniqueWords.size / words;
  if (repetitionRatio < 0.7) {
    score -= 30;
  }

  return Math.max(score, 0);
}

/**
 * Detect mock data / generic responses
 */
export function detectMockData(response, payload, scenario) {
  const flags = [];
  const message = (response.message || '').toLowerCase();

  // Check for generic phrases
  BENCHMARK_CONFIG.mockDataDetectors.genericPhrases.forEach(phrase => {
    if (message.includes(phrase.toLowerCase())) {
      flags.push({
        type: 'generic_phrase',
        detected: phrase,
        severity: 'medium'
      });
    }
  });

  // Check for vague actions
  BENCHMARK_CONFIG.mockDataDetectors.vagueActions.forEach(action => {
    if (message.includes(action.toLowerCase())) {
      flags.push({
        type: 'vague_action',
        detected: action,
        severity: 'high'
      });
    }
  });

  // Check for lack of specificity
  BENCHMARK_CONFIG.mockDataDetectors.lackOfSpecificity.forEach(vague => {
    if (message.includes(vague.toLowerCase())) {
      // Only flag if no specific task names are mentioned
      const taskTexts = scenario.taskPatterns.map(p => p.text.toLowerCase());
      const mentionsSpecificTask = taskTexts.some(text => message.includes(text));

      if (!mentionsSpecificTask) {
        flags.push({
          type: 'lack_of_specificity',
          detected: vague,
          severity: 'high'
        });
      }
    }
  });

  // Check if firstName is missing
  if (!message.includes(payload.firstName.toLowerCase())) {
    flags.push({
      type: 'missing_personalization',
      detected: 'no firstName usage',
      severity: 'critical'
    });
  }

  // Check for no specific task references
  const taskTexts = scenario.taskPatterns.map(p => p.text.toLowerCase());
  const mentionsAnyTask = taskTexts.some(text => message.includes(text));
  if (!mentionsAnyTask && scenario.expectedInsights.some(i => i.includes('specific'))) {
    flags.push({
      type: 'no_task_reference',
      detected: 'expected specific task mention but none found',
      severity: 'critical'
    });
  }

  return flags;
}

/**
 * Helper: Check if message is overly generic
 */
function isOverlyGeneric(message) {
  const genericIndicators = ['you can', 'try to', 'make sure', 'keep', 'stay'];
  const count = genericIndicators.filter(indicator =>
    message.toLowerCase().includes(indicator)
  ).length;
  return count >= 3; // If 3+ generic phrases, it's too generic
}

/**
 * Identify strengths from scores
 */
function identifyStrengths(scores, mockDataFlags) {
  const strengths = [];

  Object.entries(scores).forEach(([category, score]) => {
    if (score >= 80) {
      strengths.push(`Excellent ${category} (${score}/100)`);
    }
  });

  if (mockDataFlags.length === 0) {
    strengths.push('No mock data detected - authentic response');
  }

  return strengths;
}

/**
 * Identify weaknesses from scores
 */
function identifyWeaknesses(scores, mockDataFlags) {
  const weaknesses = [];

  Object.entries(scores).forEach(([category, score]) => {
    if (score < 50) {
      weaknesses.push(`Weak ${category} (${score}/100)`);
    }
  });

  mockDataFlags.forEach(flag => {
    if (flag.severity === 'critical') {
      weaknesses.push(`CRITICAL: ${flag.detected}`);
    }
  });

  return weaknesses;
}

/**
 * Generate improvement recommendations
 */
function generateRecommendations(scores, mockDataFlags, scenario) {
  const recommendations = [];

  if (scores.personalization < 70) {
    recommendations.push('Add specific task name mentions from user data');
    recommendations.push(`Use user's firstName (${scenario.profile.firstName}) more prominently`);
  }

  if (scores.actionability < 70) {
    recommendations.push('Include concrete, time-bound action (TODAY, NOW)');
    recommendations.push('Add specific 2-minute starter step');
  }

  if (scores.patternRecognition < 70) {
    recommendations.push('Identify and name the behavioral pattern explicitly');
    recommendations.push('Reference completion reality vs stated intentions');
  }

  mockDataFlags.forEach(flag => {
    if (flag.type === 'generic_phrase') {
      recommendations.push(`Remove generic phrase: "${flag.detected}"`);
    }
    if (flag.type === 'vague_action') {
      recommendations.push(`Replace vague action "${flag.detected}" with specific instruction`);
    }
  });

  return recommendations;
}

/**
 * Convert overall score to letter grade
 */
function getGrade(score) {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

/**
 * Compare two coach responses
 */
export function compareResponses(patternAIResult, personalAIResult) {
  return {
    winner: patternAIResult.overallScore > personalAIResult.overallScore
      ? 'Pattern AI'
      : 'Personal AI',
    scoreDifference: Math.abs(patternAIResult.overallScore - personalAIResult.overallScore),
    categoryWinners: {
      personalization: patternAIResult.scores.personalization > personalAIResult.scores.personalization
        ? 'Pattern AI'
        : 'Personal AI',
      actionability: patternAIResult.scores.actionability > personalAIResult.scores.actionability
        ? 'Pattern AI'
        : 'Personal AI',
      patternRecognition: patternAIResult.scores.patternRecognition > personalAIResult.scores.patternRecognition
        ? 'Pattern AI'
        : 'Personal AI',
      emotionalTone: patternAIResult.scores.emotionalTone > personalAIResult.scores.emotionalTone
        ? 'Pattern AI'
        : 'Personal AI',
      brevity: patternAIResult.scores.brevity > personalAIResult.scores.brevity
        ? 'Pattern AI'
        : 'Personal AI'
    },
    mockDataComparison: {
      patternAI: patternAIResult.mockDataFlags.length,
      personalAI: personalAIResult.mockDataFlags.length,
      winner: patternAIResult.mockDataFlags.length < personalAIResult.mockDataFlags.length
        ? 'Pattern AI (fewer mock data issues)'
        : 'Personal AI (fewer mock data issues)'
    }
  };
}
