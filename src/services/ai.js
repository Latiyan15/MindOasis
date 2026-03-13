// AI Simulation Engine
// Uses keyword analysis + weighted templates for realistic AI-like output
// Can be swapped with a real AI API (OpenAI, Gemini, etc.) easily

const EMOTION_KEYWORDS = {
  anxiety: ['anxious', 'worried', 'nervous', 'panic', 'fear', 'uneasy', 'dread', 'restless', 'overthinking', 'tense'],
  sadness: ['sad', 'depressed', 'unhappy', 'lonely', 'grief', 'hopeless', 'empty', 'down', 'blue', 'miserable', 'crying'],
  anger: ['angry', 'frustrated', 'irritated', 'furious', 'annoyed', 'rage', 'mad', 'resentful', 'bitter'],
  stress: ['stressed', 'overwhelmed', 'pressure', 'deadline', 'burnout', 'exhausted', 'overworked', 'burden', 'demanding'],
  happiness: ['happy', 'joy', 'excited', 'grateful', 'content', 'proud', 'cheerful', 'optimistic', 'blessed', 'great'],
  confusion: ['confused', 'lost', 'uncertain', 'unsure', 'indecisive', 'conflicted', 'puzzled', 'bewildered'],
};

const STRESS_TRIGGERS = {
  academic: ['exam', 'study', 'grades', 'assignment', 'class', 'professor', 'school', 'college', 'university', 'test', 'homework', 'gpa', 'semester'],
  work: ['work', 'job', 'boss', 'coworker', 'project', 'meeting', 'deadline', 'promotion', 'office', 'career', 'salary', 'workplace'],
  social: ['friend', 'relationship', 'family', 'parents', 'partner', 'social', 'loneliness', 'isolation', 'argument', 'conflict', 'breakup'],
  health: ['sleep', 'tired', 'sick', 'health', 'weight', 'exercise', 'diet', 'pain', 'insomnia', 'fatigue'],
  financial: ['money', 'debt', 'rent', 'bills', 'afford', 'expensive', 'loan', 'financial', 'broke'],
  self_esteem: ['failure', 'worthless', 'stupid', 'ugly', 'inadequate', 'comparison', 'imposter', 'insecure', 'doubt'],
};

function countKeywords(text, keywords) {
  const lower = text.toLowerCase();
  return keywords.filter(k => lower.includes(k)).length;
}

function findTopCategory(text, categories) {
  let top = null;
  let maxScore = 0;
  for (const [cat, keywords] of Object.entries(categories)) {
    const score = countKeywords(text, keywords);
    if (score > maxScore) {
      maxScore = score;
      top = cat;
    }
  }
  return { category: top, score: maxScore };
}

function calculateSentiment(text) {
  const positive = ['happy', 'joy', 'grateful', 'proud', 'love', 'excited', 'good', 'great', 'amazing', 'wonderful', 'hope', 'better', 'improved', 'calm', 'peace', 'relaxed'];
  const negative = ['sad', 'angry', 'stressed', 'anxious', 'worried', 'depressed', 'frustrated', 'overwhelmed', 'hopeless', 'terrible', 'awful', 'horrible', 'pain', 'suffer', 'worst', 'hate'];
  
  const posCount = countKeywords(text, positive);
  const negCount = countKeywords(text, negative);
  const total = posCount + negCount;
  
  if (total === 0) return { score: 0.5, label: 'Neutral' };
  const ratio = posCount / total;
  
  if (ratio > 0.6) return { score: ratio, label: 'Positive' };
  if (ratio < 0.4) return { score: ratio, label: 'Negative' };
  return { score: ratio, label: 'Mixed' };
}

