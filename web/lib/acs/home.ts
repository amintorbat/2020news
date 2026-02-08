import { load } from "cheerio";
import { getFallbackHomePayload } from "./fallback";
import { latestNews as localNews } from "@/lib/data";
import { Article, HomeAcsPayload } from "./types";
import { absoluteUrl, cleanText, createArticleSlug, extractIdFromHref, fetchWithRetry, inferSport } from "./utils";
import { ACS_FALLBACK_IMAGE } from "./constants";
import { logWarnOnce } from "./logger";
import { readCache, writeCache } from "./cache";

type CheerioRoot = ReturnType<typeof load>;
const HOME_CACHE_TTL = 5 * 60 * 1000;
let homeCache: { payload: HomeAcsPayload; expiresAt: number } | null = null;
let homeLoading: Promise<HomeAcsPayload> | null = null;

export async function getHomeContent(): Promise<HomeAcsPayload> {
  if (homeCache && homeCache.expiresAt > Date.now()) {
    return homeCache.payload;
  }
  if (homeLoading) {
    return homeLoading;
  }
  homeLoading = loadHomeContent();
  try {
    const payload = await homeLoading;
    homeCache = { payload, expiresAt: Date.now() + HOME_CACHE_TTL };
    return payload;
  } finally {
    homeLoading = null;
  }
}

async function loadHomeContent(): Promise<HomeAcsPayload> {
  try {
    const response = await fetchWithRetry("/");
    if (!response) {
      logWarnOnce("home", "ACS fetch skipped (e.g. build); using fallback.");
      const fallbackPayload = getFallbackHomePayload();
      const localFallbackNews = mapLocalNews(localNews);
      const fallbackHeroes = collectValidSlides(fallbackPayload.heroSlides ?? []);
      return {
        ...fallbackPayload,
        heroSlides: fallbackHeroes.slice(0, 5),
        latestNews: ensureMinimumArticles(fallbackPayload.latestNews, localFallbackNews, 12, 30),
        source: "fallback",
      };
    }
    const html = await response.text();
    const $ = load(html);
    const heroSlides = dedupeArticles(parseHeroSlides($));
    const latestNews = dedupeArticles(parseLatestArticles($, heroSlides.map((slide) => slide.id)));
    const fallback = getFallbackHomePayload();
    const localNewsItems = mapLocalNews(localNews);
    const rawHeroCandidates = [...heroSlides, ...latestNews];
    const heroCandidates = collectValidSlides(rawHeroCandidates);
    if (heroCandidates.length < rawHeroCandidates.length) {
      console.warn("[ACS][home] Hero slides filtered due to missing/invalid images");
    }
    const finalHeroes = heroCandidates.slice(0, 5);
    const finalNews = ensureMinimumArticles(latestNews, [...fallback.latestNews, ...localNewsItems], 12, 30);

    const payload: HomeAcsPayload = {
      heroSlides: finalHeroes,
      latestNews: finalNews,
      liveEvents: [],
      fetchedAt: new Date().toISOString(),
      source: "live",
    };
    await writeCache("home", payload);
    return payload;
  } catch (error) {
    logWarnOnce("home", "Falling back to cached hero/news feed", error);
    const cached = await readCache<HomeAcsPayload>("home");
    if (cached) {
      const cachedHeroes = collectValidSlides(cached.heroSlides ?? []);
      if (cachedHeroes.length < (cached.heroSlides?.length ?? 0)) {
        console.warn("[ACS][home] Cached hero slides filtered due to missing/invalid images");
      }
      return { ...cached, heroSlides: cachedHeroes.slice(0, 5), source: "cache" };
    }
    const fallbackPayload = getFallbackHomePayload();
    const localFallbackNews = mapLocalNews(localNews);
    const fallbackHeroes = collectValidSlides(fallbackPayload.heroSlides ?? []);
    if (fallbackHeroes.length < (fallbackPayload.heroSlides?.length ?? 0)) {
      console.warn("[ACS][home] Fallback hero slides filtered due to missing/invalid images");
    }
    return {
      ...fallbackPayload,
      heroSlides: fallbackHeroes.slice(0, 5),
      latestNews: ensureMinimumArticles(fallbackPayload.latestNews, localFallbackNews, 12, 30),
      source: "fallback",
    };
  }
}

