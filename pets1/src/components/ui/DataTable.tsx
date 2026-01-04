"use client";

import { ReactNode } from "react";
import StatusBadge from "./StatusBadge";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => ReactNode;
  className?: string;
}

export interface Action<T> {
  label: string;
  onClick: (item: T) => void;
  variant?: "primary" | "secondary" | "danger";
  icon?: ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: Action<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
}

export default function DataTable<T extends { id: string }>({
  data,
  columns,
  actions,
  isLoading = false,
  emptyMessage = "No data available",
  onRowClick,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 rounded"></div>
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-2">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
          </svg>
        </div>
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  const getCellValue = (item: T, column: Column<T>) => {
    if (column.render) {
      return column.render(item);
    }
    
    const value = item[column.key as keyof T];
    
    // Handle status fields automatically
    if (column.key.toString().includes("status")) {
      return <StatusBadge status={value as any} size="sm" />;
    }
    
    // Handle dates
    if (value instanceof Date) {
      return value.toLocaleDateString();
    }
    
    // Handle booleans
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }
    
    return value as ReactNode;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key.toString()}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.className || ""}`}
              >
                {column.header}
              </th>
            ))}
            {actions && actions.length > 0 && (
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => (
            <tr
              key={item.id}
              onClick={() => onRowClick && onRowClick(item)}
              className={onRowClick ? "hover:bg-gray-50 cursor-pointer" : ""}
            >
              {columns.map((column) => (
                <td
                  key={`${item.id}-${column.key.toString()}`}
                  className={`px-6 py-4 whitespace-nowrap text-sm ${column.className || "text-gray-900"}`}
                >
                  {getCellValue(item, column)}
                </td>
              ))}
              
              {actions && actions.length > 0 && (
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    {actions.map((action, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          action.onClick(item);
                        }}
                        className={`inline-flex items-center px-3 py-1 border text-sm font-medium rounded-md ${
                          action.variant === "danger"
                            ? "border-red-300 text-red-700 bg-red-50 hover:bg-red-100"
                            : action.variant === "secondary"
                            ? "border-gray-300 text-gray-700 bg-gray-50 hover:bg-gray-100"
                            : "border-blue-300 text-blue-700 bg-blue-50 hover:bg-blue-100"
                        }`}
                      >
                        {action.icon && <span className="mr-1">{action.icon}</span>}
                        {action.label}
                      </button>
                    ))}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}