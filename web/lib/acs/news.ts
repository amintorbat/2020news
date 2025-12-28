/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { load } from "cheerio";
import { ACS_BASE_URL } from "./constants";
import { logWarnOnce } from "./logger";
import {
  absoluteUrl,
  cleanText,
  extractIdFromSlug,
  fetchWithRetry,
} from "./utils";
import { NewsDetail } from "@/types/news";

/* ------------------------------------------------------------------ */
/* constants                                                          */
/* ------------------------------------------------------------------ */

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

const REQUIRED_CONTENT_PATHS = ["uploads", "news", "media"];
const MIN_FEATURED_IMAGE_SIZE = 300;

/* ------------------------------------------------------------------ */
/* public API                                                         */
/* ------------------------------------------------------------------ */

export async function getNewsDetail(slug: string): Promise<NewsDetail> {
  const articleId = extractIdFromSlug(slug);
  if (!articleId) throw new Error(`Invalid slug: ${slug}`);

  try {
    const res = await fetchWithRetry(`/fullcontent/${articleId}/`);
    const html = await res.text();
    const $ = load(html);

    const title =
      cleanText($(".Title").first().text()) ||
      cleanText($("h1").first().text()) ||
      "گزارش ویژه";

    const category = cleanText($(".breadcrumb a").last().text()) || "اخبار";

    const publishedAt =
      cleanText($(".fa-num").first().text()) ||
      new Date().toLocaleDateString("fa-IR");

    const lead =
      cleanText($(".Lead").first().text()) ||
      cleanText($(".lead").first().text()) ||
      "";

    const { bodyHtml, featuredImage } = extractBodyAndFeaturedImage($);

    return {
      slug,
      title,
      category,
      publishedAt,
      lead,
      imageUrl: featuredImage?.src ?? null,
      bodyHtml: bodyHtml || buildParagraphsHtml($),
      sourceUrl: `${ACS_BASE_URL}/fullcontent/${articleId}/`,
      tags: collectTextList($, ".tags a, .tag a"),
      teams: collectTextList($, ".teams a, .team a"),
    };
  } catch (e) {
    logWarnOnce("news-detail", "failed", e);
    throw e;
  }
}

/* ------------------------------------------------------------------ */
/* body + image                                                        */
/* ------------------------------------------------------------------ */

function extractBodyAndFeaturedImage($: any) {
  const body = pickBodyContainer($);
  if (!body) return { bodyHtml: "", featuredImage: null };

  const local = load(`<div>${body.html() ?? ""}</div>`, {
    decodeEntities: false,
  });
  const root = local("div");

  const image = findFeaturedImage(local, root);
  return { bodyHtml: root.html() ?? "", featuredImage: image };
}

function findFeaturedImage(local: any, root: any) {
  const images = root.find("img").toArray();

  for (const el of images) {
    const node = local(el);
    const src = normalizeSrc(node.attr("src") ?? "");
    if (!src) continue;
    if (!hasRequiredContentPath(src)) continue;

    const width = parseInt(node.attr("width") ?? "0", 10);
    if (width && width < MIN_FEATURED_IMAGE_SIZE) continue;

    if (node.closest(EXCLUDED_CONTAINER_SELECTORS.join(",")).length) continue;

    if (node.closest("figure").length) {
      node.closest("figure").remove();
    } else {
      node.remove();
    }

    return { src, alt: node.attr("alt") ?? "" };
  }
  return null;
}

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

function buildParagraphsHtml($: any) {
  const paragraphs: string[] = [];

  for (const sel of PARAGRAPH_CONTAINER_SELECTORS) {
    $(sel)
      .find("p")
      .each((_: any, el: any) => {
        const t = cleanText($(el).text());
        if (t) paragraphs.push(`<p>${escapeHtml(t)}</p>`);
      });
  }

  return paragraphs.join("");
}

function pickBodyContainer($: any) {
  for (const sel of BODY_CONTAINER_SELECTORS) {
    const el = $(sel).first();
    if (el.length && cleanText(el.text())) return el;
  }
  return null;
}

function collectTextList($: any, selector: string) {
  const set = new Set<string>();
  $(selector).each((_: any, el: any) => {
    const t = cleanText($(el).text());
    if (t) set.add(t);
  });
  return [...set];
}

function hasRequiredContentPath(src: string) {
  return REQUIRED_CONTENT_PATHS.some((p) => src.includes(`/${p}`));
}

function normalizeSrc(src: string) {
  if (!src || src.startsWith("data:")) return "";
  return src.startsWith("http") ? src : absoluteUrl(src);
}

function escapeHtml(v: string) {
  return v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
