import React, { useEffect, useState } from 'react';
import { Leaf } from 'lucide-react';
import MoodAvatar from './MoodAvatar';

const MOODS = ['Sad', 'Anxious', 'Excited', 'Stressed', 'Confused', 'Bored', 'Neutral'];

export default function TransitionScreen({ onComplete }) {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Start fade out after ~3.5 seconds
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 3500);

    // Completely unmount and call onComplete after fade out animation completes
    const removeTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 4300); // 3500 + 800ms fade duration

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [onComplete]);

  return (
    <div className={`transition-screen ${isFadingOut ? 'transition-fade-out' : ''}`}>
      {/* Background Flowing Waves SVG */}
      <div className="transition-wave-container">
        <svg viewBox="0 0 1440 800" className="transition-wave-svg" preserveAspectRatio="xMidYMax slice">
          <g className="transition-wave-layer-1">
            <path fill="#e0f2fe" fillOpacity="0.8" d="M0,400 C320,300 420,500 720,400 C1020,300 1200,450 1440,350 L1440,800 L0,800 Z" />
          </g>
          <g className="transition-wave-layer-2">
            <path fill="#ccfbf1" fillOpacity="0.7" d="M0,500 C280,600 500,400 720,500 C940,600 1150,450 1440,550 L1440,800 L0,800 Z" />
          </g>
          <g className="transition-wave-layer-3">
            <path fill="#99f6e4" fillOpacity="0.6" d="M0,600 C300,500 450,700 720,600 C990,500 1150,650 1440,580 L1440,800 L0,800 Z" />
          </g>
          <g className="transition-wave-layer-4">
            <path fill="#ffffff" fillOpacity="0.5" d="M0,650 C250,750 600,600 800,700 C1000,800 1200,650 1440,750 L1440,800 L0,800 Z" />
          </g>
        </svg>
        <svg viewBox="0 0 1440 800" className="transition-wave-svg transition-wave-svg-clone" preserveAspectRatio="xMidYMax slice">
          <g className="transition-wave-layer-1">
            <path fill="#e0f2fe" fillOpacity="0.8" d="M0,400 C320,300 420,500 720,400 C1020,300 1200,450 1440,350 L1440,800 L0,800 Z" />
          </g>
          <g className="transition-wave-layer-2">
            <path fill="#ccfbf1" fillOpacity="0.7" d="M0,500 C280,600 500,400 720,500 C940,600 1150,450 1440,550 L1440,800 L0,800 Z" />
          </g>
          <g className="transition-wave-layer-3">
            <path fill="#99f6e4" fillOpacity="0.6" d="M0,600 C300,500 450,700 720,600 C990,500 1150,650 1440,580 L1440,800 L0,800 Z" />
          </g>
          <g className="transition-wave-layer-4">
            <path fill="#ffffff" fillOpacity="0.5" d="M0,650 C250,750 600,600 800,700 C1000,800 1200,650 1440,750 L1440,800 L0,800 Z" />
          </g>
        </svg>
      </div>

      {/* Floating Particles */}
      <div className="transition-particles">
        {Array.from({ length: 15 }).map((_, i) => (
          <div 
            key={i} 
            className="transition-particle" 
            style={{ 
              left: `${Math.random() * 100}%`, 
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 3}s`
            }} 
          />
        ))}
      </div>

      {/* Header Content */}
      <div className="transition-header">
        <div className="transition-logo-container">
          <Leaf size={32} color="#5a7a4c" fill="#5a7a4c" className="transition-logo-icon" />
          <h1 className="transition-title">MindOasis</h1>
        </div>
        <p className="transition-subtitle">Preparing your space…</p>
      </div>

      {/* Mood Avatars */}
      <div className="transition-avatars-container">
        {MOODS.map((mood, index) => (
          <div 
            key={mood} 
            className="transition-avatar-wrapper"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <MoodAvatar character="neutral" avatarStyle="classic" mood={mood} size={60} />
          </div>
        ))}
      </div>
    </div>
  );
}
