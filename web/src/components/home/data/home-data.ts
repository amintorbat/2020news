export type SportCategory = "futsal" | "beach";

export type NewsItem = {
  id: string;
  title: string;
  excerpt?: string;
  time: string;
  sport: SportCategory;
  image: string;
  href: string;
};

export type LeagueTableRow = {
  position: number;
  team: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalDiff: number;
  points: number;
};

export type TopScorerRow = {
  rank: number;
  name: string;
  team: string;
  goals: number;
};

export type HomeData = {
  leadStory: NewsItem;
  spotlightStories: NewsItem[];
  editorialFutsal: NewsItem[];
  editorialBeach: NewsItem[];
  newsGrid: NewsItem[];
  focusStrip: NewsItem[];
  leagueTableFutsal: LeagueTableRow[];
  leagueTableBeach: LeagueTableRow[];
  topScorersFutsal: TopScorerRow[];
  topScorersBeach: TopScorerRow[];
  latestNews: NewsItem[];
};

const mainNews: NewsItem[] = [
    {
      id: "mn-1",
      title: "ایران با نمایشی بی‌نقص برابر ژاپن فینال فوتسال آسیا را تجربه می‌کند",
      excerpt:
        "شاگردان شمسایی با ارائه یک بازی فشرده و حساب‌شده موفق شدند ژاپن را با نتیجه ۲ بر صفر شکست دهند و راهی دیدار پایانی شوند.",
      time: "۱۵ دقیقه پیش",
      sport: "futsal",
      image: "/news/futsal-1.jpg",
      href: "/news/mn-1",
    },
    {
      id: "mn-2",
      title: "اعلام فهرست نهایی تیم ملی فوتبال ساحلی برای جام بین قاره‌ای دبی",
      excerpt:
        "علی نادری سرمربی تیم ملی امروز لیست ۱۴ نفره‌ای را منتشر کرد که در آن چهار چهره جوان هم به چشم می‌خورند.",
      time: "۳۰ دقیقه پیش",
      sport: "beach",
      image: "/news/beach-1.jpg",
      href: "/news/mn-2",
    },
    {
      id: "mn-3",
      title: "گیتی‌پسند در بازار نقل و انتقالات فعال شد؛ دو ستاره ملی‌پوش جذب شدند",
      excerpt:
        "باشگاه گیتی‌پسند با انتشار بیانیه‌ای جذب قدرت بهادری و مهدی جاوید را تایید کرد تا آماده شروع لیگ جدید شود.",
      time: "۴۵ دقیقه پیش",
      sport: "futsal",
      image: "/news/futsal-2.jpg",
      href: "/news/mn-3",
    },
    {
      id: "mn-4",
      title: "برنامه کامل هفته نخست لیگ برتر فوتبال ساحلی مشخص شد",
      excerpt:
        "سازمان لیگ فوتبال ساحلی زمان و محل برگزاری مسابقات هفته اول را اعلام کرد و وعده پوشش تلویزیونی دو دیدار را داد.",
      time: "۱ ساعت پیش",
      sport: "beach",
      image: "/news/beach-2.jpg",
      href: "/news/mn-4",
    },
    {
      id: "mn-5",
      title: "تمدید قرارداد درخشان با کراپ الوند برای یک فصل دیگر",
      excerpt:
        "سرمربی موفق فصل گذشته پس از جلسه با مدیران باشگاه قراردادش را تمدید کرد تا برنامه‌های توسعه آکادمی ادامه یابد.",
      time: "۲ ساعت پیش",
      sport: "futsal",
      image: "/news/futsal-3.jpg",
      href: "/news/mn-5",
    },
    {
      id: "mn-6",
      title: "میهمان بلژیکی در اردوی تیم ملی فوتبال ساحلی حاضر شد",
      excerpt:
        "سرمربی تیم ملی بلژیک برای ارزیابی شرایط ساحل‌نشینان ایران به بوشهر سفر کرد و از امکانات کمپ تمرینی بازدید کرد.",
      time: "۳ ساعت پیش",
      sport: "beach",
      image: "/news/beach-3.jpg",
      href: "/news/mn-6",
    },
];

const futsalSection: NewsItem[] = [
    {
      id: "fs-1",
      title: "مس سونگون اردبیل را در تبریز متوقف کرد",
      time: "۲۰ دقیقه پیش",
      sport: "futsal",
      image: "/news/futsal-4.jpg",
      href: "/news/fs-1",
    },
    {
      id: "fs-2",
      title: "تیم دانشگاه آزاد به دنبال ستاره ایتالیایی",
      time: "۴۰ دقیقه پیش",
      sport: "futsal",
      image: "/news/futsal-5.jpg",
      href: "/news/fs-2",
    },
    {
      id: "fs-3",
      title: "قرعه‌کشی لیگ دسته اول فوتسال انجام شد",
      time: "۱ ساعت پیش",
      sport: "futsal",
      image: "/news/futsal-6.jpg",
      href: "/news/fs-3",
    },
    {
      id: "fs-4",
      title: "دوره بدنسازی ملی‌پوشان در کمپ تیم‌های ملی آغاز شد",
      time: "۲ ساعت پیش",
      sport: "futsal",
      image: "/news/futsal-7.jpg",
      href: "/news/fs-4",
    },
];

