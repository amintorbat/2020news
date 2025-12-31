"use client";

import { useRouter } from "next/navigation";
import { leagueOptions, type LeagueKey } from "@/lib/data";
import { statusOptions, type MatchStatusFilter } from "@/lib/data/matches";

type MatchFiltersProps = {
  currentLeague: LeagueKey;
  currentStatus: MatchStatusFilter;
  currentSeason: string;
  currentWeek: string;
};

export function MatchFilters({ currentLeague, currentStatus, currentSeason, currentWeek }: MatchFiltersProps) {
  const router = useRouter();

  const handleLeagueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams({
      league: e.target.value,
      season: currentSeason,
      week: currentWeek,
      status: currentStatus,
    });
    router.push(`/matches?${params.toString()}`);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams({
      league: currentLeague,
      season: currentSeason,
      week: currentWeek,
      status: e.target.value,
    });
    router.push(`/matches?${params.toString()}`);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2" dir="rtl">
      <label className="text-sm font-semibold text-slate-900">
        رشته:
        <select
          value={currentLeague}
          onChange={handleLeagueChange}
          className="mt-1 w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none"
        >
          {leagueOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm font-semibold text-slate-900">
        وضعیت:
        <select
          value={currentStatus}
          onChange={handleStatusChange}
          className="mt-1 w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none"
        >
          {statusOptions.map((statusOption) => (
            <option key={statusOption.id} value={statusOption.id}>
              {statusOption.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

