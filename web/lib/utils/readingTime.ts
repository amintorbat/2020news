/**
 * Reading Time Calculator
 * Estimates reading time based on Persian text content
 */

// Average reading speed for Persian: ~200 words per minute
const WORDS_PER_MINUTE = 200;

// Average characters per word in Persian: ~5
const CHARS_PER_WORD = 5;

/**
 * Calculate reading time from text content
 */
export function calculateReadingTime(text: string): number {
  if (!text || text.trim().length === 0) return 0;

  // Remove HTML tags if any
  const cleanText = text.replace(/<[^>]*>/g, "");

  // Count words (split by spaces and Persian word boundaries)
  const words = cleanText
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);

  const wordCount = words.length;

  // Calculate minutes (minimum 1 minute)
  const minutes = Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));

  return minutes;
}

/**
 * Calculate reading time from blocks
 */
export function calculateReadingTimeFromBlocks(blocks: Array<{ type: string; content: string }>): number {
  let totalText = "";

  blocks.forEach((block) => {
    try {
      const content = JSON.parse(block.content || "{}");
      
      switch (block.type) {
        case "paragraph":
          totalText += (content.text || "") + " ";
          break;
        case "heading":
          totalText += (content.text || "") + " ";
          break;
        case "quote":
          totalText += (content.text || "") + " ";
          break;
        case "list":
          if (content.items) {
            totalText += content.items.join(" ") + " ";
          }
          break;
        case "table":
          if (content.rows) {
            content.rows.forEach((row: string[]) => {
              totalText += row.join(" ") + " ";
            });
          }
          break;
        case "note":
          totalText += (content.text || "") + " ";
          break;
        case "report":
          if (content.sections) {
            content.sections.forEach((section: { content: string }) => {
              totalText += (section.content || "") + " ";
            });
          }
          break;
      }
    } catch {
      // Ignore parse errors
    }
  });

  return calculateReadingTime(totalText);
}
