import Image from "next/image";
import Link from "next/link";
import type { HeroSlide as HeroSlideData } from "@/data/content";

function shouldUseDarkText(accent: string) {
  const hex = accent.replace("#", "");
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.65;
}

type HeroSlideProps = {
  item: HeroSlideData;
};

export function HeroSlide({ item }: HeroSlideProps) {
  const useDarkText = shouldUseDarkText(item.accent);
  const textTone = useDarkText ? "text-slate-900" : "text-white";
  const supportingTone = useDarkText ? "text-slate-800" : "text-slate-200";

  return (
    <article className="relative h-[460px] overflow-hidden rounded-3xl border border-white/10" dir="rtl">
      <Image
        src={item.image}
        alt={item.title}
        fill
        priority
        className="object-cover"
        sizes="(min-width: 1024px) 1280px, 100vw"
      />

      <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/50 to-transparent" />
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at top right, rgba(2,6,23,0.55), transparent 55%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-70 mix-blend-multiply"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${item.accent}55, transparent 65%)`,
        }}
      />

      <div className="relative z-10 flex h-full flex-col justify-center gap-5 px-6 py-12 text-right md:px-14">
        <div className="flex flex-wrap items-center justify-end gap-3 text-xs font-bold">
          {item.badge && (
            <span
              className={`rounded-full px-4 py-1 text-[11px] tracking-tight ${
                item.badge.tone === "live" ? "bg-danger text-white" : "bg-primary text-slate-900"
              }`}
            >
              {item.badge.label}
            </span>
          )}
          <span
            className={`rounded-full px-4 py-1 text-[11px] ${useDarkText ? "bg-white/80 text-slate-900" : "bg-white/10 text-white"}`}
          >
            {item.sport === "futsal" ? "فوتسال" : "فوتبال ساحلی"}
          </span>
        </div>

        <div className="max-w-3xl self-end">
          <h1 className={`text-3xl font-black leading-relaxed md:text-4xl ${textTone}`}>{item.title}</h1>
          <p className={`mt-3 text-sm md:text-base leading-loose ${supportingTone}`}>{item.summary}</p>
        </div>

        <div className="flex justify-end">
          <Link
            href={item.link}
            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/30 px-6 py-3 text-sm font-semibold text-white backdrop-blur hover:border-primary/60 hover:text-primary"
          >
            مشاهده گزارش کامل
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path
                d="M10 7l5 5-5 5M15 12H5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
