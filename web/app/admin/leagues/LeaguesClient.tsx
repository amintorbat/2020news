"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { EmptyState } from "@/components/admin/EmptyState";
import { Toast } from "@/components/admin/Toast";
import { Badge } from "@/components/admin/Badge";
import { Toggle } from "@/components/admin/Toggle";
import { PersianDatePicker } from "@/components/admin/PersianDatePicker";
import { GroupStageManager, type LeagueGroup } from "@/components/admin/GroupStageManager";
import { mockLeagues } from "@/lib/admin/leaguesData";
import jalaali from "jalaali-js";
import type {
  League,
  LeagueStatus,
  LeagueSportType,
  LeagueCompetitionType,
  PointsSystem,
  RankingRules,
  RankingPriority,
} from "@/types/leagues";
import type { CompetitionFormat } from "@/types/bracket";
import { FORMAT_LABELS } from "@/types/bracket";
import { generateId } from "@/lib/utils/id";

type CompetitionMode = "create" | "edit" | "view";
type FormStep = 1 | 2 | 3;

type CompetitionFormValues = {
  title: string;
  sportType: LeagueSportType;
  competitionType: LeagueCompetitionType;
  /** فرمت تفصیلی: لیگ، حذفی، گروهی، گروه+حذفی، پلی‌آف، رده‌بندی */
  competitionFormat: CompetitionFormat;
  season: string;
  status: LeagueStatus;
    numberOfTeams: number;
  startDate: string;
  endDate: string;
  description?: string;

  // League-specific fields
  promotionSpots?: number;
  relegationSpots?: number;
  hasGroups?: boolean;
  groups?: LeagueGroup[]; // Group stage groups
  pointsSystem?: PointsSystem;
  rankingRules?: RankingRules;
  hasStandingsTable?: boolean;

  // Knockout-specific fields
  twoLeggedMatches?: boolean;
  hasThirdPlaceMatch?: boolean;
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
  knockout: "جام حذفی",
};

/** توضیح کوتاه هر فرمت برای کارت‌های انتخاب در فرم */
const FORMAT_DESCRIPTIONS: Record<CompetitionFormat, string> = {
  league: "مناسب رقابت‌های رفت و برگشت با جدول رده‌بندی",
  knockout: "مناسب رقابت‌های تک‌حذفی یا چند مرحله‌ای",
  group_stage: "فقط مرحله گروهی؛ جدول هر گروه",
  group_knockout: "مرحله گروهی سپس حذفی (سبک جام جهانی)",
  playoff: "پلی‌آف بین رتبه‌ها",
  classification: "مسابقات رده‌بندی (مقام‌ها)",
};

const FORMAT_ORDER: CompetitionFormat[] = [
  "league",
  "knockout",
  "group_stage",
  "group_knockout",
  "playoff",
  "classification",
];

