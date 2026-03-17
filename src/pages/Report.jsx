import { useState } from 'react';
import { Sparkles, AlertCircle, Brain, Heart, Zap, LineChart, TrendingUp, TrendingDown, Minus, Activity, Shield, Eye, Target, BarChart3, ChevronRight, RotateCcw } from 'lucide-react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { generateWeeklyReport } from '../services/gemini';
import { getRecentMoods, getJournals, getBurnoutResults, getScenarioInteractions, getMindCheckResults, getMoodLogs } from '../services/storage';
import { useToast } from '../components/Toast';
import { useUser } from '../context/UserContext';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const MOOD_COLORS = {
  Stressed: '#ef4444', Anxious: '#f59e0b', Sad: '#6366f1',
  Confused: '#8b5cf6', Bored: '#94a3b8', Neutral: '#22c55e',
  Happy: '#10b981', Excited: '#f97316', Calm: '#06b6d4',
};

const getScoreColor = (score) => {
  if (score >= 80) return '#10b981';
  if (score >= 60) return '#f59e0b';
  if (score >= 40) return '#f97316';
  return '#ef4444';
};

const getScoreLabel = (score) => {
  if (score >= 80) return 'Thriving';
  if (score >= 60) return 'Stable but Stressed';
  if (score >= 40) return 'Moderate Strain';
  return 'High Burnout Risk';
};

const getRiskColor = (risk) => {
  if (risk?.includes('Low')) return '#10b981';
  if (risk?.includes('Moderate')) return '#f59e0b';
  if (risk?.includes('High')) return '#ef4444';
  return '#94a3b8';
};

const TrendIcon = ({ trend }) => {
  if (trend?.includes('Improv')) return <TrendingUp size={16} color="#10b981" />;
  if (trend?.includes('Declin')) return <TrendingDown size={16} color="#ef4444" />;
  return <Minus size={16} color="#94a3b8" />;
};

