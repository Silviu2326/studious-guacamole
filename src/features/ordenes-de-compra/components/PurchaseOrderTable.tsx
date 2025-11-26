import React from 'react';
import { Table, TableColumn } from '../../../components/componentsreutilizables';
import { Badge } from '../../../components/componentsreutilizables/Badge';
import { PurchaseOrder, OrderStatus } from '../types';
import { Eye } from 'lucide-react';

interface PurchaseOrderTableProps {
  orders: PurchaseOrder[];
  loading?: boolean;
  onViewDetails: (orderId: string) => void;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
}

const statusConfig: Record<OrderStatus, { label: string; color: 'gray' | 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'orange' }> = {
  [OrderStatus.DRAFT]: { label: 'Borrador', color: 'gray' },
  [OrderStatus.PENDING_APPROVAL]: { label: 'Pendiente Aprobación', color: 'yellow' },
  [OrderStatus.APPROVED]: { label: 'Aprobada', color: 'blue' },
  [OrderStatus.REJECTED]: { label: 'Rechazada', color: 'red' },
  [OrderStatus.ORDERED]: { label: 'Ordenada', color: 'purple' },
  [OrderStatus.PARTIALLY_RECEIVED]: { label: 'Parcialmente Recibida', color: 'orange' },
  [OrderStatus.COMPLETED]: { label: 'Completada', color: 'green' },
  [OrderStatus.CANCELLED]: { label: 'Cancelada', color: 'red' },
};

export const PurchaseOrderTable: React.FC<PurchaseOrderTableProps> = ({
  orders,
  loading = false,
  onViewDetails,
  onStatusChange,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const columns: TableColumn<PurchaseOrder>[] = [
    {
      key: 'id',
      label: 'ID Orden',
      sortable: true,
      render: (value) => (
        <span className="font-mono text-xs text-purple-600">
          {value}
        </span>
      ),
    },
    {
      key: 'supplier_name',
      label: 'Proveedor',
      sortable: true,
    },
    {
      key: 'created_at',
      label: 'Fecha',
      sortable: true,
      render: (value) => <span className="text-sm text-gray-600">{formatDate(value)}</span>,
    },
    {
      key: 'total_amount',
      label: 'Total',
      sortable: true,
      align: 'right',
      render: (value, row) => (
        <span className="font-semibold text-gray-900">{formatCurrency(value, row.currency)}</span>
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      sortable: true,
      render: (value) => {
        const config = statusConfig[value as OrderStatus];
        return (
          <Badge variant={config.color} size="md">
            {config.label}
          </Badge>
        );
      },
    },
    {
      key: 'requester_name',
      label: 'Solicitante',
      sortable: true,
    },
    {
      key: 'actions',
      label: 'Acciones',
      align: 'center',
      render: (_, row) => (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => onViewDetails(row.id)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-all text-gray-600 hover:text-gray-900"
            title="Ver detalles"
          >
            <Eye size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Table
      data={orders}
      columns={columns}
      loading={loading}
      emptyMessage="No hay órdenes de compra registradas"
    />
  );
};

