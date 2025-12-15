import Link from "next/link";
import { navigationMenu } from "@/data/navigation";

export function NavMenu() {
  return (
    <nav className="hidden lg:block" aria-label="منوی اصلی">
      <ul className="flex items-center gap-6 text-sm font-semibold text-white/80">
        {navigationMenu.map((item) => (
          <li key={item.title} className="relative">
            {item.children ? (
              <div className="group">
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full px-4 py-2 transition hover:text-white"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <span>{item.title}</span>
                  <svg viewBox="0 0 24 24" className="h-3 w-3" aria-hidden="true">
                    <path
                      d="M6 9.5 12 15l6-5.5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <div className="invisible absolute left-0 top-full z-40 mt-3 w-56 rounded-2xl border border-white/10 bg-[#050f23] p-4 opacity-0 shadow-2xl shadow-black/60 transition-all duration-200 group-hover:visible group-hover:translate-y-1 group-hover:opacity-100">
                  <ul className="space-y-2 text-right text-sm text-white/70">
                    {item.children.map((child) => (
                      <li key={child.title}>
                        <Link
                          href={child.href}
                          className="block rounded-xl px-3 py-2 hover:bg-white/5 hover:text-primary"
                        >
                          {child.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <Link href={item.href ?? "#"} className="rounded-full px-4 py-2 transition hover:text-white">
                {item.title}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
