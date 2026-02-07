import type { Media, Gallery } from "@/types/media";
import type { PhotoAlbum, PhotoItem } from "@/lib/data/gallery";
import type { VideoItem } from "@/lib/data/videos";
import type { LeagueKey } from "@/lib/data";
import { generateId } from "@/lib/utils/id";
import { generateSlug, generateUniqueSlug } from "@/lib/utils/slug";

// Mock Media Items
export const mockMedia: Media[] = [
  {
    id: "media-1",
    type: "image",
    title: "تصویر مسابقه گیتی پسند مقابل مس سونگون",
    slug: "giti-pasand-vs-mes-sonqun-match-image",
    description: "تصویر اصلی مسابقه هفته گذشته",
    filePath: "/uploads/images/match-1.jpg",
    size: 2048000,
    mimeType: "image/jpeg",
    width: 1920,
    height: 1080,
    createdAt: "2024-01-15T10:30:00Z",
    uploadedBy: "user-1",
    status: "active",
    tags: ["مسابقه", "گیتی پسند", "مس سونگون"],
    usageCount: 3,
  },
  {
    id: "media-2",
    type: "video",
    title: "گل اول تیم گیتی پسند",
    slug: "giti-pasand-first-goal",
    description: "ویدیوی گل اول در دقیقه ۲۳",
    filePath: "/uploads/videos/goal-1.mp4",
    thumbnailPath: "/uploads/thumbnails/goal-1-thumb.jpg",
    duration: 45,
    size: 15728640,
    mimeType: "video/mp4",
    width: 1280,
    height: 720,
    createdAt: "2024-01-15T11:00:00Z",
    uploadedBy: "user-1",
    status: "active",
    tags: ["گل", "گیتی پسند", "ویدیو"],
    usageCount: 1,
  },
  {
    id: "media-3",
    type: "embed",
    title: "گزارش کامل مسابقه از آپارات",
    slug: "match-report-aparat",
    description: "گزارش کامل مسابقه از کانال آپارات",
    embedUrl: "https://www.aparat.com/v/example",
    size: 0,
    mimeType: "text/html",
    createdAt: "2024-01-15T12:00:00Z",
    uploadedBy: "user-2",
    status: "active",
    tags: ["گزارش", "آپارات", "ویدیو"],
    usageCount: 2,
  },
  {
    id: "media-4",
    type: "image",
    title: "عکس تیم گیتی پسند",
    slug: "giti-pasand-team-photo",
    filePath: "/uploads/images/team-photo.jpg",
    size: 1536000,
    mimeType: "image/jpeg",
    width: 1600,
    height: 900,
    createdAt: "2024-01-14T09:00:00Z",
    uploadedBy: "user-1",
    status: "active",
    tags: ["تیم", "گیتی پسند"],
    usageCount: 1,
  },
  {
    id: "media-5",
    type: "document",
    title: "گزارش فنی مسابقه",
    slug: "technical-match-report",
    description: "گزارش فنی و آماری مسابقه",
    filePath: "/uploads/documents/report-1.pdf",
    size: 512000,
    mimeType: "application/pdf",
    createdAt: "2024-01-15T13:00:00Z",
    uploadedBy: "user-3",
    status: "active",
    tags: ["گزارش", "PDF"],
    usageCount: 0,
  },
  {
    id: "media-6",
    type: "audio",
    title: "مصاحبه با سرمربی",
    slug: "coach-interview-audio",
    description: "مصاحبه صوتی با سرمربی تیم",
    filePath: "/uploads/audio/interview-1.mp3",
    duration: 180,
    size: 2560000,
    mimeType: "audio/mpeg",
    createdAt: "2024-01-15T14:00:00Z",
    uploadedBy: "user-2",
    status: "active",
    tags: ["مصاحبه", "صوتی"],
    usageCount: 1,
  },
  {
    id: "media-7",
    type: "image",
    title: "تصویر بازیکن برتر",
    slug: "best-player-image",
    filePath: "/uploads/images/player-1.jpg",
    size: 1024000,
    mimeType: "image/jpeg",
    width: 800,
    height: 800,
    createdAt: "2024-01-13T15:00:00Z",
    uploadedBy: "user-1",
    status: "archived",
    tags: ["بازیکن"],
    usageCount: 0,
  },
];

// Mock Galleries
export const mockGalleries: Gallery[] = [
  {
    id: "gallery-1",
    title: "گالری مسابقه گیتی پسند",
    slug: "giti-pasand-match-gallery",
    description: "تصاویر کامل مسابقه",
    mediaIds: ["media-1", "media-4"],
    coverMediaId: "media-1",
    relatedEntity: {
      type: "match",
      id: "match-1",
    },
    createdAt: "2024-01-15T10:00:00Z",
    createdBy: "user-1",
  },
];

// User names mapping (for display)
export const userNames: Record<string, string> = {
  "user-1": "احمد محمدی",
  "user-2": "سارا احمدی",
  "user-3": "علی رضایی",
};

/**
 * Get all media items
 */
export function getAllMedia(): Media[] {
  return mockMedia;
}

/**
 * Get media by ID
 */
