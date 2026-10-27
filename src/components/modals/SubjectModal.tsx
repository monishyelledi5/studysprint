import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Check } from 'lucide-react';

const PRESET_COLORS = [
  { hex: '#2563EB', name: 'Royal Blue' },
  { hex: '#059669', name: 'Emerald' },
  { hex: '#D97706', name: 'Amber' },
  { hex: '#6366F1', name: 'Indigo' },
  { hex: '#E11D48', name: 'Rose' },
  { hex: '#0D9488', name: 'Teal' },
  { hex: '#7C3AED', name: 'Purple' },
  { hex: '#475569', name: 'Slate Navy' },
];

export const SubjectModal: React.FC = () => {
  const {
    isSubjectModalOpen,
    editingSubject,
    closeSubjectModal,
    addSubject,
    updateSubject,
  } = useApp();

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0].hex);
  const [instructor, setInstructor] = useState('');
  const [weeklyGoalHours, setWeeklyGoalHours] = useState(6);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingSubject) {
      setCode(editingSubject.code);
      setName(editingSubject.name);
      setColor(editingSubject.color);
      setInstructor(editingSubject.instructor || '');
      setWeeklyGoalHours(editingSubject.weeklyGoalHours || 6);
      setNotes(editingSubject.notes || '');
      setError('');
    } else {
      setCode('');
      setName('');
      setColor(PRESET_COLORS[0].hex);
      setInstructor('');
      setWeeklyGoalHours(6);
      setNotes('');
      setError('');
    }
  }, [editingSubject, isSubjectModalOpen]);

  if (!isSubjectModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('Course code is required (e.g. CS 101)');
      return;
    }
    if (!name.trim()) {
      setError('Subject name is required');
      return;
    }

    if (editingSubject) {
      updateSubject(editingSubject.id, {
        code: code.trim(),
        name: name.trim(),
        color,
        instructor: instructor.trim(),
        weeklyGoalHours: Math.max(1, Number(weeklyGoalHours) || 1),
        notes: notes.trim(),
      });
    } else {
      addSubject({
        code: code.trim(),
        name: name.trim(),
        color,
        instructor: instructor.trim(),
        weeklyGoalHours: Math.max(1, Number(weeklyGoalHours) || 1),
        notes: notes.trim(),
      });
    }

    closeSubjectModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            {editingSubject ? 'Edit Subject' : 'Add New Subject'}
          </h2>
          <button
            onClick={closeSubjectModal}
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Course Code *
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="e.g. CS 189"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 uppercase font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Subject Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Introduction to Machine Learning"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Color Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Subject Color Theme
            </label>
            <div className="flex flex-wrap gap-2.5">
              {PRESET_COLORS.map(c => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => setColor(c.hex)}
                  title={c.name}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 relative"
                  style={{ backgroundColor: c.hex }}
                >
                  {color === c.hex && (
                    <Check className="w-4 h-4 text-white stroke-[3]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Instructor / Professor (Optional)
              </label>
              <input
                type="text"
                value={instructor}
                onChange={e => setInstructor(e.target.value)}
                placeholder="e.g. Prof. Sahai"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Weekly Study Goal (Hours)
              </label>
              <input
                type="number"
                min="1"
                max="40"
                value={weeklyGoalHours}
                onChange={e => setWeeklyGoalHours(parseInt(e.target.value, 10) || 1)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Course Notes / Location / Office Hours
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Office hours on Tuesdays at 3 PM in Soda Hall"
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={closeSubjectModal}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
            >
              {editingSubject ? 'Save Changes' : 'Add Subject'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
