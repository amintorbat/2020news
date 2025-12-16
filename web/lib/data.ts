export type LeagueKey = "football" | "futsal" | "beach";

export type HeroSlide = {
  id: string;
  title: string;
  summary?: string;
  image: string;
  category: string;
  isLive?: boolean;
  ctaHref: string;
};

export type NewsArticle = {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  timeAgo: string;
  category: string;
  image: string;
  publishDate: string;
  author: string;
};

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
  opponent: string;
  venue: string;
  date: string;
  time: string;
  league: LeagueKey;
};

export type MatchResult = {
  id: string;
  league: LeagueKey;
  opponent: string;
  venue: string;
  date: string;
  status: "live" | "finished" | "upcoming";
  season: string;
  week: string;
  score?: string;
};

export type LeagueRow = {
  rank: number;
  team: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalDifference: number;
  points: number;
};

export const heroSlides: HeroSlide[] = [
  {
    id: "hero-1",
    title: "نبرد سرنوشت‌ساز ایران و برزیل در دوحه",
    summary: "ترکیب تهاجمی شمسایی برای رسیدن به فینال آماده است.",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406fef?auto=format&fit=crop&w=1600&q=80",
    category: "فوتبال",
    isLive: true,
    ctaHref: "/matches?league=football&status=live",
  },
  {
    id: "hero-2",
    title: "تمرینات قدرتی تیم ملی فوتسال در مشهد",
    summary: "بدنساز تیم ملی از برنامه ویژه ریکاوری رونمایی کرد.",
    image: "https://images.unsplash.com/photo-1471295253337-3ceaaedca402?auto=format&fit=crop&w=1600&q=80",
    category: "فوتسال",
    ctaHref: "/futsal",
  },
  {
    id: "hero-3",
    title: "فینال فوتبال ساحلی در ساحل مرجان",
    summary: "پارس جنوبی و ملوان برای جام زرین می‌جنگند.",
    image: "https://images.unsplash.com/photo-1505764706515-aa95265c5abc?auto=format&fit=crop&w=1600&q=80",
    category: "فوتبال ساحلی",
    ctaHref: "/matches?league=beach",
  },
  {
    id: "hero-4",
    title: "گزارش اختصاصی از اردوی تیم فوتبال امید",
    summary: "ناظم‌الشریعه: فرصت برای جوان‌ها فراهم شده است.",
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1600&q=80",
    category: "فوتبال",
    ctaHref: "/news/iran-squad-announced",
  },
];

export const latestNews: NewsArticle[] = [
  {
    id: "news-iran-squad",
    slug: "iran-squad-announced",
    title: "لیست جدید تیم ملی فوتبال اعلام شد",
    summary: "سه بازیکن لیگ ایران برای نخستین بار دعوت شدند.",
    timeAgo: "۱۰ دقیقه پیش",
    category: "فوتبال",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=80",
    publishDate: "۱۴۰۳/۰۱/۲۲",
    author: "تحریریه فوتبال",
  },
  {
    id: "news-beach-visit",
    slug: "afc-visit-bushehr",
    title: "بازدید رئیس AFC از کمپ فوتبال ساحلی بوشهر",
    summary: "امکانات ساحل نقره‌ای تحسین کنفدراسیون را برانگیخت.",
    timeAgo: "۲۵ دقیقه پیش",
    category: "فوتبال ساحلی",
    image: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80",
    publishDate: "۱۴۰۳/۰۱/۲۲",
    author: "واحد فوتبال ساحلی",
  },
  {
    id: "news-contract",
    slug: "giti-pasand-transfer",
    title: "تمدید گیتی‌پسند با ستاره فوتسال",
    summary: "قرارداد دو ساله برای ادامه مسیر قهرمانی امضا شد.",
    timeAgo: "۴۵ دقیقه پیش",
    category: "فوتسال",
    image: "https://images.unsplash.com/photo-1471295253337-3ceaaedca402?auto=format&fit=crop&w=900&q=80",
    publishDate: "۱۴۰۳/۰۱/۲۱",
    author: "تحریریه فوتسال",
  },
  {
    id: "news-clinic",
    slug: "beach-coaching-clinic",
    title: "کارگاه مشترک مربیان فوتبال ساحلی ایران و اسپانیا",
    summary: "متدهای جدید کنترلی و آمادگی ذهنی به مربیان منتقل شد.",
    timeAgo: "۱ ساعت پیش",
    category: "فوتبال ساحلی",
    image: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=900&q=80",
    publishDate: "۱۴۰۳/۰۱/۲۰",
    author: "تحریریه ساحلی",
  },
];

