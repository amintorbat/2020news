import { ReactNode } from "react";

export function SectionHeader({ title, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4" dir="rtl">
      <div className=" text-right">
        <h3 className="section-title text-slate-900">{title}</h3>
      </div>
      {action}
    </header>
  );
}
