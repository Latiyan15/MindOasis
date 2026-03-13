// localStorage data service layer
const KEYS = {
  MOODS: 'mindoasis_moods',
  JOURNALS: 'mindoasis_journals',
  BURNOUT: 'mindoasis_burnout',
  SCENARIOS: 'mindoasis_scenarios',
};

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function getAll(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ===== Mood Logs =====
export function saveMood(mood) {
  const moods = getAll(KEYS.MOODS);
  const entry = {
    id: generateId(),
    mood,
    timestamp: new Date().toISOString(),
  };
  moods.unshift(entry);
  save(KEYS.MOODS, moods);
  return entry;
}

export function getMoodLogs() {
  return getAll(KEYS.MOODS);
}

export function getRecentMoods(days = 7) {
  const moods = getAll(KEYS.MOODS);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return moods.filter(m => new Date(m.timestamp) >= cutoff);
}

export function getMoodStreak() {
  const moods = getAll(KEYS.MOODS);
  if (moods.length === 0) return 0;
  let streak = 1;
  const today = new Date().toDateString();
  const mostRecent = new Date(moods[0].timestamp).toDateString();
  if (mostRecent !== today) return 0;
  for (let i = 1; i < moods.length; i++) {
    const prev = new Date(moods[i - 1].timestamp).toDateString();
    const curr = new Date(moods[i].timestamp).toDateString();
    const prevDate = new Date(prev);
    const currDate = new Date(curr);
    const diff = (prevDate - currDate) / (1000 * 60 * 60 * 24);
    if (diff <= 1 && prev !== curr) {
      streak++;
    } else if (prev !== curr) {
      break;
    }
  }
  return streak;
}

// ===== Journal Entries =====
export function saveJournal(text, aiAnalysisAllowed = false, analysis = null) {
  const journals = getAll(KEYS.JOURNALS);
  const entry = {
    id: generateId(),
    text,
    ai_analysis_allowed: aiAnalysisAllowed,
    emotion_tone: analysis?.emotion_tone || null,
    stress_trigger: analysis?.stress_trigger || null,
    sentiment_score: analysis?.sentiment_score || null,
    timestamp: new Date().toISOString(),
  };
  journals.unshift(entry);
  save(KEYS.JOURNALS, journals);
  return entry;
}

export function getJournals() {
  return getAll(KEYS.JOURNALS);
}

export function getRecentJournals(days = 7) {
  const journals = getAll(KEYS.JOURNALS);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return journals.filter(j => new Date(j.timestamp) >= cutoff);
}

// ===== Burnout Results =====
export function saveBurnoutResult(result) {
  const results = getAll(KEYS.BURNOUT);
  const entry = {
    id: generateId(),
    ...result,
    timestamp: new Date().toISOString(),
  };
  results.unshift(entry);
  save(KEYS.BURNOUT, results);
  return entry;
}

export function getBurnoutResults() {
  return getAll(KEYS.BURNOUT);
}

// ===== Scenario Interactions =====
export function saveScenarioInteraction(scenarioId, choice) {
  const interactions = getAll(KEYS.SCENARIOS);
  const entry = {
    id: generateId(),
    scenario_id: scenarioId,
    choice_selected: choice,
    timestamp: new Date().toISOString(),
  };
  interactions.unshift(entry);
  save(KEYS.SCENARIOS, interactions);
  return entry;
}

export function getScenarioInteractions() {
  return getAll(KEYS.SCENARIOS);
}

// ===== Aggregate Data =====
export function getWeeklyData() {
  return {
    moods: getRecentMoods(7),
    journals: getRecentJournals(7),
    burnout: getBurnoutResults().filter(b => {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 7);
      return new Date(b.timestamp) >= cutoff;
    }),
    scenarios: getScenarioInteractions().filter(s => {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 7);
      return new Date(s.timestamp) >= cutoff;
    }),
  };
}
