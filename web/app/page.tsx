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

  return (
    <div className="space-y-16">
      <HeroSlider slides={homeContent.heroSlides} fallbackSlides={homeContent.latestNews} />
      <NewsList articles={homeContent.latestNews} limit={6} />
      <TopScorersPreview scorers={topScorers} />
      <SchedulePreview schedule={weeklyMatches} />
      <LeagueTablesPreview standings={standingsByLeague} />
      <Footer />
    </div>
  );
}
