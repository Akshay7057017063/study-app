
import { ArrowUpRight } from "lucide-react";

function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
}) {
  return (
    <div
      className="
        group
        rounded-2xl
        border border-slate-600
        bg-slate-800
        p-5
        shadow-lg
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:border-slate-500
        hover:bg-slate-700
      "
    >
      {/* Top Section */}
      <div className="flex items-start justify-between">
        {/* Icon */}
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 ring-1 ring-inset ring-blue-500/20">
          {Icon && <Icon size={21} />}
        </div>

        {/* Trend */}
        {trend && (
          <div className="flex items-center gap-1 rounded-lg bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400">
            <ArrowUpRight size={13} />
            <span>{trend}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mt-5">
        <p className="text-sm font-medium text-slate-300">
          {title}
        </p>

        <h3 className="mt-1 text-3xl font-bold tracking-tight text-white">
          {value}
        </h3>

        {description && (
          <p className="mt-1 text-xs text-slate-400">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

export default StatCard;

