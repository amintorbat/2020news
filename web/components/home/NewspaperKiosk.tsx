"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export type KioskItem = {
  id: number;
  title: string;
  caption: string;
  imageUrl: string;
  href: string;
};

export const kioskItems: KioskItem[] = [
  {
    id: 1,
    title: "ویژه‌نامه قهرمانی فوتسال",
    caption: "تحلیل کامل بازی‌ها و ستاره‌های هفته",
    imageUrl: "https://picsum.photos/seed/kiosk-1/700/980",
    href: "/news/futsal-special-edition",
  },
  {
    id: 2,
    title: "گزارش ساحلی امروز",
    caption: "بهترین لحظات لیگ ساحلی",
    imageUrl: "https://picsum.photos/seed/kiosk-2/700/980",
    href: "/news/beach-daily-report",
  },
  {
    id: 3,
    title: "هفته‌نامه فوتسال",
    caption: "تحلیل فنی دیدارهای حساس",
    imageUrl: "https://picsum.photos/seed/kiosk-3/700/980",
    href: "/news/futsal-weekly",
  },
  {
    id: 4,
    title: "روزنامه ورزش ساحلی",
    caption: "تمرکز بر ستاره‌های جوان",
    imageUrl: "https://picsum.photos/seed/kiosk-4/700/980",
    href: "/news/beach-sports-frontpage",
  },
  {
    id: 5,
    title: "چشم‌انداز لیگ فوتسال",
    caption: "رتبه‌بندی‌ها و پیش‌بینی هفته آینده",
    imageUrl: "https://picsum.photos/seed/kiosk-5/700/980",
    href: "/news/futsal-league-preview",
  },
];

export function NewspaperKiosk({ items = kioskItems }: { items?: KioskItem[] }) {
  return (
    <section className="space-y-6" dir="rtl">
      <h2 className="text-lg font-bold text-gray-900">کیوسک روزنامه</h2>
      <Swiper
        modules={[Pagination, Keyboard]}
        slidesPerView={1.2}
        spaceBetween={16}
        pagination={{
          clickable: true,
          renderBullet: (index, className) => `<span class="${className}" aria-label="کاور ${index + 1}"></span>`,
        }}
        keyboard={{ enabled: true }}
        breakpoints={{
          640: { slidesPerView: 2.2 },
          1024: { slidesPerView: 4, spaceBetween: 20 },
        }}
        dir="rtl"
        className="w-full [&_.swiper-pagination]:static [&_.swiper-pagination]:mt-4 [&_.swiper-pagination]:text-center [&_.swiper-pagination-bullet]:h-2 [&_.swiper-pagination-bullet]:w-2 [&_.swiper-pagination-bullet]:rounded-full [&_.swiper-pagination-bullet]:bg-slate-300 [&_.swiper-pagination-bullet-active]:w-6 [&_.swiper-pagination-bullet-active]:bg-brand"
      >
        {items.map((item) => (
          <SwiperSlide key={item.id}>
            <Link
              href={item.href}
              className="group flex flex-col overflow-hidden rounded-3xl border border-[var(--border)] bg-white shadow-card transition hover:shadow-lg"
            >
              <div className="relative aspect-[3/4] w-full bg-slate-100">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1024px) 220px, (min-width: 640px) 240px, 80vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="space-y-1 p-3 text-right">
                <h3 className="line-clamp-2 text-sm font-semibold text-slate-900 dark:text-white sm:text-base">
                  {item.title}
                </h3>
                <p className="line-clamp-2 text-xs text-gray-600 sm:text-sm">{item.caption}</p>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
