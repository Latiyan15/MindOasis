import { useState } from 'react';
import { Sparkles, ArrowRight, Brain, RotateCcw, Activity, Briefcase, Home, ChevronRight, Stethoscope, Shield, X } from 'lucide-react';
import { generateAssessmentQuestions, generateMindCheckScenario } from '../services/gemini';
import { saveMindCheckResult } from '../services/storage';
import { useToast } from '../components/Toast';
import { useUser } from '../context/UserContext';

const OCCUPATION_LABELS = {
  student: { label: 'Student', icon: '📚', color: '#6366f1' },
  professional: { label: 'Professional', icon: '💼', color: '#0ea5e9' },
  healthcare: { label: 'Healthcare Worker', icon: '🏥', color: '#ef4444' },
  doctor: { label: 'Doctor', icon: '🩺', color: '#ef4444' },
  dentist: { label: 'Dentist', icon: '🦷', color: '#14b8a6' },
  engineer: { label: 'Engineer', icon: '⚙️', color: '#f97316' },
  teacher: { label: 'Teacher / Educator', icon: '🍎', color: '#22c55e' },
  artist: { label: 'Artist / Creative', icon: '🎨', color: '#a855f7' },
  homemaker: { label: 'Homemaker', icon: '🏠', color: '#ec4899' },
  freelancer: { label: 'Freelancer', icon: '💻', color: '#06b6d4' },
  entrepreneur: { label: 'Entrepreneur', icon: '🚀', color: '#f43f5e' },
  other: { label: 'Professional', icon: '✨', color: '#8b5cf6' },
};

const ENV_LABELS = {
  alone: { label: 'Living Alone', icon: '🧘' },
  family: { label: 'With Family', icon: '👨‍👩‍👧' },
  roommates: { label: 'With Roommates', icon: '👥' },
};

