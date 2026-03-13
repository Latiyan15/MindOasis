import { useState } from 'react';
import { useUser } from '../context/UserContext';
import MoodAvatar from '../components/MoodAvatar';
import LoginIllustration from '../components/LoginIllustration';
import { Leaf, ArrowRight, Sparkles } from 'lucide-react';

const CHARACTERS = [
  { id: 'neutral', label: 'Neutral', bg: 'rgba(251,207,232,0.3)' },
  { id: 'boy', label: 'Boy', bg: 'rgba(254,215,170,0.3)' },
  { id: 'girl', label: 'Girl', bg: 'rgba(255,237,213,0.3)' },
];

export default function Signup() {
  const { saveUser } = useUser();
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('neutral');
  const [step, setStep] = useState(1);

  const handleComplete = (e) => {
    e?.preventDefault();
    if (!name.trim()) return;
    saveUser({ name: name.trim(), avatar });
  };

  return (
    <div className="login-clone-wrapper">
      {/* Background Watercolor Gradients */}
      <div className="login-clone-bg">
        <div className="login-sparkle" style={{ width: 4, height: 4, top: '40%', left: '15%' }} />
        <div className="login-sparkle" style={{ width: 6, height: 6, top: '60%', right: '25%' }} />
        <div className="login-sparkle" style={{ width: 3, height: 3, top: '75%', left: '30%' }} />
      </div>

      <div className="login-glass-card">
        {/* Exact Header Configuration */}
        <div className="login-logo">
          <Leaf size={24} color="#5a7a4c" fill="#5a7a4c" />
        </div>
        <h1 className="login-title">MindOasis</h1>
        <p className="login-subtitle">A calm space for your thoughts</p>

        {step === 1 && (
          <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="fade-in" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div style={{ flex: 1 }}>
              <label className="login-label">What should we call you?</label>
              <input
                type="text"
                className="login-input"
                autoFocus
                placeholder="Enter your name..."
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
              
              <button 
                type="submit" 
                className="login-btn-replica"
                disabled={!name.trim()}
              >
                Next <ArrowRight size={16} />
              </button>
            </div>

            {/* Exactly Replicated Bottom Illustration inside the card */}
            <div className="login-illustration-wrapper">
              <LoginIllustration />
            </div>
          </form>
        )}

        {step === 2 && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <label className="login-label" style={{ textAlign: 'center' }}>Choose your Companion</label>
            <p className="login-subtitle" style={{ marginBottom: 16 }}>They will reflect your daily feelings.</p>

            <div className="signup-avatar-grid" style={{ gap: 8, marginBottom: 24, padding: '0 8px' }}>
              {CHARACTERS.map(char => (
                <button
                  key={char.id}
                  className={`signup-avatar-card ${avatar === char.id ? 'selected' : ''}`}
                  onClick={() => setAvatar(char.id)}
                  style={{ 
                    padding: '12px 0', 
                    background: avatar === char.id ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)',
                    border: avatar === char.id ? '2px solid #aecb9f' : '1px solid rgba(255,255,255,0.6)',
                  }}
                >
                  <div className="signup-avatar-circle" style={{ background: char.bg, width: 48, height: 48 }}>
                    <MoodAvatar character={char.id} mood="Happy" size={40} />
                  </div>
                  <span className="signup-avatar-label" style={{ color: '#4a5342' }}>{char.label}</span>
                </button>
              ))}
            </div>

            <div style={{ marginTop: 'auto', paddingBottom: 24 }}>
              <button className="login-btn-replica" onClick={handleComplete} style={{ marginBottom: 12 }}>
                Enter MindOasis <Sparkles size={16} />
              </button>
              <button 
                onClick={() => setStep(1)} 
                style={{ background: 'transparent', border: 'none', color: '#9a9e95', width: '100%', fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'Inter', fontWeight: 500 }}
              >
                Go Back
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
