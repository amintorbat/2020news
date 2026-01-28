"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { Toast } from "@/components/admin/Toast";
import { PersianDatePicker } from "@/components/admin/PersianDatePicker";
import { PersianTimePicker } from "@/components/admin/PersianTimePicker";
import { Match, Competition, MatchStatus, getAvailableSports } from "@/types/matches";

type Props = {
  competitions: Competition[];
};

export default function MatchNewClient({ competitions }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [match, setMatch] = useState<Partial<Match>>({
    sport: "futsal",
    competitionId: "",
    competitionName: "",
    seasonId: "",
    seasonName: "",
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

  const selectedCompetition = useMemo(() => {
    return competitions.find((c) => c.id === match.competitionId);
  }, [competitions, match.competitionId]);

  const availableSeasons = useMemo(() => {
    return selectedCompetition?.seasons || [];
  }, [selectedCompetition]);

  const handleSave = async () => {
    if (!match.homeTeam || !match.awayTeam || !match.competitionId || !match.seasonId || !match.date || !match.time) {
      setToast({ message: "لطفاً تمام فیلدهای الزامی را پر کنید", type: "error" });
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      const newMatch: Match = {
        id: crypto.randomUUID(),
        sport: match.sport || "futsal",
        competitionId: match.competitionId!,
        competitionName: match.competitionName!,
        seasonId: match.seasonId!,
        seasonName: match.seasonName!,
        homeTeam: match.homeTeam!,
        awayTeam: match.awayTeam!,
        homeScore: match.homeScore,
        awayScore: match.awayScore,
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
    } catch (error) {
      setToast({ message: "خطا در ایجاد مسابقه", type: "error" });
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="افزودن مسابقه جدید"
        subtitle="ایجاد مسابقه جدید برای سیستم"
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Info */}
          <div className="rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">اطلاعات کلی</h3>
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
                  مسابقات <span className="text-red-500">*</span>
                </label>
                <select
                  value={match.competitionId}
                  onChange={(e) => {
                    const comp = competitions.find((c) => c.id === e.target.value);
                    setMatch((prev) => ({
                      ...prev,
                      competitionId: e.target.value,
                      competitionName: comp?.name || "",
                      seasonId: comp?.seasons[0]?.id || "",
                      seasonName: comp?.seasons[0]?.name || "",
                    }));
                  }}
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                >
                  <option value="">انتخاب مسابقات</option>
                  {competitions
                    .filter((c) => c.sport === match.sport)
                    .map((comp) => (
                      <option key={comp.id} value={comp.id}>
                        {comp.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  فصل <span className="text-red-500">*</span>
                </label>
                <select
                  value={match.seasonId}
                  onChange={(e) => {
                    const season = availableSeasons.find((s) => s.id === e.target.value);
                    setMatch((prev) => ({
                      ...prev,
                      seasonId: e.target.value,
                      seasonName: season?.name || "",
                    }));
                  }}
                  disabled={!match.competitionId}
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand disabled:opacity-50"
                >
                  <option value="">انتخاب فصل</option>
                  {availableSeasons.map((season) => (
                    <option key={season.id} value={season.id}>
                      {season.name}
                    </option>
                  ))}
                </select>
              </div>

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

          {/* Teams and Score */}
          <div className="rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">تیم‌ها و نتیجه</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  تیم میزبان <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={match.homeTeam}
                  onChange={(e) => setMatch((prev) => ({ ...prev, homeTeam: e.target.value }))}
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                  placeholder="نام تیم میزبان"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  تیم میهمان <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={match.awayTeam}
                  onChange={(e) => setMatch((prev) => ({ ...prev, awayTeam: e.target.value }))}
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                  placeholder="نام تیم میهمان"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">گل میزبان</label>
                <input
                  type="number"
                  min={0}
                  value={match.homeScore ?? ""}
                  onChange={(e) =>
                    setMatch((prev) => ({
                      ...prev,
                      homeScore: e.target.value === "" ? null : parseInt(e.target.value),
                    }))
                  }
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">گل میهمان</label>
                <input
                  type="number"
                  min={0}
                  value={match.awayScore ?? ""}
                  onChange={(e) =>
                    setMatch((prev) => ({
                      ...prev,
                      awayScore: e.target.value === "" ? null : parseInt(e.target.value),
                    }))
                  }
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                />
              </div>
            </div>
          </div>

          {/* Date, Time, Venue */}
          <div className="rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">زمان و مکان</h3>
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
                <label className="block text-xs font-medium text-slate-700 mb-1.5">مکان</label>
                <input
                  type="text"
                  value={match.venue}
                  onChange={(e) => setMatch((prev) => ({ ...prev, venue: e.target.value }))}
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                  placeholder="نام مکان"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Additional Info */}
          <div className="rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">اطلاعات تکمیلی</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">داور</label>
                <input
                  type="text"
                  value={match.referee || ""}
                  onChange={(e) => setMatch((prev) => ({ ...prev, referee: e.target.value }))}
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                  placeholder="نام داور"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">تعداد تماشاگر</label>
                <input
                  type="number"
                  min={0}
                  value={match.attendance || ""}
                  onChange={(e) =>
                    setMatch((prev) => ({
                      ...prev,
                      attendance: e.target.value === "" ? undefined : parseInt(e.target.value),
                    }))
                  }
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                  placeholder="تعداد تماشاگر"
                />
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
