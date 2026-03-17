import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('MindOasis Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f8f6f2',
          fontFamily: "'Inter', sans-serif",
          padding: 20,
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.9)',
            borderRadius: 24,
            padding: '40px 32px',
            maxWidth: 380,
            textAlign: 'center',
            boxShadow: '0 12px 32px rgba(74,66,58,0.08)',
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>🌿</div>
            <h2 style={{ color: '#535850', fontFamily: "'Outfit', sans-serif", marginBottom: 8 }}>
              Something went wrong
            </h2>
            <p style={{ color: '#9a9e95', fontSize: '0.9rem', marginBottom: 24, lineHeight: 1.6 }}>
              Take a deep breath. Let's try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#b5ccaf',
                color: 'white',
                border: 'none',
                borderRadius: 12,
                padding: '12px 28px',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
