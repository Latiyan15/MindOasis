import React from 'react';

export default function BurnoutIllustration() {
  return (
    <svg 
      className="burnout-illustration" 
      viewBox="0 0 600 600" 
      width="100%" 
      height="auto" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Soft floating animation for orbital icons */}
        <style>
          {`
            @keyframes floatOrb {
              0% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-8px) rotate(2deg); }
              100% { transform: translateY(0px) rotate(0deg); }
            }
            .orb-icon { animation: floatOrb 6s ease-in-out infinite; transform-origin: center; }
            
            @keyframes steamFloat {
              0% { opacity: 0; transform: translateY(0) scale(0.8); }
              50% { opacity: 0.6; transform: translateY(-15px) scale(1.1); }
              100% { opacity: 0; transform: translateY(-30px) scale(1.3); }
            }
            .coffee-steam path { animation: steamFloat 4s infinite linear; }
            .coffee-steam path:nth-child(2) { animation-delay: 1.5s; }
            .coffee-steam path:nth-child(3) { animation-delay: 3s; }
          `}
        </style>
        
        <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
           <feGaussianBlur stdDeviation="6" result="blur" />
           <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>

        <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d5e2d1" />
          <stop offset="100%" stopColor="#aecab3" />
        </linearGradient>
      </defs>

      {/* Surrounding Foliage (Background) */}
      <g className="burn-foliage-bg" fill="url(#leafGrad)" opacity="0.6" transform="translate(50, 250)">
        <path d="M50,250 C30,150 100,80 150,100 C180,110 160,180 100,220 Z"/>
        <path d="M80,260 C20,200 60,100 120,130 C150,140 130,220 80,240 Z" fill="#b9d0bf" />
        <path d="M400,250 C450,150 350,80 300,100 C270,110 280,180 350,220 Z" />
        <path d="M420,260 C480,200 440,100 380,130 C350,140 360,220 400,240 Z" fill="#b9d0bf" />
      </g>

      {/* Ground Shadow */}
      <ellipse cx="300" cy="500" rx="200" ry="25" fill="#dfe5d7" opacity="0.8" />

      {/* Coffee Cup & Steam */}
      <g transform="translate(450, 450)">
        {/* Shadow */}
        <ellipse cx="25" cy="45" rx="30" ry="10" fill="#cdd8c8" />
        {/* Handle */}
        <path d="M40,15 C60,15 60,35 40,35" fill="none" stroke="#f4f6f1" strokeWidth="6" strokeLinecap="round" />
        {/* Cup Body */}
        <path d="M0,0 L50,0 C50,30 40,40 25,40 C10,40 0,30 0,0 Z" fill="#fcfdfb" />
        <path d="M5,0 L45,0 C45,25 35,35 25,35 C15,35 5,25 5,0 Z" fill="#f4f6f1" />
        {/* Steam */}
        <g className="coffee-steam" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.6">
          <path d="M15,-10 C10,-20 20,-30 15,-40" />
          <path d="M25,-5  C20,-15 30,-25 25,-35" />
          <path d="M35,-15 C30,-25 40,-35 35,-45" />
        </g>
      </g>

      {/* The Meditating/Writing Boy */}
      <g transform="translate(200, 220)">
        
        {/* Legs / Pants */}
        <path d="M -50 250 C -100 250 -50 200 50 220 C 150 200 200 250 200 260 L -50 260 Z" fill="#c3c2b8" />
        <path d="M 50 220 C -20 230 -80 230 -20 260 C 40 250 80 250 120 250 C 180 230 120 230 50 220 Z" fill="#cfcdbf" />
        
        {/* Shoes */}
        <path d="M -40 240 C -60 250 -50 270 -20 260 Z" fill="#8ca08b" />
        <path d="M 140 240 C 160 250 150 270 120 260 Z" fill="#8ca08b" />
        <path d="M -35 260 L -25 260 M 135 260 L 125 260" stroke="#f0f0f0" strokeWidth="3" />

        {/* Body / Shirt */}
        <path d="M 20 100 C -20 120 -10 200 10 220 L 90 220 C 110 200 120 120 80 100 Z" fill="#b9dcae" />
        <path d="M 40 100 L 60 100 L 50 120 Z" fill="#a4c99a" opacity="0.5" />
        
        {/* Neck */}
        <rect x="42" y="80" width="16" height="25" fill="#ffd1b5" />

        {/* Head / Face */}
        <circle cx="50" cy="70" r="30" fill="#ffd1b5" />
        <path d="M 22 70 C 22 90 35 105 50 105 C 65 105 78 90 78 70" fill="#ffd1b5" />
        {/* Ear */}
        <circle cx="80" cy="75" r="7" fill="#f2c1a3" />

        {/* Hair */}
        <path d="M 15 70 C 10 40 30 25 50 25 C 75 25 85 40 85 65 C 85 50 75 35 50 35 C 30 35 25 45 20 70 Z" fill="#364155" />
        <path d="M 50 25 C 30 25 15 40 15 60 C 25 40 40 30 60 40 C 80 30 85 50 85 70 C 85 45 70 25 50 25 Z" fill="#445169" />
        <path d="M 25 45 C 35 55 40 45 45 55" fill="none" stroke="#2a3344" strokeWidth="4" strokeLinecap="round" />
        
        {/* Eyes (Looking down happily) */}
        <path d="M 35 65 Q 40 70 45 65" fill="none" stroke="#2d221c" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 55 65 Q 60 70 65 65" fill="none" stroke="#2d221c" strokeWidth="2.5" strokeLinecap="round" />
        
        {/* Eyebrows */}
        <path d="M 32 58 Q 38 55 42 58" fill="none" stroke="#364155" strokeWidth="3" strokeLinecap="round" />
        <path d="M 52 58 Q 58 55 62 58" fill="none" stroke="#364155" strokeWidth="3" strokeLinecap="round" />

        {/* Nose */}
        <path d="M 48 72 L 46 80 L 50 82" fill="none" stroke="#dca98b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {/* Smile */}
        <path d="M 42 90 Q 48 95 55 90" fill="none" stroke="#b67160" strokeWidth="2.5" strokeLinecap="round" />

        {/* Blush */}
        <ellipse cx="32" cy="80" rx="6" ry="4" fill="#ff9b86" opacity="0.4" />
        <ellipse cx="68" cy="80" rx="6" ry="4" fill="#ff9b86" opacity="0.4" />

        {/* Left Arm holding pen */}
        <path d="M 10 120 C -20 150 -10 180 20 160" fill="none" stroke="#b9dcae" strokeWidth="20" strokeLinecap="round" />
        <circle cx="20" cy="160" r="10" fill="#ffd1b5" />
        <path d="M 15 160 L 5 140" stroke="#3b5550" strokeWidth="3" strokeLinecap="round" /> {/* Pen */}

        {/* Clipboard */}
        <g transform="translate(10, 20) rotate(-25, 40, 195)">
          <rect x="0" y="150" width="85" height="100" rx="5" fill="#c3baad" stroke="#a49989" strokeWidth="2" />
          <rect x="5" y="155" width="75" height="90" rx="3" fill="#fdfbf5" />
          {/* Clipboard Clip */}
          <rect x="25" y="145" width="35" height="12" rx="3" fill="#9db19a" />
        </g>
        
        {/* Right Arm holding clipboard */}
        <path d="M 90 120 C 130 150 110 200 70 185" fill="none" stroke="#b9dcae" strokeWidth="20" strokeLinecap="round" />
        <circle cx="70" cy="185" r="10" fill="#ffd1b5" />

      </g>

      {/* Foreground Foliage (overlapping the boy slightly) */}
      <g className="burn-foliage-fg" fill="url(#leafGrad)" opacity="0.9" transform="translate(150, 420)">
        <path d="M -50 80 C -80 -20 0 -50 30 -30 C 50 -10 20 50 -20 80 Z" fill="#94b89a" />
        <path d="M 300 80 C 350 -20 250 -50 200 -30 C 180 -10 220 50 250 80 Z" />
        <path d="M 320 90 C 280 10 360 0 380 30 C 390 50 350 80 320 90 Z" fill="#94b89a" />
      </g>

      {/* Floating Orbital Icons (Arching above him) */}
      <g className="orbital-icons" stroke="#fff" strokeWidth="0.5">
        
        {/* 1. Heart (Left Low) */}
        <g transform="translate(60, 320)">
          <g className="orb-icon" style={{ animationDelay: '0s' }}>
            <circle cx="0" cy="0" r="25" fill="#fdf9f1" filter="url(#softGlow)" />
            <path d="M -8 -4 C -12 -8 -18 -4 -12 2 L 0 12 L 12 2 C 18 -4 12 -8 8 -4 C 4 0 0 4 0 4 C 0 4 -4 0 -8 -4 Z" fill="#d2ccbf" />
          </g>
        </g>

        {/* 2. Dumbbell (Mid Left) */}
        <g transform="translate(100, 190)">
          <g className="orb-icon" style={{ animationDelay: '1s' }}>
            <circle cx="0" cy="0" r="30" fill="#eaf3ee" filter="url(#softGlow)" />
            <g fill="#a2cdad">
              <rect x="-15" y="-3" width="30" height="6" rx="2" />
              <rect x="-18" y="-10" width="6" height="20" rx="2" />
              <rect x="12" y="-10" width="6" height="20" rx="2" />
              <rect x="-22" y="-6" width="4" height="12" rx="1" />
              <rect x="18" y="-6" width="4" height="12" rx="1" />
            </g>
          </g>
        </g>

        {/* 3. Red Heart Bubble (Top Center-Left) */}
        <g transform="translate(200, 100)">
          <g className="orb-icon" style={{ animationDelay: '2.5s' }}>
            <circle cx="0" cy="0" r="35" fill="#fcf6f3" filter="url(#softGlow)" />
            <path d="M -12 -6 C -18 -12 -26 -6 -18 4 L 0 20 L 18 4 C 26 -6 18 -12 12 -6 C 6 0 0 6 0 6 C 0 6 -6 0 -12 -6 Z" fill="#e5988e" />
          </g>
        </g>

        {/* 4. Smiley Chat Bubble (Top Center-Right) */}
        <g transform="translate(350, 80)">
          <g className="orb-icon" style={{ animationDelay: '0.5s' }}>
            <path d="M 0 -40 C 30 -40 50 -20 50 0 C 50 20 30 40 0 40 C -15 40 -25 35 -35 40 C -35 40 -30 25 -35 15 C -45 0 -30 -40 0 -40 Z" fill="#bedbaa" filter="url(#softGlow)" />
            {/* Smiley Face */}
            <path d="M -15 -10 Q -10 -15 -5 -10" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
            <path d="M 5 -10 Q 10 -15 15 -10" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
            <path d="M -15 5 Q 0 20 15 5" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
          </g>
        </g>

        {/* 5. Trophy/Lightbulb (Mid Right) */}
        <g transform="translate(480, 160)">
          <g className="orb-icon" style={{ animationDelay: '3s' }}>
            <circle cx="0" cy="0" r="25" fill="#fdfbf5" filter="url(#softGlow)" />
            <g fill="none" stroke="#d5c7a5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M -10 -5 L 10 -5 L 5 10 L -5 10 Z" fill="#f3efe5"/>
              <path d="M -10 -5 C -15 -5 -15 5 -10 5" />
              <path d="M 10 -5 C 15 -5 15 5 10 5" />
              <line x1="0" y1="10" x2="0" y2="15" />
              <line x1="-8" y1="15" x2="8" y2="15" />
            </g>
          </g>
        </g>

        {/* 6. Lotus (Bottom Right) */}
        <g transform="translate(560, 290)">
          <g className="orb-icon" style={{ animationDelay: '1.5s' }}>
            <circle cx="0" cy="0" r="25" fill="#faf5f6" filter="url(#softGlow)" />
            <g fill="#e3b4b5" opacity="0.9">
              <path d="M 0 5 C -10 -10 -20 0 0 15 C 20 0 10 -10 0 5 Z" />
              <path d="M 0 10 C -15 -5 -25 10 -5 15 C -5 5 -10 5 0 10 Z" />
              <path d="M 0 10 C 15 -5 25 10 5 15 C 5 5 10 5 0 10 Z" />
            </g>
          </g>
        </g>

      </g>
      
    </svg>
  );
}
