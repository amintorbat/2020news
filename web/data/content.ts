export type HeroSlide = {
  id: string;
  title: string;
  summary: string;
  sport: "futsal" | "beach";
  image: string;
  accent: string;
  badge?: { label: string; tone: "live" | "breaking" };
  link: string;
};

export type TeamInfo = {
  name: string;
  logo: string;
  score: number;
};

export type LiveMatch = {
  id: string;
  sport: "futsal" | "beach";
  competition: string;
  status: "زنده" | "پایان یافته" | "در انتظار";
  time: string;
  home: TeamInfo;
  away: TeamInfo;
};

export type NewsArticle = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: "فوتسال" | "فوتبال ساحلی";
  image: string;
  timeAgo: string;
  author: string;
  publishDate: string;
};

export type TableRow = {
  rank: number;
  team: string;
  logo: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  points: number;
};

export type MatchSide = {
  name: string;
  logo: string;
};

export type MatchSchedule = {
  id: string;
  sport: "futsal" | "beach";
  home: MatchSide;
  away: MatchSide;
  date: string;
  time: string;
  venue: string;
  status: "پیش رو" | "پایان یافته";
  result?: string;
};

export const heroSlides: HeroSlide[] = [
  {
    id: "slide-1",
    title: "ایران – ژاپن؛ جدال تمام‌عیار برای صعود به فینال فوتسال آسیا",
    summary:
      "ملی‌پوشان فوتسال ایران با فرم هجومی جدید خود به سراغ رقیب سنتی رفتند و از همان دقایق نخست مالک توپ بودند.",
    sport: "futsal",
    image:
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1600&q=80",
    accent: "#0ea5e9",
    badge: { label: "زنده", tone: "live" },
    link: "/news/iran-japan-asia-semi",
  },
  {
    id: "slide-2",
    title: "اردوی آماده‌سازی فوتبال ساحلی در بوشهر با تمرینات شبانه ادامه دارد",
    summary:
      "حمید احمدی با تکیه بر نسل تازه‌ای از بازیکنان در تلاش است چینش ترکیب را پیش از جام جهانی یکدست کند.",
    sport: "beach",
    image:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=80",
    accent: "#f97316",
    badge: { label: "گزارش اختصاصی", tone: "breaking" },
    link: "/news/beach-camp-bushehr",
  },
  {
    id: "slide-3",
    title: "لیگ برتر فوتسال؛ سن‌ایچ به صدر نزدیک‌تر شد",
    summary:
      "برد پرگل در ساوه باعث شد شاگردان ناظم‌الشریعه از امتیاز لغزش رقبا نهایت استفاده را ببرند و فاصله را به دو امتیاز کاهش دهند.",
    sport: "futsal",
    image:
      "https://images.unsplash.com/photo-1471295253337-3ceaaedca402?auto=format&fit=crop&w=1600&q=80",
    accent: "#34d399",
    link: "/news/futsal-league-week",
  },
  {
    id: "slide-4",
    title: "برنامه کامل هفته آینده لیگ فوتبال ساحلی اعلام شد",
    summary:
      "سازمان لیگ ساحلی از پوشش تلویزیونی دو مسابقه مهم خبر داد و تیم‌ها در حال سفر به بنادر جنوبی هستند.",
    sport: "beach",
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1600&q=80",
    accent: "#f87171",
    link: "/news/beach-scouting-tour",
  },
  {
    id: "slide-5",
    title: "جادوی پاورپلی کراپ الوند مقابل صدرنشین لیگ",
    summary:
      "شاگردان وحدت پس از عقب‌افتادن با استفاده از پاورپلی نتیجه را برابر کردند و حالا برای صدرنشینی آماده‌اند.",
    sport: "futsal",
    image:
      "https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=1600&q=80",
    accent: "#10b981",
    badge: { label: "تحلیل تاکتیکی", tone: "breaking" },
    link: "/news/futsal-academy-invest",
  },
  {
    id: "slide-6",
    title: "ویژه برنامه زنده: فوتبال ساحلی ایران – برزیل",
    summary:
      "برنامه پخش زنده و کارشناسی ویژه بازی دوستانه ایران و برزیل اعلام شد؛ استودیو ۲۰۲۰نیوز همراه شماست.",
    sport: "beach",
    image:
      "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1600&q=80",
    accent: "#a855f7",
    badge: { label: "LIVE", tone: "live" },
    link: "/news/beach-camp-bushehr",
  },
];

export const liveMatches: LiveMatch[] = [
  {
    id: "live-1",
    sport: "futsal",
    competition: "لیگ برتر فوتسال",
    status: "زنده",
    time: "۳۴'",
    home: { name: "مس سونگون", logo: "MS", score: 3 },
    away: { name: "فرش آرا", logo: "FA", score: 2 },
  },
  {
    id: "live-2",
    sport: "futsal",
    competition: "جام باشگاه‌های آسیا",
    status: "در انتظار",
    time: "۲۲:۰۰",
    home: { name: "کراپ الوند", logo: "KR", score: 0 },
    away: { name: "قطر الکترا", logo: "QE", score: 0 },
  },
  {
    id: "live-3",
    sport: "beach",
    competition: "لیگ برتر فوتبال ساحلی",
    status: "پایان یافته",
    time: "پایان",
    home: { name: "ایفا اردکان", logo: "EF", score: 5 },
    away: { name: "پارس جنوبی", logo: "PJ", score: 3 },
  },
  {
    id: "live-4",
    sport: "beach",
    competition: "جام خلیج فارس",
    status: "زنده",
    time: "۲۱'",
    home: { name: "گلساپوش", logo: "GS", score: 1 },
    away: { name: "پدیده خزر", logo: "PD", score: 1 },
  },
];

