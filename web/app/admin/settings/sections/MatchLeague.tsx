"use client";

import type { MatchLeagueSettings } from "@/types/settings";
import { Toggle } from "@/components/admin/Toggle";

type Props = {
  value: MatchLeagueSettings;
  onChange: (v: Partial<MatchLeagueSettings>) => void;
  onSave: () => void;
  saving: boolean;
};

export function MatchLeagueSection({ value, onChange, onSave, saving }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">مدت پیش‌فرض مسابقه (دقیقه)</label>
        <p className="mb-2 text-xs text-slate-500">برای فوتسال معمولاً ۴۰ دقیقه (۲ نیمه).</p>
        <input
          type="number"
          min={1}
          max={120}
          value={value.defaultMatchDurationMinutes}
          onChange={(e) => onChange({ defaultMatchDurationMinutes: Number(e.target.value) || 40 })}
          className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm"
        />
      </div>
      <div className="border-t border-[var(--border)] pt-4">
        <p className="mb-3 text-sm font-medium text-slate-700">سیستم امتیاز (پیروزی / تساوی / باخت)</p>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="mb-1 block text-xs text-slate-600">پیروزی</label>
            <input
              type="number"
              min={0}
              value={value.pointsWin}
              onChange={(e) => onChange({ pointsWin: Number(e.target.value) || 0 })}
              className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-600">تساوی</label>
            <input
              type="number"
              min={0}
              value={value.pointsDraw}
              onChange={(e) => onChange({ pointsDraw: Number(e.target.value) || 0 })}
              className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-600">باخت</label>
            <input
              type="number"
              min={0}
              value={value.pointsLoss}
              onChange={(e) => onChange({ pointsLoss: Number(e.target.value) || 0 })}
              className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>
      <div>
        <Toggle
          label="فعال بودن مسابقات حذفی (ناک‌اوت)"
          checked={value.enableKnockoutCompetitions}
          onChange={(c) => onChange({ enableKnockoutCompetitions: c })}
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">تعداد تیم در هر گروه (مرحله گروهی)</label>
        <input
          type="number"
          min={2}
          max={8}
          value={value.groupStageDefaultTeamsPerGroup}
          onChange={(e) => onChange({ groupStageDefaultTeamsPerGroup: Number(e.target.value) || 4 })}
          className="w-full max-w-[120px] rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm"
        />
      </div>
      <div>
        <Toggle
          label="تولید خودکار قوانین رده‌بندی"
          checked={value.autoGenerateStandingsRules}
          onChange={(c) => onChange({ autoGenerateStandingsRules: c })}
        />
        <p className="mt-1 text-xs text-slate-500">بر اساس امتیاز، تفاضل گل و گل زده.</p>
      </div>
      <div>
        <Toggle
          label="تغییر خودکار وضعیت مسابقه به «پایان» پس از ثبت نتیجه"
          checked={value.matchStatusAutoFinish}
          onChange={(c) => onChange({ matchStatusAutoFinish: c })}
        />
      </div>
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand/90 disabled:opacity-60"
      >
        {saving ? "در حال ذخیره…" : "ذخیره تنظیمات مسابقه و لیگ"}
      </button>
    </div>
  );
}
