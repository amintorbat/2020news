/**
 * Persian text tokenization utilities
 */

import { normalizeFa } from "./normalize";

/**
 * Persian stopwords (common words to filter out)
 */
const PERSIAN_STOPWORDS = new Set([
  "در",
  "از",
  "به",
  "با",
  "که",
  "این",
  "آن",
  "برای",
  "تا",
  "یا",
  "اما",
  "اگر",
  "چون",
  "چرا",
  "چگونه",
  "چه",
  "هم",
  "همه",
  "همچنین",
  "همین",
  "همان",
  "همواره",
  "همیشه",
  "است",
  "بود",
  "باش",
  "شود",
  "می",
  "می‌شود",
  "می‌کند",
  "می‌کنند",
  "می‌باشد",
  "می‌بود",
  "می‌شود",
  "می‌شوند",
]);

/**
 * Tokenize Persian text into searchable tokens
 */
export function tokenize(text: string): string[] {
  if (!text) return [];

  const normalized = normalizeFa(text);
  
  // Split by spaces and punctuation, filter empty
  const tokens = normalized
    .split(/[\s\u200C\u200D\u00A0\u200B\-_.,;:!?()[\]{}'"]+/)
    .filter((token) => token.length > 0);

  // Remove stopwords and single character tokens
  return tokens.filter(
    (token) => token.length > 1 && !PERSIAN_STOPWORDS.has(token)
  );
}

/**
 * Extract searchable text from a document
 * Combines title, excerpt, category, tags
 */
export function extractSearchableText(
  title: string,
  excerpt: string,
  category?: string,
  tags?: string[]
): string {
  const parts: string[] = [title, excerpt];
  
  if (category) parts.push(category);
  if (tags && tags.length > 0) parts.push(tags.join(" "));
  
  return parts.join(" ");
}
