import React from 'react';
import { useApp } from '../../context/AppContext';
import { Play, Pause, RotateCcw, Maximize2 } from 'lucide-react';
import { formatSecondsToTime } from '../../utils/date';

export const FloatingMiniTimer: React.FC = () => {
  const { currentView, setCurrentView, timerState, startTimer, pauseTimer, resetTimer, subjects, tasks } = useApp();

  // Only show when not already on the timer page, and timer is running or has been started
  if (currentView === 'timer') return null;

  const activeSubject = subjects.find(s => s.id === timerState.activeSubjectId);
  const activeTask = tasks.find(t => t.id === timerState.activeTaskId);
  const progressPercent = Math.min(100, Math.max(0, ((timerState.totalTime - timerState.timeLeft) / timerState.totalTime) * 100));

  const modeLabels = {
    study: 'Focus Sprint',
    shortBreak: 'Short Break',
    longBreak: 'Long Break',
  };

  const modeColors = {
    study: 'text-blue-600 dark:text-blue-400',
    shortBreak: 'text-emerald-600 dark:text-emerald-400',
    longBreak: 'text-purple-600 dark:text-purple-400',
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-3.5 flex items-center gap-4 transition-all duration-200 hover:shadow-2xl">
      <div className="flex items-center gap-3">
        {/* Circular indicator */}
        <div className="relative w-10 h-10 flex items-center justify-center">
          <svg className="w-10 h-10 transform -rotate-90">
            <circle
              cx="20"
              cy="20"
              r="17"
              stroke="currentColor"
              strokeWidth="3"
              fill="transparent"
              className="text-slate-100 dark:text-slate-800"
            />
            <circle
              cx="20"
              cy="20"
              r="17"
              stroke="currentColor"
              strokeWidth="3"
              fill="transparent"
              strokeDasharray={106.8}
              strokeDashoffset={106.8 - (106.8 * progressPercent) / 100}
              strokeLinecap="round"
              className={`transition-all duration-300 ${
                timerState.mode === 'study'
                  ? 'text-blue-600 dark:text-blue-500'
                  : 'text-emerald-500 dark:text-emerald-400'
              }`}
            />
          </svg>
          <button
            onClick={timerState.isRunning ? pauseTimer : startTimer}
            className="absolute inset-0 m-auto w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
            title={timerState.isRunning ? 'Pause' : 'Start'}
          >
            {timerState.isRunning ? (
              <Pause className="w-3.5 h-3.5" />
            ) : (
              <Play className="w-3.5 h-3.5 ml-0.5" />
            )}
          </button>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold uppercase tracking-wider ${modeColors[timerState.mode]}`}>
              {modeLabels[timerState.mode]}
            </span>
            {activeSubject && (
              <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[110px]">
                {activeSubject.code}
              </span>
            )}
          </div>
          <div className="text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
            {formatSecondsToTime(timerState.timeLeft)}
          </div>
        </div>
      </div>

      <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />

      <div className="flex items-center gap-1.5">
        <button
          onClick={resetTimer}
          className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Reset timer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={() => setCurrentView('timer')}
          className="p-1.5 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
          title="Open full timer"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
