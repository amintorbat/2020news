import jalaali from "jalaali-js";
import type {
  SystemReport,
  SystemWarning,
  EventType,
  ActorRole,
  Module,
  SeverityLevel,
} from "@/types/systemReports";
import { mockMatches } from "@/lib/admin/matchesData";
import { mockLeagues } from "@/lib/admin/leaguesData";
import { getAllAds } from "@/lib/admin/adsData";
import { mockPlayers } from "@/lib/admin/playersData";
import { mockTeams } from "@/lib/admin/teamsData";
import { mockReporterAssignments } from "@/lib/admin/reporterAssignments";
import { getAssignmentStatus } from "@/types/reporter";

const STORAGE_KEY_NOTES = "2020news_audit_log_notes";

function loadNotes(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NOTES);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, string>;
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function saveNotes(notes: Record<string, string>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notes));
  } catch (_) {}
}

/** Get audit log with persisted admin notes merged in */
export function getAuditLogs(): SystemReport[] {
  const notes = typeof window !== "undefined" ? loadNotes() : {};
  return mockSystemReports.map((r) => ({
    ...r,
    adminNote: notes[r.id] ?? r.adminNote,
  }));
}

/** Update admin note for a log entry (persisted in localStorage) */
export function updateAuditLogNote(id: string, adminNote: string): void {
  const notes = loadNotes();
  if (adminNote.trim()) {
    notes[id] = adminNote.trim();
  } else {
    delete notes[id];
  }
  saveNotes(notes);
}

