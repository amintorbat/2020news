import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#030816]" dir="rtl">
      <div className="container flex flex-col gap-8 py-10 text-white/70 md:flex-row md:justify-between">
        <div>
          <p className="text-lg font-black text-white">۲۰۲۰نیوز</p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed">
            رسانه تخصصی فوتسال و فوتبال ساحلی با تمرکز بر تحلیل‌های فنی، نتایج زنده و پوشش اختصاصی از باشگاه‌ها و تیم‌های ملی.
          </p>
        </div>
        <div className="grid flex-1 grid-cols-2 gap-6 text-sm">
          <div>
            <p className="text-xs font-bold text-white/50">دسترسی سریع</p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/futsal" className="hover:text-white">
                  اخبار فوتسال
                </Link>
              </li>
              <li>
                <Link href="/matches" className="hover:text-white">
                  برنامه مسابقات
                </Link>
              </li>
              <li>
                <Link href="/league-table" className="hover:text-white">
                  جدول لیگ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold text-white/50">ارتباط با ما</p>
            <ul className="mt-3 space-y-2">
              <li>info@2020news.ir</li>
              <li>۰۲۱-۴۴۴۴۴۴۴</li>
              <li>تهران، بلوار ورزش</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
