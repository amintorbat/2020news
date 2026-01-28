"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable, Column } from "@/components/admin/DataTable";
import { Badge } from "@/components/admin/Badge";
import { Toggle } from "@/components/admin/Toggle";
import { Toast } from "@/components/admin/Toast";
import { StandingEditModal } from "@/components/admin/StandingEditModal";
import { getAvailableSports, getSportConfig, SportType } from "@/types/matches";
import {
  StandingRow,
  TableConfig,
  mockTableConfigs,
  mockStandings,
} from "@/lib/admin/standingsData";
import { mockCompetitions } from "@/lib/admin/matchesData";
import { mockMatches } from "@/lib/admin/matchesData";
import {
  calculateStandingsFromMatches,
  sortStandings,
  getZoneIndicator,
  DEFAULT_POINTS_CONFIG,
} from "@/lib/admin/standingsCalculation";

export default function StandingsClient() {
  const router = useRouter();
  const [standings, setStandings] = useState<StandingRow[]>(mockStandings);
  const [tableConfigs, setTableConfigs] = useState<TableConfig[]>(mockTableConfigs);
  const [editingStanding, setEditingStanding] = useState<StandingRow | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info" | "warning";
  } | null>(null);

  // Filter states
  const [sportFilter, setSportFilter] = useState<SportType | "">("");
  const [competitionFilter, setCompetitionFilter] = useState("");
  const [seasonFilter, setSeasonFilter] = useState("");
  const [autoCalculate, setAutoCalculate] = useState(true); // Auto-calculate from matches

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

  // Calculate standings from matches when auto-calculate is enabled
  useEffect(() => {
    if (!autoCalculate) return;

    setStandings((prevStandings) => {
      const calculatedStandings: StandingRow[] = [];
      const processedKeys = new Set<string>();

      // Process each competition/season combination
      mockCompetitions.forEach((competition) => {
        competition.seasons.forEach((season) => {
          const key = `${competition.id}-${season.id}`;
          if (processedKeys.has(key)) return;
          processedKeys.add(key);

          // Get matches for this competition/season
          const relevantMatches = mockMatches.filter(
            (m) => m.competitionId === competition.id && m.seasonId === season.id
          );

          if (relevantMatches.length === 0) return;

          // Get table config
          const config =
            tableConfigs.find(
              (c) => c.competitionId === competition.id && c.seasonId === season.id
            ) || {
              competitionId: competition.id,
              seasonId: season.id,
              isLocked: false,
              pointsConfig: DEFAULT_POINTS_CONFIG[competition.sport],
            };

          // Skip if locked
          if (config.isLocked) {
            // Keep existing standings for locked tables
            const existing = prevStandings.filter(
              (s) => s.competitionId === competition.id && s.seasonId === season.id
            );
            calculatedStandings.push(...existing);
            return;
          }

        // Calculate from matches
        const pointsConfig = config.pointsConfig || DEFAULT_POINTS_CONFIG[competition.sport];
        const calculated = calculateStandingsFromMatches(relevantMatches, pointsConfig);
        const sorted = sortStandings(Array.from(calculated.values()));

          // Convert to StandingRow format
          sorted.forEach((calc, index) => {
            const existing = prevStandings.find(
              (s) =>
                s.competitionId === competition.id &&
                s.seasonId === season.id &&
                (s.teamId === calc.teamId || s.team === calc.team)
            );

          const position = index + 1;
          const totalTeams = sorted.length;
          const zone = getZoneIndicator(
            position,
            totalTeams,
            config.promotionZones,
            config.relegationZones
          );

          // Apply manual overrides if they exist
          const basePoints = calc.points;
          const deduction = existing?.manualOverrides?.pointsDeduction ?? 0;
          const manualPoints = existing?.manualOverrides?.points;
          // `manualPoints` is `number | undefined` — ensure `finalPoints` is always a number
          const finalPoints =
            manualPoints != null ? manualPoints : basePoints - deduction;

          calculatedStandings.push({
            id: existing?.id || `stand-${competition.id}-${season.id}-${position}`,
            team: calc.team,
            teamId: calc.teamId,
            sport: competition.sport,
            competitionId: competition.id,
            competitionName: competition.name,
            seasonId: season.id,
            seasonName: season.name,
            position,
            played: calc.played,
            won: calc.won,
            drawn: calc.drawn,
            lost: calc.lost,
            goalsFor: calc.goalsFor,
            goalsAgainst: calc.goalsAgainst,
            goalDifference: calc.goalDifference,
            points: finalPoints,
            form: calc.form,
            isLocked: false,
            manualOverrides: existing?.manualOverrides,
            zone,
          });
          });
        });
      });

      // Merge with manually maintained standings (for competitions without matches)
      const manualStandings = prevStandings.filter((s) => {
        const key = `${s.competitionId}-${s.seasonId}`;
        return !processedKeys.has(key);
      });

      return [...calculatedStandings, ...manualStandings];
    });
  }, [autoCalculate, tableConfigs]);

  // Filtered standings
  const filteredStandings = useMemo(() => {
    let result = standings.filter((standing) => {
      const matchesSport = sportFilter === "" || standing.sport === sportFilter;
      const matchesCompetition =
        competitionFilter === "" || standing.competitionId === competitionFilter;
      const matchesSeason = seasonFilter === "" || standing.seasonId === seasonFilter;

      return matchesSport && matchesCompetition && matchesSeason;
    });

    // Sort by competition, then position
    result = [...result].sort((a, b) => {
      if (a.competitionId !== b.competitionId) {
        return a.competitionId.localeCompare(b.competitionId);
      }
      return a.position - b.position;
    });

    return result;
  }, [standings, sportFilter, competitionFilter, seasonFilter]);

  const handleToggleLock = (competitionId: string, seasonId: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setTableConfigs((prev) =>
        prev.map((config) =>
          config.competitionId === competitionId && config.seasonId === seasonId
            ? { ...config, isLocked: !config.isLocked }
            : config
        )
      );
      setToast({
        message: "وضعیت قفل جدول تغییر کرد",
        type: "success",
      });
      setIsLoading(false);
    }, 300);
  };

  const handleEditStanding = (standing: StandingRow) => {
    setEditingStanding(standing);
    setIsEditModalOpen(true);
  };

  const handleSaveStanding = (
    standing: StandingRow,
    overrides: StandingRow["manualOverrides"]
  ) => {
    setIsLoading(true);
    setTimeout(() => {
      setStandings((prev) =>
        prev.map((s) => {
          if (s.id === standing.id) {
            const basePoints = s.points;
            const deduction = overrides?.pointsDeduction ?? 0;
            const manualPoints = overrides?.points;
            // `manualPoints` is `number | undefined` — ensure `finalPoints` is always a number
            const finalPoints =
              manualPoints != null ? manualPoints : basePoints - deduction;

            return {
              ...s,
              manualOverrides: {
                ...overrides,
                points: manualPoints,
                pointsDeduction: deduction > 0 ? deduction : undefined,
                pointsDeductionReason: overrides?.pointsDeductionReason,
              },
              points: finalPoints,
            };
          }
          return s;
        })
      );
      setIsEditModalOpen(false);
      setEditingStanding(null);
      setToast({
        message: "رکورد تیم با موفقیت به‌روزرسانی شد",
        type: "success",
      });
      setIsLoading(false);
    }, 500);
  };

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
            <Badge
              key={index}
              variant={variants[result] || "default"}
              className="!px-1.5 !py-0.5 text-xs"
            >
              {result === "W" ? "ب" : result === "L" ? "ش" : "ت"}
            </Badge>
          );
        })}
      </div>
    );
  };

  const getPositionBadge = (position: number, zone?: StandingRow["zone"]) => {
    if (zone === "champion") {
      return (
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500 text-white font-bold text-sm shadow-md">
          {position}
        </span>
      );
    }
    if (position <= 3) {
      return (
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand text-white font-bold text-sm">
          {position}
        </span>
      );
    }
    return <span className="text-sm font-medium text-slate-700">{position}</span>;
  };

  const getRowClassName = (standing: StandingRow) => {
    if (standing.zone === "champion") {
      return "bg-yellow-50 border-yellow-200";
    }
    if (standing.zone === "promotion") {
      return "bg-green-50 border-green-200";
    }
    if (standing.zone === "relegation") {
      return "bg-red-50 border-red-200";
    }
    return "";
  };

  const columns: readonly Column<StandingRow>[] = [
    {
      key: "position",
      label: "رتبه",
      render: (row) => (
        <div className="flex items-center justify-center min-w-[40px]">
          {getPositionBadge(row.position, row.zone)}
        </div>
      ),
    },
    {
      key: "team",
      label: "تیم",
      render: (row) => (
        <div className="font-medium text-slate-900 min-w-[150px] flex items-center gap-2">
          {row.team}
          {row.zone === "champion" && (
            <span className="text-yellow-600" title="قهرمان">
              👑
            </span>
          )}
          {row.manualOverrides?.pointsDeduction && (
            <Badge variant="danger" className="!px-1.5 !py-0.5 text-xs">
              -{row.manualOverrides.pointsDeduction}
            </Badge>
          )}
        </div>
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
        <div
          className={`text-center text-sm font-medium ${
            row.goalDifference >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {row.goalDifference > 0 ? "+" : ""}
          {row.goalDifference}
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
    {
      key: "id",
      label: "عملیات",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEditStanding(row)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 transition-colors"
            title="ویرایش"
            aria-label="ویرایش رکورد تیم"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
        </div>
      ),
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
        title="مدیریت جدول لیگ"
        subtitle="محاسبه و مدیریت جدول رده‌بندی از نتایج مسابقات"
        action={
          <button
            onClick={() => router.push("/admin/matches")}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white bg-brand hover:bg-brand/90 transition-colors"
          >
            مشاهده مسابقات
          </button>
        }
      />

      {/* Auto-calculate toggle */}
      <div className="rounded-xl border border-[var(--border)] bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-1">
              محاسبه خودکار از نتایج
            </h3>
            <p className="text-xs text-slate-600">
              جدول به صورت خودکار از نتایج مسابقات محاسبه می‌شود
            </p>
          </div>
          <Toggle checked={autoCalculate} onChange={setAutoCalculate} />
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-[var(--border)] bg-white p-4 sm:p-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Sport Filter */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">ورزش</label>
            <select
              value={sportFilter}
              onChange={(e) => {
                setSportFilter(e.target.value as SportType | "");
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
            <label className="block text-xs font-medium text-slate-700 mb-2">مسابقات</label>
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
            <label className="block text-xs font-medium text-slate-700 mb-2">فصل</label>
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
          const tableConfig = tableConfigs.find(
            (c) => c.competitionId === firstStanding.competitionId && c.seasonId === firstStanding.seasonId
          );

          return (
            <div
              key={key}
              className="rounded-xl border border-[var(--border)] bg-white overflow-hidden shadow-sm"
            >
              {/* Table Header */}
              <div className="bg-slate-50 px-6 py-4 border-b border-[var(--border)]">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{sportConfig.icon}</span>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {firstStanding.competitionName}
                      </h3>
                      <p className="text-sm text-slate-600">{firstStanding.seasonName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="info">{sportConfig.label}</Badge>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-600">قفل جدول:</span>
                      <Toggle
                        checked={tableConfig?.isLocked || false}
                        onChange={() =>
                          handleToggleLock(firstStanding.competitionId, firstStanding.seasonId)
                        }
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>

                {/* Zone Legend */}
                <div className="mt-4 flex flex-wrap gap-4 text-xs">
                  {tableConfig?.promotionZones && (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-green-500"></div>
                      <span className="text-slate-600">
                        {tableConfig.promotionZones} تیم اول (صعود)
                      </span>
                    </div>
                  )}
                  {tableConfig?.relegationZones && (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-red-500"></div>
                      <span className="text-slate-600">
                        {tableConfig.relegationZones} تیم آخر (سقوط)
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-yellow-500"></div>
                    <span className="text-slate-600">قهرمان</span>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      {columns.map((col) => (
                        <th
                          key={String(col.key)}
                          className="px-4 py-3 text-right font-semibold text-slate-700"
                        >
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {groupStandings.map((row) => (
                      <tr
                        key={row.id}
                        className={`border-t hover:bg-slate-50 transition-colors ${getRowClassName(row)}`}
                      >
                        {columns.map((col) => (
                          <td key={String(col.key)} className="px-4 py-2">
                            {col.render ? col.render(row) : String(row[col.key] ?? "-")}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}

        {Object.keys(groupedStandings).length === 0 && (
          <div className="rounded-xl border border-[var(--border)] bg-white p-12 text-center">
            <p className="text-slate-500 text-sm">هیچ جدولی یافت نشد</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <StandingEditModal
        open={isEditModalOpen}
        standing={editingStanding}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingStanding(null);
        }}
        onSave={handleSaveStanding}
        isLoading={isLoading}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={!!toast}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
