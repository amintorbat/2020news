"use client";

import { useState } from "react";
import type { LeagueKey, WeeklyMatch } from "@/lib/data";
import { leagueOptions, weeklyMatches } from "@/lib/data";
import { cn } from "@/lib/cn";

type SchedulePreviewProps = {
  schedule?: Record<LeagueKey, WeeklyMatch[]>;
};

export function SchedulePreview({ schedule = weeklyMatches }: SchedulePreviewProps) {
  const [active, setActive] = useState<LeagueKey>("futsal");
  const matches = schedule[active] ?? [];

  return (
    <section className="container space-y-5" dir="rtl">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[var(--foreground)]">برنامه این هفته</h2>
        <span className="text-xs text-[var(--muted)]">فصل جاری</span>
      </div>
      <div className="flex gap-3">
        {leagueOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setActive(option.id)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-semibold transition",
              active === option.id ? "bg-amber-500 text-white shadow" : "bg-slate-100 text-[var(--muted)] hover:text-brand"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
      {matches.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {matches.map((match) => (
            <article key={match.id} className="rounded-3xl border border-[var(--border)] bg-white p-4 shadow-card">
              <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                <span>{match.date}</span>
                <span>{match.time}</span>
              </div>
              <div className="mt-3 text-right text-[var(--foreground)]">
                <p className="text-lg font-bold">{match.opponent}</p>
                <p className="text-xs text-[var(--muted)]">{match.venue}</p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="rounded-3xl border border-dashed border-[var(--border)] p-6 text-center text-sm text-[var(--muted)]">
          برنامه‌ای برای این هفته ثبت نشده است.
        </p>
      )}
      <div className="flex justify-start text-sm font-semibold text-brand">
        <a href={`/matches?league=${active}`}>مشاهده برنامه کامل</a>
      </div>
    </section>
  );
}
