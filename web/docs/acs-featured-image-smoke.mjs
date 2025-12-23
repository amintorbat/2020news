import { load } from "cheerio";

const BODY_CONTAINER_SELECTORS = [
  "#ctl00_cphMain_lblBody",
  ".articleBody",
  ".article-body",
  ".news-body",
  ".content",
];

const EXCLUDED_CONTAINER_SELECTORS = [
  "[class*='ads']",
  "[class*='ad-']",
  "[id*='ad']",
  "[class*='banner']",
  "[class*='trust']",
  "[id*='trust']",
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
const MIN_FEATURED_IMAGE_SIZE = 120;

const urls =
  process.argv.slice(2).length > 0
    ? process.argv.slice(2)
    : ["https://2020news.ir/fullcontent/74891/", "https://2020news.ir/fullcontent/74889/"];

async function run() {
  for (const url of urls) {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`[fail] ${url} -> ${response.status}`);
      continue;
    }
    const html = await response.text();
    const $ = load(html);
    const title = cleanText($(".Title").first().text()) || cleanText($("h1").first().text()) || "untitled";
    const { featuredImage, excludedCandidates } = selectFeaturedImage($);
    const host = featuredImage ? new URL(featuredImage).host : "none";
    const excluded = featuredImage ? "no" : excludedCandidates > 0 ? "yes" : "no candidates";
    console.log(`[article] ${title}`);
    console.log(`  url: ${url}`);
    console.log(`  featuredImageHost: ${host}`);
    console.log(`  excluded: ${excluded}`);
  }
}

function selectFeaturedImage($) {
  const bodyContainer = pickBodyContainer($);
  if (!bodyContainer) return { featuredImage: null, excludedCandidates: 0 };
  let excludedCandidates = 0;

  const images = bodyContainer.find("img");
  for (const element of images.toArray()) {
    const node = $(element);
    if (isInExcludedContainer(node)) {
      excludedCandidates += 1;
      continue;
    }
    const src = (node.attr("src") ?? "").trim();
    const normalized = normalizeSrc(src);
    if (!normalized) {
      excludedCandidates += 1;
      continue;
    }
    if (isExcludedImageHost(normalized)) {
      excludedCandidates += 1;
      continue;
    }
    if (isLikelyIconOrBadge(normalized, element)) {
      excludedCandidates += 1;
      continue;
    }
    return { featuredImage: normalized, excludedCandidates };
  }

  return { featuredImage: null, excludedCandidates };
}

function pickBodyContainer($) {
  for (const selector of BODY_CONTAINER_SELECTORS) {
    const candidate = $(selector).first();
    if (!candidate.length) continue;
    if (cleanText(candidate.text()) || candidate.find("img").length > 0) {
      return candidate;
    }
  }
  return null;
}

function isInExcludedContainer(node) {
  const selector = EXCLUDED_CONTAINER_SELECTORS.join(", ");
  return node.closest(selector).length > 0;
}

function isExcludedImageHost(src) {
  try {
    const host = new URL(src).host;
    return EXCLUDED_IMAGE_HOSTS.has(host);
  } catch {
    return false;
  }
}

function isLikelyIconOrBadge(src, element) {
  const filename = src.split("?")[0]?.split("#")[0]?.split("/").pop() ?? "";
  const hint = `${filename} ${(element.attribs?.class ?? "").toLowerCase()} ${(element.attribs?.id ?? "").toLowerCase()}`.toLowerCase();
  if (IMAGE_FILENAME_HINTS.some((token) => hint.includes(token))) {
    return true;
  }
  const width = toNumber(element.attribs?.width);
  const height = toNumber(element.attribs?.height);
  if (width && width < MIN_FEATURED_IMAGE_SIZE) return true;
  if (height && height < MIN_FEATURED_IMAGE_SIZE) return true;
  return false;
}

function normalizeSrc(src) {
  if (!src) return "";
  if (src.startsWith("data:") || src.startsWith("javascript:")) return "";
  if (src.startsWith("http")) return src;
  return `https://2020news.ir${src.startsWith("/") ? src : `/${src}`}`;
}

function cleanText(value) {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

function toNumber(value) {
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

run().catch((error) => {
  console.error("[error]", error);
  process.exitCode = 1;
});
