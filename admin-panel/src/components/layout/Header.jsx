
import {
  Menu,
  Bell,
} from "lucide-react";

function Header({ onMenuClick }) {
  const admin = JSON.parse(
    localStorage.getItem("studyhub_admin") || "null"
  );

  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="
            rounded-xl
            p-2.5
            text-slate-600
            transition-colors
            hover:bg-slate-100
            hover:text-slate-900
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
            lg:hidden
          "
        >
          <Menu size={21} />
        </button>

        {/* Title */}
        <div>
          <p className="text-xs font-semibold tracking-wide text-blue-600">
            STUDYHUB ADMIN
          </p>

          <h2 className="mt-0.5 text-base font-semibold text-slate-900">
            Management Console
          </h2>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          className="
            relative
            rounded-xl
            p-2.5
            text-slate-600
            transition-colors
            hover:bg-slate-100
            hover:text-slate-900
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
          "
        >
          <Bell size={19} />

          {/* Notification Indicator */}
          <span
            aria-hidden="true"
            className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-600"
          />
        </button>

        {/* Admin Profile */}
        <div className="hidden items-center gap-3 border-l border-slate-200 pl-4 sm:flex">
          {/* Avatar */}
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-600/20">
            {admin?.name?.charAt(0)?.toUpperCase() || "A"}
          </div>

          {/* Admin Details */}
          <div>
            <p className="text-sm font-semibold text-slate-900">
              {admin?.name || "Administrator"}
            </p>

            <p className="text-xs capitalize text-slate-500">
              {admin?.role || "admin"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

