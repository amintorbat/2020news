"use client";

/**
 * Reusable Competition Type Filter Component
 * Dropdown select for filtering by competition type
 */

export type CompetitionType = "all" | "league" | "womens-league" | "cup" | "world-cup" | "friendly";

export const competitionTypeOptions = [
  { id: "all" as const, label: "همه" },
  { id: "league" as const, label: "لیگ" },
  { id: "womens-league" as const, label: "لیگ بانوان" },
  { id: "cup" as const, label: "جام" },
  { id: "world-cup" as const, label: "جام جهانی" },
  { id: "friendly" as const, label: "دوستانه" },
];

type CompetitionTypeFilterProps = {
  value: CompetitionType;
  onChange: (value: CompetitionType) => void;
  className?: string;
  label?: string;
  size?: "sm" | "md" | "lg";
};

/**
 * Competition Type Filter Component
 * 
 * @param value - Current selected competition type
 * @param onChange - Callback when selection changes
 * @param className - Additional CSS classes
 * @param label - Custom label (default: "نوع مسابقه")
 * @param size - Size variant (sm, md, lg)
 */
export function CompetitionTypeFilter({
  value,
  onChange,
  className = "",
  label = "نوع مسابقه",
  size = "md",
}: CompetitionTypeFilterProps) {
  const sizeClasses = {
    sm: "px-2.5 py-1.5 text-xs sm:px-3 sm:py-2 sm:text-sm",
    md: "px-3 py-2 text-sm sm:py-2.5",
    lg: "px-4 py-2.5 text-sm sm:py-3",
  };

  const selectHeight = size === "sm" ? "h-[38px] sm:h-[42px]" : size === "md" ? "h-[42px]" : "h-[44px]";
  
  return (
    <label className={`flex flex-col gap-1 text-xs font-semibold text-slate-900 sm:text-sm ${className}`} dir="rtl">
      <span className="h-5 flex items-center">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as CompetitionType)}
        className={`w-full rounded-lg border border-[var(--border)] bg-white text-slate-900 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 ${sizeClasses[size]} ${selectHeight}`}
      >
        {competitionTypeOptions.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

