import { PageHero } from "@/components/common/PageHero";
import { Footer } from "@/components/layout/Footer";

export default function PodcastPage() {
  return (
    <div className="space-y-10">
      <PageHero
        eyebrow="پادکست"
        title="رادیو ویژه فوتسال"
        subtitle="تحلیل هفتگی لیگ، گفتگو با مربیان و پشت صحنه اردوهای ملی"
      />

      <section className="container rounded-3xl border border-white/10 bg-[#050f23] p-8 text-right text-sm leading-7 text-white/70">
        <p>فصل جدید پادکست ۲۰۲۰نیوز در حال آماده‌سازی است. به زودی زمان‌بندی انتشار و پلتفرم‌های شنیداری معرفی خواهد شد.</p>
      </section>

      <Footer />
    </div>
  );
}
