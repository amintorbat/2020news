"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export type KioskItem = {
  id: number;
  title: string;
  date: string;
  imageUrl: string;
  href: string;
};

export const kioskItems: KioskItem[] = [
  {
    id: 1,
    title: "ویژه‌نامه قهرمانی فوتسال",
    date: "سه‌شنبه ۲۳ آبان",
    imageUrl: "https://picsum.photos/seed/kiosk-1/700/980",
    href: "/news/futsal-special-edition",
  },
  {
    id: 2,
    title: "گزارش ساحلی امروز",
    date: "چهارشنبه ۲۴ آبان",
    imageUrl: "https://picsum.photos/seed/kiosk-2/700/980",
    href: "/news/beach-daily-report",
  },
  {
    id: 3,
    title: "هفته‌نامه فوتسال",
    date: "پنج‌شنبه ۲۵ آبان",
    imageUrl: "https://picsum.photos/seed/kiosk-3/700/980",
    href: "/news/futsal-weekly",
  },
  {
    id: 4,
    title: "روزنامه ورزش ساحلی",
    date: "جمعه ۲۶ آبان",
    imageUrl: "https://picsum.photos/seed/kiosk-4/700/980",
    href: "/news/beach-sports-frontpage",
  },
  {
    id: 5,
    title: "چشم‌انداز لیگ فوتسال",
    date: "شنبه ۲۷ آبان",
    imageUrl: "https://picsum.photos/seed/kiosk-5/700/980",
    href: "/news/futsal-league-preview",
  },
];

export function NewspaperKiosk({ items = kioskItems }: { items?: KioskItem[] }) {
  return (
    <section className="space-y-6" dir="rtl">
      <h2 className="text-lg font-bold text-slate-900">کیوسک روزنامه</h2>
      <div className="relative">
        <Swiper
          modules={[Pagination, Autoplay]}
          centeredSlides
          slidesPerView={1.1}
          spaceBetween={18}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true }}
          breakpoints={{
            640: { slidesPerView: 1.4, spaceBetween: 20 },
            1024: { slidesPerView: 2.1, spaceBetween: 24 },
          }}
          className="newspaper-swiper overflow-visible px-2 [&_.swiper-slide]:scale-95 [&_.swiper-slide]:opacity-70 [&_.swiper-slide]:transition-all [&_.swiper-slide]:duration-300 [&_.swiper-slide-active]:scale-100 [&_.swiper-slide-active]:opacity-100 [&_.swiper-pagination]:static [&_.swiper-pagination]:mt-4 [&_.swiper-pagination]:text-center [&_.swiper-pagination-bullet]:h-2 [&_.swiper-pagination-bullet]:w-2 [&_.swiper-pagination-bullet]:rounded-full [&_.swiper-pagination-bullet]:bg-slate-300 [&_.swiper-pagination-bullet-active]:w-6 [&_.swiper-pagination-bullet-active]:bg-slate-700"
        >
          {items.map((item) => (
            <SwiperSlide key={item.id} className="!w-[220px] sm:!w-[240px] lg:!w-[240px]">
              <Link
                href={item.href}
                className="group relative flex overflow-hidden border border-[var(--border)] bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="relative aspect-[3/4] w-full bg-slate-100">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 220px, (min-width: 640px) 240px, 80vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    style={{ borderRadius: 0 }}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white/90 via-white/70 to-transparent p-3 text-right">
                    <h3 className="news-title line-clamp-2 text-sm sm:text-base">{item.title}</h3>
                    <p className="news-excerpt text-xs sm:text-sm">{item.date}</p>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
