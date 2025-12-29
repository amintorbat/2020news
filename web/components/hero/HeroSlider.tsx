"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { heroSlides } from "@/data/content";

function getIsLight(color: string) {
  const hex = color.replace("#", "");
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6;
}

export function HeroSlider() {
  const [active, setActive] = useState(0);
  const slide = heroSlides[active];
  const lightText = getIsLight(slide.accent);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="container">
      <div
        className="relative overflow-hidden rounded-[32px] border border-[var(--border)] bg-white shadow-card"
        dir="rtl"
      >
        <div className="relative h-[420px] w-full">
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority={active === 0}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-white via-white/80 to-transparent" />
          <div className="relative z-10 flex h-full flex-col justify-center gap-4 px-6 py-10 md:px-14">
            <span className="w-fit rounded-full border border-[var(--border)] bg-white/80 px-4 py-2 text-xs font-semibold text-slate-600">
              خبر ویژه
            </span>
            <h1
              className={`text-3xl font-extrabold leading-relaxed md:text-4xl ${lightText ? "text-slate-900" : "text-slate-900"}`}
            >
              {slide.title}
            </h1>
            <p
              className={`max-w-2xl text-base ${lightText ? "text-slate-600" : "text-slate-600"}`}
            >
              {slide.summary}
            </p>
            <button className="w-fit rounded-full bg-brand px-6 py-3 text-sm font-bold text-white shadow-md transition hover:shadow-lg">
              مشاهده گزارش کامل
            </button>
          </div>
        </div>
        <div
          className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] bg-white px-6 py-4"
          dir="rtl"
        >
          <div className="flex flex-wrap items-center gap-2">
            {heroSlides.map((item, index) => (
              <button
                key={item.id}
                type="button"
                aria-label={`نمایش اسلاید ${index + 1}`}
                aria-current={active === index}
                onClick={() => setActive(index)}
                className={`h-2 rounded-full transition ${active === index ? "w-10 bg-brand" : "w-4 bg-slate-200"}`}
              />
            ))}
          </div>
          <p className="text-xs text-slate-500">
            {active + 1} / {heroSlides.length}
          </p>
        </div>
      </div>
    </section>
  );
}
