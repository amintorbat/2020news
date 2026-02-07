"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { Toast } from "@/components/admin/Toast";
import { PersianDatePicker } from "@/components/admin/PersianDatePicker";
import { PersianTimePicker } from "@/components/admin/PersianTimePicker";
import { Match, MatchStatus, getAvailableSports, SportType } from "@/types/matches";
import { mockTeams } from "@/lib/admin/teamsData";
import { mockLeagues } from "@/lib/admin/leaguesData";
import { generateId } from "@/lib/utils/id";
import type { League } from "@/types/leagues";

export default function MatchNewClient() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [match, setMatch] = useState<Partial<Match> & { homeTeamId?: string; awayTeamId?: string }>({
    sport: "futsal",
    leagueId: "",
    leagueName: "",
    competitionId: "", // Legacy
    competitionName: "", // Legacy
    seasonId: "",
    seasonName: "",
    homeTeamId: "",
    awayTeamId: "",
    homeTeam: "",
    awayTeam: "",
    homeScore: null,
    awayScore: null,
    status: "scheduled",
    date: "",
    time: "",
    venue: "",
    events: [],
    isPublished: false,
  });

  const selectedLeague = useMemo(
    () => mockLeagues.find((l) => l.id === match.leagueId),
    [match.leagueId]
  );

  const availableTeams = useMemo(
    () => mockTeams.filter((t) => t.sport === (match.sport as SportType)),
    [match.sport]
  );

  const homeTeamOptions = availableTeams;
  const awayTeamOptions = availableTeams.filter((t) => t.id !== match.homeTeamId);

  const handleSave = async () => {
    if (
      !match.sport ||
      !match.leagueId ||
      !match.homeTeamId ||
      !match.awayTeamId ||
      !match.date ||
      !match.time
    ) {
      setToast({ message: "لطفاً تمام فیلدهای الزامی را پر کنید", type: "error" });
      return;
    }

    if (match.homeTeamId === match.awayTeamId) {
      setToast({ message: "تیم میزبان و میهمان نمی‌توانند یکسان باشند", type: "error" });
      return;
    }

    const homeTeam = availableTeams.find((t) => t.id === match.homeTeamId);
    const awayTeam = availableTeams.find((t) => t.id === match.awayTeamId);

    if (!selectedLeague) {
      setToast({ message: "لطفاً لیگ یا جام را انتخاب کنید", type: "error" });
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      const newMatch: Match = {
        id: generateId(),
        leagueId: match.leagueId!,
        leagueName: selectedLeague.title,
        sport: match.sport || "futsal",
        competitionId: match.leagueId!, // Legacy
        competitionName: selectedLeague.title, // Legacy
        seasonId: selectedLeague.season, // Legacy
        seasonName: selectedLeague.season, // Legacy
        homeTeam: homeTeam?.name || "",
        homeTeamId: homeTeam?.id,
        awayTeam: awayTeam?.name || "",
        awayTeamId: awayTeam?.id,
        homeScore: match.homeScore ?? null,
        awayScore: match.awayScore ?? null,
        status: match.status || "scheduled",
        date: match.date!,
        time: match.time!,
        venue: match.venue || "",
        events: match.events || [],
        isPublished: match.isPublished || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setToast({ message: "مسابقه جدید با موفقیت ایجاد شد", type: "success" });
      setTimeout(() => {
        router.push(`/admin/matches/${newMatch.id}`);
      }, 1500);
    } catch {
      setToast({ message: "خطا در ایجاد مسابقه", type: "error" });
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="افزودن مسابقه جدید"
        subtitle="ایجاد مسابقه جدید برای فوتسال و فوتبال ساحلی"
        action={
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              انصراف
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="rounded-lg px-4 py-2 text-sm font-medium text-white bg-brand hover:bg-brand/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "در حال ذخیره..." : "ذخیره مسابقه"}
            </button>
          </div>
        }
      />

      {/* Mobile stepper */}
      <div className="flex items-center justify-between rounded-lg bg-slate-50 p-2 md:hidden">
        <button
          type="button"
          onClick={() => setStep(1)}
          className={`flex-1 rounded-md px-2 py-1 text-xs font-medium ${
            step === 1 ? "bg-white shadow text-slate-900" : "text-slate-500"
          }`}
        >
          ۱. ورزش و مسابقات
        </button>
        <button
          type="button"
          onClick={() => setStep(2)}
          className={`flex-1 rounded-md px-2 py-1 text-xs font-medium ${
            step === 2 ? "bg-white shadow text-slate-900" : "text-slate-500"
          }`}
        >
          ۲. تیم‌ها و نتیجه
        </button>
        <button
          type="button"
          onClick={() => setStep(3)}
          className={`flex-1 rounded-md px-2 py-1 text-xs font-medium ${
            step === 3 ? "bg-white shadow text-slate-900" : "text-slate-500"
          }`}
        >
          ۳. زمان و جزئیات
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: General Info */}
          <div
            className={`rounded-xl border border-[var(--border)] bg-white p-4 sm:p-6 shadow-sm ${
              step !== 1 ? "hidden md:block" : ""
            }`}
          >
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4">
              اطلاعات کلی مسابقه
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  ورزش <span className="text-red-500">*</span>
                </label>
                <select
                  value={match.sport}
                  onChange={(e) => {
                    setMatch((prev) => ({
                      ...prev,
                      sport: e.target.value as Match["sport"],
                      competitionId: "",
                      seasonId: "",
                      homeTeamId: "",
                      awayTeamId: "",
                    }));
                  }}
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                >
                  {getAvailableSports().map((sport) => (
                    <option key={sport.id} value={sport.id}>
                      {sport.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  لیگ یا جام <span className="text-red-500">*</span>
                </label>
                <select
                  value={match.leagueId}
                  onChange={(e) => {
                    const league = mockLeagues.find((l) => l.id === e.target.value);
                    setMatch((prev) => ({
                      ...prev,
                      leagueId: e.target.value,
                      leagueName: league?.title || "",
                      competitionId: e.target.value, // Legacy
                      competitionName: league?.title || "", // Legacy
                      seasonId: league?.season || "", // Legacy
                      seasonName: league?.season || "", // Legacy
                    }));
                  }}
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                >
                  <option value="">انتخاب لیگ یا جام</option>
                  {mockLeagues
                    .filter((l) => l.status === "active" && l.sportType === (match.sport === "futsal" ? "futsal" : "beach_soccer"))
                    .map((league) => (
                      <option key={league.id} value={league.id}>
                        {league.title} ({league.season}) - {league.competitionType === "league" ? "لیگ" : "جام حذفی"}
                      </option>
                    ))}
                </select>
              </div>

              {selectedLeague && (
                <div className="sm:col-span-2">
                  <div className="rounded-lg border border-dashed border-[var(--border)] bg-slate-50/70 px-3 py-3 sm:px-4 sm:py-4">
                    <div className="space-y-2 text-sm">
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
              </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">وضعیت</label>
                <select
                  value={match.status}
                  onChange={(e) =>
                    setMatch((prev) => ({
                      ...prev,
                      status: e.target.value as MatchStatus,
                    }))
                  }
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                >
                  <option value="scheduled">برنامه‌ریزی شده</option>
                  <option value="live">زنده</option>
                  <option value="finished">پایان یافته</option>
                  <option value="postponed">تعویق یافته</option>
                  <option value="cancelled">لغو شده</option>
                </select>
              </div>
            </div>
          </div>

          {/* Step 2: Teams and Score */}
          <div
            className={`rounded-xl border border-[var(--border)] bg-white p-4 sm:p-6 shadow-sm ${
              step !== 2 ? "hidden md:block" : ""
            }`}
          >
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4">
              تیم‌ها و نتیجه
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  تیم میزبان <span className="text-red-500">*</span>
                </label>
                <select
                  value={match.homeTeamId || ""}
                  onChange={(e) =>
                    setMatch((prev) => ({
                      ...prev,
                      homeTeamId: e.target.value,
                      // reset away if equal
                      awayTeamId:
                        prev.awayTeamId === e.target.value ? "" : prev.awayTeamId,
                    }))
                  }
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                >
                  <option value="">انتخاب تیم میزبان</option>
                  {homeTeamOptions.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  تیم میهمان <span className="text-red-500">*</span>
                </label>
                <select
                  value={match.awayTeamId || ""}
                  onChange={(e) =>
                    setMatch((prev) => ({
                      ...prev,
                      awayTeamId: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                >
                  <option value="">انتخاب تیم میهمان</option>
                  {awayTeamOptions.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
                {match.homeTeamId && match.awayTeamId === match.homeTeamId && (
                  <p className="mt-1 text-[11px] text-red-500">
                    تیم میزبان و میهمان باید متفاوت باشند
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  گل میزبان
                </label>
                <input
                  type="number"
                  min={0}
                  value={match.homeScore ?? ""}
                  onChange={(e) =>
                    setMatch((prev) => ({
                      ...prev,
                      homeScore: e.target.value === "" ? null : parseInt(e.target.value, 10),
                    }))
                  }
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  گل میهمان
                </label>
                <input
                  type="number"
                  min={0}
                  value={match.awayScore ?? ""}
                  onChange={(e) =>
                    setMatch((prev) => ({
                      ...prev,
                      awayScore: e.target.value === "" ? null : parseInt(e.target.value, 10),
                    }))
                  }
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Date, Time, Venue */}
          <div
            className={`rounded-xl border border-[var(--border)] bg-white p-4 sm:p-6 shadow-sm ${
              step !== 3 ? "hidden md:block" : ""
            }`}
          >
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4">
              زمان و مکان
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  تاریخ <span className="text-red-500">*</span>
                </label>
                <PersianDatePicker
                  value={match.date || ""}
                  onChange={(value) => setMatch((prev) => ({ ...prev, date: value }))}
                  placeholder="انتخاب تاریخ شمسی"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  ساعت <span className="text-red-500">*</span>
                </label>
                <PersianTimePicker
                  value={match.time || ""}
                  onChange={(value) => setMatch((prev) => ({ ...prev, time: value }))}
                  placeholder="انتخاب ساعت"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  مکان
                </label>
                <input
                  type="text"
                  value={match.venue}
                  onChange={(e) => setMatch((prev) => ({ ...prev, venue: e.target.value }))}
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                  placeholder="نام سالن یا ورزشگاه"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-xl border border-[var(--border)] bg-white p-4 sm:p-6 shadow-sm">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4">
              اطلاعات تکمیلی
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  داور
                </label>
                <input
                  type="text"
                  value={match.referee || ""}
                  onChange={(e) => setMatch((prev) => ({ ...prev, referee: e.target.value }))}
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                  placeholder="نام داور"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  تعداد تماشاگر
                </label>
                <input
                  type="number"
                  min={0}
                  value={match.attendance ?? ""}
                  onChange={(e) =>
                    setMatch((prev) => ({
                      ...prev,
                      attendance:
                        e.target.value === "" ? undefined : parseInt(e.target.value, 10),
                    }))
                  }
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                  placeholder="تعداد تماشاگر"
                />
              </div>
              <div className="text-[11px] text-slate-500">
                <p>تمامی داده‌ها فقط در محیط مدیریت و به صورت موقت (Mock) ذخیره می‌شوند.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

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
