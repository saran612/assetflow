import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const exitTimers = useRef({});

  const beginExit = useCallback((id) => {
    // Mark the toast as exiting so it plays exit transition
    setToasts(prev => prev.map(t => t.id === id ? { ...t, isExiting: true } : t));
    // After exit transition completes, remove from DOM
    exitTimers.current[id] = setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
      delete exitTimers.current[id];
    }, 300);
  }, []);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, isExiting: false }]);

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      beginExit(id);
    }, 3000);
  }, [beginExit]);

  const removeToast = useCallback((id) => {
    // Cancel any pending auto-dismiss exit
    if (exitTimers.current[id]) {
      clearTimeout(exitTimers.current[id]);
      delete exitTimers.current[id];
    }
    beginExit(id);
  }, [beginExit]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`
              pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border
              ${toast.type === 'success' ? 'bg-white border-emerald-100' : 'bg-white border-red-100'}
            `}
            style={{
              boxShadow: toast.type === 'success'
                ? '0 10px 25px -5px rgba(16, 185, 129, 0.1), 0 8px 10px -6px rgba(16, 185, 129, 0.1)'
                : '0 10px 25px -5px rgba(239, 68, 68, 0.1), 0 8px 10px -6px rgba(239, 68, 68, 0.1)',
              // State-driven enter/exit transitions
              opacity: toast.isExiting ? 0 : 1,
              transform: toast.isExiting ? 'translateX(30px) scale(0.95)' : 'translateX(0) scale(1)',
              transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
              animation: toast.isExiting ? 'none' : 'slideInRight 0.3s ease-out'
            }}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            )}
            <p className="text-sm font-bold text-slate-800 tracking-wide pr-6">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
