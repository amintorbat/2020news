import { Match, SportType } from "@/types/matches";

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
  /** For tiebreaker: total card points (yellow=1, red=2, blue=1). Lower is better. */
  fairPlayPoints?: number;
  /** Admin override: final rank (1-based). When set, used for ordering. */
  manualRank?: number;
  /** Admin override: note/reason for manual change. */
  manualNote?: string;
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

/** Card weight for fair play (lower = better). */
const CARD_WEIGHT: Record<string, number> = {
  "yellow-card": 1,
  "red-card": 2,
  "blue-card": 1,
};

/** Compute fair play points (total card weight) per team from finished matches. */
export function computeFairPlayFromMatches(matches: Match[]): Map<string, number> {
  const map = new Map<string, number>();
  const finished = matches.filter(
    (m) => m.status === "finished" && m.events && m.events.length > 0
  );
  finished.forEach((match) => {
    const homeKey = match.homeTeamId || match.homeTeam;
    const awayKey = match.awayTeamId || match.awayTeam;
    match.events.forEach((ev) => {
      const w = CARD_WEIGHT[ev.type as string] ?? 0;
      if (w === 0) return;
      const key = ev.team === "home" ? homeKey : awayKey;
      map.set(key, (map.get(key) ?? 0) + w);
    });
  });
  return map;
}

/** Head-to-head stats between two teams (only matches involving both). */
function getH2H(
  teamAKey: string,
  teamBKey: string,
  matches: Match[],
  pointsConfig: PointsConfig
): { pointsA: number; pointsB: number; gdA: number; gdB: number; gfA: number; gfB: number } {
  let pointsA = 0,
    pointsB = 0,
    gfA = 0,
    gfB = 0;
  const relevant = matches.filter(
    (m) =>
      m.status === "finished" &&
      m.homeScore != null &&
      m.awayScore != null &&
      ((m.homeTeamId || m.homeTeam) === teamAKey && (m.awayTeamId || m.awayTeam) === teamBKey) ||
      ((m.homeTeamId || m.homeTeam) === teamBKey && (m.awayTeamId || m.awayTeam) === teamAKey)
  );
  relevant.forEach((m) => {
    const homeKey = m.homeTeamId || m.homeTeam;
    const awayKey = m.awayTeamId || m.awayTeam;
    const h = m.homeScore!;
    const a = m.awayScore!;
    if (homeKey === teamAKey && awayKey === teamBKey) {
      gfA += h;
      gfB += a;
      if (h > a) pointsA += pointsConfig.win;
      else if (a > h) pointsB += pointsConfig.win;
      else {
        pointsA += pointsConfig.draw;
        pointsB += pointsConfig.draw;
      }
    } else {
      gfB += h;
      gfA += a;
      if (a > h) pointsA += pointsConfig.win;
      else if (h > a) pointsB += pointsConfig.win;
      else {
        pointsA += pointsConfig.draw;
        pointsB += pointsConfig.draw;
      }
    }
  });
  return { pointsA, pointsB, gdA: gfA - gfB, gdB: gfB - gfA, gfA, gfB };
}

// Sort standings by standard rules: points, goal difference, goals for
export function sortStandings(standings: CalculatedStanding[]): CalculatedStanding[] {
  return [...standings].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return a.team.localeCompare(b.team);
  });
}

/**
 * Official tiebreaker order: 1) Points 2) GD 3) GF 4) H2H points 5) H2H GD 6) H2H GF 7) Fair play (cards) 8) Manual/name.
 * Pass finished matches and pointsConfig for H2H and fair play. Optionally pass fairPlayMap precomputed.
 */
export function sortStandingsOfficial(
  standings: CalculatedStanding[],
  opts: {
    matches: Match[];
    pointsConfig: PointsConfig;
    fairPlayMap?: Map<string, number>;
  }
): CalculatedStanding[] {
  const { matches, pointsConfig, fairPlayMap } = opts;
  const fairPlay = fairPlayMap ?? computeFairPlayFromMatches(matches);
  const list = standings.map((s) => {
    const key = s.teamId || s.team;
    return { ...s, fairPlayPoints: fairPlay.get(key) ?? 0 };
  });

  return [...list].sort((a, b) => {
    // 8. Manual rank override (admin decision)
    if (a.manualRank != null && b.manualRank != null) return a.manualRank - b.manualRank;
    if (a.manualRank != null) return -1;
    if (b.manualRank != null) return 1;

    // 1. Points
    if (b.points !== a.points) return b.points - a.points;
    // 2. Goal difference
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    // 3. Goals for
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;

    // 4–6. Head-to-head (only between these two)
    const keyA = a.teamId || a.team;
    const keyB = b.teamId || b.team;
    const h2h = getH2H(keyA, keyB, matches, pointsConfig);
    if (h2h.pointsA !== h2h.pointsB) return h2h.pointsB - h2h.pointsA;
    if (h2h.gdA !== h2h.gdB) return h2h.gdB - h2h.gdA;
    if (h2h.gfA !== h2h.gfB) return h2h.gfB - h2h.gfA;

    // 7. Fair play (fewer cards = better)
    const fpA = a.fairPlayPoints ?? 0;
    const fpB = b.fairPlayPoints ?? 0;
    if (fpA !== fpB) return fpA - fpB;

    // 8. Team name
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
