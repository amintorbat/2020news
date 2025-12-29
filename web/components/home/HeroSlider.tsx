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
    <section className="container">
      <div className="relative min-h-[520px] overflow-hidden rounded-[32px] border border-[var(--border)] bg-white shadow-card md:h-[420px] md:min-h-0">
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
          className="h-full w-full [&_.swiper-pagination]:bottom-5 [&_.swiper-pagination]:text-center [&_.swiper-pagination-bullet]:h-2 [&_.swiper-pagination-bullet]:w-2 [&_.swiper-pagination-bullet]:rounded-full [&_.swiper-pagination-bullet]:bg-slate-300 [&_.swiper-pagination-bullet-active]:w-6 [&_.swiper-pagination-bullet-active]:bg-brand"
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
    <article className={`flex min-w-full flex-col ${hasImage ? "md:h-full md:flex-row" : "md:h-full"}`} dir="rtl">
      {hasImage ? (
        <div className="relative order-1 h-64 w-full overflow-hidden md:order-2 md:h-full md:flex-1">
          <Image
            src={slide.imageUrl as string}
            alt={slide.title}
            fill
            className="object-cover"
            sizes="(min-width: 768px) 55vw, 100vw"
            priority={priority}
          />
          <div className="absolute inset-0 bg-gradient-to-l from-black/10 via-transparent to-transparent" />
        </div>
      ) : null}
      <div
        className={
          hasImage
            ? "order-2 flex w-full flex-col gap-4 border-t border-[var(--border)] bg-gradient-to-r from-[#0f172a]/5 via-white to-white px-6 py-8 text-right md:order-1 md:w-[38%] md:border-t-0 md:border-l"
            : "flex h-full w-full flex-col justify-center gap-4 px-6 py-10 text-right md:px-14"
        }
        dir="rtl"
      >
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-gray-500">
          <span className="rounded-full bg-brand/10 px-4 py-1 text-brand">{slide.category}</span>
          {formattedDate && <span className="text-gray-500">{formattedDate}</span>}
        </div>
        <div className="space-y-3">
          <h1 className="text-2xl font-black leading-tight text-slate-900 md:text-3xl">{slide.title}</h1>
          {slide.excerpt && <p className="text-sm text-gray-600">{slide.excerpt}</p>}
        </div>
        <Link
          href={slide.href}
          className="mt-auto inline-flex w-fit items-center rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-brand/90"
        >
          مشاهده خبر کامل
        </Link>
      </div>
    </article>
  );
}
