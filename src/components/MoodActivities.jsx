import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Wind, Gamepad2, Palette, Music, Dumbbell, MessageCircle,
  Sparkles, Heart, Zap, RefreshCw, Trophy, Star, Check, Send, Loader, Smile, HelpCircle, Brain, ChevronLeft, Clock, Layers, SplitSquareHorizontal, ListChecks, Type, BookOpen, PenTool, X
} from 'lucide-react';
import { callGeminiRaw } from '../services/gemini';
import SmartReflection from './SmartReflection';
import ReportPopup from './ReportPopup';

// ===== Breathing Exercise (Stressed) =====
function BreathingExercise({ onBack }) {
  const [phase, setPhase] = useState('idle'); // idle | inhale | hold | exhale
  const [count, setCount] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [running, setRunning] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(() => localStorage.getItem('mindoasis_voice_breathing') === 'true');
  const intervalRef = useRef(null);

  const speak = (text) => {
    if (!voiceEnabled) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  const phases = [
    { name: 'inhale', label: 'Breathe In', duration: 4, color: 'var(--primary-400)' },
    { name: 'hold', label: 'Hold', duration: 4, color: 'var(--accent-400)' },
    { name: 'exhale', label: 'Breathe Out', duration: 6, color: 'var(--green-400)' },
  ];

  const start = () => {
    setRunning(true);
    setPhase('inhale');
    setCount(4);
    setCycles(0);
    speak('Breathe in');
  };

  const stop = () => {
    setRunning(false);
    setPhase('idle');
    clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setCount(prev => {
        if (prev <= 1) {
          setPhase(p => {
            if (p === 'inhale') { speak('Hold'); return 'hold'; }
            if (p === 'hold') { speak('Breathe out'); return 'exhale'; }
            setCycles(c => {
              const newCycles = c + 1;
              if (newCycles === 3 && onComplete) onComplete();
              return newCycles;
            });
            speak('Breathe in');
            return 'inhale';
          });
          const nextPhase = phase === 'inhale' ? 'hold' : phase === 'hold' ? 'exhale' : 'inhale';
          return phases.find(p => p.name === nextPhase)?.duration || 4;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running, phase]);

  const currentPhase = phases.find(p => p.name === phase);
  const circleScale = phase === 'inhale' ? 1.3 : phase === 'exhale' ? 0.8 : 1.1;

  return (
    <div className="activity-card" style={{ textAlign: 'center' }}>
      <div className="activity-header">
        {onBack && <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><ChevronLeft size={18} /></button>}
        <Wind size={20} style={{ color: 'var(--primary-500)', marginLeft: onBack ? 8 : 0 }} />
        <h3>Box Breathing</h3>
        <button 
          onClick={() => {
            const next = !voiceEnabled;
            setVoiceEnabled(next);
            localStorage.setItem('mindoasis_voice_breathing', next);
          }}
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            marginLeft: 'auto',
            color: voiceEnabled ? 'var(--primary-500)' : 'var(--text-muted)'
          }}
          title={voiceEnabled ? "Turn off voice" : "Turn on voice"}
        >
          {voiceEnabled ? <Music size={18} /> : <div style={{ opacity: 0.5 }}><Music size={18} /></div>}
        </button>
      </div>
      <p className="activity-desc">Follow the circle. Calm your mind with rhythmic breathing.</p>
      
      <div className="breathing-container">
        <div 
          className="breathing-circle"
          style={{ 
            transform: `scale(${running ? circleScale : 1})`,
            background: running ? currentPhase?.color : 'var(--gray-200)',
            transition: phase === 'inhale' ? 'transform 4s ease' : phase === 'exhale' ? 'transform 6s ease' : 'transform 0.3s ease'
          }}
        >
          {running ? (
            <>
              <span className="breathing-label">{currentPhase?.label}</span>
              <span className="breathing-count">{count}</span>
            </>
          ) : (
            <span className="breathing-label">Start</span>
          )}
        </div>
      </div>
      
      {cycles > 0 && <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{cycles} cycles completed</p>}
      
      <button className={`btn ${running ? 'btn-secondary' : 'btn-primary'}`} onClick={running ? stop : () => { start(); }} style={{ width: '100%' }}>
        {running ? 'Stop' : 'Start Breathing'}
      </button>
    </div>
  );
}

// ===== Anxiety Intensity & Suggestions (Anxious) =====
function AnxietyIntensity({ onOptionClick, onComplete }) {
  const [level, setLevel] = useState(5);

  const getSuggestion = () => {
    if (level <= 3) return { text: "You're feeling a bit uneasy. Maybe a quick grounding or a light stretch?", action: 'grounding' };
    if (level <= 7) return { text: "That's quite a bit of tension. Let's try some deep breathing or a guided grounding.", action: 'breathing' };
    return { text: "That's very intense. Please try a slow breathing exercise or chat with our clarity AI for support.", action: 'chat' };
  };

  const suggestion = getSuggestion();

  return (
    <div className="activity-card fade-in">
      <div className="activity-header">
        <Zap size={20} style={{ color: 'var(--amber-500)' }} />
        <h3>How are you feeling?</h3>
      </div>
      <p className="activity-desc">Take a moment to check in with yourself. How intense is your anxiety right now?</p>
      
      <div style={{ margin: '30px 0', padding: '0 10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontWeight: 600, color: 'var(--amber-600)' }}>
          <span>Calm</span>
          <span style={{ fontSize: '1.5rem' }}>{level}</span>
          <span>Intense</span>
        </div>
        <input 
          type="range" 
          min="1" 
          max="10" 
          value={level} 
          onChange={(e) => setLevel(parseInt(e.target.value))}
          style={{ 
            width: '100%', 
            cursor: 'pointer',
            accentColor: 'var(--amber-500)',
            height: '8px',
            borderRadius: '4px'
          }}
        />
      </div>

      <div style={{ 
        padding: '16px', 
        background: 'var(--amber-50)', 
        borderRadius: '12px', 
        borderLeft: '4px solid var(--amber-400)',
        marginBottom: 20
      }}>
        <p style={{ fontSize: '0.9rem', color: '#78350f', margin: 0 }}>{suggestion.text}</p>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn btn-primary" onClick={() => { 
          onOptionClick(suggestion.action);
          if (onComplete) onComplete('Anxiety Check-in');
        }} style={{ flex: 1 }}>
          Take Action
        </button>
      </div>
    </div>
  );
}

// ===== Voice Grounding (Anxious) =====
function VoiceGrounding({ onBack }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [script, setScript] = useState('');
  const [currentSentence, setCurrentSentence] = useState('');
  const speechRef = useRef(null);

  const getScript = async () => {
    setLoading(true);
    try {
      const response = await callGeminiRaw(
        "You are a calm, soothing meditation guide.",
        "Write a 5-sentence slow, grounding instruction for someone feeling anxious. Focus on the 5-4-3-2-1 technique but make it flow like a gentle conversation. Do not use markdown or headers."
      );
      setScript(response);
      return response;
    } catch (e) {
      const fallback = "Take a slow breath. Look around you and find five things you can see. Feel the ground beneath your feet. You are safe in this moment. Breathe out slowly.";
      setScript(fallback);
      return fallback;
    } finally {
      setLoading(false);
    }
  };

  const startVoice = async () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const text = script || await getScript();
    setIsPlaying(true);
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.pitch = 1;
    
    // Simple sentence highlighting attempt
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    let sIdx = 0;

    utterance.onboundary = (event) => {
      // This is complex to sync perfectly, so we'll just show the full text for now
      // or try to split by sentence if we wanted more.
    };

    utterance.onstart = () => {
      setCurrentSentence(text);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setCurrentSentence('');
      if (onComplete) onComplete(); 
    };

    window.speechSynthesis.speak(utterance);
    speechRef.current = utterance;
  };

  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  return (
    <div className="activity-card fade-in">
      <div className="activity-header">
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><ChevronLeft size={18} /></button>
        <Music size={20} style={{ color: 'var(--primary-500)', marginLeft: 8 }} />
        <h3>Guided Grounding</h3>
      </div>
      <p className="activity-desc">Close your eyes and listen to these soothing instructions.</p>

      <div style={{ textAlign: 'center', padding: '30px 0' }}>
        <button 
          className={`btn ${isPlaying ? 'btn-secondary' : 'btn-primary'}`} 
          onClick={startVoice}
          disabled={loading}
          style={{ 
            width: 80, 
            height: 80, 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: isPlaying ? '0 0 20px var(--primary-300)' : 'none',
            transition: 'all 0.3s ease'
          }}
        >
          {loading ? <Loader className="spin" size={24} /> : (isPlaying ? <span style={{ fontSize: '1.5rem' }}>⏹</span> : <span style={{ fontSize: '1.5rem' }}>🎧</span>)}
        </button>
        <p style={{ fontWeight: 600, color: 'var(--primary-600)' }}>
          {isPlaying ? 'Listening...' : 'Tap to Listen'}
        </p>
      </div>

      {script && (
        <div className="fade-in" style={{ 
          padding: '20px', 
          background: 'rgba(255,255,255,0.5)', 
          borderRadius: '12px', 
          fontSize: '0.95rem', 
          lineHeight: '1.6', 
          fontStyle: 'italic',
          color: 'var(--text-secondary)',
          textAlign: 'center'
        }}>
          "{script}"
        </div>
      )}
    </div>
  );
}

