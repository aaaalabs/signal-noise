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
    yesterday: "Gestern",
    daysAgo: "Tage her",
    historicalTasks: "Vergangene Aufgaben",
    noHistoricalTasks: "Noch keine vergangenen Aufgaben",

    // Header
    ratioLabel: "Signal Ratio",

    // Achievements
    achievementLocked: "Gesperrt",
    achievementMilestones: "Meilensteine",

    // Onboarding
    onboardingTitle: "Signal",
    onboardingText: "<span style='color: var(--signal)'>80%</span> deiner Zeit für das, <br>was wirklich zählt.<br><span style='color: #666'>20%</span> für den Rest.",
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

    // Success Criteria (Premium Menu Tooltips)
    successCriteria: {
      first_day: "Eine Aufgabe hinzufügen",
      week_warrior: "Täglich 80%+ Ratio",
      signal_master: "Woche Ø 80%",
      perfect_day: "100% Ratio heute",
      month_hero: "Monatelanger Streak",
      early_bird: "Aufgabe vor 9 Uhr",
      decision_maker: "100 Aufgaben erreichen",
      comeback: "Nach Pause zurückkehren"
    },

    // FAQ Modal
    faqTitle: "FAQ",
    faqSubtitle: "Häufige Fragen & versteckte Features",
    faqClose: "Schließen",
    faqItems: [
      {
        question: "Was ist das 80/20-Prinzip?",
        answer: "Die 80/20-Regel besagt, dass <span style='color: #00ff88'>80%</span> der Ergebnisse aus <span style='color: #666'>20%</span> der Anstrengungen stammen. In Signal/Noise kategorisierst du Aufgaben als 'Signal' (wichtig, <span style='color: #00ff88'>80%</span> Zeit) oder 'Noise' (Ablenkungen, <span style='color: #666'>20%</span> Zeit) für optimalen Fokus."
      },
      {
        question: "Wie benutze ich Signal/Noise effektiv?",
        answer: "Füge Aufgaben hinzu und kategorisiere sie als Signal (wichtig) oder Noise (Ablenkungen). Nutze Tab für schnellen Wechsel zwischen Kategorien. <strong>Doppelt tippen auf eine Aufgabe</strong> markiert sie als erledigt. <strong>Horizontal wischen</strong> verschiebt Aufgaben zwischen Signal/Noise-Spalten mit visueller Rückmeldung und Richtungspfeilen. <strong>2,5 Sekunden lang halten</strong> löscht eine Aufgabe mit Fortschrittsbalken. Drücke Cmd+E (Mac) oder Ctrl+E (Windows) zum Datenexport."
      },
      {
        question: "Wie funktionieren Erfolge und Fortschritt?",
        answer: "Du erhältst Abzeichen für Konstanz: Early Bird (Morgenaufgaben), Comeback (Rückkehr nach Pausen), Perfect Day (optimale Ratios), Week Warrior und Month Hero. Kleine Punkte neben deiner Ratio zeigen Fortschritt - grau (gesperrt), dunkel (erreicht), grün (kürzlich freigeschaltet). Klicken zeigt X/8 Meilenstein-Fortschritt."
      },
      {
        question: "Was sind Premium-Features und Preise?",
        answer: "Premium beinhaltet AI Coach, Cloud-Sync und lebenslange Updates. Foundation Members (erste 100 Nutzer): €29 lebenslang. Danach: €49 Early Adopter Preis. Kein Abo - einmal zahlen, für immer besitzen. Der AI Coach erscheint nach 3+ Tage Streak, 7+ Tagen mit Aufgaben oder 20+ Gesamtaufgaben."
      },
      {
        question: "Wie funktionieren Datenschutz und Sync?",
        answer: "Alles wird lokal im Browser gespeichert. <strong>Premium-Nutzer erhalten Cloud-Sync für die Nutzung auf mehreren Geräten</strong> - deine Daten sind automatisch auf Handy, Laptop und Tablet synchron. Der grüne Punkt neben dem Sprachschalter zeigt die Verbindung. Deine Privatsphäre ist immer geschützt - kein Tracking, keine Analyse, kein Data Mining."
      },
      {
        question: "Welche Interface-Features gibt es?",
        answer: "Klicke auf den kaum sichtbaren 'EN'/'DE'-Schalter oben rechts für sofortigen Sprachwechsel. Das gesamte Interface ändert sich ohne Seitenneuladung. Premium-Nutzer sehen subtile Sync-Indikatoren bei Operationen."
      }
    ],
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
    yesterday: "Yesterday",
    daysAgo: "days ago",
    historicalTasks: "Historical Tasks",
    noHistoricalTasks: "No historical tasks yet",

    // Header
    ratioLabel: "Signal Ratio",

    // Achievements
    achievementLocked: "Locked",
    achievementMilestones: "milestones",

    // Onboarding
    onboardingTitle: "Signal",
    onboardingText: "<span style='color: var(--signal)'>80%</span> of your time for <br>what really matters.<br><span style='color: #666'>20%</span> for the rest.",
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

    // Success Criteria (Premium Menu Tooltips)
    successCriteria: {
      first_day: "Add one task",
      week_warrior: "Daily 80%+ ratio",
      signal_master: "Week average 80%",
      perfect_day: "100% ratio today",
      month_hero: "Month-long streak",
      early_bird: "Task before 9am",
      decision_maker: "Reach 100 tasks",
      comeback: "Return after break"
    },

    // FAQ Modal
    faqTitle: "FAQ",
    faqSubtitle: "Frequently asked questions & hidden features",
    faqClose: "Close",
    faqItems: [
      {
        question: "What is the 80/20 principle?",
        answer: "The 80/20 rule suggests that <span style='color: #00ff88'>80%</span> of results come from <span style='color: #666'>20%</span> of efforts. In Signal/Noise, you classify tasks as 'Signal' (important, <span style='color: #00ff88'>80%</span> time) or 'Noise' (distractions, <span style='color: #666'>20%</span> time) to achieve optimal focus."
      },
      {
        question: "How do I use Signal/Noise effectively?",
        answer: "Add tasks and classify them as Signal (important) or Noise (distractions). Use Tab to quickly switch between categories. <strong>Double-tap any task</strong> to mark it as completed. <strong>Swipe horizontally</strong> to move tasks between Signal/Noise columns with visual feedback and directional arrows. <strong>Hold any task for 2.5 seconds</strong> to delete it with a progress bar. Press Cmd+E (Mac) or Ctrl+E (Windows) to export your data."
      },
      {
        question: "How do achievements and progress tracking work?",
        answer: "You earn badges for consistency: Early Bird (morning tasks), Comeback (returning after breaks), Perfect Day (optimal ratios), Week Warrior, and Month Hero. Small dots next to your ratio show achievement progress - gray (locked), dark (earned), green (recent unlock). Click them to see your X/8 milestone progress."
      },
      {
        question: "What are premium features and pricing?",
        answer: "Premium includes AI Coach, cloud sync, and lifetime updates. Foundation Members (first 100 users): €29 lifetime. After that: €49 Early Adopter pricing. No subscription - pay once, own forever. The AI Coach appears after 3+ day streak, 7+ days with tasks, or 20+ total tasks."
      },
      {
        question: "How does data privacy and sync work?",
        answer: "Everything is stored locally in your browser. <strong>Premium users get cloud sync for use across multiple devices</strong> - your data automatically stays in sync across phone, laptop, and tablet. The green dot next to the language switcher shows connection status. Your privacy is always protected - no tracking, no analytics, no data mining."
      },
      {
        question: "What interface features are available?",
        answer: "Click the barely visible 'EN'/'DE' toggle in the top-right corner to switch languages instantly. The entire interface changes without page reload. Premium users see subtle sync indicators during operations."
      }
    ],
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