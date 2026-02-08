"use client";

import { cn } from "@/lib/cn";

type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
};

export function Toggle({ checked, onChange, label, className, disabled = false }: ToggleProps) {
  return (
    <label
      className={cn(
        "flex items-center gap-4 w-full min-w-0 py-1.5",
        label ? "flex-row" : "inline-flex w-auto",
        className
      )}
    >
      <div className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform",
            checked ? "translate-x-6 bg-white" : "translate-x-1 bg-slate-400"
          )}
        />
        <span
          className={cn(
            "absolute inset-0 rounded-full transition-colors",
            checked ? "bg-brand" : "bg-slate-300",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        />
      </div>
      {label && (
        <span className="flex-1 min-w-0 text-sm font-medium text-slate-700 text-right">
          {label}
        </span>
      )}
    </label>
  );
}