export function getMediaById(id: string): Media | undefined {
  return mockMedia.find((m) => m.id === id);
}

/**
 * Get media by type
 */
export function getMediaByType(type: Media["type"]): Media[] {
  return mockMedia.filter((m) => m.type === type);
}

/**
 * Get active media only
 */
export function getActiveMedia(): Media[] {
  return mockMedia.filter((m) => m.status === "active");
}

/**
 * Search media by title, slug, or tags
 */
export function searchMedia(query: string): Media[] {
  const lowerQuery = query.toLowerCase();
  return mockMedia.filter(
    (m) =>
      m.title.toLowerCase().includes(lowerQuery) ||
      m.slug.toLowerCase().includes(lowerQuery) ||
      m.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
      m.description?.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Filter media by multiple criteria
 */
export function filterMedia(filters: {
  type?: Media["type"];
  status?: MediaStatus;
  tags?: string[];
  uploadedBy?: string;
  dateFrom?: string;
  dateTo?: string;
}): Media[] {
  let result = [...mockMedia];

  if (filters.type) {
    result = result.filter((m) => m.type === filters.type);
  }

  if (filters.status) {
    result = result.filter((m) => m.status === filters.status);
  }

  if (filters.tags && filters.tags.length > 0) {
    result = result.filter((m) =>
      filters.tags!.some((tag) => m.tags.includes(tag))
    );
  }

  if (filters.uploadedBy) {
    result = result.filter((m) => m.uploadedBy === filters.uploadedBy);
  }

  if (filters.dateFrom) {
    result = result.filter((m) => m.createdAt >= filters.dateFrom!);
  }

  if (filters.dateTo) {
    result = result.filter((m) => m.createdAt <= filters.dateTo!);
  }

  return result;
}

/**
 * Create new media item
 */
export function createMedia(data: Omit<Media, "id" | "slug" | "createdAt" | "usageCount">): Media {
  const existingSlugs = mockMedia.map((m) => m.slug);
  const slug = generateUniqueSlug(data.title, existingSlugs);

  const newMedia: Media = {
    ...data,
    id: generateId(),
    slug,
    createdAt: new Date().toISOString(),
    usageCount: 0,
  };

  mockMedia.push(newMedia);
  return newMedia;
}

/**
 * Update media item
 */
export function updateMedia(id: string, updates: Partial<Media>): Media | null {
  const index = mockMedia.findIndex((m) => m.id === id);
  if (index === -1) return null;

  // If title changed, regenerate slug
  if (updates.title && updates.title !== mockMedia[index].title) {
    const existingSlugs = mockMedia.map((m) => (m.id === id ? "" : m.slug));
    updates.slug = generateUniqueSlug(updates.title, existingSlugs);
  }

  mockMedia[index] = { ...mockMedia[index], ...updates };
  return mockMedia[index];
}

/**
 * Delete media item
 */
export function deleteMedia(id: string): boolean {
  const index = mockMedia.findIndex((m) => m.id === id);
  if (index === -1) return false;
  mockMedia.splice(index, 1);
  return true;
}

/**
 * Archive media item
 */
export function archiveMedia(id: string): Media | null {
  return updateMedia(id, { status: "archived" });
}

/**
 * Get all galleries
 */
export function getAllGalleries(): Gallery[] {
  return mockGalleries;
}

/**
 * Get gallery by ID
 */
export function getGalleryById(id: string): Gallery | undefined {
  return mockGalleries.find((g) => g.id === id);
}

/**
 * Create new gallery
 */
export function createGallery(data: Omit<Gallery, "id" | "slug" | "createdAt">): Gallery {
  const existingSlugs = mockGalleries.map((g) => g.slug);
  const slug = generateUniqueSlug(data.title, existingSlugs);

  const newGallery: Gallery = {
    ...data,
    id: generateId(),
    slug,
    createdAt: new Date().toISOString(),
  };

  mockGalleries.push(newGallery);
  return newGallery;
}

/**
 * Update gallery
 */
export function updateGallery(id: string, updates: Partial<Gallery>): Gallery | null {
  const index = mockGalleries.findIndex((g) => g.id === id);
  if (index === -1) return null;

  // If title changed, regenerate slug
  if (updates.title && updates.title !== mockGalleries[index].title) {
    const existingSlugs = mockGalleries.map((g) => (g.id === id ? "" : g.slug));
    updates.slug = generateUniqueSlug(updates.title, existingSlugs);
  }

  mockGalleries[index] = { ...mockGalleries[index], ...updates };
  return mockGalleries[index];
}

/**
 * Delete gallery
 */
export function deleteGallery(id: string): boolean {
  const index = mockGalleries.findIndex((g) => g.id === id);
  if (index === -1) return false;
  mockGalleries.splice(index, 1);
  return true;
}

/**
 * Get all unique tags from media
 */
export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  mockMedia.forEach((m) => {
    m.tags.forEach((tag) => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * Format duration (seconds to MM:SS)
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// ============================================================================
// Public Galleries (PhotoAlbums) - for /gallery page
// ============================================================================

// Mock data for public galleries (will be synced with /lib/data/gallery.ts)
let mockAlbums: PhotoAlbum[] = [
  {
    id: "album-1",
    title: "تمرینات تیم ملی فوتسال",
    coverImageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=400&fit=crop&q=80",
    imageCount: 24,
    sport: "futsal",
    publishedAt: "۱۴۰۳/۰۱/۲۰",
    relatedNewsSlug: "futsal-camp-report",
  },
  {
    id: "album-2",
    title: "مسابقات فوتبال ساحلی بوشهر",
    coverImageUrl: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=400&h=400&fit=crop&q=80",
    imageCount: 18,
    sport: "beach",
    publishedAt: "۱۴۰۳/۰۱/۱۹",
  },
];

let mockPhotos: PhotoItem[] = [
  { id: "photo-1", albumId: "album-1", imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop&q=80", caption: "تمرینات تیم ملی" },
  { id: "photo-2", albumId: "album-1", imageUrl: "https://images.unsplash.com/photo-1471295253337-3ceaaedca402?w=800&h=600&fit=crop&q=80", caption: "تمرینات تیم ملی" },
];

/**
 * Get all public photo albums
 */
export function getAllPublicAlbums(): PhotoAlbum[] {
  return mockAlbums;
}

/**
 * Get album by ID
 */
export function getPublicAlbumById(id: string): PhotoAlbum | undefined {
  return mockAlbums.find((a) => a.id === id);
}

/**
 * Get photos by album ID
 */
export function getPhotosByAlbumId(albumId: string): PhotoItem[] {
  return mockPhotos.filter((p) => p.albumId === albumId);
}

/**
 * Create new public album
 */
export function createPublicAlbum(data: Omit<PhotoAlbum, "id">): PhotoAlbum {
  const newAlbum: PhotoAlbum = {
    ...data,
    id: generateId(),
  };
  mockAlbums.push(newAlbum);
  return newAlbum;
}

/**
 * Update public album
 */
export function updatePublicAlbum(id: string, updates: Partial<PhotoAlbum>): PhotoAlbum | null {
  const index = mockAlbums.findIndex((a) => a.id === id);
  if (index === -1) return null;
  mockAlbums[index] = { ...mockAlbums[index], ...updates };
  return mockAlbums[index];
}

/**
 * Delete public album
 */
export function deletePublicAlbum(id: string): boolean {
  const index = mockAlbums.findIndex((a) => a.id === id);
  if (index === -1) return false;
  mockAlbums.splice(index, 1);
  // Also delete related photos
  const photoIndices = mockPhotos
    .map((p, i) => (p.albumId === id ? i : -1))
    .filter((i) => i !== -1)
    .reverse();
  photoIndices.forEach((i) => mockPhotos.splice(i, 1));
  return true;
}

/**
 * Add photo to album
 */
export function addPhotoToAlbum(albumId: string, photo: Omit<PhotoItem, "id" | "albumId">): PhotoItem {
  const newPhoto: PhotoItem = {
    ...photo,
    id: generateId(),
    albumId,
  };
  mockPhotos.push(newPhoto);
  
  // Update album image count
  const album = mockAlbums.find((a) => a.id === albumId);
  if (album) {
    album.imageCount = mockPhotos.filter((p) => p.albumId === albumId).length;
  }
  
  return newPhoto;
}

/**
 * Remove photo from album
 */
export function removePhotoFromAlbum(photoId: string): boolean {
  const index = mockPhotos.findIndex((p) => p.id === photoId);
  if (index === -1) return false;
  const albumId = mockPhotos[index].albumId;
  mockPhotos.splice(index, 1);
  
  // Update album image count
  const album = mockAlbums.find((a) => a.id === albumId);
  if (album) {
    album.imageCount = mockPhotos.filter((p) => p.albumId === albumId).length;
  }
  
  return true;
}

// ============================================================================
// Public Videos - for /videos page
// ============================================================================

// Mock data for public videos (will be synced with /lib/data/videos.ts)
let mockVideos: VideoItem[] = [
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
];

/**
 * Get all public videos
 */
export function getAllPublicVideos(): VideoItem[] {
  return mockVideos;
}

/**
 * Get video by ID
 */
export function getPublicVideoById(id: string): VideoItem | undefined {
  return mockVideos.find((v) => v.id === id);
}

/**
 * Create new public video
 */
export function createPublicVideo(data: Omit<VideoItem, "id">): VideoItem {
  const newVideo: VideoItem = {
    ...data,
    id: generateId(),
  };
  mockVideos.push(newVideo);
  return newVideo;
}

/**
 * Update public video
 */
export function updatePublicVideo(id: string, updates: Partial<VideoItem>): VideoItem | null {
  const index = mockVideos.findIndex((v) => v.id === id);
  if (index === -1) return null;
  mockVideos[index] = { ...mockVideos[index], ...updates };
  return mockVideos[index];
}

/**
 * Delete public video
 */
export function deletePublicVideo(id: string): boolean {
  const index = mockVideos.findIndex((v) => v.id === id);
  if (index === -1) return false;
  mockVideos.splice(index, 1);
  return true;
}
