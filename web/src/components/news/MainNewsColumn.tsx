"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

type NewsItem = {
  id: number;
  title: string;
  excerpt: string;
  time: string;
  image: string;
  href: string;
};

const mainNewsItems: NewsItem[] = [
  {
    id: 1,
    title: "پیروزی پرگل تیم ملی فوتسال برابر عراق در تورنمنت تاشکند",
    excerpt:
      "شاگردان وحید شمسایی در دومین دیدار خود موفق شدند با ارائه یک بازی تهاجمی و منسجم، حریف سنتی خود را در هم بکوبند و صدر جدول را حفظ کنند.",
    time: "۱۵ دقیقه پیش",
    image:
      "https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?auto=format&fit=crop&w=600&q=80",
    href: "/news/1",
  },
  {
    id: 2,
    title: "لغو تمرینات تیم فوتبال ساحلی به دلیل هشدار هواشناسی در بوشهر",
    excerpt:
      "تیم ملی فوتبال ساحلی تمرین عصر امروز خود را به دلیل طوفان شن لغو کرد و قرار است جلسه فنی در هتل محل اقامت برگزار شود.",
    time: "۳۰ دقیقه پیش",
    image:
      "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=600&q=80",
    href: "/news/2",
  },
  {
    id: 3,
    title: "سرمربی اسپانیایی گیتی‌پسند: آماده دفاع از عنوان قهرمانی هستیم",
    excerpt:
      "خوان آنتونیو در گفتگو با ۲۰۲۰نیوز از برنامه‌های تاکتیکی تیمش برای شروع لیگ برتر فوتسال پرده برداشت و وعده یک تیم جوان و هجومی را داد.",
    time: "۴۵ دقیقه پیش",
    image:
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=600&q=80",
    href: "/news/3",
  },
  {
    id: 4,
    title: "اعلام لیست اولیه تیم ملی امید فوتسال برای تورنمنت قزاقستان",
    excerpt:
      "کادر فنی امروز صبح نام ۲۴ بازیکن را منتشر کرد که از این میان ۱۴ نفر راهی اردوی نهایی می‌شوند و شانس حضور در رقابت‌های آسیایی را خواهند داشت.",
    time: "۱ ساعت پیش",
    image:
      "https://images.unsplash.com/photo-1474504384317-3220d5143005?auto=format&fit=crop&w=600&q=80",
    href: "/news/4",
  },
  {
    id: 5,
    title: "وضعیت مصدومیت کاپیتان تیم ملی فوتبال ساحلی رو به بهبود است",
    excerpt:
      "پزشک تیم ملی اعلام کرد ضرب‌دیدگی قوزک پای علی نادری جدی نیست و او تا پایان هفته به تمرینات گروهی بازمی‌گردد.",
    time: "۲ ساعت پیش",
    image:
      "https://images.unsplash.com/photo-1505764706515-aa95265c5abc?auto=format&fit=crop&w=600&q=80",
    href: "/news/5",
  },
];

const excerptClamp: CSSProperties = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  overflow: "hidden",
};

export function MainNewsColumn() {
  return (
    <section aria-label="ستون اصلی اخبار" dir="rtl" className="space-y-6">
      <header className="flex items-center justify-between border-b border-default pb-4">
        <h2 className="text-xl font-bold">اخبار اصلی</h2>
        <Link
          href="/news"
          className="text-xs font-medium text-primary hover:underline"
        >
          مشاهده همه
        </Link>
      </header>

      <div className="divide-y divide-default">
        {mainNewsItems.map((item) => (
          <article
            key={item.id}
            className="flex flex-row-reverse items-start gap-4 py-5"
          >
            <figure className="relative h-24 w-36 shrink-0 overflow-hidden rounded-sm bg-muted/10">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(min-width: 768px) 144px, 33vw"
                className="object-cover"
              />
            </figure>

            <div className="flex-1 text-right">
              <Link
                href={item.href}
                className="font-bold leading-7 text-foreground hover:text-primary"
              >
                {item.title}
              </Link>

              <p
                className="mt-1 text-sm leading-6 text-muted"
                style={excerptClamp}
              >
                {item.excerpt}
              </p>

              <div className="mt-2 text-xs font-medium text-muted">
                {item.time}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
