export default function LoginIllustration() {
  return (
    <svg 
      viewBox="0 0 300 240" 
      preserveAspectRatio="xMidYMax slice"
      style={{
        width: '100%',
        height: '100%',
        display: 'block'
      }}
    >
      <defs>
        <radialGradient id="breathGlow" cx="60%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Far Background Hills/Waves */}
      <path d="M0,200 Q75,180 150,210 T300,195 L300,240 L0,240 Z" fill="#e3ebd9" opacity="0.6"/>
      <path d="M-20,220 Q80,190 200,225 T320,210 L320,240 L-20,240 Z" fill="#f7ede3" opacity="0.8"/>

      {/* Left Leaves - Background */}
      <g opacity="0.4" transform="translate(-10, 40) scale(0.8)">
        <path d="M40,160 Q60,120 40,80 Q20,120 40,160 Z" fill="#91b57d"/>
        <path d="M40,160 Q70,110 80,70 Q50,110 40,160 Z" fill="#769a62"/>
      </g>

      {/* Right Leaves - Background */}
      <g opacity="0.5" transform="translate(220, 60) scale(0.7) rotate(-15)">
         <path d="M40,160 Q60,120 40,80 Q20,120 40,160 Z" fill="#aecb9f"/>
         <path d="M40,160 Q30,110 10,70 Q20,110 40,160 Z" fill="#91b57d"/>
      </g>

      {/* Character Base */}
      <g transform="translate(150, 240)">
        
        {/* Breathing Aura */}
        <circle cx="20" cy="-90" r="40" fill="url(#breathGlow)" />

        {/* Shirt/Torso */}
        <path d="M-45,0 L-55,-60 Q-40,-75 0,-80 Q40,-75 55,-60 L45,0 Z" fill="#c6e0bc"/>
        {/* Sleeves */}
        <path d="M-55,-60 L-70,-30 L-45,0 Z" fill="#b3d4a6"/>
        <path d="M55,-60 L70,-30 L45,0 Z" fill="#b3d4a6"/>
        {/* Collar Inner */}
        <path d="M-15,-80 Q0,-70 15,-80 Q0,-65 -15,-80 Z" fill="#a5c49b"/>

        {/* Neck */}
        <path d="M-10,-80 L-10,-100 L10,-100 L10,-80 Z" fill="#eebb9f"/>
        {/* Shadow under chin */}
        <path d="M-10,-95 Q0,-85 10,-90 L10,-80 L-10,-80 Z" fill="#d9a589"/>

        {/* Head Base */}
        <path d="M-22,-135 Q-20,-155 0,-155 Q20,-155 22,-135 Q25,-100 0,-95 Q-25,-100 -22,-135 Z" fill="#fbd3b9"/>

        {/* Hair - Dark Blue/Grey */}
        <path d="M-28,-130 Q-30,-165 0,-165 Q30,-165 28,-130 Q25,-120 30,-140 Q15,-175 -10,-170 Q-30,-150 -35,-130 Z" fill="#4a5a6a"/>
        {/* Hair bangs */}
        <path d="M-20,-155 Q-5,-140 0,-150 Q10,-140 20,-155 Q5,-165 -20,-155 Z" fill="#3d4b59"/>

        {/* Ear */}
        <path d="M-22,-120 Q-28,-125 -25,-130 Q-20,-130 -22,-120 Z" fill="#eebb9f"/>

        {/* Closed Eyes (Peaceful) */}
        <path d="M-12,-125 Q-8,-122 -4,-125" fill="none" stroke="#63584e" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M12,-125 Q8,-122 4,-125" fill="none" stroke="#63584e" strokeWidth="1.5" strokeLinecap="round"/>

        {/* Eyebrows */}
        <path d="M-14,-133 Q-8,-135 -3,-131" fill="none" stroke="#4a5a6a" strokeWidth="2" strokeLinecap="round"/>
        <path d="M14,-133 Q8,-135 3,-131" fill="none" stroke="#4a5a6a" strokeWidth="2" strokeLinecap="round"/>

        {/* Nose */}
        <path d="M2,-120 Q5,-115 2,-112" fill="none" stroke="#d9a589" strokeWidth="1.5" strokeLinecap="round"/>

        {/* Subtle Smile */}
        <path d="M-5,-105 Q0,-102 5,-105" fill="none" stroke="#d47e75" strokeWidth="1.5" strokeLinecap="round"/>

        {/* Blush */}
        <circle cx="-14" cy="-115" r="4" fill="#ffb4a6" opacity="0.6"/>
        <circle cx="14" cy="-115" r="4" fill="#ffb4a6" opacity="0.6"/>

        {/* Breath Exhale Waves */}
        <path d="M18,-110 Q35,-115 45,-105 T70,-115" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.8"/>
        <path d="M22,-105 Q35,-100 45,-110 T75,-105" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
        <circle cx="75" cy="-110" r="1.5" fill="#ffffff" opacity="0.6"/>
        <circle cx="65" cy="-120" r="2" fill="#ffffff" opacity="0.4"/>

      </g>

      {/* Left Foreground Leaves - Prominent */}
      <g transform="translate(10, 260) scale(1.1)">
         {/* Stem */}
         <path d="M20,0 Q30,-60 80,-120" fill="none" stroke="#769a62" strokeWidth="2"/>
         <path d="M25,-20 Q0,-50 15,-70 Q30,-50 25,-20 Z" fill="#aecb9f"/>
         <path d="M30,-40 Q50,-70 55,-40 Z" fill="#91b57d"/>
         <path d="M45,-70 Q20,-100 45,-110 Q60,-90 45,-70 Z" fill="#aecb9f"/>
         <path d="M60,-80 Q80,-100 85,-80 Q70,-70 60,-80 Z" fill="#769a62"/>
         <path d="M75,-110 Q60,-130 80,-140 Q90,-120 75,-110 Z" fill="#91b57d"/>
      </g>

      {/* Right Foreground Leaves */}
      <g transform="translate(290, 270) scale(1) scale(-1, 1)">
         <path d="M20,0 Q30,-60 80,-120" fill="none" stroke="#aecb9f" strokeWidth="2" opacity="0.8"/>
         <path d="M25,-20 Q0,-50 15,-70 Q30,-50 25,-20 Z" fill="#e3ebd9"/>
         <path d="M30,-40 Q50,-70 55,-40 Z" fill="#aecb9f"/>
         <path d="M45,-70 Q20,-100 45,-110 Q60,-90 45,-70 Z" fill="#c6e0bc"/>
         <path d="M60,-80 Q80,-100 85,-80 Z" fill="#91b57d"/>
      </g>
      
      {/* Front sweeping dune/wave */}
      <path d="M-50,240 Q100,210 200,230 T350,220 L350,240 Z" fill="#fdfaf6" opacity="0.9"/>
      
    </svg>
  );
}
