"use client";

import React, { useRef, useState } from "react";
import type { SportType } from "@/types/matches";
import type { Team } from "@/types/teams";

type PlayerPosition = "GK" | "FIXO" | "ALA" | "PIVO";
type PlayerStatus = "active" | "injured" | "suspended" | "inactive";

const statusLabel: Record<PlayerStatus, string> = {
  active: "فعال",
  injured: "مصدوم",
  suspended: "محروم",
  inactive: "غیرفعال",
};

export type PlayerFormValues = {
  id?: string;
  name: string;
  sport: SportType;
  teamId: string;
  position: PlayerPosition;
  jerseyNumber?: number;
  status: PlayerStatus;
  photo?: string;
  goals: number;
  assists: number;
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
  teams: Team[];
};

export function PlayerFormModal({
  open,
  onClose,
  onSubmit,
  initialValues,
  isLoading = false,
  teams,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState<PlayerFormValues>(
    initialValues || {
      name: "",
      sport: "futsal",
      teamId: "",
      position: "PIVO",
      jerseyNumber: undefined,
      status: "active",
      goals: 0,
      assists: 0,
      goalsConceded: 0,
      yellowCards: 0,
      redCards: 0,
      cleanSheets: 0,
      matchesPlayed: 0,
    }
  );

  const [preview, setPreview] = useState<string | null>(initialValues?.photo || null);
  const [dragActive, setDragActive] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  const availableTeams = teams.filter((t) => t.sport === form.sport);

  // Reset form when modal opens/closes or initialValues change
  React.useEffect(() => {
    if (open) {
      setStep(1);
      if (initialValues) {
        setForm(initialValues);
        setPreview(initialValues.photo || null);
      } else {
        setForm({
          name: "",
          sport: "futsal",
          teamId: "",
          position: "PIVO",
          jerseyNumber: undefined,
          status: "active",
          goals: 0,
          assists: 0,
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
    if (!file.type.startsWith("image/")) {
      alert("لطفاً یک فایل تصویری انتخاب کنید");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    setForm((prev) => ({ ...prev, photo: url }));
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files?.[0]);
  }

  const handleSubmit = () => {
    if (!form.name.trim()) {
      alert("نام بازیکن الزامی است");
      return;
    }
    if (!form.teamId) {
      alert("انتخاب تیم الزامی است");
      return;
    }
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" dir="rtl">
      <div className="w-full max-w-2xl rounded-xl bg-white p-4 sm:p-6 space-y-4 sm:space-y-6 max-h-[90vh] overflow-y-auto shadow-xl">
        <header className="space-y-1 border-b border-[var(--border)] pb-3 sm:pb-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            {initialValues ? "ویرایش بازیکن" : "افزودن بازیکن جدید"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            اطلاعات پایه، تیم و آمار بازیکن
          </p>
        </header>

        {/* Step indicator - mobile first */}
        <div className="flex items-center justify-between rounded-lg bg-slate-50 p-2 sm:hidden">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`flex-1 rounded-md px-2 py-1 text-xs font-medium ${
              step === 1 ? "bg-white shadow text-slate-900" : "text-slate-500"
            }`}
          >
            ۱. اطلاعات پایه
          </button>
          <button
            type="button"
            onClick={() => setStep(2)}
            className={`flex-1 rounded-md px-2 py-1 text-xs font-medium ${
              step === 2 ? "bg-white shadow text-slate-900" : "text-slate-500"
            }`}
          >
            ۲. آمار و شماره
          </button>
        </div>

        {/* Step 1 - Basic info & team (mobile-only step, desktop always visible) */}
        <section
          className={`space-y-4 ${
            step !== 1 ? "hidden sm:block" : ""
          }`}
        >
          {/* آپلود عکس */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`flex items-center gap-4 rounded-xl border-2 border-dashed p-3 sm:p-4 transition ${
              dragActive ? "border-brand bg-brand/5" : "border-slate-200"
            }`}
          >
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full overflow-hidden bg-slate-100 flex-shrink-0">
              {preview ? (
                <img
                  src={preview}
                  alt="player"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[10px] sm:text-xs text-slate-400">
                  عکس بازیکن
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1.5 text-xs sm:text-sm">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-brand text-right font-medium"
              >
                انتخاب عکس از سیستم
              </button>
              <span className="text-[11px] text-slate-400">
                یا فایل را بکشید و اینجا رها کنید
              </span>
              {preview && (
                <button
                  type="button"
                  onClick={() => {
                    setPreview(null);
                    setForm((f) => ({ ...f, photo: undefined }));
                  }}
                  className="text-[11px] text-red-500 text-right"
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

          {/* نام، ورزش، تیم */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  نام بازیکن <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                  placeholder="مثال: مهدی جاوید"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  وضعیت
                </label>
                <select
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value as PlayerStatus })
                  }
                >
                  <option value="active">فعال</option>
                  <option value="injured">مصدوم</option>
                  <option value="suspended">محروم</option>
                  <option value="inactive">غیرفعال</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  ورزش <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                  value={form.sport}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      sport: e.target.value as SportType,
                      teamId: "",
                    }))
                  }
                >
                  <option value="futsal">فوتسال</option>
                  <option value="beach-soccer">فوتبال ساحلی</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  تیم <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand disabled:opacity-50"
                  value={form.teamId}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      teamId: e.target.value,
                    }))
                  }
                  disabled={availableTeams.length === 0}
                >
                  <option value="">
                    {availableTeams.length === 0
                      ? "ابتدا ورزش را انتخاب کنید"
                      : "انتخاب تیم"}
                  </option>
                  {availableTeams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  شماره پیراهن
                </label>
                <input
                  type="number"
                  min={0}
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                  value={form.jerseyNumber ?? ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      jerseyNumber:
                        e.target.value === "" ? undefined : Number(e.target.value),
                    })
                  }
                  placeholder="مثال: ۱۰"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Step 2 - Stats (mobile-only step, desktop always visible) */}
        <section
          className={`space-y-3 ${
            step !== 2 ? "hidden sm:block" : ""
          }`}
        >
          <h3 className="text-sm font-semibold">آمار بازیکن</h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <StatInput
              label="بازی انجام شده"
              value={form.matchesPlayed}
              onChange={(v) => setForm({ ...form, matchesPlayed: v })}
            />
            <StatInput
              label="گل زده"
              value={form.goals}
              onChange={(v) => setForm({ ...form, goals: v })}
            />
            <StatInput
              label="گل خورده (دروازه‌بان)"
              value={form.goalsConceded}
              onChange={(v) => setForm({ ...form, goalsConceded: v })}
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
          </div>
        </section>

        {/* اکشن‌ها */}
        <footer className="flex flex-col sm:flex-row justify-between gap-3 pt-2 sm:pt-4 border-t border-[var(--border)]">
          <div className="flex items-center gap-2 text-[11px] text-slate-500 sm:text-xs">
            <span>فوتسال و فوتبال ساحلی</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">مدیریت حرفه‌ای آمار بازیکنان</span>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-lg border border-[var(--border)] bg-white px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              انصراف
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="rounded-lg bg-brand px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-brand/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "در حال ذخیره..." : initialValues ? "ذخیره تغییرات" : "ذخیره بازیکن"}
            </button>
          </div>
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
      <label className="text-[11px] sm:text-xs font-medium text-slate-700">
        {label}
      </label>
      <input
        type="number"
        min={0}
        className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
        value={value}
        onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
      />
    </div>
  );
}