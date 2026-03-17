import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../context/UserContext';
import GameNav from './GameNav';

const SCENARIOS = [
  {
    id: 1, category: 'Self-care',
    text: "You've had a long, exhausting day and still have chores to do. How do you handle it?",
    options: [
      { text: "Push through and finish everything perfectly.", eq: 5 },
      { text: "Leave the chores and go to sleep immediately.", eq: 8 },
      { text: "Do only what's essential, then rest mindfully.", eq: 10, best: true }
    ],
    feedback: "Prioritizing self-awareness and sustainable effort is key to long-term wellness."
  },
  {
    id: 2, category: 'Friendship',
    text: "A close friend cancels plans at the last minute for the third time this month. Your reaction?",
    options: [
      { text: "Send a passive-aggressive text back.", eq: 2 },
      { text: "Ignore them for a few days to show you're hurt.", eq: 5 },
      { text: "Share how it affects you and ask if they're okay.", eq: 10, best: true }
    ],
    feedback: "Honest communication builds stronger, more empathetic relationships."
  },
  {
    id: 3, category: 'Work',
    text: "You receive constructive criticism on a project you worked hard on. What's your internal dialogue?",
    options: [
      { text: "They just don't understand my vision.", eq: 4 },
      { text: "I'm probably not cut out for this.", eq: 6 },
      { text: "This is a chance to sharpen my skills.", eq: 10, best: true }
    ],
    feedback: "A growth mindset turns feedback into a powerful tool for improvement."
  }
];

export default function ScenarioDecisionGame() {
  const { updatePlayStats } = useUser();
  const [diff, setDiff] = useState(null); // Easy, Med, Hard
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [finished, setFinished] = useState(false);

  const scenario = SCENARIOS[currentIdx];

  const handleChoice = (option) => {
    if (showFeedback) return;
    setScore(p => p + option.eq);
    setShowFeedback(true);
  };

  const next = () => {
    setShowFeedback(false);
    if (currentIdx < SCENARIOS.length - 1) {
      setCurrentIdx(p => p + 1);
    } else {
      setFinished(true);
      const multiplier = diff === 'Easy' ? 1 : diff === 'Medium' ? 1.5 : 2;
      updatePlayStats(Math.round(score * multiplier), 'Scenario Decision');
    }
  };

  const restart = () => {
    setDiff(null);
    setCurrentIdx(0);
    setScore(0);
    setShowFeedback(false);
    setFinished(false);
  };

  return (
    <div style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fdf2f8 50%, #fef2f2 100%)', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif' }}>
      <GameNav />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ flex: 1, padding: '0 16px 32px' }}>
        <div style={{ background: 'white', borderRadius: '32px', margin: '0 auto', maxWidth: 480, width: '100%', padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.04)' }}>
          
          <div style={{ background: '#fecdd3', width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', marginBottom: 16 }}>💭</div>

          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#312e81', margin: '0 0 8px 0', fontFamily: 'Playfair Display, serif' }}>Scenario Decision</h1>
          
          <AnimatePresence mode="wait">
            {!diff ? (
              <motion.div 
                key="diff"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{ width: '100%', textAlign: 'center' }}
              >
                <p style={{ color: '#64748b', marginBottom: 24 }}>Select psychological depth</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {['Easy', 'Medium', 'Hard'].map(d => (
                    <button key={d} onClick={() => setDiff(d)} style={{ padding: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 16, fontWeight: 700, color: '#312e81', cursor: 'pointer' }}>
                      {d} {d === 'Hard' ? 'Psychology' : 'Mode'}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : finished ? (
              <motion.div 
                key="finished"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ textAlign: 'center', width: '100%', padding: '40px 0' }}
              >
                <div style={{ fontSize: '4rem', marginBottom: 16 }}>🌟</div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#312e81', marginBottom: 8 }}>Session Over</h2>
                <p style={{ color: '#64748b', marginBottom: 24 }}>You earned {Math.round(score * (diff === 'Easy' ? 1 : diff === 'Medium' ? 1.5 : 2))} Mind Points on {diff}!</p>
                <button onClick={restart} style={{ padding: '14px 32px', background: '#312e81', color: 'white', border: 'none', borderRadius: 14, fontWeight: 700, cursor: 'pointer' }}>Close Simulator</button>
              </motion.div>
            ) : (
              <motion.div 
                key={scenario.id} 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ width: '100%' }}
              >
                <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '24px', border: '1px solid #e2e8f0', marginBottom: 24 }}>
                  <p style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', lineHeight: 1.5 }}>"{scenario.text}"</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {scenario.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleChoice(opt)}
                      disabled={showFeedback}
                      style={{
                        padding: '16px 20px', borderRadius: 16, textAlign: 'left',
                        background: 'white', border: '2px solid #f1f5f9', cursor: showFeedback ? 'default' : 'pointer',
                        borderColor: showFeedback && opt.best ? '#10b981' : '#f1f5f9',
                        opacity: showFeedback && !opt.best ? 0.6 : 1
                      }}
                    >
                      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#475569' }}>{opt.text}</span>
                    </button>
                  ))}
                </div>

                {showFeedback && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ marginTop: 24, padding: '20px', background: '#f8fafc', borderRadius: 20 }}>
                    <p style={{ color: '#475569', fontSize: '0.85rem', marginBottom: 12 }}>{scenario.feedback}</p>
                    <button onClick={next} style={{ width: '100%', padding: '12px', background: '#1e293b', color: 'white', border: 'none', borderRadius: 12, fontWeight: 700, cursor: 'pointer' }}>Next</button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
