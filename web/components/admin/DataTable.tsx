"use client";

import React from "react";

export type Column<T> = {
  key: keyof T;
  label: string;
  render?: (row: T) => React.ReactNode;
};

type Props<T> = {
  data: T[];
  columns: readonly Column<T>[];
  keyExtractor: (row: T) => string | number;
};

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
}: Props<T>) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-white">
      <table className="w-full text-sm">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="px-4 py-3 text-right font-semibold text-slate-700"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr
              key={keyExtractor(row)}
              className="border-t hover:bg-slate-50"
            >
              {columns.map((col) => (
                <td key={String(col.key)} className="px-4 py-2">
                  {col.render
                    ? col.render(row)
                    : String(row[col.key] ?? "-")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}