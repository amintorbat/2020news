"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { LeagueContextSelector } from "@/components/admin/LeagueContextSelector";
import { useLeagueContext } from "@/contexts/LeagueContext";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Badge } from "@/components/admin/Badge";
import { EmptyState } from "@/components/admin/EmptyState";
import { Toast } from "@/components/admin/Toast";
import { DeleteConfirmationModal } from "@/components/admin/DeleteConfirmationModal";
import { Toggle } from "@/components/admin/Toggle";
import { PersianDatePicker } from "@/components/admin/PersianDatePicker";
import { PersianTimePicker } from "@/components/admin/PersianTimePicker";
import { EventTimelineEditor } from "@/components/admin/EventTimelineEditor";
import {
  Match,
  SportType,
  MatchStatus,
  MATCH_STATUS_LABELS,
  getSportConfig,
  TemporaryReporterAccess,
  ReporterPermission,
  MatchStats,
} from "@/types/matches";
import jalaali from "jalaali-js";
import { mockLeagues } from "@/lib/admin/leaguesData";
import { mockTeams } from "@/lib/admin/teamsData";
import { mockMatches } from "@/lib/admin/matchesData";
import { mockUsers } from "@/lib/admin/mock";
import { mockPlayers } from "@/lib/admin/playersData";
import { generateId } from "@/lib/utils/id";
import type { League } from "@/types/leagues";
import type { Team } from "@/types/teams";
import type { MatchEvent, MatchEventType } from "@/types/matches";

type MatchMode = "create" | "edit" | "view";
type FormStep = 1 | 2 | 3 | 4 | 5;

type MatchFormValues = {
  leagueId: string;
  homeTeamId: string;
  awayTeamId: string;
  date: string;
  time: string;
  venue: string;
  status: MatchStatus;
  reporterAccess?: TemporaryReporterAccess;
  stats?: MatchStats;
  events?: MatchEvent[]; // Event Timeline
};

type ToastState = { message: string; type: "success" | "error" } | null;

const statusLabel: Record<MatchStatus, string> = {
  scheduled: "برنامه‌ریزی شده",
  live: "زنده",
  finished: "پایان یافته",
  postponed: "تعویق یافته",
  cancelled: "لغو شده",
};

const permissionLabels: Record<ReporterPermission, string> = {
  goals: "ثبت گل",
  cards: "ثبت کارت",
  "match-news": "خبر مسابقه",
};

