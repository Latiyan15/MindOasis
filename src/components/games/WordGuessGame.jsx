import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../context/UserContext';
import GameNav from './GameNav';

// Performance-driven dictionary
const DICTIONARY = {
  Easy: [
    'CALM', 'BEAM', 'HOPE', 'GLOW', 'PURE', 'WISH', 'KIND', 'LOVE', 'SAFE', 'GENT',
    'FREE', 'WINT', 'SOFT', 'TRUE', 'FAIR', 'HEAL', 'BOLD', 'GLAD', 'COOL', 'DEAR'
  ],
  Medium: [
    'PEACE', 'BRAVE', 'SMILE', 'RELAX', 'HAPPY', 'QUIET', 'HEART', 'DREAM', 'LIGHT', 'FOCUS',
    'WATER', 'BLISS', 'MAGIC', 'TRUST', 'GRACE', 'SHINE', 'BLOOM', 'FRESH', 'NOBLE', 'PRIDE'
  ],
  Hard: [
    'SERENE', 'GENTLE', 'BRIGHT', 'ENERGY', 'SPIRIT', 'WONDER', 'JOYFUL', 'STRONG', 'WISDOM', 'HARMON',
    'ZENITH', 'NATURE', 'DIVINE', 'VALUES', 'HEALTH', 'ASPIRE', 'BELIEV', 'PURITY', 'AMAZED', 'THANKS'
  ]
};

const ALL_VALID_WORDS = new Set([
  ...DICTIONARY.Easy, ...DICTIONARY.Medium, ...DICTIONARY.Hard,
  // Common fillers to allow gameplay but prioritize positive words as solutions
  'WORDS', 'BOOKS', 'STUDY', 'PLANE', 'TRAIN', 'SHIPS', 'MUSIC', 'DANCE', 'PARTY', 'HOUSE',
  'FRUIT', 'APPLE', 'BREAD', 'TABLE', 'CHAIR', 'LIGHT', 'PHOTO', 'STORY', 'CLOUD', 'BREEZ',
  'TREES', 'BIRDS', 'FIELD', 'SPACE', 'WORLD', 'PEACE', 'QUIET', 'RELAX', 'SMILE', 'HAPPY'
]);

const KEY_ROWS = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['ENTER','Z','X','C','V','B','N','M','⌫'],
];

function getTileStyle(state) {
  if (state === 'correct') return { background: '#4ade80', border: '2px solid #22c55e', color: 'white' };
  if (state === 'present') return { background: '#facc15', border: '2px solid #eab308', color: 'white' };
  if (state === 'absent')  return { background: '#94a3b8', border: '2px solid #64748b', color: 'white' };
  if (state === 'active')  return { background: 'white', border: '2px solid #818cf8', color: '#1e293b', boxShadow: '0 0 15px rgba(129,140,248,0.2)' };
  return { background: 'white', border: '2px solid #e2e8f0', color: '#1e293b' };
}

