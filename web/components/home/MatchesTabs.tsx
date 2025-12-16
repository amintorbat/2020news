"use client";

import Link from "next/link";
import { useState } from "react";
import { SectionHeader } from "@/components/common/SectionHeader";
import { leagueOptions, weeklyMatches, type LeagueKey } from "@/lib/data";
import { cn } from "@/lib/cn";

export function MatchesTabs() {
  const [active, setActive] = useState<LeagueKey>("futsal");
  const matches = weeklyMatches[active];
  const activeLabel = leagueOptions.find((option) => option.id === active)?.label;

  return (
    <section className="container space-y-6" id="weekly">
      <SectionHeader title="بازی‌ها و نتایج" subtitle="برنامه این هفته" />

      <div className="flex flex-wrap gap-3" role="tablist">
        {leagueOptions.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active === tab.id}
            onClick={() => setActive(tab.id)}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-semibold",
              active === tab.id ? "bg-brand text-white shadow-md" : "bg-slate-100 text-[var(--muted)]"
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
              <span>{match.date}</span>
              <span>{match.time}</span>
            </div>
            <h3 className="mt-3 text-lg font-bold text-[var(--foreground)]">{match.opponent}</h3>
            <div className="mt-3 flex items-center justify-between text-sm text-[var(--muted)]">
              <span>{match.venue}</span>
              <span>{activeLabel}</span>
            </div>
          </article>
        ))}
      </div>

      <div className="flex justify-end">
        <Link href={`/matches?league=${active}`} className="inline-flex text-sm font-semibold text-brand">
          مشاهده صفحه کامل
        </Link>
      </div>
    </section>
  );
}
