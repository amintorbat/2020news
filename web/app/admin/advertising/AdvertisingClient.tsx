"use client";

import { useState, useMemo, useEffect } from "react";
import jalaali from "jalaali-js";
import { PageHeader } from "@/components/admin/PageHeader";
import { FilterBar, FilterSelect } from "@/components/admin/FilterBar";
import { Toast } from "@/components/admin/Toast";
import { PersianDatePicker } from "@/components/admin/PersianDatePicker";
import { PersianTimePicker } from "@/components/admin/PersianTimePicker";
import {
  getAllAds,
  getAdById,
  createAd,
  updateAd,
  deleteAd,
  AD_SLOTS,
  AD_TYPES,
} from "@/lib/admin/adsData";
import type { Advertisement, AdType, AdSlot } from "@/types/advertising";

function isoToJalaliDate(iso: string): string {
  const d = new Date(iso);
  const j = jalaali.toJalaali(d.getFullYear(), d.getMonth() + 1, d.getDate());
  return `${j.jy}-${String(j.jm).padStart(2, "0")}-${String(j.jd).padStart(2, "0")}`;
}

function isoToTime(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function jalaliToISO(jalaliDate: string, time: string): string {
  const [y, m, d] = jalaliDate.split("-").map(Number);
  const [h = 0, min = 0] = time.split(":").map(Number);
  const g = jalaali.toGregorian(y, m, d);
  return new Date(g.gy, g.gm - 1, g.gd, h, min).toISOString();
}

const TYPE_LABELS: Record<AdType, string> = {
  banner: "بنر",
  html: "HTML / اسکریپت",
  native: "تبلیغ بومی",
  sponsored: "حمایت‌شده",
};

const SLOT_LABELS: Record<AdSlot, string> = AD_SLOTS.reduce((acc, s) => ({ ...acc, [s.value]: s.label }), {} as Record<AdSlot, string>);

export function AdvertisingClient() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [slotFilter, setSlotFilter] = useState<AdSlot | "">("");
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "inactive">("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewAd, setPreviewAd] = useState<Advertisement | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [step, setStep] = useState(1);

  const load = () => setAds(getAllAds());
  useEffect(() => load(), []);

  const filtered = useMemo(() => {
    let list = [...ads];
    if (slotFilter) list = list.filter((a) => a.slot === slotFilter);
    if (activeFilter === "active") list = list.filter((a) => a.isActive);
    if (activeFilter === "inactive") list = list.filter((a) => !a.isActive);
    return list;
  }, [ads, slotFilter, activeFilter]);

  const editing = editingId ? getAdById(editingId) : null;

  const handleToggleActive = (id: string) => {
    const ad = getAdById(id);
    if (!ad) return;
    updateAd(id, { isActive: !ad.isActive });
    load();
    setToast({ message: ad.isActive ? "تبلیغ غیرفعال شد" : "تبلیغ فعال شد", type: "success" });
  };

  const handleDelete = (id: string) => {
    if (!confirm("آیا از حذف این تبلیغ اطمینان دارید؟")) return;
    deleteAd(id);
    load();
    setFormOpen(false);
    setEditingId(null);
    setToast({ message: "تبلیغ حذف شد", type: "success" });
  };

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="مدیریت تبلیغات"
        subtitle="جایگاه‌های تبلیغ، بنر، HTML و تبلیغ بومی — مستقل از اخبار"
        action={
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setFormOpen(true);
              setStep(1);
            }}
            className="rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand/90 transition-colors touch-manipulation min-h-[44px]"
          >
            + تبلیغ جدید
          </button>
        }
      />

      {/* باکس تبلیغات: فیلتر + جدول در یک کارت */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50/80 px-4 py-3">
          <h2 className="text-sm font-semibold text-slate-800">فیلتر و لیست تبلیغات</h2>
        </div>
        <div className="p-4">
          <FilterBar>
            <FilterSelect
              label="جایگاه"
              value={slotFilter}
              options={AD_SLOTS.map((s) => ({ value: s.value, label: s.label }))}
              onChange={(v) => setSlotFilter(v)}
              placeholder="همه جایگاه‌ها"
            />
            <FilterSelect
              label="وضعیت"
              value={activeFilter}
              options={[
                { value: "all", label: "همه" },
                { value: "active", label: "فعال" },
                { value: "inactive", label: "غیرفعال" },
              ]}
              onChange={(v) => setActiveFilter(v)}
              placeholder="همه"
            />
          </FilterBar>
        </div>
        <div className="overflow-x-auto border-t border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2.5 text-right font-semibold text-slate-700 text-xs">عنوان</th>
                <th className="px-4 py-2.5 text-right font-semibold text-slate-700 text-xs hidden sm:table-cell">نوع</th>
                <th className="px-4 py-2.5 text-right font-semibold text-slate-700 text-xs hidden md:table-cell">جایگاه</th>
                <th className="px-4 py-2.5 text-right font-semibold text-slate-700 text-xs hidden lg:table-cell">بازه زمانی</th>
                <th className="px-4 py-2.5 text-right font-semibold text-slate-700 text-xs w-20">نمایش</th>
                <th className="px-4 py-2.5 text-right font-semibold text-slate-700 text-xs w-20">کلیک</th>
                <th className="px-4 py-2.5 text-right font-semibold text-slate-700 text-xs w-24">وضعیت</th>
                <th className="px-4 py-2.5 text-right font-semibold text-slate-700 text-xs w-28">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-slate-500 text-sm">
                    تبلیغی یافت نشد. روی «+ تبلیغ جدید» کلیک کنید.
                  </td>
                </tr>
              ) : (
                filtered.map((ad) => (
                  <tr key={ad.id} className="border-t border-slate-100 hover:bg-slate-50/50 align-middle">
                    <td className="px-4 py-2.5 font-medium text-slate-900">{ad.title}</td>
                    <td className="px-4 py-2.5 text-slate-600 hidden sm:table-cell">{TYPE_LABELS[ad.type]}</td>
                    <td className="px-4 py-2.5 text-slate-600 hidden md:table-cell">{SLOT_LABELS[ad.slot]}</td>
                    <td className="px-4 py-2.5 text-slate-600 hidden lg:table-cell text-xs">
                      {new Date(ad.startDate).toLocaleDateString("fa-IR", { dateStyle: "short" })} – {new Date(ad.endDate).toLocaleDateString("fa-IR", { dateStyle: "short" })}
                    </td>
                    <td className="px-4 py-2.5 text-slate-700 font-medium tabular-nums">{ad.impressions.toLocaleString("fa-IR")}</td>
                    <td className="px-4 py-2.5 text-slate-700 font-medium tabular-nums">{ad.clicks.toLocaleString("fa-IR")}</td>
                    <td className="px-4 py-2.5">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(ad.id)}
                        className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium transition-colors touch-manipulation min-h-[32px] ${
                          ad.isActive
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                        aria-label={ad.isActive ? "غیرفعال کردن" : "فعال کردن"}
                      >
                        {ad.isActive ? "فعال" : "غیرفعال"}
                      </button>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center justify-end gap-0.5">
                        <button
                          type="button"
                          onClick={() => setPreviewAd(ad)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 touch-manipulation"
                          title="پیش‌نمایش"
                          aria-label="پیش‌نمایش"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => { setEditingId(ad.id); setFormOpen(true); setStep(1); }}
                          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 touch-manipulation"
                          title="ویرایش"
                          aria-label="ویرایش"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(ad.id)}
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50 touch-manipulation"
                          title="حذف"
                          aria-label="حذف"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {formOpen && (
        <AdFormModal
          ad={editing}
          onClose={() => {
            setFormOpen(false);
            setEditingId(null);
            load();
          }}
          onSaved={() => {
            setFormOpen(false);
            setEditingId(null);
            load();
            setToast({ message: editingId ? "تبلیغ به‌روزرسانی شد" : "تبلیغ ایجاد شد", type: "success" });
          }}
          step={step}
          setStep={setStep}
        />
      )}

      {previewAd && (
        <AdPreviewModal ad={previewAd} onClose={() => setPreviewAd(null)} />
      )}

      {toast && <Toast message={toast.message} type={toast.type} isVisible={!!toast} onClose={() => setToast(null)} />}
    </div>
  );
}

