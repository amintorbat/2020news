import { PageHero } from "@/components/common/PageHero";
import { Footer } from "@/components/layout/Footer";
import { LeagueTable } from "@/components/tables/LeagueTable";
import { leagueTables } from "@/data/content";

export default function LeagueTablePage() {
  return (
    <div className="space-y-10">
      <PageHero
        eyebrow="جدول لیگ"
        title="وضعیت کامل لیگ‌ها"
        subtitle="جدول لحظه‌ای لیگ برتر فوتسال و لیگ برتر فوتبال ساحلی با نمایش بازی‌ها، برد و امتیازات"
      />

      <section className="container grid gap-6 lg:grid-cols-2" aria-label="جدول لیگ ها">
        <LeagueTable title="لیگ برتر فوتسال" rows={leagueTables.futsal} />
        <LeagueTable title="لیگ برتر فوتبال ساحلی" rows={leagueTables.beach} />
      </section>

      <Footer />
    </div>
  );
}
