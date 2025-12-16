"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { latestNews, type NewsArticle } from "@/lib/data";
import { cn } from "@/lib/cn";

const AUTO_INTERVAL = 7000;

export function HeroSlider() {
  const slides = latestNews;
  const [active, setActive] = useState(0);
  const slideCount = slides.length;

  useEffect(() => {
    if (slideCount <= 1) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slideCount);
    }, AUTO_INTERVAL);
    return () => clearInterval(timer);
  }, [slideCount]);

  const goTo = (index: number) => {
    if (slideCount === 0) return;
    setActive((index + slideCount) % slideCount);
  };

  if (slideCount === 0) {
    return null;
  }

  return (
    <section className="container">
      <div className="relative min-h-[520px] overflow-hidden rounded-[32px] border border-[var(--border)] bg-white shadow-card md:h-[420px] md:min-h-0">
        <div className="flex h-full transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${active * 100}%)` }}>
          {slides.map((slide, index) => (
            <SlideItem key={slide.id} slide={slide} priority={index === 0} />
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-4 z-10 flex justify-center">
          <div className="flex items-center gap-2">
            {slides.map((item, index) => (
              <button
                key={item.id}
                type="button"
                aria-label={`اسلاید ${index + 1}`}
                aria-current={active === index}
                onClick={() => goTo(index)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  active === index ? "w-10 bg-brand" : "w-4 bg-slate-200"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

type SlideItemProps = {
  slide: NewsArticle;
  priority?: boolean;
};

function SlideItem({ slide, priority }: SlideItemProps) {
  return (
    <article className="flex min-w-full flex-col md:h-full md:flex-row" dir="ltr">
      <div className="relative h-64 w-full overflow-hidden md:h-full md:flex-1">
        <Image src={slide.image} alt={slide.title} fill className="object-cover" sizes="(min-width: 768px) 55vw, 100vw" priority={priority} />
      </div>
      <div className="flex w-full flex-col gap-4 border-t border-[var(--border)] bg-gradient-to-l from-[#f1f3f6] to-white px-6 py-8 text-right md:w-[38%] md:border-t-0 md:border-l" dir="rtl">
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-[var(--muted)]">
          <span className="rounded-full bg-brand/10 px-4 py-1 text-brand">{slide.category}</span>
          <span>{slide.timeAgo}</span>
        </div>
        <div className="space-y-3">
          <h1 className="text-2xl font-black leading-tight text-[var(--foreground)] md:text-3xl">{slide.title}</h1>
          {slide.summary && <p className="text-sm text-[var(--muted)]">{slide.summary}</p>}
        </div>
        <Link
          href={`/news/${slide.slug}`}
          className="mt-auto inline-flex w-fit items-center rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-brand/90"
        >
          مشاهده خبر کامل
        </Link>
      </div>
    </article>
  );
}
