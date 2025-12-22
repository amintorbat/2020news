export type LeagueRow = {
  rank: number;
  team: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  points: number;
};

export const leagueTables: Record<"futsal" | "beach", LeagueRow[]> = {
  futsal: [
    { rank: 1, team: "گیتی‌پسند", played: 18, wins: 14, draws: 2, losses: 2, points: 44 },
    { rank: 2, team: "مس سونگون", played: 18, wins: 13, draws: 3, losses: 2, points: 42 },
    { rank: 3, team: "—", played: 18, wins: 11, draws: 3, losses: 4, points: 36 },
    { rank: 4, team: "سن‌ایچ ساوه", played: 18, wins: 10, draws: 5, losses: 3, points: 35 },
    { rank: 5, team: "فرش آرا", played: 18, wins: 8, draws: 5, losses: 5, points: 29 },
  ],
  beach: [
    { rank: 1, team: "پارس جنوبی", played: 16, wins: 12, draws: 1, losses: 3, points: 37 },
    { rank: 2, team: "ملوان بوشهر", played: 16, wins: 11, draws: 2, losses: 3, points: 35 },
    { rank: 3, team: "ایفا اردکان", played: 16, wins: 10, draws: 1, losses: 5, points: 31 },
    { rank: 4, team: "گلساپوش", played: 16, wins: 8, draws: 3, losses: 5, points: 27 },
    { rank: 5, team: "شاهین خزر", played: 16, wins: 7, draws: 2, losses: 7, points: 23 },
  ],
};

export const tableSeasons = [
  { id: "1403", label: "فصل ۱۴۰۳" },
  { id: "1402", label: "فصل ۱۴۰۲" },
];

export const tableWeeks = [
  { id: "1", label: "هفته ۱" },
  { id: "2", label: "هفته ۲" },
  { id: "3", label: "هفته ۳" },
];
