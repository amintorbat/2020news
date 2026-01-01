/**
 * Text highlighting utilities for search results
 */

import { normalizeFa } from "./normalize";
import { tokenize } from "./tokenize";

/**
 * Highlight matching terms in text
 * Wraps matches with <mark> tags (safe for React)
 */
export function highlightMatches(text: string, query: string): string {
  if (!text || !query) return text;

  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return text;

  const normalizedText = normalizeFa(text);
  let highlighted = text;
  let offset = 0;

  // Sort tokens by length (longest first) to avoid nested matches
  const sortedTokens = [...queryTokens].sort((a, b) => b.length - a.length);

  for (const token of sortedTokens) {
    const normalizedToken = normalizeFa(token);
    const regex = new RegExp(
      `(${escapeRegex(normalizedToken)})`,
      "gi"
    );

    // Find all matches in normalized text
    const normalizedMatches: Array<{ start: number; end: number }> = [];
    let match;
    const normalizedTextCopy = normalizedText;
    let searchIndex = 0;

    while ((match = normalizedTextCopy.indexOf(normalizedToken, searchIndex)) !== -1) {
      normalizedMatches.push({
        start: match,
        end: match + normalizedToken.length,
      });
      searchIndex = match + 1;
    }

    // Map back to original text positions (approximate)
    // Since we're dealing with Persian text, we'll use a simpler approach:
    // Find the token in the original text (case-insensitive, normalized comparison)
    const tokenRegex = new RegExp(
      `(${escapeRegex(token)})`,
      "gi"
    );

    highlighted = highlighted.replace(tokenRegex, (match) => {
      return `<mark class="bg-yellow-200 text-slate-900">${match}</mark>`;
    });
  }

  return highlighted;
}

/**
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Truncate text with ellipsis, preserving highlighted marks
 */
export function truncateWithHighlight(
  text: string,
  maxLength: number = 150
): string {
  if (text.length <= maxLength) return text;

  // Find the last complete word before maxLength
  let truncateAt = maxLength;
  const spaceIndex = text.lastIndexOf(" ", maxLength);
  if (spaceIndex > maxLength * 0.7) {
    truncateAt = spaceIndex;
  }

  // Check if we're in the middle of a <mark> tag
  const beforeTruncate = text.substring(0, truncateAt);
  const openMarks = (beforeTruncate.match(/<mark/g) || []).length;
  const closeMarks = (beforeTruncate.match(/<\/mark>/g) || []).length;

  // If we have unclosed marks, find the next closing tag
  if (openMarks > closeMarks) {
    const nextClose = text.indexOf("</mark>", truncateAt);
    if (nextClose !== -1) {
      truncateAt = nextClose + 7; // 7 = length of "</mark>"
    }
  }

  return text.substring(0, truncateAt) + "...";
}

