export type FanLeaderboardEntry = {
  rank: number;
  nickname: string;
  score: number;
  badge: string;
  level: number;
};

export type FanReport = {
  id: number;
  title: string;
  excerpt: string;
  category: "گزارش" | "یادداشت";
  sport: "فوتسال" | "فوتبال ساحلی";
  author: string;
  authorScore: number;
  publishedAt: string;
  imageUrl: string;
  href: string;
  views: number;
  likes: number;
};

export type FanBadge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
};

export type FanActivity = {
  id: number;
  type: "report" | "editorial" | "comment" | "like";
  title: string;
  date: string;
  points: number;
};

export const weeklyLeaderboard: FanLeaderboardEntry[] = [
  {
    rank: 1,
    nickname: "هوادار فوتسال",
    score: 2840,
    badge: "🏆",
    level: 12,
  },
  {
    rank: 2,
    nickname: "ساحلی‌باز",
    score: 2650,
    badge: "🥈",
    level: 11,
  },
  {
    rank: 3,
    nickname: "گلزن حرفه‌ای",
    score: 2480,
    badge: "🥉",
    level: 11,
  },
  {
    rank: 4,
    nickname: "تحلیل‌گر ورزشی",
    score: 2320,
    badge: "⭐",
    level: 10,
  },
  {
    rank: 5,
    nickname: "نویسنده خبر",
    score: 2180,
    badge: "⭐",
    level: 10,
  },
  {
    rank: 6,
    nickname: "فوتبالیست ساحلی",
    score: 2050,
    badge: "⭐",
    level: 9,
  },
  {
    rank: 7,
    nickname: "مربی فوتسال",
    score: 1920,
    badge: "⭐",
    level: 9,
  },
  {
    rank: 8,
    nickname: "طرفدار تیم ملی",
    score: 1800,
    badge: "⭐",
    level: 8,
  },
  {
    rank: 9,
    nickname: "گزارش‌نویس",
    score: 1680,
    badge: "⭐",
    level: 8,
  },
  {
    rank: 10,
    nickname: "هوادار پرتلاش",
    score: 1560,
    badge: "⭐",
    level: 7,
  },
];

export const latestFanReports: FanReport[] = [
  {
    id: 1,
    title: "گزارش میدانی از بازی فوتسال تیم ملی",
    excerpt: "تحلیل کامل بازی و عملکرد بازیکنان در این مسابقه مهم",
    category: "گزارش",
    sport: "فوتسال",
    author: "هوادار فوتسال",
    authorScore: 2840,
    publishedAt: "۲ ساعت پیش",
    imageUrl: "https://picsum.photos/seed/fan-report-1/800/500",
    href: "/fan-club/reports/1",
    views: 1240,
    likes: 89,
  },
  {
    id: 2,
    title: "یادداشت: آینده فوتبال ساحلی ایران",
    excerpt: "نگاهی به چالش‌ها و فرصت‌های پیش روی فوتبال ساحلی",
    category: "یادداشت",
    sport: "فوتبال ساحلی",
    author: "ساحلی‌باز",
    authorScore: 2650,
    publishedAt: "۴ ساعت پیش",
    imageUrl: "https://picsum.photos/seed/fan-report-2/800/500",
    href: "/fan-club/reports/2",
    views: 980,
    likes: 67,
  },
  {
    id: 3,
    title: "گزارش از تمرینات تیم ملی فوتسال",
    excerpt: "گزارش تصویری و تحلیلی از آخرین جلسه تمرین تیم ملی",
    category: "گزارش",
    sport: "فوتسال",
    author: "گلزن حرفه‌ای",
    authorScore: 2480,
    publishedAt: "۶ ساعت پیش",
    imageUrl: "https://picsum.photos/seed/fan-report-3/800/500",
    href: "/fan-club/reports/3",
    views: 1520,
    likes: 112,
  },
  {
    id: 4,
    title: "یادداشت: نقش هواداران در موفقیت تیم",
    excerpt: "بررسی تأثیر حضور و حمایت هواداران در نتایج تیم",
    category: "یادداشت",
    sport: "فوتسال",
    author: "تحلیل‌گر ورزشی",
    authorScore: 2320,
    publishedAt: "۸ ساعت پیش",
    imageUrl: "https://picsum.photos/seed/fan-report-4/800/500",
    href: "/fan-club/reports/4",
    views: 870,
    likes: 54,
  },
  {
    id: 5,
    title: "گزارش ویژه از مسابقات ساحلی",
    excerpt: "تحلیل فنی بازی‌های هفته گذشته در لیگ فوتبال ساحلی",
    category: "گزارش",
    sport: "فوتبال ساحلی",
    author: "نویسنده خبر",
    authorScore: 2180,
    publishedAt: "۱۰ ساعت پیش",
    imageUrl: "https://picsum.photos/seed/fan-report-5/800/500",
    href: "/fan-club/reports/5",
    views: 1100,
    likes: 78,
  },
  {
    id: 6,
    title: "یادداشت: استعدادهای جوان فوتسال",
    excerpt: "معرفی و بررسی استعدادهای برتر نسل جدید فوتسال ایران",
    category: "یادداشت",
    sport: "فوتسال",
    author: "فوتبالیست ساحلی",
    authorScore: 2050,
    publishedAt: "۱۲ ساعت پیش",
    imageUrl: "https://picsum.photos/seed/fan-report-6/800/500",
    href: "/fan-club/reports/6",
    views: 1340,
    likes: 95,
  },
];

