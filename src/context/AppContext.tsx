import React, { createContext, useContext, useEffect, useState, useMemo, useRef } from 'react';
import { Exam, Subject, Task, StudySession, UserSettings, ViewType, TimerMode, TimerState, StreakData } from '../types';
import { getSampleData } from '../data/sampleData';
import { sound } from '../utils/audio';
import { calculateStreak, toLocalDateString } from '../utils/streak';

const STORAGE_KEYS = {
  SUBJECTS: 'studysprint_subjects_v1',
  TASKS: 'studysprint_tasks_v1',
  EXAMS: 'studysprint_exams_v1',
  SESSIONS: 'studysprint_sessions_v1',
  SETTINGS: 'studysprint_settings_v1',
  STREAK: 'studysprint_streak_v1',
};

interface AppContextType {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  subjects: Subject[];
  tasks: Task[];
  exams: Exam[];
  studySessions: StudySession[];
  settings: UserSettings;
  
  // Subject operations
  addSubject: (data: Omit<Subject, 'id'>) => void;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;

  // Task operations
  addTask: (data: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  toggleTaskCompleted: (id: string) => void;
  deleteTask: (id: string) => void;

  // Exam operations
  addExam: (data: Omit<Exam, 'id'>) => void;
  updateExam: (id: string, updates: Partial<Exam>) => void;
  deleteExam: (id: string) => void;

  // Timer operations
  timerState: TimerState;
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  setTimerMode: (mode: TimerMode) => void;
  setTimerSubject: (subjectId: string | null) => void;
  setTimerTask: (taskId: string | null) => void;
  skipTimer: () => void;
  startTimerForTask: (task: Task) => void;

  // Settings & Storage
  updateSettings: (updates: Partial<UserSettings>) => void;
  clearAllData: () => void;
  resetToSampleData: () => void;

  // Modals
  isTaskModalOpen: boolean;
  editingTask: Task | null;
  openTaskModal: (task?: Task) => void;
  closeTaskModal: () => void;

  isSubjectModalOpen: boolean;
  editingSubject: Subject | null;
  openSubjectModal: (subject?: Subject) => void;
  closeSubjectModal: () => void;

  isExamModalOpen: boolean;
  editingExam: Exam | null;
  openExamModal: (exam?: Exam) => void;
  closeExamModal: () => void;

  // Notifications
  toast: { message: string; type: 'success' | 'info' | 'warning' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;

  // Study Streak
  streak: StreakData;
  isStreakActiveToday: boolean;
  testRecordStudyActivityDate: (dateStr: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');

  // Load initial states from localStorage or generate sample data
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return getSampleData().subjects;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return getSampleData().tasks;
  });

  const [exams, setExams] = useState<Exam[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.EXAMS);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return getSampleData().exams;
  });

  const [studySessions, setStudySessions] = useState<StudySession[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return getSampleData().studySessions;
  });

  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return getSampleData().settings;
  });

  // Streak State & History
  const [savedActiveDates, setSavedActiveDates] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.STREAK);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed.activeDates)) return parsed.activeDates;
      }
    } catch {
      // ignore
    }
    return getSampleData().streak.activeDates;
  });

  const [storedLongestStreak, setStoredLongestStreak] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.STREAK);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (typeof parsed.longestStreak === 'number') return parsed.longestStreak;
      }
    } catch {
      // ignore
    }
    return getSampleData().streak.longestStreak;
  });

  // Calculate live streak based on completed tasks, study sessions, and saved active dates
  const streakInfo = useMemo(() => {
    return calculateStreak(
      tasks.filter(t => t.completed),
      studySessions,
      savedActiveDates,
      storedLongestStreak
    );
  }, [tasks, studySessions, savedActiveDates, storedLongestStreak]);

  const streak: StreakData = {
    currentStreak: streakInfo.currentStreak,
    longestStreak: streakInfo.longestStreak,
    lastActiveDate: streakInfo.lastActiveDate,
    activeDates: streakInfo.activeDates,
  };

  const isStreakActiveToday = streakInfo.isActiveToday;

  // Persist streak to LocalStorage whenever it updates
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(streak));
    } catch {
      // ignore
    }
  }, [streak]);

  const testRecordStudyActivityDate = (dateStr: string) => {
    if (!dateStr) return;
    setSavedActiveDates(prev => Array.from(new Set([...prev, dateStr])).sort());
    showToast(`Recorded study activity for ${dateStr}`, 'info');
  };

  // Modal States
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Persist to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
    } catch { /* ignore */ }
  }, [subjects]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch { /* ignore */ }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));
    } catch { /* ignore */ }
  }, [exams]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(studySessions));
    } catch { /* ignore */ }
  }, [studySessions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch { /* ignore */ }

    // Sync HTML theme class
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  // Timer State
  const initialStudySeconds = settings.pomodoroStudyMins * 60;
  const [timerState, setTimerState] = useState<TimerState>({
    isRunning: false,
    mode: 'study',
    timeLeft: initialStudySeconds,
    totalTime: initialStudySeconds,
    activeSubjectId: null,
    activeTaskId: null,
    completedCycles: 0,
  });

  const timerRef = useRef<number | null>(null);

  // Update timer totalTime if settings change while timer not running
  useEffect(() => {
    if (!timerState.isRunning) {
      let durationSec = settings.pomodoroStudyMins * 60;
      if (timerState.mode === 'shortBreak') durationSec = settings.pomodoroShortBreakMins * 60;
      if (timerState.mode === 'longBreak') durationSec = settings.pomodoroLongBreakMins * 60;
      setTimerState(prev => ({
        ...prev,
        timeLeft: durationSec,
        totalTime: durationSec,
      }));
    }
  }, [settings.pomodoroStudyMins, settings.pomodoroShortBreakMins, settings.pomodoroLongBreakMins, timerState.mode]);

  // Timer Interval Tick
  useEffect(() => {
    if (timerState.isRunning) {
      timerRef.current = window.setInterval(() => {
        setTimerState(prev => {
          if (prev.timeLeft <= 1) {
            // Timer Finished!
            const wasStudy = prev.mode === 'study';
            if (settings.soundEnabled) {
              sound.playTimerComplete(wasStudy);
            }

            if (wasStudy) {
              // Log completed study session
              const newSession: StudySession = {
                id: `sess-${Date.now()}`,
                subjectId: prev.activeSubjectId,
                taskId: prev.activeTaskId,
                durationMinutes: Math.round(prev.totalTime / 60),
                completedAt: new Date().toISOString(),
                type: 'study',
              };
              setStudySessions(existing => [newSession, ...existing]);

              const nextCycles = prev.completedCycles + 1;
              const nextMode: TimerMode = nextCycles % 4 === 0 ? 'longBreak' : 'shortBreak';
              const nextTotal = (nextMode === 'longBreak' ? settings.pomodoroLongBreakMins : settings.pomodoroShortBreakMins) * 60;

              showToast(`Focus session completed! Great job. Time for a ${nextMode === 'longBreak' ? 'long' : 'short'} break.`, 'success');

              return {
                ...prev,
                isRunning: false,
                mode: nextMode,
                timeLeft: nextTotal,
                totalTime: nextTotal,
                completedCycles: nextCycles,
              };
            } else {
              // Break finished
              const nextTotal = settings.pomodoroStudyMins * 60;
              showToast('Break is over! Ready for another focused sprint?', 'info');

              return {
                ...prev,
                isRunning: false,
                mode: 'study',
                timeLeft: nextTotal,
                totalTime: nextTotal,
              };
            }
          }

          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [timerState.isRunning, settings.soundEnabled, settings.pomodoroStudyMins, settings.pomodoroShortBreakMins, settings.pomodoroLongBreakMins]);

  // Timer Actions
  const startTimer = () => {
    sound.playClick();
    setTimerState(prev => ({ ...prev, isRunning: true }));
  };

  const pauseTimer = () => {
    sound.playClick();
    setTimerState(prev => ({ ...prev, isRunning: false }));
  };

  const resumeTimer = () => {
    sound.playClick();
    setTimerState(prev => ({ ...prev, isRunning: true }));
  };

  const resetTimer = () => {
    sound.playClick();
    let durationSec = settings.pomodoroStudyMins * 60;
    if (timerState.mode === 'shortBreak') durationSec = settings.pomodoroShortBreakMins * 60;
    if (timerState.mode === 'longBreak') durationSec = settings.pomodoroLongBreakMins * 60;

    setTimerState(prev => ({
      ...prev,
      isRunning: false,
      timeLeft: durationSec,
      totalTime: durationSec,
    }));
  };

  const setTimerMode = (mode: TimerMode) => {
    sound.playClick();
    let durationSec = settings.pomodoroStudyMins * 60;
    if (mode === 'shortBreak') durationSec = settings.pomodoroShortBreakMins * 60;
    if (mode === 'longBreak') durationSec = settings.pomodoroLongBreakMins * 60;

    setTimerState(prev => ({
      ...prev,
      mode,
      isRunning: false,
      timeLeft: durationSec,
      totalTime: durationSec,
    }));
  };

  const setTimerSubject = (subjectId: string | null) => {
    setTimerState(prev => ({ ...prev, activeSubjectId: subjectId }));
  };

  const setTimerTask = (taskId: string | null) => {
    setTimerState(prev => {
      if (taskId) {
        const found = tasks.find(t => t.id === taskId);
        return {
          ...prev,
          activeTaskId: taskId,
          activeSubjectId: found ? found.subjectId : prev.activeSubjectId,
        };
      }
      return { ...prev, activeTaskId: null };
    });
  };

  const skipTimer = () => {
    sound.playClick();
    if (timerState.mode === 'study') {
      const nextMode: TimerMode = (timerState.completedCycles + 1) % 4 === 0 ? 'longBreak' : 'shortBreak';
      const nextTotal = (nextMode === 'longBreak' ? settings.pomodoroLongBreakMins : settings.pomodoroShortBreakMins) * 60;
      setTimerState(prev => ({
        ...prev,
        isRunning: false,
        mode: nextMode,
        timeLeft: nextTotal,
        totalTime: nextTotal,
      }));
    } else {
      const nextTotal = settings.pomodoroStudyMins * 60;
      setTimerState(prev => ({
        ...prev,
        isRunning: false,
        mode: 'study',
        timeLeft: nextTotal,
        totalTime: nextTotal,
      }));
    }
  };

  const startTimerForTask = (task: Task) => {
    const studyDuration = settings.pomodoroStudyMins * 60;
    setTimerState(prev => ({
      ...prev,
      mode: 'study',
      activeSubjectId: task.subjectId,
      activeTaskId: task.id,
      timeLeft: studyDuration,
      totalTime: studyDuration,
      isRunning: true,
    }));
    setCurrentView('timer');
    showToast(`Focus session started for: ${task.title}`, 'info');
  };

  // Subject Handlers
  const addSubject = (data: Omit<Subject, 'id'>) => {
    const newSubject: Subject = {
      ...data,
      id: `sub-${Date.now()}`,
    };
    setSubjects(prev => [...prev, newSubject]);
    showToast(`Added subject "${newSubject.name}"`, 'success');
  };

  const updateSubject = (id: string, updates: Partial<Subject>) => {
    setSubjects(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
    showToast('Subject updated', 'success');
  };

  const deleteSubject = (id: string) => {
    const sub = subjects.find(s => s.id === id);
    setSubjects(prev => prev.filter(s => s.id !== id));
    // Clear subject from any tasks / exams that reference it or keep them unassigned
    setTasks(prev => prev.filter(t => t.subjectId !== id));
    setExams(prev => prev.filter(e => e.subjectId !== id));
    if (timerState.activeSubjectId === id) {
      setTimerState(prev => ({ ...prev, activeSubjectId: null }));
    }
    showToast(`Subject "${sub?.code || 'Subject'}" deleted`, 'info');
  };

  // Task Handlers
  const addTask = (data: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...data,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
    showToast(`Added task: ${newTask.title}`, 'success');
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
    showToast('Task updated', 'success');
  };

  const toggleTaskCompleted = (id: string) => {
    sound.playClick();
    setTasks(prev =>
      prev.map(t => {
        if (t.id === id) {
          const nextCompleted = !t.completed;
          if (nextCompleted) {
            showToast(`Task completed! "${t.title}"`, 'success');
          }
          return {
            ...t,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : null,
          };
        }
        return t;
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    if (timerState.activeTaskId === id) {
      setTimerState(prev => ({ ...prev, activeTaskId: null }));
    }
    showToast('Task deleted', 'info');
  };

  // Exam Handlers
  const addExam = (data: Omit<Exam, 'id'>) => {
    const newExam: Exam = {
      ...data,
      id: `exam-${Date.now()}`,
    };
    setExams(prev => [...prev, newExam]);
    showToast(`Added exam "${newExam.name}"`, 'success');
  };

  const updateExam = (id: string, updates: Partial<Exam>) => {
    setExams(prev => prev.map(e => (e.id === id ? { ...e, ...updates } : e)));
    showToast('Exam updated', 'success');
  };

  const deleteExam = (id: string) => {
    setExams(prev => prev.filter(e => e.id !== id));
    showToast('Exam removed', 'info');
  };

  // Settings Handlers
  const updateSettings = (updates: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
    showToast('Settings saved', 'success');
  };

  const clearAllData = () => {
    setSubjects([]);
    setTasks([]);
    setExams([]);
    setStudySessions([]);
    setSavedActiveDates([]);
    setStoredLongestStreak(0);
    setSettings(prev => ({ ...prev, isSampleDataLoaded: false }));
    try {
      localStorage.removeItem(STORAGE_KEYS.SUBJECTS);
      localStorage.removeItem(STORAGE_KEYS.TASKS);
      localStorage.removeItem(STORAGE_KEYS.EXAMS);
      localStorage.removeItem(STORAGE_KEYS.SESSIONS);
      localStorage.removeItem(STORAGE_KEYS.STREAK);
    } catch { /* ignore */ }
    showToast('All data and streaks have been cleared', 'info');
  };

  const resetToSampleData = () => {
    const sample = getSampleData();
    setSubjects(sample.subjects);
    setTasks(sample.tasks);
    setExams(sample.exams);
    setStudySessions(sample.studySessions);
    setSavedActiveDates(sample.streak.activeDates);
    setStoredLongestStreak(sample.streak.longestStreak);
    setSettings(sample.settings);
    showToast('Loaded realistic sample college data', 'success');
  };

  // Modal helpers
  const openTaskModal = (task?: Task) => {
    setEditingTask(task || null);
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setEditingTask(null);
    setIsTaskModalOpen(false);
  };

  const openSubjectModal = (subject?: Subject) => {
    setEditingSubject(subject || null);
    setIsSubjectModalOpen(true);
  };

  const closeSubjectModal = () => {
    setEditingSubject(null);
    setIsSubjectModalOpen(false);
  };

  const openExamModal = (exam?: Exam) => {
    setEditingExam(exam || null);
    setIsExamModalOpen(true);
  };

  const closeExamModal = () => {
    setEditingExam(null);
    setIsExamModalOpen(false);
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        subjects,
        tasks,
        exams,
        studySessions,
        settings,
        addSubject,
        updateSubject,
        deleteSubject,
        addTask,
        updateTask,
        toggleTaskCompleted,
        deleteTask,
        addExam,
        updateExam,
        deleteExam,
        timerState,
        startTimer,
        pauseTimer,
        resumeTimer,
        resetTimer,
        setTimerMode,
        setTimerSubject,
        setTimerTask,
        skipTimer,
        startTimerForTask,
        updateSettings,
        clearAllData,
        resetToSampleData,
        isTaskModalOpen,
        editingTask,
        openTaskModal,
        closeTaskModal,
        isSubjectModalOpen,
        editingSubject,
        openSubjectModal,
        closeSubjectModal,
        isExamModalOpen,
        editingExam,
        openExamModal,
        closeExamModal,
        toast,
        showToast,
        streak,
        isStreakActiveToday,
        testRecordStudyActivityDate,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
