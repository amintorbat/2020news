import { ReactNode } from "react";

export function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4" dir="rtl">
      <div className="space-y-1 text-right">
        {subtitle && <p className="text-xs font-semibold text-[var(--muted)]">{subtitle}</p>}
        <h2 className="section-title">{title}</h2>
      </div>
      {action}
    </header>
  );
}