function AdFormModal({
  ad,
  onClose,
  onSaved,
  step,
  setStep,
}: {
  ad: Advertisement | null;
  onClose: () => void;
  onSaved: () => void;
  step: number;
  setStep: (n: number) => void;
}) {
  const isEdit = !!ad;
  const [title, setTitle] = useState(ad?.title ?? "");
  const [type, setType] = useState<AdType>(ad?.type ?? "banner");
  const [slot, setSlot] = useState<AdSlot>(ad?.slot ?? "HOME_TOP");
  const [imageUrl, setImageUrl] = useState(ad?.imageUrl ?? "");
  const [htmlCode, setHtmlCode] = useState(ad?.htmlCode ?? "");
  const [linkUrl, setLinkUrl] = useState(ad?.linkUrl ?? "");
  const [startDate, setStartDate] = useState(ad ? isoToJalaliDate(ad.startDate) : "");
  const [startTime, setStartTime] = useState(ad ? isoToTime(ad.startDate) : "00:00");
  const [endDate, setEndDate] = useState(ad ? isoToJalaliDate(ad.endDate) : "");
  const [endTime, setEndTime] = useState(ad ? isoToTime(ad.endDate) : "23:59");
  const [priority, setPriority] = useState(ad?.priority ?? 0);
  const [isActive, setIsActive] = useState(ad?.isActive ?? true);
  const [error, setError] = useState("");

  const totalSteps = 3;

  const handleSubmit = () => {
    setError("");
    if (!title.trim()) {
      setError("عنوان تبلیغ را وارد کنید.");
      return;
    }
    if (!startDate || !endDate) {
      setError("تاریخ شروع و پایان را مشخص کنید.");
      return;
    }
    const startISO = jalaliToISO(startDate, startTime);
    const endISO = jalaliToISO(endDate, endTime);
    if (new Date(startISO) >= new Date(endISO)) {
      setError("تاریخ پایان باید بعد از تاریخ شروع باشد.");
      return;
    }
    if (type === "banner" && !imageUrl.trim()) {
      setError("برای بنر، آدرس تصویر را وارد کنید.");
      return;
    }

    if (isEdit && ad) {
      updateAd(ad.id, {
        title: title.trim(),
        type,
        slot,
        imageUrl: imageUrl.trim() || undefined,
        htmlCode: htmlCode.trim() || undefined,
        linkUrl: linkUrl.trim() || undefined,
        startDate: startISO,
        endDate: endISO,
        priority,
        isActive,
      });
    } else {
      createAd({
        title: title.trim(),
        type,
        slot,
        imageUrl: imageUrl.trim() || undefined,
        htmlCode: htmlCode.trim() || undefined,
        linkUrl: linkUrl.trim() || undefined,
        startDate: startISO,
        endDate: endISO,
        priority,
        isActive,
      });
    }
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" role="dialog" aria-modal="true" aria-labelledby="ad-form-title">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <h2 id="ad-form-title" className="text-lg font-bold text-slate-900">{isEdit ? "ویرایش تبلیغ" : "تبلیغ جدید"}</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="بستن">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Steps indicator - mobile */}
        <div className="sm:hidden flex gap-1 px-4 py-2 border-b border-slate-100">
          {[1, 2, 3].map((s) => (
            <button key={s} type="button" onClick={() => setStep(s)} className={`flex-1 py-1.5 rounded-lg text-xs font-medium ${step === s ? "bg-brand text-white" : "bg-slate-100 text-slate-600"}`}>
              مرحله {s}
            </button>
          ))}
        </div>

        <div className="p-4 space-y-4">
          {error && <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">{error}</div>}

          <div className={`space-y-4 ${step === 1 ? "block" : "hidden sm:block"}`}>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">عنوان تبلیغ *</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="مثال: بنر اسپانسر هفته" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">نوع تبلیغ</label>
                <select value={type} onChange={(e) => setType(e.target.value as AdType)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20">
                  {AD_TYPES.map((t) => (<option key={t.value} value={t.value}>{t.label}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">جایگاه نمایش (Slot)</label>
                <select value={slot} onChange={(e) => setSlot(e.target.value as AdSlot)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20">
                  {AD_SLOTS.map((s) => (<option key={s.value} value={s.value}>{s.label}</option>))}
                </select>
              </div>
            </div>

          <div className={`space-y-4 ${step === 2 ? "block" : "hidden sm:block"}`}>
              {(type === "banner" || type === "native" || type === "sponsored") && (
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">{type === "banner" ? "آدرس تصویر (بنر) *" : "آدرس تصویر (اختیاری)"}</label>
                  <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20" />
                </div>
              )}
              {type === "html" && (
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">کد HTML / اسکریپت</label>
                  <textarea value={htmlCode} onChange={(e) => setHtmlCode(e.target.value)} rows={4} placeholder="<div>...</div>" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-mono focus:border-brand focus:ring-2 focus:ring-brand/20" />
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">لینک کلیک (اختیاری)</label>
                <input type="url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://..." className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20" />
              </div>
            </div>

          <div className={`space-y-4 ${step === 3 ? "block" : "hidden sm:block"}`}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">شروع نمایش</label>
                  <PersianDatePicker value={startDate} onChange={setStartDate} placeholder="تاریخ" className="w-full" />
                  <PersianTimePicker value={startTime} onChange={setStartTime} placeholder="ساعت" className="w-full mt-1" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">پایان نمایش</label>
                  <PersianDatePicker value={endDate} onChange={setEndDate} placeholder="تاریخ" className="w-full" />
                  <PersianTimePicker value={endTime} onChange={setEndTime} placeholder="ساعت" className="w-full mt-1" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">اولویت نمایش (عدد بالاتر = اولویت بیشتر)</label>
                <input type="number" min={0} value={priority} onChange={(e) => setPriority(Number(e.target.value) || 0)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20" />
              </div>
              <div className="flex items-center gap-2">
                <Toggle checked={isActive} onChange={setIsActive} label="فعال" />
              </div>
            </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-slate-200 px-4 py-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-2">
            {step > 1 && (
              <button type="button" onClick={() => setStep(step - 1)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                قبلی
              </button>
            )}
            {step < totalSteps && (
              <button type="button" onClick={() => setStep(step + 1)} className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200">
                بعدی
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              انصراف
            </button>
            <button type="button" onClick={handleSubmit} className="rounded-xl bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand/90">
              {isEdit ? "ذخیره تغییرات" : "ایجاد تبلیغ"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdPreviewModal({ ad, onClose }: { ad: Advertisement; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" role="dialog" aria-modal="true" aria-label="پیش‌نمایش تبلیغ">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <span className="text-sm font-medium text-slate-700">پیش‌نمایش: {ad.title}</span>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="بستن">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-4 overflow-auto flex-1 bg-slate-100 min-h-[200px]">
          {ad.type === "banner" && ad.imageUrl && (
            <a href={ad.linkUrl || "#"} target="_blank" rel="noopener noreferrer" className="block rounded-xl overflow-hidden bg-white border border-slate-200">
              <img src={ad.imageUrl} alt={ad.title} className="w-full h-auto object-contain max-h-[300px]" onError={(e) => { (e.target as HTMLImageElement).src = "/images/placeholder.jpg"; }} />
            </a>
          )}
          {ad.type === "html" && ad.htmlCode && (
            <div className="rounded-xl overflow-hidden bg-white border border-slate-200 p-4 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: ad.htmlCode }} />
          )}
          {(ad.type === "native" || ad.type === "sponsored") && (
            <div className="rounded-xl bg-white border border-slate-200 p-4">
              <p className="text-xs text-slate-500 mb-1">تبلیغ بومی / حمایت‌شده</p>
              {ad.imageUrl && <img src={ad.imageUrl} alt="" className="w-full rounded-lg mb-2 max-h-40 object-cover" />}
              <p className="font-medium text-slate-900">{ad.title}</p>
              {ad.linkUrl && <p className="text-xs text-brand mt-1">{ad.linkUrl}</p>}
            </div>
          )}
          {ad.type === "banner" && !ad.imageUrl && <p className="text-slate-500 text-sm">آدرس تصویر وارد نشده است.</p>}
        </div>
      </div>
    </div>
  );
}
