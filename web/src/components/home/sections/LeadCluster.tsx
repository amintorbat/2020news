import Image from "next/image";
import Link from "next/link";
import type { NewsItem } from "../data/home-data";

type LeadClusterProps = {
  lead: NewsItem;
  spotlight: NewsItem[];
};

export function LeadCluster({ lead, spotlight }: LeadClusterProps) {
  const sideStories = spotlight.slice(0, 3);

  return (
    <section className="grid gap-6 lg:grid-cols-12">
      <article className="relative overflow-hidden rounded-3xl border border-default/70 bg-surface/40 shadow-lg lg:col-span-7">
        <div className="grid gap-6 p-6 lg:grid-cols-[1fr,320px] lg:gap-8">
          <div className="flex flex-col justify-between text-right">
            <div className="space-y-4">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">
                Lead
              </div>
              <Link
                href={lead.href}
                className="text-3xl font-black leading-tight text-foreground hover:text-primary"
              >
                {lead.title}
              </Link>
              {lead.excerpt ? (
                <p className="text-sm leading-7 text-muted">{lead.excerpt}</p>
              ) : null}
            </div>
            <div className="text-xs font-semibold text-muted">
              {lead.time} • {lead.sport === "futsal" ? "فوتسال" : "فوتبال ساحلی"}
            </div>
          </div>

          <div className="relative isolate h-56 rounded-2xl bg-panel lg:h-full">
            <Image
              src={lead.image}
              alt={lead.title}
              fill
              sizes="(min-width: 1024px) 320px, 100vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </article>

      <div className="space-y-4 rounded-3xl border border-default/60 bg-background/40 p-4 lg:col-span-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">خبرهای داغ</h2>
          <span className="text-[11px] uppercase tracking-[0.35em] text-muted">
            Spotlight
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
          {sideStories.map((story) => (
            <article
              key={story.id}
              className="flex flex-row-reverse items-start gap-3 rounded-xl border border-default/40 bg-surface/30 p-3"
            >
              <div className="relative h-20 w-24 overflow-hidden rounded-lg bg-panel">
                <Image
                  src={story.image}
                  alt={story.title}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 text-right">
                <Link
                  href={story.href}
                  className="text-sm font-semibold leading-6 text-foreground hover:text-primary"
                >
                  {story.title}
                </Link>
                <div className="mt-1 text-[11px] font-medium text-muted">
                  {story.time} •{" "}
                  {story.sport === "futsal" ? "فوتسال" : "فوتبال ساحلی"}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
