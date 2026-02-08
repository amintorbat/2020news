"use client";

import { useState, useEffect } from "react";
import { loadSettings } from "@/lib/admin/settingsData";

/**
 * Wraps public site content. On client, reads site settings and:
 * - If maintenance mode: shows maintenance message instead of children.
 * - Otherwise: renders children.
 * Server always renders children (no localStorage).
 */
export function SettingsGate({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [maintenance, setMaintenance] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMounted(true);
    try {
      const s = loadSettings();
      setMaintenance(!!s.general.maintenanceMode);
      setMessage(s.general.maintenanceMessage || "سایت در حال به‌روزرسانی است. به زودی برمی‌گردیم.");
    } catch {
      setMaintenance(false);
    }
  }, []);

  if (!mounted || !maintenance) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4" dir="rtl">
      <div className="max-w-md w-full rounded-2xl border border-[var(--border)] bg-white p-8 shadow-sm text-center">
        <h1 className="text-xl font-bold text-slate-900 mb-3">در حال به‌روزرسانی</h1>
        <p className="text-slate-600 whitespace-pre-line">{message}</p>
      </div>
    </div>
  );
}
