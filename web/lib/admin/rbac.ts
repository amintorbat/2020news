/**
 * RBAC: permission matrix, can(), and time-based validation.
 * Validated at both UI and API level.
 */

import type {
  RoleKey,
  ModuleKey,
  ActionKey,
  AdminUserRBAC,
  ScopedAssignment,
  PermissionResult,
} from "@/types/rbac";

/** Permission matrix: module -> action -> roles that can perform it */
export const PERMISSION_MATRIX: Record<ModuleKey, Partial<Record<ActionKey, RoleKey[]>>> = {
  news: {
    read: ["super_admin", "editor", "journalist", "match_reporter", "media_manager", "ads_manager", "viewer"],
    create: ["super_admin", "editor", "journalist", "match_reporter"],
    edit: ["super_admin", "editor", "journalist", "match_reporter"],
    delete: ["super_admin", "editor"],
    publish: ["super_admin", "editor"],
  },
  media: {
    read: ["super_admin", "editor", "journalist", "match_reporter", "media_manager", "viewer"],
    create: ["super_admin", "editor", "media_manager"],
    edit: ["super_admin", "editor", "media_manager"],
    delete: ["super_admin", "media_manager"],
    publish: ["super_admin", "editor", "media_manager"],
  },
  matches: {
    read: ["super_admin", "editor", "journalist", "match_reporter", "viewer"],
    create: ["super_admin", "editor"],
    edit: ["super_admin", "editor", "match_reporter"],
    delete: ["super_admin", "editor"],
    publish: ["super_admin", "editor"],
  },
  leagues: {
    read: ["super_admin", "editor", "viewer"],
    create: ["super_admin", "editor"],
    edit: ["super_admin", "editor"],
    delete: ["super_admin", "editor"],
    publish: ["super_admin", "editor"],
  },
  players: {
    read: ["super_admin", "editor", "viewer"],
    create: ["super_admin", "editor"],
    edit: ["super_admin", "editor"],
    delete: ["super_admin", "editor"],
    publish: ["super_admin", "editor"],
  },
  ads: {
    read: ["super_admin", "ads_manager", "viewer"],
    create: ["super_admin", "ads_manager"],
    edit: ["super_admin", "ads_manager"],
    delete: ["super_admin", "ads_manager"],
    publish: ["super_admin", "ads_manager"],
  },
  settings: {
    read: ["super_admin", "editor"],
    create: ["super_admin"],
    edit: ["super_admin"],
    delete: ["super_admin"],
    publish: ["super_admin"],
  },
  reports: {
    read: ["super_admin", "editor"],
    create: ["super_admin"],
    edit: ["super_admin"],
    delete: ["super_admin"],
    publish: ["super_admin"],
  },
  users: {
    read: ["super_admin"],
    create: ["super_admin"],
    edit: ["super_admin"],
    delete: ["super_admin"],
    publish: ["super_admin"],
  },
  reporter: {
    read: ["super_admin", "editor", "match_reporter"],
    create: ["super_admin", "editor", "match_reporter"],
    edit: ["super_admin", "editor", "match_reporter"],
    delete: ["super_admin", "editor"],
    publish: ["super_admin", "editor"],
  },
};

/** Nav: which admin path is visible to which role (module read = can see nav) */
export const MODULE_TO_PATH: Record<ModuleKey, string> = {
  news: "/admin/news",
  media: "/admin/media",
  matches: "/admin/matches",
  leagues: "/admin/leagues",
  players: "/admin/players",
  ads: "/admin/ads",
  settings: "/admin/settings",
  reports: "/admin/audit",
  users: "/admin/users",
  reporter: "/admin/reporter",
};

/** Check if a role can perform an action on a module (ignoring scope/time). */
export function roleCan(role: RoleKey, module: ModuleKey, action: ActionKey): boolean {
  const allowed = PERMISSION_MATRIX[module]?.[action];
  return Array.isArray(allowed) && allowed.includes(role);
}

/** Check if assignment is currently within its time window. */
export function isScopedAssignmentActive(assignment: ScopedAssignment): boolean {
  if (!assignment.enabled) return false;
  const now = Date.now();
  const start = new Date(assignment.startDateTime).getTime();
  const end = new Date(assignment.endDateTime).getTime();
  return now >= start && now <= end;
}

/** Get status of scoped assignment. */
export function getScopedAssignmentStatus(
  assignment: ScopedAssignment
): "active" | "expired" | "scheduled" | "disabled" {
  if (!assignment.enabled) return "disabled";
  const now = Date.now();
  const start = new Date(assignment.startDateTime).getTime();
  const end = new Date(assignment.endDateTime).getTime();
  if (now < start) return "scheduled";
  if (now > end) return "expired";
  return "active";
}

