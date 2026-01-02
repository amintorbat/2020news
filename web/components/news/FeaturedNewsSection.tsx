"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Article } from "@/lib/acs/types";

type FeaturedNewsSectionProps = {
  articles: Article[];
};

export function FeaturedNewsSection({ articles }: FeaturedNewsSectionProps) {
  const mainRef = useRef<HTMLAnchorElement>(null);
  const sideContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateHeight = () => {
      if (!mainRef.current || !sideContainerRef.current) return;

      const sideArticles = sideContainerRef.current.children;
      if (sideArticles.length < 3) {
        // If less than 3 articles, use default aspect ratio
        mainRef.current.style.minHeight = "";
        return;
      }

      // Calculate height of ONLY first 3 articles + gaps between them
      let totalHeight = 0;
      for (let i = 0; i < 3; i++) {
        const article = sideArticles[i] as HTMLElement;
        totalHeight += article.offsetHeight;
      }
      
      // Add gap between articles (space-y-4 = gap-4 = 1rem = 16px)
      // Only 2 gaps between 3 articles
      totalHeight += 2 * 16;

      // Set min-height on main slider (only on desktop)
      if (window.innerWidth >= 1024 && totalHeight > 0) {
        mainRef.current.style.minHeight = `${totalHeight}px`;
        mainRef.current.style.maxHeight = `${totalHeight}px`;
      } else {
        mainRef.current.style.minHeight = "";
        mainRef.current.style.maxHeight = "";
      }
    };

    // Initial calculation after a small delay to ensure DOM is ready
    const timer = setTimeout(updateHeight, 150);

    // Update on resize
    window.addEventListener("resize", updateHeight);
    
    // Use ResizeObserver for more accurate updates
    const resizeObserver = new ResizeObserver(() => {
      // Debounce resize observer
      setTimeout(updateHeight, 50);
    });
    
    if (sideContainerRef.current) {
      // Observe each of the first 3 articles
      for (let i = 0; i < Math.min(3, sideContainerRef.current.children.length, 3); i++) {
        resizeObserver.observe(sideContainerRef.current.children[i] as HTMLElement);
      }
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateHeight);
      resizeObserver.disconnect();
    };
  }, [articles]);
  if (articles.length === 0) return null;

  const mainArticle = articles[0];
  const sideArticles = articles.slice(1, 5);

  return (
    <section className="space-y-4" dir="rtl">
      <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">خبرهای برجسته</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {/* Main Featured Article */}
        <Link
          ref={mainRef}
          href={`/news/${mainArticle.slug}`}
          className="group relative aspect-[4/3] overflow-hidden bg-slate-900 md:col-span-2 lg:col-span-3 lg:aspect-auto"
        >
          {mainArticle.imageUrl && (
            <Image
              src={mainArticle.imageUrl}
              alt={mainArticle.title}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover transition-transform group-hover:scale-105"
              style={{ borderRadius: 0 }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-l from-black/90 via-black/70 to-black/30" />
          <div className="relative flex h-full flex-col justify-end p-6 text-right">
            <span className="mb-3 inline-block w-fit rounded-full bg-brand px-2.5 py-1 text-[10px] font-semibold text-white">
              {mainArticle.category}
            </span>
            <h3 className="text-xl font-bold leading-tight sm:text-2xl lg:text-3xl" style={{ color: '#ffffff' }}>
              {mainArticle.title}
            </h3>
            {mainArticle.excerpt && (
              <p className="mt-2.5 line-clamp-2 text-sm font-medium sm:text-base" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
                {mainArticle.excerpt}
              </p>
            )}
          </div>
        </Link>

        {/* Side Articles */}
        <div ref={sideContainerRef} className="space-y-4 md:col-span-2 lg:col-span-2">
          {sideArticles.map((article) => (
            <Link
              key={article.id}
              href={`/news/${article.slug}`}
              className="group flex gap-3 rounded-xl border border-[var(--border)] bg-white p-3 transition hover:border-brand hover:shadow-md"
              dir="rtl"
            >
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden sm:h-24 sm:w-24">
                {article.imageUrl ? (
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    sizes="96px"
                    className="object-cover transition-transform group-hover:scale-105"
                    style={{ borderRadius: 0 }}
                  />
                ) : (
                  <div className="h-full w-full bg-slate-200" />
                )}
              </div>
              <div className="min-w-0 flex-1 overflow-hidden text-right">
                <span className="mb-1 inline-block rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-semibold text-brand">
                  {article.category}
                </span>
                <h4 className="line-clamp-2 text-sm font-bold leading-snug sm:text-base" style={{ color: '#0f172a' }}>
                  {article.title}
                </h4>
                <p className="mt-1 line-clamp-2 text-xs sm:text-sm" style={{ color: '#475569' }}>
                  {article.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

