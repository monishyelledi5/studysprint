import React from 'react';
import { useApp } from '../../context/AppContext';
import { getGreeting } from '../../utils/date';
import { Plus, Sun, Moon, Menu, Timer as TimerIcon } from 'lucide-react';

interface HeaderProps {
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  const {
    currentView,
    settings,
    updateSettings,
    openTaskModal,
    timerState,
    setCurrentView,
    tasks,
  } = useApp();

  const pendingCount = tasks.filter(t => !t.completed).length;

  const viewTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: {
      title: `${getGreeting()}, ${settings.name.split(' ')[0]}`,
      subtitle: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }),
    },
    tasks: {
      title: 'Tasks & Assignments',
      subtitle: `${pendingCount} pending study item${pendingCount === 1 ? '' : 's'}`,
    },
    subjects: {
      title: 'Subjects & Goals',
      subtitle: 'Course management and progress monitoring',
    },
    exams: {
      title: 'Exam Countdown',
      subtitle: 'Key dates, locations, and revision trackers',
    },
    timer: {
      title: 'Study Sprint Timer',
      subtitle: 'Pomodoro focus intervals and break tracking',
    },
    analytics: {
      title: 'Study Progress & Consistency',
      subtitle: 'Session analytics and subject completion trends',
    },
    settings: {
      title: 'Personalization & Settings',
      subtitle: 'Preferences, study schedules, and system storage',
    },
  };

  const currentInfo = viewTitles[currentView] || { title: 'StudySprint', subtitle: '' };

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Hamburger (mobile) + View title & context */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
              {currentInfo.title}
            </h1>
            <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400">
              {currentInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Right: Timer pill (if active), Theme toggle, Add Task CTA */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {timerState.isRunning && currentView !== 'timer' && (
            <button
              onClick={() => setCurrentView('timer')}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors"
            >
              <TimerIcon className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
              <span className="hidden sm:inline">Timer Running</span>
            </button>
          )}

          <button
            onClick={toggleTheme}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle light/dark theme"
            title={`Switch to ${settings.theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {settings.theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          <button
            onClick={() => openTaskModal()}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-lg transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>
    </header>
  );
};
