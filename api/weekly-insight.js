import { Redis } from '@upstash/redis';
import { checkUserRateLimit, incrementUserUsage } from './redis-helper.js';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

// Weekly insights get 10 requests per hour (less than PersonalAI since it's once per week)
const WEEKLY_INSIGHT_RATE_LIMIT = 10;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userEmail, accessToken } = req.body;

    if (!userEmail || !accessToken) {
      return res.status(400).json({ error: 'Missing userEmail or accessToken' });
    }

    // Fetch user data
    const userKey = `sn:u:${userEmail}`;
    const userData = await redis.hgetall(userKey);

    if (!userData || !userData.app_data) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify premium access (weekly insights are premium feature)
    const isPremium = userData.tier === 'foundation' || userData.tier === 'early_adopter' || userData.premium === 'true';
    if (!isPremium) {
      return res.status(403).json({ error: 'Premium feature - upgrade to Foundation' });
    }

    // Check rate limit (10 requests per hour)
    const isAllowed = await checkUserRateLimit(redis, userEmail, WEEKLY_INSIGHT_RATE_LIMIT);
    if (!isAllowed) {
      return res.status(429).json({
        error: 'Rate limit exceeded. Weekly insights: 10 requests per hour.'
      });
    }

    // Parse app data
    const appData = typeof userData.app_data === 'string'
      ? JSON.parse(userData.app_data)
      : userData.app_data;

    // Get existing AI data
    let aiData = { aiMemory: [], personality: { style: 'buddy', customInstructions: '' } };
    if (userData.app_ai_data) {
      aiData = typeof userData.app_ai_data === 'string'
        ? JSON.parse(userData.app_ai_data)
        : userData.app_ai_data;
    }

    // Check if we need to generate new insight (once per week)
    const weeklyInsights = aiData.weeklyInsights || [];
    const currentWeek = getCurrentWeek();

    if (weeklyInsights.length > 0 && weeklyInsights[0].week === currentWeek) {
      // Already have insight for this week
      return res.status(200).json({
        insight: weeklyInsights[0],
        cached: true
      });
    }

    // Generate new weekly insight (SLC version)
    const insight = generateWeeklyInsight(appData, userData);

    // Save insight to Redis (prepend and keep last 8 weeks)
    const updatedInsights = [
      { week: currentWeek, ...insight },
      ...weeklyInsights.slice(0, 7) // Keep last 8 weeks total
    ];

    aiData.weeklyInsights = updatedInsights;

    // Save to Redis (atomic operation on app_ai_data field only)
    await redis.hset(userKey, {
      app_ai_data: JSON.stringify(aiData)
    });

    // Track usage for rate limiting
    await incrementUserUsage(redis, userEmail);

    console.log('✅ Weekly insight generated for:', userEmail, currentWeek);

    return res.status(200).json({
      insight: updatedInsights[0],
      cached: false
    });

  } catch (error) {
    console.error('Weekly insight FAILED - keine fallbacks!', error);
    return res.status(500).json({
      error: error.message || 'Weekly insight generation failed',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

/**
 * Get current week identifier (YYYY-WW format)
 */
function getCurrentWeek() {
  const now = new Date();
  const year = now.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const days = Math.floor((now - startOfYear) / (24 * 60 * 60 * 1000));
  const week = Math.ceil((days + startOfYear.getDay() + 1) / 7);
  return `${year}-W${String(week).padStart(2, '0')}`;
}

/**
 * SLC Weekly Insight Generator
 * Answers 3 questions: What's the theme? Why? What's next?
 */
function generateWeeklyInsight(appData, userData) {
  const tasks = appData.tasks || [];
  const settings = appData.settings || {};
  const firstName = settings.firstName || 'Du';

  // Filter to last 7 days
  const now = Date.now();
  const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
  const recentTasks = tasks.filter(t => new Date(t.timestamp).getTime() > sevenDaysAgo);

  if (recentTasks.length === 0) {
    return {
      theme: 'Keine Aktivität diese Woche',
      why: 'Du hast diese Woche keine Tasks hinzugefügt.',
      next: 'Zeit für einen Neustart - füge eine Signal-Task hinzu.',
      confidence: 1.0,
      suggestedTask: null
    };
  }

  // 1. Find dominant project (SLC: simple keyword matching)
  const dominantProject = findDominantProject(recentTasks);

  // 2. Infer phase (SLC: verb-based detection)
  const phase = inferPhase(recentTasks);

  // 3. Generate German coaching message
  const message = generateCoachingMessage({
    firstName,
    dominantProject,
    phase,
    recentTasks
  });

  return {
    theme: dominantProject.name,
    why: message.why,
    next: message.next,
    confidence: dominantProject.confidence,
    suggestedTask: message.suggestedTask
  };
}

/**
 * Find dominant project by task count + completion rate
 */
function findDominantProject(tasks) {
  // Extract project names (simple heuristic: first word or phrase before colon/dash)
  const projects = {};

  tasks.forEach(task => {
    const text = task.text.toLowerCase();
    let projectName = 'General';

    // Try to extract project name
    if (text.includes(':')) {
      projectName = text.split(':')[0].trim();
    } else if (text.includes('-')) {
      projectName = text.split('-')[0].trim();
    } else {
      // Use first 2 words as project name
      const words = text.split(' ').slice(0, 2);
      projectName = words.join(' ');
    }

    // Capitalize first letter
    projectName = projectName.charAt(0).toUpperCase() + projectName.slice(1);

    if (!projects[projectName]) {
      projects[projectName] = { tasks: [], completed: 0 };
    }

    projects[projectName].tasks.push(task);
    if (task.completed) {
      projects[projectName].completed++;
    }
  });

  // Calculate scores (task count × completion rate)
  const scored = Object.entries(projects).map(([name, data]) => ({
    name,
    tasks: data.tasks,
    completionRate: data.tasks.length > 0 ? data.completed / data.tasks.length : 0,
    score: data.tasks.length * (data.completed / data.tasks.length)
  }));

  // Sort by score
  scored.sort((a, b) => b.score - a.score);

  const dominant = scored[0];
  return {
    name: dominant.name,
    tasks: dominant.tasks,
    completionRate: dominant.completionRate,
    confidence: Math.min(dominant.score / 10, 1.0) // Normalize to 0-1
  };
}

/**
 * Infer project phase from verbs in recent tasks
 */
function inferPhase(tasks) {
  const allText = tasks.map(t => t.text.toLowerCase()).join(' ');

  // Phase detection by keywords
  if (/launch|deploy|ship|veröffentlich|live/.test(allText)) {
    return { phase: 'launch', next: 'Scale & iterate - double down on what works' };
  }
  if (/test|validier|mvp|feedback|nutzer/.test(allText)) {
    return { phase: 'validation', next: 'Prepare for launch - polish for production' };
  }
  if (/code|dev|implement|build|entwickl/.test(allText)) {
    return { phase: 'development', next: 'Begin validation - get it in front of users' };
  }
  if (/design|plan|konzept|figma/.test(allText)) {
    return { phase: 'design', next: 'Start development - move from concept to code' };
  }

  return { phase: 'exploration', next: 'Define clear next step - time to commit' };
}

/**
 * Generate German coaching message (SLC: conversational)
 */
function generateCoachingMessage({ firstName, dominantProject, phase, recentTasks }) {
  const signals = recentTasks.filter(t => t.type === 'signal');
  const completed = signals.filter(t => t.completed);
  const completionRate = signals.length > 0 ? Math.round((completed.length / signals.length) * 100) : 0;

  // Build why message
  let why = `${firstName}, du hast ${completed.length} von ${signals.length} Signal-Tasks geschafft (${completionRate}%). `;

  if (completionRate >= 80) {
    why += `Starke Performance! ${dominantProject.name} läuft richtig gut.`;
  } else if (completionRate >= 50) {
    why += `${dominantProject.name} macht Fortschritte, aber da geht noch mehr.`;
  } else {
    why += `${dominantProject.name} braucht mehr Focus - viele Tasks bleiben liegen.`;
  }

  // Build next message
  const next = phase.next;

  // Suggest concrete task
  const uncompletedSignals = signals.filter(t => !t.completed);
  let suggestedTask = null;

  if (uncompletedSignals.length > 0) {
    // Pick most recent uncompleted signal
    const mostRecent = uncompletedSignals.sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )[0];

    suggestedTask = {
      text: mostRecent.text,
      reasoning: 'Unvollendete Signal-Task von diese Woche'
    };
  } else if (phase.phase === 'validation') {
    suggestedTask = {
      text: `${dominantProject.name}: Launch-Datum festlegen`,
      reasoning: 'Urgency erzeugen und zur Completion zwingen'
    };
  }

  return { why, next, suggestedTask };
}