// Normalize Persian/Arabic for search (optional: strip tatweel, normalize spaces)
function normalizeForSearch(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

/** Full-text search: matches if query appears in description, resourceName, actorName, adminNote */
function matchesSearch(report: SystemReport, query: string, notes: Record<string, string>): boolean {
  if (!query || !query.trim()) return true;
  const q = normalizeForSearch(query.trim());
  const haystack = [
    report.description,
    report.resourceName ?? "",
    report.actorName,
    report.systemMessage ?? "",
    notes[report.id] ?? report.adminNote ?? "",
  ]
    .join(" ")
    .replace(/\s+/g, " ");
  return haystack.includes(q);
}

/** Parse Jalali YYYY-MM-DD to start-of-day and end-of-day in local time for comparison with ISO timestamps */
function jalaliDayToRange(jalaliDate: string): { start: number; end: number } | null {
  if (!jalaliDate || jalaliDate.length < 10) return null;
  try {
    const [jy, jm, jd] = jalaliDate.slice(0, 10).split("-").map(Number);
    const { gy, gm, gd } = jalaali.toGregorian(jy, jm, jd);
    const start = new Date(gy, gm - 1, gd, 0, 0, 0, 0).getTime();
    const end = new Date(gy, gm - 1, gd, 23, 59, 59, 999).getTime();
    return { start, end };
  } catch {
    return null;
  }
}

export function getFilteredReports(filters: {
  eventType?: EventType;
  actorRole?: ActorRole;
  actorName?: string;
  module?: Module;
  severity?: SeverityLevel;
  startDate?: string;
  endDate?: string;
  searchQuery?: string;
}): SystemReport[] {
  const notes = typeof window !== "undefined" ? loadNotes() : {};
  let filtered = getAuditLogs();

  if (filters.eventType) {
    filtered = filtered.filter((r) => r.eventType === filters.eventType);
  }
  if (filters.actorRole) {
    filtered = filtered.filter((r) => r.actorRole === filters.actorRole);
  }
  if (filters.actorName) {
    filtered = filtered.filter((r) => r.actorName === filters.actorName);
  }
  if (filters.module) {
    filtered = filtered.filter((r) => r.module === filters.module);
  }
  if (filters.severity) {
    filtered = filtered.filter((r) => r.severity === filters.severity);
  }
  if (filters.searchQuery) {
    filtered = filtered.filter((r) => matchesSearch(r, filters.searchQuery!, notes));
  }
  if (filters.startDate) {
    const range = jalaliDayToRange(filters.startDate);
    if (range) {
      filtered = filtered.filter((r) => new Date(r.timestamp).getTime() >= range.start);
    }
  }
  if (filters.endDate) {
    const range = jalaliDayToRange(filters.endDate);
    if (range) {
      filtered = filtered.filter((r) => new Date(r.timestamp).getTime() <= range.end);
    }
  }

  return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

/** Unique actor names for filter dropdown */
export function getUniqueActorNames(): string[] {
  const names = new Set(getAuditLogs().map((r) => r.actorName));
  return Array.from(names).sort((a, b) => a.localeCompare(b, "fa"));
}

// ---------- Mock audit log entries ----------
export const mockSystemReports: SystemReport[] = [
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
    description: "افزودن رویداد مسابقه: گل توسط مهدی جاوید (دقیقه ۱۲)",
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
    description: "افزودن رویداد مسابقه: کارت زرد برای قدرت بهادری (دقیقه ۳۰)",
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
    description: "تغییر وضعیت مسابقه از «زنده» به «پایان یافته»",
    timestamp: "2024-12-15T20:00:00Z",
    ipAddress: "192.168.1.2",
  },
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
    description: "ایجاد خبر جدید مرتبط با مسابقه",
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
  {
    id: "log-13b",
    eventType: "revoke",
    severity: "Important",
    actorRole: "Admin",
    actorName: "مدیر کل",
    actorId: "1",
    module: "Users",
    resourceId: "4",
    resourceName: "رضا خبرنگار",
    description: "لغو دسترسی گزارشگر برای مسابقه",
    systemMessage: "دسترسی به‌درخواست مدیر لغو شد.",
    timestamp: "2024-12-14T17:00:00Z",
    ipAddress: "192.168.1.1",
  },
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
  {
    id: "log-18",
    eventType: "create",
    severity: "Normal",
    actorRole: "Admin",
    actorName: "علی رضایی",
    actorId: "2",
    module: "Media",
    resourceId: "album-1",
    resourceName: "گالری مسابقه گیتی پسند و مس سونگون",
    description: "ایجاد آلبوم رسانه جدید",
    timestamp: "2024-12-16T10:00:00Z",
    ipAddress: "192.168.1.2",
  },
  {
    id: "log-19",
    eventType: "create",
    severity: "Normal",
    actorRole: "Admin",
    actorName: "مدیر کل",
    actorId: "1",
    module: "Ads",
    resourceId: "ad-1",
    resourceName: "بنر نمونه صفحه اصلی",
    description: "ایجاد تبلیغ جدید: بنر نمونه صفحه اصلی",
    timestamp: "2024-12-09T11:00:00Z",
    ipAddress: "192.168.1.1",
  },
  {
    id: "log-20",
    eventType: "expire",
    severity: "Normal",
    actorRole: "System",
    actorName: "سیستم",
    module: "Users",
    resourceId: "3",
    resourceName: "احمد محمدی",
    description: "انقضای دسترسی گزارشگر برای مسابقه",
    systemMessage: "بازه زمانی دسترسی به پایان رسید.",
    timestamp: "2024-12-15T20:01:00Z",
    ipAddress: "192.168.1.1",
  },
];

// ---------- System Warnings (computed from current data) ----------
function getSystemWarningsImpl(): SystemWarning[] {
  const warnings: SystemWarning[] = [];
  const teamIds = new Set(mockTeams.map((t) => t.id));
  const now = Date.now();

  // Match without result: status finished but score null
  for (const m of mockMatches) {
    if (
      m.status === "finished" &&
      (m.homeScore == null || m.awayScore == null)
    ) {
      warnings.push({
        id: `w-match-result-${m.id}`,
        kind: "match_without_result",
        entityId: m.id,
        title: "مسابقه بدون نتیجه",
        description: `مسابقه «${m.homeTeam} - ${m.awayTeam}» به پایان رسیده اما نتیجه ثبت نشده است.`,
        link: "/admin/matches",
        severity: "warning",
      });
    }
  }

  // League without teams: league has no matches
  for (const league of mockLeagues) {
    const hasMatch = mockMatches.some((m) => m.leagueId === league.id);
    if (!hasMatch) {
      warnings.push({
        id: `w-league-teams-${league.id}`,
        kind: "league_without_teams",
        entityId: league.id,
        title: "لیگ بدون تیم",
        description: `لیگ «${league.title}» هنوز هیچ مسابقه‌ای ندارد؛ در عمل تیمی به آن اختصاص نیافته است.`,
        link: "/admin/leagues",
        severity: "warning",
      });
    }
  }

  // Journalist/reporter with expired access
  for (const a of mockReporterAssignments) {
    const status = getAssignmentStatus(a);
    if (status === "expired") {
      warnings.push({
        id: `w-reporter-expired-${a.userId}-${a.matchId}`,
        kind: "journalist_expired",
        entityId: a.matchId,
        title: "دسترسی گزارشگر منقضی شده",
        description: `دسترسی «${a.userName}» برای این مسابقه منقضی شده است. در صورت نیاز مجدداً اختصاص دهید.`,
        link: "/admin/reporter",
        severity: "warning",
      });
    }
  }

  // Ad active but outside date range
  for (const ad of getAllAds()) {
    if (!ad.isActive) continue;
    const start = new Date(ad.startDate).getTime();
    const end = new Date(ad.endDate).getTime();
    if (now < start || now > end) {
      warnings.push({
        id: `w-ad-range-${ad.id}`,
        kind: "ad_outside_range",
        entityId: ad.id,
        title: "تبلیغ خارج از بازه زمانی",
        description: `تبلیغ «${ad.title}» فعال است اما خارج از بازه نمایش (تاریخ شروع/پایان) قرار دارد.`,
        link: "/admin/advertising",
        severity: "error",
      });
    }
  }

  // Player without team
  for (const p of mockPlayers) {
    if (!p.teamId || !teamIds.has(p.teamId)) {
      warnings.push({
        id: `w-player-team-${p.id}`,
        kind: "player_without_team",
        entityId: p.id,
        title: "بازیکن بدون تیم",
        description: `بازیکن «${p.name}» به هیچ تیم معتبری اختصاص داده نشده است.`,
        link: "/admin/players",
        severity: "warning",
      });
    }
  }

  // League rules incomplete (league type but missing points or standings rules)
  for (const league of mockLeagues) {
    if (league.competitionType !== "league") continue;
    const missingPoints = !league.pointsSystem;
    const missingStandings = league.hasStandingsTable === true && !league.rankingRules;
    if (missingPoints || missingStandings) {
      warnings.push({
        id: `w-league-rules-${league.id}`,
        kind: "league_rules_incomplete",
        entityId: league.id,
        title: "قوانین لیگ ناقص",
        description: `لیگ «${league.title}» از نوع دوره‌ای است اما سیستم امتیاز یا قوانین رده‌بندی ناقص است.`,
        link: "/admin/leagues",
        severity: "warning",
      });
    }
  }

  return warnings;
}

let cachedWarnings: SystemWarning[] | null = null;
export function getSystemWarnings(): SystemWarning[] {
  if (typeof window === "undefined") return [];
  if (cachedWarnings === null) cachedWarnings = getSystemWarningsImpl();
  return cachedWarnings;
}

export function invalidateWarningsCache(): void {
  cachedWarnings = null;
}

// ---------- Timeline: group by day (Persian date) ----------
export interface TimelineDay {
  dateKey: string;
  dateLabel: string;
  entries: SystemReport[];
}

function toPersianDateLabel(isoTimestamp: string): string {
  try {
    const d = new Date(isoTimestamp);
    const j = jalaali.toJalaali(d.getFullYear(), d.getMonth() + 1, d.getDate());
    return `${j.jy}/${String(j.jm).padStart(2, "0")}/${String(j.jd).padStart(2, "0")}`;
  } catch {
    return isoTimestamp.slice(0, 10);
  }
}

export function getTimelineGroups(reports: SystemReport[]): TimelineDay[] {
  const byDay = new Map<string, SystemReport[]>();
  for (const r of reports) {
    const key = toPersianDateLabel(r.timestamp);
    if (!byDay.has(key)) byDay.set(key, []);
    byDay.get(key)!.push(r);
  }
  const sorted = Array.from(byDay.entries()).sort((a, b) => {
    const t1 = a[1][0] ? new Date(a[1][0].timestamp).getTime() : 0;
    const t2 = b[1][0] ? new Date(b[1][0].timestamp).getTime() : 0;
    return t2 - t1;
  });
  return sorted.map(([dateKey, entries]) => ({
    dateKey,
    dateLabel: dateKey,
    entries: entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
  }));
}
