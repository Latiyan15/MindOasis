import { Phone, ExternalLink, Heart, Shield, Users, BookOpen, Globe, AlertTriangle } from 'lucide-react';

const helplines = [
  {
    name: 'iCall — Psychosocial Helpline',
    phone: '9152987821',
    description: 'Professional counseling support for individuals facing emotional distress, depression, and anxiety.',
    hours: 'Mon–Sat, 8:00 AM – 10:00 PM',
    icon: Phone,
  },
  {
    name: 'Vandrevala Foundation',
    phone: '1860-2662-345',
    description: '24/7 mental health support for crisis intervention, counseling, and emotional help.',
    hours: '24/7 Available',
    icon: Heart,
  },
  {
    name: 'NIMHANS Helpline',
    phone: '080-46110007',
    description: 'National Institute of Mental Health and Neurosciences — government mental health support.',
    hours: 'Mon–Sat, 9:30 AM – 4:30 PM',
    icon: Shield,
  },
  {
    name: 'Snehi Helpline',
    phone: '044-24640050',
    description: 'Emotional support and suicide prevention helpline providing free counseling.',
    hours: '24/7 Available',
    icon: Phone,
  },
];

const resources = [
  {
    title: 'Mental Health First Aid',
    description: 'Learn to recognize the signs of mental health issues and how to offer initial help and support.',
    link: 'https://www.mentalhealthfirstaid.org/',
    icon: BookOpen,
    color: 'var(--primary-500)',
    bg: 'var(--primary-50)',
  },
  {
    title: 'WHO Mental Health Resources',
    description: 'World Health Organization\'s comprehensive mental health resources, guides, and research.',
    link: 'https://www.who.int/health-topics/mental-health',
    icon: Globe,
    color: 'var(--green-500)',
    bg: 'var(--green-50)',
  },
  {
    title: 'Mindfulness & Meditation',
    description: 'Free guided meditations, breathing exercises, and mindfulness techniques for stress relief.',
    link: 'https://www.headspace.com/meditation',
    icon: Heart,
    color: 'var(--accent-500)',
    bg: 'var(--accent-50)',
  },
  {
    title: 'Student Mental Health Guide',
    description: 'Practical guide for students dealing with academic pressure, social anxiety, and exam stress.',
    link: 'https://www.studentsagainstdepression.org/',
    icon: Users,
    color: 'var(--amber-500)',
    bg: 'var(--amber-50)',
  },
];

const selfCareActivities = [
  { emoji: '🧘', activity: 'Practice 5 minutes of deep breathing', category: 'Mindfulness' },
  { emoji: '🚶', activity: 'Take a 15-minute walk outdoors', category: 'Physical' },
  { emoji: '📝', activity: 'Write 3 things you\'re grateful for', category: 'Journaling' },
  { emoji: '🎵', activity: 'Listen to calming music for 10 minutes', category: 'Relaxation' },
  { emoji: '💤', activity: 'Set a consistent bedtime tonight', category: 'Sleep' },
  { emoji: '📞', activity: 'Reach out to a friend you trust', category: 'Social' },
  { emoji: '🍎', activity: 'Eat a nutritious meal mindfully', category: 'Nutrition' },
  { emoji: '📵', activity: 'Take a 30-minute social media break', category: 'Digital Wellness' },
];

export default function Resources() {
  return (
    <div className="fade-in premium-page">
      <div className="page-header">
        <h1>Support Resources 💙</h1>
        <p>You are not alone. Here are verified resources, helplines, and self-care activities for your well-being.</p>
      </div>

      {/* Emergency Banner */}
      <div className="emergency-banner fade-in-delay-1">
        <h3>
          <AlertTriangle size={20} />
          If you're in immediate danger or crisis
        </h3>
        <p style={{ marginBottom: 12 }}>
          Please contact emergency services or a crisis helpline immediately. You matter, and help is available.
        </p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Emergency</span>
            <div className="emergency-number">112</div>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Vandrevala Foundation</span>
            <div className="emergency-number">1860-2662-345</div>
          </div>
        </div>
      </div>

      {/* Helplines */}
      <h2 style={{ fontSize: '1.3rem', marginBottom: 16 }} className="fade-in-delay-1">🏥 Mental Health Helplines</h2>
      <div className="resource-grid fade-in-delay-1" style={{ marginBottom: 32 }}>
        {helplines.map((helpline, i) => (
          <div key={i} className="resource-card">
            <h3>
              <helpline.icon size={18} style={{ color: 'var(--primary-500)' }} />
              {helpline.name}
            </h3>
            <p>{helpline.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <a href={`tel:${helpline.phone}`} className="resource-link" style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                📞 {helpline.phone}
              </a>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{helpline.hours}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Online Resources */}
      <h2 style={{ fontSize: '1.3rem', marginBottom: 16 }} className="fade-in-delay-2">🌐 Online Resources</h2>
      <div className="resource-grid fade-in-delay-2" style={{ marginBottom: 32 }}>
        {resources.map((resource, i) => (
          <div key={i} className="resource-card">
            <h3>
              <div style={{ 
                width: 28, height: 28, borderRadius: 8, 
                background: resource.bg, color: resource.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <resource.icon size={14} />
              </div>
              {resource.title}
            </h3>
            <p>{resource.description}</p>
            <a href={resource.link} target="_blank" rel="noopener noreferrer" className="resource-link">
              Visit Resource <ExternalLink size={14} />
            </a>
          </div>
        ))}
      </div>

      {/* Self-Care Activities */}
      <h2 style={{ fontSize: '1.3rem', marginBottom: 16 }} className="fade-in-delay-3">✨ Quick Self-Care Activities</h2>
      <div className="card fade-in-delay-3">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {selfCareActivities.map((item, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 16px',
              background: 'var(--gray-50)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
            }}>
              <span style={{ fontSize: '1.4rem' }}>{item.emoji}</span>
              <div>
                <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{item.activity}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.category}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Note */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: 40, 
        padding: 24,
        color: 'var(--text-muted)',
        fontSize: '0.85rem',
        lineHeight: 1.7,
      }}>
        <p>💙 Remember: Seeking help is a sign of strength, not weakness.</p>
        <p>These resources are for informational purposes. For professional help, please consult a licensed therapist.</p>
      </div>
    </div>
  );
}
