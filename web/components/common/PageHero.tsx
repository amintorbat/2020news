import { ReactNode } from "react";

export function PageHero({ title, subtitle, eyebrow, action }: { title: string; subtitle: string; eyebrow?: string; action?: ReactNode }) {
  return (
    <section className="container" dir="rtl">
      <div className="rounded-[28px] border border-[var(--border)] bg-white px-8 py-10 shadow-card">
        {eyebrow && <p className="text-xs font-semibold text-brand">{eyebrow}</p>}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-3">
            <h1 className="text-3xl font-extrabold text-[var(--foreground)]">{title}</h1>
            <p className="max-w-2xl text-sm text-[var(--muted)]">{subtitle}</p>
          </div>
          {action}
        </div>
      </div>
    </section>
  );
}
