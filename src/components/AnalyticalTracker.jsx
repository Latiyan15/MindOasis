import React, { useState } from 'react';
import { Calendar, ArrowRight, CheckCircle2, Circle } from 'lucide-react';
import MoodAvatar from './MoodAvatar';
import '../index.css';

export default function AnalyticalTracker({ timeline, loggedDays, userAvatar = 'neutral' }) {
  const [activeTab, setActiveTab] = useState('factors'); // 'factors' | 'average'
  
  // Heights and positions for SVGs
  const svgWidth = 600;
  const svgHeight = 160;
  const paddingX = 40;
  
  // Mapping moods to numerical heights (for the line graph) and colors
  // Normalizing to 1-6 range:
  // 6: Excited (highest) -> 5: Happy/Neutral -> 4: Calm -> ... 1: Sad
  const moodMap = {
    'Excited': { val: 6, emoji: '🤩', color: '#e99f8d', bgLayers: ['#cddedd', '#fcefc4', '#e99f8d'] },
    'Neutral': { val: 5, emoji: '😐', color: '#b9cebc', bgLayers: ['#cddedd', '#fcefc4', '#b9cebc'] },
    'Bored':   { val: 4, emoji: '🥱', color: '#d6e0c4', bgLayers: ['#cddedd', '#fcefc4', '#d6e0c4'] },
    'Anxious': { val: 3, emoji: '😬', color: '#fcefc4', bgLayers: ['#cddedd', '#fcefc4'] },
    'Stressed': { val: 2, emoji: '😫', color: '#e2b3c2', bgLayers: ['#cddedd', '#e2b3c2'] },
    'Sad':     { val: 1, emoji: '😢', color: '#bcc2d6', bgLayers: ['#cddedd', '#bcc2d6'] },
  };

  // Convert timeline data points to SVG coordinates
  const points = timeline.map((day, i) => {
    const x = paddingX + (i * ((svgWidth - (paddingX * 2)) / 6));
    // If no mood, default to middle (index 3) so line doesn't crash to 0 visually
    const yVal = day.moodId ? (moodMap[day.moodId]?.val || 3) : 3; 
    
    // Invert Y axis so higher value = higher on screen (lower Y coordinate)
    // 6 values mapped between Y 30 and Y 130
    const y = 130 - ((yVal - 1) * 20); 
    
    return { ...day, x, y, yVal, hasData: !!day.moodId, moodTheme: day.moodId ? moodMap[day.moodId] : null };
  });

  // Generate Bezier path for the smooth line
  const generatePath = (pts) => {
    if (pts.length === 0) return '';
    let d = `M ${pts[0].x},${pts[0].y} `;
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1];
      const curr = pts[i];
      const cx1 = prev.x + (curr.x - prev.x) / 2;
      const cy1 = prev.y;
      const cx2 = prev.x + (curr.x - prev.x) / 2;
      const cy2 = curr.y;
      d += `C ${cx1},${cy1} ${cx2},${cy2} ${curr.x},${curr.y} `;
    }
    return d;
  };

  const linePath = generatePath(points);

  return (
    <div className="clone-card analytic-tracker-card fade-in">
      
      {/* Header */}
      <div className="analytic-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Calendar size={20} color="#769a62" />
          <h2 className="analytic-title">Weekly Tracker</h2>
        </div>
        <div className="analytic-subtitle">{loggedDays}/7 days logged</div>
      </div>

      {/* Main Graph Area */}
      <div className="analytic-graph-container">
        {/* Y Axis Guides */}
        <div className="analytic-guides">
          <div className="analytic-guide-line" style={{ top: '25px' }}><span>25</span></div>
          <div className="analytic-guide-line" style={{ top: '80px' }}><span>10</span></div>
          <div className="analytic-guide-line" style={{ top: '135px' }}><span>0</span></div>
        </div>

        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="analytic-svg" preserveAspectRatio="none">
          <defs>
             <filter id="barBlur" x="-10%" y="0" width="120%" height="110%">
               <feGaussianBlur stdDeviation="3" />
             </filter>
             <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
               <stop offset="0%" stopColor="#cddedd" />
               <stop offset="50%" stopColor="#e99f8d" />
               <stop offset="100%" stopColor="#769a62" />
             </linearGradient>
          </defs>

          {/* Background Stacked Bars */}
          {points.map((pt, i) => {
            if (!pt.hasData || !pt.moodTheme) return null;
            const barWidth = 32;
            const barX = pt.x - (barWidth / 2);
            
            // Draw stacked layers based on mood height
            return (
              <g key={`bar-${i}`} opacity="0.6">
                {pt.moodTheme.bgLayers.map((layerColor, j, arr) => {
                  const numLayers = arr.length;
                  const segmentHeight = 100 / numLayers;
                  // Map total bar height up to the point's y value
                  const totalBarHeight = (130 - pt.y) + 20; // +20 so it always has some minimum height
                  const layerH = totalBarHeight / numLayers;
                  const layerY = 130 - (layerH * (j + 1));
                  
                  return (
                    <rect 
                      key={`layer-${i}-${j}`}
                      x={barX} 
                      y={layerY} 
                      width={barWidth} 
                      height={layerH} 
                      fill={layerColor}
                      rx={6}
                      filter="url(#barBlur)"
                    />
                  );
                })}
              </g>
            );
          })}

          {/* Connecting Line Wave */}
          <path d={linePath} fill="none" stroke="url(#lineGrad)" strokeWidth="2" opacity="0.6" />

          {/* Data Nodes & Today Glow */}
          {points.map((pt, i) => {
             const isToday = pt.day === 'Today' || pt.isToday; // Handle depending on how timeline passed
             
             if (isToday && pt.hasData) {
               return (
                 <g key={`node-${i}`}>
                   {/* Large Glowing Aura for Today */}
                   <circle cx={pt.x} cy={pt.y} r="28" fill="#dcedc8" opacity="0.6" filter="url(#barBlur)" />
                   <circle cx={pt.x} cy={pt.y} r="20" fill="rgba(255,255,255,0.8)" />
                   {/* We'll render the emoji DOM-side above this to avoid SVG text cross-browser centering issues, just place a placeholder circle */}
                 </g>
               );
             }

             return (
               <g key={`node-${i}`}>
                 {pt.hasData ? (
                   <>
                     <circle cx={pt.x} cy={pt.y} r="4" fill="#ffffff" />
                     <circle cx={pt.x} cy={pt.y} r="2" fill={pt.moodTheme.color} />
                   </>
                 ) : (
                   <circle cx={pt.x} cy={pt.y} r="3" fill="#e8e6e1" />
                 )}
               </g>
             );
          })}
        </svg>

        {/* DOM Overlay for Labels and Today Emoji (to ensure perfect rendering over SVG) */}
        <div className="analytic-overlay">
          {points.map((pt, i) => {
            const isToday = pt.day === 'Today' || pt.isToday;
            return (
              <div 
                key={`overlay-${i}`} 
                className="analytic-day-col"
                style={{ left: `${(pt.x / svgWidth) * 100}%` }}
              >
                {/* The large avatar for Today */}
                {isToday && pt.hasData && (
                  <div className="analytic-today-emoji" style={{ bottom: `${100 - ((pt.y / svgHeight) * 100)}%` }}>
                    <MoodAvatar character={userAvatar} mood={pt.moodId} size={28} />
                  </div>
                )}
                <span className={`analytic-day-label ${isToday ? 'today' : ''}`}>
                  {isToday ? 'Today' : pt.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Legend (Middle section from mockup) */}
      <div className="analytic-legend">
        {Object.entries(moodMap).map(([key, data]) => {
          if(key === 'Neutral') return null; // Skip neutral strictly to match grouping in mockup
          return (
            <div key={key} className="analytic-legend-item">
              <span className="analytic-legend-emoji" style={{ display: 'flex' }}>
                <MoodAvatar character={userAvatar} mood={key} size={20} />
              </span>
              <span className="analytic-legend-label">{key}</span>
            </div>
          );
        })}
      </div>

      {/* Footer Toggles */}
      <div className="analytic-footer">
        <div className="analytic-toggles">
          <button 
            className="analytic-toggle-btn" 
            onClick={() => setActiveTab('factors')}
          >
            {activeTab === 'factors' ? <CheckCircle2 size={16} color="#769a62" /> : <Circle size={16} color="#b0b5aa" />}
            <span style={{ color: activeTab === 'factors' ? '#4a5342' : '#8a8e85' }}>Factors</span>
          </button>
          
          <div className="analytic-divider"></div>

          <button 
            className="analytic-toggle-btn" 
            onClick={() => setActiveTab('average')}
          >
            {activeTab === 'average' ? <CheckCircle2 size={16} color="#769a62" /> : <Circle size={16} color="#b0b5aa" />}
            <span style={{ color: activeTab === 'average' ? '#4a5342' : '#8a8e85' }}>MA Average</span>
          </button>
        </div>

        <div className="analytic-score">
           <span className="analytic-score-icon">👤</span>
           <span className="analytic-score-val">3.2</span>
        </div>

        <button className="analytic-today-btn">
          Today <ArrowRight size={14} />
        </button>
      </div>

    </div>
  );
}
