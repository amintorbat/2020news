/**
 * Slug Generation System
 * Converts Persian text to URL-friendly slugs
 * Handles numbers, special characters, and duplicates
 */

// Persian to Latin character mapping
const persianToLatin: Record<string, string> = {
  // Persian letters
  ا: "a",
  آ: "a",
  أ: "a",
  إ: "i",
  ب: "b",
  پ: "p",
  ت: "t",
  ث: "s",
  ج: "j",
  چ: "ch",
  ح: "h",
  خ: "kh",
  د: "d",
  ذ: "z",
  ر: "r",
  ز: "z",
  ژ: "zh",
  س: "s",
  ش: "sh",
  ص: "s",
  ض: "z",
  ط: "t",
  ظ: "z",
  ع: "a",
  غ: "gh",
  ف: "f",
  ق: "gh",
  ک: "k",
  گ: "g",
  ل: "l",
  م: "m",
  ن: "n",
  و: "v",
  ه: "h",
  ی: "y",
  ي: "y",
  ئ: "y",
  ء: "",
  // Persian numbers (keep as is)
  "۰": "0",
  "۱": "1",
  "۲": "2",
  "۳": "3",
  "۴": "4",
  "۵": "5",
  "۶": "6",
  "۷": "7",
  "۸": "8",
  "۹": "9",
  // Arabic numbers (convert to Latin)
  "٠": "0",
  "١": "1",
  "٢": "2",
  "٣": "3",
  "٤": "4",
  "٥": "5",
  "٦": "6",
  "٧": "7",
  "٨": "8",
  "٩": "9",
};

// Common Persian words/phrases that should be transliterated
const commonPhrases: Record<string, string> = {
  "پرسپولیس": "perspolis",
  "استقلال": "esteghlal",
  "تراکتور": "tractor",
  "ذوب‌آهن": "zobahan",
  "فولاد": "foolad",
  "سپاهان": "sepahan",
  "مس": "mes",
  "گیتی": "giti",
  "پسند": "pasand",
  "هفته": "hafte",
  "مسابقه": "mosabeqe",
  "لیگ": "league",
  "جام": "cup",
  "فوتسال": "futsal",
  "فوتبال": "football",
  "ساحلی": "sahili",
  "بازیکن": "bazikon",
  "تیم": "team",
  "مربی": "morabi",
  "گل": "goal",
  "کارت": "card",
  "زرد": "zard",
  "قرمز": "ghermez",
};

/**
 * Convert Persian text to Latin slug
 */
export function generateSlug(text: string): string {
  if (!text) return "";

  // Normalize text
  let slug = text.trim().toLowerCase();

  // Replace common phrases first
  Object.entries(commonPhrases).forEach(([persian, latin]) => {
    const regex = new RegExp(persian, "gi");
    slug = slug.replace(regex, latin);
  });

  // Convert Persian/Arabic characters to Latin
  let result = "";
  for (let i = 0; i < slug.length; i++) {
    const char = slug[i];
    if (persianToLatin[char]) {
      result += persianToLatin[char];
    } else if (/[a-z0-9]/.test(char)) {
      // Keep Latin letters and numbers
      result += char;
    } else if (char === " " || char === "‌" || char === "-") {
      // Replace spaces and zero-width non-joiner with dash
      result += "-";
    } else if (/[\u0600-\u06FF]/.test(char)) {
      // Any remaining Persian/Arabic character - try to transliterate
      result += persianToLatin[char] || "";
    }
    // Ignore other special characters
  }

  // Clean up: remove multiple dashes, trim dashes from edges
  result = result
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  return result;
}

/**
 * Generate unique slug by checking against existing slugs
 */
export function generateUniqueSlug(
  text: string,
  existingSlugs: string[]
): string {
  const baseSlug = generateSlug(text);
  if (!baseSlug) return "";

  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug;
  }

  // Try with suffix -2, -3, etc.
  let counter = 2;
  let uniqueSlug = `${baseSlug}-${counter}`;
  while (existingSlugs.includes(uniqueSlug)) {
    counter++;
    uniqueSlug = `${baseSlug}-${counter}`;
  }

  return uniqueSlug;
}

/**
 * Validate slug format
 */
export function isValidSlug(slug: string): boolean {
  if (!slug) return false;
  // Only lowercase letters, numbers, and dashes
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}
