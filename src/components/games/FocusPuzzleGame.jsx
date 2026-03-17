import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../context/UserContext';
import GameNav from './GameNav';

const SYMBOLS = ['✦','⟡','⬡','◇','△','◎','✨','⬠','✧','⬢','◌','🌙','❂','✥','⚝','✶'];

const D_CONFIG = {
  Easy: { grid: 4, speed: 1000, rounds: 5 },
  Medium: { grid: 9, speed: 700, rounds: 8 },
  Hard: { grid: 16, speed: 450, rounds: 12 },
};

export default function FocusPuzzleGame() {
  const { updatePlayStats } = useUser();
  const [diff, setDiff] = useState(null); 
  const [phase, setPhase] = useState('idle'); // idle, showing, input, gameover, won
  const [sequence, setSequence] = useState([]);
  const [playerSeq, setPlayerSeq] = useState([]);
  
  const [level, setLevel] = useState(1);
  const [points, setPoints] = useState(0);
  
  const [activeIdx, setActiveIdx] = useState(-1);
  const [playerFlash, setPlayerFlash] = useState(-1);
  const [wrongFlash, setWrongFlash] = useState(-1);

  const config = diff ? D_CONFIG[diff] : null;
  const tiles = config ? SYMBOLS.slice(0, config.grid) : [];

  const showSequence = useCallback((seq) => {
    setPhase('showing');
    let i = 0;
    const interval = setInterval(() => {
      if (i < seq.length) {
        setActiveIdx(seq[i]);
        setTimeout(() => setActiveIdx(-1), config.speed * 0.7);
        i++;
      } else {
        clearInterval(interval);
        setPhase('input');
      }
    }, config.speed);
  }, [config]);

  const startLevel = useCallback((newLvl, currentSeq) => {
    if (newLvl > config.rounds) {
      setPhase('won');
      const multiplier = diff === 'Easy' ? 1 : diff === 'Medium' ? 1.5 : 2;
      updatePlayStats(Math.round(points * multiplier), 'Focus Puzzle');
      return;
    }
    const nextSeq = [...currentSeq, Math.floor(Math.random() * config.grid)];
    setSequence(nextSeq);
    setPlayerSeq([]);
    setLevel(newLvl);
    setTimeout(() => showSequence(nextSeq), 800);
  }, [config, diff, points, updatePlayStats, showSequence]);

  const startGame = (d) => {
    setDiff(d);
    setPoints(0);
    setLevel(1);
    const firstSeq = [Math.floor(Math.random() * D_CONFIG[d].grid)];
    setSequence(firstSeq);
    setPlayerSeq([]);
    setTimeout(() => showSequence(firstSeq), 800);
  };

  const handleTile = (idx) => {
    if (phase !== 'input') return;
    setPlayerFlash(idx);
    setTimeout(() => setPlayerFlash(-1), 200);

    const next = [...playerSeq, idx];
    setPlayerSeq(next);

    if (next[next.length - 1] !== sequence[next.length - 1]) {
      setWrongFlash(idx);
      setTimeout(() => setWrongFlash(-1), 500);
      setPhase('gameover');
      const multiplier = diff === 'Easy' ? 1 : diff === 'Medium' ? 1.5 : 2;
      updatePlayStats(Math.round(points * 0.5 * multiplier), 'Focus Puzzle'); // Half points for failure
      return;
    }

    if (next.length === sequence.length) {
      setPoints(p => p + (level * 5));
      setPhase('showing');
      startLevel(level + 1, sequence);
    }
  };

  const restart = () => {
    setDiff(null);
    setPhase('idle');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eef2ff 0%, #f0f9ff 50%, #fdf2f8 100%)', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif' }}>
      <GameNav />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ flex: 1, padding: '0 16px 32px' }}>
        <div style={{ background: 'white', borderRadius: '32px', margin: '0 auto', maxWidth: 480, width: '100%', minHeight: 700, padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.04)' }}>
          
          <div style={{ background: '#84cc16', width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.8rem', marginBottom: 16 }}>🧩</div>

          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#312e81', margin: '0 0 8px 0', fontFamily: 'Playfair Display, serif' }}>Focus Puzzle</h1>

          <AnimatePresence mode="wait">
            {!diff ? (
              <motion.div key="diff" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ width: '100%', textAlign: 'center' }}>
                <p style={{ color: '#64748b', marginBottom: 24 }}>Select focus intensity</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {Object.keys(D_CONFIG).map(d => (
                    <button key={d} onClick={() => startGame(d)} style={{ padding: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 16, fontWeight: 700, color: '#312e81', cursor: 'pointer' }}>
                      {d} 
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div key="game" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                   <div style={{ background: '#fef08a', color: '#a16207', padding: '4px 12px', borderRadius: 12, fontWeight: 800, fontSize: '0.8rem' }}>Step {level}/{config.rounds}</div>
                   <div style={{ color: '#64748b', fontWeight: 700 }}>{points} pts</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${config.grid === 4 ? 2 : config.grid === 9 ? 3 : 4}, 1fr)`, gap: 10, width: '100%', maxWidth: 300 }}>
                  {tiles.map((sym, idx) => (
                    <motion.button
                      key={idx}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleTile(idx)}
                      disabled={phase !== 'input'}
                      style={{
                        aspectRatio: '1', borderRadius: 16, border: '1px solid #e2e8f0',
                        background: activeIdx === idx ? '#e0e7ff' : playerFlash === idx ? '#dcfce7' : wrongFlash === idx ? '#fee2e2' : 'white',
                        borderColor: activeIdx === idx ? '#818cf8' : playerFlash === idx ? '#4ade80' : wrongFlash === idx ? '#f87171' : '#e2e8f0',
                        fontSize: '1.4rem', cursor: phase === 'input' ? 'pointer' : 'default',
                        boxShadow: activeIdx === idx ? '0 0 15px rgba(129,140,248,0.5)' : 'none'
                      }}
                    >
                      {sym}
                    </motion.button>
                  ))}
                </div>

                <div style={{ marginTop: 32 }}>
                  {phase === 'won' && (
                     <div style={{ textAlign: 'center' }}>
                        <p style={{ color: '#10b981', fontWeight: 800 }}>Masterful Focus!</p>
                        <button onClick={restart} style={{ marginTop: 12, padding: '10px 24px', background: '#312e81', color: 'white', border: 'none', borderRadius: 12, fontWeight: 700 }}>Menu</button>
                     </div>
                  )}
                  {phase === 'gameover' && (
                     <div style={{ textAlign: 'center' }}>
                        <p style={{ color: '#ef4444', fontWeight: 800 }}>Broken Focus!</p>
                        <button onClick={restart} style={{ marginTop: 12, padding: '10px 24px', background: '#312e81', color: 'white', border: 'none', borderRadius: 12, fontWeight: 700 }}>Retry</button>
                     </div>
                  )}
                  {phase === 'showing' && <p style={{ color: '#6366f1', fontWeight: 700 }}>Memorizing...</p>}
                  {phase === 'input' && <p style={{ color: '#10b981', fontWeight: 700 }}>Your turn!</p>}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
