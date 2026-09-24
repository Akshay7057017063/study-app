
import Button from "../common/Button";

function PageHeader({
  title,
  description,
  actionLabel,
  onAction,
}) {
  return (
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Title Section */}
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.15em] text-blue-600">
          Management
        </p>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {title}
        </h1>

        {description && (
          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
            {description}
          </p>
        )}
      </div>

      {/* Action */}
      {actionLabel && (
        <Button
          icon="add"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default PageHeader;

