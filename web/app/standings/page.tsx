import Link from "next/link";
import { PageHero } from "@/components/common/PageHero";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Footer } from "@/components/layout/Footer";
import { StandingsTable } from "@/components/standings/StandingsTable";
import { leagueOptions, standings, standingsSeasons, standingsWeeks, type LeagueKey } from "@/lib/data";

export default function StandingsPage({ searchParams }: { searchParams?: { league?: string; season?: string; week?: string } }) {
  const filters = resolveFilters(searchParams);
  const rows = standings[filters.league];

  return (
    <div className="min-h-screen bg-[var(--background)] font-sans">
      <div className="space-y-6 sm:space-y-8 lg:space-y-10">
        <PageHero eyebrow="جدول لیگ" title="جدول کامل لیگ" subtitle="نمای کامل جدول برای فوتبال، فوتسال و فوتبال ساحلی با امکان انتخاب فصل و هفته" />

        <section className="container space-y-4 sm:space-y-6" dir="rtl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <SectionHeader title="فیلتر جدول" />
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-brand sm:px-5 sm:py-2.5"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              برگشت به خانه
            </Link>
          </div>
          <form className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4" action="/standings">
            <label className="text-sm font-semibold text-slate-900 sm:text-base">
              رشته
              <select
                name="league"
                defaultValue={filters.league}
                className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm text-slate-900 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 sm:mt-2 sm:py-2.5"
              >
                {leagueOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-semibold text-slate-900 sm:text-base">
              فصل
              <select
                name="season"
                defaultValue={filters.season}
                className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm text-slate-900 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 sm:mt-2 sm:py-2.5"
              >
                {standingsSeasons.map((season) => (
                  <option key={season.id} value={season.id}>
                    {season.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-semibold text-slate-900 sm:text-base">
              هفته
              <select
                name="week"
                defaultValue={filters.week}
                className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm text-slate-900 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 sm:mt-2 sm:py-2.5"
              >
                {standingsWeeks.map((week) => (
                  <option key={week.id} value={week.id}>
                    {week.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex items-end sm:col-span-2 lg:col-span-1">
              <button type="submit" className="w-full rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-brand/90 hover:shadow-xl sm:py-3">
                اعمال فیلتر
              </button>
            </div>
          </form>

          <StandingsTable rows={rows} />
        </section>

        <Footer />
      </div>
    </div>
  );
}

function resolveFilters(searchParams?: { league?: string; season?: string; week?: string }) {
  const league = leagueOptions.some((option) => option.id === searchParams?.league) ? (searchParams?.league as LeagueKey) : leagueOptions[0].id;
  const season = standingsSeasons.some((season) => season.id === searchParams?.season) ? (searchParams?.season as string) : standingsSeasons[0].id;
  const week = standingsWeeks.some((week) => week.id === searchParams?.week) ? (searchParams?.week as string) : standingsWeeks[0].id;
  return { league, season, week };
}