export const newsArticles: NewsArticle[] = [
  {
    id: "news-iran-japan",
    slug: "iran-japan-asia-semi",
    title: "ایران با نمایشی منسجم برابر ژاپن ایستاد",
    summary:
      "سیستم پرس بلندی که شمسایی طراحی کرده فاصله خطوط را کم کرد و اجازه خلق موقعیت به ژاپن نداد.",
    category: "فوتسال",
    image:
      "https://images.unsplash.com/photo-1471295253337-3ceaaedca402?auto=format&fit=crop&w=900&q=80",
    timeAgo: "۱۵ دقیقه پیش",
    author: "تحریریه ۲۰۲۰نیوز",
    publishDate: "۱۴۰۲/۱۲/۱۸",
  },
  {
    id: "news-transfer",
    slug: "mes-son-goun-transfer-window",
    title: "مس سونگون برای جذب دو ستاره ملی‌پوش اقدام کرد",
    summary:
      "جلسه فنی امشب در تبریز برگزار شد و مدیران باشگاه با اولویت تقویت فاز حمله وارد مذاکره شدند.",
    category: "فوتسال",
    image:
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=900&q=80",
    timeAgo: "۲۵ دقیقه پیش",
    author: "گروه فوتسال",
    publishDate: "۱۴۰۲/۱۲/۱۸",
  },
  {
    id: "news-beach-camp",
    slug: "beach-camp-bushehr",
    title: "ملی‌پوشان فوتبال ساحلی اردوی شبانه برگزار کردند",
    summary:
      "سرمربی تیم ملی با تمرکز روی استقامت و ریکاوری در ساحل نقره‌ای بوشهر تمرینات متنوعی تدارک دید.",
    category: "فوتبال ساحلی",
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=80",
    timeAgo: "۴۰ دقیقه پیش",
    author: "واحد فوتبال ساحلی",
    publishDate: "۱۴۰۲/۱۲/۱۸",
  },
  {
    id: "news-league-program",
    slug: "futsal-league-week",
    title: "برنامه کامل هفته آینده لیگ برتر فوتسال اعلام شد",
    summary:
      "سازمان لیگ اعلام کرد دو مسابقه حساس به صورت زنده پخش خواهد شد و تمامی دیدارها با توپ جدید برگزار می‌شود.",
    category: "فوتسال",
    image:
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=900&q=80",
    timeAgo: "۱ ساعت پیش",
    author: "تحریریه لیگ",
    publishDate: "۱۴۰۲/۱۲/۱۸",
  },
  {
    id: "news-scouting",
    slug: "beach-scouting-tour",
    title: "استعدادیابی فوتبال ساحلی با حضور مربیان خارجی",
    summary:
      "کارگاه مشترک ایران و برزیل در کیش برگزار می‌شود تا مدل تازه‌ای برای توسعه آکادمی‌ها ارائه شود.",
    category: "فوتبال ساحلی",
    image:
      "https://images.unsplash.com/photo-1505764706515-aa95265c5abc?auto=format&fit=crop&w=900&q=80",
    timeAgo: "۱ ساعت و ۱۵ دقیقه پیش",
    author: "گروه فوتبال ساحلی",
    publishDate: "۱۴۰۲/۱۲/۱۸",
  },
  {
    id: "news-academy",
    slug: "futsal-academy-invest",
    title: "پروژه توسعه آکادمی فوتسال در چهار استان کلید خورد",
    summary:
      "بودجه فدراسیون برای بازسازی سالن‌های تخصصی تصویب شد و استان‌های شمالی میزبان مرحله نخست هستند.",
    category: "فوتسال",
    image:
      "https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=900&q=80",
    timeAgo: "۲ ساعت پیش",
    author: "واحد باشگاه‌ها",
    publishDate: "۱۴۰۲/۱۲/۱۸",
  },
];

