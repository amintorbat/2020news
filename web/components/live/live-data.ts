export type MatchStatus = "live" | "ongoing" | "finished";

export type LiveMatch = {
  id: number;
  sport: "futsal" | "beach";
  league: string;
  home: string;
  away: string;
  homeScore: number;
  awayScore: number;
  minute: string;
  status: MatchStatus;
};

export const liveMatches: LiveMatch[] = [
  {
    id: 1,
    sport: "futsal",
    league: "لیگ برتر فوتسال",
    home: "مس سونگون",
    away: "فرش آرا مشهد",
    homeScore: 3,
    awayScore: 2,
    minute: "۳۴'",
    status: "live",
  },
  {
    id: 2,
    sport: "beach",
    league: "جام حذفی",
    home: "سایپا",
    away: "گلساپوش",
    homeScore: 2,
    awayScore: 2,
    minute: "در جریان",
    status: "ongoing",
  },
  {
    id: 3,
    sport: "futsal",
    league: "لیگ برتر فوتسال",
    home: "گیتی‌پسند",
    away: "سن‌ایچ",
    homeScore: 4,
    awayScore: 1,
    minute: "پایان",
    status: "finished",
  },
];
