import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Wind, Gamepad2, Palette, Music, Dumbbell, MessageCircle,
  Sparkles, Heart, Zap, RefreshCw, Trophy, Star, Check, Send, Loader
} from 'lucide-react';
import { callGeminiRaw } from '../services/gemini';

// ===== Breathing Exercise (Stressed) =====
function BreathingExercise() {
  const [phase, setPhase] = useState('idle'); // idle | inhale | hold | exhale
  const [count, setCount] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

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
            if (p === 'inhale') { return 'hold'; }
            if (p === 'hold') { return 'exhale'; }
            setCycles(c => c + 1);
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
    <div className="activity-card">
      <div className="activity-header">
        <Wind size={20} style={{ color: 'var(--primary-500)' }} />
        <h3>Box Breathing Exercise</h3>
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
      
      <button className={`btn ${running ? 'btn-secondary' : 'btn-primary'}`} onClick={running ? stop : start} style={{ width: '100%' }}>
        {running ? 'Stop' : 'Start Breathing'}
      </button>
    </div>
  );
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
    else setDone(true);
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

function WordGame() {
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
    }
  };

  const nextWord = () => {
    setWordIdx(i => (i + 1) % WORD_SETS.length);
  };

  return (
    <div className="activity-card">
      <div className="activity-header">
        <Gamepad2 size={20} style={{ color: 'var(--accent-500)' }} />
        <h3>Word Scramble</h3>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
          <span className="game-score"><Trophy size={12} /> {score} pts</span>
          {streak > 1 && <span className="game-streak"><Zap size={12} /> {streak}🔥</span>}
        </div>
      </div>
      <p className="activity-desc">Unscramble wellness-themed words to earn points!</p>

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

// ===== Affirmation Generator (Sad) =====
const AFFIRMATIONS = [
  "You are worthy of love and belonging.",
  "This feeling is temporary. Better days are ahead.",
  "You've overcome hard times before. You'll do it again.",
  "It's okay to not be okay. Give yourself grace.",
  "You are stronger than you know.",
  "Your feelings are valid, and so are you.",
  "Small steps still move you forward.",
  "You deserve kindness — especially from yourself.",
  "Tough times don't last, but tough people do.",
  "You are enough, exactly as you are.",
  "Your story isn't over yet. Keep going.",
  "It's brave to feel your emotions fully.",
];

function AffirmationGenerator() {
  const [current, setCurrent] = useState(0);
  const [fav, setFav] = useState([]);

  const next = () => setCurrent(c => (c + 1) % AFFIRMATIONS.length);
  const toggleFav = () => {
    setFav(prev => prev.includes(current) ? prev.filter(i => i !== current) : [...prev, current]);
  };

  return (
    <div className="activity-card">
      <div className="activity-header">
        <Heart size={20} style={{ color: 'var(--rose-400)' }} />
        <h3>Positive Affirmations</h3>
      </div>
      <p className="activity-desc">Gentle reminders of your worth. Save the ones that resonate.</p>
      
      <div className="affirmation-display fade-in" key={current}>
        <p className="affirmation-text">"{AFFIRMATIONS[current]}"</p>
      </div>
      
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn btn-primary" onClick={next} style={{ flex: 1 }}>
          <RefreshCw size={14} /> Next Affirmation
        </button>
        <button 
          className={`btn ${fav.includes(current) ? 'btn-accent' : 'btn-secondary'}`}
          onClick={toggleFav}
        >
          <Heart size={14} fill={fav.includes(current) ? 'currentColor' : 'none'} />
        </button>
      </div>
    </div>
  );
}

// ===== Focus Challenge (Confused) =====
function FocusChallenge() {
  const [targetColor, setTargetColor] = useState('');
  const [colors, setColors] = useState([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [message, setMessage] = useState('');

  const GAME_COLORS = [
    { name: 'Red', hex: 'var(--rose-500)' },
    { name: 'Blue', hex: '#6b8a9c' },
    { name: 'Green', hex: 'var(--green-500)' },
    { name: 'Yellow', hex: 'var(--amber-400)' },
    { name: 'Brown', hex: 'var(--accent-500)' },
    { name: 'Orange', hex: '#d98b5a' },
    { name: 'Pink', hex: 'var(--rose-400)' },
    { name: 'Teal', hex: 'var(--primary-400)' },
  ];

  const newRound = useCallback(() => {
    const target = GAME_COLORS[Math.floor(Math.random() * GAME_COLORS.length)];
    const wrongColors = GAME_COLORS.filter(c => c.name !== target.name)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    const options = [...wrongColors, target].sort(() => Math.random() - 0.5);
    setTargetColor(target);
    setColors(options);
    setMessage('');
  }, []);

  useEffect(() => { newRound(); }, []);

  const handlePick = (color) => {
    if (color.name === targetColor.name) {
      setScore(s => s + 1);
      setMessage('✓ Correct!');
      setRound(r => r + 1);
      setTimeout(newRound, 800);
    } else {
      setMessage('✗ Try again!');
    }
  };

  return (
    <div className="activity-card">
      <div className="activity-header">
        <Palette size={20} style={{ color: 'var(--accent-500)' }} />
        <h3>Color Match</h3>
        <span className="game-score" style={{ marginLeft: 'auto' }}><Star size={12} /> {score}/{round || 1}</span>
      </div>
      <p className="activity-desc">Sharpen your focus — tap the color that matches the name!</p>
      
      <div style={{ textAlign: 'center', margin: '16px 0' }}>
        <span style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: 'Outfit', color: 'var(--text-primary)' }}>
          Find: <span style={{ color: targetColor.hex }}>{targetColor.name}</span>
        </span>
      </div>

      <div className="color-grid">
        {colors.map((color, i) => (
          <button
            key={i}
            className="color-btn"
            style={{ background: color.hex }}
            onClick={() => handlePick(color)}
          />
        ))}
      </div>
      
      {message && (
        <p style={{ 
          textAlign: 'center', 
          fontWeight: 600, 
          color: message.includes('✓') ? 'var(--green-500)' : 'var(--rose-500)',
          marginTop: 8
        }}>
          {message}
        </p>
      )}
    </div>
  );
}

// ===== AI Clarity Chat (Confused) =====
function ClarityChat() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "It's completely okay to feel confused. What's on your mind? I'm here to help untangle things." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

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

    try {
      const historyMsg = messages.map(m => `${m.role === 'ai' ? 'MindOasis' : 'User'}: ${m.text}`).join('\n');
      const prompt = `You are MindOasis AI, helping someone who is feeling confused. Keep your responses short (under 3 or 4 sentences), extremely empathetic, and guide them to clarity by asking gentle, probing questions. \n\nChat History:\n${historyMsg}\nUser: ${userMsg}\n\nMindOasis:`;
      
      const response = await callGeminiRaw(
        "You are MindOasis AI, a mental wellness companion helping a confused user find clarity. Be conversational, warm, and concise.",
        prompt
      );
      
      setMessages(p => [...p, { role: 'ai', text: response }]);
    } catch (e) {
      setMessages(p => [...p, { role: 'ai', text: "I'm having a little trouble connecting right now, but I'm still here for you. Try taking a deep breath and writing down your thoughts." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="activity-card" style={{ padding: 0, display: 'flex', flexDirection: 'column', height: 400 }}>
      <div className="activity-header" style={{ padding: '20px 20px 0 20px', marginBottom: 12 }}>
        <MessageCircle size={20} style={{ color: 'var(--accent-500)' }} />
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

// ===== Gratitude Jar (Neutral) =====
function GratitudeJar() {
  const [text, setText] = useState('');
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mindoasis_gratitude')) || []; } catch { return []; }
  });

  const add = () => {
    if (!text.trim()) return;
    const newItems = [{ text: text.trim(), date: new Date().toLocaleDateString() }, ...items];
    setItems(newItems);
    localStorage.setItem('mindoasis_gratitude', JSON.stringify(newItems));
    setText('');
  };

  const EMOJI_COLORS = ['var(--amber-400)', 'var(--rose-400)', 'var(--primary-400)', 'var(--green-400)', 'var(--accent-400)', 'var(--gray-400)'];

  return (
    <div className="activity-card">
      <div className="activity-header">
        <Star size={20} style={{ color: 'var(--green-500)' }} />
        <h3>Gratitude Jar</h3>
      </div>
      <p className="activity-desc">Capture moments of gratitude. Open the jar anytime you need a boost.</p>
      
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input
          className="input"
          placeholder="I'm grateful for..."
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
        />
        <button className="btn btn-success" onClick={add}>Add</button>
      </div>

      <div className="gratitude-items">
        {items.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', padding: 20 }}>
            ✨ Add things you're grateful for!
          </p>
        ) : items.slice(0, 6).map((item, i) => (
          <div key={i} className="gratitude-item" style={{ borderLeftColor: EMOJI_COLORS[i % EMOJI_COLORS.length] }}>
            <span>{item.text}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.date}</span>
          </div>
        ))}
      </div>
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
    activities: [BreathingExercise],
    quickTips: ['Take 3 slow deep breaths', 'Step outside for fresh air', 'Stretch your shoulders and neck'],
  },
  Anxious: {
    emoji: '😟',
    title: "Let's ground you in the present",
    color: 'var(--amber-400)',
    bg: 'var(--amber-50)',
    activities: [GroundingExercise],
    quickTips: ['Hold something cold', 'Name objects around you', 'Listen to nature sounds'],
  },
  Sad: {
    emoji: '😢',
    title: 'You deserve some kindness',
    color: 'var(--rose-400)',
    bg: 'var(--rose-50)',
    activities: [AffirmationGenerator],
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
    activities: [ClarityChat],
    quickTips: ['Write down your thoughts', 'Take a short walk to clear your head', 'Break the problem into smaller parts'],
  },
  Bored: {
    emoji: '😑',
    title: 'Time for some fun!',
    color: 'var(--green-400)',
    bg: 'var(--green-50)',
    activities: [WordGame],
    quickTips: ['Try doodling in your journal', 'Learn a random fun fact', 'Do 10 jumping jacks'],
  },
  Neutral: {
    emoji: '😊',
    title: 'Great vibes! Keep it going',
    color: 'var(--green-500)',
    bg: 'var(--green-50)',
    activities: [GratitudeJar],
    quickTips: ['Capture this positive moment', 'Share a compliment with someone', 'Set a small goal for today'],
  },
};

export default function MoodActivities({ mood }) {
  const config = MOOD_ACTIVITIES[mood];
  if (!config) return null;

  const ActivityComponent = config.activities[0];

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
        <ActivityComponent />
        
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
    </div>
  );
}
