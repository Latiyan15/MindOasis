import React from 'react';
import { useUser } from '../context/UserContext';

// ===== STYLE PALETTES =====
// Each style defines outfit colors, hair colors, and optional accessories
const STYLE_PALETTES = {
  classic: {
    // Original clean modern
    neutral: { outfit: '#10b981', hair: '#64748b', skin: '#fbcfe8', shoe: '#1e293b' },
    boy:     { outfit: '#94a3b8', detail: '#cbd5e1', hair: '#3b82f6', skin: '#fed7aa', shoe: '#1e293b' },
    girl:    { outfit: '#f43f5e', hair: '#fcd34d', skin: '#ffedd5', shoe: '#1e293b', clip: null },
    accessories: null,
  },
  sporty: {
    // Athletic with headband
    neutral: { outfit: '#2563eb', hair: '#1e293b', skin: '#fbcfe8', shoe: '#1e293b' },
    boy:     { outfit: '#2563eb', detail: '#60a5fa', hair: '#1e293b', skin: '#fed7aa', shoe: '#1e293b' },
    girl:    { outfit: '#7c3aed', hair: '#1e293b', skin: '#ffedd5', shoe: '#1e293b', clip: null },
    accessories: 'headband',
    accentColor: '#f97316',
  },
  elegant: {
    // Stylish with hair clips
    neutral: { outfit: '#be123c', hair: '#f59e0b', skin: '#fbcfe8', shoe: '#1e293b' },
    boy:     { outfit: '#1e3a5f', detail: '#2d5a87', hair: '#92400e', skin: '#fed7aa', shoe: '#1e293b' },
    girl:    { outfit: '#be123c', hair: '#f59e0b', skin: '#ffedd5', shoe: '#1e293b', clip: '#ec4899' },
    accessories: 'clips',
    accentColor: '#ec4899',
  },
  retro: {
    // Vintage with round glasses
    neutral: { outfit: '#92400e', hair: '#451a03', skin: '#fde68a', shoe: '#78350f' },
    boy:     { outfit: '#92400e', detail: '#b45309', hair: '#451a03', skin: '#fde68a', shoe: '#78350f' },
    girl:    { outfit: '#92400e', hair: '#451a03', skin: '#fde68a', shoe: '#78350f', clip: null },
    accessories: 'glasses',
    glassesColor: '#78350f',
  },
  kawaii: {
    // Cute pastel with star clips
    neutral: { outfit: '#c084fc', hair: '#a78bfa', skin: '#fce7f3', shoe: '#7c3aed' },
    boy:     { outfit: '#c084fc', detail: '#a855f7', hair: '#a78bfa', skin: '#fce7f3', shoe: '#7c3aed' },
    girl:    { outfit: '#c084fc', hair: '#a78bfa', skin: '#fce7f3', shoe: '#7c3aed', clip: '#facc15' },
    accessories: 'stars',
    accentColor: '#facc15',
  },
};

