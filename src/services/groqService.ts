import type { CoachPayload } from '../types';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

interface GroqResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

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
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey) {
    throw new Error('Groq API key not configured');
  }

  const systemPrompt = `Du bist ein persönlicher Productivity Coach für die Signal/Noise App. Deine Aufgabe ist es, Nutzer dabei zu unterstützen, ihr optimales Signal-zu-Noise-Verhältnis von 80:20 zu erreichen.

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
}`;

  const userPrompt = `Analysiere diese Produktivitätsdaten für ${payload.firstName}:

KONTEXT:
- Aktuelles Ratio: ${payload.context.currentRatio}%
- Heutige Tasks: ${payload.context.todayTasks}
- Trigger: ${payload.context.triggerType}

METRIKEN:
- Streak: ${payload.metrics.currentStreak} Tage
- 7-Tage Durchschnitt: ${payload.metrics.averageRatio7Days}%
- Trend: ${payload.patterns.trendDirection}
- Beste Stunde: ${payload.patterns.bestHour} Uhr

Gib eine personalisierte Coach-Nachricht zurück.`;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data: GroqResponse = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No response from Groq');
    }

    // Try to parse JSON response
    try {
      return JSON.parse(content);
    } catch {
      // Fallback if JSON parsing fails
      return {
        message: content,
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
        message: `Stark, ${payload.firstName}! Du hältst deinen Fokus bei ${ratio}%. Weiter so!`,
        type: 'celebration',
        emotionalTone: 'celebratory'
      };
    } else if (ratio >= 60) {
      return {
        message: `${payload.firstName}, ${ratio}% ist solid. Lass uns das auf 80% bringen!`,
        type: 'motivation',
        emotionalTone: 'encouraging'
      };
    } else {
      return {
        message: `Hey ${payload.firstName}, Zeit für einen Reset! Was ist JETZT wirklich wichtig?`,
        type: 'warning',
        emotionalTone: 'direct'
      };
    }
  }
}