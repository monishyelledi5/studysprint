import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getDaysRemaining, formatDate, formatDateTime } from '../../utils/date';
import {
  CalendarClock,
  Plus,
  Pencil,
  Trash2,
  MapPin,
  Percent,
  Play,
  CalendarCheck,
} from 'lucide-react';

export const ExamsView: React.FC = () => {
  const {
    exams,
    subjects,
    openExamModal,
    deleteExam,
    setCurrentView,
    setTimerSubject,
  } = useApp();

  const [filterSubjectId, setFilterSubjectId] = useState<string>('all');

  // Process exams with remaining days and sort chronologically
  const enrichedExams = exams
    .map(exam => {
      const remaining = getDaysRemaining(exam.examDate);
      const subject = subjects.find(s => s.id === exam.subjectId);
      return {
        ...exam,
        remaining,
        subject,
      };
    })
    .filter(exam => filterSubjectId === 'all' || exam.subjectId === filterSubjectId)
    .sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime());

  const upcomingExams = enrichedExams.filter(e => !e.remaining.isPassed);
  const pastExams = enrichedExams.filter(e => e.remaining.isPassed);

  const startRevisionForExam = (subjectId: string) => {
    setTimerSubject(subjectId);
    setCurrentView('timer');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Exam Countdowns ({upcomingExams.length} upcoming)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Countdown to midterms, finals, and quizzes sorted chronologically.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {subjects.length > 0 && (
            <select
              value={filterSubjectId}
              onChange={e => setFilterSubjectId(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Subjects</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>
                  {s.code ? `${s.code} - ${s.name}` : s.name}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={() => openExamModal()}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Exam</span>
          </button>
        </div>
      </div>

      {upcomingExams.length === 0 && pastExams.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
          <CalendarClock className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            No exams scheduled
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Stay ahead by scheduling upcoming midterms, finals, or presentations with real-time day countdowns.
          </p>
          <button
            onClick={() => openExamModal()}
            className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule First Exam</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Upcoming Exams Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {upcomingExams.map(exam => {
              const { remaining, subject } = exam;

              return (
                <div
                  key={exam.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs p-5 sm:p-6 flex flex-col justify-between transition-all hover:border-slate-300 dark:hover:border-slate-700"
                >
                  <div>
                    {/* Header: Subject & Countdown Badge */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        {subject && (
                          <span
                            className="text-xs font-bold font-mono px-2 py-0.5 rounded-md"
                            style={{
                              backgroundColor: `${subject.color}15`,
                              color: subject.color,
                            }}
                          >
                            {subject.code}
                          </span>
                        )}
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {subject?.name}
                        </span>
                      </div>

                      {/* Countdown badge */}
                      <span
                        className={`text-xs font-bold font-mono px-2.5 py-1 rounded-full tabular-nums ${
                          remaining.isToday
                            ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                            : remaining.isTomorrow
                            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                            : remaining.days <= 5
                            ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {remaining.label}
                      </span>
                    </div>

                    {/* Exam Name */}
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                      {exam.name}
                    </h3>

                    {/* Date and Location */}
                    <div className="mt-2.5 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {formatDateTime(exam.examDate)}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        {exam.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>{exam.location}</span>
                          </div>
                        )}

                        {exam.weightage !== undefined && (
                          <div className="flex items-center gap-1">
                            <Percent className="w-3.5 h-3.5 text-slate-400" />
                            <span>{exam.weightage}% weightage</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Syllabus Topics */}
                    {exam.topics && exam.topics.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                          Coverage / Topics
                        </span>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {exam.topics.join(' · ')}
                        </p>
                      </div>
                    )}

                    {exam.notes && (
                      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 italic">
                        Note: {exam.notes}
                      </p>
                    )}
                  </div>

                  {/* Card Footer Actions */}
                  <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => startRevisionForExam(exam.subjectId)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded-lg transition-colors"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Start Revision</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openExamModal(exam)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Edit exam"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Remove exam "${exam.name}"?`)) {
                            deleteExam(exam.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Delete exam"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Past Exams Section if any */}
          {pastExams.length > 0 && (
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-emerald-500" />
                <span>Completed / Past Exams ({pastExams.length})</span>
              </h3>
              <div className="space-y-2 opacity-70">
                {pastExams.map(exam => (
                  <div
                    key={exam.id}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {exam.name}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="text-slate-500">{formatDate(exam.examDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Exam completed</span>
                      <button
                        onClick={() => deleteExam(exam.id)}
                        className="p-1 text-slate-400 hover:text-rose-500"
                        title="Remove past exam"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
