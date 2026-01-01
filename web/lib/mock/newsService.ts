/**
 * Mock news service to replace ACS
 * Provides mock data for all news-related functionality
 */

import type { Article } from "@/lib/acs/types";
import { latestNews, heroSlides } from "@/lib/mock/home";
import { getMockArticle, getAllMockArticles } from "@/lib/mock/articles";
import type { HomeAcsPayload } from "@/lib/acs/types";

/**
 * Convert mock home data to Article format
 */
function toArticle(item: typeof latestNews[0] | typeof heroSlides[0]): Article {
  return {
    id: String(item.id),
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt,
    publishedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
    category: item.category === "فوتسال" ? "اخبار" : "اخبار",
    sport: item.category === "فوتسال" ? "futsal" : "beach",
    imageUrl: item.imageUrl,
    isFeatured: "isFeatured" in item ? item.isFeatured : false,
  };
}

/**
 * Get home content (replaces getHomeContent from ACS)
 */
export async function getMockHomeContent(): Promise<HomeAcsPayload> {
  const articles: Article[] = [...latestNews, ...heroSlides].map(toArticle);
  
  // Deduplicate by slug
  const uniqueArticles = new Map<string, Article>();
  for (const article of articles) {
    if (!uniqueArticles.has(article.slug)) {
      uniqueArticles.set(article.slug, article);
    }
  }
  
  const allArticles = Array.from(uniqueArticles.values());
  
  return {
    heroSlides: allArticles.filter((a) => a.isFeatured).slice(0, 5),
    latestNews: allArticles,
    liveEvents: [],
    fetchedAt: new Date().toISOString(),
    source: "fallback",
  };
}

/**
 * Get news detail (replaces getNewsDetail from ACS)
 */
export async function getMockNewsDetail(slug: string) {
  const mockArticle = getMockArticle(slug);
  
  if (!mockArticle) {
    throw new Error(`Article not found: ${slug}`);
  }
  
  return {
    slug: mockArticle.slug,
    title: mockArticle.title,
    category: mockArticle.category,
    sport: mockArticle.sport,
    publishedAt: mockArticle.publishedAt,
    imageUrl: mockArticle.imageUrl,
    lead: mockArticle.lead,
    bodyHtml: mockArticle.bodyHtml,
    sourceUrl: "",
    tags: mockArticle.tags,
    teams: mockArticle.teams,
  };
}

/**
 * Get all articles for listing pages
 */
export function getMockAllArticles(): Article[] {
  const allMockArticles = getAllMockArticles();
  const articles: Article[] = allMockArticles.map((article) => ({
    id: article.slug,
    slug: article.slug,
    title: article.title,
    excerpt: article.lead,
    publishedAt: article.publishedAt,
    category: article.category,
    sport: article.sport,
    imageUrl: article.imageUrl,
    isFeatured: allMockArticles.indexOf(article) < 5,
  }));
  
  // Also include articles from home mock
  const homeArticles = [...latestNews, ...heroSlides].map(toArticle);
  
  // Merge: prefer mock articles, fallback to home articles
  const mergedMap = new Map<string, Article>();
  for (const article of articles) {
    mergedMap.set(article.slug, article);
  }
  for (const article of homeArticles) {
    if (!mergedMap.has(article.slug)) {
      mergedMap.set(article.slug, article);
    }
  }
  
  return Array.from(mergedMap.values());
}

