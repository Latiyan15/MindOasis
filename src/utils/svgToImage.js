// Utility script to convert a custom MoodAvatar SVG directly into an Image URL

export function getAvatarSVGString(character, mood) {
  // SVG Definitions mapping
  const getBody = () => {
    switch (character) {
      case 'boy':
        return `
          <g id="body-boy">
            <rect x="25" y="55" width="50" height="40" rx="15" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
            <path d="M 50 65 L 50 95" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" />
            <circle cx="50" cy="45" r="35" fill="#fcd34d" stroke="#f59e0b" strokeWidth="2" />
            <path d="M 20 25 Q 50 10 80 25 Q 75 5 50 0 Q 25 5 20 25" fill="#3b82f6" />
            <path d="M 15 30 L 25 40 M 85 30 L 75 40" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
            <rect x="15" y="65" width="15" height="15" rx="7.5" fill="#fcd34d" stroke="#f59e0b" strokeWidth="2" />
            <rect x="70" y="65" width="15" height="15" rx="7.5" fill="#fcd34d" stroke="#f59e0b" strokeWidth="2" />
          </g>`;
      case 'girl':
        return `
          <g id="body-girl">
            <path d="M 30 55 L 70 55 L 85 95 L 15 95 Z" fill="#fecaca" stroke="#f87171" strokeWidth="2" strokeLinejoin="round" />
            <circle cx="50" cy="45" r="35" fill="#ffedd5" stroke="#fb923c" strokeWidth="2" />
            <path d="M 15 45 Q 25 10 50 10 Q 75 10 85 45 Q 90 20 50 0 Q 10 20 15 45" fill="#ec4899" />
            <circle cx="20" cy="50" r="10" fill="#ec4899" />
            <circle cx="80" cy="50" r="10" fill="#ec4899" />
            <rect x="15" y="60" width="12" height="12" rx="6" fill="#ffedd5" />
            <rect x="73" y="60" width="12" height="12" rx="6" fill="#ffedd5" />
          </g>`;
      default:
        return `
          <g id="body-neutral">
            <rect x="30" y="55" width="40" height="40" rx="10" fill="#ccfbf1" stroke="#5eead4" strokeWidth="2" />
            <circle cx="50" cy="45" r="35" fill="#fbcfe8" stroke="#f9a8d4" strokeWidth="2" />
            <path d="M 20 30 Q 50 15 80 30 Q 70 10 50 5 Q 30 10 20 30" fill="#db2777" />
            <rect x="20" y="65" width="14" height="14" rx="7" fill="#fbcfe8" />
            <rect x="66" y="65" width="14" height="14" rx="7" fill="#fbcfe8" />
          </g>`;
    }
  };

  const getFace = () => {
    switch (mood) {
      case 'Happy':
        return `
          <g id="face-happy">
            <path d="M 30 45 Q 35 35 40 45" fill="none" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 60 45 Q 65 35 70 45" fill="none" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
            <ellipse cx="28" cy="52" rx="5" ry="3" fill="#f43f5e" opacity="0.4" />
            <ellipse cx="72" cy="52" rx="5" ry="3" fill="#f43f5e" opacity="0.4" />
            <path d="M 42 60 Q 50 70 58 60 Z" fill="#ef4444" stroke="#1e293b" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M 45 61 Q 50 65 55 61" fill="#fca5a5" />
          </g>`;
      case 'Sad':
        return `
          <g id="face-sad">
            <path d="M 30 40 Q 35 45 40 40" fill="none" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 60 40 Q 65 45 70 40" fill="none" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 35 50 Q 35 55 35 60" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" opacity="0.8" strokeDasharray="1 4" />
            <path d="M 65 50 Q 65 55 65 60" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" opacity="0.8" strokeDasharray="1 4" />
            <path d="M 45 62 Q 50 58 55 62" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
          </g>`;
      case 'Stressed':
        return `
          <g id="face-stressed">
            <circle cx="35" cy="45" r="8" fill="white" stroke="#1e293b" strokeWidth="2" />
            <circle cx="35" cy="45" r="2" fill="#1e293b" />
            <circle cx="65" cy="45" r="8" fill="white" stroke="#1e293b" strokeWidth="2" />
            <circle cx="65" cy="45" r="2" fill="#1e293b" />
            <path d="M 25 35 L 45 35 M 28 30 L 42 30" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
            <path d="M 55 35 L 75 35 M 58 30 L 72 30" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
            <path d="M 80 25 Q 85 30 85 35 Q 85 40 80 40 Q 75 40 75 35 Q 75 30 80 25" fill="#38bdf8" opacity="0.8" />
            <path d="M 40 60 L 45 57 L 50 63 L 55 57 L 60 60" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </g>`;
      case 'Anxious':
        return `
          <g id="face-anxious">
            <circle cx="35" cy="45" r="7" fill="white" />
            <circle cx="33" cy="45" r="3" fill="#1e293b" />
            <circle cx="65" cy="45" r="7" fill="white" />
            <circle cx="63" cy="45" r="3" fill="#1e293b" />
            <path d="M 42 60 Q 45 58 47 60 T 52 60 T 57 60" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
            <ellipse cx="25" cy="52" rx="6" ry="3" fill="#f87171" opacity="0.4" />
            <ellipse cx="75" cy="52" rx="6" ry="3" fill="#f87171" opacity="0.4" />
          </g>`;
      case 'Confused':
        return `
          <g id="face-confused">
            <path d="M 35 45 Q 30 40 35 35 Q 40 40 35 45 Q 30 50 35 45" fill="none" stroke="#1e293b" strokeWidth="1.5" />
            <path d="M 65 45 Q 60 40 65 35 Q 70 40 65 45 Q 60 50 65 45" fill="none" stroke="#1e293b" strokeWidth="1.5" />
            <path d="M 45 60 Q 50 65 55 60" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
          </g>`;
      case 'Bored':
        return `
          <g id="face-bored">
            <path d="M 28 42 L 42 42" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 58 42 L 72 42" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="35" cy="45" r="2" fill="#1e293b" />
            <circle cx="65" cy="45" r="2" fill="#1e293b" />
            <path d="M 45 60 L 55 60" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
          </g>`;
      default: // Neutral
        return `
          <g id="face-neutral">
            <circle cx="35" cy="45" r="4" fill="#1e293b" />
            <circle cx="65" cy="45" r="4" fill="#1e293b" />
            <path d="M 45 60 Q 50 62 55 60" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
          </g>`;
    }
  };

  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" flood-opacity="0.15" />
        </filter>
      </defs>
      <g filter="url(#shadow)">
        ${getBody()}
        ${getFace()}
      </g>
    </svg>`;
    
  return `data:image/svg+xml;base64,${btoa(svgContent)}`;
}