// ===== Journal Analysis =====
export function analyzeJournal(text) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const emotion = findTopCategory(text, EMOTION_KEYWORDS);
      const trigger = findTopCategory(text, STRESS_TRIGGERS);
      const sentiment = calculateSentiment(text);

      const emotionMap = {
        anxiety: 'Anxiety',
        sadness: 'Sadness',
        anger: 'Anger',
        stress: 'Stress',
        happiness: 'Happiness',
        confusion: 'Confusion',
      };

      const triggerMap = {
        academic: 'Academic Pressure',
        work: 'Work-Related Stress',
        social: 'Social/Relationship Issues',
        health: 'Health Concerns',
        financial: 'Financial Stress',
        self_esteem: 'Self-Esteem & Identity',
      };

      resolve({
        emotion_tone: emotionMap[emotion.category] || 'Mixed Emotions',
        stress_trigger: triggerMap[trigger.category] || 'General Life Stress',
        sentiment_score: sentiment.label,
        confidence: Math.min(0.95, 0.6 + (emotion.score + trigger.score) * 0.05),
      });
    }, 1500);
  });
}

// ===== Burnout Assessment =====
export function assessBurnout(answers, journalEntries = []) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Score from questionnaire
      let score = 0;
      score += (answers.stressLevel || 5) * 2; // 2-20
      score += answers.sleepHours < 6 ? 15 : answers.sleepHours < 7 ? 8 : 0;
      score += answers.exhausted ? 15 : 0;
      score += answers.workload === 'High' ? 15 : answers.workload === 'Medium' ? 8 : 0;

      // Bonus from journal analysis
      if (journalEntries.length > 0) {
        const stressEntries = journalEntries.filter(j => 
          j.emotion_tone === 'Stress' || j.emotion_tone === 'Anxiety'
        ).length;
        score += (stressEntries / journalEntries.length) * 15;
      }

      let risk_level, indicators = [], recommendations = [];

      if (score >= 45) {
        risk_level = 'High';
        indicators = ['Elevated stress levels', 'Potential sleep deficit', 'High workload pressure', 'Emotional fatigue detected'];
        recommendations = [
          'Consider speaking with a counselor or mental health professional',
          'Prioritize 7-8 hours of sleep each night',
          'Break tasks into smaller, manageable chunks',
          'Practice deep breathing exercises daily',
          'Take regular 10-15 minute breaks throughout the day',
        ];
      } else if (score >= 25) {
        risk_level = 'Moderate';
        indicators = ['Moderate stress patterns', 'Some sleep irregularity', 'Building pressure from responsibilities'];
        recommendations = [
          'Schedule short breaks between study/work sessions',
          'Try journaling to process your emotions',
          'Maintain a consistent sleep schedule',
          'Connect with friends or supportive peers',
          'Consider light exercise like walking',
        ];
      } else {
        risk_level = 'Low';
        indicators = ['Manageable stress levels', 'Generally balanced routine'];
        recommendations = [
          'Continue maintaining your current healthy habits',
          'Stay connected with your support network',
          'Use journaling to track emotional patterns',
          'Keep up regular physical activity',
        ];
      }

      resolve({ risk_level, indicators, recommendations, score: Math.min(100, score) });
    }, 2000);
  });
}

