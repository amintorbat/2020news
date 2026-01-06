import Link from "next/link";
import Image from "next/image";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { latestFanReports, type FanReport } from "@/lib/data/fanClub";

function toPersianNumber(num: number): string {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
}

function FanReportCard({ report }: { report: FanReport }) {
  return (
    <article
      className="flex gap-4 rounded-xl border border-[var(--border)] bg-white p-4 shadow-sm transition hover:border-brand hover:shadow-md sm:items-center sm:rounded-2xl sm:p-6"
      dir="rtl"
    >
      <div className="relative h-44 w-44 flex-shrink-0 overflow-hidden sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32">
        <Image
          src={report.imageUrl}
          alt={report.title}
          fill
          sizes="(min-width: 1024px) 112px, (min-width: 640px) 96px, 176px"
          className="object-cover"
          style={{ borderRadius: 0 }}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-3 overflow-hidden text-right">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="rounded-full bg-brand/10 px-3 py-1 font-semibold text-brand">{report.category}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-600">{report.sport}</span>
          <span className="whitespace-nowrap text-slate-500">{report.publishedAt}</span>
        </div>
        <Link
          href={report.href}
          className="break-words text-lg font-bold leading-snug text-slate-900 transition hover:text-brand sm:text-xl"
        >
          {report.title}
        </Link>
        {report.excerpt && (
          <p className="line-clamp-2 break-words text-sm leading-6 text-slate-700 sm:text-base">{report.excerpt}</p>
        )}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 sm:text-sm">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-700">{report.author}</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600">{toPersianNumber(report.authorScore)} امتیاز</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-600">{toPersianNumber(report.views)} بازدید</span>
            <span className="text-slate-600">{toPersianNumber(report.likes)} لایک</span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function FanReportsPage() {
  // Get all fan reports (extend the list for demo)
  const allFanReports: FanReport[] = [
    ...latestFanReports,
    {
      id: 7,
      title: "گزارش از مسابقات بین‌المللی فوتسال",
      excerpt: "تحلیل عملکرد تیم ملی در رقابت‌های قاره‌ای",
      category: "گزارش",
      sport: "فوتسال",
      author: "مربی فوتسال",
      authorScore: 1920,
      publishedAt: "۱۴ ساعت پیش",
      imageUrl: "https://picsum.photos/seed/fan-report-7/800/500",
      href: "/fan-club/reports/7",
      views: 890,
      likes: 45,
    },
    {
      id: 8,
      title: "یادداشت: چالش‌های پیش روی فوتسال ایران",
      excerpt: "بررسی موانع و راهکارهای توسعه فوتسال",
      category: "یادداشت",
      sport: "فوتسال",
      author: "طرفدار تیم ملی",
      authorScore: 1800,
      publishedAt: "۱۶ ساعت پیش",
      imageUrl: "https://picsum.photos/seed/fan-report-8/800/500",
      href: "/fan-club/reports/8",
      views: 720,
      likes: 38,
    },
    {
      id: 9,
      title: "گزارش ویژه از اردوی تیم ملی فوتبال ساحلی",
      excerpt: "گزارش تصویری از آخرین اردوی آماده‌سازی تیم ملی",
      category: "گزارش",
      sport: "فوتبال ساحلی",
      author: "گزارش‌نویس",
      authorScore: 1680,
      publishedAt: "۱۸ ساعت پیش",
      imageUrl: "https://picsum.photos/seed/fan-report-9/800/500",
      href: "/fan-club/reports/9",
      views: 1050,
      likes: 62,
    },
    {
      id: 10,
      title: "یادداشت: نقش رسانه‌ها در توسعه فوتسال",
      excerpt: "بررسی تأثیر پوشش رسانه‌ای در رشد فوتسال",
      category: "یادداشت",
      sport: "فوتسال",
      author: "هوادار پرتلاش",
      authorScore: 1560,
      publishedAt: "۲۰ ساعت پیش",
      imageUrl: "https://picsum.photos/seed/fan-report-10/800/500",
      href: "/fan-club/reports/10",
      views: 680,
      likes: 41,
    },
  ];

  const breadcrumbItems = [
    { label: "خانه", href: "/" },
    { label: "باشگاه هواداری", href: "/fan-club" },
    { label: "گزارش‌های هواداران" },
  ];

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[var(--background)]">
      <div className="space-y-8">
        {/* Header */}
        <section className="container pt-8" dir="rtl">
          <div className="space-y-4">
            <Breadcrumb items={breadcrumbItems} />
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">گزارش‌های هواداران</h1>
              <p className="mt-2 text-sm sm:text-base" style={{ color: '#334155' }}>
                تمام گزارش‌ها و یادداشت‌های منتشر شده توسط هواداران
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="container pb-8 sm:pb-12" dir="rtl">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold" style={{ color: '#0f172a' }}>همه گزارش‌ها و یادداشت‌ها</h2>
                <p className="mt-1 text-sm sm:text-base" style={{ color: '#334155' }}>
                  گزارش‌ها و یادداشت‌های منتشر شده توسط هواداران باشگاه
                </p>
              </div>
              <div className="text-sm sm:text-base" style={{ color: '#475569' }}>
                {allFanReports.length} مورد
              </div>
            </div>
            <div className="space-y-4">
              {allFanReports.map((report) => (
                <FanReportCard key={report.id} report={report} />
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}

