import { PageHero } from "@/components/common/PageHero";
import { Footer } from "@/components/layout/Footer";
import { LiveResults } from "@/components/matches/LiveResults";
import { MatchesSummary } from "@/components/matches/MatchesSummary";

export default function MatchesPage() {
  return (
    <div className="space-y-10">
      <PageHero
        eyebrow="نتایج"
        title="بازی‌ها و نتایج"
        subtitle="جدیدترین نتایج زنده، برنامه هفتگی و گزارش‌های تاکتیکی فوتسال و فوتبال ساحلی"
      />

      <LiveResults />
      <MatchesSummary />

      <Footer />
    </div>
  );
}
