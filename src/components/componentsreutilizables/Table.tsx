import React from 'react';
import { ds } from '../../features/adherencia/ui/ds';

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
}

export const Table = <T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  emptyMessage = 'No hay datos disponibles',
  className = '',
  onSort,
  sortColumn,
  sortDirection = 'asc',
}: TableProps<T>) => {
  const handleSort = (column: string) => {
    if (onSort) {
      const direction = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
      onSort(column, direction);
    }
  };

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  if (loading) {
    return (
      <div className={`${ds.card} ${className}`}>
        <div className="overflow-x-auto">
          <div className="animate-pulse">
            <div className="h-12 bg-[#F1F5F9] dark:bg-[#2A2A3A] rounded-t-xl"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-[#F8FAFC] dark:bg-[#1E1E2E] border-t border-[#E2E8F0] dark:border-[#334155]"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={`${ds.card} ${ds.cardPad} ${className}`}>
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-[#64748B] to-[#94A3B8] rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">📊</span>
          </div>
          <p className={`${ds.typography.bodyLarge} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            {emptyMessage}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${ds.card} overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F8FAFC] dark:bg-[#1E1E2E] border-b border-[#E2E8F0] dark:border-[#334155]">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`
                    px-6 py-4 text-left ${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}
                    ${column.sortable ? 'cursor-pointer hover:bg-[#F1F5F9] dark:hover:bg-[#2A2A3A]' : ''}
                    ${column.width ? `w-${column.width}` : ''}
                    ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : ''}
                    ${ds.animation.fast}
                  `}
                  onClick={() => column.sortable && handleSort(String(column.key))}
                >
                  <div className="flex items-center space-x-2">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <span className="text-xs opacity-60">
                        {getSortIcon(String(column.key))}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#334155]">
            {data.map((row, index) => (
              <tr
                key={index}
                className={`
                  hover:bg-[#F8FAFC] dark:hover:bg-[#1E1E2E] ${ds.animation.fast}
                `}
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={`
                      px-6 py-4 ${ds.typography.body} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}
                      ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : ''}
                    `}
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};