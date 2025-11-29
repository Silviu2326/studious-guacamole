import React, { useState } from 'react';
import { ds } from '../../features/adherencia/ui/ds';

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableAction<T> {
  label: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  onClick: (row: T) => void;
  disabled?: (row: T) => boolean;
  visible?: (row: T) => boolean;
}

export interface TableWithActionsProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[] | ((row: T) => React.ReactNode);
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
}

export const TableWithActions = <T extends Record<string, any>>({
  data,
  columns,
  actions = [],
  loading = false,
  emptyMessage = 'No hay datos disponibles',
  className = '',
  onSort,
  sortColumn,
  sortDirection = 'asc',
}: TableWithActionsProps<T>) => {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const isActionsArray = Array.isArray(actions);

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
              {(isActionsArray ? actions.length > 0 : !!actions) && (
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-500 dark:text-gray-400">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#334155]">
            {data.map((row, index) => (
              <tr
                key={index}
                className={`
                  group hover:bg-[#F8FAFC] dark:hover:bg-[#1E1E2E] ${ds.animation.fast}
                  ${hoveredRow === index ? 'bg-[#F1F5F9] dark:bg-[#2A2A3A]' : ''}
                `}
                onMouseEnter={() => setHoveredRow(index)}
                onMouseLeave={() => setHoveredRow(null)}
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
                {(isActionsArray ? actions.length > 0 : !!actions) && (
                  <td className="px-6 py-4 text-right">
                    {isActionsArray ? (
                      <div className="flex items-center justify-end space-x-2">
                        {actions
                          .filter(action => action.visible ? action.visible(row) : true)
                          .map((action, actionIndex) => (
                            <button
                              key={actionIndex}
                              onClick={() => action.onClick(row)}
                              disabled={action.disabled ? action.disabled(row) : false}
                              className={`
                                w-8 h-8 rounded-lg flex items-center justify-center
                                opacity-70 group-hover:opacity-100 transition-all duration-200
                                hover:bg-[#F1F5F9] dark:hover:bg-[#2A2A3A]
                                focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:ring-offset-2
                                disabled:opacity-50 disabled:cursor-not-allowed
                                ${action.variant === 'destructive' 
                                  ? 'text-[#EF4444] hover:bg-[#FEE2E2] dark:hover:bg-[#7F1D1D]' 
                                  : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F1F5F9]'
                                }
                              `}
                              title={action.label}
                            >
                              {action.icon}
                            </button>
                          ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-end space-x-2">
                        {typeof actions === 'function' && actions(row)}
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
