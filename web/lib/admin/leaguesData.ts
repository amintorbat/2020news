import type { League } from "@/types/leagues";

// Mock leagues data - فقط فوتسال و فوتبال ساحلی
export const mockLeagues: League[] = [
  {
    id: "league-1",
    name: "لیگ برتر فوتسال ایران",
    sport: "futsal",
    season: "۱۴۰۳-۱۴۰۴",
    status: "active",
    matchSettings: {
      numberOfTeams: 14,
      homeAndAway: true,
      matchesPerTeam: 26,
    },
    pointsSystem: {
      winPoints: 3,
      drawPoints: 1,
      lossPoints: 0,
    },
    standingsRules: {
      sortPriority: ["points", "goal-diff", "goals-for", "head-to-head"],
    },
    promotionRelegation: {
      promotedTeams: 0,
      relegatedTeams: 2,
    },
    temporaryReporterIds: [],
    createdAt: "1403-01-01T10:00:00",
    updatedAt: "1403-07-01T10:00:00",
  },
  {
    id: "league-2",
    name: "لیگ برتر فوتبال ساحلی ایران",
    sport: "beach-soccer",
    season: "۱۴۰۳",
    status: "active",
    matchSettings: {
      numberOfTeams: 10,
      homeAndAway: true,
      matchesPerTeam: 18,
    },
    pointsSystem: {
      winPoints: 3,
      drawPoints: 1,
      lossPoints: 0,
    },
    standingsRules: {
      sortPriority: ["points", "goal-diff", "goals-for", "head-to-head"],
    },
    promotionRelegation: {
      promotedTeams: 0,
      relegatedTeams: 1,
    },
    temporaryReporterIds: [],
    createdAt: "1403-01-01T10:00:00",
    updatedAt: "1403-06-15T10:00:00",
  },
];