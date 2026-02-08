import { load } from "cheerio";
import { ACS_FALLBACK_IMAGE } from "./constants";
import { logWarnOnce } from "./logger";
import { absoluteUrl, cleanText, extractIdFromSlug, fetchWithRetry } from "./utils";

export type ArticleDetail = {
  slug: string;
  title: string;
  category: string;
  publishedAt: string;
  imageUrl: string;
  paragraphs: string[];
};

export async function getArticleDetail(slug: string): Promise<ArticleDetail> {
  const articleId = extractIdFromSlug(slug);
  if (!articleId) {
    throw new Error(`Invalid slug: ${slug}`);
  }

  try {
    const response = await fetchWithRetry(`/fullcontent/${articleId}/`);
    if (!response) {
      logWarnOnce("article-detail", `ACS fetch skipped for ${slug}; returning minimal fallback.`);
      return {
        slug,
        title: "گزارش ویژه",
        category: "اخبار",
        publishedAt: new Date().toLocaleDateString("fa-IR"),
        imageUrl: ACS_FALLBACK_IMAGE,
        paragraphs: ["متن در حال بارگذاری است یا در دسترس نیست."],
      };
    }
    const html = await response.text();
    const $ = load(html);
    const title = cleanText($(".Title").first().text()) || cleanText($("h1").first().text());
    const category =
      cleanText($(".breadcrumb a").last().text()) || cleanText($(".SubTitle").first().text()) || "اخبار";
    const dateText =
      cleanText($(".fa-num").first().text()) ||
      cleanText($(".meta .date").first().text()) ||
      new Date().toLocaleDateString("fa-IR");
    const imgCandidate =
      absoluteUrl($(".img-responsive").first().attr("src")) ||
      absoluteUrl($("#ctl00_cphMain_imgNews").attr("src"));
    const paragraphs = collectParagraphs($);

    return {
      slug,
      title: title || "گزارش ویژه",
      category,
      publishedAt: dateText,
      imageUrl: imgCandidate || ACS_FALLBACK_IMAGE,
      paragraphs: paragraphs.length ? paragraphs : ["متن کامل در دسترس نیست. به‌زودی تکمیل خواهد شد."],
    };
  } catch (error) {
    logWarnOnce("article-detail", `Falling back to cached text for ${slug}`, error);
    throw error;
  }
}

function collectParagraphs($: ReturnType<typeof load>) {
  const containers = [
    $("#ctl00_cphMain_lblBody"),
    $(".Abstact").parent(),
    $(".articleBody"),
    $(".article-body"),
  ];
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
