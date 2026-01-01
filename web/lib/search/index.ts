/**
 * Search index builder and main search engine
 */

import type { SearchDocument, SearchFilters, SearchResult } from "./types";
import { searchDocuments } from "./score";
import { highlightMatches } from "./highlight";
import { buildIndex } from "./buildIndex";

// In-memory search index (will be replaced with DB later)
let searchIndex: SearchDocument[] | null = null;

/**
 * Initialize search index from mock data
 * This will be replaced with DB queries later
 */
export function initializeIndex(): void {
  if (searchIndex === null) {
    searchIndex = buildIndex();
  }
}

/**
 * Get search index (lazy initialization)
 */
function getIndex(): SearchDocument[] {
  if (searchIndex === null) {
    initializeIndex();
  }
  return searchIndex || [];
}

/**
 * Apply filters to documents
 */
function applyFilters(
  documents: SearchDocument[],
  filters: SearchFilters
): SearchDocument[] {
  let filtered = [...documents];

  // Filter by type
  if (filters.type) {
    filtered = filtered.filter((doc) => doc.type === filters.type);
  }

  // Filter by category
  if (filters.category) {
    filtered = filtered.filter((doc) => doc.category === filters.category);
  }

  // Filter by date range
  if (filters.dateRange && filters.dateRange !== "all") {
    const now = new Date();
    const cutoffDate = new Date();

    switch (filters.dateRange) {
      case "today":
        cutoffDate.setHours(0, 0, 0, 0);
        break;
      case "this-week":
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case "this-month":
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
    }

    filtered = filtered.filter((doc) => {
      try {
        const docDate = new Date(doc.dateISO);
        return docDate >= cutoffDate;
      } catch {
        return false;
      }
    });
  }

  return filtered;
}

/**
 * Sort results
 */
function sortResults(
  results: Array<{ document: SearchDocument; score: number }>,
  sortBy: "relevance" | "newest"
): Array<{ document: SearchDocument; score: number }> {
  if (sortBy === "newest") {
    return [...results].sort((a, b) => {
      try {
        const dateA = new Date(a.document.dateISO).getTime();
        const dateB = new Date(b.document.dateISO).getTime();
        return dateB - dateA; // Newest first
      } catch {
        return 0;
      }
    });
  }

  // Default: relevance (already sorted by score)
  return results;
}

/**
 * Main search function
 */
export function search(
  query: string,
  filters: SearchFilters = {},
  limit: number = 50
): SearchResult[] {
  const index = getIndex();
  const filtered = applyFilters(index, filters);
  const scored = searchDocuments(filtered, query, limit);
  const sorted = sortResults(scored, filters.sort || "relevance");

  // Add highlights
  return sorted.map((item) => ({
    document: item.document,
    score: item.score,
    highlights: {
      title: highlightMatches(item.document.title, query),
      excerpt: highlightMatches(item.document.excerpt, query),
    },
  }));
}

/**
 * Get suggestion chips (popular search terms)
 */
export function getSuggestions(): string[] {
  return [
    "فوتسال",
    "فوتبال ساحلی",
    "نتایج",
    "لیگ",
    "تیم ملی",
    "جدول",
    "گلزنان",
    "بازی‌ها",
  ];
}

