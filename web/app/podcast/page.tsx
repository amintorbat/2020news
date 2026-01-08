export const dynamic = "force-static";

import { Footer } from "@/components/layout/Footer";

export default function PodcastPage() {
  const episodes = [
    {
      title: "تحلیل هفته اول لیگ برتر فوتسال",
      description: "بررسی بازی‌های هفته اول و تحلیل عملکرد تیم‌ها",
      duration: "۱۸ دقیقه",
    },
    {
      title: "گفتگو با سرمربی تیم ملی",
      description: "مصاحبه اختصاصی با سرمربی تیم ملی فوتسال ایران",
      duration: "۲۵ دقیقه",
    },
    {
      title: "پشت صحنه اردوی تیم ملی",
      description: "گزارش اختصاصی از اردوی آماده‌سازی تیم ملی",
      duration: "۲۰ دقیقه",
    },
    {
      title: "تحلیل فنی بازی‌های هفته",
      description: "تحلیل تکنیکی و تاکتیکی بازی‌های هفته گذشته",
      duration: "۲۲ دقیقه",
    },
    {
      title: "گفتگو با بازیکن برتر هفته",
      description: "مصاحبه با بازیکن برتر هفته و بررسی عملکرد",
      duration: "۱۵ دقیقه",
    },
    {
      title: "نگاهی به رقابت‌های قاره‌ای",
      description: "بررسی وضعیت تیم‌های ایرانی در رقابت‌های آسیایی",
      duration: "۱۹ دقیقه",
    },
  ];

  const steps = [
    {
      icon: "📅",
      title: "انتشار هفتگی",
      description: "پادکست‌های جدید هر هفته منتشر می‌شوند",
    },
    {
      icon: "📺",
      title: "پخش در آپارات/یوتیوب",
      description: "تمامی اپیزودها در پلتفرم‌های محبوب در دسترس خواهند بود",
    },
    {
      icon: "📚",
      title: "آرشیو در سایت",
      description: "دسترسی کامل به تمامی اپیزودهای قبلی در سایت",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="space-y-8 sm:space-y-12 md:space-y-16 lg:space-y-20">
        {/* Hero Section */}
        <section className="container pt-8 sm:pt-12 md:pt-16 lg:pt-20" dir="rtl">
          <div className="rounded-2xl sm:rounded-3xl border border-[var(--border)] bg-gradient-to-br from-brand/10 via-white to-brand/5 p-6 shadow-lg sm:p-8 md:p-10 lg:p-12">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="space-y-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900" style={{ color: "#0f172a" }}>
                  پادکست‌های ۲۰۲۰ نیوز
                </h1>
                <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed text-slate-700" style={{ color: "#334155" }}>
                  تحلیل بازی‌ها، گفتگو با مربیان و بازیکنان، و برنامه‌های هفتگی تخصصی فوتسال و فوتبال ساحلی
                </p>
              </div>
              
              {/* Stat Chips */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <span className="inline-flex items-center rounded-full bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 opacity-60" style={{ backgroundColor: "#e2e8f0", color: "#475569" }}>
                  تحلیل بازی‌ها
                </span>
                <span className="inline-flex items-center rounded-full bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 opacity-60" style={{ backgroundColor: "#e2e8f0", color: "#475569" }}>
                  گفتگو با مربیان
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Episodes Preview */}
        <section className="container" dir="rtl">
          <div className="space-y-6 sm:space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900" style={{ color: "#0f172a" }}>
                اپیزودهای آینده
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto" style={{ color: "#475569" }}>
                پادکست‌های جدید که به زودی منتشر خواهند شد
              </p>
            </div>
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {episodes.map((episode, index) => (
                <div
                  key={index}
                  className="group relative flex flex-col rounded-2xl border border-[var(--border)] bg-white p-4 shadow-sm opacity-60 sm:rounded-3xl sm:p-5"
                  dir="rtl"
                >
                  {/* Coming Soon Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-flex items-center rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand sm:text-sm">
                      به‌زودی
                    </span>
                  </div>

                  {/* Cover Placeholder (Square, no rounded corners) */}
                  <div className="relative w-full aspect-square bg-gradient-to-br from-slate-200 to-slate-300 mb-4 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="h-12 w-12 sm:h-16 sm:w-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>

                  {/* Episode Info */}
                  <div className="space-y-2 flex-1">
                    <h3 className="text-base font-bold text-slate-900 line-clamp-2 sm:text-lg md:text-xl" style={{ color: "#0f172a" }}>
                      {episode.title}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-1 sm:text-base" style={{ color: "#475569" }}>
                      {episode.description}
                    </p>
                    <div className="flex items-center gap-2 pt-2">
                      <svg className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-xs text-slate-600 sm:text-sm" style={{ color: "#475569" }}>
                        {episode.duration}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it will work Section */}
        <section className="container" dir="rtl">
          <div className="space-y-6 sm:space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900" style={{ color: "#0f172a" }}>
                نحوه کار
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto" style={{ color: "#475569" }}>
                پادکست‌های ۲۰۲۰ نیوز چگونه منتشر و در دسترس قرار می‌گیرند
              </p>
            </div>
            <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm sm:rounded-3xl sm:p-6"
                  dir="rtl"
                >
                  <div className="text-4xl sm:text-5xl">{step.icon}</div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-900 sm:text-xl" style={{ color: "#0f172a" }}>
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-600 sm:text-base leading-relaxed" style={{ color: "#475569" }}>
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Disabled CTA Section */}
        <section className="container pb-8 sm:pb-12 md:pb-16" dir="rtl">
          <div className="flex flex-col items-center gap-4">
            <button
              disabled
              className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-400 bg-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 cursor-not-allowed opacity-75 sm:rounded-2xl sm:px-8 sm:py-3.5 sm:text-base"
              style={{ color: "#334155", borderColor: "#94a3b8", backgroundColor: "#e2e8f0" }}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              به‌زودی راه‌اندازی می‌شود
            </button>
            <p className="text-sm text-slate-600 text-center max-w-md" style={{ color: "#475569" }}>
              فعلاً نسخه نمایشی است و بعداً تکمیل می‌شود.
            </p>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
