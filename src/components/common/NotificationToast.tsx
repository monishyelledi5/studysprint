import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
  };

  const borderColors = {
    success: 'border-emerald-200 dark:border-emerald-800/50',
    info: 'border-blue-200 dark:border-blue-800/50',
    warning: 'border-amber-200 dark:border-amber-800/50',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full transition-all duration-200 ease-out animate-in fade-in slide-in-from-bottom-3">
      <div className={`flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 shadow-lg border ${borderColors[toast.type]} text-slate-800 dark:text-slate-100`}>
        {icons[toast.type]}
        <div className="text-sm font-medium leading-relaxed">
          {toast.message}
        </div>
      </div>
    </div>
  );
};