const beachSection: NewsItem[] = [
    {
      id: "bs-1",
      title: "تورنمنت چهارجانبه بوشهر از فردا شروع می‌شود",
      time: "۱۰ دقیقه پیش",
      sport: "beach",
      image: "/news/beach-4.jpg",
      href: "/news/bs-1",
    },
    {
      id: "bs-2",
      title: "اردوی تیم ملی زیر ۲۱ سال با حضور ۲۶ بازیکن",
      time: "۳۵ دقیقه پیش",
      sport: "beach",
      image: "/news/beach-5.jpg",
      href: "/news/bs-2",
    },
    {
      id: "bs-3",
      title: "لیگ برتر فوتبال ساحلی با حضور ۱۲ تیم برگزار می‌شود",
      time: "۵۵ دقیقه پیش",
      sport: "beach",
      image: "/news/beach-6.jpg",
      href: "/news/bs-3",
    },
    {
      id: "bs-4",
      title: "کیش میزبان فینال لیگ دسته اول خواهد بود",
      time: "۲ ساعت پیش",
      sport: "beach",
      image: "/news/beach-7.jpg",
      href: "/news/bs-4",
    },
];

const latestNews: NewsItem[] = [
  {
    id: "ln-1",
    title: "پخش زنده دیدار دوستانه فوتسال با روسیه تایید شد",
    time: "۵ دقیقه پیش",
    sport: "futsal",
    image: "/news/futsal-8.jpg",
    href: "/news/ln-1",
  },
  {
    id: "ln-2",
    title: "جلسه هماهنگی لیگ برتر فوتبال ساحلی در کیش برگزار شد",
    time: "۱۲ دقیقه پیش",
    sport: "beach",
    image: "/news/beach-8.jpg",
    href: "/news/ln-2",
  },
  {
    id: "ln-3",
    title: "تمدید قرارداد سامان سفری با کراپ الوند",
    time: "۲۰ دقیقه پیش",
    sport: "futsal",
    image: "/news/futsal-9.jpg",
    href: "/news/ln-3",
  },
  {
    id: "ln-4",
    title: "ساحلی‌ بازان تمرین صبحگاهی خود را در ساحل نقره‌ای برگزار کردند",
    time: "۲۸ دقیقه پیش",
    sport: "beach",
    image: "/news/beach-9.jpg",
    href: "/news/ln-4",
  },
  {
    id: "ln-5",
    title: "لیگ برتر فوتسال بانوان با حضور ۱۰ تیم پیگیری می‌شود",
    time: "۳۷ دقیقه پیش",
    sport: "futsal",
    image: "/news/futsal-10.jpg",
    href: "/news/ln-5",
  },
  {
    id: "ln-6",
    title: "معرفی سرپرست جدید هیئت فوتبال ساحلی خراسان",
    time: "۴۵ دقیقه پیش",
    sport: "beach",
    image: "/news/beach-10.jpg",
    href: "/news/ln-6",
  },
  {
    id: "ln-7",
    title: "برنامه تمرینی تیم ملی فوتسال در تایلند مشخص شد",
    time: "۵۳ دقیقه پیش",
    sport: "futsal",
    image: "/news/futsal-11.jpg",
    href: "/news/ln-7",
  },
  {
    id: "ln-8",
    title: "نخستین دوره مربیگری فوتبال ساحلی بانوان به پایان رسید",
    time: "۱ ساعت پیش",
    sport: "beach",
    image: "/news/beach-11.jpg",
    href: "/news/ln-8",
  },
  {
    id: "ln-9",
    title: "قرارداد اسپانسری جدید لیگ فوتسال امضا شد",
    time: "۱ ساعت و ۱۰ دقیقه پیش",
    sport: "futsal",
    image: "/news/futsal-12.jpg",
    href: "/news/ln-9",
  },
  {
    id: "ln-10",
    title: "اختصاص بودجه برای بازسازی زمین‌های فوتبال ساحلی جنوب",
    time: "۱ ساعت و ۲۰ دقیقه پیش",
    sport: "beach",
    image: "/news/beach-12.jpg",
    href: "/news/ln-10",
  },
  {
    id: "ln-11",
    title: "دعوت از سه دروازه‌بان جوان به اردوی تیم ملی فوتسال",
    time: "۱ ساعت و ۳۰ دقیقه پیش",
    sport: "futsal",
    image: "/news/futsal-13.jpg",
    href: "/news/ln-11",
  },
  {
    id: "ln-12",
    title: "لیگ منطقه‌ای فوتبال ساحلی نوجوانان استارت خورد",
    time: "۱ ساعت و ۴۵ دقیقه پیش",
    sport: "beach",
    image: "/news/beach-13.jpg",
    href: "/news/ln-12",
  },
];

