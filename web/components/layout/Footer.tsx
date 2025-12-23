import Image from "next/image";
import Link from "next/link";
import { navigationMenu } from "@/lib/data";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-[var(--border)] bg-[#f7f8fa]">
      <div className="container grid gap-8 py-12 md:grid-cols-[2fr,1fr,1fr]">
        <div className="space-y-3">
          <p className="text-xl font-extrabold text-[var(--foreground)]">۲۰۲۰نیوز</p>
          <p className="text-sm leading-7 text-[var(--muted)]">
            پوشش لحظه‌ای اخبار، تحلیل‌ها و گزارش‌های اختصاصی از دنیای فوتسال و فوتبال ساحلی ایران. هدف ما ارائه تجربه رسانه‌ای دقیق، سریع و حرفه‌ای برای هواداران این رشته‌ها است.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-[var(--foreground)]">دسترسی سریع</p>
          <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
            {navigationMenu.map((item) => (
              <li key={item.title}>
                <Link href={item.href} className="transition hover:text-brand">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2 text-sm text-[var(--muted)]">
          <p className="text-sm font-semibold text-[var(--foreground)]">راه‌های ارتباطی</p>
          <p>info@2020news.ir</p>
          <p>۰۲۱-۴۴۴۴۴۴۴</p>
          <p>تهران، بلوار ورزش</p>
        </div>
      </div>

      <div className="border-t border-[var(--border)] bg-white py-4">
        <div className="container flex flex-col items-center gap-3 text-center text-xs text-[var(--muted)] sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} تمامی حقوق محفوظ است.</span>
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
            <a href="https://www.torbatesfahaniagency.ir/" target="_blank" rel="noreferrer" className="text-brand text-sm font-semibold underline-offset-4 hover:underline">
              توسعه توسط Torbat Esfahani Agency
            </a>
            <a href="https://e-rasaneh.ir/Certificate/87565" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[var(--muted)]">
              <Image
                src="https://trustseal.e-rasaneh.ir/logo.aspx?id=87565&p=1"
                alt="گواهی رسانه دیجیتال"
                width={72}
                height={72}
                unoptimized
                className="h-12 w-12 rounded-full border border-[var(--border)] object-contain"
              />
              <span>گواهی رسانه دیجیتال</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
