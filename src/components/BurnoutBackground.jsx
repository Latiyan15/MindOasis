import React from 'react';
import '../index.css';

export default function BurnoutBackground() {
  return (
    <div className="burnout-aesthetic-bg">
      <svg 
        className="burnout-waves" 
        viewBox="0 0 1000 600" 
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="burnGradMain" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e2eadb" /> {/* Sage */}
            <stop offset="50%" stopColor="#fdf7ed" /> {/* Sand/Peach */}
            <stop offset="100%" stopColor="#dcd7df" /> {/* Lavender/Dusty Rose */}
          </linearGradient>

          <linearGradient id="waveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.0)" />
          </linearGradient>

          <filter id="softBlur" x="-20%" y="-20%" width="140%" height="140%">
             <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>

        {/* Base Gradient Fill */}
        <rect width="100%" height="100%" fill="url(#burnGradMain)" />

        {/* Flowing Waves Layers */}
        <g stroke="rgba(255,255,255,0.6)" strokeWidth="1" fill="url(#waveGrad)">
          <path className="burn-wave-1" d="M0,100 C200,150 400,50 600,100 C800,150 900,100 1000,80 L1000,600 L0,600 Z" opacity="0.6"/>
          <path className="burn-wave-2" d="M0,200 C300,150 500,250 700,200 C900,150 950,220 1000,250 L1000,600 L0,600 Z" opacity="0.4"/>
          <path className="burn-wave-3" d="M0,350 C250,400 450,300 650,380 C850,450 900,320 1000,350 L1000,600 L0,600 Z" opacity="0.7"/>
          <path className="burn-wave-4" d="M0,450 C200,500 400,420 700,520 C850,560 950,480 1000,500 L1000,600 L0,600 Z" opacity="0.8"/>
        </g>

        {/* Subtle radial light blobs */}
        <circle cx="200" cy="200" r="150" fill="rgba(255,255,255,0.4)" filter="url(#softBlur)" />
        <circle cx="800" cy="400" r="200" fill="rgba(255,255,255,0.3)" filter="url(#softBlur)" />
      </svg>

      {/* CSS Animated Sparkles */}
      <div className="burn-sparkles-container">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="burn-sparkle" 
            style={{ 
              left: `${Math.random() * 100}%`, 
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              opacity: Math.random() * 0.5 + 0.3
            }} 
          />
        ))}
        {/* Soft floating orbs */}
        {[...Array(6)].map((_, i) => (
          <div 
            key={`orb-${i}`}
            className="burn-orb"
            style={{
              left: `${Math.random() * 100}%`, 
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              width: `${Math.random() * 60 + 20}px`,
              height: `${Math.random() * 60 + 20}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
