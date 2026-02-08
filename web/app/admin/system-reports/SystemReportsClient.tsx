"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/admin/PageHeader";
import { Badge } from "@/components/admin/Badge";
import { PersianDatePicker } from "@/components/admin/PersianDatePicker";
import {
  getFilteredReports,
  getSystemWarnings,
  getTimelineGroups,
  getUniqueActorNames,
  updateAuditLogNote,
  invalidateWarningsCache,
} from "@/lib/admin/systemReportsData";
import type {
  SystemReport,
  EventType,
  Module,
  SeverityLevel,
} from "@/types/systemReports";
import {
  EVENT_TYPE_LABELS,
  MODULE_LABELS,
  SEVERITY_CONFIG,
} from "@/types/systemReports";
import jalaali from "jalaali-js";

type TabId = "activities" | "warnings" | "timeline";

function formatPersianDateTime(iso: string): string {
  try {
    const d = new Date(iso);
    const j = jalaali.toJalaali(d.getFullYear(), d.getMonth() + 1, d.getDate());
    const datePart = `${j.jy}/${String(j.jm).padStart(2, "0")}/${String(j.jd).padStart(2, "0")}`;
    const timePart = d.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" });
    return `${datePart} ${timePart}`;
  } catch {
    return iso.slice(0, 16);
  }
}

