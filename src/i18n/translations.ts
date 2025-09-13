// Browser-Sprache automatisch erkennen
const detectLanguage = (): 'de' | 'en' => {
  // Prüfe alle Browser-Sprachen ob Deutsch dabei ist
  const languages = navigator.languages || [navigator.language];
  const hasGerman = languages.some(lang => lang.toLowerCase().startsWith('de'));
  return hasGerman ? 'de' : 'en';
};

// Get language from localStorage or fallback to browser detection
const getStoredLanguage = (): 'de' | 'en' => {
  try {
    const stored = localStorage.getItem('signal_noise_language') as 'de' | 'en' | null;
    return stored || detectLanguage();
  } catch {
    return detectLanguage();
  }
};

export let currentLang = getStoredLanguage();

// Function to change language at runtime
export const setLanguage = (lang: 'de' | 'en') => {
  currentLang = lang;
  try {
    localStorage.setItem('signal_noise_language', lang);
  } catch {
    // Ignore localStorage errors
  }
};

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

    // Achievements
    achievementLocked: "Gesperrt",
    achievementMilestones: "Meilensteine",

    // Onboarding
    onboardingTitle: "Signal",
    onboardingText: "80% deiner Zeit für das, <br>was wirklich zählt.<br>20% für den Rest.",
    onboardingStart: "Begin",

    // Premium Modal
    premiumModalTitle: "Dein Coach",
    premiumModalDesc: "Persönliches Coaching mit echten Erkenntnissen aus deinen Daten. €9/Monat.",
    emailPlaceholder: "deine@email.com",
    emailError: "Bitte gib eine gültige E-Mail-Adresse ein",
    cancelBtn: "Abbrechen",
    upgradeBtn: "Upgrade",

    // Foundation Modal
    foundationTagline: "Fokussiere dich auf das, was zählt",
    foundationFeature1: "AI Coach inbegriffen",
    foundationFeature2: "Updates auf Lebenszeit",
    foundationFeature3: "Kein Abo",
    foundationAccess: "Foundation Zugang",
    earlyAdopter: "Early Adopter",
    continuePurchase: "Weiter zum Kauf",
    accessAccount: "Auf Konto zugreifen",
    processing: "Verarbeite...",
    sending: "Sende...",
    sendAccessLink: "Zugangslink senden",
    recoveryLinkSent: "Wiederherstellungslink gesendet!",
    checkEmail: "Schau in deine E-Mails für den Zugangslink.",
    welcomeBack: "Willkommen zurück",
    foundationMember: "Foundation Mitglied",
    accountInactive: "Konto gefunden aber inaktiv",
    newMember: "Neues Mitglied - willkommen!",
    foundationMembers: "Foundation Mitglieder",
    foundationComplete: "Foundation Stufe vollständig - {count} Mitglieder beigetreten",
    foundationTimeline: "Foundation Preis verfügbar bis Januar",
    alreadyMember: "Bereits Mitglied? →",
    newMemberToggle: "Neues Mitglied? →",
    loading: "Lade...",
    firstNamePlaceholder: "Vorname (optional)",
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

    // Achievements
    achievementLocked: "Locked",
    achievementMilestones: "milestones",

    // Onboarding
    onboardingTitle: "Signal",
    onboardingText: "80% of your time for what really matters.<br>20% for the rest.",
    onboardingStart: "Begin",

    // Premium Modal
    premiumModalTitle: "Your Coach",
    premiumModalDesc: "Personal coaching with real insights from your data. €9/month.",
    emailPlaceholder: "your@email.com",
    emailError: "Please enter a valid email address",
    cancelBtn: "Cancel",
    upgradeBtn: "Upgrade",

    // Foundation Modal
    foundationTagline: "Focus on what matters",
    foundationFeature1: "AI Coach included",
    foundationFeature2: "Lifetime updates",
    foundationFeature3: "No subscription",
    foundationAccess: "Foundation Access",
    earlyAdopter: "Early Adopter",
    continuePurchase: "Continue with purchase",
    accessAccount: "Access your account",
    processing: "Processing...",
    sending: "Sending...",
    sendAccessLink: "Send access link",
    recoveryLinkSent: "Recovery link sent!",
    checkEmail: "Check your email for the access link.",
    welcomeBack: "Welcome back",
    foundationMember: "Foundation Member",
    accountInactive: "Account found but inactive",
    newMember: "New member - welcome!",
    foundationMembers: "Foundation members",
    foundationComplete: "Foundation tier complete - {count} members joined",
    foundationTimeline: "Foundation pricing available through January",
    alreadyMember: "Already a member? →",
    newMemberToggle: "New member? →",
    loading: "Loading...",
    firstNamePlaceholder: "First name (optional)",
  }
};

// Get current translations
export const getTranslations = () => translations[currentLang];

// Export selected translations (legacy compatibility)
export const t = translations[currentLang];

// Helper function for time formatting with placeholders
export const formatTime = (key: string, replacements?: Record<string, string | number>): string => {
  const currentTranslations = getTranslations();
  let text = (currentTranslations as any)[key] as string;

  if (replacements) {
    Object.entries(replacements).forEach(([placeholder, value]) => {
      text = text.replace(`{${placeholder}}`, String(value));
    });
  }

  return text;
};