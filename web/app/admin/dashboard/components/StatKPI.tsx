type StatKPIProps = {
  title: string;
  value: number;
  icon?: string;
  trend?: string;
};

export default function StatKPI({ title, value, icon, trend }: StatKPIProps) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-white p-4 sm:p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-slate-600 truncate">{title}</p>
          <div className="mt-2 sm:mt-3 flex items-baseline gap-2">
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">{value.toLocaleString("fa-IR")}</p>
            {trend && (
              <span className="text-xs font-semibold text-green-600">{trend}</span>
            )}
          </div>
        </div>
        {icon && (
          <div className="text-2xl sm:text-3xl opacity-60 flex-shrink-0 mr-2 sm:mr-0">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}