"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { leagueOptions, matchSeasons, type LeagueKey } from "@/lib/data";
import type { CompetitionType } from "@/lib/data/matches";
import type { PlayerFilters as PlayerFiltersType } from "@/lib/players/filtering";

type StatType = "goals" | "yellowCards" | "redCards" | "cleanSheets" | "goalsConceded";

type PlayerFiltersProps = {
  currentSport?: LeagueKey;
  currentSeason?: string;
  currentCompetitionType?: CompetitionType | "all";
  currentTeamId?: string;
  currentStatType?: StatType;
};

const statTypeOptions: { id: StatType; label: string }[] = [
  { id: "goals", label: "گلزنان برتر" },
  { id: "yellowCards", label: "کارت زرد" },
  { id: "redCards", label: "کارت قرمز" },
  { id: "cleanSheets", label: "کلین‌شیت" },
  { id: "goalsConceded", label: "کمترین گل خورده" },
];

export function PlayerFilters({
  currentSport,
  currentSeason,
  currentCompetitionType = "all",
  currentTeamId,
  currentStatType = "goals",
}: PlayerFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value && value !== "all" && value !== "") {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`/players?${params.toString()}`);
  };

  return (
    <form className="grid grid-cols-2 gap-4" dir="rtl">
      <div className="flex flex-col gap-2">
        <label htmlFor="sport-filter" className="text-xs font-semibold text-slate-700">
          رشته
        </label>
        <select
          id="sport-filter"
          value={currentSport || "all"}
          onChange={(e) => handleFilterChange("sport", e.target.value)}
          className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm text-slate-900 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        >
          <option value="all">همه</option>
          {leagueOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

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

      <div className="flex flex-col gap-2">
        <label htmlFor="season-filter" className="text-xs font-semibold text-slate-700">
          فصل
        </label>
        <select
          id="season-filter"
          value={currentSeason || "all"}
          onChange={(e) => handleFilterChange("season", e.target.value)}
          className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm text-slate-900 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        >
          <option value="all">همه</option>
          {matchSeasons.map((season) => (
            <option key={season.id} value={season.id}>
              {season.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="stat-type-filter" className="text-xs font-semibold text-slate-700">
          نوع آمار
        </label>
        <select
          id="stat-type-filter"
          value={currentStatType}
          onChange={(e) => handleFilterChange("statType", e.target.value)}
          className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm text-slate-900 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        >
          {statTypeOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </form>
  );
}

