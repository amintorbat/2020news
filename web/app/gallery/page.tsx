import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { leagueOptions, type LeagueKey } from "@/lib/data";
import { getAllPublicAlbums } from "@/lib/admin/mediaData";
import { AlbumCard } from "@/components/gallery/AlbumCard";

type GalleryPageProps = {
  searchParams?: { sport?: string };
};

export default function GalleryPage({ searchParams }: GalleryPageProps) {
  const selectedSport = leagueOptions.some((option) => option.id === searchParams?.sport)
    ? (searchParams?.sport as LeagueKey)
    : undefined;

  const allAlbums = getAllPublicAlbums();
  const filteredAlbums = selectedSport
    ? allAlbums.filter((album) => album.sport === selectedSport)
    : allAlbums;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="space-y-6 sm:space-y-8 lg:space-y-10">
        <section className="container pt-8 sm:pt-12 lg:pt-16" dir="rtl">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl lg:text-4xl">گالری تصاویر</h1>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              بازگشت به خانه
            </Link>
          </div>
        </section>

        <section className="container" dir="rtl">
          <div className="flex flex-wrap gap-3">
            <Link
              href="/gallery"
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                !selectedSport
                  ? "bg-brand text-white shadow-lg"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              همه
            </Link>
            {leagueOptions.map((option) => (
              <Link
                key={option.id}
                href={`/gallery?sport=${option.id}`}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  selectedSport === option.id
                    ? "bg-brand text-white shadow-lg"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {option.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="container pb-8 sm:pb-12" dir="rtl">
          {filteredAlbums.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {filteredAlbums.map((album) => (
                <AlbumCard key={album.id} album={album} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[var(--border)] bg-white p-8 text-center">
              <p className="text-sm text-slate-600 sm:text-base">آلبومی یافت نشد.</p>
            </div>
          )}
        </section>

        <Footer />
      </div>
    </div>
  );
}