/** Match Reporter: can only add match events + create match-specific news, within assigned match & time. */
export function canMatchReporterPerform(
  user: AdminUserRBAC,
  module: ModuleKey,
  action: ActionKey,
  context: { matchId?: string; newsId?: string }
): PermissionResult {
  if (user.role !== "match_reporter") {
    return { allowed: false, reason: "نقش گزارشگر مسابقه نیست" };
  }
  // دسترسی به پنل گزارشگر بدون نیاز به assignment فعال (برای مشاهدهٔ لیست/خالی)
  if (module === "reporter") {
    return roleCan("match_reporter", "reporter", action) ? { allowed: true } : { allowed: false, reason: "دسترسی به پنل گزارشگر مجاز نیست" };
  }
  const assignments = (user.scopedAssignments || []).filter((a) => a.scopeType === "match");
  const active = assignments.find(isScopedAssignmentActive);
  if (!active) {
    return { allowed: false, reason: "دسترسی زمانی فعالی برای گزارشگر مسابقه تعریف نشده است" };
  }
  if (module === "matches" && action === "edit" && context.matchId) {
    if (context.matchId !== active.scopeId) {
      return { allowed: false, reason: "دسترسی فقط به مسابقهٔ اختصاص‌داده‌شده مجاز است" };
    }
    return { allowed: true };
  }
  if (module === "news" && (action === "create" || action === "edit") && context.matchId) {
    if (context.matchId !== active.scopeId) {
      return { allowed: false, reason: "خبر فقط برای مسابقهٔ اختصاص‌داده‌شده مجاز است" };
    }
    return { allowed: true };
  }
  if (roleCan("match_reporter", module, action)) {
    if (context.matchId && context.matchId !== active.scopeId) {
      return { allowed: false, reason: "خارج از محدودهٔ مسابقهٔ اختصاص‌داده‌شده" };
    }
    return { allowed: true };
  }
  return { allowed: false, reason: "این عملیات برای گزارشگر مسابقه مجاز نیست" };
}

/** Journalist: time-based + scope (assigned match or news). Cannot act outside scope. */
export function canJournalistPerform(
  user: AdminUserRBAC,
  module: ModuleKey,
  action: ActionKey,
  context: { matchId?: string; newsId?: string }
): PermissionResult {
  if (user.role !== "journalist") {
    return { allowed: false, reason: "نقش خبرنگار نیست" };
  }
  const assignments = user.scopedAssignments || [];
  const active = assignments.find(isScopedAssignmentActive);
  if (!active) {
    return { allowed: false, reason: "دسترسی زمانی فعالی برای خبرنگار تعریف نشده است" };
  }
  if (module === "news" && (action === "create" || action === "edit" || action === "read")) {
    if (active.scopeType === "news" && context.newsId && context.newsId !== active.scopeId) {
      return { allowed: false, reason: "دسترسی فقط به خبر اختصاص‌داده‌شده مجاز است" };
    }
    if (active.scopeType === "match" && context.matchId && context.matchId !== active.scopeId) {
      return { allowed: false, reason: "دسترسی فقط به مسابقهٔ اختصاص‌داده‌شده مجاز است" };
    }
  }
  if (module === "matches" && (action === "read" || action === "edit")) {
    if (active.scopeType === "match" && context.matchId && context.matchId !== active.scopeId) {
      return { allowed: false, reason: "دسترسی فقط به مسابقهٔ اختصاص‌داده‌شده مجاز است" };
    }
  }
  if (!roleCan("journalist", module, action)) {
    return { allowed: false, reason: "این عملیات برای خبرنگار مجاز نیست" };
  }
  return { allowed: true };
}

/** Main permission check: role + scope + time. */
export function can(
  user: AdminUserRBAC | null,
  module: ModuleKey,
  action: ActionKey,
  context?: { matchId?: string; newsId?: string }
): PermissionResult {
  if (!user || !user.isActive) {
    return { allowed: false, reason: "کاربر معتبر نیست" };
  }
  if (user.role === "super_admin") {
    return { allowed: true };
  }
  if (user.role === "match_reporter") {
    return canMatchReporterPerform(user, module, action, context || {});
  }
  if (user.role === "journalist") {
    return canJournalistPerform(user, module, action, context || {});
  }
  if (roleCan(user.role, module, action)) {
    return { allowed: true };
  }
  return { allowed: false, reason: "دسترسی غیرمجاز" };
}

/** Get list of module paths the user is allowed to read (for nav). */
export function getAllowedNavModules(user: AdminUserRBAC | null): ModuleKey[] {
  if (!user || !user.isActive) return [];
  return (Object.keys(MODULE_TO_PATH) as ModuleKey[]).filter((m) =>
    can(user, m, "read").allowed
  );
}
