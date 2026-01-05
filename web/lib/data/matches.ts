import type { LeagueKey } from "../data";

export type MatchStatus = "live" | "finished" | "upcoming";

export type MatchStatusFilter = "all" | "live" | "finished" | "upcoming";

export type CompetitionType = "league" | "cup" | "international" | "friendly" | "women" | "youth" | "other" | "womens-league" | "world-cup";

export type Competition = {
  id: string;
  title: string;
  type: CompetitionType;
  sport: LeagueKey;
  seasonLabel?: string;
  region?: string;
  isLeague?: boolean;
};

export type MatchItem = {
  id: string;
  sport: LeagueKey;
  competition: string;
  competitionId?: string;
  competitionTitle?: string;
  competitionType: CompetitionType;
  season: string;
  week: string;
  weekNumber?: number; // ONLY for league competitions
  roundLabel?: string; // For cups: "مرحله یک‌هشتم", etc.
  dateISO: string;
  datePersian: string;
  time: string;
  homeTeam: {
    name: string;
    logo?: string;
  };
  awayTeam: {
    name: string;
    logo?: string;
  };
  status: MatchStatus;
  score?: {
    home: number;
    away: number;
  };
  liveMinute?: number;
  venue: string;
};

// Mock matches data
export const mockMatches: MatchItem[] = [
  // Today - Futsal
  {
    id: "futsal-today-1",
    sport: "futsal",
    competition: "لیگ برتر فوتسال",
    competitionId: "futsal-league-1403",
    competitionTitle: "لیگ برتر فوتسال",
    competitionType: "league",
    season: "1403",
    week: "1",
    weekNumber: 1,
    dateISO: new Date().toISOString().split("T")[0],
    datePersian: "امروز",
    time: "۱۹:۳۰",
    homeTeam: { name: "گیتی‌پسند" },
    awayTeam: { name: "مس سونگون" },
    status: "live",
    score: { home: 2, away: 1 },
    liveMinute: 45,
    venue: "سالن پیروزی",
  },
  {
    id: "futsal-today-2",
    sport: "futsal",
    competition: "لیگ برتر فوتسال",
    competitionId: "futsal-league-1403",
    competitionTitle: "لیگ برتر فوتسال",
    competitionType: "league",
    season: "1403",
    week: "1",
    weekNumber: 1,
    dateISO: new Date().toISOString().split("T")[0],
    datePersian: "امروز",
    time: "۲۱:۰۰",
    homeTeam: { name: "پالایش نفت شازند" },
    awayTeam: { name: "سن‌ایچ ساوه" },
    status: "upcoming",
    venue: "سالن انقلاب",
  },
  // Today - Beach
  {
    id: "beach-today-1",
    sport: "beach",
    competition: "لیگ فوتبال ساحلی",
    competitionId: "beach-league-1403",
    competitionTitle: "لیگ فوتبال ساحلی",
    competitionType: "league",
    season: "1403",
    week: "1",
    weekNumber: 1,
    dateISO: new Date().toISOString().split("T")[0],
    datePersian: "امروز",
    time: "۱۸:۰۰",
    homeTeam: { name: "پارس جنوبی" },
    awayTeam: { name: "ملوان" },
    status: "finished",
    score: { home: 5, away: 4 },
    venue: "ساحل نقره‌ای",
  },
  // Tomorrow - Futsal
  {
    id: "futsal-tomorrow-1",
    sport: "futsal",
    competition: "لیگ برتر فوتسال",
    competitionId: "futsal-league-1403",
    competitionTitle: "لیگ برتر فوتسال",
    competitionType: "league",
    season: "1403",
    week: "1",
    weekNumber: 1,
    dateISO: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    datePersian: "فردا",
    time: "۲۰:۰۰",
    homeTeam: { name: "فرش آرا" },
    awayTeam: { name: "کراپ الوند" },
    status: "upcoming",
    venue: "سالن شهید بهشتی",
  },
  {
    id: "futsal-tomorrow-2",
    sport: "futsal",
    competition: "لیگ برتر فوتسال",
    competitionId: "futsal-league-1403",
    competitionTitle: "لیگ برتر فوتسال",
    competitionType: "league",
    season: "1403",
    week: "1",
    weekNumber: 1,
    dateISO: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    datePersian: "فردا",
    time: "۲۱:۳۰",
    homeTeam: { name: "ملی حفاری" },
    awayTeam: { name: "ذوب آهن" },
    status: "upcoming",
    venue: "سالن آزادی",
  },
  // This Week - Beach
  {
    id: "beach-week-1",
    sport: "beach",
    competition: "لیگ فوتبال ساحلی",
    competitionId: "beach-league-1403",
    competitionTitle: "لیگ فوتبال ساحلی",
    competitionType: "league",
    season: "1403",
    week: "1",
    weekNumber: 1,
    dateISO: new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0],
    datePersian: "پس‌فردا",
    time: "۱۷:۰۰",
    homeTeam: { name: "ایفا" },
    awayTeam: { name: "شاهین خزر" },
    status: "upcoming",
    venue: "ساحل المپیک",
  },
  {
    id: "beach-week-2",
    sport: "beach",
    competition: "لیگ فوتبال ساحلی",
    competitionId: "beach-league-1403",
    competitionTitle: "لیگ فوتبال ساحلی",
    competitionType: "league",
    season: "1403",
    week: "1",
    weekNumber: 1,
    dateISO: new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0],
    datePersian: "چهارشنبه",
    time: "۱۸:۳۰",
    homeTeam: { name: "شهرداری بندرعباس" },
    awayTeam: { name: "آریا بوشهر" },
    status: "upcoming",
    venue: "ساحل مرجان",
  },
  // Cup matches
  {
    id: "futsal-cup-1",
    sport: "futsal",
    competition: "جام حذفی فوتسال",
    competitionId: "futsal-cup-1403",
    competitionTitle: "جام حذفی فوتسال",
    competitionType: "cup",
    season: "1403",
    week: "all",
    roundLabel: "مرحله یک‌هشتم",
    dateISO: new Date(Date.now() + 4 * 86400000).toISOString().split("T")[0],
    datePersian: "پنج‌شنبه",
    time: "۱۹:۰۰",
    homeTeam: { name: "گیتی‌پسند" },
    awayTeam: { name: "مس سونگون" },
    status: "upcoming",
    venue: "سالن آزادی",
  },
  // International matches
  {
    id: "futsal-intl-1",
    sport: "futsal",
    competition: "مسابقات بین‌المللی",
    competitionId: "futsal-intl-2024",
    competitionTitle: "مسابقات بین‌المللی",
    competitionType: "international",
    season: "1403",
    week: "all",
    dateISO: new Date(Date.now() + 5 * 86400000).toISOString().split("T")[0],
    datePersian: "جمعه",
    time: "۲۰:۳۰",
    homeTeam: { name: "ایران" },
    awayTeam: { name: "ژاپن" },
    status: "upcoming",
    venue: "سالن آزادی",
  },
  // Finished matches
  {
    id: "futsal-finished-1",
    sport: "futsal",
    competition: "لیگ برتر فوتسال",
    competitionId: "futsal-league-1403",
    competitionTitle: "لیگ برتر فوتسال",
    competitionType: "league",
    season: "1403",
    week: "1",
    weekNumber: 1,
    dateISO: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    datePersian: "دیروز",
    time: "۱۹:۰۰",
    homeTeam: { name: "مس سونگون" },
    awayTeam: { name: "پالایش نفت شازند" },
    status: "finished",
    score: { home: 4, away: 2 },
    venue: "سالن پیروزی",
  },
  {
    id: "beach-finished-1",
    sport: "beach",
    competition: "لیگ فوتبال ساحلی",
    competitionId: "beach-league-1403",
    competitionTitle: "لیگ فوتبال ساحلی",
    competitionType: "league",
    season: "1403",
    week: "1",
    weekNumber: 1,
    dateISO: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    datePersian: "دیروز",
    time: "۱۶:۳۰",
    homeTeam: { name: "ملوان" },
    awayTeam: { name: "پارس جنوبی" },
    status: "finished",
    score: { home: 3, away: 5 },
    venue: "ساحل نقره‌ای",
  },
];

