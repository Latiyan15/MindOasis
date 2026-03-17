import { FileText, ArrowRight, X } from 'lucide-react';

export default function ReportPopup({ onClose }) {
  return (
    <div className="report-popup-overlay fade-in">
      <div className="report-popup-card">
        <button className="report-popup-close" onClick={onClose}><X size={18} /></button>
        <div className="report-popup-icon">
          <FileText size={32} color="var(--primary-500)" />
        </div>
        <h3>Digital Report Ready</h3>
        <p>Gemini has generated a detailed mental wellness report based on your latest activity.</p>
        <button 
          className="btn btn-primary btn-glow" 
          onClick={() => {
            window.location.hash = '/report';
            onClose();
          }}
          style={{ width: '100%', gap: 8 }}
        >
          View Full Report <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
