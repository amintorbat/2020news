"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { mockMatches } from "@/lib/admin/matchesData";
import { getActiveAssignmentsForUser, getAssignmentForUserAndMatch } from "@/lib/admin/reporterAssignments";
import { canAccessMatch, canEditMatchEvents, canCreateMatchNews } from "@/lib/admin/reporterPermissions";
import { isReporterAssignmentActive } from "@/types/reporter";

// Mock: Current user ID (in real app, this would come from auth context)
const CURRENT_USER_ID = "3"; // احمد محمدی (reporter)

export default function ReporterDashboardClient() {
  const router = useRouter();
  const [selectedMatchId, setSelectedMatchId] = useState<string>("");

  // Get active assignments for current user
  const activeAssignments = useMemo(() => {
    return getActiveAssignmentsForUser(CURRENT_USER_ID);
  }, []);

  // Get matches for active assignments
  const assignedMatches = useMemo(() => {
    return mockMatches.filter((match) =>
      activeAssignments.some((assignment) => assignment.matchId === match.id)
    );
  }, [activeAssignments]);

  // Auto-select first match if available
  useEffect(() => {
    if (!selectedMatchId && assignedMatches.length > 0) {
      setSelectedMatchId(assignedMatches[0].id);
    }
  }, [selectedMatchId, assignedMatches]);

  // Get selected match and its assignment
  const selectedMatch = useMemo(() => {
    return assignedMatches.find((m) => m.id === selectedMatchId);
  }, [assignedMatches, selectedMatchId]);

  const selectedAssignment = useMemo(() => {
    if (!selectedMatchId) return undefined;
    return getAssignmentForUserAndMatch(CURRENT_USER_ID, selectedMatchId);
  }, [selectedMatchId]);

  // Check permissions
  const accessCheck = useMemo(() => {
    if (!selectedMatch || !selectedAssignment) {
      return { allowed: false, reason: "مسابقه انتخاب نشده است" };
    }
    return canAccessMatch(CURRENT_USER_ID, selectedMatch.id, selectedAssignment);
  }, [selectedMatch, selectedAssignment]);

  const canEditEvents = useMemo(() => {
    if (!selectedMatch || !selectedAssignment) return false;
    return canEditMatchEvents(CURRENT_USER_ID, selectedMatch.id, selectedAssignment).allowed;
  }, [selectedMatch, selectedAssignment]);

  const canCreateNews = useMemo(() => {
    if (!selectedMatch || !selectedAssignment) return false;
    return canCreateMatchNews(CURRENT_USER_ID, selectedMatch.id, selectedAssignment).allowed;
  }, [selectedMatch, selectedAssignment]);

  // Calculate time remaining
  const timeRemaining = useMemo(() => {
    if (!selectedAssignment) return null;
    const now = new Date();
    const end = new Date(selectedAssignment.endDateTime);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return "منقضی شده";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours} ساعت و ${minutes} دقیقه`;
  }, [selectedAssignment]);

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
                  const assignment = getAssignmentForUserAndMatch(CURRENT_USER_ID, match.id);
                  const isActive = assignment ? isReporterAssignmentActive(assignment) : false;
                  
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
            ) : !accessCheck.allowed ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
                <h2 className="text-lg font-bold text-red-900 mb-2">دسترسی مجاز نیست</h2>
                <p className="text-sm text-red-700">{accessCheck.reason}</p>
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
                          {isReporterAssignmentActive(selectedAssignment) ? "فعال" : "غیرفعال"}
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
