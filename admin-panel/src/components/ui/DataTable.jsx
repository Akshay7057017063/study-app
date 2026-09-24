
import { Inbox } from "lucide-react";
import Loader from "../common/Loader";

function DataTable({
  columns = [],
  data = [],
  loading = false,
  emptyTitle = "No records found",
  emptyDescription = "There are no records to display.",
}) {
  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900">
        <Loader />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-xl shadow-slate-950/10">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left">
          {/* Table Header */}
          <thead>
            <tr className="border-b border-slate-700 bg-slate-800/70">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {data.length > 0 ? (
              data.map((row, index) => (
                <tr
                  key={row._id || row.id || index}
                  className="border-b border-slate-700/70 last:border-0 transition-colors hover:bg-slate-800/50"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-5 py-4 text-sm text-slate-300"
                    >
                      {column.render
                        ? column.render(row)
                        : row[column.key] ?? "-"}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length || 1}
                  className="px-5 py-16"
                >
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-700 bg-slate-800">
                      <Inbox
                        size={22}
                        className="text-slate-400"
                      />
                    </div>

                    <h3 className="mt-4 text-sm font-semibold text-white">
                      {emptyTitle}
                    </h3>

                    <p className="mt-1 max-w-sm text-xs text-slate-400">
                      {emptyDescription}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;

