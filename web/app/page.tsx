export const dynamic = "force-dynamic";

import { HeroSlider } from "@/components/home/HeroSlider";
import { NewsList } from "@/components/home/NewsList";
import { LeagueTablesPreview } from "@/components/home/LeagueTablesPreview";
import { TopScorersPreview } from "@/components/home/TopScorersPreview";
import { SchedulePreview } from "@/components/home/SchedulePreview";
import { Footer } from "@/components/layout/Footer";
import { getHomeContent } from "@/lib/acs/home";
import { getStandingsContent } from "@/lib/acs/standings";
import { getFallbackStandingsPayload } from "@/lib/acs/fallback";
import type { StandingsRow } from "@/lib/acs/types";
import { topScorers, weeklyMatches, type LeagueKey } from "@/lib/data";

function mapStandings(payload: Awaited<ReturnType<typeof getStandingsContent>>): StandingsRow[] {
  return payload.rows.slice(0, 6);
}

export default async function HomePage() {
  const homeContentPromise = getHomeContent();
  const futsalStandingsPromise = getStandingsContent("futsal").catch(() => getFallbackStandingsPayload("futsal"));
  const beachStandingsPromise = getStandingsContent("beach").catch(() => getFallbackStandingsPayload("beach"));
  const homeContent = await homeContentPromise;
  const [futsalStandings, beachStandings] = await Promise.all([futsalStandingsPromise, beachStandingsPromise]);

  const standingsByLeague: Record<LeagueKey, StandingsRow[]> = {
    futsal: mapStandings(futsalStandings),
    beach: mapStandings(beachStandings),
  };
  // EN: Only keep slider items with real images to avoid blank slides.
  // FA: فقط آیتم‌هایی با تصویر واقعی را برای اسلایدر نگه می‌داریم تا اسلاید خالی ساخته نشود.
  const sliderItems = homeContent.heroSlides.filter((item) => Boolean(item.imageUrl && item.imageUrl.trim()));
  const heroFallback = homeContent.heroSlides[0] ?? homeContent.latestNews[0] ?? null;

  return (
    <div className="space-y-16 lg:space-y-10">
      {/* EN: Render slider only when it has enough valid items; otherwise show a static hero without images. */}
      {/* FA: اسلایدر فقط وقتی حداقل دو آیتم معتبر دارد نمایش داده می‌شود؛ در غیر این‌صورت یک هدر ساده بدون تصویر نشان می‌دهیم. */}
      {sliderItems.length >= 2 ? (
        <HeroSlider slides={sliderItems} fallbackSlides={homeContent.latestNews} />
      ) : heroFallback ? (
        <section className="container">
          <div className="rounded-[32px] border border-[var(--border)] bg-white px-6 py-10 shadow-card md:px-12">
            <article className="flex flex-col gap-4 text-right" dir="rtl">
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-[var(--muted)]">
                <span className="rounded-full bg-brand/10 px-4 py-1 text-brand">{heroFallback.category}</span>
                {heroFallback.publishedAt && <span>{heroFallback.publishedAt}</span>}
              </div>
              <div className="space-y-3 text-[var(--foreground)]">
                <h1 className="text-2xl font-black leading-tight md:text-3xl">{heroFallback.title}</h1>
                {heroFallback.excerpt && <p className="text-sm text-[var(--muted)]">{heroFallback.excerpt}</p>}
              </div>
            </article>
          </div>
        </section>
      ) : null}
      <div className="container">
        <div className="flex flex-col gap-16 lg:flex-row lg:items-start lg:gap-6">
          <div className="min-w-0 flex-1 space-y-16 lg:space-y-6">
            <NewsList articles={homeContent.latestNews} limit={6} compact container={false} />
          </div>
          <aside className="space-y-16 lg:w-[320px] lg:space-y-6">
            <TopScorersPreview scorers={topScorers} container={false} />
            <SchedulePreview schedule={weeklyMatches} container={false} />
            <LeagueTablesPreview standings={standingsByLeague} container={false} />
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
}