// ===== Scenario Simulation =====
export const SCENARIOS = [
  {
    id: 'exam_failure',
    title: 'Academic Setback',
    description: 'You failed an important exam that you studied hard for. You feel ashamed and disappointed in yourself. Your classmates seem to have done well.',
    choices: [
      { id: 'isolate', text: 'Isolate yourself and avoid everyone' },
      { id: 'friend', text: 'Talk to a trusted friend about your feelings' },
      { id: 'teacher', text: 'Approach the teacher for guidance on improvement' },
    ],
  },
  {
    id: 'social_rejection',
    title: 'Social Exclusion',
    description: 'You discover your friend group went out without inviting you. You feel left out and start questioning your friendships. Self-doubt creeps in.',
    choices: [
      { id: 'confront', text: 'Confront your friends aggressively about it' },
      { id: 'communicate', text: 'Calmly express how you feel to one close friend' },
      { id: 'withdraw', text: 'Withdraw and decide you don\'t need friends' },
    ],
  },
  {
    id: 'work_overload',
    title: 'Overwhelming Workload',
    description: 'You have multiple deadlines approaching simultaneously. You\'re sleeping less, eating poorly, and feeling constant anxiety. The pressure feels unbearable.',
    choices: [
      { id: 'push_through', text: 'Push through without breaks — just keep going' },
      { id: 'prioritize', text: 'Pause, prioritize tasks, and ask for deadline extensions' },
      { id: 'give_up', text: 'Feel overwhelmed and give up on some tasks entirely' },
    ],
  },
  {
    id: 'family_conflict',
    title: 'Family Disagreement',
    description: 'Your parents are pressuring you about your career choices. They want you to pursue a different path than what you\'re passionate about. The arguments are becoming daily.',
    choices: [
      { id: 'rebel', text: 'Rebel and refuse to discuss it further' },
      { id: 'listen', text: 'Listen to their concerns and share your perspective calmly' },
      { id: 'comply', text: 'Give in completely to avoid conflict' },
    ],
  },
  {
    id: 'imposter_syndrome',
    title: 'Imposter Syndrome',
    description: 'You received praise for a project at work/school, but you feel like a fraud. You believe you don\'t deserve the recognition and that people will eventually discover you\'re not that talented.',
    choices: [
      { id: 'dismiss', text: 'Dismiss the praise and downplay your achievements' },
      { id: 'accept', text: 'Accept the praise and reflect on your genuine effort' },
      { id: 'overcompensate', text: 'Overwork yourself to "prove" you deserve it' },
    ],
  },
];

