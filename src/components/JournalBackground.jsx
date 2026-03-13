import React from 'react';
import '../index.css';

export default function JournalBackground() {
  return (
    <div className="journal-aesthetic-bg">
      {/* Soft floating feather SVG */}
      <svg 
        className="journal-feather" 
        viewBox="0 0 400 300" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="featherGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#eedeed" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#d3c0e5" stopOpacity="0.3" />
          </linearGradient>
          <filter id="softBlur" x="-20%" y="-20%" width="140%" height="140%">
             <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>
        
        <g transform="rotate(35, 200, 150) translate(-30, -50)" filter="url(#softBlur)" opacity="0.9">
          {/* Main feather body */}
          <path d="M150,250 C120,200 130,120 180,70 C230,20 300,30 350,20 C320,80 300,160 250,200 C200,240 170,260 150,250 Z" fill="url(#featherGrad)" />
          {/* Feather spine */}
          <path d="M140,260 Q200,180 350,20" fill="none" stroke="#ffffff" strokeWidth="3" opacity="0.5" strokeLinecap="round" />
        </g>
      </svg>

      {/* Elegant fountain pen SVG */}
      <svg 
        className="journal-pen" 
        viewBox="0 0 500 500" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="penBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a2b4c" />
            <stop offset="50%" stopColor="#2c426a" />
            <stop offset="100%" stopColor="#111c33" />
          </linearGradient>
          
          <linearGradient id="penSilver" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e0e0e0" />
            <stop offset="50%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#b0b0b0" />
          </linearGradient>

          <filter id="shadowGlow" x="-20%" y="-20%" width="140%" height="140%">
             <feDropShadow dx="-10" dy="15" stdDeviation="6" floodColor="#86747d" floodOpacity="0.3"/>
          </filter>
        </defs>

        {/* Rotate the entire pen assembly */}
        <g transform="translate(140, 360) rotate(-40) scale(1.1)" filter="url(#shadowGlow)">
          {/* Main Body */}
          <path d="M0,0 L20,-160 L38,-160 L48,0 C48,15 35,30 24,30 C13,30 0,15 0,0 Z" fill="url(#penBodyGrad)" />
          
          {/* Silver Mid Ring */}
          <rect x="20" y="-160" width="18" height="6" fill="url(#penSilver)" />
          <rect x="18" y="-164" width="22" height="2" fill="url(#penSilver)" />
          
          {/* Upper Body (Cap) */}
          <path d="M20,-164 L22,-240 C22,-250 29,-250 29,-250 C29,-250 36,-250 36,-240 L38,-164 Z" fill="url(#penBodyGrad)" />

          {/* Golden/Silver Nib Base connected to main body */}
          <path d="M12,24 L36,24 L32,50 L16,50 Z" fill="url(#penSilver)" />
          <path d="M16,50 L32,50 L24,75 Z" fill="url(#penSilver)" />

          {/* Nib split detail */}
          <line x1="24" y1="50" x2="24" y2="72" stroke="#4a5342" strokeWidth="1" />
          <circle cx="24" cy="50" r="1.5" fill="#1a2b4c" />

          {/* Bottom Cap/Finial detail */}
          <path d="M24,-250 L24,-255 C24,-258 29,-258 29,-255 L29,-250 Z" fill="url(#penSilver)" />
          {/* Clip */}
          <path d="M36,-240 L42,-240 L38,-180 L36,-180 Z" fill="url(#penSilver)" />
        </g>
      </svg>

      {/* Inspirational Text matching reference slightly repositioned for mobile flow */}
      <div className="journal-aesthetic-text">
        Reflect, grow, and<br/>find calm every day
      </div>

    </div>
  );
}
