import { ReactNode } from "react";

type PageHeroProps = {
  title: string;
  subtitle: string;
  eyebrow?: string;
  actions?: ReactNode;
};

export function PageHero({ title, subtitle, eyebrow, actions }: PageHeroProps) {
  return (
    <section className="container" dir="rtl">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-l from-[#050f23] via-[#09142c]/80 to-[#050f23] p-8 text-white">
        {eyebrow && <p className="text-xs font-bold text-white/60">{eyebrow}</p>}
        <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-3">
            <h1 className="text-3xl font-black leading-relaxed">{title}</h1>
            <p className="max-w-3xl text-sm leading-relaxed text-white/70">{subtitle}</p>
          </div>
          {actions}
        </div>
      </div>
    </section>
  );
}
