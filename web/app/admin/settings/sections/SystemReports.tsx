"use client";

import type { SystemReportsSettings } from "@/types/settings";
import { Toggle } from "@/components/admin/Toggle";

type Props = {
  value: SystemReportsSettings;
  onChange: (v: Partial<SystemReportsSettings>) => void;
  onSave: () => void;
  saving: boolean;
};

export function SystemReportsSection({ value, onChange, onSave, saving }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <Toggle
          label="فعال بودن لاگ سیستم"
          checked={value.enableSystemLogs}
          onChange={(c) => onChange({ enableSystemLogs: c })}
        />
        <p className="mt-1 text-xs text-slate-500">ثبت فعالیت‌ها در گزارشات سیستم.</p>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">مدت نگهداری لاگ (روز)</label>
        <p className="mb-2 text-xs text-slate-500">پس از آن لاگ‌های قدیمی قابل حذف خودکار هستند.</p>
        <input
          type="number"
          min={7}
          max={365}
          value={value.logRetentionDays}
          onChange={(e) => onChange({ logRetentionDays: Number(e.target.value) || 90 })}
          className="w-full max-w-[120px] rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">حساسیت هشدارها</label>
        <select
          value={value.warningSensitivity}
          onChange={(e) => onChange({ warningSensitivity: e.target.value as SystemReportsSettings["warningSensitivity"] })}
          className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm"
        >
          <option value="low">کم</option>
          <option value="medium">متوسط</option>
          <option value="high">زیاد</option>
        </select>
      </div>
      <div>
        <Toggle
          label="تولید خودکار اعلان‌ها"
          checked={value.autoGenerateAlerts}
          onChange={(c) => onChange({ autoGenerateAlerts: c })}
        />
        <p className="mt-1 text-xs text-slate-500">هشدارهایی مثل مسابقه بدون نتیجه، تبلیغ منقضی و غیره.</p>
      </div>
      <div>
        <Toggle
          label="الزام یادداشت ادمین برای اقدامات بحرانی"
          checked={value.requireAdminNoteForCriticalActions}
          onChange={(c) => onChange({ requireAdminNoteForCriticalActions: c })}
        />
        <p className="mt-1 text-xs text-slate-500">مثلاً حذف یا تغییرات گسترده.</p>
      </div>
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand/90 disabled:opacity-60"
      >
        {saving ? "در حال ذخیره…" : "ذخیره تنظیمات گزارشات"}
      </button>
    </div>
  );
}
