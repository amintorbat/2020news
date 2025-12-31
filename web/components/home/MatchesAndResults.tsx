"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { LeagueKey } from "@/lib/data";
import { leagueOptions } from "@/lib/data";
import { mockMatches, timeRangeOptions, statusOptions, type MatchItem, type TimeRange } from "@/lib/data/matches";
import { cn } from "@/lib/cn";

type MatchesAndResultsProps = {
  container?: boolean;
  className?: string;
};

export function MatchesAndResults({ container = true, className }: MatchesAndResultsProps) {
  const [selectedLeague, setSelectedLeague] = useState<LeagueKey>("futsal");
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>("this-week");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "live" | "finished" | "upcoming">("all");

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
    <section className={cn(container && "container", "space-y-4 lg:space-y-3", className)} dir="rtl">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 lg:text-base" style={{ color: '#0f172a' }}>بازی‌ها و نتایج</h2>
      </div>

      {/* Filters - Horizontal Row */}
      <div className="flex flex-row flex-nowrap items-center justify-start gap-3 overflow-x-auto sm:flex-wrap sm:overflow-visible">
        <label className="flex flex-shrink-0 items-center gap-2 text-xs font-semibold text-slate-900 sm:text-sm">
          <span>رشته:</span>
          <select
            value={selectedLeague}
            onChange={(e) => setSelectedLeague(e.target.value as LeagueKey)}
            className="w-[10.5rem] max-w-full rounded-lg border border-[var(--border)] bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-brand focus:outline-none sm:px-3 sm:py-2 sm:text-sm"
          >
            {leagueOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-shrink-0 items-center gap-2 text-xs font-semibold text-slate-900 sm:text-sm">
          <span>بازه زمانی:</span>
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value as TimeRange)}
            className="w-[10.5rem] max-w-full rounded-lg border border-[var(--border)] bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-brand focus:outline-none sm:px-3 sm:py-2 sm:text-sm"
          >
            {timeRangeOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-shrink-0 items-center gap-2 text-xs font-semibold text-slate-900 sm:text-sm">
          <span>وضعیت:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as typeof selectedStatus)}
            className="w-[10.5rem] max-w-full rounded-lg border border-[var(--border)] bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-brand focus:outline-none sm:px-3 sm:py-2 sm:text-sm"
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
        <div className="rounded-xl border border-dashed border-[var(--border)] bg-white p-4 text-center text-sm text-slate-600">
          بازی‌ای برای این فیلتر یافت نشد.
        </div>
      )}

      {/* CTA - Bottom corner */}
      <div className="flex justify-start pt-1">
        <Link
          href={`/matches?league=${selectedLeague}&timeRange=${selectedTimeRange}&status=${selectedStatus}`}
          className="text-sm font-semibold text-blue-600 hover:text-blue-600 sm:text-base"
        >
          مشاهده برنامه کامل
        </Link>
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
    <article className="rounded-xl border border-[var(--border)] bg-white p-3 shadow-sm transition hover:shadow-md sm:p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1 space-y-2">
          {/* Date and Time */}
          <div className="flex items-center gap-2 text-xs text-slate-600 sm:text-sm" style={{ color: '#475569' }}>
            <span style={{ color: '#475569' }}>{match.datePersian}</span>
            <span className="text-slate-400">•</span>
            <span style={{ color: '#475569' }}>{match.time}</span>
            {match.status === "live" && match.liveMinute && (
              <>
                <span className="text-slate-400">•</span>
                <span className="font-semibold text-red-600">{match.liveMinute}'</span>
              </>
            )}
          </div>

          {/* Teams */}
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 sm:text-base" style={{ color: '#1e293b' }}>
            <span className="truncate" style={{ color: '#1e293b' }}>{match.homeTeam.name}</span>
            {match.status === "finished" && match.score ? (
              <span className="flex-shrink-0 font-bold text-brand">
                {match.score.home} - {match.score.away}
              </span>
            ) : match.status === "live" && match.score ? (
              <span className="flex-shrink-0 font-bold text-red-600">
                {match.score.home} - {match.score.away}
              </span>
            ) : (
              <span className="flex-shrink-0 text-slate-400">vs</span>
            )}
            <span className="truncate" style={{ color: '#1e293b' }}>{match.awayTeam.name}</span>
          </div>

          {/* Venue */}
          <div className="text-xs text-slate-600 sm:text-sm" style={{ color: '#475569' }}>{match.venue}</div>
        </div>

        {/* Status Badge */}
        <div className="flex-shrink-0">{getStatusBadge()}</div>
      </div>
    </article>
  );
}
