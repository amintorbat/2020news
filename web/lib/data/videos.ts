import type { LeagueKey } from "../data";

export type VideoItem = {
  id: string;
  title: string;
  thumbnailUrl: string;
  duration: string;
  videoUrl: string;
  sport: LeagueKey;
  publishedAt: string;
  relatedNewsSlug?: string;
};

export const mockVideos: VideoItem[] = [
  {
    id: "video-1",
    title: "خلاصه بازی ایران ۳ - ۱ ژاپن",
    thumbnailUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=400&fit=crop&q=80",
    duration: "05:32",
    videoUrl: "https://example.com/video1.mp4",
    sport: "futsal",
    publishedAt: "۱۴۰۳/۰۱/۲۰",
    relatedNewsSlug: "iran-futsal-japan-semi",
  },
  {
    id: "video-2",
    title: "گزارش تصویری از تمرینات تیم ملی فوتسال",
    thumbnailUrl: "https://images.unsplash.com/photo-1471295253337-3ceaaedca402?w=600&h=400&fit=crop&q=80",
    duration: "08:15",
    videoUrl: "https://example.com/video2.mp4",
    sport: "futsal",
    publishedAt: "۱۴۰۳/۰۱/۱۹",
  },
  {
    id: "video-3",
    title: "فینال فوتبال ساحلی - پارس جنوبی ۵ - ۴ ملوان",
    thumbnailUrl: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=600&h=400&fit=crop&q=80",
    duration: "12:45",
    videoUrl: "https://example.com/video3.mp4",
    sport: "beach",
    publishedAt: "۱۴۰۳/۰۱/۱۸",
  },
  {
    id: "video-4",
    title: "گل‌های برتر هفته ۱۵ لیگ برتر فوتسال",
    thumbnailUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=400&fit=crop&q=80",
    duration: "06:20",
    videoUrl: "https://example.com/video4.mp4",
    sport: "futsal",
    publishedAt: "۱۴۰۳/۰۱/۱۷",
  },
  {
    id: "video-5",
    title: "گزارش ویژه از اردوی تیم ملی فوتبال ساحلی",
    thumbnailUrl: "https://images.unsplash.com/photo-1505764706515-aa95265c5abc?w=600&h=400&fit=crop&q=80",
    duration: "10:30",
    videoUrl: "https://example.com/video5.mp4",
    sport: "beach",
    publishedAt: "۱۴۰۳/۰۱/۱۶",
  },
  {
    id: "video-6",
    title: "تحلیل فنی بازی گیتی‌پسند - مس سونگون",
    thumbnailUrl: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=600&h=400&fit=crop&q=80",
    duration: "07:55",
    videoUrl: "https://example.com/video6.mp4",
    sport: "futsal",
    publishedAt: "۱۴۰۳/۰۱/۱۵",
  },
];

export function getVideoById(id: string): VideoItem | undefined {
  return mockVideos.find((video) => video.id === id);
}

