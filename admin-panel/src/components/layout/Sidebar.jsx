
import {
  LayoutDashboard,
  University,
  Building2,
  GraduationCap,
  GitBranch,
  CalendarDays,
  BookOpen,
  FileText,
  ClipboardList,
  FlaskConical,
  ScrollText,
  UserCircle,
  LogOut,
  X,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

const menuItems = [
  ["Dashboard", "/dashboard", LayoutDashboard],
  ["Universities", "/universities", University],
  ["Colleges", "/colleges", Building2],
  ["Faculties", "/faculties", GraduationCap],
  ["Courses", "/courses", BookOpen],
  ["Branches", "/branches", GitBranch],
  ["Semesters", "/semesters", CalendarDays],
  ["Subjects", "/subjects", ClipboardList],
  ["Study Materials", "/materials", FileText],
  ["Question Papers", "/question-papers", ScrollText],
  ["Practical Manuals", "/practical-manuals", FlaskConical],
  ["Syllabus", "/syllabus", FileText],
  ["Profile", "/profile", UserCircle],
];

function Sidebar({ mobile = false, onClose }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("studyhub_token");
    localStorage.removeItem("studyhub_admin");

    navigate("/login");
  };

  return (
    <aside
      className="
        flex
        h-full
        w-72
        flex-col
        border-r
        border-slate-200
        bg-white
      "
    >
      {/* =========================
          BRAND
      ========================== */}
      <div
        className="
          flex
          h-20
          items-center
          justify-between
          border-b
          border-slate-200
          px-6
        "
      >
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Study<span className="text-blue-600">Hub</span>
          </h1>

          <p className="mt-1 text-xs text-slate-500">
            Content Management
          </p>
        </div>

        {/* Mobile Close */}
        {mobile && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="
              rounded-xl
              p-2
              text-slate-500
              transition-colors
              hover:bg-slate-100
              hover:text-slate-900
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          >
            <X size={19} />
          </button>
        )}
      </div>

      {/* =========================
          NAVIGATION
      ========================== */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <p
          className="
            mb-3
            px-3
            text-[10px]
            font-bold
            uppercase
            tracking-[0.15em]
            text-slate-400
          "
        >
          Main menu
        </p>

        <div className="space-y-1">
          {menuItems.map(([label, path, Icon]) => (
            <NavLink
              key={path}
              to={path}
              onClick={onClose}
              className={({ isActive }) =>
                `
                  group
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  px-3.5
                  py-2.5
                  text-sm
                  font-medium
                  transition-all
                  duration-200
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500

                  ${
                    isActive
                      ? `
                        bg-blue-600
                        text-white
                        shadow-lg
                        shadow-blue-600/20
                      `
                      : `
                        text-slate-600
                        hover:bg-slate-100
                        hover:text-slate-900
                      `
                  }
                `
              }
            >
              <Icon
                size={18}
                strokeWidth={1.9}
                className="shrink-0"
              />

              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* =========================
          LOGOUT
      ========================== */}
      <div className="border-t border-slate-200 p-4">
        <button
          type="button"
          onClick={handleLogout}
          className="
            flex
            w-full
            items-center
            gap-3
            rounded-xl
            px-3.5
            py-2.5
            text-sm
            font-medium
            text-red-600
            transition-all
            duration-200
            hover:bg-red-50
            hover:text-red-700
            focus:outline-none
            focus:ring-2
            focus:ring-red-500
          "
        >
          <LogOut size={18} />

          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;

