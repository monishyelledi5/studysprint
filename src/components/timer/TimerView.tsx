import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatSecondsToTime } from '../../utils/date';
import { TimerMode } from '../../types';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Volume2,
  VolumeX,
  Flame,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';

export const TimerView: React.FC = () => {
  const {
    timerState,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    setTimerMode,
    setTimerSubject,
    setTimerTask,
    skipTimer,
    subjects,
    tasks,
    settings,
    updateSettings,
    studySessions,
  } = useApp();

  const activeSubject = subjects.find(s => s.id === timerState.activeSubjectId);
  const activeTask = tasks.find(t => t.id === timerState.activeTaskId);
  const pendingTasks = tasks.filter(t => !t.completed);

  // Calculate circular progress
  const progressPercent = Math.min(
    100,
    Math.max(0, ((timerState.totalTime - timerState.timeLeft) / timerState.totalTime) * 100)
  );

  const radius = 130;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * progressPercent) / 100;

  // Today study sessions count
  const todayStr = new Date().toISOString().split('T')[0];
  const todaysSessions = studySessions.filter(
    s => s.completedAt.startsWith(todayStr) && s.type === 'study'
  );
  const todaysMinutes = todaysSessions.reduce((acc, curr) => acc + curr.durationMinutes, 0);

  const modeThemes: Record<TimerMode, { label: string; strokeColor: string; bgBadge: string; textBadge: string }> = {
    study: {
      label: 'Focus Sprint',
      strokeColor: '#2563EB',
      bgBadge: 'bg-blue-50 dark:bg-blue-950/60',
      textBadge: 'text-blue-700 dark:text-blue-300',
    },
    shortBreak: {
      label: 'Short Break',
      strokeColor: '#059669',
      bgBadge: 'bg-emerald-50 dark:bg-emerald-950/60',
      textBadge: 'text-emerald-700 dark:text-emerald-300',
    },
    longBreak: {
      label: 'Long Rest Break',
      strokeColor: '#7C3AED',
      bgBadge: 'bg-purple-50 dark:bg-purple-950/60',
      textBadge: 'text-purple-700 dark:text-purple-300',
    },
  };

  const currentTheme = modeThemes[timerState.mode];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Mode Selector Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex p-1 rounded-2xl bg-slate-200/80 dark:bg-slate-800 shadow-inner">
          <button
            onClick={() => setTimerMode('study')}
            className={`px-5 py-2 text-xs font-bold rounded-xl transition-all ${
              timerState.mode === 'study'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Study ({settings.pomodoroStudyMins}m)
          </button>
          <button
            onClick={() => setTimerMode('shortBreak')}
            className={`px-5 py-2 text-xs font-bold rounded-xl transition-all ${
              timerState.mode === 'shortBreak'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Short Break ({settings.pomodoroShortBreakMins}m)
          </button>
          <button
            onClick={() => setTimerMode('longBreak')}
            className={`px-5 py-2 text-xs font-bold rounded-xl transition-all ${
              timerState.mode === 'longBreak'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Long Break ({settings.pomodoroLongBreakMins}m)
          </button>
        </div>
      </div>

      {/* Main Focus Dial Card */}
      <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center flex flex-col items-center relative overflow-hidden">
        {/* Sound toggle button */}
        <div className="absolute top-6 right-6">
          <button
            onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={settings.soundEnabled ? 'Mute chime sounds' : 'Enable chime sounds'}
          >
            {settings.soundEnabled ? (
              <Volume2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mode Label */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: currentTheme.strokeColor }}
          />
          <span>{currentTheme.label}</span>
        </div>

        {/* Circular SVG Timer */}
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center my-2">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background ring */}
            <circle
              cx="50%"
              cy="50%"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="text-slate-100 dark:text-slate-800/80"
            />
            {/* Progress ring */}
            <circle
              cx="50%"
              cy="50%"
              r={radius}
              stroke={currentTheme.strokeColor}
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500 ease-linear"
            />
          </svg>

          {/* Time text centered inside circle */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-5xl sm:text-6xl font-extrabold font-mono tabular-nums tracking-tight text-slate-900 dark:text-slate-100">
              {formatSecondsToTime(timerState.timeLeft)}
            </span>
            <span className="text-xs font-semibold text-slate-400 mt-2">
              {timerState.isRunning ? 'Keep going · Focus mode' : 'Paused / Ready'}
            </span>
          </div>
        </div>

        {/* Primary Controls */}
        <div className="mt-8 flex items-center gap-4">
          <button
            onClick={resetTimer}
            className="p-3 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Reset timer"
            aria-label="Reset timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {timerState.isRunning ? (
            <button
              onClick={pauseTimer}
              className="flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm transition-transform active:scale-95 shadow-md shadow-amber-500/20"
            >
              <Pause className="w-5 h-5 fill-current" />
              <span>Pause Sprint</span>
            </button>
          ) : (
            <button
              onClick={timerState.timeLeft < timerState.totalTime ? resumeTimer : startTimer}
              className="flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-transform active:scale-95 shadow-md shadow-blue-600/25"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>{timerState.timeLeft < timerState.totalTime ? 'Resume Sprint' : 'Start Focus Sprint'}</span>
            </button>
          )}

          <button
            onClick={skipTimer}
            className="p-3 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Skip to next phase"
            aria-label="Skip to next phase"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Association Tagger: Subject & Task */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 w-full max-w-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Link to Course
              </label>
              <select
                value={timerState.activeSubjectId || ''}
                onChange={e => setTimerSubject(e.target.value || null)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="">No course selected</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.code} - {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Link to Task
              </label>
              <select
                value={timerState.activeTaskId || ''}
                onChange={e => setTimerTask(e.target.value || null)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="">No task selected</option>
                {pendingTasks.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {activeTask && (
            <p className="mt-2.5 text-xs text-blue-600 dark:text-blue-400 font-medium">
              Target: {activeTask.title}
            </p>
          )}
        </div>
      </div>

      {/* Focus Stats Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
              {timerState.completedCycles}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Sprints completed today
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
              {todaysMinutes} mins
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Total focus time today
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100 truncate">
              {activeSubject ? activeSubject.code : 'Open Sprint'}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Active course focus
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
