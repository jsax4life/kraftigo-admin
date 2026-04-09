"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  VisibilityState,
  useReactTable
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageSizeOptions?: number[];
};

export function DataTable<TData, TValue>({
  columns,
  data,
  pageSizeOptions = [10, 25, 50]
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const pageSizeDefault = useMemo(
    () =>
      data.length > 0 && data.length < pageSizeOptions[0]
        ? data.length
        : pageSizeOptions[0],
    [data.length, pageSizeOptions]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: pageSizeDefault
      }
    }
  });

  const currentPageRows = table.getRowModel().rows;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
        <span className="text-[10px] uppercase tracking-wide text-slate-500">
          Columns
        </span>
        {table
          .getAllLeafColumns()
          .filter((col) => col.getCanHide?.())
          .map((column) => (
            <label
              key={column.id}
              className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900/80 px-2 py-0.5"
            >
              <input
                type="checkbox"
                className="h-3 w-3 rounded border-slate-600 bg-slate-900 text-emerald-500"
                checked={column.getIsVisible()}
                onChange={(e) => column.toggleVisibility(e.target.checked)}
              />
              <span>{column.id}</span>
            </label>
          ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/70">
        <table className="w-full border-collapse text-xs">
          <thead className="bg-slate-950/90">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="cursor-pointer border-b border-slate-800 px-3 py-2 text-left text-[10px] font-medium uppercase tracking-wide text-slate-400 select-none"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {{
                      asc: " ▲",
                      desc: " ▼"
                    }[header.column.getIsSorted() as string] ?? null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {currentPageRows.length ? (
              currentPageRows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-900/70">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="border-b border-slate-900 px-3 py-2 text-xs text-slate-100"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="h-20 px-3 py-4 text-center text-xs text-slate-400"
                >
                  No results.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-center justify-between gap-2 text-[11px] text-slate-400 sm:flex-row">
        <div className="flex items-center gap-2">
          <span>Rows per page</span>
          <select
            className="h-7 rounded-md border border-slate-700 bg-slate-950 px-2 text-[11px] outline-none focus:border-emerald-400"
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-3">
          <span>
            Page{" "}
            <strong>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount() || 1}
            </strong>
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="rounded-full border border-slate-700 bg-slate-950 px-2 py-1 disabled:opacity-40"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Prev
            </button>
            <button
              type="button"
              className="rounded-full border border-slate-700 bg-slate-950 px-2 py-1 disabled:opacity-40"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

