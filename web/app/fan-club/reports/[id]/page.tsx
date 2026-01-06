"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { latestFanReports, type FanReport } from "@/lib/data/fanClub";

function toPersianNumber(num: number): string {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
}

// Mock content for reports
const reportContents: Record<number, string> = {
  1: `این گزارش میدانی از بازی فوتسال تیم ملی ایران تهیه شده است. در این مسابقه که در چارچوب رقابت‌های بین‌المللی برگزار شد، تیم ملی با عملکرد قابل قبولی به میدان رفت.

## نیمه اول

بازیکنان از همان دقایق اولیه بازی، کنترل میانه زمین را در دست گرفتند و با پاس‌های دقیق و حرکات تاکتیکی، فشار زیادی به تیم حریف وارد کردند. در نیمه اول، چند موقعیت گل خوبی ایجاد شد که متأسفانه به گل تبدیل نشد.

## نیمه دوم

در نیمه دوم، کادر فنی با تعویض‌های هوشمندانه، انرژی تازه‌ای به تیم بخشید. این تغییرات نتیجه‌بخش بود و در نهایت تیم ملی با نتیجه قابل قبولی از این مسابقه خارج شد.

## عملکرد بازیکنان کلیدی

### دروازه‌بان
دفاع خوب و چند save عالی

### خط دفاعی
هماهنگی مناسب و جلوگیری از موقعیت‌های خطرناک

### خط میانی
کنترل بازی و ایجاد موقعیت‌های گل

### خط حمله
تلاش برای گلزنی و ایجاد فشار

## نتیجه‌گیری

این بازی نشان داد که تیم ملی در مسیر درستی قرار دارد و با ادامه این روند می‌تواند در رقابت‌های آینده نتایج بهتری کسب کند.`,

  2: `فوتبال ساحلی ایران در سال‌های اخیر پیشرفت‌های قابل توجهی داشته است. با این حال، هنوز چالش‌های زیادی پیش روی این رشته ورزشی قرار دارد.

یکی از مهم‌ترین چالش‌ها، کمبود زیرساخت‌های مناسب است. زمین‌های ساحلی استاندارد در کشور محدود هستند و این موضوع مانع از توسعه بیشتر این رشته شده است.

از سوی دیگر، نیاز به سرمایه‌گذاری بیشتر در بخش آکادمی و استعدادیابی احساس می‌شود. با شناسایی و پرورش استعدادهای جوان، می‌توان آینده بهتری برای فوتبال ساحلی ایران رقم زد.

فرصت‌های پیش رو:
- برگزاری مسابقات بیشتر در سطح داخلی
- تقویت ارتباط با فدراسیون‌های بین‌المللی
- استفاده از تجربیات کشورهای موفق در این رشته
- توسعه زیرساخت‌های ورزشی

با برنامه‌ریزی درست و سرمایه‌گذاری هوشمندانه، می‌توان فوتبال ساحلی ایران را به سطح بالاتری رساند.`,

  3: `گزارش از آخرین جلسه تمرین تیم ملی فوتسال که در اردوگاه ملی برگزار شد.

تمرین امروز با تمرکز بر تاکتیک‌های دفاعی آغاز شد. بازیکنان در قالب گروه‌های کوچک، روی هماهنگی و پوشش دفاعی کار کردند. کادر فنی تأکید زیادی بر ارتباط و هماهنگی بین بازیکنان داشت.

در بخش دوم تمرین، تمرکز بر بازی‌سازی و ایجاد موقعیت‌های گل بود. بازیکنان با تمرینات مختلف، روی دقت پاس و شوت‌زنی کار کردند.

کادر فنی از آمادگی بازیکنان راضی به نظر می‌رسید و اعلام کرد که تیم برای مسابقات آینده آماده است.`,

  4: `هواداران نقش بسیار مهمی در موفقیت تیم‌ها دارند. حضور پررنگ و حمایت بی‌قید و شرط هواداران، انرژی مضاعفی به بازیکنان می‌دهد.

در بازی‌های خانگی، وقتی استادیوم پر از هواداران مشتاق باشد، بازیکنان با انگیزه بیشتری بازی می‌کنند. این موضوع در نتایج تیم نیز تأثیر مستقیم دارد.

هواداران با تشویق‌های خود، می‌توانند روحیه تیم را بالا ببرند و در لحظات سخت، پشتیبان بازیکنان باشند. این حمایت‌ها در نهایت به موفقیت تیم منجر می‌شود.`,

  5: `گزارش فنی از بازی‌های هفته گذشته در لیگ فوتبال ساحلی.

در این هفته، چند بازی جذاب و پرگل برگزار شد. تیم‌ها با آمادگی خوبی به میدان رفتند و بازی‌های تماشایی‌ای ارائه دادند.

عملکرد تیم‌های برتر نشان داد که سطح رقابت در لیگ بالا رفته است. این موضوع برای توسعه فوتبال ساحلی در کشور بسیار مثبت است.`,

  6: `نسل جدید فوتسال ایران پر از استعداد است. بازیکنان جوان با انگیزه و مهارت بالا، آینده روشنی را برای فوتسال ایران رقم می‌زنند.

این استعدادها نیاز به حمایت و فرصت دارند. با دادن فرصت به این بازیکنان، می‌توانیم آینده فوتسال ایران را تضمین کنیم.`,
};

