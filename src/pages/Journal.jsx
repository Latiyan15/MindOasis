import { useState, useEffect, useRef } from 'react';
import { Sparkles, Save, Clock, PenTool, Type, Image, AlertCircle, Brain, Bold, Italic, Trophy } from 'lucide-react';
import { saveJournal, getJournals } from '../services/storage';
import { analyzeJournal, scoreDrawing, enhanceDrawing, generateImagePro } from '../services/gemini';
import { useToast } from '../components/Toast';
import DrawingCanvas from '../components/DrawingCanvas';
import MoodAvatar from '../components/MoodAvatar';
import JournalBackground from '../components/JournalBackground';
import { useUser } from '../context/UserContext';

const MOOD_TASKS = {
  Stressed: {
    write: "Write about one small thing that went right today.",
    draw: "Draw a 'Calm Cloud' using soft, rounding shapes."
  },
  Anxious: {
    write: "Focus on your breath. List 5 things that make you feel safe.",
    draw: "Draw a 'Shield of Peace' with your favorite protective colors."
  },
  Sad: {
    write: "It's okay to feel this way. What would you say to a friend feeling the same?",
    draw: "Draw a 'Sun behind the Rain' – even if it's small."
  },
  Confused: {
    write: "List the options in front of you without judging them.",
    draw: "Draw a 'Path through the Maze' with a clear bright exit."
  },
  Bored: {
    write: "What's a hobby you've always wanted to try? Write the first step.",
    draw: "Draw a 'Wonder Creature' combining three random animals."
  },
  Neutral: {
    write: "What are you grateful for in this quiet moment?",
    draw: "Draw a 'Landscape of Balance' – simple and steady."
  }
};

const MOOD_CHIPS = [
  { id: 'Stressed', label: 'Stressed', color: 'var(--rose-500)' },
  { id: 'Anxious', label: 'Anxious', color: 'var(--amber-500)' },
  { id: 'Sad', label: 'Sad', color: 'var(--primary-500)' },
  { id: 'Confused', label: 'Confused', color: 'var(--gray-500)' },
  { id: 'Bored', label: 'Bored', color: 'var(--accent-500)' },
  { id: 'Neutral', label: 'Neutral', color: 'var(--green-500)' },
];

