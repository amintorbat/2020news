import { PageHero } from "@/components/common/PageHero";
import { Footer } from "@/components/layout/Footer";

export default function ClubsPage() {
  return (
    <div className="space-y-10">
      <PageHero
        eyebrow="باشگاه‌ها"
        title="گزارش ویژه باشگاه‌های فوتسال"
        subtitle="پروفایل تیم‌ها، اخبار نقل‌وانتقالات و برنامه‌های توسعه آکادمی"
      />

      <section className="container rounded-3xl border border-[var(--border)] bg-white p-8 text-right text-sm leading-7 text-[var(--muted)]">
        <p>
          این بخش به زودی با اطلاعات کامل باشگاه‌های فوتسال، معرفی ساختار مدیریتی و گزارش‌های اختصاصی افتتاح می‌شود.
        </p>
      </section>

      <Footer />
    </div>
  );
}
