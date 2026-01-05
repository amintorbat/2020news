import type { MatchItem, MatchStatusFilter, TimeRange, CompetitionType } from "@/lib/data/matches";
import type { LeagueKey } from "@/lib/data";

export type MatchFilters = {
  league?: LeagueKey;
  competitionType?: CompetitionType | "all";
  competitionId?: string;
  timeRange?: TimeRange;
  status?: MatchStatusFilter;
  season?: string;
  week?: string | "all";
  searchQuery?: string;
};

export function filterAndSortMatches(matches: MatchItem[], filters: MatchFilters): MatchItem[] {
  let filtered = [...matches];

  // Filter by sport/league
  if (filters.league) {
    filtered = filtered.filter((match) => match.sport === filters.league);
  }

  // Filter by competition type
  if (filters.competitionType && filters.competitionType !== "all") {
    filtered = filtered.filter((match) => {
      return match.competitionType === filters.competitionType;
    });
  }

  // Filter by competition ID
  if (filters.competitionId) {
    filtered = filtered.filter((match) => match.competitionId === filters.competitionId);
  }

  // Filter by time range
  if (filters.timeRange && filters.timeRange !== "all") {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() + 7);

    if (filters.timeRange === "today") {
      filtered = filtered.filter((match) => {
        const matchDate = new Date(match.dateISO);
        matchDate.setHours(0, 0, 0, 0);
        return matchDate.getTime() === today.getTime();
      });
    } else if (filters.timeRange === "tomorrow") {
      filtered = filtered.filter((match) => {
        const matchDate = new Date(match.dateISO);
        matchDate.setHours(0, 0, 0, 0);
        return matchDate.getTime() === tomorrow.getTime();
      });
    } else if (filters.timeRange === "this-week") {
      filtered = filtered.filter((match) => {
        const matchDate = new Date(match.dateISO);
        matchDate.setHours(0, 0, 0, 0);
        return matchDate.getTime() >= today.getTime() && matchDate.getTime() < weekEnd.getTime();
      });
    }
  }

  // Filter by status
  if (filters.status && filters.status !== "all") {
    filtered = filtered.filter((match) => match.status === filters.status);
  }

  // Filter by season
  if (filters.season) {
    filtered = filtered.filter((match) => match.season === filters.season);
  }

  // Filter by week (if not "all")
  if (filters.week && filters.week !== "all") {
    filtered = filtered.filter((match) => match.week === filters.week);
  }

  // Filter by search query (team name)
  if (filters.searchQuery && filters.searchQuery.trim()) {
    const query = filters.searchQuery.trim().toLowerCase();
    filtered = filtered.filter((match) => {
      return (
        match.homeTeam.name.toLowerCase().includes(query) ||
        match.awayTeam.name.toLowerCase().includes(query)
      );
    });
  }

  // Sort: live first, then by date
  filtered.sort((a, b) => {
    if (a.status === "live" && b.status !== "live") return -1;
    if (a.status !== "live" && b.status === "live") return 1;
    return new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime();
  });

  return filtered;
}

