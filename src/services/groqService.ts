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

export async function getCoachAdvice(payload: CoachPayload): Promise<CoachResponse> {
  // Get premium status from localStorage
  const premiumStatus = checkPremiumStatus();

  if (!premiumStatus.isActive || !premiumStatus.email) {
    throw new Error('Premium access required');
  }

  const systemPrompt = currentLang === 'de'
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
}`;

  const userPrompt = currentLang === 'de'
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

Return a personalized coaching message.`;

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

    // Try to parse the coach response as JSON
    try {
      return typeof data.message === 'string' ? JSON.parse(data.message) : data;
    } catch {
      // Fallback if JSON parsing fails
      return {
        message: data.message || 'No response available',
        type: 'insight',
        emotionalTone: 'supportive'
      };
    }
  } catch (error) {
    console.error('Groq API error:', error);

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