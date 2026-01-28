"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { EmptyState } from "@/components/admin/EmptyState";
import { Toast } from "@/components/admin/Toast";
import { Badge } from "@/components/admin/Badge";
import { Toggle } from "@/components/admin/Toggle";
import { mockLeagues } from "@/lib/admin/leaguesData";
import type {
  League,
  LeagueStatus,
  LeagueSportType,
  LeagueCompetitionType,
} from "@/types/leagues";
import { generateId } from "@/lib/utils/id";

type LeagueMode = "create" | "edit" | "view";
type LeagueFormStep = 1 | 2 | 3;

type LeagueFormValues = {
  title: string;
  sportType: LeagueSportType;
  competitionType: LeagueCompetitionType;
  season: string;
  status: LeagueStatus;
  numberOfTeams: number;
  promotionSpots: number;
  relegationSpots: number;
  hasGroups: boolean;
  startDate: string;
  endDate: string;
  description?: string;
};

type ToastState = { message: string; type: "success" | "error" } | null;

const statusLabel: Record<LeagueStatus, string> = {
  draft: "پیش‌نویس",
  active: "فعال",
  archived: "آرشیوشده",
};

const sportTypeLabel: Record<LeagueSportType, string> = {
  futsal: "فوتسال",
  beach_soccer: "فوتبال ساحلی",
};

const competitionTypeLabel: Record<LeagueCompetitionType, string> = {
  league: "لیگ (دوره‌ای)",
  knockout: "جام حذفی (حذفی)",
};

