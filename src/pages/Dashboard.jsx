import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight, Wind, FileText, Headphones, Activity, BarChart3, MoreHorizontal, Leaf, Loader } from 'lucide-react';
import { saveMood, getRecentMoods, getMoodStreak } from '../services/storage';
import { generateInsight } from '../services/gemini';
import { useToast } from '../components/Toast';
import MoodAvatar from '../components/MoodAvatar';
import MeditatingAvatar from '../components/MeditatingAvatar';
import MoodActivities from '../components/MoodActivities';
import DynamicHomeBackground from '../components/DynamicHomeBackground';
import AnalyticalTracker from '../components/AnalyticalTracker';
import { useUser } from '../context/UserContext';

const MOOD_OPTIONS = [
  { id: 'Sad', label: 'Sad', bg: '#bcc2d6' },
  { id: 'Anxious', label: 'Anxious', bg: '#fcefc4' },
  { id: 'Excited', label: 'Excited', bg: '#e99f8d' }, 
  { id: 'Stressed', label: 'Stressed', bg: '#e2b3c2' },
  { id: 'Confused', label: 'Confused', bg: '#c7d6d7' },
  { id: 'Bored', label: 'Bored', bg: '#d6e0c4' },
  { id: 'Neutral', label: 'Neutral', bg: '#b9cebc' },
];

