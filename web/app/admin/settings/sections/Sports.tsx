"use client";

import type { SportsSettings, SupportedSport } from "@/types/settings";
import { Toggle } from "@/components/admin/Toggle";

const SPORT_LABELS: Record<SupportedSport, string> = {
  futsal: "فوتسال",
  beach_soccer: "فوتبال ساحلی",
};

type Props = {
  value: SportsSettings;
  onChange: (v: Partial<SportsSettings>) => void;
  onSave: () => void;
  saving: boolean;
};

export function SportsSection({ value, onChange, onSave, saving }: Props) {
  const toggleSport = (sport: SupportedSport) => {
    const next = value.enabledSports.includes(sport)
      ? value.enabledSports.filter((s) => s !== sport)
      : [...value.enabledSports, sport];
    onChange({ enabledSports: next });
  };

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-sm font-medium text-slate-700">رشته‌های فعال</p>
        <p className="mb-4 text-xs text-slate-500">فقط رشته‌های انتخاب‌شده در سایت و پنل ادمین قابل استفاده هستند.</p>
        <div className="space-y-1">
          {(Object.keys(SPORT_LABELS) as SupportedSport[]).map((sport) => (
            <Toggle
              key={sport}
              label={SPORT_LABELS[sport]}
              checked={value.enabledSports.includes(sport)}
              onChange={() => toggleSport(sport)}
            />
          ))}
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">رشتهٔ پیش‌فرض</label>
        <p className="mb-2 text-xs text-slate-500">برای فیلترها و صفحاتی که رشته مشخص نیست.</p>
        <select
          value={value.defaultSport}
          onChange={(e) => onChange({ defaultSport: e.target.value as SupportedSport })}
          className="w-full max-w-xs rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm"
        >
          {value.enabledSports.map((s) => (
            <option key={s} value={s}>{SPORT_LABELS[s]}</option>
          ))}
        </select>
      </div>
      <div>
        <div className="mb-2">
          <Toggle
            label="قوانین مخصوص هر رشته"
            checked={value.sportSpecificRules}
            onChange={(c) => onChange({ sportSpecificRules: c })}
          />
        </div>
        <p className="mt-1 text-xs text-slate-500">مثلاً مدت مسابقه و قوانین کارت برای فوتسال و ساحلی جدا باشد.</p>
      </div>
      <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4">
        <p className="mb-3 text-xs text-amber-800">افزودن رشتهٔ جدید در نسخه‌های بعدی از همین بخش فعال می‌شود. (در حال حاضر غیرفعال)</p>
        <Toggle label="امکان افزودن رشته جدید (آینده)" checked={false} disabled onChange={() => {}} />
      </div>
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand/90 disabled:opacity-60"
      >
        {saving ? "در حال ذخیره…" : "ذخیره تنظیمات ورزش‌ها"}
      </button>
    </div>
  );
}
