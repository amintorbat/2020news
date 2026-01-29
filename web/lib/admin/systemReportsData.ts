import type { SystemReport, EventType, ActorRole, Module, SeverityLevel } from "@/types/systemReports";

// Mock system reports data
export const mockSystemReports: SystemReport[] = [
  // Leagues module
  {
    id: "log-1",
    eventType: "create",
    severity: "Normal",
    actorRole: "Admin",
    actorName: "مدیر کل",
    actorId: "1",
    module: "Leagues",
    resourceId: "league-1",
    resourceName: "لیگ برتر فوتسال ایران",
    description: "ایجاد لیگ جدید: لیگ برتر فوتسال ایران",
    timestamp: "2024-12-10T10:00:00Z",
    ipAddress: "192.168.1.1",
  },
  {
    id: "log-2",
    eventType: "update",
    severity: "Normal",
    actorRole: "Admin",
    actorName: "مدیر کل",
    actorId: "1",
    module: "Leagues",
    resourceId: "league-1",
    resourceName: "لیگ برتر فوتسال ایران",
    description: "ویرایش اطلاعات لیگ: لیگ برتر فوتسال ایران",
    timestamp: "2024-12-11T14:30:00Z",
    ipAddress: "192.168.1.1",
  },
  // Matches module
  {
    id: "log-3",
    eventType: "create",
    severity: "Normal",
    actorRole: "Admin",
    actorName: "علی رضایی",
    actorId: "2",
    module: "Matches",
    resourceId: "match-1",
    resourceName: "گیتی پسند vs مس سونگون",
    description: "ایجاد مسابقه جدید: گیتی پسند vs مس سونگون",
    timestamp: "2024-12-12T09:15:00Z",
    ipAddress: "192.168.1.2",
  },
  {
    id: "log-4",
    eventType: "update",
    severity: "Important",
    actorRole: "Match Reporter",
    actorName: "احمد محمدی",
    actorId: "3",
    module: "Matches",
    resourceId: "match-1",
    resourceName: "گیتی پسند vs مس سونگون",
    description: "افزودن رویداد مسابقه: گل توسط مهدی جاوید (دقیقه 12)",
    timestamp: "2024-12-15T18:12:00Z",
    ipAddress: "192.168.1.3",
  },
  {
    id: "log-5",
    eventType: "update",
    severity: "Normal",
    actorRole: "Match Reporter",
    actorName: "احمد محمدی",
    actorId: "3",
    module: "Matches",
    resourceId: "match-1",
    resourceName: "گیتی پسند vs مس سونگون",
    description: "افزودن رویداد مسابقه: کارت زرد برای قدرت بهادری (دقیقه 30)",
    timestamp: "2024-12-15T18:30:00Z",
    ipAddress: "192.168.1.3",
  },
  {
    id: "log-6",
    eventType: "update",
    severity: "Normal",
    actorRole: "Admin",
    actorName: "علی رضایی",
    actorId: "2",
    module: "Matches",
    resourceId: "match-1",
    resourceName: "گیتی پسند vs مس سونگون",
    description: "تغییر وضعیت مسابقه از 'زنده' به 'پایان یافته'",
    timestamp: "2024-12-15T20:00:00Z",
    ipAddress: "192.168.1.2",
  },
  // Teams module
  {
    id: "log-7",
    eventType: "create",
    severity: "Normal",
    actorRole: "Admin",
    actorName: "مدیر کل",
    actorId: "1",
    module: "Teams",
    resourceId: "team-1",
    resourceName: "گیتی پسند",
    description: "ایجاد تیم جدید: گیتی پسند",
    timestamp: "2024-12-01T08:00:00Z",
    ipAddress: "192.168.1.1",
  },
  {
    id: "log-8",
    eventType: "update",
    severity: "Normal",
    actorRole: "Admin",
    actorName: "علی رضایی",
    actorId: "2",
    module: "Teams",
    resourceId: "team-1",
    resourceName: "گیتی پسند",
    description: "ویرایش اطلاعات تیم: گیتی پسند",
    timestamp: "2024-12-05T11:20:00Z",
    ipAddress: "192.168.1.2",
  },
  // Players module
  {
    id: "log-9",
    eventType: "create",
    severity: "Normal",
    actorRole: "Admin",
    actorName: "علی رضایی",
    actorId: "2",
    module: "Players",
    resourceId: "player-1",
    resourceName: "مهدی جاوید",
    description: "ایجاد بازیکن جدید: مهدی جاوید (گیتی پسند)",
    timestamp: "2024-12-08T15:45:00Z",
    ipAddress: "192.168.1.2",
  },
  // News module
  {
    id: "log-10",
    eventType: "create",
    severity: "Normal",
    actorRole: "Match Reporter",
    actorName: "احمد محمدی",
    actorId: "3",
    module: "News",
    resourceId: "news-1",
    resourceName: "گزارش مسابقه گیتی پسند vs مس سونگون",
    description: "ایجاد خبر جدید مرتبط با مسابقه: گزارش مسابقه گیتی پسند vs مس سونگون",
    timestamp: "2024-12-15T20:30:00Z",
    ipAddress: "192.168.1.3",
  },
  {
    id: "log-11",
    eventType: "update",
    severity: "Normal",
    actorRole: "Admin",
    actorName: "علی رضایی",
    actorId: "2",
    module: "News",
    resourceId: "news-1",
    resourceName: "گزارش مسابقه گیتی پسند vs مس سونگون",
    description: "ویرایش خبر: گزارش مسابقه گیتی پسند vs مس سونگون",
    timestamp: "2024-12-16T09:00:00Z",
    ipAddress: "192.168.1.2",
  },
  // Users module
  {
    id: "log-12",
    eventType: "create",
    severity: "Important",
    actorRole: "Admin",
    actorName: "مدیر کل",
    actorId: "1",
    module: "Users",
    resourceId: "3",
    resourceName: "احمد محمدی",
    description: "ایجاد کاربر جدید: احمد محمدی (نقش: گزارشگر)",
    timestamp: "2024-12-01T10:00:00Z",
    ipAddress: "192.168.1.1",
  },
  {
    id: "log-13",
    eventType: "update",
    severity: "Important",
    actorRole: "Admin",
    actorName: "مدیر کل",
    actorId: "1",
    module: "Users",
    resourceId: "3",
    resourceName: "احمد محمدی",
    description: "اختصاص گزارشگر به مسابقه: گیتی پسند vs مس سونگون",
    timestamp: "2024-12-14T16:00:00Z",
    ipAddress: "192.168.1.1",
  },
  // System module
  {
    id: "log-14",
    eventType: "error",
    severity: "Critical",
    actorRole: "Admin",
    actorName: "سیستم",
    module: "System",
    description: "خطا در اتصال به پایگاه داده (Timeout)",
    timestamp: "2024-12-10T12:00:00Z",
    ipAddress: "192.168.1.1",
  },
  {
    id: "log-15",
    eventType: "access",
    severity: "Normal",
    actorRole: "Match Reporter",
    actorName: "احمد محمدی",
    actorId: "3",
    module: "System",
    description: "ورود به داشبورد گزارشگر",
    timestamp: "2024-12-15T18:00:00Z",
    ipAddress: "192.168.1.3",
  },
  {
    id: "log-16",
    eventType: "access",
    severity: "Important",
    actorRole: "Match Reporter",
    actorName: "احمد محمدی",
    actorId: "3",
    module: "System",
    description: "تلاش برای دسترسی غیرمجاز به صفحه مدیریت کاربران",
    timestamp: "2024-12-15T18:05:00Z",
    ipAddress: "192.168.1.3",
  },
  {
    id: "log-17",
    eventType: "delete",
    severity: "Important",
    actorRole: "Admin",
    actorName: "مدیر کل",
    actorId: "1",
    module: "Matches",
    resourceId: "match-10",
    resourceName: "مسابقه لغو شده",
    description: "حذف مسابقه: مسابقه لغو شده",
    timestamp: "2024-12-13T14:00:00Z",
    ipAddress: "192.168.1.1",
  },
];

// Helper to get filtered reports
export function getFilteredReports(filters: {
  eventType?: EventType;
  actorRole?: ActorRole;
  module?: Module;
  severity?: SeverityLevel;
  startDate?: string;
  endDate?: string;
}): SystemReport[] {
  let filtered = [...mockSystemReports];

  if (filters.eventType) {
    filtered = filtered.filter((r) => r.eventType === filters.eventType);
  }

  if (filters.actorRole) {
    filtered = filtered.filter((r) => r.actorRole === filters.actorRole);
  }

  if (filters.module) {
    filtered = filtered.filter((r) => r.module === filters.module);
  }

  if (filters.severity) {
    filtered = filtered.filter((r) => r.severity === filters.severity);
  }

  if (filters.startDate) {
    const start = new Date(filters.startDate);
    filtered = filtered.filter((r) => new Date(r.timestamp) >= start);
  }

  if (filters.endDate) {
    const end = new Date(filters.endDate);
    end.setHours(23, 59, 59, 999); // End of day
    filtered = filtered.filter((r) => new Date(r.timestamp) <= end);
  }

  // Sort by timestamp (newest first)
  return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}
