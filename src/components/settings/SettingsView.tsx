import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sun,
  Moon,
  Trash2,
  RotateCcw,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle2,
  User,
  Sliders,
  ShieldAlert,
  Flame,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    clearAllData,
    resetToSampleData,
    subjects,
    tasks,
    exams,
    studySessions,
    streak,
    testRecordStudyActivityDate,
    showToast,
  } = useApp();

  const [name, setName] = useState(settings.name);
  const [major, setMajor] = useState(settings.major);
  const [semester, setSemester] = useState(settings.semester);

  const [studyMins, setStudyMins] = useState(settings.pomodoroStudyMins);
  const [shortBreakMins, setShortBreakMins] = useState(settings.pomodoroShortBreakMins);
  const [longBreakMins, setLongBreakMins] = useState(settings.pomodoroLongBreakMins);

  const [customTestDate, setCustomTestDate] = useState('');

  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      name: name.trim() || 'Alex Rivera',
      major: major.trim(),
      semester: semester.trim(),
    });
  };

  const handleSaveTimerConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      pomodoroStudyMins: Math.max(1, Math.min(120, Number(studyMins) || 25)),
      pomodoroShortBreakMins: Math.max(1, Math.min(60, Number(shortBreakMins) || 5)),
      pomodoroLongBreakMins: Math.max(1, Math.min(60, Number(longBreakMins) || 15)),
    });
  };

  const handleExportData = () => {
    const backup = {
      version: 'studysprint-v1',
      exportedAt: new Date().toISOString(),
      settings,
      subjects,
      tasks,
      exams,
      studySessions,
      streak,
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `studysprint-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported backup file successfully with study streak', 'success');
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.subjects && parsed.tasks) {
          localStorage.setItem('studysprint_subjects_v1', JSON.stringify(parsed.subjects));
          localStorage.setItem('studysprint_tasks_v1', JSON.stringify(parsed.tasks));
          if (parsed.exams) localStorage.setItem('studysprint_exams_v1', JSON.stringify(parsed.exams));
          if (parsed.studySessions) localStorage.setItem('studysprint_sessions_v1', JSON.stringify(parsed.studySessions));
          if (parsed.settings) localStorage.setItem('studysprint_settings_v1', JSON.stringify(parsed.settings));
          if (parsed.streak) localStorage.setItem('studysprint_streak_v1', JSON.stringify(parsed.streak));
          window.location.reload();
        } else {
          showToast('Invalid backup file format', 'warning');
        }
      } catch {
        showToast('Error reading imported JSON file', 'warning');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl space-y-8">
      {/* Top Heading */}
      <div>
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          Personalization & Preferences
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Manage your student profile, visual theme, focus timer durations, and browser storage.
        </p>
      </div>

      {/* Theme Preference */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1 flex items-center gap-2">
          <span>Appearance & Color Theme</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Choose between clean light mode and focused navy dark mode.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
          <button
            type="button"
            onClick={() => updateSettings({ theme: 'light' })}
            className={`p-4 rounded-xl border flex items-center gap-3 transition-all text-left ${
              settings.theme === 'light'
                ? 'border-blue-600 bg-blue-50/40 text-blue-900 dark:bg-blue-950/40 dark:text-blue-200 ring-2 ring-blue-500/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-white shadow-xs border border-slate-200 flex items-center justify-center text-amber-500 shrink-0">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Light Mode
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Crisp background, navy accents
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => updateSettings({ theme: 'dark' })}
            className={`p-4 rounded-xl border flex items-center gap-3 transition-all text-left ${
              settings.theme === 'dark'
                ? 'border-blue-600 bg-blue-50/40 text-blue-900 dark:bg-blue-950/40 dark:text-blue-200 ring-2 ring-blue-500/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-slate-800 shadow-xs border border-slate-700 flex items-center justify-center text-blue-400 shrink-0">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Dark Mode
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Deep navy slate surfaces
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Student Profile Settings */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1 flex items-center gap-2">
          <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Student Information</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Personalize the dashboard greetings and student card.
        </p>

        <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Major / Degree Program
              </label>
              <input
                type="text"
                value={major}
                onChange={e => setMajor(e.target.value)}
                placeholder="e.g. Computer Science & Math"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Current Semester / Term
              </label>
              <input
                type="text"
                value={semester}
                onChange={e => setSemester(e.target.value)}
                placeholder="e.g. Fall Semester 2026"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>

      {/* Focus Timer Configuration */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Focus Timer Durations</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Adjust standard Pomodoro intervals to match your personal study rhythm.
        </p>

        <form onSubmit={handleSaveTimerConfig} className="space-y-4 max-w-xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Study Sprint (min)
              </label>
              <input
                type="number"
                min="1"
                max="120"
                value={studyMins}
                onChange={e => setStudyMins(parseInt(e.target.value, 10) || 25)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Short Break (min)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={shortBreakMins}
                onChange={e => setShortBreakMins(parseInt(e.target.value, 10) || 5)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Long Break (min)
              </label>
              <input
                type="number"
                min="5"
                max="60"
                value={longBreakMins}
                onChange={e => setLongBreakMins(parseInt(e.target.value, 10) || 15)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
            >
              Save Timer Durations
            </button>
          </div>
        </form>
      </div>

      {/* Study Streak Testing & Scenarios */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1 flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>Study Streak Engine & Scenario Testing</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Test calendar-day streak calculations, multi-task deduplication on the same day, and broken streak resets.
        </p>

        {/* Current live values readout */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
          <div>
            <span className="text-[11px] text-slate-400 block font-semibold uppercase">Current Streak</span>
            <span className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 tabular-nums">
              {streak.currentStreak} day{streak.currentStreak === 1 ? '' : 's'}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-semibold uppercase">Longest Streak</span>
            <span className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 tabular-nums">
              {streak.longestStreak} day{streak.longestStreak === 1 ? '' : 's'}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-semibold uppercase">Active Days</span>
            <span className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 tabular-nums">
              {streak.activeDates.length}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-semibold uppercase">Last Active</span>
            <span className="text-xs font-bold font-mono text-slate-900 dark:text-slate-100 truncate block mt-1">
              {streak.lastActiveDate || 'None'}
            </span>
          </div>
        </div>

        {/* Scenario test triggers */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                const today = new Date().toISOString().split('T')[0];
                testRecordStudyActivityDate(today);
              }}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 hover:bg-amber-100 transition-colors"
            >
              + Log Activity for Today
            </button>

            <button
              type="button"
              onClick={() => {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                testRecordStudyActivityDate(yesterday.toISOString().split('T')[0]);
              }}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 transition-colors"
            >
              + Log Activity for Yesterday
            </button>

            <button
              type="button"
              onClick={() => {
                // Simulate 3 past consecutive days
                for (let i = 1; i <= 3; i++) {
                  const d = new Date();
                  d.setDate(d.getDate() - i);
                  testRecordStudyActivityDate(d.toISOString().split('T')[0]);
                }
              }}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition-colors"
            >
              + Simulate 3 Consecutive Past Days
            </button>
          </div>

          {/* Custom Date tester */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="date"
              value={customTestDate}
              onChange={e => setCustomTestDate(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            />
            <button
              type="button"
              onClick={() => {
                if (customTestDate) {
                  testRecordStudyActivityDate(customTestDate);
                  setCustomTestDate('');
                }
              }}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-white dark:bg-slate-700 hover:bg-slate-900 transition-colors"
            >
              Test Custom Date
            </button>
          </div>
        </div>
      </div>

      {/* Backup & Data Management */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1 flex items-center gap-2">
          <span>Backup & Migration</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Export your assignments, courses, and timer history to a JSON file or restore from a backup.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportData}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Backup (JSON)</span>
          </button>

          <label className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Import Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportData}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Reset & Clear Danger Zone */}
      <div className="p-6 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 shadow-xs">
        <h3 className="text-sm font-semibold text-rose-800 dark:text-rose-300 mb-1 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          <span>Storage & Reset Controls</span>
        </h3>
        <p className="text-xs text-rose-700/80 dark:text-rose-400/80 mb-4">
          Reset to realistic sample data or completely wipe all local storage data.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowResetConfirmModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-blue-500" />
            <span>Reset to Demo Courses & Tasks</span>
          </button>

          <button
            onClick={() => setShowClearConfirmModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-xs"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All Data</span>
          </button>
        </div>
      </div>

      {/* Modal: Clear Data Confirmation */}
      {showClearConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400 mb-3">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Confirm Clear Saved Data?
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              This will permanently delete all your registered courses, assignments, exams, and focus study logs from your browser's local storage. This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowClearConfirmModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  clearAllData();
                  setShowClearConfirmModal(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors"
              >
                Yes, Delete Everything
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Reset Demo Data Confirmation */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 mb-3">
              <RotateCcw className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Reset to Sample Semester Data?
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              This will replace any current entries with the default realistic sample college courses (Machine Learning, Linear Algebra, Microeconomics, Physics) and test deadlines.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowResetConfirmModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetToSampleData();
                  setShowResetConfirmModal(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
