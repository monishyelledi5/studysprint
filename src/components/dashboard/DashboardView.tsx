import React from 'react';
import { useApp } from '../../context/AppContext';
import { getTodayDateString, getDaysRemaining, formatDate, getPast7Days } from '../../utils/date';
import {
  CheckCircle2,
  Clock,
  CalendarClock,
  Flame,
  Plus,
  Play,
  ArrowRight,
  Sparkles,
  BookOpen,
  Trophy,
  Zap,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    settings,
    tasks,
    subjects,
    exams,
    studySessions,
    streak,
    isStreakActiveToday,
    toggleTaskCompleted,
    openTaskModal,
    setCurrentView,
    startTimerForTask,
    resetToSampleData,
    clearAllData,
  } = useApp();

  const todayStr = getTodayDateString();

  // Metrics
  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);
  const highPriorityPending = pendingTasks.filter(t => t.priority === 'high').length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  // Upcoming Exams sorted chronologically
  const sortedExams = [...exams]
    .map(e => ({ ...e, remaining: getDaysRemaining(e.examDate) }))
    .filter(e => !e.remaining.isPassed)
    .sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime());

  const nextExam = sortedExams.length > 0 ? sortedExams[0] : null;

  // Today's Plan: tasks due today or urgent upcoming tasks
  const todaysTasks = tasks.filter(t => t.dueDate === todayStr);
  const urgentUpcomingTasks = tasks.filter(t => !t.completed && t.dueDate > todayStr).slice(0, 3);
  const displayPlanTasks = todaysTasks.length > 0 ? todaysTasks : urgentUpcomingTasks;

  // Total study minutes logged this week
  const past7DaysMs = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const weeklyStudyMins = studySessions
    .filter(s => new Date(s.completedAt).getTime() >= past7DaysMs && s.type === 'study')
    .reduce((acc, curr) => acc + curr.durationMinutes, 0);
  const weeklyStudyHours = (weeklyStudyMins / 60).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Sample Data Banner */}
      {settings.isSampleDataLoaded && (
        <div className="p-3.5 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-blue-900 dark:text-blue-200">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>
              <strong>Sample Semester Loaded:</strong> Realistic sample courses, assignments, and exams are active. Everything is saved to your browser.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={clearAllData}
              className="px-2.5 py-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 rounded-md hover:bg-white dark:hover:bg-slate-800 transition-colors"
            >
              Clear Sample Data
            </button>
            <button
              onClick={resetToSampleData}
              className="px-2.5 py-1 text-blue-700 dark:text-blue-300 font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-md transition-colors"
            >
              Reset Samples
            </button>
          </div>
        </div>
      )}

      {/* Top 5 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Study Streak */}
        <div
          onClick={() => setCurrentView('analytics')}
          className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Study Streak
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center">
              <Flame className="w-4 h-4 fill-amber-500" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
              {streak.currentStreak}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              day{streak.currentStreak === 1 ? '' : 's'} (best: {streak.longestStreak}d)
            </span>
          </div>
        </div>

        {/* Pending Tasks */}
        <div
          onClick={() => setCurrentView('tasks')}
          className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Pending Tasks
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
              {pendingTasks.length}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {highPriorityPending > 0 ? `${highPriorityPending} high priority` : 'all caught up'}
            </span>
          </div>
        </div>

        {/* Completed Tasks */}
        <div
          onClick={() => setCurrentView('tasks')}
          className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Completed Tasks
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
              {completedTasks.length}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {completionRate}% completion rate
            </span>
          </div>
        </div>

        {/* Upcoming Exams */}
        <div
          onClick={() => setCurrentView('exams')}
          className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Upcoming Exams
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <CalendarClock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
              {sortedExams.length}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {nextExam ? `${nextExam.remaining.label} (${nextExam.name.slice(0, 16)}...)` : 'No exams logged'}
            </span>
          </div>
        </div>

        {/* Focus Hours Logged */}
        <div
          onClick={() => setCurrentView('analytics')}
          className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              7-Day Focus Time
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
              {weeklyStudyHours}h
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              across {studySessions.length} sessions
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Plan & Spotlight Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Plan */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  Today's Plan
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {todaysTasks.length > 0
                    ? `${todaysTasks.filter(t => !t.completed).length} items scheduled for today`
                    : 'No deadlines today. Showing urgent upcoming tasks.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openTaskModal()}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Task</span>
                </button>
              </div>
            </div>

            {displayPlanTasks.length === 0 ? (
              <div className="py-8 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  All clear!
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  You have completed everything on your schedule for today. Take a break or plan tomorrow.
                </p>
                <button
                  onClick={() => openTaskModal()}
                  className="mt-4 px-3.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Add a new task
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {displayPlanTasks.map(task => {
                  const subject = subjects.find(s => s.id === task.subjectId);
                  const isDueToday = task.dueDate === todayStr;

                  return (
                    <div
                      key={task.id}
                      className={`group p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                        task.completed
                          ? 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 opacity-60'
                          : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <button
                          onClick={() => toggleTaskCompleted(task.id)}
                          className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                            task.completed
                              ? 'bg-blue-600 border-blue-600 text-white'
                              : 'border-slate-300 dark:border-slate-600 hover:border-blue-500'
                          }`}
                          aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
                        >
                          {task.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </button>

                        <div className="min-w-0">
                          <p
                            className={`text-sm font-medium leading-snug truncate ${
                              task.completed
                                ? 'line-through text-slate-400 dark:text-slate-500'
                                : 'text-slate-900 dark:text-slate-100'
                            }`}
                          >
                            {task.title}
                          </p>

                          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {subject && (
                              <span
                                className="font-medium"
                                style={{ color: subject.color }}
                              >
                                {subject.code}
                              </span>
                            )}
                            <span aria-hidden="true">·</span>
                            <span>{task.type}</span>
                            <span aria-hidden="true">·</span>
                            <span className={isDueToday ? 'text-amber-600 dark:text-amber-400 font-medium' : ''}>
                              {isDueToday ? 'Due Today' : `Due ${formatDate(task.dueDate)}`}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="capitalize">{task.priority} priority</span>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                        {!task.completed && (
                          <button
                            onClick={() => startTimerForTask(task)}
                            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950/60 dark:hover:text-blue-300 rounded-md transition-colors"
                            title="Start study sprint for this task"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span className="hidden sm:inline">Focus</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setCurrentView('tasks')}
                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1"
              >
                <span>View all tasks</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Subjects Progress Bar Strip */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Course Progress
              </h2>
              <button
                onClick={() => setCurrentView('subjects')}
                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1"
              >
                <span>Manage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {subjects.map(sub => {
                const subTasks = tasks.filter(t => t.subjectId === sub.id);
                const subCompleted = subTasks.filter(t => t.completed).length;
                const subPercent = subTasks.length > 0 ? Math.round((subCompleted / subTasks.length) * 100) : 0;

                return (
                  <div
                    key={sub.id}
                    onClick={() => setCurrentView('subjects')}
                    className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 hover:bg-white dark:hover:bg-slate-800 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: sub.color }}
                        />
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
                          {sub.code}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 font-mono tabular-nums">
                        {subPercent}%
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mb-2.5">
                      {sub.name}
                    </p>

                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${subPercent}%`, backgroundColor: sub.color }}
                      />
                    </div>

                    <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
                      <span>{subCompleted}/{subTasks.length} tasks</span>
                      <span>Goal: {sub.weeklyGoalHours}h/wk</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Study Streak, Next Exam Countdown & Quick Focus Launcher */}
        <div className="space-y-6">
          {/* Study Streak Tracker Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center">
                  <Flame className="w-4 h-4 fill-amber-500" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Study Streak
                </span>
              </div>
              <span
                className={`text-xs font-bold font-mono px-2.5 py-0.5 rounded-full ${
                  isStreakActiveToday
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                    : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                }`}
              >
                {isStreakActiveToday ? 'Active Today' : 'Streak at Stake'}
              </span>
            </div>

            <div className="mt-2 flex items-baseline justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-slate-100">
                    {streak.currentStreak}
                  </span>
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    day{streak.currentStreak === 1 ? '' : 's'} current streak
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>
                    Longest streak: <strong className="font-mono text-slate-800 dark:text-slate-200">{streak.longestStreak} days</strong>
                  </span>
                </p>
              </div>
            </div>

            {/* Status notification */}
            <div
              className={`mt-3.5 p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                isStreakActiveToday
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-300'
                  : 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50 text-amber-800 dark:text-amber-300'
              }`}
            >
              {isStreakActiveToday ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              )}
              <div className="leading-relaxed">
                {isStreakActiveToday ? (
                  <span>
                    <strong>Streak secured today!</strong> You logged study activity for today. Keep the streak going tomorrow.
                  </span>
                ) : (
                  <span>
                    <strong>Keep your streak alive!</strong> Complete at least one task or finish a focus sprint today.
                  </span>
                )}
              </div>
            </div>

            {/* 7-Day Consistency Dot Strip */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Recent 7-Day Activity
              </span>
              <div className="grid grid-cols-7 gap-1 text-center">
                {getPast7Days().map(day => {
                  const isActive = streak.activeDates.includes(day.dateStr);
                  const isToday = day.dateStr === todayStr;
                  return (
                    <div key={day.dateStr} className="flex flex-col items-center gap-1">
                      <span className={`text-[10px] font-medium ${isToday ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-400'}`}>
                        {day.label}
                      </span>
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                          isActive
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600'
                        }`}
                        title={`${day.fullDate}: ${isActive ? 'Study completed' : 'No activity logged'}`}
                      >
                        <Flame className={`w-3.5 h-3.5 ${isActive ? 'fill-white text-white' : ''}`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Next Exam Spotlight Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Next Exam Countdown
              </span>
              {nextExam && (
                <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                  {nextExam.remaining.label}
                </span>
              )}
            </div>

            {nextExam ? (
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                  {nextExam.name}
                </h3>

                {(() => {
                  const examSub = subjects.find(s => s.id === nextExam.subjectId);
                  return (
                    <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 space-y-1">
                      {examSub && (
                        <p className="font-medium" style={{ color: examSub.color }}>
                          {examSub.code} · {examSub.name}
                        </p>
                      )}
                      <p>
                        Date: <span className="text-slate-800 dark:text-slate-200 font-medium">{formatDate(nextExam.examDate)}</span>
                      </p>
                      {nextExam.location && (
                        <p>Location: {nextExam.location}</p>
                      )}
                      {nextExam.weightage && (
                        <p>Weightage: {nextExam.weightage}% of final grade</p>
                      )}
                    </div>
                  );
                })()}

                {nextExam.topics && nextExam.topics.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Key Topics
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {nextExam.topics.join(' · ')}
                    </p>
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentView('exams')}
                    className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    All exams ({exams.length})
                  </button>
                  <button
                    onClick={() => setCurrentView('timer')}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Start Revision</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center">
                <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-60" />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  No upcoming exams registered yet.
                </p>
                <button
                  onClick={() => setCurrentView('exams')}
                  className="mt-3 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  + Add exam date
                </button>
              </div>
            )}
          </div>

          {/* Quick Focus Sprint Card */}
          <div className="p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Sprint Zone
                </span>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {settings.pomodoroStudyMins}m / {settings.pomodoroShortBreakMins}m
              </span>
            </div>

            <p className="text-sm font-semibold text-white">
              Ready for a distraction-free block?
            </p>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Knock out 25 minutes of deep focus with automated break intervals.
            </p>

            <button
              onClick={() => setCurrentView('timer')}
              className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors shadow-md shadow-blue-950/40"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Launch Focus Timer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
