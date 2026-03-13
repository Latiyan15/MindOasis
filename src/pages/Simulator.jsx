import { useState } from 'react';
import { Sparkles, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import SCENARIOS from '../services/scenarios';
import { simulateScenario } from '../services/gemini';
import { saveScenarioInteraction } from '../services/storage';
import { useToast } from '../components/Toast';

export default function Simulator() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const addToast = useToast();

  const scenario = SCENARIOS[currentIdx];

  const handleAnalyze = async () => {
    if (selectedChoice === null) return;
    setAnalyzing(true);
    setError(null);

    try {
      const choice = scenario.choices[selectedChoice];
      const outcome = await simulateScenario(scenario.description, choice.text);
      setResult(outcome);
      saveScenarioInteraction(scenario.id, choice.id, outcome);
      addToast('Scenario analyzed by Gemini');
    } catch (err) {
      if (err.message === 'NO_API_KEY') {
        setError('Please set your OpenRouter API key in the .env file');
      } else {
        setError('Analysis failed. Please try again.');
      }
    }
    setAnalyzing(false);
  };

  const nextScenario = () => {
    setCurrentIdx(i => (i + 1) % SCENARIOS.length);
    setSelectedChoice(null);
    setResult(null);
    setError(null);
  };

  const prevScenario = () => {
    setCurrentIdx(i => (i - 1 + SCENARIOS.length) % SCENARIOS.length);
    setSelectedChoice(null);
    setResult(null);
    setError(null);
  };

  const reset = () => {
    setSelectedChoice(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Scenario Simulator 🎭</h1>
        <p>Practice navigating real-life situations. Gemini AI analyzes your choices and provides emotional guidance.</p>
      </div>

      <div className="card glass-card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <button className="btn btn-ghost btn-sm" onClick={prevScenario}><ChevronLeft size={16} /></button>
          <div className="card-badge">{currentIdx + 1} / {SCENARIOS.length}</div>
          <button className="btn btn-ghost btn-sm" onClick={nextScenario}><ChevronRight size={16} /></button>
        </div>

        <div className="scenario-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 12 }}>{scenario.title}</h3>
          <div className="scenario-description">{scenario.description}</div>

          <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>What would you do?</h4>

          <div className="scenario-choices">
            {scenario.choices.map((choice, i) => (
              <button
                key={choice.id}
                className={`scenario-choice ${selectedChoice === i ? 'selected' : ''}`}
                onClick={() => { setSelectedChoice(i); setResult(null); setError(null); }}
                disabled={analyzing}
              >
                <span className="scenario-choice-letter">{String.fromCharCode(65 + i)}</span>
                <span>{choice.text}</span>
              </button>
            ))}
          </div>

          <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
            <button className="btn btn-primary btn-glow" onClick={handleAnalyze} disabled={selectedChoice === null || analyzing} style={{ opacity: selectedChoice !== null ? 1 : 0.5 }}>
              <Sparkles size={16} />
              {analyzing ? 'Analyzing...' : 'Analyze with Gemini'}
            </button>
            {result && <button className="btn btn-ghost" onClick={reset}><RotateCcw size={14} />Try Again</button>}
          </div>
        </div>
      </div>

      {error && <div className="error-banner fade-in" style={{ maxWidth: 700 }}>{error}</div>}

      {analyzing && (
        <div className="analyzing fade-in"><Sparkles size={18} />Gemini is analyzing this scenario<div className="analyzing-dots"><span /><span /><span /></div></div>
      )}

      {result && !analyzing && (
        <div className="ai-response fade-in" style={{ maxWidth: 700 }}>
          <div className="ai-response-header"><span className="ai-badge"><Sparkles size={12} />Gemini Analysis</span></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="ai-result-item">
              <div className="ai-result-label">🎯 Likely Outcome</div>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>{result.outcome}</p>
            </div>
            <div className="ai-result-item">
              <div className="ai-result-label">💭 Emotional Consequence</div>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>{result.emotional_consequence}</p>
            </div>
            <div className="ai-result-item" style={{ borderLeft: '3px solid var(--green-400)', background: 'var(--green-50)' }}>
              <div className="ai-result-label">✅ Recommended Approach</div>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>{result.recommended_behavior}</p>
            </div>
          </div>
          <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
            <button className="btn btn-primary" onClick={nextScenario}>Next Scenario →</button>
            <button className="btn btn-ghost" onClick={reset}><RotateCcw size={14} />Try Different Choice</button>
          </div>
        </div>
      )}
    </div>
  );
}
