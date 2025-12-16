"use client";

import Link from "next/link";
import { useState } from "react";
import { weeklyMatches } from "@/data/mock/matches";
import { cn } from "@/lib/cn";

const tabs = [
  { id: "futsal", label: "فوتسال" },
  { id: "beach", label: "فوتبال ساحلی" },
] as const;

type TabKey = (typeof tabs)[number]["id"];

export function MatchesTabs() {
  const [active, setActive] = useState<TabKey>("futsal");
  const matches = weeklyMatches[active];

  return (
    <section className="container space-y-6" id="weekly">
      <header className="space-y-1">
        <p className="section-subtitle">برنامه این هفته</p>
        <h2 className="section-title">بازی‌ها و نتایج</h2>
      </header>

      <div className="flex flex-wrap gap-3" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active === tab.id}
            onClick={() => setActive(tab.id)}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-semibold",
              active === tab.id ? "bg-brand text-white" : "bg-slate-100 text-[var(--muted)]"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {matches.map((match) => (
          <article key={match.id} className="rounded-3xl border border-[var(--border)] bg-white p-5 shadow-card" dir="rtl">
            <div className="flex items-center justify-between text-xs text-[var(--muted)]">
              <span>{match.note}</span>
              <span>{match.date}</span>
            </div>
            <h3 className="mt-3 text-lg font-bold text-[var(--foreground)]">{match.title}</h3>
            <div className="mt-3 flex items-center justify-between text-sm text-[var(--muted)]">
              <span>{match.venue}</span>
              <span>{match.time}</span>
            </div>
          </article>
        ))}
      </div>

      <div className="flex justify-end">
        <Link href="/matches" className="inline-flex items-center gap-2 text-sm font-semibold text-brand">
          مشاهده صفحه کامل
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="m9 6 6 6-6 6" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
