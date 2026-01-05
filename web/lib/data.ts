export type LeagueKey = "futsal" | "beach";

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

export type MatchBase = {
  id: string;
  league: LeagueKey;
  opponent: string;
  venue: string;
  date: string;
  time?: string;
  status: "live" | "finished" | "upcoming";
  season: string;
  week: string;
  score?: string;
  note?: string;
};

export type MatchFull = MatchBase & {
  homeTeam?: string;
  awayTeam?: string;
  homeLogo?: string;
  awayLogo?: string;
};

export type LeagueRow = {
  rank: number;
  previousRank?: number;
  team: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalDifference: number;
  goalsFor?: number;
  goalsAgainst?: number;
  points: number;
  form?: ("W" | "D" | "L")[];
};

export type TopScorer = {
  rank: number;
  player: string;
  team: string;
  goals: number;
  matches?: number;
};

export const heroSlides: HeroSlide[] = [
  {
    id: "hero-1",
    title: "نبرد سرنوشت‌ساز ایران و برزیل در دوحه",
    summary: "ترکیب تهاجمی شمسایی برای رسیدن به فینال آماده است.",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406fef?auto=format&fit=crop&w=1600&q=80",
    category: "فوتسال",
    isLive: true,
    ctaHref: "/futsal",
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
    title: "گزارش اختصاصی از اردوی تیم امید فوتسال",
    summary: "ناظم‌الشریعه: فرصت برای جوان‌ها فراهم شده است.",
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1600&q=80",
    category: "فوتسال",
    ctaHref: "/news/iran-squad-announced",
  },
];

