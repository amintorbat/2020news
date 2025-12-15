"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { NewsArticle } from "@/data/content";

type SearchModalProps = {
  open: boolean;
  onClose: () => void;
  articles: NewsArticle[];
  initialQuery?: string;
};

export function SearchModal({ open, onClose, articles, initialQuery = "" }: SearchModalProps) {
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const filtered = useMemo(() => {
    if (!query.trim()) return articles;
    const term = query.trim().toLowerCase();
    return articles.filter((article) => {
      const haystack = `${article.title} ${article.summary} ${article.category}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [articles, query]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#020817]/95 backdrop-blur">
      <div className="container mt-12 w-full max-w-3xl flex-1 pb-12">
        <div className="flex items-center justify-between">
          <p className="text-base font-semibold text-white/70">جستجوی سریع در اخبار</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن پنجره جستجو"
            className="rounded-full border border-white/10 p-2 text-white/60 hover:text-white"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path d="M6 6 18 18M18 6 6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4">
          <label className="flex items-center gap-3">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-white/50" aria-hidden="true">
              <path
                d="M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Zm9 3-5-5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              autoFocus
              placeholder="عنوان، تیم یا رویداد را وارد کنید"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="flex-1 bg-transparent text-base text-white placeholder-white/40 focus:outline-none"
            />
          </label>
        </div>

        <div className="mt-6 flex-1 overflow-y-auto rounded-3xl border border-white/5 bg-white/5 p-4">
          {filtered.length === 0 ? (
            <p className="py-20 text-center text-sm text-white/60">عبارتی با این مشخصات ثبت نشده است.</p>
          ) : (
            <ul className="space-y-3">
              {filtered.map((article) => (
                <li key={article.id}>
                  <Link
                    href={`/news/${article.slug}`}
                    onClick={onClose}
                    className="flex flex-col gap-2 rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-right"
                  >
                    <span className="text-xs text-primary">{article.category}</span>
                    <p className="text-base font-bold text-white">{article.title}</p>
                    <p className="text-sm text-white/60">{article.summary}</p>
                    <span className="text-xs text-white/50">{article.timeAgo}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
