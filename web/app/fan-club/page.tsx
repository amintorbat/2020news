export const dynamic = "force-static";

import { Footer } from "@/components/layout/Footer";

export default function FanClubPage() {
  const features = [
    {
      icon: "🏆",
      title: "امتیاز هواداری",
      description: "با فعالیت در باشگاه هواداری امتیاز کسب کنید و در رتبه‌بندی هواداران قرار بگیرید",
    },
    {
      icon: "📊",
      title: "مشارکت در نظرسنجی‌ها",
      description: "در نظرسنجی‌های تخصصی فوتسال و فوتبال ساحلی شرکت کنید و نظر خود را ابراز کنید",
    },
    {
      icon: "✍️",
      title: "ارسال گزارش مردمی",
      description: "گزارش‌های میدانی و تحلیلی خود را با جامعه هواداران به اشتراک بگذارید",
    },
    {
      icon: "💬",
      title: "گفتگوهای تخصصی",
      description: "در بحث‌های تخصصی با کارشناسان و هواداران دیگر شرکت کنید",
    },
    {
      icon: "⭐",
      title: "دسترسی ویژه",
      description: "دسترسی به محتوای اختصاصی، مصاحبه‌ها و گزارش‌های ویژه برای اعضای باشگاه",
    },
    {
      icon: "🎙️",
      title: "فرصت حضور در پادکست",
      description: "بهترین اعضا فرصت حضور در پادکست‌های اختصاصی ۲۰۲۰ نیوز را خواهند داشت",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="space-y-8 sm:space-y-12 md:space-y-16 lg:space-y-20">
        {/* Hero Section */}
        <section className="container pt-8 sm:pt-12 md:pt-16 lg:pt-20" dir="rtl">
          <div className="rounded-2xl sm:rounded-3xl border border-[var(--border)] bg-gradient-to-br from-brand/10 via-white to-brand/5 p-6 shadow-lg sm:p-8 md:p-10 lg:p-12">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 rounded-full bg-gradient-to-br from-brand/20 to-brand/10 flex items-center justify-center text-2xl sm:text-3xl md:text-4xl font-bold text-brand">
                    باش
                  </div>
                  <div>
                  <p className="text-sm sm:text-base font-semibold text-brand mb-1" style={{ color: "#0b6efd" }}>
                      باشگاه هواداری
                    </p>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900" style={{ color: "#0f172a" }}>
                    باشگاه هواداری ۲۰۲۰ نیوز
                    </h1>
                </div>
              </div>
              <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed text-slate-700" style={{ color: "#334155" }}>
                پلتفرم پیشرفته هواداری برای فوتسال و فوتبال ساحلی. به زودی با امکانات ویژه و منحصر به فرد در خدمت شما خواهیم بود.
              </p>
            </div>
          </div>
        </section>

        {/* Feature Preview Section */}
        <section className="container" dir="rtl">
          <div className="space-y-6 sm:space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900" style={{ color: "#0f172a" }}>
                ویژگی‌های باشگاه هواداری
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto" style={{ color: "#475569" }}>
                امکانات و فرصت‌های ویژه که به زودی در دسترس شما قرار خواهد گرفت
              </p>
            </div>
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm sm:rounded-3xl sm:p-6 md:p-8 opacity-60"
                  dir="rtl"
                >
                  {/* Coming Soon Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-flex items-center rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand sm:text-sm">
                      به‌زودی
                    </span>
                  </div>

                  <div className="text-4xl sm:text-5xl md:text-6xl opacity-50">{feature.icon}</div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-900 sm:text-xl md:text-2xl" style={{ color: "#0f172a" }}>
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-600 sm:text-base leading-relaxed" style={{ color: "#475569" }}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Informational Section */}
        <section className="container" dir="rtl">
          <div className="rounded-2xl sm:rounded-3xl border border-[var(--border)] bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm sm:p-8 md:p-10 lg:p-12">
            <div className="max-w-3xl mx-auto space-y-6 text-center">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900" style={{ color: "#0f172a" }}>
                درباره باشگاه هواداری
                </h2>
              <div className="space-y-4 text-sm sm:text-base md:text-lg leading-relaxed text-slate-700" style={{ color: "#334155" }}>
                <p>
                  باشگاه هواداری ۲۰۲۰ نیوز با هدف ایجاد یک جامعه فعال و پویا از هواداران فوتسال و فوتبال ساحلی طراحی شده است. ما معتقدیم که رسانه ورزشی باید توسط جامعه و برای جامعه باشد.
                </p>
                <p>
                  در باشگاه هواداری، کیفیت بر کمیت اولویت دارد. ما به دنبال ایجاد فضایی هستیم که در آن هواداران بتوانند محتوای باکیفیت تولید کنند، با یکدیگر تعامل داشته باشند و در رشد و توسعه رسانه ورزشی نقش داشته باشند.
                </p>
                <p>
                  این پلتفرم به زودی با امکانات کامل و منحصر به فرد در دسترس شما قرار خواهد گرفت. منتظر خبرهای خوب باشید!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Disabled CTA Section */}
        <section className="container pb-8 sm:pb-12 md:pb-16" dir="rtl">
          <div className="flex justify-center">
                      <button
              disabled
              className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-400 bg-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 cursor-not-allowed opacity-75 sm:rounded-2xl sm:px-8 sm:py-3.5 sm:text-base"
              style={{ color: "#334155", borderColor: "#94a3b8", backgroundColor: "#e2e8f0" }}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              به‌زودی فعال می‌شود
                </button>
          </div>
      </section>

      <Footer />
      </div>
    </div>
  );
}
