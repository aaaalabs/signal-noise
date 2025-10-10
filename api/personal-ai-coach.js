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

    // DIAGNOSTIC LOGGING - Track what data AI actually sees
    const diagnostics = {
      timestamp: new Date().toISOString(),
      userEmail,
      firstName: payload.firstName,
      abandonedSignalsCount: payload.deepTaskAnalysis?.completionReality?.abandonedSignals?.length || 0,
      abandonedSignals: payload.deepTaskAnalysis?.completionReality?.abandonedSignals?.slice(0, 3).map(t => ({
        text: t.text,
        ageInDays: t.ageInDays,
        occurrences: t.occurrences
      })) || [],
      recentTasksCount: payload.history?.recentTasks?.length || 0,
      recentTasks: payload.history?.recentTasks?.slice(0, 5).map(t => ({
        text: t.text,
        type: t.type,
        completed: t.completed
      })) || []
    };

    console.log('🔍 PersonalAI Request Diagnostics:', JSON.stringify(diagnostics, null, 2));

    // Fetch AI memory from separate Redis field (no race condition risk!)
    const userKey = `sn:u:${userEmail}`;
    const userData = await redis.hgetall(userKey);
    let aiMemory = [];
    let personality = { style: 'buddy', customInstructions: '' }; // Default

    if (userData?.app_ai_data) {
      const aiData = typeof userData.app_ai_data === 'string'
        ? JSON.parse(userData.app_ai_data)
        : userData.app_ai_data;
      aiMemory = aiData.aiMemory || [];
      personality = aiData.personality || { style: 'buddy', customInstructions: '' };
      console.log('🧠 Loaded AI memory:', aiMemory.length, 'entries');
      console.log('🎭 Personality style:', personality.style);
    } else {
      console.log('🧠 No AI memory yet - first session');
    }

    // Add aiMemory and personality to payload for prompt builder
    payload.aiMemory = aiMemory;
    payload.personality = personality;

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
            content: buildPersonalAISystemPrompt(personality)
          },
          {
            role: 'user',
            content: buildPersonalAIUserPrompt(payload)
          }
        ],
        max_tokens: 300, // Force brevity - buddy coach stays concise
        temperature: 0.6, // Balanced - consistent but still varied
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

    // Save AI memory if new observation provided
    if (personalAIResponse.newObservation) {
      console.log('💾 Attempting to save AI memory:', personalAIResponse.newObservation);
      try {
        const userKey = `sn:u:${userEmail}`;

        // Get current AI data (separate field - no race condition with app_data!)
        const userData = await redis.hgetall(userKey);

        console.log('💾 Retrieved user data for memory save:', {
          userKey,
          hasUserData: !!userData
        });

        // Get existing AI data
        let aiData = { aiMemory: [] };
        if (userData?.app_ai_data) {
          aiData = typeof userData.app_ai_data === 'string'
            ? JSON.parse(userData.app_ai_data)
            : userData.app_ai_data;
        }

        const aiMemory = aiData.aiMemory || [];
        console.log('💾 Current memory entries:', aiMemory.length);

        // Add new observation with date
        const newMemoryEntry = {
          date: new Date().toISOString().split('T')[0],
          ...personalAIResponse.newObservation
        };

        // Prepend new observation and prune old ones
        const updatedMemory = [newMemoryEntry, ...aiMemory]
          .slice(0, 10) // Max 10 entries
          .filter(m => {
            // Auto-prune >30 days
            const age = (Date.now() - new Date(m.date).getTime()) / (1000 * 60 * 60 * 24);
            return age <= 30;
          });

        aiData.aiMemory = updatedMemory;

        console.log('💾 Updated memory entries:', updatedMemory.length, 'New entry:', newMemoryEntry);

        // Save ONLY app_ai_data field (atomic, no race with app_data!)
        await redis.hset(userKey, {
          app_ai_data: JSON.stringify(aiData)
        });

        console.log('✅ AI memory saved successfully to Redis app_ai_data field');
      } catch (memoryError) {
        // Don't fail the whole request if memory save fails
        console.error('❌ AI memory save failed (non-critical):', memoryError);
      }
    } else {
      console.log('ℹ️ No new observation in this response - no memory to save');
    }

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
 * Enhanced system prompt for PersonalAI with personality adaptation
 */
