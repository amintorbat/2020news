"use client";

import type { AdvertisingSettings } from "@/types/settings";
import { Toggle } from "@/components/admin/Toggle";

type Props = {
  value: AdvertisingSettings;
  onChange: (v: Partial<AdvertisingSettings>) => void;
  onSave: () => void;
  saving: boolean;
};

export function AdvertisingSection({ value, onChange, onSave, saving }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <Toggle
          label="فعال بودن تبلیغات در کل سایت"
          checked={value.adsEnabledGlobally}
          onChange={(c) => onChange({ adsEnabledGlobally: c })}
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">حداکثر تبلیغ فعال به‌ازای هر جایگاه</label>
        <p className="mb-2 text-xs text-slate-500">برای روتیشن و اولویت نمایش.</p>
        <input
          type="number"
          min={1}
          max={20}
          value={value.maxActiveAdsPerSlot}
          onChange={(e) => onChange({ maxActiveAdsPerSlot: Number(e.target.value) || 1 })}
          className="w-full max-w-[120px] rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">مدت پیش‌فرض تبلیغ (روز)</label>
        <input
          type="number"
          min={1}
          max={365}
          value={value.defaultAdDurationDays}
          onChange={(e) => onChange({ defaultAdDurationDays: Number(e.target.value) || 30 })}
          className="w-full max-w-[120px] rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm"
        />
      </div>
      <div>
        <Toggle
          label="جلوگیری از هم‌پوشانی جایگاه‌ها"
          checked={value.preventOverlappingPlacements}
          onChange={(c) => onChange({ preventOverlappingPlacements: c })}
        />
        <p className="mt-1 text-xs text-slate-500">هشدار اگر دو تبلیغ در یک بازه در یک جایگاه باشند.</p>
      </div>
      <div>
        <Toggle
          label="هشدار هم‌پوشانی تبلیغات"
          checked={value.warnOnOverlap}
          onChange={(c) => onChange({ warnOnOverlap: c })}
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">هشدار انقضای نزدیک (روز قبل)</label>
        <input
          type="number"
          min={0}
          max={30}
          value={value.warnOnExpiringSoonDays}
          onChange={(e) => onChange({ warnOnExpiringSoonDays: Number(e.target.value) || 0 })}
          className="w-full max-w-[120px] rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm"
        />
      </div>
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand/90 disabled:opacity-60"
      >
        {saving ? "در حال ذخیره…" : "ذخیره تنظیمات تبلیغات"}
      </button>
    </div>
  );
}
