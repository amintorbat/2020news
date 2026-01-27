"use client";

export function FilterBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap gap-3 rounded-xl border bg-white p-4">
      {children}
    </div>
  );
}