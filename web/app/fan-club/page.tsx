"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Footer } from "@/components/layout/Footer";
import { weeklyLeaderboard, latestFanReports, type FanLeaderboardEntry, type FanReport } from "@/lib/data/fanClub";

function toPersianNumber(num: number): string {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
}

// Extended reports
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
];

type FilterType = "all" | "گزارش" | "یادداشت";
type SportType = "all" | "فوتسال" | "فوتبال ساحلی";
type SortType = "newest" | "popular" | "trending";

function FeatureCard({ icon, title, description, href, color }: { icon: string; title: string; description: string; href: string; color: string }) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm transition-all duration-300 hover:border-brand hover:shadow-lg hover:-translate-y-1 sm:rounded-3xl sm:p-6 md:p-8"
      dir="rtl"
    >
      <div className={`text-4xl sm:text-5xl md:text-6xl`}>{icon}</div>
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-slate-900 sm:text-xl md:text-2xl" style={{ color: '#0f172a' }}>{title}</h3>
        <p className="text-sm text-slate-700 sm:text-base leading-relaxed" style={{ color: '#334155' }}>{description}</p>
      </div>
      <div className="mt-auto flex items-center gap-2 text-sm font-semibold text-brand group-hover:gap-3 transition-all">
        <span>بیشتر بخوانید</span>
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </div>
    </Link>
  );
}

