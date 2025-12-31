"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Keyboard, Pagination } from "swiper/modules";
import { heroSlides, type HomeHeroSlide } from "@/lib/mock/home";
import "swiper/css";
import "swiper/css/pagination";

const AUTO_INTERVAL = 7000;

type HeroSliderProps = {
  slides?: HomeHeroSlide[];
};

function filterValidSlides(items: HomeHeroSlide[]) {
  return items.filter(
    (slide) =>
      Boolean(slide?.title?.trim()) &&
      typeof slide?.imageUrl === "string" &&
      slide.imageUrl.trim().length > 0 &&
      slide.imageUrl.startsWith("http")
  );
}

function normalizeSlides(items: HomeHeroSlide[]) {
  return filterValidSlides(items);
}

export function HeroSlider({ slides }: HeroSliderProps) {
  const validSlides = useMemo(() => {
    const source = slides && slides.length >= 5 ? slides : heroSlides;
    return normalizeSlides(source);
  }, [slides]);
  const slideCount = validSlides.length;

  if (slideCount < 3) {
    return null;
  }

  return (
    <section className="w-full -mt-28 mt-0 pt-0" dir="rtl">
      <div className="relative h-[calc(100vh-var(--header-height))] h-[calc(100svh-var(--header-height))] overflow-hidden bg-slate-900 sm:h-[calc(100vh-var(--header-height-desktop))] sm:h-[calc(100svh-var(--header-height-desktop))]">
        <Swiper
          modules={[Autoplay, Pagination, Keyboard]}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: AUTO_INTERVAL, disableOnInteraction: false }}
          pagination={{
            clickable: true,
            renderBullet: (index, className) =>
              `<span class="${className}" aria-label="اسلاید ${index + 1}"></span>`,
          }}
          keyboard={{ enabled: true }}
          className="h-full w-full [&_.swiper-pagination]:bottom-6 [&_.swiper-pagination]:z-20 [&_.swiper-pagination]:text-center [&_.swiper-pagination-bullet]:h-2.5 [&_.swiper-pagination-bullet]:w-2.5 [&_.swiper-pagination-bullet]:rounded-full [&_.swiper-pagination-bullet]:bg-white/40 [&_.swiper-pagination-bullet]:transition-all [&_.swiper-pagination-bullet-active]:w-8 [&_.swiper-pagination-bullet-active]:bg-white"
          dir="rtl"
        >
          {validSlides.map((slide, index) => (
            <SwiperSlide key={`${slide.id}-${index}`} className="h-full">
              <SlideItem slide={slide} priority={index === 0} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

type SlideItemProps = {
  slide: HomeHeroSlide;
  priority?: boolean;
};

function SlideItem({ slide, priority }: SlideItemProps) {
  const hasImage = Boolean(slide.imageUrl?.trim());
  const formattedDate = slide.publishedAt;

  return (
    <article className="relative h-full w-full" dir="rtl">
      {/* Background Image Layer */}
      {hasImage && (
        <div className="absolute inset-0">
          <Image
            src={slide.imageUrl as string}
            alt={slide.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority={priority}
            style={{ borderRadius: 0 }}
          />
          {/* Subtle gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        </div>
      )}

      {/* Text Content Layer */}
      <div className="relative z-10 flex h-full flex-col justify-end bg-gradient-to-t from-black/70 via-black/40 to-transparent px-4 pb-12 text-white sm:px-8 sm:pb-16 md:px-12 md:pb-20">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-4 sm:space-y-5">
            {/* Category and Date */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold sm:text-sm">
              <span className="rounded-full bg-brand/90 px-4 py-1.5 text-white backdrop-blur-sm">
                {slide.category}
              </span>
              {formattedDate && <span className="text-white/90">{formattedDate}</span>}
            </div>

            {/* Title */}
            <h1 className="text-3xl font-black leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
              {slide.title}
            </h1>

            {/* Excerpt */}
            {slide.excerpt && (
              <p className="max-w-2xl text-base leading-relaxed text-white/95 sm:text-lg md:text-xl">
                {slide.excerpt}
              </p>
            )}

            {/* CTA Button */}
            <div className="pt-2">
              <Link
                href={slide.href}
                className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-brand/90 hover:shadow-xl sm:px-8 sm:py-3.5 sm:text-base"
              >
                مشاهده خبر کامل
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
