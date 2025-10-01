import type { CoachPayload } from '../types';
import { currentLang } from '../i18n/translations';
import { checkPremiumStatus } from './premiumService';

export interface CoachResponse {
  message: string;
  type: 'motivation' | 'warning' | 'celebration' | 'insight' | 'challenge';
  suggestions?: Array<{
    action: string;
    reasoning: string;
  }>;
  emotionalTone: 'encouraging' | 'challenging' | 'celebratory' | 'supportive' | 'direct';
}

export async function getCoachAdvice(
  payload: CoachPayload,
  options?: { isPersonalMode?: boolean }
): Promise<CoachResponse> {
  // Get premium status from localStorage
  const premiumStatus = checkPremiumStatus();

  if (!premiumStatus.isActive || !premiumStatus.email) {
    throw new Error('Premium access required');
  }

  // Use different system prompt for Personal AI mode
  const systemPrompt = options?.isPersonalMode
    ? getPersonalAISystemPrompt()
    : (currentLang === 'de'
    ? `Du bist ein persönlicher Productivity Coach für die Signal/Noise App. Deine Aufgabe ist es, Nutzer dabei zu unterstützen, ihr optimales Signal-zu-Noise-Verhältnis von 80:20 zu erreichen.

WICHTIGE CHARAKTERISTIKA:
- Du sprichst den Nutzer IMMER mit Vornamen an
- Du bist motivierend aber ehrlich
- Du gibst konkrete, umsetzbare Ratschläge
- Du erkennst Muster und sprichst sie direkt an
- Maximal 3 Sätze pro Hauptnachricht
- Fokus auf das "Warum" nicht das "Was"

ANTWORT FORMAT:
Gib deine Antwort als JSON zurück mit:
{
  "message": "Hauptnachricht (max 3 Sätze)",
  "type": "motivation|warning|celebration|insight|challenge",
  "suggestions": [{"action": "Konkrete Handlung", "reasoning": "Kurze Begründung"}],
  "emotionalTone": "encouraging|challenging|celebratory|supportive|direct"
}`
    : `You are a personal productivity coach for the Signal/Noise app. Your task is to help users achieve their optimal Signal-to-Noise ratio of 80:20.

IMPORTANT CHARACTERISTICS:
- ALWAYS address the user by their first name
- Be motivating but honest
- Give concrete, actionable advice
- Recognize patterns and address them directly
- Maximum 3 sentences per main message
- Focus on the "Why" not the "What"

RESPONSE FORMAT:
Return your response as JSON with:
{
  "message": "Main message (max 3 sentences)",
  "type": "motivation|warning|celebration|insight|challenge",
  "suggestions": [{"action": "Concrete action", "reasoning": "Brief reasoning"}],
  "emotionalTone": "encouraging|challenging|celebratory|supportive|direct"
}`);

  const userPrompt = options?.isPersonalMode
    ? buildPersonalAIPrompt(payload, currentLang)
    : (currentLang === 'de'
    ? `Analysiere diese Produktivitätsdaten für ${payload.firstName}:

KONTEXT:
- Aktuelles Ratio: ${payload.context.currentRatio}%
- Heutige Tasks: ${payload.context.todayTasks}
- Trigger: ${payload.context.triggerType}

METRIKEN:
- Streak: ${payload.metrics.currentStreak} Tage
- 7-Tage Durchschnitt: ${payload.metrics.averageRatio7Days}%
- Trend: ${payload.patterns.trendDirection}
- Beste Stunde: ${payload.patterns.bestHour} Uhr

Gib eine personalisierte Coach-Nachricht zurück.`
    : `Analyze these productivity data for ${payload.firstName}:

CONTEXT:
- Current Ratio: ${payload.context.currentRatio}%
- Today's Tasks: ${payload.context.todayTasks}
- Trigger: ${payload.context.triggerType}

METRICS:
- Streak: ${payload.metrics.currentStreak} days
- 7-day Average: ${payload.metrics.averageRatio7Days}%
- Trend: ${payload.patterns.trendDirection}
- Best Hour: ${payload.patterns.bestHour} o'clock

Return a personalized coaching message.`);

  try {
    // Create messages for the secure API endpoint
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    // Call our secure API endpoint instead of Groq directly
    const response = await fetch('/api/ai-coach', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        userEmail: premiumStatus.email,
        accessToken: premiumStatus.subscriptionId || 'legacy-token' // Temporary for MVP
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('🔍 AI Coach API Response:', {
      hasMessage: !!data.message,
      hasChoices: !!data.choices,
      fullResponse: data
    });

    // Try to parse the coach response as JSON (especially important for Personal AI)
    try {
      const responseText = data.message || data.choices?.[0]?.message?.content;
      console.log('📝 Extracted response text:', responseText);

      // Try to parse as JSON first
      if (typeof responseText === 'string') {
        // Clean up any JSON that might be wrapped in text
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsedResponse = JSON.parse(jsonMatch[0]);
          console.log('✅ Successfully parsed Personal AI JSON response');
          return parsedResponse;
        }

        // If no JSON found, treat as plain text response
        return {
          message: responseText,
          type: 'insight',
          emotionalTone: 'supportive'
        };
      }

      return data;
    } catch (parseError) {
      console.error('JSON parsing failed:', parseError);
      // Fallback if JSON parsing fails
      return {
        message: data.message || 'No response available',
        type: 'insight',
        emotionalTone: 'supportive'
      };
    }
  } catch (error) {
    console.error('❌ Groq API error - Using fallback:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown',
      type: typeof error
    });

    // Fallback coaching message
    const ratio = payload.context.currentRatio;
    if (ratio >= 80) {
      return {
        message: currentLang === 'de'
          ? `Stark, ${payload.firstName}! Du hältst deinen Fokus bei ${ratio}%. Weiter so!`
          : `Great, ${payload.firstName}! You're keeping your focus at ${ratio}%. Keep it up!`,
        type: 'celebration',
        emotionalTone: 'celebratory'
      };
    } else if (ratio >= 60) {
      return {
        message: currentLang === 'de'
          ? `${payload.firstName}, ${ratio}% ist solid. Lass uns das auf 80% bringen!`
          : `${payload.firstName}, ${ratio}% is solid. Let's get that to 80%!`,
        type: 'motivation',
        emotionalTone: 'encouraging'
      };
    } else {
      return {
        message: currentLang === 'de'
          ? `Hey ${payload.firstName}, Zeit für einen Reset! Was ist JETZT wirklich wichtig?`
          : `Hey ${payload.firstName}, time for a reset! What's REALLY important right now?`,
        type: 'warning',
        emotionalTone: 'direct'
      };
    }
  }
}

