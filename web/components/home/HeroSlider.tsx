"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { Article } from "@/lib/acs/types";
import { cn } from "@/lib/cn";

const AUTO_INTERVAL = 7000;
const FALLBACK_IMAGE = "/images/placeholder-article.png";

const LOCAL_FALLBACK_SLIDES: Article[] = [
  {
    id: "local-fallback-1",
    slug: "news-local-fallback-1",
    title: "آخرین خبرهای فوتسال",
    excerpt: "پوشش ویژه از رقابت‌های فوتسال ایران و آسیا.",
    publishedAt: "۱۴۰۳/۰۱/۲۲",
    category: "فوتسال",
    sport: "futsal",
    imageUrl: FALLBACK_IMAGE,
  },
  {
    id: "local-fallback-2",
    slug: "news-local-fallback-2",
    title: "آخرین خبرهای فوتبال ساحلی",
    excerpt: "گزارش‌های اختصاصی از لیگ فوتبال ساحلی.",
    publishedAt: "۱۴۰۳/۰۱/۲۲",
    category: "فوتبال ساحلی",
    sport: "beach",
    imageUrl: FALLBACK_IMAGE,
  },
];

type HeroSliderProps = {
  slides: Article[];
  fallbackSlides?: Article[];
};

function filterValidSlides(items: Article[]) {
  return items.filter((slide) => Boolean(slide?.title?.trim()) && Boolean(slide?.imageUrl?.trim()));
}

function mergeSlides(primary: Article[], secondary: Article[]) {
  const seen = new Set<string>();
  const merged: Article[] = [];
  [...primary, ...secondary].forEach((item) => {
    if (!item?.id || seen.has(item.id)) return;
    seen.add(item.id);
    merged.push(item);
  });
  return merged;
}

export function HeroSlider({ slides, fallbackSlides }: HeroSliderProps) {
  const [active, setActive] = useState(0);
  const normalizedSlides = slides.filter((slide) => slide?.id);
  const validSlides = useMemo(() => filterValidSlides(normalizedSlides), [normalizedSlides]);
  const resolvedSlides = useMemo(() => {
    const fromNews = filterValidSlides(fallbackSlides ?? []);
    if (!validSlides.length && !fromNews.length) return LOCAL_FALLBACK_SLIDES;
    const merged = validSlides.length < 3 ? mergeSlides(validSlides, fromNews) : validSlides;
    return merged.slice(0, 6);
  }, [fallbackSlides, validSlides]);
  const slideCount = resolvedSlides.length;

  useEffect(() => {
    if (slideCount <= 1) {
      setActive(0);
      return;
    }
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slideCount);
    }, AUTO_INTERVAL);
    return () => clearInterval(timer);
  }, [slideCount]);

  const goTo = (index: number) => {
    if (!slideCount) return;
    setActive((index + slideCount) % slideCount);
  };

  if (!slideCount) {
    return null;
  }

  return (
    <section className="container">
      <div className="relative min-h-[520px] overflow-hidden rounded-[32px] border border-[var(--border)] bg-white shadow-card md:h-[420px] md:min-h-0">
        {slideCount < 2 ? (
          <div className="h-full">
            <SlideItem slide={resolvedSlides[0]} priority />
          </div>
        ) : (
          <>
            <div
              className="flex h-full transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${active * 100}%)` }}
            >
              {resolvedSlides.map((slide, index) => (
                <SlideItem key={`${slide.id}-${index}`} slide={slide} priority={index === 0} />
              ))}
            </div>
            <div className="absolute inset-x-0 bottom-5 z-10 flex justify-center">
              <div className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow backdrop-blur">
                {resolvedSlides.map((item, index) => (
                  <button
                    key={`${item.id}-${index}`}
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
          </>
        )}
      </div>
    </section>
  );
}

type SlideItemProps = {
  slide: Article;
  priority?: boolean;
};

function SlideItem({ slide, priority }: SlideItemProps) {
  const [imgSrc, setImgSrc] = useState(slide.imageUrl || FALLBACK_IMAGE);
  const formattedDate = useMemo(() => {
    if (!slide.publishedAt) return "";
    try {
      return new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(slide.publishedAt));
    } catch {
      return slide.publishedAt;
    }
  }, [slide.publishedAt]);

  useEffect(() => {
    setImgSrc(slide.imageUrl || FALLBACK_IMAGE);
  }, [slide.imageUrl]);

  return (
    <article className="flex min-w-full flex-col md:h-full md:flex-row" dir="rtl">
      <div className="relative h-64 w-full overflow-hidden md:h-full md:flex-1">
        <Image
          src={imgSrc}
          alt={slide.title}
          fill
          className="object-cover"
          sizes="(min-width: 768px) 55vw, 100vw"
          priority={priority}
          onError={() => setImgSrc(FALLBACK_IMAGE)}
        />
        <div className="absolute inset-0 bg-gradient-to-l from-black/10 via-transparent to-transparent" />
      </div>
      <div
        className="flex w-full flex-col gap-4 border-t border-[var(--border)] bg-gradient-to-r from-[#0f172a]/5 via-white to-white px-6 py-8 text-right md:w-[38%] md:border-t-0 md:border-l"
        dir="rtl"
      >
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-[var(--muted)]">
          <span className="rounded-full bg-brand/10 px-4 py-1 text-brand">{slide.category}</span>
          {formattedDate && <span>{formattedDate}</span>}
        </div>
        <div className="space-y-3 text-[var(--foreground)]">
          <h1
            className="text-2xl font-black leading-tight md:text-3xl"
            style={{ textShadow: "0 2px 8px rgba(0,0,0,0.25)" }}
          >
            {slide.title}
          </h1>
          {slide.excerpt && (
            <p className="text-sm text-[var(--muted)]" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.15)" }}>
              {slide.excerpt}
            </p>
          )}
        </div>
        <Link href={`/news/${slide.slug}`} className="mt-auto inline-flex w-fit items-center rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-brand/90">
          مشاهده خبر کامل
        </Link>
      </div>
    </article>
  );
}
