import { useState, useEffect, createContext, useContext, useCallback } from 'react';

// ===== Toast Context =====
const ToastContext = createContext();

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, exit: true } : t));
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 300);
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast ${toast.type} ${toast.exit ? 'exit' : ''}`}>
            {toast.type === 'success' && '✓'}
            {toast.type === 'info' && 'ℹ'}
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
