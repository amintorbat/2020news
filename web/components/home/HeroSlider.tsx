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
    <section className="w-full relative pt-0 mb-12 lg:mb-16" dir="rtl">
      <div className="relative h-[calc(100vh-var(--header-height))] h-[calc(100svh-var(--header-height))] overflow-hidden bg-slate-900 sm:h-[60vh] sm:min-h-[400px] md:h-[calc(100vh-var(--header-height-desktop))] md:h-[calc(100svh-var(--header-height-desktop))]">
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
          className="h-full w-full [&_.swiper-pagination]:bottom-3 [&_.swiper-pagination]:z-20 [&_.swiper-pagination]:text-center [&_.swiper-pagination-bullet]:h-2.5 [&_.swiper-pagination-bullet]:w-2.5 [&_.swiper-pagination-bullet]:rounded-full [&_.swiper-pagination-bullet]:bg-white/40 [&_.swiper-pagination-bullet]:transition-all [&_.swiper-pagination-bullet-active]:w-8 [&_.swiper-pagination-bullet-active]:bg-white sm:[&_.swiper-pagination]:bottom-4"
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
      <div className="relative z-10 flex h-full flex-col justify-end bg-gradient-to-t from-black/70 via-black/40 to-transparent px-4 pb-12 text-white sm:px-6 sm:pb-20 sm:justify-end md:px-12 md:pb-28 md:justify-end">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4 md:space-y-5">
            {/* Title */}
            <h1 className="line-clamp-2 text-xl font-black leading-relaxed text-white drop-shadow-lg sm:text-2xl sm:leading-relaxed md:text-3xl md:leading-relaxed lg:text-4xl lg:leading-relaxed">
              {slide.title}
            </h1>

            {/* CTA Button */}
            <div className="pt-1 sm:pt-2 md:pt-3">
              <Link
                href={slide.href}
                className="group inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white shadow-lg transition hover:bg-brand/90 hover:shadow-xl sm:px-5 sm:py-2.5 sm:text-xs md:px-8 md:py-3.5 md:text-base"
              >
                مشاهده خبر کامل
                <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