export const liveMatches: LiveMatch[] = [
  {
    id: "live-football",
    league: "لیگ برتر فوتبال",
    status: "زنده",
    time: "۶۵'",
    home: { name: "پرسپولیس", score: 1 },
    away: { name: "سپاهان", score: 1 },
  },
  {
    id: "live-futsal",
    league: "لیگ برتر فوتسال",
    status: "در انتظار",
    time: "۲۲:۰۰",
    home: { name: "مس سونگون", score: 0 },
    away: { name: "سن‌ایچ ساوه", score: 0 },
  },
  {
    id: "live-beach",
    league: "لیگ فوتبال ساحلی",
    status: "پایان یافته",
    time: "پایان",
    home: { name: "پارس جنوبی", score: 5 },
    away: { name: "ملوان", score: 4 },
  },
];

export const weeklyMatches: Record<LeagueKey, WeeklyMatch[]> = {
  football: [
    { id: "wf-1", opponent: "استقلال - گل‌گهر", venue: "ورزشگاه آزادی", date: "پنجشنبه ۲۶ اسفند", time: "۱۸:۰۰", league: "football" },
    { id: "wf-2", opponent: "تراکتور - فولاد", venue: "ورزشگاه یادگار", date: "جمعه ۲۷ اسفند", time: "۲۰:۳۰", league: "football" },
  ],
  futsal: [
    { id: "fs-1", opponent: "گیتی‌پسند - کراپ", venue: "سالن پیروزی", date: "شنبه ۲۸ اسفند", time: "۱۹:۰۰", league: "futsal" },
    { id: "fs-2", opponent: "کراپ - سن‌ایچ", venue: "سالن انقلاب", date: "یکشنبه ۲۹ اسفند", time: "۲۱:۰۰", league: "futsal" },
  ],
  beach: [
    { id: "bc-1", opponent: "پارس جنوبی - ایفا", venue: "ساحل نقره‌ای", date: "جمعه ۲۷ اسفند", time: "۱۶:۳۰", league: "beach" },
    { id: "bc-2", opponent: "ملوان - شاهین", venue: "ساحل خزر", date: "شنبه ۲۸ اسفند", time: "۱۸:۴۵", league: "beach" },
  ],
};

export const matchSeasons = [
  { id: "1403", label: "فصل ۱۴۰۳" },
  { id: "1402", label: "فصل ۱۴۰۲" },
];

export const matchWeeks = [
  { id: "1", label: "هفته ۱" },
  { id: "2", label: "هفته ۲" },
  { id: "3", label: "هفته ۳" },
];

export const matchStatuses = [
  { id: "live", label: "زنده" },
  { id: "upcoming", label: "در انتظار" },
  { id: "finished", label: "پایان یافته" },
];

export const leagueOptions = [
  { id: "football" as LeagueKey, label: "فوتبال" },
  { id: "futsal" as LeagueKey, label: "فوتسال" },
  { id: "beach" as LeagueKey, label: "فوتبال ساحلی" },
];

export const matchesCollection: MatchResult[] = [
  {
    id: "match-football-1",
    league: "football",
    opponent: "پرسپولیس ۲ - ۱ تراکتور",
    venue: "ورزشگاه آزادی",
    date: "۲۴ اسفند",
    status: "finished",
    season: "1403",
    week: "1",
    score: "۲-۱",
  },
  {
    id: "match-football-2",
    league: "football",
    opponent: "استقلال - گل‌گهر",
    venue: "ورزشگاه آزادی",
    date: "امروز",
    status: "live",
    season: "1403",
    week: "1",
  },
  {
    id: "match-futsal-1",
    league: "futsal",
    opponent: "مس سونگون ۴ - ۲ کراپ",
    venue: "سالن پیروزی",
    date: "۲۴ اسفند",
    status: "finished",
    season: "1403",
    week: "1",
    score: "۴-۲",
  },
  {
    id: "match-futsal-2",
    league: "futsal",
    opponent: "فرش آرا - گیتی‌پسند",
    venue: "سالن شهید بهشتی",
    date: "۲۵ اسفند",
    status: "upcoming",
    season: "1403",
    week: "1",
  },
  {
    id: "match-beach-1",
    league: "beach",
    opponent: "پارس جنوبی ۵ - ۴ ملوان",
    venue: "ساحل نقره‌ای",
    date: "۲۴ اسفند",
    status: "finished",
    season: "1403",
    week: "1",
    score: "۵-۴",
  },
  {
    id: "match-beach-2",
    league: "beach",
    opponent: "شاهین خزر - ایفا",
    venue: "ساحل المپیک",
    date: "۲۶ اسفند",
    status: "upcoming",
    season: "1403",
    week: "2",
  },
];

