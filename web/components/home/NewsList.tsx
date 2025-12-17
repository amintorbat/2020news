"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Article, SportType } from "@/lib/acs/types";
import { SectionHeader } from "@/components/common/SectionHeader";
import { cn } from "@/lib/cn";
import { NewsCard } from "./NewsCard";

const tabs: { id: SportType; label: string; href: string }[] = [
  { id: "futsal", label: "فوتسال", href: "/news/futsal" },
  { id: "beach", label: "فوتبال ساحلی", href: "/news/beach-soccer" },
];

export function NewsList({ articles, limit = 4 }: { articles: Article[]; limit?: number }) {
  const grouped = useMemo(() => {
    const map: Record<SportType, Article[]> = { futsal: [], beach: [] };
    articles.forEach((article) => {
      const bucket = article.sport === "beach" ? "beach" : "futsal";
      if (map[bucket].length < limit) {
        map[bucket].push(article);
      }
    });
    return map;
  }, [articles, limit]);
  const [active, setActive] = useState<SportType>("futsal");
  const currentItems = grouped[active];
  if (!articles.length) return null;

  return (
    <section className="container space-y-5" id="news" dir="rtl">
      <SectionHeader title="آخرین اخبار" subtitle="به‌روزرسانی لحظه‌ای از منابع رسمی" />
      <div className="flex gap-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActive(tab.id)}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-semibold transition",
              active === tab.id ? "bg-brand text-white shadow" : "bg-slate-100 text-[var(--muted)] hover:text-brand"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {currentItems.length ? (
        <div className="grid gap-5">
          {currentItems.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <p className="rounded-3xl border border-dashed border-[var(--border)] bg-white p-6 text-center text-sm text-[var(--muted)]">
          خبری برای این دسته در حال حاضر موجود نیست.
        </p>
      )}
      <div className="flex justify-between text-sm font-semibold text-brand">
        <Link href="/news">مشاهده همه اخبار</Link>
        <Link href={tabs.find((tab) => tab.id === active)?.href ?? "/news"}>مشاهده اخبار {tabs.find((tab) => tab.id === active)?.label}</Link>
      </div>
    </section>
  );
}
