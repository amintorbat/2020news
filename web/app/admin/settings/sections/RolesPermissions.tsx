"use client";

import type { RolesPermissionsSettings } from "@/types/settings";
import { Toggle } from "@/components/admin/Toggle";

type Props = {
  value: RolesPermissionsSettings;
  onChange: (v: Partial<RolesPermissionsSettings>) => void;
  onSave: () => void;
  saving: boolean;
};

export function RolesPermissionsSection({ value, onChange, onSave, saving }: Props) {
  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-600">کنترل دسترسی نقش‌ها به ماژول‌ها. تغییرات روی دسترسی بعد از ورود کاربر اعمال می‌شود.</p>
      <div className="border-t border-[var(--border)] pt-4 space-y-4">
        <div>
          <Toggle
            label="مدیر: دسترسی کامل به همه بخش‌ها"
            checked={value.adminCanAll}
            onChange={(c) => onChange({ adminCanAll: c })}
          />
        </div>
        <div>
          <Toggle
            label="سردبیر: امکان انتشار محتوا"
            checked={value.editorCanPublish}
            onChange={(c) => onChange({ editorCanPublish: c })}
          />
        </div>
        <div>
          <Toggle
            label="سردبیر: امکان حذف محتوا"
            checked={value.editorCanDelete}
            onChange={(c) => onChange({ editorCanDelete: c })}
          />
        </div>
        <div>
          <Toggle
            label="خبرنگار فقط با دسترسی موقت"
            checked={value.journalistTemporaryOnly}
            onChange={(c) => onChange({ journalistTemporaryOnly: c })}
          />
          <p className="mt-1 text-xs text-slate-500">دسترسی زمان‌دار به مسابقه یا خبر خاص.</p>
        </div>
        <div>
          <Toggle
            label="خبرنگار به‌طور پیش‌فرض فقط خواندن"
            checked={value.journalistReadOnlyByDefault}
            onChange={(c) => onChange({ journalistReadOnlyByDefault: c })}
          />
        </div>
        <div>
          <Toggle
            label="پشتیبانی از دسترسی زمان‌دار"
            checked={value.timeBasedAccessSupported}
            onChange={(c) => onChange({ timeBasedAccessSupported: c })}
          />
          <p className="mt-1 text-xs text-slate-500">اعمال بازهٔ شروع و پایان برای گزارشگران.</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand/90 disabled:opacity-60"
      >
        {saving ? "در حال ذخیره…" : "ذخیره تنظیمات نقش‌ها"}
      </button>
    </div>
  );
}
