import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser, getLevel } from '../context/UserContext';

const GAMES = [
  { id: 'words', name: 'Word Guess', icon: 'abc', color: '#60a5fa', tag: 'Logic', desc: 'Find calming 5-letter words' },
  { id: 'breathing', name: 'Breathing Rhythm', icon: '🌬️', color: '#2dd4bf', tag: 'Relax', desc: 'Guided rhythmic breathing' },
  { id: 'memory', name: 'Memory Match', icon: '🃏', color: '#a78bfa', tag: 'Memory', desc: 'Match pairs of nature emojis' },
  { id: 'focus', name: 'Focus Puzzle', icon: '🧩', color: '#84cc16', tag: 'Focus', desc: 'Repeat symbol sequences' },
  { id: 'scenario', name: 'Scenario Simulator', icon: '💭', color: '#f43f5e', tag: 'Coach', desc: 'Test your emotional intelligence' },
];

export default function PlayZone() {
  const { user } = useUser();
  const navigate = useNavigate();

  const userLevel = user ? getLevel(user.mindPoints || 0) : 1;

  return (
    <div style={{ minHeight: '100vh', background: '#fdfbf7', padding: '40px 20px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48 }}>
          <div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#1e293b', marginBottom: 8, fontFamily: 'Playfair Display, serif' }}>
              Mind Oasis <span style={{ color: '#8b5cf6' }}>Play Zone</span>
            </h1>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Fun ways to strengthen your emotional toolkit</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.1em' }}>GLOBAL RANK</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#312e81' }}>Level {userLevel}</div>
          </div>
        </header>

        {/* Unified Stats Dashboard */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 48 }}>
          {[
            { label: 'TOTAL POINTS', value: user?.mindPoints || 0, color: '#312e81', icon: '✨' },
            { label: 'DAILY STREAK', value: (user?.streak || 0) + ' Days', color: '#f59e0b', icon: '🔥' },
            { label: 'BADGES', value: user?.badges?.length || 0, color: '#10b981', icon: '🏆' },
            { label: 'GAMES PLAYED', value: user?.gamesPlayed || 0, color: '#6366f1', icon: '🎮' },
          ].map(stat => (
            <motion.div 
              key={stat.label}
              whileHover={{ y: -5 }}
              style={{ background: 'white', padding: '24px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: 8 }}
            >
              <div style={{ fontSize: '1.2rem' }}>{stat.icon}</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.05em' }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1e293b', marginBottom: 24, fontFamily: 'Playfair Display, serif' }}>Choose Your Experience</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
          {GAMES.map((game, idx) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.01 }}
              onClick={() => navigate(`/play/${game.id}`)}
              style={{
                background: 'white', padding: '24px', borderRadius: '24px', border: '1px solid #f1f5f9',
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 24
              }}
            >
              <div style={{ width: 64, height: 64, background: game.color + '15', color: game.color, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                {game.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b' }}>{game.name}</h3>
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '4px 10px', borderRadius: 20, background: game.color + '10', color: game.color, textTransform: 'uppercase' }}>{game.tag}</span>
                </div>
                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{game.desc}</p>
              </div>
              <div style={{ color: '#cbd5e1' }}>→</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