export default function MatchesClient() {
  const [matches, setMatches] = useState<Match[]>(mockMatches);
  const [toast, setToast] = useState<ToastState>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingMatch, setDeletingMatch] = useState<Match | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter states
  const [search, setSearch] = useState("");
  const [leagueFilter, setLeagueFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<MatchStatus | "">("");

  // Modal states
  const [mode, setMode] = useState<MatchMode>("create");
  const [activeMatch, setActiveMatch] = useState<Match | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Available leagues (only active ones for selection)
  const availableLeagues = useMemo(() => {
    return mockLeagues.filter((l) => l.status === "active");
  }, []);

  // Filtered matches
  const { selectedLeague } = useLeagueContext();

  const filteredMatches = useMemo(() => {
    return matches.filter((match) => {
      // Filter by selected league from context
      if (selectedLeague && match.leagueId !== selectedLeague.id) {
        return false;
      }

      const query = search.trim().toLowerCase();
      const matchesSearch =
        query === "" ||
        match.homeTeam.toLowerCase().includes(query) ||
        match.awayTeam.toLowerCase().includes(query) ||
        match.leagueName.toLowerCase().includes(query);

      const matchesLeague = leagueFilter === "" || match.leagueId === leagueFilter;
      const matchesStatus = statusFilter === "" || match.status === statusFilter;

      return matchesSearch && matchesLeague && matchesStatus;
    });
  }, [matches, search, leagueFilter, statusFilter, selectedLeague]);

  const stats = useMemo(() => {
    const total = filteredMatches.length;
    const finished = filteredMatches.filter((m) => m.status === "finished").length;
    const live = filteredMatches.filter((m) => m.status === "live").length;
    const scheduled = filteredMatches.filter((m) => m.status === "scheduled").length;
    return { total, finished, live, scheduled };
  }, [filteredMatches]);

  const handleOpenCreate = () => {
    setMode("create");
    setActiveMatch(null);
    setIsModalOpen(true);
  };

  const handleEditMatch = (match: Match) => {
    setMode("edit");
    setActiveMatch(match);
    setIsModalOpen(true);
  };

  const handleViewMatch = (match: Match) => {
    setMode("view");
    setActiveMatch(match);
    setIsModalOpen(true);
  };

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
      setToast({ message: "مسابقه با موفقیت حذف شد", type: "success" });
      setIsDeleteModalOpen(false);
      setDeletingMatch(null);
    } catch {
      setToast({ message: "خطا در حذف مسابقه", type: "error" });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveMatch = async (values: MatchFormValues) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 400));

    try {
      const selectedLeague = mockLeagues.find((l) => l.id === values.leagueId);
      const homeTeam = mockTeams.find((t) => t.id === values.homeTeamId);
      const awayTeam = mockTeams.find((t) => t.id === values.awayTeamId);

      if (!selectedLeague || !homeTeam || !awayTeam) {
        throw new Error("Invalid selection");
      }

      if (mode === "edit" && activeMatch) {
        setMatches((prev) =>
          prev.map((m) =>
            m.id === activeMatch.id
              ? {
                  ...m,
                  leagueId: values.leagueId,
                  leagueName: selectedLeague.title,
                  sport: selectedLeague.sportType === "futsal" ? "futsal" : "beach-soccer",
                  homeTeam: homeTeam.name,
                  homeTeamId: values.homeTeamId,
                  awayTeam: awayTeam.name,
                  awayTeamId: values.awayTeamId,
                  date: values.date,
                  time: values.time,
                  venue: values.venue,
                  status: values.status,
                  events: values.events || [],
                  homeScore: values.events
                    ? values.events.filter(
                        (e) =>
                          (e.type === "goal" || e.type === "penalty") && e.team === "home"
                      ).length +
                      values.events.filter((e) => e.type === "own-goal" && e.team === "away")
                        .length
                    : values.stats?.homeGoals ?? null,
                  awayScore: values.events
                    ? values.events.filter(
                        (e) =>
                          (e.type === "goal" || e.type === "penalty") && e.team === "away"
                      ).length +
                      values.events.filter((e) => e.type === "own-goal" && e.team === "home")
                        .length
                    : values.stats?.awayGoals ?? null,
                  reporterAccess: values.reporterAccess,
                  stats: values.stats,
                  updatedAt: new Date().toISOString(),
                }
              : m
          )
        );
        setToast({ message: "مسابقه با موفقیت ویرایش شد", type: "success" });
      } else {
        const newMatch: Match = {
          id: generateId(),
          leagueId: values.leagueId,
          leagueName: selectedLeague.title,
          sport: selectedLeague.sportType === "futsal" ? "futsal" : "beach-soccer",
          competitionId: values.leagueId, // Legacy
          competitionName: selectedLeague.title, // Legacy
          seasonId: selectedLeague.season, // Legacy
          seasonName: selectedLeague.season, // Legacy
          homeTeam: homeTeam.name,
          homeTeamId: values.homeTeamId,
          awayTeam: awayTeam.name,
          awayTeamId: values.awayTeamId,
          events: values.events || [],
          homeScore: values.events
            ? values.events.filter(
                (e) => (e.type === "goal" || e.type === "penalty") && e.team === "home"
              ).length +
              values.events.filter((e) => e.type === "own-goal" && e.team === "away").length
            : values.stats?.homeGoals ?? null,
          awayScore: values.events
            ? values.events.filter(
                (e) => (e.type === "goal" || e.type === "penalty") && e.team === "away"
              ).length +
              values.events.filter((e) => e.type === "own-goal" && e.team === "home").length
            : values.stats?.awayGoals ?? null,
          status: values.status,
          date: values.date,
          time: values.time,
          venue: values.venue,
          reporterAccess: values.reporterAccess,
          stats: values.stats,
          isPublished: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setMatches((prev) => [...prev, newMatch]);
        setToast({ message: "مسابقه جدید با موفقیت ایجاد شد", type: "success" });
      }

      setIsModalOpen(false);
      setActiveMatch(null);
      setMode("create");
    } catch {
      setToast({ message: "خطا در ذخیره اطلاعات مسابقه", type: "error" });
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
    return <Badge variant={variants[status]}>{statusLabel[status]}</Badge>;
  };

  const columns: readonly Column<Match>[] = [
    {
      key: "leagueName",
      label: "لیگ/جام",
      render: (row) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-slate-900">{row.leagueName}</span>
          <span className="text-xs text-slate-500">{row.seasonName}</span>
        </div>
      ),
    },
    {
      key: "homeTeam",
      label: "تیم‌ها",
      render: (row) => (
        <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-900">{row.homeTeam}</span>
            {row.homeScore !== null && row.awayScore !== null && (
            <>
              <span className="text-lg font-bold text-slate-900">{row.homeScore}</span>
              <span className="text-slate-400">-</span>
              <span className="text-lg font-bold text-slate-900">{row.awayScore}</span>
            </>
          )}
            <span className="text-sm font-medium text-slate-900">{row.awayTeam}</span>
          </div>
        </div>
      ),
    },
    {
      key: "date",
      label: "تاریخ و زمان",
      render: (row) => (
        <div className="text-sm text-slate-700">
          <div>{row.date}</div>
          <div className="text-xs text-slate-500">{row.time}</div>
        </div>
      ),
    },
    {
      key: "venue",
      label: "مکان",
      render: (row) => <span className="text-sm text-slate-700">{row.venue}</span>,
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
            onClick={() => handleViewMatch(row)}
            className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            مشاهده
          </button>
          <button
            onClick={() => handleEditMatch(row)}
            className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            ویرایش
          </button>
          <button
            onClick={() => handleDeleteClick(row)}
            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
          >
            حذف
          </button>
        </div>
      ),
    },
  ];

  const renderMobileCards = () => (
    <div className="space-y-3 md:hidden">
      {filteredMatches.map((match) => {
        const sportConfig = getSportConfig(match.sport);
        return (
          <div
            key={match.id}
            className="flex flex-col gap-2 rounded-xl border border-[var(--border)] bg-white p-3 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-slate-900">{match.leagueName}</h3>
                <p className="text-[11px] text-slate-500">{match.seasonName}</p>
              </div>
              {getStatusBadge(match.status)}
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-900">{match.homeTeam}</span>
                {match.homeScore !== null && match.awayScore !== null && (
                  <span className="text-base font-bold text-slate-900">
                    {match.homeScore} - {match.awayScore}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-900">{match.awayTeam}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500 border-t border-[var(--border)]">
              <span>{match.date} {match.time}</span>
              <span>{match.venue}</span>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => handleViewMatch(match)}
                className="rounded-lg border border-[var(--border)] px-3 py-1 text-[11px] text-slate-700 hover:bg-slate-50"
              >
                مشاهده
              </button>
              <button
                onClick={() => handleEditMatch(match)}
                className="rounded-lg border border-[var(--border)] px-3 py-1 text-[11px] text-slate-700 hover:bg-slate-50"
              >
                ویرایش
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="موتور مدیریت مسابقات"
        subtitle="سیستم جامع مدیریت مسابقات فوتسال و فوتبال ساحلی - اتصال به لیگ‌ها، جام‌ها و جدول رده‌بندی"
        action={
          <button
            onClick={handleOpenCreate}
            className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand/90"
          >
            ایجاد مسابقه جدید
          </button>
        }
      />

      {/* League Context Selector */}
      <LeagueContextSelector />

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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-2">جستجو</label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="نام تیم یا لیگ/جام..."
                className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">لیگ/جام</label>
              <select
                value={leagueFilter}
                onChange={(e) => setLeagueFilter(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
              >
                <option value="">همه لیگ‌ها/جام‌ها</option>
                {availableLeagues.map((league) => (
                  <option key={league.id} value={league.id}>
                    {league.title} ({league.season})
                  </option>
                ))}
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
                {Object.entries(statusLabel).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
            </div>
          </div>

      {/* Mobile list */}
      {renderMobileCards()}

      {/* Desktop table */}
      <div className="hidden md:block">
        {filteredMatches.length > 0 ? (
          <DataTable<Match>
            columns={columns}
            data={filteredMatches}
            keyExtractor={(row) => row.id}
          />
        ) : (
          <EmptyState
            title="هیچ مسابقه‌ای ثبت نشده است"
            description="برای شروع، اولین مسابقه را ایجاد کنید."
            action={
              <button
                onClick={handleOpenCreate}
                className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand/90"
              >
                ایجاد مسابقه جدید
              </button>
            }
          />
        )}
      </div>

      {/* Match Form Modal */}
      <MatchFormModal
        open={isModalOpen}
        mode={mode}
        onClose={() => {
          setIsModalOpen(false);
          setActiveMatch(null);
          setMode("create");
        }}
        onSubmit={handleSaveMatch}
        initialValues={activeMatch ? mapMatchToFormValues(activeMatch) : undefined}
        isLoading={isLoading}
      />

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

function mapMatchToFormValues(match: Match): MatchFormValues {
  return {
    leagueId: match.leagueId,
    homeTeamId: match.homeTeamId || "",
    awayTeamId: match.awayTeamId || "",
    date: match.date,
    time: match.time,
    venue: match.venue,
    status: match.status,
    reporterAccess: match.reporterAccess,
    stats: match.stats,
    events: match.events || [],
  };
}

type MatchFormModalProps = {
  open: boolean;
  mode: MatchMode;
  onClose: () => void;
  onSubmit: (values: MatchFormValues) => void;
  initialValues?: MatchFormValues;
  isLoading?: boolean;
};

function MatchFormModal({
  open,
  mode,
  onClose,
  onSubmit,
  initialValues,
  isLoading = false,
}: MatchFormModalProps) {
  const [step, setStep] = useState<FormStep>(1);
  const [form, setForm] = useState<MatchFormValues>(
    initialValues ?? {
      leagueId: "",
      homeTeamId: "",
      awayTeamId: "",
      date: "",
      time: "",
      venue: "",
      status: "scheduled",
      reporterAccess: {
        enabled: false,
        permissions: [],
      },
    }
  );

  const [errors, setErrors] = useState<Partial<Record<keyof MatchFormValues, string>>>({});

  const isView = mode === "view";
  const selectedLeague = useMemo(
    () => mockLeagues.find((l) => l.id === form.leagueId),
    [form.leagueId]
  );

  const availableTeams = useMemo(() => {
    if (!selectedLeague) return [];
    return mockTeams.filter(
      (t) =>
        t.status === "active" &&
        t.sport === (selectedLeague.sportType === "futsal" ? "futsal" : "beach-soccer")
    );
  }, [selectedLeague]);

  // Sync form when initialValues change
  if (initialValues && form.leagueId === "" && initialValues.leagueId !== "") {
    setForm(initialValues);
  }

  if (!open) return null;

  const canGoNext = () => {
    if (step === 1) return form.leagueId !== "";
    if (step === 2) return form.homeTeamId !== "" && form.awayTeamId !== "" && form.homeTeamId !== form.awayTeamId;
    if (step === 3) return form.date !== "" && form.time !== "" && form.venue !== "";
    if (step === 4) return true; // Optional step
    if (step === 5) {
      if (form.status !== "finished") return true;
      // Events are optional, but if status is finished, we should have some data
      return true;
    }
    return true;
  };

  const handleNext = () => {
    if (!canGoNext()) return;
    setStep((prev) => (prev < 5 ? ((prev + 1) as FormStep) : prev));
  };

  const handlePrev = () => {
    setStep((prev) => (prev > 1 ? ((prev - 1) as FormStep) : prev));
  };

  const handleFinalSubmit = () => {
    const newErrors: Partial<Record<keyof MatchFormValues, string>> = {};

    if (!form.leagueId) newErrors.leagueId = "انتخاب لیگ/جام الزامی است.";
    if (!form.homeTeamId) newErrors.homeTeamId = "انتخاب تیم میزبان الزامی است.";
    if (!form.awayTeamId) newErrors.awayTeamId = "انتخاب تیم میهمان الزامی است.";
    if (form.homeTeamId === form.awayTeamId) {
      newErrors.homeTeamId = "تیم میزبان و میهمان نمی‌توانند یکسان باشند.";
      newErrors.awayTeamId = "تیم میزبان و میهمان نمی‌توانند یکسان باشند.";
    }
    if (!form.date) newErrors.date = "تاریخ مسابقه الزامی است.";
    if (!form.time) newErrors.time = "زمان مسابقه الزامی است.";
    if (!form.venue) newErrors.venue = "مکان مسابقه الزامی است.";

    if (form.status === "finished" && !form.stats) {
      newErrors.stats = "برای مسابقات پایان یافته، ثبت نتیجه الزامی است.";
    }

    if (form.reporterAccess?.enabled) {
      if (!form.reporterAccess.reporterId) {
        newErrors.reporterAccess = "انتخاب خبرنگار الزامی است.";
      }
      if (!form.reporterAccess.startDate) {
        newErrors.reporterAccess = "تاریخ شروع دسترسی خبرنگار الزامی است.";
      }
      if (!form.reporterAccess.startTime) {
        newErrors.reporterAccess = "زمان شروع دسترسی خبرنگار الزامی است.";
      }
      if (!form.reporterAccess.endDate) {
        newErrors.reporterAccess = "تاریخ پایان دسترسی خبرنگار الزامی است.";
      }
      if (!form.reporterAccess.endTime) {
        newErrors.reporterAccess = "زمان پایان دسترسی خبرنگار الزامی است.";
      }
      if (form.reporterAccess.permissions.length === 0) {
        newErrors.reporterAccess = "حداقل یک دسترسی باید انتخاب شود.";
      }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    onSubmit(form);
  };

  const renderStepIndicator = () => (
    <div className="mb-4 flex items-center justify-between rounded-lg bg-slate-50 p-2">
      {["مسابقات", "تیم‌ها", "جزئیات", "دسترسی خبرنگار", "نتیجه و آمار"].map(
        (label, index) => {
          const current = (index + 1) as FormStep;
          const active = step === current;
          return (
            <button
              key={current}
              type="button"
              onClick={() => !isView && setStep(current)}
              className={
                "flex-1 rounded-md px-1 py-1 text-[10px] font-medium sm:text-xs " +
                (active ? "bg-white text-slate-900 shadow" : "text-slate-500")
              }
              disabled={isView}
            >
              {current}. {label}
            </button>
          );
        }
      )}
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      dir="rtl"
    >
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-y-auto rounded-xl bg-white p-4 shadow-xl sm:p-6 md:p-8">
        <header className="space-y-1 border-b border-[var(--border)] pb-3 sm:pb-4">
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
            {isView
              ? "نمایش جزئیات مسابقه"
              : initialValues
              ? "ویرایش مسابقه"
              : "ایجاد مسابقه جدید"}
          </h2>
          <p className="text-xs text-slate-600 sm:text-sm">
            مسابقات باید به یک لیگ یا جام حذفی متصل باشند.
          </p>
        </header>

        {renderStepIndicator()}

        <div className="space-y-4">
          {/* Step 1: Competition */}
          {step === 1 && (
            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900">گام ۱ – انتخاب مسابقات</h3>
            <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-700">
                  لیگ یا جام <span className="text-red-500">*</span>
              </label>
              <select
                  value={form.leagueId}
                  disabled={isView}
                onChange={(e) => {
                    setForm((prev) => ({
                      ...prev,
                      leagueId: e.target.value,
                      // Reset teams when league changes
                      homeTeamId: "",
                      awayTeamId: "",
                    }));
                  }}
                  className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40 disabled:bg-slate-50"
                >
                  <option value="">انتخاب کنید...</option>
                  {mockLeagues
                    .filter((l) => l.status === "active")
                    .map((league) => (
                      <option key={league.id} value={league.id}>
                        {league.title} ({league.season}) -{" "}
                        {league.competitionType === "league" ? "لیگ" : "جام حذفی"}
                  </option>
                ))}
              </select>
                {errors.leagueId && (
                  <p className="mt-1 text-[11px] text-red-500">{errors.leagueId}</p>
                )}
            </div>

              {selectedLeague && (
                <div className="rounded-lg border border-dashed border-[var(--border)] bg-slate-50/70 px-3 py-3 sm:px-4 sm:py-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">ورزش:</span>
                      <span className="font-medium text-slate-900">
                        {selectedLeague.sportType === "futsal" ? "فوتسال" : "فوتبال ساحلی"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">فصل:</span>
                      <span className="font-medium text-slate-900">{selectedLeague.season}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">نوع:</span>
                      <span className="font-medium text-slate-900">
                        {selectedLeague.competitionType === "league" ? "لیگ" : "جام حذفی"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Step 2: Teams */}
          {step === 2 && (
            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900">گام ۲ – انتخاب تیم‌ها</h3>
              {!selectedLeague ? (
                <p className="text-sm text-red-500">
                  لطفاً ابتدا لیگ/جام را انتخاب کنید.
                </p>
              ) : (
                <>
            <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-700">
                      تیم میزبان <span className="text-red-500">*</span>
              </label>
              <select
                      value={form.homeTeamId}
                      disabled={isView}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          homeTeamId: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40 disabled:bg-slate-50"
                    >
                      <option value="">انتخاب کنید...</option>
                      {availableTeams
                        .filter((t) => t.id !== form.awayTeamId)
                        .map((team) => (
                          <option key={team.id} value={team.id}>
                            {team.name} {team.city ? `(${team.city})` : ""}
                  </option>
                ))}
              </select>
                    {errors.homeTeamId && (
                      <p className="mt-1 text-[11px] text-red-500">{errors.homeTeamId}</p>
                    )}
            </div>

            <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-700">
                      تیم میهمان <span className="text-red-500">*</span>
              </label>
              <select
                      value={form.awayTeamId}
                      disabled={isView}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          awayTeamId: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40 disabled:bg-slate-50"
                    >
                      <option value="">انتخاب کنید...</option>
                      {availableTeams
                        .filter((t) => t.id !== form.homeTeamId)
                        .map((team) => (
                          <option key={team.id} value={team.id}>
                            {team.name} {team.city ? `(${team.city})` : ""}
                  </option>
                ))}
              </select>
                    {errors.awayTeamId && (
                      <p className="mt-1 text-[11px] text-red-500">{errors.awayTeamId}</p>
                    )}
            </div>

                  {form.homeTeamId && form.awayTeamId && (
                    <div className="rounded-lg border border-dashed border-[var(--border)] bg-slate-50/70 px-3 py-3 sm:px-4 sm:py-4">
                      <div className="text-center text-sm">
                        <div className="font-semibold text-slate-900">
                          {mockTeams.find((t) => t.id === form.homeTeamId)?.name}
                        </div>
                        <div className="text-slate-400 my-1">vs</div>
                        <div className="font-semibold text-slate-900">
                          {mockTeams.find((t) => t.id === form.awayTeamId)?.name}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </section>
          )}

          {/* Step 3: Match Details */}
          {step === 3 && (
            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900">گام ۳ – جزئیات مسابقه</h3>
              
              {/* Smart Presets */}
              {!isView && (
                <div className="flex flex-wrap gap-2 rounded-lg border border-dashed border-[var(--border)] bg-slate-50/70 p-3">
                  <span className="text-xs font-medium text-slate-700">پیش‌تنظیمات:</span>
                  <button
                    type="button"
                    onClick={() => {
                      const now = new Date();
                      const jalali = jalaali.toJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate());
                      const dateStr = `${jalali.jy}-${String(jalali.jm).padStart(2, "0")}-${String(jalali.jd).padStart(2, "0")}`;
                      const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
                      setForm((prev) => ({ ...prev, date: dateStr, time: timeStr }));
                    }}
                    className="rounded-lg border border-[var(--border)] bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50"
                  >
                    امروز
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const tomorrow = new Date();
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      const jalali = jalaali.toJalaali(tomorrow.getFullYear(), tomorrow.getMonth() + 1, tomorrow.getDate());
                      const dateStr = `${jalali.jy}-${String(jalali.jm).padStart(2, "0")}-${String(jalali.jd).padStart(2, "0")}`;
                      setForm((prev) => ({ ...prev, date: dateStr }));
                    }}
                    className="rounded-lg border border-[var(--border)] bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50"
                  >
                    فردا
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const now = new Date();
                      now.setHours(now.getHours() + 2);
                      const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
                      setForm((prev) => ({ ...prev, time: timeStr }));
                    }}
                    className="rounded-lg border border-[var(--border)] bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50"
                  >
                    +2 ساعت
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-700">
                    تاریخ <span className="text-red-500">*</span>
                  </label>
                  <PersianDatePicker
                    value={form.date}
                    onChange={(value) => setForm((prev) => ({ ...prev, date: value }))}
                    placeholder="انتخاب تاریخ"
                    disabled={isView}
                    className="w-full"
                  />
                  {errors.date && (
                    <p className="mt-1 text-[11px] text-red-500">{errors.date}</p>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-700">
                    زمان <span className="text-red-500">*</span>
                  </label>
                  <PersianTimePicker
                    value={form.time}
                    onChange={(value) => setForm((prev) => ({ ...prev, time: value }))}
                    placeholder="انتخاب ساعت"
                    disabled={isView}
                    className="w-full"
                  />
                  {errors.time && (
                    <p className="mt-1 text-[11px] text-red-500">{errors.time}</p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-medium text-slate-700">
                    مکان <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.venue}
                    disabled={isView}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, venue: e.target.value }))
                    }
                    placeholder="مثال: سالن آزادی"
                    className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40 disabled:bg-slate-50"
                  />
                  {errors.venue && (
                    <p className="mt-1 text-[11px] text-red-500">{errors.venue}</p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-medium text-slate-700">
                    وضعیت <span className="text-red-500">*</span>
              </label>
              <select
                    value={form.status}
                    disabled={isView}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        status: e.target.value as MatchStatus,
                        // Initialize stats if finished, reset if not
                        stats:
                          e.target.value === "finished"
                            ? prev.stats || {
                                homeGoals: 0,
                                awayGoals: 0,
                                homeYellowCards: 0,
                                homeRedCards: 0,
                                awayYellowCards: 0,
                                awayRedCards: 0,
                                homeGoalsConceded: 0,
                                awayGoalsConceded: 0,
                              }
                            : undefined,
                      }))
                    }
                    className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40 disabled:bg-slate-50"
                  >
                    {Object.entries(statusLabel).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
            </section>
          )}

          {/* Step 4: Reporter Access */}
          {step === 4 && (
            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900">
                گام ۴ – دسترسی خبرنگار موقت
              </h3>
              <p className="text-[11px] text-slate-500">
                با فعال کردن این گزینه، می‌توانید دسترسی محدود و موقت به خبرنگاران برای ثبت
                اطلاعات مسابقه بدهید.
              </p>

              <div className="space-y-3 rounded-lg border border-dashed border-[var(--border)] bg-slate-50/70 px-3 py-3 sm:px-4 sm:py-4">
                <Toggle
                  checked={form.reporterAccess?.enabled || false}
                  disabled={isView}
                  onChange={(checked) =>
                    setForm((prev) => ({
                      ...prev,
                      reporterAccess: {
                        ...prev.reporterAccess,
                        enabled: checked,
                        permissions: checked ? prev.reporterAccess?.permissions || [] : [],
                      },
                    }))
                  }
                  label="فعال‌سازی دسترسی خبرنگار موقت"
                  className={isView ? "opacity-75" : ""}
                />

                {form.reporterAccess?.enabled && (
                  <div className="mt-4 space-y-4">
                    {/* Reporter Selection */}
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-700">
                        انتخاب خبرنگار <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={form.reporterAccess?.reporterId || ""}
                        disabled={isView}
                        onChange={(e) => {
                          const selectedUser = mockUsers.find((u) => u.id === e.target.value);
                          setForm((prev) => ({
                            ...prev,
                            reporterAccess: {
                              ...prev.reporterAccess!,
                              reporterId: e.target.value,
                              reporterName: selectedUser?.name || "",
                            },
                          }));
                        }}
                        className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40 disabled:bg-slate-50"
                      >
                        <option value="">انتخاب خبرنگار...</option>
                        {mockUsers
                          .filter((u) => u.role === "reporter")
                          .map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.name} ({user.email})
                            </option>
                          ))}
                      </select>
                    </div>

                    {/* Start Date & Time */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-700">
                          تاریخ شروع دسترسی <span className="text-red-500">*</span>
                        </label>
                        <PersianDatePicker
                          value={form.reporterAccess?.startDate || ""}
                          onChange={(value) =>
                            setForm((prev) => ({
                              ...prev,
                              reporterAccess: {
                                ...prev.reporterAccess!,
                                startDate: value,
                              },
                            }))
                          }
                          placeholder="انتخاب تاریخ شروع"
                          disabled={isView}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-700">
                          زمان شروع دسترسی <span className="text-red-500">*</span>
                        </label>
                        <PersianTimePicker
                          value={form.reporterAccess?.startTime || ""}
                          onChange={(value) =>
                            setForm((prev) => ({
                              ...prev,
                              reporterAccess: {
                                ...prev.reporterAccess!,
                                startTime: value,
                              },
                            }))
                          }
                          placeholder="انتخاب زمان شروع"
                          disabled={isView}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* End Date & Time */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-700">
                          تاریخ پایان دسترسی <span className="text-red-500">*</span>
                        </label>
                        <PersianDatePicker
                          value={form.reporterAccess?.endDate || ""}
                          onChange={(value) =>
                            setForm((prev) => ({
                              ...prev,
                              reporterAccess: {
                                ...prev.reporterAccess!,
                                endDate: value,
                              },
                            }))
                          }
                          placeholder="انتخاب تاریخ پایان"
                          disabled={isView}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-700">
                          زمان پایان دسترسی <span className="text-red-500">*</span>
                        </label>
                        <PersianTimePicker
                          value={form.reporterAccess?.endTime || ""}
                          onChange={(value) =>
                            setForm((prev) => ({
                              ...prev,
                              reporterAccess: {
                                ...prev.reporterAccess!,
                                endTime: value,
                              },
                            }))
                          }
                          placeholder="انتخاب زمان پایان"
                          disabled={isView}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Permissions */}
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-700">
                        دسترسی‌های مجاز <span className="text-red-500">*</span>
                      </label>
                      <div className="space-y-2 rounded-lg border border-[var(--border)] bg-white p-3">
                        {Object.entries(permissionLabels).map(([key, label]) => (
                          <label
                            key={key}
                            className="flex items-center gap-2 cursor-pointer py-1.5"
                          >
                            <input
                              type="checkbox"
                              checked={
                                form.reporterAccess?.permissions.includes(
                                  key as ReporterPermission
                                ) || false
                              }
                              disabled={isView}
                              onChange={(e) => {
                                const permission = key as ReporterPermission;
                                const current = form.reporterAccess?.permissions || [];
                                setForm((prev) => ({
                                  ...prev,
                                  reporterAccess: {
                                    ...prev.reporterAccess!,
                                    permissions: e.target.checked
                                      ? [...current, permission]
                                      : current.filter((p) => p !== permission),
                                  },
                                }));
                              }}
                              className="rounded border-[var(--border)] text-brand focus:ring-brand/50"
                            />
                            <span className="text-sm text-slate-700">{label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {errors.reporterAccess && (
                  <p className="mt-2 text-[11px] text-red-500">{errors.reporterAccess}</p>
        )}
      </div>
            </section>
          )}

          {/* Step 5: Event Timeline */}
          {step === 5 && (
            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900">گام ۵ – خط زمانی رویدادها</h3>
              {form.status !== "finished" ? (
                <div className="rounded-lg border border-dashed border-[var(--border)] bg-slate-50/70 px-3 py-3 sm:px-4 sm:py-4">
                  <p className="text-sm text-slate-600 text-center">
                    ثبت رویدادها فقط برای مسابقات پایان یافته امکان‌پذیر است.
                  </p>
                </div>
              ) : (
                <EventTimelineEditor
                  events={form.events || []}
                  homeTeamId={form.homeTeamId}
                  awayTeamId={form.awayTeamId}
                  onEventsChange={(events) =>
                    setForm((prev) => ({ ...prev, events }))
                  }
                  disabled={isView}
                />
              )}
            </section>
          )}
        </div>

        <footer className="mt-4 flex flex-col justify-between gap-3 border-t border-[var(--border)] pt-3 sm:flex-row sm:items-center">
          <div className="text-[11px] text-slate-500 sm:text-xs">
            مسابقات به لیگ‌ها و جام‌ها متصل می‌شوند و بر جدول رده‌بندی و آمار بازیکنان تاثیر
            می‌گذارند.
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-lg border border-[var(--border)] bg-white px-4 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
            >
              بستن
            </button>
            {!isView && step > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                disabled={isLoading}
                className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
              >
                مرحله قبل
              </button>
            )}
            {!isView && step < 5 && (
              <button
                type="button"
                onClick={handleNext}
                disabled={isLoading || !canGoNext()}
                className="rounded-lg bg-brand px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
              >
                مرحله بعد
              </button>
            )}
            {!isView && step === 5 && (
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isLoading || !canGoNext()}
                className="rounded-lg bg-brand px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
              >
                {isLoading ? "در حال ذخیره..." : "ذخیره مسابقه"}
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}
