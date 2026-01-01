/**
 * Relevance scoring utilities
 */

import { normalizeFa } from "./normalize";
import { tokenize, extractSearchableText } from "./tokenize";
import { isSimilar } from "./normalize";
import type { SearchDocument } from "./types";

/**
 * Calculate relevance score for a document against a query
 * Scoring rules:
 * - Title match: highest weight (10x)
 * - Excerpt match: medium weight (5x)
 * - Category/tags match: lower weight (2x)
 * - Phrase match bonus: +5
 * - Recency bonus: newer articles get slight boost if similar relevance
 */
export function scoreDocument(
  doc: SearchDocument,
  queryTokens: string[]
): number {
  if (queryTokens.length === 0) return 0;

  let score = 0;

  // Normalize document fields
  const normalizedTitle = normalizeFa(doc.title);
  const normalizedExcerpt = normalizeFa(doc.excerpt || "");
  const normalizedCategory = normalizeFa(doc.category || "");
  const normalizedTags = (doc.tags || []).map((tag) => normalizeFa(tag));

  // Check each query token
  for (const queryToken of queryTokens) {
    const normalizedQuery = normalizeFa(queryToken);

    // Title matches (highest weight)
    if (normalizedTitle.includes(normalizedQuery)) {
      score += 10;
      // Exact match bonus
      if (normalizedTitle === normalizedQuery) {
        score += 5;
      }
    } else if (
      normalizedTitle.split(/\s+/).some((word) => isSimilar(word, normalizedQuery))
    ) {
      score += 8; // Fuzzy match in title
    }

    // Excerpt matches (medium weight)
    if (normalizedExcerpt.includes(normalizedQuery)) {
      score += 5;
    } else if (
      normalizedExcerpt.split(/\s+/).some((word) => isSimilar(word, normalizedQuery))
    ) {
      score += 3; // Fuzzy match in excerpt
    }

    // Category/tags matches (lower weight)
    if (normalizedCategory.includes(normalizedQuery)) {
      score += 2;
    }

    for (const tag of normalizedTags) {
      if (tag.includes(normalizedQuery)) {
        score += 2;
      }
    }
  }

  // Phrase match bonus (if query appears as phrase)
  const fullQuery = normalizeFa(queryTokens.join(" "));
  if (normalizedTitle.includes(fullQuery)) {
    score += 5;
  }
  if (normalizedExcerpt.includes(fullQuery)) {
    score += 3;
  }

  // Recency bonus (slight boost for newer articles)
  // Only applies if score > 0
  if (score > 0 && doc.dateISO) {
    try {
      const docDate = new Date(doc.dateISO);
      const now = new Date();
      const daysDiff = (now.getTime() - docDate.getTime()) / (1000 * 60 * 60 * 24);
      
      // Boost for articles from last 7 days
      if (daysDiff <= 7) {
        score += 1;
      }
      // Smaller boost for articles from last 30 days
      else if (daysDiff <= 30) {
        score += 0.5;
      }
    } catch {
      // Invalid date, ignore
    }
  }

  return score;
}

/**
 * Search and score documents
 */
export function searchDocuments(
  documents: SearchDocument[],
  query: string,
  limit: number = 50
): Array<{ document: SearchDocument; score: number }> {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) {
    return [];
  }

  // Score all documents
  const scored = documents
    .map((doc) => ({
      document: doc,
      score: scoreDocument(doc, queryTokens),
    }))
    .filter((item) => item.score > 0) // Only include matches
    .sort((a, b) => b.score - a.score) // Sort by score descending
    .slice(0, limit); // Limit results

  return scored;
}