// ===== 2-Minute Reset (Stressed) =====
function PhysicalReset({ onBack }) {
  const [timeLeft, setTimeLeft] = useState(120);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const tasks = [
    { time: 120, text: "Stretch your shoulders and neck gently" },
    { time: 80, text: "Breathe slowly: 4 seconds in, 4 seconds out" },
    { time: 40, text: "Take a slow sip of water" },
    { time: 10, text: "Almost there, feel the tension leaving..." }
  ];

  useEffect(() => {
    let timer = null;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsFinished(true);
      setIsActive(false);
      if (onComplete) onComplete();
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  const currentTask = tasks.find(t => timeLeft <= t.time)?.text || "Breathe deeply";

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const reset = () => {
    setTimeLeft(120);
    setIsActive(false);
    setIsFinished(false);
  };

  return (
    <div className="activity-card fade-in" style={{ textAlign: 'center' }}>
      <div className="activity-header">
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><ChevronLeft size={18} /></button>
        <Clock size={20} style={{ color: 'var(--rose-500)', marginLeft: 8 }} />
        <h3>2-Minute Reset</h3>
      </div>
      <p className="activity-desc">A quick physical reset to lower stress levels.</p>

      {!isFinished ? (
        <div style={{ padding: '20px 0' }}>
          <div style={{ 
            fontSize: '3.5rem', 
            fontWeight: 800, 
            color: 'var(--rose-500)', 
            fontVariantNumeric: 'tabular-nums',
            margin: '10px 0' 
          }}>
            {formatTime(timeLeft)}
          </div>
          
          <div style={{ 
            minHeight: '60px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '0 20px',
            margin: '20px 0',
            fontSize: '1.1rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            transition: 'all 0.5s ease'
          }}>
            {isActive ? currentTask : "Ready for a quick reset?"}
          </div>

          <button 
            className={`btn ${isActive ? 'btn-secondary' : 'btn-primary'}`} 
            onClick={() => setIsActive(!isActive)}
            style={{ width: '100%', maxWidth: '200px' }}
          >
            {isActive ? 'Pause' : 'Start Reset'}
          </button>
        </div>
      ) : (
        <div className="fade-in" style={{ padding: '30px 0' }}>
          <div style={{ fontSize: '3rem', marginBottom: 15 }}>✨</div>
          <h4 style={{ color: 'var(--green-600)', marginBottom: 10 }}>Reset Complete!</h4>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>How do you feel? Your body thanks you for this small break.</p>
          <button className="btn btn-primary" onClick={reset} style={{ width: '100%', maxWidth: '200px' }}>
            Ready for Another?
          </button>
        </div>
      )}
    </div>
  );
}

// ===== Stressed Hub (Stressed) =====
function StressedHub({ onComplete }) {
  const [activeTool, setActiveTool] = useState(null);

  if (activeTool === 'reset') return <PhysicalReset onBack={() => setActiveTool(null)} onComplete={() => onComplete('2-Minute Reset')} />;
  if (activeTool === 'breath') return <BreathingExercise onBack={() => setActiveTool(null)} onComplete={() => onComplete('Box Breathing')} />;

  return (
    <div className="activity-card fade-in" style={{ padding: 16 }}>
      <div className="activity-header" style={{ marginBottom: 16 }}>
        <RefreshCw size={24} style={{ color: 'var(--primary-500)' }} />
        <h2>Stress Relief Hub</h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button className="btn btn-primary" onClick={() => setActiveTool('reset')} style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: 12, width: '100%', justifyContent: 'flex-start' }}>
          <Clock size={20} /> 2-Minute Reset
        </button>
        <button className="btn btn-secondary" onClick={() => setActiveTool('breath')} style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: 12, width: '100%', justifyContent: 'flex-start' }}>
          <Wind size={20} /> Box Breathing
        </button>
      </div>
    </div>
  );
}

// ===== Anxious Hub (Anxious) =====
function AnxiousHub({ onComplete }) {
  const [activeTool, setActiveTool] = useState('intensity');

  const handleIntensityAction = (action) => {
    setActiveTool(action);
  };

  if (activeTool === 'intensity') return <AnxietyIntensity onOptionClick={handleIntensityAction} onComplete={onComplete} />;
  if (activeTool === 'grounding') return <GroundingExercise onBack={() => setActiveTool('intensity')} onComplete={() => onComplete('Grounding Exercise')} />;
  if (activeTool === 'breathing') return <BreathingExercise onBack={() => setActiveTool('intensity')} onComplete={() => onComplete('Box Breathing')} />;
  if (activeTool === 'voice') return <VoiceGrounding onBack={() => setActiveTool('intensity')} onComplete={() => onComplete('Voice Grounding')} />;
  if (activeTool === 'chat') return <ClarityChat onBack={() => setActiveTool('intensity')} onComplete={() => onComplete('Clarity Chat')} />;

  return null;
}

// ===== Grounding Exercise (Anxious) =====
function GroundingExercise() {
  const steps = [
    { count: 5, sense: 'SEE', emoji: '👀', prompt: 'Name 5 things you can see right now' },
    { count: 4, sense: 'TOUCH', emoji: '✋', prompt: 'Name 4 things you can touch' },
    { count: 3, sense: 'HEAR', emoji: '👂', prompt: 'Name 3 things you can hear' },
    { count: 2, sense: 'SMELL', emoji: '👃', prompt: 'Name 2 things you can smell' },
    { count: 1, sense: 'TASTE', emoji: '👅', prompt: 'Name 1 thing you can taste' },
  ];
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  const handleNext = () => {
    if (step < steps.length - 1) setStep(s => s + 1);
    else {
      setDone(true);
      if (onComplete) onComplete();
    }
  };

  const reset = () => { setStep(0); setDone(false); };

  return (
    <div className="activity-card">
      <div className="activity-header">
        <Zap size={20} style={{ color: 'var(--amber-500)' }} />
        <h3>5-4-3-2-1 Grounding</h3>
      </div>
      <p className="activity-desc">Anchor yourself to the present moment using your senses.</p>
      
      {!done ? (
        <div className="grounding-step fade-in" key={step}>
          <div className="grounding-emoji">{steps[step].emoji}</div>
          <div className="grounding-count">{steps[step].count}</div>
          <div className="grounding-sense">{steps[step].sense}</div>
          <p className="grounding-prompt">{steps[step].prompt}</p>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            {steps.map((_, i) => (
              <div key={i} className="grounding-dot" style={{ background: i <= step ? 'var(--primary-400)' : 'var(--gray-200)' }} />
            ))}
          </div>
          <button className="btn btn-primary" onClick={handleNext} style={{ width: '100%', marginTop: 16 }}>
            {step < steps.length - 1 ? 'Next Sense →' : 'Complete! ✓'}
          </button>
        </div>
      ) : (
        <div className="grounding-step fade-in" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem' }}>🌟</div>
          <h3 style={{ color: 'var(--green-500)', margin: '8px 0' }}>Great job!</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>You've grounded yourself in the present.</p>
          <button className="btn btn-secondary" onClick={reset} style={{ width: '100%', marginTop: 12 }}>
            <RefreshCw size={14} /> Do Again
          </button>
        </div>
      )}
    </div>
  );
}

// ===== Word Scramble Game (Bored) =====
const WORD_SETS = [
  { word: 'SERENITY', hint: 'A state of calm and peace', category: 'Wellness' },
  { word: 'COURAGE', hint: 'Bravery in the face of fear', category: 'Strength' },
  { word: 'GRATITUDE', hint: 'Being thankful for what you have', category: 'Mindset' },
  { word: 'RESILIENCE', hint: 'Ability to bounce back from adversity', category: 'Strength' },
  { word: 'MINDFUL', hint: 'Fully present and aware', category: 'Wellness' },
  { word: 'BALANCE', hint: 'Harmony between different aspects of life', category: 'Wellness' },
  { word: 'EMPATHY', hint: 'Understanding others feelings', category: 'Connection' },
  { word: 'HARMONY', hint: 'A state of peaceful coexistence', category: 'Wellness' },
  { word: 'PATIENCE', hint: 'Ability to wait without frustration', category: 'Strength' },
  { word: 'KINDNESS', hint: 'Being warm and generous', category: 'Connection' },
];

function scramble(word) {
  const arr = word.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join('') === word ? scramble(word) : arr.join('');
}

function WordGame({ onBack }) {
  const [wordIdx, setWordIdx] = useState(0);
  const [guess, setGuess] = useState('');
  const [scrambled, setScrambled] = useState('');
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    setScrambled(scramble(WORD_SETS[wordIdx].word));
    setGuess('');
    setShowHint(false);
    setCorrect(false);
  }, [wordIdx]);

  const checkGuess = () => {
    if (guess.toUpperCase().trim() === WORD_SETS[wordIdx].word) {
      setCorrect(true);
      setScore(s => s + (showHint ? 5 : 10));
      setStreak(s => s + 1);
      if (onComplete) onComplete();
    } else {
      setStreak(0);
    }
  };

  const nextWord = () => {
    setWordIdx(i => (i + 1) % WORD_SETS.length);
  };

  return (
    <div className="activity-card fade-in">
      <div className="activity-header">
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0, color: 'var(--text-muted)' }}>
          <ChevronLeft size={18} />
        </button>
        <h3 style={{ marginLeft: 8 }}>Word Scramble</h3>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
          <span className="game-score"><Trophy size={12} /> {score} pts</span>
          {streak > 1 && <span className="game-streak"><Zap size={12} /> {streak}🔥</span>}
        </div>
      </div>
      <p className="activity-desc" style={{ marginTop: -8 }}>Unscramble wellness-themed words.</p>

      <div className="word-display">
        <span className="word-category">{WORD_SETS[wordIdx].category}</span>
        <div className="scrambled-word">
          {scrambled.split('').map((letter, i) => (
            <span key={i} className="letter-tile" style={{ animationDelay: `${i * 0.05}s` }}>
              {letter}
            </span>
          ))}
        </div>
      </div>

      {!correct ? (
        <>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              className="input"
              placeholder="Your guess..."
              value={guess}
              onChange={e => setGuess(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && checkGuess()}
              style={{ flex: 1, textTransform: 'uppercase', letterSpacing: 2, fontWeight: 600 }}
            />
            <button className="btn btn-primary" onClick={checkGuess}>Check</button>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setShowHint(true)} disabled={showHint}>
              {showHint ? `💡 ${WORD_SETS[wordIdx].hint}` : '💡 Hint (-5 pts)'}
            </button>
            <button className="btn btn-secondary btn-sm" onClick={nextWord}>Skip →</button>
          </div>
        </>
      ) : (
        <div className="game-correct fade-in">
          <div style={{ fontSize: '2rem' }}>🎉</div>
          <strong>Correct!</strong> The word was <strong>{WORD_SETS[wordIdx].word}</strong>
          <button className="btn btn-primary" onClick={nextWord} style={{ marginTop: 8, width: '100%' }}>
            Next Word →
          </button>
        </div>
      )}
    </div>
  );
}