const SCENARIO_OUTCOMES = {
  exam_failure: {
    isolate: {
      outcome: 'Isolating yourself may provide temporary relief, but it amplifies negative thoughts. Without external perspective, shame can spiral into deeper self-doubt and anxiety.',
      emotional_consequence: 'Increased loneliness, rumination, and potentially depressive thoughts. The academic setback begins to feel like a personal identity crisis.',
      recommended_behavior: 'While needing space is valid, prolonged isolation after setbacks typically worsens mental health. Reaching out to even one person can break the cycle of negative self-talk.',
    },
    friend: {
      outcome: 'Talking to a trusted friend helps normalize the experience. You discover that many people face similar setbacks. The emotional weight becomes lighter when shared.',
      emotional_consequence: 'Relief from emotional burden, validation of feelings, and restored perspective. The failure transforms from a personal flaw to a learning experience.',
      recommended_behavior: 'This is a healthy coping strategy. Sharing vulnerabilities with trusted people strengthens relationships and builds emotional resilience for future challenges.',
    },
    teacher: {
      outcome: 'Your teacher appreciates your initiative and provides specific feedback. You leave with a concrete improvement plan, shifting focus from shame to actionable steps.',
      emotional_consequence: 'Empowerment, renewed motivation, and reduced anxiety about the subject. The proactive approach rebuilds self-efficacy.',
      recommended_behavior: 'Seeking guidance from mentors and authority figures is an excellent coping mechanism. It transforms failure into a growth opportunity and often reveals that setbacks are more common than we think.',
    },
  },
  social_rejection: {
    confront: {
      outcome: 'Confronting friends aggressively often puts them on the defensive. It can escalate the situation and damage relationships further rather than resolving the underlying issue.',
      emotional_consequence: 'Temporary relief from expressing anger, followed by guilt and potential loss of friendships. The situation feels more volatile.',
      recommended_behavior: 'While expressing your feelings is important, the approach matters. Aggressive confrontation rarely leads to understanding. Consider cooling down first, then expressing your feelings using "I" statements.',
    },
    communicate: {
      outcome: 'Your friend listens and explains it was an unintentional oversight. They apologize sincerely and make sure to include you in future plans. The honest conversation strengthens your bond.',
      emotional_consequence: 'Validation, relief, and a deeper sense of trust in the friendship. You feel heard and valued.',
      recommended_behavior: 'Calm, honest communication is one of the most effective interpersonal skills. It builds trust, resolves misunderstandings, and models healthy relationship patterns.',
    },
    withdraw: {
      outcome: 'Withdrawing protects you temporarily but creates a pattern of avoidance. Loneliness increases, and future social situations become harder to navigate.',
      emotional_consequence: 'Growing isolation, reinforced belief that you\'re unwanted, and difficulty forming new connections. Social anxiety may develop over time.',
      recommended_behavior: 'While protecting yourself is natural, complete withdrawal prevents healing. Strong relationships require vulnerability and communication.',
    },
  },
  work_overload: {
    push_through: {
      outcome: 'Pushing through without rest leads to diminishing returns. Quality of work drops, errors increase, and you edge closer to burnout. The body and mind cannot sustain this pace.',
      emotional_consequence: 'Physical exhaustion, cognitive fog, increased irritability, and eventual collapse. The sense of accomplishment is overshadowed by health costs.',
      recommended_behavior: 'Rest is not laziness — it\'s a productivity strategy. Regular breaks improve focus, creativity, and output quality. Sustainable work habits prevent burnout.',
    },
    prioritize: {
      outcome: 'Taking a step back to prioritize reveals that not all tasks are equally urgent. Getting deadline extensions reduces immediate pressure and allows higher-quality work.',
      emotional_consequence: 'Relief from overwhelm, restored sense of control, and improved focus. The situation feels manageable rather than impossible.',
      recommended_behavior: 'Prioritization and boundary-setting are essential life skills. Most deadlines are more flexible than they seem, and asking for help is a sign of maturity, not weakness.',
    },
    give_up: {
      outcome: 'Giving up provides immediate relief but creates new problems — missed deadlines, disappointed stakeholders, and self-criticism. The guilt of unfinished work lingers.',
      emotional_consequence: 'Temporary relief followed by shame, anxiety about consequences, and decreased self-confidence. A pattern of avoidance may develop.',
      recommended_behavior: 'When overwhelmed, seek help rather than giving up entirely. Break tasks into the smallest possible steps and start with just one.',
    },
  },
  family_conflict: {
    rebel: {
      outcome: 'Rebellion shuts down communication and deepens the divide. While it asserts independence, it fails to address the underlying concerns and leaves both sides hurt.',
      emotional_consequence: 'Temporary empowerment but lasting guilt, family tension, and unresolved conflict. The relationship strain adds to overall stress.',
      recommended_behavior: 'Standing firm in your values is important, but how you communicate matters. Complete rebellion closes doors to compromise and mutual understanding.',
    },
    listen: {
      outcome: 'By listening to their concerns, you discover their fears come from a place of love for your future. Sharing your perspective helps them see your passion. A middle ground begins to emerge.',
      emotional_consequence: 'Mutual respect develops, emotional tension reduces, and you feel more confident in your chosen path knowing your family understands your reasoning.',
      recommended_behavior: 'Active listening and calm dialogue are the foundations of healthy family relationships. Understanding their perspective doesn\'t mean agreeing — it means respecting each other enough to communicate.',
    },
    comply: {
      outcome: 'Giving in completely avoids immediate conflict but breeds resentment over time. Living someone else\'s dream leads to a deep sense of unfulfillment and identity loss.',
      emotional_consequence: 'Surface-level peace but growing internal frustration, loss of identity, and potential depression from pursuing a path that doesn\'t align with your values.',
      recommended_behavior: 'Compliance to avoid conflict is not sustainable. Your mental health requires you to honor your own needs while maintaining respectful family relationships.',
    },
  },
  imposter_syndrome: {
    dismiss: {
      outcome: 'Dismissing praise reinforces the imposter narrative. Others stop giving feedback because you reject it, creating an echo chamber of self-doubt.',
      emotional_consequence: 'Persistent anxiety, inability to enjoy achievements, and a growing gap between external success and internal experience.',
      recommended_behavior: 'Learning to accept praise is a skill. Try simply saying "Thank you" and sitting with the discomfort. Over time, it becomes easier to internalize positive feedback.',
    },
    accept: {
      outcome: 'Accepting the praise and reflecting on your effort reveals genuine competence. You begin to separate feelings from facts — you may feel like a fraud, but the evidence says otherwise.',
      emotional_consequence: 'Gradual building of self-confidence, reduced anxiety, and a healthier relationship with achievement.',
      recommended_behavior: 'This is excellent practice. Imposter syndrome affects many high-achievers. Acknowledging your effort (not just results) builds authentic self-worth.',
    },
    overcompensate: {
      outcome: 'Overworking to "prove" your worth leads to exhaustion and unsustainable standards. No amount of extra work silences imposter syndrome — it\'s an emotional issue, not a performance one.',
      emotional_consequence: 'Burnout, perfectionism, and deepening imposter feelings. Each achievement raises the bar higher, creating an impossible race against yourself.',
      recommended_behavior: 'Working harder won\'t cure imposter syndrome. The solution lies in changing your relationship with self-worth — basing it on who you are, not what you produce.',
    },
  },
};

