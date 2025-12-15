import Image from "next/image";
import Link from "next/link";
import type { NewsItem } from "../data/home-data";

type NewsGridProps = {
  items: NewsItem[];
};

export function NewsGrid({ items }: NewsGridProps) {
  return (
    <section className="space-y-5 rounded-3xl border border-default/70 bg-background/60 p-6">
      <header className="flex items-center justify-between">
        <h3 className="text-xl font-bold">ویترین خبری</h3>
        <span className="text-[11px] tracking-[0.35em] text-muted">
          GRID
        </span>
      </header>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.id}
            className="flex flex-col rounded-2xl border border-default/40 bg-surface/30 transition hover:border-primary/60"
          >
            <div className="relative h-40 overflow-hidden rounded-b-3xl rounded-t-2xl">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(min-width: 1024px) 240px, 100vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col gap-3 p-4 text-right">
              <Link
                href={item.href}
                className="text-base font-bold leading-7 text-foreground hover:text-primary"
              >
                {item.title}
              </Link>
              <p className="text-xs font-semibold text-muted">
                {item.time} • {item.sport === "futsal" ? "فوتسال" : "فوتبال ساحلی"}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
