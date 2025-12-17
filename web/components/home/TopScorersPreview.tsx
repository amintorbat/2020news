"use client";

import { useState } from "react";
import type { LeagueKey, TopScorer } from "@/lib/data";
import { leagueOptions } from "@/lib/data";
import { cn } from "@/lib/cn";

export function TopScorersPreview({ scorers }: { scorers: Record<LeagueKey, TopScorer[]> }) {
  const [active, setActive] = useState<LeagueKey>("futsal");
  const rows = scorers[active] ?? [];

  return (
    <section className="container space-y-5" dir="rtl">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[var(--foreground)]">جدول گلزنان</h2>
        <span className="text-xs text-[var(--muted)]">به‌روزرسانی: امروز</span>
      </div>
      <div className="flex gap-3">
        {leagueOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setActive(option.id)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-semibold transition",
              active === option.id ? "bg-slate-900 text-white shadow" : "bg-slate-100 text-[var(--muted)] hover:text-brand"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-white shadow-card">
        {rows.length ? (
          <table className="w-full text-sm">
            <thead className="bg-[#f7f8fa] text-xs text-[var(--muted)]">
              <tr>
                <th className="py-3">رتبه</th>
                <th className="py-3 text-right">بازیکن</th>
                <th className="py-3">تیم</th>
                <th className="py-3">گل</th>
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 5).map((player) => (
                <tr key={player.rank} className="text-center text-[var(--foreground)]">
                  <td className="py-3 font-bold">{player.rank}</td>
                  <td className="py-3 text-right font-semibold">{player.player}</td>
                  <td className="py-3 text-[var(--muted)]">{player.team}</td>
                  <td className="py-3 font-black text-brand">{player.goals}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="p-6 text-center text-sm text-[var(--muted)]">اطلاعات گلزنان برای این لیگ موجود نیست.</p>
        )}
      </div>
      <div className="flex justify-start text-sm font-semibold text-brand">
        <a href={`/scorers/${active === "beach" ? "beach-soccer" : "futsal"}`}>مشاهده گلزنان کامل</a>
      </div>
    </section>
  );
}
