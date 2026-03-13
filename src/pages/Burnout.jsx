import { useState } from 'react';
import { Sparkles, ChevronRight, ChevronLeft, AlertCircle, ArrowRight } from 'lucide-react';
import { assessBurnout } from '../services/gemini';
import { saveBurnoutResult, getJournals } from '../services/storage';
import { useToast } from '../components/Toast';
import MoodAvatar from '../components/MoodAvatar';
import BurnoutBackground from '../components/BurnoutBackground';
import BurnoutIllustration from '../components/BurnoutIllustration';
import { useUser } from '../context/UserContext';

// ===== COMPREHENSIVE QUESTIONNAIRE =====
const CATEGORIES = [
  {
    id: 'emotional',
    title: 'Emotional Wellbeing',
    emoji: '💭',
    color: 'var(--primary-500)',
    bg: 'linear-gradient(135deg, var(--primary-50), var(--primary-100))',
    questions: [
      {
        id: 'overwhelm',
        text: 'How often do you feel emotionally overwhelmed?',
        type: 'emoji',
        options: [
          { mood: 'Happy', label: 'Rarely', value: 1 },
          { mood: 'Neutral', label: 'Sometimes', value: 2 },
          { mood: 'Confused', label: 'Often', value: 3 },
          { mood: 'Anxious', label: 'Very Often', value: 4 },
          { mood: 'Stressed', label: 'Always', value: 5 },
        ],
      },
      {
        id: 'dread',
        text: 'Do you dread starting your day?',
        type: 'emoji',
        options: [
          { mood: 'Happy', label: 'Never', value: 1 },
          { mood: 'Confused', label: 'Occasionally', value: 2 },
          { mood: 'Anxious', label: 'Most days', value: 3 },
          { mood: 'Stressed', label: 'Every day', value: 4 },
        ],
      },
      {
        id: 'emotional_drain',
        text: 'Do you feel emotionally drained by the end of the day?',
        type: 'emoji',
        options: [
          { mood: 'Happy', label: 'Not at all', value: 1 },
          { mood: 'Neutral', label: 'A little', value: 2 },
          { mood: 'Anxious', label: 'Quite a lot', value: 3 },
          { mood: 'Stressed', label: 'Completely', value: 4 },
        ],
      },
      {
        id: 'crying',
        text: 'How often do you feel like crying or feel unusually emotional?',
        type: 'emoji',
        options: [
          { mood: 'Happy', label: 'Rarely', value: 1 },
          { mood: 'Neutral', label: 'Sometimes', value: 2 },
          { mood: 'Sad', label: 'Often', value: 3 },
          { mood: 'Stressed', label: 'Very Often', value: 4 },
        ],
      },
    ],
  },
  {
    id: 'physical',
    title: 'Physical Health',
    emoji: '🏃',
    color: 'var(--green-500)',
    bg: 'linear-gradient(135deg, var(--green-50), var(--green-100))',
    questions: [
      {
        id: 'sleep_quality',
        text: 'How would you rate your sleep quality?',
        type: 'emoji',
        options: [
          { mood: 'Happy', label: 'Great', value: 1 },
          { mood: 'Neutral', label: 'Okay', value: 2 },
          { mood: 'Confused', label: 'Poor', value: 3 },
          { mood: 'Stressed', label: 'Terrible', value: 4 },
        ],
      },
      {
        id: 'sleep_hours',
        text: 'How many hours of sleep do you get on average?',
        type: 'choice',
        options: [
          { label: '8+ hours', value: 1 },
          { label: '6–7 hours', value: 2 },
          { label: '4–5 hours', value: 3 },
          { label: 'Less than 4', value: 4 },
        ],
      },
      {
        id: 'headaches',
        text: 'Do you experience frequent headaches, muscle tension, or fatigue?',
        type: 'emoji',
        options: [
          { mood: 'Happy', label: 'Rarely', value: 1 },
          { mood: 'Neutral', label: 'Sometimes', value: 2 },
          { mood: 'Anxious', label: 'Often', value: 3 },
          { mood: 'Stressed', label: 'Daily', value: 4 },
        ],
      },
      {
        id: 'appetite',
        text: 'Has your appetite changed recently?',
        type: 'choice',
        options: [
          { label: 'No change', value: 1 },
          { label: 'Slightly changed', value: 2 },
          { label: 'Eating much more or less', value: 3 },
          { label: 'Lost interest in food', value: 4 },
        ],
      },
    ],
  },
  {
    id: 'work',
    title: 'Work & Academic Life',
    emoji: '💼',
    color: 'var(--accent-500)',
    bg: 'linear-gradient(135deg, var(--accent-50), var(--accent-100))',
    questions: [
      {
        id: 'workload',
        text: 'How would you describe your current workload?',
        type: 'emoji',
        options: [
          { mood: 'Happy', label: 'Manageable', value: 1 },
          { mood: 'Anxious', label: 'Slightly heavy', value: 2 },
          { mood: 'Stressed', label: 'Overwhelming', value: 3 },
          { mood: 'Sad', label: 'Crushing', value: 4 },
        ],
      },
      {
        id: 'motivation',
        text: 'How motivated do you feel about your work/studies?',
        type: 'emoji',
        options: [
          { mood: 'Happy', label: 'Very motivated', value: 1 },
          { mood: 'Neutral', label: 'Somewhat', value: 2 },
          { mood: 'Bored', label: 'Low motivation', value: 3 },
          { mood: 'Sad', label: 'Zero motivation', value: 4 },
        ],
      },
      {
        id: 'accomplishment',
        text: 'Do you feel a sense of accomplishment from your work?',
        type: 'emoji',
        options: [
          { mood: 'Happy', label: 'Always', value: 1 },
          { mood: 'Neutral', label: 'Sometimes', value: 2 },
          { mood: 'Bored', label: 'Rarely', value: 3 },
          { mood: 'Sad', label: 'Never', value: 4 },
        ],
      },
      {
        id: 'breaks',
        text: 'Do you take proper breaks during work/study?',
        type: 'choice',
        options: [
          { label: 'Yes, regularly', value: 1 },
          { label: 'Occasionally', value: 2 },
          { label: 'Rarely', value: 3 },
          { label: 'Never — I push through', value: 4 },
        ],
      },
    ],
  },
  {
    id: 'social',
    title: 'Social & Relationships',
    emoji: '👥',
    color: 'var(--amber-500)',
    bg: 'linear-gradient(135deg, var(--amber-50), var(--amber-100))',
    questions: [
      {
        id: 'isolation',
        text: 'Do you feel isolated or disconnected from others?',
        type: 'emoji',
        options: [
          { mood: 'Happy', label: 'Not at all', value: 1 },
          { mood: 'Neutral', label: 'A little', value: 2 },
          { mood: 'Confused', label: 'Quite a lot', value: 3 },
          { mood: 'Sad', label: 'Very isolated', value: 4 },
        ],
      },
      {
        id: 'irritability',
        text: 'Are you more irritable or short-tempered than usual?',
        type: 'emoji',
        options: [
          { mood: 'Happy', label: 'Not really', value: 1 },
          { mood: 'Anxious', label: 'Sometimes', value: 2 },
          { mood: 'Stressed', label: 'Often', value: 3 },
          { mood: 'Stressed', label: 'Constantly', value: 4 },
        ],
      },
      {
        id: 'social_energy',
        text: 'Do you have energy to spend time with friends/family?',
        type: 'emoji',
        options: [
          { mood: 'Happy', label: 'Plenty', value: 1 },
          { mood: 'Neutral', label: 'Some energy', value: 2 },
          { mood: 'Bored', label: 'Very little', value: 3 },
          { mood: 'Sad', label: 'Zero energy', value: 4 },
        ],
      },
    ],
  },
  {
    id: 'coping',
    title: 'Coping & Self-Care',
    emoji: '🧘',
    color: 'var(--rose-500)',
    bg: 'linear-gradient(135deg, var(--rose-50), var(--rose-100))',
    questions: [
      {
        id: 'hobbies',
        text: 'Do you have time for hobbies or things you enjoy?',
        type: 'emoji',
        options: [
          { mood: 'Happy', label: 'Yes, often', value: 1 },
          { mood: 'Confused', label: 'Sometimes', value: 2 },
          { mood: 'Sad', label: 'Rarely', value: 3 },
          { mood: 'Stressed', label: 'Not at all', value: 4 },
        ],
      },
      {
        id: 'substance',
        text: 'Are you relying more on caffeine, sugar, or other substances to get through the day?',
        type: 'choice',
        options: [
          { label: 'No, not really', value: 1 },
          { label: 'A bit more than usual', value: 2 },
          { label: 'Significantly more', value: 3 },
          { label: 'I can\'t function without them', value: 4 },
        ],
      },
      {
        id: 'self_care',
        text: 'How often do you practice self-care (relaxation, exercise, mindfulness)?',
        type: 'emoji',
        options: [
          { mood: 'Happy', label: 'Daily', value: 1 },
          { mood: 'Neutral', label: 'Weekly', value: 2 },
          { mood: 'Confused', label: 'Rarely', value: 3 },
          { mood: 'Stressed', label: 'Never', value: 4 },
        ],
      },
    ],
  },
];

