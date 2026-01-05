export const dynamic = "force-dynamic";

import Link from "next/link";
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
      <div className={`space-y-16 lg:space-y-12 ${heroSlides.length >= 3 ? "pt-12 lg:pt-16" : ""}`}>
        <div className="container">
          <div className="grid gap-10 md:grid-cols-[1fr_280px] lg:grid-cols-[1fr_320px] lg:items-start lg:gap-8">
            <div className="min-w-0 flex-1 space-y-12 lg:space-y-8">
              <section className="space-y-6" dir="rtl">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg md:text-2xl lg:text-3xl font-extrabold text-gray-900">آخرین اخبار</h2>
                </div>
                <LatestNews />
              </section>
              {/* Mobile-only sections */}
              <div className="space-y-8 md:hidden">
                <LeagueTablesPreview standings={standingsByLeague} container={false} />
                <MatchesAndResults container={false} />
                <TopScorersPreview container={false} />
              </div>
            </div>
            <aside className="hidden md:block space-y-8 lg:space-y-6">
              <LeagueTablesPreview standings={standingsByLeague} container={false} />
              <MatchesAndResults container={false} />
              <TopScorersPreview container={false} />
              <section className="space-y-6" dir="rtl">
                <h2 className="text-lg font-bold text-slate-900" style={{ color: '#0f172a' }}>کیوسک روزنامه</h2>
              </section>
            </aside>
          </div>
        </div>
        <div className="container space-y-12 lg:space-y-10">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <section className="space-y-6" dir="rtl">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg md:text-2xl lg:text-3xl font-extrabold text-gray-900">گزارش‌ها و یادداشت‌ها</h2>
                </div>
                <section
                  className="rounded-3xl border border-[var(--border)] bg-white shadow-card"
                  dir="rtl"
                >
                  <div className="divide-y divide-[var(--border)]">
                    {reportsAndEditorials.slice(0, 8).map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        className="group flex flex-row-reverse items-center gap-4 p-4 text-gray-900 transition hover:bg-slate-50 sm:gap-6"
                      >
                        <div className="min-w-0 flex-1 space-y-2 text-right">
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                            <span className="rounded-full bg-gray-100 px-3 py-1 font-semibold text-slate-600">
                              {item.category}
                            </span>
                            <span>{item.publishedAt}</span>
                          </div>
                          <h3 className="news-title text-base leading-7">
                            {item.title}
                          </h3>
                          <p className="news-excerpt text-sm leading-6">{item.excerpt}</p>
                        </div>
                        <div className="h-20 w-28 flex-shrink-0 overflow-hidden bg-slate-100 sm:h-24 sm:w-36">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-[var(--border)] p-4">
                    <Link
                      href="/reports"
                      className="flex items-center justify-center rounded-lg border border-[var(--border)] bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-brand hover:bg-brand/5 hover:text-brand"
                    >
                      مشاهده همه گزارش‌ها و یادداشت‌ها
                    </Link>
                  </div>
                </section>
              </section>
            </div>
            <div className="space-y-6">
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
