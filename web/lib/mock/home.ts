export type HomeHeroSlide = {
  id: number;
  title: string;
  excerpt: string;
  category: "فوتسال" | "فوتبال ساحلی";
  publishedAt: string;
  imageUrl: string;
  href: string;
  slug: string;
  isFeatured?: boolean;
};

export type LatestNewsItem = {
  id: number;
  title: string;
  excerpt: string;
  category: "فوتسال" | "فوتبال ساحلی";
  publishedAt: string;
  imageUrl: string;
  href: string;
  slug: string;
  time: string;
  isFeatured?: boolean;
};

export const heroSlides: HomeHeroSlide[] = [
  {
    id: 1,
    title: "پیروزی نفس‌گیر فوتسال ایران مقابل ژاپن در نیمه‌نهایی",
    excerpt: "شاگردان شمسایی با گل دقیقه ۳۹ به فینال صعود کردند.",
    category: "فوتسال",
    publishedAt: "۴۵ دقیقه پیش",
    imageUrl: "https://picsum.photos/seed/hero-1/1200/700",
    href: "/news/iran-futsal-japan-semi",
    slug: "iran-futsal-japan-semi",
    isFeatured: true,
  },
  {
    id: 2,
    title: "ترکیب نهایی تیم فوتبال ساحلی برای جام قهرمانان اعلام شد",
    excerpt: "سه بازیکن جوان برای اولین بار در فهرست نهایی قرار گرفتند.",
    category: "فوتبال ساحلی",
    publishedAt: "۱ ساعت پیش",
    imageUrl: "https://picsum.photos/seed/hero-2/1200/700",
    href: "/news/beach-soccer-squad-final",
    slug: "beach-soccer-squad-final",
    isFeatured: true,
  },
  {
    id: 3,
    title: "بازگشت ستاره فوتسال به تمرینات پس از مصدومیت",
    excerpt: "کادر پزشکی اعلام کرد او برای دیدار بعدی آماده است.",
    category: "فوتسال",
    publishedAt: "۲ ساعت پیش",
    imageUrl: "https://picsum.photos/seed/hero-3/1200/700",
    href: "/news/futsal-star-return",
    slug: "futsal-star-return",
    isFeatured: true,
  },
  {
    id: 4,
    title: "پیروزی ساحلی‌بازان در دیدار تدارکاتی مقابل عمان",
    excerpt: "گل‌های ایران در وقت سوم به ثمر رسید تا بازی برگردد.",
    category: "فوتبال ساحلی",
    publishedAt: "۳ ساعت پیش",
    imageUrl: "https://picsum.photos/seed/hero-4/1200/700",
    href: "/news/beach-soccer-oman-friendly",
    slug: "beach-soccer-oman-friendly",
    isFeatured: true,
  },
  {
    id: 5,
    title: "گزارش ویژه از اردوی آماده‌سازی تیم ملی فوتسال",
    excerpt: "تمرکز کادر فنی روی بازی‌سازی در نیمه حریف است.",
    category: "فوتسال",
    publishedAt: "۴ ساعت پیش",
    imageUrl: "https://picsum.photos/seed/hero-5/1200/700",
    href: "/news/futsal-camp-report",
    slug: "futsal-camp-report",
    isFeatured: true,
  },
];

