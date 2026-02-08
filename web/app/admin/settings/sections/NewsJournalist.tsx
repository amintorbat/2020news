"use client";

import type { NewsJournalistSettings } from "@/types/settings";
import { Toggle } from "@/components/admin/Toggle";

type Props = {
  value: NewsJournalistSettings;
  onChange: (v: Partial<NewsJournalistSettings>) => void;
  onSave: () => void;
  saving: boolean;
};

export function NewsJournalistSection({ value, onChange, onSave, saving }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <Toggle
          label="تولید خودکار اسلاگ از عنوان (فارسی و اعداد)"
          checked={value.autoGenerateSlug}
          onChange={(c) => onChange({ autoGenerateSlug: c })}
        />
        <p className="mt-1 text-xs text-slate-500">اگر خالی بماند، از عنوان خبر ساخته می‌شود.</p>
      </div>
      <div>
        <Toggle
          label="تأیید سردبیر قبل از انتشار خبر"
          checked={value.requireEditorApprovalBeforePublish}
          onChange={(c) => onChange({ requireEditorApprovalBeforePublish: c })}
        />
        <p className="mt-1 text-xs text-slate-500">خبرنگاران فقط پیش‌نویس ایجاد می‌کنند تا سردبیر تأیید کند.</p>
      </div>
      <div className="border-t border-[var(--border)] pt-4">
        <p className="mb-3 text-sm font-medium text-slate-700">دسترسی موقت خبرنگار / گزارشگر</p>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs text-slate-600">مدت پیش‌فرض (ساعت)</label>
            <input
              type="number"
              min={1}
              max={168}
              value={value.journalistDefaultDurationHours}
              onChange={(e) => onChange({ journalistDefaultDurationHours: Number(e.target.value) || 1 })}
              className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-600">حداکثر مدت (ساعت)</label>
            <input
              type="number"
              min={1}
              max={168}
              value={value.journalistMaxDurationHours}
              onChange={(e) => onChange({ journalistMaxDurationHours: Number(e.target.value) || 1 })}
              className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-600">رفتار پس از انقضا</label>
            <select
              value={value.journalistExpirationBehavior}
              onChange={(e) => onChange({ journalistExpirationBehavior: e.target.value as NewsJournalistSettings["journalistExpirationBehavior"] })}
              className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm"
            >
              <option value="revoke">لغو خودکار دسترسی</option>
              <option value="notify">اعلان به مدیر</option>
              <option value="extend_request">درخواست تمدید از خبرنگار</option>
            </select>
          </div>
        </div>
      </div>
      <div>
        <Toggle
          label="فعال بودن ویرایشگر غنی (ریچ ادیتور)"
          checked={value.richEditorEnabled}
          onChange={(c) => onChange({ richEditorEnabled: c })}
        />
      </div>
      <div>
        <Toggle
          label="الزام گزارش/یادداشت برای هر خبر"
          checked={value.mandatoryReportNotePerNews}
          onChange={(c) => onChange({ mandatoryReportNotePerNews: c })}
        />
        <p className="mt-1 text-xs text-slate-500">قبل از انتشار باید توضیح یا یادداشت داخلی ثبت شود.</p>
      </div>
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand/90 disabled:opacity-60"
      >
        {saving ? "در حال ذخیره…" : "ذخیره تنظیمات اخبار و خبرنگار"}
      </button>
    </div>
  );
}
