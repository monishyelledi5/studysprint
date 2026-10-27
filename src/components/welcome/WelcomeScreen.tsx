import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GraduationCap, ArrowRight, Sparkles, BookOpen, Clock, Calendar, Flame, Sun, Moon } from 'lucide-react';

export const WelcomeScreen: React.FC = () => {
  const { completeProfile, resetToSampleData, settings, updateSettings } = useApp();
  const [name, setName] = useState('');
  const [major, setMajor] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Please enter your name to continue');
      return;
    }
    completeProfile(trimmed, major.trim() || undefined);
  };

  const toggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    updateSettings({ theme: nextTheme });
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between p-4 sm:p-8 transition-colors">
      {/* Top Bar with Logo & Theme Toggle */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Study<span className="text-blue-600 dark:text-blue-400">Sprint</span>
            </span>
            <span className="block text-xs text-slate-500 dark:text-slate-400 font-medium">
              Student Command Center
            </span>
          </div>
        </div>

        <button
          onClick={toggleTheme}
          type="button"
          aria-label="Toggle theme"
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm"
        >
          {settings.theme === 'dark' ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-slate-600" />
          )}
        </button>
      </header>

      {/* Main Welcome Card */}
      <main className="max-w-xl w-full mx-auto my-auto py-8">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-xl shadow-slate-900/5 dark:shadow-none">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome to StudySprint</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Get organized this semester.
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Manage your courses, assignments, exams, and study focus sessions — all in one clean space.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="student-name"
                className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2"
              >
                What should we call you? <span className="text-rose-500">*</span>
              </label>
              <input
                id="student-name"
                type="text"
                value={name}
                onChange={e => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="e.g. Monish, Alex, Sophia"
                autoFocus
                className={`w-full px-4 py-3 rounded-xl border ${
                  error
                    ? 'border-rose-500 dark:border-rose-500 ring-2 ring-rose-500/20'
                    : 'border-slate-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20'
                } bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-base font-medium outline-none transition-all`}
              />
              {error && (
                <p className="mt-2 text-xs sm:text-sm text-rose-600 dark:text-rose-400 font-medium">
                  {error}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="student-major"
                className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2"
              >
                Major or Field of Study <span className="text-xs font-normal text-slate-400">(optional)</span>
              </label>
              <input
                id="student-major"
                type="text"
                value={major}
                onChange={e => setMajor(e.target.value)}
                placeholder="e.g. Computer Science, Biology, Economics"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-base font-medium outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-base shadow-lg shadow-blue-600/25 hover:shadow-blue-600/35 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Continue to Dashboard</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>

          {/* Quick Features Highlight */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-500 shrink-0" />
              <span>Custom courses & colors</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Pomodoro focus timer</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Live exam countdowns</span>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500 shrink-0" />
              <span>Daily study streak tracker</span>
            </div>
          </div>

          {/* Option to load demo sample data for exploration */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                resetToSampleData();
                completeProfile('Alex Rivera', 'Computer Science');
              }}
              className="text-xs text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 font-medium underline underline-offset-4 cursor-pointer"
            >
              Want to see an example first? Load sample college semester
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl w-full mx-auto text-center py-4 text-xs text-slate-400 dark:text-slate-500">
        StudySprint — Stored locally in your browser. No account or password required.
      </footer>
    </div>
  );
};
