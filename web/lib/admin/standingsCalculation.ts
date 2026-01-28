import { Match, SportType } from "@/types/matches";
import { StandingRow } from "./standingsData";

// Points system configuration per sport
export interface PointsConfig {
  win: number;
  draw: number;
  loss: number;
}

// Default points systems (can be overridden per competition)
export const DEFAULT_POINTS_CONFIG: Record<SportType, PointsConfig> = {
  futsal: {
    win: 3,
    draw: 1,
    loss: 0,
  },
  "beach-soccer": {
    win: 3,
    draw: 1,
    loss: 0,
  },
};

// Calculate standings from matches
export interface CalculatedStanding {
  teamId: string | undefined;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: string[]; // Last 5 matches: 'W', 'D', 'L'
}

export function calculateStandingsFromMatches(
  matches: Match[],
  pointsConfig: PointsConfig = DEFAULT_POINTS_CONFIG.futsal
): Map<string, CalculatedStanding> {
  const standings = new Map<string, CalculatedStanding>();

  // Process each finished match
  const finishedMatches = matches
    .filter((m) => m.status === "finished" && m.homeScore !== null && m.awayScore !== null)
    .sort((a, b) => {
      // Sort by date (most recent first for form calculation)
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });

  finishedMatches.forEach((match) => {
    const homeScore = match.homeScore!;
    const awayScore = match.awayScore!;

    // Initialize or get home team standing
    const homeTeamKey = match.homeTeamId || match.homeTeam;
    if (!standings.has(homeTeamKey)) {
      standings.set(homeTeamKey, {
        teamId: match.homeTeamId,
        team: match.homeTeam,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
        form: [],
      });
    }

    // Initialize or get away team standing
    const awayTeamKey = match.awayTeamId || match.awayTeam;
    if (!standings.has(awayTeamKey)) {
      standings.set(awayTeamKey, {
        teamId: match.awayTeamId,
        team: match.awayTeam,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
        form: [],
      });
    }

    const homeStanding = standings.get(homeTeamKey)!;
    const awayStanding = standings.get(awayTeamKey)!;

    // Update home team
    homeStanding.played++;
    homeStanding.goalsFor += homeScore;
    homeStanding.goalsAgainst += awayScore;
    homeStanding.goalDifference = homeStanding.goalsFor - homeStanding.goalsAgainst;

    // Update away team
    awayStanding.played++;
    awayStanding.goalsFor += awayScore;
    awayStanding.goalsAgainst += homeScore;
    awayStanding.goalDifference = awayStanding.goalsFor - awayStanding.goalsAgainst;

    // Determine result
    if (homeScore > awayScore) {
      homeStanding.won++;
      homeStanding.points += pointsConfig.win;
      homeStanding.form.unshift("W");
      awayStanding.lost++;
      awayStanding.form.unshift("L");
    } else if (awayScore > homeScore) {
      awayStanding.won++;
      awayStanding.points += pointsConfig.win;
      awayStanding.form.unshift("W");
      homeStanding.lost++;
      homeStanding.form.unshift("L");
    } else {
      homeStanding.drawn++;
      homeStanding.points += pointsConfig.draw;
      homeStanding.form.unshift("D");
      awayStanding.drawn++;
      awayStanding.points += pointsConfig.draw;
      awayStanding.form.unshift("D");
    }

    // Keep only last 5 matches in form
    if (homeStanding.form.length > 5) {
      homeStanding.form = homeStanding.form.slice(0, 5);
    }
    if (awayStanding.form.length > 5) {
      awayStanding.form = awayStanding.form.slice(0, 5);
    }
  });

  return standings;
}

// Sort standings by standard rules: points, goal difference, goals for
export function sortStandings(standings: CalculatedStanding[]): CalculatedStanding[] {
  return [...standings].sort((a, b) => {
    // First by points
    if (b.points !== a.points) {
      return b.points - a.points;
    }
    // Then by goal difference
    if (b.goalDifference !== a.goalDifference) {
      return b.goalDifference - a.goalDifference;
    }
    // Then by goals for
    if (b.goalsFor !== a.goalsFor) {
      return b.goalsFor - a.goalsFor;
    }
    // Finally by team name (alphabetical)
    return a.team.localeCompare(b.team);
  });
}

// Get zone indicators
export function getZoneIndicator(
  position: number,
  totalTeams: number,
  promotionZones?: number,
  relegationZones?: number
): "champion" | "promotion" | "relegation" | "normal" {
  if (position === 1) {
    return "champion";
  }
  if (promotionZones && position <= promotionZones && position > 1) {
    return "promotion";
  }
  if (relegationZones && position > totalTeams - relegationZones) {
    return "relegation";
  }
  return "normal";
}
