// Media Center Types
// Professional media management system for 2020news

export type MediaType = "image" | "video" | "audio" | "document" | "embed";

export type MediaStatus = "active" | "archived";

export interface Media {
  id: string;
  type: MediaType;
  title: string;
  slug: string;
  description?: string;
  filePath?: string; // For local files
  embedUrl?: string; // For external embeds (YouTube, Aparat)
  thumbnailPath?: string; // For video thumbnails
  duration?: number; // In seconds (for video/audio)
  size: number; // In bytes
  mimeType: string;
  width?: number; // For images/videos
  height?: number; // For images/videos
  createdAt: string; // ISO datetime
  uploadedBy: string; // User ID
  status: MediaStatus;
  tags: string[];
  usageCount: number; // How many times this media is used
  notes?: string; // Internal notes (Editor/Admin only)
}

export interface Gallery {
  id: string;
  title: string;
  slug: string;
  description?: string;
  mediaIds: string[]; // Ordered array of media IDs
  coverMediaId?: string; // First media or selected cover
  relatedEntity?: {
    type: "news" | "match" | "league" | "player" | "ad" | "report";
    id: string;
  };
  createdAt: string;
  createdBy: string;
}

// Upload progress tracking
export interface UploadProgress {
  fileId: string;
  fileName: string;
  progress: number; // 0-100
  status: "pending" | "uploading" | "processing" | "completed" | "error";
  error?: string;
  uploadedMediaId?: string;
}

// Media picker selection
export interface MediaSelection {
  media: Media;
  selected: boolean;
}

// Bulk action types
export type BulkAction = "archive" | "delete" | "tag" | "untag";
