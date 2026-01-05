"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Keyboard } from "swiper/modules";
import { heroSlides, type HomeHeroSlide } from "@/lib/mock/home";
import "swiper/css";

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
  const [activeIndex, setActiveIndex] = useState(0);

  if (slideCount < 3) {
    return null;
  }

  return (
    <section className="w-full relative pt-16 md:pt-20 lg:pt-24 mb-12 lg:mb-16" dir="rtl">
      <div className="relative w-full bg-slate-900 overflow-hidden">
        {/* Main Hero Carousel */}
        <div className="relative">
          <Swiper
            modules={[Autoplay, Keyboard]}
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: AUTO_INTERVAL, disableOnInteraction: false }}
            keyboard={{ enabled: true }}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            className="w-full"
            dir="rtl"
          >
            {validSlides.map((slide, index) => (
              <SwiperSlide key={`${slide.id}-${index}`}>
                <SlideItem 
                  slide={slide} 
                  priority={index === 0}
                  isActive={index === activeIndex}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Navigation Preview Carousel */}
        <div className="relative bg-slate-900 border-t border-slate-800">
          <div className="container mx-auto px-4 py-4">
            <Swiper
              modules={[Autoplay]}
              slidesPerView="auto"
              spaceBetween={16}
              autoplay={{ delay: AUTO_INTERVAL, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
              }}
              className="!overflow-visible"
              dir="rtl"
            >
              {validSlides.map((slide, index) => (
                <SwiperSlide key={`preview-${slide.id}-${index}`} className="!w-auto">
                  <PreviewItem 
                    slide={slide} 
                    isActive={index === activeIndex}
                    onClick={() => {
                      // Navigate to slide
                      const swiper = document.querySelector('.swiper') as any;
                      if (swiper?.swiper) {
                        swiper.swiper.slideToLoop(index);
                      }
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}

type SlideItemProps = {
  slide: HomeHeroSlide;
  priority?: boolean;
  isActive?: boolean;
};

function SlideItem({ slide, priority, isActive }: SlideItemProps) {
  const hasImage = Boolean(slide.imageUrl?.trim());

  return (
    <article className="relative w-full bg-slate-900" dir="rtl">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[450px] sm:min-h-[400px] md:min-h-[500px] lg:min-h-[600px]">
          {/* Image - First on Mobile, Left Side on Desktop (RTL) */}
          {hasImage && (
            <Link href={slide.href} className="relative block w-full h-full overflow-hidden group order-1 lg:order-2">
              {/* Image Container with Square Aspect Ratio - More Compact */}
              <div className="relative w-full h-full max-w-[400px] sm:max-w-[450px] md:max-w-[500px] mx-auto" style={{ aspectRatio: '1 / 1' }}>
                <Image
                  src={slide.imageUrl as string}
                  alt={slide.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 400px, (max-width: 768px) 450px, (max-width: 1024px) 500px, 500px"
                  quality={100}
                  priority={priority}
                  style={{ borderRadius: 0 }}
                />
              </div>
            </Link>
          )}

          {/* Text Content - Second on Mobile, Right Side on Desktop (RTL) */}
          <div className={`flex flex-col justify-center px-4 py-8 sm:px-6 sm:py-10 md:px-12 md:py-16 lg:px-16 lg:py-20 bg-slate-900 transition-opacity duration-500 order-2 lg:order-1 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
            <div className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8 max-w-2xl">
              {/* Roofline (Category Badge) */}
              <div>
                <span className="inline-block text-xs font-semibold text-brand uppercase tracking-wider sm:text-sm">
                  {slide.category}
                </span>
              </div>

              {/* Title */}
              <Link href={slide.href} className="block group">
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold leading-loose text-white group-hover:text-brand transition-colors">
                  {slide.title}
                </h1>
              </Link>

              {/* Description */}
              {slide.excerpt && (
                <p className="text-sm text-slate-300 leading-relaxed sm:text-base md:text-lg lg:text-xl line-clamp-2 sm:line-clamp-3 md:line-clamp-none">
                  {slide.excerpt}
                </p>
              )}

              {/* CTA Button */}
              <div className="pt-3 sm:pt-4 md:pt-6">
                <Link
                  href={slide.href}
                  className="inline-flex items-center gap-2 bg-white text-slate-900 px-4 py-2.5 text-xs font-semibold transition hover:bg-slate-100 sm:px-6 sm:py-3 sm:text-sm md:px-8 md:py-3.5 md:text-base lg:px-10 lg:py-4"
                  style={{ color: '#0f172a' }}
                >
                  <span style={{ color: '#0f172a' }}>مشاهده خبر کامل</span>
                  <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#0f172a' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

type PreviewItemProps = {
  slide: HomeHeroSlide;
  isActive?: boolean;
  onClick?: () => void;
};

function PreviewItem({ slide, isActive, onClick }: PreviewItemProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isActive) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + (100 / (AUTO_INTERVAL / 100));
        });
      }, 100);
      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [isActive]);

  return (
    <button
      onClick={onClick}
      className={`relative text-right w-full max-w-[280px] px-4 py-3 transition-all duration-300 ${
        isActive 
          ? 'bg-slate-800 text-white' 
          : 'bg-transparent text-slate-400 hover:text-white hover:bg-slate-800/50'
      }`}
      aria-label={slide.title}
    >
      {/* Progress Bar */}
      {isActive && (
        <div className="absolute bottom-0 right-0 left-0 h-0.5 bg-brand">
          <div 
            className="h-full bg-brand transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Roofline */}
      <div className="text-xs font-medium text-slate-400 mb-1">
        {slide.category}
      </div>

      {/* Title */}
      <div className="text-sm font-semibold line-clamp-2 leading-snug">
        {slide.title}
      </div>
    </button>
  );
}
