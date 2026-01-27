import { PlayerStatRow } from "@/types/players";

export const mockPlayers: PlayerStatRow[] = [
  {
    id: 1,
    name: "محمدرضا احمدی",
    team: "گیتی‌پسند",
    avatar: "/players/ahmadi.jpg",
    goals: 12,
    yellowCards: 2,
    redCards: 0,
    cleanSheets: 0,
    goalsConceded: 0,
  },
  {
    id: 2,
    name: "علیرضا صادقی",
    team: "مس سونگون",
    avatar: "/players/sadeghi.jpg",
    goals: 0,
    yellowCards: 1,
    redCards: 0,
    cleanSheets: 6,
    goalsConceded: 5,
  },
];