export const latestNews: LatestNewsItem[] = [
  {
    id: 101,
    title: "برد دقیقه نودی تیم ملی فوتسال در دیدار تدارکاتی حساس",
    excerpt: "گل پیروزی در ثانیه‌های پایانی به ثمر رسید.",
    category: "فوتسال",
    publishedAt: "۲ ساعت پیش",
    imageUrl: "https://picsum.photos/seed/news-1/600/400",
    href: "/news/late-futsal-win",
    slug: "late-futsal-win",
    time: "۲ ساعت پیش",
    isFeatured: true,
  },
  {
    id: 102,
    title: "ترکیب احتمالی تیم فوتبال ساحلی برای مسابقه افتتاحیه مشخص شد",
    excerpt: "کادر فنی با سه تغییر وارد بازی نخست می‌شود.",
    category: "فوتبال ساحلی",
    publishedAt: "۳ ساعت پیش",
    imageUrl: "https://picsum.photos/seed/news-2/600/400",
    href: "/news/beach-soccer-opening-lineup",
    slug: "beach-soccer-opening-lineup",
    time: "۳ ساعت پیش",
    isFeatured: true,
  },
  {
    id: 103,
    title: "بازیکن کلیدی فوتسال قراردادش را تمدید کرد",
    excerpt: "تمدید دو ساله برای ادامه مسیر قهرمانی انجام شد.",
    category: "فوتسال",
    publishedAt: "۴ ساعت پیش",
    imageUrl: "https://picsum.photos/seed/news-3/600/400",
    href: "/news/futsal-star-extension",
    slug: "futsal-star-extension",
    time: "۴ ساعت پیش",
    isFeatured: true,
  },
  {
    id: 104,
    title: "لیگ فوتبال ساحلی با دو بازی جذاب آغاز می‌شود",
    excerpt: "میزبان‌ها به دنبال شروع قدرتمند در هفته اول هستند.",
    category: "فوتبال ساحلی",
    publishedAt: "۵ ساعت پیش",
    imageUrl: "https://picsum.photos/seed/news-4/600/400",
    href: "/news/beach-league-opening-week",
    slug: "beach-league-opening-week",
    time: "۵ ساعت پیش",
  },
  {
    id: 105,
    title: "فوتسال ایران در رده‌بندی جهانی صعود کرد",
    excerpt: "نتایج اخیر باعث افزایش امتیاز ایران شد.",
    category: "فوتسال",
    publishedAt: "۶ ساعت پیش",
    imageUrl: "https://picsum.photos/seed/news-5/600/400",
    href: "/news/futsal-world-ranking",
    slug: "futsal-world-ranking",
    time: "۶ ساعت پیش",
  },
  {
    id: 106,
    title: "تمرینات اختصاصی دروازه‌بانان ساحلی برگزار شد",
    excerpt: "روی واکنش‌های کوتاه و تصمیم‌گیری سریع تمرکز شد.",
    category: "فوتبال ساحلی",
    publishedAt: "۷ ساعت پیش",
    imageUrl: "https://picsum.photos/seed/news-6/600/400",
    href: "/news/beach-goalkeeper-training",
    slug: "beach-goalkeeper-training",
    time: "۷ ساعت پیش",
  },
  {
    id: 107,
    title: "دوره بازآموزی داوران فوتسال در تهران آغاز شد",
    excerpt: "قوانین جدید ویدیویی به داوران معرفی شد.",
    category: "فوتسال",
    publishedAt: "۸ ساعت پیش",
    imageUrl: "https://picsum.photos/seed/news-7/600/400",
    href: "/news/futsal-referees-course",
    slug: "futsal-referees-course",
    time: "۸ ساعت پیش",
  },
  {
    id: 108,
    title: "نقشه راه آماده‌سازی ساحلی‌بازان برای تورنمنت آسیایی",
    excerpt: "سه مرحله اردو و دو بازی تدارکاتی برنامه‌ریزی شد.",
    category: "فوتبال ساحلی",
    publishedAt: "۹ ساعت پیش",
    imageUrl: "https://picsum.photos/seed/news-8/600/400",
    href: "/news/beach-soccer-roadmap",
    slug: "beach-soccer-roadmap",
    time: "۹ ساعت پیش",
  },
  {
    id: 109,
    title: "آمار بهترین گلزنان لیگ فوتسال به‌روزرسانی شد",
    excerpt: "رقابت برای صدر جدول گلزنان همچنان نزدیک است.",
    category: "فوتسال",
    publishedAt: "۱۰ ساعت پیش",
    imageUrl: "https://picsum.photos/seed/news-9/600/400",
    href: "/news/futsal-top-scorers-update",
    slug: "futsal-top-scorers-update",
    time: "۱۰ ساعت پیش",
  },
  {
    id: 110,
    title: "برگزاری بازی دوستانه ساحلی در بوشهر تایید شد",
    excerpt: "بلیت‌فروشی آنلاین برای هواداران از امروز شروع می‌شود.",
    category: "فوتبال ساحلی",
    publishedAt: "۱۱ ساعت پیش",
    imageUrl: "https://picsum.photos/seed/news-10/600/400",
    href: "/news/beach-friendly-bushehr",
    slug: "beach-friendly-bushehr",
    time: "۱۱ ساعت پیش",
  },
  {
    id: 111,
    title: "کاپیتان فوتسال: آماده رقابت‌های فشرده هستیم",
    excerpt: "شرایط بدنی تیم در بهترین وضعیت فصل قرار دارد.",
    category: "فوتسال",
    publishedAt: "۱۲ ساعت پیش",
    imageUrl: "https://picsum.photos/seed/news-11/600/400",
    href: "/news/futsal-captain-ready",
    slug: "futsal-captain-ready",
    time: "۱۲ ساعت پیش",
  },
  {
    id: 112,
    title: "بازیکن جوان ساحلی به تیم ملی دعوت شد",
    excerpt: "این بازیکن در لیگ اخیر عملکرد درخشانی داشت.",
    category: "فوتبال ساحلی",
    publishedAt: "۱۳ ساعت پیش",
    imageUrl: "https://picsum.photos/seed/news-12/600/400",
    href: "/news/beach-young-callup",
    slug: "beach-young-callup",
    time: "۱۳ ساعت پیش",
  },
];
