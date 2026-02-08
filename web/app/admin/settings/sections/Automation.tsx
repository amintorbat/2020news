"use client";

import type { SmartAutomationSettings } from "@/types/settings";
import { Toggle } from "@/components/admin/Toggle";

type Props = {
  value: SmartAutomationSettings;
  onChange: (v: Partial<SmartAutomationSettings>) => void;
  onSave: () => void;
  saving: boolean;
};

export function AutomationSection({ value, onChange, onSave, saving }: Props) {
  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-600">قوانین خودکار برای کاهش خطا و نگهداری سیستم.</p>
      <div className="space-y-4">
        <div>
          <Toggle
            label="انقضای خودکار دسترسی خبرنگار پس از پایان بازه"
            checked={value.autoExpireJournalistAccess}
            onChange={(c) => onChange({ autoExpireJournalistAccess: c })}
          />
        </div>
        <div>
          <Toggle
            label="غیرفعال کردن خودکار تبلیغات منقضی‌شده"
            checked={value.autoDisableExpiredAds}
            onChange={(c) => onChange({ autoDisableExpiredAds: c })}
          />
        </div>
        <div>
          <Toggle
            label="علامت‌گذاری خودکار مسابقات ناقص (بدون نتیجه)"
            checked={value.autoFlagIncompleteMatches}
            onChange={(c) => onChange({ autoFlagIncompleteMatches: c })}
          />
          <p className="mt-1 text-xs text-slate-500">در گزارشات سیستم نمایش داده می‌شود.</p>
        </div>
        <div>
          <Toggle
            label="تشخیص خودکار ناسازگاری‌های منطقی"
            checked={value.autoDetectLogicalInconsistencies}
            onChange={(c) => onChange({ autoDetectLogicalInconsistencies: c })}
          />
          <p className="mt-1 text-xs text-slate-500">مثل لیگ بدون تیم، بازیکن بدون تیم.</p>
        </div>
        <div>
          <Toggle
            label="بررسی روزانه سلامت سیستم"
            checked={value.dailySystemHealthCheck}
            onChange={(c) => onChange({ dailySystemHealthCheck: c })}
          />
          <p className="mt-1 text-xs text-slate-500">خلاصهٔ هشدارها و وضعیت ماژول‌ها.</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand/90 disabled:opacity-60"
      >
        {saving ? "در حال ذخیره…" : "ذخیره تنظیمات خودکار"}
      </button>
    </div>
  );
}
