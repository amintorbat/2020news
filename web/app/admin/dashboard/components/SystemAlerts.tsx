"use client";

import { Badge } from "@/components/admin/Badge";

type Alert = {
  id: string;
  type: "warning" | "danger" | "info" | "success";
  message: string;
  time: string;
};

export default function SystemAlerts() {
  const alerts: Alert[] = [
    {
      id: "1",
      type: "warning",
      message: "۳ خبر بدون تصویر شاخص",
      time: "۵ دقیقه پیش",
    },
    {
      id: "2",
      type: "danger",
      message: "یک مسابقه بدون نتیجه ثبت شده",
      time: "۱۲ دقیقه پیش",
    },
    {
      id: "3",
      type: "info",
      message: "آخرین بروزرسانی: ۲ دقیقه پیش",
      time: "۲ دقیقه پیش",
    },
    {
      id: "4",
      type: "success",
      message: "پشتیبان‌گیری خودکار با موفقیت انجام شد",
      time: "۱ ساعت پیش",
    },
  ];

  const getIcon = (type: Alert["type"]) => {
    switch (type) {
      case "warning":
        return "⚠️";
      case "danger":
        return "⛔";
      case "info":
        return "ℹ️";
      case "success":
        return "✅";
    }
  };

  const getColor = (type: Alert["type"]) => {
    switch (type) {
      case "warning":
        return "text-yellow-600";
      case "danger":
        return "text-red-600";
      case "info":
        return "text-blue-600";
      case "success":
        return "text-green-600";
    }
  };

  return (
    <aside className="rounded-xl border border-[var(--border)] bg-white p-4 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-bold text-slate-900">گزارشات سیستم</h3>
        <Badge variant="info" className="text-xs">
          {alerts.length}
        </Badge>
      </div>

      <ul className="space-y-3 sm:space-y-4">
        {alerts.map((alert) => (
          <li
            key={alert.id}
            className={`flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border border-[var(--border)] bg-slate-50 ${getColor(alert.type)}`}
          >
            <span className="text-base sm:text-lg flex-shrink-0">{getIcon(alert.type)}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium">{alert.message}</p>
              <p className="text-xs text-slate-500 mt-1">{alert.time}</p>
            </div>
          </li>
        ))}
      </ul>

      <button className="mt-4 w-full text-xs sm:text-sm font-medium text-brand hover:text-brand/80 transition-colors text-center">
        مشاهده همه گزارشات →
      </button>
    </aside>
  );
}