import type { PlayerWithStats } from "@/lib/data/players";
import type { LeagueKey } from "@/lib/data";
import type { CompetitionType } from "@/lib/data/matches";

export type PlayerFilters = {
  sport?: LeagueKey;
  season?: string;
  competitionType?: CompetitionType | "all";
  teamId?: string;
  position?: "goalkeeper" | "player" | "all";
};

export function filterPlayers(players: PlayerWithStats[], filters: PlayerFilters): PlayerWithStats[] {
  let filtered = [...players];

  if (filters.sport) {
    filtered = filtered.filter((p) => p.sport === filters.sport);
  }

  if (filters.season) {
    filtered = filtered.filter((p) => p.stats.season === filters.season);
  }

  if (filters.competitionType && filters.competitionType !== "all") {
    filtered = filtered.filter((p) => p.stats.competitionType === filters.competitionType);
  }

  if (filters.teamId) {
    filtered = filtered.filter((p) => p.team.id === filters.teamId);
  }

  if (filters.position && filters.position !== "all") {
    filtered = filtered.filter((p) => p.position === filters.position);
  }

  return filtered;
}

