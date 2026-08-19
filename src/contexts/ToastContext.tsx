import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

const toastConfig = {
  success: { icon: CheckCircle2, className: 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10' },
  error: { icon: XCircle, className: 'text-red-500 border-red-500/30 bg-red-500/10' },
  warning: { icon: AlertCircle, className: 'text-amber-500 border-amber-500/30 bg-amber-500/10' },
  info: { icon: Info, className: 'text-primary-500 border-primary-500/30 bg-primary-500/10' }
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(7);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="fixed bottom-6 left-6 z-[200] flex flex-col gap-2 max-w-sm">
        <AnimatePresence>
          {toasts.map(toast => {
            const config = toastConfig[toast.type];
            const Icon = config.icon;
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className={`flex items-center gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-sm ${config.className}`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <p className="text-sm text-slate-200 flex-1">{toast.message}</p>
                <button onClick={() => removeToast(toast.id)} className="text-slate-400 hover:text-white transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
