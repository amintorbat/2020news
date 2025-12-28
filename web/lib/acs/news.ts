// This module fetches and sanitizes full news articles for the detail page.
import { load } from "cheerio";
import type { Element } from "domhandler";
import { ACS_BASE_URL } from "./constants";
import { logWarnOnce } from "./logger";
import { absoluteUrl, cleanText, extractIdFromSlug, fetchWithRetry } from "./utils";
import { NewsDetail } from "@/types/news";

type CheerioRoot = ReturnType<typeof load>;
type CheerioSelection = ReturnType<CheerioRoot>;

const BODY_CONTAINER_SELECTORS = [
  "#ctl00_cphMain_lblBody",
  ".articleBody",
  ".article-body",
  ".news-body",
  ".content",
];

const PARAGRAPH_CONTAINER_SELECTORS = [
  "#ctl00_cphMain_lblBody",
  ".articleBody",
  ".article-body",
  ".news-body",
];

const EXCLUDED_CONTAINER_SELECTORS = [
  "[class*='ads']",
  "[class*='ad-']",
  "[id*='ad']",
  "[class*='banner']",
  "[class*='trust']",
  "[id*='trust']",
  "nav",
  "aside",
  "footer",
  ".sidebar",
  ".widget",
  ".advert",
  ".ad",
  ".banner",
  ".trust",
  ".badge",
];

const EXCLUDED_IMAGE_HOSTS = new Set(["trustseal.e-rasaneh.ir"]);
const IMAGE_FILENAME_HINTS = ["logo", "icon", "badge", "trust", "seal", "ads", "banner"];
const REQUIRED_CONTENT_PATHS = ["uploads", "news", "media"];
const MIN_FEATURED_IMAGE_SIZE = 300;

const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "ul",
  "ol",
  "li",
  "h2",
  "h3",
  "h4",
  "blockquote",
  "img",
  "a",
  "figure",
  "figcaption",
]);

const BODY_CLASS_MAP: Record<string, string> = {
  p: "text-[var(--muted)] leading-8",
  h2: "text-lg font-semibold text-[var(--foreground)] mt-6",
  h3: "text-base font-semibold text-[var(--foreground)] mt-5",
  h4: "text-sm font-semibold text-[var(--foreground)] mt-4",
  ul: "list-disc pr-5 space-y-2 text-[var(--muted)]",
  ol: "list-decimal pr-5 space-y-2 text-[var(--muted)]",
  li: "leading-8",
  blockquote: "border-r-4 border-[var(--border)] pr-4 text-[var(--muted)] italic",
  img: "w-full rounded-2xl border border-[var(--border)]",
  figure: "space-y-3",
  figcaption: "text-xs text-[var(--muted)]",
  a: "text-brand underline underline-offset-4",
};

export async function getNewsDetail(slug: string): Promise<NewsDetail> {
  const articleId = extractIdFromSlug(slug);
  if (!articleId) {
    throw new Error(`Invalid slug: ${slug}`);
  }

  try {
    const response = await fetchWithRetry(`/fullcontent/${articleId}/`);
    const html = await response.text();
    const $ = load(html);

    const title = cleanText($(".Title").first().text()) || cleanText($("h1").first().text()) || "گزارش ویژه";
    const category =
      cleanText($(".breadcrumb a").last().text()) || cleanText($(".SubTitle").first().text()) || "اخبار";
    const publishedAt =
      cleanText($(".fa-num").first().text()) ||
      cleanText($(".meta .date").first().text()) ||
      new Date().toLocaleDateString("fa-IR");
    const lead =
      cleanText($(".Lead").first().text()) ||
      cleanText($(".lead").first().text()) ||
      cleanText($(".Abstact").first().text()) ||
      "";

    const { bodyHtml: rawBodyHtml, featuredImage } = extractBodyAndFeaturedImage($);
    const imageUrl = featuredImage ? featuredImage.src : null;
    const bodyHtml = sanitizeBodyHtml(rawBodyHtml) || buildParagraphsHtml($);

    return {
      slug,
      title,
      category,
      publishedAt,
      imageUrl,
      lead,
      bodyHtml,
      sourceUrl: `${ACS_BASE_URL}/fullcontent/${articleId}/`,
      tags: collectTags($),
      teams: collectTeams($),
    };
  } catch (error) {
    logWarnOnce("news-detail", `Falling back to safe detail for ${slug}`, error);
    throw error;
  }
}

