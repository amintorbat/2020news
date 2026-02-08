/**
 * Role-Based Access Control (RBAC) types for 2020news admin panel.
 * RTL Persian, FUTSAL & BEACH SOCCER.
 */

export const RBAC_ROLES = [
  "super_admin",
  "editor",
  "journalist",
  "match_reporter",
  "media_manager",
  "ads_manager",
  "viewer",
] as const;

export type RoleKey = (typeof RBAC_ROLES)[number];

export const RBAC_MODULES = [
  "news",
  "media",
  "matches",
  "leagues",
  "players",
  "ads",
  "settings",
  "reports",
  "users",
  "reporter",
] as const;

export type ModuleKey = (typeof RBAC_MODULES)[number];

export const RBAC_ACTIONS = ["read", "create", "edit", "delete", "publish"] as const;

export type ActionKey = (typeof RBAC_ACTIONS)[number];

/** Scope type for Journalist / Match Reporter */
export type ScopeType = "match" | "news";

/** Time-limited assignment for Journalist or Match Reporter */
export interface ScopedAssignment {
  id: string;
  userId: string;
  scopeType: ScopeType;
  scopeId: string; // matchId or newsId
  startDateTime: string; // ISO
  endDateTime: string;   // ISO
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Admin user with RBAC role and optional scoped assignments */
export interface AdminUserRBAC {
  id: string;
  name: string;
  email: string;
  role: RoleKey;
  lastLogin: string | null;
  createdAt: string;
  isActive: boolean;
  /** Only for journalist / match_reporter: time-bound scope */
  scopedAssignments?: ScopedAssignment[];
}

/** Permission check result */
export interface PermissionResult {
  allowed: boolean;
  reason?: string;
}

export const ROLE_LABELS: Record<RoleKey, string> = {
  super_admin: "مدیر کل",
  editor: "ویراستار",
  journalist: "خبرنگار",
  match_reporter: "گزارشگر مسابقه",
  media_manager: "مدیر رسانه",
  ads_manager: "مدیر تبلیغات",
  viewer: "بیننده",
};

export const MODULE_LABELS: Record<ModuleKey, string> = {
  news: "اخبار",
  media: "رسانه",
  matches: "مسابقات",
  leagues: "لیگ‌ها",
  players: "بازیکنان",
  ads: "تبلیغات",
  settings: "تنظیمات",
  reports: "گزارشات",
  users: "کاربران",
  reporter: "پنل گزارشگر",
};

export const ACTION_LABELS: Record<ActionKey, string> = {
  read: "مشاهده",
  create: "ایجاد",
  edit: "ویرایش",
  delete: "حذف",
  publish: "انتشار",
};
