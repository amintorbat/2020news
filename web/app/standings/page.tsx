import { PageHero } from "@/components/common/PageHero";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Footer } from "@/components/layout/Footer";
import { StandingsTable } from "@/components/standings/StandingsTable";
import { leagueOptions, standings, standingsSeasons, standingsWeeks, type LeagueKey } from "@/lib/data";

export default function StandingsPage({ searchParams }: { searchParams?: { league?: string; season?: string; week?: string } }) {
  const filters = resolveFilters(searchParams);
  const rows = standings[filters.league];

  return (
    <div className="space-y-10">
      <PageHero eyebrow="جدول لیگ" title="استندینگ کامل لیگ‌ها" subtitle="نمای کامل جدول برای فوتبال، فوتسال و فوتبال ساحلی با امکان انتخاب فصل و هفته" />

      <section className="container space-y-6" dir="rtl">
        <SectionHeader title="فیلتر جدول" />
        <form className="grid gap-4 md:grid-cols-4" action="/standings">
          <label className="text-sm font-semibold text-[var(--foreground)]">
            لیگ
            <select
              name="league"
              defaultValue={filters.league}
              className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--muted)] focus:border-brand focus:outline-none"
            >
              {leagueOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold text-[var(--foreground)]">
            فصل
            <select
              name="season"
              defaultValue={filters.season}
              className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--muted)] focus:border-brand focus:outline-none"
            >
              {standingsSeasons.map((season) => (
                <option key={season.id} value={season.id}>
                  {season.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold text-[var(--foreground)]">
            هفته
            <select
              name="week"
              defaultValue={filters.week}
              className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--muted)] focus:border-brand focus:outline-none"
            >
              {standingsWeeks.map((week) => (
                <option key={week.id} value={week.id}>
                  {week.label}
                </option>
              ))}
            </select>
          </label>
          <div className="flex items-end">
            <button type="submit" className="w-full rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-white shadow-lg">
              اعمال فیلتر
            </button>
          </div>
        </form>

        <StandingsTable rows={rows} />
      </section>

      <Footer />
    </div>
  );
}

function resolveFilters(searchParams?: { league?: string; season?: string; week?: string }) {
  const league = leagueOptions.some((option) => option.id === searchParams?.league) ? (searchParams?.league as LeagueKey) : leagueOptions[0].id;
  const season = standingsSeasons.some((season) => season.id === searchParams?.season) ? (searchParams?.season as string) : standingsSeasons[0].id;
  const week = standingsWeeks.some((week) => week.id === searchParams?.week) ? (searchParams?.week as string) : standingsWeeks[0].id;
  return { league, season, week };
}
