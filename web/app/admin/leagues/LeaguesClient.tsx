"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable, Column } from "@/components/admin/DataTable";
import { EmptyState } from "@/components/admin/EmptyState";
import { Toast } from "@/components/admin/Toast";
import { Badge } from "@/components/admin/Badge";
import { mockLeagues } from "@/lib/admin/leaguesData";
import type { League, LeagueStatus } from "@/types/leagues";
import { getAvailableSports, type SportType } from "@/types/matches";
import { generateId } from "@/lib/utils/id";

type LeagueFormStep = 1 | 2 | 3 | 4 | 5;

type LeagueFormValues = {
  name: string;
  sport: SportType;
  season: string;
  status: LeagueStatus;
  matchSettings: {
    numberOfTeams: number;
    homeAndAway: boolean;
    matchesPerTeam: number;
  };
  pointsSystem: {
    winPoints: number;
    drawPoints: number;
    lossPoints: number;
  };
  standingsRules: {
    sortPriority: ("points" | "goal-diff" | "goals-for" | "head-to-head")[];
  };
  promotionRelegation: {
    promotedTeams: number;
    relegatedTeams: number;
  };
};

const statusLabel: Record<LeagueStatus, string> = {
  active: "فعال",
  archived: "آرشیو شده",
};

export default function LeaguesClient() {
  const [leagues, setLeagues] = useState<League[]>(mockLeagues);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLeague, setEditingLeague] = useState<League | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [sportFilter, setSportFilter] = useState<SportType | "">("");
  const [statusFilter, setStatusFilter] = useState<LeagueStatus | "">("");

  const availableSports = getAvailableSports();

  const filteredLeagues = useMemo(() => {
    return leagues.filter((league) => {
      const matchesSearch =
        search === "" ||
        league.name.toLowerCase().includes(search.toLowerCase()) ||
        league.season.toLowerCase().includes(search.toLowerCase());
      const matchesSport = sportFilter === "" || league.sport === sportFilter;
      const matchesStatus = statusFilter === "" || league.status === statusFilter;
      return matchesSearch && matchesSport && matchesStatus;
    });
  }, [leagues, search, sportFilter, statusFilter]);

  const handleOpenNew = () => {
    setEditingLeague(null);
    setIsModalOpen(true);
  };

  const handleEditLeague = (league: League) => {
    setEditingLeague(league);
    setIsModalOpen(true);
  };

  const handleSaveLeague = async (values: LeagueFormValues) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    try {
      if (editingLeague) {
        setLeagues((prev) =>
          prev.map((lg) =>
            lg.id === editingLeague.id
              ? {
                  ...lg,
                  ...values,
                  updatedAt: new Date().toISOString(),
                }
              : lg
          )
        );
        setToast({ message: "لیگ با موفقیت ویرایش شد", type: "success" });
      } else {
        const newLeague: League = {
          id: generateId(),
          ...values,
          temporaryReporterIds: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setLeagues((prev) => [...prev, newLeague]);
        setToast({ message: "لیگ جدید با موفقیت ایجاد شد", type: "success" });
      }
      setIsModalOpen(false);
      setEditingLeague(null);
    } catch {
      setToast({ message: "خطا در ذخیره اطلاعات لیگ", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const columns: readonly Column<League>[] = [
    {
      key: "name",
      label: "نام لیگ",
      render: (row) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-slate-900">{row.name}</span>
          <span className="text-xs text-slate-500">{row.season}</span>
        </div>
      ),
    },
    {
      key: "sport",
      label: "ورزش",
      render: (row) => {
        const sport = availableSports.find((s) => s.id === row.sport);
        return (
          <span className="text-sm text-slate-700">
            {sport ? `${sport.icon} ${sport.label}` : row.sport}
          </span>
        );
      },
    },
    {
      key: "status",
      label: "وضعیت",
      render: (row) => (
        <span
          className={
            "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium " +
            (row.status === "active"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-slate-100 text-slate-600")
          }
        >
          {statusLabel[row.status]}
        </span>
      ),
    },
    {
      key: "matchSettings",
      label: "تعداد تیم‌ها",
      render: (row) => (
        <span className="text-sm text-slate-700">{row.matchSettings.numberOfTeams}</span>
      ),
    },
    {
      key: "pointsSystem",
      label: "سیستم امتیازدهی",
      render: (row) => (
        <span className="text-xs text-slate-600">
          برد {row.pointsSystem.winPoints} · مساوی {row.pointsSystem.drawPoints} · باخت{" "}
          {row.pointsSystem.lossPoints}
        </span>
      ),
    },
    {
      key: "id",
      label: "عملیات",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEditLeague(row)}
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-700 border border-[var(--border)] hover:bg-slate-50"
          >
            ویرایش
          </button>
        </div>
      ),
    },
  ];

  const renderMobileCards = () => (
    <div className="space-y-3 md:hidden">
      {filteredLeagues.map((league) => {
        const sport = availableSports.find((s) => s.id === league.sport);
        return (
          <div
            key={league.id}
            className="rounded-xl border border-[var(--border)] bg-white p-3 shadow-sm flex flex-col gap-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-slate-900">{league.name}</h3>
                <p className="text-[11px] text-slate-500">{league.season}</p>
              </div>
              <span
                className={
                  "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium " +
                  (league.status === "active"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-slate-100 text-slate-600")
                }
              >
                {statusLabel[league.status]}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-600">
              <span>{sport ? `${sport.label}` : league.sport}</span>
              <span>تیم‌ها: {league.matchSettings.numberOfTeams}</span>
            </div>
            <div className="flex justify-end pt-1">
              <button
                onClick={() => handleEditLeague(league)}
                className="rounded-lg border border-[var(--border)] px-3 py-1 text-[11px] text-slate-700 hover:bg-slate-50"
              >
                ویرایش لیگ
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
        title="مدیریت لیگ‌ها"
        subtitle="مرکز مدیریت لیگ‌های فوتسال و فوتبال ساحلی"
        action={
          <button
            onClick={handleOpenNew}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white bg-brand hover:bg-brand/90 transition-colors"
          >
            ایجاد لیگ جدید
          </button>
        }
      />

      {/* Filters */}
      <div className="rounded-xl border border-[var(--border)] bg-white shadow-sm overflow-hidden">
        <div className="bg-slate-50 border-b border-[var(--border)] px-4 py-3">
          <h3 className="text-sm font-semibold text-slate-900">فیلترها و جستجو</h3>
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
                placeholder="نام لیگ یا فصل..."
                className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">ورزش</label>
              <select
                value={sportFilter}
                onChange={(e) => setSportFilter(e.target.value as SportType | "")}
                className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
              >
                <option value="">همه ورزش‌ها</option>
                <option value="futsal">فوتسال</option>
                <option value="beach-soccer">فوتبال ساحلی</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">وضعیت</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as LeagueStatus | "")}
                className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
              >
                <option value="">همه وضعیت‌ها</option>
                <option value="active">فعال</option>
                <option value="archived">آرشیو شده</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile cards */}
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
                onClick={handleOpenNew}
                className="rounded-lg px-4 py-2 text-sm font-medium text-white bg-brand hover:bg-brand/90 transition-colors"
              >
                ایجاد لیگ جدید
              </button>
            }
          />
        )}
      </div>

      {/* Wizard Modal */}
      <LeagueWizardModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingLeague(null);
        }}
        onSubmit={handleSaveLeague}
        isLoading={isLoading}
        initialValues={editingLeague ? mapLeagueToFormValues(editingLeague) : undefined}
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

// Helper: map League -> LeagueFormValues
function mapLeagueToFormValues(league: League): LeagueFormValues {
  return {
    name: league.name,
    sport: league.sport,
    season: league.season,
    status: league.status,
    matchSettings: league.matchSettings,
    pointsSystem: league.pointsSystem,
    standingsRules: league.standingsRules,
    promotionRelegation: league.promotionRelegation,
  };
}

type LeagueWizardModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: LeagueFormValues) => void;
  initialValues?: LeagueFormValues;
  isLoading?: boolean;
};

