import React from 'react';
import { useUser } from '../context/UserContext';

// Shared Anime-style Facial Expressions
const getExpression = (mood) => {
  switch (mood) {
    case 'Excited':
    case 'Happy':
      return (
        <g id="face-happy">
          {/* Sparkly Anime Eyes */}
          <ellipse cx="35" cy="45" rx="6" ry="10" fill="#1e293b" />
          <circle cx="35" cy="42" r="3" fill="white" />
          <circle cx="36" cy="48" r="1.5" fill="white" />
          
          <ellipse cx="65" cy="45" rx="6" ry="10" fill="#1e293b" />
          <circle cx="65" cy="42" r="3" fill="white" />
          <circle cx="66" cy="48" r="1.5" fill="white" />
          
          {/* Blushing Cheeks */}
          <ellipse cx="22" cy="55" rx="8" ry="4" fill="#fb7185" opacity="0.6" />
          <ellipse cx="78" cy="55" rx="8" ry="4" fill="#fb7185" opacity="0.6" />
          
          {/* Big open smile */}
          <path d="M 40 55 Q 50 65 60 55" fill="none" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
          <path d="M 40 55 Q 50 75 60 55" fill="#f43f5e" />
        </g>
      );
    case 'Sad':
      return (
        <g id="face-sad">
          {/* Tilted sad eyes */}
          <path d="M 30 46 Q 35 40 40 45" fill="none" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
          <path d="M 70 46 Q 65 40 60 45" fill="none" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
          
          {/* Anime Tears */}
          <circle cx="33" cy="53" r="4" fill="#38bdf8" opacity="0.8" />
          <circle cx="67" cy="53" r="4" fill="#38bdf8" opacity="0.8" />
          
          {/* Trembling pout */}
          <path d="M 45 60 Q 50 55 55 60" fill="none" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    case 'Stressed':
      return (
        <g id="face-stressed">
          {/* Intense panicked eyes */}
          <circle cx="35" cy="45" r="8" fill="white" stroke="#1e293b" strokeWidth="2" />
          <circle cx="35" cy="45" r="2" fill="#1e293b" />
          
          <circle cx="65" cy="45" r="8" fill="white" stroke="#1e293b" strokeWidth="2" />
          <circle cx="65" cy="45" r="2" fill="#1e293b" />
          
          {/* Anime stress lines/shadow over eyes */}
          <path d="M 25 35 L 45 35 M 28 30 L 42 30" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
          <path d="M 55 35 L 75 35 M 58 30 L 72 30" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
          
          {/* Anime Sweat Drop */}
          <path d="M 80 25 Q 85 30 85 35 Q 85 40 80 40 Q 75 40 75 35 Q 75 30 80 25" fill="#38bdf8" opacity="0.8" />
          
          {/* Zigzag mouth */}
          <path d="M 40 60 L 45 57 L 50 63 L 55 57 L 60 60" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      );
    case 'Anxious':
      return (
        <g id="face-anxious">
          {/* Nervous trembling eyes */}
          <circle cx="35" cy="45" r="7" fill="white" />
          <circle cx="33" cy="45" r="3" fill="#1e293b" /> {/* Looking away nervously */}
          
          <circle cx="65" cy="45" r="7" fill="white" />
          <circle cx="63" cy="45" r="3" fill="#1e293b" />
          
          {/* Nervous squiggly mouth */}
          <path d="M 42 60 Q 45 58 47 60 T 52 60 T 57 60" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
          
          {/* Blush/flush of anxiety */}
          <ellipse cx="25" cy="52" rx="6" ry="3" fill="#f87171" opacity="0.4" />
          <ellipse cx="75" cy="52" rx="6" ry="3" fill="#f87171" opacity="0.4" />
        </g>
      );
    case 'Confused':
      return (
        <g id="face-confused">
          {/* Swirl anime eyes */}
          <path d="M 35 45 M 35 43 A 4 4 0 1 1 31 47 A 6 6 0 1 1 41 43" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
          <path d="M 65 45 M 65 43 A 4 4 0 1 1 61 47 A 6 6 0 1 1 71 43" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
          
          {/* Little confused mouth */}
          <circle cx="50" cy="58" r="3" fill="none" stroke="#1e293b" strokeWidth="2" />
        </g>
      );
    case 'Bored':
      return (
        <g id="face-bored">
          {/* Half-lidded deadpan eyes */}
          <circle cx="35" cy="45" r="6" fill="#1e293b" />
          <circle cx="65" cy="45" r="6" fill="#1e293b" />
          <path d="M 25 43 L 45 43 M 55 43 L 75 43" stroke="#e2e8f0" strokeWidth="6" strokeLinecap="round" />
          
          {/* Bored straight mouth */}
          <line x1="45" y1="58" x2="55" y2="58" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    case 'Neutral':
    default:
      return (
        <g id="face-neutral">
          {/* Cute normal eyes */}
          <ellipse cx="35" cy="45" rx="5" ry="7" fill="#1e293b" />
          <ellipse cx="65" cy="45" rx="5" ry="7" fill="#1e293b" />
          <circle cx="36" cy="43" r="2" fill="white" />
          <circle cx="66" cy="43" r="2" fill="white" />
          
          {/* Little cat-like smile */}
          <path d="M 45 55 Q 50 60 50 55 Q 50 60 55 55" fill="none" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      );
  }
};

export default function MoodAvatar({ character, mood = 'Neutral', size = 100, style = {} }) {
  const { user } = useUser();
  const avatarToUse = character || user?.avatar || 'neutral';
  
  const renderCharacter = () => {
    switch (avatarToUse.toLowerCase()) {
      case 'boy':
        return (
          <g id="char-boy">
            {/* Chubby Body */}
            <path d="M 30 100 Q 50 110 70 100 C 80 80 80 60 70 50 Q 50 55 30 50 C 20 60 20 80 30 100" fill="#94a3b8" />
            <circle cx="50" cy="55" r="8" fill="#cbd5e1" /> {/* Hoodie detail */}
            
            {/* Tiny Limbs */}
            <circle cx="35" cy="95" r="6" fill="#1e293b" /> {/* Shoe */}
            <circle cx="65" cy="95" r="6" fill="#1e293b" /> {/* Shoe */}
            
            {/* Very Chubby Oversized Head */}
            <ellipse cx="50" cy="45" rx="35" ry="30" fill="#fed7aa" /> {/* Skin */}
            
            {/* Anime Boy Messy Hair */}
            <path d="M 15 40 Q 20 15 50 15 Q 80 15 85 40 Q 75 25 50 25 Q 25 25 15 40" fill="#3b82f6" />
            <path d="M 30 20 L 25 35 L 35 25 Z" fill="#3b82f6" />
            <path d="M 50 15 L 45 30 L 55 25 Z" fill="#3b82f6" />
            <path d="M 70 20 L 65 30 L 75 35 Z" fill="#3b82f6" />
          </g>
        );
      case 'girl':
        return (
          <g id="char-girl">
            {/* Chubby Body / Dress */}
            <path d="M 25 100 Q 50 105 75 100 C 70 70 65 50 50 50 C 35 50 30 70 25 100" fill="#f43f5e" />
            
            {/* Tiny Limbs */}
            <circle cx="40" cy="98" r="5" fill="#1e293b" /> {/* Shoe */}
            <circle cx="60" cy="98" r="5" fill="#1e293b" /> {/* Shoe */}
            
            {/* Very Chubby Oversized Head */}
            <ellipse cx="50" cy="45" rx="35" ry="30" fill="#ffedd5" /> {/* Skin */}
            
            {/* Anime Girl Twintails/Bangs */}
            {/* Back hair/tails */}
            <circle cx="20" cy="40" r="15" fill="#fcd34d" />
            <circle cx="80" cy="40" r="15" fill="#fcd34d" />
            {/* Bangs */}
            <path d="M 15 40 Q 20 15 50 15 Q 80 15 85 40 Q 75 25 50 20 Q 25 25 15 40" fill="#fcd34d" />
            <path d="M 25 25 Q 50 35 75 25 Q 50 15 25 25" fill="#fcd34d" />
          </g>
        );
      case 'neutral':
      default:
        return (
          <g id="char-neutral">
            {/* Chubby Body / Sweater */}
            <ellipse cx="50" cy="80" rx="30" ry="25" fill="#10b981" />
            
            {/* Tiny Limbs */}
            <ellipse cx="35" cy="98" rx="8" ry="4" fill="#1e293b" />
            <ellipse cx="65" cy="98" rx="8" ry="4" fill="#1e293b" />
            
            {/* Very Chubby Oversized Head */}
            <ellipse cx="50" cy="45" rx="35" ry="30" fill="#fbcfe8" /> {/* Skin Tone */}
            
            {/* Short Fluffy Anime Hair */}
            <path d="M 15 45 C 15 10 85 10 85 45 C 70 25 30 25 15 45" fill="#64748b" />
            <circle cx="50" cy="18" r="10" fill="#64748b" />
            <circle cx="35" cy="22" r="8" fill="#64748b" />
            <circle cx="65" cy="22" r="8" fill="#64748b" />
          </g>
        );
    }
  };

  return (
    <div style={{ width: size, height: size, ...style }} className="mood-avatar">
      <svg viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
        {renderCharacter()}
        {getExpression(mood)}
      </svg>
    </div>
  );
}
