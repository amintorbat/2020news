"use client";

import { useState, useEffect } from "react";
import jalaali from "jalaali-js";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/admin/Badge";
import { PersianDatePicker } from "@/components/admin/PersianDatePicker";
import { PersianTimePicker } from "@/components/admin/PersianTimePicker";
import {
  getAllUsers,
  updateUserRole,
  getScopedAssignmentsForUser,
  createScopedAssignment,
  deleteScopedAssignment,
} from "@/lib/admin/usersData";
import { getScopedAssignmentStatus } from "@/lib/admin/rbac";
import { ROLE_LABELS } from "@/types/rbac";
import type { AdminUserRBAC, RoleKey, ScopeType } from "@/types/rbac";
import { mockMatches } from "@/lib/admin/matchesData";
import { mockNews } from "@/lib/admin/newsData";
import type { News } from "@/types/news";
import type { SportType } from "@/types/matches";

const SPORT_LABELS: Record<SportType, string> = {
  futsal: "فوتسال",
  "beach-soccer": "فوتبال ساحلی",
};

/** تبدیل تاریخ و ساعت شمسی به ISO */
function jalaliToISO(jalaliDate: string, time: string): string {
  const [year, month, day] = jalaliDate.split("-").map(Number);
  const [hours = 0, minutes = 0] = time.split(":").map(Number);
  const gregorian = jalaali.toGregorian(year, month, day);
  const date = new Date(gregorian.gy, gregorian.gm - 1, gregorian.gd, hours, minutes);
  return date.toISOString();
}

