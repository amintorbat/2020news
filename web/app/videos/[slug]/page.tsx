import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { getVideoById } from "@/lib/data/videos";
import { notFound } from "next/navigation";

type VideoPageProps = {
  params: { slug: string };
};

export default function VideoPage({ params }: VideoPageProps) {
  const video = getVideoById(params.slug);

  if (!video) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="space-y-6 sm:space-y-8 lg:space-y-10">
        <section className="container pt-8 sm:pt-12 lg:pt-16" dir="rtl">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/videos"
                className="mb-2 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-brand transition"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                بازگشت به ویدیوها
              </Link>
              <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl lg:text-4xl">{video.title}</h1>
              <p className="mt-2 text-sm text-slate-600">{video.publishedAt}</p>
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
          <div className="rounded-xl border border-[var(--border)] bg-white p-4 sm:p-6">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-slate-900">
              <video
                src={video.videoUrl}
                controls
                className="h-full w-full"
                poster={video.thumbnailUrl}
              >
                مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
              </video>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}

