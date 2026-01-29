import type { Match, MatchEvent } from "@/types/matches";
import type { Player } from "./playersData";

export interface PlayerStatistics {
  playerId: string;
  playerName: string;
  teamId: string;
  teamName: string;
  sport: "futsal" | "beach-soccer";
  
  // Match participation
  matchesPlayed: number;
  
  // Goals and assists
  goals: number;
  assists: number;
  
  // Cards
  yellowCards: number;
  redCards: number;
  
  // Per-match averages
  goalsPerMatch: number;
  assistsPerMatch: number;
}

/**
 * Calculate player statistics from finished matches and their events
 */
export function calculatePlayerStatistics(
  matches: Match[],
  players: Player[]
): Map<string, PlayerStatistics> {
  const statsMap = new Map<string, PlayerStatistics>();

  // Process only finished matches
  const finishedMatches = matches.filter((m) => m.status === "finished");

  finishedMatches.forEach((match) => {
    // Track which players participated in this match
    const participatingPlayers = new Set<string>();

    // Process events
    match.events.forEach((event) => {
      // Process main player (goal scorer, card recipient)
      if (event.playerId && event.playerName) {
        participatingPlayers.add(event.playerId);

        let stats = statsMap.get(event.playerId);
        if (!stats) {
          const player = players.find((p) => p.id === event.playerId);
          if (!player) return; // Skip if player not found

          // Get team info from match
          const team = event.team === "home" 
            ? { id: match.homeTeamId || player.teamId, name: match.homeTeam }
            : { id: match.awayTeamId || player.teamId, name: match.awayTeam };

          stats = {
            playerId: event.playerId,
            playerName: event.playerName,
            teamId: team.id,
            teamName: team.name,
            sport: match.sport,
            matchesPlayed: 0,
            goals: 0,
            assists: 0,
            yellowCards: 0,
            redCards: 0,
            goalsPerMatch: 0,
            assistsPerMatch: 0,
          };
          statsMap.set(event.playerId, stats);
        }

        // Update stats based on event type
        switch (event.type) {
          case "goal":
            stats.goals++;
            break;
          case "yellow-card":
            stats.yellowCards++;
            break;
          case "red-card":
            stats.redCards++;
            break;
        }
      }

      // Process assist player (if exists)
      if (event.assistPlayerId && event.assistPlayerName) {
        participatingPlayers.add(event.assistPlayerId);

        let assistStats = statsMap.get(event.assistPlayerId);
        if (!assistStats) {
          const player = players.find((p) => p.id === event.assistPlayerId);
          if (!player) return;

          // Assist player is from the same team as goal scorer
          const team = event.team === "home"
            ? { id: match.homeTeamId || player.teamId, name: match.homeTeam }
            : { id: match.awayTeamId || player.teamId, name: match.awayTeam };

          assistStats = {
            playerId: event.assistPlayerId,
            playerName: event.assistPlayerName,
            teamId: team.id,
            teamName: team.name,
            sport: match.sport,
            matchesPlayed: 0,
            goals: 0,
            assists: 0,
            yellowCards: 0,
            redCards: 0,
            goalsPerMatch: 0,
            assistsPerMatch: 0,
          };
          statsMap.set(event.assistPlayerId, assistStats);
        }

        assistStats.assists++;
      }
    });

    // Increment matches played for all participating players
    participatingPlayers.forEach((playerId) => {
      const stats = statsMap.get(playerId);
      if (stats) {
        stats.matchesPlayed++;
      }
    });
  });

  // Calculate per-match averages
  statsMap.forEach((stats) => {
    if (stats.matchesPlayed > 0) {
      stats.goalsPerMatch = Number((stats.goals / stats.matchesPlayed).toFixed(2));
      stats.assistsPerMatch = Number((stats.assists / stats.matchesPlayed).toFixed(2));
    }
  });

  return statsMap;
}

/**
 * Filter player statistics by sport, league, and team
 */
export function filterPlayerStatistics(
  stats: PlayerStatistics[],
  filters: {
    sport?: "futsal" | "beach-soccer";
    leagueId?: string;
    teamId?: string;
  }
): PlayerStatistics[] {
  return stats.filter((stat) => {
    if (filters.sport && stat.sport !== filters.sport) return false;
    if (filters.teamId && stat.teamId !== filters.teamId) return false;
    // League filter would require checking match leagueId, which we don't have in stats
    // This would need to be handled at the match filtering level
    return true;
  });
}
