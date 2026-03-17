import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/play/words', label: 'Word Guess', icon: '🔤' },
  { path: '/play/breathe', label: 'Breathing', icon: '🌬️' },
  { path: '/play/focus', label: 'Focus Puzzle', icon: '🧩' },
  { path: '/play/scenario', label: 'Scenario', icon: '☁️' },
  { path: '/play/memory', label: 'Memory Match', icon: '🃏' },
];

export default function GameNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div style={{ display: 'flex', gap: '10px', padding: '16px 24px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
      {NAV_ITEMS.map(item => {
        const active = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: active ? '1px solid #c7d2fe' : '1px solid #cbd5e1',
              background: active ? '#e0e7ff' : 'transparent',
              color: '#1e293b',
              fontWeight: active ? '700' : '600',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
              boxShadow: active ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
