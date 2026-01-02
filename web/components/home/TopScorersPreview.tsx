"use client";

import { useState } from "react";
import Link from "next/link";
import type { LeagueKey, TopScorer } from "@/lib/data";
import { leagueOptions } from "@/lib/data";
import { CompetitionTypeFilter, type CompetitionType } from "@/components/filters/CompetitionTypeFilter";
import { cn } from "@/lib/cn";

type TopScorersPreviewProps = {
  scorers: Record<LeagueKey, TopScorer[]>;
  container?: boolean;
  className?: string;
};

export function TopScorersPreview({ scorers, container = true, className }: TopScorersPreviewProps) {
  const [active, setActive] = useState<LeagueKey>("futsal");
  const [selectedCompetitionType, setSelectedCompetitionType] = useState<CompetitionType>("all");
  const rows = scorers[active] ?? [];

  return (
    <section className={cn(container && "container", "space-y-6 lg:space-y-4", className)} dir="rtl">
      <div className="card p-3 sm:p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="!text-slate-900 text-lg font-bold text-slate-900 lg:text-base">جدول گلزنان</h2>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-xs font-semibold text-slate-900 sm:text-sm">
            <span>رشته:</span>
            <select
              value={active}
              onChange={(e) => setActive(e.target.value as LeagueKey)}
              className="w-full rounded-lg border border-[var(--border)] bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-brand focus:outline-none sm:px-3 sm:py-2 sm:text-sm"
            >
              {leagueOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <CompetitionTypeFilter
            value={selectedCompetitionType}
            onChange={setSelectedCompetitionType}
            size="sm"
          />
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
