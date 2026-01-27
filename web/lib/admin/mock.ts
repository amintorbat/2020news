export type NewsStatus = "draft" | "published" | "archived";
export type SportType = "futsal" | "beach";
export type MatchStatus = "upcoming" | "live" | "finished" | "postponed";
export type CompetitionType = "league" | "cup" | "international" | "friendly";
export type UserRole = "owner" | "supervisor" | "reporter" | "editor";
export type AdSlotType = "popup" | "click" | "banner";
export type MediaType = "image" | "video";

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  sport: SportType;
  status: NewsStatus;
  publishedAt: string;
  author: string;
  views: number;
  excerpt: string;
}

export interface MatchItem {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  sport: SportType;
  competitionType: CompetitionType;
  status: MatchStatus;
  date: string;
  venue: string;
}

export interface StandingRow {
  id: string;
  rank: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
  sport: SportType;
  competitionType: CompetitionType;
}

export interface PlayerStatRow {
  id: string;
  name: string;
  team: string;
  sport: SportType;
  goals: number;
  yellowCards: number;
  redCards: number;
  cleanSheets: number;
  goalsConceded: number;
}

export interface MediaItem {
  id: string;
  title: string;
  type: MediaType;
  url: string;
  thumbnailUrl?: string;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
}


export type AdItem = {
  id: number;
  title: string;
  customer: string;
  type: "banner" | "video" | "native";
  position: "بالای صفحه" | "سایدبار" | "بین اخبار";
  status: "فعال" | "غیرفعال";
  impressions: number;
  clicks: number;
};

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  lastLogin: string | null;
  createdAt: string;
  isActive: boolean;
}

export interface AuditLog {
  id: string;
  action: string;
  user: string;
  resource: string;
  resourceId: string;
  timestamp: string;
  ipAddress: string;
}

// Mock Data
export const mockNews: NewsItem[] = [
  {
    id: "1",
    title: "پیروزی تیم ملی در رقابت‌های قاره‌ای",
    slug: "national-team-victory",
    category: "گزارش",
    sport: "futsal",
    status: "published",
    publishedAt: "۱۴۰۳/۰۹/۱۵",
    author: "احمد محمدی",
    views: 1250,
    excerpt: "تیم ملی فوتسال ایران با نتیجه قاطع به پیروزی رسید...",
  },
  {
    id: "2",
    title: "تحلیل هفته اول لیگ برتر",
    slug: "week-one-analysis",
    category: "یادداشت",
    sport: "futsal",
    status: "draft",
    publishedAt: "۱۴۰۳/۰۹/۱۴",
    author: "علی رضایی",
    views: 0,
    excerpt: "بررسی بازی‌های هفته اول لیگ برتر فوتسال...",
  },
  {
    id: "3",
    title: "گزارش از مسابقات فوتبال ساحلی",
    slug: "beach-soccer-report",
    category: "گزارش",
    sport: "beach",
    status: "published",
    publishedAt: "۱۴۰۳/۰۹/۱۳",
    author: "مریم کریمی",
    views: 890,
    excerpt: "گزارش کامل از مسابقات فوتبال ساحلی...",
  },
];

export const mockMatches: MatchItem[] = [
  {
    id: "1",
    homeTeam: "گیتی‌پسند",
    awayTeam: "مس سونگون",
    homeScore: 3,
    awayScore: 1,
    sport: "futsal",
    competitionType: "league",
    status: "finished",
    date: "۱۴۰۳/۰۹/۱۵",
    venue: "سالن آزادی",
  },
  {
    id: "2",
    homeTeam: "پالایش نفت",
    awayTeam: "سن‌ایچ ساوه",
    homeScore: null,
    awayScore: null,
    sport: "futsal",
    competitionType: "league",
    status: "upcoming",
    date: "۱۴۰۳/۰۹/۱۶",
    venue: "سالن آزادی",
  },
  {
    id: "3",
    homeTeam: "تیم ملی",
    awayTeam: "تیم ملی عراق",
    homeScore: 2,
    awayScore: 2,
    sport: "futsal",
    competitionType: "international",
    status: "live",
    date: "۱۴۰۳/۰۹/۱۵",
    venue: "سالن آزادی",
  },
];

