"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { Badge } from "@/components/admin/Badge";
import { EmptyState } from "@/components/admin/EmptyState";
import { Toast } from "@/components/admin/Toast";
import { DeleteConfirmationModal } from "@/components/admin/DeleteConfirmationModal";
import {
  Match,
  SportType,
  MatchStatus,
  CompetitionType,
  MATCH_STATUS_LABELS,
  COMPETITION_TYPE_LABELS,
  getAvailableSports,
  getSportConfig,
} from "@/types/matches";
import { mockMatches, mockCompetitions } from "@/lib/admin/matchesData";

type CompetitionTypeFilter = CompetitionType | "all";

export default function MatchesClient() {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>(mockMatches);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingMatch, setDeletingMatch] = useState<Match | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter states
  const [search, setSearch] = useState("");
  const [sportFilter, setSportFilter] = useState<SportType | "">("");
  const [competitionTypeFilter, setCompetitionTypeFilter] = useState<CompetitionTypeFilter>("all");
  const [statusFilter, setStatusFilter] = useState<MatchStatus | "">("");
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);

  const availableSports = useMemo(() => getAvailableSports(), []);

  const availableCompetitions = useMemo(() => {
    if (!sportFilter) return mockCompetitions;
    return mockCompetitions.filter((c) => c.sport === sportFilter);
  }, [sportFilter]);

  // Filtered matches
  const filteredMatches = useMemo(() => {
    return matches.filter((match) => {
      const query = search.trim().toLowerCase();
      const matchesSearch =
        query === "" ||
        match.homeTeam.toLowerCase().includes(query) ||
        match.awayTeam.toLowerCase().includes(query) ||
        match.competitionName.toLowerCase().includes(query);

      const matchesSport = sportFilter === "" || match.sport === sportFilter;
      const matchesStatus = statusFilter === "" || match.status === statusFilter;

      // Competition type filter
      let matchesCompetitionType = true;
      if (competitionTypeFilter !== "all") {
        const competition = mockCompetitions.find((c) => c.id === match.competitionId);
        matchesCompetitionType = competition?.type === competitionTypeFilter;
      }

      return matchesSearch && matchesSport && matchesStatus && matchesCompetitionType;
    });
  }, [matches, search, sportFilter, competitionTypeFilter, statusFilter]);

  const selectedMatch = useMemo(() => {
    if (!selectedMatchId) return null;
    return filteredMatches.find((m) => m.id === selectedMatchId) || null;
  }, [selectedMatchId, filteredMatches]);

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

  const stats = useMemo(() => {
    const total = filteredMatches.length;
    const finished = filteredMatches.filter((m) => m.status === "finished").length;
    const live = filteredMatches.filter((m) => m.status === "live").length;
    const scheduled = filteredMatches.filter((m) => m.status === "scheduled").length;
    return { total, finished, live, scheduled };
  }, [filteredMatches]);

  const handleDeleteClick = (match: Match) => {
    setDeletingMatch(match);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingMatch) return;

    setIsDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    try {
      setMatches((prev) => prev.filter((m) => m.id !== deletingMatch.id));
      
      // اگر مسابقه حذف شده همان مسابقه انتخاب شده بود، انتخاب را پاک کن
      if (selectedMatchId === deletingMatch.id) {
        setSelectedMatchId(null);
      }

      setToast({ message: "مسابقه با موفقیت حذف شد", type: "success" });
      setIsDeleteModalOpen(false);
      setDeletingMatch(null);
    } catch (error) {
      setToast({ message: "خطا در حذف مسابقه", type: "error" });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="مرکز مسابقات"
        subtitle="هاب مرکزی مدیریت مسابقات فوتسال و فوتبال ساحلی - آماده برای اتصال به سیستم‌های زنده و آمار"
        action={
          <button
            onClick={() => router.push("/admin/matches/new")}
            className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand/90"
          >
            افزودن مسابقه
          </button>
        }
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-[var(--border)] bg-white p-3 sm:p-4">
          <div className="text-xs sm:text-sm text-slate-600 mb-1">کل مسابقات</div>
          <div className="text-lg sm:text-2xl font-bold text-slate-900">{stats.total}</div>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-white p-3 sm:p-4">
          <div className="text-xs sm:text-sm text-slate-600 mb-1">پایان یافته</div>
          <div className="text-lg sm:text-2xl font-bold text-emerald-700">{stats.finished}</div>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-white p-3 sm:p-4">
          <div className="text-xs sm:text-sm text-slate-600 mb-1">زنده</div>
          <div className="text-lg sm:text-2xl font-bold text-red-600">{stats.live}</div>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-white p-3 sm:p-4">
          <div className="text-xs sm:text-sm text-slate-600 mb-1">برنامه‌ریزی شده</div>
          <div className="text-lg sm:text-2xl font-bold text-blue-600">{stats.scheduled}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-[var(--border)] bg-white shadow-sm overflow-hidden">
        <div className="bg-slate-50 border-b border-[var(--border)] px-4 py-3">
          <h3 className="text-sm font-semibold text-slate-900">فیلترها و جستجو</h3>
        </div>
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-2">جستجو</label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="نام تیم یا مسابقات..."
                className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">ورزش</label>
              <select
                value={sportFilter}
                onChange={(e) => setSportFilter(e.target.value as SportType | "")}
                className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
              >
                <option value="">همه ورزش‌ها</option>
                {availableSports.map((sport) => (
                  <option key={sport.id} value={sport.id}>
                    {sport.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">نوع رقابت</label>
              <select
                value={competitionTypeFilter}
                onChange={(e) => setCompetitionTypeFilter(e.target.value as CompetitionTypeFilter)}
                className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
              >
                <option value="all">همه انواع</option>
                <option value="league">لیگ</option>
                <option value="cup">جام</option>
                <option value="international">بین‌المللی</option>
                <option value="friendly">دوستانه</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">وضعیت</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as MatchStatus | "")}
                className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
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

      {/* Matches List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Matches List - Mobile/Tablet: Full width, Desktop: 2 columns */}
        <div className="lg:col-span-2 space-y-4">
          {filteredMatches.length > 0 ? (
            <>
              {/* Mobile Cards */}
              <div className="space-y-3 md:hidden">
                {filteredMatches.map((match) => {
                  const sportConfig = getSportConfig(match.sport);
                  return (
                    <div
                      key={match.id}
                      onClick={() => setSelectedMatchId(match.id)}
                      className={`rounded-xl border border-[var(--border)] bg-white p-4 shadow-sm transition-all ${
                        selectedMatchId === match.id
                          ? "ring-2 ring-brand border-brand"
                          : "hover:border-brand/50 cursor-pointer"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{sportConfig.icon}</span>
                          <span className="text-xs text-slate-500">{sportConfig.label}</span>
                        </div>
                        {getStatusBadge(match.status)}
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-slate-900">{match.homeTeam}</span>
                          {match.homeScore !== null && match.awayScore !== null && (
                            <span className="text-lg font-bold text-slate-900">{match.homeScore}</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-slate-900">{match.awayTeam}</span>
                          {match.homeScore !== null && match.awayScore !== null && (
                            <span className="text-lg font-bold text-slate-900">{match.awayScore}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-[var(--border)]">
                        <span>{match.competitionName}</span>
                        <span>
                          {match.date} {match.time}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop List */}
              <div className="hidden md:block space-y-3">
                {filteredMatches.map((match) => {
                  const sportConfig = getSportConfig(match.sport);
                  return (
                    <div
                      key={match.id}
                      onClick={() => setSelectedMatchId(match.id)}
                      className={`rounded-xl border border-[var(--border)] bg-white p-4 shadow-sm transition-all cursor-pointer ${
                        selectedMatchId === match.id
                          ? "ring-2 ring-brand border-brand bg-brand/5"
                          : "hover:border-brand/50 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="flex items-center gap-2 min-w-[100px]">
                            <span className="text-xl">{sportConfig.icon}</span>
                            <span className="text-sm text-slate-700">{sportConfig.label}</span>
                          </div>

                          <div className="flex items-center gap-4 flex-1">
                            <div className="text-right flex-1">
                              <div className="text-sm font-semibold text-slate-900">{match.homeTeam}</div>
                              <div className="text-xs text-slate-500">{match.competitionName}</div>
                            </div>

                            <div className="flex items-center gap-2 min-w-[80px] justify-center">
                              {match.homeScore !== null && match.awayScore !== null ? (
                                <>
                                  <span className="text-2xl font-bold text-slate-900">{match.homeScore}</span>
                                  <span className="text-slate-400">-</span>
                                  <span className="text-2xl font-bold text-slate-900">{match.awayScore}</span>
                                </>
                              ) : (
                                <span className="text-sm text-slate-400">vs</span>
                              )}
                            </div>

                            <div className="text-left flex-1">
                              <div className="text-sm font-semibold text-slate-900">{match.awayTeam}</div>
                              <div className="text-xs text-slate-500">
                                {match.date} {match.time}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {getStatusBadge(match.status)}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/admin/matches/${match.id}`);
                            }}
                            className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            مشاهده
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <EmptyState
              title="هیچ مسابقه‌ای یافت نشد"
              description="با تغییر فیلترها یا افزودن مسابقه جدید شروع کنید."
              action={
                <button
                  onClick={() => router.push("/admin/matches/new")}
                  className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand/90"
                >
                  افزودن مسابقه
                </button>
              }
            />
          )}
        </div>

        {/* Match Center - Desktop Sidebar */}
        {selectedMatch && (
          <div className="lg:col-span-1">
            <MatchCenter
              match={selectedMatch}
              onClose={() => setSelectedMatchId(null)}
              onDelete={handleDeleteClick}
            />
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
        isLoading={isDeleting}
      />

      {/* Toast */}
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

type MatchCenterProps = {
  match: Match;
  onClose: () => void;
  onDelete: (match: Match) => void;
};

function MatchCenter({ match, onClose, onDelete }: MatchCenterProps) {
  const router = useRouter();
  const sportConfig = getSportConfig(match.sport);
  const competition = mockCompetitions.find((c) => c.id === match.competitionId);

  const [activeTab, setActiveTab] = useState<"overview" | "stats" | "events" | "reporter">("overview");

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

  return (
    <div className="sticky top-6 space-y-4">
      {/* Match Center Card */}
      <div className="rounded-xl border border-[var(--border)] bg-white shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-l from-slate-50 to-white border-b border-[var(--border)] px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-900">مرکز مسابقه</h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 text-lg leading-none"
            >
              ×
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">{sportConfig.icon}</span>
            <span className="text-xs text-slate-600">{sportConfig.label}</span>
            {getStatusBadge(match.status)}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-[var(--border)] flex overflow-x-auto">
          {[
            { id: "overview", label: "نمای کلی", active: true },
            { id: "stats", label: "آمار", active: false },
            { id: "events", label: "رویدادها", active: false },
            { id: "reporter", label: "دسترسی خبرنگار", active: false },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === "overview") setActiveTab("overview");
                // Other tabs disabled for now
              }}
              disabled={tab.id !== "overview"}
              className={`px-4 py-2 text-xs font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "text-brand border-b-2 border-brand"
                  : tab.id === "overview"
                  ? "text-slate-600 hover:text-slate-900"
                  : "text-slate-400 cursor-not-allowed"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {activeTab === "overview" && (
            <>
              {/* Score */}
              <div className="text-center py-4 border-b border-[var(--border)]">
                <div className="text-sm text-slate-600 mb-3">{match.competitionName}</div>
                <div className="flex items-center justify-center gap-4 mb-3">
                  <div className="flex-1 text-right">
                    <div className="text-lg font-bold text-slate-900">{match.homeTeam}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {match.homeScore !== null && match.awayScore !== null ? (
                      <>
                        <span className="text-3xl font-bold text-slate-900">{match.homeScore}</span>
                        <span className="text-xl text-slate-400">-</span>
                        <span className="text-3xl font-bold text-slate-900">{match.awayScore}</span>
                      </>
                    ) : (
                      <span className="text-lg text-slate-400">vs</span>
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-lg font-bold text-slate-900">{match.awayTeam}</div>
                  </div>
                </div>
                <div className="text-xs text-slate-500">
                  {match.date} {match.time}
                </div>
              </div>

              {/* Match Info */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">مکان:</span>
                  <span className="font-medium text-slate-900">{match.venue}</span>
                </div>
                {match.referee && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">داور:</span>
                    <span className="font-medium text-slate-900">{match.referee}</span>
                  </div>
                )}
                {match.attendance && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">تماشاگر:</span>
                    <span className="font-medium text-slate-900">
                      {match.attendance.toLocaleString("fa-IR")}
                    </span>
                  </div>
                )}
                {competition && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">نوع رقابت:</span>
                    <Badge variant="info">{COMPETITION_TYPE_LABELS[competition.type]}</Badge>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-[var(--border)] space-y-2">
                <button
                  onClick={() => router.push(`/admin/matches/${match.id}`)}
                  className="w-full rounded-lg border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  مشاهده جزئیات کامل
                </button>
                <button
                  onClick={() => router.push(`/admin/matches/${match.id}/edit`)}
                  className="w-full rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand/90 transition-colors"
                >
                  ویرایش مسابقه
                </button>
                <button
                  onClick={() => onDelete(match)}
                  className="w-full rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  حذف مسابقه
                </button>
              </div>
            </>
          )}

          {activeTab === "stats" && (
            <div className="py-8 text-center text-sm text-slate-500">
              تب آمار به زودی فعال می‌شود
            </div>
          )}

          {activeTab === "events" && (
            <div className="py-8 text-center text-sm text-slate-500">
              تب رویدادها به زودی فعال می‌شود
            </div>
          )}

          {activeTab === "reporter" && (
            <div className="py-8 text-center text-sm text-slate-500">
              تب دسترسی خبرنگار به زودی فعال می‌شود
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
