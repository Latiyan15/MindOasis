// localStorage data service layer
const KEYS = {
  MOODS: 'mindoasis_moods',
  JOURNALS: 'mindoasis_journals',
  BURNOUT: 'mindoasis_burnout',
  SCENARIOS: 'mindoasis_scenarios',
  MINDCHECK: 'mindoasis_mindcheck',
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

// ===== Background Sync to Node.js / MongoDB =====
const API_BASE = 'http://localhost:5000/api';

async function syncInsert(endpoint, data) {
  try {
    await fetch(`${API_BASE}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  } catch (err) {
    console.warn(`[Sync] Failed to sync ${endpoint} to MongoDB (Offline?)`, err.message);
  }
}

export async function hydrateFromServer() {
  try {
    const urls = ['moods', 'journals', 'mindchecks'];
    for (const url of urls) {
      const res = await fetch(`${API_BASE}/${url}`);
      if (res.ok) {
        const serverData = await res.json();
        if (serverData && serverData.length > 0) {
          // Merge server data with local data (simple overwrite for this prototype, using server as truth)
          let key;
          if (url === 'moods') key = KEYS.MOODS;
          else if (url === 'journals') key = KEYS.JOURNALS;
          else if (url === 'mindchecks') key = KEYS.MINDCHECK;
          save(key, serverData);
        }
      }
    }
  } catch (err) {
    console.warn('[Sync] Could not hydrate from server (Offline?)', err.message);
  }
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
  syncInsert('moods', entry); // Background sync
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
export function saveJournal(text, aiAnalysisAllowed = false, analysis = null, images = null) {
  const journals = getAll(KEYS.JOURNALS);
  const entry = {
    id: generateId(),
    text,
    ai_analysis_allowed: aiAnalysisAllowed,
    emotion_tone: analysis?.emotion_tone || null,
    stress_trigger: analysis?.stress_trigger || null,
    sentiment_score: analysis?.sentiment_score || null,
    images: images || null,
    timestamp: new Date().toISOString(),
  };
  journals.unshift(entry);
  save(KEYS.JOURNALS, journals);
  syncInsert('journals', entry); // Background sync
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

// ===== Mind Check Results =====
export function saveMindCheckResult(result) {
  const results = getAll(KEYS.MINDCHECK);
  const entry = {
    id: generateId(),
    burnout_indicator: result.burnout_indicator,
    burnout_insight: result.burnout_insight,
    answers: result.answers || {},
    questions: result.questions || [],
    history: result.history || [],
    timestamp: new Date().toISOString(),
  };
  results.unshift(entry);
  save(KEYS.MINDCHECK, results);
  syncInsert('mindchecks', entry); // Background sync
  return entry;
}

export function getMindCheckResults() {
  return getAll(KEYS.MINDCHECK);
}

export function getRecentMindChecks(days = 30) {
  const results = getAll(KEYS.MINDCHECK);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return results.filter(r => new Date(r.timestamp) >= cutoff);
}

// ===== Aggregate Data =====
export function getWeeklyData() {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 7);
  const filterRecent = (arr) => arr.filter(item => new Date(item.timestamp) >= cutoff);
  
  return {
    moods: getRecentMoods(7),
    journals: getRecentJournals(7),
    burnout: filterRecent(getBurnoutResults()),
    scenarios: filterRecent(getScenarioInteractions()),
    mindChecks: filterRecent(getMindCheckResults()),
  };
}

export function getAllTimeData() {
  return {
    moods: getMoodLogs(),
    journals: getJournals(),
    burnout: getBurnoutResults(),
    scenarios: getScenarioInteractions(),
    mindChecks: getMindCheckResults(),
  };
}

