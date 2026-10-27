import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Subject } from '../../types';
import { PRESET_COLORS } from '../../data/sampleData';
import { SUBJECT_ICON_OPTIONS, getSubjectIconComponent } from '../../utils/subjectIcons';
import { X, Check } from 'lucide-react';

export const SubjectModal: React.FC = () => {
  const { isSubjectModalOpen, editingSubject, closeSubjectModal, addSubject, updateSubject } = useApp();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0].hex);
  const [icon, setIcon] = useState('book');
  const [instructor, setInstructor] = useState('');
  const [weeklyGoalHours, setWeeklyGoalHours] = useState(6);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingSubject) {
      setName(editingSubject.name);
      setCode(editingSubject.code || '');
      setColor(editingSubject.color);
      setIcon(editingSubject.icon || 'book');
      setInstructor(editingSubject.instructor || '');
      setWeeklyGoalHours(editingSubject.weeklyGoalHours || 6);
      setNotes(editingSubject.notes || '');
      setError('');
    } else {
      setName('');
      setCode('');
      setColor(PRESET_COLORS[0].hex);
      setIcon('book');
      setInstructor('');
      setWeeklyGoalHours(6);
      setNotes('');
      setError('');
    }
  }, [editingSubject, isSubjectModalOpen]);

  if (!isSubjectModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Subject name is required');
      return;
    }

    const trimmedCode = code.trim();

    if (editingSubject) {
      updateSubject(editingSubject.id, {
        name: trimmedName,
        code: trimmedCode || undefined,
        color,
        icon,
        instructor: instructor.trim() || undefined,
        weeklyGoalHours: Math.max(1, Number(weeklyGoalHours) || 1),
        notes: notes.trim() || undefined,
      });
    } else {
      addSubject({
        name: trimmedName,
        code: trimmedCode || undefined,
        color,
        icon,
        instructor: instructor.trim() || undefined,
        weeklyGoalHours: Math.max(1, Number(weeklyGoalHours) || 1),
        notes: notes.trim() || undefined,
      });
    }

    closeSubjectModal();
  };

  const ActiveIconComponent = getSubjectIconComponent(icon);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
              style={{ backgroundColor: color }}
            >
              <ActiveIconComponent className="w-4 h-4" />
            </div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {editingSubject ? 'Edit Subject' : 'Add New Subject'}
            </h2>
          </div>
          <button
            onClick={closeSubjectModal}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 text-xs rounded-lg bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
              {error}
            </div>
          )}

          {/* Subject Name & Optional Code */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Subject Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="e.g. Introduction to Machine Learning"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Course Code <span className="text-slate-400 font-normal lowercase">(opt)</span>
              </label>
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="e.g. CS 189"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 uppercase font-mono"
              />
            </div>
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Course Icon
            </label>
            <div className="grid grid-cols-7 gap-2">
              {SUBJECT_ICON_OPTIONS.map(opt => {
                const IconComp = opt.Icon;
                const isSelected = icon === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setIcon(opt.id)}
                    title={opt.label}
                    className={`h-9 rounded-lg flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-500/40'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <IconComp className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Subject Color Tag
            </label>
            <div className="flex flex-wrap gap-2.5">
              {PRESET_COLORS.map(c => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => setColor(c.hex)}
                  title={c.name}
                  className="w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110 relative cursor-pointer"
                  style={{ backgroundColor: c.hex }}
                >
                  {color === c.hex && (
                    <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Instructor & Weekly Goal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Instructor / Professor <span className="text-slate-400 font-normal lowercase">(opt)</span>
              </label>
              <input
                type="text"
                value={instructor}
                onChange={e => setInstructor(e.target.value)}
                placeholder="e.g. Prof. Russell"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Weekly Study Target (Hours)
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
              placeholder="e.g. Lectures MWF 10-11 AM, Office Hours Thu 2 PM"
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={closeSubjectModal}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm cursor-pointer"
            >
              {editingSubject ? 'Save Changes' : 'Add Subject'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
