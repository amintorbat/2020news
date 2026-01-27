"use client";

import React, { useRef, useState } from "react";

type PlayerPosition = "GK" | "FIXO" | "ALA" | "PIVO";

export type PlayerFormValues = {
  name: string;
  team: string;
  position: PlayerPosition;
  photo?: string;
  goals: number;
  goalsConceded: number;
  yellowCards: number;
  redCards: number;
  cleanSheets: number;
  matchesPlayed: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (player: PlayerFormValues) => void;
  initialValues?: PlayerFormValues;
  isLoading?: boolean;
};

export function PlayerFormModal({ open, onClose, onSubmit, initialValues, isLoading = false }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState<PlayerFormValues>(
    initialValues || {
      name: "",
      team: "",
      position: "PIVO",
      goals: 0,
      goalsConceded: 0,
      yellowCards: 0,
      redCards: 0,
      cleanSheets: 0,
      matchesPlayed: 0,
    }
  );

  const [preview, setPreview] = useState<string | null>(initialValues?.photo || null);
  const [dragActive, setDragActive] = useState(false);

  // Reset form when modal opens/closes or initialValues change
  React.useEffect(() => {
    if (open) {
      if (initialValues) {
        setForm(initialValues);
        setPreview(initialValues.photo || null);
      } else {
        setForm({
          name: "",
          team: "",
          position: "PIVO",
          goals: 0,
          goalsConceded: 0,
          yellowCards: 0,
          redCards: 0,
          cleanSheets: 0,
          matchesPlayed: 0,
        });
        setPreview(null);
      }
    }
  }, [open, initialValues]);

  if (!open) return null;

  function handleFile(file?: File) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setForm((prev) => ({ ...prev, photo: url }));
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files?.[0]);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" dir="rtl">
      <div className="w-full max-w-2xl rounded-xl bg-white p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-xl">
        <header className="space-y-1 border-b border-[var(--border)] pb-4">
          <h2 className="text-xl font-bold text-slate-900">{initialValues ? "ویرایش بازیکن" : "افزودن بازیکن فوتسال"}</h2>
          <p className="text-sm text-slate-600">
            اطلاعات پایه و آماری بازیکن
          </p>
        </header>

        {/* آپلود عکس */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`flex items-center gap-4 rounded-xl border-2 border-dashed p-4 transition
            ${dragActive ? "border-blue-500 bg-blue-50" : "border-slate-200"}
          `}
        >
          <div className="h-20 w-20 rounded-full overflow-hidden bg-slate-100">
            {preview ? (
              <img
                src={preview}
                alt="player"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                عکس
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-blue-600 text-left"
            >
              انتخاب عکس از سیستم
            </button>
            <span className="text-xs text-slate-400">
              یا فایل را بکشید و رها کنید
            </span>
            {preview && (
              <button
                onClick={() => {
                  setPreview(null);
                  setForm((f) => ({ ...f, photo: undefined }));
                }}
                className="text-xs text-red-500 text-left"
              >
                حذف عکس
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>

        {/* اطلاعات پایه */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                نام بازیکن
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                placeholder="نام بازیکن"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                نام تیم
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                placeholder="نام تیم"
                value={form.team}
                onChange={(e) => setForm({ ...form, team: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              پست
            </label>
            <select
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
              value={form.position}
              onChange={(e) =>
                setForm({ ...form, position: e.target.value as PlayerPosition })
              }
            >
              <option value="GK">دروازه‌بان</option>
              <option value="FIXO">فیکسو</option>
              <option value="ALA">آلا</option>
              <option value="PIVO">پیوت</option>
            </select>
          </div>
        </div>

        {/* آمار */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold">آمار بازیکن</h3>

          <div className="grid grid-cols-2 gap-3">
            <StatInput
              label="گل"
              value={form.goals}
              onChange={(v) => setForm({ ...form, goals: v })}
            />
            <StatInput
              label="کارت زرد"
              value={form.yellowCards}
              onChange={(v) => setForm({ ...form, yellowCards: v })}
            />
            <StatInput
              label="کارت قرمز"
              value={form.redCards}
              onChange={(v) => setForm({ ...form, redCards: v })}
            />
            <StatInput
              label="کلین‌شیت"
              value={form.cleanSheets}
              onChange={(v) => setForm({ ...form, cleanSheets: v })}
            />
            <StatInput
              label="گل خورده"
              value={form.goalsConceded}
              onChange={(v) => setForm({ ...form, goalsConceded: v })}
            />
            <StatInput
              label="بازی انجام شده"
              value={form.matchesPlayed}
              onChange={(v) => setForm({ ...form, matchesPlayed: v })}
            />
          </div>
        </section>

        {/* اکشن‌ها */}
        <footer className="flex justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            انصراف
          </button>
          <button
            onClick={() => {
              onSubmit(form);
            }}
            disabled={isLoading}
            className="rounded-lg bg-brand px-5 py-2 text-sm text-white hover:bg-brand/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "در حال ذخیره..." : initialValues ? "ذخیره تغییرات" : "ذخیره بازیکن"}
          </button>
        </footer>
      </div>
    </div>
  );
}

function StatInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-slate-700">{label}</label>
      <input
        type="number"
        min={0}
        className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
        value={value}
        onChange={(e) => onChange(+e.target.value)}
      />
    </div>
  );
}