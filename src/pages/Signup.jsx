import { useState } from 'react';
import { useUser } from '../context/UserContext';
import MoodAvatar from '../components/MoodAvatar';
import LoginIllustration from '../components/LoginIllustration';
import MeditatorIllustration from '../components/MeditatorIllustration';
import { Leaf, ArrowRight, Sparkles, Mail, Lock, User, Eye, EyeOff, Briefcase, Home, ChevronLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CHARACTERS = [
  { id: 'neutral', label: 'Neutral', bg: 'rgba(251,207,232,0.3)' },
  { id: 'boy', label: 'Boy', bg: 'rgba(254,215,170,0.3)' },
  { id: 'girl', label: 'Girl', bg: 'rgba(255,237,213,0.3)' },
];

const OCCUPATIONS = [
  { id: 'doctor', label: 'Doctor', icon: '🩺' },
  { id: 'engineer', label: 'Engineer', icon: '⚙️' },
  { id: 'lawyer', label: 'Lawyer', icon: '⚖️' },
  { id: 'dentist', label: 'Dentist', icon: '🦷' },
  { id: 'homemaker', label: 'Homemaker', icon: '🏠' },
  { id: 'teacher', label: 'Teacher / Educator', icon: '🍎' },
  { id: 'artist', label: 'Artist / Creative', icon: '🎨' },
  { id: 'entrepreneur', label: 'Entrepreneur', icon: '🚀' },
  { id: 'software', label: 'Software Developer', icon: '💻' },
  { id: 'healthcare', label: 'Healthcare Worker', icon: '🏥' },
  { id: 'accountant', label: 'Accountant', icon: '📊' },
  { id: 'designer', label: 'Designer', icon: '✨' },
  { id: 'other', label: 'Other', icon: '💼' },
];

const ENVIRONMENTS = [
  { id: 'alone', label: 'Living Alone', icon: '🧘' },
  { id: 'family', label: 'With Family', icon: '👨‍👩‍👧' },
  { id: 'roommates', label: 'With Roommates', icon: '👥' },
];

export default function Signup() {
  const { user, signUp, login, saveUser } = useUser();
  const navigate = useNavigate();

  // Auth state
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Onboarding state
  const [mainCategory, setMainCategory] = useState('');
  const [occupation, setOccupation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [environment, setEnvironment] = useState('');
  const [avatar, setAvatar] = useState('neutral');

  // Phase: 'auth' | 'occupation' | 'environment' | 'avatar'
  const isAuthenticated = !!user;
  const phase = !isAuthenticated
    ? 'auth'
    : !user.occupation
    ? 'occupation'
    : !user.environment
    ? 'environment'
    : 'avatar';

  const handleAuth = (e) => {
    e.preventDefault();
    setError('');

    // Enhanced Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address with a proper domain (e.g., .com, .org).');
      return;
    }

    if (isLogin) {
      const result = login(email, password);
      if (!result.success) setError(result.error);
    } else {
      if (!name.trim()) { setError('Please enter your name.'); return; }
      if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
      const result = signUp(email, password, name);
      if (!result.success) setError(result.error);
    }
  };

  const handleOccupationNext = () => {
    if (mainCategory === 'student') {
      saveUser({ occupation: 'student' });
    } else if (mainCategory === 'professional' && occupation) {
      saveUser({ occupation });
    }
  };

  const handleEnvironmentNext = () => {
    if (!environment) return;
    saveUser({ environment });
  };

  const handleComplete = () => {
    navigate('/profile', { replace: true });
    saveUser({ avatarCharacter: avatar, avatarStyle: 'classic', onboardingComplete: true });
  };

  const goBackToEnvironment = () => {
    saveUser({ environment: null });
  };

  const goBackToOccupation = () => {
    saveUser({ occupation: null });
  };

  return (
    <div className="login-clone-wrapper">
      {/* Background — exactly preserved */}
      <div className="login-clone-bg">
        <div className="login-sparkle" style={{ width: 4, height: 4, top: '40%', left: '15%' }} />
        <div className="login-sparkle" style={{ width: 6, height: 6, top: '60%', right: '25%' }} />
        <div className="login-sparkle" style={{ width: 3, height: 3, top: '75%', left: '30%' }} />
        
        {/* New Meditator Background for Onboarding only */}
        {phase !== 'auth' && (
          <div style={{ position: 'absolute', bottom: '-10%', left: '50%', transform: 'translateX(-50%)', opacity: 0.15, pointerEvents: 'none', zIndex: 0 }}>
            <MeditatorIllustration width={500} height={400} />
          </div>
        )}
      </div>

      <div className="login-glass-card" style={{ zIndex: 1 }}>
        {/* Logo — exactly preserved */}
        <div className="login-logo">
          <Leaf size={24} color="#5a7a4c" fill="#5a7a4c" />
        </div>
        <h1 className="login-title">MindOasis</h1>
        <p className="login-subtitle">
          {phase === 'auth' ? 'Your safe space for mental wellness' : 'Wellness Profile Setup'}
        </p>

        {/* ============ AUTH PHASE ============ */}
        {phase === 'auth' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            {/* Auth Toggle Tabs */}
            <div className="auth-tabs">
              <button
                className={`auth-tab ${isLogin ? 'active' : ''}`}
                onClick={() => { setIsLogin(true); setError(''); }}
              >
                Login
              </button>
              <button
                className={`auth-tab ${!isLogin ? 'active' : ''}`}
                onClick={() => { setIsLogin(false); setError(''); }}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleAuth} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {/* Error Message */}
              {error && (
                <div className="auth-error fade-in">{error}</div>
              )}

              {/* Name field (Sign Up only) */}
              {!isLogin && (
                <div className="login-input-wrapper fade-in">
                  <User size={16} className="login-input-icon" />
                  <input
                    type="text"
                    className="login-input login-input-with-icon"
                    placeholder="Full name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    autoComplete="name"
                  />
                </div>
              )}

              {/* Email */}
              <div className="login-input-wrapper">
                <Mail size={16} className="login-input-icon" />
                <input
                  type="email"
                  className="login-input login-input-with-icon"
                  placeholder="Email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              {/* Password */}
              <div className="login-input-wrapper">
                <Lock size={16} className="login-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="login-input login-input-with-icon"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Forgot Password (Login only) */}
              {isLogin && (
                <button type="button" className="auth-forgot-link">
                  Forgot password?
                </button>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="login-btn-replica"
                disabled={!email.trim() || !password.trim() || (!isLogin && !name.trim())}
              >
                {isLogin ? 'Login' : 'Sign Up'} <ArrowRight size={16} />
              </button>

              {/* Divider */}
              <div className="auth-divider">
                <span>or</span>
              </div>

              {/* Google Button */}
              <button type="button" className="auth-google-btn">
                <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
                Continue with Google
              </button>

              {/* Privacy text */}
              <div className="auth-privacy">
                <Shield size={12} />
                <span>Your data is private and securely protected.</span>
              </div>
            </form>

            {/* Illustration */}
            <div className="login-illustration-wrapper" style={{ minHeight: 100, marginTop: 8 }}>
              <LoginIllustration />
            </div>
          </div>
        )}

        {/* ============ OCCUPATION PHASE ============ */}
        {phase === 'occupation' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', flex: 1, paddingBottom: 32 }}>
            {/* Progress */}
            <div className="onboarding-progress">
              <div className="onboarding-progress-bar" style={{ width: '33%' }} />
            </div>

            <label className="login-label" style={{ textAlign: 'center', marginBottom: 4 }}>
              <Briefcase size={16} style={{ verticalAlign: -3, marginRight: 6 }} />
              What best describes you?
            </label>
            <p className="login-subtitle" style={{ marginBottom: 20 }}>This helps us personalize your experience.</p>

            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              <button
                className={`onboarding-pill ${mainCategory === 'student' ? 'selected' : ''}`}
                onClick={() => { setMainCategory('student'); setOccupation(''); setIsDropdownOpen(false); }}
                style={{ flex: 1, padding: 12, borderRadius: 16, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 6, cursor: 'pointer', transition: 'all 0.2s', border: mainCategory === 'student' ? '2px solid var(--primary-500)' : '2px solid transparent', background: mainCategory === 'student' ? 'rgba(92,127,74,0.1)' : 'rgba(241,245,249,0.8)' }}
              >
                <span style={{ fontSize: '1.8rem' }}>📚</span>
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: mainCategory === 'student' ? 'var(--primary-700)' : 'var(--text-secondary)' }}>Student</span>
              </button>
              <button
                className={`onboarding-pill ${mainCategory === 'professional' ? 'selected' : ''}`}
                onClick={() => { setMainCategory('professional'); }}
                style={{ flex: 1, padding: 12, borderRadius: 16, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 6, cursor: 'pointer', transition: 'all 0.2s', border: mainCategory === 'professional' ? '2px solid var(--primary-500)' : '2px solid transparent', background: mainCategory === 'professional' ? 'rgba(92,127,74,0.1)' : 'rgba(241,245,249,0.8)' }}
              >
                <span style={{ fontSize: '1.8rem' }}>💼</span>
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: mainCategory === 'professional' ? 'var(--primary-700)' : 'var(--text-secondary)' }}>Professional</span>
              </button>
            </div>

            {mainCategory === 'professional' && (
              <div className="signup-occupation-dropdown fade-in" style={{ position: 'relative', width: '100%', marginBottom: 20, zIndex: 10 }}>
                <div 
                  className="dropdown-trigger"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  style={{ 
                    width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.7)', 
                    border: '1px solid rgba(148,163,184,0.3)', borderRadius: 16, 
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    cursor: 'pointer', outline: 'none', color: occupation ? 'var(--text-primary)' : 'var(--text-muted)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {occupation ? (
                      <>
                        <span>{OCCUPATIONS.find(o => o.id === occupation)?.icon}</span>
                        <span style={{ fontWeight: 500 }}>{OCCUPATIONS.find(o => o.id === occupation)?.label}</span>
                      </>
                    ) : (
                      <span>Select your profession...</span>
                    )}
                  </div>
                  <div style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</div>
                </div>

                {isDropdownOpen && (
                  <div className="dropdown-menu fade-in" style={{
                    marginTop: 8,
                    background: 'white', borderRadius: 16, boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(148,163,184,0.2)', display: 'flex', flexDirection: 'column',
                  }}>
                    <div style={{ padding: '12px 12px 8px 12px', borderBottom: '1px solid rgba(148,163,184,0.1)' }}>
                      <input 
                        type="text"
                        placeholder="Search professions..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        style={{ 
                          width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(148,163,184,0.2)',
                          background: 'rgba(241,245,249,0.5)', outline: 'none', fontSize: '0.9rem'
                        }}
                        autoFocus
                      />
                    </div>
                    <div style={{ overflowY: 'auto', maxHeight: 200, padding: 8 }}>
                      {OCCUPATIONS.filter(occ => occ.label.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 ? (
                        <div style={{ padding: 16, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>No professions found</div>
                      ) : (
                        OCCUPATIONS.filter(occ => occ.label.toLowerCase().includes(searchQuery.toLowerCase())).map(occ => (
                          <button
                            key={occ.id}
                            className="dropdown-item"
                            onClick={() => {
                              setOccupation(occ.id);
                              setIsDropdownOpen(false);
                              setSearchQuery('');
                            }}
                            style={{
                              width: '100%', textAlign: 'left', padding: '12px', borderRadius: 10,
                              display: 'flex', alignItems: 'center', gap: 12, border: 'none',
                              background: occupation === occ.id ? 'rgba(92,127,74,0.1)' : 'transparent',
                              cursor: 'pointer', transition: 'background 0.2s'
                            }}
                            onMouseOver={e => { if(occupation !== occ.id) e.currentTarget.style.background = 'rgba(241,245,249,0.8)' }}
                            onMouseOut={e => { if(occupation !== occ.id) e.currentTarget.style.background = 'transparent' }}
                          >
                            <span style={{ fontSize: '1.2rem' }}>{occ.icon}</span>
                            <span style={{ fontWeight: occupation === occ.id ? 600 : 500, color: occupation === occ.id ? 'var(--primary-700)' : 'var(--text-secondary)' }}>{occ.label}</span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div style={{ marginTop: 'auto' }}>
              <button
                className="login-btn-replica"
                onClick={handleOccupationNext}
                disabled={!mainCategory || (mainCategory === 'professional' && !occupation)}
              >
                Next <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ============ ENVIRONMENT PHASE ============ */}
        {phase === 'environment' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', flex: 1, paddingBottom: 32 }}>
            {/* Progress */}
            <div className="onboarding-progress">
              <div className="onboarding-progress-bar" style={{ width: '66%' }} />
            </div>

            <label className="login-label" style={{ textAlign: 'center', marginBottom: 4 }}>
              <Home size={16} style={{ verticalAlign: -3, marginRight: 6 }} />
              Your living situation?
            </label>
            <p className="login-subtitle" style={{ marginBottom: 20 }}>We'll tailor insights to your daily life.</p>

            <div className="onboarding-pills-grid" style={{ gridTemplateColumns: '1fr' }}>
              {ENVIRONMENTS.map(env => (
                <button
                  key={env.id}
                  className={`onboarding-pill ${environment === env.id ? 'selected' : ''}`}
                  onClick={() => setEnvironment(env.id)}
                >
                  <span className="onboarding-pill-icon">{env.icon}</span>
                  <span>{env.label}</span>
                </button>
              ))}
            </div>

            <div style={{ marginTop: 'auto' }}>
              <button
                className="login-btn-replica"
                onClick={handleEnvironmentNext}
                disabled={!environment}
                style={{ marginBottom: 12 }}
              >
                Next <ArrowRight size={16} />
              </button>
              <button onClick={goBackToOccupation} className="auth-back-btn">
                <ChevronLeft size={14} /> Back
              </button>
            </div>
          </div>
        )}

        {/* ============ AVATAR PHASE ============ */}
        {phase === 'avatar' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', flex: 1, paddingBottom: 32 }}>
            {/* Progress */}
            <div className="onboarding-progress">
              <div className="onboarding-progress-bar" style={{ width: '100%' }} />
            </div>

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

            <div style={{ marginTop: 'auto' }}>
              <button className="login-btn-replica" onClick={handleComplete} style={{ marginBottom: 12 }}>
                Enter MindOasis <Sparkles size={16} />
              </button>
              <button onClick={goBackToEnvironment} className="auth-back-btn">
                <ChevronLeft size={14} /> Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