// ===== EXPRESSIONS (unchanged — shared by all) =====
const getExpression = (mood) => {
  switch (mood) {
    case 'Excited':
    case 'Happy':
      return (
        <g id="face-happy">
          <ellipse cx="35" cy="45" rx="6" ry="10" fill="#1e293b" />
          <circle cx="35" cy="42" r="3" fill="white" />
          <circle cx="36" cy="48" r="1.5" fill="white" />
          <ellipse cx="65" cy="45" rx="6" ry="10" fill="#1e293b" />
          <circle cx="65" cy="42" r="3" fill="white" />
          <circle cx="66" cy="48" r="1.5" fill="white" />
          <ellipse cx="22" cy="55" rx="8" ry="4" fill="#fb7185" opacity="0.6" />
          <ellipse cx="78" cy="55" rx="8" ry="4" fill="#fb7185" opacity="0.6" />
          <path d="M 40 55 Q 50 65 60 55" fill="none" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
          <path d="M 40 55 Q 50 75 60 55" fill="#f43f5e" />
        </g>
      );
    case 'Sad':
      return (
        <g id="face-sad">
          <path d="M 30 46 Q 35 40 40 45" fill="none" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
          <path d="M 70 46 Q 65 40 60 45" fill="none" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
          <circle cx="33" cy="53" r="4" fill="#38bdf8" opacity="0.8" />
          <circle cx="67" cy="53" r="4" fill="#38bdf8" opacity="0.8" />
          <path d="M 45 60 Q 50 55 55 60" fill="none" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    case 'Stressed':
      return (
        <g id="face-stressed">
          <circle cx="35" cy="45" r="8" fill="white" stroke="#1e293b" strokeWidth="2" />
          <circle cx="35" cy="45" r="2" fill="#1e293b" />
          <circle cx="65" cy="45" r="8" fill="white" stroke="#1e293b" strokeWidth="2" />
          <circle cx="65" cy="45" r="2" fill="#1e293b" />
          <path d="M 25 35 L 45 35 M 28 30 L 42 30" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
          <path d="M 55 35 L 75 35 M 58 30 L 72 30" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
          <path d="M 80 25 Q 85 30 85 35 Q 85 40 80 40 Q 75 40 75 35 Q 75 30 80 25" fill="#38bdf8" opacity="0.8" />
          <path d="M 40 60 L 45 57 L 50 63 L 55 57 L 60 60" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      );
    case 'Anxious':
      return (
        <g id="face-anxious">
          <circle cx="35" cy="45" r="7" fill="white" />
          <circle cx="33" cy="45" r="3" fill="#1e293b" />
          <circle cx="65" cy="45" r="7" fill="white" />
          <circle cx="63" cy="45" r="3" fill="#1e293b" />
          <path d="M 42 60 Q 45 58 47 60 T 52 60 T 57 60" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="25" cy="52" rx="6" ry="3" fill="#f87171" opacity="0.4" />
          <ellipse cx="75" cy="52" rx="6" ry="3" fill="#f87171" opacity="0.4" />
        </g>
      );
    case 'Confused':
      return (
        <g id="face-confused">
          <path d="M 35 45 M 35 43 A 4 4 0 1 1 31 47 A 6 6 0 1 1 41 43" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
          <path d="M 65 45 M 65 43 A 4 4 0 1 1 61 47 A 6 6 0 1 1 71 43" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
          <circle cx="50" cy="58" r="3" fill="none" stroke="#1e293b" strokeWidth="2" />
        </g>
      );
    case 'Bored':
      return (
        <g id="face-bored">
          <circle cx="35" cy="45" r="6" fill="#1e293b" />
          <circle cx="65" cy="45" r="6" fill="#1e293b" />
          <path d="M 25 43 L 45 43 M 55 43 L 75 43" stroke="#e2e8f0" strokeWidth="6" strokeLinecap="round" />
          <line x1="45" y1="58" x2="55" y2="58" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    case 'Neutral':
    default:
      return (
        <g id="face-neutral">
          <ellipse cx="35" cy="45" rx="5" ry="7" fill="#1e293b" />
          <ellipse cx="65" cy="45" rx="5" ry="7" fill="#1e293b" />
          <circle cx="36" cy="43" r="2" fill="white" />
          <circle cx="66" cy="43" r="2" fill="white" />
          <path d="M 45 55 Q 50 60 50 55 Q 50 60 55 55" fill="none" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      );
  }
};

// ===== ACCESSORIES LAYER =====
const renderAccessories = (styleName, palette) => {
  switch (palette.accessories) {
    case 'headband':
      return (
        <path d="M 18 38 Q 50 32 82 38" fill="none" stroke={palette.accentColor} strokeWidth="3" strokeLinecap="round" />
      );
    case 'glasses':
      return (
        <g>
          <circle cx="35" cy="42" r="10" fill="none" stroke={palette.glassesColor} strokeWidth="2.5" />
          <circle cx="65" cy="42" r="10" fill="none" stroke={palette.glassesColor} strokeWidth="2.5" />
          <line x1="45" y1="42" x2="55" y2="42" stroke={palette.glassesColor} strokeWidth="2" />
        </g>
      );
    case 'clips':
      return (
        <g>
          <circle cx="22" cy="28" r="3" fill={palette.accentColor} />
          <circle cx="78" cy="28" r="3" fill={palette.accentColor} />
        </g>
      );
    case 'stars':
      return (
        <g>
          <text x="18" y="30" fontSize="10" fill={palette.accentColor}>★</text>
          <text x="72" y="30" fontSize="10" fill={palette.accentColor}>★</text>
        </g>
      );
    default:
      return null;
  }
};

// ===== CHARACTER RENDERERS =====
// Each takes a color palette from the style and renders the body
const renderNeutral = (c) => (
  <g id="char-neutral">
    <ellipse cx="50" cy="80" rx="30" ry="25" fill={c.outfit} />
    <ellipse cx="35" cy="98" rx="8" ry="4" fill={c.shoe} />
    <ellipse cx="65" cy="98" rx="8" ry="4" fill={c.shoe} />
    <ellipse cx="50" cy="45" rx="35" ry="30" fill={c.skin} />
    <path d="M 15 45 C 15 10 85 10 85 45 C 70 25 30 25 15 45" fill={c.hair} />
    <circle cx="50" cy="18" r="10" fill={c.hair} />
    <circle cx="35" cy="22" r="8" fill={c.hair} />
    <circle cx="65" cy="22" r="8" fill={c.hair} />
  </g>
);

const renderBoy = (c) => (
  <g id="char-boy">
    <path d="M 30 100 Q 50 110 70 100 C 80 80 80 60 70 50 Q 50 55 30 50 C 20 60 20 80 30 100" fill={c.outfit} />
    <circle cx="50" cy="55" r="8" fill={c.detail || c.outfit} />
    <circle cx="35" cy="95" r="6" fill={c.shoe} />
    <circle cx="65" cy="95" r="6" fill={c.shoe} />
    <ellipse cx="50" cy="45" rx="35" ry="30" fill={c.skin} />
    <path d="M 15 40 Q 20 15 50 15 Q 80 15 85 40 Q 75 25 50 25 Q 25 25 15 40" fill={c.hair} />
    <path d="M 30 20 L 25 35 L 35 25 Z" fill={c.hair} />
    <path d="M 50 15 L 45 30 L 55 25 Z" fill={c.hair} />
    <path d="M 70 20 L 65 30 L 75 35 Z" fill={c.hair} />
  </g>
);

const renderGirl = (c) => (
  <g id="char-girl">
    <path d="M 25 100 Q 50 105 75 100 C 70 70 65 50 50 50 C 35 50 30 70 25 100" fill={c.outfit} />
    <circle cx="40" cy="98" r="5" fill={c.shoe} />
    <circle cx="60" cy="98" r="5" fill={c.shoe} />
    <ellipse cx="50" cy="45" rx="35" ry="30" fill={c.skin} />
    <circle cx="20" cy="40" r="15" fill={c.hair} />
    <circle cx="80" cy="40" r="15" fill={c.hair} />
    <path d="M 15 40 Q 20 15 50 15 Q 80 15 85 40 Q 75 25 50 20 Q 25 25 15 40" fill={c.hair} />
    <path d="M 25 25 Q 50 35 75 25 Q 50 15 25 25" fill={c.hair} />
  </g>
);

export default function MoodAvatar({ character, avatarStyle, mood = 'Neutral', size = 100, style = {} }) {
  const { user } = useUser();
  const charToUse = character || user?.avatarCharacter || 'neutral';
  const styleToUse = avatarStyle || user?.avatarStyle || 'classic';

  // Get palette for this character + style combo
  const stylePalette = STYLE_PALETTES[styleToUse] || STYLE_PALETTES.classic;
  const colors = stylePalette[charToUse] || stylePalette.neutral;

  const renderCharacter = () => {
    switch (charToUse.toLowerCase()) {
      case 'boy': return renderBoy(colors);
      case 'girl': return renderGirl(colors);
      case 'neutral':
      default: return renderNeutral(colors);
    }
  };

  return (
    <div style={{ width: size, height: size, ...style }} className="mood-avatar">
      <svg viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
        {renderCharacter()}
        {getExpression(mood)}
        {renderAccessories(styleToUse, stylePalette)}
      </svg>
    </div>
  );
}
