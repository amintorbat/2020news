import { HeroSlider } from "@/components/home/HeroSlider";
import { LiveScores } from "@/components/home/LiveScores";
import { MatchesTabs } from "@/components/home/MatchesTabs";
import { NewsList } from "@/components/home/NewsList";
import { LeagueTablesPreview } from "@/components/home/LeagueTablesPreview";
import { Footer } from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <div className="space-y-16">
      <HeroSlider />
      <LiveScores />
      <MatchesTabs />
      <NewsList />
      <LeagueTablesPreview />
      <Footer />
    </div>
  );
}
