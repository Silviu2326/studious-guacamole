import React from 'react';
import { Table } from '../../../components/componentsreutilizables';
import { CostHistoryTableData } from '../types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface CostDataTableProps {
  data: CostHistoryTableData[];
  loading?: boolean;
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
}

export const CostDataTable: React.FC<CostDataTableProps> = ({
  data,
  loading = false,
  onSort,
  sortColumn,
  sortDirection,
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const getVariationIcon = (variation?: number) => {
    if (!variation) return <Minus className="w-4 h-4 text-gray-500" />;
    if (variation > 0) return <TrendingUp className="w-4 h-4 text-red-500" />;
    if (variation < 0) return <TrendingDown className="w-4 h-4 text-green-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const columns = [
    {
      key: 'productName',
      label: 'Producto',
      sortable: true,
    },
    {
      key: 'category',
      label: 'Categoría',
      sortable: true,
    },
    {
      key: 'supplier',
      label: 'Proveedor',
      sortable: true,
    },
    {
      key: 'lastPrice',
      label: 'Último Precio',
      sortable: true,
      align: 'right' as const,
      render: (value: number) => formatCurrency(value),
    },
    {
      key: 'avgPrice',
      label: 'Precio Promedio',
      sortable: true,
      align: 'right' as const,
      render: (value: number) => formatCurrency(value),
    },
    {
      key: 'lowestPrice',
      label: 'Precio Más Bajo',
      sortable: true,
      align: 'right' as const,
      render: (value: number) => formatCurrency(value),
    },
    {
      key: 'priceVariation',
      label: 'Variación',
      sortable: true,
      align: 'center' as const,
      render: (value: number, row: CostHistoryTableData) => (
        <div className="flex items-center justify-center gap-1">
          {getVariationIcon(value)}
          <span className={value > 0 ? 'text-red-500' : value < 0 ? 'text-green-500' : 'text-gray-500'}>
            {value ? `${value > 0 ? '+' : ''}${value.toFixed(1)}%` : '-'}
          </span>
        </div>
      ),
    },
  ];

  return (
    <Table
      data={data}
      columns={columns}
      loading={loading}
      onSort={onSort}
      sortColumn={sortColumn}
      sortDirection={sortDirection}
      emptyMessage="No hay datos disponibles para mostrar"
    />
  );
};

