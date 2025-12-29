import Image from "next/image";
import Link from "next/link";

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
      <h2 className="text-lg font-bold text-gray-900">کیوسک روزنامه</h2>
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain touch-pan-x pb-2 pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="group min-w-[220px] flex-1 snap-start overflow-hidden rounded-3xl border border-[var(--border)] bg-white shadow-card transition hover:shadow-lg sm:min-w-[240px]"
          >
            <div className="relative aspect-[3/4] w-full bg-slate-100">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                sizes="(min-width: 1024px) 220px, (min-width: 640px) 240px, 80vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
            <div className="space-y-1 p-3 text-right">
              <h3 className="line-clamp-2 text-sm font-semibold text-slate-900 sm:text-base">{item.title}</h3>
              <p className="text-xs text-slate-600 sm:text-sm">{item.date}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
