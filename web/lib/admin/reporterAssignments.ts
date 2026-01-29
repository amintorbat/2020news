import type { MatchReporterAssignment } from "@/types/reporter";
import { getAssignmentStatus } from "@/types/reporter";

// Mock reporter assignments
export const mockReporterAssignments: MatchReporterAssignment[] = [
  {
    id: "assignment-1",
    matchId: "match-1",
    userId: "3", // احمد محمدی (reporter)
    userName: "احمد محمدی",
    userEmail: "ahmad@2020news.ir",
    startDateTime: "2024-12-15T18:00:00Z",
    endDateTime: "2024-12-15T20:00:00Z",
    enabled: true,
    status: "expired",
    createdAt: "2024-12-10T10:00:00Z",
    updatedAt: "2024-12-10T10:00:00Z",
  },
];

/**
 * Get assignments for a specific match
 */
export function getAssignmentsForMatch(matchId: string): MatchReporterAssignment[] {
  return mockReporterAssignments
    .filter((a) => a.matchId === matchId)
    .map((a) => ({
      ...a,
      status: getAssignmentStatus(a),
    }));
}

/**
 * Get active assignments for a user
 */
export function getActiveAssignmentsForUser(userId: string): MatchReporterAssignment[] {
  return mockReporterAssignments
    .filter((a) => a.userId === userId)
    .map((a) => ({
      ...a,
      status: getAssignmentStatus(a),
    }))
    .filter((a) => a.status === "active");
}

/**
 * Get assignment for user and match
 */
export function getAssignmentForUserAndMatch(
  userId: string,
  matchId: string
): MatchReporterAssignment | undefined {
  const assignment = mockReporterAssignments.find(
    (a) => a.userId === userId && a.matchId === matchId
  );
  if (!assignment) return undefined;
  
  return {
    ...assignment,
    status: getAssignmentStatus(assignment),
  };
}
