import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatDate, getDaysRemaining, getGreeting } from '../../utils/date';
import { getSubjectIconComponent } from '../../utils/subjectIcons';
import {
  Flame,
  CheckCircle2,
  Clock,
  CalendarClock,
  Plus,
  Play,
  ArrowRight,
  BookOpen,
  Zap,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    tasks,
    subjects,
    exams,
    studySessions,
    streak,
    isStreakActiveToday,
    settings,
    openTaskModal,
    openSubjectModal,
    openExamModal,
    toggleTaskCompleted,
    setCurrentView,
    startTimerForTask,
  } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];

  // Past 7 calendar days array
  const getPast7Days = () => {
    const days: { dateStr: string; label: string; fullDate: string }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const str = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'narrow' });
      const full = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      days.push({ dateStr: str, label: dayName, fullDate: full });
    }
    return days;
  };

  // Task metrics
  const completedTasks = tasks.filter(t => t.completed);
  const pendingTasks = tasks.filter(t => !t.completed);
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

  const studentFirstName = settings.name.trim().split(' ')[0] || 'Student';

  return (
    <div className="space-y-6">
      {/* Welcome & Today Overview Header */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Student Command Center
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {getGreeting()}, {studentFirstName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
            {pendingTasks.length === 0
              ? 'You have zero pending tasks. Add a course or schedule an assignment below.'
              : `You have ${pendingTasks.length} pending task${pendingTasks.length === 1 ? '' : 's'}${
                  highPriorityPending > 0 ? ` (${highPriorityPending} high priority)` : ''
                }.`}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => openTaskModal()}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
          <button
            onClick={() => setCurrentView('timer')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Focus Timer</span>
          </button>
        </div>
      </div>

      {/* Top 5 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Study Streak */}
        <div
          onClick={() => setCurrentView('analytics')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
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
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
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
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
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
              {completionRate}% rate
            </span>
          </div>
        </div>

        {/* Upcoming Exams */}
        <div
          onClick={() => setCurrentView('exams')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
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
              {nextExam ? `${nextExam.remaining.label}` : 'None logged'}
            </span>
          </div>
        </div>

        {/* Focus Hours Logged */}
        <div
          onClick={() => setCurrentView('analytics')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
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
              across {studySessions.length} session{studySessions.length === 1 ? '' : 's'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Plan & Spotlight Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Plan & Course Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Plan Section */}
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
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Task</span>
                </button>
              </div>
            </div>

            {displayPlanTasks.length === 0 ? (
              <div className="py-10 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-4">
                <CheckCircle2 className="w-10 h-10 text-slate-400 dark:text-slate-500 mx-auto mb-2 opacity-60" />
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  No tasks scheduled for today
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  Add an assignment, reading task, or revision goal to build your study schedule.
                </p>
                <button
                  onClick={() => openTaskModal()}
                  className="mt-3.5 px-3.5 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded-lg transition-colors cursor-pointer"
                >
                  + Add your first task
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {displayPlanTasks.map(task => {
                  const subject = subjects.find(s => s.id === task.subjectId);
                  const isDueToday = task.dueDate === todayStr;
                  const SubjectIcon = getSubjectIconComponent(subject?.icon);

                  return (
                    <div
                      key={task.id}
                      className={`group p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                        task.completed
                          ? 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <button
                          onClick={() => toggleTaskCompleted(task.id)}
                          className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
                            task.completed
                              ? 'bg-blue-600 border-blue-600 text-white'
                              : 'border-slate-300 dark:border-slate-600 hover:border-blue-500 bg-white dark:bg-slate-700'
                          }`}
                          aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
                        >
                          {task.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </button>
                        <div className="min-w-0">
                          <p
                            className={`text-sm font-semibold leading-snug truncate ${
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
                                className="font-semibold flex items-center gap-1"
                                style={{ color: subject.color }}
                              >
                                <SubjectIcon className="w-3 h-3" />
                                {subject.code || subject.name}
                              </span>
                            )}
                            <span aria-hidden="true">·</span>
                            <span>{task.type}</span>
                            <span aria-hidden="true">·</span>
                            <span className={isDueToday ? 'text-amber-600 dark:text-amber-400 font-semibold' : ''}>
                              {isDueToday ? 'Due Today' : `Due ${formatDate(task.dueDate)}`}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="capitalize">{task.priority} priority</span>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 shrink-0 opacity-90 group-hover:opacity-100 transition-opacity">
                        {!task.completed && (
                          <button
                            onClick={() => startTimerForTask(task)}
                            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/60 dark:hover:text-blue-300 rounded-md transition-colors cursor-pointer"
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
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 cursor-pointer"
              >
                <span>View all tasks</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Course Progress Section */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Course Progress
              </h2>
              <button
                onClick={() => setCurrentView('subjects')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <span>Manage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {subjects.length === 0 ? (
              <div className="py-8 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-4">
                <BookOpen className="w-9 h-9 text-slate-400 dark:text-slate-500 mx-auto mb-2 opacity-60" />
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  No courses added yet
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  Add your enrolled subjects to set study goals and monitor progress.
                </p>
                <button
                  onClick={() => openSubjectModal()}
                  className="mt-3.5 px-3.5 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded-lg transition-colors cursor-pointer"
                >
                  + Add your first subject
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {subjects.map(sub => {
                  const subTasks = tasks.filter(t => t.subjectId === sub.id);
                  const subCompleted = subTasks.filter(t => t.completed).length;
                  const subPercent = subTasks.length > 0 ? Math.round((subCompleted / subTasks.length) * 100) : 0;
                  const SubIcon = getSubjectIconComponent(sub.icon);

                  return (
                    <div
                      key={sub.id}
                      onClick={() => setCurrentView('subjects')}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-750 cursor-pointer transition-colors shadow-xs"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-6 h-6 rounded-md flex items-center justify-center text-white shrink-0 text-xs"
                            style={{ backgroundColor: sub.color }}
                          >
                            <SubIcon className="w-3.5 h-3.5" />
                          </span>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
                            {sub.code || sub.name.slice(0, 10)}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200 font-mono tabular-nums">
                          {subPercent}%
                        </span>
                      </div>

                      <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate mb-2.5">
                        {sub.name}
                      </p>

                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${subPercent}%`, backgroundColor: sub.color }}
                        />
                      </div>

                      <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between font-medium">
                        <span>{subCompleted}/{subTasks.length} tasks completed</span>
                        <span>Goal: {sub.weeklyGoalHours}h/wk</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Study Streak Spotlight & Next Exam */}
        <div className="space-y-6">
          {/* Study Streak Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Daily Study Momentum
              </span>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  isStreakActiveToday
                    ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                    : 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300'
                }`}
              >
                {isStreakActiveToday ? 'Active Today' : 'Pending Today'}
              </span>
            </div>

            {/* Big Streak Numbers */}
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform ${
                  isStreakActiveToday
                    ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-500/25 scale-105'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                }`}
              >
                <Flame className={`w-8 h-8 ${isStreakActiveToday ? 'fill-white' : ''}`} />
              </div>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                    {streak.currentStreak}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Day{streak.currentStreak === 1 ? '' : 's'} In a Row
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Longest record: <strong className="text-slate-700 dark:text-slate-300 font-mono">{streak.longestStreak} days</strong>
                </p>
              </div>
            </div>

            {/* Status notification */}
            <div
              className={`mt-4 p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                isStreakActiveToday
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-200'
                  : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-200'
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
                    <strong>Streak secured today!</strong> You logged study activity for today. Keep the momentum going tomorrow.
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
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
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
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                  {nextExam.name}
                </h3>
                {(() => {
                  const examSub = subjects.find(s => s.id === nextExam.subjectId);
                  return (
                    <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 space-y-1">
                      {examSub && (
                        <p className="font-semibold" style={{ color: examSub.color }}>
                          {examSub.code ? `${examSub.code} · ` : ''}{examSub.name}
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
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    All exams ({exams.length})
                  </button>
                  <button
                    onClick={() => setCurrentView('timer')}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Start Revision</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center">
                <CalendarClock className="w-8 h-8 text-slate-400 dark:text-slate-500 mx-auto mb-2 opacity-60" />
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  No upcoming exams registered
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Set target exam dates to get live countdown timers.
                </p>
                <button
                  onClick={() => openExamModal()}
                  className="mt-3 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add exam date</span>
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
              <span className="text-xs font-mono text-slate-400 font-semibold">
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
              className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors shadow-md shadow-blue-950/40 cursor-pointer"
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