export const leagueTables: Record<"futsal" | "beach", TableRow[]> = {
  futsal: [
    { rank: 1, team: "گیتی‌پسند", logo: "GP", played: 18, wins: 14, draws: 2, losses: 2, points: 44 },
    { rank: 2, team: "مس سونگون", logo: "MS", played: 18, wins: 13, draws: 3, losses: 2, points: 42 },
    { rank: 3, team: "سن‌ایچ", logo: "SA", played: 18, wins: 11, draws: 4, losses: 3, points: 37 },
    { rank: 4, team: "کراپ الوند", logo: "KR", played: 18, wins: 10, draws: 4, losses: 4, points: 34 },
    { rank: 5, team: "ملی حفاری", logo: "MH", played: 18, wins: 9, draws: 3, losses: 6, points: 30 },
    { rank: 6, team: "فرش آرا", logo: "FA", played: 18, wins: 8, draws: 4, losses: 6, points: 28 },
    { rank: 7, team: "فولاد زرند", logo: "FZ", played: 18, wins: 6, draws: 4, losses: 8, points: 22 },
    { rank: 8, team: "مقاومت البرز", logo: "MA", played: 18, wins: 5, draws: 5, losses: 8, points: 20 },
  ],
  beach: [
    { rank: 1, team: "پارس جنوبی", logo: "PJ", played: 16, wins: 12, draws: 1, losses: 3, points: 37 },
    { rank: 2, team: "ملوان بوشهر", logo: "MB", played: 16, wins: 11, draws: 2, losses: 3, points: 35 },
    { rank: 3, team: "شاهین خزر", logo: "SH", played: 16, wins: 10, draws: 2, losses: 4, points: 32 },
    { rank: 4, team: "ایفا اردکان", logo: "EF", played: 16, wins: 9, draws: 3, losses: 4, points: 30 },
    { rank: 5, team: "گلساپوش", logo: "GS", played: 16, wins: 8, draws: 2, losses: 6, points: 26 },
    { rank: 6, team: "پدیده خزر", logo: "PD", played: 16, wins: 6, draws: 3, losses: 7, points: 21 },
    { rank: 7, team: "تکاوران", logo: "TK", played: 16, wins: 4, draws: 4, losses: 8, points: 16 },
    { rank: 8, team: "شهرداری چابهار", logo: "SC", played: 16, wins: 3, draws: 2, losses: 11, points: 11 },
  ],
};

export function getArticleBySlug(slug: string) {
  return newsArticles.find((article) => article.slug === slug);
}

export const matchSchedules: Record<
  "futsal" | "beach",
  { upcoming: MatchSchedule[]; recent: MatchSchedule[] }
> = {
  futsal: {
    upcoming: [
      {
        id: "fs-up-1",
        sport: "futsal",
        home: { name: "گیتی‌پسند", logo: "GP" },
        away: { name: "سن‌ایچ ساوه", logo: "SA" },
        date: "پنجشنبه ۲۴ اسفند",
        time: "۱۸:۳۰",
        venue: "سالن پیروزی",
        status: "پیش رو",
      },
      {
        id: "fs-up-2",
        sport: "futsal",
        home: { name: "کراپ الوند", logo: "KR" },
        away: { name: "مس سونگون", logo: "MS" },
        date: "جمعه ۲۵ اسفند",
        time: "۲۰:۰۰",
        venue: "سالن مالک اشتر",
        status: "پیش رو",
      },
    ],
    recent: [
      {
        id: "fs-re-1",
        sport: "futsal",
        home: { name: "فرش آرا", logo: "FA" },
        away: { name: "ملی حفاری", logo: "MH" },
        date: "سه‌شنبه ۲۲ اسفند",
        time: "پایان یافته",
        venue: "سالن شهید بهشتی",
        status: "پایان یافته",
        result: "۲ - ۲",
      },
      {
        id: "fs-re-2",
        sport: "futsal",
        home: { name: "فولاد زرند", logo: "FZ" },
        away: { name: "سن‌ایچ ساوه", logo: "SA" },
        date: "دوشنبه ۲۱ اسفند",
        time: "پایان یافته",
        venue: "سالن امام علی",
        status: "پایان یافته",
        result: "۱ - ۳",
      },
    ],
  },
  beach: {
    upcoming: [
      {
        id: "bc-up-1",
        sport: "beach",
        home: { name: "ملوان بوشهر", logo: "MB" },
        away: { name: "پارس جنوبی", logo: "PJ" },
        date: "شنبه ۲۶ اسفند",
        time: "۱۹:۰۰",
        venue: "ساحل نقره‌ای",
        status: "پیش رو",
      },
      {
        id: "bc-up-2",
        sport: "beach",
        home: { name: "شاهین خزر", logo: "SH" },
        away: { name: "گلساپوش", logo: "GS" },
        date: "یکشنبه ۲۷ اسفند",
        time: "۲۱:۰۰",
        venue: "ساحل المپیک",
        status: "پیش رو",
      },
    ],
    recent: [
      {
        id: "bc-re-1",
        sport: "beach",
        home: { name: "ایفا اردکان", logo: "EF" },
        away: { name: "شهرداری چابهار", logo: "SC" },
        date: "چهارشنبه ۲۳ اسفند",
        time: "پایان یافته",
        venue: "ساحل آزادی",
        status: "پایان یافته",
        result: "۵ - ۳",
      },
      {
        id: "bc-re-2",
        sport: "beach",
        home: { name: "تکاوران بندرترکمن", logo: "TK" },
        away: { name: "پدیده خزر", logo: "PD" },
        date: "سه‌شنبه ۲۲ اسفند",
        time: "پایان یافته",
        venue: "ساحل ترکمن",
        status: "پایان یافته",
        result: "۴ - ۴",
      },
    ],
  },
};
