import { NavLink, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { 
  Home, BookOpen, Flame, Gamepad2, BarChart3, Heart, Leaf
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/journal', label: 'Journal', icon: BookOpen },
  { path: '/burnout', label: 'Burnout', icon: Flame }, // using Flame for burnout
  { path: '/simulator', label: 'Simulator', icon: Gamepad2 },
  { path: '/report', label: 'Report', icon: BarChart3 },
];

export default function Layout({ children }) {
  const location = useLocation();

  return (
    <div className="mobile-app">
      {/* Main scrollable content */}
      <main className="mobile-content" key={location.pathname} style={{ padding: 0 }}>
        {children}
      </main>

      {/* Bottom Tab Bar */}
      <nav className="bottom-nav clone-nav">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
            end={item.path === '/'}
          >
            <item.icon size={22} />
            <span style={{ fontSize: '0.65rem', fontWeight: 600 }}>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
