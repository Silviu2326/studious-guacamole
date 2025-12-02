import React from 'react';
import { Table, Card, Badge } from '../../../components/componentsreutilizables';
import { Transfer } from '../types';
import type { TableColumn } from '../../../components/componentsreutilizables';
import { Package, Loader2 } from 'lucide-react';

interface TransferListTableProps {
  transfers: Transfer[];
  onViewDetails: (transferId: string) => void;
  isLoading?: boolean;
}

export const TransferListTable: React.FC<TransferListTableProps> = ({
  transfers,
  onViewDetails,
  isLoading = false,
}) => {
  const getStatusBadge = (status: Transfer['status']) => {
    const badgeConfig = {
      PENDING: { variant: 'yellow' as const, label: 'Pendiente' },
      APPROVED: { variant: 'blue' as const, label: 'Aprobada' },
      REJECTED: { variant: 'red' as const, label: 'Rechazada' },
      COMPLETED: { variant: 'green' as const, label: 'Completada' },
      CANCELLED: { variant: 'gray' as const, label: 'Cancelada' },
    };

    const config = badgeConfig[status] || badgeConfig.PENDING;

    return (
      <Badge variant={config.variant}>{config.label}</Badge>
    );
  };

  const formatDate = (date: Date | string) => {
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const columns: TableColumn<Transfer>[] = [
    {
      key: 'member',
      label: 'Socio',
      render: (value: any) => (
        <div>
          <div className="font-medium text-gray-900">{value.name}</div>
          {value.email && (
            <div className="text-sm text-gray-500">{value.email}</div>
          )}
        </div>
      ),
    },
    {
      key: 'originLocation',
      label: 'Sede Origen',
      render: (value: any) => (
        <div className="font-medium text-gray-900">{value.name}</div>
      ),
    },
    {
      key: 'destinationLocation',
      label: 'Sede Destino',
      render: (value: any) => (
        <div className="font-medium text-gray-900">{value.name}</div>
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      render: (value: Transfer['status']) => getStatusBadge(value),
      width: 'w-32',
    },
    {
      key: 'requestedDate',
      label: 'Fecha Solicitud',
      render: (value: Date | string) => formatDate(value),
      width: 'w-36',
    },
    {
      key: 'effectiveDate',
      label: 'Fecha Efectiva',
      render: (value: Date | string) => formatDate(value),
      width: 'w-36',
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (value: any, row: Transfer) => (
        <button
          onClick={() => onViewDetails(row.id)}
          className="text-blue-600 hover:text-blue-900 font-medium text-sm transition-colors"
        >
          Ver Detalles
        </button>
      ),
      width: 'w-32',
      align: 'center',
    },
  ];

  if (isLoading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </Card>
    );
  }

  if (transfers.length === 0) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Package size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay transferencias disponibles</h3>
        <p className="text-gray-600">No se encontraron transferencias con los filtros aplicados</p>
      </Card>
    );
  }

  return (
    <Card className="p-0 bg-white shadow-sm">
      <Table
        data={transfers}
        columns={columns}
        loading={false}
        emptyMessage="No hay transferencias disponibles"
      />
    </Card>
  );
};

