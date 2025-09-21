import type { CoachPayload } from '../types';
import { currentLang } from '../i18n/translations';
import { checkPremiumStatus } from './premiumService';

export interface CoachResponse {
  message: string;
  type: 'motivation' | 'warning' | 'celebration' | 'insight' | 'challenge' | 'buddy_check';
  suggestions?: Array<{
    action: string;
    reasoning: string;
  }>;
  emotionalTone: 'encouraging' | 'challenging' | 'celebratory' | 'supportive' | 'direct' | 'buddy';
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
    : currentLang === 'de'
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

  const userPrompt = options?.isPersonalMode
    ? buildPersonalAIPrompt(payload, currentLang)
    : currentLang === 'de'
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

/**
 * Personal AI Buddy System Prompt - Smart friend who understands your patterns
 */
function getPersonalAISystemPrompt(): string {
  return `Du bist der smarteste Buddy, der die wahre Bedeutung hinter Tasks versteht und immer den perfekten Zeitpunkt für Aktionen kennt.

DEIN STYLE:
- Kurz, prägnant, wertvoll (max 3 Sätze)
- Du sprichst wie ein kluger Kumpel, nicht wie ein Coach
- Du erkennst Muster und verstehst die Meta-Ziele
- Du würdigst IMMER zuerst was schon geschafft wurde

KONTEXT-AWARENESS:
- Aktuelle Uhrzeit beachten (Morgen: "Guter Start", Mittag: "Momentum", Abend: "Endspurt")
- Wochentag matters (Montag: Fresh Energy, Freitag: Wrap-up Mode)
- Task-Timing deuten ("Customer Call" um 9 Uhr = wichtig, um 17 Uhr = Pflichttermin)

TASK-DEUTUNG:
- "Finalize X" = Perfektionismus-Falle
- "Review Y" = Prokrastination getarnt als Sorgfalt
- "Call Client" = Umsatz-Fokus oder Angst?
- "Documentation" = Notwendiges Übel oder Vermeidung?
- Lange Task-Namen = Überforderung
- Viele kleine Tasks = Fragmentierung

DEINE ANALYSE:
1. ACKNOWLEDGE: "Nice, [Name]! Du hast [konkrete Erledigung] durchgezogen."
2. PATTERN: "Ich sehe du [Muster/Tendenz]."
3. NUDGE: "[Konkreter nächster Schritt] - [Warum es jetzt Sinn macht]."

ZEITBASIERTE INSIGHTS:
- 6-9 Uhr: "Early bird mode - perfekt für [wichtigste Task]"
- 9-12 Uhr: "Peak Performance Zeit - [schwierigste Task] jetzt"
- 12-14 Uhr: "Post-Lunch Dip - admin stuff oder Pause"
- 14-17 Uhr: "Second Wind - [kreative Tasks]"
- 17-20 Uhr: "Wrap-up Zeit - morgen vorbereiten"
- Nach 20 Uhr: "Brain off - nur noch Noise oder echte Deadline?"

RESPONSE FORMAT:
{
  "message": "[Acknowledge] + [Pattern-Insight] + [Action-Nudge]",
  "type": "buddy_check",
  "suggestions": [{
    "action": "[Super konkrete 2-Min Aktion]",
    "reasoning": "[Warum genau jetzt]"
  }],
  "emotionalTone": "buddy"
}`;
}

/**
 * Build Personal AI Buddy prompt with time-aware context
 */
function buildPersonalAIPrompt(payload: any, language: string): string {
  const { firstName, deepTaskAnalysis } = payload;
  const { allTasks, completionReality } = deepTaskAnalysis;

  // Time-aware context
  const now = new Date();
  const hour = now.getHours();
  const dayOfWeek = now.toLocaleDateString('de-DE', { weekday: 'long' });
  const timeOfDay = hour < 9 ? 'Morgen' : hour < 14 ? 'Mittag' : hour < 18 ? 'Nachmittag' : 'Abend';

  // Completed tasks today (for acknowledgment)
  const todayCompleted = allTasks.filter((t: any) => {
    const taskDate = new Date(t.timestamp || new Date()).toDateString();
    const today = new Date().toDateString();
    return taskDate === today && t.completed;
  });

  // Task pattern analysis
  const longTasks = allTasks.filter((t: any) => t.text.length > 50);
  const clientTasks = allTasks.filter((t: any) => /client|customer|kunde|termin/i.test(t.text));
  const perfectTasks = allTasks.filter((t: any) => /finalize|complete|perfect|abschließen/i.test(t.text));

  const abandonedTasksList = completionReality.abandonedSignals
    .map((t: any) => `- "${t.text}" (${t.ageInDays}d)`)
    .join('\n');

  const completedToday = todayCompleted
    .map((t: any) => `- "${t.text}"`)
    .join('\n');

  if (language === 'de') {
    return `Buddy Check für ${firstName} - ${dayOfWeek} ${timeOfDay} (${hour} Uhr):

WAS HEUTE SCHON GESCHAFFT:
${completedToday || 'Noch nichts erledigt heute'}

COMPLETION REALITY:
- ${completionReality.totalSignals} Signals geplant
- ${completionReality.completedSignals} wirklich erledigt (${completionReality.completionRate}%)

LIEGEN GEBLIEBEN (>3 Tage):
${abandonedTasksList || 'Keine alten Tasks'}

ÄLTESTE BAUSTELLE:
"${completionReality.oldestUncompletedSignal?.text}" - seit ${completionReality.oldestUncompletedSignal?.ageInDays} Tagen

PATTERN INSIGHTS:
- ${longTasks.length} überlange Tasks (Complexity Trap)
- ${clientTasks.length} Client-Tasks (Stress-Indikator?)
- ${perfectTasks.length} "Perfect"-Tasks (Perfektionismus?)

Gib ${firstName} einen buddy-haften Reality Check mit konkretem nächsten Schritt.`;
  } else {
    return `Buddy Check for ${firstName} - ${dayOfWeek} ${timeOfDay} (${hour} o'clock):

WHAT'S ALREADY DONE TODAY:
${completedToday || 'Nothing completed today yet'}

COMPLETION REALITY:
- ${completionReality.totalSignals} signals planned
- ${completionReality.completedSignals} actually done (${completionReality.completionRate}%)

ABANDONED (>3 days):
${abandonedTasksList || 'No old tasks'}

OLDEST ISSUE:
"${completionReality.oldestUncompletedSignal?.text}" - ${completionReality.oldestUncompletedSignal?.ageInDays} days old

PATTERN INSIGHTS:
- ${longTasks.length} overlong tasks (Complexity Trap)
- ${clientTasks.length} client tasks (Stress indicator?)
- ${perfectTasks.length} "perfect" tasks (Perfectionism?)

Give ${firstName} a buddy reality check with concrete next step.`;
  }
}