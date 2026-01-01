/**
 * Article utility functions
 */

/**
 * Calculate reading time in minutes from HTML content
 * Assumes average reading speed of 200 words per minute for Persian
 */
export function calculateReadingTime(html: string): number {
  if (!html) return 1;

  // Remove HTML tags and get text content
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Count words (Persian/Arabic words are typically longer, so we count more conservatively)
  const wordCount = text.split(/\s+/).filter((word) => word.length > 0).length;

  // Persian reading speed: ~150-200 words per minute (use 180 as average)
  const wordsPerMinute = 180;
  const minutes = Math.ceil(wordCount / wordsPerMinute);

  return Math.max(1, minutes); // Minimum 1 minute
}

/**
 * Extract headings (h2, h3) from HTML for table of contents
 */
export function extractHeadings(html: string): Array<{ id: string; text: string; level: number }> {
  if (!html) return [];

  // Create a temporary container to parse HTML
  const div = typeof document !== "undefined" ? document.createElement("div") : null;
  if (!div) return []; // SSR: return empty, will be populated on client

  div.innerHTML = html;

  const headings: Array<{ id: string; text: string; level: number }> = [];
  const headingElements = div.querySelectorAll("h2, h3");

  headingElements.forEach((heading, index) => {
    const text = heading.textContent?.trim() || "";
    if (!text) return;

    const level = heading.tagName === "H2" ? 2 : 3;
    const id = `heading-${index}-${text.slice(0, 20).replace(/\s+/g, "-").toLowerCase()}`;

    // Add ID to heading if not present
    if (!heading.id) {
      heading.id = id;
    }

    headings.push({
      id: heading.id || id,
      text,
      level,
    });
  });

  return headings;
}

/**
 * Add IDs to headings in HTML if they don't have one
 * This is used server-side to prepare HTML for TOC
 */
export function addHeadingIds(html: string): string {
  if (!html) return html;

  // Simple regex-based approach (for server-side)
  let index = 0;
  return html.replace(/<h([2-3])([^>]*)>([^<]+)<\/h[2-3]>/gi, (match, level, attrs, text) => {
    // Check if ID already exists
    if (/id\s*=\s*["']([^"']+)["']/i.test(attrs)) {
      return match;
    }

    const id = `heading-${index}-${text.slice(0, 20).replace(/\s+/g, "-").toLowerCase().replace(/[^\w-]/g, "")}`;
    index++;
    return `<h${level}${attrs} id="${id}">${text}</h${level}>`;
  });
}