export const latestNews: NewsArticle[] = [
  {
    id: "news-iran-squad",
    slug: "iran-squad-announced",
    title: "لیست جدید تیم ملی فوتسال اعلام شد",
    summary: "سه بازیکن لیگ ایران برای نخستین بار دعوت شدند.",
    timeAgo: "۱۰ دقیقه پیش",
    category: "فوتسال",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=80",
    publishDate: "۱۴۰۳/۰۱/۲۲",
    author: "تحریریه فوتسال",
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
  futsal: [
    { id: "fs-1", opponent: "گیتی‌پسند - پالایش نفت شازند", venue: "سالن پیروزی", date: "شنبه ۲۸ اسفند", time: "۱۹:۰۰", league: "futsal" },
    { id: "fs-2", opponent: "پالایش نفت شازند - سن‌ایچ", venue: "سالن انقلاب", date: "یکشنبه ۲۹ اسفند", time: "۲۱:۰۰", league: "futsal" },
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
  { id: "futsal" as LeagueKey, label: "فوتسال" },
  { id: "beach" as LeagueKey, label: "فوتبال ساحلی" },
];

export const matchesCollection: MatchFull[] = [
  {
    id: "match-futsal-1",
    league: "futsal",
    opponent: "مس سونگون ۴ - ۲ پالایش نفت شازند",
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
  futsal: [
    { rank: 1, previousRank: 1, team: "گیتی‌پسند", played: 18, wins: 14, draws: 2, losses: 2, goalDifference: 25, goalsFor: 46, goalsAgainst: 21, points: 44, form: ["W", "W", "D", "W", "W"] },
    { rank: 2, previousRank: 2, team: "مس سونگون", played: 18, wins: 13, draws: 3, losses: 2, goalDifference: 21, goalsFor: 42, goalsAgainst: 21, points: 42, form: ["W", "D", "W", "W", "W"] },
    { rank: 3, previousRank: 4, team: "پالایش نفت شازند", played: 18, wins: 11, draws: 3, losses: 4, goalDifference: 12, goalsFor: 33, goalsAgainst: 21, points: 36, form: ["W", "W", "L", "W", "D"] },
    { rank: 4, previousRank: 3, team: "سن‌ایچ ساوه", played: 18, wins: 10, draws: 5, losses: 3, goalDifference: 10, goalsFor: 31, goalsAgainst: 21, points: 35, form: ["D", "W", "W", "L", "W"] },
    { rank: 5, previousRank: 5, team: "فرش آرا", played: 18, wins: 8, draws: 5, losses: 5, goalDifference: 3, goalsFor: 24, goalsAgainst: 21, points: 29, form: ["L", "D", "W", "D", "L"] },
  ],
  beach: [
    { rank: 1, previousRank: 1, team: "پارس جنوبی", played: 16, wins: 12, draws: 1, losses: 3, goalDifference: 19, goalsFor: 38, goalsAgainst: 19, points: 37, form: ["W", "W", "W", "D", "W"] },
    { rank: 2, previousRank: 2, team: "ملوان بوشهر", played: 16, wins: 11, draws: 2, losses: 3, goalDifference: 15, goalsFor: 34, goalsAgainst: 19, points: 35, form: ["W", "W", "L", "W", "W"] },
    { rank: 3, previousRank: 3, team: "ایفا اردکان", played: 16, wins: 10, draws: 1, losses: 5, goalDifference: 7, goalsFor: 26, goalsAgainst: 19, points: 31, form: ["L", "W", "W", "L", "W"] },
    { rank: 4, previousRank: 4, team: "گلساپوش", played: 16, wins: 8, draws: 3, losses: 5, goalDifference: 4, goalsFor: 23, goalsAgainst: 19, points: 27, form: ["D", "L", "W", "D", "W"] },
    { rank: 5, previousRank: 5, team: "شاهین خزر", played: 16, wins: 7, draws: 2, losses: 7, goalDifference: -3, goalsFor: 16, goalsAgainst: 19, points: 23, form: ["L", "L", "D", "W", "L"] },
  ],
};

export const topScorers: Record<LeagueKey, TopScorer[]> = {
  futsal: [
    { rank: 1, player: "مهدی جاوید", team: "گیتی‌پسند", goals: 32 },
    { rank: 2, player: "قدرت بهادری", team: "مس سونگون", goals: 28 },
    { rank: 3, player: "حمید احمدی", team: "پالایش نفت شازند", goals: 24 },
    { rank: 4, player: "علیرضا جوان", team: "سن‌ایچ ساوه", goals: 21 },
    { rank: 5, player: "علی کیانی‌زادگان", team: "ملی حفاری", goals: 19 },
  ],
  beach: [
    { rank: 1, player: "محمد احمدزاده", team: "پارس جنوبی", goals: 27 },
    { rank: 2, player: "علی نادری", team: "ملوان بوشهر", goals: 25 },
    { rank: 3, player: "حمیدرضا مختاری", team: "شاهین خزر", goals: 22 },
    { rank: 4, player: "مهدی زینالی", team: "ایفا اردکان", goals: 20 },
    { rank: 5, player: "سعید پیرامون", team: "تکاوران", goals: 18 },
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
      { title: "اخبار", href: "/news/futsal" },
      { title: "برنامه و نتایج", href: "/matches?league=futsal" },
      { title: "جدول لیگ", href: "/tables/futsal" },
      { title: "گلزنان", href: "/scorers/futsal" },
      { title: "گالری تصاویر", href: "/gallery?sport=futsal" },
      { title: "ویدیوها", href: "/videos?sport=futsal" },
    ],
  },
  {
    title: "فوتبال ساحلی",
    href: "/beach-soccer",
    children: [
      { title: "اخبار", href: "/news/beach-soccer" },
      { title: "برنامه و نتایج", href: "/matches?league=beach" },
      { title: "جدول لیگ", href: "/tables/beach-soccer" },
      { title: "گلزنان", href: "/scorers/beach-soccer" },
      { title: "گالری تصاویر", href: "/gallery?sport=beach" },
      { title: "ویدیوها", href: "/videos?sport=beach" },
    ],
  },
  { title: "باشگاه هواداری", href: "/fan-club" },
  { title: "پادکست", href: "/podcast" },
];

export function getArticleBySlug(slug: string) {
  return latestNews.find((article) => article.slug === slug);
}
