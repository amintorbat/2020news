"use client";

import { useState } from "react";
import Link from "next/link";
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
    <section className={cn(container && "container", "space-y-6 lg:space-y-4", className)} dir="rtl">
      <div className="card p-3 sm:p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="!text-slate-900 text-lg font-bold text-slate-900 lg:text-base">جدول گلزنان</h2>
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

        <div>
          {rows.length ? (
            <div className="rounded-2xl border border-[var(--border)] bg-white overflow-hidden">
              <table className="w-full text-sm">
                <thead className="text-xs">
                  <tr>
                    <th className="px-3 py-2.5 text-center font-semibold text-slate-900">رتبه</th>
                    <th className="px-3 py-2.5 text-right font-semibold text-slate-900">بازیکن</th>
                    <th className="px-3 py-2.5 text-right font-semibold text-slate-900">تیم</th>
                    <th className="px-3 py-2.5 text-center font-semibold text-slate-900">گل</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(0, 5).map((player) => (
                    <tr key={player.rank} className="transition hover:bg-slate-50">
                      <td className="px-3 py-2.5 text-center text-sm text-slate-900">{player.rank}</td>
                      <td className="px-3 py-2.5 text-right text-sm font-semibold text-slate-900">{player.player}</td>
                      <td className="px-3 py-2.5 text-right text-sm text-slate-900">{player.team}</td>
                      <td className="px-3 py-2.5 text-center text-sm font-semibold text-brand">{player.goals}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-[var(--border)] bg-white p-4 text-center text-sm text-slate-900">
              اطلاعات گلزنان برای این لیگ موجود نیست.
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <Link
            href={`/scorers/${active === "beach" ? "beach-soccer" : "futsal"}`}
            className="inline-flex text-sm font-semibold text-brand hover:text-brand lg:text-xs"
          >
            مشاهده برترین‌ها
          </Link>
        </div>
      </div>
    </section>
  );
}
