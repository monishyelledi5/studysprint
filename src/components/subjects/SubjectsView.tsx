import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Subject } from '../../types';
import { formatDate } from '../../utils/date';
import {
  Plus,
  Pencil,
  Trash2,
  BookOpen,
  CheckCircle2,
  Clock,
  Calendar,
  ChevronRight,
  User,
  Target,
} from 'lucide-react';

export const SubjectsView: React.FC = () => {
  const {
    subjects,
    tasks,
    exams,
    studySessions,
    openSubjectModal,
    deleteSubject,
    openTaskModal,
    toggleTaskCompleted,
  } = useApp();

  const [expandedSubjectId, setExpandedSubjectId] = useState<string | null>(
    subjects.length > 0 ? subjects[0].id : null
  );

  const past7DaysMs = Date.now() - 7 * 24 * 60 * 60 * 1000;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Enrolled Subjects & Goals ({subjects.length})
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure weekly target hours, color tags, and monitor task completion for each course.
          </p>
        </div>

        <button
          onClick={() => openSubjectModal()}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Subject</span>
        </button>
      </div>

      {subjects.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            No subjects added yet
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Add your semester courses (e.g., Computer Science, Biology, Calculus) to track tasks, exams, and weekly study targets.
          </p>
          <button
            onClick={() => openSubjectModal()}
            className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Subject</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {subjects.map(subject => {
            const subTasks = tasks.filter(t => t.subjectId === subject.id);
            const subCompletedTasks = subTasks.filter(t => t.completed);
            const subPendingTasks = subTasks.filter(t => !t.completed);
            const subExams = exams.filter(e => e.subjectId === subject.id);

            const percent = subTasks.length > 0
              ? Math.round((subCompletedTasks.length / subTasks.length) * 100)
              : 0;

            // Study hours logged for this subject in the last 7 days
            const subMinsLastWeek = studySessions
              .filter(s => s.subjectId === subject.id && new Date(s.completedAt).getTime() >= past7DaysMs && s.type === 'study')
              .reduce((acc, curr) => acc + curr.durationMinutes, 0);
            const subHoursLastWeek = (subMinsLastWeek / 60).toFixed(1);

            const isExpanded = expandedSubjectId === subject.id;

            return (
              <div
                key={subject.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden transition-all"
              >
                {/* Subject Card Header */}
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Course Code & Title */}
                    <div className="flex items-start gap-3.5">
                      <div
                        className="w-4 h-12 rounded-md shrink-0 mt-0.5"
                        style={{ backgroundColor: subject.color }}
                      />
                      <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span
                            className="text-xs font-bold font-mono px-2 py-0.5 rounded-md"
                            style={{
                              backgroundColor: `${subject.color}15`,
                              color: subject.color,
                            }}
                          >
                            {subject.code}
                          </span>
                          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                            {subject.name}
                          </h3>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                          {subject.instructor && (
                            <>
                              <span className="flex items-center gap-1">
                                <User className="w-3.5 h-3.5" />
                                <span>{subject.instructor}</span>
                              </span>
                              <span aria-hidden="true">·</span>
                            </>
                          )}
                          <span className="flex items-center gap-1">
                            <Target className="w-3.5 h-3.5" />
                            <span>Goal: {subject.weeklyGoalHours} hrs/week</span>
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>Logged: {subHoursLastWeek}h this week</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats & Action Buttons */}
                    <div className="flex items-center gap-4 shrink-0">
                      {/* Mini completion stat */}
                      <div className="text-right hidden sm:block">
                        <div className="text-sm font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
                          {percent}%
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {subCompletedTasks.length}/{subTasks.length} tasks done
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openTaskModal({ subjectId: subject.id } as any)}
                          className="px-2.5 py-1.5 text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded-lg transition-colors flex items-center gap-1"
                          title="Add task for this subject"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Add Task</span>
                        </button>

                        <button
                          onClick={() => openSubjectModal(subject)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Edit subject settings"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Delete subject "${subject.code} - ${subject.name}"? This will also remove associated tasks.`)) {
                              deleteSubject(subject.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Delete subject"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setExpandedSubjectId(isExpanded ? null : subject.id)}
                          className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          aria-label={isExpanded ? 'Collapse subject' : 'Expand subject'}
                        >
                          <ChevronRight
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isExpanded ? 'rotate-90' : ''
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent}%`, backgroundColor: subject.color }}
                      />
                    </div>
                  </div>

                  {subject.notes && (
                    <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 italic">
                      {subject.notes}
                    </p>
                  )}
                </div>

                {/* Expanded Section: Tasks & Exams */}
                {isExpanded && (
                  <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 p-5 sm:p-6 space-y-5">
                    {/* Subject Tasks */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                          Tasks ({subTasks.length})
                        </span>
                        <span className="text-xs text-slate-400">
                          {subPendingTasks.length} pending · {subCompletedTasks.length} done
                        </span>
                      </div>

                      {subTasks.length === 0 ? (
                        <p className="text-xs text-slate-400 py-3 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                          No tasks recorded for this subject yet.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {subTasks.map(task => (
                            <div
                              key={task.id}
                              className={`p-3 rounded-lg border bg-white dark:bg-slate-800 flex items-center justify-between gap-3 text-xs ${
                                task.completed
                                  ? 'border-slate-200 dark:border-slate-800/80 opacity-60'
                                  : 'border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <button
                                  onClick={() => toggleTaskCompleted(task.id)}
                                  className={`w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 ${
                                    task.completed
                                      ? 'bg-blue-600 border-blue-600 text-white'
                                      : 'border-slate-300 dark:border-slate-600 hover:border-blue-500'
                                  }`}
                                >
                                  {task.completed && <CheckCircle2 className="w-3 h-3" />}
                                </button>
                                <span
                                  className={`truncate font-medium ${
                                    task.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'
                                  }`}
                                >
                                  {task.title}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 text-slate-500 shrink-0">
                                <span>Due {formatDate(task.dueDate)}</span>
                                <span aria-hidden="true">·</span>
                                <span className="capitalize">{task.priority}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Subject Exams */}
                    {subExams.length > 0 && (
                      <div>
                        <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                          Scheduled Exams ({subExams.length})
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {subExams.map(exam => (
                            <div
                              key={exam.id}
                              className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                            >
                              <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                                <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                <span className="truncate">{exam.name}</span>
                              </div>
                              <div className="mt-1 text-slate-500 dark:text-slate-400">
                                {formatDate(exam.examDate)}
                                {exam.location && ` · ${exam.location}`}
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
          })}
        </div>
      )}
    </div>
  );
};
