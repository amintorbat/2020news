"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { LeagueKey } from "@/lib/data";
import { leagueOptions } from "@/lib/data";
import { mockMatches, timeRangeOptions, statusOptions, type MatchItem, type MatchStatusFilter, type TimeRange } from "@/lib/data/matches";
import { cn } from "@/lib/cn";

type MatchesAndResultsProps = {
  container?: boolean;
  className?: string;
};

export function MatchesAndResults({ container = true, className }: MatchesAndResultsProps) {
  const [selectedLeague, setSelectedLeague] = useState<LeagueKey>("futsal");
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>("this-week");
  const [selectedStatus, setSelectedStatus] = useState<MatchStatusFilter>("all");

  const filteredMatches = useMemo(() => {
    let matches = mockMatches.filter((match) => match.sport === selectedLeague);

    // Filter by time range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() + 7);

    if (selectedTimeRange === "today") {
      matches = matches.filter((match) => {
        const matchDate = new Date(match.dateISO);
        matchDate.setHours(0, 0, 0, 0);
        return matchDate.getTime() === today.getTime();
      });
    } else if (selectedTimeRange === "tomorrow") {
      matches = matches.filter((match) => {
        const matchDate = new Date(match.dateISO);
        matchDate.setHours(0, 0, 0, 0);
        return matchDate.getTime() === tomorrow.getTime();
      });
    } else if (selectedTimeRange === "this-week") {
      matches = matches.filter((match) => {
        const matchDate = new Date(match.dateISO);
        matchDate.setHours(0, 0, 0, 0);
        return matchDate.getTime() >= today.getTime() && matchDate.getTime() < weekEnd.getTime();
      });
    }

    // Filter by status
    if (selectedStatus !== "all") {
      matches = matches.filter((match) => match.status === selectedStatus);
    }

    // Sort: live first, then by date
    return matches.sort((a, b) => {
      if (a.status === "live" && b.status !== "live") return -1;
      if (a.status !== "live" && b.status === "live") return 1;
      return new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime();
    });
  }, [selectedLeague, selectedTimeRange, selectedStatus]);

  // For homepage, show weekly summary (this-week filter)
  const displayMatches = filteredMatches.slice(0, 6);

  return (
    <section dir="rtl" className={cn(container && "container","relative isolate w-full overflow-x-hidden", className)}>
      <div className="bg-white  rounded-2xl p-3 sm:p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 !text-slate-900 lg:text-base">بازی‌ها و نتایج</h2>
        </div>

        {/* Filters - Horizontal Row (RTL order: رشته, بازه زمانی, وضعیت) */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 w-full">
          <label className="flex flex-col gap-1 text-xs font-semibold text-slate-900 sm:text-sm">
            <span>رشته:</span>
            <select
              value={selectedLeague}
              onChange={(e) => setSelectedLeague(e.target.value as LeagueKey)}
              className="w-full rounded-lg border border-[var(--border)] bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-brand focus:outline-none sm:px-3 sm:py-2 sm:text-sm"
            >
              {leagueOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-xs font-semibold text-slate-900 sm:text-sm">
            <span>بازه زمانی:</span>
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value as TimeRange)}
              className="w-full rounded-lg border border-[var(--border)] bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-brand focus:outline-none sm:px-3 sm:py-2 sm:text-sm"
            >
              {timeRangeOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-xs font-semibold text-slate-900 sm:text-sm">
            <span>وضعیت:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as typeof selectedStatus)}
              className="w-full rounded-lg border border-[var(--border)] bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-brand focus:outline-none sm:px-3 sm:py-2 sm:text-sm"
            >
              {statusOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Matches List */}
        {displayMatches.length > 0 ? (
          <div className="space-y-2.5 sm:space-y-3">
            {displayMatches.map((match) => (
              <MatchItemCard key={match.id} match={match} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[var(--border)] bg-white p-4 text-center text-sm text-slate-900">
            بازی‌ای برای این فیلتر یافت نشد.
          </div>
        )}

        {/* CTA - Bottom corner */}
        <div className="flex justify-start pt-1">
          <Link
            href={`/matches?league=${selectedLeague}&timeRange=${selectedTimeRange}&status=${selectedStatus}`}
            className="text-sm font-medium text-blue-600 !text-blue-600 hover:text-blue-600 sm:text-base"
          >
            مشاهده برنامه کامل
          </Link>
        </div>
      </div>
    </section>
  );
}

function MatchItemCard({ match }: { match: MatchItem }) {
  const getStatusBadge = () => {
    if (match.status === "live") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold text-red-600 sm:text-xs">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-600" />
          زنده
        </span>
      );
    }
    if (match.status === "finished") {
      return (
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 sm:text-xs">
          تمام‌شده
        </span>
      );
    }
    return (
      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700 sm:text-xs">
        در انتظار
      </span>
    );
  };

  return (
    <article className="rounded-xl border border-[var(--border)] bg-white p-3 shadow-sm transition hover:shadow-md sm:p-4 text-slate-900">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1 space-y-2 overflow-hidden">
          {/* Date and Time */}
          <div className="flex items-center gap-2 text-xs text-slate-900 sm:text-sm">
            <span className="whitespace-nowrap">{match.datePersian}</span>
            <span className="text-slate-400 flex-shrink-0">•</span>
            <span className="whitespace-nowrap">{match.time}</span>
            {match.status === "live" && match.liveMinute && (
              <>
                <span className="text-slate-400 flex-shrink-0">•</span>
                <span className="font-semibold text-red-600 whitespace-nowrap">{match.liveMinute}&apos;</span>
              </>
            )}
          </div>

          {/* Teams */}
          <div className="bg-white text-slate-900 !text-slate-900 rounded-2xl p-3 sm:p-4 space-y-4">
            <span className="truncate">{match.homeTeam.name}</span>
            {match.status === "finished" && match.score ? (
              <span className="flex-shrink-0 font-bold text-brand">
                 {match.score.home}  -  {match.score.away} 
              </span>
            ) : match.status === "live" && match.score ? (
              <span className="flex-shrink-0 font-bold text-red-600">
                 {match.score.home}  -  {match.score.away} 
              </span>
            ) : (
              <span className="flex-shrink-0 text-slate-400">vs</span>
            )}
            <span className="truncate">{match.awayTeam.name}</span>
          </div>

          {/* Venue */}
          <div className="text-xs text-slate-900 sm:text-sm truncate">{match.venue}</div>
        </div>

        {/* Status Badge */}
        <div className="flex-shrink-0">{getStatusBadge()}</div>
      </div>
    </article>
  );
}