// ===== AI Emoji Decoder (Bored) =====
function EmojiDecoder({ onBack }) {
  const [emojis, setEmojis] = useState('...');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('');
  const [guess, setGuess] = useState('');
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const newPuzzle = async () => {
    setLoading(true);
    setCorrect(false);
    setRevealed(false);
    setGuess('');
    try {
      const response = await callGeminiRaw(
        "You are an emoji puzzle generator.",
        "Generate a famous movie, book, or pop culture item represented entirely in 3 to 6 emojis. Respond ONLY with this exact JSON format: {\"emojis\": \"🎥👽🚲🌖\", \"answer\": \"ET\", \"category\": \"Movie\"}. Do not include markdown blocks or any other text."
      );
      const parsed = JSON.parse(response.replace(/```json/g, '').replace(/```/g, ''));
      setEmojis(parsed.emojis);
      setAnswer(parsed.answer);
      setCategory(parsed.category);
    } catch {
      setEmojis('🎥👽🚲🌖');
      setAnswer('ET');
      setCategory('Movie');
    }
    setLoading(false);
  };

  useEffect(() => { newPuzzle(); }, []);

  const checkGuess = () => {
    if (guess.toLowerCase().trim() === answer.toLowerCase().trim() || answer.toLowerCase().includes(guess.toLowerCase().trim()) && guess.length > 3) {
      setCorrect(true);
      setScore(s => s + 10);
      if (onComplete) onComplete();
    } else {
      alert("Not quite! Try again.");
    }
  };

  return (
    <div className="activity-card fade-in">
       <div className="activity-header">
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0, color: 'var(--text-muted)' }}><ChevronLeft size={18} /></button>
        <h3 style={{ marginLeft: 8 }}>Emoji Decoder</h3>
        <span className="game-score" style={{ marginLeft: 'auto' }}><Trophy size={12} /> {score} pts</span>
      </div>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}><Loader className="spin" size={24} color="var(--accent-500)" /></div>
      ) : (
        <>
          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-500)', textTransform: 'uppercase', letterSpacing: 1 }}>{category}</span>
            <div style={{ fontSize: '3rem', letterSpacing: '4px', margin: '10px 0' }}>{emojis}</div>
          </div>

          {!correct && !revealed ? (
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="input" placeholder="What is it?" value={guess} onChange={e => setGuess(e.target.value)} onKeyDown={e => e.key === 'Enter' && checkGuess()} style={{ flex: 1 }} />
              <button className="btn btn-primary" onClick={checkGuess}>Guess</button>
            </div>
          ) : (
            <div className="game-correct fade-in" style={{ background: correct ? 'var(--green-50)' : 'var(--red-50)' }}>
              <strong>{correct ? 'Spot on! 🎉' : 'The answer was:'}</strong> {answer}
              <button className="btn btn-primary" onClick={newPuzzle} style={{ marginTop: 12, width: '100%' }}>Next Puzzle</button>
            </div>
          )}
          {!correct && !revealed && (
             <button className="btn btn-secondary btn-sm" onClick={() => setRevealed(true)} style={{ marginTop: 8, width: '100%' }}>Give Up</button>
          )}
        </>
      )}
    </div>
  );
}

// ===== AI Mystery Riddles (Bored) =====
function MysteryRiddles({ onBack }) {
  const [riddle, setRiddle] = useState('');
  const [answer, setAnswer] = useState('');
  const [guess, setGuess] = useState('');
  const [loading, setLoading] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const fetchRiddle = async () => {
    setLoading(true); setCorrect(false); setRevealed(false); setGuess('');
    try {
      const response = await callGeminiRaw(
        "You are a riddle master.",
        "Generate a clever, unique riddle. Respond ONLY with this exact JSON format: {\"riddle\": \"I speak without a mouth and hear without ears...\", \"answer\": \"echo\"}. Do not use markdown."
      );
      const parsed = JSON.parse(response.replace(/```json/g, '').replace(/```/g, ''));
      setRiddle(parsed.riddle);
      setAnswer(parsed.answer);
    } catch {
      setRiddle("I have keys but no locks. I have space but no room. You can enter but can't go outside. What am I?");
      setAnswer("Keyboard");
    }
    setLoading(false);
  };
  useEffect(() => { fetchRiddle(); }, []);

  const checkGuess = async () => {
    setLoading(true);
    try {
      // Ask Gemini if the guess is close enough
      const response = await callGeminiRaw(
        "You are a judge for a riddle game.",
        `The correct answer is "${answer}". The user guessed "${guess}". Is this correct or very close? Respond with exactly one word: YES or NO.`
      );
      if (response.trim().toUpperCase() === 'YES') {
        setCorrect(true);
        if (onComplete) onComplete();
      } else {
        alert("Not quite! Try thinking outside the box.");
      }
    } catch {
       if (guess.toLowerCase().includes(answer.toLowerCase()) || answer.toLowerCase().includes(guess.toLowerCase())) setCorrect(true);
    }
    setLoading(false);
  };

  return (
    <div className="activity-card fade-in">
       <div className="activity-header">
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><ChevronLeft size={18} /></button>
        <h3 style={{ marginLeft: 8 }}>Mystery Riddles</h3>
      </div>
      
      {loading && !riddle ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}><Loader className="spin" size={24} color="var(--primary-500)" /></div>
      ) : (
        <>
          <div style={{ padding: '20px', background: 'rgba(255,255,255,0.5)', borderRadius: 12, borderLeft: '4px solid var(--primary-400)', fontStyle: 'italic', marginBottom: 16 }}>
            "{riddle}"
          </div>

          {!correct && !revealed ? (
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="input" placeholder="Your answer..." value={guess} onChange={e => setGuess(e.target.value)} onKeyDown={e => e.key === 'Enter' && checkGuess()} style={{ flex: 1 }} />
              <button className="btn btn-primary" onClick={checkGuess} disabled={loading}>{loading ? <Loader className="spin" size={14} /> : 'Guess'}</button>
            </div>
          ) : (
            <div className="game-correct fade-in">
              <strong>{correct ? 'Brilliant! 🧠' : 'The answer was:'}</strong> {answer}
              <button className="btn btn-primary" onClick={fetchRiddle} style={{ marginTop: 12, width: '100%' }}>Next Riddle</button>
            </div>
          )}
           {!correct && !revealed && (
             <button className="btn btn-secondary btn-sm" onClick={() => setRevealed(true)} style={{ marginTop: 8, width: '100%' }}>Show Answer</button>
          )}
        </>
      )}
    </div>
  );
}

// ===== AI Topic Trivia (Bored) =====
function TopicTrivia({ onBack, onComplete }) {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const startQuiz = async () => {
    if (!topic.trim()) return;
    setLoading(true); setQuiz(null); setCurrentQ(0); setScore(0); setGameOver(false);
    try {
      const response = await callGeminiRaw(
        "You are a trivia host.",
        `Generate 3 multiple choice trivia questions about "${topic}". Respond ONLY with this exact JSON format: [{"q": "Question text", "options": ["A", "B", "C", "D"], "answer": "The correct option text exactly as it appears in options array"}]. Do not use markdown.`
      );
      const parsed = JSON.parse(response.replace(/```json/g, '').replace(/```/g, ''));
      setQuiz(parsed);
    } catch {
      alert("Oops! Couldn't generate trivia right now. Try another topic.");
    }
    setLoading(false);
  };

  const handleSelect = (opt) => {
    if (showResult) return;
    setSelectedOpt(opt);
    setShowResult(true);
    if (opt === quiz[currentQ].answer) {
      setScore(s => s + 10);
    }
  };

  const nextQ = () => {
    if (currentQ < quiz.length - 1) {
      setCurrentQ(c => c + 1);
      setShowResult(false);
      setSelectedOpt(null);
    } else {
      setGameOver(true);
      if (onComplete) onComplete();
    }
  };

  return (
    <div className="activity-card fade-in">
       <div className="activity-header">
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><ChevronLeft size={18} /></button>
        <h3 style={{ marginLeft: 8 }}>Topic Trivia</h3>
        {quiz && <span className="game-score" style={{ marginLeft: 'auto' }}><Trophy size={12} /> {score} pts</span>}
      </div>

      {!quiz && !loading && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 16 }}>Enter a topic you want to be quizzed on!</p>
          <input className="input" placeholder="e.g. Space, 90s Music, Animals" value={topic} onChange={e => setTopic(e.target.value)} onKeyDown={e => e.key === 'Enter' && startQuiz()} style={{ width: '100%', marginBottom: 12 }} />
          <button className="btn btn-primary" onClick={startQuiz} style={{ width: '100%' }}>Start Quiz</button>
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Loader className="spin" size={24} color="var(--primary-500)" />
          <p style={{ marginTop: 12, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Generating questions...</p>
        </div>
      )}

      {quiz && !gameOver && (
        <div className="fade-in">
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8 }}>Question {currentQ + 1} of {quiz.length}</p>
          <h4 style={{ fontSize: '1.1rem', marginBottom: 16 }}>{quiz[currentQ].q}</h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {quiz[currentQ].options.map((opt, i) => {
              let bg = 'var(--gray-50)';
              let border = '1px solid var(--gray-200)';
              if (showResult) {
                if (opt === quiz[currentQ].answer) { bg = 'var(--green-50)'; border = '1px solid var(--green-400)'; }
                else if (opt === selectedOpt) { bg = 'var(--red-50)'; border = '1px solid var(--rose-400)'; }
              }
              return (
                <button key={i} onClick={() => handleSelect(opt)} disabled={showResult} style={{ padding: 12, borderRadius: 8, background: bg, border, textAlign: 'left', cursor: showResult ? 'default' : 'pointer' }}>
                  {opt}
                </button>
              );
            })}
          </div>

          {showResult && (
            <button className="btn btn-primary fade-in" onClick={nextQ} style={{ width: '100%', marginTop: 16 }}>
              {currentQ < quiz.length - 1 ? 'Next Question →' : 'See Results'}
            </button>
          )}
        </div>
      )}

      {gameOver && (
        <div className="fade-in" style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>🏆</div>
          <h3 style={{ marginBottom: 8 }}>Quiz Complete!</h3>
          <p style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-500)' }}>You scored {score} points</p>
          <button className="btn btn-secondary" onClick={() => { setQuiz(null); setTopic(''); }} style={{ marginTop: 16, width: '100%' }}>Play Another Topic</button>
        </div>
      )}
    </div>
  );
}

