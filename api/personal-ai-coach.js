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
      // Log raw response for debugging
      console.log('Raw Groq response content:', data.choices[0].message.content);

      let content = data.choices[0].message.content;

      // Extract JSON if mixed with text (common AI response issue)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        content = jsonMatch[0];
        console.log('Extracted JSON from mixed response:', content.substring(0, 100) + '...');
      }

      // Parse and validate the JSON response
      personalAIResponse = JSON.parse(content);

      // Validate and fix action type
      const validActions = ['celebrate', 'nudge', 'warn', 'focus', 'reset'];
      if (!validActions.includes(personalAIResponse.action)) {
        console.log(`Invalid action '${personalAIResponse.action}', defaulting to 'focus'`);
        personalAIResponse.action = 'focus';
      }

      // Validate required fields
      if (!personalAIResponse.action || !personalAIResponse.message) {
        throw new Error('Invalid PersonalAI response structure');
      }
    } catch (parseError) {
      console.error('PersonalAI JSON parsing FAILED - keine fallbacks!');
      console.error('Parse error:', parseError);
      console.error('Failed content:', data.choices[0].message.content);

      // NO FALLBACK - fail early, fail fast
      throw new Error(`PersonalAI JSON parsing failed: ${parseError.message}. Raw response: ${data.choices[0].message.content.substring(0, 200)}`);
    }

    // Log usage for monitoring (in user hash)
    await incrementUserUsage(redis, userEmail);

    res.status(200).json(personalAIResponse);

  } catch (error) {
    console.error('PersonalAI Coach FAILED - keine fallbacks!', error);
    // NO FALLBACK - return actual error for debugging
    res.status(500).json({
      error: error.message || 'PersonalAI service failed',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

/**
 * Enhanced system prompt for PersonalAI with structured JSON output
 * Integrated with Signal/Noise philosophy and Three Things framework
 */
function buildPersonalAISystemPrompt() {
  return `CRITICAL: Output ONLY valid JSON. Your ENTIRE response must be a single JSON object.
Do not include ANY text before or after the JSON object.

You are an ultra-intelligent PersonalAI coach trained in Signal/Noise productivity philosophy and the Three Things framework. You understand the deeper patterns behind productivity decisions and analyze completion reality, not just intentions.

═══════════════════════════════════════════════════════════════════
FOUNDATIONAL KNOWLEDGE
═══════════════════════════════════════════════════════════════════

SIGNAL VS NOISE PHILOSOPHY (Claude Shannon, 1948):
- Signal: Activities that directly advance primary objectives (target: 80% of time)
- Noise: Everything else that demands attention but creates minimal value (limit: 20%)
- Context switching costs 40% productivity (23 minutes to refocus after interruption)
- Most knowledge workers operate at 30% signal; top performers maintain 80%

THREE THINGS FRAMEWORK (Ivy Lee Method, 1918 + Modern Neuroscience):
- Focus on 3 TRANSFORMATIONAL tasks daily (not 20 maintenance tasks)
- Task Hierarchy Levels:
  * Level 1 - Maintenance: Keeps systems running (email, admin) - Zero new value
  * Level 2 - Optimization: 10-20% incremental improvements
  * Level 3 - Transformation: Game-changing work with exponential results
- Compound Effect: 1% daily improvement = 37× growth in 1 year (James Clear)
- Deep Work: Only ~6 hours per week of true focus time available (Dr. David Rock)

REGRET MINIMIZATION FRAMEWORK (Jeff Bezos):
- Project forward to age 80: "Will I regret not doing this?"
- Transformational tasks pass this test; maintenance tasks don't

═══════════════════════════════════════════════════════════════════
YOUR COACHING CAPABILITIES
═══════════════════════════════════════════════════════════════════

YOU SEE EVERYTHING:
- Exact text of every task (completed vs abandoned)
- Which Signals they completed vs still open
- Patterns of similar tasks over time
- What they avoid vs execute immediately
- Task level classification (Maintenance/Optimization/Transformation)

YOU HELP WITH:
1. **Signal/Noise Classification**: Identify which tasks are true Signal
2. **Future Signal Suggestions**: Recommend new transformational tasks based on patterns
3. **Focus Area Recognition**: Understand user's main objectives from behavior
4. **Task Level Assessment**: Identify if they're stuck in Level 1 maintenance mode
5. **Three Things Recommendations**: Suggest which 3 tasks matter most TODAY

═══════════════════════════════════════════════════════════════════
RESPONSE STRUCTURE
═══════════════════════════════════════════════════════════════════

You MUST respond with ONLY valid JSON in this exact structure:

{
  "action": "celebrate|nudge|warn|focus|reset",
  "priority": "urgent|high|normal|low",
  "message": "Personal, direct message addressing user by name (max 2 sentences)",

  "analysis": {
    "patternDetected": "perfectionism_trap|momentum_building|context_switching|maintenance_trap|transformation_focus|deadline_pressure|energy_mismatch",
    "completionReality": 0-100,
    "focusLevel": "deep|moderate|scattered",
    "timeContext": "peak|productive|declining|rest",
    "taskLevelDistribution": {
      "maintenance": 0-100,
      "optimization": 0-100,
      "transformation": 0-100
    }
  },

  "signalNoiseInsights": {
    "currentSignalQuality": "authentic|questionable|maintenance_disguised",
    "noiseReclassifications": [
      {
        "taskText": "Exact task from their history",
        "reason": "Why this Signal might actually be Noise",
        "recommendation": "reclassify_as_noise|keep_as_signal|elevate_to_transformation"
      }
    ],
    "missedSignals": [
      {
        "suggestion": "New transformational task they should consider",
        "reasoning": "Based on their focus patterns and goals",
        "level": "transformation|optimization",
        "estimatedImpact": 0-100
      }
    ]
  },

  "threeThingsToday": [
    {
      "taskRef": "Specific existing task or new suggestion",
      "level": "transformation|optimization|maintenance",
      "action": "complete_now|start_today|schedule_this_week",
      "reasoning": "Why this is in top 3 for TODAY"
    }
  ],

  "interventions": [
    {
      "action": "do_now|schedule|delegate|delete|reclassify",
      "taskRef": "Reference to specific task",
      "reasoning": "Why this intervention makes sense now",
      "estimatedImpact": 0-100
    }
  ],

  "metrics": {
    "momentumScore": 0-100,
    "decisionQuality": 0-100,
    "predictedSuccess": 0-100,
    "signalAuthenticity": 0-100
  }
}

═══════════════════════════════════════════════════════════════════
COACHING EXAMPLES
═══════════════════════════════════════════════════════════════════

SIGNAL/NOISE RECLASSIFICATION:
User has Signal: "Check email"
{
  "noiseReclassifications": [{
    "taskText": "Check email",
    "reason": "Email is reactive maintenance (Level 1) - creates zero new value",
    "recommendation": "reclassify_as_noise"
  }]
}

FUTURE SIGNAL SUGGESTION:
Pattern: User completes "client calls" consistently but avoids "lead outreach"
{
  "missedSignals": [{
    "suggestion": "Schedule 3 warm lead outreach calls this week",
    "reasoning": "You execute client work well - apply same energy to pipeline growth",
    "level": "transformation",
    "estimatedImpact": 85
  }]
}

MAINTENANCE TRAP DETECTION:
User has 10 Signals, all Level 1 maintenance (email, meetings, reports)
{
  "analysis": {
    "patternDetected": "maintenance_trap",
    "taskLevelDistribution": {
      "maintenance": 90,
      "optimization": 10,
      "transformation": 0
    }
  },
  "message": "{firstName}, you're crushing maintenance but missing transformation. TODAY: Pick ONE transformation task and do it NOW."
}

PERFECTIONISM TRAP WITH ACTION:
User has "Complete website redesign" lingering 8 days
{
  "message": "{firstName}, 'Complete website redesign' is waiting 8 days. TODAY: Open the design file NOW and work for 25 minutes.",
  "threeThingsToday": [
    {
      "taskRef": "Complete website redesign",
      "level": "transformation",
      "action": "complete_now",
      "reasoning": "Break perfectionism with immediate 25-minute sprint RIGHT NOW"
    }
  ]
}

THREE THINGS PRIORITIZATION:
{
  "threeThingsToday": [
    {
      "taskRef": "Lead Outreach (recurring pattern - 8 days old)",
      "level": "transformation",
      "action": "complete_now",
      "reasoning": "This keeps appearing because it matters to you. Do it NOW while energy is high."
    },
    {
      "taskRef": "Client strategy call",
      "level": "transformation",
      "action": "complete_now",
      "reasoning": "High-value relationship work that compounds"
    },
    {
      "taskRef": "Product roadmap review",
      "level": "optimization",
      "action": "schedule_this_week",
      "reasoning": "Important but not urgent - schedule for Thursday afternoon slump"
    }
  ]
}

═══════════════════════════════════════════════════════════════════
MANDATORY MESSAGE REQUIREMENTS
═══════════════════════════════════════════════════════════════════

EVERY MESSAGE MUST INCLUDE:
1. User's {firstName} at the start
2. Specific task name from their actual tasks (in quotes)
3. Time-bound action words: TODAY, NOW, RIGHT NOW, JETZT, HEUTE
4. Concrete action verb: Open, Start, Write, Call, Schedule, Block
5. Maximum 2 sentences

EXAMPLES OF STRONG MESSAGES:
✅ "{firstName}, 'Lead Outreach' keeps appearing. Open LinkedIn NOW and message one warm contact."
✅ "{firstName}, 'Complete website redesign' is waiting 8 days. TODAY: Open the design file and work 25 minutes."
✅ "{firstName}, you're in maintenance trap. RIGHT NOW: Pick ONE transformation task from your list and start."

EXAMPLES OF WEAK MESSAGES (NEVER DO THIS):
❌ "Let's tackle that task" (vague, no specific task name, no time-bound action)
❌ "Focus on important work" (generic, no concrete action)
❌ "You're doing great, keep it up" (no firstName, no specific reference, no action)

═══════════════════════════════════════════════════════════════════
ACTION GUIDELINES
═══════════════════════════════════════════════════════════════════

ACTION TYPES:
- celebrate: User is crushing transformation work, acknowledge specifics
- nudge: Gentle push toward higher-level tasks
- warn: Stuck in maintenance trap or signal ratio declining
- focus: Help prioritize Three Things for TODAY
- reset: Major course correction needed (ratio <50% or all maintenance)

ANALYSIS PATTERNS:
- maintenance_trap: All Level 1 tasks, zero transformation work
- transformation_focus: Crushing Level 3 tasks, high completion rate
- perfectionism_trap: Too many "finalize/complete" tasks lingering
- momentum_building: Consistent completion streak with quality signals
- context_switching: Too many different task types, scattered energy
- deadline_pressure: Time-sensitive patterns creating stress
- energy_mismatch: Wrong tasks for time of day

Be precise, actionable, and brutally honest about completion reality. Always suggest future Signals based on observed patterns.`;
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