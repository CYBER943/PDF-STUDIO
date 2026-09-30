import React from 'react';
import { useDocuments } from '../context/DocumentContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useDocuments();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        let icon = <Info className="w-5 h-5 text-sky-500 shrink-0" />;
        let bg = 'bg-white border-slate-200 text-slate-800 shadow-xl';

        if (toast.type === 'success') {
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
          bg = 'bg-emerald-950 text-emerald-100 border-emerald-800 shadow-emerald-900/20 shadow-xl';
        } else if (toast.type === 'error') {
          icon = <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />;
          bg = 'bg-rose-950 text-rose-100 border-rose-800 shadow-rose-900/20 shadow-xl';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
          bg = 'bg-amber-950 text-amber-100 border-amber-800 shadow-amber-900/20 shadow-xl';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all transform translate-y-0 animate-in fade-in slide-in-from-bottom-2 ${bg}`}
          >
            {icon}
            <span className="flex-1">{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
};
