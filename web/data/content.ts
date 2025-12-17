export type HeroSlide = {
  id: string;
  title: string;
  summary: string;
  image: string;
  accent: string;
};

export type NewsArticle = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  timeAgo: string;
  category: "فوتسال" | "فوتبال ساحلی";
  image: string;
  author: string;
  publishDate: string;
};

export type LiveMatch = {
  id: string;
  league: string;
  status: "زنده" | "پایان یافته" | "در انتظار";
  time: string;
  home: { name: string; score: number };
  away: { name: string; score: number };
};

export type MatchCard = {
  id: string;
  sport: "futsal" | "beach";
  title: string;
  venue: string;
  date: string;
  time: string;
  note: string;
};

export type LeagueRow = {
  rank: number;
  team: string;
  played: number;
  points: number;
};

export const heroSlides: HeroSlide[] = [
  {
    id: "slide-1",
    title: "بازگشت رویایی تیم ملی فوتسال مقابل ژاپن",
    summary: "ملی‌پوشان در نیمه دوم با اجرای پرس هوشمندانه ورق را برگرداندند و صدرنشینی را تثبیت کردند.",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1600&q=80",
    accent: "#f97316",
  },
  {
    id: "slide-2",
    title: "اردوی آماده‌سازی فوتبال ساحلی در بوشهر",
    summary: "حمید احمدی ترکیب نهایی برای رقابت‌های جهانی را در تمرینات صبحگاهی ساحل نقره‌ای محک زد.",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1600&q=80",
    accent: "#0ea5e9",
  },
  {
    id: "slide-3",
    title: "سن‌ایچ ساوه با درخشش جوان‌ها به فینال رسید",
    summary: "سیستم چرخشی جدید ناظم‌الشریعه جواب داد و ساوه‌ای‌ها در هر دو نیمه بر بازی مسلط بودند.",
    image: "https://images.unsplash.com/photo-1471295253337-3ceaaedca402?auto=format&fit=crop&w=1600&q=80",
    accent: "#10b981",
  },
  {
    id: "slide-4",
    title: "ویژه برنامه زنده برای نبرد ایران و برزیل",
    summary: "استودیو ۲۰۲۰نیوز از بنادر جنوبی گزارش‌های زنده و تحلیل کارشناسان را پوشش می‌دهد.",
    image: "https://images.unsplash.com/photo-1505764706515-aa95265c5abc?auto=format&fit=crop&w=1600&q=80",
    accent: "#0f172a",
  },
];

export const newsArticles: NewsArticle[] = [
  {
    id: "news-1",
    slug: "national-futsal-final-squad",
    title: "لیست نهایی شمسایی برای جام بین قاره‌ای اعلام شد",
    summary: "سه بازیکن جوان از تیم‌های امید به ترکیب اصلی اضافه شدند و تمرینات از فردا آغاز می‌شود.",
    timeAgo: "۱۰ دقیقه پیش",
    category: "فوتسال",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80",
    author: "تحریریه فوتسال",
    publishDate: "۱۴۰۳/۰۱/۲۲",
  },
  {
    id: "news-2",
    slug: "afc-visit-beach-center",
    title: "بازدید رئیس AFC از کمپ فوتبال ساحلی ایران",
    summary: "امکانات کمپ بوشهر مورد تمجید قرار گرفت و وعده حمایت برای توسعه آکادمی‌ها داده شد.",
    timeAgo: "۲۵ دقیقه پیش",
    category: "فوتبال ساحلی",
    image: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=80",
    author: "واحد ساحلی",
    publishDate: "۱۴۰۳/۰۱/۲۲",
  },
  {
    id: "news-3",
    slug: "giti-pasand-new-contract",
    title: "قرارداد جدید گیتی‌پسند با ستاره درخشان لیگ",
    summary: "هافبک ملی‌پوش با قراردادی دو ساله به جمع نارنجی‌پوشان اضافه شد.",
    timeAgo: "۴۵ دقیقه پیش",
    category: "فوتسال",
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80",
    author: "گروه باشگاه‌ها",
    publishDate: "۱۴۰۳/۰۱/۲۱",
  },
  {
    id: "news-4",
    slug: "joint-beach-coaching-clinic",
    title: "کارگاه مشترک مربیان فوتبال ساحلی ایران و اسپانیا",
    summary: "به‌روزرسانی متدهای تمرینی و آنالیز داده محور مهم‌ترین محورهای این کارگاه بود.",
    timeAgo: "۱ ساعت پیش",
    category: "فوتبال ساحلی",
    image: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=800&q=80",
    author: "تحریریه ساحلی",
    publishDate: "۱۴۰۳/۰۱/۲۰",
  },
];

export function getArticleBySlug(slug: string) {
  return newsArticles.find((article) => article.slug === slug);
}

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
    home: { name: "کراپ الوند", score: 0 },
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

export const matchSchedules: Record<"futsal" | "beach", MatchCard[]> = {
  futsal: [
    {
      id: "fs-match-1",
      sport: "futsal",
      title: "گیتی‌پسند - کراپ الوند",
      venue: "سالن پیروزی",
      date: "پنجشنبه ۲۴ اسفند",
      time: "۱۸:۳۰",
      note: "نیمه نهایی لیگ",
    },
    {
      id: "fs-match-2",
      sport: "futsal",
      title: "فرش آرا - مس سونگون",
      venue: "سالن شهید بهشتی",
      date: "جمعه ۲۵ اسفند",
      time: "۲۰:۱۵",
      note: "گزارش ویژه",
    },
  ],
  beach: [
    {
      id: "bc-match-1",
      sport: "beach",
      title: "پارس جنوبی - ایفا اردکان",
      venue: "ساحل نقره‌ای",
      date: "شنبه ۲۶ اسفند",
      time: "۱۹:۰۰",
      note: "هفته ۱۵ لیگ",
    },
    {
      id: "bc-match-2",
      sport: "beach",
      title: "ملوان بوشهر - شاهین خزر",
      venue: "ساحل المپیک",
      date: "یکشنبه ۲۷ اسفند",
      time: "۲۱:۰۰",
      note: "نبرد صدر",
    },
  ],
};

export const leagueTables: Record<"futsal" | "beach", LeagueRow[]> = {
  futsal: [
    { rank: 1, team: "گیتی‌پسند", played: 18, points: 45 },
    { rank: 2, team: "مس سونگون", played: 18, points: 41 },
    { rank: 3, team: "کراپ الوند", played: 18, points: 37 },
    { rank: 4, team: "سن‌ایچ ساوه", played: 18, points: 35 },
    { rank: 5, team: "فرش آرا", played: 18, points: 28 },
  ],
  beach: [
    { rank: 1, team: "پارس جنوبی", played: 16, points: 38 },
    { rank: 2, team: "ملوان بوشهر", played: 16, points: 34 },
    { rank: 3, team: "ایفا اردکان", played: 16, points: 31 },
    { rank: 4, team: "گلساپوش", played: 16, points: 27 },
    { rank: 5, team: "شاهین خزر", played: 16, points: 22 },
  ],
};
