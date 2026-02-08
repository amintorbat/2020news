"use client";

import { useState, useCallback, useEffect } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Toast } from "@/components/admin/Toast";
import { loadSettings, saveSettings, getDefaultSettings } from "@/lib/admin/settingsData";
import type { SiteSettings } from "@/types/settings";
import { GeneralSection } from "./sections/General";
import { SportsSection } from "./sections/Sports";
import { NewsJournalistSection } from "./sections/NewsJournalist";
import { MatchLeagueSection } from "./sections/MatchLeague";
import { AdvertisingSection } from "./sections/Advertising";
import { RolesPermissionsSection } from "./sections/RolesPermissions";
import { SystemReportsSection } from "./sections/SystemReports";
import { AutomationSection } from "./sections/Automation";

type SectionId =
  | "general"
  | "sports"
  | "newsJournalist"
  | "matchLeague"
  | "advertising"
  | "rolesPermissions"
  | "systemReports"
  | "automation";

const SECTIONS: { id: SectionId; title: string; description: string }[] = [
  { id: "general", title: "تنظیمات عمومی سایت", description: "نام، توضیح، زبان، تاریخ، حالت تعمیرات" },
  { id: "sports", title: "مدیریت ورزش‌ها", description: "فوتسال، فوتبال ساحلی، رشتهٔ پیش‌فرض" },
  { id: "newsJournalist", title: "اخبار و خبرنگار", description: "اسلاگ، تأیید سردبیر، دسترسی موقت" },
  { id: "matchLeague", title: "مسابقه و لیگ", description: "امتیاز، مدت مسابقه، حذفی، رده‌بندی" },
  { id: "advertising", title: "تبلیغات", description: "فعال/غیرفعال، حداکثر تبلیغ، هشدار انقضا" },
  { id: "rolesPermissions", title: "نقش‌ها و دسترسی", description: "مدیر، سردبیر، خبرنگار، دسترسی زمان‌دار" },
  { id: "systemReports", title: "گزارشات و هشدارها", description: "لاگ، مدت نگهداری، حساسیت، یادداشت اجباری" },
  { id: "automation", title: "اتوماسیون هوشمند", description: "انقضای دسترسی، تبلیغ منقضی، مسابقه ناقص" },
];

export default function SettingsClient() {
  const [settings, setSettings] = useState<SiteSettings>(getDefaultSettings());
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [openSection, setOpenSection] = useState<SectionId | null>("general");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSettings(loadSettings());
    setHydrated(true);
  }, []);

  const updateSection = useCallback(<K extends keyof SiteSettings>(key: K, partial: Partial<SiteSettings[K]>) => {
    setSettings((prev) => ({
      ...prev,
      [key]: { ...prev[key], ...partial },
    }));
  }, []);

  const handleSave = useCallback(() => {
    setSaving(true);
    try {
      saveSettings(settings);
      setToast({ message: "تنظیمات ذخیره شد.", type: "success" });
    } catch {
      setToast({ message: "خطا در ذخیره.", type: "error" });
    } finally {
      setSaving(false);
    }
  }, [settings]);

  const handleSaveSection = useCallback((sectionId: SectionId) => {
    setSaving(true);
    try {
      saveSettings(settings);
      setToast({ message: "تنظیمات این بخش ذخیره شد.", type: "success" });
    } catch {
      setToast({ message: "خطا در ذخیره.", type: "error" });
    } finally {
      setSaving(false);
    }
  }, [settings]);

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-slate-500" dir="rtl">
        در حال بارگذاری…
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="تنظیمات سایت"
        subtitle="مرکز کنترل سیستم — همهٔ تنظیمات در یک جا"
        action={
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg border border-[var(--border)] bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            ذخیرهٔ همهٔ تغییرات
          </button>
        }
      />

      {/* Tabs: desktop horizontal, mobile dropdown */}
      <div className="rounded-xl border border-[var(--border)] bg-white shadow-sm overflow-hidden">
        <div className="border-b border-[var(--border)] bg-slate-50/80 p-2 sm:p-0">
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:border-0">
            <select
              className="sm:hidden w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm"
              value={openSection ?? ""}
              onChange={(e) => setOpenSection((e.target.value as SectionId) || null)}
            >
              {SECTIONS.map((s) => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
            </select>
            <nav className="hidden sm:flex -mb-px overflow-x-auto" aria-label="بخش‌ها">
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setOpenSection(s.id)}
                  className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                    openSection === s.id
                      ? "border-[var(--color-brand)] text-[var(--color-brand)]"
                      : "border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-800"
                  }`}
                >
                  {s.title}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {openSection && (
            <>
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-900">
                  {SECTIONS.find((s) => s.id === openSection)?.title}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {SECTIONS.find((s) => s.id === openSection)?.description}
                </p>
              </div>

              {openSection === "general" && (
                <GeneralSection
                  value={settings.general}
                  onChange={(v) => updateSection("general", v)}
                  onSave={() => handleSaveSection("general")}
                  saving={saving}
                />
              )}
              {openSection === "sports" && (
                <SportsSection
                  value={settings.sports}
                  onChange={(v) => updateSection("sports", v)}
                  onSave={() => handleSaveSection("sports")}
                  saving={saving}
                />
              )}
              {openSection === "newsJournalist" && (
                <NewsJournalistSection
                  value={settings.newsJournalist}
                  onChange={(v) => updateSection("newsJournalist", v)}
                  onSave={() => handleSaveSection("newsJournalist")}
                  saving={saving}
                />
              )}
              {openSection === "matchLeague" && (
                <MatchLeagueSection
                  value={settings.matchLeague}
                  onChange={(v) => updateSection("matchLeague", v)}
                  onSave={() => handleSaveSection("matchLeague")}
                  saving={saving}
                />
              )}
              {openSection === "advertising" && (
                <AdvertisingSection
                  value={settings.advertising}
                  onChange={(v) => updateSection("advertising", v)}
                  onSave={() => handleSaveSection("advertising")}
                  saving={saving}
                />
              )}
              {openSection === "rolesPermissions" && (
                <RolesPermissionsSection
                  value={settings.rolesPermissions}
                  onChange={(v) => updateSection("rolesPermissions", v)}
                  onSave={() => handleSaveSection("rolesPermissions")}
                  saving={saving}
                />
              )}
              {openSection === "systemReports" && (
                <SystemReportsSection
                  value={settings.systemReports}
                  onChange={(v) => updateSection("systemReports", v)}
                  onSave={() => handleSaveSection("systemReports")}
                  saving={saving}
                />
              )}
              {openSection === "automation" && (
                <AutomationSection
                  value={settings.automation}
                  onChange={(v) => updateSection("automation", v)}
                  onSave={() => handleSaveSection("automation")}
                  saving={saving}
                />
              )}
            </>
          )}
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
