export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  isActiveToday: boolean;
  activeDates: string[];
}

export function toLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDateMidnight(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d, 0, 0, 0, 0);
}

/**
 * Calculates current and longest study streak based on completed tasks,
 * study sessions, and preserved active dates.
 * 
 * Rules:
 * - Consecutive calendar days with >= 1 completed task or study session count as a streak.
 * - Multiple completions on the same calendar day count as only 1 day.
 * - If today has activity: streak includes today and counts backward.
 * - If today has no activity yet, but yesterday did: streak is still active from yesterday.
 * - If yesterday was also missed: current streak resets to 0.
 * - Longest streak is preserved across historical runs and stored records.
 */
export function calculateStreak(
  completedTasks: { completedAt?: string | null }[],
  studySessions: { completedAt: string; type: string }[],
  savedActiveDates: string[] = [],
  storedLongestStreak: number = 0,
  referenceDate: Date = new Date()
): StreakInfo {
  const activeDateSet = new Set<string>();

  // Add previously recorded active dates
  savedActiveDates.forEach(d => {
    if (d && /^\d{4}-\d{2}-\d{2}$/.test(d)) {
      activeDateSet.add(d);
    }
  });

  // Add dates from completed tasks
  completedTasks.forEach(t => {
    if (t.completedAt) {
      try {
        const dStr = toLocalDateString(new Date(t.completedAt));
        if (dStr) activeDateSet.add(dStr);
      } catch {
        // ignore invalid date
      }
    }
  });

  // Add dates from study sessions
  studySessions.forEach(s => {
    if (s.type === 'study' && s.completedAt) {
      try {
        const dStr = toLocalDateString(new Date(s.completedAt));
        if (dStr) activeDateSet.add(dStr);
      } catch {
        // ignore invalid date
      }
    }
  });

  const sortedDates = Array.from(activeDateSet).sort();

  if (sortedDates.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: storedLongestStreak,
      lastActiveDate: null,
      isActiveToday: false,
      activeDates: [],
    };
  }

  // 1. Calculate historical longest streak
  let maxHistoricalStreak = 0;
  let runningStreak = 0;
  let prevMidnight: number | null = null;

  for (const dateStr of sortedDates) {
    const currMidnight = parseDateMidnight(dateStr).getTime();

    if (prevMidnight === null) {
      runningStreak = 1;
    } else {
      const diffDays = Math.round((currMidnight - prevMidnight) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        runningStreak += 1;
      } else if (diffDays > 1) {
        runningStreak = 1;
      }
      // diffDays === 0 means duplicate date, no streak increment
    }

    if (runningStreak > maxHistoricalStreak) {
      maxHistoricalStreak = runningStreak;
    }
    prevMidnight = currMidnight;
  }

  // 2. Calculate current streak relative to reference date (today)
  const todayStr = toLocalDateString(referenceDate);
  const isActiveToday = activeDateSet.has(todayStr);

  const yesterday = new Date(referenceDate);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = toLocalDateString(yesterday);
  const isActiveYesterday = activeDateSet.has(yesterdayStr);

  let currentStreak = 0;

  if (isActiveToday) {
    let checkDate = new Date(referenceDate);
    while (activeDateSet.has(toLocalDateString(checkDate))) {
      currentStreak += 1;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  } else if (isActiveYesterday) {
    let checkDate = new Date(yesterday);
    while (activeDateSet.has(toLocalDateString(checkDate))) {
      currentStreak += 1;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  } else {
    // Missing yesterday and today means the streak is broken
    currentStreak = 0;
  }

  const longestStreak = Math.max(storedLongestStreak, maxHistoricalStreak, currentStreak);
  const lastActiveDate = sortedDates[sortedDates.length - 1];

  return {
    currentStreak,
    longestStreak,
    lastActiveDate,
    isActiveToday,
    activeDates: sortedDates,
  };
}
