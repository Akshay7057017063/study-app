
import { X } from "lucide-react";

function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = "lg",
}) {
  if (!open) {
    return null;
  }

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="
          absolute
          inset-0
          bg-slate-200/60
          backdrop-blur-sm
          transition-opacity
        "
      />

      {/* Modal */}
      <div
        className={`
          relative
          z-10
          w-full
          ${sizes[size]}
          max-h-[90vh]
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-xl
        `}
      >
        {/* Header */}
        <div
          className="
            flex
            items-start
            justify-between
            border-b
            border-slate-200
            px-6
            py-5
          "
        >
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-slate-900">
              {title}
            </h2>

            {description && (
              <p className="mt-1 text-sm leading-6 text-slate-500">
                {description}
              </p>
            )}
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="
              ml-4
              shrink-0
              rounded-xl
              p-2
              text-slate-500
              transition-colors
              hover:bg-slate-100
              hover:text-slate-900
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
              focus:ring-offset-2
              focus:ring-offset-white
            "
          >
            <X size={19} />
          </button>
        </div>

        {/* Content */}
        <div
          className="
            max-h-[calc(90vh-90px)]
            overflow-y-auto
            bg-white
            p-6
          "
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;

