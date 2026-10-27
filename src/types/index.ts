export type Priority = 'high' | 'medium' | 'low';

export type TaskType = 'assignment' | 'revision' | 'reading' | 'project' | 'lab' | 'other';

export interface Subject {
  id: string;
  name: string;
  code?: string;
  color: string; // e.g. '#2563EB', '#0D9488', '#059669', '#D97706', '#7C3AED', '#E11D48', '#475569'
  icon?: string; // e.g. 'book', 'code', 'calculator', 'flask', 'brain', 'globe'
  instructor?: string;
  weeklyGoalHours?: number;
  notes?: string;
}

export interface Task {
  id: string;
  title: string;
  subjectId: string;
  type: TaskType;
  dueDate: string; // YYYY-MM-DD
  priority: Priority;
  completed: boolean;
  completedAt?: string | null; // ISO string
  estimatedPomodoros: number;
  notes?: string;
  createdAt: string;
}

export interface Exam {
  id: string;
  name: string;
  subjectId: string;
  examDate: string; // YYYY-MM-DDTHH:mm or YYYY-MM-DD
  location?: string;
  weightage?: number; // e.g. 20%
  topics?: string[];
  notes?: string;
}

export interface StudySession {
  id: string;
  subjectId?: string | null;
  taskId?: string | null;
  durationMinutes: number;
  completedAt: string; // ISO string
  type: 'study' | 'shortBreak' | 'longBreak';
}

export interface UserSettings {
  name: string;
  major: string;
  semester: string;
  theme: 'light' | 'dark';
  pomodoroStudyMins: number;
  pomodoroShortBreakMins: number;
  pomodoroLongBreakMins: number;
  soundEnabled: boolean;
  isProfileSetup: boolean;
  isSampleDataLoaded: boolean;
}

export type ViewType = 'dashboard' | 'tasks' | 'subjects' | 'exams' | 'timer' | 'analytics' | 'settings';

export type TimerMode = 'study' | 'shortBreak' | 'longBreak';

export interface TimerState {
  isRunning: boolean;
  mode: TimerMode;
  timeLeft: number; // in seconds
  totalTime: number; // in seconds
  activeSubjectId: string | null;
  activeTaskId: string | null;
  completedCycles: number;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  activeDates: string[];
}

