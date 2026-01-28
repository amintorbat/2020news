import type { SportType } from "@/types/matches";

export type LeagueStatus = "active" | "archived";

export type StandingsSortKey =
  | "points"
  | "goal-diff"
  | "goals-for"
  | "head-to-head";

export interface LeagueMatchSettings {
  numberOfTeams: number;
  homeAndAway: boolean; // رفت و برگشت
  matchesPerTeam: number;
}

export interface LeaguePointsSystem {
  winPoints: number;
  drawPoints: number;
  lossPoints: number;
}

export interface LeagueStandingsRules {
  sortPriority: StandingsSortKey[]; // ترتیب مرتب‌سازی جدول
}

export interface LeaguePromotionRelegation {
  promotedTeams: number;
  relegatedTeams: number;
}

// هسته‌ی اصلی مدل لیگ‌ها
export interface League {
  id: string;
  name: string;
  sport: SportType;
  season: string; // مثال: "۱۴۰۳-۱۴۰۴"
  status: LeagueStatus;

  matchSettings: LeagueMatchSettings;
  pointsSystem: LeaguePointsSystem;
  standingsRules: LeagueStandingsRules;
  promotionRelegation: LeaguePromotionRelegation;

  // برای آینده: اتصال گزارشگران موقت و دسترسی‌ها
  temporaryReporterIds?: string[];

  createdAt: string;
  updatedAt: string;
}
