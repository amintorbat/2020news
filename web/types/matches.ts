// Sport types - Only Futsal and Beach Soccer supported
export type SportType = "futsal" | "beach-soccer";

// Competition types
export type CompetitionType = "league" | "cup" | "international" | "friendly";

// Match status
export type MatchStatus = "scheduled" | "live" | "finished" | "postponed" | "cancelled";

// Match event types - Sport-agnostic base types
export type MatchEventType = "goal" | "yellow-card" | "red-card" | "substitution" | "penalty" | "own-goal" | "blue-card" | "timeout";

// Match Event
export interface MatchEvent {
  id: string;
  type: MatchEventType;
  minute: number;
  playerId: string;
  playerName: string;
  team: "home" | "away";
  description?: string;
  assistPlayerId?: string;
  assistPlayerName?: string;
}

// Season
export interface Season {
  id: string;
  name: string;
  year: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

// Competition
export interface Competition {
  id: string;
  name: string;
  sport: SportType;
  type: CompetitionType;
  seasons: Season[];
}

// Match
export interface Match {
  id: string;
  sport: SportType;
  competitionId: string;
  competitionName: string;
  seasonId: string;
  seasonName: string;
  homeTeam: string;
  homeTeamId?: string;
  awayTeam: string;
  awayTeamId?: string;
  homeScore: number | null;
  awayScore: number | null;
  status: MatchStatus;
  date: string; // ISO date string
  time: string; // HH:MM format
  venue: string;
  referee?: string;
  attendance?: number;
  events: MatchEvent[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

// Sport Configuration - Data-driven approach for easy extension
export interface SportConfig {
  id: SportType;
  label: string;
  icon: string;
  maxPlayers: number;
  matchDuration: number; // minutes
  periods: number; // number of periods/halves
  periodDuration: number; // minutes per period
  allowedEventTypes: MatchEventType[];
  rules: {
    substitutions: {
      allowed: boolean;
      maxPerMatch?: number;
    };
    timeouts: {
      allowed: boolean;
      maxPerMatch?: number;
    };
    cards: {
      yellow: boolean;
      red: boolean;
      blue?: boolean; // Futsal specific
    };
  };
}

// Sport configurations - Easy to add new sports here
export const SPORTS: Record<SportType, SportConfig> = {
  futsal: {
    id: "futsal",
    label: "فوتسال",
    icon: "🥅",
    maxPlayers: 5,
    matchDuration: 40,
    periods: 2,
    periodDuration: 20,
    allowedEventTypes: ["goal", "yellow-card", "red-card", "blue-card", "substitution", "penalty", "own-goal", "timeout"],
    rules: {
      substitutions: {
        allowed: true,
        maxPerMatch: 7,
      },
      timeouts: {
        allowed: true,
        maxPerMatch: 1,
      },
      cards: {
        yellow: true,
        red: true,
        blue: true, // Blue card in futsal (temporary suspension)
      },
    },
  },
  "beach-soccer": {
    id: "beach-soccer",
    label: "فوتبال ساحلی",
    icon: "🏖️",
    maxPlayers: 5,
    matchDuration: 36,
    periods: 3,
    periodDuration: 12,
    allowedEventTypes: ["goal", "yellow-card", "red-card", "substitution", "penalty", "own-goal"],
    rules: {
      substitutions: {
        allowed: true,
        maxPerMatch: 5,
      },
      timeouts: {
        allowed: false,
      },
      cards: {
        yellow: true,
        red: true,
        blue: false,
      },
    },
  },
};

// Helper to get sport config
export const getSportConfig = (sport: SportType): SportConfig => {
  return SPORTS[sport];
};

// Get all available sports as array
export const getAvailableSports = (): SportConfig[] => {
  return Object.values(SPORTS);
};

// Legacy support - keeping for backward compatibility
export const SPORT_CONFIG: Record<SportType, { label: string; icon: string; maxPlayers: number }> = {
  futsal: { label: SPORTS.futsal.label, icon: SPORTS.futsal.icon, maxPlayers: SPORTS.futsal.maxPlayers },
  "beach-soccer": { label: SPORTS["beach-soccer"].label, icon: SPORTS["beach-soccer"].icon, maxPlayers: SPORTS["beach-soccer"].maxPlayers },
};

export const COMPETITION_TYPE_LABELS: Record<CompetitionType, string> = {
  league: "لیگ",
  cup: "جام",
  international: "بین‌المللی",
  friendly: "دوستانه",
};

export const MATCH_STATUS_LABELS: Record<MatchStatus, string> = {
  scheduled: "برنامه‌ریزی شده",
  live: "زنده",
  finished: "پایان یافته",
  postponed: "تعویق یافته",
  cancelled: "لغو شده",
};

export const MATCH_EVENT_TYPE_LABELS: Record<MatchEventType, string> = {
  goal: "گل",
  "yellow-card": "کارت زرد",
  "red-card": "کارت قرمز",
  "blue-card": "کارت آبی",
  substitution: "تعویض",
  penalty: "پنالتی",
  "own-goal": "گل به خودی",
  timeout: "وقفه",
};
