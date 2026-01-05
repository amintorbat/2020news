export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { HeroSlider } from "@/components/home/HeroSlider";
import { LatestNews } from "@/components/home/LatestNews";
import { ContentSection, type SectionItem } from "@/components/home/ContentSection";
import { LeagueTablesPreview } from "@/components/home/LeagueTablesPreview";
import { TopScorersPreview } from "@/components/home/TopScorersPreview";
import { MatchesAndResults } from "@/components/home/MatchesAndResults";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { VideosPreview } from "@/components/home/VideosPreview";
import { Footer } from "@/components/layout/Footer";
import { getFallbackStandingsPayload } from "@/lib/acs/fallback";
import { heroSlides } from "@/lib/mock/home";
import type { StandingsRow } from "@/lib/acs/types";
import type { LeagueKey } from "@/lib/data";
import { allReportsAndEditorials } from "@/lib/data/reports";

const reportsAndEditorials = allReportsAndEditorials.slice(0, 8);

function mapStandings(payload: Awaited<ReturnType<typeof getFallbackStandingsPayload>>): StandingsRow[] {
  return payload.rows.slice(0, 6);
}

export default async function HomePage() {
  const [futsalStandings, beachStandings] = await Promise.all([
    getFallbackStandingsPayload("futsal"),
    getFallbackStandingsPayload("beach"),
  ]);

  const standingsByLeague: Record<LeagueKey, StandingsRow[]> = {
    futsal: mapStandings(futsalStandings),
    beach: mapStandings(beachStandings),
  };
  return (
    <div className="overflow-x-hidden">
      {heroSlides.length >= 3 && (
        <div className="-mt-28 sm:-mt-[4.5rem]">
          <HeroSlider slides={heroSlides} />
        </div>
      )}
      <div className={`space-y-12 sm:space-y-14 md:space-y-16 lg:space-y-12 ${heroSlides.length >= 3 ? "pt-8 sm:pt-10 md:pt-12 lg:pt-16" : ""}`}>
        <div className="container px-4 sm:px-6">
          <div className="grid gap-8 sm:gap-10 md:grid-cols-[1fr_260px] lg:grid-cols-[1fr_320px] lg:items-start lg:gap-8">
            <div className="min-w-0 flex-1 space-y-10 sm:space-y-12 lg:space-y-8">
              <section className="space-y-4 sm:space-y-6" dir="rtl">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold text-gray-900">آخرین اخبار</h2>
                </div>
                <LatestNews />
              </section>
              {/* Mobile and landscape mobile only sections */}
              <div className="space-y-6 sm:space-y-8 md:hidden">
                <LeagueTablesPreview standings={standingsByLeague} container={false} />
                <MatchesAndResults container={false} />
                <TopScorersPreview container={false} />
              </div>
            </div>
            <aside className="hidden md:block space-y-6 lg:space-y-6">
              <LeagueTablesPreview standings={standingsByLeague} container={false} />
              <MatchesAndResults container={false} />
              <TopScorersPreview container={false} />
              <section className="space-y-6" dir="rtl">
                <h2 className="text-lg font-bold text-slate-900" style={{ color: '#0f172a' }}>کیوسک روزنامه</h2>
              </section>
            </aside>
          </div>
        </div>
        <div className="container px-3 sm:px-4 md:px-6 space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-10">
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:gap-6">
            <div className="w-full min-w-0">
              <section className="space-y-3 sm:space-y-4 md:space-y-6" dir="rtl">
                <div className="flex items-center justify-between">
                  <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-extrabold text-gray-900">گزارش‌ها و یادداشت‌ها</h2>
                </div>
                <section
                  className="rounded-xl sm:rounded-2xl md:rounded-3xl border border-[var(--border)] bg-white shadow-card overflow-hidden"
                  dir="rtl"
                >
                  <div className="divide-y divide-[var(--border)]">
                    {reportsAndEditorials.slice(0, 8).map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        className="group flex flex-row-reverse items-center gap-2.5 p-2.5 text-gray-900 transition hover:bg-slate-50 sm:gap-3 sm:p-3 md:gap-4 md:p-4 lg:gap-6"
                      >
                        <div className="min-w-0 flex-1 space-y-1 sm:space-y-1.5 md:space-y-2 text-right">
                          <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 md:gap-2 text-[10px] sm:text-[11px] md:text-xs text-slate-400">
                            <span className="rounded-full bg-gray-100 px-1.5 py-0.5 sm:px-2 sm:py-0.5 md:px-3 md:py-1 text-[9px] sm:text-[10px] md:text-xs font-semibold text-slate-600">
                              {item.category}
                            </span>
                            <span className="text-[10px] sm:text-[11px] md:text-xs">{item.publishedAt}</span>
                          </div>
                          <h3 className="news-title text-xs sm:text-sm md:text-base leading-5 sm:leading-6 md:leading-7 line-clamp-2">
                            {item.title}
                          </h3>
                          <p className="news-excerpt text-[10px] sm:text-xs md:text-sm leading-4 sm:leading-5 md:leading-6 line-clamp-2">{item.excerpt}</p>
                        </div>
                        <div className="relative w-16 flex-shrink-0 overflow-hidden rounded bg-slate-100 aspect-[4/3] sm:w-20 md:w-28 lg:w-36">
                          <Image
                            src={item.imageUrl}
                            alt={item.title}
                            fill
                            sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, (max-width: 1024px) 112px, 144px"
                            className="object-cover"
                            loading="lazy"
                            quality={85}
                          />
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-[var(--border)] p-2.5 sm:p-3 md:p-4">
                    <Link
                      href="/reports"
                      className="flex items-center justify-center rounded-lg border border-[var(--border)] bg-white px-2.5 py-1.5 text-[10px] sm:text-xs md:text-sm font-semibold text-slate-700 transition hover:border-brand hover:bg-brand/5 hover:text-brand sm:px-3 sm:py-2 md:px-4 md:py-2.5"
                    >
                      مشاهده همه گزارش‌ها و یادداشت‌ها
                    </Link>
                  </div>
                </section>
              </section>
            </div>
            <div className="w-full min-w-0 space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-6">
              <GalleryPreview container={false} />
              <VideosPreview container={false} />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
