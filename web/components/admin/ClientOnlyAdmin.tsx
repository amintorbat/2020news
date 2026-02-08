"use client";

import { useState, useEffect, type ReactNode } from "react";

/**
 * Renders children only on the client after mount.
 * Avoids "e[o] is not a function" and similar SSR issues when admin code
 * uses localStorage, context, or other client-only APIs during initial render.
 */
export function ClientOnlyAdmin({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50" dir="rtl">
        <p className="text-sm text-slate-500">در حال بارگذاری پنل...</p>
      </div>
    );
  }

  return <>{children}</>;
}