export const mockStandings: StandingRow[] = [
  {
    id: "1",
    rank: 1,
    team: "گیتی‌پسند",
    played: 10,
    won: 8,
    drawn: 1,
    lost: 1,
    goalsFor: 25,
    goalsAgainst: 10,
    goalDiff: 15,
    points: 25,
    sport: "futsal",
    competitionType: "league",
  },
  {
    id: "2",
    rank: 2,
    team: "مس سونگون",
    played: 10,
    won: 7,
    drawn: 2,
    lost: 1,
    goalsFor: 22,
    goalsAgainst: 12,
    goalDiff: 10,
    points: 23,
    sport: "futsal",
    competitionType: "league",
  },
];

export const mockPlayers: PlayerStatRow[] = [
  {
    id: "1",
    name: "مهدی جاوید",
    team: "گیتی‌پسند",
    sport: "futsal",
    goals: 15,
    yellowCards: 2,
    redCards: 0,
    cleanSheets: 0,
    goalsConceded: 0,
  },
  {
    id: "2",
    name: "قدرت بهادری",
    team: "مس سونگون",
    sport: "futsal",
    goals: 12,
    yellowCards: 1,
    redCards: 0,
    cleanSheets: 0,
    goalsConceded: 0,
  },
];

export const mockMedia: MediaItem[] = [
  {
    id: "1",
    title: "تصویر مسابقه گیتی‌پسند",
    type: "image",
    url: "/images/gallery-1.jpg",
    size: 2048000,
    uploadedAt: "۱۴۰۳/۰۹/۱۵",
    uploadedBy: "احمد محمدی",
  },
  {
    id: "2",
    title: "ویدیو مصاحبه با سرمربی",
    type: "video",
    url: "/videos/interview-1.mp4",
    thumbnailUrl: "/images/video-thumb-1.jpg",
    size: 15728640,
    uploadedAt: "۱۴۰۳/۰۹/۱۴",
    uploadedBy: "علی رضایی",
  },
];


export const mockAds: AdItem[] = [
  {
    id: 1,
    title: "تبلیغ برند ورزشی X",
    customer: "Brand X",
    type: "banner",
    position: "بالای صفحه",
    status: "فعال",
    impressions: 12450,
    clicks: 312,
  },
  {
    id: 2,
    title: "ویدیوی اسپانسری لیگ",
    customer: "Sponsor Y",
    type: "video",
    position: "بین اخبار",
    status: "غیرفعال",
    impressions: 8450,
    clicks: 120,
  },
];

export const mockUsers: AdminUser[] = [
  {
    id: "1",
    name: "مدیر کل",
    email: "admin@2020news.ir",
    role: "owner",
    lastLogin: "۱۴۰۳/۰۹/۱۵ - ۱۴:۳۰",
    createdAt: "۱۴۰۳/۰۱/۰۱",
    isActive: true,
  },
  {
    id: "2",
    name: "علی رضایی",
    email: "ali@2020news.ir",
    role: "editor",
    lastLogin: "۱۴۰۳/۰۹/۱۵ - ۱۲:۱۵",
    createdAt: "۱۴۰۳/۰۳/۱۵",
    isActive: true,
  },
  {
    id: "3",
    name: "احمد محمدی",
    email: "ahmad@2020news.ir",
    role: "reporter",
    lastLogin: "۱۴۰۳/۰۹/۱۴ - ۱۸:۴۵",
    createdAt: "۱۴۰۳/۰۵/۲۰",
    isActive: true,
  },
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: "1",
    action: "ایجاد خبر",
    user: "علی رضایی",
    resource: "news",
    resourceId: "1",
    timestamp: "۱۴۰۳/۰۹/۱۵ - ۱۴:۳۰",
    ipAddress: "192.168.1.1",
  },
  {
    id: "2",
    action: "ویرایش مسابقه",
    user: "احمد محمدی",
    resource: "match",
    resourceId: "2",
    timestamp: "۱۴۰۳/۰۹/۱۵ - ۱۳:۱۵",
    ipAddress: "192.168.1.2",
  },
  {
    id: "3",
    action: "حذف کاربر",
    user: "مدیر کل",
    resource: "user",
    resourceId: "5",
    timestamp: "۱۴۰۳/۰۹/۱۵ - ۱۰:۰۰",
    ipAddress: "192.168.1.1",
  },
];
