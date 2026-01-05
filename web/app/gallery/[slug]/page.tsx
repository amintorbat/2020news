import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { getAlbumById, getPhotosByAlbum } from "@/lib/data/gallery";
import { AlbumView } from "@/components/gallery/AlbumView";
import { notFound } from "next/navigation";

type AlbumPageProps = {
  params: { slug: string };
};

export default function AlbumPage({ params }: AlbumPageProps) {
  const album = getAlbumById(params.slug);

  if (!album) {
    notFound();
  }

  const photos = getPhotosByAlbum(album.id);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="space-y-6 sm:space-y-8 lg:space-y-10">
        <section className="container pt-8 sm:pt-12 lg:pt-16" dir="rtl">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/gallery"
                className="mb-2 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-brand transition"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                بازگشت به گالری
              </Link>
              <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl lg:text-4xl">{album.title}</h1>
              <p className="mt-2 text-sm text-slate-600">{album.publishedAt}</p>
            </div>
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

        <section className="container pb-8 sm:pb-12" dir="rtl">
          {photos.length > 0 ? (
            <AlbumView photos={photos} albumTitle={album.title} />
          ) : (
            <div className="rounded-xl border border-dashed border-[var(--border)] bg-white p-8 text-center">
              <p className="text-sm text-slate-600 sm:text-base">تصویری در این آلبوم یافت نشد.</p>
            </div>
          )}
        </section>

        <Footer />
      </div>
    </div>
  );
}

