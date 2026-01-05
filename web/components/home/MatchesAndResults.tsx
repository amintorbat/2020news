"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { LeagueKey } from "@/lib/data";
import { leagueOptions } from "@/lib/data";
import { mockMatches, type MatchStatusFilter, type TimeRange, type CompetitionType } from "@/lib/data/matches";
import { filterAndSortMatches, type MatchFilters } from "@/lib/matches/filtering";
import { MatchCard } from "@/components/matches/MatchCard";
import { cn } from "@/lib/cn";

type MatchesAndResultsProps = {
  container?: boolean;
  className?: string;
};

export function MatchesAndResults({ container = true, className }: MatchesAndResultsProps) {
  const [selectedLeague, setSelectedLeague] = useState<LeagueKey>("futsal");
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>("this-week");
  const [selectedStatus, setSelectedStatus] = useState<MatchStatusFilter>("all");
  const [selectedCompetitionType, setSelectedCompetitionType] = useState<CompetitionType | "all">("all");

  const filters: MatchFilters = useMemo(() => ({
    league: selectedLeague,
    timeRange: selectedTimeRange,
    status: selectedStatus,
    competitionType: selectedCompetitionType,
  }), [selectedLeague, selectedTimeRange, selectedStatus, selectedCompetitionType]);

  const filteredMatches = useMemo(() => {
    return filterAndSortMatches(mockMatches, filters);
  }, [filters]);

  // For homepage, show limited matches (3-4) to avoid scrolling
  const displayMatches = filteredMatches.slice(0, 4);

  return (
    <section
      dir="rtl"
      className={cn(
        container && "container",
        "relative isolate w-full overflow-x-hidden text-slate-900 [&_*]:text-slate-900",
        className
      )}
    >
      <div className="card p-3 sm:p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 lg:text-base">برنامه مسابقات</h2>
        </div>

        {/* Filters - Using shared component but with local state */}
        <div className="grid grid-cols-2 gap-4 w-full">
          <label className="flex flex-col gap-2 text-xs font-semibold text-slate-900">
            <span className="text-slate-800 font-semibold">رشته:</span>
            <select
              value={selectedLeague}
              onChange={(e) => setSelectedLeague(e.target.value as LeagueKey)}
              className="w-full rounded-lg border-2 border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              style={{ color: "#0f172a !important", WebkitTextFillColor: "#0f172a !important" }}
            >
              {leagueOptions.map((option) => (
                <option key={option.id} value={option.id} style={{ color: "#0f172a", fontWeight: "600" }}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-xs font-semibold text-slate-900">
            <span className="text-slate-800 font-semibold">بازه زمانی:</span>
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value as TimeRange)}
              className="w-full rounded-lg border-2 border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              style={{ color: "#0f172a !important", WebkitTextFillColor: "#0f172a !important" }}
            >
              <option value="all" style={{ color: "#0f172a", fontWeight: "600" }}>همه</option>
              <option value="today" style={{ color: "#0f172a", fontWeight: "600" }}>امروز</option>
              <option value="tomorrow" style={{ color: "#0f172a", fontWeight: "600" }}>فردا</option>
              <option value="this-week" style={{ color: "#0f172a", fontWeight: "600" }}>این هفته</option>
            </select>
          </label>

          <label className="flex flex-col gap-2 text-xs font-semibold text-slate-900">
            <span className="text-slate-800 font-semibold">وضعیت:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as typeof selectedStatus)}
              className="w-full rounded-lg border-2 border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              style={{ color: "#0f172a !important", WebkitTextFillColor: "#0f172a !important" }}
            >
              <option value="all" style={{ color: "#0f172a", fontWeight: "600" }}>همه</option>
              <option value="live" style={{ color: "#0f172a", fontWeight: "600" }}>زنده</option>
              <option value="finished" style={{ color: "#0f172a", fontWeight: "600" }}>تمام‌شده</option>
              <option value="upcoming" style={{ color: "#0f172a", fontWeight: "600" }}>در انتظار</option>
            </select>
          </label>

          <label className="flex flex-col gap-2 text-xs font-semibold text-slate-900">
            <span className="text-slate-800 font-semibold">نوع مسابقه:</span>
            <select
              value={selectedCompetitionType}
              onChange={(e) => setSelectedCompetitionType(e.target.value as CompetitionType | "all")}
              className="w-full rounded-lg border-2 border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              style={{ color: "#0f172a !important", WebkitTextFillColor: "#0f172a !important" }}
            >
              <option value="all" style={{ color: "#0f172a", fontWeight: "600" }}>همه</option>
              <option value="league" style={{ color: "#0f172a", fontWeight: "600" }}>لیگ</option>
              <option value="cup" style={{ color: "#0f172a", fontWeight: "600" }}>جام</option>
              <option value="international" style={{ color: "#0f172a", fontWeight: "600" }}>بین‌المللی</option>
              <option value="friendly" style={{ color: "#0f172a", fontWeight: "600" }}>دوستانه</option>
            </select>
          </label>
        </div>

        {/* Matches List */}
        {displayMatches.length > 0 ? (
          <div className="space-y-2.5 sm:space-y-3">
            {displayMatches.map((match) => (
              <MatchCard key={match.id} match={match} compact={true} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[var(--border)] bg-white p-4 text-center text-sm text-slate-900">
            بازی‌ای برای این فیلتر یافت نشد.
          </div>
        )}

        {/* CTA - Bottom corner */}
        <div className="flex justify-end">
          <Link
            href={`/matches?league=${selectedLeague}&timeRange=${selectedTimeRange}&status=${selectedStatus}&competitionType=${selectedCompetitionType}`}
            className="!text-brand inline-flex text-sm font-semibold text-brand hover:!text-brand lg:text-xs"
          >
            مشاهده برنامه کامل
          </Link>
        </div>
      </div>
    </section>
  );
}

