import React from 'react';

export default function MeditatorIllustration({ width = 300, height = 300, className = "" }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 500 400" 
      width={width} 
      height={height} 
      className={className}
    >
      <defs>
        {/* Soft gradient background */}
        <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="#f5f7f2" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#eef1eb" stopOpacity="0" />
        </radialGradient>
        
        {/* Breath path definition */}
        <path id="breathPath" d="M 280 270 Q 300 250 320 270 T 360 260" fill="none" />
      </defs>

      {/* Main glow behind character */}
      <circle cx="250" cy="220" r="150" fill="url(#bgGlow)" />

      {/* Background leaves (lighter/muted) */}
      <g fill="#c5d5b8" opacity="0.6">
        <path d="M 50 350 Q 80 280 60 200 Q 30 250 50 350" />
        <path d="M 450 330 Q 420 260 440 180 Q 470 230 450 330" />
        <path d="M 120 380 Q 150 300 130 220 Q 90 280 120 380" />
      </g>

      {/* Foreground leaves (darker sage) */}
      <g fill="#7e9e73">
        {/* Left tall stalk */}
        <path d="M 100 400 Q 180 300 120 180" fill="none" stroke="#7e9e73" strokeWidth="6" strokeLinecap="round" />
        <path d="M 135 285 Q 110 320 125 350 Q 150 320 135 285" />
        <path d="M 155 240 Q 170 200 140 190 Q 130 220 155 240" />
        
        {/* Lower left leaf */}
        <path d="M 50 400 Q 90 350 110 400 Z" />
        
        {/* Right stalks */}
        <path d="M 400 400 Q 450 340 420 250" fill="none" stroke="#7e9e73" strokeWidth="6" strokeLinecap="round" />
        <path d="M 410 320 Q 380 340 400 370 Q 430 350 410 320" />
        
        {/* Lower right cluster */}
        <path d="M 450 400 Q 480 360 460 380 Z" />
        <path d="M 380 400 Q 360 360 390 370 Z" />
      </g>

      {/* Character Base */}
      <g id="meditator" transform="translate(250, 240)">
        
        {/* Torso/Shirt - Sage Green */}
        <path d="M -90 160 Q -80 70 0 60 Q 80 70 90 160 Z" fill="#b9e0bd" />
        
        {/* Collar */}
        <path d="M -25 60 Q 0 80 25 60" fill="none" stroke="#a3cab0" strokeWidth="4" strokeLinecap="round" />

        {/* Neck */}
        <rect x="-18" y="20" width="36" height="45" fill="#e1ad96" />
        {/* Neck shadow */}
        <path d="M -18 20 Q 0 40 18 20 L 18 40 L -18 40 Z" fill="#cf9984" opacity="0.5" />

        {/* Head Base */}
        <ellipse cx="0" cy="-20" rx="45" ry="55" fill="#fbd3c3" />

        {/* Ears */}
        <ellipse cx="-48" cy="-10" rx="8" ry="12" fill="#fbd3c3" />
        <ellipse cx="48" cy="-10" rx="8" ry="12" fill="#fbd3c3" />

        {/* Hair Back / Headband Wrap */}
        <path d="M -50 -40 Q -60 -10 -45 10 L -55 -10 Q -60 -50 -30 -60 Z" fill="#334155" />
        <path d="M 50 -40 Q 60 -10 45 10 L 55 -10 Q 60 -50 30 -60 Z" fill="#334155" />

        {/* Hair Top / Bangs */}
        <path d="M -42 -52 Q 0 -70 42 -52 Q 20 -25 0 -35 Q -20 -25 -42 -52 Z" fill="#334155" />

        {/* White Headband */}
        <path d="M -48 -45 Q 0 -85 48 -45 Q 40 -65 0 -75 Q -40 -65 -48 -45 Z" fill="#ffffff" />

        {/* Face Details */}
        {/* Closed Eyes */}
        <path d="M -25 -5 Q -15 0 -5 -5" fill="none" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
        <path d="M 5 -5 Q 15 0 25 -5" fill="none" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
        
        {/* Eyebrows */}
        <path d="M -25 -20 Q -15 -25 -5 -20" fill="none" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
        <path d="M 5 -20 Q 15 -25 25 -20" fill="none" stroke="#334155" strokeWidth="4" strokeLinecap="round" />

        {/* Nose */}
        <path d="M 5 5 Q 12 15 5 20 M 5 20 L 0 20" fill="none" stroke="#cf9984" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Rosy Cheeks */}
        <circle cx="-25" cy="15" r="8" fill="#ff9b9b" opacity="0.5" />
        <circle cx="28" cy="15" r="8" fill="#ff9b9b" opacity="0.5" />

        {/* Peaceful Smile */}
        <path d="M -8 30 Q 0 38 8 30" fill="none" stroke="#d58673" strokeWidth="2.5" strokeLinecap="round" />

        {/* Breath Swoosh */}
        <g transform="translate(30, 10)">
          <path d="M 0 10 Q 20 -10 40 10 T 80 0" fill="none" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" opacity="0.8" />
          <path d="M -5 15 Q 15 -5 35 15 T 75 5" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
          
          {/* Sparkles */}
          <circle cx="75" cy="8" r="2" fill="#ffffff" />
          <circle cx="85" cy="2" r="1.5" fill="#ffffff" opacity="0.6" />
          <circle cx="90" cy="12" r="2" fill="#ffffff" opacity="0.8" />
        </g>
      </g>
    </svg>
  );
}
