"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { mockMatches } from "@/lib/admin/matchesData";
import { getScopedAssignmentsForUser, getAllScopedAssignments, getAllUsers } from "@/lib/admin/usersData";
import { getScopedAssignmentStatus } from "@/lib/admin/rbac";

export default function ReporterDashboardClient() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [selectedMatchId, setSelectedMatchId] = useState<string>("");

  const isAdmin = currentUser?.role === "super_admin" || currentUser?.role === "editor";
  const isMatchReporter = currentUser?.role === "match_reporter";

  // برای گزارشگر: دسترسی‌های محدود نوع مسابقه و فعال
  const reporterScopedMatches = useMemo(() => {
    if (!currentUser?.id || !isMatchReporter) return [];
    const list = getScopedAssignmentsForUser(currentUser.id).filter(
      (a) => a.scopeType === "match" && a.enabled
    );
    return list;
  }, [currentUser?.id, isMatchReporter]);

  const assignedMatches = useMemo(() => {
    if (isAdmin) return [];
    return mockMatches.filter((m) =>
      reporterScopedMatches.some((a) => a.scopeId === m.id)
    );
  }, [isAdmin, reporterScopedMatches]);

  // Auto-select first match if available
  useEffect(() => {
    if (!selectedMatchId && assignedMatches.length > 0) {
      setSelectedMatchId(assignedMatches[0].id);
    }
  }, [selectedMatchId, assignedMatches]);

  const selectedMatch = useMemo(() => assignedMatches.find((m) => m.id === selectedMatchId), [assignedMatches, selectedMatchId]);
  const selectedAssignment = useMemo(
    () => (selectedMatchId ? reporterScopedMatches.find((a) => a.scopeId === selectedMatchId) : undefined),
    [selectedMatchId, reporterScopedMatches]
  );

  const isAssignmentActive = selectedAssignment ? getScopedAssignmentStatus(selectedAssignment) === "active" : false;
  const canEditEvents = !!(selectedMatch && selectedAssignment && isAssignmentActive);
  const canCreateNews = !!(selectedMatch && selectedAssignment && isAssignmentActive);

  const timeRemaining = useMemo(() => {
    if (!selectedAssignment) return null;
    const now = Date.now();
    const end = new Date(selectedAssignment.endDateTime).getTime();
    const diff = end - now;
    if (diff <= 0) return "منقضی شده";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours} ساعت و ${minutes} دقیقه`;
  }, [selectedAssignment]);

  // بدون کاربر لاگین‌شده
  if (!currentUser) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center p-6" dir="rtl">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center max-w-md">
          <p className="text-slate-700">لطفاً از منوی بالا یک کاربر انتخاب کنید.</p>
        </div>
      </div>
    );
  }

  // نمای مدیریت برای مدیر کل و ویراستار
  if (isAdmin) {
    const allScoped = getAllScopedAssignments().filter((a) => a.scopeType === "match");
    const users = getAllUsers();

    return (
      <div className="space-y-6" dir="rtl">
        <div>
          <h1 className="text-xl font-bold text-slate-900">پنل گزارشگر — نمای مدیریت</h1>
          <p className="mt-1 text-sm text-slate-600">
            برای تنظیم دسترسی گزارشگران به مسابقات، از بخش کاربران نقش و دسترسی محدود (زمان‌دار) را تعیین کنید.
          </p>
          <Link
            href="/admin/users"
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand/90"
          >
            رفتن به مدیریت کاربران
          </Link>
        </div>

        {allScoped.length > 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <h2 className="px-4 py-3 text-base font-semibold text-slate-800 border-b border-slate-200">دسترسی‌های گزارشگران به مسابقات</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-right font-semibold text-slate-700">کاربر</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-700">مسابقه</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-700">شروع</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-700">پایان</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-700">وضعیت</th>
                  </tr>
                </thead>
                <tbody>
                  {allScoped.map((a) => {
                    const user = users.find((u) => u.id === a.userId);
                    const match = mockMatches.find((m) => m.id === a.scopeId);
                    const status = getScopedAssignmentStatus(a);
                    const statusLabel = status === "active" ? "فعال" : status === "scheduled" ? "زمان‌بندی شده" : status === "expired" ? "منقضی" : "غیرفعال";
                    return (
                      <tr key={a.id} className="border-t border-slate-100 hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-medium text-slate-800">{user?.name ?? a.userId}</td>
                        <td className="px-4 py-3 text-slate-700">{match ? `${match.homeTeam} – ${match.awayTeam}` : a.scopeId}</td>
                        <td className="px-4 py-3 text-slate-600">{new Date(a.startDateTime).toLocaleDateString("fa-IR", { dateStyle: "short" })} {new Date(a.startDateTime).toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })}</td>
                        <td className="px-4 py-3 text-slate-600">{new Date(a.endDateTime).toLocaleDateString("fa-IR", { dateStyle: "short" })} {new Date(a.endDateTime).toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })}</td>
                        <td className="px-4 py-3">
                          <span className={`rounded px-2 py-0.5 text-xs font-medium ${status === "active" ? "bg-green-100 text-green-700" : status === "scheduled" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"}`}>
                            {statusLabel}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
            <p className="text-slate-600">هنوز هیچ دسترسی گزارشگری تعریف نشده است.</p>
            <p className="mt-2 text-sm text-slate-500">از بخش کاربران برای نقش «گزارشگر مسابقه» دسترسی محدود (مسابقه + بازهٔ زمانی) اضافه کنید.</p>
          </div>
        )}
      </div>
    );
  }

  // نقش غیر از گزارشگر مسابقه
  if (!isMatchReporter) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center p-6" dir="rtl">
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center max-w-md">
          <p className="text-slate-700">دسترسی به این پنل فقط برای گزارشگر مسابقه و مدیران تعریف شده است.</p>
        </div>
      </div>
    );
  }

  // گزارشگر مسابقه بدون مسابقهٔ اختصاص‌یافته
  if (assignedMatches.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6" dir="rtl">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
            <h1 className="text-xl font-bold text-red-900 mb-2">هیچ مسابقه‌ای به شما اختصاص داده نشده است</h1>
            <p className="text-sm text-red-700">
              لطفاً با مدیر سیستم تماس بگیرید تا دسترسی گزارشگری برای شما تنظیم شود.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">داشبورد گزارشگر</h1>
              <p className="text-sm text-slate-600 mt-1">مدیریت مسابقات اختصاص‌یافته</p>
            </div>
            <button
              onClick={() => router.push("/admin")}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 border border-[var(--border)] hover:bg-slate-50 transition-colors"
            >
              بازگشت
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Match Selection Sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-[var(--border)] bg-white p-4 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4">مسابقات اختصاص‌یافته</h2>
              <div className="space-y-2">
                {assignedMatches.map((match) => {
                  const assignment = reporterScopedMatches.find((a) => a.scopeId === match.id);
                  const isActive = assignment ? getScopedAssignmentStatus(assignment) === "active" : false;

                  return (
                    <button
                      key={match.id}
                      onClick={() => setSelectedMatchId(match.id)}
                      className={`w-full text-right p-3 rounded-lg border transition-colors ${
                        selectedMatchId === match.id
                          ? "border-brand bg-brand/5"
                          : "border-[var(--border)] hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-500">
                          {match.sport === "futsal" ? "فوتسال" : "فوتبال ساحلی"}
                        </span>
                        {isActive ? (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-green-100 text-green-700">
                            فعال
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                            غیرفعال
                          </span>
                        )}
                      </div>
                      <div className="font-medium text-slate-900 text-sm">
                        {match.homeTeam} vs {match.awayTeam}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {match.date} - {match.time}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {!selectedMatch ? (
              <div className="rounded-xl border border-[var(--border)] bg-white p-8 text-center">
                <p className="text-slate-500">لطفاً یک مسابقه را انتخاب کنید</p>
              </div>
            ) : (
              <>
                {/* Match Info Card */}
                <div className="rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 mb-2">
                        {selectedMatch.homeTeam} vs {selectedMatch.awayTeam}
                      </h2>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                        <span>{selectedMatch.leagueName}</span>
                        <span>•</span>
                        <span>{selectedMatch.date}</span>
                        <span>•</span>
                        <span>{selectedMatch.time}</span>
                        {selectedMatch.venue && (
                          <>
                            <span>•</span>
                            <span>{selectedMatch.venue}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="text-sm text-slate-500 mb-1">وضعیت</div>
                      <div className="text-lg font-bold text-slate-900">
                        {selectedMatch.status === "finished"
                          ? "پایان یافته"
                          : selectedMatch.status === "live"
                            ? "زنده"
                            : "برنامه‌ریزی شده"}
                      </div>
                    </div>
                  </div>

                  {selectedMatch.homeScore !== null && selectedMatch.awayScore !== null && (
                    <div className="flex items-center justify-center gap-4 py-4 border-t border-[var(--border)]">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-slate-900">{selectedMatch.homeScore}</div>
                        <div className="text-sm text-slate-600">{selectedMatch.homeTeam}</div>
                      </div>
                      <div className="text-slate-400">-</div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-slate-900">{selectedMatch.awayScore}</div>
                        <div className="text-sm text-slate-600">{selectedMatch.awayTeam}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Access Status Card */}
                {selectedAssignment && (
                  <div className="rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">وضعیت دسترسی</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-slate-500 mb-1">شروع دسترسی</div>
                        <div className="text-sm font-medium text-slate-900">
                          {new Date(selectedAssignment.startDateTime).toLocaleString("fa-IR")}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-1">پایان دسترسی</div>
                        <div className="text-sm font-medium text-slate-900">
                          {new Date(selectedAssignment.endDateTime).toLocaleString("fa-IR")}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-1">زمان باقی‌مانده</div>
                        <div className="text-sm font-medium text-slate-900">{timeRemaining || "—"}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-1">وضعیت</div>
                        <div className="text-sm font-medium text-green-600">
                          {isAssignmentActive ? "فعال" : "غیرفعال"}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {canEditEvents && (
                    <button
                      onClick={() => router.push(`/admin/matches/${selectedMatch.id}/edit`)}
                      className="rounded-xl border border-[var(--border)] bg-white p-6 text-right hover:bg-slate-50 transition-colors shadow-sm"
                    >
                      <div className="text-lg font-bold text-slate-900 mb-2">افزودن رویداد</div>
                      <div className="text-sm text-slate-600">
                        ثبت گل، کارت، پاس گل و سایر رویدادهای مسابقه
                      </div>
                    </button>
                  )}

                  {canCreateNews && (
                    <button
                      onClick={() => router.push(`/admin/news/new?matchId=${selectedMatch.id}`)}
                      className="rounded-xl border border-[var(--border)] bg-white p-6 text-right hover:bg-slate-50 transition-colors shadow-sm"
                    >
                      <div className="text-lg font-bold text-slate-900 mb-2">نوشتن خبر</div>
                      <div className="text-sm text-slate-600">
                        ایجاد خبر مرتبط با این مسابقه
                      </div>
                    </button>
                  )}
                </div>

                {/* Permissions Info */}
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                  <div className="text-sm text-blue-800">
                    <strong>دسترسی‌های شما:</strong>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>مشاهده اطلاعات مسابقه اختصاص‌یافته</li>
                      {canEditEvents && <li>افزودن و ویرایش رویدادهای مسابقه</li>}
                      {canCreateNews && <li>ایجاد خبر مرتبط با مسابقه</li>}
                    </ul>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
