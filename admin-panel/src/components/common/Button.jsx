
import {
  Loader2,
  Plus,
  Save,
  Trash2,
  Pencil,
  Eye,
} from "lucide-react";

const variants = {
  primary:
    "bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500",

  secondary:
    "border border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700",

  danger:
    "bg-red-600 text-white shadow-lg shadow-red-600/20 hover:bg-red-500",

  ghost:
    "text-slate-300 hover:bg-slate-800 hover:text-white",
};

const icons = {
  add: Plus,
  save: Save,
  delete: Trash2,
  edit: Pencil,
  view: Eye,
};

function Button({
  children,
  variant = "primary",
  type = "button",
  loading = false,
  icon,
  disabled = false,
  onClick,
  className = "",
}) {
  const Icon = icon ? icons[icon] : null;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-xl px-4 py-2.5
        text-sm font-semibold
        transition-all duration-200
        disabled:cursor-not-allowed
        disabled:opacity-50
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500
        focus:ring-offset-2
        focus:ring-offset-slate-900
        ${variants[variant]}
        ${className}
      `}
    >
      {loading ? (
        <Loader2
          size={18}
          className="animate-spin"
        />
      ) : (
        Icon && <Icon size={17} />
      )}

      {loading ? "Please wait..." : children}
    </button>
  );
}

export default Button;