const COLORS_FOR_DUMMY_DATA = ['#e99f8d', '#fcefc4', '#bcc2d6', '#c7d6d7', '#d6e0c4', '#b9cebc', '#9db7a2'];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Dashboard() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState(null);
  const [recentMoods, setRecentMoods] = useState([]);
  const [streak, setStreak] = useState(0);
  const [insight, setInsight] = useState(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const addToast = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const moods = getRecentMoods(7);
    setRecentMoods(moods);
    setStreak(getMoodStreak());

    if (moods.length > 0) {
      setLoadingInsight(true);
      try {
        const text = await generateInsight(moods);
        setInsight(text);
      } catch (error) {
        console.error('Failed to load insight:', error);
      } finally {
        setLoadingInsight(false);
      }
    }
  };

  const handleSaveMood = (moodId) => {
    setSelectedMood(moodId);
    saveMood(moodId);
    addToast(`Mood logged: ${moodId}`);
    loadDashboardData();
  };

  const getTimeline = () => {
    const timeline = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      const dayMoods = recentMoods.filter(m => new Date(m.timestamp).toDateString() === dateStr);
      const lastMood = dayMoods[0];
      const moodData = lastMood ? MOOD_OPTIONS.find(m => m.id === lastMood.mood) : null;
      timeline.push({
        day: DAYS[date.getDay()],
        date: date.getDate(),
        moodId: moodData?.id || null,
        bg: moodData?.bg || COLORS_FOR_DUMMY_DATA[date.getDay()],
        isToday: i === 0,
      });
    }
    return timeline;
  };

  const timeline = getTimeline();
  const loggedDays = timeline.filter(d => d.moodId).length;

  const todayEntry = timeline[timeline.length - 1];
  const activeMoodId = selectedMood || todayEntry?.moodId;

  return (
    <div className="clone-app">
      {/* Animated Pastel Wave Background */}
      <DynamicHomeBackground />

      <div className="clone-layout">
        {/* Header */}
        <header className="clone-topbar">
          <Leaf size={24} color="#9db7a2" fill="#9db7a2" /> 
          <span>MindOasis</span>
        </header>

        {/* Greeting */}
        <div className="clone-greeting" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Hello, {user?.name || 'Friend'} 🌿</span>
          {streak > 0 && <span style={{ fontSize: '1rem', color: '#e6b72e' }}>🔥 {streak}d</span>}
        </div>
        <div className="clone-subtitle">How are you feeling today?</div>

        {/* 1. MOOD SELECTION PANEL */}
        <div className="clone-card" style={{ marginBottom: 16 }}>
          <div className="clone-card-header">
            <span className="clone-card-title">How are you feeling right now?</span>
          </div>

          <div className="clone-mood-row" style={{ overflowX: 'auto', paddingBottom: '10px' }}>
            {MOOD_OPTIONS.map(mood => {
              const isActive = activeMoodId === mood.id;
              return (
                <div key={mood.id} className="clone-mood-item" onClick={() => handleSaveMood(mood.id)}>
                  <div className="clone-mood-circle-container">
                    <div className={`clone-mood-circle ${isActive ? 'active' : ''}`} style={{ background: mood.bg }}>
                      <MoodAvatar mood={mood.id} size={isActive ? 42 : 30} />
                    </div>
                  </div>
                  <span className={`clone-mood-label ${isActive ? 'active' : ''}`}>{mood.label}</span>
                </div>
              )
            })}
          </div>
          <div className="clone-mood-footer">
            {activeMoodId ? `You are feeling ${activeMoodId} today.` : 'Tap a mood to log it.'}
          </div>
        </div>

        {/* 2. WEEKLY TRACKER PANEL (New Analytical Component) */}
        {!selectedMood && (
          <AnalyticalTracker timeline={timeline} loggedDays={loggedDays} userAvatar={user?.avatar || 'neutral'} />
        )}

        {/* Dynamic Activities render in place of the weekly layout if a mood is newly selected */}
        {selectedMood ? (
           <div className="fade-in">
             <MoodActivities mood={selectedMood} />
           </div>
        ) : (
          <div className="clone-grid fade-in">
            {/* Left Column */}
            <div className="clone-card" style={{ padding: '16px' }}>
              <span className="clone-card-title" style={{ marginBottom: '8px' }}>Weekly Mood</span>
              <MeditatingAvatar />
              <span className="clone-sub-title">Mindfulness Exercise</span>
              <p className="clone-desc">Take a moment to breathe.</p>
              <button className="clone-btn" onClick={() => setSelectedMood(todayEntry?.moodId || 'Calm')}>
                Start Session <span style={{ fontFamily: 'monospace', letterSpacing: '-2px' }}>&gt;&gt;</span>
              </button>
            </div>

            {/* Right Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* AI Insight */}
              <div className="clone-card" style={{ flex: 1, padding: '16px', marginBottom: 0 }}>
                <span className="clone-card-title" style={{ marginBottom: '16px' }}>MindOasis AI Insight</span>
                
                {loadingInsight ? (
                   <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                     <Loader className="spin" size={24} color="#9ebba2" />
                   </div>
                ) : insight ? (
                  <>
                     <p className="clone-list-item" style={{ marginBottom: '8px', marginTop: '12px', color: '#4a5342', fontSize: '0.8rem', lineHeight: 1.4 }}>
                       {insight.substring(0, 80)}...
                     </p>
                     <p className="clone-desc" style={{ marginBottom: '12px', color: '#8a8e85' }}>Suggested actions:</p>
                     <div className="clone-list-item">
                        <Wind size={16} color="#4a7c59" style={{flexShrink:0}}/> 
                        <span>Try a 3-minute breathing exercise</span>
                     </div>
                     <div className="clone-list-item">
                        <FileText size={16} color="#457b9d" style={{flexShrink:0}}/>
                        <span>Write a short journal entry</span>
                     </div>
                  </>
                ) : (
                   <p className="clone-desc" style={{ marginTop: '12px' }}>Start logging your moods to receive personalized AI insights.</p>
                )}
              </div>

              {/* Wellness Toolkit */}
              <div className="clone-card" style={{ padding: '16px', marginBottom: 0 }}>
                <div className="clone-card-header" style={{ marginBottom: '8px' }}>
                  <span className="clone-card-title">Wellness Toolkit</span>
                  <MoreHorizontal size={18} color="#b0b5aa" />
                </div>
                
                <div className="clone-toolkit-grid">
                  <div className="clone-tool-btn" onClick={() => navigate('/journal')}>
                    <div className="clone-tool-icon" style={{ background: '#f5d6c6' }}>
                      <FileText size={20} color="#b56f4d" />
                    </div>
                    <span className="clone-tool-label">Journal</span>
                  </div>
                  <div className="clone-tool-btn" onClick={() => setSelectedMood('Anxious')}>
                    <div className="clone-tool-icon" style={{ background: '#c9dbc8' }}>
                      <Leaf size={20} color="#5e825a" fill="#5e825a"/>
                    </div>
                    <span className="clone-tool-label">Breathing</span>
                  </div>
                  <div className="clone-tool-btn" onClick={() => setSelectedMood('Stressed')}>
                    <div className="clone-tool-icon" style={{ background: '#c8ded7' }}>
                      <Activity size={20} color="#5ba08d" />
                    </div>
                    <span className="clone-tool-label">Meditation</span>
                  </div>
                  <div className="clone-tool-btn" onClick={() => navigate('/report')}>
                    <div className="clone-tool-icon" style={{ background: '#dbd1e8' }}>
                      <BarChart3 size={20} color="#8a6fb5" />
                    </div>
                    <span className="clone-tool-label">Report</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
