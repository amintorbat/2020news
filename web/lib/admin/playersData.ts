import type { SportType } from "@/types/matches";
import type { Team } from "@/types/teams";

export type PlayerPosition = "GK" | "FIXO" | "ALA" | "PIVO";

export type PlayerStatus = "active" | "injured" | "suspended" | "inactive";

export interface Player {
  id: string;
  name: string;
  sport: SportType;
  teamId: string;
  position: PlayerPosition;
  status: PlayerStatus;
  jerseyNumber?: number;
  photo?: string;
}

// Mock players linked to teams
export const mockPlayers: Player[] = [
  // Futsal - گیتی پسند (team-1)
  {
    id: "player-1",
    name: "مهدی جاوید",
    sport: "futsal",
    teamId: "team-1",
    position: "PIVO",
    status: "active",
    jerseyNumber: 10,
  },
  {
    id: "player-2",
    name: "علی رضایی",
    sport: "futsal",
    teamId: "team-1",
    position: "ALA",
    status: "active",
    jerseyNumber: 7,
  },
  {
    id: "player-3",
    name: "احمد کریمی",
    sport: "futsal",
    teamId: "team-1",
    position: "GK",
    status: "active",
    jerseyNumber: 1,
  },
  // Futsal - مس سونگون (team-2)
  {
    id: "player-4",
    name: "قدرت بهادری",
    sport: "futsal",
    teamId: "team-2",
    position: "ALA",
    status: "active",
    jerseyNumber: 9,
  },
  {
    id: "player-5",
    name: "محمد حسینی",
    sport: "futsal",
    teamId: "team-2",
    position: "PIVO",
    status: "active",
    jerseyNumber: 11,
  },
  {
    id: "player-6",
    name: "رضا محمدی",
    sport: "futsal",
    teamId: "team-2",
    position: "GK",
    status: "active",
    jerseyNumber: 1,
  },
  // Futsal - پالایش نفت (team-3)
  {
    id: "player-7",
    name: "حسین احمدی",
    sport: "futsal",
    teamId: "team-3",
    position: "FIXO",
    status: "active",
    jerseyNumber: 5,
  },
  {
    id: "player-8",
    name: "امیر رضایی",
    sport: "futsal",
    teamId: "team-3",
    position: "PIVO",
    status: "active",
    jerseyNumber: 10,
  },
  // Beach Soccer - تیم ملی ایران (team-7)
  {
    id: "player-9",
    name: "علی رضایی",
    sport: "beach-soccer",
    teamId: "team-7",
    position: "PIVO",
    status: "active",
    jerseyNumber: 11,
  },
  {
    id: "player-10",
    name: "مهدی جاوید",
    sport: "beach-soccer",
    teamId: "team-7",
    position: "ALA",
    status: "active",
    jerseyNumber: 7,
  },
  {
    id: "player-11",
    name: "محمد کریمی",
    sport: "beach-soccer",
    teamId: "team-7",
    position: "GK",
    status: "active",
    jerseyNumber: 1,
  },
  // Beach Soccer - تیم ملی برزیل (team-8)
  {
    id: "player-12",
    name: "کارلوس سیلوا",
    sport: "beach-soccer",
    teamId: "team-8",
    position: "PIVO",
    status: "active",
    jerseyNumber: 10,
  },
  {
    id: "player-13",
    name: "خوان گارسیا",
    sport: "beach-soccer",
    teamId: "team-8",
    position: "ALA",
    status: "active",
    jerseyNumber: 9,
  },
];

// Helper to get players by team
export function getPlayersByTeam(teamId: string): Player[] {
  return mockPlayers.filter((p) => p.teamId === teamId);
}

// Helper to get players by team and sport
export function getPlayersByTeamAndSport(teamId: string, sport: SportType): Player[] {
  return mockPlayers.filter((p) => p.teamId === teamId && p.sport === sport);
}

// Helper to get player by ID
export function getPlayerById(playerId: string): Player | undefined {
  return mockPlayers.find((p) => p.id === playerId);
}
