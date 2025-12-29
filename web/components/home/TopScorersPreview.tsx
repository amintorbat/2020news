"use client";

import { useState } from "react";
import type { LeagueKey, TopScorer } from "@/lib/data";
import { leagueOptions } from "@/lib/data";
import { cn } from "@/lib/cn";

type TopScorersPreviewProps = {
  scorers: Record<LeagueKey, TopScorer[]>;
  container?: boolean;
  className?: string;
};

export function TopScorersPreview({ scorers, container = true, className }: TopScorersPreviewProps) {
  const [active, setActive] = useState<LeagueKey>("futsal");
  const rows = scorers[active] ?? [];

  return (
    <section className={cn(container && "container", "space-y-5 lg:space-y-3", className)} dir="rtl">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 lg:text-base">جدول گلزنان</h2>
        <span className="text-xs text-slate-400">به‌روزرسانی: امروز</span>
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
      <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-white shadow-card">
        {rows.length ? (
          <table className="w-full text-sm text-right lg:text-xs">
            <thead className="bg-[#f7f8fa] text-xs text-slate-400 lg:text-[11px]">
              <tr>
                <th className="py-3 text-center lg:py-2">رتبه</th>
                <th className="py-3 text-right lg:py-2">بازیکن</th>
                <th className="py-3 text-right lg:py-2">تیم</th>
                <th className="py-3 text-center lg:py-2">گل</th>
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 5).map((player) => (
                <tr key={player.rank} className="text-slate-900">
                  <td className="py-3 text-center font-bold lg:py-2">{player.rank}</td>
                  <td className="py-3 text-right font-semibold lg:py-2">{player.player}</td>
                  <td className="py-3 text-right text-slate-600 lg:py-2">{player.team}</td>
                  <td className="py-3 text-center font-black text-brand lg:py-2">{player.goals}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="p-6 text-center text-sm text-slate-600">اطلاعات گلزنان برای این لیگ موجود نیست.</p>
        )}
      </div>
      <div className="flex justify-start text-sm font-semibold text-brand lg:text-xs">
        <a href={`/scorers/${active === "beach" ? "beach-soccer" : "futsal"}`}>مشاهده گلزنان کامل</a>
      </div>
    </section>
  );
}