type FanReportDetailPageProps = {
  params: Promise<{ id: string }>;
};

function TableOfContents() {
  const [headings, setHeadings] = useState<Array<{ id: string; text: string; level: number }>>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const articleBody = document.querySelector('[itemprop="articleBody"]');
      if (!articleBody) return;

      const extracted: Array<{ id: string; text: string; level: number }> = [];
      const headingElements = articleBody.querySelectorAll("h2, h3");

      headingElements.forEach((heading) => {
        const text = heading.textContent?.trim() || "";
        if (!text || !heading.id) return;

        const level = heading.tagName === "H2" ? 2 : 3;
        extracted.push({
          id: heading.id,
          text,
          level,
        });
      });

      if (extracted.length === 0) return;
      setHeadings(extracted);

      // Intersection Observer for active heading
      const observerOptions = {
        rootMargin: "-100px 0px -66%",
        threshold: 0,
      };

      const observerCallback = (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      };

      const observer = new IntersectionObserver(observerCallback, observerOptions);
      headingElements.forEach((heading) => {
        if (heading.id) {
          observer.observe(heading);
        }
      });

      return () => {
        observer.disconnect();
      };
    }, 200);

    return () => clearTimeout(timeoutId);
  }, []);

  if (headings.length === 0) return null;

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm" dir="rtl">
      <h3 className="mb-4 text-lg font-bold" style={{ color: '#0f172a' }}>فهرست مطالب</h3>
      <ul className="space-y-2 text-sm">
        {headings.map((heading) => (
          <li key={heading.id}>
            <button
              type="button"
              onClick={() => scrollToHeading(heading.id)}
              className={`block w-full text-right rounded-lg px-3 py-2 transition ${
                activeId === heading.id
                  ? "bg-brand/10 font-semibold text-brand"
                  : "text-slate-700 hover:bg-slate-50 hover:text-brand"
              }`}
              style={{ paddingRight: heading.level === 3 ? "1.5rem" : "0.75rem" }}
            >
              {heading.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function FanReportDetailPage({ params }: FanReportDetailPageProps) {
  const [reportId, setReportId] = useState<number | null>(null);
  const [report, setReport] = useState<FanReport | undefined>(undefined);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    params.then((p) => {
      const id = parseInt(p.id, 10);
      setReportId(id);
      setReport(latestFanReports.find((r) => r.id === id));
    });
  }, [params]);

  if (!reportId || !report) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <div className="container pt-8 pb-12" dir="rtl">
          <div className="rounded-3xl border border-[var(--border)] bg-white p-8 text-center shadow-card">
            <h1 className="text-2xl font-extrabold text-slate-900">گزارش یافت نشد</h1>
            <p className="mt-4 text-slate-600">گزارش مورد نظر شما وجود ندارد.</p>
            <Link
              href="/fan-club/reports"
              className="mt-6 inline-block rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-brand/90 sm:rounded-2xl sm:px-8 sm:py-3.5 sm:text-base"
            >
              بازگشت به لیست گزارش‌ها
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <div className="container pt-8 pb-12" dir="rtl">
          <div className="rounded-3xl border border-[var(--border)] bg-white p-8 text-center shadow-card">
            <h1 className="text-2xl font-extrabold text-slate-900">گزارش یافت نشد</h1>
            <p className="mt-4 text-slate-600">گزارش مورد نظر شما وجود ندارد.</p>
            <Link
              href="/fan-club/reports"
              className="mt-6 inline-block rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-brand/90 sm:rounded-2xl sm:px-8 sm:py-3.5 sm:text-base"
            >
              بازگشت به لیست گزارش‌ها
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const content = reportContents[reportId] || report.excerpt;

  const breadcrumbItems = [
    { label: "خانه", href: "/" },
    { label: "باشگاه هواداری", href: "/fan-club" },
    { label: "گزارش‌های هواداران", href: "/fan-club/reports" },
    { label: report.title },
  ];

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[var(--background)]">
      <div className="space-y-8">
        {/* Header */}
        <section className="container pt-8" dir="rtl">
          <div className="space-y-4">
            <Breadcrumb items={breadcrumbItems} />
            <Link
              href="/fan-club/reports"
              className="inline-flex items-center gap-2 text-sm font-semibold transition hover:text-brand sm:text-base"
              style={{ color: '#1e293b' }}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#1e293b' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              بازگشت به لیست گزارش‌ها
            </Link>
          </div>
        </section>

        {/* Main Content */}
        <section className="container pb-8 sm:pb-12" dir="rtl">
          <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
            {/* Article Content */}
            <article className="space-y-6">
              {/* Header */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 sm:text-sm">
                  <span className="rounded-full bg-brand/10 px-3 py-1 font-semibold text-brand">{report.category}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-600">{report.sport}</span>
                  <span className="whitespace-nowrap text-slate-500">{report.publishedAt}</span>
                </div>
                <h1 className="text-3xl font-extrabold sm:text-4xl" style={{ color: '#0f172a' }}>{report.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm sm:text-base">
                  <div className="flex items-center gap-2">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand/10 text-sm font-bold text-brand">
                      {report.author.slice(0, 2)}
                    </span>
                    <div>
                      <div className="font-semibold" style={{ color: '#0f172a' }}>{report.author}</div>
                      <div className="text-xs sm:text-sm" style={{ color: '#475569' }}>{toPersianNumber(report.authorScore)} امتیاز</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4" style={{ color: '#475569' }}>
                    <span>{toPersianNumber(report.views)} بازدید</span>
                    <span>{toPersianNumber(report.likes)} لایک</span>
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              <div className="relative h-64 w-full overflow-hidden sm:h-80 md:h-96">
                <Image
                  src={report.imageUrl}
                  alt={report.title}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  style={{ borderRadius: 0 }}
                  priority
                />
              </div>

              {/* Article Body */}
              <div className="prose prose-slate max-w-none" itemProp="articleBody">
                <p className="text-lg leading-8 sm:text-xl" style={{ color: '#334155' }}>{report.excerpt}</p>
                <div className="mt-6 space-y-4 text-base leading-8 sm:text-lg" style={{ color: '#334155' }}>
                  {content.split("\n\n").map((paragraph, index) => {
                    if (paragraph.startsWith("## ")) {
                      const text = paragraph.replace("## ", "");
                      const id = `heading-${index}`;
                      return (
                        <h2 key={index} id={id} className="mt-8 mb-4 text-2xl font-bold" style={{ color: '#0f172a' }}>
                          {text}
                        </h2>
                      );
                    }
                    if (paragraph.startsWith("### ")) {
                      const text = paragraph.replace("### ", "");
                      const id = `heading-${index}`;
                      return (
                        <h3 key={index} id={id} className="mt-6 mb-3 text-xl font-bold" style={{ color: '#0f172a' }}>
                          {text}
                        </h3>
                      );
                    }
                    if (paragraph.startsWith("- ")) {
                      const items = paragraph.split("\n").filter((line) => line.trim().startsWith("- "));
                      return (
                        <ul key={index} className="list-disc space-y-2 pr-6">
                          {items.map((item, i) => (
                            <li key={i}>{item.replace("- ", "")}</li>
                          ))}
                        </ul>
                      );
                    }
                    return (
                      <p key={index}>{paragraph}</p>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
                <button className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold transition hover:border-brand hover:bg-slate-50 hover:text-brand" style={{ color: '#1e293b' }}>
                  <span>❤️</span>
                  <span>لایک</span>
                  <span style={{ color: '#64748b' }}>({toPersianNumber(report.likes)})</span>
                </button>
                <button className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold transition hover:border-brand hover:bg-slate-50 hover:text-brand" style={{ color: '#1e293b' }}>
                  <span>💬</span>
                  <span>نظر</span>
                </button>
                <button className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold transition hover:border-brand hover:bg-slate-50 hover:text-brand" style={{ color: '#1e293b' }}>
                  <span>🔗</span>
                  <span>اشتراک‌گذاری</span>
                </button>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="hidden lg:block space-y-6">
              {/* Table of Contents */}
              <TableOfContents />

              {/* Author Info */}
              <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-bold" style={{ color: '#0f172a' }}>اطلاعات نویسنده</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-brand/10 text-xl font-bold text-brand">
                      {report.author.slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-bold" style={{ color: '#0f172a' }}>{report.author}</div>
                      <div className="text-sm" style={{ color: '#475569' }}>{toPersianNumber(report.authorScore)} امتیاز</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={() => setIsFollowing(!isFollowing)}
                      className={`block w-full rounded-xl px-4 py-2.5 text-center text-sm font-bold transition ${
                        isFollowing
                          ? "border border-[var(--border)] bg-white text-slate-700 hover:bg-slate-50"
                          : "bg-brand text-white hover:bg-brand/90"
                      }`}
                    >
                      {isFollowing ? "✓ دنبال می‌کنید" : "+ دنبال کردن"}
                    </button>
                    <Link
                      href="/fan-club/profile/demo"
                      className="block w-full rounded-xl border border-[var(--border)] bg-white px-4 py-2.5 text-center text-sm font-semibold text-slate-700 transition hover:border-brand hover:bg-slate-50 hover:text-brand"
                    >
                      مشاهده پروفایل
                    </Link>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-bold" style={{ color: '#0f172a' }}>گزارش‌های مرتبط</h3>
                <div className="space-y-4">
                  {latestFanReports
                    .filter((r) => r.id !== reportId && r.sport === report.sport)
                    .slice(0, 3)
                    .map((relatedReport) => (
                      <Link
                        key={relatedReport.id}
                        href={relatedReport.href}
                        className="block space-y-2 rounded-xl border border-[var(--border)] bg-white p-3 transition hover:border-brand hover:shadow-sm"
                      >
                        <h4 className="line-clamp-2 text-sm font-semibold" style={{ color: '#0f172a' }}>{relatedReport.title}</h4>
                        <div className="flex items-center gap-2 text-xs" style={{ color: '#64748b' }}>
                          <span>{relatedReport.publishedAt}</span>
                          <span>•</span>
                          <span>{toPersianNumber(relatedReport.views)} بازدید</span>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            </aside>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}

