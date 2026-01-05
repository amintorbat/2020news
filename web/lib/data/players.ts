import type { LeagueKey } from "../data";
import type { CompetitionType } from "./matches";

export type PlayerPosition = "goalkeeper" | "player";

export type Player = {
  id: string;
  name: string;
  photoUrl: string;
  team: {
    id: string;
    name: string;
    logoUrl?: string;
  };
  sport: LeagueKey;
  position: PlayerPosition;
};

export type PlayerStats = {
  playerId: string;
  season: string;
  competitionType: CompetitionType;
  goals: number;
  shots: number;
  shotsOnTarget: number;
  minutesPlayed: number;
  yellowCards: number;
  redCards: number;
  cleanSheets: number;
  goalsConceded: number;
};

export type PlayerWithStats = Player & {
  stats: PlayerStats;
};

export const mockPlayers: Player[] = [
  {
    id: "p1",
    name: "مهدی جاوید",
    photoUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=200&h=200&fit=crop&q=80",
    team: { id: "t1", name: "گیتی‌پسند", logoUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop&q=80" },
    sport: "futsal",
    position: "player",
  },
  {
    id: "p2",
    name: "قدرت بهادری",
    photoUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=200&h=200&fit=crop&q=80",
    team: { id: "t2", name: "مس سونگون", logoUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop&q=80" },
    sport: "futsal",
    position: "player",
  },
  {
    id: "p3",
    name: "حمید احمدی",
    photoUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=200&h=200&fit=crop&q=80",
    team: { id: "t3", name: "پالایش نفت شازند", logoUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop&q=80" },
    sport: "futsal",
    position: "player",
  },
  {
    id: "p4",
    name: "علیرضا جوان",
    photoUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=200&h=200&fit=crop&q=80",
    team: { id: "t4", name: "سن‌ایچ ساوه", logoUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop&q=80" },
    sport: "futsal",
    position: "player",
  },
  {
    id: "p5",
    name: "علی کیانی‌زادگان",
    photoUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=200&h=200&fit=crop&q=80",
    team: { id: "t5", name: "ملی حفاری", logoUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop&q=80" },
    sport: "futsal",
    position: "player",
  },
  {
    id: "p6",
    name: "محمد احمدزاده",
    photoUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=200&h=200&fit=crop&q=80",
    team: { id: "t6", name: "پارس جنوبی", logoUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop&q=80" },
    sport: "beach",
    position: "player",
  },
  {
    id: "p7",
    name: "علی نادری",
    photoUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=200&h=200&fit=crop&q=80",
    team: { id: "t7", name: "ملوان بوشهر", logoUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop&q=80" },
    sport: "beach",
    position: "player",
  },
  {
    id: "p8",
    name: "حمیدرضا مختاری",
    photoUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=200&h=200&fit=crop&q=80",
    team: { id: "t8", name: "شاهین خزر", logoUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop&q=80" },
    sport: "beach",
    position: "player",
  },
  {
    id: "p9",
    name: "مهدی زینالی",
    photoUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=200&h=200&fit=crop&q=80",
    team: { id: "t9", name: "ایفا اردکان", logoUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop&q=80" },
    sport: "beach",
    position: "player",
  },
  {
    id: "p10",
    name: "سعید پیرامون",
    photoUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=200&h=200&fit=crop&q=80",
    team: { id: "t10", name: "تکاوران", logoUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop&q=80" },
    sport: "beach",
    position: "player",
  },
  {
    id: "gk1",
    name: "رضا رضایی",
    photoUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=200&h=200&fit=crop&q=80",
    team: { id: "t1", name: "گیتی‌پسند", logoUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop&q=80" },
    sport: "futsal",
    position: "goalkeeper",
  },
  {
    id: "gk2",
    name: "امیرحسین رضایی",
    photoUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=200&h=200&fit=crop&q=80",
    team: { id: "t6", name: "پارس جنوبی", logoUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop&q=80" },
    sport: "beach",
    position: "goalkeeper",
  },
];

export const mockPlayerStats: PlayerStats[] = [
  { playerId: "p1", season: "1403", competitionType: "league", goals: 32, shots: 85, shotsOnTarget: 58, minutesPlayed: 1620, yellowCards: 2, redCards: 0, cleanSheets: 0, goalsConceded: 0 },
  { playerId: "p2", season: "1403", competitionType: "league", goals: 28, shots: 72, shotsOnTarget: 49, minutesPlayed: 1580, yellowCards: 1, redCards: 0, cleanSheets: 0, goalsConceded: 0 },
  { playerId: "p3", season: "1403", competitionType: "league", goals: 24, shots: 68, shotsOnTarget: 45, minutesPlayed: 1540, yellowCards: 3, redCards: 0, cleanSheets: 0, goalsConceded: 0 },
  { playerId: "p4", season: "1403", competitionType: "league", goals: 21, shots: 61, shotsOnTarget: 42, minutesPlayed: 1500, yellowCards: 2, redCards: 0, cleanSheets: 0, goalsConceded: 0 },
  { playerId: "p5", season: "1403", competitionType: "league", goals: 19, shots: 55, shotsOnTarget: 38, minutesPlayed: 1480, yellowCards: 1, redCards: 0, cleanSheets: 0, goalsConceded: 0 },
  { playerId: "p6", season: "1403", competitionType: "league", goals: 27, shots: 78, shotsOnTarget: 52, minutesPlayed: 1600, yellowCards: 2, redCards: 0, cleanSheets: 0, goalsConceded: 0 },
  { playerId: "p7", season: "1403", competitionType: "league", goals: 25, shots: 70, shotsOnTarget: 48, minutesPlayed: 1590, yellowCards: 1, redCards: 0, cleanSheets: 0, goalsConceded: 0 },
  { playerId: "p8", season: "1403", competitionType: "league", goals: 22, shots: 65, shotsOnTarget: 44, minutesPlayed: 1560, yellowCards: 3, redCards: 1, cleanSheets: 0, goalsConceded: 0 },
  { playerId: "p9", season: "1403", competitionType: "league", goals: 20, shots: 58, shotsOnTarget: 40, minutesPlayed: 1520, yellowCards: 2, redCards: 0, cleanSheets: 0, goalsConceded: 0 },
  { playerId: "p10", season: "1403", competitionType: "league", goals: 18, shots: 52, shotsOnTarget: 35, minutesPlayed: 1490, yellowCards: 1, redCards: 0, cleanSheets: 0, goalsConceded: 0 },
  { playerId: "gk1", season: "1403", competitionType: "league", goals: 0, shots: 0, shotsOnTarget: 0, minutesPlayed: 1620, yellowCards: 0, redCards: 0, cleanSheets: 12, goalsConceded: 18 },
  { playerId: "gk2", season: "1403", competitionType: "league", goals: 0, shots: 0, shotsOnTarget: 0, minutesPlayed: 1600, yellowCards: 0, redCards: 0, cleanSheets: 10, goalsConceded: 22 },
];

export function getPlayersWithStats(): PlayerWithStats[] {
  return mockPlayers.map((player) => {
    const stats = mockPlayerStats.find((s) => s.playerId === player.id);
    return {
      ...player,
      stats: stats || {
        playerId: player.id,
        season: "1403",
        competitionType: "league",
        goals: 0,
        shots: 0,
        shotsOnTarget: 0,
        minutesPlayed: 0,
        yellowCards: 0,
        redCards: 0,
        cleanSheets: 0,
        goalsConceded: 0,
      },
    };
  });
}

