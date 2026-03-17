import { useState, useEffect } from 'react';
import { Smile, Frown, Meh, Star, X, Check } from 'lucide-react';

export default function SmartReflection({ moodSelected, activityUsed, onComplete, onSkip }) {
  const [moodAfter, setMoodAfter] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const options = [
    { label: "Much better", value: "much_better", icon: Smile, color: "var(--green-500)" },
    { label: "Slightly better", value: "slightly_better", icon: Smile, color: "var(--primary-500)" },
    { label: "No change", value: "no_change", icon: Meh, color: "var(--gray-500)" },
    { label: "Still struggling", value: "still_struggling", icon: Frown, color: "var(--rose-500)" }
  ];

  const handleSubmit = () => {
    if (!moodAfter) return;
    setIsSubmitting(true);
    
    const reflection = {
      user_id: 'current_user', // Placeholder for actual user system
      mood_selected: moodSelected,
      activity_used: activityUsed,
      mood_after: moodAfter,
      timestamp: new Date().toISOString()
    };

    // Store in localStorage
    const existing = JSON.parse(localStorage.getItem('mindoasis_reflections') || '[]');
    localStorage.setItem('mindoasis_reflections', JSON.stringify([...existing, reflection]));

    setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 1000);
  };

  const handleSkip = () => {
    onSkip();
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="smart-reflection-card fade-in" style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      width: '320px',
      background: 'white',
      borderRadius: '20px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
      padding: '20px',
      zIndex: 1000,
      border: '1px solid var(--gray-100)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Quick Check-In</h3>
        <button onClick={handleSkip} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={18} /></button>
      </div>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>Did this help you feel better?</p>

      {!isSubmitting ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setMoodAfter(opt.value)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 8px',
                  borderRadius: '12px',
                  border: moodAfter === opt.value ? `2px solid ${opt.color}` : '1px solid var(--gray-200)',
                  background: moodAfter === opt.value ? `${opt.color}10` : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <opt.icon size={20} color={opt.color} />
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>{opt.label}</span>
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={handleSkip}>Skip</button>
            <button 
              className="btn btn-primary" 
              style={{ flex: 1.5 }} 
              onClick={handleSubmit}
              disabled={!moodAfter}
            >
              Submit
            </button>
          </div>
        </>
      ) : (
        <div className="fade-in" style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
             <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--green-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Check size={24} color="var(--green-600)" />
             </div>
          </div>
          <p style={{ fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Thanks for sharing!</p>
        </div>
      )}
    </div>
  );
}