// ===== Mini Games Hub (Bored) =====
function MiniGamesHub({ onComplete }) {
  const [activeGame, setActiveGame] = useState(null);

  if (activeGame === 'word') return <WordGame onBack={() => setActiveGame(null)} onComplete={() => onComplete('Word Scramble')} />;
  if (activeGame === 'emoji') return <EmojiDecoder onBack={() => setActiveGame(null)} onComplete={() => onComplete('Emoji Decoder')} />;
  if (activeGame === 'riddle') return <MysteryRiddles onBack={() => setActiveGame(null)} onComplete={() => onComplete('Mystery Riddles')} />;
  if (activeGame === 'trivia') return <TopicTrivia onBack={() => setActiveGame(null)} onComplete={() => onComplete('Topic Trivia')} />;

  return (
    <div className="activity-card fade-in" style={{ padding: 16 }}>
      <div className="activity-header" style={{ marginBottom: 16 }}>
        <Gamepad2 size={24} style={{ color: 'var(--accent-500)' }} />
        <h2>Mini-Games Hub</h2>
      </div>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
        Bust boredom with these quick AI-powered mini-games.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <button className="game-select-btn" onClick={() => setActiveGame('word')} style={{ padding: 16, borderRadius: 16, border: '2px solid rgba(148,163,184,0.2)', background: 'var(--green-50)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, transition: 'transform 0.2s' }}>
          <Type size={28} color="var(--green-500)" />
          <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#4a5342' }}>Word Scramble</span>
        </button>
        <button className="game-select-btn" onClick={() => setActiveGame('emoji')} style={{ padding: 16, borderRadius: 16, border: '2px solid rgba(148,163,184,0.2)', background: 'var(--amber-50)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, transition: 'transform 0.2s' }}>
          <Smile size={28} color="var(--amber-500)" />
          <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#78350f' }}>Emoji Decoder</span>
        </button>
        <button className="game-select-btn" onClick={() => setActiveGame('riddle')} style={{ padding: 16, borderRadius: 16, border: '2px solid rgba(148,163,184,0.2)', background: 'var(--primary-50)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, transition: 'transform 0.2s' }}>
          <Brain size={28} color="var(--primary-500)" />
          <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e3a8a' }}>Mystery Riddles</span>
        </button>
        <button className="game-select-btn" onClick={() => setActiveGame('trivia')} style={{ padding: 16, borderRadius: 16, border: '2px solid rgba(148,163,184,0.2)', background: '#f3e8ff', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, transition: 'transform 0.2s' }}>
          <HelpCircle size={28} color="#9333ea" />
          <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#581c87' }}>Topic Trivia</span>
        </button>
      </div>
    </div>
  );
}

// ===== Comforting Story (Sad) =====
function StoryReader({ onBack, onComplete }) {
  const [topic, setTopic] = useState('');
  const [story, setStory] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [showMiniScreen, setShowMiniScreen] = useState(false);

  const fetchStory = async () => {
    setLoading(true);
    setHasGenerated(true);
    try {
      const promptAddon = topic ? ` Specifically, weave in this theme or element: "${topic}".` : " Make it about a gentle nature scene.";
      const response = await callGeminiRaw(
        "You are a kind, gentle storyteller.",
        `Tell a comforting, uplifting short story (3-4 paragraphs max) about finding light in a dark place or a small moment of peace.${promptAddon} Make it deeply soothing, sensory-rich, and empathetic. Do not use markdown.`
      );
      setStory(response);
      if (onComplete) onComplete('Comforting Story');
    } catch (e) {
      setStory("Once upon a time, a small seed felt perfectly content resting in the dark, quiet earth, knowing that when it was finally ready, it would bloom beautifully into the sun. Take your time, there is no rush.");
    }
    setLoading(false);
  };

  if (showMiniScreen) {
    return (
      <div className="mini-screen-overlay fade-in">
        <div className="mini-screen-content">
          <button className="mini-screen-back" onClick={() => setShowMiniScreen(false)}>
            <ChevronLeft size={20} /> Back
          </button>
          <div className="mini-screen-story">
            {story}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="activity-card fade-in">
      <div className="activity-header">
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><ChevronLeft size={18} /></button>
        <BookOpen size={20} style={{ color: 'var(--primary-500)', marginLeft: 8 }} />
        <h3>A Comforting Story</h3>
      </div>
      
      {!hasGenerated && !loading && (
        <div style={{ padding: '10px 0' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 16 }}>What would you like your story to be about?</p>
          <input 
            className="input" 
            placeholder="e.g. A brave little bird, A quiet lighthouse, A rainy afternoon" 
            value={topic} 
            onChange={e => setTopic(e.target.value)} 
            onKeyDown={e => e.key === 'Enter' && fetchStory()} 
            style={{ width: '100%', marginBottom: 12 }} 
          />
          <button className="btn btn-primary" onClick={fetchStory} style={{ width: '100%' }}>
            {topic ? 'Write My Story' : 'Surprise Me'}
          </button>
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Loader className="spin" size={32} color="var(--primary-500)" />
          <p style={{ marginTop: 16, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Weaving a gentle tale just for you...</p>
        </div>
      )}

      {hasGenerated && !loading && (
        <div className="fade-in story-reader-expanded">
          <div style={{ 
            padding: '40px', 
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))', 
            borderRadius: '24px', 
            border: '1px solid rgba(148,163,184,0.15)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.04)',
            lineHeight: '2', 
            color: 'var(--text-primary)', 
            whiteSpace: 'pre-wrap',
            fontSize: '1.1rem',
            fontFamily: "'Outfit', sans-serif",
            maxWidth: '800px',
            margin: '0 auto',
            textAlign: 'left'
          }}>
            {story}
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 30, justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => setShowMiniScreen(true)} style={{ maxWidth: '200px', flex: 1 }}>
              <SplitSquareHorizontal size={14} /> Mini Screen
            </button>
            <button className="btn btn-secondary" onClick={() => { setStory(''); setHasGenerated(false); setTopic(''); }} style={{ maxWidth: '200px', flex: 1 }}>
              Read Another Story
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ===== Visual Breathing Bubble (Sad - Calming Game) =====
function CalmingBubble({ onBack, onComplete }) {
  const [phase, setPhase] = useState('Breathe In');
  const [voiceEnabled, setVoiceEnabled] = useState(() => localStorage.getItem('mindoasis_voice_breathing') === 'true');

  const speak = (text) => {
    if (!voiceEnabled) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const cycle = () => {
      setPhase('Breathe In');
      speak('Breathe in');
      setTimeout(() => {
        setPhase('Hold');
        speak('Hold');
        setTimeout(() => {
          setPhase('Breathe Out');
          speak('Breathe out');
          setTimeout(cycle, 4000);
        }, 2000);
      }, 4000);
    };
    cycle();
    return () => window.speechSynthesis.cancel();
  }, [voiceEnabled]);

  return (
    <div className="activity-card fade-in" style={{ textAlign: 'center' }}>
      <div className="activity-header">
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><ChevronLeft size={18} /></button>
        <Wind size={20} style={{ color: 'var(--primary-500)', marginLeft: 8 }} />
        <h3>Gentle Breathing</h3>
        <button 
          onClick={() => {
            const next = !voiceEnabled;
            setVoiceEnabled(next);
            localStorage.setItem('mindoasis_voice_breathing', next);
          }}
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            marginLeft: 'auto',
            color: voiceEnabled ? 'var(--primary-500)' : 'var(--text-muted)'
          }}
        >
          {voiceEnabled ? <Music size={18} /> : <div style={{ opacity: 0.5 }}><Music size={18} /></div>}
        </button>
      </div>
      
      <div style={{ padding: '40px 0', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <div 
          style={{ 
            width: 120, 
            height: 120, 
            borderRadius: '50%', 
            background: 'radial-gradient(circle, var(--primary-100), var(--primary-300))',
            boxShadow: '0 0 40px var(--primary-200)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'white',
            fontWeight: 600,
            fontSize: '1.1rem',
            transition: 'all 4s ease-in-out',
            transform: phase === 'Breathe In' ? 'scale(1.5)' : (phase === 'Hold' ? 'scale(1.5)' : 'scale(1)'),
            opacity: phase === 'Hold' ? 0.8 : 1
          }}
        >
          {phase}
        </div>
      </div>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Follow the bubble. Let your thoughts float away.</p>
    </div>
  );
}

// ===== Scenario Simulation (Sad) =====
function ScenarioSimulation({ onBack, onComplete }) {
  const [scenario, setScenario] = useState('');
  const [loading, setLoading] = useState(false);
  const [simulation, setSimulation] = useState(null);
  const [showReportPopup, setShowReportPopup] = useState(false);

  const startSim = async () => {
    if (!scenario.trim()) return;
    setLoading(true); setSimulation(null);
    try {
      const response = await callGeminiRaw(
        "You are a mindfulness guide.",
        `The user wants to imagine this peaceful scenario: "${scenario}". Write a deeply immersive, sensory-rich 3-paragraph visualization guiding them through this peaceful place. Focus on sights, sounds, and physical sensations of relaxation. Do not use markdown.`
      );
      setSimulation(response);
      if (onComplete) onComplete('Peaceful Escape');
      setShowReportPopup(true);
    } catch {
      alert("Oops! Simulation failed to load. Imagine sitting by a quiet stream instead.");
    }
    setLoading(false);
  };

  return (
    <div className="activity-card fade-in">
      <div className="activity-header">
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><ChevronLeft size={18} /></button>
        <Sparkles size={20} style={{ color: 'var(--primary-500)', marginLeft: 8 }} />
        <h3>Peaceful Escape</h3>
      </div>
      
      {!simulation && !loading && (
        <div style={{ padding: '10px 0' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 16 }}>Where would you like your mind to wander?</p>
          <input className="input" placeholder="e.g. A cozy cabin in the rain, A quiet beach at sunset" value={scenario} onChange={e => setScenario(e.target.value)} onKeyDown={e => e.key === 'Enter' && startSim()} style={{ width: '100%', marginBottom: 12 }} />
          <button className="btn btn-primary" onClick={startSim} style={{ width: '100%' }}>Visualize</button>
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Loader className="spin" size={24} color="var(--primary-500)" />
          <p style={{ marginTop: 12, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Building your peaceful space...</p>
        </div>
      )}

      {simulation && (
        <div className="fade-in">
          <div style={{ padding: '20px', background: 'var(--primary-50)', borderRadius: 12, lineHeight: 1.6, color: 'var(--text-primary)', whiteSpace: 'pre-wrap', fontStyle: 'italic' }}>
            {simulation}
          </div>
          <button className="btn btn-secondary" onClick={() => { setSimulation(null); setScenario(''); }} style={{ marginTop: 16, width: '100%' }}>Go Somewhere Else</button>
        </div>
      )}

      {showReportPopup && (
        <ReportPopup onClose={() => setShowReportPopup(false)} />
      )}
    </div>
  );
}

// ===== Mini Journal (Sad) =====
function MiniJournal({ onBack, onComplete }) {
  return (
    <div className="activity-card fade-in" style={{ textAlign: 'center' }}>
      <div className="activity-header">
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><ChevronLeft size={18} /></button>
        <PenTool size={20} style={{ color: 'var(--primary-500)', marginLeft: 8 }} />
        <h3>Reflection Journal</h3>
      </div>
      <div style={{ padding: '30px 0' }}>
        <p style={{ marginBottom: 20, color: 'var(--text-secondary)' }}>Sometimes the best way to process sadness is to let it out on paper. Head over to your Journal to write freely.</p>
        <button className="btn btn-primary" onClick={() => { 
          if (onComplete) onComplete('Reflection Journal');
          window.location.href = '#/journal';
        }}>Open Full Journal</button>
      </div>
    </div>
  );
}

// ===== Sad Reflection Flow (Sad) =====
function SadReflectionFlow({ activeMood, onComplete }) {
  const [activeActivity, setActiveActivity] = useState(null);

  const AFFIRMATIONS = [
    "You are worthy of love and belonging.",
    "This feeling is temporary. Better days are ahead.",
    "It's okay to not be okay right now. Give yourself grace.",
    "Your feelings are valid, and so are you.",
    "Small steps still move you forward.",
    "Tough times don't last, but tough people do.",
    "You are enough, exactly as you are.",
    "It's brave to feel your emotions fully.",
  ];
  
  const randomAffirmation = useRef(AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)]).current;

  if (activeActivity === 'breath') return <BreathingExercise onBack={() => setActiveActivity(null)} onComplete={() => onComplete('Box Breathing')} />;
  if (activeActivity === 'bubble') return <CalmingBubble onBack={() => setActiveActivity(null)} onComplete={() => onComplete('Calming Bubble')} />;
  if (activeActivity === 'story') return <StoryReader onBack={() => setActiveActivity(null)} onComplete={() => onComplete('Comforting Story')} />;
  if (activeActivity === 'journal') return <MiniJournal onBack={() => setActiveActivity(null)} onComplete={() => onComplete('Reflection Journal')} />;
  if (activeActivity === 'sim') return <ScenarioSimulation onBack={() => setActiveActivity(null)} onComplete={() => onComplete('Peaceful Escape')} />;

  return (
    <div className="activity-card fade-in" style={{ padding: 0, overflow: 'hidden' }}>
      
      {/* Reaffirmation Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--rose-400), var(--primary-400))', color: 'white', padding: '24px 20px', textAlign: 'center' }}>
        <Heart size={28} fill="white" style={{ marginBottom: 12, opacity: 0.9 }} />
        <h3 style={{ fontSize: '1.2rem', marginBottom: 8, color: 'white' }}>I'm sorry you're feeling down.</h3>
        <p style={{ fontSize: '0.95rem', opacity: 0.9, lineHeight: 1.4, maxWidth: '90%', margin: '0 auto' }}>
          "{randomAffirmation}"
        </p>
      </div>

      <div style={{ padding: '20px' }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 16, textAlign: 'center', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>What might help right now?</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button onClick={() => setActiveActivity('breath')} style={{ padding: 16, borderRadius: 12, border: '1px solid var(--primary-100)', background: 'var(--primary-50)', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', transition: 'transform 0.2s', textAlign: 'left' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <Wind size={20} color="var(--primary-500)" />
            </div>
            <div>
              <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)', display: 'block' }}>Box Breathing</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Structured 4-4-4-4 breath cycle.</span>
            </div>
          </button>

          <button onClick={() => setActiveActivity('bubble')} style={{ padding: 16, borderRadius: 12, border: '1px solid var(--green-100)', background: 'var(--green-50)', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', transition: 'transform 0.2s', textAlign: 'left' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <Zap size={20} color="var(--green-500)" />
            </div>
            <div>
              <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)', display: 'block' }}>Calming Bubble</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Watch the gentle bubble expand and contract.</span>
            </div>
          </button>

          <button onClick={() => setActiveActivity('story')} style={{ padding: 16, borderRadius: 12, border: '1px solid var(--amber-100)', background: 'var(--amber-50)', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', transition: 'transform 0.2s', textAlign: 'left' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <BookOpen size={20} color="var(--amber-500)" />
            </div>
            <div>
              <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)', display: 'block' }}>Read a Story</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>A short, uplifting AI-generated tale.</span>
            </div>
          </button>

          <button onClick={() => setActiveActivity('journal')} style={{ padding: 16, borderRadius: 12, border: '1px solid var(--rose-100)', background: 'var(--rose-50)', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', transition: 'transform 0.2s', textAlign: 'left' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <PenTool size={20} color="var(--rose-400)" />
            </div>
            <div>
              <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)', display: 'block' }}>Reflection Journal</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Write out your feelings to process them.</span>
            </div>
          </button>

          <button onClick={() => setActiveActivity('sim')} style={{ padding: 16, borderRadius: 12, border: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', transition: 'transform 0.2s', textAlign: 'left' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <Sparkles size={20} color="#64748b" />
            </div>
            <div>
              <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)', display: 'block' }}>Peaceful Escape</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>A guided visualization of a serene place.</span>
            </div>
          </button>

        </div>
      </div>
    </div>
  );
}

// ===== Focus Challenge (Excited) =====
function FocusChallenge() {
  const [targetColor, setTargetColor] = useState('');
  const [colors, setColors] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState({ show: false, message: '', index: null });
  const timerRef = useRef(null);

  const GAME_COLORS = [
    { name: 'Red', hex: 'var(--rose-500)' },
    { name: 'Crimson', hex: '#dc143c' },
    { name: 'Blue', hex: '#3b82f6' },
    { name: 'Navy', hex: '#1e3a8a' },
    { name: 'Green', hex: 'var(--green-500)' },
    { name: 'Lime', hex: '#84cc16' },
    { name: 'Yellow', hex: 'var(--amber-400)' },
    { name: 'Orange', hex: '#f97316' },
    { name: 'Brown', hex: '#78350f' },
    { name: 'Pink', hex: 'var(--rose-400)' },
    { name: 'Purple', hex: '#a855f7' },
    { name: 'Indigo', hex: '#4f46e5' },
    { name: 'Teal', hex: 'var(--primary-500)' },
    { name: 'Cyan', hex: '#06b6d4' },
    { name: 'Gray', hex: '#64748b' },
  ];

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setIsPlaying(true);
    setGameOver(false);
    newRound(0);
  };

  const endGame = () => {
    setIsPlaying(false);
    setGameOver(true);
    clearInterval(timerRef.current);
    if (onComplete) onComplete('Focus Challenge');
  };

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      timerRef.current = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      endGame();
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, timeLeft]);

  const newRound = useCallback((currentScore) => {
    const target = GAME_COLORS[Math.floor(Math.random() * GAME_COLORS.length)];
    // Dynamic difficulty: start with 4 grid, then 6, then 9
    const gridCount = currentScore > 15 ? 9 : (currentScore > 5 ? 6 : 4);
    
    const wrongColors = GAME_COLORS.filter(c => c.name !== target.name)
      .sort(() => Math.random() - 0.5)
      .slice(0, gridCount - 1);
      
    const options = [...wrongColors, target].sort(() => Math.random() - 0.5);
    setTargetColor(target);
    setColors(options);
  }, []);

  const handlePick = (color, index) => {
    if (!isPlaying) return;
    if (color.name === targetColor.name) {
      const newScore = score + 1;
      setScore(newScore);
      newRound(newScore);
      setFeedback({ show: false, message: '', index: null });
    } else {
      const messages = ["Oops! Not that one! 💫", "Almost had it! Try again! ✨", "Wrong color, but keep going! 🚀", "Stay sharp! You got this! 🎯"];
      setFeedback({ 
        show: true, 
        message: messages[Math.floor(Math.random() * messages.length)],
        index: index
      });
      setTimeout(() => setFeedback(prev => prev.index === index ? { show: false, message: '', index: null } : prev), 1000);
      setTimeLeft(t => Math.max(0, t - 3)); // Penalty
    }
  };

  return (
    <div className="activity-card fade-in">
      <div className="activity-header">
        <Palette size={20} style={{ color: 'var(--accent-500)' }} />
        <h3>Speed Color Match</h3>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
          <span className="game-score"><Clock size={12} color={timeLeft <= 5 ? 'var(--rose-500)' : 'inherit'} /> {timeLeft}s</span>
          <span className="game-score"><Star size={12} /> {score}</span>
        </div>
      </div>
      <p className="activity-desc">Find the matching color fast! Wrong picks cost 3 seconds.</p>
      
      {!isPlaying && !gameOver ? (
        <div style={{ textAlign: 'center', padding: '30px 0' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>⏱️</div>
          <p style={{ marginBottom: 20 }}>You have 30 seconds. How many can you match?</p>
          <button className="btn btn-primary" onClick={startGame} style={{ width: '100%' }}>Start Challenge</button>
        </div>
      ) : gameOver ? (
        <div className="fade-in" style={{ textAlign: 'center', padding: '30px 0' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>🎯</div>
          <h3>Time's Up!</h3>
          <p style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-500)', marginTop: 8 }}>Final Score: {score}</p>
          <button className="btn btn-primary" onClick={startGame} style={{ marginTop: 20, width: '100%' }}>Play Again</button>
        </div>
      ) : (
        <div className="fade-in">
          <div style={{ textAlign: 'center', margin: '16px 0' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: 'Outfit', color: 'var(--text-primary)' }}>
              Find: <span style={{ color: targetColor.hex }}>{targetColor.name}</span>
            </span>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: `repeat(${colors.length === 4 ? 2 : 3}, 1fr)`, 
            gap: 12 
          }}>
            {colors.map((color, i) => (
              <button
                key={`${color.name}-${i}`}
                style={{ 
                  background: color.hex, 
                  height: colors.length === 9 ? 70 : 90, 
                  borderRadius: 16, 
                  border: 'none', 
                  cursor: 'pointer',
                  position: 'relative',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transition: 'transform 0.1s, filter 0.2s',
                  overflow: 'hidden'
                }}
                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                onClick={() => handlePick(color, i)}
              >
                 {feedback.show && feedback.index === i && (
                  <div className="game-feedback-overlay fade-in" style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(244, 63, 94, 0.8)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    padding: 8,
                    textAlign: 'center'
                  }}>
                    <X size={24} strokeWidth={3} />
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, marginTop: 4 }}>{feedback.message}</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ===== AI Clarity Chat (Confused) =====
function ClarityChat({ onBack, onComplete }) {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "It's completely okay to feel confused. What's on your mind? I'm here to help untangle things." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const messageCount = useRef(0);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(p => [...p, { role: 'user', text: userMsg }]);
    setLoading(true);
    messageCount.current += 1;

    try {
      const historyMsg = messages.map(m => `${m.role === 'ai' ? 'MindOasis' : 'User'}: ${m.text}`).join('\n');
      const prompt = `You are MindOasis AI, helping someone who is feeling confused. Keep your responses short (under 3 or 4 sentences), extremely empathetic, and guide them to clarity by asking gentle, probing questions. \n\nChat History:\n${historyMsg}\nUser: ${userMsg}\n\nMindOasis:`;
      
      const response = await callGeminiRaw(
        "You are MindOasis AI, a mental wellness companion helping a confused user find clarity. Be conversational, warm, and concise.",
        prompt
      );
      
      setMessages(p => [...p, { role: 'ai', text: response }]);
      if (messageCount.current >= 3) { // Trigger reflection after 3 messages
        onComplete();
      }
    } catch (e) {
      setMessages(p => [...p, { role: 'ai', text: "I'm having a little trouble connecting right now, but I'm still here for you. Try taking a deep breath and writing down your thoughts." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="activity-card fade-in" style={{ padding: 0, display: 'flex', flexDirection: 'column', height: 400 }}>
      <div className="activity-header" style={{ padding: '20px 20px 0 20px', marginBottom: 12 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><ChevronLeft size={18} /></button>
        <MessageCircle size={20} style={{ color: 'var(--accent-500)', marginLeft: 8 }} />
        <h3>Clarity Chat</h3>
      </div>
      
      <div 
        ref={scrollRef}
        style={{ flex: 1, overflowY: 'auto', padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 12 }}
      >
        {messages.map((m, i) => (
          <div 
            key={i} 
            style={{
              alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
              background: m.role === 'user' ? 'var(--accent-400)' : '#fdfafa',
              color: m.role === 'user' ? 'white' : 'var(--text-primary)',
              padding: '10px 14px',
              borderRadius: '16px',
              borderBottomLeftRadius: m.role === 'ai' ? 4 : 16,
              borderBottomRightRadius: m.role === 'user' ? 4 : 16,
              maxWidth: '85%',
              border: m.role === 'ai' ? '1px solid var(--gray-200)' : 'none',
              fontSize: '0.9rem',
              lineHeight: 1.5,
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}
          >
            {m.text}
          </div>
        ))}
        {loading && (
          <div style={{ alignSelf: 'flex-start', padding: 10 }}>
            <Loader className="spin" size={16} color="var(--accent-400)" />
          </div>
        )}
      </div>

      <div style={{ padding: '16px 20px', borderTop: '1px solid var(--gray-200)', display: 'flex', gap: 8 }}>
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="I'm unsure about..."
          style={{
            flex: 1,
            padding: '10px 16px',
            borderRadius: 20,
            border: '1px solid var(--gray-200)',
            background: '#fdfafa',
            outline: 'none',
            fontSize: '0.9rem',
            fontFamily: 'Inter'
          }}
        />
        <button 
          onClick={handleSend}
          disabled={loading || !input.trim()}
          style={{
            background: 'var(--accent-500)',
            color: 'white',
            border: 'none',
            width: 40,
            height: 40,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            opacity: loading || !input.trim() ? 0.6 : 1
          }}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}

// ===== Pros & Cons Analyzer (Confused) =====
function ProsConsAnalyzer({ onBack, onComplete }) {
  const [decision, setDecision] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const analyze = async () => {
    if (!decision.trim()) return;
    setLoading(true); setAnalysis(null);
    try {
      const response = await callGeminiRaw(
        "You are an objective decision analyzer.",
        `The user is struggling with this decision: "${decision}". Generate an objective list of 3 Pros, 3 Cons, and 1 'Different Perspective' (a gentle reframing of the problem). Respond ONLY with this exact JSON format: {"pros": ["..."], "cons": ["..."], "perspective": "..."}. Do not use markdown.`
      );
      const parsed = JSON.parse(response.replace(/```json/g, '').replace(/```/g, ''));
      setAnalysis(parsed);
      onComplete(); // Trigger reflection on successful analysis
    } catch {
      alert("Oops! Couldn't analyze right now. Keep breathing, you'll figure it out.");
    }
    setLoading(false);
  };

  return (
    <div className="activity-card fade-in">
      <div className="activity-header">
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><ChevronLeft size={18} /></button>
        <SplitSquareHorizontal size={20} style={{ color: 'var(--accent-500)', marginLeft: 8 }} />
        <h3>Pros & Cons Analyzer</h3>
      </div>
      <p className="activity-desc">Let's look at this decision objectively.</p>

      {!analysis && !loading && (
        <div style={{ padding: '10px 0' }}>
          <textarea className="input" placeholder="What are you trying to decide? e.g. 'Should I change my major?'" value={decision} onChange={e => setDecision(e.target.value)} style={{ width: '100%', minHeight: 80, marginBottom: 12, resize: 'none' }} />
          <button className="btn btn-primary" onClick={analyze} style={{ width: '100%' }}>Analyze Decision</button>
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Loader className="spin" size={24} color="var(--accent-500)" />
          <p style={{ marginTop: 12, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Weighing the options...</p>
        </div>
      )}

      {analysis && (
        <div className="fade-in">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div style={{ background: 'var(--green-50)', padding: 12, borderRadius: 12, border: '1px solid var(--green-200)' }}>
              <h4 style={{ color: 'var(--green-600)', marginBottom: 8, fontSize: '0.9rem' }}>✅ Pros</h4>
              <ul style={{ paddingLeft: 16, margin: 0, fontSize: '0.85rem', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {analysis.pros.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
            <div style={{ background: 'var(--rose-50)', padding: 12, borderRadius: 12, border: '1px solid var(--rose-200)' }}>
              <h4 style={{ color: 'var(--rose-600)', marginBottom: 8, fontSize: '0.9rem' }}>❌ Cons</h4>
              <ul style={{ paddingLeft: 16, margin: 0, fontSize: '0.85rem', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {analysis.cons.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>
          </div>
          <div style={{ background: 'var(--primary-50)', padding: 16, borderRadius: 12, borderLeft: '4px solid var(--primary-400)' }}>
            <h4 style={{ color: 'var(--primary-600)', marginBottom: 6, fontSize: '0.85rem' }}>💡 A Different Perspective</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>{analysis.perspective}</p>
          </div>
          <button className="btn btn-secondary" onClick={() => { setAnalysis(null); setDecision(''); }} style={{ marginTop: 16, width: '100%' }}>Analyze Another Decision</button>
        </div>
      )}
    </div>
  );
}

// ===== Task Step Breakdown (Confused) =====
function StepBreakdown({ onBack, onComplete }) {
  const [task, setTask] = useState('');
  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState(null);
  const [checked, setChecked] = useState([false, false, false]);

  const breakdown = async () => {
    if (!task.trim()) return;
    setLoading(true); setSteps(null); setChecked([false, false, false]);
    try {
      const response = await callGeminiRaw(
        "You are an empathetic productivity coach.",
        `The user is overwhelmed by this task: "${task}". Break it down into 3 extremely tiny, achievable micro-steps to help them gain momentum. Respond ONLY with a JSON array of 3 strings: ["step 1", "step 2", "step 3"]. Do not use markdown.`
      );
      const parsed = JSON.parse(response.replace(/```json/g, '').replace(/```/g, ''));
      setSteps(parsed);
    } catch {
      alert("Oops! Breakdown failed. Maybe try focusing on just writing the first word or making a physical list.");
    }
    setLoading(false);
  };

  const toggleCheck = (idx) => {
    const newChecked = [...checked];
    newChecked[idx] = !newChecked[idx];
    setChecked(newChecked);
    if (newChecked.every(c => c)) {
      onComplete(); // Trigger reflection when all steps are checked
    }
  };

  return (
    <div className="activity-card fade-in">
      <div className="activity-header">
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><ChevronLeft size={18} /></button>
        <ListChecks size={20} style={{ color: 'var(--accent-500)', marginLeft: 8 }} />
        <h3>Step Breakdown</h3>
      </div>
      <p className="activity-desc">Let's cut this big thought into 3 tiny, bite-sized pieces.</p>

      {!steps && !loading && (
        <div style={{ padding: '10px 0' }}>
          <input className="input" placeholder="What feels overwhelming right now?" value={task} onChange={e => setTask(e.target.value)} onKeyDown={e => e.key === 'Enter' && breakdown()} style={{ width: '100%', marginBottom: 12 }} />
          <button className="btn btn-primary" onClick={breakdown} style={{ width: '100%' }}>Break it down</button>
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Loader className="spin" size={24} color="var(--accent-500)" />
          <p style={{ marginTop: 12, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Simplifying things...</p>
        </div>
      )}

      {steps && (
        <div className="fade-in">
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 16 }}>Here is a gentle starting path for "{task}":</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {steps.map((s, i) => (
              <label key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 16, background: checked[i] ? 'var(--green-50)' : 'rgba(255,255,255,0.6)', border: `1px solid ${checked[i] ? 'var(--green-200)' : 'var(--gray-200)'}`, borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s' }}>
                <input type="checkbox" checked={checked[i]} onChange={() => toggleCheck(i)} style={{ width: 18, height: 18, accentColor: 'var(--green-500)', marginTop: 2 }} />
                <span style={{ fontSize: '0.9rem', color: checked[i] ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: checked[i] ? 'line-through' : 'none', lineHeight: 1.4 }}>{s}</span>
              </label>
            ))}
          </div>
          {checked.every(c => c) && (
            <div className="fade-in" style={{ textAlign: 'center', marginTop: 16, color: 'var(--green-500)', fontWeight: 600 }}>
              🎉 You did it! See? Not so scary.
            </div>
          )}
          <button className="btn btn-secondary" onClick={() => { setSteps(null); setTask(''); }} style={{ marginTop: 20, width: '100%' }}>Break Down Another Task</button>
        </div>
      )}
    </div>
  );
}

// ===== Clarity Hub (Confused) =====
function ClarityHub({ activeMood, onComplete }) {
  const [activeTool, setActiveTool] = useState(null);

  if (activeTool === 'chat') return <ClarityChat onBack={() => setActiveTool(null)} onComplete={() => onComplete('Clarity Chat')} />;
  if (activeTool === 'proscons') return <ProsConsAnalyzer onBack={() => setActiveTool(null)} onComplete={() => onComplete('Pros & Cons Analyzer')} />;
  if (activeTool === 'steps') return <StepBreakdown onBack={() => setActiveTool(null)} onComplete={() => onComplete('Step Breakdown')} />;

  return (
    <div className="activity-card fade-in" style={{ padding: 16 }}>
      <div className="activity-header" style={{ marginBottom: 16 }}>
        <Layers size={24} style={{ color: 'var(--accent-500)' }} />
        <h2>Clarity Toolkit</h2>
      </div>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
        When things feel tangled, pick a tool to help sort them out.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
        <button onClick={() => setActiveTool('chat')} style={{ padding: '16px 20px', borderRadius: 16, border: '2px solid rgba(148,163,184,0.2)', background: 'var(--accent-50)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16, transition: 'transform 0.2s', textAlign: 'left' }}>
          <MessageCircle size={28} color="var(--accent-500)" style={{ flexShrink: 0 }} />
          <div>
            <span style={{ fontWeight: 600, fontSize: '0.95rem', color: '#68594b', display: 'block', marginBottom: 2 }}>Clarity Chat</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Talk it out with an empathetic AI listener.</span>
          </div>
        </button>
        
        <button onClick={() => setActiveTool('proscons')} style={{ padding: '16px 20px', borderRadius: 16, border: '2px solid rgba(148,163,184,0.2)', background: 'var(--rose-50)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16, transition: 'transform 0.2s', textAlign: 'left' }}>
          <SplitSquareHorizontal size={28} color="var(--rose-400)" style={{ flexShrink: 0 }} />
          <div>
            <span style={{ fontWeight: 600, fontSize: '0.95rem', color: '#7e2d3e', display: 'block', marginBottom: 2 }}>Pros & Cons</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Struggling with a choice? Weigh the options.</span>
          </div>
        </button>
        
        <button onClick={() => setActiveTool('steps')} style={{ padding: '16px 20px', borderRadius: 16, border: '2px solid rgba(148,163,184,0.2)', background: 'var(--green-50)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16, transition: 'transform 0.2s', textAlign: 'left' }}>
          <ListChecks size={28} color="var(--green-500)" style={{ flexShrink: 0 }} />
          <div>
            <span style={{ fontWeight: 600, fontSize: '0.95rem', color: '#33482a', display: 'block', marginBottom: 2 }}>Step Breakdown</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Cut an overwhelming task into 3 tiny pieces.</span>
          </div>
        </button>
      </div>
    </div>
  );
}

// ===== Daily Micro-Goals (Neutral) =====
function DailyMicroGoals({ activeMood, onComplete }) {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState({});

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const response = await callGeminiRaw(
        "You are a productivity and wellness coach.",
        "Suggest 3 tiny, achievable micro-goals for today across 3 categories: Physical, Mindful, and Productive. Each goal should take less than 5 minutes. Respond with ONLY a JSON array of strings, like [\"Stretch for 2 mins\", \"Drink a glass of water\", \"Clear 5 emails\"]. No markdown."
      );
      const parsed = JSON.parse(response.replace(/```json/g, '').replace(/```/g, ''));
      setGoals(parsed);
      setCompleted({});
    } catch {
      setGoals(["Take three deep breaths", "Stretch your arms", "Drink some water"]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const toggleComplete = (idx) => {
    setCompleted(prev => {
      const newCompleted = { ...prev, [idx]: !prev[idx] };
      if (Object.keys(newCompleted).length === goals.length && Object.values(newCompleted).every(Boolean)) {
        onComplete('Daily Micro-Goals');
      }
      return newCompleted;
    });
  };

  return (
    <div className="activity-card fade-in">
      <div className="activity-header">
        <ListChecks size={20} style={{ color: 'var(--primary-500)' }} />
        <h3>Daily Micro-Goals</h3>
      </div>
      <p className="activity-desc">Small wins build momentum. Try these today:</p>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '30px 0' }}>
          <Loader className="spin" size={24} color="var(--primary-500)" />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: '16px 0' }}>
          {goals.map((goal, i) => (
            <div 
              key={i} 
              onClick={() => toggleComplete(i)}
              style={{ 
                padding: '12px 16px', 
                background: completed[i] ? 'var(--green-50)' : 'var(--gray-50)', 
                borderRadius: 12, 
                border: completed[i] ? '2px solid var(--green-300)' : '1px solid var(--gray-200)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ 
                width: 20, 
                height: 20, 
                borderRadius: '50%', 
                border: '2px solid',
                borderColor: completed[i] ? 'var(--green-500)' : 'var(--gray-300)',
                background: completed[i] ? 'var(--green-500)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {completed[i] && <Check size={12} color="white" />}
              </div>
              <span style={{ 
                fontSize: '0.95rem', 
                fontWeight: 600, 
                textDecoration: completed[i] ? 'line-through' : 'none',
                color: completed[i] ? 'var(--green-700)' : 'var(--text-primary)'
              }}>
                {goal}
              </span>
            </div>
          ))}
        </div>
      )}

      {Object.keys(completed).length === goals.length && goals.length > 0 && (
         <div className="fade-in" style={{ textAlign: 'center', padding: '10px', color: 'var(--green-600)', fontWeight: 600 }}>
           🎉 You're on fire today!
         </div>
      )}
      
      <button className="btn btn-secondary btn-sm" onClick={fetchGoals} style={{ width: '100%', marginTop: 10 }}>
        Refresh Goals
      </button>
    </div>
  );
}

// ===== Goal Tracker (Neutral) =====
function GoalTracker() {
  const [newGoal, setNewGoal] = useState('');
  const [myGoals, setMyGoals] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mindoasis_user_goals')) || []; } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('mindoasis_user_goals', JSON.stringify(myGoals));
  }, [myGoals]);

  const addGoal = () => {
    if (!newGoal.trim()) return;
    setMyGoals([...myGoals, { id: Date.now(), text: newGoal.trim(), done: false }]);
    setNewGoal('');
  };

  const toggleGoal = (id) => {
    setMyGoals(myGoals.map(g => g.id === id ? { ...g, done: !g.done } : g));
  };

  const deleteGoal = (id) => {
    setMyGoals(myGoals.filter(g => g.id !== id));
  };

  return (
    <div className="activity-card fade-in" style={{ marginTop: 20 }}>
      <div className="activity-header">
        <Trophy size={20} style={{ color: 'var(--amber-500)' }} />
        <h3>My Goal Tracker</h3>
      </div>
      <p className="activity-desc">What do you want to achieve today?</p>

      <div style={{ display: 'flex', gap: 8, margin: '16px 0' }}>
        <input 
          className="input" 
          placeholder="Add a custom goal..." 
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addGoal()}
          style={{ flex: 1 }}
        />
        <button className="btn btn-primary" onClick={addGoal}>Add</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {myGoals.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', padding: 10 }}>No custom goals yet.</p>
        ) : (
          myGoals.map(goal => (
            <div key={goal.id} className="fade-in" style={{ 
              padding: '12px', 
              background: 'white', 
              borderRadius: 12, 
              border: '1px solid var(--gray-200)',
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}>
              <input 
                type="checkbox" 
                checked={goal.done} 
                onChange={() => toggleGoal(goal.id)}
                style={{ cursor: 'pointer', width: 18, height: 18, accentColor: 'var(--primary-500)' }}
              />
              <span style={{ 
                flex: 1, 
                fontSize: '0.9rem', 
                textDecoration: goal.done ? 'line-through' : 'none',
                color: goal.done ? 'var(--text-muted)' : 'var(--text-primary)'
              }}>
                {goal.text}
              </span>
              <button onClick={() => deleteGoal(goal.id)} style={{ background: 'none', border: 'none', color: 'var(--rose-400)', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ===== Gratitude Jar (Neutral) =====
function GratitudeJar() {
  const [text, setText] = useState('');
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mindoasis_gratitude')) || []; } catch { return []; }
  });
  const [isAdding, setIsAdding] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const add = () => {
    if (!text.trim()) return;
    setIsAdding(true);
    setShowConfetti(true);
    
    setTimeout(() => {
      const newItems = [{ id: Date.now(), text: text.trim(), date: new Date().toLocaleDateString() }, ...items];
      setItems(newItems);
      localStorage.setItem('mindoasis_gratitude', JSON.stringify(newItems));
      setText('');
      setIsAdding(false);
      if (onComplete) onComplete();
    }, 600);

    setTimeout(() => setShowConfetti(false), 3000);
  };

  const removeItem = (idToRemove) => {
    const newItems = items.filter(item => item.id !== idToRemove && item.date !== idToRemove); // fallback for old items without id
    setItems(newItems);
    localStorage.setItem('mindoasis_gratitude', JSON.stringify(newItems));
  };

  // Visual fill is capped at 100%, but items array is infinite
  const visualItemCount = Math.min(items.length, 10);
  const fillLevel = Math.min(items.length * 10, 100);
  const EMOJI_COLORS = ['#ffedd5', '#fee2e2', '#f0fdf4', '#eff6ff', '#faf5ff', '#fff7ed'];

  return (
    <div className="activity-card gratitude-container">
      <div className="activity-header">
        <Star size={20} style={{ color: 'var(--amber-500)' }} />
        <h3>Gratitude Jar</h3>
      </div>
      
      {/* Visual Jar */}
      <div className="jar-visual-container">
        <div className={`jar-glow ${isAdding ? 'active' : ''}`} />
        <svg className="gratitude-jar-svg" viewBox="0 0 100 120">
          <defs>
            <linearGradient id="jarFill" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--amber-300)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="var(--amber-500)" stopOpacity="0.6" />
            </linearGradient>
            <clipPath id="jarPath">
              <path d="M30,10 Q30,5 35,5 L65,5 Q70,5 70,10 L70,25 Q90,35 90,70 L90,100 Q90,115 75,115 L25,115 Q10,115 10,100 L10,70 Q10,35 30,25 Z" />
            </clipPath>
          </defs>
          
          {/* Jar Outline */}
          <path className="jar-outline" d="M30,10 Q30,5 35,5 L65,5 Q70,5 70,10 L70,25 Q90,35 90,70 L90,100 Q90,115 75,115 L25,115 Q10,115 10,100 L10,70 Q10,35 30,25 Z" fill="rgba(255,255,255,0.4)" stroke="var(--primary-300)" strokeWidth="2" />
          
          {/* Jar Fill Level */}
          <rect 
            x="0" 
            y={115 - (fillLevel * 0.9)} 
            width="100" 
            height="120" 
            fill="url(#jarFill)" 
            clipPath="url(#jarPath)" 
            style={{ transition: 'y 1s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
          />
          
          {/* Sparkles inside jar (capped visually) */}
          {[...Array(visualItemCount)].map((_, i) => (
            <circle 
              key={i} 
              cx={20 + Math.random() * 60} 
              cy={110 - Math.random() * (fillLevel * 0.8)} 
              r={1 + Math.random() * 2} 
              fill="white" 
              className="jar-sparkle"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </svg>

        {showConfetti && (
          <div className="confetti-container">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="confetti-piece" style={{ 
                '--color': EMOJI_COLORS[i % EMOJI_COLORS.length],
                '--x': `${(Math.random() - 0.5) * 200}px`,
                '--y': `${-100 - Math.random() * 100}px`,
                '--rotate': `${Math.random() * 360}deg`
              }} />
            ))}
          </div>
        )}
      </div>

      <p className="activity-desc" style={{ textAlign: 'center', marginTop: 10 }}>Capture moments of gratitude. You have {items.length} entries.</p>
      
      <div style={{ display: 'flex', gap: 8, margin: '16px 0' }}>
        <input
          className="input"
          placeholder="I'm grateful for..."
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
          disabled={isAdding}
          style={{ borderRadius: 20 }}
        />
        <button className="btn btn-success" onClick={add} disabled={isAdding || !text.trim()} style={{ borderRadius: 20, padding: '10px 24px' }}>
          {isAdding ? <Loader className="spin" size={16} /> : 'Add'}
        </button>
      </div>

      <div className="gratitude-items-scroll">
        {items.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', padding: 20 }}>
            ✨ Your jar is waiting for its first spark...
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {items.map((item, i) => (
              <div key={item.id || item.date + i} className="gratitude-card-item fade-in" style={{ animationDelay: `${Math.min(i, 5) * 0.1}s`, position: 'relative', paddingRight: 40 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{item.text}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.date}</span>
                </div>
                <button 
                  onClick={() => removeItem(item.id || item.date)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--rose-400)', cursor: 'pointer', padding: 4 }}
                  title="Remove entry"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ===== Neutral Hub (Neutral) =====
function NeutralHub({ activeMood, onComplete }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <DailyMicroGoals activeMood={activeMood} onComplete={onComplete} />
      <GoalTracker />
      <GratitudeJar onComplete={onComplete} />
    </div>
  );
}

// ===== Main Activity Map =====
const MOOD_ACTIVITIES = {
  Stressed: {
    emoji: '😰',
    title: "Let's calm your mind",
    color: 'var(--primary-400)',
    bg: 'var(--primary-50)',
    activities: [StressedHub],
    quickTips: ['Take 3 slow deep breaths', 'Step outside for fresh air', 'Stretch your shoulders and neck'],
  },
  Anxious: {
    emoji: '😟',
    title: "Let's ground you in the present",
    color: 'var(--amber-400)',
    bg: 'var(--amber-50)',
    activities: [AnxiousHub],
    quickTips: ['Hold something cold', 'Name objects around you', 'Listen to nature sounds'],
  },
  Sad: {
    emoji: '😢',
    title: 'You deserve some kindness',
    color: 'var(--rose-400)',
    bg: 'var(--rose-50)',
    activities: [SadReflectionFlow],
    quickTips: ['Listen to your favorite song', 'Reach out to someone who cares', 'Wrap yourself in a cozy blanket'],
  },
  Excited: {
    emoji: '🤩',
    title: "Let's channel that energy!",
    color: 'var(--rose-400)',
    bg: 'var(--rose-50)',
    activities: [FocusChallenge],
    quickTips: ['Set a fun goal for today', 'Message a friend', 'Do a quick joyful dance'],
  },
  Confused: {
    emoji: '😵‍💫',
    title: "Let's find some clarity",
    color: 'var(--accent-400)',
    bg: 'var(--accent-50)',
    activities: [ClarityHub],
    quickTips: ['Write down your thoughts', 'Take a short walk to clear your head', 'Break the problem into smaller parts'],
  },
  Bored: {
    emoji: '😑',
    title: 'Time for some fun!',
    color: 'var(--green-400)',
    bg: 'var(--green-50)',
    activities: [MiniGamesHub],
    quickTips: ['Try a new mini-game', 'Learn a random pop culture fact', 'Challenge yourself to get 5 correct'],
  },
  Neutral: {
    emoji: '😊',
    title: 'Great vibes! Keep it going',
    color: 'var(--green-500)',
    bg: 'var(--green-50)',
    activities: [NeutralHub],
    quickTips: ['Capture this positive moment', 'Share a compliment with someone', 'Set a small goal for today'],
  },
};

export default function MoodActivities({ mood }) {
  const [activeActivity, setActiveActivity] = useState(0);
  const [showReflection, setShowReflection] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState(Date.now());
  const [lastReflectedActivity, setLastReflectedActivity] = useState(null);

  const config = MOOD_ACTIVITIES[mood];
  if (!config) return null;

  useEffect(() => {
    // Session Timer Trigger (> 3 minutes)
    const timer = setInterval(() => {
      const elapsed = (Date.now() - sessionStartTime) / 1000;
      if (elapsed > 180 && !showReflection && !lastReflectedActivity) { 
        triggerReflection('Engagement');
      }
    }, 10000);
    return () => clearInterval(timer);
  }, [sessionStartTime, showReflection, lastReflectedActivity]);

  const triggerReflection = (activityName) => {
    const settings = JSON.parse(localStorage.getItem('mindoasis_reflection_settings') || '{"skips": 0, "lastSkip": 0}');
    const now = Date.now();
    if (settings.skips >= 2 && (now - settings.lastSkip) < 3600000) return;

    setLastReflectedActivity(activityName);
    setShowReflection(true);
  };

  const handleReflectionComplete = () => {
    setShowReflection(false);
    setLastReflectedActivity(null);
    setSessionStartTime(Date.now());
    localStorage.setItem('mindoasis_reflection_settings', JSON.stringify({ skips: 0, lastSkip: 0 }));
  };

  const handleReflectionSkip = () => {
    setShowReflection(false);
    setLastReflectedActivity(null);
    setSessionStartTime(Date.now());
    const settings = JSON.parse(localStorage.getItem('mindoasis_reflection_settings') || '{"skips": 0, "lastSkip": 0}');
    localStorage.setItem('mindoasis_reflection_settings', JSON.stringify({ 
      skips: settings.skips + 1, 
      lastSkip: Date.now() 
    }));
  };

  const ActivityComponent = config.activities[activeActivity];

  return (
    <div className="mood-activities-container fade-in">
      <div className="mood-activities-header" style={{ background: config.bg, borderColor: config.color }}>
        <span style={{ fontSize: '2rem' }}>{config.emoji}</span>
        <div>
          <h2 style={{ fontSize: '1.2rem', marginBottom: 2 }}>{config.title}</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Something that might help</p>
        </div>
        <Sparkles size={20} style={{ color: config.color, marginLeft: 'auto' }} />
      </div>

      <div className="mood-activities-grid">
        <ActivityComponent 
          activeMood={mood}
          onBack={() => {}} 
          onComplete={triggerReflection}
        />
        
        <div className="activity-card quick-tips-card">
          <div className="activity-header">
            <Zap size={18} style={{ color: config.color }} />
            <h3>Quick Tips</h3>
          </div>
          <div className="quick-tips-list">
            {config.quickTips.map((tip, i) => (
              <div key={i} className="quick-tip-item">
                <Check size={14} style={{ color: config.color, flexShrink: 0 }} />
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showReflection && (
        <SmartReflection 
          moodSelected={mood}
          activityUsed={lastReflectedActivity || 'Wellness Activity'}
          onComplete={handleReflectionComplete}
          onSkip={handleReflectionSkip}
        />
      )}
    </div>
  );
}
