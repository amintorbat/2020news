import type { News, NewsCategory, NewsAuditLog } from "@/types/news";
import { generateId } from "@/lib/utils/id";

// Mock News Categories
export const mockNewsCategories: NewsCategory[] = [
  {
    id: "cat-1",
    name: "گزارش مسابقه",
    slug: "match-report",
    description: "گزارش‌های کامل از مسابقات",
    color: "#3B82F6",
  },
  {
    id: "cat-2",
    name: "تحلیل و بررسی",
    slug: "analysis",
    description: "تحلیل‌های تخصصی و بررسی مسابقات",
    color: "#10B981",
  },
  {
    id: "cat-3",
    name: "اخبار تیم‌ها",
    slug: "team-news",
    description: "اخبار و رویدادهای تیم‌ها",
    color: "#F59E0B",
  },
  {
    id: "cat-4",
    name: "انتقالات",
    slug: "transfers",
    description: "اخبار نقل و انتقالات بازیکنان",
    color: "#8B5CF6",
  },
  {
    id: "cat-5",
    name: "یادداشت",
    slug: "editorial",
    description: "یادداشت‌های تحلیلی و سرمقاله",
    color: "#EC4899",
  },
];

// Mock News Items
export const mockNews: News[] = [
  {
    id: "news-1",
    title: "پیروزی قاطع گیتی پسند مقابل مس سونگون",
    slug: "giti-pasand-victory-over-mes-sonqun",
    summary: "تیم گیتی پسند با نتیجه ۳ بر ۱ در مقابل مس سونگون به پیروزی رسید.",
    status: "published",
    publishAt: "2024-01-15T10:00:00Z",
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    authorId: "user-3",
    editorId: "user-2",
    categoryId: "cat-1",
    tags: ["فوتسال", "لیگ برتر", "گیتی پسند"],
    featuredMediaId: "media-1",
    relatedLeagues: ["league-1"],
    relatedMatches: ["match-1"],
    relatedTeams: ["team-1", "team-2"],
    relatedPlayers: ["player-1", "player-2"],
    seoTitle: "پیروزی گیتی پسند مقابل مس سونگون | گزارش مسابقه",
    seoDescription: "گزارش کامل از پیروزی ۳ بر ۱ تیم گیتی پسند در مقابل مس سونگون در هفته اول لیگ برتر فوتسال",
    viewCount: 1250,
    readingTime: 5,
    priority: 80,
    blocks: [
      {
        id: "block-1",
        type: "heading",
        content: JSON.stringify({ level: 1, text: "پیروزی قاطع گیتی پسند" }),
        order: 0,
      },
      {
        id: "block-2",
        type: "paragraph",
        content: JSON.stringify({ text: "تیم گیتی پسند در هفته اول لیگ برتر فوتسال ایران با نتیجه ۳ بر ۱ در مقابل مس سونگون به پیروزی رسید." }),
        order: 1,
      },
    ],
  },
  {
    id: "news-2",
    title: "تحلیل هفته اول لیگ برتر فوتسال",
    slug: "analysis-week-1-futsal-league",
    summary: "بررسی و تحلیل مسابقات هفته اول لیگ برتر فوتسال ایران",
    status: "draft",
    publishAt: null,
    createdAt: "2024-01-16T09:00:00Z",
    updatedAt: "2024-01-16T09:00:00Z",
    authorId: "user-3",
    editorId: null,
    categoryId: "cat-2",
    tags: ["تحلیل", "لیگ برتر"],
    featuredMediaId: null,
    relatedLeagues: ["league-1"],
    relatedMatches: [],
    relatedTeams: [],
    relatedPlayers: [],
    seoTitle: "تحلیل هفته اول لیگ برتر فوتسال",
    seoDescription: "بررسی کامل مسابقات هفته اول لیگ برتر فوتسال ایران",
    viewCount: 0,
    readingTime: 8,
    priority: 60,
    blocks: [],
  },
];

// Mock Audit Logs
export const mockNewsAuditLogs: NewsAuditLog[] = [
  {
    id: "audit-1",
    newsId: "news-1",
    action: "created",
    userId: "user-3",
    userName: "احمد محمدی",
    timestamp: "2024-01-15T08:00:00Z",
  },
  {
    id: "audit-2",
    newsId: "news-1",
    action: "edited",
    userId: "user-2",
    userName: "علی رضایی",
    timestamp: "2024-01-15T09:00:00Z",
  },
  {
    id: "audit-3",
    newsId: "news-1",
    action: "published",
    userId: "user-2",
    userName: "علی رضایی",
    timestamp: "2024-01-15T10:00:00Z",
  },
];
