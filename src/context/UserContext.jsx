import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

const USERS_KEY = 'mindoasis_users';
const CURRENT_USER_KEY = 'mindoasis_user';

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash.toString(36);
}

function getStoredUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || {};
  } catch {
    return {};
  }
}

// Global Level logic based on point thresholds
// Lvl 1: 0-100, Lvl 2: 101-250, Lvl 3: 251-500, Lvl 4: 501-800, Lvl 5: 801+
export function getLevel(points) {
  if (points <= 100) return 1;
  if (points <= 250) return 2;
  if (points <= 500) return 3;
  if (points <= 800) return 4;
  return 5;
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logoutPhase, setLogoutPhase] = useState('idle');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CURRENT_USER_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch (e) {
      console.error('Failed to parse user data', e);
    }
    setLoading(false);
  }, []);

  const signUp = (email, password, name) => {
    const users = getStoredUsers();
    const normalizedEmail = email.toLowerCase().trim();

    if (users[normalizedEmail]) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const userData = {
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: simpleHash(password),
      avatarCharacter: 'neutral',
      onboardingComplete: false,
      createdAt: new Date().toISOString(),
      mindPoints: 0,
      streak: 0,
      lastPlayedDate: null,
      badges: [],
      gamesPlayed: 0,
      lastActionType: null, // used to prevent multi-streak in one day
    };

    users[normalizedEmail] = userData;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    setUser(userData);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
    return { success: true };
  };

  const login = (email, password) => {
    const users = getStoredUsers();
    const normalizedEmail = email.toLowerCase().trim();
    const storedUser = users[normalizedEmail];

    if (!storedUser || storedUser.passwordHash !== simpleHash(password)) {
      return { success: false, error: 'Invalid email or password.' };
    }

    setUser(storedUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(storedUser));
    return { success: true };
  };

  const saveUser = (userData) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    if (updatedUser.email) {
      const users = getStoredUsers();
      users[updatedUser.email] = updatedUser;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  /**
   * Refined Gamification Logic
   * - Points: Performance-based, passed from games
   * - Streak: Strictly incremented once per calendar day upon any activity
   * - Level: Calculated on the fly from total points (meaningful progression)
   */
  const updatePlayStats = (pointsEarned, gameName) => {
    if (!user) return;
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    let newStreak = user.streak || 0;
    let newPoints = (user.mindPoints || 0) + pointsEarned;
    let newBadges = [...(user.badges || [])];
    
    // 1. Strict Daily Streak Logic
    // Only increment if last played was NOT today
    if (user.lastPlayedDate !== today) {
      if (user.lastPlayedDate) {
        const lastDate = new Date(user.lastPlayedDate);
        lastDate.setHours(0,0,0,0);
        const todayDate = new Date();
        todayDate.setHours(0,0,0,0);
        const diffDays = Math.round((todayDate - lastDate) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          newStreak += 1;
        } else if (diffDays > 1) {
          // Grace day logic (optional but allowed)
          if (diffDays === 2) {
             // Let's decide to BE FAIR: if it's 2 days, they missed one. Reset unless they have a heart.
             // For now, adhere to "Missed day -> Streak resets"
             newStreak = 1;
          } else {
             newStreak = 1;
          }
        }
      } else {
        newStreak = 1; // Initial play
      }

      // 2. Bonus System (Engagement)
      if (newStreak === 3) newPoints += 20; // 3-day bonus
      if (newStreak === 7 && !newBadges.includes('Consistency King')) newBadges.push('Consistency King');
    }

    // 3. Meaningful Milestones
    const oldLevel = getLevel(user.mindPoints);
    const newLevel = getLevel(newPoints);
    if (newLevel > oldLevel && !newBadges.includes(`Lvl ${newLevel} Achieved`)) {
      newBadges.push(`Lvl ${newLevel} Achieved`);
      newPoints += 10; // Level up bonus
    }

    if (!newBadges.includes('Explorer') && (user.gamesPlayed || 0) >= 5) {
      newBadges.push('Explorer');
    }

    saveUser({
      ...user,
      mindPoints: newPoints,
      streak: newStreak,
      lastPlayedDate: today,
      badges: newBadges,
      gamesPlayed: (user.gamesPlayed || 0) + 1
    });
  };

  return (
    <UserContext.Provider value={{ user, signUp, login, saveUser, logout, logoutPhase, updatePlayStats, loading }}>
      {!loading && children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
