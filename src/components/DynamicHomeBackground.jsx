import React from 'react';
import '../index.css';

export default function DynamicHomeBackground() {
  return (
    <div className="dynamic-home-bg">
      {/* Slow rotating, glowing abstract orbs for misty atmosphere */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      {/* SVG Container for the flowing waves */}
      <div className="wave-container">
        <svg 
          viewBox="0 0 1440 800"
          className="wave-svg"
          preserveAspectRatio="xMidYMax slice"
        >
          {/* Layer 1 - Furthest back, pale sage */}
          <g className="wave wave-layer-1">
            <path 
              fill="#e3ecdf" 
              fillOpacity="0.8" 
              d="M0,400 C320,300 420,500 720,400 C1020,300 1200,450 1440,350 L1440,800 L0,800 Z"
            />
          </g>

          {/* Layer 2 - Midground, faint peach */}
          <g className="wave wave-layer-2">
            <path 
              fill="#f7ede3" 
              fillOpacity="0.7" 
              d="M0,500 C280,600 500,400 720,500 C940,600 1150,450 1440,550 L1440,800 L0,800 Z"
            />
          </g>

          {/* Layer 3 - Foreground 1, misty teal/blue */}
          <g className="wave wave-layer-3">
            <path 
              fill="#cddedd" 
              fillOpacity="0.85" 
              d="M0,600 C300,500 450,700 720,600 C990,500 1150,650 1440,580 L1440,800 L0,800 Z"
            />
          </g>

          {/* Layer 4 - Foreground 2, deeper sage/green */}
          <g className="wave wave-layer-4">
            <path 
              fill="#aecb9f" 
              fillOpacity="0.4" 
              d="M0,650 C250,750 600,600 800,700 C1000,800 1200,650 1440,750 L1440,800 L0,800 Z"
            />
          </g>

             {/* Layer 5 - Front white wisps */}
          <g className="wave wave-layer-5">
            <path 
              fill="#ffffff" 
              fillOpacity="0.6" 
              d="M0,700 C400,600 550,850 850,700 C1150,550 1300,780 1440,720 L1440,800 L0,800 Z"
            />
          </g>
        </svg>

        {/* Second identical SVG placed right next to it for seamless horizontal sweeping loop */}
        <svg 
          viewBox="0 0 1440 800"
          className="wave-svg wave-svg-clone"
          preserveAspectRatio="xMidYMax slice"
        >
          <g className="wave wave-layer-1">
            <path fill="#e3ecdf" fillOpacity="0.8" d="M0,400 C320,300 420,500 720,400 C1020,300 1200,450 1440,350 L1440,800 L0,800 Z" />
          </g>
          <g className="wave wave-layer-2">
            <path fill="#f7ede3" fillOpacity="0.7" d="M0,500 C280,600 500,400 720,500 C940,600 1150,450 1440,550 L1440,800 L0,800 Z" />
          </g>
          <g className="wave wave-layer-3">
            <path fill="#cddedd" fillOpacity="0.85" d="M0,600 C300,500 450,700 720,600 C990,500 1150,650 1440,580 L1440,800 L0,800 Z" />
          </g>
          <g className="wave wave-layer-4">
            <path fill="#aecb9f" fillOpacity="0.4" d="M0,650 C250,750 600,600 800,700 C1000,800 1200,650 1440,750 L1440,800 L0,800 Z" />
          </g>
          <g className="wave wave-layer-5">
            <path fill="#ffffff" fillOpacity="0.6" d="M0,700 C400,600 550,850 850,700 C1150,550 1300,780 1440,720 L1440,800 L0,800 Z" />
          </g>
        </svg>
      </div>

      {/* Floating Magic Sparkles */}
      <div className="sparkle s1" style={{ left: '15%', top: '30%', animationDelay: '0s' }}></div>
      <div className="sparkle s2" style={{ left: '80%', top: '25%', animationDelay: '2s' }}></div>
      <div className="sparkle s3" style={{ left: '45%', top: '65%', animationDelay: '1s' }}></div>
      <div className="sparkle s1" style={{ left: '65%', top: '75%', animationDelay: '3.5s' }}></div>
      <div className="sparkle s2" style={{ left: '25%', top: '55%', animationDelay: '0.8s' }}></div>
      <div className="sparkle s3" style={{ left: '85%', top: '50%', animationDelay: '2.4s' }}></div>

    </div>
  );
}
