"use client";

import React, { useRef, useState, useEffect } from "react";
import { TeamFormValues } from "@/types/teams";
import { SportType, getAvailableSports, getSportConfig } from "@/types/matches";

type TeamFormModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (team: TeamFormValues) => void;
  initialValues?: TeamFormValues;
  isLoading?: boolean;
};

export function TeamFormModal({
  open,
  onClose,
  onSubmit,
  initialValues,
  isLoading = false,
}: TeamFormModalProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [form, setForm] = useState<TeamFormValues>(
    initialValues || {
      name: "",
      sport: "futsal",
      city: "",
      primaryColor: "#3B82F6",
      status: "active",
    }
  );

  const [preview, setPreview] = useState<string | null>(initialValues?.logo || null);
  const [dragActive, setDragActive] = useState(false);

  const availableSports = getAvailableSports();

  // Reset form when modal opens/closes or initialValues change
  useEffect(() => {
    if (open) {
      if (initialValues) {
        setForm(initialValues);
        setPreview(initialValues.logo || null);
      } else {
        setForm({
          name: "",
          sport: "futsal",
          city: "",
          primaryColor: "#3B82F6",
          status: "active",
        });
        setPreview(null);
      }
    }
  }, [open, initialValues]);

  if (!open) return null;

  function handleFile(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("لطفاً یک فایل تصویری انتخاب کنید");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreview(result);
      setForm((prev) => ({ ...prev, logo: result }));
    };
    reader.readAsDataURL(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files?.[0]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      alert("نام تیم الزامی است");
      return;
    }
    onSubmit(form);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" dir="rtl">
      <div className="w-full max-w-2xl rounded-xl bg-white p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-xl">
        <header className="space-y-1 border-b border-[var(--border)] pb-4">
          <h2 className="text-xl font-bold text-slate-900">
            {initialValues ? "ویرایش تیم" : "افزودن تیم جدید"}
          </h2>
          <p className="text-sm text-slate-600">اطلاعات پایه تیم</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Logo Upload */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">لوگوی تیم</label>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              className={`flex items-center gap-4 rounded-xl border-2 border-dashed p-4 transition ${
                dragActive ? "border-brand bg-brand/5" : "border-slate-200"
              }`}
            >
              <div className="h-20 w-20 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                {preview ? (
                  <img src={preview} alt="Team logo" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                    لوگو
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 flex-1">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-lg border border-[var(--border)] bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    انتخاب فایل
                  </button>
                  {preview && (
                    <button
                      type="button"
                      onClick={() => {
                        setPreview(null);
                        setForm((prev) => ({ ...prev, logo: undefined }));
                      }}
                      className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 transition-colors"
                    >
                      حذف
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  فایل را اینجا بکشید یا کلیک کنید تا انتخاب شود
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </div>
          </div>

          {/* Team Name */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">
              نام تیم <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              required
              placeholder="مثال: گیتی پسند"
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
            />
          </div>

          {/* Sport Type */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">
              نوع ورزش <span className="text-red-500">*</span>
            </label>
            <select
              value={form.sport}
              onChange={(e) => setForm((prev) => ({ ...prev, sport: e.target.value as SportType }))}
              required
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
            >
              {availableSports.map((sport) => (
                <option key={sport.id} value={sport.id}>
                  {sport.icon} {sport.label}
                </option>
              ))}
            </select>
          </div>

          {/* City */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">شهر</label>
            <input
              type="text"
              value={form.city || ""}
              onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value || undefined }))}
              placeholder="مثال: تهران"
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
            />
          </div>

          {/* Primary Color */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">رنگ اصلی تیم</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.primaryColor || "#3B82F6"}
                onChange={(e) => setForm((prev) => ({ ...prev, primaryColor: e.target.value }))}
                className="h-10 w-20 rounded-lg border border-[var(--border)] cursor-pointer"
              />
              <input
                type="text"
                value={form.primaryColor || "#3B82F6"}
                onChange={(e) => setForm((prev) => ({ ...prev, primaryColor: e.target.value }))}
                placeholder="#3B82F6"
                className="flex-1 rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand font-mono"
              />
            </div>
            <p className="mt-1 text-xs text-slate-500">رنگ اصلی تیم برای نمایش در رابط کاربری</p>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">وضعیت</label>
            <select
              value={form.status}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, status: e.target.value as "active" | "inactive" }))
              }
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
            >
              <option value="active">فعال</option>
              <option value="inactive">غیرفعال</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-lg border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "در حال ذخیره..." : initialValues ? "ذخیره تغییرات" : "افزودن تیم"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
