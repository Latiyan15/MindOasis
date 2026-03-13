import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Pen, Eraser, Trash2, Download, Undo2, 
  Circle, Square, Sticker, Palette, Minus, Plus
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { getAvatarSVGString } from '../utils/svgToImage';

const STICKERS = [
  '😊', '😢', '😡', '😴', '🥰', '🤔', '😎', '🤗',
  '⭐', '💖', '🌈', '☀️', '🌙', '🌸', '🎨', '🔥',
  '✨', '💪', '🧠', '🦋', '🌿', '☁️', '🎭', '🎵',
  '🏠', '📚', '🎯', '💡', '🧩', '🎪', '🌻', '🍀',
];

const COLORS = [
  '#1e293b', '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f43f5e',
  '#6366f1', '#a855f7', '#06b6d4', '#84cc16', '#fb923c',
];

const BG_COLORS = [
  '#ffffff', '#fef3c7', '#dbeafe', '#dcfce7', '#fce7f3',
  '#f3e8ff', '#e0f2fe', '#fdf2f8',
];

export default function DrawingCanvas({ onSave }) {
  const { user } = useUser();
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('pen'); // pen | eraser | sticker
  const [color, setColor] = useState('#1e293b');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [brushSize, setBrushSize] = useState(3);
  const [history, setHistory] = useState([]);
  const [selectedSticker, setSelectedSticker] = useState('AVATAR'); // Default to their custom avatar
  const [showStickers, setShowStickers] = useState(false);
  const [showBgColors, setShowBgColors] = useState(false);
  const lastPos = useRef(null);

  const getCanvas = () => canvasRef.current;
  const getCtx = () => canvasRef.current?.getContext('2d');

  // Initialize canvas
  useEffect(() => {
    const canvas = getCanvas();
    if (!canvas) return;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = 400;
    const ctx = getCtx();
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  // Change background
  useEffect(() => {
    const canvas = getCanvas();
    const ctx = getCtx();
    if (!canvas || !ctx) return;
    // Save current drawing
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // We don't restore here since changing bg is a destructive action
    // User should change bg first before drawing
  }, [bgColor]);

  const saveToHistory = () => {
    const canvas = getCanvas();
    const ctx = getCtx();
    if (!canvas || !ctx) return;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory(prev => [...prev.slice(-20), data]);
  };

  const undo = () => {
    const ctx = getCtx();
    if (!ctx || history.length === 0) return;
    const prev = history[history.length - 1];
    ctx.putImageData(prev, 0, 0);
    setHistory(h => h.slice(0, -1));
  };

  const clear = () => {
    const canvas = getCanvas();
    const ctx = getCtx();
    if (!canvas || !ctx) return;
    saveToHistory();
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const getPos = (e) => {
    const canvas = getCanvas();
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const pos = getPos(e);
    
    if (tool === 'sticker') {
      saveToHistory();
      const ctx = getCtx();
      
      if (selectedSticker === 'AVATAR') {
        const img = new Image();
        img.src = getAvatarSVGString(user?.avatar || 'neutral', 'Happy');
        img.onload = () => {
          const size = brushSize * 15 + 40;
          ctx.drawImage(img, pos.x - size / 2, pos.y - size / 2, size, size);
        };
      } else {
        ctx.font = `${brushSize * 10 + 20}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(selectedSticker, pos.x, pos.y);
      }
      return;
    }
    
    saveToHistory();
    setIsDrawing(true);
    lastPos.current = pos;
    
    const ctx = getCtx();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = tool === 'eraser' ? bgColor : color;
    ctx.lineWidth = tool === 'eraser' ? brushSize * 4 : brushSize;
    ctx.stroke();
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const pos = getPos(e);
    const ctx = getCtx();
    
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = tool === 'eraser' ? bgColor : color;
    ctx.lineWidth = tool === 'eraser' ? brushSize * 4 : brushSize;
    ctx.stroke();
    
    lastPos.current = pos;
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    lastPos.current = null;
  };

  const downloadCanvas = () => {
    const canvas = getCanvas();
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `mindoasis-drawing-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const getCanvasDataUrl = () => {
    const canvas = getCanvas();
    return canvas ? canvas.toDataURL() : null;
  };

  return (
    <div className="drawing-canvas-container">
      {/* Toolbar */}
      <div className="drawing-toolbar">
        <div className="toolbar-group">
          <button 
            className={`toolbar-btn ${tool === 'pen' ? 'active' : ''}`}
            onClick={() => { setTool('pen'); setShowStickers(false); }}
            title="Pen"
          >
            <Pen size={16} />
          </button>
          <button 
            className={`toolbar-btn ${tool === 'eraser' ? 'active' : ''}`}
            onClick={() => { setTool('eraser'); setShowStickers(false); }}
            title="Eraser"
          >
            <Eraser size={16} />
          </button>
          <button 
            className={`toolbar-btn ${tool === 'sticker' ? 'active' : ''}`}
            onClick={() => { setTool('sticker'); setShowStickers(!showStickers); }}
            title="Stickers"
          >
            <Sticker size={16} />
          </button>
        </div>

        <div className="toolbar-divider" />

        {/* Brush Size */}
        <div className="toolbar-group size-group">
          <button className="toolbar-btn" onClick={() => setBrushSize(s => Math.max(1, s - 1))}>
            <Minus size={14} />
          </button>
          <span className="size-label">{brushSize}</span>
          <button className="toolbar-btn" onClick={() => setBrushSize(s => Math.min(20, s + 1))}>
            <Plus size={14} />
          </button>
        </div>

        <div className="toolbar-divider" />

        {/* Colors */}
        <div className="toolbar-group color-group">
          {COLORS.slice(0, 8).map(c => (
            <button
              key={c}
              className={`color-swatch ${color === c ? 'active' : ''}`}
              style={{ background: c }}
              onClick={() => { setColor(c); setTool('pen'); }}
            />
          ))}
        </div>

        <div className="toolbar-divider" />

        {/* Actions */}
        <div className="toolbar-group">
          <button className="toolbar-btn" onClick={() => setShowBgColors(!showBgColors)} title="Background">
            <Palette size={16} />
          </button>
          <button className="toolbar-btn" onClick={undo} disabled={history.length === 0} title="Undo">
            <Undo2 size={16} />
          </button>
          <button className="toolbar-btn" onClick={clear} title="Clear">
            <Trash2 size={16} />
          </button>
          <button className="toolbar-btn" onClick={downloadCanvas} title="Download">
            <Download size={16} />
          </button>
        </div>
      </div>

      {/* Sticker Picker */}
      {showStickers && (
        <div className="sticker-picker fade-in">
          <button
            className={`sticker-btn ${selectedSticker === 'AVATAR' ? 'active' : ''}`}
            onClick={() => setSelectedSticker('AVATAR')}
            title="Your Companion"
          >
            <img src={getAvatarSVGString(user?.avatar || 'neutral', 'Happy')} alt="Avatar Sticker" width={24} height={24} />
          </button>
          
          <div className="toolbar-divider" style={{ width: 1, height: 24, margin: '0 4px', background: 'var(--border-color)' }} />
          
          {STICKERS.map(s => (
            <button
              key={s}
              className={`sticker-btn ${selectedSticker === s ? 'active' : ''}`}
              onClick={() => setSelectedSticker(s)}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Bg Color Picker */}
      {showBgColors && (
        <div className="bg-picker fade-in">
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Canvas Background:</span>
          {BG_COLORS.map(c => (
            <button
              key={c}
              className={`color-swatch bg-swatch ${bgColor === c ? 'active' : ''}`}
              style={{ background: c }}
              onClick={() => setBgColor(c)}
            />
          ))}
        </div>
      )}

      {/* Canvas */}
      <div className="canvas-wrapper">
        <canvas
          ref={canvasRef}
          className="drawing-canvas"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          style={{ cursor: tool === 'sticker' ? 'crosshair' : tool === 'eraser' ? 'cell' : 'crosshair' }}
        />
      </div>

      {/* Save Drawing */}
      {onSave && (
        <button 
          className="btn btn-success" 
          onClick={() => onSave(getCanvasDataUrl())}
          style={{ width: '100%', marginTop: 12 }}
        >
          <Download size={16} />
          Save Drawing to Journal
        </button>
      )}
    </div>
  );
}