export type TimeRange = "all" | "today" | "tomorrow" | "this-week";

export const timeRangeOptions = [
  { id: "all" as TimeRange, label: "همه" },
  { id: "today" as TimeRange, label: "امروز" },
  { id: "tomorrow" as TimeRange, label: "فردا" },
  { id: "this-week" as TimeRange, label: "این هفته" },
];

export const statusOptions = [
  { id: "all" as const, label: "همه" },
  { id: "live" as const, label: "زنده" },
  { id: "finished" as const, label: "تمام‌شده" },
  { id: "upcoming" as const, label: "در انتظار" },
];

// Competitions list
export const competitions: Competition[] = [
  {
    id: "futsal-league-1403",
    title: "لیگ برتر فوتسال",
    type: "league",
    sport: "futsal",
    seasonLabel: "فصل ۱۴۰۳",
    isLeague: true,
  },
  {
    id: "beach-league-1403",
    title: "لیگ فوتبال ساحلی",
    type: "league",
    sport: "beach",
    seasonLabel: "فصل ۱۴۰۳",
    isLeague: true,
  },
  {
    id: "futsal-cup-1403",
    title: "جام حذفی فوتسال",
    type: "cup",
    sport: "futsal",
    seasonLabel: "فصل ۱۴۰۳",
  },
  {
    id: "futsal-intl-2024",
    title: "مسابقات بین‌المللی",
    type: "international",
    sport: "futsal",
  },
];

