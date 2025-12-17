export const dynamic = "force-dynamic";

import { HeroSlider } from "@/components/home/HeroSlider";
import { NewsList } from "@/components/home/NewsList";
import { LeagueTablesPreview } from "@/components/home/LeagueTablesPreview";
import { TopScorersPreview } from "@/components/home/TopScorersPreview";
import { SchedulePreview } from "@/components/home/SchedulePreview";
import { Footer } from "@/components/layout/Footer";
import { getHomeContent } from "@/lib/acs/home";
import { getMatchesContent } from "@/lib/acs/matches";
import { getStandingsContent } from "@/lib/acs/standings";
import { getFallbackMatchesPayload, getFallbackStandingsPayload } from "@/lib/acs/fallback";
import type { Match, StandingsRow } from "@/lib/acs/types";
import { topScorers, weeklyMatches, type LeagueKey } from "@/lib/data";

function mapMatches(payload: Awaited<ReturnType<typeof getMatchesContent>>): Match[] {
  return payload.matches.slice(0, 4);
}

function mapStandings(payload: Awaited<ReturnType<typeof getStandingsContent>>): StandingsRow[] {
  return payload.rows.slice(0, 6);
}

export default async function HomePage() {
  const homeContentPromise = getHomeContent();
  const futsalMatchesPromise = getMatchesContent("futsal").catch(() => getFallbackMatchesPayload("futsal"));
  const beachMatchesPromise = getMatchesContent("beach").catch(() => getFallbackMatchesPayload("beach"));
  const futsalStandingsPromise = getStandingsContent("futsal").catch(() => getFallbackStandingsPayload("futsal"));
  const beachStandingsPromise = getStandingsContent("beach").catch(() => getFallbackStandingsPayload("beach"));
  const homeContent = await homeContentPromise;
  const [futsalMatches, beachMatches] = await Promise.all([futsalMatchesPromise, beachMatchesPromise]);
  const [futsalStandings, beachStandings] = await Promise.all([futsalStandingsPromise, beachStandingsPromise]);

  const matchesByLeague: Record<LeagueKey, Match[]> = {
    futsal: mapMatches(futsalMatches),
    beach: mapMatches(beachMatches),
  };

  const standingsByLeague: Record<LeagueKey, StandingsRow[]> = {
    futsal: mapStandings(futsalStandings),
    beach: mapStandings(beachStandings),
  };

  return (
    <div className="space-y-16">
      <HeroSlider slides={homeContent.heroSlides} />
      <NewsList articles={homeContent.latestNews} limit={6} />
      <TopScorersPreview scorers={topScorers} />
      <SchedulePreview schedule={weeklyMatches} />
      <LeagueTablesPreview standings={standingsByLeague} />
      <Footer />
    </div>
  );
}
