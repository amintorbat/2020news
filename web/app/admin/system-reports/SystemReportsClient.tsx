"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Badge } from "@/components/admin/Badge";
import {
  mockSystemReports,
  getFilteredReports,
} from "@/lib/admin/systemReportsData";
import type {
  SystemReport,
  EventType,
  ActorRole,
  Module,
  SeverityLevel,
} from "@/types/systemReports";
import {
  EVENT_TYPE_LABELS,
  MODULE_LABELS,
  SEVERITY_CONFIG,
} from "@/types/systemReports";

export default function SystemReportsClient() {
  // Filter states
  const [eventTypeFilter, setEventTypeFilter] = useState<EventType | "">("");
  const [actorRoleFilter, setActorRoleFilter] = useState<ActorRole | "">("");
  const [moduleFilter, setModuleFilter] = useState<Module | "">("");
  const [severityFilter, setSeverityFilter] = useState<SeverityLevel | "">("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");

  // Filter reports
  const filteredReports = useMemo(() => {
    return getFilteredReports({
      eventType: eventTypeFilter || undefined,
      actorRole: actorRoleFilter || undefined,
      module: moduleFilter || undefined,
      severity: severityFilter || undefined,
      startDate: startDateFilter || undefined,
      endDate: endDateFilter || undefined,
    });
  }, [
    eventTypeFilter,
    actorRoleFilter,
    moduleFilter,
    severityFilter,
    startDateFilter,
    endDateFilter,
  ]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("fa-IR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getEventTypeBadge = (eventType: EventType) => {
    const colors: Record<EventType, "default" | "success" | "warning" | "danger" | "info"> = {
      create: "success",
      update: "info",
      delete: "danger",
      access: "default",
      error: "danger",
    };
    return (
      <Badge variant={colors[eventType]} className="text-[10px]">
        {EVENT_TYPE_LABELS[eventType]}
      </Badge>
    );
  };

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="گزارش‌های سیستم"
        subtitle="لاگ کامل فعالیت‌های سیستم و کاربران"
      />

      {/* Filters */}
      <div className="rounded-xl border border-[var(--border)] bg-white p-4 sm:p-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Event Type Filter */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">
              نوع رویداد
            </label>
            <select
              value={eventTypeFilter}
              onChange={(e) => setEventTypeFilter(e.target.value as EventType | "")}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
            >
              <option value="">همه انواع</option>
              {Object.entries(EVENT_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Actor Role Filter */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">
              نقش کاربر
            </label>
            <select
              value={actorRoleFilter}
              onChange={(e) => setActorRoleFilter(e.target.value as ActorRole | "")}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
            >
              <option value="">همه نقش‌ها</option>
              <option value="Admin">مدیر</option>
              <option value="Match Reporter">گزارشگر مسابقه</option>
            </select>
          </div>

          {/* Module Filter */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">
              ماژول
            </label>
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value as Module | "")}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
            >
              <option value="">همه ماژول‌ها</option>
              {Object.entries(MODULE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Severity Filter */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">
              سطح اهمیت
            </label>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as SeverityLevel | "")}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
            >
              <option value="">همه سطوح</option>
              <option value="Normal">عادی</option>
              <option value="Important">مهم</option>
              <option value="Critical">بحرانی</option>
            </select>
          </div>

          {/* Date Range Filters */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">
              از تاریخ
            </label>
            <input
              type="date"
              value={startDateFilter}
              onChange={(e) => setStartDateFilter(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">
              تا تاریخ
            </label>
            <input
              type="date"
              value={endDateFilter}
              onChange={(e) => setEndDateFilter(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
            />
          </div>

          {/* Clear Filters */}
          <div className="sm:col-span-2 lg:col-span-2 flex items-end">
            <button
              onClick={() => {
                setEventTypeFilter("");
                setActorRoleFilter("");
                setModuleFilter("");
                setSeverityFilter("");
                setStartDateFilter("");
                setEndDateFilter("");
              }}
              className="w-full rounded-lg px-4 py-2 text-sm font-medium text-slate-700 border border-[var(--border)] hover:bg-slate-50 transition-colors"
            >
              پاک کردن فیلترها
            </button>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-lg border border-[var(--border)] bg-white p-4">
          <div className="text-xs text-slate-500 mb-1">کل لاگ‌ها</div>
          <div className="text-2xl font-bold text-slate-900">{filteredReports.length}</div>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-white p-4">
          <div className="text-xs text-slate-500 mb-1">بحرانی</div>
          <div className="text-2xl font-bold text-red-600">
            {filteredReports.filter((r) => r.severity === "Critical").length}
          </div>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-white p-4">
          <div className="text-xs text-slate-500 mb-1">مهم</div>
          <div className="text-2xl font-bold text-yellow-600">
            {filteredReports.filter((r) => r.severity === "Important").length}
          </div>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-white p-4">
          <div className="text-xs text-slate-500 mb-1">عادی</div>
          <div className="text-2xl font-bold text-slate-600">
            {filteredReports.filter((r) => r.severity === "Normal").length}
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block rounded-xl border border-[var(--border)] bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-right font-semibold text-slate-700">زمان</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-700">نوع</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-700">کاربر</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-700">ماژول</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-700">توضیحات</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-700">اهمیت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => {
                  const severityConfig = SEVERITY_CONFIG[report.severity];
                  return (
                    <tr
                      key={report.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-slate-600 text-xs">
                        {formatTimestamp(report.timestamp)}
                      </td>
                      <td className="px-4 py-3">{getEventTypeBadge(report.eventType)}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-900 text-xs">
                            {report.actorName}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {report.actorRole}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-slate-700">
                          {MODULE_LABELS[report.module]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="max-w-md">
                          <span className="text-xs text-slate-900">{report.description}</span>
                          {report.resourceName && (
                            <div className="text-[10px] text-slate-500 mt-1">
                              منبع: {report.resourceName}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={severityConfig.variant} className="text-[10px]">
                          {severityConfig.label}
                        </Badge>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
                    هیچ لاگی یافت نشد
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filteredReports.length > 0 ? (
          filteredReports.map((report) => {
            const severityConfig = SEVERITY_CONFIG[report.severity];
            return (
              <div
                key={report.id}
                className="rounded-xl border border-[var(--border)] bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getEventTypeBadge(report.eventType)}
                      <Badge variant={severityConfig.variant} className="text-[10px]">
                        {severityConfig.label}
                      </Badge>
                    </div>
                    <div className="text-sm font-medium text-slate-900 mb-1">
                      {report.description}
                    </div>
                    {report.resourceName && (
                      <div className="text-xs text-slate-500 mb-2">
                        منبع: {report.resourceName}
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 border-t border-[var(--border)] pt-3">
                  <div>
                    <span className="text-slate-500">کاربر: </span>
                    <span className="font-medium">{report.actorName}</span>
                    <span className="text-slate-400"> ({report.actorRole})</span>
                  </div>
                  <div>
                    <span className="text-slate-500">ماژول: </span>
                    <span className="font-medium">{MODULE_LABELS[report.module]}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500">زمان: </span>
                    <span className="font-medium">{formatTimestamp(report.timestamp)}</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-xl border border-[var(--border)] bg-white p-12 text-center">
            <p className="text-slate-500 text-sm">هیچ لاگی یافت نشد</p>
          </div>
        )}
      </div>
    </div>
  );
}
