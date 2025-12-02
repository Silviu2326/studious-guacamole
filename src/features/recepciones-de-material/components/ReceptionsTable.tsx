import React from 'react';
import { Table } from '../../../components/componentsreutilizables';
import type { TableColumn } from '../../../components/componentsreutilizables';
import { Reception } from '../types';
import { Badge } from '../../../components/componentsreutilizables';
import { Eye, Package } from 'lucide-react';

interface ReceptionsTableProps {
  receptions: Reception[];
  onViewDetails: (receptionId: string) => void;
  isLoading?: boolean;
}

export const ReceptionsTable: React.FC<ReceptionsTableProps> = ({
  receptions,
  onViewDetails,
  isLoading = false
}) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { label: 'Completada', color: 'bg-green-100 text-green-800' },
      partial: { label: 'Parcial', color: 'bg-yellow-100 text-yellow-800' },
      pending: { label: 'Pendiente', color: 'bg-gray-100 text-gray-800' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const columns: TableColumn<Reception>[] = [
    {
      key: 'receptionDate',
      label: 'Fecha',
      sortable: true,
      render: (value) => (
        <span className="text-base text-gray-900">
          {formatDate(value)}
        </span>
      )
    },
    {
      key: 'purchaseOrderReference',
      label: 'Orden de Compra',
      render: (value) => (
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-gray-500" />
          <span className="text-base font-medium text-gray-900">
            {value || '-'}
          </span>
        </div>
      )
    },
    {
      key: 'supplier',
      label: 'Proveedor',
      render: (_, row) => (
        <span className="text-base text-gray-600">
          {row.supplier.name}
        </span>
      )
    },
    {
      key: 'itemCount',
      label: 'Items',
      align: 'center',
      render: (value) => (
        <span className="text-base font-medium text-gray-900">
          {value}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Estado',
      render: (value) => getStatusBadge(value)
    },
    {
      key: 'totalAmount',
      label: 'Total',
      align: 'right',
      render: (value) => (
        <span className="text-base font-medium text-gray-900">
          {formatCurrency(value)}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Acciones',
      align: 'center',
      render: (_, row) => (
        <button
          onClick={() => onViewDetails(row.id)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg 
            bg-blue-100 text-blue-700
            hover:bg-blue-200
            transition-all duration-200
          "
          title="Ver detalles"
        >
          <Eye className="w-4 h-4" />
          <span className="text-sm font-medium">
            Ver
          </span>
        </button>
      )
    }
  ];

  return (
    <Table
      data={receptions}
      columns={columns}
      loading={isLoading}
      emptyMessage="No hay recepciones registradas"
    />
  );
};

