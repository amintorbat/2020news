import Image from "next/image";
import Link from "next/link";
import type { NewsItem } from "../data/home-data";

type FocusStripProps = {
  items: NewsItem[];
};

export function FocusStrip({ items }: FocusStripProps) {
  return (
    <section className="space-y-4 rounded-3xl border border-default/60 bg-surface/30 p-4">
      <header className="flex items-center justify-between">
        <h3 className="text-lg font-bold">نوار ویژه</h3>
        <span className="text-[11px] tracking-[0.35em] text-muted">
          Carousel
        </span>
      </header>
      <div className="flex gap-4 overflow-x-auto scroll-smooth pb-2 pr-1 snap-x snap-mandatory">
        {items.map((item) => (
          <article
            key={item.id}
            className="snap-start min-w-[240px] max-w-[240px] rounded-2xl border border-default/40 bg-background/70 p-3"
          >
            <div className="relative mb-3 h-32 overflow-hidden rounded-xl">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="240px"
                className="object-cover"
              />
            </div>
            <Link
              href={item.href}
              className="text-sm font-bold leading-6 text-foreground hover:text-primary"
            >
              {item.title}
            </Link>
            <div className="mt-2 text-[11px] text-muted">
              {item.time} • {item.sport === "futsal" ? "فوتسال" : "فوتبال ساحلی"}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
