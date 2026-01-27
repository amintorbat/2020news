import { cn } from "@/lib/cn";

type PillProps = {
  children: React.ReactNode;
  active?: boolean;
  className?: string;
  onClick?: () => void;
};

export function Pill({ children, active = false, className, onClick }: PillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition-colors",
        active ? "bg-brand text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200",
        className
      )}
    >
      {children}
    </button>
  );
}
