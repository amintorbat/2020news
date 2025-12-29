"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

type KioskItem = {
  id: number;
  title: string;
  category: "فوتبال ساحلی" | "فوتسال";
  imageUrl: string;
  href: string;
};

const kioskItems: KioskItem[] = [
  {
    id: 1,
    title: "ویژه‌نامه قهرمانی فوتسال",
    category: "فوتسال",
    imageUrl: "https://picsum.photos/seed/kiosk-grid-1/700/980",
    href: "/news/futsal-special-edition",
  },
  {
    id: 2,
    title: "گزارش ساحلی امروز",
    category: "فوتبال ساحلی",
    imageUrl: "https://picsum.photos/seed/kiosk-grid-2/700/980",
    href: "/news/beach-daily-report",
  },
  {
    id: 3,
    title: "هفته‌نامه فوتسال",
    category: "فوتسال",
    imageUrl: "https://picsum.photos/seed/kiosk-grid-3/700/980",
    href: "/news/futsal-weekly",
  },
  {
    id: 4,
    title: "روزنامه ورزش ساحلی",
    category: "فوتبال ساحلی",
    imageUrl: "https://picsum.photos/seed/kiosk-grid-4/700/980",
    href: "/news/beach-sports-frontpage",
  },
];

type SchedulePreviewProps = {
  container?: boolean;
  className?: string;
};

export function SchedulePreview({ container = true, className }: SchedulePreviewProps) {
  return (
    <section className={cn(container && "container", "space-y-4 lg:space-y-3", className)} dir="rtl">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 lg:text-base">کیوسک روزنامه</h2>
        <span className="text-xs text-gray-500">ویژه‌نامه‌ها</span>
      </div>
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-4 lg:gap-5 lg:overflow-visible">
        {kioskItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="group relative min-w-[200px] snap-start overflow-hidden rounded-3xl border border-[var(--border)] bg-white shadow-card transition hover:shadow-lg lg:min-w-0"
          >
            <div className="relative aspect-[3/4] w-full bg-slate-100">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                sizes="(min-width: 1024px) 220px, 60vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            </div>
            <div className="absolute inset-x-0 bottom-0 space-y-1 p-3 text-right">
              <span className="inline-flex rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-gray-900">
                {item.category}
              </span>
              <h3 className="line-clamp-2 text-sm font-semibold text-white sm:text-base">{item.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