export const homeData: HomeData = {
  leadStory: mainNews[0],
  spotlightStories: mainNews.slice(1, 4),
  editorialFutsal: futsalSection,
  editorialBeach: beachSection,
  newsGrid: [
    mainNews[1],
    mainNews[2],
    mainNews[3],
    mainNews[4],
    latestNews[2],
    latestNews[3],
  ],
  focusStrip: latestNews.slice(0, 6),
  leagueTableFutsal: [
    { position: 1, team: "گیتی‌پسند", played: 18, wins: 14, draws: 3, losses: 1, goalDiff: 32, points: 45 },
    { position: 2, team: "مس سونگون", played: 18, wins: 13, draws: 2, losses: 3, goalDiff: 27, points: 41 },
    { position: 3, team: "کراپ الوند", played: 18, wins: 11, draws: 4, losses: 3, goalDiff: 18, points: 37 },
    { position: 4, team: "سن ایچ ساوه", played: 18, wins: 10, draws: 3, losses: 5, goalDiff: 12, points: 33 },
    { position: 5, team: "فرش آرا", played: 18, wins: 8, draws: 5, losses: 5, goalDiff: 6, points: 29 },
    { position: 6, team: "ملی حفاری", played: 18, wins: 6, draws: 6, losses: 6, goalDiff: 1, points: 24 },
    { position: 7, team: "فولاد زرند", played: 18, wins: 5, draws: 4, losses: 9, goalDiff: -7, points: 19 },
    { position: 8, team: "مقاومت البرز", played: 18, wins: 4, draws: 5, losses: 9, goalDiff: -12, points: 17 },
  ],
  leagueTableBeach: [
    { position: 1, team: "شاهین خزر", played: 16, wins: 12, draws: 1, losses: 3, goalDiff: 21, points: 37 },
    { position: 2, team: "ملوان بوشهر", played: 16, wins: 11, draws: 2, losses: 3, goalDiff: 17, points: 35 },
    { position: 3, team: "پارس جنوبی", played: 16, wins: 10, draws: 1, losses: 5, goalDiff: 10, points: 31 },
    { position: 4, team: "ایفا اردکان", played: 16, wins: 8, draws: 3, losses: 5, goalDiff: 6, points: 27 },
    { position: 5, team: "خاتم یزد", played: 16, wins: 7, draws: 2, losses: 7, goalDiff: 2, points: 23 },
    { position: 6, team: "پدیده خزر", played: 16, wins: 6, draws: 3, losses: 7, goalDiff: -4, points: 21 },
    { position: 7, team: "تکاوران بندرترکمن", played: 16, wins: 4, draws: 4, losses: 8, goalDiff: -9, points: 16 },
    { position: 8, team: "شهرداری چابهار", played: 16, wins: 3, draws: 2, losses: 11, goalDiff: -19, points: 11 },
  ],
  topScorersFutsal: [
    { rank: 1, name: "مهدی جاوید", team: "گیتی‌پسند", goals: 32 },
    { rank: 2, name: "قدرت بهادری", team: "مس سونگون", goals: 28 },
    { rank: 3, name: "حمید احمدی", team: "کراپ الوند", goals: 24 },
    { rank: 4, name: "علیرضا جوان", team: "سن ایچ", goals: 21 },
    { rank: 5, name: "علی کیانی‌زادگان", team: "ملی حفاری", goals: 19 },
    { rank: 6, name: "سعید تقی‌زاده", team: "فرش آرا", goals: 17 },
    { rank: 7, name: "محمد زارعی", team: "فولاد زرند", goals: 15 },
    { rank: 8, name: "پیام حساس", team: "مقاومت", goals: 13 },
  ],
  topScorersBeach: [
    { rank: 1, name: "علی نادری", team: "ملوان بوشهر", goals: 29 },
    { rank: 2, name: "محمد احمدزاده", team: "پارس جنوبی", goals: 27 },
    { rank: 3, name: "حمید رضا مختاری", team: "شاهین خزر", goals: 24 },
    { rank: 4, name: "مهدی زینالی", team: "ایفا اردکان", goals: 22 },
    { rank: 5, name: "سجاد آرامی", team: "خاتم یزد", goals: 18 },
    { rank: 6, name: "سعید پیرامون", team: "تکاوران", goals: 16 },
    { rank: 7, name: "پیمان حسینی", team: "پدیده خزر", goals: 13 },
    { rank: 8, name: "مرتضی کریمی", team: "شهرداری چابهار", goals: 11 },
  ],
  latestNews,
};
