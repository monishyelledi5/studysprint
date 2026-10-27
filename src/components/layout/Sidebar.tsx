import React from 'react';
import { useApp } from '../../context/AppContext';
import { ViewType } from '../../types';
import {
  LayoutDashboard,
  CheckSquare,
  BookOpen,
  CalendarClock,
  Timer,
  BarChart3,
  Settings,
  X,
  GraduationCap,
  Flame,
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const { currentView, setCurrentView, tasks, exams, settings, streak } = useApp();

  const pendingTasksCount = tasks.filter(t => !t.completed).length;
  const upcomingExamsCount = exams.length;

  const navItems: { id: ViewType; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: <CheckSquare className="w-4 h-4" />,
      badge: pendingTasksCount > 0 ? pendingTasksCount : undefined,
    },
    {
      id: 'subjects',
      label: 'Subjects',
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      id: 'exams',
      label: 'Exam Countdown',
      icon: <CalendarClock className="w-4 h-4" />,
      badge: upcomingExamsCount > 0 ? upcomingExamsCount : undefined,
    },
    {
      id: 'timer',
      label: 'Study Timer',
      icon: <Timer className="w-4 h-4" />,
    },
    {
      id: 'analytics',
      label: 'Progress & Stats',
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  const handleNavClick = (id: ViewType) => {
    setCurrentView(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo / Brand */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-900/30">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-base font-bold text-white tracking-tight">StudySprint</span>
                <span className="block text-[10px] uppercase font-semibold tracking-wider text-slate-400">College Hub</span>
              </div>
            </div>

            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav links */}
          <nav className="p-3 space-y-1">
            {navItems.map(item => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-white' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-blue-700 text-white'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Student Profile Card in Sidebar Footer */}
        <div className="p-3 border-t border-slate-800">
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-950 border border-blue-600/40 text-blue-400 font-semibold text-xs flex items-center justify-center shrink-0">
                {settings.name
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase() || 'ST'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-white truncate">{settings.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{settings.major || 'College Student'}</p>
              </div>
            </div>
            <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between font-medium">
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                <Flame className="w-3 h-3 fill-amber-400" />
                <span>{streak.currentStreak}d streak</span>
              </span>
              <button
                onClick={() => handleNavClick('settings')}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