function LeaderboardTable({ entries }: { entries: FanLeaderboardEntry[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-white shadow-sm sm:rounded-2xl md:rounded-3xl" dir="rtl">
      <div className="overflow-x-auto">
        <table className="w-full text-sm sm:text-base">
          <thead className="bg-gradient-to-l from-brand/10 to-transparent">
            <tr>
              <th className="px-3 py-3 text-center font-bold text-slate-900 sm:px-4 sm:py-4" style={{ color: '#0f172a' }}>رتبه</th>
              <th className="px-3 py-3 text-right font-bold text-slate-900 sm:px-4 sm:py-4" style={{ color: '#0f172a' }}>نام کاربری</th>
              <th className="px-3 py-3 text-center font-bold text-slate-900 sm:px-4 sm:py-4" style={{ color: '#0f172a' }}>امتیاز</th>
              <th className="px-3 py-3 text-center font-bold text-slate-900 sm:px-4 sm:py-4" style={{ color: '#0f172a' }}>سطح</th>
              <th className="px-3 py-3 text-center font-bold text-slate-900 sm:px-4 sm:py-4" style={{ color: '#0f172a' }}>نشان</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr 
                key={entry.rank} 
                className={`border-t border-[var(--border)] transition-colors hover:bg-slate-50 ${
                  index < 3 ? "bg-gradient-to-l from-brand/5 to-transparent" : ""
                }`}
              >
                <td className="px-3 py-3 text-center font-bold sm:px-4 sm:py-4" style={{ color: '#0f172a' }}>
                  {entry.rank <= 3 ? (
                    <span className="text-xl sm:text-2xl">{entry.badge}</span>
                  ) : (
                    <span className="text-sm sm:text-base">{toPersianNumber(entry.rank)}</span>
                  )}
                </td>
                <td className="px-3 py-3 sm:px-4 sm:py-4">
                  <Link href="/fan-club/profile/demo" className="flex items-center gap-2 sm:gap-3 group">
                    <div className="flex h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-bold text-brand sm:text-sm group-hover:scale-110 transition-transform">
                      {entry.nickname.slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 truncate group-hover:text-brand transition" style={{ color: '#0f172a' }}>
                        {entry.nickname}
                      </div>
                    </div>
                  </Link>
                </td>
                <td className="px-3 py-3 text-center font-bold text-brand sm:px-4 sm:py-4">
                  {toPersianNumber(entry.score)}
                </td>
                <td className="px-3 py-3 text-center sm:px-4 sm:py-4">
                  <span className="inline-block rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand sm:text-sm">
                    {toPersianNumber(entry.level)}
                  </span>
                </td>
                <td className="px-3 py-3 text-center text-lg sm:text-xl sm:px-4 sm:py-4">{entry.badge}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FanReportCard({ report }: { report: FanReport }) {
  return (
    <Link
      href={report.href}
      className="group flex flex-col sm:flex-row gap-4 rounded-xl border border-[var(--border)] bg-white p-4 shadow-sm transition-all duration-300 hover:border-brand hover:shadow-lg hover:-translate-y-1 sm:items-center sm:rounded-2xl sm:p-5 md:p-6"
      dir="rtl"
    >
      <div className="relative h-48 w-full flex-shrink-0 overflow-hidden sm:h-28 sm:w-28 md:h-32 md:w-32 lg:h-36 lg:w-36 rounded-lg">
        <Image
          src={report.imageUrl}
          alt={report.title}
          fill
          sizes="(min-width: 1024px) 144px, (min-width: 640px) 112px, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          style={{ borderRadius: 0 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-3 overflow-hidden text-right">
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
          <span className="rounded-full bg-brand/10 px-3 py-1 font-semibold text-brand">{report.category}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-600" style={{ color: '#475569' }}>{report.sport}</span>
          <span className="whitespace-nowrap text-slate-500">{report.publishedAt}</span>
        </div>
        <h3 className="break-words text-lg font-bold leading-snug text-slate-900 transition group-hover:text-brand sm:text-xl md:text-2xl" style={{ color: '#0f172a' }}>
          {report.title}
        </h3>
        <p className="line-clamp-2 break-words text-sm leading-6 text-slate-700 sm:text-base md:text-lg" style={{ color: '#334155' }}>
          {report.excerpt}
        </p>
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 sm:text-sm">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand/10 text-xs font-bold text-brand">
              {report.author.slice(0, 2)}
            </div>
            <span className="font-semibold text-slate-700" style={{ color: '#1e293b' }}>{report.author}</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600" style={{ color: '#475569' }}>{toPersianNumber(report.authorScore)} امتیاز</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-slate-600" style={{ color: '#475569' }}>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {toPersianNumber(report.views)}
            </span>
            <span className="flex items-center gap-1 text-slate-600" style={{ color: '#475569' }}>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {toPersianNumber(report.likes)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function StatsCard({ icon, label, value, color, gradient }: { icon: string; label: string; value: string; color: string; gradient: string }) {
  return (
    <div className={`rounded-2xl border border-[var(--border)] bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 sm:rounded-3xl sm:p-6 ${gradient}`}>
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="text-3xl sm:text-4xl md:text-5xl">{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold" style={{ color }}>{value}</div>
          <div className="text-xs sm:text-sm md:text-base text-slate-600 mt-1" style={{ color: '#475569' }}>{label}</div>
        </div>
      </div>
    </div>
  );
}

export default function FanClubPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [activeSport, setActiveSport] = useState<SportType>("all");
  const [sortBy, setSortBy] = useState<SortType>("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [displayedReports, setDisplayedReports] = useState(allFanReports);
  const [showMore, setShowMore] = useState(false);

  // Filter and sort reports
  useEffect(() => {
    let filtered = [...allFanReports];

    // Filter by category
    if (activeFilter !== "all") {
      filtered = filtered.filter((report) => report.category === activeFilter);
    }

    // Filter by sport
    if (activeSport !== "all") {
      filtered = filtered.filter((report) => report.sport === activeSport);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (report) =>
          report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    if (sortBy === "popular") {
      filtered.sort((a, b) => b.views - a.views);
    } else if (sortBy === "trending") {
      filtered.sort((a, b) => b.likes - a.likes);
    } else {
      // newest - keep original order
    }

    setDisplayedReports(filtered);
  }, [activeFilter, activeSport, sortBy, searchQuery]);

  const visibleReports = showMore ? displayedReports : displayedReports.slice(0, 6);
  const totalReports = allFanReports.length;
  const totalFans = weeklyLeaderboard.length;
  const totalViews = allFanReports.reduce((sum, r) => sum + r.views, 0);
  const totalLikes = allFanReports.reduce((sum, r) => sum + r.likes, 0);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12">
        {/* Hero Section */}
        <section className="container pt-6 sm:pt-8 md:pt-10 lg:pt-12" dir="rtl">
          <div className="rounded-2xl sm:rounded-3xl border border-[var(--border)] bg-gradient-to-br from-brand/10 via-white to-brand/5 p-6 shadow-lg sm:p-8 md:p-10 lg:p-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 rounded-full bg-gradient-to-br from-brand/20 to-brand/10 flex items-center justify-center text-2xl sm:text-3xl md:text-4xl font-bold text-brand">
                    باش
                  </div>
                  <div>
                    <p className="text-sm sm:text-base font-semibold text-brand mb-1" style={{ color: '#0b6efd' }}>
                      باشگاه هواداری
                    </p>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900" style={{ color: '#0f172a' }}>
                      باشگاه هواداری ۲۰۲۰
                    </h1>
                  </div>
                </div>
                <p className="text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed" style={{ color: '#334155' }}>
                  به باشگاه هواداری ما بپیوندید، گزارش بنویسید، یادداشت منتشر کنید و در رتبه‌بندی هواداران شرکت کنید.
                  بهترین گزارش‌ها و یادداشت‌ها در سایت منتشر می‌شوند.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/fan-club/submit-report"
                  className="flex-1 sm:flex-none rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:bg-brand/90 hover:shadow-xl hover:scale-105 sm:rounded-2xl sm:px-8 sm:py-3.5 sm:text-base"
                >
                  + ارسال گزارش
                </Link>
                <Link
                  href="/fan-club/profile/demo"
                  className="flex-1 sm:flex-none rounded-xl border-2 border-[var(--border)] bg-white px-6 py-3 text-sm font-semibold transition-all duration-200 hover:border-brand hover:bg-slate-50 hover:text-brand hover:scale-105 sm:rounded-2xl sm:px-8 sm:py-3.5 sm:text-base"
                  style={{ color: '#0f172a' }}
                >
                  مشاهده پروفایل
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="container" dir="rtl">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            <StatsCard icon="📝" label="گزارش‌ها" value={toPersianNumber(totalReports)} color="#0b6efd" gradient="hover:bg-blue-50" />
            <StatsCard icon="👥" label="هواداران" value={toPersianNumber(totalFans)} color="#10b981" gradient="hover:bg-green-50" />
            <StatsCard icon="👁️" label="بازدید" value={toPersianNumber(totalViews)} color="#f59e0b" gradient="hover:bg-yellow-50" />
            <StatsCard icon="❤️" label="لایک" value={toPersianNumber(totalLikes)} color="#ef4444" gradient="hover:bg-red-50" />
          </div>
        </section>

        {/* Feature Cards */}
        <section className="container" dir="rtl">
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900" style={{ color: '#0f172a' }}>
                ویژگی‌های باشگاه هواداری
              </h2>
              <p className="mt-2 text-sm sm:text-base md:text-lg text-slate-700" style={{ color: '#334155' }}>
                امکانات و فرصت‌های ویژه برای هواداران
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
              <FeatureCard
                icon="📝"
                title="ارسال گزارش"
                description="گزارش‌های میدانی و تحلیلی خود را با دیگران به اشتراک بگذارید"
                href="/fan-club/submit-report"
                color="blue"
              />
              <FeatureCard
                icon="✍️"
                title="نوشتن یادداشت"
                description="نظرات و تحلیل‌های خود را در قالب یادداشت منتشر کنید"
                href="/fan-club/submit-report"
                color="purple"
              />
              <FeatureCard
                icon="🏆"
                title="رتبه‌بندی هواداران"
                description="با نوشتن گزارش و فعالیت در باشگاه، امتیاز کسب کنید و رتبه خود را بالا ببرید"
                href="/fan-club#leaderboard"
                color="yellow"
              />
              <FeatureCard
                icon="🎙️"
                title="فرصت حضور در پادکست"
                description="بهترین گزارش‌نویسان فرصت حضور در پادکست‌های اختصاصی را دارند"
                href="/fan-club#podcast"
                color="pink"
              />
            </div>
          </div>
        </section>

        {/* Leaderboard Section */}
        <section id="leaderboard" className="container" dir="rtl">
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900" style={{ color: '#0f172a' }}>
                  جدول رده‌بندی هفتگی
                </h2>
                <p className="mt-2 text-sm sm:text-base md:text-lg text-slate-700" style={{ color: '#334155' }}>
                  برترین هواداران این هفته
                </p>
              </div>
            </div>
            <LeaderboardTable entries={weeklyLeaderboard} />
          </div>
        </section>

        {/* Latest Fan Reports */}
        <section className="container pb-6 sm:pb-8 md:pb-10 lg:pb-12" dir="rtl">
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900" style={{ color: '#0f172a' }}>
                  آخرین گزارش‌های هواداران
                </h2>
                <p className="mt-2 text-sm sm:text-base md:text-lg text-slate-700" style={{ color: '#334155' }}>
                  گزارش‌ها و یادداشت‌های منتشر شده توسط هواداران
                </p>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="rounded-xl sm:rounded-2xl border border-[var(--border)] bg-white p-4 shadow-sm sm:p-5 md:p-6 space-y-4">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="جستجو در گزارش‌ها، نویسندگان..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-slate-50 px-4 py-3 pr-12 text-sm transition focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 sm:rounded-2xl sm:py-3.5 sm:text-base"
                  style={{ color: '#0f172a' }}
                />
                <svg className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                {/* Category Filter */}
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2" style={{ color: '#334155' }}>
                    دسته‌بندی
                  </label>
                  <div className="flex gap-2">
                    {(["all", "گزارش", "یادداشت"] as FilterType[]).map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`flex-1 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 ${
                          activeFilter === filter
                            ? "bg-brand text-white shadow-md"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {filter === "all" ? "همه" : filter}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sport Filter */}
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2" style={{ color: '#334155' }}>
                    ورزش
                  </label>
                  <div className="flex gap-2">
                    {(["all", "فوتسال", "فوتبال ساحلی"] as SportType[]).map((sport) => (
                      <button
                        key={sport}
                        onClick={() => setActiveSport(sport)}
                        className={`flex-1 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 ${
                          activeSport === sport
                            ? "bg-brand text-white shadow-md"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {sport === "all" ? "همه" : sport}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2" style={{ color: '#334155' }}>
                    مرتب‌سازی
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortType)}
                    className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 sm:rounded-2xl sm:py-3"
                    style={{ color: '#0f172a' }}
                  >
                    <option value="newest">جدیدترین</option>
                    <option value="popular">محبوب‌ترین</option>
                    <option value="trending">ترند</option>
                  </select>
                </div>
              </div>

              {/* Results Count */}
              <div className="text-xs sm:text-sm text-slate-600 pt-2 border-t border-[var(--border)]" style={{ color: '#475569' }}>
                {displayedReports.length > 0 ? (
                  <span>{toPersianNumber(displayedReports.length)} گزارش یافت شد</span>
                ) : (
                  <span>گزارشی یافت نشد</span>
                )}
              </div>
            </div>

            {/* Reports List */}
            {visibleReports.length > 0 ? (
              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                {visibleReports.map((report) => (
                  <FanReportCard key={report.id} report={report} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-[var(--border)] bg-white p-12 text-center shadow-sm">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-lg font-semibold text-slate-900 mb-2" style={{ color: '#0f172a' }}>گزارشی یافت نشد</p>
                <p className="text-sm text-slate-600" style={{ color: '#475569' }}>لطفاً فیلترها را تغییر دهید</p>
              </div>
            )}

            {/* Load More */}
            {displayedReports.length > 6 && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={() => setShowMore(!showMore)}
                  className="rounded-xl border border-[var(--border)] bg-white px-6 py-3 text-sm font-semibold transition-all duration-200 hover:border-brand hover:bg-brand/5 hover:text-brand hover:scale-105 sm:rounded-2xl sm:px-8 sm:py-3.5 sm:text-base"
                  style={{ color: '#0f172a' }}
                >
                  {showMore ? "نمایش کمتر" : `مشاهده ${toPersianNumber(displayedReports.length - 6)} گزارش بیشتر`}
                </button>
              </div>
            )}

            {/* View All Link */}
            <div className="flex justify-center pt-4">
              <Link
                href="/fan-club/reports"
                className="rounded-xl border-2 border-[var(--border)] bg-white px-6 py-3 text-sm font-semibold transition-all duration-200 hover:border-brand hover:bg-brand/5 hover:text-brand hover:scale-105 sm:rounded-2xl sm:px-8 sm:py-3.5 sm:text-base"
                style={{ color: '#0f172a' }}
              >
                مشاهده همه گزارش‌ها
              </Link>
            </div>
          </div>
      </section>

      <Footer />
      </div>
    </div>
  );
}
