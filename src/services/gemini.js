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
  "dominant_mood": "The most frequent mood this week",
  "main_stress_trigger": "The primary source of stress identified, or 'Not identified' if unclear",
  "positive_behaviors": ["positive behavior 1", "positive behavior 2"],
  "recommendations": ["specific recommendation 1", "recommendation 2", "recommendation 3"],
  "weekly_insight": "A personalized 2-3 sentence insight about the week. Reference specific patterns you noticed. Be encouraging.",
  "wellness_score": 65
}
The wellness_score should be 0-100 based on: mood variety (not just negative), journaling frequency, positive behaviors, and overall engagement.`;

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

export async function generateWeeklyReport(data) {
  try {
    const { moods, journals, burnout, scenarios } = data;
    
    const moodSummary = moods.length > 0
      ? `Moods logged this week: ${moods.map(m => m.mood).join(', ')}`
      : 'No moods logged this week.';
    
    const journalSummary = journals.length > 0
      ? `Journal entries (${journals.length}): ${journals.slice(0, 3).map(j => `"${j.text.substring(0, 100)}..." (${j.emotion_tone || 'no analysis'})`).join('; ')}`
      : 'No journal entries this week.';

    const burnoutSummary = burnout.length > 0
      ? `Burnout assessments: ${burnout.map(b => b.risk_level).join(', ')}`
      : 'No burnout assessments taken.';

    const userMsg = `Generate a weekly mental health report based on this data:

${moodSummary}
${journalSummary}
${burnoutSummary}
Scenario exercises completed: ${scenarios.length}

Total mood check-ins: ${moods.length}
Total journal entries: ${journals.length}`;

    const result = await callGeminiRaw(REPORT_SYSTEM_PROMPT, userMsg);
    const parsed = parseJSON(result);
    if (parsed) {
      // Calculate mood distribution
      const moodCounts = {};
      moods.forEach(m => { moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1; });
      
      return {
        dominant_mood: parsed.dominant_mood || 'No data',
        main_stress_trigger: parsed.main_stress_trigger || 'Not identified',
        positive_behaviors: parsed.positive_behaviors || [],
        recommendations: parsed.recommendations || [],
        weekly_insight: parsed.weekly_insight || '',
        wellness_score: parsed.wellness_score || 50,
        mood_distribution: moodCounts,
        total_entries: { moods: moods.length, journals: journals.length, scenarios: scenarios.length },
      };
    }
    throw new Error('Parse failed');
  } catch (err) {
    if (err.message === 'NO_API_KEY') throw err;
    console.error('Gemini API Technical Error:', err);
    console.error('Request Details:', { url: OPENROUTER_URL, model: MODEL });
    const moodCounts = {};
    data.moods.forEach(m => { moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1; });
    return {
      dominant_mood: Object.entries(moodCounts).sort(([,a],[,b]) => b-a)[0]?.[0] || 'No data',
      main_stress_trigger: 'Unable to analyze',
      positive_behaviors: ['Tracking your mental health shows awareness'],
      recommendations: [err.message || 'Please check your API connection and try again'],
      weekly_insight: `Gemini Error: ${err.message || 'Unknown issue'}. Your data is safe.`,
      wellness_score: 50,
      mood_distribution: moodCounts,
      total_entries: { moods: data.moods.length, journals: data.journals.length, scenarios: data.scenarios.length },
    };
  }
}

// Keep scenario data exported for the Simulator page
export { default as SCENARIOS_DATA } from './scenarios.js';
