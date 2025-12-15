import Image from "next/image";
import Link from "next/link";
import type { NewsItem } from "../data/home-data";

type LatestFeedProps = {
  items: NewsItem[];
};

export function LatestFeed({ items }: LatestFeedProps) {
  return (
    <section className="space-y-4 rounded-3xl border border-default/70 bg-background/70 p-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-[11px] tracking-[0.35em] text-muted">Ticker</p>
          <h3 className="text-xl font-bold">آخرین خبرها</h3>
        </div>
        <Link href="/archive" className="text-xs font-semibold text-primary">
          تقویم خبری
        </Link>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <article
            key={item.id}
            className="flex flex-row-reverse gap-3 rounded-2xl border border-default/40 bg-surface/30 p-3"
          >
            <div className="relative h-16 w-20 overflow-hidden rounded-lg bg-panel">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
            <div className="flex-1 text-right">
              <Link
                href={item.href}
                className="text-sm font-semibold leading-6 text-foreground hover:text-primary"
              >
                {item.title}
              </Link>
              <p className="text-xs text-muted">
                {item.time} • {item.sport === "futsal" ? "فوتسال" : "فوتبال ساحلی"}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
