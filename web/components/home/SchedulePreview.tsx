"use client";

import { useState } from "react";
import type { LeagueKey, WeeklyMatch } from "@/lib/data";
import { leagueOptions, weeklyMatches } from "@/lib/data";
import { cn } from "@/lib/cn";

const fallbackSchedule: Record<LeagueKey, WeeklyMatch[]> = {
  futsal: [
    {
      id: "fs-mock-1",
      opponent: "گیتی‌پسند - مس سونگون",
      venue: "سالن پیروزی",
      date: "جمعه ۲۵ اسفند",
      time: "۱۹:۳۰",
      league: "futsal",
    },
    {
      id: "fs-mock-2",
      opponent: "سن‌ایچ ساوه - پالایش نفت شازند",
      venue: "سالن انقلاب",
      date: "شنبه ۲۶ اسفند",
      time: "۲۰:۴۵",
      league: "futsal",
    },
    {
      id: "fs-mock-3",
      opponent: "فرش‌آرا - کراپ الوند",
      venue: "سالن شهید بهشتی",
      date: "یکشنبه ۲۷ اسفند",
      time: "۱۸:۰۰",
      league: "futsal",
    },
  ],
  beach: [
    {
      id: "bc-mock-1",
      opponent: "پارس جنوبی - ملوان",
      venue: "ساحل نقره‌ای",
      date: "جمعه ۲۵ اسفند",
      time: "۱۶:۰۰",
      league: "beach",
    },
    {
      id: "bc-mock-2",
      opponent: "ایفا - شاهین خزر",
      venue: "ساحل خزر",
      date: "شنبه ۲۶ اسفند",
      time: "۱۷:۱۵",
      league: "beach",
    },
    {
      id: "bc-mock-3",
      opponent: "شهرداری بندرعباس - آریا بوشهر",
      venue: "ساحل مرجان",
      date: "یکشنبه ۲۷ اسفند",
      time: "۱۸:۳۰",
      league: "beach",
    },
  ],
};

type SchedulePreviewProps = {
  schedule?: Record<LeagueKey, WeeklyMatch[]>;
  container?: boolean;
  className?: string;
};

export function SchedulePreview({ schedule = weeklyMatches, container = true, className }: SchedulePreviewProps) {
  const [active, setActive] = useState<LeagueKey>("futsal");
  const matches = schedule[active] ?? [];
  const displayMatches = matches.length ? matches : fallbackSchedule[active] ?? [];

  return (
    <section className={cn(container && "container", "space-y-5 lg:space-y-3", className)} dir="rtl">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[var(--foreground)] lg:text-base">برنامه این هفته</h2>
        <span className="text-xs text-[var(--muted)]">فصل جاری</span>
      </div>
      <div className="flex gap-3 lg:gap-2">
        {leagueOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setActive(option.id)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-semibold transition lg:px-3 lg:py-1 lg:text-xs",
              active === option.id ? "bg-brand text-white shadow" : "bg-slate-100 text-[var(--muted)] hover:text-brand"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
      {displayMatches.length ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 lg:gap-3">
          {displayMatches.map((match) => (
            <article key={match.id} className="rounded-3xl border border-[var(--border)] bg-white p-4 shadow-card lg:p-3">
              <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                <span>{match.date}</span>
                <span>{match.time}</span>
              </div>
              <div className="mt-3 text-right text-[var(--foreground)]">
                <p className="text-lg font-bold lg:text-base">{match.opponent}</p>
                <p className="text-xs text-[var(--muted)] lg:text-[11px]">{match.venue}</p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="rounded-3xl border border-dashed border-[var(--border)] p-6 text-center text-sm text-[var(--muted)]">
          برنامه‌ای برای این هفته ثبت نشده است.
        </p>
      )}
      <div className="flex justify-start text-sm font-semibold text-brand lg:text-xs">
        <a href={`/matches?league=${active}`}>مشاهده برنامه کامل</a>
      </div>
    </section>
  );
}
