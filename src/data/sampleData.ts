import { Exam, Subject, Task, StudySession, UserSettings } from '../types';

export interface PresetColor {
  name: string;
  hex: string;
}

export const PRESET_COLORS: PresetColor[] = [
  { name: 'Royal Blue', hex: '#2563EB' },
  { name: 'Indigo', hex: '#6366F1' },
  { name: 'Purple', hex: '#9333EA' },
  { name: 'Emerald', hex: '#059669' },
  { name: 'Teal', hex: '#0D9488' },
  { name: 'Amber', hex: '#D97706' },
  { name: 'Rose', hex: '#E11D48' },
  { name: 'Crimson', hex: '#DC2626' },
  { name: 'Slate', hex: '#475569' },
  { name: 'Cyan', hex: '#0891B2' },
];

export function getSampleData() {
  const now = new Date();

  const getDateOffset = (offsetDays: number): string => {
    const d = new Date(now);
    d.setDate(d.getDate() + offsetDays);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const getDateTimeOffset = (offsetDays: number, hour: number = 10, minute: number = 0): string => {
    const d = new Date(now);
    d.setDate(d.getDate() + offsetDays);
    d.setHours(hour, minute, 0, 0);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(hour).padStart(2, '0');
    const min = String(minute).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  };

  const subjects: Subject[] = [
    {
      id: 'sub-cs189',
      name: 'Introduction to Machine Learning',
      code: 'CS 189',
      color: '#2563EB', // Royal Blue
      instructor: 'Prof. Sahai',
      weeklyGoalHours: 10,
      notes: 'Focus on gradient derivations and matrix calculus fundamentals.',
    },
    {
      id: 'sub-math110',
      name: 'Linear Algebra',
      code: 'MATH 110',
      color: '#059669', // Emerald
      instructor: 'Prof. Williams',
      weeklyGoalHours: 8,
      notes: 'Cover proofs thoroughly. Homework due every Friday at 5 PM.',
    },
    {
      id: 'sub-econ101',
      name: 'Microeconomic Theory',
      code: 'ECON 101',
      color: '#D97706', // Amber
      instructor: 'Prof. Olney',
      weeklyGoalHours: 6,
      notes: 'Discussion section on Wednesdays in Evans Hall 70.',
    },
    {
      id: 'sub-phys7b',
      name: 'Physics: Electromagnetism & Optics',
      code: 'PHYS 7B',
      color: '#6366F1', // Indigo
      instructor: 'Prof. Deweese',
      weeklyGoalHours: 8,
      notes: 'Lab quizzes every other Tuesday. Pre-lab reading required.',
    },
    {
      id: 'sub-cogsci1',
      name: 'Mind, Brain and Computation',
      code: 'COGSCI 1',
      color: '#E11D48', // Rose
      instructor: 'Prof. Feldman',
      weeklyGoalHours: 4,
      notes: 'Midterm paper draft due next month.',
    },
  ];

  const tasks: Task[] = [
    {
      id: 'task-1',
      title: 'Problem Set 5: SVD & Orthogonal Projections',
      subjectId: 'sub-math110',
      type: 'assignment',
      dueDate: getDateOffset(0), // Due Today!
      priority: 'high',
      completed: false,
      estimatedPomodoros: 3,
      notes: 'Questions 3 and 4 require Gram-Schmidt orthogonalization step-by-step.',
      createdAt: getDateOffset(-2),
    },
    {
      id: 'task-2',
      title: 'Neural Network Backpropagation Implementation',
      subjectId: 'sub-cs189',
      type: 'project',
      dueDate: getDateOffset(2),
      priority: 'high',
      completed: false,
      estimatedPomodoros: 5,
      notes: 'Implement forward & backward passes in NumPy without PyTorch autograd.',
      createdAt: getDateOffset(-3),
    },
    {
      id: 'task-3',
      title: 'Read Chapter 7: Monopoly & Price Discrimination',
      subjectId: 'sub-econ101',
      type: 'reading',
      dueDate: getDateOffset(1),
      priority: 'medium',
      completed: false,
      estimatedPomodoros: 2,
      notes: 'Focus on first-degree vs second-degree price discrimination graphical models.',
      createdAt: getDateOffset(-1),
    },
    {
      id: 'task-4',
      title: 'Lab Report 4: Magnetic Induction & Faraday Law',
      subjectId: 'sub-phys7b',
      type: 'lab',
      dueDate: getDateOffset(4),
      priority: 'high',
      completed: false,
      estimatedPomodoros: 4,
      notes: 'Plot oscilloscope voltage vs frequency curves in Python.',
      createdAt: getDateOffset(-2),
    },
    {
      id: 'task-5',
      title: 'Review Lecture 11: Convolutional Filters & Stride',
      subjectId: 'sub-cs189',
      type: 'revision',
      dueDate: getDateOffset(3),
      priority: 'medium',
      completed: false,
      estimatedPomodoros: 2,
      notes: 'Calculate receptive fields and parameter counts for VGG-16.',
      createdAt: getDateOffset(-1),
    },
    {
      id: 'task-6',
      title: 'Essay Outline: The Chinese Room Argument',
      subjectId: 'sub-cogsci1',
      type: 'assignment',
      dueDate: getDateOffset(6),
      priority: 'low',
      completed: false,
      estimatedPomodoros: 3,
      notes: 'Compare Searle syntax vs semantics objection with modern LLM capabilities.',
      createdAt: getDateOffset(-2),
    },
    // Completed tasks
    {
      id: 'task-c1',
      title: 'Practice Midterm 1: Diagonalization proofs',
      subjectId: 'sub-math110',
      type: 'revision',
      dueDate: getDateOffset(-1),
      priority: 'high',
      completed: true,
      completedAt: new Date(now.getTime() - 24 * 3600 * 1000).toISOString(),
      estimatedPomodoros: 3,
      notes: 'Completed timed exam practice with 92% score.',
      createdAt: getDateOffset(-5),
    },
    {
      id: 'task-c2',
      title: 'Cournot Duopoly Numerical Exercises',
      subjectId: 'sub-econ101',
      type: 'assignment',
      dueDate: getDateOffset(-2),
      priority: 'medium',
      completed: true,
      completedAt: new Date(now.getTime() - 48 * 3600 * 1000).toISOString(),
      estimatedPomodoros: 2,
      notes: 'Submitted via bCourses on time.',
      createdAt: getDateOffset(-6),
    },
    {
      id: 'task-c3',
      title: 'Vector Calculus Review Quiz',
      subjectId: 'sub-phys7b',
      type: 'revision',
      dueDate: getDateOffset(-3),
      priority: 'low',
      completed: true,
      completedAt: new Date(now.getTime() - 72 * 3600 * 1000).toISOString(),
      estimatedPomodoros: 2,
      notes: 'Curl and divergence refresher completed.',
      createdAt: getDateOffset(-7),
    },
  ];

  const exams: Exam[] = [
    {
      id: 'exam-1',
      name: 'Midterm 1: Vector Spaces & Spectral Theorem',
      subjectId: 'sub-math110',
      examDate: getDateTimeOffset(4, 14, 0), // 4 days away at 2 PM
      location: 'Wheeler Hall, Aud 150',
      weightage: 25,
      topics: ['Inner product spaces', 'Gram-Schmidt', 'Eigenvalues & eigenvectors', 'Spectral decomposition'],
      notes: 'One double-sided 8.5x11 cheat sheet permitted. No calculators.',
    },
    {
      id: 'exam-2',
      name: 'Midterm Exam 1: Supervised ML & Convex Opt',
      subjectId: 'sub-cs189',
      examDate: getDateTimeOffset(11, 19, 0), // 11 days away at 7 PM
      location: 'Pimentel Hall 1',
      weightage: 30,
      topics: ['Linear & Logistic Regression', 'Maximum Likelihood Estimation', 'SVM & Kernels', 'Backpropagation'],
      notes: 'Covers Lectures 1 through 12. Bring #2 pencils and student ID.',
    },
    {
      id: 'exam-3',
      name: 'Midterm 2: Maxwells Equations & AC Circuits',
      subjectId: 'sub-phys7b',
      examDate: getDateTimeOffset(18, 11, 0),
      location: 'LeConte Hall 4',
      weightage: 20,
      topics: ['Faradays Law', 'Inductance & RLC Circuits', 'Displacement Current', 'EM Waves'],
      notes: 'Standard formula sheet will be provided on back of exam paper.',
    },
    {
      id: 'exam-4',
      name: 'Final Examination: Microeconomic Theory',
      subjectId: 'sub-econ101',
      examDate: getDateTimeOffset(34, 8, 0),
      location: 'Hearst Gym Fieldhouse',
      weightage: 40,
      topics: ['Consumer theory', 'Production functions', 'Game theory & Nash equilibria', 'General equilibrium'],
      notes: 'Cumulative final covering entire semester syllabus.',
    },
  ];

  // Past 7 days realistic study sessions
  const studySessions: StudySession[] = [];
  const sessionDurations = [50, 75, 100, 50, 125, 75, 50]; // Minutes per day over last 7 days
  
  sessionDurations.forEach((mins, idx) => {
    const daysAgo = 6 - idx;
    const sessionDate = new Date(now);
    sessionDate.setDate(sessionDate.getDate() - daysAgo);
    sessionDate.setHours(15, 30, 0, 0);

    const sub = subjects[idx % subjects.length];
    studySessions.push({
      id: `session-${idx + 1}`,
      subjectId: sub.id,
      durationMinutes: mins,
      completedAt: sessionDate.toISOString(),
      type: 'study',
    });
  });

  const settings: UserSettings = {
    name: 'Alex Rivera',
    major: 'Computer Science & Mathematics',
    semester: 'Fall Semester',
    theme: 'light',
    pomodoroStudyMins: 25,
    pomodoroShortBreakMins: 5,
    pomodoroLongBreakMins: 15,
    soundEnabled: true,
    isProfileSetup: true,
    isSampleDataLoaded: true,
  };

  const streakActiveDates = studySessions.map(s => s.completedAt.split('T')[0]);
  const streak = {
    currentStreak: 7,
    longestStreak: 12,
    lastActiveDate: getDateOffset(0),
    activeDates: streakActiveDates,
  };

  return { subjects, tasks, exams, studySessions, settings, streak };
}
