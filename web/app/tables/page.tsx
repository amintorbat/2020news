import Link from "next/link";
import { PageHero } from "@/components/common/PageHero";
import { Footer } from "@/components/layout/Footer";
import { leagueTables, tableSeasons, tableWeeks } from "@/data/mock/tables";
import { cn } from "@/lib/cn";

const typeOptions = [
  { id: "futsal", label: "لیگ برتر فوتسال" },
  { id: "beach", label: "لیگ برتر فوتبال ساحلی" },
] as const;

type SportType = (typeof typeOptions)[number]["id"];

type TablesPageProps = {
  searchParams?: { type?: string; season?: string; week?: string };
};

type TableFilters = {
  type: SportType;
  season: string;
  week: string;
};

export default function LeagueTablePage({ searchParams }: TablesPageProps) {
  const filters = resolveTableFilters(searchParams);
  const rows = leagueTables[filters.type];

  const buildHref = (overrides: Partial<TableFilters>) => {
    const params = new URLSearchParams({
      type: overrides.type ?? filters.type,
      season: overrides.season ?? filters.season,
      week: overrides.week ?? filters.week,
    });
    return `/tables?${params.toString()}`;
  };

  return (
    <div className="space-y-10">
      <PageHero
        eyebrow="جدول لیگ"
        title="جدول لحظه‌ای تیم‌ها"
        subtitle="نمای کامل جدول برای فوتسال و فوتبال ساحلی با امکان انتخاب فصل و هفته برای تحلیل دقیق‌تر"
      />

      <section className="container space-y-8" dir="rtl">
        <div className="flex flex-wrap gap-3">
          {typeOptions.map((option) => (
            <Link
              key={option.id}
              href={buildHref({ type: option.id })}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-semibold transition",
                filters.type === option.id ? "bg-brand text-white shadow-lg" : "bg-[#f5f6f8] text-[var(--muted)] hover:text-brand"
              )}
            >
              {option.label}
            </Link>
          ))}
        </div>

        <form className="grid gap-4 md:grid-cols-3" action="/tables">
          <input type="hidden" name="type" value={filters.type} />
          <label className="text-sm font-semibold text-[var(--foreground)]">
            فصل
            <select
              name="season"
              defaultValue={filters.season}
              className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--muted)] focus:border-brand focus:outline-none"
            >
              {tableSeasons.map((season) => (
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
              {tableWeeks.map((week) => (
                <option key={week.id} value={week.id}>
                  {week.label}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg">
            به‌روزرسانی جدول
          </button>
        </form>

        <div className="rounded-3xl border border-[var(--border)] bg-white p-4 shadow-card">
          <div className="hidden md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-[var(--muted)]">
                  <th className="py-3 text-center font-semibold">رتبه</th>
                  <th className="py-3 text-right font-semibold">تیم</th>
                  <th className="py-3 text-center font-semibold">بازی</th>
                  <th className="py-3 text-center font-semibold">برد</th>
                  <th className="py-3 text-center font-semibold">امتیاز</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.team} className="border-t border-[var(--border)]">
                    <td className="py-3 text-center text-xs text-[var(--muted)]">{row.rank}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f2f4f7] text-xs font-bold text-brand">
                          {row.team.slice(0, 2)}
                        </span>
                        <span className="font-semibold text-[var(--foreground)]">{row.team}</span>
                      </div>
                    </td>
                    <td className="py-3 text-center text-sm text-[var(--muted)]">{row.played}</td>
                    <td className="py-3 text-center text-sm text-[var(--muted)]">{row.wins}</td>
                    <td className="py-3 text-center text-sm font-semibold text-brand">{row.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 md:hidden">
            {rows.map((row) => (
              <div key={row.team} className="rounded-2xl border border-[var(--border)] bg-[#f7f8fa] p-4">
                <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                  <span>رتبه {row.rank}</span>
                  <span className="font-bold text-brand">{row.points} امتیاز</span>
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xs font-bold text-brand">
                    {row.team.slice(0, 2)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[var(--foreground)]">{row.team}</p>
                    <p className="text-xs text-[var(--muted)]">
                      بازی {row.played} • برد {row.wins}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function resolveTableFilters(searchParams?: TablesPageProps["searchParams"]): TableFilters {
  const type = typeOptions.some((option) => option.id === searchParams?.type) ? (searchParams?.type as SportType) : typeOptions[0].id;
  const season = tableSeasons.some((item) => item.id === searchParams?.season) ? (searchParams?.season as string) : tableSeasons[0].id;
  const week = tableWeeks.some((item) => item.id === searchParams?.week) ? (searchParams?.week as string) : tableWeeks[0].id;

  return { type, season, week };
}
