// News Management System Types
// Professional media-grade news system for 2020news

export type NewsStatus = "draft" | "review" | "scheduled" | "published" | "archived";

export type NewsBlockType =
  | "paragraph"
  | "heading"
  | "image"
  | "video"
  | "gallery"
  | "quote"
  | "list"
  | "table"
  | "embed"
  | "divider"
  | "note"
  | "report";

export interface NewsBlock {
  id: string;
  type: NewsBlockType;
  content: string; // JSON stringified content based on type
  order: number;
  metadata?: Record<string, unknown>;
}

export interface News {
  id: string;
  title: string;
  slug: string;
  summary: string;
  status: NewsStatus;
  publishAt: string | null; // ISO datetime string
  createdAt: string;
  updatedAt: string;
  authorId: string;
  editorId: string | null;
  categoryId: string | null;
  tags: string[];
  featuredMediaId: string | null;
  relatedLeagues: string[]; // League IDs
  relatedMatches: string[]; // Match IDs
  relatedTeams: string[]; // Team IDs
  relatedPlayers: string[]; // Player IDs
  seoTitle: string;
  seoDescription: string;
  viewCount: number;
  readingTime: number; // in minutes
  priority: number; // 0-100, higher = more important
  blocks: NewsBlock[];
}

export interface NewsCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
}

export interface NewsAuditLog {
  id: string;
  newsId: string;
  action: string;
  userId: string;
  userName: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface JournalistAccess {
  id: string;
  journalistId: string;
  journalistName: string;
  matchId: string;
  matchName: string;
  startDateTime: string; // ISO datetime
  endDateTime: string; // ISO datetime
  isActive: boolean;
}

// Block content types
export interface ParagraphBlockContent {
  text: string;
}

export interface HeadingBlockContent {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  text: string;
}

export interface ImageBlockContent {
  mediaId: string;
  caption?: string;
  alt?: string;
  alignment?: "left" | "center" | "right";
}

export interface VideoBlockContent {
  mediaId: string;
  caption?: string;
  autoplay?: boolean;
}

export interface GalleryBlockContent {
  mediaIds: string[];
  layout?: "grid" | "carousel";
  columns?: number;
}

export interface QuoteBlockContent {
  text: string;
  author?: string;
  source?: string;
}

export interface ListBlockContent {
  type: "ordered" | "unordered";
  items: string[];
}

export interface TableBlockContent {
  headers: string[];
  rows: string[][];
}

export interface EmbedBlockContent {
  type: "youtube" | "twitter" | "instagram" | "custom";
  url: string;
  embedCode?: string;
}

export interface NoteBlockContent {
  text: string;
  type: "journalist" | "analysis" | "internal";
}

export interface ReportBlockContent {
  matchId: string;
  sections: {
    title: string;
    content: string;
  }[];
}
