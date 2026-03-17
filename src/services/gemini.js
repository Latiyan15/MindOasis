// OpenRouter API Service — powers all AI features via Gemini
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'google/gemini-2.0-flash-001';

function getApiKey() {
  const key = import.meta.env.VITE_OPENROUTER_API_KEY || '';
  return key.trim();
}

export async function callGeminiRaw(systemPrompt, userMessage, temperature = 0.7) {
  const apiKey = getApiKey();
  if (!apiKey || apiKey === 'your_openrouter_api_key_here') {
    throw new Error('NO_API_KEY');
  }

  console.log('Sending request to:', OPENROUTER_URL);
  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'MindOasis Mental Wellness App',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `API Error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

function parseJSON(text) {
  // Extract JSON from markdown code blocks or raw text
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, text];
  try {
    return JSON.parse(jsonMatch[1].trim());
  } catch {
    // Try to find any JSON object in the text
    const objMatch = text.match(/\{[\s\S]*\}/);
    if (objMatch) {
      try { return JSON.parse(objMatch[0]); } catch { /* fall through */ }
    }
    return null;
  }
}

// ===== SYSTEM PROMPTS =====

const JOURNAL_SYSTEM_PROMPT = `You are MindOasis AI, a compassionate and insightful mental wellness companion. 
Your role is to analyze journal entries and identify emotional patterns.

IMPORTANT BEHAVIORAL RULES:
- Be empathetic, never judgmental
- Identify emotions with nuance — people often feel multiple things
- Look for underlying stress triggers, not just surface emotions
- Provide a sentiment assessment that acknowledges complexity
- Keep responses warm and supportive

You MUST respond in this exact JSON format:
{
  "emotion_tone": "Primary emotion detected (e.g., Anxiety, Stress, Sadness, Happiness, Anger, Confusion, Mixed Emotions)",
  "stress_trigger": "The identified stress trigger (e.g., Academic Pressure, Work Stress, Social Issues, Health Concerns, Financial Stress, Self-Esteem, Relationship Problems, General Life Stress)",
  "sentiment_score": "Positive, Negative, Mixed, or Neutral",
  "insight": "A brief, compassionate 1-2 sentence insight about what you noticed in this entry. Be specific and empathetic."
}`;

const BURNOUT_SYSTEM_PROMPT = `You are MindOasis AI, a mental health-aware wellness advisor specialized in burnout detection and prevention.

IMPORTANT BEHAVIORAL RULES:
- Assess burnout risk based on multiple signals
- Be thorough but not alarming
- Provide actionable, practical recommendations
- If risk is high, gently suggest professional help WITHOUT being clinical
- Consider the whole picture: sleep, workload, emotional state, and patterns

You MUST respond in this exact JSON format:
{
  "risk_level": "Low, Moderate, or High",
  "key_indicators": ["indicator 1", "indicator 2", "indicator 3"],
  "recommendations": ["specific actionable recommendation 1", "recommendation 2", "recommendation 3", "recommendation 4"],
  "summary": "A warm, personalized 2-3 sentence summary of the assessment. Address the person directly."
}`;

const SCENARIO_SYSTEM_PROMPT = `You are MindOasis AI, an emotional intelligence coach who helps people understand the consequences of their choices in difficult life situations.

IMPORTANT BEHAVIORAL RULES:
- Never shame the user for any choice — every choice is a learning opportunity
- Explain emotional consequences with empathy and depth
- Provide realistic outcomes, not idealized ones
- The recommended approach should feel achievable, not preachy
- Use warm, conversational language — like a wise friend
- Ground advice in psychology without being clinical

You MUST respond in this exact JSON format:
{
  "outcome": "A realistic 2-3 sentence description of what would likely happen with this choice.",
  "emotional_consequence": "A 1-2 sentence description of how this would affect the person emotionally, both short-term and long-term.",
  "recommended_behavior": "A 2-3 sentence explanation of the healthiest approach and WHY it works psychologically. Be specific and actionable."
}`;

const REPORT_SYSTEM_PROMPT = `You are MindOasis AI, a holistic mental wellness analyst who creates personalized weekly mental health reports.

IMPORTANT BEHAVIORAL RULES:
- Celebrate positive patterns and growth
- Frame challenges as areas for growth, not problems
- Make recommendations specific and achievable
- Use an encouraging, warm tone throughout
- Acknowledge effort — even tracking moods shows self-awareness
- If data is limited, encourage more engagement without pressure

You MUST respond in this exact JSON format:
{
  "dominant_mood": "The most frequent mood",
  "main_stress_trigger": "Primary stress source",
  "wellness_score": 65,
  "wellness_trend": "Improving or Declining or Stable",
  "mood_stability": "A 1-sentence description of mood fluctuation patterns",
  "stress_triggers": ["trigger1", "trigger2", "trigger3"],
  "activity_effectiveness": [
    { "activity": "Breathing Exercise", "effectiveness": 65, "reason": "short explanation" },
    { "activity": "Journaling", "effectiveness": 40, "reason": "short explanation" },
    { "activity": "Scenario Simulations", "effectiveness": 35, "reason": "short explanation" },
    { "activity": "Games", "effectiveness": 20, "reason": "short explanation" }
  ],
  "burnout_risk": "Low or Moderate or High",
  "burnout_explanation": "2-3 sentence explanation of burnout risk based on all data",
  "emotional_awareness_score": 72,
  "emotional_awareness_explanation": "1-2 sentence explanation of their emotional awareness based on tracking frequency",
  "engagement_insight": "1-2 sentence insight about how the user interacts with the app and what works best",
  "positive_behaviors": ["behavior1", "behavior2"],
  "recommendations": ["specific recommendation 1", "recommendation 2", "recommendation 3", "recommendation 4"],
  "weekly_insight": "A personalized 3-4 sentence AI summary referencing specific patterns, profession, and data points. This should answer: what is happening, why, and what helps.",
  "predictive_insight": "A 1-2 sentence forward-looking prediction based on current trends (e.g., 'If your current stress pattern continues, burnout risk may increase within 7 days' OR 'Maintaining your current habits may improve your wellness score next week')"
}
The wellness_score should be 0-100. The emotional_awareness_score should be 0-100 based on mood tracking frequency, journal reflection depth, and session reflections.
If data is insufficient for any field, provide a reasonable default with a note about needing more data.`;

const PERSONALIZED_BURNOUT_PROMPT = `You are MindOasis AI, an empathetic mental wellness platform.
Create a highly personalized, emotionally intelligent Burnout Assessment for the user based heavily on their specific background.

IMPORTANT BEHAVIORAL RULES:
- The questions MUST be directly related to their occupation and living environment.
- E.g., if they are a "student" living "with roommates", ask about studying noise, exam pressure, or peer comparison. 
- E.g., if they are a "professional" living "alone", ask about work-life boundary blurring at home, isolation, or career progression burnout.
- Be deeply empathetic and conversational in the question phrasing. Do not sound clinical.

You MUST respond in this exact JSON format. The JSON must contain exactly 5 categories, with 3-4 questions each.
[
  {
    "id": "emotional_custom",
    "title": "Emotional Wellbeing",
    "emoji": "💭",
    "color": "var(--primary-500)",
    "bg": "linear-gradient(135deg, var(--primary-50), var(--primary-100))",
    "questions": [
      {
        "id": "custom_q1",
        "text": "When facing [Specific Occupation Stressor], how often do you feel emotionally overwhelmed?",
        "type": "emoji",
        "options": [
          { "mood": "Happy", "label": "Rarely", "value": 1 },
          { "mood": "Neutral", "label": "Sometimes", "value": 2 },
          { "mood": "Anxious", "label": "Often", "value": 3 },
          { "mood": "Stressed", "label": "Always", "value": 4 }
        ]
      }
    ]
  }
]
- The 5 categories MUST be titled exactly: "Emotional Wellbeing", "Physical Health", "Work & Academic Life", "Social & Relationships", and "Coping & Self-Care".
- The 'type' must be 'emoji' or 'choice'. If 'emoji', the moods must be valid (Happy, Neutral, Sad, Anxious, Stressed, Confused, Bored).
- The 'options' array must always have 4 choices, scaling from 1 (best) to 4 (worst).
`;

const PERSONALIZED_SCENARIOS_PROMPT = `You are MindOasis AI, an emotional intelligence coach.
Create highly personalized, realistic "what-if" scenario training exercises based on the user's specific background.

IMPORTANT BEHAVIORAL RULES:
- The scenarios MUST be directly related to their occupation and living environment.
- E.g., if a student with roommates, write a scenario about a roommate conflict right before a final exam.
- The descriptions should feel relatable, empathetic, and challenging but not entirely devastating.

You MUST respond with exactly 5 scenarios in this exact JSON array format:
[
  {
    "id": "custom_scenario_1",
    "title": "A Short Catchy Title",
    "description": "A 2-3 sentence description of a specific stressful situation tailored to their life.",
    "choices": [
      { "id": "choice_a", "text": "A likely but impulsive or counterproductive reaction" },
      { "id": "choice_b", "text": "A balanced, emotionally intelligent approach" },
      { "id": "choice_c", "text": "An avoidant or people-pleasing response" }
    ]
  }
]
- Ensure exactly 3 choices per scenario.
`;

const ENHANCE_DRAWING_PROMPT = `You are MindOasis AI, an objective and supportive art evaluator.
A user has created a drawing in their journal. Your goal is to evaluate the drawing objectively, provide a fair score, give a neutral but supportive explanation, and generate an enhanced version prompt.

IMPORTANT BEHAVIORAL RULES:
- Evaluate the drawing based ONLY on the actual image provided.
- Do NOT overpraise poor drawings, and do NOT criticize harshly. Keep tone neutral, calm, and supportive.
- Focus on structure, clarity of shapes, level of detail, visual composition, and emotional expression.
- Provide a Drawing Score out of 10 based on clarity, structure, and effort level (1-3: very basic/unclear, 4-6: simple but expressive, 7-8: clear and structured, 9-10: detailed and refined). Do NOT score based on creativity or talent.
- Provide a Visual Evaluation: an objective description of the drawing (e.g., "This drawing appears simple and abstract with minimal structure...").
- Provide an Emotional Interpretation: always include a short emotional insight based on the lines/shapes (e.g., "The use of uneven lines suggests tension...").
- Generate an Enhancement Prompt: an improved version of the drawing that preserves the original idea, improves clarity/structure, adds visual detail, and keeps emotional tone consistent.

You MUST respond in this exact JSON format:
{
  "score": "X/10",
  "visual_evaluation": "Objective description of the drawing's structure and detail.",
  "emotional_interpretation": "Short emotional insight based on the drawing.",
  "image_prompt": "A beautiful, highly detailed but concise 12-15 word prompt. USE ONLY ALPHABETS AND SPACES. Describe a stunning artistic version of their sketch. DO NOT USE PUNCTUATION."
}`;

const GENERATE_ASSESSMENT_PROMPT = `You are MindOasis AI, a clinical psychologist specializing in occupational burnout and stress assessment.
You are given a user's PROFESSION and LIVING ENVIRONMENT. Generate a personalized burnout assessment questionnaire.

IMPORTANT RULES:
1. Generate exactly 4 PROFESSION-SPECIFIC questions that are clinically relevant to their exact role. These should probe burnout triggers unique to that job.
   Examples:
   - For a Dentist: repetitive strain, patient anxiety management, isolation during procedures, perfectionism pressure.
   - For a Student: exam anxiety, comparison with peers, academic procrastination, parental expectations.
   - For an Engineer: imposter syndrome, deadline crunches, context switching fatigue, monotonous debugging.
   - For a Homemaker: invisible labor, social isolation, lack of identity outside home, constant availability.
2. Generate exactly 3 GENERAL BEHAVIORAL questions based on validated clinical tools (MBI, GAD-7, PHQ-9). These should cover:
   - Sleep quality and physical health impact
   - Social withdrawal and relationship strain
   - Emotional regulation and irritability
3. Each question MUST have exactly 5 options: ["Never", "Rarely", "Sometimes", "Often", "Always"]
4. Questions should be phrased empathetically, not clinically cold. Use "I feel..." phrasing.

You MUST respond in this exact JSON format:
{
  "questions": [
    {
      "id": "prof_1",
      "category": "profession",
      "title": "Short 2-3 word title",
      "text": "The empathetic question text",
      "options": ["Never", "Rarely", "Sometimes", "Often", "Always"]
    },
    {
      "id": "prof_2",
      "category": "profession",
      "title": "Short title",
      "text": "Question text",
      "options": ["Never", "Rarely", "Sometimes", "Often", "Always"]
    },
    {
      "id": "prof_3",
      "category": "profession",
      "title": "Short title",
      "text": "Question text",
      "options": ["Never", "Rarely", "Sometimes", "Often", "Always"]
    },
    {
      "id": "prof_4",
      "category": "profession",
      "title": "Short title",
      "text": "Question text",
      "options": ["Never", "Rarely", "Sometimes", "Often", "Always"]
    },
    {
      "id": "general_1",
      "category": "general",
      "title": "Sleep & Health",
      "text": "Question about sleep/physical health",
      "options": ["Never", "Rarely", "Sometimes", "Often", "Always"]
    },
    {
      "id": "general_2",
      "category": "general",
      "title": "Social Connection",
      "text": "Question about social withdrawal",
      "options": ["Never", "Rarely", "Sometimes", "Often", "Always"]
    },
    {
      "id": "general_3",
      "category": "general",
      "title": "Emotional Balance",
      "text": "Question about emotional regulation",
      "options": ["Never", "Rarely", "Sometimes", "Often", "Always"]
    }
  ]
}`;

const MIND_CHECK_SCENARIO_PROMPT = `You are MindOasis AI, a compassionate psychological guide and burnout specialist.
You are given a user's FULL burnout assessment, including:
- Their PROFESSION and LIVING ENVIRONMENT
- 4 PROFESSION-SPECIFIC assessment answers
- 3 GENERAL BEHAVIORAL assessment answers

IMPORTANT BEHAVIORAL RULES:
1. Analyze ALL 7 answers holistically. Weight profession-specific answers (60%) and general behavioral answers (40%) to determine an accurate burnout risk level.
2. Provide a highly empathetic, personalized 3-4 sentence insight that directly references their profession, environment, and specific answer patterns.
3. Generate THREE interconnected but distinct scenarios (2-3 sentences each) that are DIRECTLY rooted in their profession and living environment.
   - Scenario 1: A workplace/role-specific stressor. MUST mention their exact job title or role.
   - Scenario 2: A home/environment-specific stressor that bleeds into their professional life. MUST reference their living situation.
   - Scenario 3: A combined stressor that tests their overall coping strategy.
4. CRITICAL: NEVER use generic scenarios like 'conflicting priorities' or 'a colleague asks for a favor'. Every scenario MUST mention specific elements of their profession (e.g., for a Student: 'Your professor just moved the assignment deadline forward by 2 days right before your group project presentation').
5. For EACH scenario, provide 3 choices (A, B, C) that test different coping mechanisms:
   - Option A: Reactive/avoidant response.
   - Option B: Balanced/emotionally intelligent response.
   - Option C: Help-seeking/boundary-setting response.
6. For EACH choice, PRE-GENERATE:
   - "insight": The emotional consequence of choosing this (2 sentences).
   - "suggested_action": A specific, actionable micro-step they can take TODAY.

You MUST respond in this exact JSON format:
{
  "burnout_indicator": "Low Risk" or "Moderate Risk" or "High Risk",
  "burnout_insight": "Your empathetic 3-4 sentence analysis referencing their profession and specific answers.",
  "scenarios": [
    {
      "id": "scenario_1",
      "scenario_text": "First tailored scenario (2-3 sentences).",
      "choices": [
        { "id": "choice_a", "text": "Reactive choice", "insight": "Emotional consequence (2 sentences).", "suggested_action": "Specific actionable step." },
        { "id": "choice_b", "text": "Balanced choice", "insight": "Emotional consequence (2 sentences).", "suggested_action": "Specific actionable step." },
        { "id": "choice_c", "text": "Help-seeking choice", "insight": "Emotional consequence (2 sentences).", "suggested_action": "Specific actionable step." }
      ]
    },
    {
      "id": "scenario_2",
      "scenario_text": "Second scenario about home/environment.",
      "choices": [
        { "id": "choice_a", "text": "Reactive", "insight": "Consequence.", "suggested_action": "Step." },
        { "id": "choice_b", "text": "Balanced", "insight": "Consequence.", "suggested_action": "Step." },
        { "id": "choice_c", "text": "Help-seeking", "insight": "Consequence.", "suggested_action": "Step." }
      ]
    },
    {
      "id": "scenario_3",
      "scenario_text": "Third combined stressor scenario.",
      "choices": [
        { "id": "choice_a", "text": "Reactive", "insight": "Consequence.", "suggested_action": "Step." },
        { "id": "choice_b", "text": "Balanced", "insight": "Consequence.", "suggested_action": "Step." },
        { "id": "choice_c", "text": "Help-seeking", "insight": "Consequence.", "suggested_action": "Step." }
      ]
    }
  ]
}
Note: Ensure the 'scenarios' array has EXACTLY 3 scenario objects.`;

// ===== EXPORTED API FUNCTIONS =====

export async function analyzeJournal(text) {
  try {
    const result = await callGeminiRaw(
      JOURNAL_SYSTEM_PROMPT,
      `Please analyze this journal entry:\n\n"${text}"`
    );
    const parsed = parseJSON(result);
    if (parsed) return parsed;
    return { emotion_tone: 'Mixed Emotions', stress_trigger: 'General Life Stress', sentiment_score: 'Neutral', insight: 'Thank you for sharing your thoughts.' };
  } catch (err) {
    if (err.message === 'NO_API_KEY') throw err;
    console.error('Journal analysis error:', err);
    return { emotion_tone: 'Unable to analyze', stress_trigger: 'Service unavailable', sentiment_score: 'N/A', insight: 'AI analysis is temporarily unavailable. Your entry has been saved.' };
  }
}

export async function generateInsight(recentMoods) {
  try {
    if (!recentMoods || recentMoods.length === 0) return null;
    
    // Calculate simple stats to feed to Gemini
    const moodCounts = {};
    recentMoods.forEach(m => { moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1; });
    
    const userMsg = `Generate a brief 1-2 sentence wellness insight based on this recent mood data:\n` +
      `Past week moods logged: ${recentMoods.length}\n` +
      `Breakdown: ${Object.entries(moodCounts).map(([mood, count]) => `${count}x ${mood}`).join(', ')}\n` +
      `Latest mood: ${recentMoods[0].mood}`;
      
    const result = await callGeminiRaw(
      "You are MindOasis AI, a compassionate wellness companion. Provide a single, short, empathetic 1-2 sentence insight about the user's recent mood patterns. Be extremely concise but warm.",
      userMsg
    );
    
    return result;
  } catch (err) {
    if (err.message === 'NO_API_KEY') throw err;
    console.error('Insight generation error:', err);
    return "Keep tracking your moods regularly to receive more personalized wellness insights!";
  }
}

export async function assessBurnout(answers, journalEntries = []) {
  try {
    const journalContext = journalEntries.length > 0
      ? `\n\nRecent journal entries for additional context:\n${journalEntries.slice(0, 5).map((j, i) => `${i + 1}. "${j.text.substring(0, 200)}..." (Emotion: ${j.emotion_tone || 'unknown'})`).join('\n')}`
      : '';

    const detailedAnswersContext = answers.detailedAnswers 
      ? `\n\nDetailed Questionnaire Answers:\n${Object.entries(answers.detailedAnswers).map(([q, a]) => `- ${q}: ${a}`).join('\n')}`
      : '';

    const userMsg = `Assess burnout risk based on these responses:
- Stress level: ${answers.stressLevel}/10
- Average sleep: ${answers.sleepHours} hours/night
- Feeling exhausted: ${answers.exhausted ? 'Yes' : 'No'}
- Workload pressure: ${answers.workload}
- Raw Score: ${answers.rawScore || 'N/A'}${detailedAnswersContext}${journalContext}`;

    const result = await callGeminiRaw(BURNOUT_SYSTEM_PROMPT, userMsg);
    const parsed = parseJSON(result);
    if (parsed) {
      return {
        risk_level: parsed.risk_level || 'Moderate',
        indicators: parsed.key_indicators || [],
        recommendations: parsed.recommendations || [],
        summary: parsed.summary || '',
      };
    }
    throw new Error('Parse failed');
  } catch (err) {
    if (err.message === 'NO_API_KEY') throw err;
    console.error('Burnout assessment error:', err);
    return {
      risk_level: 'Moderate',
      indicators: ['Unable to fully assess at this time'],
      recommendations: ['Please try again or check your API connection'],
      summary: 'We encountered an issue during assessment. Please try again.',
    };
  }
}

export async function simulateScenario(scenarioDescription, choiceText) {
  try {
    const userMsg = `Scenario: "${scenarioDescription}"\n\nThe person chose: "${choiceText}"\n\nAnalyze the likely outcome of this choice.`;
    const result = await callGeminiRaw(SCENARIO_SYSTEM_PROMPT, userMsg, 0.8);
    const parsed = parseJSON(result);
    if (parsed) return parsed;
    throw new Error('Parse failed');
  } catch (err) {
    if (err.message === 'NO_API_KEY') throw err;
    console.error('Scenario simulation error:', err);
    return {
      outcome: 'AI analysis is temporarily unavailable. Consider discussing this scenario with a trusted friend.',
      emotional_consequence: 'Every choice carries both growth opportunities and challenges.',
      recommended_behavior: 'Reflect on what feels authentic to you while considering the impact on others.',
    };
  }
}

export async function generatePersonalizedBurnoutQuestions(userProfile) {
  try {
    const occ = userProfile?.occupation || 'general worker';
    const env = userProfile?.environment || 'general living situation';
    
    const userMsg = `Generate personalized burnout assessment questions for someone who is a "${occ}" and is currently living "${env}". Make the scenarios in the questions hyper-specific to this lifestyle.`;

    const result = await callGeminiRaw(PERSONALIZED_BURNOUT_PROMPT, userMsg, 0.9);
    const parsed = parseJSON(result);
    if (parsed && Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    throw new Error('Invalid JSON structure returned');
  } catch (err) {
    if (err.message === 'NO_API_KEY') throw err;
    console.error('Personalized questions error:', err);
    throw new Error('Failed to generate personalized questions');
  }
}

export async function generatePersonalizedScenarios(userProfile) {
  try {
    const occ = userProfile?.occupation || 'general worker';
    const env = userProfile?.environment || 'general living situation';
    
    const userMsg = `Generate 5 personalized scenario training exercises for someone who is a "${occ}" and is currently living "${env}". Make the scenarios hyper-specific to the common daily stressors for this lifestyle.`;

    const result = await callGeminiRaw(PERSONALIZED_SCENARIOS_PROMPT, userMsg, 0.9);
    const parsed = parseJSON(result);
    if (parsed && Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    throw new Error('Invalid JSON structure returned');
  } catch (err) {
    if (err.message === 'NO_API_KEY') throw err;
    console.error('Personalized scenarios error:', err);
    throw new Error('Failed to generate personalized scenarios');
  }
}

export async function generateWeeklyReport(data, userProfile = {}) {
  try {
    const { moods, journals, burnout, scenarios, mindChecks } = data;
    
    const moodSummary = moods.length > 0
      ? `Moods logged: ${moods.map(m => `${m.mood} (${new Date(m.timestamp).toLocaleDateString()})`).join(', ')}`
      : 'No moods logged.';
    
    const journalSummary = journals.length > 0
      ? `Journal entries (${journals.length}): ${journals.slice(0, 5).map(j => `"${j.text.substring(0, 150)}" (Emotion: ${j.emotion_tone || 'unanalyzed'}, Trigger: ${j.stress_trigger || 'none'})`).join('; ')}`
      : 'No journal entries.';

    const burnoutSummary = burnout.length > 0
      ? `Burnout assessments: ${burnout.map(b => b.risk_level || b.burnout_indicator).join(', ')}`
      : 'No burnout assessments taken.';

    const mindCheckSummary = (mindChecks && mindChecks.length > 0)
      ? `Mind Check results: ${mindChecks.map(mc => `Indicator: ${mc.burnout_indicator}, Insight: ${mc.burnout_insight?.substring(0, 100)}`).join('; ')}`
      : 'No Mind Check sessions completed.';

    const profileContext = `User Profile: Profession: ${userProfile?.occupation || 'unknown'}, Environment: ${userProfile?.environment || 'unknown'}, Games Played: ${userProfile?.gamesPlayed || 0}, Mind Points: ${userProfile?.mindPoints || 0}, Streak: ${userProfile?.streak || 0} days, Badges: ${(userProfile?.badges || []).join(', ') || 'none'}`;

    const userMsg = `Generate a comprehensive mental wellness report based on ALL this data:

=== USER PROFILE ===
${profileContext}

=== MOOD DATA ===
${moodSummary}
Total mood check-ins: ${moods.length}

=== JOURNAL DATA ===
${journalSummary}
Total journal entries: ${journals.length}

=== BURNOUT DATA ===
${burnoutSummary}

=== MIND CHECK DATA ===
${mindCheckSummary}
Total Mind Check sessions: ${mindChecks?.length || 0}

=== ENGAGEMENT DATA ===
Scenario exercises completed: ${scenarios.length}
Games played: ${userProfile?.gamesPlayed || 0}
Current streak: ${userProfile?.streak || 0} days`;

    const result = await callGeminiRaw(REPORT_SYSTEM_PROMPT, userMsg);
    const parsed = parseJSON(result);
    if (parsed) {
      // Calculate mood distribution from raw data
      const moodCounts = {};
      moods.forEach(m => { moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1; });
      
      return {
        ...parsed,
        mood_distribution: moodCounts,
        total_entries: { 
          moods: moods.length, 
          journals: journals.length, 
          scenarios: scenarios.length,
          mindChecks: mindChecks?.length || 0,
          gamesPlayed: userProfile?.gamesPlayed || 0
        },
      };
    }
    throw new Error('Parse failed');
  } catch (err) {
    if (err.message === 'NO_API_KEY') throw err;
    console.error('Report generation error:', err);
    const moodCounts = {};
    data.moods.forEach(m => { moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1; });
    return {
      dominant_mood: Object.entries(moodCounts).sort(([,a],[,b]) => b-a)[0]?.[0] || 'No data',
      main_stress_trigger: 'Unable to analyze',
      wellness_score: 50,
      wellness_trend: 'Stable',
      mood_stability: 'Insufficient data',
      stress_triggers: ['More data needed'],
      activity_effectiveness: [],
      burnout_risk: 'Unknown',
      burnout_explanation: 'Complete a Mind Check to get your burnout analysis.',
      emotional_awareness_score: 50,
      emotional_awareness_explanation: 'Track more moods and write journal entries to improve this score.',
      engagement_insight: 'Keep using the app to get personalized engagement insights.',
      positive_behaviors: ['Tracking your mental health shows awareness'],
      recommendations: ['Continue logging moods daily', 'Try journaling before sleep', 'Complete a Mind Check assessment'],
      weekly_insight: `Report generation encountered an issue: ${err.message || 'Unknown'}. Your data is safe.`,
      predictive_insight: 'More data is needed for predictive analysis.',
      mood_distribution: moodCounts,
      total_entries: { moods: data.moods.length, journals: data.journals.length, scenarios: data.scenarios.length, mindChecks: data.mindChecks?.length || 0, gamesPlayed: 0 },
    };
  }
}

export async function scoreDrawing(imageDataUrl, mood, taskDescription = '') {
  try {
    const systemPrompt = `You are MindOasis AI, an insightful art therapist and psychological guide. 
    A user has created a drawing to express their mood: ${mood || 'Neutral'}.
    ${taskDescription ? `The specific task was: "${taskDescription}"` : ''}
    
    IMPORTANT BEHAVIORAL RULES:
    1. Evaluate the drawing based on PSYCHOLOGICAL PATTERNS, not artistic talent.
    2. Analyze:
       - Line Quality: Are lines sharp/jagged (indicating stress/tension) or soft/curving (indicating calm/fluidity)?
       - Spatial Usage: Is the drawing centered, cramped, or expansive?
       - Density: Is it minimal/withdrawn or highly detailed/engaged?
       - Adherence: How well does it reflect the requested task (if any)?
    3. Provide a score from 1-10 based on emotional honesty and engagement.
    4. Provide specific "Pattern Analysis" observations.
    5. Be warm, supportive, and compassionate.
    
    You MUST respond in this exact JSON format:
    {
      "score": 8,
      "remarks": "Warm overall encouragement...",
      "pattern_analysis": "Detailed 2-3 sentence analysis of the lines, shapes, and spatial patterns observed.",
      "mood_alignment": "How well the patterns match the reported mood of ${mood || 'Neutral'}"
    }`;

    // For multi-modal on OpenRouter, the content can be an array
    const apiKey = getApiKey();
    if (!apiKey) throw new Error('NO_API_KEY');

    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'MindOasis Mental Wellness App',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: [
              { type: 'text', text: `Here is my drawing related to being ${mood || 'neutral'}.${taskDescription ? ` The task I was following was: "${taskDescription}".` : ''} Please analyze the patterns.` },
              { type: 'image_url', image_url: { url: imageDataUrl } }
            ] 
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) throw new Error('API Error');

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || '';
    const parsed = parseJSON(result);
    if (parsed) return parsed;
    return { score: 10, remarks: "What a wonderful drawing! It shows so much heart.", mood_alignment: "N/A" };
  } catch (err) {
    console.error('Drawing evaluation error:', err);
    return { score: '?', remarks: "Your drawing is a beautiful piece of your journey. Keep creating!", mood_alignment: "N/A" };
  }
}

/**
 * PRO Image Generation using OpenRouter's Flux or Stable Diffusion models.
 */
export async function generateImagePro(prompt) {
  try {
    const apiKey = getApiKey();
    if (!apiKey) return null;

    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'X-Title': 'MindOasis Mental Wellness App',
      },
      body: JSON.stringify({
        model: 'black-forest-labs/flux-schnell',
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) return null;
    const data = await response.json();
    return data.choices?.[0]?.message?.content || data.images?.[0] || null;
  } catch (err) {
    return null;
  }
}

export async function enhanceDrawing(imageDataUrl) {
  try {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error('NO_API_KEY');

    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'MindOasis Mental Wellness App',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: ENHANCE_DRAWING_PROMPT },
          { 
            role: 'user', 
            content: [
              { type: 'text', text: 'Please analyze my sketch and generate the enhancement prompt.' },
              { type: 'image_url', image_url: { url: imageDataUrl } }
            ] 
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) throw new Error('API Error');

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || '';
    const parsed = parseJSON(result);
    if (parsed) return parsed;
    
    throw new Error('Parse failed');
  } catch (err) {
    console.error('Enhance drawing error:', err);
    return { 
      score: "5/10",
      visual_evaluation: "A simple sketch with basic expressive forms.",
      emotional_interpretation: "The drawing suggests a desire for creative expression.",
      image_prompt: "A beautiful, soft, calming, pastel-colored abstract illustration representing emotional wellness and peace, smooth lines, dreamy aesthetic." 
    };
  }
}

export async function generateAssessmentQuestions(occupation, environment) {
  try {
    const occ = occupation || 'general professional';
    const env = environment || 'general living situation';
    
    const userMsg = `Generate 7 personalized burnout assessment questions for:\n- Profession: ${occ}\n- Living Environment: ${env}`;
    
    const result = await callGeminiRaw(GENERATE_ASSESSMENT_PROMPT, userMsg, 0.7);
    const parsed = parseJSON(result);
    if (parsed && parsed.questions && parsed.questions.length === 7) {
      return parsed.questions;
    }
    throw new Error('Invalid questions structure');
  } catch (err) {
    console.error('Assessment generation error:', err);
    // Return clinically validated fallback questions
    return [
      { id: 'prof_1', category: 'profession', title: 'Workload', text: 'I feel overwhelmed by the amount of work expected of me.', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'] },
      { id: 'prof_2', category: 'profession', title: 'Role Clarity', text: 'I feel uncertain about what is expected of me in my role.', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'] },
      { id: 'prof_3', category: 'profession', title: 'Achievement', text: 'I feel like my efforts are not producing meaningful results.', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'] },
      { id: 'prof_4', category: 'profession', title: 'Autonomy', text: 'I feel I have little control over how I manage my daily tasks.', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'] },
      { id: 'general_1', category: 'general', title: 'Sleep & Health', text: 'I have trouble falling asleep or wake up feeling unrefreshed.', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'] },
      { id: 'general_2', category: 'general', title: 'Social Connection', text: 'I have been withdrawing from friends, family, or social activities.', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'] },
      { id: 'general_3', category: 'general', title: 'Emotional Balance', text: 'I find myself easily irritated or emotionally reactive over small things.', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'] },
    ];
  }
}

export async function generateMindCheckScenario(userProfile, answers, dynamicQuestions) {
  try {
    const occ = userProfile?.occupation || 'general individual';
    const env = userProfile?.environment || 'general living situation';
    
    // Separate profession vs general answers for weighted analysis
    const profAnswers = dynamicQuestions.filter(q => q.category === 'profession').map((q, i) => {
      return `[PROFESSION-SPECIFIC] Q${i+1} (${q.title}): ${q.text}\nAnswer: ${answers[q.id]}`;
    }).join('\n\n');
    
    const genAnswers = dynamicQuestions.filter(q => q.category === 'general').map((q, i) => {
      return `[GENERAL BEHAVIORAL] Q${i+1} (${q.title}): ${q.text}\nAnswer: ${answers[q.id]}`;
    }).join('\n\n');

    const userMsg = `Generate a comprehensive burnout analysis and 3 tailored scenarios based on this FULL assessment:

=== USER PROFILE ===
- Profession: ${occ}
- Living Environment: ${env}

=== PROFESSION-SPECIFIC ASSESSMENT (Weight: 60%) ===
${profAnswers}

=== GENERAL BEHAVIORAL ASSESSMENT (Weight: 40%) ===
${genAnswers}`;

    const result = await callGeminiRaw(MIND_CHECK_SCENARIO_PROMPT, userMsg, 0.8);
    const parsed = parseJSON(result);
    if (parsed && parsed.scenarios && parsed.scenarios.length === 3) {
      return parsed;
    }
    throw new Error('Invalid JSON structure returned by model');
  } catch (err) {
    console.error('MindCheck scenario error:', err);
    // Fallback scenario
    return {
      burnout_indicator: "Moderate Risk",
      burnout_insight: "You're showing signs of emerging burnout. It's completely normal given your current pressures, but it's important to start prioritizing moments of rest.",
      scenarios: [
        {
          id: "scenario_1",
          scenario_text: "You have several conflicting priorities piling up in front of you and a tight deadline approaching.",
          choices: [
            { 
              id: "choice_a", 
              text: "Ignore the problem and scroll on your phone",
              insight: "Avoidance offers temporary relief but increases long-term stress.",
              suggested_action: "Try a 2-minute breathing exercise."
            },
            { 
              id: "choice_b", 
              text: "Break the problem into smaller, 15-minute steps",
              insight: "Action breaks the cycle of overwhelm and builds momentum.",
              suggested_action: "Write down just the very first step."
            },
            { 
              id: "choice_c", 
              text: "Tell someone you need help prioritizing",
              insight: "Asking for help is a sign of resilience, not weakness.",
              suggested_action: "Draft a quick message to a friend or colleague."
            }
          ]
        },
        {
          id: "scenario_2",
          scenario_text: "A colleague or peer asks you for a major favor that will cut into your personal rest time.",
          choices: [
            { 
              id: "choice_a", 
              text: "Say yes immediately to avoid conflict",
              insight: "People-pleasing often leads to resentment and exhaustion.",
              suggested_action: "Practice saying 'let me check my schedule' next time."
            },
            { 
              id: "choice_b", 
              text: "Politely decline, citing your own workload",
              insight: "Setting boundaries protects your energy and builds self-respect.",
              suggested_action: "Acknowledge your own boundary setting."
            },
            { 
              id: "choice_c", 
              text: "Ignore the message until later",
              insight: "Avoidance creates anxiety as the pending response hangs over you.",
              suggested_action: "Send a quick, polite 'no' to clear your mental space."
            }
          ]
        },
        {
          id: "scenario_3",
          scenario_text: "You finally have free time, but you feel guilty for not working or studying.",
          choices: [
            { 
              id: "choice_a", 
              text: "Open up your laptop and do 'just a little bit' of work",
              insight: "Blurring boundaries prevents your brain from ever fully recovering.",
              suggested_action: "Physically close your laptop and leave the room."
            },
            { 
              id: "choice_b", 
              text: "Engage in a hobby that requires your full attention",
              insight: "Active rest is often more restorative than passive scrolling.",
              suggested_action: "Spend 10 minutes doing something completely unrelated to work."
            },
            { 
              id: "choice_c", 
              text: "Lie on the couch feeling anxious about not working",
              insight: "This leads to 'toxic productivity' where rest feels wrong.",
              suggested_action: "Remind yourself aloud that rest is necessary for performance."
            }
          ]
        }
      ]
    };
  }
}

// Keep scenario data exported for the Simulator page
export { default as SCENARIOS_DATA } from './scenarios.js';