export default function UsersClient() {
  const { currentUser, hasPermission, refreshUser } = useAuth();
  const [users, setUsers] = useState<AdminUserRBAC[]>([]);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [scopedForm, setScopedForm] = useState<{
    scopeType: ScopeType;
    scopeId: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
  }>({
    scopeType: "match",
    scopeId: "",
    startDate: "",
    startTime: "00:00",
    endDate: "",
    endTime: "23:59",
  });
  const [matchSportFilter, setMatchSportFilter] = useState<SportType | "">("");

  const canRead = currentUser && hasPermission("users", "read");
  const canEdit = currentUser && hasPermission("users", "edit");

  useEffect(() => {
    setUsers(getAllUsers());
  }, [editingUserId]);

  if (!canRead) {
    return (
      <div className="rounded-xl border-2 border-red-200 bg-red-50 p-6 text-center" dir="rtl">
        <p className="font-medium text-red-800">دسترسی غیرمجاز</p>
        <p className="mt-2 text-sm text-red-700">فقط مدیر کل به مدیریت کاربران دسترسی دارد.</p>
      </div>
    );
  }

  const editingUser = users.find((u) => u.id === editingUserId);
  const scopedList = editingUserId ? getScopedAssignmentsForUser(editingUserId) : [];

  const handleSaveRole = (userId: string, role: RoleKey) => {
    updateUserRole(userId, role);
    setUsers(getAllUsers());
    if (currentUser?.id === userId) refreshUser();
  };

  const handleAddScoped = () => {
    if (!editingUserId || !scopedForm.scopeId || !scopedForm.startDate || !scopedForm.endDate) return;
    const startDateTime = jalaliToISO(scopedForm.startDate, scopedForm.startTime || "00:00");
    const endDateTime = jalaliToISO(scopedForm.endDate, scopedForm.endTime || "23:59");
    createScopedAssignment({
      userId: editingUserId,
      scopeType: scopedForm.scopeType,
      scopeId: scopedForm.scopeId,
      startDateTime,
      endDateTime,
      enabled: true,
    });
    setScopedForm({
      scopeType: "match",
      scopeId: "",
      startDate: "",
      startTime: "00:00",
      endDate: "",
      endTime: "23:59",
    });
    setUsers(getAllUsers());
    if (currentUser?.id === editingUserId) refreshUser();
  };

  const handleRemoveScoped = (id: string) => {
    if (!confirm("حذف این دسترسی محدود؟")) return;
    deleteScopedAssignment(id);
    setUsers(getAllUsers());
    if (editingUser && currentUser?.id === editingUser.id) refreshUser();
  };

  const scopeIdOptions = scopedForm.scopeType === "match"
    ? mockMatches
        .filter((m) => !matchSportFilter || m.sport === matchSportFilter)
        .map((m) => ({
          value: m.id,
          label: `${SPORT_LABELS[m.sport]} — ${m.homeTeam} - ${m.awayTeam}`,
        }))
    : mockNews.slice(0, 50).map((n: News) => ({ value: n.id, label: n.title || n.id }));

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">مدیریت کاربران</h1>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-right font-semibold text-slate-700">نام</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-700">ایمیل</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-700">نقش</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-700">وضعیت</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-700">آخرین ورود</th>
              {canEdit && (
                <th className="px-4 py-3 text-right font-semibold text-slate-700">عملیات</th>
              )}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-slate-100 hover:bg-slate-50/50">
                <td className="px-4 py-3 font-medium text-slate-800">{u.name}</td>
                <td className="px-4 py-3 text-slate-700">{u.email}</td>
                <td className="px-4 py-3">
                  <Badge variant={u.role === "super_admin" ? "danger" : "info"}>
                    {ROLE_LABELS[u.role]}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={u.isActive ? "success" : "default"}>
                    {u.isActive ? "فعال" : "غیرفعال"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-slate-600">{u.lastLogin || "—"}</td>
                {canEdit && (
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setEditingUserId(u.id)}
                      className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                      title="ویرایش نقش و دسترسی"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" dir="rtl">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
              <h2 className="text-lg font-bold text-slate-900">ویرایش نقش و دسترسی — {editingUser.name}</h2>
              <button
                type="button"
                onClick={() => setEditingUserId(null)}
                className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                aria-label="بستن"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4 p-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">نقش</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => handleSaveRole(editingUser.id, e.target.value as RoleKey)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                >
                  {(Object.keys(ROLE_LABELS) as RoleKey[]).map((r) => (
                    <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                  ))}
                </select>
              </div>

              {(editingUser.role === "journalist" || editingUser.role === "match_reporter") && (
                <div className="space-y-5 rounded-xl border border-slate-200 bg-slate-50/50 p-5">
                  <div>
                    <h3 className="text-base font-semibold text-slate-800">دسترسی محدود (زمان‌دار)</h3>
                    <p className="mt-1 text-xs text-slate-600">
                      برای خبرنگار یا گزارشگر مسابقه، محدوده (مسابقه یا خبر) و بازهٔ زمانی دسترسی را با تقویم شمسی تعیین کنید.
                    </p>
                  </div>

                  {/* لیست دسترسی‌های فعلی */}
                  {scopedList.length > 0 && (
                    <div>
                      <h4 className="mb-2 text-sm font-medium text-slate-700">دسترسی‌های ثبت‌شده</h4>
                      <ul className="space-y-2">
                        {scopedList.map((a) => {
                          const status = getScopedAssignmentStatus(a);
                          const scopeLabel = a.scopeType === "match"
                            ? (mockMatches.find((m) => m.id === a.scopeId)?.homeTeam ?? "") + " – " + (mockMatches.find((m) => m.id === a.scopeId)?.awayTeam ?? a.scopeId)
                            : (mockNews.find((n) => n.id === a.scopeId)?.title ?? a.scopeId);
                          const startDate = new Date(a.startDateTime);
                          const endDate = new Date(a.endDateTime);
                          const fmt = (d: Date) => d.toLocaleDateString("fa-IR", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });
                          return (
                            <li
                              key={a.id}
                              className="flex flex-col gap-1 rounded-lg border border-slate-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between"
                            >
                              <div className="min-w-0 flex-1">
                                <span className="font-medium text-slate-800">
                                  {a.scopeType === "match" ? "مسابقه: " : "خبر: "}
                                  <span className="truncate">{scopeLabel}</span>
                                </span>
                                <p className="mt-0.5 text-xs text-slate-500">
                                  از {fmt(startDate)} تا {fmt(endDate)}
                                </p>
                                <span className={`inline-block mt-1 rounded px-2 py-0.5 text-xs font-medium ${status === "active" ? "bg-green-100 text-green-700" : status === "scheduled" ? "bg-amber-100 text-amber-700" : "text-slate-500"}`}>
                                  {status === "active" ? "فعال" : status === "scheduled" ? "زمان‌بندی شده" : status === "expired" ? "منقضی" : "غیرفعال"}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveScoped(a.id)}
                                className="mt-2 self-start rounded-lg p-2 text-red-600 hover:bg-red-50 sm:mt-0"
                                title="حذف"
                              >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}

                  {/* افزودن دسترسی جدید */}
                  <div className="rounded-lg border border-slate-200 bg-white p-4">
                    <h4 className="mb-4 text-sm font-semibold text-slate-800">افزودن دسترسی جدید</h4>
                    <div className="space-y-4">
                      <div className={`grid gap-4 ${scopedForm.scopeType === "match" ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-slate-700">نوع محدوده</label>
                          <div className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50/50 p-2">
                            <label
                              className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                                scopedForm.scopeType === "match" ? "bg-brand text-white ring-2 ring-brand/30" : "hover:bg-slate-100 text-slate-700"
                              }`}
                            >
                              <input
                                type="radio"
                                name="scopeType"
                                value="match"
                                checked={scopedForm.scopeType === "match"}
                                onChange={() => { setScopedForm((f) => ({ ...f, scopeType: "match", scopeId: "" })); setMatchSportFilter(""); }}
                                className="sr-only"
                              />
                              مسابقه
                            </label>
                            <label
                              className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                                scopedForm.scopeType === "news" ? "bg-brand text-white ring-2 ring-brand/30" : "hover:bg-slate-100 text-slate-700"
                              }`}
                            >
                              <input
                                type="radio"
                                name="scopeType"
                                value="news"
                                checked={scopedForm.scopeType === "news"}
                                onChange={() => { setScopedForm((f) => ({ ...f, scopeType: "news", scopeId: "" })); setMatchSportFilter(""); }}
                                className="sr-only"
                              />
                              خبر
                            </label>
                          </div>
                        </div>
                        {scopedForm.scopeType === "match" && (
                          <div>
                            <label className="mb-1.5 block text-xs font-medium text-slate-700">رشته ورزشی</label>
                            <select
                              value={matchSportFilter}
                              onChange={(e) => {
                                setMatchSportFilter(e.target.value as SportType | "");
                                setScopedForm((f) => ({ ...f, scopeId: "" }));
                              }}
                              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                            >
                              <option value="">همه رشته‌ها</option>
                              <option value="futsal">{SPORT_LABELS.futsal}</option>
                              <option value="beach-soccer">{SPORT_LABELS["beach-soccer"]}</option>
                            </select>
                          </div>
                        )}
                        <div className={scopedForm.scopeType === "match" ? undefined : "sm:col-span-2"}>
                          <label className="mb-1.5 block text-xs font-medium text-slate-700">
                            {scopedForm.scopeType === "match" ? "انتخاب مسابقه" : "انتخاب خبر"}
                          </label>
                          <select
                            value={scopedForm.scopeId}
                            onChange={(e) => setScopedForm((f) => ({ ...f, scopeId: e.target.value }))}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                          >
                            <option value="">انتخاب کنید</option>
                            {scopeIdOptions.map((o) => (
                              <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="border-t border-slate-200 pt-4">
                        <p className="mb-3 text-xs font-medium text-slate-600">بازهٔ زمانی دسترسی (تقویم شمسی)</p>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-3 rounded-lg border border-slate-100 bg-slate-50/30 p-3">
                            <p className="text-xs font-semibold text-slate-700">شروع دسترسی</p>
                            <div className="grid gap-2 sm:grid-cols-2">
                              <div>
                                <label className="mb-1 block text-[11px] text-slate-500">تاریخ</label>
                                <PersianDatePicker
                                  value={scopedForm.startDate}
                                  onChange={(v) => setScopedForm((f) => ({ ...f, startDate: v }))}
                                  placeholder="انتخاب تاریخ"
                                  className="w-full"
                                />
                              </div>
                              <div>
                                <label className="mb-1 block text-[11px] text-slate-500">ساعت</label>
                                <PersianTimePicker
                                  value={scopedForm.startTime}
                                  onChange={(v) => setScopedForm((f) => ({ ...f, startTime: v }))}
                                  placeholder="۰۰:۰۰"
                                  className="w-full"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-3 rounded-lg border border-slate-100 bg-slate-50/30 p-3">
                            <p className="text-xs font-semibold text-slate-700">پایان دسترسی</p>
                            <div className="grid gap-2 sm:grid-cols-2">
                              <div>
                                <label className="mb-1 block text-[11px] text-slate-500">تاریخ</label>
                                <PersianDatePicker
                                  value={scopedForm.endDate}
                                  onChange={(v) => setScopedForm((f) => ({ ...f, endDate: v }))}
                                  placeholder="انتخاب تاریخ"
                                  className="w-full"
                                />
                              </div>
                              <div>
                                <label className="mb-1 block text-[11px] text-slate-500">ساعت</label>
                                <PersianTimePicker
                                  value={scopedForm.endTime}
                                  onChange={(v) => setScopedForm((f) => ({ ...f, endTime: v }))}
                                  placeholder="۲۳:۵۹"
                                  className="w-full"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddScoped}
                        disabled={!scopedForm.scopeId || !scopedForm.startDate || !scopedForm.endDate}
                        className="w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand/90 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        افزودن دسترسی محدود
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
