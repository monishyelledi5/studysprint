import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Task, Priority, TaskType } from '../../types';
import { formatDate, getTodayDateString } from '../../utils/date';
import {
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Play,
  Pencil,
  Trash2,
  Check,
} from 'lucide-react';

export const TasksView: React.FC = () => {
  const {
    tasks,
    subjects,
    toggleTaskCompleted,
    deleteTask,
    openTaskModal,
    startTimerForTask,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'title'>('dueDate');

  const todayStr = getTodayDateString();

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Tab filter
      if (activeTab === 'pending' && task.completed) return false;
      if (activeTab === 'completed' && !task.completed) return false;

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesNotes = (task.notes || '').toLowerCase().includes(query);
        const sub = subjects.find(s => s.id === task.subjectId);
        const matchesSub = sub ? `${sub.code} ${sub.name}`.toLowerCase().includes(query) : false;
        if (!matchesTitle && !matchesNotes && !matchesSub) return false;
      }

      // Subject filter
      if (selectedSubjectId !== 'all' && task.subjectId !== selectedSubjectId) {
        return false;
      }

      // Priority filter
      if (selectedPriority !== 'all' && task.priority !== selectedPriority) {
        return false;
      }

      // Type filter
      if (selectedType !== 'all' && task.type !== selectedType) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'dueDate') {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (sortBy === 'priority') {
        const priorityScore: Record<Priority, number> = { high: 3, medium: 2, low: 1 };
        return priorityScore[b.priority] - priorityScore[a.priority];
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [tasks, activeTab, searchQuery, selectedSubjectId, selectedPriority, selectedType, sortBy, subjects]);

  const pendingCount = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;

  const priorityColors: Record<Priority, string> = {
    high: 'text-rose-600 dark:text-rose-400 font-medium',
    medium: 'text-amber-600 dark:text-amber-400 font-medium',
    low: 'text-slate-500 dark:text-slate-400',
  };

  const typeLabels: Record<TaskType, string> = {
    assignment: 'Assignment',
    revision: 'Revision',
    reading: 'Reading',
    project: 'Project',
    lab: 'Lab Report',
    other: 'Other Study',
  };

  return (
    <div className="space-y-6">
      {/* Top Bar Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Segmented Tab: Pending vs Completed */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/70 dark:bg-slate-800 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'pending'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Pending Tasks ({pendingCount})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'completed'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        {/* Primary CTA */}
        <button
          onClick={() => openTaskModal()}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Study Task</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search */}
          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tasks, notes, or course codes..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Subject Select */}
            <select
              value={selectedSubjectId}
              onChange={e => setSelectedSubjectId(e.target.value)}
              className="px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Subjects</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>
                  {s.code}
                </option>
              ))}
            </select>

            {/* Priority Select */}
            <select
              value={selectedPriority}
              onChange={e => setSelectedPriority(e.target.value)}
              className="px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>

            {/* Type Select */}
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="assignment">Assignment</option>
              <option value="revision">Revision</option>
              <option value="reading">Reading</option>
              <option value="project">Project</option>
              <option value="lab">Lab Report</option>
            </select>

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as 'dueDate' | 'priority' | 'title')}
              className="px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="dueDate">Sort by Due Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
          <Clock className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            {activeTab === 'pending' ? 'No pending tasks found' : 'No completed tasks yet'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {activeTab === 'pending'
              ? searchQuery || selectedSubjectId !== 'all'
                ? 'Try adjusting your filters or search terms.'
                : 'All caught up! Plan your next assignment or take a well-deserved break.'
              : 'Tasks you finish will appear here so you can track your study momentum.'}
          </p>
          {activeTab === 'pending' && (
            <button
              onClick={() => openTaskModal()}
              className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Task</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map(task => {
            const subject = subjects.find(s => s.id === task.subjectId);
            const isDueToday = task.dueDate === todayStr;
            const isOverdue = !task.completed && task.dueDate < todayStr;

            return (
              <div
                key={task.id}
                className={`group p-4 rounded-xl border bg-white dark:bg-slate-900 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  task.completed
                    ? 'border-slate-200 dark:border-slate-800 opacity-65'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs'
                }`}
              >
                {/* Left: Checkbox + Info */}
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <button
                    onClick={() => toggleTaskCompleted(task.id)}
                    className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                      task.completed
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-slate-300 dark:border-slate-600 hover:border-blue-500'
                    }`}
                    aria-label={`Mark task ${task.completed ? 'incomplete' : 'complete'}`}
                  >
                    {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-sm font-semibold leading-snug ${
                          task.completed
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>

                    {/* Metadata line */}
                    <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                      {subject && (
                        <span className="font-semibold" style={{ color: subject.color }}>
                          {subject.code || subject.name}
                        </span>
                      )}
                      <span aria-hidden="true">·</span>
                      <span>{typeLabels[task.type] || task.type}</span>
                      <span aria-hidden="true">·</span>
                      <span
                        className={
                          isOverdue
                            ? 'text-rose-600 dark:text-rose-400 font-semibold'
                            : isDueToday
                            ? 'text-amber-600 dark:text-amber-400 font-semibold'
                            : ''
                        }
                      >
                        {isOverdue
                          ? `Overdue (${formatDate(task.dueDate)})`
                          : isDueToday
                          ? 'Due Today'
                          : `Due ${formatDate(task.dueDate)}`}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className={priorityColors[task.priority]}>
                        {task.priority.toUpperCase()}
                      </span>
                      {task.estimatedPomodoros && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{task.estimatedPomodoros} Pomodoro{task.estimatedPomodoros > 1 ? 's' : ''}</span>
                        </>
                      )}
                    </div>

                    {task.notes && (
                      <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                        {task.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                  {!task.completed && (
                    <button
                      onClick={() => startTimerForTask(task)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded-lg transition-colors"
                      title="Launch timer for this task"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Sprint</span>
                    </button>
                  )}

                  <button
                    onClick={() => openTaskModal(task)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Edit task"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Delete task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
