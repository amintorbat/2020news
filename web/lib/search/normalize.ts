/**
 * Persian/Arabic text normalization utilities
 */

/**
 * Normalize Persian/Arabic text variants
 * - ی/ي (Persian/Arabic yeh)
 * - ک/ك (Persian/Arabic kaf)
 * - Remove diacritics (tashdid, fatha, kasra, etc.)
 * - Trim and collapse spaces
 */
export function normalizeFa(text: string): string {
  if (!text) return "";

  return (
    text
      // Normalize Persian/Arabic variants
      .replace(/ي/g, "ی")
      .replace(/ك/g, "ک")
      // Remove diacritics (Arabic/Persian marks)
      .replace(/[\u064B-\u065F\u0670\u0640\u06D6-\u06ED]/g, "")
      // Remove zero-width characters
      .replace(/[\u200B-\u200D\uFEFF]/g, "")
      // Normalize whitespace
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase()
  );
}

/**
 * Simple Levenshtein distance for fuzzy matching
 * Used for tokens length >= 4
 */
export function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = [];

  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1, // deletion
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j - 1] + 1 // substitution
        );
      }
    }
  }

  return matrix[len1][len2];
}

/**
 * Check if two strings are similar (fuzzy match)
 * For tokens >= 4 chars, allow 1 char difference
 */
export function isSimilar(str1: string, str2: string): boolean {
  const normalized1 = normalizeFa(str1);
  const normalized2 = normalizeFa(str2);

  if (normalized1.length < 4 || normalized2.length < 4) {
    return normalized1 === normalized2;
  }

  const distance = levenshteinDistance(normalized1, normalized2);
  return distance <= 1;
}

