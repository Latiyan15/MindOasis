import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../context/UserContext';
import GameNav from './GameNav';

const PATTERNS = {
  Easy: { name: 'Box Breath', inhale: 4, hold1: 4, exhale: 4, hold2: 4, label: '4s-4s-4s-4s', cycles: 3, points: 15 },
  Medium: { name: '4-7-8 Relax', inhale: 4, hold1: 7, exhale: 8, hold2: 0, label: '4s-7s-8s', cycles: 5, points: 25 },
  Hard: { name: 'Power Deep', inhale: 6, hold1: 4, exhale: 10, hold2: 4, label: '6s-4s-10s-4s', cycles: 8, points: 40 },
};

export default function BreathingRhythmGame() {
  const { updatePlayStats } = useUser();
  const [diff, setDiff] = useState(null); // Easy, Med, Hard
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState('Inhale'); // Inhale, Hold, Exhale, Rest
  const [timeLeft, setTimeLeft] = useState(0);
  const [cycle, setCycle] = useState(1);
  const [done, setDone] = useState(false);

  const pattern = diff ? PATTERNS[diff] : null;

  useEffect(() => {
    let timer;
    if (active && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (active && timeLeft === 0) {
      if (phase === 'Inhale') {
        if (pattern.hold1 > 0) { setPhase('Hold'); setTimeLeft(pattern.hold1); }
        else { setPhase('Exhale'); setTimeLeft(pattern.exhale); }
      } else if (phase === 'Hold') {
        setPhase('Exhale'); setTimeLeft(pattern.exhale);
      } else if (phase === 'Exhale') {
        if (pattern.hold2 > 0) { setPhase('Rest'); setTimeLeft(pattern.hold2); }
        else handleCycleEnd();
      } else if (phase === 'Rest') {
        handleCycleEnd();
      }
    }
    return () => clearInterval(timer);
  }, [active, timeLeft, phase, pattern]);

  const handleCycleEnd = () => {
    if (cycle < pattern.cycles) {
      setCycle(prev => prev + 1);
      setPhase('Inhale');
      setTimeLeft(pattern.inhale);
    } else {
      setActive(false);
      setDone(true);
      updatePlayStats(pattern.points, 'Breathing Rhythm');
    }
  };

  const start = (d) => {
    setDiff(d);
    setCycle(1);
    setPhase('Inhale');
    setTimeLeft(PATTERNS[d].inhale);
    setActive(true);
    setDone(false);
  };

  const reset = () => {
    setDiff(null);
    setActive(false);
    setDone(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 100%)', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif' }}>
      <GameNav />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ flex: 1, padding: '0 16px 32px' }}>
        <div style={{ background: 'white', borderRadius: '32px', margin: '0 auto', maxWidth: 480, width: '100%', minHeight: 700, padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.04)' }}>
          
          <div style={{ background: '#2dd4bf', width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.6rem', marginBottom: 16 }}>🌬️</div>

          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#134e4a', margin: '0 0 8px 0', fontFamily: 'Playfair Display, serif' }}>Breathing Rhythm</h1>

          <AnimatePresence mode="wait">
            {!diff ? (
              <motion.div key="select" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -20 }} style={{ width: '100%', textAlign: 'center' }}>
                <p style={{ color: '#64748b', marginBottom: 32 }}>Choose your breathing depth</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {Object.keys(PATTERNS).map(d => (
                    <button key={d} onClick={() => start(d)} style={{ padding: '20px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 20, textAlign: 'left', cursor: 'pointer' }}>
                      <div style={{ fontWeight: 800, color: '#134e4a' }}>{PATTERNS[d].name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{PATTERNS[d].label} • {PATTERNS[d].cycles} Cycles</div>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : done ? (
              <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', paddingTop: 60 }}>
                <div style={{ fontSize: '4rem', marginBottom: 20 }}>🌿</div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#134e4a', marginBottom: 12 }}>Refreshingly Done</h2>
                <p style={{ color: '#64748b', marginBottom: 32 }}>You've earned {pattern.points} Mind Points!</p>
                <button onClick={reset} style={{ padding: '14px 32px', background: '#134e4a', color: 'white', border: 'none', borderRadius: 14, fontWeight: 700, cursor: 'pointer' }}>Finish</button>
              </motion.div>
            ) : (
              <motion.div key="active" initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 40 }}>
                <div style={{ marginBottom: 40, textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#2dd4bf', letterSpacing: '0.1em', marginBottom: 8 }}>CYCLE {cycle}/{pattern.cycles}</div>
                  <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#134e4a', fontFamily: 'Playfair Display, serif' }}>{phase}</div>
                  <div style={{ fontSize: '1.2rem', color: '#94a3b8' }}>{timeLeft}s</div>
                </div>

                <div style={{ position: 'relative', width: 240, height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 60 }}>
                  <motion.div
                    animate={{ 
                      scale: phase === 'Inhale' ? 1.5 : phase === 'Exhale' ? 0.8 : phase === 'Hold' ? 1.5 : 0.8,
                      opacity: phase === 'Inhale' ? 0.8 : phase === 'Exhale' ? 0.4 : 0.6
                    }}
                    transition={{ duration: timeLeft, ease: 'linear' }}
                    style={{ width: 140, height: 140, background: '#2dd4bf', borderRadius: '50%', filter: 'blur(20px)' }}
                  />
                  <motion.div
                    animate={{ scale: phase === 'Inhale' ? 1.5 : phase === 'Exhale' ? 0.8 : phase === 'Hold' ? 1.5 : 0.8 }}
                    transition={{ duration: timeLeft, ease: 'linear' }}
                    style={{ position: 'absolute', width: 100, height: 100, border: '4px solid #2dd4bf', borderRadius: '50%' }}
                  />
                </div>

                <button onClick={reset} style={{ fontSize: '0.8rem', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                   Cancel Session
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
