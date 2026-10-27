import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { getTodayDateString } from '../../utils/date';
import { X } from 'lucide-react';

export const ExamModal: React.FC = () => {
  const {
    isExamModalOpen,
    editingExam,
    closeExamModal,
    addExam,
    updateExam,
    subjects,
    openSubjectModal,
  } = useApp();

  const [name, setName] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [examDate, setExamDate] = useState(`${getTodayDateString()}T09:00`);
  const [location, setLocation] = useState('');
  const [weightage, setWeightage] = useState<number | ''>(25);
  const [topicsStr, setTopicsStr] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingExam) {
      setName(editingExam.name);
      setSubjectId(editingExam.subjectId);
      // Ensure format YYYY-MM-DDTHH:mm
      let formattedDate = editingExam.examDate;
      if (formattedDate && !formattedDate.includes('T')) {
        formattedDate = `${formattedDate}T09:00`;
      }
      setExamDate(formattedDate);
      setLocation(editingExam.location || '');
      setWeightage(editingExam.weightage !== undefined ? editingExam.weightage : 25);
      setTopicsStr((editingExam.topics || []).join(', '));
      setNotes(editingExam.notes || '');
      setError('');
    } else {
      setName('');
      setSubjectId(subjects.length > 0 ? subjects[0].id : '');
      setExamDate(`${getTodayDateString()}T09:00`);
      setLocation('');
      setWeightage(25);
      setTopicsStr('');
      setNotes('');
      setError('');
    }
  }, [editingExam, isExamModalOpen, subjects]);

  if (!isExamModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Exam title is required (e.g. Midterm 1)');
      return;
    }
    if (!subjectId) {
      setError('Please choose a subject for this exam');
      return;
    }
    if (!examDate) {
      setError('Exam date is required');
      return;
    }

    const topics = topicsStr
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const parsedWeight = weightage === '' ? undefined : Number(weightage);

    if (editingExam) {
      updateExam(editingExam.id, {
        name: name.trim(),
        subjectId,
        examDate,
        location: location.trim(),
        weightage: parsedWeight,
        topics,
        notes: notes.trim(),
      });
    } else {
      addExam({
        name: name.trim(),
        subjectId,
        examDate,
        location: location.trim(),
        weightage: parsedWeight,
        topics,
        notes: notes.trim(),
      });
    }

    closeExamModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            {editingExam ? 'Edit Exam Countdown' : 'Add Upcoming Exam'}
          </h2>
          <button
            onClick={closeExamModal}
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
              Exam Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Midterm 1: Vector Spaces & Proofs"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Course / Subject *
                </label>
                {subjects.length === 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      closeExamModal();
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
                Exam Date & Time *
              </label>
              <input
                type="datetime-local"
                required
                value={examDate}
                onChange={e => setExamDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Location / Room (Optional)
              </label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Wheeler Hall 150"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Weightage (% of Grade)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={weightage}
                onChange={e => setWeightage(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                placeholder="e.g. 25"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Key Syllabus Topics (comma separated)
            </label>
            <input
              type="text"
              value={topicsStr}
              onChange={e => setTopicsStr(e.target.value)}
              placeholder="e.g. Gram-Schmidt, Eigenvalues, Spectral theorem, SVD"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Notes (Cheat sheet rules, allowed items, etc.)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. One 8.5x11 double-sided handwritten cheat sheet permitted."
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={closeExamModal}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
            >
              {editingExam ? 'Save Changes' : 'Add Exam Countdown'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
