import { ACS_BASE_URL, ACS_MAX_RETRIES, ACS_REVALIDATE_SECONDS, ACS_TIMEOUT_MS } from "./constants";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchWithRetry(path: string, init?: RequestInit & { revalidate?: number }) {
  const url = path.startsWith("http") ? path : `${ACS_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const revalidate = init?.revalidate ?? ACS_REVALIDATE_SECONDS;
  if (process.env.ACS_SKIP === "1") {
    throw new Error(`ACS fetch skipped during local build for ${url}`);
  }

  let attempt = 0;
  let lastError: unknown;
  while (attempt < ACS_MAX_RETRIES) {
    attempt += 1;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), ACS_TIMEOUT_MS);
    const headerEntries =
      init?.headers instanceof Headers
        ? Object.fromEntries(init.headers.entries())
        : Array.isArray(init?.headers)
          ? Object.fromEntries(init.headers)
          : init?.headers ?? {};
    try {
      const response = await fetch(url, {
        ...init,
        next: { revalidate },
        signal: controller.signal,
        headers: {
          "User-Agent": "2020news-acs/1.0 (+https://2020news.ir)",
          Accept: "*/*",
          ...headerEntries,
        } as HeadersInit,
      });
      clearTimeout(timeout);
      if (!response.ok) {
        lastError = new Error(`Failed to fetch ${url}: ${response.status}`);
        await delay(300 * attempt);
        continue;
      }
      return response;
    } catch (error) {
      lastError = error;
      clearTimeout(timeout);
      if ((error as Error).name === "AbortError") {
        await delay(250 * attempt);
        continue;
      }
      await delay(400 * attempt);
    }
  }
  throw lastError;
}

export function absoluteUrl(href?: string | null) {
  if (!href) return "";
  if (href.startsWith("http")) return href;
  return `${ACS_BASE_URL}${href.startsWith("/") ? href : `/${href}`}`;
}

export function cleanText(value?: string | null) {
  return value?.replace(/\s+/g, " ").trim() ?? "";
}

const FALLBACK_TEAM_NAME = "پالایش نفت شازند";
const TEAM_PLACEHOLDERS = new Set(["-", "—", ""]);

export function normalizeTeamName(value?: string | null) {
  const cleaned = cleanText(value);
  return TEAM_PLACEHOLDERS.has(cleaned) ? FALLBACK_TEAM_NAME : cleaned;
}

export function inferSport(text: string): "futsal" | "beach" {
  if (/ساحلی|Beach/i.test(text)) return "beach";
  return "futsal";
}

export function extractIdFromHref(href: string) {
  const match = href.match(/fullcontent\/(\d+)/);
  if (match) return match[1];
  return Buffer.from(href).toString("base64").slice(0, 12);
}

export function createArticleSlug(id: string, title: string) {
  const safeTitle = cleanText(title)
    .toLowerCase()
    .replace(/[^\u0600-\u06FF\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 60);
  return `news-${id}${safeTitle ? `-${safeTitle}` : ""}`;
}

export function extractIdFromSlug(slug: string) {
  const match = slug.match(/news-(\d+)/);
  return match ? match[1] : null;
}
