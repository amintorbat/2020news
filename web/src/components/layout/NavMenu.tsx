"use client";

import Link from "next/link";

export function NavMenu() {
  return (
    <nav className="relative">
      <ul className="flex items-center gap-6 text-sm font-medium">
        {/* همه */}
        <li>
          <Link href="/" className="hover:text-primary">
            همه
          </Link>
        </li>

        {/* فوتسال */}
        <li className="group relative">
          <span className="cursor-pointer hover:text-primary">فوتسال</span>

          <div className="absolute right-0 top-full mt-3 hidden w-56 rounded-lg bg-surface border border-default shadow-lg group-hover:block">
            <ul className="p-3 space-y-2 text-sm">
              <li className="font-semibold text-muted">تیم ملی</li>

              <li>
                <Link
                  href="/futsal/national/news"
                  className="block hover:text-primary"
                >
                  اخبار
                </Link>
              </li>

              <li>
                <Link
                  href="/futsal/national/table"
                  className="block hover:text-primary"
                >
                  جدول
                </Link>
              </li>

              <li>
                <Link
                  href="/futsal/national/scorers"
                  className="block hover:text-primary"
                >
                  گلزنان
                </Link>
              </li>

              <li className="border-t border-default pt-2 mt-2">
                <Link
                  href="/futsal/leagues"
                  className="block hover:text-primary"
                >
                  لیگ‌ها
                </Link>
              </li>
            </ul>
          </div>
        </li>

        {/* فوتبال ساحلی */}
        <li className="group relative">
          <span className="cursor-pointer hover:text-primary">
            فوتبال ساحلی
          </span>

          <div className="absolute right-0 top-full mt-3 hidden w-56 rounded-lg bg-surface border border-default shadow-lg group-hover:block">
            <ul className="p-3 space-y-2 text-sm">
              <li className="font-semibold text-muted">تیم ملی</li>

              <li>
                <Link
                  href="/beach/national/news"
                  className="block hover:text-primary"
                >
                  اخبار
                </Link>
              </li>

              <li>
                <Link
                  href="/beach/national/table"
                  className="block hover:text-primary"
                >
                  جدول
                </Link>
              </li>

              <li>
                <Link
                  href="/beach/national/scorers"
                  className="block hover:text-primary"
                >
                  گلزنان
                </Link>
              </li>
            </ul>
          </div>
        </li>

        {/* لینک‌های ثابت */}
        <li>
          <Link href="/live" className="hover:text-primary">
            لایو
          </Link>
        </li>

        <li>
          <Link href="/table" className="hover:text-primary">
            جدول
          </Link>
        </li>

        <li>
          <Link href="/scorers" className="hover:text-primary">
            گلزنان
          </Link>
        </li>
      </ul>
    </nav>
  );
}
