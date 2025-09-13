// Browser-Sprache automatisch erkennen
const detectLanguage = (): 'de' | 'en' => {
  // Prüfe alle Browser-Sprachen ob Deutsch dabei ist
  const languages = navigator.languages || [navigator.language];
  const hasGerman = languages.some(lang => lang.toLowerCase().startsWith('de'));
  return hasGerman ? 'de' : 'en';
};

export const currentLang = detectLanguage();

// Übersetzungen für alle UI-Texte
const translations = {
  de: {
    // Input & Buttons
    inputPlaceholder: "Was steht an?",
    signalBtn: "Signal ✓",
    noiseBtn: "Noise ✗",

    // Task Grid
    signalsHeader: "Signals",
    noiseHeader: "Noise",
    noSignalTasks: "Noch keine Signal-Aufgaben heute",
    noNoiseTasks: "Noch keine Ablenkungen heute",

    // Analytics
    analyticsTitle: "30-Tage Überblick",
    avgRatio: "Ø Ratio",
    tasksTotal: "Tasks Total",
    dayStreak: "Tage Streak",

    // AI Coach
    aiCoachBtn: "AI Coach fragen",
    namePrompt: "Wie heißt du? (Für persönliche Ansprache)",
    coachLoading: "AI Coach analysiert deine Patterns...",
    coachUnavailable: "Coaching temporär nicht verfügbar. Fokussiere dich auf deine wichtigsten 3 Aufgaben!",
    coachClose: "Schließen",
    coachRecommendations: "Empfehlungen:",

    // Premium Banner
    premiumTitle: "Groq Intelligence",
    premiumFeatures: "KI-Analyse • Persönliche Patterns • Team-Vergleich",
    premiumCta: "7 Tage kostenlos testen",

    // Time formatting
    timeJustNow: "gerade eben",
    timeMinutesAgo: "vor {n}m",
    timeHoursAgo: "vor {n}h",

    // Header
    ratioLabel: "Signal Ratio",
  },
  en: {
    // Input & Buttons
    inputPlaceholder: "What's on your plate?",
    signalBtn: "Signal ✓",
    noiseBtn: "Noise ✗",

    // Task Grid
    signalsHeader: "Signals",
    noiseHeader: "Noise",
    noSignalTasks: "No signal tasks today yet",
    noNoiseTasks: "No distractions today yet",

    // Analytics
    analyticsTitle: "30-Day Overview",
    avgRatio: "Avg Ratio",
    tasksTotal: "Total Tasks",
    dayStreak: "Day Streak",

    // AI Coach
    aiCoachBtn: "Ask AI Coach",
    namePrompt: "What's your name? (For personalized coaching)",
    coachLoading: "AI Coach analyzing your patterns...",
    coachUnavailable: "Coaching temporarily unavailable. Focus on your top 3 tasks!",
    coachClose: "Close",
    coachRecommendations: "Recommendations:",

    // Premium Banner
    premiumTitle: "Groq Intelligence",
    premiumFeatures: "AI Analysis • Personal Patterns • Team Comparison",
    premiumCta: "Try 7 days for free",

    // Time formatting
    timeJustNow: "just now",
    timeMinutesAgo: "{n}m ago",
    timeHoursAgo: "{n}h ago",

    // Header
    ratioLabel: "Signal Ratio",
  }
};

// Export selected translations
export const t = translations[currentLang];

// Helper function for time formatting with placeholders
export const formatTime = (key: keyof typeof t, replacements?: Record<string, string | number>): string => {
  let text = t[key] as string;

  if (replacements) {
    Object.entries(replacements).forEach(([placeholder, value]) => {
      text = text.replace(`{${placeholder}}`, String(value));
    });
  }

  return text;
};