import { HeroSlider } from "@/components/hero/HeroSlider";
import { LiveResults } from "@/components/matches/LiveResults";
import { LatestNews } from "@/components/news/LatestNews";
import { MatchesSummary } from "@/components/matches/MatchesSummary";
import { LeagueTablePreview } from "@/components/tables/LeagueTablePreview";
import { Footer } from "@/components/layout/Footer";

export function HomePage() {
  return (
    <div className="space-y-12">
      <HeroSlider />
      <LiveResults />
      <MatchesSummary />
      <LeagueTablePreview />
      <LatestNews />
      <Footer />
    </div>
  );
}
