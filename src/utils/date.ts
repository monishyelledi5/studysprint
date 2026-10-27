export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDaysRemaining(targetDateStr: string): {
  days: number;
  label: string;
  isUrgent: boolean;
  isPassed: boolean;
  isToday: boolean;
  isTomorrow: boolean;
} {
  if (!targetDateStr) {
    return { days: 0, label: 'No date', isUrgent: false, isPassed: false, isToday: false, isTomorrow: false };
  }

  const targetDate = new Date(targetDateStr);
  const now = new Date();
  
  // Set to midnight for date-only comparison
  const targetMidnight = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()).getTime();
  const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  const diffMs = targetMidnight - nowMidnight;
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      days: diffDays,
      label: `${Math.abs(diffDays)}d ago`,
      isUrgent: false,
      isPassed: true,
      isToday: false,
      isTomorrow: false,
    };
  }

  if (diffDays === 0) {
    return {
      days: 0,
      label: 'Today',
      isUrgent: true,
      isPassed: false,
      isToday: true,
      isTomorrow: false,
    };
  }

  if (diffDays === 1) {
    return {
      days: 1,
      label: 'Tomorrow',
      isUrgent: true,
      isPassed: false,
      isToday: false,
      isTomorrow: true,
    };
  }

  return {
    days: diffDays,
    label: `${diffDays} days left`,
    isUrgent: diffDays <= 3,
    isPassed: false,
    isToday: false,
    isTomorrow: false,
  };
}

export function formatSecondsToTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function getPast7Days(): { dateStr: string; label: string; fullDate: string }[] {
  const days = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const label = d.toLocaleDateString('en-US', { weekday: 'short' });
    const fullDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    days.push({ dateStr, label, fullDate });
  }

  return days;
}