export default function LeaguesClient() {
  const [leagues, setLeagues] = useState<League[]>(mockLeagues);

  const [search, setSearch] = useState("");
  const [sportFilter, setSportFilter] = useState<LeagueSportType | "">("");
  const [statusFilter, setStatusFilter] = useState<LeagueStatus | "">("");
  const [competitionFilter, setCompetitionFilter] =
    useState<LeagueCompetitionType | "">("");

  const [mode, setMode] = useState<LeagueMode>("create");
  const [activeLeague, setActiveLeague] = useState<League | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  const filteredLeagues = useMemo(() => {
    return leagues.filter((league) => {
      const query = search.trim().toLowerCase();
      const matchesSearch =
        query === "" ||
        league.title.toLowerCase().includes(query) ||
        league.season.toLowerCase().includes(query) ||
        (league.description ?? "").toLowerCase().includes(query);

      const matchesSport =
        sportFilter === "" || league.sportType === sportFilter;
      const matchesStatus =
        statusFilter === "" || league.status === statusFilter;
      const matchesCompetition =
        competitionFilter === "" ||
        league.competitionType === competitionFilter;

      return matchesSearch && matchesSport && matchesStatus && matchesCompetition;
    });
  }, [leagues, search, sportFilter, statusFilter, competitionFilter]);

  const handleOpenCreate = () => {
    setMode("create");
    setActiveLeague(null);
    setIsModalOpen(true);
  };

  const handleEditLeague = (league: League) => {
    setMode("edit");
    setActiveLeague(league);
    setIsModalOpen(true);
  };

  const handleViewLeague = (league: League) => {
    setMode("view");
    setActiveLeague(league);
    setIsModalOpen(true);
  };

  const handleArchiveLeague = (league: League) => {
    if (league.status === "archived") return;

    // Lightweight confirmation – can be replaced with custom modal later
    // eslint-disable-next-line no-alert
    const ok = window.confirm(
      `آیا از آرشیو کردن لیگ «${league.title}» مطمئن هستید؟\nاین عمل لیگ را از لیست فعال خارج می‌کند اما اطلاعات آن حفظ می‌شود.`
    );
    if (!ok) return;

    setLeagues((prev) =>
      prev.map((lg) =>
        lg.id === league.id
          ? {
              ...lg,
              status: "archived" as LeagueStatus,
            }
          : lg
      )
    );
    setToast({
      message: "لیگ با موفقیت آرشیو شد.",
      type: "success",
    });
  };

  const handleSaveLeague = async (values: LeagueFormValues) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 400));

    try {
      if (mode === "edit" && activeLeague) {
        setLeagues((prev) =>
          prev.map((lg) =>
            lg.id === activeLeague.id
              ? {
                  ...lg,
                  ...values,
                }
              : lg
          )
        );
        setToast({ message: "لیگ با موفقیت ویرایش شد.", type: "success" });
      } else {
        const newLeague: League = {
          id: generateId(),
          ...values,
          createdAt: new Date().toISOString(),
        };
        setLeagues((prev) => [...prev, newLeague]);
        setToast({
          message: "لیگ جدید با موفقیت ایجاد شد.",
          type: "success",
        });
      }

      setIsModalOpen(false);
      setActiveLeague(null);
      setMode("create");
    } catch {
      setToast({
        message: "خطا در ذخیره اطلاعات لیگ.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const columns: readonly Column<League>[] = [
    {
      key: "title",
      label: "عنوان لیگ",
      render: (row) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-slate-900">{row.title}</span>
          <span className="text-xs text-slate-500">{row.season}</span>
        </div>
      ),
    },
    {
      key: "sportType",
      label: "رشته",
      render: (row) => (
        <span className="text-sm text-slate-700">
          {sportTypeLabel[row.sportType] ?? row.sportType}
        </span>
      ),
    },
    {
      key: "competitionType",
      label: "نوع رقابت",
      render: (row) => (
        <span className="text-xs text-slate-700">
          {competitionTypeLabel[row.competitionType] ?? row.competitionType}
        </span>
      ),
    },
    {
      key: "status",
      label: "وضعیت",
      render: (row) => (
        <Badge
          variant={
            row.status === "active"
              ? "success"
              : row.status === "draft"
              ? "warning"
              : "default"
          }
        >
          {statusLabel[row.status]}
        </Badge>
      ),
    },
    {
      key: "numberOfTeams",
      label: "ساختار لیگ",
      render: (row) => (
        <div className="flex flex-col gap-0.5 text-xs text-slate-700">
          <span>تعداد تیم‌ها: {row.numberOfTeams}</span>
          <span>
            صعود: {row.promotionSpots} · سقوط: {row.relegationSpots}
            {row.hasGroups ? " · دارای گروه‌ها" : ""}
          </span>
        </div>
      ),
    },
    {
      key: "id",
      label: "عملیات",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewLeague(row)}
            className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            مشاهده
          </button>
          <button
            onClick={() => handleEditLeague(row)}
            className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            ویرایش
          </button>
          <button
            onClick={() => handleArchiveLeague(row)}
            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
          >
            آرشیو
          </button>
        </div>
      ),
    },
  ];

  const renderMobileCards = () => (
    <div className="space-y-3 md:hidden">
      {filteredLeagues.map((league) => (
        <div
          key={league.id}
          className="flex flex-col gap-2 rounded-xl border border-[var(--border)] bg-white p-3 shadow-sm"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-slate-900">
                {league.title}
              </h3>
              <p className="text-[11px] text-slate-500">{league.season}</p>
            </div>
            <Badge
              variant={
                league.status === "active"
                  ? "success"
                  : league.status === "draft"
                  ? "warning"
                  : "default"
              }
              className="px-2 py-0.5 text-[10px]"
            >
              {statusLabel[league.status]}
            </Badge>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-600">
            <span>{sportTypeLabel[league.sportType]}</span>
            <span>{competitionTypeLabel[league.competitionType]}</span>
          </div>

          <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
            <span>
              تیم‌ها: {league.numberOfTeams} · صعود: {league.promotionSpots} ·
              سقوط: {league.relegationSpots}
            </span>
            {league.hasGroups && <span>لیگ گروهی</span>}
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={() => handleViewLeague(league)}
              className="rounded-lg border border-[var(--border)] px-3 py-1 text-[11px] text-slate-700 hover:bg-slate-50"
            >
              مشاهده
            </button>
            <button
              onClick={() => handleEditLeague(league)}
              className="rounded-lg border border-[var(--border)] px-3 py-1 text-[11px] text-slate-700 hover:bg-slate-50"
            >
              ویرایش
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const activeCount = leagues.filter((l) => l.status === "active").length;
  const draftCount = leagues.filter((l) => l.status === "draft").length;
  const archivedCount = leagues.filter((l) => l.status === "archived").length;

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="مدیریت لیگ‌ها"
        subtitle="هسته‌ی مدیریت لیگ‌های فوتسال و فوتبال ساحلی؛ آماده‌ی اتصال به مسابقات، تیم‌ها و جدول در ماژول‌های بعدی."
        action={
          <button
            onClick={handleOpenCreate}
            className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand/90"
          >
            ایجاد لیگ جدید
          </button>
        }
      />

      {/* Filters & quick stats */}
      <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-white shadow-sm">
        <div className="border-b border-[var(--border)] bg-slate-50 px-4 py-3">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-sm font-semibold text-slate-900">
              فیلترها و نمای کلی
            </h3>
            <p className="text-[11px] text-slate-500 sm:text-xs">
              فقط لیگ‌های فوتسال و فوتبال ساحلی نمایش داده می‌شوند؛ اضافه کردن
              رشته‌های جدید در آینده آسان خواهد بود.
            </p>
          </div>
        </div>
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2">
              <label className="mb-2 block text-xs font-semibold text-slate-700">
                جستجو
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="نام لیگ، فصل یا توضیح..."
                className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-700">
                ورزش
              </label>
              <select
                value={sportFilter}
                onChange={(e) =>
                  setSportFilter(e.target.value as LeagueSportType | "")
                }
                className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
              >
                <option value="">همه ورزش‌ها</option>
                <option value="futsal">فوتسال</option>
                <option value="beach_soccer">فوتبال ساحلی</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-700">
                وضعیت
              </label>
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as LeagueStatus | "")
                }
                className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
              >
                <option value="">همه وضعیت‌ها</option>
                <option value="draft">پیش‌نویس</option>
                <option value="active">فعال</option>
                <option value="archived">آرشیو شده</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-700">
                نوع رقابت
              </label>
              <select
                value={competitionFilter}
                onChange={(e) =>
                  setCompetitionFilter(
                    e.target.value as LeagueCompetitionType | ""
                  )
                }
                className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
              >
                <option value="">همه انواع رقابت</option>
                <option value="league">لیگ (دوره‌ای)</option>
                <option value="knockout">جام حذفی (حذفی)</option>
              </select>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2 text-xs sm:grid-cols-3 sm:text-sm">
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
              <span className="text-slate-600">لیگ‌های فعال</span>
              <span className="font-bold text-emerald-700">{activeCount}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
              <span className="text-slate-600">پیش‌نویس‌ها</span>
              <span className="font-bold text-amber-700">{draftCount}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
              <span className="text-slate-600">آرشیوشده</span>
              <span className="font-bold text-slate-700">
                {archivedCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile list */}
      {renderMobileCards()}

      {/* Desktop table */}
      <div className="hidden md:block">
        {filteredLeagues.length > 0 ? (
          <DataTable<League>
            columns={columns}
            data={filteredLeagues}
            keyExtractor={(row) => row.id}
          />
        ) : (
          <EmptyState
            title="هیچ لیگی ثبت نشده است"
            description="برای شروع، اولین لیگ فوتسال یا فوتبال ساحلی را ایجاد کنید."
            action={
              <button
                onClick={handleOpenCreate}
                className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand/90"
              >
                ایجاد لیگ جدید
              </button>
            }
          />
        )}
      </div>

      <LeagueModal
        open={isModalOpen}
        mode={mode}
        onClose={() => {
          setIsModalOpen(false);
          setActiveLeague(null);
          setMode("create");
        }}
        onSubmit={handleSaveLeague}
        initialValues={activeLeague ? mapLeagueToFormValues(activeLeague) : undefined}
        isLoading={isLoading}
      />

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

function mapLeagueToFormValues(league: League): LeagueFormValues {
  return {
    title: league.title,
    sportType: league.sportType,
    competitionType: league.competitionType,
    season: league.season,
    status: league.status,
    numberOfTeams: league.numberOfTeams,
    promotionSpots: league.promotionSpots,
    relegationSpots: league.relegationSpots,
    hasGroups: league.hasGroups,
    startDate: league.startDate,
    endDate: league.endDate,
    description: league.description,
  };
}

type LeagueModalProps = {
  open: boolean;
  mode: LeagueMode;
  onClose: () => void;
  onSubmit: (values: LeagueFormValues) => void;
  initialValues?: LeagueFormValues;
  isLoading?: boolean;
};

function LeagueModal({
  open,
  mode,
  onClose,
  onSubmit,
  initialValues,
  isLoading = false,
}: LeagueModalProps) {
  const [step, setStep] = useState<LeagueFormStep>(1);
  const [form, setForm] = useState<LeagueFormValues>(
    initialValues ?? {
      title: "",
      sportType: "futsal",
      competitionType: "league",
      season: "",
      status: "draft",
      numberOfTeams: 8,
      promotionSpots: 1,
      relegationSpots: 1,
      hasGroups: false,
      startDate: "",
      endDate: "",
      description: "",
    }
  );

  const [errors, setErrors] = useState<
    Partial<Record<keyof LeagueFormValues, string>>
  >({});

  const isView = mode === "view";

  // keep form in sync when editing different rows
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const hasInitialValues = !!initialValues;
  if (hasInitialValues && form.title === "" && initialValues) {
    // very small safeguard for first render after open
    // (avoids extra effect wiring for this demo-style state)
    // eslint-disable-next-line no-param-reassign
    setForm(initialValues);
  }

  if (!open) return null;

  const canGoNext = () => {
    if (step === 1) {
      return form.title.trim() !== "" && form.season.trim() !== "";
    }
    if (step === 2) {
      return (
        form.numberOfTeams > 1 &&
        form.promotionSpots + form.relegationSpots <= form.numberOfTeams
      );
    }
    if (step === 3) {
      return form.startDate.trim() !== "" && form.endDate.trim() !== "";
    }
    return true;
  };

  const handleNext = () => {
    if (!canGoNext()) return;
    setStep((prev) => (prev < 3 ? ((prev + 1) as LeagueFormStep) : prev));
  };

  const handlePrev = () => {
    setStep((prev) => (prev > 1 ? ((prev - 1) as LeagueFormStep) : prev));
  };

  const handleFinalSubmit = () => {
    const newErrors: Partial<Record<keyof LeagueFormValues, string>> = {};

    if (!form.title.trim()) newErrors.title = "عنوان لیگ الزامی است.";
    if (!form.season.trim()) newErrors.season = "فصل لیگ را وارد کنید.";
    if (!form.startDate.trim())
      newErrors.startDate = "تاریخ شروع لیگ را مشخص کنید.";
    if (!form.endDate.trim())
      newErrors.endDate = "تاریخ پایان لیگ را مشخص کنید.";
    if (form.numberOfTeams < 2)
      newErrors.numberOfTeams = "حداقل دو تیم برای تعریف لیگ لازم است.";
    if (form.promotionSpots + form.relegationSpots > form.numberOfTeams) {
      const msg =
        "مجموع سهمیه‌های صعود و سقوط نباید از تعداد تیم‌ها بیشتر باشد.";
      newErrors.promotionSpots = msg;
      newErrors.relegationSpots = msg;
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    onSubmit(form);
  };

  const renderStepIndicator = () => (
    <div className="mb-4 flex items-center justify-between rounded-lg bg-slate-50 p-2">
      {["اطلاعات پایه", "ساختار لیگ", "برنامه و توضیحات"].map(
        (label, index) => {
          const current = (index + 1) as LeagueFormStep;
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
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-y-auto rounded-xl bg-white p-4 shadow-xl sm:p-6 md:p-8">
        <header className="space-y-1 border-b border-[var(--border)] pb-3 sm:pb-4">
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
            {isView
              ? "نمایش جزئیات لیگ"
              : initialValues
              ? "ویرایش لیگ"
              : "ایجاد لیگ جدید"}
          </h2>
          <p className="text-xs text-slate-600 sm:text-sm">
            لیگ هسته‌ی اصلی سیستم است و به مسابقات، جدول، تیم‌ها و آمار بازیکنان
            متصل خواهد شد. این تنظیمات فقط ساختار را مشخص می‌کند و بعداً قابل
            ویرایش است.
          </p>
        </header>

        {renderStepIndicator()}

        <div className="space-y-4">
          {step === 1 && (
            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900">
                گام ۱ – اطلاعات پایه لیگ
              </h3>
              <p className="text-[11px] text-slate-500">
                این اطلاعات برای نمایش در وب‌سایت و ابزارهای داخلی (گزارش‌گیری،
                جستجو و API) استفاده می‌شود.
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-700">
                    نام لیگ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    disabled={isView}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="مثال: لیگ برتر فوتسال ایران"
                    className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40 disabled:bg-slate-50"
                  />
                  {errors.title && (
                    <p className="mt-1 text-[11px] text-red-500">
                      {errors.title}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-700">
                    ورزش <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.sportType}
                    disabled={isView}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        sportType: e.target.value as LeagueSportType,
                      }))
                    }
                    className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40 disabled:bg-slate-50"
                  >
                    <option value="futsal">فوتسال</option>
                    <option value="beach_soccer">فوتبال ساحلی</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-700">
                    فصل <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.season}
                    disabled={isView}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, season: e.target.value }))
                    }
                    placeholder="مثال: ۱۴۰۳-۱۴۰۴"
                    className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40 disabled:bg-slate-50"
                  />
                  {errors.season && (
                    <p className="mt-1 text-[11px] text-red-500">
                      {errors.season}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-700">
                    وضعیت انتشار
                  </label>
                  <select
                    value={form.status}
                    disabled={isView}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        status: e.target.value as LeagueStatus,
                      }))
                    }
                    className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40 disabled:bg-slate-50"
                  >
                    <option value="draft">پیش‌نویس</option>
                    <option value="active">فعال</option>
                    <option value="archived">آرشیو شده</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-medium text-slate-700">
                    نوع رقابت <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                    <button
                      type="button"
                      disabled={isView}
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          competitionType: "league",
                        }))
                      }
                      className={
                        "rounded-lg border px-3 py-2 text-right " +
                        (form.competitionType === "league"
                          ? "border-brand bg-brand/5 text-brand"
                          : "border-[var(--border)] text-slate-700") +
                        (isView ? " cursor-default opacity-75" : "")
                      }
                    >
                      <span className="block font-semibold">لیگ (دوره‌ای)</span>
                      <span className="mt-1 block text-[11px] text-slate-500">
                        مناسب رقابت‌های رفت و برگشت یا دوره‌ای.
                      </span>
                    </button>
                    <button
                      type="button"
                      disabled={isView}
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          competitionType: "knockout",
                        }))
                      }
                      className={
                        "rounded-lg border px-3 py-2 text-right " +
                        (form.competitionType === "knockout"
                          ? "border-brand bg-brand/5 text-brand"
                          : "border-[var(--border)] text-slate-700") +
                        (isView ? " cursor-default opacity-75" : "")
                      }
                    >
                      <span className="block font-semibold">جام حذفی (حذفی)</span>
                      <span className="mt-1 block text-[11px] text-slate-500">
                        مناسب رقابت‌های تک‌حذفی یا چندمرحله‌ای حذفی.
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900">
                گام ۲ – ساختار لیگ، گروه‌ها و صعود/سقوط
              </h3>
              <p className="text-[11px] text-slate-500">
                این تنظیمات روی منطق جدول، تعداد مراحل و اتصال به لیگ‌های بالا و
                پایین‌تر تاثیر می‌گذارد.
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-700">
                    تعداد تیم‌ها
                  </label>
                  <input
                    type="number"
                    min={2}
                    value={form.numberOfTeams}
                    disabled={isView}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        numberOfTeams: Number(e.target.value) || 0,
                      }))
                    }
                    className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40 disabled:bg-slate-50"
                  />
                  {errors.numberOfTeams && (
                    <p className="mt-1 text-[11px] text-red-500">
                      {errors.numberOfTeams}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-700">
                    سهمیه‌های صعود
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.promotionSpots}
                    disabled={isView}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        promotionSpots: Number(e.target.value) || 0,
                      }))
                    }
                    className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40 disabled:bg-slate-50"
                  />
                  {errors.promotionSpots && (
                    <p className="mt-1 text-[11px] text-red-500">
                      {errors.promotionSpots}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-700">
                    سهمیه‌های سقوط
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.relegationSpots}
                    disabled={isView}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        relegationSpots: Number(e.target.value) || 0,
                      }))
                    }
                    className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40 disabled:bg-slate-50"
                  />
                  {errors.relegationSpots && (
                    <p className="mt-1 text-[11px] text-red-500">
                      {errors.relegationSpots}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3 rounded-lg border border-dashed border-[var(--border)] bg-slate-50/70 px-3 py-3 sm:px-4 sm:py-4">
                <Toggle
                  checked={form.hasGroups}
                  disabled={isView}
                  onChange={(checked) =>
                    setForm((prev) => ({ ...prev, hasGroups: checked }))
                  }
                  label="این لیگ به صورت گروهی برگزار می‌شود (گروه A، گروه B و ...)"
                  className={isView ? "opacity-75" : ""}
                />
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  با فعال کردن این گزینه، در ماژول‌های بعدی می‌توانید تعداد گروه‌ها،
                  تعداد تیم در هر گروه و نحوه صعود از گروه‌ها به مراحل بعدی (مثلاً
                  پلی‌آف یا حذفی) را تعریف کنید.
                </p>
              </div>
            </section>
          )}

          {step === 3 && (
            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900">
                گام ۳ – برنامه زمانی و توضیحات
              </h3>
              <p className="text-[11px] text-slate-500">
                تاریخ‌های تقریبی برای هم‌راستاسازی تقویم مسابقات، پوشش رسانه‌ای و
                برنامه‌ریزی پخش زنده استفاده می‌شود.
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-700">
                    تاریخ شروع لیگ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.startDate}
                    disabled={isView}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, startDate: e.target.value }))
                    }
                    placeholder="مثال: ۱۴۰۳/۰۵/۱۰ یا 2024-07-31"
                    className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40 disabled:bg-slate-50"
                  />
                  {errors.startDate && (
                    <p className="mt-1 text-[11px] text-red-500">
                      {errors.startDate}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-700">
                    تاریخ پایان لیگ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.endDate}
                    disabled={isView}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, endDate: e.target.value }))
                    }
                    placeholder="مثال: ۱۴۰۳/۱۲/۲۵ یا 2025-03-15"
                    className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40 disabled:bg-slate-50"
                  />
                  {errors.endDate && (
                    <p className="mt-1 text-[11px] text-red-500">
                      {errors.endDate}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-700">
                  توضیحات (اختیاری)
                </label>
                <textarea
                  rows={3}
                  value={form.description ?? ""}
                  disabled={isView}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="توضیحات کوتاه درباره ساختار لیگ، محدودیت‌های خاص، قوانین انضباطی یا نکات پوشش خبری..."
                  className="w-full resize-none rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40 disabled:bg-slate-50"
                />
              </div>

              <p className="text-[11px] text-slate-500">
                می‌توانید بعداً تاریخ‌ها و توضیحات را بدون تغییر ساختار اصلی لیگ
                ویرایش کنید. این اطلاعات روی تجربه کاربر در وب‌سایت و برنامه‌های
                موبایل اثر مستقیم دارد.
              </p>
            </section>
          )}
        </div>

        <footer className="mt-4 flex flex-col justify-between gap-3 border-t border-[var(--border)] pt-3 sm:flex-row sm:items-center">
          <div className="text-[11px] text-slate-500 sm:text-xs">
            تعریف دقیق لیگ، پایه‌ی اتصال به مسابقات، تیم‌ها، جدول و آمار بازیکنان
            در کل پلتفرم است.
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
            {!isView && step < 3 && (
              <button
                type="button"
                onClick={handleNext}
                disabled={isLoading || !canGoNext()}
                className="rounded-lg bg-brand px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
              >
                مرحله بعد
              </button>
            )}
            {!isView && step === 3 && (
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isLoading || !canGoNext()}
                className="rounded-lg bg-brand px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
              >
                {isLoading ? "در حال ذخیره..." : "ذخیره لیگ"}
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}

