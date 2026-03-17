import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { ToastProvider } from './components/Toast';
import { UserProvider, useUser } from './context/UserContext';
import { useState, useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import TransitionScreen from './components/TransitionScreen';

import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Journal from './pages/Journal';
import MindCheck from './pages/MindCheck';
import Report from './pages/Report';
import Resources from './pages/Resources';
import Profile from './pages/Profile';
import PlayZone from './pages/PlayZone';
import WordGuessGame from './components/games/WordGuessGame';
import BreathingRhythmGame from './components/games/BreathingRhythmGame';
import FocusPuzzleGame from './components/games/FocusPuzzleGame';
import ScenarioDecisionGame from './components/games/ScenarioDecisionGame';
import MemoryCalmGame from './components/games/MemoryCalmGame';

import { hydrateFromServer } from './services/storage';

function AppContent() {
  const { user, logoutPhase } = useUser();
  const [showLoginTransition, setShowLoginTransition] = useState(false);
  const wasInOnboarding = useRef(false);

  useEffect(() => {
    if (!user || !user.onboardingComplete) {
      wasInOnboarding.current = true;
    } else if (wasInOnboarding.current) {
      // User just completed onboarding/login
      setShowLoginTransition(true);
      wasInOnboarding.current = false;
    }
    
    // Attempt background sync from MongoDB
    if (user?.onboardingComplete) {
      hydrateFromServer();
    }
  }, [user]);

  if (!user || !user.onboardingComplete) {
    return (
      <div className="app-fade-in">
        <Signup />
      </div>
    );
  }

  return (
    <ToastProvider>
      {/* Login Transition Overlay */}
      {showLoginTransition && (
        <TransitionScreen onComplete={() => setShowLoginTransition(false)} />
      )}

      {/* Logout Transition Spinner Overlay */}
      {(logoutPhase === 'loggingOut' || logoutPhase === 'fadingOut') && (
        <div className="logout-transition-overlay fade-in">
          <Loader2 className="spin" size={32} color="#ffffff" style={{ marginBottom: 12 }} />
          <span style={{ color: 'white', fontWeight: 500 }}>Logging you out...</span>
        </div>
      )}

      {/* Main app layout fades out when logoutPhase moves to fadingOut */}
      <div className={logoutPhase === 'fadingOut' ? 'app-fade-out' : ''} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/mind-check" element={<MindCheck />} />
          <Route path="/report" element={<Report />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/play" element={<PlayZone />} />
          <Route path="/play/words" element={<WordGuessGame />} />
          <Route path="/play/breathe" element={<BreathingRhythmGame />} />
          <Route path="/play/focus" element={<FocusPuzzleGame />} />
          <Route path="/play/scenario" element={<ScenarioDecisionGame />} />
          <Route path="/play/memory" element={<MemoryCalmGame />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
      </div>
    </ToastProvider>
  );
}

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;
