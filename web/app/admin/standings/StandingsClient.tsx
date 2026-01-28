"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable, Column } from "@/components/admin/DataTable";
import { Badge } from "@/components/admin/Badge";
import { getAvailableSports, getSportConfig } from "@/types/matches";
import { mockStandings, StandingRow } from "@/lib/admin/standingsData";
import { mockCompetitions } from "@/lib/admin/matchesData";

export default function StandingsClient() {
  const router = useRouter();
  const [standings, setStandings] = useState<StandingRow[]>(mockStandings);

  // Filter states
  const [sportFilter, setSportFilter] = useState<string>("");
  const [competitionFilter, setCompetitionFilter] = useState("");
  const [seasonFilter, setSeasonFilter] = useState("");

  const availableSports = useMemo(() => {
    return getAvailableSports();
  }, []);

  const availableCompetitions = useMemo(() => {
    if (!sportFilter) return mockCompetitions;
    return mockCompetitions.filter((c) => c.sport === sportFilter);
  }, [sportFilter]);

  const availableSeasons = useMemo(() => {
    if (!competitionFilter) return [];
    const competition = mockCompetitions.find((c) => c.id === competitionFilter);
    return competition?.seasons || [];
  }, [competitionFilter]);

  // Filtered standings
  const filteredStandings = useMemo(() => {
    let result = standings.filter((standing) => {
      const matchesSport = sportFilter === "" || standing.sport === sportFilter;
      const matchesCompetition = competitionFilter === "" || standing.competitionId === competitionFilter;
      const matchesSeason = seasonFilter === "" || standing.seasonId === seasonFilter;

      return matchesSport && matchesCompetition && matchesSeason;
    });

    // Sort by position
    result = [...result].sort((a, b) => {
      if (a.competitionId !== b.competitionId) {
        return a.competitionId.localeCompare(b.competitionId);
      }
      return a.position - b.position;
    });

    return result;
  }, [standings, sportFilter, competitionFilter, seasonFilter]);

  const getFormBadge = (form: string[]) => {
    return (
      <div className="flex items-center gap-1">
        {form.map((result, index) => {
          const variants: Record<string, "success" | "danger" | "warning" | "default"> = {
            W: "success",
            L: "danger",
            D: "warning",
          };
          return (
            <Badge key={index} variant={variants[result] || "default"} className="!px-1.5 !py-0.5 text-xs">
              {result === "W" ? "ب" : result === "L" ? "ش" : "ت"}
            </Badge>
          );
        })}
      </div>
    );
  };

  const getPositionBadge = (position: number) => {
    if (position <= 3) {
      return (
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand text-white font-bold text-sm">
          {position}
        </span>
      );
    }
    return <span className="text-sm font-medium text-slate-700">{position}</span>;
  };

  const columns: readonly Column<StandingRow>[] = [
    {
      key: "position",
      label: "رتبه",
      render: (row) => (
        <div className="flex items-center justify-center min-w-[40px]">
          {getPositionBadge(row.position)}
        </div>
      ),
    },
    {
      key: "team",
      label: "تیم",
      render: (row) => (
        <div className="font-medium text-slate-900 min-w-[150px]">{row.team}</div>
      ),
    },
    {
      key: "played",
      label: "بازی",
      render: (row) => (
        <div className="text-center text-sm text-slate-700">{row.played}</div>
      ),
    },
    {
      key: "won",
      label: "برد",
      render: (row) => (
        <div className="text-center text-sm font-medium text-green-600">{row.won}</div>
      ),
    },
    {
      key: "drawn",
      label: "مساوی",
      render: (row) => (
        <div className="text-center text-sm font-medium text-yellow-600">{row.drawn}</div>
      ),
    },
    {
      key: "lost",
      label: "باخت",
      render: (row) => (
        <div className="text-center text-sm font-medium text-red-600">{row.lost}</div>
      ),
    },
    {
      key: "goalsFor",
      label: "گل زده",
      render: (row) => (
        <div className="text-center text-sm text-slate-700">{row.goalsFor}</div>
      ),
    },
    {
      key: "goalsAgainst",
      label: "گل خورده",
      render: (row) => (
        <div className="text-center text-sm text-slate-700">{row.goalsAgainst}</div>
      ),
    },
    {
      key: "goalDifference",
      label: "تفاضل",
      render: (row) => (
        <div className={`text-center text-sm font-medium ${row.goalDifference >= 0 ? "text-green-600" : "text-red-600"}`}>
          {row.goalDifference > 0 ? "+" : ""}{row.goalDifference}
        </div>
      ),
    },
    {
      key: "points",
      label: "امتیاز",
      render: (row) => (
        <div className="text-center text-base font-bold text-slate-900">{row.points}</div>
      ),
    },
    {
      key: "form",
      label: "فرم",
      render: (row) => getFormBadge(row.form),
    },
  ];

  // Group standings by competition
  const groupedStandings = useMemo(() => {
    const groups: Record<string, StandingRow[]> = {};
    filteredStandings.forEach((standing) => {
      const key = `${standing.competitionId}-${standing.seasonId}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(standing);
    });
    return groups;
  }, [filteredStandings]);

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="جدول لیگ"
        subtitle="مدیریت و مشاهده جدول رده‌بندی مسابقات"
        action={
          <button
            onClick={() => router.push("/admin/matches")}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white bg-brand hover:bg-brand/90 transition-colors"
          >
            مشاهده مسابقات
          </button>
        }
      />

      {/* Filters */}
      <div className="rounded-xl border border-[var(--border)] bg-white p-4 sm:p-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Sport Filter */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">
              ورزش
            </label>
            <select
              value={sportFilter}
              onChange={(e) => {
                setSportFilter(e.target.value);
                setCompetitionFilter("");
                setSeasonFilter("");
              }}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
            >
              <option value="">همه ورزش‌ها</option>
              {availableSports.map((sport) => (
                <option key={sport.id} value={sport.id}>
                  {sport.label}
                </option>
              ))}
            </select>
          </div>

          {/* Competition Filter */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">
              مسابقات
            </label>
            <select
              value={competitionFilter}
              onChange={(e) => {
                setCompetitionFilter(e.target.value);
                setSeasonFilter("");
              }}
              disabled={!sportFilter}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">همه مسابقات</option>
              {availableCompetitions.map((comp) => (
                <option key={comp.id} value={comp.id}>
                  {comp.name}
                </option>
              ))}
            </select>
          </div>

          {/* Season Filter */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">
              فصل
            </label>
            <select
              value={seasonFilter}
              onChange={(e) => setSeasonFilter(e.target.value)}
              disabled={!competitionFilter}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">همه فصل‌ها</option>
              {availableSeasons.map((season) => (
                <option key={season.id} value={season.id}>
                  {season.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Standings Tables */}
      <div className="space-y-6">
        {Object.entries(groupedStandings).map(([key, groupStandings]) => {
          const firstStanding = groupStandings[0];
          const competition = mockCompetitions.find((c) => c.id === firstStanding.competitionId);
          const sportConfig = getSportConfig(firstStanding.sport);

          return (
            <div key={key} className="rounded-xl border border-[var(--border)] bg-white overflow-hidden shadow-sm">
              {/* Table Header */}
              <div className="bg-slate-50 px-6 py-4 border-b border-[var(--border)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{sportConfig.icon}</span>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{firstStanding.competitionName}</h3>
                      <p className="text-sm text-slate-600">{firstStanding.seasonName}</p>
                    </div>
                  </div>
                  <Badge variant="info">{sportConfig.label}</Badge>
                </div>
              </div>

              {/* Table */}
              <DataTable<StandingRow>
                columns={columns}
                data={groupStandings}
                keyExtractor={(row) => row.id}
              />
            </div>
          );
        })}

        {Object.keys(groupedStandings).length === 0 && (
          <div className="rounded-xl border border-[var(--border)] bg-white p-12 text-center">
            <p className="text-slate-500 text-sm">هیچ جدولی یافت نشد</p>
          </div>
        )}
      </div>
    </div>
  );
}
