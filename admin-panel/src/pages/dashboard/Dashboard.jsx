
import {
  ArrowUpRight,
  BookOpen,
  Building2,
  FileText,
  GraduationCap,
  Inbox,
  Plus,
} from "lucide-react";

// Dashboard statistics
const defaultStats = [
  {
    label: "Universities",
    value: 1,
    href: "/universities",
    icon: GraduationCap,
    tone: "bg-blue-50 text-blue-600 ring-blue-100",
  },
  {
    label: "Colleges",
    value: 1,
    href: "/colleges",
    icon: Building2,
    tone: "bg-violet-50 text-violet-600 ring-violet-100",
  },
  {
    label: "Subjects",
    value: 1,
    href: "/subjects",
    icon: BookOpen,
    tone: "bg-emerald-50 text-emerald-600 ring-emerald-100",
  },
  {
    label: "Materials",
    value: 1,
    href: "/materials",
    icon: FileText,
    tone: "bg-amber-50 text-amber-600 ring-amber-100",
  },
];

// Quick actions
const quickActions = [
  {
    label: "Add university",
    href: "/universities/new",
    icon: GraduationCap,
  },
  {
    label: "Add college",
    href: "/colleges/new",
    icon: Building2,
  },
  {
    label: "Add subject",
    href: "/subjects/new",
    icon: BookOpen,
  },
  {
    label: "Upload material",
    href: "/materials/new",
    icon: FileText,
  },
];

// recentMaterials:
// [{ id, title, subject, createdAt, href }]

function Dashboard({
  stats = defaultStats,
  recentMaterials = [],
}) {
  return (
    <div className="space-y-6">
      {/* =========================
          PAGE HEADER
      ========================== */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.15em] text-blue-600">
            Overview
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Dashboard
          </h1>

          <p className="mt-1.5 text-sm text-slate-500">
            Welcome back. Here is what is in your study library.
          </p>
        </div>

        {/* Upload Button */}
        <a
          href="/materials/new"
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-blue-600
            px-4
            py-2.5
            text-sm
            font-semibold
            text-white
            shadow-lg
            shadow-blue-600/20
            transition-all
            duration-200
            hover:bg-blue-700
            hover:shadow-blue-600/30
            focus-visible:outline-none
            focus-visible:ring-4
            focus-visible:ring-blue-600/20
          "
        >
          <Plus size={18} />
          Upload material
        </a>
      </div>

      {/* =========================
          STAT CARDS
      ========================== */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(
          ({ label, value, href, icon: Icon, tone }) => (
            <a
              key={label}
              href={href}
              className="
                group
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:border-slate-300
                hover:shadow-md
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-blue-600
              "
            >
              {/* Top */}
              <div className="flex items-start justify-between">
                {/* Icon */}
                <div
                  className={`
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    ring-1
                    ring-inset
                    ${tone}
                  `}
                >
                  <Icon size={20} />
                </div>

                {/* Arrow */}
                <ArrowUpRight
                  size={18}
                  className="
                    text-slate-300
                    transition-colors
                    group-hover:text-blue-600
                  "
                />
              </div>

              {/* Value */}
              <p className="mt-5 text-3xl font-bold tracking-tight text-slate-900">
                {value}
              </p>

              {/* Label */}
              <p className="mt-1 text-sm font-medium text-slate-500">
                {label}
              </p>
            </a>
          )
        )}
      </div>

      {/* =========================
          LOWER SECTION
      ========================== */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* =========================
            RECENT MATERIALS
        ========================== */}
        <section
          className="
            overflow-hidden
            rounded-2xl
            border
            border-slate-200
            bg-white
            shadow-sm
            lg:col-span-2
          "
        >
          {/* Section Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Recent materials
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Latest content added to your library
              </p>
            </div>

            <a
              href="/materials"
              className="
                rounded-lg
                px-2
                py-1
                text-sm
                font-medium
                text-blue-600
                transition-colors
                hover:bg-blue-50
                hover:text-blue-700
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-blue-500
              "
            >
              View all
            </a>
          </div>

          {/* Empty State */}
          {recentMaterials.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-14 text-center">
              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  text-slate-400
                "
              >
                <Inbox size={22} />
              </div>

              <p className="mt-4 font-medium text-slate-800">
                No materials uploaded yet
              </p>

              <p className="mt-1 max-w-xs text-sm leading-6 text-slate-500">
                Upload your first notes or question paper and it
                will show up here.
              </p>

              <a
                href="/materials/new"
                className="
                  mt-5
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-3.5
                  py-2
                  text-sm
                  font-medium
                  text-slate-700
                  shadow-sm
                  transition-colors
                  hover:bg-slate-50
                  hover:text-slate-900
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-blue-500
                "
              >
                <Plus size={16} />
                Upload material
              </a>
            </div>
          ) : (
            <ul className="divide-y divide-slate-200">
              {recentMaterials.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href || "#"}
                    className="
                      flex
                      items-center
                      gap-4
                      px-6
                      py-4
                      transition-colors
                      hover:bg-slate-50
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-inset
                      focus-visible:ring-blue-500
                    "
                  >
                    {/* File Icon */}
                    <div
                      className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-slate-200
                        bg-slate-50
                        text-slate-500
                      "
                    >
                      <FileText size={18} />
                    </div>

                    {/* Material Details */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-800">
                        {item.title}
                      </p>

                      <p className="mt-0.5 truncate text-sm text-slate-500">
                        {item.subject}
                      </p>
                    </div>

                    {/* Date */}
                    {item.createdAt && (
                      <span className="hidden shrink-0 text-sm text-slate-400 sm:block">
                        {item.createdAt}
                      </span>
                    )}

                    {/* Arrow */}
                    <ArrowUpRight
                      size={16}
                      className="hidden text-slate-300 sm:block"
                    />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* =========================
            QUICK ACTIONS
        ========================== */}
        <section
          className="
            overflow-hidden
            rounded-2xl
            border
            border-slate-200
            bg-white
            shadow-sm
          "
        >
          {/* Header */}
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-base font-semibold text-slate-900">
              Quick actions
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              Manage your study library
            </p>
          </div>

          {/* Actions */}
          <ul className="space-y-1 p-3">
            {quickActions.map(
              ({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="
                      group
                      flex
                      items-center
                      gap-3
                      rounded-xl
                      px-3
                      py-3
                      text-sm
                      font-medium
                      text-slate-700
                      transition-colors
                      hover:bg-slate-50
                      hover:text-slate-900
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-blue-500
                    "
                  >
                    {/* Action Icon */}
                    <span
                      className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        border
                        border-slate-200
                        bg-slate-50
                        text-slate-500
                        transition-colors
                        group-hover:border-blue-200
                        group-hover:bg-blue-50
                        group-hover:text-blue-600
                      "
                    >
                      <Icon size={18} />
                    </span>

                    {/* Label */}
                    <span>{label}</span>

                    {/* Plus */}
                    <Plus
                      size={16}
                      className="
                        ml-auto
                        text-slate-300
                        transition-colors
                        group-hover:text-blue-600
                      "
                    />
                  </a>
                </li>
              )
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;