function LeagueWizardModal({
  open,
  onClose,
  onSubmit,
  initialValues,
  isLoading = false,
}: LeagueWizardModalProps) {
  const [step, setStep] = useState<LeagueFormStep>(1);
  const [form, setForm] = useState<LeagueFormValues>(
    initialValues || {
      name: "",
      sport: "futsal",
      season: "",
      status: "active",
      matchSettings: {
        numberOfTeams: 10,
        homeAndAway: true,
        matchesPerTeam: 18,
      },
      pointsSystem: {
        winPoints: 3,
        drawPoints: 1,
        lossPoints: 0,
      },
      standingsRules: {
        sortPriority: ["points", "goal-diff", "goals-for", "head-to-head"],
      },
      promotionRelegation: {
        promotedTeams: 1,
        relegatedTeams: 1,
      },
    }
  );

  const sports = getAvailableSports();

  if (!open) return null;

  const canGoNext = () => {
    if (step === 1) {
      return form.name.trim() !== "" && form.season.trim() !== "";
    }
    if (step === 2) {
      return form.matchSettings.numberOfTeams > 1;
    }
    if (step === 3) {
      return form.pointsSystem.winPoints > form.pointsSystem.lossPoints;
    }
    return true;
  };

  const handleNext = () => {
    if (!canGoNext()) return;
    setStep((prev) => (prev < 5 ? ((prev + 1) as LeagueFormStep) : prev));
  };

  const handlePrev = () => {
    setStep((prev) => (prev > 1 ? ((prev - 1) as LeagueFormStep) : prev));
  };

  const handleFinalSubmit = () => {
    if (!canGoNext()) return;
    onSubmit(form);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between rounded-lg bg-slate-50 p-2 mb-4">
      {[
        "اطلاعات پایه",
        "تنظیمات مسابقات",
        "سیستم امتیازدهی",
        "قوانین جدول",
        "صعود و سقوط",
      ].map((label, index) => {
        const current = (index + 1) as LeagueFormStep;
        const active = step === current;
        return (
          <button
            key={current}
            type="button"
            onClick={() => setStep(current)}
            className={
              "flex-1 rounded-md px-1 py-1 text-[10px] sm:text-xs font-medium " +
              (active ? "bg-white shadow text-slate-900" : "text-slate-500")
            }
          >
            {current}. {label}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" dir="rtl">
      <div className="w-full max-w-3xl rounded-xl bg-white p-4 sm:p-6 md:p-8 shadow-xl max-h-[90vh] overflow-y-auto space-y-4">
        <header className="space-y-1 border-b border-[var(--border)] pb-3 sm:pb-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            {initialValues ? "ویرایش لیگ" : "ایجاد لیگ جدید"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            مراحل تنظیم لیگ برای مدیریت مسابقات، جدول و صعود/سقوط
          </p>
        </header>

        {renderStepIndicator()}

        {/* Steps content */}
        <div className="space-y-4">
          {step === 1 && (
            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900">گام ۱ – اطلاعات پایه</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    نام لیگ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="مثال: لیگ برتر فوتسال ایران"
                    className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    ورزش <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.sport}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, sport: e.target.value as SportType }))
                    }
                    className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                  >
                    {sports.map((sport) => (
                      <option key={sport.id} value={sport.id}>
                        {sport.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    فصل <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.season}
                    onChange={(e) => setForm((prev) => ({ ...prev, season: e.target.value }))}
                    placeholder="مثال: ۱۴۰۳-۱۴۰۴"
                    className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">وضعیت</label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, status: e.target.value as LeagueStatus }))
                    }
                    className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                  >
                    <option value="active">فعال</option>
                    <option value="archived">آرشیو شده</option>
                  </select>
                </div>
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900">
                گام ۲ – تنظیمات مسابقات
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    تعداد تیم‌ها
                  </label>
                  <input
                    type="number"
                    min={2}
                    value={form.matchSettings.numberOfTeams}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        matchSettings: {
                          ...prev.matchSettings,
                          numberOfTeams: Number(e.target.value) || 0,
                        },
                      }))
                    }
                    className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    سیستم رفت و برگشت
                  </label>
                  <select
                    value={form.matchSettings.homeAndAway ? "yes" : "no"}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        matchSettings: {
                          ...prev.matchSettings,
                          homeAndAway: e.target.value === "yes",
                        },
                      }))
                    }
                    className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                  >
                    <option value="yes">رفت و برگشت</option>
                    <option value="no">تک‌مرحله‌ای</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    بازی برای هر تیم
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={form.matchSettings.matchesPerTeam}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        matchSettings: {
                          ...prev.matchSettings,
                          matchesPerTeam: Number(e.target.value) || 0,
                        },
                      }))
                    }
                    className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                  />
                </div>
              </div>
            </section>
          )}

          {step === 3 && (
            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900">
                گام ۳ – سیستم امتیازدهی
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    امتیاز برد
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.pointsSystem.winPoints}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        pointsSystem: {
                          ...prev.pointsSystem,
                          winPoints: Number(e.target.value) || 0,
                        },
                      }))
                    }
                    className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    امتیاز مساوی
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.pointsSystem.drawPoints}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        pointsSystem: {
                          ...prev.pointsSystem,
                          drawPoints: Number(e.target.value) || 0,
                        },
                      }))
                    }
                    className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    امتیاز باخت
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.pointsSystem.lossPoints}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        pointsSystem: {
                          ...prev.pointsSystem,
                          lossPoints: Number(e.target.value) || 0,
                        },
                      }))
                    }
                    className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                  />
                </div>
              </div>
            </section>
          )}

          {step === 4 && (
            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900">
                گام ۴ – قوانین جدول
              </h3>
              <p className="text-xs text-slate-600">
                ترتیب زیر مشخص می‌کند در صورت تساوی امتیاز، جدول بر اساس چه معیاری به ترتیب
                بعدی برود.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {["points", "goal-diff", "goals-for", "head-to-head"].map((key, index) => {
                  const labelMap: Record<string, string> = {
                    points: "امتیاز",
                    "goal-diff": "تفاضل گل",
                    "goals-for": "گل زده",
                    "head-to-head": "رویارویی مستقیم",
                  };
                  const currentKey = key as "points" | "goal-diff" | "goals-for" | "head-to-head";
                  const activeIndex = form.standingsRules.sortPriority.indexOf(currentKey);
                  const isActive = activeIndex !== -1;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setForm((prev) => {
                          const current = prev.standingsRules.sortPriority;
                          if (isActive) {
                            return {
                              ...prev,
                              standingsRules: {
                                sortPriority: current.filter((k) => k !== currentKey),
                              },
                            };
                          }
                          return {
                            ...prev,
                            standingsRules: {
                              sortPriority: [...current, currentKey],
                            },
                          };
                        });
                      }}
                      className={
                        "flex flex-col items-center justify-center rounded-lg border px-2 py-2 text-xs font-medium " +
                        (isActive
                          ? "border-brand bg-brand/5 text-brand"
                          : "border-[var(--border)] bg-white text-slate-700")
                      }
                    >
                      <span>{labelMap[key]}</span>
                      {isActive && (
                        <span className="mt-1 rounded-full bg-brand text-[10px] text-white px-2 py-0.5">
                          اولویت {activeIndex + 1}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {step === 5 && (
            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900">
                گام ۵ – صعود و سقوط
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    تعداد تیم‌های صعود کننده
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.promotionRelegation.promotedTeams}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        promotionRelegation: {
                          ...prev.promotionRelegation,
                          promotedTeams: Number(e.target.value) || 0,
                        },
                      }))
                    }
                    className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    تعداد تیم‌های سقوط کننده
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.promotionRelegation.relegatedTeams}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        promotionRelegation: {
                          ...prev.promotionRelegation,
                          relegatedTeams: Number(e.target.value) || 0,
                        },
                      }))
                    }
                    className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                  />
                </div>
              </div>
              <p className="text-[11px] text-slate-500">
                می‌توانید بعداً این مقادیر را بر اساس تغییرات در ساختار لیگ یا تصمیمات کمیته
                مسابقات ویرایش کنید.
              </p>
            </section>
          )}
        </div>

        {/* Actions */}
        <footer className="flex flex-col sm:flex-row justify-between gap-3 pt-4 border-t border-[var(--border)]">
          <div className="text-[11px] text-slate-500 sm:text-xs">
            لیگ به‌عنوان هسته‌ی سیستم، بعداً به مسابقات، جدول، و آمار بازیکنان متصل خواهد شد.
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-lg border border-[var(--border)] bg-white px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              انصراف
            </button>
            {step > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                disabled={isLoading}
                className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                مرحله قبل
              </button>
            )}
            {step < 5 && (
              <button
                type="button"
                onClick={handleNext}
                disabled={isLoading || !canGoNext()}
                className="rounded-lg bg-brand px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-brand/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                مرحله بعد
              </button>
            )}
            {step === 5 && (
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isLoading || !canGoNext()}
                className="rounded-lg bg-brand px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-brand/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

