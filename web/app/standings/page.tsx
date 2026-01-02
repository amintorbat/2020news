"use client";

import { useState } from "react";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { StandingsTableWithSort, sortOptions, type SortField } from "@/components/standings/StandingsTableWithSort";
import { type CompetitionType } from "@/components/filters/CompetitionTypeFilter";
import { leagueOptions, standings, standingsSeasons, standingsWeeks, type LeagueKey } from "@/lib/data";

type StandingsPageProps = {
  searchParams?: { league?: string; season?: string; week?: string; competitionType?: string };
};

export default function StandingsPage({ searchParams }: StandingsPageProps) {
  const filters = resolveFilters(searchParams);
  const rows = standings[filters.league];
  const [sortBy, setSortBy] = useState<SortField>("points");

  return (
    <div className="min-h-screen bg-[var(--background)] font-sans">
      <div className="space-y-6 sm:space-y-8 lg:space-y-10">
        <section className="container pt-8 sm:pt-12 lg:pt-16 space-y-6 sm:space-y-8" dir="rtl">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl lg:text-2xl">جدول کامل لیگ</h2>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-brand sm:gap-2 sm:rounded-xl sm:px-4 sm:py-2 sm:text-sm"
            >
              <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="hidden sm:inline">برگشت به خانه</span>
              <span className="sm:hidden">بازگشت</span>
            </Link>
          </div>

          <div className="space-y-4">
            <form className="grid gap-4 grid-cols-2 lg:grid-cols-6" action="/standings">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="league-filter" className="text-xs font-semibold text-slate-700 sm:text-sm">
                  لیگ
                </label>
                <select
                  id="league-filter"
                  name="league"
                  defaultValue={filters.league}
                  className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm text-slate-900 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 sm:py-2.5"
                >
                  {leagueOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="season-filter" className="text-xs font-semibold text-slate-700 sm:text-sm">
                  فصل
                </label>
                <select
                  id="season-filter"
                  name="season"
                  defaultValue={filters.season}
                  className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm text-slate-900 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 sm:py-2.5"
                >
                  {standingsSeasons.map((season) => (
                    <option key={season.id} value={season.id}>
                      {season.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="week-filter" className="text-xs font-semibold text-slate-700 sm:text-sm">
                  هفته
                </label>
                <select
                  id="week-filter"
                  name="week"
                  defaultValue={filters.week}
                  className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm text-slate-900 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 sm:py-2.5"
                >
                  {standingsWeeks.map((week) => (
                    <option key={week.id} value={week.id}>
                      {week.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="competition-type-filter" className="text-xs font-semibold text-slate-700 sm:text-sm">
                  نوع مسابقه
                </label>
                <select
                  id="competition-type-filter"
                  name="competitionType"
                  defaultValue={filters.competitionType || "all"}
                  className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm text-slate-900 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 sm:py-2.5"
                >
                  <option value="all">همه</option>
                  <option value="league">لیگ</option>
                  <option value="womens-league">لیگ بانوان</option>
                  <option value="cup">جام</option>
                  <option value="world-cup">جام جهانی</option>
                  <option value="friendly">دوستانه</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="sort-filter" className="text-xs font-semibold text-slate-700 sm:text-sm">
                  مرتب‌سازی بر اساس
                </label>
                <select
                  id="sort-filter"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortField)}
                  className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm text-slate-900 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 sm:py-2.5"
                >
                  {sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5 col-span-2 lg:col-span-1">
                <label className="text-xs font-semibold text-slate-700 sm:text-sm opacity-0">اعمال</label>
                <button type="submit" className="w-full rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-brand/90 hover:shadow-xl sm:py-3">
                  اعمال فیلتر
                </button>
              </div>
            </form>
          </div>

          <div className="mt-6">
            <StandingsTableWithSort rows={rows} sortBy={sortBy} />
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}

function resolveFilters(searchParams?: { league?: string; season?: string; week?: string; competitionType?: string }) {
  const league = leagueOptions.some((option) => option.id === searchParams?.league) ? (searchParams?.league as LeagueKey) : leagueOptions[0].id;
  const season = standingsSeasons.some((season) => season.id === searchParams?.season) ? (searchParams?.season as string) : standingsSeasons[0].id;
  const week = standingsWeeks.some((week) => week.id === searchParams?.week) ? (searchParams?.week as string) : standingsWeeks[0].id;
  const competitionType: CompetitionType | undefined = searchParams?.competitionType && 
    ["all", "league", "womens-league", "cup", "world-cup", "friendly"].includes(searchParams.competitionType)
    ? (searchParams.competitionType as CompetitionType)
    : undefined;
  return { league, season, week, competitionType };
}
