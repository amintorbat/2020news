/**
 * Search document types
 */

export type SearchDocumentType = "news" | "match" | "table" | "player";

export interface SearchDocument {
  id: string;
  type: SearchDocumentType;
  title: string;
  excerpt: string;
  href: string;
  dateISO: string;
  category?: string;
  tags?: string[];
  imageUrl?: string;
  // Additional metadata based on type
  metadata?: Record<string, unknown>;
}

export interface SearchResult {
  document: SearchDocument;
  score: number;
  highlights?: {
    title?: string;
    excerpt?: string;
  };
}

export interface SearchFilters {
  category?: string;
  dateRange?: "today" | "this-week" | "this-month" | "all";
  sort?: "relevance" | "newest";
  type?: SearchDocumentType;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  query: string;
  filters: SearchFilters;
}

