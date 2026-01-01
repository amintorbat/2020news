/**
 * Format date with time in Persian
 */
export function formatDateTime(dateString: string): { date: string; time: string } {
  try {
    const date = new Date(dateString);
    const dateStr = new Intl.DateTimeFormat("fa-IR", {
      dateStyle: "medium",
      calendar: "persian",
    }).format(date);
    const timeStr = new Intl.DateTimeFormat("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
      calendar: "persian",
    }).format(date);
    return { date: dateStr, time: timeStr };
  } catch {
    return { date: dateString, time: "" };
  }
}

/**
 * Format date and time together in Persian format
 * Example: "دوشنبه ۱۲ دی ۱۴۰۴ • ۱۴:۳۵"
 */
export function formatDateTimeCombined(dateString: string): string {
  try {
    const date = new Date(dateString);
    const dateStr = new Intl.DateTimeFormat("fa-IR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      calendar: "persian",
    }).format(date);
    const timeStr = new Intl.DateTimeFormat("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
      calendar: "persian",
    }).format(date);
    return `${dateStr} • ${timeStr}`;
  } catch {
    const { date, time } = formatDateTime(dateString);
    return time ? `${date} • ${time}` : date;
  }
}
