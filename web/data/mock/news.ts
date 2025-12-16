export type HeroSlide = {
  id: string;
  title: string;
  summary: string;
  image: string;
  category: string;
  isLive?: boolean;
  ctaHref: string;
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

export const heroSlides: HeroSlide[] = [
  {
    id: "hero-1",
    title: "نبرد حساس ایران و برزیل در فوتسال آسیا",
    summary: "تیم ملی با ترکیب هجومی و دفاع فشرده آماده دیدار تعیین‌کننده امشب است.",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406fef?auto=format&fit=crop&w=1600&q=80",
    category: "فوتسال",
    isLive: true,
    ctaHref: "/matches?type=futsal&status=live",
  },
  {
    id: "hero-2",
    title: "اردوی شبانه فوتبال ساحلی در بوشهر",
    summary: "حمید احمدی با تمرکز روی استقامت و ریکاوری، تمرینات ویژه‌ای برای ساحل‌نشینان تدارک دید.",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1600&q=80",
    category: "فوتبال ساحلی",
    ctaHref: "/beach-football",
  },
  {
    id: "hero-3",
    title: "سن‌ایچ ساوه با نسل جدید وارد کورس قهرمانی شد",
    summary: "شاگردان ناظم‌الشریعه با سیستم چرخشی جدید سرعت بازی را افزایش دادند.",
    image: "https://images.unsplash.com/photo-1471295253337-3ceaaedca402?auto=format&fit=crop&w=1600&q=80",
    category: "فوتسال",
    ctaHref: "/futsal",
  },
  {
    id: "hero-4",
    title: "پوشش اختصاصی فینال فوتبال ساحلی در کیش",
    summary: "۲۰۲۰نیوز با تیم رسانه‌ای مستقر در ساحل مرجان، لحظه‌به‌لحظه بازی را مخابره می‌کند.",
    image: "https://images.unsplash.com/photo-1505764706515-aa95265c5abc?auto=format&fit=crop&w=1600&q=80",
    category: "فوتبال ساحلی",
    ctaHref: "/matches?type=beach",
  },
];

export const latestNews: NewsArticle[] = [
  {
    id: "news-iran-squad",
    slug: "iran-squad-announced",
    title: "لیست نهایی شمسایی برای جام بین قاره‌ای",
    summary: "سه بازیکن جوان از تیم‌های امید به ترکیب اصلی اضافه شدند و تمرینات از فردا آغاز می‌شود.",
    timeAgo: "۱۰ دقیقه پیش",
    category: "فوتسال",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=80",
    author: "تحریریه فوتسال",
    publishDate: "۱۴۰۳/۰۱/۲۲",
  },
  {
    id: "news-beach-visit",
    slug: "afc-visit-bushehr",
    title: "بازدید رئیس AFC از کمپ فوتبال ساحلی بوشهر",
    summary: "امکانات کمپ نقره‌ای مورد تمجید قرار گرفت و وعده حمایت برای توسعه آکادمی‌ها داده شد.",
    timeAgo: "۲۵ دقیقه پیش",
    category: "فوتبال ساحلی",
    image: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80",
    author: "واحد فوتبال ساحلی",
    publishDate: "۱۴۰۳/۰۱/۲۲",
  },
  {
    id: "news-contract",
    slug: "giti-pasand-transfer",
    title: "قرارداد جدید گیتی‌پسند با ستاره ملی",
    summary: "هافبک ملی‌پوش با قراردادی دو ساله به جمع نارنجی‌پوشان اضافه شد.",
    timeAgo: "۴۵ دقیقه پیش",
    category: "فوتسال",
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=900&q=80",
    author: "گروه باشگاه‌ها",
    publishDate: "۱۴۰۳/۰۱/۲۱",
  },
  {
    id: "news-clinic",
    slug: "beach-coaching-clinic",
    title: "کارگاه مشترک مربیان فوتبال ساحلی ایران و اسپانیا",
    summary: "به‌روزرسانی متدهای تمرینی و آنالیز داده‌محور محور اصلی این کارگاه بود.",
    timeAgo: "۱ ساعت پیش",
    category: "فوتبال ساحلی",
    image: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=900&q=80",
    author: "تحریریه ساحلی",
    publishDate: "۱۴۰۳/۰۱/۲۰",
  },
];

export function getArticleBySlug(slug: string) {
  return latestNews.find((article) => article.slug === slug);
}
