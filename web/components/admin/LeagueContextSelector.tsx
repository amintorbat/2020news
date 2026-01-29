"use client";

import { useLeagueContext } from "@/contexts/LeagueContext";
import type { League } from "@/types/leagues";

export function LeagueContextSelector() {
  const { selectedLeague, setSelectedLeague, availableLeagues } = useLeagueContext();

  const getSportLabel = (sportType: League["sportType"]) => {
    return sportType === "futsal" ? "فوتسال" : "فوتبال ساحلی";
  };

  const getCompetitionTypeLabel = (type: League["competitionType"]) => {
    return type === "league" ? "لیگ" : "جام حذفی";
  };

  if (availableLeagues.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-[var(--border)] bg-white p-4 shadow-sm mb-6" dir="rtl">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-medium text-slate-700 mb-2">
            لیگ فعال
          </label>
          <select
            value={selectedLeague?.id || ""}
            onChange={(e) => {
              const league = availableLeagues.find((l) => l.id === e.target.value);
              setSelectedLeague(league || null);
            }}
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-medium text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
          >
            {availableLeagues.map((league) => (
              <option key={league.id} value={league.id}>
                {league.title} ({getSportLabel(league.sportType)}) - {getCompetitionTypeLabel(league.competitionType)}
              </option>
            ))}
          </select>
        </div>
        {selectedLeague && (
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <div>
              <span className="text-slate-500">فصل: </span>
              <span className="font-medium text-slate-700">{selectedLeague.season}</span>
            </div>
            <div>
              <span className="text-slate-500">تعداد تیم‌ها: </span>
              <span className="font-medium text-slate-700">{selectedLeague.numberOfTeams}</span>
            </div>
            {selectedLeague.competitionType === "league" && selectedLeague.hasStandingsTable && (
              <div className="px-2 py-1 rounded bg-slate-100 text-slate-700 text-[10px] font-medium">
                جدول رده‌بندی فعال
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
