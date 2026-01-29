/**
 * Match Reporter Assignment System
 * 
 * Reporters are assigned per match with time-limited access.
 * They can only access their assigned match and perform limited actions.
 */

export interface MatchReporterAssignment {
  id: string;
  matchId: string;
  userId: string;
  userName: string;
  userEmail: string;
  
  // Time-limited access
  startDateTime: string; // ISO datetime string
  endDateTime: string; // ISO datetime string
  
  // Manual enable/disable
  enabled: boolean;
  
  // Status (calculated)
  status: "active" | "expired" | "scheduled" | "disabled";
  
  createdAt: string;
  updatedAt: string;
}

/**
 * Check if reporter assignment is currently active
 */
export function isReporterAssignmentActive(assignment: MatchReporterAssignment): boolean {
  if (!assignment.enabled) return false;
  
  const now = new Date();
  const start = new Date(assignment.startDateTime);
  const end = new Date(assignment.endDateTime);
  
  return now >= start && now <= end;
}

/**
 * Get assignment status
 */
export function getAssignmentStatus(assignment: MatchReporterAssignment): MatchReporterAssignment["status"] {
  if (!assignment.enabled) return "disabled";
  
  const now = new Date();
  const start = new Date(assignment.startDateTime);
  const end = new Date(assignment.endDateTime);
  
  if (now < start) return "scheduled";
  if (now > end) return "expired";
  return "active";
}

/**
 * Reporter permissions context
 */
export interface ReporterContext {
  userId: string;
  matchId: string;
  assignment: MatchReporterAssignment;
  isActive: boolean;
}
