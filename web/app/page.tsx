export const dynamic = "force-dynamic";

import { HeroSlider } from "@/components/home/HeroSlider";
import { LatestNews } from "@/components/home/LatestNews";
import { ContentSection, type SectionItem } from "@/components/home/ContentSection";
import { LeagueTablesPreview } from "@/components/home/LeagueTablesPreview";
import { TopScorersPreview } from "@/components/home/TopScorersPreview";
import { MatchesAndResults } from "@/components/home/MatchesAndResults";
import { Footer } from "@/components/layout/Footer";
import { getFallbackStandingsPayload } from "@/lib/acs/fallback";
import { heroSlides } from "@/lib/mock/home";
import type { StandingsRow } from "@/lib/acs/types";
import { topScorers, type LeagueKey } from "@/lib/data";

function mapStandings(payload: Awaited<ReturnType<typeof getFallbackStandingsPayload>>): StandingsRow[] {
  return payload.rows.slice(0, 6);
}

const reports = [
  {
    id: 1,
    title: "گزارش ویژه از تمرینات تیم ملی فوتسال پیش از تورنمنت",
    excerpt: "بدنسازی و تاکتیک‌های فشرده، محور برنامه این هفته بود.",
    category: "گزارش",
    publishedAt: "۱ ساعت پیش",
    imageUrl: "https://picsum.photos/seed/report-1/800/500",
    href: "/news/futsal-camp-report",
  },
  {
    id: 2,
    title: "تحلیل فنی بازی دوستانه ساحلی ایران و عمان",
    excerpt: "تعویض‌های هوشمندانه در وقت سوم نتیجه را تغییر داد.",
    category: "گزارش",
    publishedAt: "۲ ساعت پیش",
    imageUrl: "https://picsum.photos/seed/report-2/800/500",
    href: "/news/beach-soccer-oman-friendly",
  },
  {
    id: 3,
    title: "گزارش میدانی از اردوی آمادگی تیم امید فوتسال",
    excerpt: "تمرکز کادر فنی روی بازی‌سازی در میانه زمین بود.",
    category: "گزارش",
    publishedAt: "۳ ساعت پیش",
    imageUrl: "https://picsum.photos/seed/report-3/800/500",
    href: "/news/futsal-youth-camp",
  },
  {
    id: 4,
    title: "پشت صحنه آماده‌سازی زمین ساحلی برای لیگ جدید",
    excerpt: "بهبود زیرساخت‌ها و نورپردازی ورزشگاه ساحلی تکمیل شد.",
    category: "گزارش",
    publishedAt: "۴ ساعت پیش",
    imageUrl: "https://picsum.photos/seed/report-4/800/500",
    href: "/news/beach-stadium-prep",
  },
] satisfies SectionItem[];

const editorials = [
  {
    id: 11,
    title: "یادداشت سردبیری: نسل تازه فوتسال به چه چیزی نیاز دارد؟",
    excerpt: "نگاه بلندمدت به آکادمی‌ها، کلید موفقیت بین‌المللی است.",
    category: "یادداشت",
    publishedAt: "۳۰ دقیقه پیش",
    imageUrl: "https://picsum.photos/seed/editorial-1/800/500",
    href: "/news/editorial-futsal-youth",
  },
  {
    id: 12,
    title: "یادداشت: فوتبال ساحلی و فرصت‌های پنهان برای قهرمانی",
    excerpt: "با سرمایه‌گذاری هوشمندانه می‌توان فاصله‌ها را کم کرد.",
    category: "یادداشت",
    publishedAt: "۱ ساعت پیش",
    imageUrl: "https://picsum.photos/seed/editorial-2/800/500",
    href: "/news/editorial-beach-growth",
  },
  {
    id: 13,
    title: "چرا ثبات کادر فنی در فوتسال اهمیت دارد؟",
    excerpt: "تغییرات پی‌درپی فرصت ساختارمند شدن را از تیم می‌گیرد.",
    category: "یادداشت",
    publishedAt: "۲ ساعت پیش",
    imageUrl: "https://picsum.photos/seed/editorial-3/800/500",
    href: "/news/editorial-futsal-stability",
  },
  {
    id: 14,
    title: "یادداشت: نقش هواداران در موفقیت تیم‌های ساحلی",
    excerpt: "حضور پررنگ تماشاگران، انرژی بازی‌ها را دوچندان می‌کند.",
    category: "یادداشت",
    publishedAt: "۳ ساعت پیش",
    imageUrl: "https://picsum.photos/seed/editorial-4/800/500",
    href: "/news/editorial-beach-fans",
  },
] satisfies SectionItem[];

const reportsAndEditorials: SectionItem[] = [...reports, ...editorials];

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
            </div>
            <aside className="hidden md:block space-y-8 lg:space-y-6">
              <LeagueTablesPreview standings={standingsByLeague} container={false} />
              <MatchesAndResults container={false} />
              <TopScorersPreview scorers={topScorers} container={false} />
              <section className="space-y-6" dir="rtl">
                <h2 className="text-lg font-bold text-slate-900" style={{ color: '#0f172a' }}>کیوسک روزنامه</h2>
              </section>
            </aside>
          </div>
        </div>
        <div className="container space-y-12 lg:space-y-10">
          <ContentSection title="گزارش‌ها و یادداشت‌ها" items={reportsAndEditorials} />
        </div>
        <Footer />
      </div>
    </div>
  );
}
