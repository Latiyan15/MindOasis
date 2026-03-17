import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../context/UserContext';
import GameNav from './GameNav';

const THEMES = {
  Nature: ['🌸','🌿','🍄','🦋','🍃','🌻','🍁','🐛'],
  Sky: ['☁️','☀️','🌈','🕊️','⛅','🦅','🪁','🌧️'],
  Cosmos: ['🌙','⭐','🪐','🚀','☄️','🌌','👽','🔭'],
  Ocean: ['🌊','🐠','🐋','🐚','🐬','🦀','🦑','🐢'],
};

const D_CONFIG = {
  Easy: { rows: 2, cols: 3, pairs: 3 },
  Medium: { rows: 4, cols: 4, pairs: 8 },
  Hard: { rows: 6, cols: 6, pairs: 18 },
};

export default function MemoryCalmGame() {
  const { updatePlayStats } = useUser();
  const [diff, setDiff] = useState(null); // Easy, Medium, Hard
  const [theme, setTheme] = useState('Nature');
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [locked, setLocked] = useState(false);

  const initGame = useCallback((d) => {
    const config = D_CONFIG[d || diff];
    const emojis = THEMES[theme].slice(0, config.pairs);
    // If emojis is shorter than pairs (it is, THEMES has 8), we cycle them or use unique ones
    // Let's expand THEMES or just repeat for Hard
    let sourceEmojis = [...THEMES[theme]];
    while (sourceEmojis.length < config.pairs) {
        sourceEmojis = [...sourceEmojis, ...THEMES[theme]];
    }
    const finalEmojis = sourceEmojis.slice(0, config.pairs);

    let deck = [...finalEmojis, ...finalEmojis].map((emoji, i) => ({ id: i, emoji }));
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    setCards(deck);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setTime(0);
    setCombo(0);
    setMaxCombo(0);
    setRunning(false);
    setDone(false);
    setLocked(false);
  }, [theme, diff]);

  const selectDiff = (d) => {
    setDiff(d);
    initGame(d);
  };

  useEffect(() => {
    if (!running || done) return;
    const t = setInterval(() => setTime(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [running, done]);

  const flip = (idx) => {
    if (locked || flipped.includes(idx) || matched.includes(idx) || done) return;
    if (!running) setRunning(true);

    const next = [...flipped, idx];
    setFlipped(next);

    if (next.length === 2) {
      setMoves(m => m + 1);
      setLocked(true);
      const [a, b] = next;
      if (cards[a].emoji === cards[b].emoji) {
        const newMatched = [...matched, a, b];
        setMatched(newMatched);
        setFlipped([]);
        setLocked(false);
        setCombo(c => {
          const newC = c + 1;
          setMaxCombo(prev => Math.max(prev, newC));
          return newC;
        });

        if (newMatched.length === cards.length) {
          setDone(true);
          setRunning(false);
          const diffMultiplier = diff === 'Easy' ? 1 : diff === 'Medium' ? 1.5 : 2;
          const performanceBonus = Math.max(0, (cards.length - moves) * 2);
          updatePlayStats(Math.round((20 + performanceBonus) * diffMultiplier), 'Memory Match');
        }
      } else {
        setCombo(0);
        setTimeout(() => {
          setFlipped([]);
          setLocked(false);
        }, 800);
      }
    }
  };

  const restart = () => {
    setDiff(null);
    setCards([]);
    setDone(false);
  };

  return (
    <div style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #f0f9ff 50%, #fdf2f8 100%)', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif' }}>
      <GameNav />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ flex: 1, padding: '0 16px 32px' }}>
        <div style={{ background: 'white', borderRadius: '32px', margin: '0 auto', maxWidth: 480, width: '100%', padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.04)' }}>
          
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ type: 'spring' }}
            style={{ background: '#dcd7ec', width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', marginBottom: 16 }}
          >
            🃏
          </motion.div>

          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#312e81', margin: '0 0 8px 0', fontFamily: 'Playfair Display, serif' }}>Memory Match</h1>
          
          <AnimatePresence mode="wait">
            {!diff ? (
              <motion.div 
                key="difficulty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, x: -100 }}
                style={{ width: '100%', textAlign: 'center' }}
              >
                <p style={{ color: '#64748b', marginBottom: 24 }}>Choose Difficulty</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {Object.keys(D_CONFIG).map(d => (
                    <motion.button
                      key={d}
                      whileHover={{ x: 5 }}
                      onClick={() => selectDiff(d)}
                      style={{ padding: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 20, fontWeight: 700, color: '#312e81', cursor: 'pointer' }}
                    >
                      {d} <span style={{ color: '#94a3b8', fontWeight: 400 }}>({D_CONFIG[d].pairs} pairs)</span>
                    </motion.button>
                  ))}
                </div>
                <div style={{ marginTop: 32 }}>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: 12 }}>Pick Theme</p>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                    {Object.keys(THEMES).map(t => (
                      <button key={t} onClick={() => setTheme(t)} style={{ padding: '8px 12px', borderRadius: 12, border: theme === t ? '1px solid #8b5cf6' : '1px solid #cbd5e1', background: theme === t ? '#f1f5f9' : 'white', cursor: 'pointer', fontSize: '0.8rem' }}>
                        {THEMES[t][0]} {t}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="game"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24, width: '100%' }}>
                  {[
                    { label: 'MOVES', val: moves, color: '#4f46e5' },
                    { label: 'TIME', val: `${time}s`, color: '#6366f1' },
                    { label: 'COMBO', val: combo, color: '#f43f5e' },
                  ].map(s => (
                    <div key={s.label} style={{ flex: 1, border: '1px solid #e2e8f0', borderRadius: 20, padding: '12px 4px', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 600, color: s.color }}>{s.val}</div>
                      <div style={{ fontSize: '0.6rem', fontWeight: 700, color: '#94a3b8', marginTop: 2 }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: `repeat(${D_CONFIG[diff].cols},1fr)`, 
                  gap: diff === 'Hard' ? 6 : 8, 
                  width: '100%', 
                  maxWidth: 400 
                }}>
                  {cards.map((card, idx) => {
                    const isFlipped = flipped.includes(idx) || matched.includes(idx);
                    const isMatched = matched.includes(idx);
                    return (
                      <motion.div 
                        key={idx} 
                        initial={false}
                        animate={{ rotateY: isFlipped ? 180 : 0, scale: isMatched ? 0.95 : 1, opacity: isMatched ? 0.6 : 1 }}
                        transition={{ type: 'spring', damping: 20 }}
                        onClick={() => flip(idx)} 
                        style={{
                          aspectRatio: '1', borderRadius: diff === 'Hard' ? 8 : 12, cursor: (isMatched || isFlipped) ? 'default' : 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: diff === 'Hard' ? '1.2rem' : '1.8rem',
                          background: isMatched ? '#f1f5f9' : isFlipped ? 'white' : '#f8f1ff',
                          border: isMatched ? '1px solid #e2e8f0' : isFlipped ? '2px solid #8b5cf6' : '1px solid #ddd6fe',
                          transformStyle: 'preserve-3d', position: 'relative'
                        }}
                      >
                        <div style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', position: 'absolute' }}>{card.emoji}</div>
                        {!isFlipped && <div style={{ opacity: 0.1 }}>?</div>}
                      </motion.div>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {done && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 20, textAlign: 'center' }}>
                      <p style={{ color: '#8b5cf6', fontWeight: 800, marginBottom: 8 }}>Fantastic Memory!</p>
                      <button onClick={restart} style={{ padding: '10px 24px', background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>New Session</button>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {!done && (
                  <button onClick={restart} style={{ marginTop: 24, fontSize: '0.8rem', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                    Quit Session
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
