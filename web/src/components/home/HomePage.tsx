import { homeData } from "./data/home-data";
import { Footer } from "./sections/Footer";
import { LeadCluster } from "./sections/LeadCluster";
import { FocusStrip } from "./sections/FocusStrip";
import { EditorialDesks } from "./sections/EditorialDesks";
import { NewsGrid } from "./sections/NewsGrid";
import { StatsPanel } from "./sections/StatsPanel";
import { LatestFeed } from "./sections/LatestFeed";

export function HomePage() {
  const {
    leadStory,
    spotlightStories,
    editorialFutsal,
    editorialBeach,
    newsGrid,
    focusStrip,
    leagueTableFutsal,
    leagueTableBeach,
    topScorersFutsal,
    topScorersBeach,
    latestNews,
  } = homeData;

  return (
    <>
      <main className="py-12">
        <div className="container space-y-12">
          <LeadCluster lead={leadStory} spotlight={spotlightStories} />

          <FocusStrip items={focusStrip} />

          <section className="grid gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <NewsGrid items={newsGrid} />
            </div>
            <div className="lg:col-span-2">
              <EditorialDesks
                futsal={editorialFutsal}
                beach={editorialBeach}
              />
            </div>
          </section>

          <StatsPanel
            futsalTable={leagueTableFutsal}
            beachTable={leagueTableBeach}
            futsalScorers={topScorersFutsal}
            beachScorers={topScorersBeach}
          />

          <LatestFeed items={latestNews} />
        </div>
      </main>

      <Footer />
    </>
  );
}
