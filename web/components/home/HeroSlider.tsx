"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { heroSlides } from "@/data/mock/news";
import { cn } from "@/lib/cn";

type BrightMap = Record<string, number>;

async function computeBrightness(url: string): Promise<number> {
  if (typeof window === "undefined") return 0.4;
  try {
    const response = await fetch(url, { cache: "force-cache" });
    const blob = await response.blob();
    const bitmap =
      "createImageBitmap" in window
        ? await createImageBitmap(blob)
        : await new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => resolve(img);
            img.onerror = (err) => reject(err);
            img.src = URL.createObjectURL(blob);
          });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return 0.4;
    const size = 32;
    canvas.width = size;
    canvas.height = size;
    context.drawImage(bitmap as CanvasImageSource, 0, 0, size, size);
    const { data } = context.getImageData(0, 0, size, size);
    let total = 0;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      total += (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    }
    return total / (data.length / 4);
  } catch {
    return 0.4;
  }
}

export function HeroSlider() {
  const [active, setActive] = useState(0);
  const [brightness, setBrightness] = useState<BrightMap>({});
  const slide = heroSlides[active];
  const level = brightness[slide.id] ?? 0.45;
  const isDark = level < 0.45;

  useEffect(() => {
    let mounted = true;
    heroSlides.forEach((item) => {
      if (brightness[item.id]) return;
      computeBrightness(item.image).then((value) => {
        if (!mounted) return;
        setBrightness((prev) => ({ ...prev, [item.id]: value }));
      });
    });
    return () => {
      mounted = false;
    };
  }, [brightness]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="container">
      <div className="relative overflow-hidden rounded-[32px] border border-[var(--border)] bg-white shadow-card" dir="rtl">
        <div className="relative h-[420px] w-full">
          <Image src={slide.image} alt={slide.title} fill className="object-cover" priority sizes="100vw" />
          <div
            className={cn(
              "absolute inset-0 transition-all",
              isDark
                ? "bg-gradient-to-l from-black/70 via-black/40 to-transparent"
                : "bg-gradient-to-l from-white/90 via-white/60 to-transparent"
            )}
          />
          <div className="relative z-10 flex h-full flex-col justify-center gap-4 px-6 py-10 md:px-14">
            <span
              className={cn(
                "w-fit rounded-full border px-4 py-1 text-xs font-semibold",
                isDark
                  ? "border-white/30 bg-white/20 text-white"
                  : "border-[var(--border)] bg-white/90 text-[var(--muted)]"
              )}
            >
              {slide.category}
            </span>
            <h1
              className={cn(
                "text-3xl font-black leading-tight md:text-4xl",
                isDark ? "text-white" : "text-[var(--foreground)]"
              )}
            >
              {slide.title}
            </h1>
            <p className={cn("max-w-3xl text-base md:text-lg", isDark ? "text-white/80" : "text-[var(--muted)]")}>{slide.summary}</p>
            <Link
              href={slide.ctaHref}
              className={cn(
                "w-fit rounded-full px-6 py-3 text-sm font-semibold shadow-lg transition",
                slide.isLive ? "bg-red-500 text-white" : "bg-brand text-white"
              )}
            >
              {slide.isLive ? "مشاهده پخش زنده" : "مشاهده گزارش کامل"}
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-[var(--border)] bg-white px-6 py-4" dir="rtl">
          <div className="flex items-center gap-2">
            {heroSlides.map((item, index) => (
              <button
                key={item.id}
                type="button"
                aria-label={`اسلاید ${index + 1}`}
                aria-current={active === index}
                onClick={() => setActive(index)}
                className={cn("h-2 rounded-full transition", active === index ? "w-10 bg-brand" : "w-4 bg-slate-200")}
              />
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActive((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
              aria-label="اسلاید قبلی"
              className="rounded-full border border-[var(--border)] p-2 text-slate-500 hover:text-brand"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M15 6 9 12l6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setActive((prev) => (prev + 1) % heroSlides.length)}
              aria-label="اسلاید بعدی"
              className="rounded-full border border-[var(--border)] p-2 text-slate-500 hover:text-brand"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
