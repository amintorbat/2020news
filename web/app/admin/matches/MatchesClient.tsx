"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable, Column } from "@/components/admin/DataTable";
import { Badge } from "@/components/admin/Badge";
import { DeleteConfirmationModal } from "@/components/admin/DeleteConfirmationModal";
import { Toast } from "@/components/admin/Toast";
import { Match, SportType, MatchStatus, MATCH_STATUS_LABELS, getAvailableSports, getSportConfig } from "@/types/matches";
import { mockMatches, mockCompetitions } from "@/lib/admin/matchesData";

export default function MatchesClient() {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>(mockMatches);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingMatch, setDeletingMatch] = useState<Match | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" | "warning" } | null>(null);

  // Filter states
  const [search, setSearch] = useState("");
  const [sportFilter, setSportFilter] = useState<SportType | "">("");
  const [competitionFilter, setCompetitionFilter] = useState("");
  const [seasonFilter, setSeasonFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<MatchStatus | "">("");
  const [sortBy, setSortBy] = useState<"date-desc" | "date-asc">("date-desc");

  // Get available sports from configuration (data-driven)
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

  // Filtered and sorted matches
  const filteredMatches = useMemo(() => {
    let result = matches.filter((match) => {
      const matchesSearch =
        search === "" ||
        match.homeTeam.toLowerCase().includes(search.toLowerCase()) ||
        match.awayTeam.toLowerCase().includes(search.toLowerCase()) ||
        match.competitionName.toLowerCase().includes(search.toLowerCase());

      const matchesSport = sportFilter === "" || match.sport === sportFilter;
      const matchesCompetition = competitionFilter === "" || match.competitionId === competitionFilter;
      const matchesSeason = seasonFilter === "" || match.seasonId === seasonFilter;
      const matchesStatus = statusFilter === "" || match.status === statusFilter;

      return matchesSearch && matchesSport && matchesCompetition && matchesSeason && matchesStatus;
    });

    // Sort by date
    result = [...result].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortBy === "date-desc" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [matches, search, sportFilter, competitionFilter, seasonFilter, statusFilter, sortBy]);

  const handleViewMatch = (matchId: string) => {
    router.push(`/admin/matches/${matchId}`);
  };

  const handleEditMatch = (matchId: string) => {
    router.push(`/admin/matches/${matchId}/edit`);
  };

  const handleDeleteClick = (match: Match) => {
    setDeletingMatch(match);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingMatch) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      setMatches((prev) => prev.filter((m) => m.id !== deletingMatch.id));
      setToast({ message: "مسابقه با موفقیت حذف شد", type: "success" });
      setIsDeleteModalOpen(false);
      setDeletingMatch(null);
    } catch (error) {
      setToast({ message: "خطا در حذف مسابقه", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: MatchStatus) => {
    const variants: Record<MatchStatus, "success" | "danger" | "info" | "warning" | "default"> = {
      finished: "success",
      live: "danger",
      scheduled: "info",
      postponed: "warning",
      cancelled: "default",
    };
    return <Badge variant={variants[status]}>{MATCH_STATUS_LABELS[status]}</Badge>;
  };

  const columns: readonly Column<Match>[] = [
    {
      key: "date",
      label: "تاریخ و زمان",
      render: (row) => (
        <div className="min-w-[140px]">
          <div className="text-sm font-medium text-slate-900">{row.date}</div>
          <div className="text-xs text-slate-500">{row.time}</div>
        </div>
      ),
    },
    {
      key: "sport",
      label: "ورزش",
      render: (row) => {
        const sportConfig = getSportConfig(row.sport);
        return (
          <div className="flex items-center gap-2">
            <span className="text-lg">{sportConfig.icon}</span>
            <span className="text-sm text-slate-700">{sportConfig.label}</span>
          </div>
        );
      },
    },
    {
      key: "homeTeam",
      label: "تیم میزبان",
      render: (row) => (
        <div className="font-medium text-slate-900">{row.homeTeam}</div>
      ),
    },
    {
      key: "homeScore",
      label: "نتیجه",
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.homeScore !== null && row.awayScore !== null ? (
            <>
              <span className="text-lg font-bold text-slate-900">{row.homeScore}</span>
              <span className="text-slate-400">-</span>
              <span className="text-lg font-bold text-slate-900">{row.awayScore}</span>
            </>
          ) : (
            <span className="text-sm text-slate-400">vs</span>
          )}
        </div>
      ),
    },
    {
      key: "awayTeam",
      label: "تیم میهمان",
      render: (row) => (
        <div className="font-medium text-slate-900">{row.awayTeam}</div>
      ),
    },
    {
      key: "competitionName",
      label: "مسابقات",
      render: (row) => (
        <div>
          <div className="text-sm font-medium text-slate-900">{row.competitionName}</div>
          <div className="text-xs text-slate-500">{row.seasonName}</div>
        </div>
      ),
    },
    {
      key: "venue",
      label: "مکان",
      render: (row) => (
        <span className="text-sm text-slate-600">{row.venue}</span>
      ),
    },
    {
      key: "status",
      label: "وضعیت",
      render: (row) => getStatusBadge(row.status),
    },
    {
      key: "id",
      label: "عملیات",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewMatch(row.id)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 transition-colors"
            title="مشاهده جزئیات"
            aria-label="مشاهده جزئیات"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            onClick={() => handleEditMatch(row.id)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 transition-colors"
            title="ویرایش"
            aria-label="ویرایش مسابقه"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => handleDeleteClick(row)}
            className="rounded-lg p-2 text-red-600 hover:bg-red-50 transition-colors"
            title="حذف"
            aria-label="حذف مسابقه"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="مدیریت مسابقات"
        subtitle="مدیریت کامل مسابقات فوتبال، فوتسال و فوتبال ساحلی"
        action={
          <button
            onClick={() => router.push("/admin/matches/new")}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white bg-brand hover:bg-brand/90 transition-colors"
          >
            افزودن مسابقه
          </button>
        }
      />

      {/* Advanced Filters */}
      <div className="rounded-xl border border-[var(--border)] bg-white p-4 sm:p-6 shadow-sm">
        <div className="space-y-4">
          {/* Search Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-2">
                جستجو
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="نام تیم یا مسابقات..."
                className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">
                مرتب‌سازی
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "date-desc" | "date-asc")}
                className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
              >
                <option value="date-desc">جدیدترین</option>
                <option value="date-asc">قدیمی‌ترین</option>
              </select>
            </div>
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Sport Filter */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">
                ورزش
              </label>
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

            {/* Status Filter */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">
                وضعیت
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as MatchStatus | "")}
                className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
              >
                <option value="">همه وضعیت‌ها</option>
                {Object.entries(MATCH_STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Matches Table */}
      <div className="rounded-xl border border-[var(--border)] bg-white overflow-hidden shadow-sm">
        {filteredMatches.length > 0 ? (
          <DataTable<Match>
            columns={columns}
            data={filteredMatches}
            keyExtractor={(row) => row.id}
          />
        ) : (
          <div className="p-12 text-center">
            <p className="text-slate-500 text-sm">هیچ مسابقه‌ای یافت نشد</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        title="حذف مسابقه"
        message={`آیا از حذف مسابقه "${deletingMatch?.homeTeam} vs ${deletingMatch?.awayTeam}" اطمینان دارید؟ این عمل قابل بازگشت نیست.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setDeletingMatch(null);
        }}
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
