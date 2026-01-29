import type { MatchReporterAssignment } from "@/types/reporter";
import { isReporterAssignmentActive } from "@/types/reporter";

/**
 * Permission check results
 */
export interface PermissionCheck {
  allowed: boolean;
  reason?: string;
}

/**
 * Check if user has access to a specific match as reporter
 */
export function canAccessMatch(
  userId: string,
  matchId: string,
  assignment: MatchReporterAssignment | undefined
): PermissionCheck {
  if (!assignment) {
    return {
      allowed: false,
      reason: "هیچ دسترسی گزارشگری برای این مسابقه تعریف نشده است",
    };
  }

  if (assignment.userId !== userId) {
    return {
      allowed: false,
      reason: "این مسابقه به شما اختصاص داده نشده است",
    };
  }

  if (assignment.matchId !== matchId) {
    return {
      allowed: false,
      reason: "دسترسی به این مسابقه مجاز نیست",
    };
  }

  if (!isReporterAssignmentActive(assignment)) {
    return {
      allowed: false,
      reason: "دسترسی شما منقضی شده یا هنوز فعال نشده است",
    };
  }

  return { allowed: true };
}

/**
 * Check if reporter can edit match events
 */
export function canEditMatchEvents(
  userId: string,
  matchId: string,
  assignment: MatchReporterAssignment | undefined
): PermissionCheck {
  const accessCheck = canAccessMatch(userId, matchId, assignment);
  if (!accessCheck.allowed) {
    return accessCheck;
  }

  // Reporters can always edit events for their assigned match
  return { allowed: true };
}

/**
 * Check if reporter can create news for match
 */
export function canCreateMatchNews(
  userId: string,
  matchId: string,
  assignment: MatchReporterAssignment | undefined
): PermissionCheck {
  const accessCheck = canAccessMatch(userId, matchId, assignment);
  if (!accessCheck.allowed) {
    return accessCheck;
  }

  // Reporters can create news for their assigned match
  return { allowed: true };
}

/**
 * Check if user can access admin routes (should be blocked for reporters)
 */
export function canAccessAdminRoute(userId: string, path: string): PermissionCheck {
  // This would check user role from user data
  // For now, we'll assume reporters can only access their dashboard
  const reporterPaths = ["/admin/reporter", "/admin/reporter/match"];
  
  if (reporterPaths.some((p) => path.startsWith(p))) {
    return { allowed: true };
  }

  // Reporters should not access other admin routes
  return {
    allowed: false,
    reason: "دسترسی به این بخش برای گزارشگران مجاز نیست",
  };
}
