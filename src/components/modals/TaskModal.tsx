import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Task, TaskType, Priority } from '../../types';
import { getTodayDateString } from '../../utils/date';
import { X } from 'lucide-react';

export const TaskModal: React.FC = () => {
  const {
    isTaskModalOpen,
    editingTask,
    closeTaskModal,
    addTask,
    updateTask,
    subjects,
    openSubjectModal,
  } = useApp();

  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [type, setType] = useState<TaskType>('assignment');
  const [dueDate, setDueDate] = useState(getTodayDateString());
  const [priority, setPriority] = useState<Priority>('medium');
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(2);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setSubjectId(editingTask.subjectId);
      setType(editingTask.type);
      setDueDate(editingTask.dueDate);
      setPriority(editingTask.priority);
      setEstimatedPomodoros(editingTask.estimatedPomodoros || 2);
      setNotes(editingTask.notes || '');
      setError('');
    } else {
      setTitle('');
      setSubjectId(subjects.length > 0 ? subjects[0].id : '');
      setType('assignment');
      setDueDate(getTodayDateString());
      setPriority('medium');
      setEstimatedPomodoros(2);
      setNotes('');
      setError('');
    }
  }, [editingTask, isTaskModalOpen, subjects]);

  if (!isTaskModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }
    if (!subjectId) {
      setError('Please select or create a subject');
      return;
    }
    if (!dueDate) {
      setError('Due date is required');
      return;
    }

    if (editingTask) {
      updateTask(editingTask.id, {
        title: title.trim(),
        subjectId,
        type,
        dueDate,
        priority,
        estimatedPomodoros: Math.max(1, Number(estimatedPomodoros) || 1),
        notes: notes.trim(),
      });
    } else {
      addTask({
        title: title.trim(),
        subjectId,
        type,
        dueDate,
        priority,
        completed: false,
        estimatedPomodoros: Math.max(1, Number(estimatedPomodoros) || 1),
        notes: notes.trim(),
      });
    }

    closeTaskModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            {editingTask ? 'Edit Task' : 'Add New Task'}
          </h2>
          <button
            onClick={closeTaskModal}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs rounded-lg bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Task Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Problem Set 4: Linear Transformations"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Subject *
                </label>
                {subjects.length === 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      closeTaskModal();
                      openSubjectModal();
                    }}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    + Create Subject
                  </button>
                )}
              </div>
              <select
                value={subjectId}
                onChange={e => setSubjectId(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                {subjects.length === 0 ? (
                  <option value="">No subjects available</option>
                ) : (
                  subjects.map(sub => (
                    <option key={sub.id} value={sub.id}>
                      {sub.code} - {sub.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Task Category
              </label>
              <select
                value={type}
                onChange={e => setType(e.target.value as TaskType)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="assignment">Assignment</option>
                <option value="revision">Exam Revision</option>
                <option value="reading">Required Reading</option>
                <option value="project">Project / Coding</option>
                <option value="lab">Lab Report</option>
                <option value="other">General Study</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Due Date *
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Est. Pomodoros
              </label>
              <input
                type="number"
                min="1"
                max="16"
                value={estimatedPomodoros}
                onChange={e => setEstimatedPomodoros(parseInt(e.target.value, 10) || 1)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Notes or Guidelines (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Problems 1 through 5, submit on Canvas by 11:59 PM"
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={closeTaskModal}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
            >
              {editingTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