export default function SystemReportsClient() {
  const [activeTab, setActiveTab] = useState<TabId>("activities");
  const [searchQuery, setSearchQuery] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState<EventType | "">("");
  const [moduleFilter, setModuleFilter] = useState<Module | "">("");
  const [actorFilter, setActorFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [severityFilter, setSeverityFilter] = useState<SeverityLevel | "">("");
  const [pageSize, setPageSize] = useState(50);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [warnings, setWarnings] = useState<ReturnType<typeof getSystemWarnings>>([]);
  const [notesVersion, setNotesVersion] = useState(0);

  const actorNames = useMemo(() => getUniqueActorNames(), []);

  const filteredReports = useMemo(() => {
    return getFilteredReports({
      eventType: eventTypeFilter || undefined,
      module: moduleFilter || undefined,
      actorName: actorFilter || undefined,
      severity: severityFilter || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      searchQuery: searchQuery.trim() || undefined,
    });
  }, [eventTypeFilter, moduleFilter, actorFilter, severityFilter, startDate, endDate, searchQuery, notesVersion]);

  const paginatedReports = useMemo(() => filteredReports.slice(0, pageSize), [filteredReports, pageSize]);
  const hasMore = filteredReports.length > pageSize;
  const stats = useMemo(() => ({
    total: filteredReports.length,
    critical: filteredReports.filter((r) => r.severity === "Critical").length,
    important: filteredReports.filter((r) => r.severity === "Important").length,
    normal: filteredReports.filter((r) => r.severity === "Normal").length,
  }), [filteredReports]);

  const timelineGroups = useMemo(
    () => getTimelineGroups(filteredReports),
    [filteredReports]
  );

  const refreshWarnings = useCallback(() => {
    invalidateWarningsCache();
    setWarnings(getSystemWarnings());
  }, []);

  useEffect(() => {
    setWarnings(getSystemWarnings());
  }, [activeTab]);

  const handleSaveNote = useCallback((id: string) => {
    updateAuditLogNote(id, noteDraft);
    setEditingNoteId(null);
    setNoteDraft("");
    setNotesVersion((v) => v + 1);
    invalidateWarningsCache();
  }, [noteDraft]);

  const startEditNote = useCallback((report: SystemReport) => {
    setEditingNoteId(report.id);
    setNoteDraft(report.adminNote ?? "");
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setEventTypeFilter("");
    setModuleFilter("");
    setActorFilter("");
    setSeverityFilter("");
    setStartDate("");
    setEndDate("");
  }, []);

  const exportCsv = useCallback(() => {
    const headers = ["زمان", "نوع عملیات", "موجودیت", "عنوان", "کاربر", "نقش", "توضیح", "یادداشت"];
    const rows = filteredReports.map((r) => [
      formatPersianDateTime(r.timestamp),
      EVENT_TYPE_LABELS[r.eventType],
      MODULE_LABELS[r.module],
      r.resourceName ?? "",
      r.actorName,
      r.actorRole,
      r.description,
      r.adminNote ?? "",
    ].map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","));
    const csv = "\uFEFF" + [headers.join(","), ...rows].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-log-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [filteredReports]);

  const tabs: { id: TabId; label: string }[] = [
    { id: "activities", label: "همه فعالیت‌ها" },
    { id: "warnings", label: "هشدارها و مشکلات" },
    { id: "timeline", label: "خط زمانی" },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="گزارشات سیستم"
        subtitle="اتاق کنترل سیستم — لاگ فعالیت‌ها، هشدارها و خط زمانی"
        action={
          <div className="flex flex-wrap items-center gap-2">
            {activeTab === "activities" && (
              <button
                type="button"
                onClick={exportCsv}
                className="rounded-lg border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                خروجی CSV
              </button>
            )}
            {activeTab === "warnings" && (
              <button
                type="button"
                onClick={refreshWarnings}
                className="rounded-lg border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                بروزرسانی هشدارها
              </button>
            )}
          </div>
        }
      />

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-[var(--border)] bg-white p-4 shadow-sm">
          <div className="text-xs text-slate-500 mb-0.5">کل فعالیت‌ها</div>
          <div className="text-xl font-bold text-slate-900">{stats.total}</div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-white p-4 shadow-sm">
          <div className="text-xs text-slate-500 mb-0.5">بحرانی</div>
          <div className="text-xl font-bold text-red-600">{stats.critical}</div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-white p-4 shadow-sm">
          <div className="text-xs text-slate-500 mb-0.5">مهم</div>
          <div className="text-xl font-bold text-amber-600">{stats.important}</div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-white p-4 shadow-sm">
          <div className="text-xs text-slate-500 mb-0.5">هشدارهای سیستم</div>
          <div className="text-xl font-bold text-slate-700">{warnings.length}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[var(--border)]">
        <nav className="-mb-px flex gap-1 overflow-x-auto" aria-label="تب‌ها">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-[var(--color-brand)] text-[var(--color-brand)]"
                  : "border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Shared filter & search */}
      <div className="rounded-xl border border-[var(--border)] bg-white shadow-sm overflow-hidden">
        <div className="bg-slate-50/80 px-4 py-3 border-b border-[var(--border)]">
          <h3 className="text-sm font-semibold text-slate-800">فیلتر و جستجو</h3>
          <p className="text-xs text-slate-500 mt-0.5">جستجوی متنی و فیلتر بر اساس نوع، کاربر و بازهٔ تاریخ</p>
        </div>
        <div className="p-4 sm:p-5 space-y-5">
          {/* Search — full width */}
          <div>
            <label className="mb-2 block text-xs font-medium text-slate-700">جستجو در لاگ‌ها</label>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="متن فارسی یا انگلیسی (توضیح، عنوان، کاربر، یادداشت)..."
              className="w-full rounded-lg border border-[var(--border)] bg-white px-4 py-2.5 text-sm placeholder:text-slate-400 focus:border-[var(--color-brand)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/20 transition-shadow"
            />
          </div>

          {/* Filters grid */}
          <div>
            <label className="mb-3 block text-xs font-medium text-slate-700">فیلترها</label>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-1.5 block text-xs text-slate-600">نوع عملیات</label>
                <select
                  value={eventTypeFilter}
                  onChange={(e) => setEventTypeFilter(e.target.value as EventType | "")}
                  className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-[var(--color-brand)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/20"
                >
                  <option value="">همه</option>
                  {Object.entries(EVENT_TYPE_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-slate-600">نوع موجودیت</label>
                <select
                  value={moduleFilter}
                  onChange={(e) => setModuleFilter(e.target.value as Module | "")}
                  className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-[var(--color-brand)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/20"
                >
                  <option value="">همه</option>
                  {Object.entries(MODULE_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-slate-600">کاربر</label>
                <select
                  value={actorFilter}
                  onChange={(e) => setActorFilter(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-[var(--color-brand)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/20"
                >
                  <option value="">همه</option>
                  {actorNames.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-slate-600">سطح اهمیت</label>
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value as SeverityLevel | "")}
                  className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-[var(--color-brand)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/20"
                >
                  <option value="">همه</option>
                  <option value="Normal">عادی</option>
                  <option value="Important">مهم</option>
                  <option value="Critical">بحرانی</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-slate-600">از تاریخ</label>
                <PersianDatePicker
                  value={startDate}
                  onChange={setStartDate}
                  placeholder="انتخاب تاریخ"
                  className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm focus:border-[var(--color-brand)] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-slate-600">تا تاریخ</label>
                <PersianDatePicker
                  value={endDate}
                  onChange={setEndDate}
                  placeholder="انتخاب تاریخ"
                  className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm focus:border-[var(--color-brand)] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Footer: page size + clear */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[var(--border)]">
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <span className="font-medium text-slate-700">نمایش در هر صفحه:</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="rounded-lg border border-[var(--border)] bg-white px-3 py-1.5 text-sm text-slate-800 focus:border-[var(--color-brand)] focus:outline-none"
              >
                <option value={25}>۲۵</option>
                <option value={50}>۵۰</option>
                <option value={100}>۱۰۰</option>
                <option value={500}>۵۰۰</option>
                <option value={9999}>همه</option>
              </select>
            </label>
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-lg border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
            >
              پاک کردن فیلترها
            </button>
          </div>
        </div>
      </div>

      {/* Tab: All Activities */}
      {activeTab === "activities" && (
        <div className="rounded-xl border border-[var(--border)] bg-white shadow-sm overflow-hidden">
          <div className="border-b border-[var(--border)] bg-slate-50 px-4 py-3 flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-medium text-slate-700">
              {paginatedReports.length} از {filteredReports.length} مورد
            </span>
          </div>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700">زمان</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700">نوع عملیات</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700">موجودیت</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700">عنوان</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700">کاربر / نقش</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700">یادداشت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {paginatedReports.length > 0 ? (
                  paginatedReports.map((r) => {
                    const isEditing = editingNoteId === r.id;
                    return (
                      <tr key={r.id} className="hover:bg-slate-50/80">
                        <td className="px-4 py-3 text-slate-600 text-xs whitespace-nowrap">
                          {formatPersianDateTime(r.timestamp)}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={r.severity === "Critical" ? "danger" : r.severity === "Important" ? "warning" : "default"} className="text-[10px]">
                            {EVENT_TYPE_LABELS[r.eventType]}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-slate-700">{MODULE_LABELS[r.module]}</td>
                        <td className="px-4 py-3 max-w-[200px]">
                          <span className="text-slate-900">{r.resourceName ?? r.description}</span>
                          {r.systemMessage && (
                            <div className="text-[10px] text-slate-500 mt-0.5">{r.systemMessage}</div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <span className="font-medium text-slate-900">{r.actorName}</span>
                            <span className="text-slate-500 text-xs mr-1">({r.actorRole})</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 max-w-[220px]">
                          {isEditing ? (
                            <div className="flex flex-col gap-2">
                              <textarea
                                value={noteDraft}
                                onChange={(e) => setNoteDraft(e.target.value)}
                                rows={2}
                                className="w-full rounded border border-[var(--border)] px-2 py-1 text-xs"
                                placeholder="یادداشت داخلی / توضیح / پیگیری"
                              />
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleSaveNote(r.id)}
                                  className="rounded bg-[var(--color-brand)] px-2 py-1 text-xs text-white hover:opacity-90"
                                >
                                  ذخیره
                                </button>
                                <button
                                  type="button"
                                  onClick={() => { setEditingNoteId(null); setNoteDraft(""); }}
                                  className="rounded border border-[var(--border)] px-2 py-1 text-xs"
                                >
                                  انصراف
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start gap-1">
                              {r.adminNote ? (
                                <span className="text-xs text-slate-700 line-clamp-2">{r.adminNote}</span>
                              ) : (
                                <span className="text-slate-400 text-xs">—</span>
                              )}
                              <button
                                type="button"
                                onClick={() => startEditNote(r)}
                                className="text-[10px] text-[var(--color-brand)] hover:underline shrink-0"
                              >
                                {r.adminNote ? "ویرایش" : "افزودن"}
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
                      هیچ موردی با این فیلترها یافت نشد
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {hasMore && (
            <div className="border-t border-[var(--border)] p-3 text-center">
              <button
                type="button"
                onClick={() => setPageSize((p) => Math.min(p + 50, filteredReports.length))}
                className="text-sm text-[var(--color-brand)] hover:underline"
              >
                نمایش بیشتر ({filteredReports.length - pageSize} مورد باقی‌مانده)
              </button>
            </div>
          )}
          {/* Mobile cards for activities */}
          <div className="md:hidden divide-y divide-[var(--border)] border-t border-[var(--border)]">
            {paginatedReports.length > 0 && paginatedReports.map((r) => {
              const isEditing = editingNoteId === r.id;
              return (
                <div key={r.id} className="p-4">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge variant={r.severity === "Critical" ? "danger" : r.severity === "Important" ? "warning" : "default"} className="text-[10px]">
                      {EVENT_TYPE_LABELS[r.eventType]}
                    </Badge>
                    <span className="text-xs text-slate-500">{MODULE_LABELS[r.module]}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-900 mb-1">{r.resourceName ?? r.description}</p>
                  <p className="text-xs text-slate-600 mb-2">{r.actorName} ({r.actorRole}) — {formatPersianDateTime(r.timestamp)}</p>
                  {isEditing ? (
                    <div className="space-y-2">
                      <textarea
                        value={noteDraft}
                        onChange={(e) => setNoteDraft(e.target.value)}
                        rows={2}
                        className="w-full rounded border border-[var(--border)] px-2 py-1 text-xs"
                        placeholder="یادداشت"
                      />
                      <div className="flex gap-2">
                        <button type="button" onClick={() => handleSaveNote(r.id)} className="rounded bg-[var(--color-brand)] px-2 py-1 text-xs text-white">ذخیره</button>
                        <button type="button" onClick={() => { setEditingNoteId(null); setNoteDraft(""); }} className="rounded border px-2 py-1 text-xs">انصراف</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">{r.adminNote ?? "—"}</span>
                      <button type="button" onClick={() => startEditNote(r)} className="text-xs text-[var(--color-brand)]">یادداشت</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Warnings & Issues */}
      {activeTab === "warnings" && (
        <div className="rounded-xl border border-[var(--border)] bg-white shadow-sm overflow-hidden">
          <div className="border-b border-[var(--border)] bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
            {warnings.length} هشدار / خطا
          </div>
          <div className="divide-y divide-[var(--border)]">
            {warnings.length > 0 ? (
              warnings.map((w) => (
                <div key={w.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-medium ${w.severity === "error" ? "text-red-600" : "text-amber-600"}`}>
                        {w.severity === "error" ? "خطا" : "هشدار"}
                      </span>
                      <span className="text-sm font-medium text-slate-900">{w.title}</span>
                    </div>
                    <p className="text-sm text-slate-600">{w.description}</p>
                  </div>
                  <Link
                    href={w.link}
                    className="shrink-0 rounded-lg border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    برو به صفحه مربوطه
                  </Link>
                </div>
              ))
            ) : (
              <div className="px-4 py-12 text-center text-slate-500 text-sm">
                در حال حاضر هشدار یا خطایی ثبت نشده است
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Timeline */}
      {activeTab === "timeline" && (
        <div className="rounded-xl border border-[var(--border)] bg-white shadow-sm overflow-hidden">
          <div className="border-b border-[var(--border)] bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
            خط زمانی رویدادها (گروه‌بندی بر اساس روز)
          </div>
          <div className="p-4 sm:p-6">
            {timelineGroups.length > 0 ? (
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute top-0 bottom-0 right-[7px] w-0.5 bg-slate-200" aria-hidden />
                <div className="space-y-8">
                  {timelineGroups.map((group) => (
                    <div key={group.dateKey} className="relative flex gap-4">
                      <div className="relative z-10 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 border-slate-300 bg-white mt-0.5" aria-hidden />
                      <div className="min-w-0 flex-1 pb-2">
                        <div className="mb-3 text-sm font-semibold text-slate-700">{group.dateLabel}</div>
                        <div className="space-y-3">
                          {group.entries.map((r) => {
                            const isCritical = r.severity === "Critical" || r.severity === "Important";
                            return (
                              <div
                                key={r.id}
                                className={`rounded-lg border p-3 ${
                                  isCritical ? "border-amber-200 bg-amber-50/50" : "border-[var(--border)] bg-white"
                                }`}
                              >
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                  <span className="text-xs font-medium text-slate-700">{EVENT_TYPE_LABELS[r.eventType]}</span>
                                  <span className="text-xs text-slate-500">{MODULE_LABELS[r.module]}</span>
                                  <span className="text-xs text-slate-400">{formatPersianDateTime(r.timestamp)}</span>
                                  {isCritical && (
                                    <span className={`text-[10px] font-medium ${r.severity === "Critical" ? "text-red-600" : "text-amber-600"}`}>
                                      {r.severity === "Critical" ? "بحرانی" : "مهم"}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-slate-900">{r.description}</p>
                                {r.resourceName && (
                                  <p className="text-xs text-slate-500 mt-1">منبع: {r.resourceName}</p>
                                )}
                                <p className="text-xs text-slate-500 mt-1">{r.actorName} — {r.actorRole}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 text-sm">
                رویدادی با این فیلترها یافت نشد
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
