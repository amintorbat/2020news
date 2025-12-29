import Image from "next/image";
import Link from "next/link";

type KioskItem = {
  id: number;
  title: string;
  caption: string;
  imageUrl: string;
  href: string;
};

const kioskItems: KioskItem[] = [
  {
    id: 1,
    title: "ویژه‌نامه قهرمانی فوتسال",
    caption: "بررسی تاکتیک‌ها و ستاره‌های هفته",
    imageUrl: "https://picsum.photos/seed/kiosk-1/600/800",
    href: "/news/futsal-special-edition",
  },
  {
    id: 2,
    title: "گزارش ساحلی امروز",
    caption: "بهترین لحظات لیگ ساحلی",
    imageUrl: "https://picsum.photos/seed/kiosk-2/600/800",
    href: "/news/beach-daily-report",
  },
  {
    id: 3,
    title: "هفته‌نامه فوتسال",
    caption: "تحلیل فنی بازی‌های حساس",
    imageUrl: "https://picsum.photos/seed/kiosk-3/600/800",
    href: "/news/futsal-weekly",
  },
  {
    id: 4,
    title: "روزنامه ورزش ساحلی",
    caption: "تمرکز بر ستاره‌های جوان",
    imageUrl: "https://picsum.photos/seed/kiosk-4/600/800",
    href: "/news/beach-sports-frontpage",
  },
];

export function NewspaperKiosk() {
  return (
    <section className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">کیوسک روزنامه</h2>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {kioskItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="group flex flex-col overflow-hidden rounded-3xl border border-[var(--border)] bg-white shadow-card transition hover:shadow-lg"
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                sizes="(min-width: 1024px) 240px, (min-width: 640px) 45vw, 90vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </div>
            <div className="space-y-2 p-4 text-right">
              <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 sm:text-base">{item.title}</h3>
              <p className="line-clamp-2 text-xs text-gray-500 sm:text-sm">{item.caption}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
