"use client";

import type { GeneralSettings } from "@/types/settings";
import { Toggle } from "@/components/admin/Toggle";

type Props = {
  value: GeneralSettings;
  onChange: (v: Partial<GeneralSettings>) => void;
  onSave: () => void;
  saving: boolean;
};

export function GeneralSection({ value, onChange, onSave, saving }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">نام سایت</label>
        <p className="mb-2 text-xs text-slate-500">در هدر و عنوان صفحات نمایش داده می‌شود.</p>
        <input
          type="text"
          value={value.siteName}
          onChange={(e) => onChange({ siteName: e.target.value })}
          className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">توضیح کوتاه سایت</label>
        <p className="mb-2 text-xs text-slate-500">برای موتورهای جستجو و شبکه‌های اجتماعی.</p>
        <textarea
          value={value.siteDescription}
          onChange={(e) => onChange({ siteDescription: e.target.value })}
          rows={2}
          className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">زبان پیش‌فرض</label>
        <p className="mb-2 text-xs text-slate-500">زبان رابط و محتوا.</p>
        <select
          value={value.defaultLanguage}
          onChange={(e) => onChange({ defaultLanguage: e.target.value })}
          className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm"
        >
          <option value="fa">فارسی</option>
        </select>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">منطقه زمانی</label>
        <p className="mb-2 text-xs text-slate-500">برای نمایش زمان رویدادها.</p>
        <select
          value={value.timezone}
          onChange={(e) => onChange({ timezone: e.target.value })}
          className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm"
        >
          <option value="Asia/Tehran">تهران (Asia/Tehran)</option>
        </select>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">فرمت تاریخ پیش‌فرض</label>
        <p className="mb-2 text-xs text-slate-500">شمسی یا میلادی در نمایش تاریخ.</p>
        <select
          value={value.defaultDateFormat}
          onChange={(e) => onChange({ defaultDateFormat: e.target.value as "jalali" | "gregorian" })}
          className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm"
        >
          <option value="jalali">شمسی</option>
          <option value="gregorian">میلادی</option>
        </select>
      </div>
      <div className="border-t border-[var(--border)] pt-5">
        <p className="mb-4 text-sm font-medium text-slate-700">فعال/غیرفعال کردن بخش‌های سایت</p>
        <div className="space-y-1">
          <Toggle
            label="بخش اخبار"
            checked={value.enableNews}
            onChange={(c) => onChange({ enableNews: c })}
          />
          <Toggle
            label="بخش مسابقات"
            checked={value.enableMatches}
            onChange={(c) => onChange({ enableMatches: c })}
          />
          <Toggle
            label="جدول رده‌بندی"
            checked={value.enableStandings}
            onChange={(c) => onChange({ enableStandings: c })}
          />
          <Toggle
            label="گالری و رسانه"
            checked={value.enableMedia}
            onChange={(c) => onChange({ enableMedia: c })}
          />
        </div>
      </div>
      <div className="border-t border-[var(--border)] pt-5">
        <div className="mb-2">
          <Toggle
            label="حالت تعمیر و نگهداری"
            checked={value.maintenanceMode}
            onChange={(c) => onChange({ maintenanceMode: c })}
          />
        </div>
        <p className="mt-2 mb-2 text-xs text-slate-500">در این حالت فقط پیام زیر برای بازدیدکنندگان نمایش داده می‌شود.</p>
        <textarea
          value={value.maintenanceMessage}
          onChange={(e) => onChange({ maintenanceMessage: e.target.value })}
          rows={2}
          placeholder="پیام تعمیرات"
          className="mt-2 w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm"
        />
      </div>
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand/90 disabled:opacity-60"
      >
        {saving ? "در حال ذخیره…" : "ذخیره تنظیمات عمومی"}
      </button>
    </div>
  );
}