/**
 * Personal AI System Prompt - Steve Jobs Philosophy: "What are we doing TODAY?"
 */
function getPersonalAISystemPrompt(): string {
  return `You are an elite performance coach inspired by Steve Jobs' philosophy: The past doesn't matter. What matters is what you DO RIGHT NOW.

CORE PHILOSOPHY:
- Don't dwell on how long tasks have been waiting
- Recognize PATTERNS (same task appearing repeatedly = it matters to them)
- Focus coaching on TODAY's action, not past failures
- Forward momentum beats backward analysis

YOU SEE EVERYTHING:
- The exact text of every task they've written
- Which signals they completed vs still open
- Patterns of similar tasks appearing over time
- What they're avoiding vs what they execute immediately

COACHING APPROACH:

1. PATTERN RECOGNITION (Acknowledge, don't guilt-trip)
"I see '[specific task]' keeps appearing in your signals - it clearly matters to you."
"You complete [type of task] immediately but [other type] keeps reappearing. Notice that?"

2. PSYCHOLOGICAL INSIGHT (Pick one, stay brief):
- Perfectionism: Tasks with vague goals stay open longer
- Avoidance: Client-facing work gets postponed while internal tasks get done
- Overwhelm: Breaking tasks into smaller steps helps completion
- Action bias: You ship when you have a clear 2-minute first step

3. THE INTERVENTION (Steve Jobs style)
- Name ONE specific task that keeps reappearing
- Give ONE concrete action to do RIGHT NOW (TODAY)
- No analysis paralysis - just "Open X and do Y"

MANDATORY FORMAT:
{
  "message": "[Name], I see '[task]' keeps appearing. TODAY: [direct action command].",
  "type": "motivation",
  "suggestions": [
    {
      "action": "[Specific 2-minute starter step for TODAY]",
      "reasoning": "[One sentence why this works]"
    }
  ],
  "emotionalTone": "direct_but_caring"
}

EXAMPLES:
{
  "message": "Tom, I see 'Lead Outreach' keeps appearing in your signals. Open LinkedIn NOW and find one warm contact.",
  "type": "motivation",
  "suggestions": [{"action": "Open LinkedIn and message one person you already know", "reasoning": "Starting with warm contacts removes the cold-call resistance"}],
  "emotionalTone": "direct_but_caring"
}

{
  "message": "Tom, 'Personalisierte Outreach' keeps showing up. TODAY: Draft one message to one specific person.",
  "type": "motivation",
  "suggestions": [{"action": "Pick one contact and write 3 sentences about why you're reaching out", "reasoning": "Personalization happens one message at a time, not in bulk"}],
  "emotionalTone": "direct_but_caring"
}

CRITICAL: Never mention "X days old" or "sitting for N days" - focus on ACTION TODAY. Max 2 sentences in message.`;
}

/**
 * Build Personal AI user prompt with full task visibility
 */
function buildPersonalAIPrompt(payload: any, language: string): string {
  const { firstName, deepTaskAnalysis } = payload;
  const { completionReality } = deepTaskAnalysis;

  const abandonedTasksList = completionReality.abandonedSignals
    .map((t: any) => `- "${t.text}" (taucht wiederholt auf)`)
    .join('\n');

  if (language === 'de') {
    return `${firstName}'s Muster-Analyse für HEUTE:

TASK-MUSTER (Welche Tasks tauchen wiederholt auf?):
${abandonedTasksList || '- Keine wiederholten Tasks'}

AKTUELL OFFENE SIGNALS:
${completionReality.oldestUncompletedSignal?.text ? `"${completionReality.oldestUncompletedSignal.text}" (immer noch offen)` : 'Keine offenen Signals'}

COMPLETION-VERHALTEN:
- ${completionReality.completedSignals} von ${completionReality.totalSignals} Signals erledigt (${completionReality.completionRate}%)

DEINE AUFGABE:
Gib motivierendes, aktionsorientiertes Coaching für HEUTE. Erkenne Muster, aber konzentriere dich auf die nächste konkrete Handlung JETZT. Keine Schuldzuweisungen für die Vergangenheit - nur klare Action für heute.`;
  } else {
    return `${firstName}'s Pattern Analysis for TODAY:

RECURRING TASK PATTERNS (Which tasks keep reappearing?):
${abandonedTasksList || '- No recurring tasks'}

CURRENTLY OPEN SIGNALS:
${completionReality.oldestUncompletedSignal?.text ? `"${completionReality.oldestUncompletedSignal.text}" (still open)` : 'No open signals'}

COMPLETION BEHAVIOR:
- ${completionReality.completedSignals} of ${completionReality.totalSignals} signals completed (${completionReality.completionRate}%)

YOUR TASK:
Provide motivating, action-oriented coaching for TODAY. Recognize patterns, but focus on the next concrete action RIGHT NOW. No guilt about the past - just clear action for today.`;
  }
}