function extractBodyAndFeaturedImage($: CheerioRoot) {
  const bodyContainer = pickBodyContainer($);
  if (!bodyContainer) {
    return { bodyHtml: "", featuredImage: null };
  }

  const containerHtml = bodyContainer.html() ?? "";
  const local = load(`<div id="article-root">${containerHtml}</div>`, { decodeEntities: false });
  const root = local("#article-root");

  const featuredFromFigure = findFeaturedImageInFigures(local, root);
  if (featuredFromFigure) {
    return { bodyHtml: root.html() ?? "", featuredImage: featuredFromFigure };
  }

  const featuredAfterLead = findFeaturedImageAfterLead(local, root);
  return { bodyHtml: root.html() ?? "", featuredImage: featuredAfterLead };
}

function buildParagraphsHtml($: CheerioRoot) {
  const paragraphs = collectParagraphs($);
  if (!paragraphs.length) {
    return "<p>متن کامل در دسترس نیست.</p>";
  }
  return paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
}

function collectParagraphs($: CheerioRoot) {
  const containers = PARAGRAPH_CONTAINER_SELECTORS.map((selector) => $(selector));
  const paragraphs: string[] = [];

  containers.forEach((container) => {
    if (!container || !container.length) return;
    container
      .find("p")
      .each((_, element) => {
        const text = cleanText($(element).text());
        if (text.length > 0) {
          paragraphs.push(text);
        }
      });
  });

  if (!paragraphs.length) {
    const fallbackText = cleanText(containers[0].text());
    if (fallbackText) {
      paragraphs.push(fallbackText);
    }
  }

  return paragraphs;
}

function collectTags($: CheerioRoot) {
  const tags = new Set<string>();
  $(".tags a, .tag a, .news-tags a, .news-tags span").each((_, element) => {
    const text = cleanText($(element).text());
    if (text) {
      tags.add(text);
    }
  });
  return Array.from(tags);
}

function collectTeams($: CheerioRoot) {
  const teams = new Set<string>();
  $(".teams a, .team a, .news-team a, .news-team span").each((_, element) => {
    const text = cleanText($(element).text());
    if (text) {
      teams.add(text);
    }
  });
  return Array.from(teams);
}

function sanitizeBodyHtml(rawHtml: string) {
  if (!rawHtml) return "";
  const $ = load(`<div id="root">${rawHtml}</div>`, { decodeEntities: false });
  const root = $("#root");

  root.find(EXCLUDED_CONTAINER_SELECTORS.join(", ")).remove();
  root.find("script, style, iframe, noscript, form, input, button, textarea, select, svg").remove();

  root.find("*").each((_, element) => {
    if (element.type !== "tag") return;
    const node = $(element);
    const tagName = element.tagName.toLowerCase();

    if (!ALLOWED_TAGS.has(tagName)) {
      node.replaceWith(node.contents());
      return;
    }

    const allowedAttrs = new Set<string>();
    if (tagName === "a") {
      allowedAttrs.add("href");
      allowedAttrs.add("title");
    }
    if (tagName === "img") {
      allowedAttrs.add("src");
      allowedAttrs.add("alt");
      allowedAttrs.add("title");
      allowedAttrs.add("loading");
      allowedAttrs.add("decoding");
    }

    Object.keys(element.attribs ?? {}).forEach((attr) => {
      if (attr.startsWith("on") || attr === "style" || attr === "class") {
        node.removeAttr(attr);
        return;
      }
      if (!allowedAttrs.has(attr)) {
        node.removeAttr(attr);
      }
    });

    if (tagName === "a") {
      const href = (node.attr("href") ?? "").trim();
      const normalized = normalizeHref(href);
      if (!normalized || isForbiddenHref(normalized)) {
        node.removeAttr("href");
      } else {
        node.attr("href", normalized);
        node.attr("target", "_blank");
        node.attr("rel", "noopener noreferrer");
      }
    }

    if (tagName === "img") {
      const src = (node.attr("src") ?? "").trim();
      const normalized = normalizeSrc(src);
      if (!normalized) {
        node.remove();
        return;
      }
      node.attr("src", normalized);
      node.attr("loading", "lazy");
      node.attr("decoding", "async");
      if (!node.attr("alt")) {
        node.attr("alt", "");
      }
    }

    const className = BODY_CLASS_MAP[tagName];
    if (className) {
      node.attr("class", className);
    }
  });

  return root.html() ?? "";
}

function pickBodyContainer($: CheerioRoot) {
  for (const selector of BODY_CONTAINER_SELECTORS) {
    const candidate = $(selector).first();
    if (!candidate.length) continue;
    if (cleanText(candidate.text()) || candidate.find("img").length > 0) {
      return candidate;
    }
  }
  return null;
}

function isInExcludedContainer(node: CheerioSelection) {
  const selector = EXCLUDED_CONTAINER_SELECTORS.join(", ");
  return node.closest(selector).length > 0;
}

function isExcludedImageHost(src: string) {
  const host = getHost(src);
  return Boolean(host && EXCLUDED_IMAGE_HOSTS.has(host));
}