export const standings: Record<LeagueKey, LeagueRow[]> = {
  football: [
    { rank: 1, team: "پرسپولیس", played: 20, wins: 14, draws: 4, losses: 2, goalDifference: 18, points: 46 },
    { rank: 2, team: "استقلال", played: 20, wins: 13, draws: 5, losses: 2, goalDifference: 20, points: 44 },
    { rank: 3, team: "سپاهان", played: 20, wins: 12, draws: 4, losses: 4, goalDifference: 16, points: 40 },
    { rank: 4, team: "تراکتور", played: 20, wins: 10, draws: 6, losses: 4, goalDifference: 9, points: 36 },
    { rank: 5, team: "گل‌گهر", played: 20, wins: 9, draws: 6, losses: 5, goalDifference: 6, points: 33 },
  ],
  futsal: [
    { rank: 1, team: "گیتی‌پسند", played: 18, wins: 14, draws: 2, losses: 2, goalDifference: 25, points: 44 },
    { rank: 2, team: "مس سونگون", played: 18, wins: 13, draws: 3, losses: 2, goalDifference: 21, points: 42 },
    { rank: 3, team: "کراپ الوند", played: 18, wins: 11, draws: 3, losses: 4, goalDifference: 12, points: 36 },
    { rank: 4, team: "سن‌ایچ ساوه", played: 18, wins: 10, draws: 5, losses: 3, goalDifference: 10, points: 35 },
    { rank: 5, team: "فرش آرا", played: 18, wins: 8, draws: 5, losses: 5, goalDifference: 3, points: 29 },
  ],
  beach: [
    { rank: 1, team: "پارس جنوبی", played: 16, wins: 12, draws: 1, losses: 3, goalDifference: 19, points: 37 },
    { rank: 2, team: "ملوان بوشهر", played: 16, wins: 11, draws: 2, losses: 3, goalDifference: 15, points: 35 },
    { rank: 3, team: "ایفا اردکان", played: 16, wins: 10, draws: 1, losses: 5, goalDifference: 7, points: 31 },
    { rank: 4, team: "گلساپوش", played: 16, wins: 8, draws: 3, losses: 5, goalDifference: 4, points: 27 },
    { rank: 5, team: "شاهین خزر", played: 16, wins: 7, draws: 2, losses: 7, goalDifference: -3, points: 23 },
  ],
};

export const standingsSeasons = [
  { id: "1403", label: "فصل ۱۴۰۳" },
  { id: "1402", label: "فصل ۱۴۰۲" },
];

export const standingsWeeks = [
  { id: "1", label: "هفته ۱" },
  { id: "2", label: "هفته ۲" },
  { id: "3", label: "هفته ۳" },
];

export type NavChild = {
  title: string;
  href: string;
};

export type NavItem = {
  title: string;
  href: string;
  children?: NavChild[];
};

export const navigationMenu: NavItem[] = [
  { title: "خانه", href: "/" },
  {
    title: "فوتسال",
    href: "/futsal",
    children: [
      { title: "اخبار", href: "/futsal" },
      { title: "برنامه و نتایج", href: "/matches?league=futsal" },
      { title: "جدول لیگ", href: "/standings?league=futsal" },
    ],
  },
  {
    title: "فوتبال ساحلی",
    href: "/beach-football",
    children: [
      { title: "اخبار", href: "/beach-football" },
      { title: "برنامه و نتایج", href: "/matches?league=beach" },
      { title: "جدول لیگ", href: "/standings?league=beach" },
    ],
  },
  { title: "باشگاه هواداری", href: "/fan-club" },
  { title: "پادکست", href: "/podcast" },
];

export function getArticleBySlug(slug: string) {
  return latestNews.find((article) => article.slug === slug);
}
