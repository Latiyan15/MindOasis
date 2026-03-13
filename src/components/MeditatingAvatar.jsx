export default function MeditatingAvatar() {
  return (
    <svg viewBox="0 0 200 180" width="100%" style={{ height: 'auto', margin: '10px 0' }}>
      <defs>
        <linearGradient id="leafGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d1e3d3" />
          <stop offset="100%" stopColor="#a9c4ac" />
        </linearGradient>
        <linearGradient id="leafGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#bed3c0" />
          <stop offset="100%" stopColor="#91ae96" />
        </linearGradient>
        <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fdf7ed" />
          <stop offset="100%" stopColor="#f4eee4" />
        </radialGradient>
      </defs>
      
      {/* Background shape / Sun */}
      <circle cx="100" cy="90" r="70" fill="url(#sunGrad)" opacity="0.8" />
      
      {/* Left Leaves */}
      <path d="M 40 120 C 30 80, 50 40, 80 50 C 90 60, 80 90, 60 110 Z" fill="url(#leafGrad1)" opacity="0.9" />
      <path d="M 30 140 C 10 110, 20 70, 50 80 C 60 90, 55 120, 40 135 Z" fill="url(#leafGrad2)" opacity="0.7" />
      <path d="M 50 150 C 30 130, 45 95, 70 100 C 80 110, 75 130, 60 145 Z" fill="#9db7a2" opacity="0.8" />
      
      {/* Right Leaves (smaller) */}
      <path d="M 160 110 C 170 80, 150 50, 120 60 C 110 70, 120 90, 140 100 Z" fill="url(#leafGrad2)" opacity="0.8" />
      <path d="M 150 130 C 165 110, 155 80, 130 90 C 120 100, 125 120, 140 125 Z" fill="#a9c4ac" opacity="0.9" />

      {/* Sparkles */}
      <path d="M 160 40 L 165 30 L 170 40 L 180 45 L 170 50 L 165 60 L 160 50 L 150 45 Z" fill="#b9cebc" opacity="0.8" />
      <path d="M 40 30 L 43 23 L 46 30 L 53 33 L 46 36 L 43 43 L 40 36 L 33 33 Z" fill="#d1e3d3" opacity="0.8" />

      {/* Meditating Person */}
      <g transform="translate(10, 10)">
        {/* Body/Shirt */}
        <path d="M 60 130 C 60 100, 70 85, 90 85 C 110 85, 120 100, 120 130 L 120 140 L 60 140 Z" fill="#719385" />
        <path d="M 80 85 L 100 85 L 105 100 L 75 100 Z" fill="#608072" opacity="0.3" />
        
        {/* Shirt Pocket */}
        <path d="M 105 105 L 115 105 L 115 115 C 115 118, 105 118, 105 115 Z" fill="#58796a" />

        {/* Neck */}
        <rect x="85" y="75" width="10" height="15" fill="#f5cbb0" />
        
        {/* Face */}
        <circle cx="90" cy="65" r="16" fill="#f5cbb0" />
        <path d="M 74 65 C 74 78, 81 85, 90 85 C 99 85, 106 78, 106 65" fill="#f5cbb0" />
        
        {/* Hair */}
        <path d="M 72 65 C 70 50, 80 45, 90 45 C 105 45, 110 55, 108 65 C 105 55, 95 50, 90 52 C 80 50, 75 55, 72 65 Z" fill="#2c3e50" />
        <path d="M 90 45 C 80 40, 100 40, 110 50 C 105 45, 95 45, 90 45 Z" fill="#2c3e50" />
        
        {/* Eyes closed */}
        <path d="M 82 63 Q 85 66 88 63" fill="none" stroke="#6b4c3e" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 92 63 Q 95 66 98 63" fill="none" stroke="#6b4c3e" strokeWidth="1.5" strokeLinecap="round" />
        
        {/* Eyebrows */}
        <path d="M 80 58 Q 84 56 87 58" fill="none" stroke="#2c3e50" strokeWidth="2" strokeLinecap="round" />
        <path d="M 93 58 Q 96 56 100 58" fill="none" stroke="#2c3e50" strokeWidth="2" strokeLinecap="round" />
        
        {/* Smile */}
        <path d="M 86 75 Q 90 78 94 75" fill="none" stroke="#c08472" strokeWidth="1.5" strokeLinecap="round" />
        
        {/* Blush */}
        <ellipse cx="80" cy="70" rx="3" ry="2" fill="#e89f88" opacity="0.5" />
        <ellipse cx="100" cy="70" rx="3" ry="2" fill="#e89f88" opacity="0.5" />

        {/* Arms mediating */}
        <path d="M 65 95 C 50 110, 45 125, 55 135 C 60 140, 65 135, 60 130 C 55 125, 60 115, 68 110" fill="none" stroke="#719385" strokeWidth="8" strokeLinecap="round" />
        <path d="M 115 95 C 130 110, 135 125, 125 135 C 120 140, 115 135, 120 130 C 125 125, 120 115, 112 110" fill="none" stroke="#719385" strokeWidth="8" strokeLinecap="round" />
        
        {/* Hands */}
        <circle cx="56" cy="133" r="5" fill="#f5cbb0" />
        <circle cx="124" cy="133" r="5" fill="#f5cbb0" />

        {/* Legs crossed */}
        <path d="M 50 140 C 40 150, 50 160, 90 160 C 130 160, 140 150, 130 140 C 120 145, 100 148, 90 148 C 80 148, 60 145, 50 140 Z" fill="#2c3e50" />
        <path d="M 70 140 C 75 145, 85 148, 90 148 C 95 148, 105 145, 110 140" fill="none" stroke="#1a252f" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
}
