import type { PersonalAIResponse, CoachPayload } from '../types';
import { checkPremiumStatus } from './premiumService';

/**
 * PersonalAI Service - Separate from standard groqService
 * Uses llama-4-maverick-17b-128e-instruct with structured JSON output
 */

export interface PersonalAIRequest {
  payload: CoachPayload & {
    deepTaskAnalysis?: {
      allTasks: Array<{
        text: string;
        type: string;
        completed: boolean;
        ageInDays: number;
      }>;
      completionReality: {
        totalSignals: number;
        completedSignals: number;
        completionRate: string;
        abandonedSignals: Array<{
          text: string;
          ageInDays: number;
        }>;
        oldestUncompletedSignal?: {
          text: string;
          ageInDays: number;
        };
      };
    };
  };
  userEmail: string;
  accessToken: string;
}

export async function getPersonalAIAdvice(
  payload: CoachPayload,
  options?: { deepTaskAnalysis?: any }
): Promise<PersonalAIResponse> {
  // Get premium status from localStorage
  const premiumStatus = checkPremiumStatus();

  if (!premiumStatus.isActive || !premiumStatus.email) {
    throw new Error('Premium access required for PersonalAI');
  }

  try {
    // Prepare enhanced payload for PersonalAI
    const enhancedPayload = {
      ...payload,
      ...options
    };

    // Create request for PersonalAI endpoint
    const requestData: PersonalAIRequest = {
      payload: enhancedPayload,
      userEmail: premiumStatus.email,
      accessToken: premiumStatus.subscriptionId || 'legacy-token'
    };

    console.log('🤖 PersonalAI request:', {
      user: premiumStatus.email,
      tasks: enhancedPayload.history.recentTasks.length,
      ratio: enhancedPayload.context.currentRatio
    });

    // Call PersonalAI endpoint
    const response = await fetch('/api/personal-ai-coach', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `PersonalAI API error: ${response.status}`);
    }

    const personalAIResponse: PersonalAIResponse = await response.json();

    // Validate response structure
    if (!isValidPersonalAIResponse(personalAIResponse)) {
      throw new Error('Invalid PersonalAI response structure');
    }

    console.log('✨ PersonalAI response:', {
      action: personalAIResponse.action,
      priority: personalAIResponse.priority,
      interventions: personalAIResponse.interventions.length,
      focusLevel: personalAIResponse.analysis.focusLevel
    });

    return personalAIResponse;

  } catch (error) {
    console.error('PersonalAI service error:', error);

    // Provide enhanced fallback for PersonalAI
    return createPersonalAIFallback(payload);
  }
}

/**
 * Validate PersonalAI response structure
 */
function isValidPersonalAIResponse(response: any): response is PersonalAIResponse {
  return (
    response &&
    typeof response === 'object' &&
    typeof response.action === 'string' &&
    ['celebrate', 'nudge', 'warn', 'focus', 'reset'].includes(response.action) &&
    typeof response.priority === 'string' &&
    ['urgent', 'high', 'normal', 'low'].includes(response.priority) &&
    typeof response.message === 'string' &&
    response.analysis &&
    typeof response.analysis.patternDetected === 'string' &&
    typeof response.analysis.completionReality === 'number' &&
    typeof response.analysis.focusLevel === 'string' &&
    typeof response.analysis.timeContext === 'string' &&
    Array.isArray(response.interventions) &&
    response.metrics &&
    typeof response.metrics.momentumScore === 'number' &&
    typeof response.metrics.decisionQuality === 'number' &&
    typeof response.metrics.predictedSuccess === 'number'
  );
}

/**
 * Create intelligent fallback response for PersonalAI
 */
function createPersonalAIFallback(payload: CoachPayload): PersonalAIResponse {
  const { firstName, context, metrics } = payload;
  const ratio = context.currentRatio;
  const hour = new Date().getHours();

  // Determine action based on current state
  let action: PersonalAIResponse['action'];
  let priority: PersonalAIResponse['priority'];
  let message: string;

  if (ratio >= 90) {
    action = 'celebrate';
    priority = 'normal';
    message = `${firstName}, you're crushing it at ${ratio}%! Your focus is razor-sharp right now.`;
  } else if (ratio <= 40) {
    action = 'reset';
    priority = 'high';
    message = `${firstName}, time for a reset. At ${ratio}%, we need to refocus on what truly matters.`;
  } else if (ratio <= 60) {
    action = 'warn';
    priority = 'normal';
    message = `${firstName}, you're at ${ratio}% - let's tighten the focus before we lose momentum.`;
  } else if (metrics.currentStreak >= 7) {
    action = 'celebrate';
    priority = 'low';
    message = `${firstName}, ${metrics.currentStreak} days strong! Your consistency is paying off.`;
  } else {
    action = 'nudge';
    priority = 'normal';
    message = `${firstName}, you're at ${ratio}% - good momentum. Let's push for that 80% sweet spot.`;
  }

  // Time context awareness
  const timeContext = hour < 9 ? 'peak' : hour < 14 ? 'productive' : hour < 17 ? 'declining' : 'rest';
  const focusLevel = ratio >= 80 ? 'deep' : ratio >= 60 ? 'moderate' : 'scattered';

  return {
    action,
    priority,
    message,
    analysis: {
      patternDetected: 'baseline_analysis',
      completionReality: ratio,
      focusLevel,
      timeContext
    },
    interventions: [
      {
        action: ratio >= 80 ? 'do_now' : 'schedule',
        taskRef: 'next_signal_task',
        reasoning: timeContext === 'peak' ? 'Perfect timing for your hardest task' : 'Good momentum to maintain',
        estimatedImpact: Math.min(ratio + 10, 100)
      }
    ],
    metrics: {
      momentumScore: Math.min(ratio + (metrics.currentStreak * 2), 100),
      decisionQuality: Math.round(metrics.averageRatio7Days || 70),
      predictedSuccess: Math.round((ratio + (metrics.averageRatio7Days || 70)) / 2)
    }
  };
}

/**
 * Check if user has PersonalAI access
 */
export function hasPersonalAIAccess(): boolean {
  try {
    // Check for PersonalAI beta flag
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('personal-ai') === 'beta') {
      return true;
    }

    // Check localStorage for PersonalAI activation
    const personalAIActive = localStorage.getItem('personalAIActive');
    if (personalAIActive === 'true') {
      return true;
    }

    // Check for special PersonalAI beta email
    const premiumStatus = checkPremiumStatus();
    if (premiumStatus.email === 'personal-ai@signal-noise.test') {
      return true;
    }

    // For now, PersonalAI requires premium access
    // In future, could be separate tier
    return premiumStatus.isActive;
  } catch (error) {
    console.error('PersonalAI access check error:', error);
    return false;
  }
}

/**
 * Activate PersonalAI mode (for beta testing)
 */
export function activatePersonalAI(): void {
  localStorage.setItem('personalAIActive', 'true');
  console.log('🤖 PersonalAI mode activated');
}

/**
 * Deactivate PersonalAI mode
 */
export function deactivatePersonalAI(): void {
  localStorage.removeItem('personalAIActive');
  console.log('🤖 PersonalAI mode deactivated');
}