/**
 * Smart System Reports (Audit Logs) Types
 * Backbone of the admin system — audit log, timeline, warnings.
 */

export type EventType =
  | "create"
  | "update"
  | "delete"
  | "publish"
  | "expire"
  | "revoke"
  | "access"
  | "error";

export type ActorRole = "Admin" | "Editor" | "Match Reporter" | "Journalist" | "Media Manager" | "Ads Manager" | "System";

export type Module =
  | "Leagues"
  | "Teams"
  | "Matches"
  | "Players"
  | "News"
  | "Media"
  | "Ads"
  | "Users"
  | "System";

export type SeverityLevel = "Normal" | "Important" | "Critical";

export interface SystemReport {
  id: string;
  eventType: EventType;
  severity: SeverityLevel;
  actorRole: ActorRole;
  actorName: string;
  actorId?: string;
  module: Module;
  resourceId?: string;
  resourceName?: string;
  description: string;
  timestamp: string;
  /** Optional system message or note */
  systemMessage?: string;
  /** Admin/editor note for audits and follow-up */
  adminNote?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}

/** Single system warning — actionable, with link */
export type WarningKind =
  | "match_without_result"
  | "league_without_teams"
  | "journalist_expired"
  | "ad_outside_range"
  | "player_without_team"
  | "league_rules_incomplete";

export interface SystemWarning {
  id: string;
  kind: WarningKind;
  title: string;
  description: string;
  /** Admin path to fix the issue */
  link: string;
  /** Entity id for deduplication */
  entityId?: string;
  severity: "warning" | "error";
}

// Event type labels in Persian
export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  create: "ایجاد",
  update: "ویرایش",
  delete: "حذف",
  publish: "انتشار",
  expire: "انقضا",
  revoke: "لغو دسترسی",
  access: "دسترسی",
  error: "خطا",
};

// Module labels in Persian (entity type)
export const MODULE_LABELS: Record<Module, string> = {
  Leagues: "لیگ",
  Teams: "تیم",
  Matches: "مسابقه",
  Players: "بازیکن",
  News: "خبر",
  Media: "رسانه",
  Ads: "تبلیغ",
  Users: "کاربر",
  System: "سیستم",
};

export const WARNING_KIND_LABELS: Record<WarningKind, string> = {
  match_without_result: "مسابقه بدون نتیجه",
  league_without_teams: "لیگ بدون تیم",
  journalist_expired: "دسترسی گزارشگر منقضی",
  ad_outside_range: "تبلیغ خارج از بازه",
  player_without_team: "بازیکن بدون تیم",
  league_rules_incomplete: "قوانین لیگ ناقص",
};

// Severity labels and colors
export const SEVERITY_CONFIG: Record<
  SeverityLevel,
  { label: string; variant: "default" | "warning" | "danger" }
> = {
  Normal: { label: "عادی", variant: "default" },
  Important: { label: "مهم", variant: "warning" },
  Critical: { label: "بحرانی", variant: "danger" },
};
