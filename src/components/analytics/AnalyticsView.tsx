import React from 'react';
import { useApp } from '../../context/AppContext';
import { getPast7Days } from '../../utils/date';
import {
  BarChart3,
  Flame,
  CheckCircle2,
  Clock,
  BookOpen,
  Calendar,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { studySessions, tasks, subjects, streak } = useApp();

  const past7Days = getPast7Days();

  // Aggregate study minutes per day for the last 7 days
  const dailyData = past7Days.map(day => {
    const mins = studySessions
      .filter(s => s.completedAt.startsWith(day.dateStr) && s.type === 'study')
      .reduce((acc, curr) => acc + curr.durationMinutes, 0);

    const completedTasksCount = tasks.filter(
      t => t.completed && t.completedAt && t.completedAt.startsWith(day.dateStr)
    ).length;

    return {
      ...day,
      minutes: mins,
      hours: (mins / 60).toFixed(1),
      completedTasks: completedTasksCount,
    };
  });

  const maxMins = Math.max(60, ...dailyData.map(d => d.minutes));

  // Overall Statistics
  const totalStudyMinutes = studySessions
    .filter(s => s.type === 'study')
    .reduce((acc, curr) => acc + curr.durationMinutes, 0);
  const totalHours = (totalStudyMinutes / 60).toFixed(1);

  const completedTasksCount = tasks.filter(t => t.completed).length;
  const pendingTasksCount = tasks.filter(t => !t.completed).length;
  const totalTasks = tasks.length;
  const overallTaskCompletion = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;

  // Consistency: how many of the last 7 days had study activity
  const activeDaysCount = dailyData.filter(d => d.minutes > 0).length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          Study Progress & Weekly Consistency
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Review your 7-day study consistency, task throughput, and course progress bars.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Focus Time</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
              {totalHours}h
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              ({totalStudyMinutes} mins)
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Study Streak</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
              {streak.currentStreak}d
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              best: {streak.longestStreak}d · {activeDaysCount}/7 days
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Tasks Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
              {completedTasksCount}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              of {totalTasks} ({overallTaskCompletion}%)
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Courses</span>
            <BookOpen className="w-4 h-4 text-purple-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
              {subjects.length}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {pendingTasksCount} pending items
            </span>
          </div>
        </div>
      </div>

      {/* 7-Day Consistency Visual Bar Chart */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              7-Day Study Sprint Activity
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Minutes of logged focus sessions per day
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
            <Calendar className="w-3.5 h-3.5" />
            <span>Past 7 days</span>
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="h-56 flex items-end justify-between gap-2 sm:gap-6 pt-6 pb-2 px-2 border-b border-slate-100 dark:border-slate-800">
          {dailyData.map((day, idx) => {
            const heightPercent = Math.min(100, Math.max(8, (day.minutes / maxMins) * 100));
            const isToday = idx === dailyData.length - 1;

            return (
              <div key={day.dateStr} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                {/* Tooltip on hover */}
                <span className="text-[11px] font-mono font-bold text-slate-600 dark:text-slate-300 opacity-80 group-hover:opacity-100 tabular-nums">
                  {day.minutes > 0 ? `${day.minutes}m` : '-'}
                </span>

                {/* Bar */}
                <div className="w-full max-w-[48px] bg-slate-100 dark:bg-slate-800 rounded-t-xl h-full flex items-end overflow-hidden">
                  <div
                    className={`w-full rounded-t-xl transition-all duration-500 ${
                      isToday
                        ? 'bg-blue-600 dark:bg-blue-500 group-hover:bg-blue-700'
                        : day.minutes > 0
                        ? 'bg-blue-500/80 dark:bg-blue-600/80 group-hover:bg-blue-600'
                        : 'bg-transparent'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>

                {/* Day label */}
                <div className="text-center">
                  <span className={`block text-xs font-semibold ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}`}>
                    {day.label}
                  </span>
                  <span className="block text-[10px] text-slate-400 dark:text-slate-500">
                    {day.fullDate.split(' ')[1]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Weekly target: 25+ hours</span>
          <span>Consistent daily study improves exam retention by 60%</span>
        </div>
      </div>

      {/* Subject Breakdown & Progress Bars */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">
          Course Progress Breakdown
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Task completion ratios and logged study time by course
        </p>

        {subjects.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">
            No subjects added yet.
          </p>
        ) : (
          <div className="space-y-5">
            {subjects.map(subject => {
              const subTasks = tasks.filter(t => t.subjectId === subject.id);
              const subCompleted = subTasks.filter(t => t.completed).length;
              const subPercent = subTasks.length > 0 ? Math.round((subCompleted / subTasks.length) * 100) : 0;

              const subMinutes = studySessions
                .filter(s => s.subjectId === subject.id && s.type === 'study')
                .reduce((acc, curr) => acc + curr.durationMinutes, 0);
              const subHours = (subMinutes / 60).toFixed(1);

              return (
                <div key={subject.id} className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: subject.color }}
                      />
                      <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">
                        {subject.code}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                        {subject.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 font-mono tabular-nums text-slate-600 dark:text-slate-400">
                      <span>{subHours}h logged</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        {subCompleted}/{subTasks.length} ({subPercent}%)
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${subPercent}%`, backgroundColor: subject.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
