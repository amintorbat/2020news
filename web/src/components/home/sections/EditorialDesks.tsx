import Image from "next/image";
import Link from "next/link";
import type { NewsItem } from "../data/home-data";

type DeskProps = {
  title: string;
  href: string;
  items: NewsItem[];
};

function Desk({ title, href, items }: DeskProps) {
  return (
    <div className="rounded-2xl border border-default/60 bg-background/60 p-5">
      <header className="mb-4 flex items-center justify-between">
        <div className="space-y-1 text-right">
          <p className="text-[11px] tracking-[0.35em] text-muted">Desk</p>
          <h3 className="text-lg font-bold">{title}</h3>
        </div>
        <Link
          href={href}
          className="text-xs font-semibold text-primary hover:underline"
        >
          آرشیو
        </Link>
      </header>
      <div className="grid gap-3">
        {items.map((item) => (
          <article
            key={item.id}
            className="grid grid-cols-[96px,1fr] gap-3 rounded-xl border border-default/40 bg-surface/30 p-2"
          >
            <div className="relative h-20 overflow-hidden rounded-lg bg-panel">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col text-right">
              <Link
                href={item.href}
                className="text-sm font-semibold leading-6 text-foreground hover:text-primary"
              >
                {item.title}
              </Link>
              <span className="text-xs text-muted">{item.time}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

type EditorialDesksProps = {
  futsal: NewsItem[];
  beach: NewsItem[];
};

export function EditorialDesks({ futsal, beach }: EditorialDesksProps) {
  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <Desk title="فوتسال ایران" href="/futsal" items={futsal} />
      <Desk title="فوتبال ساحلی" href="/beach" items={beach} />
    </section>
  );
}