export function simulateScenario(scenarioId, choiceId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const outcome = SCENARIO_OUTCOMES[scenarioId]?.[choiceId];
      if (outcome) {
        resolve(outcome);
      } else {
        resolve({
          outcome: 'This choice leads to a complex set of outcomes. Consider how this decision affects your emotional well-being and relationships.',
          emotional_consequence: 'Mixed emotions. Every choice carries both positive and negative consequences.',
          recommended_behavior: 'Reflect on your decision-making process and consider seeking input from trusted individuals.',
        });
      }
    }, 1500);
  });
}

// ===== Weekly Report =====
export function generateWeeklyReport(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { moods, journals, burnout, scenarios } = data;
      
      // Calculate dominant mood
      const moodCounts = {};
      moods.forEach(m => {
        moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1;
      });
      const dominantMood = Object.entries(moodCounts)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'No data';

      // Find main stress trigger from journals
      const triggers = {};
      journals.forEach(j => {
        if (j.stress_trigger) {
          triggers[j.stress_trigger] = (triggers[j.stress_trigger] || 0) + 1;
        }
      });
      const mainTrigger = Object.entries(triggers)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Not identified';

      // Calculate positive behaviors
      const positiveBehaviors = [];
      if (journals.length > 0) positiveBehaviors.push('Regular journaling');
      if (moods.length >= 3) positiveBehaviors.push('Consistent mood tracking');
      if (scenarios.length > 0) positiveBehaviors.push('Engaged with scenario exercises');
      if (burnout.length > 0) positiveBehaviors.push('Proactive burnout monitoring');

      // Generate recommendations based on data
      const recommendations = [];
      if (dominantMood === 'Stressed' || dominantMood === 'Anxious') {
        recommendations.push('Try 5-minute breathing exercises before starting your day');
        recommendations.push('Consider reducing non-essential commitments this week');
      }
      if (dominantMood === 'Sad') {
        recommendations.push('Connect with a friend or loved one today');
        recommendations.push('Try gentle physical activity like walking in nature');
      }
      if (journals.length < 3) {
        recommendations.push('Write short journal reflections 3-4 times this week');
      }
      if (moods.length < 5) {
        recommendations.push('Log your mood daily for better emotional awareness');
      }
      recommendations.push('Celebrate your progress — seeking self-awareness is a strength');

      // Calculate overall wellness score
      let wellnessScore = 50;
      if (moods.length > 0) wellnessScore += 10;
      if (journals.length > 0) wellnessScore += 10;
      const positiveRatio = moods.filter(m => 
        m.mood === 'Neutral' || m.mood === 'Happy'
      ).length / Math.max(moods.length, 1);
      wellnessScore += Math.round(positiveRatio * 20);
      if (positiveBehaviors.length > 2) wellnessScore += 10;
      wellnessScore = Math.min(100, wellnessScore);

      resolve({
        dominant_mood: dominantMood,
        main_stress_trigger: mainTrigger,
        positive_behaviors: positiveBehaviors.length > 0 ? positiveBehaviors : ['Start tracking your wellness to see insights here'],
        recommendations,
        wellness_score: wellnessScore,
        mood_distribution: moodCounts,
        total_entries: {
          moods: moods.length,
          journals: journals.length,
          scenarios: scenarios.length,
        },
      });
    }, 2000);
  });
}