export default function LeaguesClient() {
  const [competitions, setCompetitions] = useState<League[]>(mockLeagues);

  const [search, setSearch] = useState("");
  const [sportFilter, setSportFilter] = useState<LeagueSportType | "">("");
  const [statusFilter, setStatusFilter] = useState<LeagueStatus | "">("");
  const [competitionFilter, setCompetitionFilter] =
    useState<LeagueCompetitionType | "">("");

  const [mode, setMode] = useState<CompetitionMode>("create");
  const [activeCompetition, setActiveCompetition] = useState<League | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  const filteredCompetitions = useMemo(() => {
    return competitions.filter((competition) => {
      const query = search.trim().toLowerCase();
      const matchesSearch =
        query === "" ||
        competition.title.toLowerCase().includes(query) ||
        competition.season.toLowerCase().includes(query) ||
        (competition.description ?? "").toLowerCase().includes(query);

      const matchesSport =
        sportFilter === "" || competition.sportType === sportFilter;
      const matchesStatus =
        statusFilter === "" || competition.status === statusFilter;
      const matchesCompetition =
        competitionFilter === "" ||
        competition.competitionType === competitionFilter;

      return matchesSearch && matchesSport && matchesStatus && matchesCompetition;
    });
  }, [competitions, search, sportFilter, statusFilter, competitionFilter]);

  const handleOpenCreate = () => {
    setMode("create");
    setActiveCompetition(null);
    setIsModalOpen(true);
  };

  const handleEditCompetition = (competition: League) => {
    setMode("edit");
    setActiveCompetition(competition);
    setIsModalOpen(true);
  };

  const handleViewCompetition = (competition: League) => {
    setMode("view");
    setActiveCompetition(competition);
    setIsModalOpen(true);
  };

  const handleSaveCompetition = async (values: CompetitionFormValues) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 400));

    try {
      if (mode === "edit" && activeCompetition) {
        setCompetitions((prev) =>
          prev.map((comp) =>
            comp.id === activeCompetition.id
              ? {
                  ...comp,
                  ...values,
                }
              : comp
          )
        );
        setToast({ message: "مسابقات با موفقیت ویرایش شد.", type: "success" });
      } else {
        const newCompetition: League = {
          id: generateId(),
          ...values,
          createdAt: new Date().toISOString(),
        };
        setCompetitions((prev) => [...prev, newCompetition]);
        setToast({
          message: "مسابقات جدید با موفقیت ایجاد شد.",
          type: "success",
        });
      }

      setIsModalOpen(false);
      setActiveCompetition(null);
      setMode("create");
    } catch {
      setToast({
        message: "خطا در ذخیره اطلاعات مسابقات.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const columns: readonly Column<League>[] = [
    {
      key: "title",
      label: "عنوان مسابقات",
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
          {row.competitionFormat
            ? FORMAT_LABELS[row.competitionFormat]
            : competitionTypeLabel[row.competitionType] ?? row.competitionType}
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
      label: "ساختار",
      render: (row) => (
        <div className="flex flex-col gap-0.5 text-xs text-slate-700">
          <span>تعداد تیم‌ها: {row.numberOfTeams}</span>
          {row.competitionType === "league" && (
            <>
              {row.promotionSpots !== undefined && row.promotionSpots > 0 && (
                <span>صعود: {row.promotionSpots}</span>
              )}
              {row.relegationSpots !== undefined && row.relegationSpots > 0 && (
                <span>سقوط: {row.relegationSpots}</span>
              )}
            </>
          )}
          {row.competitionType === "knockout" && (
            <>
              {row.twoLeggedMatches && <span>رفت و برگشت</span>}
              {row.hasThirdPlaceMatch && <span>مسابقه رده‌بندی</span>}
            </>
          )}
        </div>
      ),
    },
    {
      key: "id",
      label: "عملیات",
      render: (row) => (
        <div className="flex items-center gap-2 flex-wrap">
          {(row.competitionType === "knockout" ||
            (row.competitionFormat && ["knockout", "group_knockout", "playoff"].includes(row.competitionFormat))) && (
            <Link
              href={`/admin/leagues/bracket/${row.id}`}
              className="rounded-lg border border-brand/40 bg-brand/5 px-3 py-1.5 text-xs font-medium text-brand hover:bg-brand/10"
            >
              چارت
            </Link>
          )}
          <button
            onClick={() => handleViewCompetition(row)}
            className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            مشاهده
          </button>
          <button
            onClick={() => handleEditCompetition(row)}
            className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            ویرایش
          </button>
        </div>
      ),
    },
  ];

  const renderMobileCards = () => (
    <div className="space-y-3 md:hidden">
      {filteredCompetitions.map((competition) => (
          <div
          key={competition.id}
          className="flex flex-col gap-2 rounded-xl border border-[var(--border)] bg-white p-3 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-slate-900">
                {competition.title}
              </h3>
              <p className="text-[11px] text-slate-500">{competition.season}</p>
              </div>
            <Badge
              variant={
                competition.status === "active"
                  ? "success"
                  : competition.status === "draft"
                  ? "warning"
                  : "default"
              }
              className="px-2 py-0.5 text-[10px]"
              >
              {statusLabel[competition.status]}
            </Badge>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-600">
            <span>{sportTypeLabel[competition.sportType]}</span>
            <span>
              {competition.competitionFormat
                ? FORMAT_LABELS[competition.competitionFormat]
                : competitionTypeLabel[competition.competitionType]}
            </span>
            </div>

          <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
            <span>تیم‌ها: {competition.numberOfTeams}</span>
            {competition.competitionType === "league" && (
              <span>
                {competition.promotionSpots || 0} صعود /{" "}
                {competition.relegationSpots || 0} سقوط
              </span>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-1 flex-wrap">
            {(competition.competitionType === "knockout" ||
              (competition.competitionFormat && ["knockout", "group_knockout", "playoff"].includes(competition.competitionFormat))) && (
              <Link
                href={`/admin/leagues/bracket/${competition.id}`}
                className="rounded-lg border border-brand/40 bg-brand/5 px-3 py-1 text-[11px] font-medium text-brand hover:bg-brand/10"
              >
                چارت
              </Link>
            )}
              <button
              onClick={() => handleViewCompetition(competition)}
                className="rounded-lg border border-[var(--border)] px-3 py-1 text-[11px] text-slate-700 hover:bg-slate-50"
              >
              مشاهده
            </button>
            <button
              onClick={() => handleEditCompetition(competition)}
              className="rounded-lg border border-[var(--border)] px-3 py-1 text-[11px] text-slate-700 hover:bg-slate-50"
            >
              ویرایش
            </button>
            </div>
          </div>
      ))}
    </div>
  );

  const activeCount = competitions.filter((c) => c.status === "active").length;
  const draftCount = competitions.filter((c) => c.status === "draft").length;
  const archivedCount = competitions.filter((c) => c.status === "archived")
    .length;

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="مرکز مدیریت مسابقات"
        subtitle="مدیریت جامع لیگ‌های دوره‌ای و جام‌های حذفی فوتسال و فوتبال ساحلی - آماده برای اتصال به مسابقات و جدول رده‌بندی"
        action={
          <button
            onClick={handleOpenCreate}
            className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand/90"
          >
            ایجاد مسابقات جدید
          </button>
        }
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-[var(--border)] bg-white p-3 sm:p-4">
          <div className="text-xs sm:text-sm text-slate-600 mb-1">
            مسابقات فعال
          </div>
          <div className="text-lg sm:text-2xl font-bold text-emerald-700">
            {activeCount}
          </div>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-white p-3 sm:p-4">
          <div className="text-xs sm:text-sm text-slate-600 mb-1">
            پیش‌نویس‌ها
          </div>
          <div className="text-lg sm:text-2xl font-bold text-amber-700">
            {draftCount}
          </div>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-white p-3 sm:p-4 col-span-2 sm:col-span-1">
          <div className="text-xs sm:text-sm text-slate-600 mb-1">
            آرشیوشده
          </div>
          <div className="text-lg sm:text-2xl font-bold text-slate-700">
            {archivedCount}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-[var(--border)] bg-white shadow-sm overflow-hidden">
        <div className="bg-slate-50 border-b border-[var(--border)] px-4 py-3">
          <h3 className="text-sm font-semibold text-slate-900">
            فیلترها و جستجو
          </h3>
        </div>
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                جستجو
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="نام مسابقات، فصل یا توضیح..."
                className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                ورزش
              </label>
              <select
                value={sportFilter}
                onChange={(e) =>
                  setSportFilter(e.target.value as LeagueSportType | "")
                }
                className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
              >
                <option value="">همه ورزش‌ها</option>
                <option value="futsal">فوتسال</option>
                <option value="beach_soccer">فوتبال ساحلی</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                نوع رقابت
              </label>
              <select
                value={competitionFilter}
                onChange={(e) =>
                  setCompetitionFilter(
                    e.target.value as LeagueCompetitionType | ""
                  )
                }
                className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
              >
                <option value="">همه انواع</option>
                <option value="league">لیگ (دوره‌ای)</option>
                <option value="knockout">جام حذفی</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                وضعیت
              </label>
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as LeagueStatus | "")
                }
                className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
              >
                <option value="">همه وضعیت‌ها</option>
                <option value="draft">پیش‌نویس</option>
                <option value="active">فعال</option>
                <option value="archived">آرشیو شده</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile list */}
      {renderMobileCards()}

      {/* Desktop table */}
      <div className="hidden md:block">
        {filteredCompetitions.length > 0 ? (
          <DataTable<League>
            columns={columns}
            data={filteredCompetitions}
            keyExtractor={(row) => row.id}
          />
        ) : (
          <EmptyState
            title="هیچ مسابقه‌ای ثبت نشده است"
            description="برای شروع، اولین لیگ یا جام حذفی را ایجاد کنید."
            action={
              <button
                onClick={handleOpenCreate}
                className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand/90"
              >
                ایجاد مسابقات جدید
              </button>
            }
          />
        )}
      </div>

      <CompetitionModal
        open={isModalOpen}
        mode={mode}
        onClose={() => {
          setIsModalOpen(false);
          setActiveCompetition(null);
          setMode("create");
        }}
        onSubmit={handleSaveCompetition}
        initialValues={
          activeCompetition
            ? mapCompetitionToFormValues(activeCompetition)
            : undefined
        }
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

function formatToCompetitionType(format: CompetitionFormat): LeagueCompetitionType {
  return format === "knockout" || format === "group_knockout" || format === "playoff"
    ? "knockout"
    : "league";
}

function mapCompetitionToFormValues(
  competition: League
): CompetitionFormValues {
  const format: CompetitionFormat =
    competition.competitionFormat ??
    (competition.competitionType === "knockout" ? "knockout" : "league");
  return {
    title: competition.title,
    sportType: competition.sportType,
    competitionType: competition.competitionType,
    competitionFormat: format,
    season: competition.season,
    status: competition.status,
    numberOfTeams: competition.numberOfTeams,
    startDate: competition.startDate,
    endDate: competition.endDate,
    description: competition.description,
    promotionSpots: competition.promotionSpots,
    relegationSpots: competition.relegationSpots,
    hasGroups: competition.hasGroups,
    groups: (competition as any).groups || [],
    pointsSystem: competition.pointsSystem,
    rankingRules: competition.rankingRules,
      hasStandingsTable: competition.hasStandingsTable,
    twoLeggedMatches: competition.twoLeggedMatches,
    hasThirdPlaceMatch: competition.hasThirdPlaceMatch,
  };
}

type CompetitionModalProps = {
  open: boolean;
  mode: CompetitionMode;
  onClose: () => void;
  onSubmit: (values: CompetitionFormValues) => void;
  initialValues?: CompetitionFormValues;
  isLoading?: boolean;
};

function CompetitionModal({
  open,
  mode,
  onClose,
  onSubmit,
  initialValues,
  isLoading = false,
}: CompetitionModalProps) {
  const [step, setStep] = useState<FormStep>(1);
  const [form, setForm] = useState<CompetitionFormValues>(
    initialValues ?? {
      title: "",
      sportType: "futsal",
      competitionType: "league",
      competitionFormat: "league",
      season: "",
      status: "draft",
      numberOfTeams: 8,
      startDate: "",
      endDate: "",
      description: "",
      // League defaults
      promotionSpots: 1,
      relegationSpots: 1,
      hasGroups: false,
      groups: [],
      pointsSystem: {
        winPoints: 3,
        drawPoints: 1,
        lossPoints: 0,
      },
      rankingRules: {
        priorities: ["points", "goalDifference", "goalsFor", "headToHead"],
        useHeadToHead: true,
      },
      hasStandingsTable: true,
      // Knockout defaults
      twoLeggedMatches: false,
      hasThirdPlaceMatch: false,
    }
  );

  const [errors, setErrors] = useState<
    Partial<Record<keyof CompetitionFormValues, string>>
  >({});

  const isView = mode === "view";
  const isLeague = form.competitionType === "league";
  const isKnockout = form.competitionType === "knockout";

  // Sync form when initialValues change
  if (initialValues && form.title === "" && initialValues.title !== "") {
    setForm(initialValues);
  }

  if (!open) return null;

  const canGoNext = () => {
    if (step === 1) {
      return form.title.trim() !== "" && form.season.trim() !== "";
    }
    if (step === 2) {
      if (form.numberOfTeams < 2) return false;
      if (isLeague) {
        const promo = form.promotionSpots || 0;
        const releg = form.relegationSpots || 0;
        return promo + releg <= form.numberOfTeams;
      }
      return true;
    }
    if (step === 3) {
      return form.startDate.trim() !== "" && form.endDate.trim() !== "";
    }
    return true;
  };

  const handleNext = () => {
    if (!canGoNext()) return;
    setStep((prev) => (prev < 3 ? ((prev + 1) as FormStep) : prev));
  };

  const handlePrev = () => {
    setStep((prev) => (prev > 1 ? ((prev - 1) as FormStep) : prev));
  };

  const handleFinalSubmit = () => {
    const newErrors: Partial<
      Record<keyof CompetitionFormValues, string>
    > = {};

    if (!form.title.trim()) newErrors.title = "عنوان مسابقات الزامی است.";
    if (!form.season.trim()) newErrors.season = "فصل را وارد کنید.";
    if (!form.startDate.trim())
      newErrors.startDate = "تاریخ شروع را مشخص کنید.";
    if (!form.endDate.trim())
      newErrors.endDate = "تاریخ پایان را مشخص کنید.";
    if (form.numberOfTeams < 2)
      newErrors.numberOfTeams = "حداقل دو تیم لازم است.";

    if (isLeague) {
      const promo = form.promotionSpots || 0;
      const releg = form.relegationSpots || 0;
      if (promo + releg > form.numberOfTeams) {
        const msg =
          "مجموع سهمیه‌های صعود و سقوط نباید از تعداد تیم‌ها بیشتر باشد.";
        newErrors.promotionSpots = msg;
        newErrors.relegationSpots = msg;
      }
      
      // Validate groups if hasGroups is enabled
      if (form.hasGroups) {
        const totalAssignedTeams = (form.groups || []).reduce(
          (sum, g) => sum + g.teamIds.length,
          0
        );
        if (totalAssignedTeams !== form.numberOfTeams) {
          newErrors.groups = `باید تمام ${form.numberOfTeams} تیم را به گروه‌ها اختصاص دهید. (فعلاً ${totalAssignedTeams} تیم اختصاص یافته)`;
        }
      }
      
      // Validate date range
      if (form.startDate && form.endDate) {
        const [startYear, startMonth, startDay] = form.startDate.split("-").map(Number);
        const [endYear, endMonth, endDay] = form.endDate.split("-").map(Number);
        
        if (startYear > endYear || 
            (startYear === endYear && startMonth > endMonth) ||
            (startYear === endYear && startMonth === endMonth && startDay > endDay)) {
          newErrors.endDate = "تاریخ پایان باید بعد از تاریخ شروع باشد.";
        }
      }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    onSubmit(form);
  };

  const renderStepIndicator = () => (
    <div className="mb-4 flex items-center justify-between gap-1 rounded-lg bg-slate-50 p-1.5 sm:p-2">
      {["اطلاعات پایه", "ساختار مسابقات", "برنامه زمانی"].map(
        (label, index) => {
          const current = (index + 1) as FormStep;
        const active = step === current;
          const completed = step > current;
        return (
          <button
            key={current}
            type="button"
              onClick={() => !isView && setStep(current)}
            className={
                "flex-1 rounded-md px-1 py-1.5 text-[9px] font-medium transition-all sm:text-[10px] md:text-xs " +
                (active
                  ? "bg-white text-slate-900 shadow-sm"
                  : completed
                  ? "text-slate-700 hover:bg-slate-100"
                  : "text-slate-500")
            }
              disabled={isView}
            >
              <span className="hidden sm:inline">{current}. </span>
              {label}
          </button>
        );
        }
      )}
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4"
      dir="rtl"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isView) {
          onClose();
        }
      }}
    >
      <div className="flex max-h-[95vh] w-full max-w-4xl flex-col overflow-y-auto rounded-xl bg-white p-3 shadow-xl sm:p-4 md:p-6 lg:p-8">
        <header className="space-y-1 border-b border-[var(--border)] pb-3 sm:pb-4">
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
            {isView
              ? "نمایش جزئیات مسابقات"
              : initialValues
              ? "ویرایش مسابقات"
              : "ایجاد مسابقات جدید"}
          </h2>
          <p className="text-xs text-slate-600 sm:text-sm">
            مسابقات هسته‌ی اصلی سیستم هستند و به مسابقات، جدول رده‌بندی و
            آمار متصل می‌شوند.
          </p>
        </header>

        {renderStepIndicator()}

        <div className="space-y-4">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900">
                گام ۱ – اطلاعات پایه
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-700">
                    عنوان مسابقات <span className="text-red-500">*</span>
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
                  <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm lg:grid-cols-3">
                    {FORMAT_ORDER.map((format) => (
                      <button
                        key={format}
                        type="button"
                        disabled={isView}
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            competitionFormat: format,
                            competitionType: formatToCompetitionType(format),
                          }))
                        }
                        className={
                          "rounded-lg border px-3 py-2 text-right " +
                          (form.competitionFormat === format
                            ? "border-brand bg-brand/5 text-brand"
                            : "border-[var(--border)] text-slate-700") +
                          (isView ? " cursor-default opacity-75" : "")
                        }
                      >
                        <span className="block font-semibold">
                          {FORMAT_LABELS[format]}
                        </span>
                        <span className="mt-1 block text-[11px] text-slate-500">
                          {FORMAT_DESCRIPTIONS[format]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Step 2: Competition Structure */}
          {step === 2 && (
            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900">
                گام ۲ – ساختار مسابقات
              </h3>
              <p className="text-[11px] text-slate-500">
                {isLeague
                  ? "تنظیمات مخصوص لیگ‌های دوره‌ای با جدول رده‌بندی"
                  : "تنظیمات مخصوص جام‌های حذفی"}
              </p>

              {/* Common: Number of Teams */}
                <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-700">
                  تعداد تیم‌ها <span className="text-red-500">*</span>
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

              {/* League-specific fields */}
              {isLeague && (
                <>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-700">
                        سهمیه‌های صعود
                  </label>
                      <input
                        type="number"
                        min={0}
                        value={form.promotionSpots || 0}
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
                        value={form.relegationSpots || 0}
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

                  {/* League Rules Module */}
                  <div className="space-y-4 rounded-lg border border-[var(--border)] bg-white p-4 shadow-sm">
                    <h4 className="text-sm font-semibold text-slate-900">قوانین لیگ</h4>
                    
                    {/* Points System */}
                <div>
                      <label className="mb-3 block text-xs font-semibold text-slate-700">
                        سیستم امتیازدهی
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="mb-1 block text-[11px] text-slate-600">
                    امتیاز برد
                  </label>
                  <input
                    type="number"
                    min={0}
                            value={form.pointsSystem?.winPoints || 3}
                            disabled={isView}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        pointsSystem: {
                          winPoints: Number(e.target.value) || 0,
                                  drawPoints: prev.pointsSystem?.drawPoints ?? 1,
                                  lossPoints: prev.pointsSystem?.lossPoints ?? 0,
                        },
                      }))
                    }
                            className="w-full rounded-lg border border-[var(--border)] bg-white px-2 py-1.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40 disabled:bg-slate-50"
                  />
                </div>
                <div>
                          <label className="mb-1 block text-[11px] text-slate-600">
                    امتیاز مساوی
                  </label>
                  <input
                    type="number"
                    min={0}
                            value={form.pointsSystem?.drawPoints || 1}
                            disabled={isView}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        pointsSystem: {
                                  winPoints: prev.pointsSystem?.winPoints ?? 3,
                          drawPoints: Number(e.target.value) || 0,
                                  lossPoints: prev.pointsSystem?.lossPoints ?? 0,
                        },
                      }))
                    }
                            className="w-full rounded-lg border border-[var(--border)] bg-white px-2 py-1.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40 disabled:bg-slate-50"
                  />
                </div>
                <div>
                          <label className="mb-1 block text-[11px] text-slate-600">
                    امتیاز باخت
                  </label>
                  <input
                    type="number"
                    min={0}
                            value={form.pointsSystem?.lossPoints || 0}
                            disabled={isView}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        pointsSystem: {
                                  winPoints: prev.pointsSystem?.winPoints ?? 3,
                                  drawPoints: prev.pointsSystem?.drawPoints ?? 1,
                          lossPoints: Number(e.target.value) || 0,
                        },
                      }))
                    }
                            className="w-full rounded-lg border border-[var(--border)] bg-white px-2 py-1.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40 disabled:bg-slate-50"
                  />
                </div>
              </div>
                    </div>

                    {/* Ranking Priority */}
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-slate-700">
                        اولویت رده‌بندی
                      </label>
                      <p className="mb-3 text-[11px] text-slate-500">
                        ترتیب معیارهای رده‌بندی تیم‌ها (از مهم‌ترین به کم‌اهمیت‌ترین)
              </p>
                      <div className="space-y-2">
                        {(form.rankingRules?.priorities || ["points", "goalDifference", "goalsFor", "headToHead"]).map((priority, index) => {
                          const priorityLabels: Record<RankingPriority, string> = {
                    points: "امتیاز",
                            goalDifference: "تفاضل گل",
                            goalsFor: "گل‌های زده",
                            goalsAgainst: "گل‌های خورده",
                            headToHead: "نتایج رو در رو",
                  };
                  return (
                            <div key={index} className="flex items-center gap-2">
                              <div className="flex h-6 w-6 items-center justify-center rounded bg-slate-100 text-[10px] font-medium text-slate-600">
                                {index + 1}
                              </div>
                              <select
                                value={priority}
                                disabled={isView}
                                onChange={(e) => {
                                  const newPriorities = [...(form.rankingRules?.priorities || [])];
                                  newPriorities[index] = e.target.value as RankingPriority;
                                  setForm((prev) => ({
                              ...prev,
                                    rankingRules: {
                                      priorities: newPriorities,
                                      useHeadToHead: prev.rankingRules?.useHeadToHead ?? true,
                            },
                                  }));
                      }}
                                className="flex-1 rounded-lg border border-[var(--border)] bg-white px-2 py-1 text-xs focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40 disabled:bg-slate-50"
                    >
                                {Object.entries(priorityLabels).map(([value, label]) => (
                                  <option key={value} value={value}>
                                    {label}
                                  </option>
                                ))}
                              </select>
                            </div>
                  );
                })}
              </div>
                    </div>
                  </div>

                  {/* Standings Table Toggle */}
                  <div className="space-y-2 rounded-lg border border-dashed border-[var(--border)] bg-slate-50/70 px-3 py-3 sm:px-4 sm:py-4">
                    <Toggle
                      checked={form.hasStandingsTable ?? true}
                      disabled={isView}
                      onChange={(checked) =>
                        setForm((prev) => ({
                          ...prev,
                          hasStandingsTable: checked,
                        }))
                      }
                      label="فعال‌سازی جدول رده‌بندی"
                      className={isView ? "opacity-75" : ""}
                    />
                    <p className="text-[11px] text-slate-500">
                      با فعال کردن این گزینه، جدول رده‌بندی برای این لیگ ایجاد
                      می‌شود و به‌صورت خودکار بر اساس نتایج مسابقات به‌روزرسانی
                      می‌شود.
                    </p>
                  </div>

                  {/* Has Groups Toggle */}
                  <div className="space-y-3 rounded-lg border border-[var(--border)] bg-white p-4 shadow-sm">
                    <Toggle
                      checked={form.hasGroups || false}
                      disabled={isView}
                      onChange={(checked) =>
                        setForm((prev) => ({
                          ...prev,
                          hasGroups: checked,
                          groups: checked ? prev.groups || [] : [],
                        }))
                      }
                      label="این لیگ به صورت گروهی برگزار می‌شود"
                      className={isView ? "opacity-75" : ""}
                    />
                    <p className="text-[11px] text-slate-500">
                      با فعال کردن این گزینه، می‌توانید گروه‌ها را تعریف و تیم‌ها را به آن‌ها اختصاص دهید.
                    </p>
                    
                    {/* Group Stage Manager */}
                    {form.hasGroups && (
                      <div className="mt-4 border-t border-[var(--border)] pt-4">
                        <GroupStageManager
                          numberOfTeams={form.numberOfTeams}
                          sportType={form.sportType}
                          groups={form.groups || []}
                          onGroupsChange={(newGroups) =>
                            setForm((prev) => ({ ...prev, groups: newGroups }))
                          }
                          disabled={isView}
                        />
                        {errors.groups && (
                          <p className="mt-2 text-[11px] text-red-500">{errors.groups}</p>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Knockout-specific fields */}
              {isKnockout && (
                <>
                  <div className="space-y-3 rounded-lg border border-dashed border-[var(--border)] bg-slate-50/70 px-3 py-3 sm:px-4 sm:py-4">
                    <Toggle
                      checked={form.twoLeggedMatches || false}
                      disabled={isView}
                      onChange={(checked) =>
                        setForm((prev) => ({
                          ...prev,
                          twoLeggedMatches: checked,
                        }))
                      }
                      label="مسابقات به صورت رفت و برگشت برگزار می‌شود"
                      className={isView ? "opacity-75" : ""}
                    />
                    <p className="text-[11px] text-slate-500">
                      با فعال کردن این گزینه، هر مرحله شامل دو مسابقه (رفت و
                      برگشت) خواهد بود و نتیجه مجموع دو مسابقه تعیین‌کننده است.
                    </p>
                  </div>

                  <div className="space-y-3 rounded-lg border border-dashed border-[var(--border)] bg-slate-50/70 px-3 py-3 sm:px-4 sm:py-4">
                    <Toggle
                      checked={form.hasThirdPlaceMatch || false}
                      disabled={isView}
                      onChange={(checked) =>
                        setForm((prev) => ({
                          ...prev,
                          hasThirdPlaceMatch: checked,
                        }))
                      }
                      label="مسابقه رده‌بندی (مقام سوم) برگزار می‌شود"
                      className={isView ? "opacity-75" : ""}
                    />
                    <p className="text-[11px] text-slate-500">
                      با فعال کردن این گزینه، مسابقه‌ای بین دو تیم بازنده نیمه‌نهایی
                      برای تعیین مقام سوم برگزار می‌شود.
                    </p>
                  </div>
                </>
              )}
            </section>
          )}

          {/* Step 3: Schedule */}
          {step === 3 && (
            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900">
                گام ۳ – برنامه زمانی و توضیحات
              </h3>
              
              {/* Smart Date Presets */}
              {!isView && (
                <div className="flex flex-wrap gap-2 rounded-lg border border-dashed border-[var(--border)] bg-slate-50/70 p-3">
                  <span className="text-xs font-medium text-slate-700">پیش‌تنظیمات:</span>
                  <button
                    type="button"
                    onClick={() => {
                      const now = new Date();
                      const jalali = jalaali.toJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate());
                      const dateStr = `${jalali.jy}-${String(jalali.jm).padStart(2, "0")}-${String(jalali.jd).padStart(2, "0")}`;
                      setForm((prev) => ({ ...prev, startDate: dateStr }));
                    }}
                    className="rounded-lg border border-[var(--border)] bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50"
                  >
                    امروز (شروع)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const nextMonth = new Date();
                      nextMonth.setMonth(nextMonth.getMonth() + 1);
                      const jalali = jalaali.toJalaali(nextMonth.getFullYear(), nextMonth.getMonth() + 1, nextMonth.getDate());
                      const dateStr = `${jalali.jy}-${String(jalali.jm).padStart(2, "0")}-${String(jalali.jd).padStart(2, "0")}`;
                      setForm((prev) => ({ ...prev, endDate: dateStr }));
                    }}
                    className="rounded-lg border border-[var(--border)] bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50"
                  >
                    یک ماه بعد (پایان)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const now = new Date();
                      const jalaliStart = jalaali.toJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate());
                      const startStr = `${jalaliStart.jy}-${String(jalaliStart.jm).padStart(2, "0")}-${String(jalaliStart.jd).padStart(2, "0")}`;
                      
                      const sixMonthsLater = new Date();
                      sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
                      const jalaliEnd = jalaali.toJalaali(sixMonthsLater.getFullYear(), sixMonthsLater.getMonth() + 1, sixMonthsLater.getDate());
                      const endStr = `${jalaliEnd.jy}-${String(jalaliEnd.jm).padStart(2, "0")}-${String(jalaliEnd.jd).padStart(2, "0")}`;
                      
                      setForm((prev) => ({ ...prev, startDate: startStr, endDate: endStr }));
                    }}
                    className="rounded-lg border border-[var(--border)] bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50"
                  >
                    فصل کامل (۶ ماه)
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-700">
                    تاریخ شروع <span className="text-red-500">*</span>
                  </label>
                  <PersianDatePicker
                    value={form.startDate}
                    onChange={(value) => setForm((prev) => ({ ...prev, startDate: value }))}
                    placeholder="انتخاب تاریخ شروع"
                    disabled={isView}
                    className="w-full"
                  />
                  {errors.startDate && (
                    <p className="mt-1 text-[11px] text-red-500">
                      {errors.startDate}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-700">
                    تاریخ پایان <span className="text-red-500">*</span>
                  </label>
                  <PersianDatePicker
                    value={form.endDate}
                    onChange={(value) => setForm((prev) => ({ ...prev, endDate: value }))}
                    placeholder="انتخاب تاریخ پایان"
                    disabled={isView}
                    className="w-full"
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
                  placeholder="توضیحات کوتاه درباره ساختار مسابقات..."
                  className="w-full resize-none rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40 disabled:bg-slate-50"
                  />
                </div>
            </section>
          )}
        </div>

        <footer className="mt-6 border-t border-[var(--border)] bg-white pt-4">
          {/* Info text - only on desktop, above buttons */}
          <div className="mb-3 hidden text-center text-[11px] text-slate-500 sm:block">
            مسابقات هسته‌ی اصلی سیستم هستند و به مسابقات، جدول و آمار متصل می‌شوند.
          </div>
          
          {/* Action buttons */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
            {!isView && step > 1 && (
            <button
              type="button"
                onClick={handlePrev}
              disabled={isLoading}
                className="order-2 w-full rounded-lg border border-[var(--border)] bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:order-1 sm:w-auto"
            >
                مرحله قبل
            </button>
            )}
              <button
                type="button"
              onClick={onClose}
                disabled={isLoading}
              className="order-3 w-full rounded-lg border border-[var(--border)] bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:order-2 sm:w-auto"
              >
              بستن
              </button>
            {!isView && step < 3 && (
              <button
                type="button"
                onClick={handleNext}
                disabled={isLoading || !canGoNext()}
                className="order-1 w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-50 sm:order-3 sm:w-auto"
              >
                مرحله بعد
              </button>
            )}
            {!isView && step === 3 && (
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isLoading || !canGoNext()}
                className="order-1 w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-50 sm:order-3 sm:w-auto"
              >
                {isLoading ? "در حال ذخیره..." : "ذخیره مسابقات"}
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}
