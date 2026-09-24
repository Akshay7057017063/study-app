
import Sidebar from "./Sidebar";

function MobileSidebar({ open, onClose }) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Overlay */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close sidebar"
        className="
          absolute
          inset-0
          bg-slate-200/60
          backdrop-blur-sm
          transition-opacity
        "
      />

      {/* Sidebar */}
      <div className="relative h-full w-72">
        <Sidebar
          mobile={true}
          onClose={onClose}
        />
      </div>
    </div>
  );
}

export default MobileSidebar;

