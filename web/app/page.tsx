export const dynamic = "force-dynamic";

import { HeroSlider } from "@/components/home/HeroSlider";
import { LatestNews } from "@/components/home/LatestNews";
import { LeagueTablesPreview } from "@/components/home/LeagueTablesPreview";
import { TopScorersPreview } from "@/components/home/TopScorersPreview";
import { SchedulePreview } from "@/components/home/SchedulePreview";
import { Footer } from "@/components/layout/Footer";
import { getStandingsContent } from "@/lib/acs/standings";
import { getFallbackStandingsPayload } from "@/lib/acs/fallback";
import { heroSlides } from "@/lib/mock/home";
import type { StandingsRow } from "@/lib/acs/types";
import { topScorers, weeklyMatches, type LeagueKey } from "@/lib/data";

function mapStandings(payload: Awaited<ReturnType<typeof getStandingsContent>>): StandingsRow[] {
  return payload.rows.slice(0, 6);
}

export default async function HomePage() {
  const futsalStandingsPromise = getStandingsContent("futsal").catch(() => getFallbackStandingsPayload("futsal"));
  const beachStandingsPromise = getStandingsContent("beach").catch(() => getFallbackStandingsPayload("beach"));
  const [futsalStandings, beachStandings] = await Promise.all([futsalStandingsPromise, beachStandingsPromise]);

  const standingsByLeague: Record<LeagueKey, StandingsRow[]> = {
    futsal: mapStandings(futsalStandings),
    beach: mapStandings(beachStandings),
  };
  return (
    <div className="space-y-16 lg:space-y-10">
      {heroSlides.length >= 3 && <HeroSlider slides={heroSlides} />}
      <div className="container">
        <div className="flex flex-col gap-16 lg:flex-row lg:items-start lg:gap-6">
          <div className="min-w-0 flex-1 space-y-16 lg:space-y-6">
            <section className="space-y-6" dir="rtl">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">آخرین اخبار</h2>
              </div>
              <LatestNews />
            </section>
          </div>
          <aside className="space-y-16 lg:w-[320px] lg:space-y-6">
            <LeagueTablesPreview standings={standingsByLeague} container={false} />
            <TopScorersPreview scorers={topScorers} container={false} />
            <SchedulePreview schedule={weeklyMatches} container={false} />
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
}