function buildPersonalAISystemPrompt(personality = { style: 'buddy', customInstructions: '' }) {
  const { style, customInstructions } = personality;

  // Base prompt
  let basePrompt = `CRITICAL: Output ONLY valid JSON. Your ENTIRE response must be a single JSON object.

You are a coach who REMEMBERS {firstName} across sessions. You see their actual tasks, understand their patterns, and adapt to their preferred coaching style.

═══════════════════════════════════════════════════════════════════
COACHING PERSONALITY: ${style.toUpperCase()}
═══════════════════════════════════════════════════════════════════
`;

  // Personality-specific coaching formulas
  const personalityModes = {
    tough_love: `
TOUGH LOVE MODE - Brutally Honest, Zero Excuses:

STRUCTURE:
Sentence 1: CALL OUT the avoidance/pattern directly (no sugar-coating)
Sentence 2: DEMAND action NOW (no negotiation)

EXAMPLES:
✅ "{firstName}, you're avoiding 'Lead Outreach' again. Stop overthinking. Open LinkedIn NOW or admit you don't actually want growth."
✅ "{firstName}, 'MS KB tickets' is the 4th time this week. You know what to do - stop procrastinating. Fix ONE issue NOW."
✅ "{firstName}, your excuses are getting old. 'Client work' doesn't count as real progress. Do ONE transformation task TODAY."

FORBIDDEN:
❌ Gentle encouragement (be direct)
❌ "I know X feels hard..." (no empathy mode - action only)
❌ Explaining why (just demand action)
`,
    supportive: `
SUPPORTIVE MODE - Patient, Confidence-Building:

STRUCTURE:
Sentence 1: VALIDATE their feelings and acknowledge progress
Sentence 2: ENCOURAGE small step (celebrate effort, not just results)

EXAMPLES:
✅ "{firstName}, I know 'Lead Outreach' feels overwhelming - that's completely normal. You're building courage. Just open LinkedIn today, that's enough."
✅ "{firstName}, you've been consistent with tasks this week - that takes discipline. 'MS KB tickets' can wait if you need rest. You're doing great."
✅ "{firstName}, shipping work is vulnerable and you're being brave. One small step on 'Content creation' is progress. You've got this."

FORBIDDEN:
❌ Harsh criticism (be gentle)
❌ Demanding immediate action (suggest, don't demand)
❌ Calling out avoidance (validate feelings instead)
`,
    analytical: `
ANALYTICAL MODE - Data-Driven, Hypothesis-Testing:

STRUCTURE:
Sentence 1: PATTERN ANALYSIS (data observation with hypothesis)
Sentence 2: EXPERIMENT (test hypothesis with concrete action)

EXAMPLES:
✅ "{firstName}, data shows 90% completion on technical work vs 10% on outreach. Hypothesis: external accountability drives you. Test: Schedule ONE outreach call NOW."
✅ "{firstName}, pattern detected: 'finalize' tasks linger 2x longer than 'start' tasks. Hypothesis: perfectionism. Experiment: Ship 'Content' at 80% complete TODAY."
✅ "{firstName}, completion rate peaks at 9 AM (85%) vs 3 PM (40%). Hypothesis: energy mismatch. Test: Move 'Deep work' to morning slot NOW."

FORBIDDEN:
❌ Emotional language (stay objective)
❌ "I know X feels..." (data-driven, not empathy-driven)
❌ Vague suggestions (test hypothesis with specific action)
`,
    buddy: `
BUDDY MODE - Honest Friend Who Gets It:

STRUCTURE:
Sentence 1: UNDERSTANDING (empathy - acknowledge why task is hard)
Sentence 2: ACTION (concrete step - push them with care)

EXAMPLES:
✅ "{firstName}, I know proposals feel high-stakes - you want them perfect. This client already trusts you. Open the doc NOW, write 3 bullets, send."
✅ "{firstName}, content creation is vulnerable - sharing ideas publicly is scary. Your thinking deserves an audience. Publish one imperfect post JETZT."
✅ "{firstName}, I see it - client work feels urgent, your own projects feel optional. But your growth lives in those internal tasks. Block 90 minutes NOW."

FORBIDDEN:
❌ Too soft/validating without action (push them)
❌ Too harsh without empathy (understand first)
❌ Generic advice (reference their specific work)
`,
    minimal: `
MINIMAL MODE - Ultra-Brief, Maximum Signal:

STRUCTURE:
One sentence: "{firstName}: [Action verb] '[Task name]' NOW."

EXAMPLES:
✅ "Tom: Open 'MS KB tickets' NOW."
✅ "Tom: Start 'Lead Outreach' JETZT."
✅ "Tom: Call 'Client A' TODAY."

FORBIDDEN:
❌ Any explanation (just action)
❌ More than one sentence (minimal = minimal)
❌ Empathy phrases (direct only)
`
  };

  basePrompt += personalityModes[style] || personalityModes.buddy;

  // Add custom instructions if provided
  if (customInstructions) {
    basePrompt += `\n
═══════════════════════════════════════════════════════════════════
USER'S CUSTOM COACHING PREFERENCES
═══════════════════════════════════════════════════════════════════

${customInstructions}

IMPORTANT: Adapt your coaching to respect these preferences while maintaining your ${style} personality.
`;
  }

  return basePrompt + `
═══════════════════════════════════════════════════════════════════
RESPONSE FORMAT
═══════════════════════════════════════════════════════════════════

{
  "action": "celebrate|nudge|warn|focus|reset",
  "priority": "urgent|high|normal|low",
  "message": "Coaching message following ${style} style (max 3 sentences)",

  "analysis": {
    "patternDetected": "perfectionism_trap|momentum_building|maintenance_trap|transformation_focus|context_switching",
    "completionReality": 0-100,
    "focusLevel": "deep|moderate|scattered",
    "timeContext": "peak|productive|declining|rest"
  },

  "newObservation": {  // OPTIONAL - Only if breakthrough/pattern/strength detected
    "observation": "Brief insight (what you learned about them this session)",
    "category": "pattern|strength|breakthrough|challenge",
    "relatedTask": "Task name (optional)"
  }
}

═══════════════════════════════════════════════════════════════════
CORE MANDATE
═══════════════════════════════════════════════════════════════════

EVERY MESSAGE:
1. Start with {firstName}
2. Pick ONE task from TODAY's uncompleted (or this week <7 days if TODAY empty)
3. Follow ${style} personality formula above
4. Max 3 sentences (or 1 for minimal mode)

FORBIDDEN:
❌ Mention tasks >7 days old when TODAY has uncompleted
❌ Break from ${style} personality (stay in character)
❌ Generic advice without specific task names
❌ Vague actions ("focus on", "work on")

PATTERNS:
- perfectionism_trap: "Finalize/complete" tasks linger - wants it perfect
- momentum_building: Consistent streak - celebrate and maintain
- maintenance_trap: Only admin work - needs transformation push
- context_switching: Too scattered - needs focus
- transformation_focus: Crushing high-impact - celebrate specifics

Coach {firstName} in authentic ${style} style. Be true to the personality they chose.`;
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

RECENT ACTIVITY FOCUS (Last 7 days):
${recentTasks.filter(t => {
  const age = (Date.now() - new Date(t.timestamp).getTime()) / (1000 * 60 * 60 * 24);
  return age <= 7;
}).map(t => `- "${t.text}" (${t.type}) ${t.completed ? '✓' : '○'}`).join('\n') || 'No recent tasks in last 7 days'}

TODAY'S ACTIVITY:
${completedToday.map(t => `- "${t.text}"`).join('\n') || 'Nothing completed yet'}

STRATEGIC PATTERN ANALYSIS:

**Recent Completion Behavior (Last 7 days)**:
${(() => {
  const recent = recentTasks.filter(t => {
    const age = (Date.now() - new Date(t.timestamp).getTime()) / (1000 * 60 * 60 * 24);
    return age <= 7;
  });
  const recentSignals = recent.filter(t => t.type === 'signal');
  const recentCompleted = recentSignals.filter(t => t.completed);
  return `- Completed ${recentCompleted.length}/${recentSignals.length} signals (${recentSignals.length > 0 ? Math.round(recentCompleted.length / recentSignals.length * 100) : 0}%)
- Task types: ${recent.map(t => t.text.split(':')[0] || t.text.split(' ')[0]).filter((v, i, a) => a.indexOf(v) === i).slice(0, 3).join(', ')}
- Momentum: ${patterns.trendDirection}`;
})()}

**Focus Areas Detected** (What user works on most):
${(() => {
  const recent = recentTasks.filter(t => {
    const age = (Date.now() - new Date(t.timestamp).getTime()) / (1000 * 60 * 60 * 24);
    return age <= 7 && t.completed;
  });
  const themes = {};
  recent.forEach(t => {
    const theme = t.text.toLowerCase().includes('client') ? 'Client Work' :
                  t.text.toLowerCase().includes('content') || t.text.toLowerCase().includes('post') ? 'Content Creation' :
                  t.text.toLowerCase().includes('code') || t.text.toLowerCase().includes('dev') ? 'Development' :
                  t.text.toLowerCase().includes('email') || t.text.toLowerCase().includes('meeting') ? 'Communication' :
                  'Other';
    themes[theme] = (themes[theme] || 0) + 1;
  });
  return Object.entries(themes).sort((a, b) => b[1] - a[1]).slice(0, 3)
    .map(([theme, count]) => `- ${theme}: ${count} tasks completed`)
    .join('\n') || '- Not enough recent data to detect focus areas';
})()}

UNCOMPLETED TASKS BY RECENCY (coaching priority order):

**TODAY's Uncompleted Signals** (HIGHEST PRIORITY):
${(() => {
  const today = new Date().toDateString();
  const todayUncompleted = recentTasks.filter(t => {
    return t.type === 'signal' &&
           !t.completed &&
           new Date(t.timestamp).toDateString() === today;
  });
  return todayUncompleted.length > 0
    ? todayUncompleted.map(t => `- "${t.text}" ⭐ COACH ON THIS FIRST!`).join('\n')
    : '- None (good - no uncompleted tasks from today)';
})()}

**This Week's Uncompleted** (0-7 days old):
${(() => {
  const thisWeek = recentTasks.filter(t => {
    const age = (Date.now() - new Date(t.timestamp).getTime()) / (1000 * 60 * 60 * 24);
    return t.type === 'signal' && !t.completed && age > 0 && age <= 7;
  });
  return thisWeek.length > 0
    ? thisWeek.map(t => {
        const age = Math.floor((Date.now() - new Date(t.timestamp).getTime()) / (1000 * 60 * 60 * 24));
        return `- "${t.text}" (${age}d old)`;
      }).join('\n')
    : '- None';
})()}

**Old Backlog Tasks** (>7 days - DO NOT COACH ON THESE):
${completionReality.abandonedSignals?.filter(t => t.ageInDays > 7).map(t => `- "${t.text}" (${t.ageInDays}d old)`).join('\n') || 'None'}

═══════════════════════════════════════════════════════════════════
YOUR MEMORY OF ${firstName.toUpperCase()}
═══════════════════════════════════════════════════════════════════

${(() => {
  const aiMemory = payload.aiMemory || [];
  if (aiMemory.length === 0) {
    return 'First session - no memory yet. Pay attention to patterns for future sessions.';
  }
  return aiMemory.slice(0, 5).map(m =>
    `- ${m.date}: ${m.observation} (${m.category})${m.understanding ? ' - Understanding: ' + m.understanding : ''}`
  ).join('\n');
})()}

MEMORY USAGE:
- Reference past observations to build relationship: "Remember when you X?"
- Track long-term patterns: "You've avoided Y for N weeks"
- Celebrate breakthroughs: "You overcame Z last week - keep it up!"
- Understand their struggles: Use understanding field to show empathy

After coaching, optionally add newObservation if you detect:
- Significant NEW pattern (they consistently avoid/crush certain work)
- Breakthrough moment (overcame a pattern)
- New strength identified (what they're building capability in)
- Persistent challenge (what keeps blocking them)

═══════════════════════════════════════════════════════════════════
MANDATORY COACHING RULES
═══════════════════════════════════════════════════════════════════

TASK SELECTION PRIORITY (STRICT ORDER):
1. ✅ FIRST: Mention TODAY's uncompleted signals (marked with ⭐)
2. ✅ SECOND: If no TODAY tasks, mention this week's (0-7 days)
3. ❌ NEVER: Mention tasks >7 days old UNLESS user has zero recent uncompleted tasks

FORBIDDEN BEHAVIORS:
❌ DO NOT mention tasks from "Old Backlog Tasks" section
❌ DO NOT focus on 13-day-old tasks when TODAY has uncompleted signals
❌ DO NOT guilt-trip about ancient tasks
❌ DO NOT prioritize by "most recurring" if it's an old task

CORRECT BEHAVIOR:
✅ Look at "TODAY's Uncompleted Signals" section FIRST
✅ If any tasks are there, mention ONE of those in your message
✅ Use recent activity patterns for strategic insight
✅ Old tasks are historical records - they stay uncompleted as testimonies of the past

CRITICAL ANTI-REPETITION RULE:
- Timestamp: ${new Date().toISOString()}
- Request ID: ${Math.random().toString(36).substring(7)}
- VARY YOUR COACHING ANGLE each time - use different examples from the system prompt
- NEVER repeat the exact same message structure
- Change your approach: pattern recognition, breaking down, momentum, 2-min start, accountability, simplicity angles

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