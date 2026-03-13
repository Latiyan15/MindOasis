import { useState, useEffect } from 'react';
import { Sparkles, Save, Clock, PenTool, Type, Image, AlertCircle, Brain } from 'lucide-react';
import { saveJournal, getJournals } from '../services/storage';
import { analyzeJournal } from '../services/gemini';
import { useToast } from '../components/Toast';
import DrawingCanvas from '../components/DrawingCanvas';
import MoodAvatar from '../components/MoodAvatar';
import JournalBackground from '../components/JournalBackground';
import { useUser } from '../context/UserContext';

const MOOD_CHIPS = [
  { id: 'Stressed', label: 'Stressed', color: 'var(--rose-500)' },
  { id: 'Anxious', label: 'Anxious', color: 'var(--amber-500)' },
  { id: 'Sad', label: 'Sad', color: 'var(--primary-500)' },
  { id: 'Confused', label: 'Confused', color: 'var(--gray-500)' },
  { id: 'Bored', label: 'Bored', color: 'var(--accent-500)' },
  { id: 'Neutral', label: 'Neutral', color: 'var(--green-500)' },
];

export default function Journal() {
  const { user } = useUser();
  const [text, setText] = useState('');
  const [selectedMood, setSelectedMood] = useState(null);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [journals, setJournals] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [activeTab, setActiveTab] = useState('write');
  const [savedDrawing, setSavedDrawing] = useState(null);
  const addToast = useToast();

  useEffect(() => {
    setJournals(getJournals());
  }, []);

  const handleSave = async () => {
    if (!text.trim() && !savedDrawing) return;
    setError(null);

    let result = null;
    if (aiEnabled && text.trim()) {
      setAnalyzing(true);
      try {
        result = await analyzeJournal(text);
        setAnalysis(result);
      } catch (err) {
        if (err.message === 'NO_API_KEY') {
          setError('Please set your OpenRouter API key in the .env file (VITE_OPENROUTER_API_KEY)');
        } else {
          setError('AI analysis failed. Entry saved without analysis.');
        }
      }
      setAnalyzing(false);
    }

    const entryText = savedDrawing ? `${text}\n\n[🎨 Drawing attached]` : text;
    saveJournal(entryText, aiEnabled, result);
    setJournals(getJournals());
    addToast('✨ Entry saved — your thoughts are safe here.');

    if (!aiEnabled) {
      setText('');
      setSavedDrawing(null);
      setSelectedMood(null);
    }
  };

  const handleNewEntry = () => {
    setText('');
    setAnalysis(null);
    setSelectedEntry(null);
    setSavedDrawing(null);
    setSelectedMood(null);
    setError(null);
  };

  const handleSaveDrawing = (dataUrl) => {
    setSavedDrawing(dataUrl);
    addToast('Drawing captured! Save your entry to keep it.');
    setActiveTab('write');
  };

  const viewEntry = (entry) => {
    setSelectedEntry(entry);
    setText(entry.text);
    setSavedDrawing(null);
    setError(null);
    if (entry.emotion_tone) {
      setAnalysis({
        emotion_tone: entry.emotion_tone,
        stress_trigger: entry.stress_trigger,
        sentiment_score: entry.sentiment_score || 'N/A',
        insight: entry.insight || null,
      });
    } else {
      setAnalysis(null);
    }
  };

  const formatDate = (ts) => {
    const d = new Date(ts);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const sentimentColor = (s) => {
    if (s === 'Positive') return 'var(--green-500)';
    if (s === 'Negative') return 'var(--rose-500)';
    if (s === 'Mixed') return 'var(--amber-500)';
    return 'var(--gray-500)';
  };

  return (
    <div className="fade-in premium-page">
      <JournalBackground />
      <div className="premium-header">
        <div>
          <h1 className="premium-greeting">Journal ✍️</h1>
          <p className="premium-sub">Express yourself freely. This is your safe space.</p>
        </div>
      </div>

      <div className="journal-layout">
        {/* === LEFT COLUMN === */}
        <div className="journal-left">

          {/* Mood Chips */}
          <div className="premium-glass-card" style={{ marginBottom: 12 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>How are you feeling?</div>
            <div className="mood-chips">
              {MOOD_CHIPS.map(mood => (
                <button
                  key={mood.id}
                  className={`mood-chip ${selectedMood === mood.id ? 'selected' : ''}`}
                  onClick={() => setSelectedMood(selectedMood === mood.id ? null : mood.id)}
                  style={{
                    borderColor: selectedMood === mood.id ? mood.color : 'transparent',
                    background: selectedMood === mood.id ? `${mood.color}15` : undefined,
                  }}
                >
                  <MoodAvatar character={user?.avatar || 'neutral'} mood={mood.id} size={18} />
                  <span style={{ color: selectedMood === mood.id ? mood.color : undefined }}>{mood.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="journal-tabs">
            <button className={`journal-tab ${activeTab === 'write' ? 'active' : ''}`} onClick={() => setActiveTab('write')}>
              <Type size={14} /> Write
            </button>
            <button className={`journal-tab ${activeTab === 'draw' ? 'active' : ''}`} onClick={() => setActiveTab('draw')}>
              <PenTool size={14} /> Draw & Create
            </button>
          </div>

          {activeTab === 'write' && (
            <>
              {/* Gemini Toggle */}
              <div className="premium-glass-card" style={{ marginBottom: 12, padding: '12px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="premium-icon-circle" style={{ background: 'linear-gradient(135deg, var(--primary-50), var(--primary-100))' }}>
                      <Sparkles size={14} color="var(--primary-500)" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>Gemini AI Analysis</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                        {aiEnabled ? 'Powered by Google Gemini' : 'Disabled'}
                      </div>
                    </div>
                  </div>
                  <button className={`toggle ${aiEnabled ? 'active' : ''}`} onClick={() => setAiEnabled(!aiEnabled)} />
                </div>
              </div>

              {/* Journal Canvas */}
              <div className="premium-glass-card journal-canvas-card">
                <textarea
                  className="journal-textarea"
                  placeholder="Write about your day, your thoughts, or what's on your mind..."
                  value={text}
                  onChange={(e) => { setText(e.target.value); setAnalysis(null); setSelectedEntry(null); setError(null); }}
                />

                {savedDrawing && (
                  <div style={{ marginTop: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, fontSize: '0.7rem', fontWeight: 600, color: '#8b5cf6' }}>
                      <Image size={12} /> Drawing attached
                    </div>
                    <img src={savedDrawing} alt="Drawing" style={{ width: '100%', maxHeight: 120, objectFit: 'contain', borderRadius: 12, border: '1px solid rgba(148,163,184,0.15)' }} />
                  </div>
                )}

                <div className="journal-canvas-footer">
                  <button className="premium-save-btn" onClick={handleSave} disabled={(!text.trim() && !savedDrawing) || analyzing}>
                    <Save size={14} />
                    {analyzing ? 'Analyzing...' : 'Save Entry'}
                  </button>
                  {(analysis || selectedEntry) && (
                    <button className="premium-back-btn" onClick={handleNewEntry} style={{ fontSize: '0.75rem' }}>New Entry</button>
                  )}
                  <span className="journal-char-count">{text.length} chars</span>
                </div>
              </div>
            </>
          )}

          {activeTab === 'draw' && (
            <div className="premium-glass-card fade-in">
              <div style={{ marginBottom: 10 }}>
                <h3 style={{ fontSize: '0.9rem', marginBottom: 2 }}>🎨 Creative Space</h3>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Draw how your mind feels today.</p>
              </div>
              <DrawingCanvas onSave={handleSaveDrawing} />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="premium-error fade-in">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          {/* Analyzing */}
          {analyzing && (
            <div className="premium-analyzing fade-in">
              <Sparkles size={16} className="premium-analyzing-icon" />
              Gemini is analyzing your emotions...
            </div>
          )}

          {/* AI Analysis Result */}
          {analysis && !analyzing && (
            <div className="premium-ai-reflection fade-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <Brain size={14} />
                <span style={{ fontWeight: 700, fontSize: '0.8rem' }}>MindOasis AI Reflection</span>
              </div>
              <div className="ai-reflection-grid">
                <div className="ai-reflection-item">
                  <div className="ai-reflection-label">Emotion</div>
                  <div className="ai-reflection-value">{analysis.emotion_tone}</div>
                </div>
                <div className="ai-reflection-item">
                  <div className="ai-reflection-label">Trigger</div>
                  <div className="ai-reflection-value">{analysis.stress_trigger}</div>
                </div>
                <div className="ai-reflection-item">
                  <div className="ai-reflection-label">Sentiment</div>
                  <div className="ai-reflection-value" style={{ color: sentimentColor(analysis.sentiment_score) }}>{analysis.sentiment_score}</div>
                </div>
              </div>
              {analysis.insight && (
                <div className="ai-reflection-insight">
                  <div style={{ fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 4 }}>💡 Insight</div>
                  <p>{analysis.insight}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* === RIGHT COLUMN — PAST ENTRIES === */}
        <div className="journal-right">
          <div className="premium-glass-card">
            <div className="premium-section-header">
              <h2><Clock size={14} style={{ marginRight: 6, verticalAlign: -2 }} />Past Entries</h2>
              <span className="premium-badge">{journals.length}</span>
            </div>

            {journals.length === 0 ? (
              <div className="journal-empty">
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>📝</div>
                <h3>No entries yet</h3>
                <p>Start writing to see your journal history</p>
              </div>
            ) : (
              <div className="journal-entries-list">
                {journals.slice(0, 20).map(entry => (
                  <button
                    key={entry.id}
                    className={`journal-entry-item ${selectedEntry?.id === entry.id ? 'selected' : ''}`}
                    onClick={() => viewEntry(entry)}
                  >
                    <div className="journal-entry-top">
                      <span className="journal-entry-date">{formatDate(entry.timestamp)}</span>
                      {entry.emotion_tone && (
                        <span className="journal-entry-mood-tag">
                          <Sparkles size={8} /> {entry.emotion_tone}
                        </span>
                      )}
                    </div>
                    <div className="journal-entry-preview">
                      {entry.text.includes('[🎨 Drawing') ? '🎨 ' : ''}
                      {entry.text.replace('\n\n[🎨 Drawing attached]', '').slice(0, 120)}
                      {entry.text.length > 120 ? '...' : ''}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
