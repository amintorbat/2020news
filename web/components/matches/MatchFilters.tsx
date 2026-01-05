"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { leagueOptions, matchSeasons, matchWeeks, type LeagueKey } from "@/lib/data";
import { timeRangeOptions, statusOptions, type TimeRange, type MatchStatusFilter, type CompetitionType } from "@/lib/data/matches";
import { useState } from "react";

export type MatchFiltersProps = {
  currentLeague?: LeagueKey;
  currentCompetitionType?: CompetitionType | "all";
  currentTimeRange?: TimeRange;
  currentStatus?: MatchStatusFilter;
  currentSeason?: string;
  currentWeek?: string | "all";
  currentSearchQuery?: string;
  showSearch?: boolean;
  showSeasonWeek?: boolean;
};

export function MatchFilters({
  currentLeague = "futsal",
  currentCompetitionType = "all",
  currentTimeRange = "all",
  currentStatus = "all",
  currentSeason,
  currentWeek = "all",
  currentSearchQuery = "",
  showSearch = false,
  showSeasonWeek = false,
}: MatchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(currentSearchQuery);

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value && value !== "all" && value !== "") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    // Reset page on filter change
    params.delete("page");
    
    router.push(`/matches?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleFilterChange("q", searchQuery);
  };

  return (
    <form onSubmit={handleSearchSubmit} className="grid grid-cols-2 gap-4" dir="rtl">
      {/* Sport/League Filter */}
      <div className="flex flex-col gap-2">
        <label htmlFor="league-filter" className="text-xs font-semibold text-slate-700">
          رشته
        </label>
        <select
          id="league-filter"
          value={currentLeague}
          onChange={(e) => handleFilterChange("league", e.target.value)}
          className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm text-slate-900 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        >
          {leagueOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Competition Type Filter */}
      <div className="flex flex-col gap-2">
        <label htmlFor="competition-type-filter" className="text-xs font-semibold text-slate-700">
          نوع مسابقه
        </label>
        <select
          id="competition-type-filter"
          value={currentCompetitionType}
          onChange={(e) => handleFilterChange("competitionType", e.target.value)}
          className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm text-slate-900 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        >
          <option value="all">همه</option>
          <option value="league">لیگ</option>
          <option value="cup">جام</option>
          <option value="international">بین‌المللی</option>
          <option value="friendly">دوستانه</option>
          <option value="women">بانوان</option>
          <option value="youth">جوانان</option>
          <option value="other">سایر</option>
        </select>
      </div>

      {/* Time Range Filter */}
      <div className="flex flex-col gap-2">
        <label htmlFor="time-range-filter" className="text-xs font-semibold text-slate-700">
          بازه زمانی
        </label>
        <select
          id="time-range-filter"
          value={currentTimeRange}
          onChange={(e) => handleFilterChange("timeRange", e.target.value)}
          className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm text-slate-900 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        >
          {timeRangeOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Status Filter */}
      <div className="flex flex-col gap-2">
        <label htmlFor="status-filter" className="text-xs font-semibold text-slate-700">
          وضعیت
        </label>
        <select
          id="status-filter"
          value={currentStatus}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm text-slate-900 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        >
          {statusOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Season Filter - Conditional */}
      {showSeasonWeek && (
        <div className="flex flex-col gap-2">
          <label htmlFor="season-filter" className="text-xs font-semibold text-slate-700">
            فصل
          </label>
          <select
            id="season-filter"
            value={currentSeason || matchSeasons[0]?.id || ""}
            onChange={(e) => handleFilterChange("season", e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm text-slate-900 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          >
            {matchSeasons.map((season) => (
              <option key={season.id} value={season.id}>
                {season.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Week Filter - Conditional */}
      {showSeasonWeek && (
        <div className="flex flex-col gap-2">
          <label htmlFor="week-filter" className="text-xs font-semibold text-slate-700">
            هفته
          </label>
          <select
            id="week-filter"
            value={currentWeek}
            onChange={(e) => handleFilterChange("week", e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm text-slate-900 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          >
            <option value="all">همه</option>
            {matchWeeks.map((week) => (
              <option key={week.id} value={week.id}>
                {week.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Search Filter - Conditional */}
      {showSearch && (
        <div className="flex flex-col gap-2 col-span-2">
          <label htmlFor="search-filter" className="text-xs font-semibold text-slate-700">
            جستجو (نام تیم)
          </label>
          <div className="flex gap-2">
            <input
              id="search-filter"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو بر اساس نام تیم..."
              className="flex-1 rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
            <button
              type="submit"
              className="rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand/90"
            >
              جستجو
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
