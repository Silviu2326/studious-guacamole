import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Info, 
  Loader2, 
  X 
} from 'lucide-react';

// --- Types ---

export type ToastType = 'success' | 'warning' | 'error' | 'info' | 'progress';

export interface ToastAction {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'outline';
}

export interface ToastData {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number; // ms, default 5000 (0 for no auto-dismiss)
  actions?: ToastAction[];
  progress?: number; // 0-100 for progress type
  onDismiss?: () => void;
}

interface ToastContextValue {
  toasts: ToastData[];
  addToast: (toast: Omit<ToastData, 'id'>) => string;
  removeToast: (id: string) => void;
  updateToast: (id: string, updates: Partial<ToastData>) => void;
}

// --- Context ---

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

// --- Constants ---

const DEFAULT_DURATION = 5000;

// --- Component: ToastItem ---

const ToastItem: React.FC<{
  toast: ToastData;
  onRemove: (id: string) => void;
}> = ({ toast, onRemove }) => {
  const { id, type, title, message, duration, actions, progress } = toast;

  // Auto-dismiss logic
  useEffect(() => {
    if (type === 'error' || duration === 0) return; // Don't auto-dismiss errors or persistent toasts

    const timer = setTimeout(() => {
      onRemove(id);
    }, duration || DEFAULT_DURATION);

    return () => clearTimeout(timer);
  }, [id, type, duration, onRemove]);

  // Icons and Styles based on type
  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50 border-green-200',
          icon: <CheckCircle className="w-5 h-5 text-green-600" />,
          titleColor: 'text-green-800',
          textColor: 'text-green-700',
          progressBar: 'bg-green-500'
        };
      case 'warning':
        return {
          bg: 'bg-orange-50 border-orange-200',
          icon: <AlertTriangle className="w-5 h-5 text-orange-600" />,
          titleColor: 'text-orange-800',
          textColor: 'text-orange-700',
          progressBar: 'bg-orange-500'
        };
      case 'error':
        return {
          bg: 'bg-red-50 border-red-200',
          icon: <XCircle className="w-5 h-5 text-red-600" />,
          titleColor: 'text-red-800',
          textColor: 'text-red-700',
          progressBar: 'bg-red-500'
        };
      case 'progress':
        return {
          bg: 'bg-blue-50 border-blue-200',
          icon: <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />,
          titleColor: 'text-blue-800',
          textColor: 'text-blue-700',
          progressBar: 'bg-blue-500'
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-50 border-blue-200',
          icon: <Info className="w-5 h-5 text-blue-600" />,
          titleColor: 'text-blue-800',
          textColor: 'text-blue-700',
          progressBar: 'bg-blue-500'
        };
    }
  };

  const styles = getStyles();

  return (
    <div 
      className={`
        pointer-events-auto
        w-full max-w-sm 
        ${styles.bg} border shadow-lg rounded-lg 
        pointer-events-auto flex flex-col overflow-hidden
        transition-all duration-300 ease-in-out
        animate-in slide-in-from-right-full fade-in
        mb-3 last:mb-0
      `}
      role="alert"
    >
      <div className="p-4 flex items-start">
        <div className="flex-shrink-0 mt-0.5">
          {styles.icon}
        </div>
        <div className="ml-3 w-0 flex-1 pt-0.5">
          <p className={`text-sm font-medium ${styles.titleColor}`}>
            {title}
          </p>
          {message && (
            <p className={`mt-1 text-sm ${styles.textColor}`}>
              {message}
            </p>
          )}
          
          {/* Actions */}
          {actions && actions.length > 0 && (
            <div className="mt-3 flex space-x-3">
              {actions.map((action, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    action.onClick();
                    // Optional: dismiss after action? 
                    // Usually yes, but depends on action. 
                    // Let the action handler decide if it should dismiss explicitly or not, 
                    // but standard UI often keeps it unless it's a "Undo" which usually dismisses.
                    // For now, we just execute the action.
                  }}
                  className={`
                    bg-white rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2
                    px-2 py-1
                    ${styles.textColor}
                    ${styles.titleColor} hover:${styles.bg} border border-transparent shadow-sm
                    hover:bg-opacity-75
                  `}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}

          {/* Progress Bar */}
          {type === 'progress' && progress !== undefined && (
            <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700 overflow-hidden">
              <div 
                className={`${styles.progressBar} h-1.5 rounded-full transition-all duration-300`} 
                style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
              ></div>
            </div>
          )}
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            className={`rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            onClick={() => onRemove(id)}
          >
            <span className="sr-only">Close</span>
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Provider ---

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((toast: Omit<ToastData, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => {
      const toast = prev.find(t => t.id === id);
      if (toast && toast.onDismiss) {
        toast.onDismiss();
      }
      return prev.filter((t) => t.id !== id);
    });
  }, []);

  const updateToast = useCallback((id: string, updates: Partial<ToastData>) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, updateToast }}>
      {children}
      
      {/* Toast Container - Top Right Fixed */}
      <div 
        aria-live="assertive" 
        className="fixed inset-0 flex items-start px-4 py-6 pointer-events-none sm:p-6 z-[9999]"
      >
        <div className="w-full flex flex-col items-end space-y-4">
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
};

// --- Hook ---

export const useEditorToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useEditorToast must be used within a ToastProvider');
  }
  return context;
};