export const fanBadges: FanBadge[] = [
  {
    id: "first-report",
    name: "گزارش‌نویس تازه‌کار",
    description: "اولین گزارش خود را ارسال کردید",
    icon: "📝",
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: "top-writer",
    name: "نویسنده برتر",
    description: "۱۰ گزارش منتشر شده",
    icon: "✍️",
    color: "bg-purple-100 text-purple-700",
  },
  {
    id: "popular",
    name: "محبوب",
    description: "گزارش شما بیش از ۱۰۰۰ بازدید داشته",
    icon: "🔥",
    color: "bg-red-100 text-red-700",
  },
  {
    id: "expert",
    name: "کارشناس",
    description: "سطح ۱۰ رسیده‌اید",
    icon: "🎓",
    color: "bg-green-100 text-green-700",
  },
  {
    id: "champion",
    name: "قهرمان",
    description: "رتبه اول در جدول رده‌بندی",
    icon: "🏆",
    color: "bg-yellow-100 text-yellow-700",
  },
];

export const demoProfileActivities: FanActivity[] = [
  {
    id: 1,
    type: "report",
    title: "گزارش میدانی از بازی فوتسال تیم ملی",
    date: "۲ ساعت پیش",
    points: 50,
  },
  {
    id: 2,
    type: "editorial",
    title: "یادداشت: آینده فوتبال ساحلی ایران",
    date: "۴ ساعت پیش",
    points: 40,
  },
  {
    id: 3,
    type: "like",
    title: "لایک گزارش: تحلیل بازی تیم ملی",
    date: "۶ ساعت پیش",
    points: 5,
  },
  {
    id: 4,
    type: "comment",
    title: "نظر در گزارش: تمرینات تیم ملی",
    date: "۸ ساعت پیش",
    points: 10,
  },
  {
    id: 5,
    type: "report",
    title: "گزارش از تمرینات تیم ملی فوتسال",
    date: "۱۰ ساعت پیش",
    points: 50,
  },
];

export const demoProfile = {
  nickname: "هوادار فوتسال",
  level: 12,
  score: 2840,
  nextLevelScore: 3000,
  badges: fanBadges.slice(0, 4),
  activities: demoProfileActivities,
  totalReports: 24,
  totalEditorials: 8,
  totalLikes: 156,
  totalViews: 12400,
};