function isLikelyIconOrBadge(src: string, element: Element) {
  const filename = src.split("?")[0]?.split("#")[0]?.split("/").pop() ?? "";
  const hint = `${filename} ${(element.attribs?.class ?? "").toLowerCase()} ${(element.attribs?.id ?? "").toLowerCase()}`.toLowerCase();
  if (IMAGE_FILENAME_HINTS.some((token) => hint.includes(token))) {
    return true;
  }
  const width = toNumber(element.attribs?.width ?? element.attribs?.["data-width"] ?? element.attribs?.["data-naturalwidth"]);
  const height = toNumber(element.attribs?.height ?? element.attribs?.["data-height"] ?? element.attribs?.["data-naturalheight"]);
  if (width && width < MIN_FEATURED_IMAGE_SIZE) return true;
  if (height && height < MIN_FEATURED_IMAGE_SIZE) return true;
  return false;
}

function hasRequiredContentPath(src: string) {
  const normalized = src.toLowerCase();
  return REQUIRED_CONTENT_PATHS.some((segment) => normalized.includes(`/${segment}`));
}

function hasExcludedTokens(src: string) {
  const normalized = src.toLowerCase();
  return IMAGE_FILENAME_HINTS.some((token) => normalized.includes(token));
}

function findFeaturedImageInFigures(local: CheerioRoot, root: CheerioSelection) {
  const figures = root.find("figure img");
  for (const element of figures.toArray()) {
    if (element.type !== "tag") continue;
    const node = local(element);
    const candidate = buildFeaturedCandidate(node, element);
    if (!candidate) continue;
    // EN: remove the selected figure image to avoid duplication in body.
    // FA: تصویر انتخاب‌شده از بدنه حذف می‌شود تا دوبار نمایش داده نشود.
    node.closest("figure").remove();
    return candidate;
  }
  return null;
}

function findFeaturedImageAfterLead(local: CheerioRoot, root: CheerioSelection) {
  const leadNode = root.find(".lead, .Lead, p").first();
  if (!leadNode.length) return null;
  const leadElement = leadNode.get(0);
  if (!leadElement) return null;

  let isAfterLead = false;
  for (const element of root.find("*").toArray()) {
    if (element.type !== "tag") continue;
    if (element === leadElement) {
      isAfterLead = true;
      continue;
    }
    if (!isAfterLead) continue;
    if (element.tagName !== "img") continue;
    const node = local(element);
    const candidate = buildFeaturedCandidate(node, element);
    if (!candidate) continue;
    // EN: remove the selected image from body to prevent duplicated media.
    // FA: برای جلوگیری از تکرار تصویر، آن را از بدنه حذف می‌کنیم.
    if (node.closest("figure").length) {
      node.closest("figure").remove();
    } else {
      node.remove();
    }
    return candidate;
  }
  return null;
}

function buildFeaturedCandidate(node: CheerioSelection, element: Element) {
  if (isInExcludedContainer(node)) return null;
  const src = (node.attr("src") ?? "").trim();
  const normalized = normalizeSrc(src);
  if (!normalized) return null;
  if (!hasRequiredContentPath(normalized)) return null;
  if (hasExcludedTokens(normalized)) return null;
  if (isExcludedImageHost(normalized)) return null;
  if (isLikelyIconOrBadge(normalized, element)) return null;

  const width = toNumber(element.attribs?.width ?? element.attribs?.["data-width"] ?? element.attribs?.["data-naturalwidth"]);
  const naturalWidth = toNumber(element.attribs?.["data-naturalwidth"] ?? element.attribs?.["data-natural-width"]);
  const effectiveWidth = width ?? naturalWidth ?? null;
  if (!effectiveWidth || effectiveWidth < MIN_FEATURED_IMAGE_SIZE) return null;

  return {
    src: normalized,
    alt: (node.attr("alt") ?? "").trim(),
  };
}

function toNumber(value?: string) {
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function getHost(value: string) {
  try {
    return new URL(value).host;
  } catch {
    return "";
  }
}

function normalizeHref(href: string) {
  if (!href) return "";
  if (href.startsWith("#")) return href;
  if (href.startsWith("javascript:")) return "";
  return href.startsWith("http") ? href : absoluteUrl(href);
}

function isForbiddenHref(href: string) {
  if (!href) return true;
  if (href.startsWith("#")) return false;
  return href.includes(ACS_BASE_URL) || href.includes("2020news.ir");
}

function normalizeSrc(src: string) {
  if (!src) return "";
  if (src.startsWith("data:") || src.startsWith("javascript:")) return "";
  const resolved = src.startsWith("http") ? src : absoluteUrl(src);
  return resolved.startsWith("http") ? resolved : "";
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
