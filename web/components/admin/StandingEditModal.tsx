"use client";

import { useState, useEffect } from "react";
import { StandingRow } from "@/lib/admin/standingsData";

type StandingEditModalProps = {
  open: boolean;
  standing: StandingRow | null;
  onClose: () => void;
  onSave: (standing: StandingRow, overrides: StandingRow["manualOverrides"]) => void;
  isLoading?: boolean;
};

export function StandingEditModal({
  open,
  standing,
  onClose,
  onSave,
  isLoading = false,
}: StandingEditModalProps) {
  const [pointsDeduction, setPointsDeduction] = useState(0);
  const [deductionReason, setDeductionReason] = useState("");
  const [manualPoints, setManualPoints] = useState<number | null>(null);

  useEffect(() => {
    if (standing) {
      setPointsDeduction(standing.manualOverrides?.pointsDeduction || 0);
      setDeductionReason(standing.manualOverrides?.pointsDeductionReason || "");
      setManualPoints(standing.manualOverrides?.points ?? null);
    }
  }, [standing, open]);

  if (!open || !standing) return null;

  const handleSave = () => {
    const overrides: StandingRow["manualOverrides"] = {
      pointsDeduction: pointsDeduction > 0 ? pointsDeduction : undefined,
      pointsDeductionReason: deductionReason || undefined,
      points: manualPoints !== null ? manualPoints : undefined,
    };
    onSave(standing, overrides);
  };

  const effectivePoints =
    manualPoints !== null
      ? manualPoints
      : standing.points - (pointsDeduction || 0) + (standing.manualOverrides?.pointsDeduction || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" dir="rtl">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-900 mb-2">ویرایش رکورد تیم</h3>
          <p className="text-sm text-slate-600 mb-4">
            <span className="font-medium">{standing.team}</span> - {standing.competitionName}
          </p>
        </div>

        <div className="space-y-4">
          {/* Current Stats Display */}
          <div className="rounded-lg bg-slate-50 p-4 space-y-2">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-600">بازی:</span>
                <span className="font-medium text-slate-900 mr-2">{standing.played}</span>
              </div>
              <div>
                <span className="text-slate-600">برد:</span>
                <span className="font-medium text-green-600 mr-2">{standing.won}</span>
              </div>
              <div>
                <span className="text-slate-600">مساوی:</span>
                <span className="font-medium text-yellow-600 mr-2">{standing.drawn}</span>
              </div>
              <div>
                <span className="text-slate-600">باخت:</span>
                <span className="font-medium text-red-600 mr-2">{standing.lost}</span>
              </div>
              <div>
                <span className="text-slate-600">گل زده:</span>
                <span className="font-medium text-slate-900 mr-2">{standing.goalsFor}</span>
              </div>
              <div>
                <span className="text-slate-600">گل خورده:</span>
                <span className="font-medium text-slate-900 mr-2">{standing.goalsAgainst}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">امتیاز فعلی:</span>
                <span className="text-lg font-bold text-slate-900">{standing.points}</span>
              </div>
            </div>
          </div>

          {/* Manual Points Override */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">
              تنظیم دستی امتیاز (اختیاری)
            </label>
            <input
              type="number"
              value={manualPoints ?? ""}
              onChange={(e) => setManualPoints(e.target.value ? parseInt(e.target.value) : null)}
              placeholder="خالی بگذارید برای استفاده از محاسبه خودکار"
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
            />
            <p className="mt-1 text-xs text-slate-500">
              در صورت خالی بودن، امتیاز از نتایج مسابقات محاسبه می‌شود
            </p>
          </div>

          {/* Points Deduction */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">
              کسر امتیاز (جریمه)
            </label>
            <input
              type="number"
              min="0"
              value={pointsDeduction}
              onChange={(e) => setPointsDeduction(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
            />
          </div>

          {/* Deduction Reason */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">
              دلیل کسر امتیاز
            </label>
            <textarea
              value={deductionReason}
              onChange={(e) => setDeductionReason(e.target.value)}
              rows={3}
              placeholder="مثال: عدم حضور در مسابقه، تخلف..."
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand resize-none"
            />
          </div>

          {/* Effective Points Preview */}
          {pointsDeduction > 0 || manualPoints !== null ? (
            <div className="rounded-lg bg-blue-50 p-3 border border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900">امتیاز نهایی:</span>
                <span className="text-lg font-bold text-blue-900">{effectivePoints}</span>
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            انصراف
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isLoading}
            className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "در حال ذخیره..." : "ذخیره"}
          </button>
        </div>
      </div>
    </div>
  );
}
