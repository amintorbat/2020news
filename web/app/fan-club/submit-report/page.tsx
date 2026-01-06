"use client";

import { useState } from "react";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";

export default function SubmitReportPage() {
  const [contentType, setContentType] = useState<"report" | "editorial">("report");
  const [sport, setSport] = useState<"futsal" | "beach">("futsal");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo submission - just show success message
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setTitle("");
      setContent("");
      setImageFile(null);
    }, 3000);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <div className="container pt-8 sm:pt-12 lg:pt-16" dir="rtl">
          <div className="mx-auto max-w-2xl">
            <div className="rounded-3xl border border-green-200 bg-green-50 p-8 text-center shadow-lg sm:p-12">
              <div className="mb-6 text-6xl">✅</div>
              <h2 className="mb-4 text-2xl font-extrabold text-green-800 sm:text-3xl">گزارش شما با موفقیت ارسال شد!</h2>
              <p className="mb-8 text-base text-green-700 sm:text-lg">
                گزارش شما در حال بررسی است و پس از تأیید در سایت منتشر خواهد شد.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/fan-club"
                  className="rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-brand/90 hover:shadow-xl sm:rounded-2xl sm:px-8 sm:py-3.5 sm:text-base"
                >
                  بازگشت به باشگاه هواداری
                </Link>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="rounded-xl border border-[var(--border)] bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand hover:bg-slate-50 hover:text-brand sm:rounded-2xl sm:px-8 sm:py-3.5 sm:text-base"
                >
                  ارسال گزارش دیگر
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
              <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">ارسال گزارش</h1>
              <p className="mt-2 text-sm sm:text-base" style={{ color: '#334155' }}>
                گزارش یا یادداشت خود را ارسال کنید و در رتبه‌بندی هواداران شرکت کنید
              </p>
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="container pb-8 sm:pb-12" dir="rtl">
          <div className="mx-auto max-w-3xl">
            <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-[var(--border)] bg-white p-6 shadow-card sm:p-8 md:p-10">
              {/* Content Type Selector */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold sm:text-base" style={{ color: '#0f172a' }}>نوع محتوا</label>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => setContentType("report")}
                    className={`rounded-xl border-2 p-4 text-center transition sm:rounded-2xl sm:p-5 ${
                      contentType === "report"
                        ? "border-brand bg-brand/5"
                        : "border-[var(--border)] bg-white hover:border-brand/50"
                    }`}
                    style={contentType === "report" ? { color: '#0b6efd' } : { color: '#1e293b' }}
                  >
                    <div className="mb-2 text-2xl sm:text-3xl">📝</div>
                    <div className="text-sm font-semibold sm:text-base" style={{ color: contentType === "report" ? '#0b6efd' : '#1e293b', fontWeight: '600' }}>گزارش سریع</div>
                    <div className="mt-1 text-xs sm:text-sm" style={{ color: contentType === "report" ? '#1d4ed8' : '#475569', fontWeight: '500' }}>گزارش میدانی و تحلیلی</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setContentType("editorial")}
                    className={`rounded-xl border-2 p-4 text-center transition sm:rounded-2xl sm:p-5 ${
                      contentType === "editorial"
                        ? "border-brand bg-brand/5"
                        : "border-[var(--border)] bg-white hover:border-brand/50"
                    }`}
                    style={contentType === "editorial" ? { color: '#0b6efd' } : { color: '#1e293b' }}
                  >
                    <div className="mb-2 text-2xl sm:text-3xl">✍️</div>
                    <div className="text-sm font-semibold sm:text-base" style={{ color: contentType === "editorial" ? '#0b6efd' : '#1e293b', fontWeight: '600' }}>یادداشت</div>
                    <div className="mt-1 text-xs sm:text-sm" style={{ color: contentType === "editorial" ? '#1d4ed8' : '#475569', fontWeight: '500' }}>نظر و تحلیل شخصی</div>
                  </button>
                </div>
              </div>

              {/* Sport Selector */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold sm:text-base" style={{ color: '#0f172a' }}>ورزش</label>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => setSport("futsal")}
                    className={`rounded-xl border-2 p-4 text-center transition sm:rounded-2xl sm:p-5 ${
                      sport === "futsal"
                        ? "border-brand bg-brand/5"
                        : "border-[var(--border)] bg-white hover:border-brand/50"
                    }`}
                  >
                    <div className="text-sm font-semibold sm:text-base" style={{ color: sport === "futsal" ? '#0b6efd' : '#1e293b' }}>فوتسال</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSport("beach")}
                    className={`rounded-xl border-2 p-4 text-center transition sm:rounded-2xl sm:p-5 ${
                      sport === "beach"
                        ? "border-brand bg-brand/5"
                        : "border-[var(--border)] bg-white hover:border-brand/50"
                    }`}
                  >
                    <div className="text-sm font-semibold sm:text-base" style={{ color: sport === "beach" ? '#0b6efd' : '#1e293b' }}>فوتبال ساحلی</div>
                  </button>
                </div>
              </div>

              {/* Title Input */}
              <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-semibold sm:text-base" style={{ color: '#0f172a' }}>
                  عنوان
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 sm:rounded-2xl sm:px-5 sm:py-3.5 sm:text-base"
                  placeholder="عنوان گزارش یا یادداشت خود را وارد کنید"
                  style={{ 
                    color: '#0f172a',
                  }}
                />
              </div>

              {/* Content Textarea */}
              <div className="space-y-2">
                <label htmlFor="content" className="block text-sm font-semibold sm:text-base" style={{ color: '#0f172a' }}>
                  محتوا
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  rows={12}
                  className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 sm:rounded-2xl sm:px-5 sm:py-3.5 sm:text-base"
                  placeholder="متن گزارش یا یادداشت خود را اینجا بنویسید..."
                  style={{ color: '#0f172a' }}
                />
                <p className="text-xs sm:text-sm" style={{ color: '#334155', fontWeight: '600' }}>حداقل ۲۰۰ کاراکتر</p>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label htmlFor="image" className="block text-sm font-semibold sm:text-base" style={{ color: '#0f172a' }}>
                  تصویر (اختیاری)
                </label>
                <div className="rounded-xl border-2 border-dashed border-[var(--border)] p-6 transition hover:border-brand/50 sm:rounded-2xl sm:p-8">
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="image"
                    className="flex cursor-pointer flex-col items-center justify-center gap-3 text-center"
                  >
                    <div className="text-4xl sm:text-5xl">📷</div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold sm:text-base" style={{ color: '#1e293b', fontWeight: '600' }}>
                        {imageFile ? imageFile.name : "برای آپلود تصویر کلیک کنید"}
                      </p>
                      <p className="text-xs sm:text-sm" style={{ color: '#334155', fontWeight: '600' }}>فرمت‌های مجاز: JPG, PNG, GIF (حداکثر ۵ مگابایت)</p>
                    </div>
                  </label>
                </div>
                {imageFile && (
                  <button
                    type="button"
                    onClick={() => setImageFile(null)}
                    className="text-xs text-red-600 hover:text-red-700 sm:text-sm"
                  >
                    حذف تصویر
                  </button>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  type="submit"
                  disabled={!title || content.length < 200}
                  className="flex-1 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-brand/90 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 sm:rounded-2xl sm:px-8 sm:py-3.5 sm:text-base"
                >
                  ارسال گزارش
                </button>
                <Link
                  href="/fan-club"
                  className="rounded-xl border border-[var(--border)] bg-white px-6 py-3 text-sm font-semibold transition hover:border-brand hover:bg-slate-50 hover:text-brand sm:rounded-2xl sm:px-8 sm:py-3.5 sm:text-base"
                  style={{ color: '#1e293b' }}
                >
                  انصراف
                </Link>
              </div>
            </form>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}

