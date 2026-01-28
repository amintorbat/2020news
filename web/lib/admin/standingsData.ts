import { SportType } from "@/types/matches";

export interface StandingRow {
  id: string;
  team: string;
  teamId?: string;
  sport: SportType;
  competitionId: string;
  competitionName: string;
  seasonId: string;
  seasonName: string;
  position: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: string[]; // Last 5 matches: 'W', 'D', 'L'
  
  // Admin features
  isLocked: boolean; // Whether this table is locked from auto-calculation
  manualOverrides?: {
    points?: number; // Manual point adjustment
    pointsDeduction?: number; // Points deducted (penalties)
    pointsDeductionReason?: string; // Reason for deduction
    played?: number;
    won?: number;
    drawn?: number;
    lost?: number;
    goalsFor?: number;
    goalsAgainst?: number;
  };
  
  // Zone indicators
  zone?: "champion" | "promotion" | "relegation" | "normal";
}

// Table configuration per competition
export interface TableConfig {
  competitionId: string;
  seasonId: string;
  isLocked: boolean; // Lock entire table
  promotionZones?: number; // Number of promotion positions
  relegationZones?: number; // Number of relegation positions
  pointsConfig?: {
    win: number;
    draw: number;
    loss: number;
  };
}

// Mock table configurations
export const mockTableConfigs: TableConfig[] = [
  {
    competitionId: "comp-1",
    seasonId: "season-1",
    isLocked: false,
    promotionZones: 3, // Top 3 for promotion
    relegationZones: 2, // Bottom 2 for relegation
    pointsConfig: {
      win: 3,
      draw: 1,
      loss: 0,
    },
  },
  {
    competitionId: "comp-4",
    seasonId: "season-4",
    isLocked: false,
    promotionZones: 2,
    relegationZones: 1,
    pointsConfig: {
      win: 3,
      draw: 1,
      loss: 0,
    },
  },
];

// Legacy mock standings (will be replaced by calculated ones)
export const mockStandings: StandingRow[] = [
  // Futsal League
  {
    id: "stand-1",
    team: "گیتی پسند",
    teamId: "team-1",
    sport: "futsal",
    competitionId: "comp-1",
    competitionName: "لیگ برتر فوتسال",
    seasonId: "season-1",
    seasonName: "فصل ۱۴۰۳-۱۴۰۴",
    position: 1,
    played: 10,
    won: 8,
    drawn: 1,
    lost: 1,
    goalsFor: 32,
    goalsAgainst: 15,
    goalDifference: 17,
    points: 25,
    form: ["W", "W", "W", "D", "W"],
    isLocked: false,
    zone: "champion",
  },
  {
    id: "stand-2",
    team: "مس سونگون",
    teamId: "team-2",
    sport: "futsal",
    competitionId: "comp-1",
    competitionName: "لیگ برتر فوتسال",
    seasonId: "season-1",
    seasonName: "فصل ۱۴۰۳-۱۴۰۴",
    position: 2,
    played: 10,
    won: 7,
    drawn: 2,
    lost: 1,
    goalsFor: 28,
    goalsAgainst: 12,
    goalDifference: 16,
    points: 23,
    form: ["W", "W", "D", "W", "W"],
    isLocked: false,
    zone: "promotion",
  },
  {
    id: "stand-3",
    team: "پالایش نفت",
    teamId: "team-3",
    sport: "futsal",
    competitionId: "comp-1",
    competitionName: "لیگ برتر فوتسال",
    seasonId: "season-1",
    seasonName: "فصل ۱۴۰۳-۱۴۰۴",
    position: 3,
    played: 10,
    won: 6,
    drawn: 3,
    lost: 1,
    goalsFor: 25,
    goalsAgainst: 14,
    goalDifference: 11,
    points: 21,
    form: ["W", "D", "W", "D", "W"],
    isLocked: false,
    zone: "promotion",
  },
  {
    id: "stand-4",
    team: "سن‌ایچ ساوه",
    teamId: "team-4",
    sport: "futsal",
    competitionId: "comp-1",
    competitionName: "لیگ برتر فوتسال",
    seasonId: "season-1",
    seasonName: "فصل ۱۴۰۳-۱۴۰۴",
    position: 4,
    played: 10,
    won: 5,
    drawn: 2,
    lost: 3,
    goalsFor: 22,
    goalsAgainst: 18,
    goalDifference: 4,
    points: 17,
    form: ["L", "W", "D", "W", "L"],
    isLocked: false,
    zone: "normal",
  },
  {
    id: "stand-5",
    team: "ذوب آهن",
    teamId: "team-5",
    sport: "futsal",
    competitionId: "comp-1",
    competitionName: "لیگ برتر فوتسال",
    seasonId: "season-1",
    seasonName: "فصل ۱۴۰۳-۱۴۰۴",
    position: 5,
    played: 10,
    won: 4,
    drawn: 3,
    lost: 3,
    goalsFor: 20,
    goalsAgainst: 19,
    goalDifference: 1,
    points: 15,
    form: ["W", "L", "D", "D", "W"],
    isLocked: false,
    zone: "normal",
  },
  // Beach Soccer League
  {
    id: "stand-6",
    team: "تیم ملی ایران",
    teamId: "team-7",
    sport: "beach-soccer",
    competitionId: "comp-4",
    competitionName: "لیگ فوتبال ساحلی",
    seasonId: "season-4",
    seasonName: "فصل ۱۴۰۳",
    position: 1,
    played: 8,
    won: 7,
    drawn: 0,
    lost: 1,
    goalsFor: 45,
    goalsAgainst: 22,
    goalDifference: 23,
    points: 21,
    form: ["W", "W", "W", "W", "L"],
    isLocked: false,
    zone: "champion",
  },
  {
    id: "stand-7",
    team: "تیم ملی برزیل",
    teamId: "team-8",
    sport: "beach-soccer",
    competitionId: "comp-4",
    competitionName: "لیگ فوتبال ساحلی",
    seasonId: "season-4",
    seasonName: "فصل ۱۴۰۳",
    position: 2,
    played: 8,
    won: 6,
    drawn: 1,
    lost: 1,
    goalsFor: 38,
    goalsAgainst: 20,
    goalDifference: 18,
    points: 19,
    form: ["W", "W", "D", "W", "W"],
    isLocked: false,
    zone: "promotion",
  },
  {
    id: "stand-8",
    team: "تیم ملی اسپانیا",
    teamId: "team-10",
    sport: "beach-soccer",
    competitionId: "comp-4",
    competitionName: "لیگ فوتبال ساحلی",
    seasonId: "season-4",
    seasonName: "فصل ۱۴۰۳",
    position: 3,
    played: 8,
    won: 5,
    drawn: 2,
    lost: 1,
    goalsFor: 35,
    goalsAgainst: 25,
    goalDifference: 10,
    points: 17,
    form: ["W", "D", "W", "D", "W"],
    isLocked: false,
    zone: "normal",
  },
];
