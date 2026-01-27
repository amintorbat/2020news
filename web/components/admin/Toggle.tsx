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
    <label className={cn("inline-flex items-center gap-2", className)}>
      <div className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
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
      {label && <span className="text-sm font-medium text-slate-700">{label}</span>}
    </label>
  );
}