export default function Report() {
  const { user } = useUser();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const addToast = useToast();

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = {
        moods: getRecentMoods(30),
        journals: getJournals().slice(0, 10),
        burnout: getBurnoutResults(),
        scenarios: getScenarioInteractions(),
        mindChecks: getMindCheckResults(),
      };
      const result = await generateWeeklyReport(data, user);
      setReport(result);
      addToast('AI Wellness Report generated', 'info');
    } catch (err) {
      if (err.message === 'NO_API_KEY') {
        setError('Please set your API key in the .env file');
      } else {
        setError('Report generation failed. Please try again.');
      }
    }
    setLoading(false);
  };

  const chartData = report?.mood_distribution ? {
    labels: Object.keys(report.mood_distribution),
    datasets: [{
      data: Object.values(report.mood_distribution),
      backgroundColor: Object.keys(report.mood_distribution).map(m => MOOD_COLORS[m] || '#94a3b8'),
      borderWidth: 0,
      hoverOffset: 6,
    }],
  } : null;

  const doughnutOptions = {
    responsive: true,
    plugins: { legend: { position: 'bottom', labels: { padding: 16, usePointStyle: true, font: { family: 'Inter', size: 11 } } } },
    cutout: '68%',
  };

  const effectivenessData = report?.activity_effectiveness ? {
    labels: report.activity_effectiveness.map(a => a.activity),
    datasets: [{
      data: report.activity_effectiveness.map(a => a.effectiveness),
      backgroundColor: ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b'],
      borderRadius: 8,
      borderSkipped: false,
    }]
  } : null;

  const barOptions = {
    responsive: true,
    indexAxis: 'y',
    plugins: { legend: { display: false } },
    scales: {
      x: { max: 100, grid: { display: false }, ticks: { callback: v => `${v}%` } },
      y: { grid: { display: false }, ticks: { font: { size: 11 } } }
    }
  };

  // Card component for consistent styling
  const Section = ({ icon, title, children, accent }) => (
    <div style={{
      background: 'white', borderRadius: 20, padding: '24px 20px',
      border: '1px solid rgba(148,163,184,0.1)',
      boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
      marginBottom: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: `${accent || 'var(--primary-500)'}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </div>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{title}</h3>
      </div>
      {children}
    </div>
  );

  return (
    <div className="report-page-bg fade-in" style={{ paddingBottom: 100 }}>
      <div style={{ padding: '30px 6%', position: 'relative', zIndex: 10 }}>
        <h1 style={{ fontSize: '1.8rem', color: '#3a4436', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <LineChart size={28} color="#429f5f" strokeWidth={2.5} /> Wellness Report
        </h1>
        <p style={{ color: '#889886', fontSize: '1rem' }}>
          AI-powered mental wellness analysis from all your data.
        </p>
      </div>

      <div className="report-hero-container">
        {!report && !loading && (
          <div className="report-glass-card fade-in">
            <div className="report-icon-ring">
              <svg className="progress-svg"><circle className="bg-ring" cx="55" cy="55" r="50" /><circle className="progress-ring" cx="55" cy="55" r="50" /></svg>
              <LineChart className="report-icon-inner" size={38} strokeWidth={2.5} />
            </div>
            <h2 style={{ fontSize: '1.6rem', color: '#2d3329', fontWeight: 600, marginBottom: 12 }}>Generate Your Report</h2>
            <p style={{ color: '#889886', fontSize: '1rem', lineHeight: 1.6, maxWidth: 360, margin: '0 auto' }}>
              Gemini AI will analyze your mood logs, journals, Mind Check results, and game activity to create a comprehensive wellness report.
            </p>
            <div className="report-sources-row">
              <div className="report-source-pill">🎯 Moods</div>
              <div className="report-source-pill">📝 Journals</div>
              <div className="report-source-pill">🧠 Mind Check</div>
              <div className="report-source-pill">🎮 Games</div>
            </div>
            {error && <div className="error-banner" style={{ marginBottom: 16 }}><AlertCircle size={16} />{error}</div>}
            <button className="report-generate-btn" onClick={handleGenerate}>Generate with Gemini</button>
            <div className="report-footer-text"><div className="report-footer-dot" /> Powered by Gemini AI · End-to-end encrypted</div>
          </div>
        )}

        {loading && (
          <div className="report-glass-card fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div className="report-icon-ring" style={{ animation: 'spin 2s linear infinite' }}>
              <svg className="progress-svg"><circle className="bg-ring" cx="55" cy="55" r="50" /><circle className="progress-ring" cx="55" cy="55" r="50" strokeDashoffset="120" /></svg>
              <Sparkles className="report-icon-inner" size={38} />
            </div>
            <h2 style={{ fontSize: '1.4rem', color: '#2d3329', marginBottom: 16 }}>Analyzing all your data...</h2>
            <div className="analyzing-dots"><span /><span /><span /></div>
          </div>
        )}
      </div>

      {report && !loading && (
        <div className="fade-in" style={{ padding: '0 5%', maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 10 }}>

          {/* ── 1. WELLNESS SCORE + TREND ── */}
          <div style={{
            background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)', borderRadius: 24, padding: '32px 24px',
            textAlign: 'center', marginBottom: 20, border: '1px solid rgba(16,185,129,0.15)',
            boxShadow: '0 8px 32px rgba(16,185,129,0.08)'
          }}>
            <div style={{ fontSize: '3.5rem', fontWeight: 800, color: getScoreColor(report.wellness_score), lineHeight: 1 }}>
              {report.wellness_score}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 4, marginBottom: 8 }}>/ 100 Wellness Score</div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 20,
              background: 'white', fontSize: '0.85rem', fontWeight: 600,
              color: getScoreColor(report.wellness_score),
            }}>
              <TrendIcon trend={report.wellness_trend} />
              {report.wellness_trend || 'Stable'} · {getScoreLabel(report.wellness_score)}
            </div>
          </div>

          {/* ── Quick Stats Row ── */}
          <div className="report-summary-grid" style={{ marginBottom: 20 }}>
            <div className="report-stat stat-wellness">
              <div className="report-stat-value" style={{ fontSize: '1.2rem' }}>{report.dominant_mood || 'N/A'}</div>
              <div className="report-stat-label">Dominant Mood</div>
            </div>
            <div className="report-stat stat-mood">
              <div className="report-stat-value" style={{ fontSize: '1rem' }}>{report.main_stress_trigger || 'None'}</div>
              <div className="report-stat-label">Top Trigger</div>
            </div>
            <div className="report-stat stat-stress">
              <div className="report-stat-value">{(report.total_entries?.moods || 0) + (report.total_entries?.journals || 0)}</div>
              <div className="report-stat-label">Total Entries</div>
            </div>
            <div className="report-stat stat-entries">
              <div className="report-stat-value">{report.total_entries?.mindChecks || 0}</div>
              <div className="report-stat-label">Mind Checks</div>
            </div>
          </div>

          <div className="grid-2">
            {/* ── 2. MOOD PATTERN ANALYSIS ── */}
            {chartData && (
              <Section icon={<Activity size={16} color="#8b5cf6" />} title="Mood Pattern Analysis" accent="#8b5cf6">
                <div style={{ maxWidth: 250, margin: '0 auto 16px' }}>
                  <Doughnut data={chartData} options={doughnutOptions} />
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', margin: 0, lineHeight: 1.5 }}>
                  {report.mood_stability || 'Track more moods for stability analysis.'}
                </p>
              </Section>
            )}

            {/* ── 3. TRACKING BEHAVIOR ── */}
            <Section icon={<Eye size={16} color="#06b6d4" />} title="Tracking Behavior" accent="#06b6d4">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Mood Check-ins', value: report.total_entries?.moods || 0, color: '#10b981' },
                  { label: 'Journal Entries', value: report.total_entries?.journals || 0, color: '#6366f1' },
                  { label: 'Mind Check Sessions', value: report.total_entries?.mindChecks || 0, color: '#f59e0b' },
                  { label: 'Games Played', value: report.total_entries?.gamesPlayed || 0, color: '#ec4899' },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: 12, background: `${item.color}08` }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.label}</span>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: item.color }}>{item.value}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 12, fontStyle: 'italic', margin: '12px 0 0' }}>
                {report.engagement_insight || 'Keep tracking to unlock personalized insights.'}
              </p>
            </Section>
          </div>

          {/* ── 4. STRESS TRIGGERS ── */}
          <Section icon={<Zap size={16} color="#ef4444" />} title="Stress Trigger Detection" accent="#ef4444">
            {report.stress_triggers && report.stress_triggers.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {report.stress_triggers.map((trigger, i) => (
                  <div key={i} style={{
                    padding: '8px 16px', borderRadius: 12, background: '#fef2f2',
                    color: '#991b1b', fontSize: '0.85rem', fontWeight: 600,
                    border: '1px solid #fecaca'
                  }}>
                    ⚡ {trigger}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>More data needed to detect patterns.</p>
            )}
          </Section>

          {/* ── 5. ACTIVITY EFFECTIVENESS ── */}
          {effectivenessData && (
            <Section icon={<BarChart3 size={16} color="#10b981" />} title="Activity Effectiveness" accent="#10b981">
              <div style={{ maxHeight: 200 }}>
                <Bar data={effectivenessData} options={barOptions} />
              </div>
              {report.activity_effectiveness?.map((a, i) => (
                <div key={i} style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 6 }}>
                  <strong>{a.activity}</strong>: {a.reason}
                </div>
              ))}
            </Section>
          )}

          {/* ── 6. BURNOUT RISK ── */}
          <Section icon={<Shield size={16} color={getRiskColor(report.burnout_risk)} />} title="Burnout Risk Indicator" accent={getRiskColor(report.burnout_risk)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{
                padding: '8px 20px', borderRadius: 20, fontWeight: 700, fontSize: '0.9rem',
                background: `${getRiskColor(report.burnout_risk)}15`,
                color: getRiskColor(report.burnout_risk),
              }}>
                {report.burnout_risk || 'Unknown'}
              </div>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
              {report.burnout_explanation || 'Complete a Mind Check assessment for burnout analysis.'}
            </p>
          </Section>

          {/* ── 7. EMOTIONAL AWARENESS SCORE ── */}
          <Section icon={<Heart size={16} color="#ec4899" />} title="Emotional Awareness Score" accent="#ec4899">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: getScoreColor(report.emotional_awareness_score || 50) }}>
                {report.emotional_awareness_score || 50}
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/ 100</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  {(report.emotional_awareness_score || 50) >= 70 ? 'Strong awareness' : (report.emotional_awareness_score || 50) >= 40 ? 'Growing awareness' : 'Needs improvement'}
                </div>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
              {report.emotional_awareness_explanation || 'Regular reflection improves emotional awareness.'}
            </p>
          </Section>

          {/* ── 8. AI INSIGHT SUMMARY ── */}
          <Section icon={<Brain size={16} color="var(--primary-600)" />} title="AI Insight Summary" accent="var(--primary-600)">
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0, borderLeft: '3px solid var(--primary-400)', paddingLeft: 16 }}>
              {report.weekly_insight || 'Generate more data for AI insights.'}
            </p>
          </Section>

          {/* ── 9. POSITIVE BEHAVIORS ── */}
          {report.positive_behaviors?.length > 0 && (
            <Section icon={<Heart size={16} color="#10b981" />} title="Positive Behaviors" accent="#10b981">
              {report.positive_behaviors.map((b, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <Heart size={14} style={{ color: '#10b981', flexShrink: 0, marginTop: 3 }} />{b}
                </div>
              ))}
            </Section>
          )}

          {/* ── 10. RECOMMENDATIONS ── */}
          {report.recommendations?.length > 0 && (
            <Section icon={<Target size={16} color="#6366f1" />} title="Personalized Recommendations" accent="#6366f1">
              {report.recommendations.map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10, padding: '12px 14px', borderRadius: 12, background: '#f5f3ff' }}>
                  <div style={{ width: 24, height: 24, borderRadius: 8, background: '#6366f1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem', flexShrink: 0 }}>{i + 1}</div>
                  <span style={{ fontSize: '0.9rem', color: '#3730a3', lineHeight: 1.5 }}>{r}</span>
                </div>
              ))}
            </Section>
          )}

          {/* ── 11. PREDICTIVE INSIGHT ── */}
          <div style={{
            background: 'linear-gradient(135deg, #fdf4ff, #faf5ff)', borderRadius: 20, padding: '24px 20px',
            border: '1px solid rgba(168,85,247,0.15)', marginBottom: 16,
            boxShadow: '0 4px 16px rgba(168,85,247,0.06)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <Sparkles size={18} color="#a855f7" />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#7c3aed', margin: 0 }}>Predictive Insight</h3>
            </div>
            <p style={{ fontSize: '0.95rem', color: '#6b21a8', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
              {report.predictive_insight || 'More data is needed for predictions.'}
            </p>
          </div>

          {/* ── Regenerate Button ── */}
          <div style={{ textAlign: 'center', marginTop: 24, marginBottom: 40 }}>
            <button className="btn btn-ghost" onClick={() => { setReport(null); setError(null); }} style={{ marginRight: 12 }}>
              <RotateCcw size={14} style={{ marginRight: 6, verticalAlign: -2 }} /> Generate New Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
