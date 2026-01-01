/**
 * Format date with time in Persian
 */
export function formatDateTime(dateString: string): { date: string; time: string } {
  try {
    const date = new Date(dateString);
    const dateStr = new Intl.DateTimeFormat("fa-IR", {
      dateStyle: "medium",
    }).format(date);
    const timeStr = new Intl.DateTimeFormat("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
    return { date: dateStr, time: timeStr };
  } catch {
    return { date: dateString, time: "" };
  }
}

