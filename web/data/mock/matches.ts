export type LiveMatch = {
  id: string;
  league: string;
  status: "زنده" | "پایان یافته" | "در انتظار";
  time: string;
  home: { name: string; score: number };
  away: { name: string; score: number };
};

export type WeeklyMatch = {
  id: string;
  title: string;
  venue: string;
  date: string;
  time: string;
  note: string;
};

export type MatchResult = {
  id: string;
  type: "futsal" | "beach";
  opponent: string;
  venue: string;
  date: string;
  status: "live" | "finished" | "upcoming";
  season: string;
  week: string;
  score?: string;
};

export const liveMatches: LiveMatch[] = [
  {
    id: "live-1",
    league: "لیگ برتر فوتسال",
    status: "زنده",
    time: "۳۴'",
    home: { name: "مس سونگون", score: 3 },
    away: { name: "سن‌ایچ ساوه", score: 2 },
  },
  {
    id: "live-2",
    league: "جام باشگاه‌های آسیا",
    status: "در انتظار",
    time: "۲۲:۰۰",
    home: { name: "—", score: 0 },
    away: { name: "الریان", score: 0 },
  },
  {
    id: "live-3",
    league: "لیگ برتر فوتبال ساحلی",
    status: "پایان یافته",
    time: "پایان",
    home: { name: "پارس جنوبی", score: 5 },
    away: { name: "ملوان بوشهر", score: 4 },
  },
];

export const weeklyMatches: Record<"futsal" | "beach", WeeklyMatch[]> = {
  futsal: [
    {
      id: "fs-week-1",
      title: "گیتی‌پسند - —",
      venue: "سالن پیروزی",
      date: "پنجشنبه ۲۴ اسفند",
      time: "۱۸:۳۰",
      note: "نیمه نهایی لیگ",
    },
    {
      id: "fs-week-2",
      title: "فرش آرا - مس سونگون",
      venue: "سالن شهید بهشتی",
      date: "جمعه ۲۵ اسفند",
      time: "۲۰:۱۵",
      note: "گزارش ویژه",
    },
  ],
  beach: [
    {
      id: "bc-week-1",
      title: "پارس جنوبی - ایفا اردکان",
      venue: "ساحل نقره‌ای",
      date: "شنبه ۲۶ اسفند",
      time: "۱۹:۰۰",
      note: "هفته ۱۵ لیگ",
    },
    {
      id: "bc-week-2",
      title: "ملوان بوشهر - شاهین خزر",
      venue: "ساحل المپیک",
      date: "یکشنبه ۲۷ اسفند",
      time: "۲۱:۰۰",
      note: "نبرد صدر",
    },
  ],
};

export const seasons = [
  { id: "1403", label: "فصل ۱۴۰۳" },
  { id: "1402", label: "فصل ۱۴۰۲" },
];

export const weeks = [
  { id: "1", label: "هفته ۱" },
  { id: "2", label: "هفته ۲" },
  { id: "3", label: "هفته ۳" },
];

export const matchStatuses = [
  { id: "live", label: "زنده" },
  { id: "upcoming", label: "در انتظار" },
  { id: "finished", label: "پایان یافته" },
];

export const matchesCollection: MatchResult[] = [
  {
    id: "match-1",
    type: "futsal",
    opponent: "مس سونگون ۴ - ۲ —",
    venue: "سالن پیروزی",
    date: "۲۴ اسفند",
    status: "finished",
    season: "1403",
    week: "1",
    score: "۴-۲",
  },
  {
    id: "match-2",
    type: "futsal",
    opponent: "فرش آرا - گیتی‌پسند",
    venue: "سالن شهید بهشتی",
    date: "۲۵ اسفند",
    status: "upcoming",
    season: "1403",
    week: "1",
  },
  {
    id: "match-3",
    type: "beach",
    opponent: "پارس جنوبی ۵ - ۴ ملوان",
    venue: "ساحل نقره‌ای",
    date: "۲۴ اسفند",
    status: "finished",
    season: "1403",
    week: "1",
    score: "۵-۴",
  },
  {
    id: "match-4",
    type: "beach",
    opponent: "شاهین خزر - ایفا",
    venue: "ساحل المپیک",
    date: "۲۶ اسفند",
    status: "upcoming",
    season: "1403",
    week: "2",
  },
  {
    id: "match-5",
    type: "futsal",
    opponent: "— - الریان",
    venue: "سالن آزادی",
    date: "امشب",
    status: "live",
    season: "1403",
    week: "2",
  },
];
