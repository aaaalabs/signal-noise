import { Redis } from '@upstash/redis';
import { incrementUserUsage, checkUserRateLimit } from './redis-helper.js';

// Initialize Redis for premium user verification
const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

// Enhanced rate limiting for PersonalAI (20 requests per hour)
const PERSONAL_AI_RATE_LIMIT = 20;
const RATE_WINDOW = 3600; // 1 hour in seconds

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { payload, userEmail, accessToken } = req.body;

    // Validate required fields
    if (!payload || !userEmail || !accessToken) {
      return res.status(400).json({
        error: 'Missing required fields: payload, userEmail, accessToken'
      });
    }

    // Verify premium access for PersonalAI
    const isDev = process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV !== 'production';
    const isDevUser = userEmail === 'dev@signal-noise.test';
    const isBetaUser = userEmail === 'beta@signal-noise.test';
    const isPersonalAIBeta = userEmail === 'personal-ai@signal-noise.test';

    // Allow special beta users for PersonalAI testing
    const hasPersonalAIAccess = (isDev && isDevUser) || isBetaUser || isPersonalAIBeta || await verifyPersonalAIAccess(userEmail, accessToken);
    if (!hasPersonalAIAccess) {
      return res.status(403).json({
        error: 'PersonalAI access required. This is an enhanced premium feature.'
      });
    }

    // Check enhanced rate limit for PersonalAI
    const isAllowed = (isDev && isDevUser) || isBetaUser || isPersonalAIBeta || await checkUserRateLimit(redis, userEmail, PERSONAL_AI_RATE_LIMIT);
    if (!isAllowed) {
      return res.status(429).json({
        error: 'Rate limit exceeded. PersonalAI users get 20 requests per hour.'
      });
    }

    // Call Groq API with PersonalAI model
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_PERSONAL_AI_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.GROQ_PERSONAL_AI_MODEL || 'llama-4-maverick-17b-128e-instruct',
        messages: [
          {
            role: 'system',
            content: buildPersonalAISystemPrompt()
          },
          {
            role: 'user',
            content: buildPersonalAIUserPrompt(payload)
          }
        ],
        max_tokens: 1000,
        temperature: 0.3,
        response_format: { type: "json_object" } // Force JSON output
      }),
    });

    if (!groqResponse.ok) {
      throw new Error(`Groq PersonalAI API error: ${groqResponse.status}`);
    }

    const data = await groqResponse.json();
    let personalAIResponse;

    try {
      // Parse and validate the JSON response
      personalAIResponse = JSON.parse(data.choices[0].message.content);

      // Validate required fields
      if (!personalAIResponse.action || !personalAIResponse.message) {
        throw new Error('Invalid PersonalAI response structure');
      }
    } catch (parseError) {
      console.error('PersonalAI JSON parsing error:', parseError);
      // Fallback response
      personalAIResponse = {
        action: 'analyze',
        priority: 'normal',
        message: `Hey ${payload.firstName}! I'm analyzing your productivity patterns. Let me give you a quick insight based on your current ${payload.context.currentRatio}% signal ratio.`,
        analysis: {
          patternDetected: 'baseline_analysis',
          completionReality: payload.context.currentRatio,
          focusLevel: payload.context.currentRatio >= 80 ? 'deep' : payload.context.currentRatio >= 60 ? 'moderate' : 'scattered',
          timeContext: 'productive'
        },
        interventions: [],
        metrics: {
          momentumScore: Math.min(payload.context.currentRatio, 100),
          decisionQuality: Math.round(payload.metrics.averageRatio7Days || 70),
          predictedSuccess: Math.round((payload.context.currentRatio + (payload.metrics.averageRatio7Days || 70)) / 2)
        }
      };
    }

    // Log usage for monitoring (in user hash)
    await incrementUserUsage(redis, userEmail);

    res.status(200).json(personalAIResponse);

  } catch (error) {
    console.error('PersonalAI Coach error:', error);
    res.status(500).json({
      error: 'PersonalAI service temporarily unavailable',
      fallback: true
    });
  }
}

/**
 * Enhanced system prompt for PersonalAI with structured JSON output
 */
