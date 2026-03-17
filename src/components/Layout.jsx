import { NavLink, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import {
  Home, BookOpen, Sparkles, BarChart3, User, BrainCircuit
} from 'lucide-react';
import { useUser } from '../context/UserContext';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/journal', label: 'Journal', icon: BookOpen },
  { path: '/play', label: 'Play', icon: Sparkles, isPlayZone: true },
  { path: '/mind-check', label: 'Mind Check', icon: BrainCircuit },
  { path: '/report', label: 'Report', icon: BarChart3 },
  { path: '/profile', label: 'Profile', icon: User },
];

export default function Layout({ children }) {
  const location = useLocation();
  const { user } = useUser();
  const today = new Date().toISOString().split('T')[0];
  const hasStreakReward = user && user.lastPlayedDate !== today;

  return (
    <div className="mobile-app">
      {/* Main scrollable content */}
      <main className="mobile-content" key={location.pathname} style={{ padding: '0 0 110px 0' }}>
        {children}
      </main>

      {/* Bottom Tab Bar */}
      <nav className="bottom-nav clone-nav">
        {navItems.map(item => {
          const isActive = location.pathname.startsWith(item.path) && (item.path !== '/' || location.pathname === '/');
          const showGlow = item.isPlayZone && hasStreakReward;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`bottom-nav-item ${isActive ? 'active' : ''} ${showGlow ? 'glow-animation' : ''}`}
            >
              <div style={{ position: 'relative' }}>
                <item.icon size={22} className={showGlow ? 'text-violet-500' : ''} />
                {showGlow && <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>}
              </div>
              <span style={{ fontSize: '0.65rem', fontWeight: 600 }}>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