function parseHeroSlides($: CheerioRoot): Article[] {
  const slides = new Map<string, Article>();
  $("#carousel-1084-captions .carousel-inner .item").each((_, element) => {
    const node = $(element);
    const anchor = node.find("a[href*='/fullcontent/']").first();
    const href = absoluteUrl(anchor.attr("href"));
    const id = extractIdFromHref(href);
    const title = cleanText(anchor.text()) || cleanText(node.find(".Title").text());
    if (!href || !title) return;

    const excerpt = cleanText(node.find(".Abstact").first().text());
    const category = cleanText(node.find(".SubTitle").first().text()) || "فوتسال";
    const imageSrc = node.find("img").attr("src");
    const resolvedImage = absoluteUrl(imageSrc);
    const imageUrl = resolvedImage;
    const slug = createArticleSlug(id, title);

    slides.set(id, {
      id,
      slug,
      title,
      excerpt,
      category: category || "فوتسال",
      sport: inferSport(`${title} ${category}`),
      publishedAt: new Date().toISOString(),
      sourceUrl: href,
      imageUrl,
    });
  });

  return Array.from(slides.values()).slice(0, 6);
}

function mapLocalNews(items: typeof localNews): Article[] {
  return items.map((item) => ({
    id: item.id,
    slug: item.slug,
    title: item.title,
    excerpt: item.summary ?? "",
    category: item.category,
    sport: inferSport(item.category),
    publishedAt: item.publishDate,
    imageUrl: item.image,
  }));
}

function parseLatestArticles($: CheerioRoot, excludeIds: string[]) {
  const exclude = new Set(excludeIds);
  const collected: Article[] = [];
  const seen = new Set<string>();

  $("a[href*='/fullcontent/']").each((_, element) => {
    const anchor = $(element);
    const href = absoluteUrl(anchor.attr("href"));
    const id = extractIdFromHref(href);
    if (!href || !id || seen.has(id) || exclude.has(id)) return;

    const title = cleanText(anchor.text());
    if (!title) return;

    const wrapper = anchor.closest("div, li");
    const excerpt =
      cleanText(wrapper.find(".Abstact").first().text()) ||
      cleanText(wrapper.find("p").not(":has(a)").first().text()) ||
      "";
    const category =
      cleanText(wrapper.find(".category, .SubTitle, .tag, .section-title").first().text()) ||
      "اخبار";
    const imageSrc = wrapper.find("img").first().attr("src");
    const resolvedImage = absoluteUrl(imageSrc);
    const imageUrl = resolvedImage || ACS_FALLBACK_IMAGE;
    const slug = createArticleSlug(id, title);

    collected.push({
      id,
      slug,
      title,
      excerpt,
      category,
      sport: inferSport(`${title} ${category}`),
      publishedAt: new Date().toISOString(),
      sourceUrl: href,
      imageUrl,
    });
    seen.add(id);
  });

  return collected;
}

function dedupeArticles(items: Article[]) {
  const uniques = new Map<string, Article>();
  items.forEach((article) => {
    if (!uniques.has(article.id)) {
      uniques.set(article.id, article);
    }
  });
  return Array.from(uniques.values());
}

function ensureMinimumArticles(primary: Article[], fallback: Article[], minCount: number, maxCount?: number) {
  const merged = dedupeArticles([...primary, ...fallback]);
  const upperBound = typeof maxCount === "number" ? Math.min(maxCount, merged.length) : merged.length;
  const desired = Math.max(minCount, upperBound);
  return merged.slice(0, Math.min(desired, merged.length));
}

const INVALID_TITLE_TOKENS = ["Crop"];
const INVALID_FIELD_VALUES = ["-", "—", ""];

function isPlaceholder(value: string | undefined) {
  const normalized = (value ?? "").trim();
  return INVALID_FIELD_VALUES.includes(normalized);
}

function hasInvalidToken(value: string | undefined) {
  if (!value) return false;
  return INVALID_TITLE_TOKENS.some((token) => value.includes(token));
}

function hasInvalidTeamSlot(value: string | undefined) {
  if (!value || !value.includes(" - ")) return false;
  return value.split(" - ").some((part) => isPlaceholder(part));
}

function normalizeCategory(article: Article) {
  return article.sport === "beach" ? "فوتبال ساحلی" : "فوتسال";
}

function collectValidSlides(items: Article[]) {
  return items
    .map((item) => {
      // فقط اسلایدهایی با تصویر معتبر وارد هرو شوند تا اسلاید خالی نداشته باشیم.
      // Only accept slides with valid images to prevent empty hero slides.
      if (isPlaceholder(item.title) || isPlaceholder(item.publishedAt) || isPlaceholder(item.slug)) return null;
      if (!item.imageUrl || !item.imageUrl.trim() || !item.imageUrl.startsWith("http")) return null;
      if (hasInvalidToken(item.title) || hasInvalidToken(item.category)) return null;
      if (hasInvalidTeamSlot(item.title)) return null;
      return {
        ...item,
        title: item.title.trim(),
        category: normalizeCategory(item),
        imageUrl: item.imageUrl?.trim() || ACS_FALLBACK_IMAGE,
      };
    })
    .filter((item): item is Article => Boolean(item));
}
