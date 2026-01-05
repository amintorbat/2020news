import type { LeagueKey } from "../data";

export type PhotoAlbum = {
  id: string;
  title: string;
  coverImageUrl: string;
  imageCount: number;
  sport: LeagueKey;
  publishedAt: string;
};

export type PhotoItem = {
  id: string;
  albumId: string;
  imageUrl: string;
  caption?: string;
};

export const mockAlbums: PhotoAlbum[] = [
  {
    id: "album-1",
    title: "تمرینات تیم ملی فوتسال",
    coverImageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=400&fit=crop&q=80",
    imageCount: 24,
    sport: "futsal",
    publishedAt: "۱۴۰۳/۰۱/۲۰",
  },
  {
    id: "album-2",
    title: "مسابقات فوتبال ساحلی بوشهر",
    coverImageUrl: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=400&h=400&fit=crop&q=80",
    imageCount: 18,
    sport: "beach",
    publishedAt: "۱۴۰۳/۰۱/۱۹",
  },
  {
    id: "album-3",
    title: "لیگ برتر فوتسال - هفته ۱۵",
    coverImageUrl: "https://images.unsplash.com/photo-1471295253337-3ceaaedca402?w=400&h=400&fit=crop&q=80",
    imageCount: 32,
    sport: "futsal",
    publishedAt: "۱۴۰۳/۰۱/۱۸",
  },
  {
    id: "album-4",
    title: "ساحل نقره‌ای - مسابقات ساحلی",
    coverImageUrl: "https://images.unsplash.com/photo-1505764706515-aa95265c5abc?w=400&h=400&fit=crop&q=80",
    imageCount: 20,
    sport: "beach",
    publishedAt: "۱۴۰۳/۰۱/۱۷",
  },
  {
    id: "album-5",
    title: "اردوی تیم ملی فوتسال",
    coverImageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=400&fit=crop&q=80",
    imageCount: 28,
    sport: "futsal",
    publishedAt: "۱۴۰۳/۰۱/۱۶",
  },
  {
    id: "album-6",
    title: "فینال جام حذفی فوتبال ساحلی",
    coverImageUrl: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=400&h=400&fit=crop&q=80",
    imageCount: 22,
    sport: "beach",
    publishedAt: "۱۴۰۳/۰۱/۱۵",
  },
];

export const mockPhotos: PhotoItem[] = [
  { id: "photo-1", albumId: "album-1", imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop&q=80", caption: "تمرینات تیم ملی" },
  { id: "photo-2", albumId: "album-1", imageUrl: "https://images.unsplash.com/photo-1471295253337-3ceaaedca402?w=800&h=600&fit=crop&q=80", caption: "تمرینات تیم ملی" },
  { id: "photo-3", albumId: "album-1", imageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop&q=80", caption: "تمرینات تیم ملی" },
  { id: "photo-4", albumId: "album-1", imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406fef?w=800&h=600&fit=crop&q=80", caption: "تمرینات تیم ملی" },
  { id: "photo-5", albumId: "album-2", imageUrl: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=800&h=600&fit=crop&q=80", caption: "مسابقات بوشهر" },
  { id: "photo-6", albumId: "album-2", imageUrl: "https://images.unsplash.com/photo-1505764706515-aa95265c5abc?w=800&h=600&fit=crop&q=80", caption: "مسابقات بوشهر" },
];

export function getPhotosByAlbum(albumId: string): PhotoItem[] {
  return mockPhotos.filter((photo) => photo.albumId === albumId);
}

export function getAlbumById(id: string): PhotoAlbum | undefined {
  return mockAlbums.find((album) => album.id === id);
}