function buildPersonalAISystemPrompt() {
  return `You are an ultra-intelligent PersonalAI that understands the deeper patterns behind productivity decisions. You analyze task completion reality, not just intentions.

CORE MISSION:
- Be the smartest productivity buddy who sees patterns others miss
- Give actionable insights based on ACTUAL behavior, not stated goals
- Focus on completion reality vs. planning fantasy
- Understand task psychology and timing context

RESPONSE REQUIREMENTS:
You MUST respond with valid JSON in this exact structure:

{
  "action": "celebrate|nudge|warn|focus|reset",
  "priority": "urgent|high|normal|low",
  "message": "Personal, direct message addressing user by name (max 2 sentences)",

  "analysis": {
    "patternDetected": "Brief pattern insight (e.g., 'perfectionism_trap', 'momentum_building', 'context_switching')",
    "completionReality": 0-100,
    "focusLevel": "deep|moderate|scattered",
    "timeContext": "peak|productive|declining|rest"
  },

  "interventions": [
    {
      "action": "do_now|schedule|delegate|delete",
      "taskRef": "Reference to specific task or pattern",
      "reasoning": "Why this intervention makes sense now",
      "estimatedImpact": 0-100
    }
  ],

  "metrics": {
    "momentumScore": 0-100,
    "decisionQuality": 0-100,
    "predictedSuccess": 0-100
  }
}

ACTION TYPES:
- celebrate: User is crushing it, acknowledge progress
- nudge: Gentle push toward better decisions
- warn: Pattern could derail progress
- focus: Help prioritize what matters most
- reset: Major course correction needed

ANALYSIS PATTERNS:
- perfectionism_trap: Too many "finalize/complete" tasks
- momentum_building: Consistent completion streak
- context_switching: Too many different task types
- deadline_pressure: Time-sensitive patterns
- energy_mismatch: Wrong tasks for time of day

TIME CONTEXT AWARENESS:
- Morning (6-9): peak energy, tackle hardest tasks
- Productive (9-14): maintain momentum, execute
- Declining (14-17): admin, easier tasks
- Rest (17-22): plan tomorrow, light tasks

Be precise, actionable, and brutally honest about completion reality.`;
}

/**
 * Build user prompt with comprehensive data analysis
 */
function buildPersonalAIUserPrompt(payload) {
  const { firstName, context, metrics, patterns, history } = payload;

  // Time awareness
  const now = new Date();
  const hour = now.getHours();
  const timeOfDay = hour < 9 ? 'morning' : hour < 14 ? 'productive' : hour < 17 ? 'declining' : 'rest';

  // Recent task analysis
  const recentTasks = history.recentTasks || [];
  const completedToday = recentTasks.filter(t => {
    const taskDate = new Date(t.timestamp).toDateString();
    const today = new Date().toDateString();
    return taskDate === today && t.completed;
  });

  // Personal AI specific analysis
  const deepAnalysis = payload.deepTaskAnalysis || {};
  const completionReality = deepAnalysis.completionReality || {};

  return `PersonalAI Analysis for ${firstName} - ${timeOfDay} mode (${hour}:00):

CURRENT CONTEXT:
- Signal Ratio: ${context.currentRatio}%
- Today's Tasks: ${context.todayTasks}
- Trigger: ${context.triggerType}

COMPLETION REALITY:
- Total Signals Planned: ${completionReality.totalSignals || 0}
- Actually Completed: ${completionReality.completedSignals || 0}
- Completion Rate: ${completionReality.completionRate || '0'}%
- Abandoned Tasks: ${completionReality.abandonedSignals?.length || 0}

PERFORMANCE METRICS:
- Current Streak: ${metrics.currentStreak} days
- 7-day Average: ${metrics.averageRatio7Days}%
- 30-day Average: ${metrics.averageRatio30Days}%
- Total Decisions: ${metrics.totalDecisions}
- Perfect Days: ${metrics.perfectDays}

BEHAVIORAL PATTERNS:
- Best Hour: ${patterns.bestHour}:00
- Trend: ${patterns.trendDirection}
- Consistency Score: ${patterns.consistencyScore}%

RECENT ACTIVITY (Last 10 tasks):
${recentTasks.map(t => `- "${t.text}" (${t.type}) ${t.completed ? '✓' : '○'}`).join('\n')}

TODAY COMPLETED:
${completedToday.map(t => `- "${t.text}"`).join('\n') || 'Nothing completed yet'}

ABANDONED SIGNALS (>3 days):
${completionReality.abandonedSignals?.map(t => `- "${t.text}" (${t.ageInDays}d old)`).join('\n') || 'None'}

OLDEST UNFINISHED:
${completionReality.oldestUncompletedSignal ? `"${completionReality.oldestUncompletedSignal.text}" - ${completionReality.oldestUncompletedSignal.ageInDays} days old` : 'None'}

Analyze ${firstName}'s patterns and provide personalized insights with specific interventions for right now (${timeOfDay} at ${hour}:00).`;
}

/**
 * Verify PersonalAI access (enhanced premium feature)
 */
async function verifyPersonalAIAccess(userEmail, accessToken) {
  try {
    // For now, use same premium verification as standard coach
    // In future, could require specific PersonalAI tier
    const user = await redis.hgetall(`sn:u:${userEmail}`);
    return user && (user.tier === 'foundation' || user.tier === 'early_adopter' || user.premium === 'true');
  } catch (error) {
    console.error('PersonalAI access verification error:', error);
    return false;
  }
}