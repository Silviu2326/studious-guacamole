import React from 'react';
import { LocationSummary, SortKey, SortDirection } from '../types';
import { Table, TableColumn } from '../../../components/componentsreutilizables/Table';
import { Card } from '../../../components/componentsreutilizables';
import { Building2, ArrowRight } from 'lucide-react';

interface LocationKPITableProps {
  data: LocationSummary[];
  onSortChange: (column: SortKey) => void;
  onRowClick: (locationId: string) => void;
  sortColumn: SortKey | null;
  sortDirection: SortDirection;
  loading?: boolean;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);
};

const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(2)}%`;
};

const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('es-ES').format(value);
};

export const LocationKPITable: React.FC<LocationKPITableProps> = ({
  data,
  onSortChange,
  onRowClick,
  sortColumn,
  sortDirection,
  loading = false,
}) => {
  const columns: TableColumn<LocationSummary>[] = [
    {
      key: 'locationName',
      label: 'Sede',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>
          <span className="text-sm font-semibold text-gray-900">
            {value}
          </span>
        </div>
      ),
    },
    {
      key: 'totalRevenue',
      label: 'Ingresos Totales',
      sortable: true,
      align: 'right',
      render: (value) => (
        <span className="text-sm font-semibold text-gray-900">
          {formatCurrency(value as number)}
        </span>
      ),
    },
    {
      key: 'newMembers',
      label: 'Nuevos Miembros',
      sortable: true,
      align: 'right',
      render: (value) => (
        <span className="text-sm text-gray-900">
          {formatNumber(value as number)}
        </span>
      ),
    },
    {
      key: 'churnRate',
      label: 'Tasa de Abandono',
      sortable: true,
      align: 'right',
      render: (value) => {
        const rate = value as number;
        const isHigh = rate > 0.1;
        return (
          <span className={`text-sm ${isHigh ? 'text-red-600' : 'text-green-600'}`}>
            {formatPercentage(rate)}
          </span>
        );
      },
    },
    {
      key: 'activeMembers',
      label: 'Miembros Activos',
      sortable: true,
      align: 'right',
      render: (value) => (
        <span className="text-sm text-gray-900">
          {formatNumber(value as number)}
        </span>
      ),
    },
    {
      key: 'avgClassAttendance',
      label: 'Asistencia Promedio',
      sortable: true,
      align: 'right',
      render: (value) => (
        <span className="text-sm text-gray-900">
          {formatNumber(value as number)}
        </span>
      ),
    },
    {
      key: 'arpu',
      label: 'ARPU',
      sortable: true,
      align: 'right',
      render: (value, row) => {
        const arpu = value as number | undefined;
        if (arpu !== undefined) {
          return (
            <span className="text-sm text-gray-900">
              {formatCurrency(arpu)}
            </span>
          );
        }
        // Calcular ARPU si no está disponible
        const calculated = row.activeMembers > 0 ? row.totalRevenue / row.activeMembers : 0;
        return (
          <span className="text-sm text-gray-900">
            {formatCurrency(calculated)}
          </span>
        );
      },
    },
    {
      key: 'actions',
      label: '',
      sortable: false,
      align: 'center',
      width: '80px',
      render: (_, row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRowClick(row.locationId);
          }}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-all"
        >
          <span className="text-xs">Ver detalles</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <Card className="bg-white shadow-sm">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Resumen Comparativo por Sede
        </h3>
        <p className="text-gray-600">
          Haz clic en cualquier columna para ordenar los datos. Haz clic en una fila para ver el detalle de la sede.
        </p>
      </div>

      <Table
        data={data}
        columns={columns}
        loading={loading}
        emptyMessage="No hay datos disponibles para el período seleccionado"
        onSort={(column) => {
          // Convertir string a SortKey
          const sortKey = column as SortKey;
          onSortChange(sortKey);
        }}
        sortColumn={sortColumn || undefined}
        sortDirection={sortDirection}
      />
    </Card>
  );
};

