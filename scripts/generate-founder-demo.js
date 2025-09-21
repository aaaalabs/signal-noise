/**
 * German Founder Demo Data Generator
 * Creates realistic founder journey with 30-day history for video recording
 * Shows the progression from overwhelming task list to focused execution
 */

function generateFounderDemoData() {
  const now = new Date();

  // Today's tasks showing 25% ratio (3 SIGNAL, 9 NOISE) - "War ich doof" moment
  const todayTasks = [
    // SIGNAL tasks (3) - actual business impact
    { id: 1, text: "Kundenakquise Call mit potenziellem Enterprise Kunden", type: "signal", completed: false, timestamp: now.getTime() - 2 * 60 * 60 * 1000 },
    { id: 2, text: "Feature-Roadmap für Q1 2025 finalisieren", type: "signal", completed: true, timestamp: now.getTime() - 3 * 60 * 60 * 1000 },
    { id: 3, text: "Investoren-Pitch für Serie A überarbeiten", type: "signal", completed: false, timestamp: now.getTime() - 1 * 60 * 60 * 1000 },

    // NOISE tasks (9) - busy work that doesn't move the needle
    { id: 4, text: "LinkedIn Profil optimieren", type: "noise", completed: false, timestamp: now.getTime() - 4 * 60 * 60 * 1000 },
    { id: 5, text: "Office-Pflanzen gießen", type: "noise", completed: true, timestamp: now.getTime() - 5 * 60 * 60 * 1000 },
    { id: 6, text: "Firmen-Newsletter Template designen", type: "noise", completed: false, timestamp: now.getTime() - 30 * 60 * 1000 },
    { id: 7, text: "Alle Slack-Channels durchgehen", type: "noise", completed: true, timestamp: now.getTime() - 45 * 60 * 1000 },
    { id: 8, text: "Konkurrenz-Analyse für 47. Startup Tool", type: "noise", completed: false, timestamp: now.getTime() - 20 * 60 * 1000 },
    { id: 9, text: "Team-Building Event Locations recherchieren", type: "noise", completed: false, timestamp: now.getTime() - 15 * 60 * 1000 },
    { id: 10, text: "Büro-Equipment Preise vergleichen", type: "noise", completed: true, timestamp: now.getTime() - 10 * 60 * 1000 },
    { id: 11, text: "Social Media Analytics Dashboard checken", type: "noise", completed: false, timestamp: now.getTime() - 5 * 60 * 1000 },
    { id: 12, text: "Weitere Productivity Apps testen", type: "noise", completed: false, timestamp: now.getTime() - 2 * 60 * 1000 }
  ];

  // Generate 30-day founder journey history - showing the learning curve
  const history = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    let ratio;
    if (i > 25) {
      // Early days: terrible ratios (15-30%) - everything feels important
      ratio = Math.floor(Math.random() * 15) + 15;
    } else if (i > 20) {
      // Week 1: slightly better (25-40%) - starting to question priorities
      ratio = Math.floor(Math.random() * 15) + 25;
    } else if (i > 15) {
      // Week 2: improvement (35-55%) - learning to say no
      ratio = Math.floor(Math.random() * 20) + 35;
    } else if (i > 10) {
      // Week 3: more focused (50-70%) - getting serious about impact
      ratio = Math.floor(Math.random() * 20) + 50;
    } else if (i > 5) {
      // Week 4: consistent (60-80%) - building good habits
      ratio = Math.floor(Math.random() * 20) + 60;
    } else {
      // Last 5 days: mastery (70-90%) - truly understanding signal vs noise
      ratio = Math.floor(Math.random() * 20) + 70;
    }

    history.push({
      date: date.toISOString().split('T')[0],
      ratio: ratio,
      signalCount: Math.floor((ratio / 100) * 8) + 2,
      noiseCount: Math.floor(((100 - ratio) / 100) * 12) + 3
    });
  }

  // Founder-specific settings
  const settings = {
    targetRatio: 80,
    notifications: true,
    firstName: "Thomas",
    hasCommittedToReality: false, // Will discover the truth during video
    tier: "foundation",
    language: "de"
  };

  // Achievement progress showing early-stage founder journey
  const badges = [
    "first_signal",     // ✓ First important task identified
    "day_streak_7",     // ✓ One week of consistent use
    "ratio_above_50"    // ✓ Found some focus (3/8 achievements)
  ];

  // Behavioral patterns typical for overwhelmed founders
  const patterns = {
    bestHour: 9,  // Morning energy
    worstHour: 15, // Post-lunch crash when checking "quick tasks"
    averageTasksPerDay: 12,
    signalToNoiseRatio: 25, // Current revelation moment
    weekdayVsWeekend: {
      weekday: 28,
      weekend: 45  // Slightly better on weekends without meetings
    },
    trendDirection: "improving", // Learning curve visible
    consistencyScore: 34 // Still inconsistent but getting better
  };

  const demoData = {
    tasks: todayTasks,
    history: history,
    badges: badges,
    patterns: patterns,
    settings: settings,
    metadata: {
      generatedAt: now.toISOString(),
      version: "founder-demo-v1",
      scenario: "overwhelming-realization",
      targetRatio: 25, // For today's "shock moment"
      demoType: "german-founder-video"
    }
  };

  return demoData;
}

// Script execution
console.log('🎬 Generiere German Founder Demo Daten...');

const demoData = generateFounderDemoData();

// Save to localStorage (for browser console execution)
const storageKey = 'signal_noise_data';
const jsonData = JSON.stringify(demoData, null, 2);

console.log('📋 Demo Daten generiert:');
console.log(`- Heute: ${demoData.tasks.filter(t => t.type === 'signal').length} SIGNAL, ${demoData.tasks.filter(t => t.type === 'noise').length} NOISE`);
console.log(`- Ratio: ${Math.round((demoData.tasks.filter(t => t.type === 'signal').length / demoData.tasks.length) * 100)}%`);
console.log(`- 30-Tage History: ${demoData.history.length} Einträge`);
console.log(`- Achievements: ${demoData.badges.length}/8`);
console.log(`- Founder: ${demoData.settings.firstName}`);

console.log('\n🔧 Für Browser-Demo:');
console.log(`localStorage.setItem('${storageKey}', '${jsonData.replace(/'/g, "\\'")}');`);
console.log('window.location.reload();');

console.log('\n📱 Tasks für "War ich doof" Screenshot:');
demoData.tasks.forEach(task => {
  const icon = task.type === 'signal' ? '🎯' : '📱';
  const status = task.completed ? '✅' : '⭕';
  console.log(`${icon} ${status} ${task.text}`);
});

console.log('\n🎯 Perfekt für Video-Aufnahme:');
console.log('1. Browser öffnen → Developer Console');
console.log('2. localStorage Script ausführen');
console.log('3. Page reload → 25% Ratio sichtbar');
console.log('4. "War ich doof!" Moment aufnehmen');
console.log('5. History zeigen → 30-Tage Lernkurve');

// Export for Node.js usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { generateFounderDemoData };
}