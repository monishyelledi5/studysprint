import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { FloatingMiniTimer } from './components/layout/FloatingMiniTimer';
import { NotificationToast } from './components/common/NotificationToast';
import { DashboardView } from './components/dashboard/DashboardView';
import { TasksView } from './components/tasks/TasksView';
import { SubjectsView } from './components/subjects/SubjectsView';
import { ExamsView } from './components/exams/ExamsView';
import { TimerView } from './components/timer/TimerView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { SettingsView } from './components/settings/SettingsView';
import { TaskModal } from './components/modals/TaskModal';
import { SubjectModal } from './components/modals/SubjectModal';
import { ExamModal } from './components/modals/ExamModal';
import { WelcomeScreen } from './components/welcome/WelcomeScreen';
import { LayoutDashboard, CheckSquare, BookOpen, CalendarClock, Timer } from 'lucide-react';
import { ViewType } from './types';

const MainLayout: React.FC = () => {
  const { currentView, setCurrentView, settings } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // If new user has not completed onboarding name setup, show Welcome screen
  if (!settings.isProfileSetup || !settings.name.trim()) {
    return (
      <>
        <WelcomeScreen />
        <NotificationToast />
      </>
    );
  }

  const renderActiveView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'tasks':
        return <TasksView />;
      case 'subjects':
        return <SubjectsView />;
      case 'exams':
        return <ExamsView />;
      case 'timer':
        return <TimerView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  const mobileNavItems: { id: ViewType; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Home', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'tasks', label: 'Tasks', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'subjects', label: 'Courses', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'exams', label: 'Exams', icon: <CalendarClock className="w-4 h-4" /> },
    { id: 'timer', label: 'Timer', icon: <Timer className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row transition-colors">
      {/* Sidebar Navigation */}
      <Sidebar
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-8">
        <Header onToggleMobileMenu={() => setIsMobileMenuOpen(true)} />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Bottom Quick Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around">
        {mobileNavItems.map(item => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-semibold transition-colors ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Persistent Floating Timer Indicator when navigating elsewhere */}
      <FloatingMiniTimer />

      {/* Modals */}
      <TaskModal />
      <SubjectModal />
      <ExamModal />

      {/* Toast Notifications */}
      <NotificationToast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