const TOTAL_QUESTIONS = CATEGORIES.reduce((sum, cat) => sum + cat.questions.length, 0);

export default function Burnout() {
  const { user } = useUser();
  const [mode, setMode] = useState('intro'); // intro | quiz | analyzing | result | journal
  const [categoryIdx, setCategoryIdx] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [consent, setConsent] = useState(false);
  const addToast = useToast();

  const currentCategory = CATEGORIES[categoryIdx];
  const currentQuestion = currentCategory?.questions[questionIdx];
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / TOTAL_QUESTIONS) * 100;

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    // Auto-advance after a short delay
    setTimeout(() => {
      if (questionIdx < currentCategory.questions.length - 1) {
        setQuestionIdx(q => q + 1);
      } else if (categoryIdx < CATEGORIES.length - 1) {
        setCategoryIdx(c => c + 1);
        setQuestionIdx(0);
      } else {
        // All questions answered → submit
        handleSubmit({ ...answers, [questionId]: value });
      }
    }, 400);
  };

  const goBack = () => {
    if (questionIdx > 0) {
      setQuestionIdx(q => q - 1);
    } else if (categoryIdx > 0) {
      setCategoryIdx(c => c - 1);
      setQuestionIdx(CATEGORIES[categoryIdx - 1].questions.length - 1);
    }
  };

  const handleSubmit = async (finalAnswers) => {
    setMode('analyzing');
    setError(null);
    try {
      const answersForAI = {};
      CATEGORIES.forEach(cat => {
        cat.questions.forEach(q => {
          const val = finalAnswers[q.id];
          const opt = q.options.find(o => o.value === val);
          answersForAI[q.text] = opt ? `${opt.label} (${val}/${q.options.length})` : 'Not answered';
        });
      });

      // Calculate raw score
      const totalScore = Object.values(finalAnswers).reduce((sum, v) => sum + v, 0);
      const maxScore = TOTAL_QUESTIONS * 4;
      const pct = (totalScore / maxScore) * 100;

      const journals = getJournals().slice(0, 5);
      const assessment = await assessBurnout(
        {
          stressLevel: Math.round(pct / 10),
          sleepHours: finalAnswers.sleep_hours <= 2 ? 7 : finalAnswers.sleep_hours <= 3 ? 5 : 4,
          exhausted: pct > 50,
          workload: pct > 70 ? 'Very High' : pct > 45 ? 'High' : pct > 25 ? 'Medium' : 'Low',
          detailedAnswers: answersForAI,
          rawScore: `${totalScore}/${maxScore} (${Math.round(pct)}%)`,
        },
        journals
      );

      setResult({ ...assessment, rawPct: Math.round(pct), totalScore, maxScore });
      saveBurnoutResult(assessment);
      addToast('Burnout assessment complete', 'info');
      setMode('result');
    } catch (err) {
      if (err.message === 'NO_API_KEY') {
        setError('Please set your OpenRouter API key in the .env file (VITE_OPENROUTER_API_KEY)');
      } else {
        setError('Assessment failed. Please try again.');
      }
      setMode('quiz');
    }
  };

  const handleJournalAssess = async () => {
    if (!consent) return;
    setMode('analyzing');
    setError(null);
    try {
      const journals = getJournals().slice(0, 10);
      const assessment = await assessBurnout(
        { stressLevel: 5, sleepHours: 7, exhausted: false, workload: 'Medium' },
        journals
      );
      setResult({ ...assessment, rawPct: null });
      saveBurnoutResult(assessment);
      addToast('Journal-based assessment complete', 'info');
      setMode('result');
    } catch (err) {
      if (err.message === 'NO_API_KEY') setError('Please set your OpenRouter API key.');
      else setError('Assessment failed.');
      setMode('intro');
    }
  };

  const restart = () => {
    setMode('intro');
    setCategoryIdx(0);
    setQuestionIdx(0);
    setAnswers({});
    setResult(null);
    setError(null);
  };

  const riskColor = (level) => {
    if (level === 'Low') return 'var(--green-500)';
    if (level === 'Moderate') return 'var(--amber-500)';
    return 'var(--rose-500)';
  };

  const journals = getJournals();

  // ===== INTRO SCREEN (REDESIGNED) =====
  if (mode === 'intro') {
    return (
      <div className="fade-in" style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
        
        {/* Dynamic Animated Background */}
        <BurnoutBackground />

        {/* Global Error Banner */}
        {error && <div className="error-banner" style={{ position: 'absolute', top: 20, left: 20, right: 20, zIndex: 50 }}><AlertCircle size={16} />{error}</div>}

        {/* Main Content Layout */}
        <div style={{ padding: '40px 6%', position: 'relative', zIndex: 10 }}>
          
          <div style={{ marginBottom: 20 }}>
            <h1 style={{ fontSize: '2rem', color: '#4a5342', fontWeight: 800, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              Burnout Assessment <span>🔥</span>
            </h1>
            <p style={{ color: '#7a8578', fontSize: '0.95rem', fontWeight: 500 }}>
              Take a comprehensive assessment to understand your burnout risk level.
            </p>
          </div>

          {/* Glassmorphic Card */}
          <div className="burnout-glass-card">
            
            <div className="burnout-card-badge">
              📋
            </div>

            <h2 style={{ fontSize: '1.4rem', color: '#4a5342', fontWeight: 700, marginBottom: 8 }}>
              Full Assessment
            </h2>
            <p style={{ color: '#7a8578', fontSize: '0.9rem', lineHeight: 1.5 }}>
              {TOTAL_QUESTIONS} questions across 5 categories, powered by Gemini AI
            </p>

            <div className="burnout-list-grid">
              {CATEGORIES.map(cat => (
                <div key={cat.id} className="burnout-list-item">
                  <span>{cat.emoji}</span>
                  {cat.title}
                </div>
              ))}
            </div>

            <button 
              className="burnout-start-btn" 
              onClick={() => setMode('quiz')}
            >
              Start Assessment <ArrowRight size={18} />
            </button>
            
            {/* Journal alternative tucked below */}
            {journals.length > 0 && (
              <button 
                onClick={() => setMode('journal')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#9ba498',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  marginTop: 16,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  textUnderlineOffset: 4
                }}
              >
                Or analyze your {journals.length} recent journals instead
              </button>
            )}

          </div>

        </div>

        {/* Floating Illustration matches right side of screen */}
        <BurnoutIllustration />

      </div>
    );
  }

  // ===== JOURNAL CONSENT =====
  if (mode === 'journal') {
    return (
      <div className="fade-in">
        <div className="page-header">
          <h1>Journal Analysis 📖</h1>
          <p>Gemini AI will review your entries for burnout indicators.</p>
        </div>
        <div className="card glass-card" style={{ maxWidth: 500 }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.7 }}>
            We'll send your {journals.length} journal {journals.length === 1 ? 'entry' : 'entries'} to Google Gemini via OpenRouter for analysis. Your data stays between you and the AI.
          </p>
          <div className="toggle-wrapper" style={{ marginBottom: 20 }}>
            <button className={`toggle ${consent ? 'active' : ''}`} onClick={() => setConsent(!consent)} />
            <span className="toggle-label">I consent to AI analysis of my journal entries</span>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-primary btn-glow" onClick={handleJournalAssess} disabled={!consent} style={{ opacity: consent ? 1 : 0.5 }}>
              <Sparkles size={16} /> Analyze
            </button>
            <button className="btn btn-ghost" onClick={restart}>Back</button>
          </div>
        </div>
      </div>
    );
  }

  // ===== QUIZ FLOW =====
  if (mode === 'quiz') {
    return (
      <div className="fade-in">
        {/* Progress Bar */}
        <div className="daylio-progress">
          <div className="daylio-progress-bar">
            <div className="daylio-progress-fill" style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${currentCategory.color}, ${CATEGORIES[Math.min(categoryIdx + 1, CATEGORIES.length - 1)].color})` }} />
          </div>
          <div className="daylio-progress-info">
            <span>{answeredCount}/{TOTAL_QUESTIONS}</span>
            <span style={{ fontWeight: 600 }}>{currentCategory.emoji} {currentCategory.title}</span>
          </div>
        </div>

        {/* Category Header */}
        <div className="daylio-category-header fade-in" key={categoryIdx} style={{ background: currentCategory.bg, borderColor: `${currentCategory.color}30` }}>
          <span className="daylio-cat-emoji">{currentCategory.emoji}</span>
          <div>
            <h2 style={{ fontSize: '1.1rem', color: currentCategory.color }}>{currentCategory.title}</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Question {questionIdx + 1} of {currentCategory.questions.length}</p>
          </div>
        </div>

        {/* Question Card */}
        <div className="daylio-question-card fade-in" key={`${categoryIdx}-${questionIdx}`}>
          <h3 className="daylio-question-text">{currentQuestion.text}</h3>

          <div className={`daylio-options ${currentQuestion.type === 'emoji' ? 'emoji-options' : 'choice-options'}`}>
            {currentQuestion.options.map((opt, i) => (
              <button
                key={i}
                className={`daylio-option ${answers[currentQuestion.id] === opt.value ? 'selected' : ''}`}
                onClick={() => handleAnswer(currentQuestion.id, opt.value)}
                style={answers[currentQuestion.id] === opt.value ? { 
                  borderColor: currentCategory.color, 
                  background: `${currentCategory.color}10`,
                  boxShadow: `0 0 20px ${currentCategory.color}20`
                } : {}}
              >
                {currentQuestion.type === 'emoji' && (
                  <span className="daylio-option-emoji">
                    <MoodAvatar character={user?.avatar || 'neutral'} mood={opt.mood} size={42} style={{ marginBottom: 4 }} />
                  </span>
                )}
                <span className="daylio-option-label">{opt.label}</span>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="daylio-nav">
            <button className="btn btn-ghost btn-sm" onClick={goBack} disabled={categoryIdx === 0 && questionIdx === 0}>
              <ChevronLeft size={16} /> Back
            </button>
            <button className="btn btn-ghost btn-sm" onClick={restart}>Restart</button>
          </div>
        </div>
      </div>
    );
  }

  // ===== ANALYZING =====
  if (mode === 'analyzing') {
    return (
      <div className="fade-in" style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
        <div className="daylio-analyzing-card">
          <div className="daylio-analyzing-circle">
            <Sparkles size={28} />
          </div>
          <h3>Gemini is analyzing your responses</h3>
          <p>Reviewing {TOTAL_QUESTIONS} answers across 5 categories...</p>
          <div className="analyzing-dots" style={{ justifyContent: 'center' }}><span /><span /><span /></div>
        </div>
      </div>
    );
  }

  // ===== RESULT =====
  if (mode === 'result' && result) {
    const rColor = riskColor(result.risk_level);
    return (
      <div className="fade-in">
        <div className="page-header">
          <h1>Your Results</h1>
        </div>

        {/* Risk Level Hero */}
        <div className="daylio-result-hero" style={{ borderColor: `${rColor}30` }}>
          <div className="daylio-risk-circle" style={{ background: `linear-gradient(135deg, ${rColor}20, ${rColor}10)`, borderColor: `${rColor}40` }}>
            <span className="daylio-risk-emoji">
              {result.risk_level === 'Low' ? '🟢' : result.risk_level === 'Moderate' ? '🟡' : '🔴'}
            </span>
            <span className="daylio-risk-label" style={{ color: rColor }}>{result.risk_level} Risk</span>
            {result.rawPct !== null && (
              <span className="daylio-risk-score">{result.rawPct}% stress score</span>
            )}
          </div>
          {result.summary && (
            <p className="daylio-risk-summary">{result.summary}</p>
          )}
        </div>

        {/* Category Breakdown */}
        <div className="daylio-result-grid">
          {CATEGORIES.map(cat => {
            const catQuestions = cat.questions;
            const catTotal = catQuestions.reduce((sum, q) => sum + (answers[q.id] || 0), 0);
            const catMax = catQuestions.length * 4;
            const catPct = Math.round((catTotal / catMax) * 100);
            return (
              <div key={cat.id} className="daylio-result-category">
                <div className="daylio-result-cat-header">
                  <span>{cat.emoji}</span>
                  <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{cat.title}</span>
                  <span className="daylio-result-cat-pct" style={{ 
                    color: catPct > 60 ? '#ef4444' : catPct > 35 ? '#f59e0b' : '#10b981',
                    background: catPct > 60 ? '#fef2f2' : catPct > 35 ? '#fffbeb' : '#ecfdf5'
                  }}>{catPct}%</span>
                </div>
                <div className="daylio-result-cat-bar">
                  <div className="daylio-result-cat-fill" style={{ 
                    width: `${catPct}%`, 
                    background: `linear-gradient(90deg, ${cat.color}80, ${cat.color})` 
                  }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Key Indicators */}
        {result.indicators?.length > 0 && (
          <div className="card glass-card" style={{ marginBottom: 20 }}>
            <div className="card-title" style={{ marginBottom: 12 }}>⚠️ Key Indicators</div>
            <div className="indicator-list">
              {result.indicators.map((ind, i) => (
                <span key={i} className="indicator-tag"><AlertCircle size={12} />{ind}</span>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {result.recommendations?.length > 0 && (
          <div className="card glass-card" style={{ marginBottom: 20 }}>
            <div className="card-title" style={{ marginBottom: 16 }}>💡 Gemini Recommendations</div>
            <div className="recommendations">
              {result.recommendations.map((rec, i) => (
                <div key={i} className="recommendation-item">
                  <ChevronRight size={16} className="recommendation-icon" />{rec}
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <button className="btn btn-primary" onClick={restart}>Take Again</button>
          <button className="btn btn-ghost" onClick={() => { setMode('intro'); }}>Back to Menu</button>
        </div>
      </div>
    );
  }

  return null;
}