export default function MindCheck() {
  const { user } = useUser();
  // Phases: profile → generating → assessment → loading → scenario → insight → summary
  const [phase, setPhase] = useState('profile');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  
  // Dynamic questions from Gemini
  const [dynamicQuestions, setDynamicQuestions] = useState([]);
  
  // Scenario state
  const [mindCheckData, setMindCheckData] = useState(null);
  const [currentScenarioIdx, setCurrentScenarioIdx] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [history, setHistory] = useState([]);
  const [showExitModal, setShowExitModal] = useState(false);
  const addToast = useToast();

  const occData = OCCUPATION_LABELS[user?.occupation] || OCCUPATION_LABELS.other;
  const envData = ENV_LABELS[user?.environment] || { label: user?.environment || 'Not set', icon: '🏠' };

  // Exit Modal Component
  const ExitModal = () => (
    <div className="modal-overlay fade-in" style={{ zIndex: 1100 }}>
      <div className="card glass-card" style={{ width: '90%', maxWidth: 400, padding: 32, textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--rose-100)', color: 'var(--rose-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <RotateCcw size={32} />
        </div>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 12 }}>End Session?</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 28, lineHeight: 1.6 }}>
          Are you sure you want to leave? Your current assessment progress will be lost.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button 
            className="btn btn-primary" 
            style={{ background: 'var(--rose-600)', border: 'none', padding: '14px' }}
            onClick={() => {
              reset();
              setShowExitModal(false);
            }}
          >
            End Session
          </button>
          <button 
            className="btn btn-secondary" 
            style={{ padding: '14px' }}
            onClick={() => setShowExitModal(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  // Close Button component
  const CloseBtn = () => (
    <button 
      onClick={() => setShowExitModal(true)}
      style={{
        position: 'absolute', top: 16, right: 16, background: 'var(--gray-100)', color: 'var(--text-muted)',
        border: 'none', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', zIndex: 10
      }}
    >
      <X size={18} />
    </button>
  );

  // STEP 1: Begin assessment — generate tailored questions
  const handleBeginAssessment = async () => {
    setPhase('generating');
    try {
      const questions = await generateAssessmentQuestions(
        occData.label, 
        envData.label
      );
      setDynamicQuestions(questions);
      setCurrentQ(0);
      setAnswers({});
      setPhase('assessment');
    } catch (err) {
      addToast('Failed to generate questions. Using standard assessment.');
      console.error(err);
      setPhase('assessment');
    }
  };

  // STEP 2: Answer each question
  const handleAnswer = async (opt) => {
    const q = dynamicQuestions[currentQ];
    const newAnswers = { ...answers, [q.id]: opt };
    setAnswers(newAnswers);

    if (currentQ < dynamicQuestions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      // All answered → generate scenarios
      setPhase('loading');
      try {
        const data = await generateMindCheckScenario(user, newAnswers, dynamicQuestions);
        setMindCheckData(data);
        setCurrentScenarioIdx(0);
        setHistory([]);
        setPhase('scenario');
      } catch (err) {
        addToast('Failed to generate scenarios. Please try again.');
        setPhase('profile');
      }
    }
  };

  // STEP 3: Choose in scenario
  const handleChoice = (choice) => {
    setSelectedChoice(choice);
    const scenario = mindCheckData.scenarios[currentScenarioIdx];
    setHistory(prev => [...prev, {
      scenarioText: scenario.scenario_text,
      chosenText: choice.text,
      insight: choice.insight,
      action: choice.suggested_action
    }]);
    setPhase('insight');
  };

  const handleNext = () => {
    if (currentScenarioIdx < mindCheckData.scenarios.length - 1) {
      setCurrentScenarioIdx(prev => prev + 1);
      setSelectedChoice(null);
      setPhase('scenario');
    } else {
      // Save MindCheck results to localStorage for the Report page
      const updatedHistory = [...history];
      saveMindCheckResult({
        burnout_indicator: mindCheckData.burnout_indicator,
        burnout_insight: mindCheckData.burnout_insight,
        answers,
        questions: dynamicQuestions,
        history: updatedHistory,
      });
      setPhase('summary');
    }
  };

  const reset = () => {
    setPhase('profile');
    setCurrentQ(0);
    setAnswers({});
    setDynamicQuestions([]);
    setMindCheckData(null);
    setCurrentScenarioIdx(0);
    setSelectedChoice(null);
    setHistory([]);
  };

  const currentScenario = mindCheckData?.scenarios?.[currentScenarioIdx];
  const currentQuestion = dynamicQuestions[currentQ];

  const getIndicatorColor = (indicator) => {
    if (indicator?.includes('Low')) return 'var(--green-600)';
    if (indicator?.includes('Moderate')) return 'var(--amber-600)';
    if (indicator?.includes('High')) return 'var(--rose-600)';
    return 'var(--primary-600)';
  };

  return (
    <div className="fade-in premium-page" style={{ maxWidth: 800, margin: '0 auto', paddingTop: 40, position: 'relative' }}>
      {showExitModal && <ExitModal />}

      {/* ============ PHASE: PROFILE ============ */}
      {phase === 'profile' && (
        <div className="fade-in" style={{ textAlign: 'center' }}>
          {/* Header */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-100), var(--primary-200))', color: 'var(--primary-600)', marginBottom: 16 }}>
              <Brain size={36} />
            </div>
            <h1 style={{ fontSize: '2.2rem', color: 'var(--text-primary)', marginBottom: 8, fontWeight: 800 }}>Mind Check & Scenario Guide</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: 550, margin: '0 auto' }}>
              A personalized burnout assessment tailored specifically to your life and profession.
            </p>
          </div>

          {/* Profile Cards */}
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 40, flexWrap: 'wrap' }}>
            {/* Occupation Card */}
            <div style={{ 
              flex: 1, minWidth: 200, maxWidth: 300, padding: '28px 24px', borderRadius: 20, 
              background: 'white', border: `2px solid ${occData.color}20`,
              boxShadow: `0 8px 24px ${occData.color}10`
            }}>
              <div style={{ fontSize: '2.2rem', marginBottom: 12 }}>{occData.icon}</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                <Briefcase size={12} style={{ verticalAlign: -1, marginRight: 4 }} />Your Profession
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: occData.color }}>
                {occData.label}
              </div>
            </div>

            {/* Environment Card */}
            <div style={{ 
              flex: 1, minWidth: 200, maxWidth: 300, padding: '28px 24px', borderRadius: 20, 
              background: 'white', border: '2px solid rgba(148,163,184,0.15)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.04)'
            }}>
              <div style={{ fontSize: '2.2rem', marginBottom: 12 }}>{envData.icon}</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                <Home size={12} style={{ verticalAlign: -1, marginRight: 4 }} />Environment
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {envData.label}
              </div>
            </div>
          </div>

          {/* What to expect */}
          <div className="card glass-card" style={{ padding: '24px 28px', textAlign: 'left', marginBottom: 32 }}>
            <h3 style={{ fontSize: '1rem', marginBottom: 16, color: 'var(--text-primary)' }}>
              <Shield size={16} style={{ verticalAlign: -3, marginRight: 8, color: 'var(--primary-600)' }} />
              What to Expect
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--primary-50)', color: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 }}>1</div>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                  <strong>4 profession-specific</strong> burnout questions tailored to your role as a {occData.label.toLowerCase()}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--primary-50)', color: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 }}>2</div>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                  <strong>3 general behavioral</strong> questions based on clinical burnout research (MBI)
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--primary-50)', color: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 }}>3</div>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                  <strong>3 interactive scenarios</strong> simulating real stressors from your life
                </span>
              </div>
            </div>
          </div>

          <button 
            className="premium-save-btn" 
            onClick={handleBeginAssessment}
            style={{ padding: '16px 40px', fontSize: '1.1rem', fontWeight: 700, borderRadius: 16, boxShadow: '0 8px 24px rgba(92,127,74,0.25)' }}
          >
            Begin My Assessment <ArrowRight size={20} style={{ marginLeft: 8, verticalAlign: -4 }} />
          </button>
        </div>
      )}

      {/* ============ PHASE: GENERATING QUESTIONS ============ */}
      {phase === 'generating' && (
        <div className="fade-in" style={{ textAlign: 'center', padding: '100px 0', position: 'relative' }}>
          <CloseBtn />
          <div className="premium-icon-circle" style={{ margin: '0 auto 24px', animation: 'spin-slow 3s linear infinite' }}>
            <Stethoscope size={32} color="var(--primary-500)" />
          </div>
          <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', marginBottom: 12 }}>
            Preparing your personalized assessment...
          </h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 400, margin: '0 auto' }}>
            Gemini is generating clinically relevant questions specifically for a <strong>{occData.label.toLowerCase()}</strong> {envData.label.toLowerCase()}.
          </p>
        </div>
      )}

      {/* ============ PHASE: ASSESSMENT (Dynamic Questions) ============ */}
      {phase === 'assessment' && currentQuestion && (
        <div className="card glass-card fade-in" style={{ padding: '40px 30px', textAlign: 'center', position: 'relative' }}>
          <CloseBtn />
          {/* Progress Bar */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 30 }}>
            {dynamicQuestions.map((q, i) => (
              <div key={q.id} style={{ 
                height: 6, 
                width: i <= currentQ ? 36 : 24, 
                borderRadius: 3, 
                background: i < currentQ ? 'var(--primary-500)' : i === currentQ ? 'var(--primary-400)' : 'var(--primary-100)', 
                transition: 'all 0.4s ease',
                opacity: i <= currentQ ? 1 : 0.5
              }} />
            ))}
          </div>

          {/* Category Badge */}
          <div style={{ marginBottom: 24 }}>
            <span style={{ 
              display: 'inline-block', padding: '6px 14px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.04em',
              background: currentQuestion.category === 'profession' ? `${occData.color}15` : 'var(--primary-50)',
              color: currentQuestion.category === 'profession' ? occData.color : 'var(--primary-700)',
              textTransform: 'uppercase'
            }}>
              {currentQuestion.category === 'profession' ? `${occData.icon} ${occData.label} Specific` : '🧠 General Behavioral'}
            </span>
          </div>

          {/* Question Counter */}
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8 }}>
            Question {currentQ + 1} of {dynamicQuestions.length} — {currentQuestion.title}
          </div>

          {/* Question Text */}
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', fontWeight: 700, lineHeight: 1.5, marginBottom: 32, maxWidth: 550, margin: '0 auto 32px' }}>
            "{currentQuestion.text}"
          </h2>

          {/* Answer Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 420, margin: '0 auto' }}>
            {currentQuestion.options.map((opt, index) => (
              <button
                key={opt}
                onClick={() => handleAnswer(opt)}
                style={{
                  padding: '14px 20px',
                  borderRadius: 14,
                  border: '2px solid rgba(148,163,184,0.12)',
                  background: 'white',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex', alignItems: 'center', gap: 12,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.borderColor = 'var(--primary-400)';
                  e.currentTarget.style.background = 'var(--primary-50)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.borderColor = 'rgba(148,163,184,0.12)';
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ 
                  width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                  background: ['var(--green-400)', 'var(--green-300)', 'var(--amber-400)', 'var(--rose-300)', 'var(--rose-500)'][index]
                }} />
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ============ PHASE: LOADING SCENARIOS ============ */}
      {phase === 'loading' && (
        <div className="fade-in" style={{ textAlign: 'center', padding: '100px 0', position: 'relative' }}>
          <CloseBtn />
          <div className="premium-icon-circle" style={{ margin: '0 auto 24px', animation: 'spin-slow 3s linear infinite' }}>
            <Sparkles size={32} color="var(--primary-500)" />
          </div>
          <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', marginBottom: 12 }}>
            Analyzing your responses & building scenarios...
          </h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 450, margin: '0 auto' }}>
            Gemini is cross-referencing your {dynamicQuestions.filter(q => q.category === 'profession').length} profession-specific and {dynamicQuestions.filter(q => q.category === 'general').length} behavioral answers to create 3 personalized scenarios.
          </p>
        </div>
      )}

      {/* ============ PHASE: SCENARIO LOOP ============ */}
      {phase === 'scenario' && currentScenario && (
        <div className="card glass-card fade-in" style={{ padding: '40px 30px', position: 'relative' }}>
          <CloseBtn />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, borderBottom: '1px solid rgba(148,163,184,0.1)', paddingBottom: 20 }}>
            <span style={{ fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>
              Scenario {currentScenarioIdx + 1} of 3
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              {[0, 1, 2].map(idx => (
                <div key={idx} style={{ height: 8, width: 8, borderRadius: '50%', background: idx === currentScenarioIdx ? 'var(--primary-500)' : idx < currentScenarioIdx ? 'var(--primary-300)' : 'var(--primary-100)' }} />
              ))}
            </div>
          </div>
          
          <h2 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', lineHeight: 1.7, marginBottom: 40, fontWeight: 500 }}>
            "{currentScenario.scenario_text}"
          </h2>

          <h3 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>How would you respond?</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {currentScenario.choices.map((choice, i) => (
              <button
                key={choice.id}
                onClick={() => handleChoice(choice)}
                style={{
                  padding: '16px 20px', borderRadius: 16,
                  border: '2px solid rgba(148,163,184,0.15)',
                  background: 'white', textAlign: 'left',
                  color: 'var(--text-primary)', fontSize: '1rem',
                  lineHeight: 1.5, cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', gap: 16
                }}
                onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--primary-400)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(148,163,184,0.15)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--primary-50)', color: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, flexShrink: 0 }}>
                  {String.fromCharCode(65 + i)}
                </div>
                {choice.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ============ PHASE: INSIGHT ============ */}
      {phase === 'insight' && selectedChoice && (
        <div className="card glass-card fade-in" style={{ padding: '40px 30px', position: 'relative' }}>
          <CloseBtn />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <Brain size={24} color="var(--primary-600)" />
            <span style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-primary)' }}>AI Insight</span>
          </div>

          <div style={{ padding: '16px 20px', borderRadius: 12, background: 'var(--primary-50)', color: 'var(--primary-800)', marginBottom: 24, fontStyle: 'italic', borderLeft: '4px solid var(--primary-400)' }}>
            "{selectedChoice.text}"
          </div>

          <div style={{ background: 'white', borderRadius: 16, padding: '24px', border: '1px solid rgba(148,163,184,0.15)', marginBottom: 24 }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Emotional Impact</div>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-primary)', lineHeight: 1.6, margin: 0 }}>
              {selectedChoice.insight}
            </p>
          </div>

          <div style={{ background: 'linear-gradient(135deg, var(--green-50), var(--green-100))', borderRadius: 16, padding: '24px', border: '1px solid var(--green-200)', marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Sparkles size={16} color="var(--green-600)" />
              <div style={{ fontSize: '0.85rem', color: 'var(--green-700)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Suggested Action</div>
            </div>
            <p style={{ fontSize: '1.1rem', color: 'var(--green-800)', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
              {selectedChoice.suggested_action}
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="premium-save-btn" onClick={handleNext}>
              {currentScenarioIdx < 2 ? 'Next Scenario' : 'View Summary'} <ArrowRight size={16} style={{ marginLeft: 8 }}/>
            </button>
          </div>
        </div>
      )}

      {/* ============ PHASE: SUMMARY ============ */}
      {phase === 'summary' && mindCheckData && (
        <div className="fade-in">
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-100), var(--primary-200))', color: 'var(--primary-600)', marginBottom: 16 }}>
              <Brain size={32} />
            </div>
            <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: 8 }}>Your Results</h1>
          </div>

          {/* Indicator Card */}
          <div className="card glass-card" style={{ padding: '32px 28px', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <Activity size={28} color={getIndicatorColor(mindCheckData.burnout_indicator)} />
              <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--text-primary)' }}>Burnout Analysis</h2>
            </div>
            
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
              <div style={{ display: 'inline-block', padding: '8px 16px', borderRadius: 20, background: `${getIndicatorColor(mindCheckData.burnout_indicator)}15`, color: getIndicatorColor(mindCheckData.burnout_indicator), fontWeight: 700, fontSize: '0.9rem' }}>
                {mindCheckData.burnout_indicator}
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Based on {dynamicQuestions.length} questions tailored for {occData.label.toLowerCase()}s
              </span>
            </div>

            <p style={{ fontSize: '1.1rem', color: 'var(--text-primary)', lineHeight: 1.7, marginBottom: 0 }}>
              {mindCheckData.burnout_insight}
            </p>
          </div>

          {/* Scenario Review */}
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: 16, marginLeft: 8 }}>
            <ChevronRight size={16} style={{ verticalAlign: -3, marginRight: 4 }} />
            Scenario Review
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
            {history.map((item, idx) => (
              <div key={idx} className="card" style={{ padding: 24, background: 'white', borderRadius: 16, border: '1px solid rgba(148,163,184,0.1)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-600)', marginBottom: 8, textTransform: 'uppercase' }}>Scenario {idx + 1}</div>
                <p style={{ color: 'var(--text-primary)', marginBottom: 12, fontWeight: 500 }}>"{item.scenarioText}"</p>
                <div style={{ background: 'var(--primary-50)', padding: 12, borderRadius: 8, fontSize: '0.9rem', color: 'var(--primary-800)', borderLeft: '3px solid var(--primary-400)', marginBottom: 16 }}>
                  You chose: {item.chosenText}
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <Sparkles size={16} color="var(--green-600)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
                    <strong>Takeaway:</strong> {item.action}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <button className="premium-save-btn" onClick={reset}>
              <RotateCcw size={16} style={{ marginRight: 8, verticalAlign: -3 }}/> Start Over
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
