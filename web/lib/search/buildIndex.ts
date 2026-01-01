/**
 * Build search index from mock data
 * This will be replaced with DB queries later
 */

import type { SearchDocument } from "./types";
import { heroSlides, latestNews } from "@/lib/mock/home";
import { latestNews as dataLatestNews } from "@/data/mock/news";

/**
 * Convert mock news data to SearchDocument
 */
export function buildIndex(): SearchDocument[] {
  const documents: SearchDocument[] = [];

  // Add hero slides
  for (const slide of heroSlides) {
    documents.push({
      id: `hero-${slide.id}`,
      type: "news",
      title: slide.title,
      excerpt: slide.excerpt,
      href: slide.href,
      dateISO: new Date().toISOString(), // Mock date
      category: slide.category,
      tags: [slide.category],
      imageUrl: slide.imageUrl,
    });
  }

  // Add latest news from home mock
  for (const news of latestNews) {
    documents.push({
      id: `news-${news.id}`,
      type: "news",
      title: news.title,
      excerpt: news.excerpt,
      href: news.href,
      dateISO: new Date().toISOString(), // Mock date
      category: news.category,
      tags: [news.category],
      imageUrl: news.imageUrl,
    });
  }

  // Add latest news from data mock
  for (const news of dataLatestNews) {
    documents.push({
      id: `news-data-${news.id}`,
      type: "news",
      title: news.title,
      excerpt: news.summary,
      href: `/news/${news.slug}`,
      dateISO: new Date().toISOString(), // Mock date
      category: news.category,
      tags: [news.category],
      imageUrl: news.image,
    });
  }

  return documents;
}