export default function Journal() {
  const { user } = useUser();
  const [text, setText] = useState('');
  
  // Text formatting state
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [textColor, setTextColor] = useState('#535850'); // Default text color
  const [fontFamily, setFontFamily] = useState('Inter, sans-serif');

  const [selectedMood, setSelectedMood] = useState(null);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [journals, setJournals] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [activeTab, setActiveTab] = useState('write');
  const [savedDrawing, setSavedDrawing] = useState(null);
  const canvasRef = useRef(null);
  const [drawingAnalysis, setDrawingAnalysis] = useState(null);
  const [scoring, setScoring] = useState(false);
  
  // Enhancement states
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedResult, setEnhancedResult] = useState(null);

  const addToast = useToast();

  useEffect(() => {
    setJournals(getJournals());
  }, []);

  const handleSave = async () => {
    if (!text.trim() && !savedDrawing) return;
    setError(null);

    let result = null;
    if (aiEnabled && text.trim()) {
      setAnalyzing(true);
      try {
        result = await analyzeJournal(text);
        setAnalysis(result);
      } catch (err) {
        if (err.message === 'NO_API_KEY') {
          setError('Please set your OpenRouter API key in the .env file (VITE_OPENROUTER_API_KEY)');
        } else {
          setError('AI analysis failed. Entry saved without analysis.');
        }
      }
      setAnalyzing(false);
    }

    const images = savedDrawing ? { original: savedDrawing, enhanced: null } : null;
    const entryText = savedDrawing ? `${text}\n\n[🎨 Original Sketch appended]` : text;
    saveJournal(entryText, aiEnabled, result, images);
    setJournals(getJournals());
    addToast('✨ Entry saved — your thoughts are safe here.');

    if (!aiEnabled) {
      setText('');
      setSavedDrawing(null);
      setDrawingAnalysis(null);
      setEnhancedResult(null);
      setSelectedMood(null);
    }
  };

  const handleNewEntry = () => {
    setText('');
    setAnalysis(null);
    setSelectedEntry(null);
    setSavedDrawing(null);
    setDrawingAnalysis(null);
    setEnhancedResult(null);
    setSelectedMood(null);
    setError(null);
  };

  const handleSaveDrawing = (dataUrl) => {
    setSavedDrawing(dataUrl);
    setDrawingAnalysis(null);
    setEnhancedResult(null);
    addToast('Drawing captured! Save your entry or enhance it.');
    // setActiveTab('write'); // Don't switch tab automatically to allow scoring/enhancing
  };

  const handleScoreDrawing = async () => {
    if (!savedDrawing) return;
    setScoring(true);
    try {
      const taskDesc = selectedMood ? MOOD_TASKS[selectedMood]?.draw : '';
      const result = await scoreDrawing(savedDrawing, selectedMood, taskDesc);
      setDrawingAnalysis(result);
      addToast('✨ Gemini has analyzed your patterns!');
    } catch (err) {
      addToast('Scoring failed, but your art is still beautiful!');
    }
    setScoring(false);
  };

  const handleEnhanceDrawing = async (imageUrl = null) => {
    // If no imageUrl passed, try to get it from the canvas ref
    let finalUrl = imageUrl || savedDrawing;
    if (!finalUrl && canvasRef.current) {
      finalUrl = canvasRef.current.getCanvasDataUrl();
      setSavedDrawing(finalUrl); // Sync it
    }
    
    if (!finalUrl) {
      addToast('Please draw something first!');
      return;
    }

    setIsEnhancing(true);
    setEnhancedResult(null);
    setDrawingAnalysis(null);
    addToast('Gemini is analyzing your sketch...');
    
    try {
      const result = await enhanceDrawing(finalUrl);
      
      const safePrompt = result.image_prompt.replace(/[^a-zA-Z0-9\s]/g, '').trim();
      const encodedPrompt = encodeURIComponent(safePrompt) || 'beautiful-art';
      const seed = Math.floor(Math.random() * 1000000);
      
      addToast('🎨 Using Node.js Proxy for reliable generation...');
      
      // Step 1: Proxy through our local backend to bypass browser blocks
      let enhancedImageUrl = `http://localhost:5000/api/ai/image?prompt=${encodedPrompt}&seed=${seed}&width=1024&height=1024&model=flux`;
      
      setEnhancedResult({
        originalImage: finalUrl,
        enhancedImage: enhancedImageUrl,
        score: result.score,
        visualEvaluation: result.visual_evaluation,
        emotionalInterpretation: result.emotional_interpretation
      });
      addToast('✨ Your illustration is ready!');
    } catch (err) {
      addToast('Failed to enhance drawing. Please try again.');
      console.error('Enhancement Error:', err);
    }
    setIsEnhancing(false);
  };

  const handleSaveEnhancedEntry = (type) => {
    if (!enhancedResult) return;
    
    // Convert to journal text entry, mentioning the AI enhancement
    const baseText = text ? `${text}\n\n` : '';
    let entryText = '';
    
    const analysisText = `Score: ${enhancedResult.score}\nVisual Evaluation: ${enhancedResult.visualEvaluation}\nEmotional Interpretation: ${enhancedResult.emotionalInterpretation}`;
    
    if (type === 'enhanced') {
      entryText = `${baseText}[✨ AI Enhanced Artwork appended]\n\n${analysisText}`;
    } else if (type === 'both') {
      entryText = `${baseText}[🎨 Original Sketch appended]\n[✨ AI Enhanced Artwork appended]\n\n${analysisText}`;
    }
    
    const images = {
      original: type === 'both' ? enhancedResult.originalImage : null,
      enhanced: enhancedResult.enhancedImage
    };
    
    saveJournal(entryText, aiEnabled, null, images);
    setJournals(getJournals());
    addToast('✨ Enhanced entry saved successfully!');
    handleNewEntry();
  };

  const viewEntry = (entry) => {
    setSelectedEntry(entry);
    setText(entry.text);
    setDrawingAnalysis(null);
    setError(null);
    
    if (entry.images && entry.images.enhanced) {
      setEnhancedResult({
        originalImage: entry.images.original, 
        enhancedImage: entry.images.enhanced,
        score: "Saved Entry", 
        visualEvaluation: "See journal text above.",
        emotionalInterpretation: "See journal text above."
      });
      setSavedDrawing(entry.images.original);
    } else if (entry.images && entry.images.original) {
      setSavedDrawing(entry.images.original);
      setEnhancedResult(null);
    } else {
      setSavedDrawing(null);
      setEnhancedResult(null);
    }
    if (entry.emotion_tone) {
      setAnalysis({
        emotion_tone: entry.emotion_tone,
        stress_trigger: entry.stress_trigger,
        sentiment_score: entry.sentiment_score || 'N/A',
        insight: entry.insight || null,
      });
    } else {
      setAnalysis(null);
    }
  };

  const formatDate = (ts) => {
    const d = new Date(ts);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const sentimentColor = (s) => {
    if (s === 'Positive') return 'var(--green-500)';
    if (s === 'Negative') return 'var(--rose-500)';
    if (s === 'Mixed') return 'var(--amber-500)';
    return 'var(--gray-500)';
  };

  return (
    <div className="fade-in premium-page">
      <JournalBackground />
      <div className="premium-header">
        <div>
          <h1 className="premium-greeting">Journal ✍️</h1>
          <p className="premium-sub">Express yourself freely. This is your safe space.</p>
        </div>
      </div>

      <div className="journal-layout">
        {/* === LEFT COLUMN === */}
        <div className="journal-left">

          {/* Mood Chips */}
          <div className="premium-glass-card" style={{ marginBottom: 12 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>How are you feeling?</div>
            <div className="mood-chips">
              {MOOD_CHIPS.map(mood => (
                <button
                  key={mood.id}
                  className={`mood-chip ${selectedMood === mood.id ? 'selected' : ''}`}
                  onClick={() => setSelectedMood(selectedMood === mood.id ? null : mood.id)}
                  style={{
                    borderColor: selectedMood === mood.id ? mood.color : 'transparent',
                    background: selectedMood === mood.id ? `${mood.color}15` : undefined,
                  }}
                >
                  <MoodAvatar character={user?.avatar || 'neutral'} mood={mood.id} size={18} />
                  <span style={{ color: selectedMood === mood.id ? mood.color : undefined }}>{mood.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="journal-tabs">
            <button className={`journal-tab ${activeTab === 'write' ? 'active' : ''}`} onClick={() => setActiveTab('write')}>
              <Type size={14} /> Write
            </button>
            <button className={`journal-tab ${activeTab === 'draw' ? 'active' : ''}`} onClick={() => setActiveTab('draw')}>
              <PenTool size={14} /> Draw & Create
            </button>
          </div>

          {activeTab === 'write' && (
            <>
              {/* Gemini Toggle */}
              <div className="premium-glass-card" style={{ marginBottom: 12, padding: '12px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="premium-icon-circle" style={{ background: 'linear-gradient(135deg, var(--primary-50), var(--primary-100))' }}>
                      <Sparkles size={14} color="var(--primary-500)" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>Gemini AI Analysis</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                        {aiEnabled ? 'Powered by Google Gemini' : 'Disabled'}
                      </div>
                    </div>
                  </div>
                  <button className={`toggle ${aiEnabled ? 'active' : ''}`} onClick={() => setAiEnabled(!aiEnabled)} />
                </div>
              </div>

              {/* Journal Canvas */}
              <div className="premium-glass-card journal-canvas-card" style={{ padding: 0, overflow: 'hidden' }}>
                
                {/* Formatting Toolbar */}
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 12, padding: '12px 16px', background: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(148,163,184,0.1)' }}>
                  
                  {/* Font Family Picker */}
                  <select 
                    value={fontFamily} 
                    onChange={e => setFontFamily(e.target.value)}
                    style={{ 
                      padding: '6px 10px', 
                      borderRadius: 8, 
                      border: '1px solid rgba(148,163,184,0.3)', 
                      background: 'rgba(255,255,255,0.6)',
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      outline: 'none',
                      fontFamily: fontFamily
                    }}
                  >
                    <option value="Inter, sans-serif" style={{ fontFamily: 'Inter, sans-serif' }}>Inter (Default)</option>
                    <option value="Outfit, sans-serif" style={{ fontFamily: 'Outfit, sans-serif' }}>Outfit (Modern)</option>
                    <option value="Georgia, serif" style={{ fontFamily: 'Georgia, serif' }}>Georgia (Serif)</option>
                    <option value="'Comic Sans MS', cursive, sans-serif" style={{ fontFamily: "'Comic Sans MS', cursive, sans-serif" }}>Comic Sans (Playful)</option>
                    <option value="'Courier New', Courier, monospace" style={{ fontFamily: "'Courier New', Courier, monospace" }}>Courier (Monospace)</option>
                    <option value="Impact, fantasy" style={{ fontFamily: "Impact, fantasy" }}>Impact (Bold)</option>
                  </select>

                  <div style={{ width: 1, height: 20, background: 'rgba(148,163,184,0.2)' }} />
                  <button 
                    onClick={() => setIsBold(!isBold)}
                    style={{ background: isBold ? 'rgba(174,203,159,0.3)' : 'transparent', border: 'none', padding: 6, borderRadius: 6, color: isBold ? '#5c7f4a' : '#8fa382', cursor: 'pointer', display: 'flex' }}
                    title="Bold"
                  >
                    <Bold size={16} />
                  </button>
                  <button 
                    onClick={() => setIsItalic(!isItalic)}
                    style={{ background: isItalic ? 'rgba(174,203,159,0.3)' : 'transparent', border: 'none', padding: 6, borderRadius: 6, color: isItalic ? '#5c7f4a' : '#8fa382', cursor: 'pointer', display: 'flex' }}
                    title="Italic"
                  >
                    <Italic size={16} />
                  </button>
                  
                  <div style={{ width: 1, height: 20, background: 'rgba(148,163,184,0.2)', margin: '0 4px' }} />
                  
                  <div style={{ display: 'flex', gap: 6 }}>
                    {['#535850', '#c06058', '#4b6bfb', '#8b5cf6', '#059669'].map(color => (
                      <button
                        key={color}
                        onClick={() => setTextColor(color)}
                        style={{
                          width: 20, height: 20, borderRadius: '50%', background: color, border: 'none', cursor: 'pointer',
                          boxShadow: textColor === color ? `0 0 0 2px white, 0 0 0 4px ${color}` : 'none',
                          transform: textColor === color ? 'scale(1.1)' : 'scale(1)'
                        }}
                        title="Text Color"
                      />
                    ))}
                  </div>
                </div>

                  <textarea
                  className="journal-textarea"
                  style={{ 
                    padding: '16px', 
                    fontWeight: isBold ? 700 : 500, 
                    fontStyle: isItalic ? 'italic' : 'normal',
                    color: textColor,
                    fontFamily: fontFamily,
                    transition: 'all 0.2s ease'
                  }}
                  placeholder={selectedMood ? `Task: ${MOOD_TASKS[selectedMood]?.write}` : "Write about your day, your thoughts, or what's on your mind..."}
                  value={text}
                  onChange={(e) => { setText(e.target.value); setAnalysis(null); setSelectedEntry(null); setError(null); }}
                />

                {savedDrawing && (
                  <div style={{ marginTop: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, fontSize: '0.7rem', fontWeight: 600, color: '#8b5cf6' }}>
                      <Image size={12} /> Original Sketch attached
                    </div>
                    <img src={savedDrawing} alt="Drawing" style={{ width: '100%', maxHeight: 120, objectFit: 'contain', borderRadius: 12, border: '1px solid rgba(148,163,184,0.15)', background: 'white' }} />
                  </div>
                )}
                
                {enhancedResult && enhancedResult.enhancedImage && (
                  <div style={{ marginTop: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, fontSize: '0.7rem', fontWeight: 600, color: 'var(--primary-600)' }}>
                      <Sparkles size={12} /> AI Enhanced Artwork attached
                    </div>
                    <img 
                      src={enhancedResult.enhancedImage} 
                      alt="Enhanced Artwork" 
                      style={{ width: '100%', maxHeight: 250, objectFit: 'cover', borderRadius: 12, border: '2px solid var(--primary-200)' }} 
                    />
                  </div>
                )}

                <div className="journal-canvas-footer">
                  <button className="premium-save-btn" onClick={handleSave} disabled={(!text.trim() && !savedDrawing) || analyzing}>
                    <Save size={14} />
                    {analyzing ? 'Analyzing...' : 'Save Entry'}
                  </button>
                  {(analysis || selectedEntry) && (
                    <button className="premium-back-btn" onClick={handleNewEntry} style={{ fontSize: '0.75rem' }}>New Entry</button>
                  )}
                  <span className="journal-char-count">{text.length} chars</span>
                </div>
              </div>
            </>
          )}

          {activeTab === 'draw' && (
            <div className="premium-glass-card fade-in">
              <div style={{ marginBottom: 15, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '0.9rem', marginBottom: 2 }}>🎨 Creative Space</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--primary-600)', fontWeight: 600 }}>
                    {selectedMood ? `Mood Task: ${MOOD_TASKS[selectedMood]?.draw}` : "Draw how your mind feels today."}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {!enhancedResult && (
                    <>
                      <button 
                        className="premium-back-btn" 
                        style={{ padding: '8px 16px', background: 'white', border: '1px solid var(--primary-200)' }}
                        onClick={handleScoreDrawing}
                        disabled={scoring || isEnhancing}
                      >
                        {scoring ? 'Scoring...' : 'Score My Drawing'}
                      </button>
                      <button 
                        className="premium-save-btn" 
                        style={{ padding: '8px 16px', fontWeight: 700, background: 'var(--primary-600)', boxShadow: '0 4px 12px rgba(92,127,74,0.3)' }}
                        onClick={() => handleEnhanceDrawing()}
                        disabled={isEnhancing || scoring}
                      >
                        <Sparkles size={16} style={{ marginRight: 6 }} /> {isEnhancing ? 'Enhancing...' : 'Enhance My Drawing'}
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              {/* Show original canvas UNLESS we have an enhanced result to show side-by-side */}
              {!enhancedResult && !isEnhancing && (
                <DrawingCanvas ref={canvasRef} onSave={handleSaveDrawing} />
              )}
              
              {/* Enhancing State Loader */}
              {isEnhancing && (
                <div style={{ padding: '60px 0', textAlign: 'center', background: 'rgba(255,255,255,0.4)', borderRadius: 16 }}>
                  <div className="premium-icon-circle" style={{ margin: '0 auto 16px', animation: 'spin-slow 3s linear infinite' }}>
                    <Sparkles size={24} color="var(--primary-500)" />
                  </div>
                  <h3 style={{ fontSize: '1rem', color: 'var(--primary-700)', marginBottom: 8 }}>Gemini is reimagining your sketch...</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Adding soft colors, dreamy aesthetic, and beautiful details.</p>
                </div>
              )}

              {/* Enhanced Side-by-Side View */}
              {enhancedResult && (
                <div className="fade-in">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                    <h3 style={{ fontSize: '1rem', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Brain size={18} /> AI Analysis & Enhancement
                    </h3>
                  </div>
                  <div style={{ 
                    display: 'flex', flexDirection: window.innerWidth < 600 ? 'column' : 'row', 
                    gap: 16, marginBottom: 20 
                  }}>
                    {/* Left: Original */}
                    <div style={{ flex: 1, background: 'white', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(148,163,184,0.2)' }}>
                      <div style={{ padding: '8px 12px', fontSize: '0.75rem', fontWeight: 600, background: 'rgba(241,245,249,0.5)', borderBottom: '1px solid rgba(148,163,184,0.1)' }}>Original Drawing</div>
                      <img src={enhancedResult.originalImage} alt="Original Sketch" style={{ width: '100%', height: 250, objectFit: 'contain', background: 'white' }} />
                    </div>
                    
                    {/* Right: AI Enhanced */}
                    <div style={{ flex: 1, background: 'white', borderRadius: 12, overflow: 'hidden', border: '2px solid var(--primary-200)', boxShadow: '0 8px 20px rgba(92,127,74,0.1)' }}>
                      <div style={{ padding: '8px 12px', fontSize: '0.75rem', fontWeight: 600, background: 'var(--primary-50)', color: 'var(--primary-700)', borderBottom: '1px solid var(--primary-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Enhanced Version</span>
                        <div className="premium-badge" style={{ background: 'white', padding: '2px 8px', fontSize: '0.6rem' }}>Score: {enhancedResult.score}</div>
                      </div>
                      <div style={{ position: 'relative' }}>
                        <img 
                          src={enhancedResult.enhancedImage} 
                          alt="Enhanced Artwork" 
                          crossOrigin="anonymous"
                          referrerPolicy="no-referrer"
                          style={{ width: '100%', height: 250, objectFit: 'cover', display: 'block' }} 
                          onError={(e) => {
                            const currentSrc = e.target.src;
                            if (currentSrc.includes('pollinations.ai/p')) {
                              // Try official image domain if first fails
                              console.warn('Pollinations mirror 1 failing, trying record mirror...');
                              e.target.src = currentSrc.replace('pollinations.ai/p', 'image.pollinations.ai/prompt');
                            } else if (currentSrc.includes('image.pollinations.ai')) {
                              // Deep fallback to a totally different free generator
                              console.warn('All Pollinations mirrors failing, trying backup generator...');
                              const prompt = currentSrc.split('/').pop().split('?')[0];
                              e.target.src = `https://api.airforce/v1/image?prompt=${prompt}&model=flux&width=1024&height=1024`;
                            } else {
                              // Ultimate SVG placeholder
                              console.error('All AI mirrors failed.');
                              e.target.src = `data:image/svg+xml;base64,${btoa(`
                                <svg width="800" height="800" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <rect width="800" height="800" fill="#f8fafc"/>
                                  <circle cx="400" cy="400" r="100" fill="#aecc9f" opacity="0.2">
                                    <animate attributeName="r" values="80;120;80" dur="3s" repeatCount="indefinite" />
                                  </circle>
                                  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#5c7f4a" font-family="sans-serif" font-size="24">Art is taking longer than usual...</text>
                                  <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="16">The AI services are heavily loaded. Click Reload to try again.</text>
                                </svg>
                              `)}`;
                            }
                          }}
                        />
                        <button 
                          onClick={() => handleEnhanceDrawing(enhancedResult.originalImage)}
                          style={{ 
                            position: 'absolute', bottom: 10, right: 10, 
                            padding: '4px 8px', fontSize: '0.6rem', background: 'rgba(0,0,0,0.5)', 
                            color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' 
                          }}
                        >
                          Reload AI Art
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* AI Evaluation Data */}
                  <div className="premium-ai-reflection" style={{ marginBottom: 20 }}>
                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Visual Evaluation</div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{enhancedResult.visualEvaluation}</p>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Emotional Interpretation</div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{enhancedResult.emotionalInterpretation}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    <button className="premium-save-btn" onClick={() => handleSaveEnhancedEntry('enhanced')}>
                      Save Enhanced to Journal
                    </button>
                    <button className="premium-back-btn" onClick={() => handleSaveEnhancedEntry('both')} style={{ background: 'white', color: 'var(--text-primary)' }}>
                      Save Both
                    </button>
                    <div style={{ flex: 1 }} />
                    <button className="premium-back-btn" onClick={() => handleEnhanceDrawing(enhancedResult.originalImage)} style={{ background: 'transparent' }}>
                      <Sparkles size={14} style={{ marginRight: 6, verticalAlign: -2 }} /> Regenerate
                    </button>
                    <button className="premium-back-btn" onClick={() => setEnhancedResult(null)} style={{ background: 'transparent' }}>
                      Back to Canvas
                    </button>
                  </div>
                </div>
              )}

              {/* Drawing Analysis Result (Score & Patterns) */}
              {drawingAnalysis && !enhancedResult && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="fade-in premium-ai-reflection" style={{ marginTop: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Brain size={16} color="var(--primary-600)" />
                      <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--primary-800)' }}>Pattern Intelligence</span>
                    </div>
                    <div className="premium-badge" style={{ background: 'var(--primary-600)', color: 'white', padding: '4px 10px' }}>Score: {drawingAnalysis.score}/10</div>
                  </div>
                  
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: 12, fontStyle: 'italic', lineHeight: 1.5 }}>"{drawingAnalysis.remarks}"</p>
                  
                  <div style={{ padding: '12px', background: 'rgba(255,255,255,0.6)', borderRadius: 12, border: '1px solid var(--primary-100)' }}>
                     <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary-700)', textTransform: 'uppercase', marginBottom: 4 }}>Psychological Patterns</div>
                     <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{drawingAnalysis.pattern_analysis}</p>
                     {drawingAnalysis.mood_alignment && (
                       <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid rgba(148,163,184,0.1)', fontSize: '0.75rem' }}>
                         <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Mood Alignment: </span>
                         <span style={{ color: 'var(--primary-600)' }}>{drawingAnalysis.mood_alignment}</span>
                       </div>
                     )}
                  </div>
                  
                  <div style={{ marginTop: 15, display: 'flex', gap: 10 }}>
                     <button className="premium-back-btn" style={{ padding: '8px 16px', fontSize: '0.8rem', background: 'white' }} onClick={() => setDrawingAnalysis(null)}>Close Analysis</button>
                     <button className="premium-save-btn" style={{ padding: '8px 16px', fontSize: '0.8rem' }} onClick={() => handleSave()}>Save Entry with Score</button>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="premium-error fade-in">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          {/* Analyzing */}
          {analyzing && (
            <div className="premium-analyzing fade-in">
              <Sparkles size={16} className="premium-analyzing-icon" />
              Gemini is analyzing your emotions...
            </div>
          )}

          {/* AI Analysis Result */}
          {analysis && !analyzing && (
            <div className="premium-ai-reflection fade-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <Brain size={14} />
                <span style={{ fontWeight: 700, fontSize: '0.8rem' }}>MindOasis AI Reflection</span>
              </div>
              <div className="ai-reflection-grid">
                <div className="ai-reflection-item">
                  <div className="ai-reflection-label">Emotion</div>
                  <div className="ai-reflection-value">{analysis.emotion_tone}</div>
                </div>
                <div className="ai-reflection-item">
                  <div className="ai-reflection-label">Trigger</div>
                  <div className="ai-reflection-value">{analysis.stress_trigger}</div>
                </div>
                <div className="ai-reflection-item">
                  <div className="ai-reflection-label">Sentiment</div>
                  <div className="ai-reflection-value" style={{ color: sentimentColor(analysis.sentiment_score) }}>{analysis.sentiment_score}</div>
                </div>
              </div>
              {analysis.insight && (
                <div className="ai-reflection-insight">
                  <div style={{ fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 4 }}>💡 Insight</div>
                  <p>{analysis.insight}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* === RIGHT COLUMN — PAST ENTRIES === */}
        <div className="journal-right">
          <div className="premium-glass-card">
            <div className="premium-section-header">
              <h2><Clock size={14} style={{ marginRight: 6, verticalAlign: -2 }} />Past Entries</h2>
              <span className="premium-badge">{journals.length}</span>
            </div>

            {journals.length === 0 ? (
              <div className="journal-empty">
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>📝</div>
                <h3>No entries yet</h3>
                <p>Start writing to see your journal history</p>
              </div>
            ) : (
              <div className="journal-entries-list">
                {journals.slice(0, 20).map(entry => (
                  <button
                    key={entry.id}
                    className={`journal-entry-item ${selectedEntry?.id === entry.id ? 'selected' : ''}`}
                    onClick={() => viewEntry(entry)}
                  >
                    <div className="journal-entry-top">
                      <span className="journal-entry-date">{formatDate(entry.timestamp)}</span>
                      {entry.emotion_tone && (
                        <span className="journal-entry-mood-tag">
                          <Sparkles size={8} /> {entry.emotion_tone}
                        </span>
                      )}
                    </div>
                    <div className="journal-entry-preview">
                      {entry.text.includes('[🎨 Original Sketch') || entry.text.includes('[✨ AI Enhanced') ? '🎨 ' : ''}
                      {entry.text.replace('\n\n[🎨 Original Sketch appended]', '').replace('\n[✨ AI Enhanced Artwork appended]', '').slice(0, 120)}
                      {entry.text.length > 120 ? '...' : ''}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
