import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { demoProfile, type FanActivity } from "@/lib/data/fanClub";

function toPersianNumber(num: number): string {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
}

function ActivityIcon({ type }: { type: FanActivity["type"] }) {
  const icons = {
    report: "📝",
    editorial: "✍️",
    comment: "💬",
    like: "❤️",
  };
  return <span className="text-xl sm:text-2xl">{icons[type]}</span>;
}

function ActivityTypeLabel({ type }: { type: FanActivity["type"] }) {
  const labels = {
    report: "گزارش",
    editorial: "یادداشت",
    comment: "نظر",
    like: "لایک",
  };
  return <span className="text-xs font-semibold sm:text-sm" style={{ color: '#475569' }}>{labels[type]}</span>;
}

export default function DemoProfilePage() {
  const progressPercentage = (demoProfile.score / demoProfile.nextLevelScore) * 100;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="space-y-8 sm:space-y-10 md:space-y-12">
        {/* Header */}
        <section className="container pt-8 sm:pt-12 lg:pt-16" dir="rtl">
          <div className="space-y-4">
            <Link
              href="/fan-club"
              className="inline-flex items-center gap-2 text-sm font-semibold transition hover:text-brand sm:text-base"
              style={{ color: '#1e293b' }}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#1e293b' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              بازگشت به باشگاه هواداری
            </Link>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">پروفایل هوادار</h1>
              <p className="mt-2 text-sm sm:text-base" style={{ color: '#334155' }}>اطلاعات و فعالیت‌های شما در باشگاه هواداری</p>
            </div>
          </div>
        </section>

        {/* Profile Header Card */}
        <section className="container" dir="rtl">
          <div className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-card sm:p-8 md:p-10">
            <div className="space-y-6 sm:space-y-8">
              {/* Profile Info */}
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
                <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-brand/10 text-2xl font-bold text-brand sm:h-24 sm:w-24 sm:text-3xl">
                  {demoProfile.nickname.slice(0, 2)}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-extrabold sm:text-3xl" style={{ color: '#0f172a' }}>{demoProfile.nickname}</h2>
                    <span className="rounded-full bg-brand/10 px-4 py-1.5 text-sm font-bold sm:px-5 sm:py-2 sm:text-base" style={{ color: '#0b6efd' }}>
                      سطح {toPersianNumber(demoProfile.level)}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm sm:text-base">
                    <span className="font-semibold text-brand">{toPersianNumber(demoProfile.score)} امتیاز</span>
                    <span className="text-slate-400">•</span>
                    <span style={{ color: '#475569' }}>{toPersianNumber(demoProfile.totalReports)} گزارش</span>
                    <span className="text-slate-400">•</span>
                    <span style={{ color: '#475569' }}>{toPersianNumber(demoProfile.totalEditorials)} یادداشت</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm sm:text-base">
                  <span className="font-semibold" style={{ color: '#334155' }}>پیشرفت به سطح بعدی</span>
                  <span style={{ color: '#475569' }}>
                    {toPersianNumber(demoProfile.score)} / {toPersianNumber(demoProfile.nextLevelScore)}
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-200 sm:h-4">
                  <div
                    className="h-full rounded-full bg-brand transition-all"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <p className="text-xs sm:text-sm" style={{ color: '#64748b' }}>
                  {toPersianNumber(demoProfile.nextLevelScore - demoProfile.score)} امتیاز تا سطح بعدی
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="container" dir="rtl">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
            <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm sm:rounded-3xl sm:p-8">
              <div className="mb-2 text-3xl sm:text-4xl">📝</div>
              <div className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                {toPersianNumber(demoProfile.totalReports)}
              </div>
              <div className="mt-1 text-sm sm:text-base" style={{ color: '#475569' }}>گزارش منتشر شده</div>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm sm:rounded-3xl sm:p-8">
              <div className="mb-2 text-3xl sm:text-4xl">✍️</div>
              <div className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                {toPersianNumber(demoProfile.totalEditorials)}
              </div>
              <div className="mt-1 text-sm sm:text-base" style={{ color: '#475569' }}>یادداشت منتشر شده</div>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm sm:rounded-3xl sm:p-8">
              <div className="mb-2 text-3xl sm:text-4xl">👁️</div>
              <div className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                {toPersianNumber(demoProfile.totalViews)}
              </div>
              <div className="mt-1 text-sm sm:text-base" style={{ color: '#475569' }}>بازدید کل</div>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm sm:rounded-3xl sm:p-8">
              <div className="mb-2 text-3xl sm:text-4xl">❤️</div>
              <div className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                {toPersianNumber(demoProfile.totalLikes)}
              </div>
              <div className="mt-1 text-sm sm:text-base" style={{ color: '#475569' }}>لایک دریافت شده</div>
            </div>
          </div>
        </section>

        {/* Badges Section */}
        <section className="container" dir="rtl">
          <div className="space-y-6 sm:space-y-8">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">نشان‌ها</h2>
              <p className="mt-2 text-sm sm:text-base" style={{ color: '#334155' }}>نشان‌های کسب شده شما</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
              {demoProfile.badges.map((badge) => (
                <div
                  key={badge.id}
                  className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm sm:rounded-3xl sm:p-6"
                >
                  <div className="text-4xl sm:text-5xl">{badge.icon}</div>
                  <div className="flex-1 space-y-1">
                    <h3 className="font-bold text-slate-900 sm:text-lg">{badge.name}</h3>
                    <p className="text-xs sm:text-sm" style={{ color: '#475569' }}>{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Activities */}
        <section className="container" dir="rtl">
          <div className="space-y-6 sm:space-y-8">
            <div>
              <h2 className="text-2xl font-extrabold sm:text-3xl" style={{ color: '#0f172a' }}>فعالیت‌های اخیر</h2>
              <p className="mt-2 text-sm sm:text-base" style={{ color: '#334155' }}>آخرین فعالیت‌های شما در باشگاه هواداری</p>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {demoProfile.activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-white p-4 shadow-sm transition hover:border-brand hover:shadow-md sm:rounded-2xl sm:p-6"
                >
                  <div className="flex-shrink-0">
                    <ActivityIcon type={activity.type} />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <ActivityTypeLabel type={activity.type} />
                      <span className="text-xs sm:text-sm" style={{ color: '#64748b' }}>{activity.date}</span>
                    </div>
                    <h3 className="font-semibold sm:text-base" style={{ color: '#0f172a' }}>{activity.title}</h3>
                  </div>
                  <div className="flex-shrink-0 text-left">
                    <div className="rounded-full bg-brand/10 px-3 py-1.5 text-xs font-bold text-brand sm:px-4 sm:py-2 sm:text-sm">
                      +{toPersianNumber(activity.points)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container pb-8 sm:pb-12" dir="rtl">
          <div className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-card sm:p-8 md:p-10">
            <div className="space-y-6 text-center">
              <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">آماده ارسال گزارش جدید هستید؟</h2>
              <p className="mx-auto max-w-2xl text-sm sm:text-base" style={{ color: '#334155' }}>
                گزارش یا یادداشت جدید خود را ارسال کنید و امتیاز بیشتری کسب کنید
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/fan-club/submit-report"
                  className="rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-brand/90 hover:shadow-xl sm:rounded-2xl sm:px-8 sm:py-3.5 sm:text-base"
                >
                  ارسال گزارش جدید
                </Link>
                <Link
                  href="/fan-club"
                  className="rounded-xl border border-[var(--border)] bg-white px-6 py-3 text-sm font-semibold transition hover:border-brand hover:bg-slate-50 hover:text-brand sm:rounded-2xl sm:px-8 sm:py-3.5 sm:text-base"
                  style={{ color: '#1e293b' }}
                >
                  مشاهده جدول رده‌بندی
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}

