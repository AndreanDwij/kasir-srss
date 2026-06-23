import { type ReactNode } from "react";

interface Column {
  key: string;
  header: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (item: any) => ReactNode;
  className?: string;
}

interface TableProps {
  columns: Column[];
  data: unknown[];
  onRowClick?: (item: unknown) => void;
}

export default function Table({ columns, data, onRowClick }: TableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-100">
            {columns.map((col) => (
              <th key={col.key} className={`px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider ${col.className ?? ""}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            const row = item as Record<string, unknown>;
            return (
              <tr key={String(row.id ?? index)} onClick={() => onRowClick?.(item)}
                className={`${index % 2 === 0 ? "bg-white" : "bg-slate-50/50"} hover:bg-emerald-50/30 transition-colors ${onRowClick ? "cursor-pointer" : ""}`}>
                {columns.map((col) => (
                  <td key={col.key} className={`px-4 py-3 text-slate-700 ${col.className ?? ""}`}>
                    {col.render ? col.render(item) : (row[col.key] as ReactNode)}
                  </td>
                ))}
              </tr>
            );
          })}
          {data.length === 0 && (
            <tr><td colSpan={columns.length} className="px-4 py-8 text-center text-slate-400">Tidak ada data</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