export default function WordGuessGame() {
  const { updatePlayStats } = useUser();
  const [diff, setDiff] = useState(null); // null, Easy, Medium, Hard
  const [solution, setSolution] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [current, setCurrent] = useState('');
  const [status, setStatus] = useState('playing'); 
  const [shake, setShake] = useState(false);
  const [invalidWord, setInvalidWord] = useState(false);

  const wordLen = useMemo(() => {
    if (diff === 'Easy') return 4;
    if (diff === 'Hard') return 6;
    return 5;
  }, [diff]);

  const selectDiff = (d) => {
    const pool = DICTIONARY[d];
    setDiff(d);
    setSolution(pool[Math.floor(Math.random() * pool.length)]);
  };

  const usedLetters = {};
  guesses.forEach(g => {
    for (let i = 0; i < g.length; i++) {
      const l = g[i];
      if (solution[i] === l) usedLetters[l] = 'correct';
      else if (solution.includes(l) && usedLetters[l] !== 'correct') usedLetters[l] = 'present';
      else if (!usedLetters[l]) usedLetters[l] = 'absent';
    }
  });

  const submit = useCallback(() => {
    if (current.length !== wordLen) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    // Real word validation
    // For simplicity with this small dict, we check ALL_VALID_WORDS
    // In a production app you'd use a massive lib, but here we enforce "Recognized Words Only"
    if (!ALL_VALID_WORDS.has(current)) {
      setInvalidWord(true);
      setShake(true);
      setTimeout(() => { setShake(false); setInvalidWord(false); }, 1000);
      return;
    }

    const next = [...guesses, current];
    setGuesses(next);
    setCurrent('');
    
    if (current === solution) {
      setStatus('won');
      // Points scaled by difficulty and attempts (Fewer attempts = More points)
      const diffMultiplier = diff === 'Easy' ? 1 : diff === 'Medium' ? 1.5 : 2;
      const basePoints = Math.max(5, (7 - next.length) * 5);
      updatePlayStats(Math.round(basePoints * diffMultiplier), 'Word Guess');
    } else if (next.length >= 6) {
      setStatus('lost');
    }
  }, [current, guesses, solution, updatePlayStats, wordLen, diff]);

  const handleKey = useCallback((e) => {
    if (!diff || status !== 'playing') return;
    if (e.key === 'Enter') submit();
    else if (e.key === 'Backspace') setCurrent(p => p.slice(0, -1));
    else if (/^[a-zA-Z]$/.test(e.key) && current.length < wordLen)
      setCurrent(p => (p + e.key).toUpperCase());
  }, [diff, status, submit, current, wordLen]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  const tap = (key) => {
    if (!diff || status !== 'playing') return;
    if (key === 'ENTER') submit();
    else if (key === '⌫') setCurrent(p => p.slice(0, -1));
    else if (current.length < wordLen) setCurrent(p => p + key);
  };

  const restart = () => {
    setDiff(null);
    setSolution('');
    setGuesses([]);
    setCurrent('');
    setStatus('playing');
  };

  return (
    <div style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #f0f9ff 50%, #fdf2f8 100%)', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif' }}>
      <GameNav />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ flex: 1, padding: '0 16px 32px' }}>
        <div style={{ background: 'white', borderRadius: '32px', margin: '0 auto', maxWidth: 480, width: '100%', padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.04)' }}>
          
          <motion.div 
            whileHover={{ rotate: 10 }}
            style={{ background: '#60a5fa', width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1.2rem', marginBottom: 16 }}
          >
            abc
          </motion.div>

          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#312e81', margin: '0 0 8px 0', fontFamily: 'Playfair Display, serif' }}>Word Guess</h1>
          
          <AnimatePresence mode="wait">
            {!diff ? (
              <motion.div 
                key="difficulty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                style={{ textAlign: 'center', width: '100%' }}
              >
                <p style={{ color: '#64748b', marginBottom: 32 }}>Choose your challenge level</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {['Easy', 'Medium', 'Hard'].map(d => (
                    <motion.button
                      key={d}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => selectDiff(d)}
                      style={{ padding: '16px', background: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: 20, fontWeight: 700, color: '#312e81', cursor: 'pointer', fontSize: '1rem' }}
                    >
                      {d} <span style={{ fontWeight: 400, color: '#94a3b8', fontSize: '0.8rem' }}>({d === 'Easy' ? '4' : d === 'Medium' ? '5' : '6'} letters)</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="game"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: 32, textAlign: 'center' }}>Solve the word in 6 tries ({diff} Mode)</p>

                <div style={{ display: 'grid', gridTemplateRows: 'repeat(6,1fr)', gap: 10, width: '100%', maxWidth: wordLen * 60, marginBottom: 'auto' }}>
                  {Array.from({ length: 6 }).map((_, row) => (
                    <motion.div 
                      key={row} 
                      animate={shake && row === guesses.length ? { x: [-5, 5, -5, 5, 0] } : {}}
                      style={{ display: 'grid', gridTemplateColumns: `repeat(${wordLen},1fr)`, gap: 10 }}
                    >
                      {Array.from({ length: wordLen }).map((_, col) => {
                        const isG = guesses[row];
                        const isCurrent = row === guesses.length;
                        let state = 'empty';
                        let letter = '';
                        
                        if (isG) {
                          letter = isG[col];
                          if (solution[col] === letter) state = 'correct';
                          else if (solution.includes(letter)) state = 'present';
                          else state = 'absent';
                        } else if (isCurrent && current[col]) {
                          letter = current[col];
                          state = 'active';
                        }
                        
                        const s = getTileStyle(state);
                        return (
                          <motion.div 
                            key={col}
                            animate={state !== 'empty' ? { rotateY: status !== 'playing' || isG ? 360 : 0, scale: state === 'active' ? 1.05 : 1 } : {}}
                            transition={{ delay: col * 0.1, duration: 0.4 }}
                            style={{
                              aspectRatio: '1', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '1.4rem', fontWeight: 800, ...s,
                            }}
                          >
                            {letter}
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  ))}
                </div>

                {invalidWord && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 700, marginTop: 8 }}>
                    Not a recognized word!
                  </motion.div>
                )}

                <AnimatePresence>
                  {status !== 'playing' && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      style={{ padding: '24px', textAlign: 'center', width: '100%', maxWidth: 320, marginTop: 24, background: status === 'won' ? '#f0fdf4' : '#fef2f2', borderRadius: '24px', border: `1px solid ${status === 'won' ? '#bbf7d0' : '#fecdd3'}` }}
                    >
                      <div style={{ fontSize: '2rem', marginBottom: 8 }}>{status === 'won' ? '🏆' : '😔'}</div>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#312e81', marginBottom: 4 }}>
                        {status === 'won' ? 'Brilliant!' : 'Nice Try!'}
                      </h3>
                      <p style={{ color: '#64748b', marginBottom: 12, fontSize: '0.95rem' }}>
                        {status === 'won' ? `Difficulty ${diff} solved!` : `The word was ${solution}`}
                      </p>
                      <button onClick={restart} style={{ padding: '8px 20px', background: status === 'won' ? '#22c55e' : '#ef4444', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>
                        Play Again
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div style={{ width: '100%', marginTop: 32, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {KEY_ROWS.map((row, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
                      {row.map(key => {
                        const ks = usedLetters[key];
                        return (
                          <motion.button
                            key={key}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => tap(key)}
                            style={{
                              flex: key.length > 1 ? '0 0 auto' : 1,
                              padding: key.length > 1 ? '8px 8px' : '12px 4px',
                              borderRadius: 10, border: '1px solid #e2e8f0', cursor: 'pointer',
                              fontWeight: 700, fontSize: key.length > 1 ? '0.7rem' : '0.8rem',
                              background: ks === 'correct' ? '#4ade80' : ks === 'present' ? '#facc15' : ks === 'absent' ? '#cbd5e1' : 'white',
                              color: ks ? 'white' : '#1e293b', boxShadow: '0 2px 0 rgba(0,0,0,0.01)'
                            }}
                          >
                            {key}
                          </motion.button>
                        );
                      })}
                    </div>
                  ))}
                </div>

                <button onClick={restart} style={{ marginTop: 24, padding: '10px 20px', background: 'white', color: '#1e293b', border: '1px solid #cbd5e1', borderRadius: 12, fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>
                  ↻ Back to Levels
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
