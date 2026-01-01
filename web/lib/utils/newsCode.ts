/**
 * Generate deterministic news code based on publish date and article ID/slug
 * Format: YYYYMMDD-XXXX (Persian date format)
 */
export function generateNewsCode(publishedAt: string, articleId?: string, slug?: string): string {
  try {
    const date = new Date(publishedAt);
    
    // Get Persian date components
    const persianDate = new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      calendar: "persian",
    }).formatToParts(date);
    
    const year = persianDate.find((p) => p.type === "year")?.value || "";
    const month = persianDate.find((p) => p.type === "month")?.value || "";
    const day = persianDate.find((p) => p.type === "day")?.value || "";
    
    // Generate numeric code from ID or slug hash
    let numericCode = "0000";
    if (articleId) {
      // Use last 4 digits of ID if numeric, otherwise hash
      const idNum = parseInt(articleId.replace(/\D/g, ""), 10);
      if (!isNaN(idNum)) {
        numericCode = String(idNum % 10000).padStart(4, "0");
      } else {
        // Simple hash from string
        let hash = 0;
        for (let i = 0; i < articleId.length; i++) {
          hash = ((hash << 5) - hash + articleId.charCodeAt(i)) | 0;
        }
        numericCode = String(Math.abs(hash) % 10000).padStart(4, "0");
      }
    } else if (slug) {
      // Hash slug
      let hash = 0;
      for (let i = 0; i < slug.length; i++) {
        hash = ((hash << 5) - hash + slug.charCodeAt(i)) | 0;
      }
      numericCode = String(Math.abs(hash) % 10000).padStart(4, "0");
    }
    
    // Convert Persian digits to English
    const persianToEnglish: Record<string, string> = {
      "۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4",
      "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9",
    };
    
    const convertDigits = (str: string) => {
      return str.split("").map((char) => persianToEnglish[char] || char).join("");
    };
    
    const yearEn = convertDigits(year);
    const monthEn = convertDigits(month);
    const dayEn = convertDigits(day);
    
    return `${yearEn}${monthEn}${dayEn}-${numericCode}`;
  } catch {
    // Fallback: use current date + simple hash
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
    const hash = slug ? slug.length * 1000 : 2020;
    return `${dateStr}-${String(hash % 10000).padStart(4, "0")}`;
  }
}

