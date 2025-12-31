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
        <h2 className="text-lg font-bold text-slate-900 lg:text-base" style={{ color: '#0f172a' }}>برنامه این هفته</h2>
        <span className="text-xs text-slate-600">فصل جاری</span>
      </div>
      <div className="flex items-center gap-3">
        <label className="text-sm font-semibold text-slate-900 lg:text-xs">
          رشته:
          <select
            value={active}
            onChange={(e) => setActive(e.target.value as LeagueKey)}
            className="mr-2 mt-1 rounded-xl border border-[var(--border)] bg-white px-3 py-1.5 text-sm text-slate-900 focus:border-brand focus:outline-none lg:px-2 lg:py-1 lg:text-xs"
          >
            {leagueOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      {displayMatches.length ? (
        <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-1">
          {displayMatches.map((match) => (
            <article key={match.id} className="rounded-2xl border border-[var(--border)] bg-white p-3 shadow-sm transition hover:shadow-md sm:p-4 lg:rounded-xl lg:p-3">
              <div className="flex items-center justify-between text-xs text-slate-600 sm:text-sm">
                <span className="font-medium">{match.date}</span>
                <span className="font-semibold text-slate-700">{match.time}</span>
              </div>
              <div className="mt-2.5 text-right sm:mt-3">
                <p className="text-base font-bold text-slate-900 sm:text-lg lg:text-base">{match.opponent}</p>
                <p className="mt-1 text-xs text-slate-600 sm:text-sm lg:text-xs">{match.venue}</p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-[var(--border)] bg-white p-4 text-center text-sm text-slate-600 sm:p-6">
          برنامه‌ای برای این هفته ثبت نشده است.
        </p>
      )}
      <div className="flex justify-start text-sm font-semibold text-brand lg:text-xs">
        <a href={`/matches?league=${active}`} className="text-blue-600 hover:text-blue-600">
          مشاهده برنامه کامل
        </a>
      </div>
    </section>
  );
}
