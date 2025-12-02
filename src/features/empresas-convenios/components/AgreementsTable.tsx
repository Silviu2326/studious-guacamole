import React from 'react';
import { Table } from '../../../components/componentsreutilizables';
import { CorporateAgreement } from '../types';
import { Button, Badge } from '../../../components/componentsreutilizables';
import { Eye, Edit } from 'lucide-react';

interface AgreementsTableProps {
  agreements: CorporateAgreement[];
  onEdit: (agreement: CorporateAgreement) => void;
  onViewDetails: (agreementId: string) => void;
  loading?: boolean;
}

export const AgreementsTable: React.FC<AgreementsTableProps> = ({
  agreements,
  onEdit,
  onViewDetails,
  loading = false,
}) => {
  const getStatusBadge = (status: CorporateAgreement['status']) => {
    const statusConfig = {
      active: { label: 'Activo', variant: 'green' as const },
      expired: { label: 'Expirado', variant: 'red' as const },
      pending: { label: 'Pendiente', variant: 'yellow' as const },
      expiringSoon: { label: 'Por Vencer', variant: 'yellow' as const },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <Badge variant={config.variant}>
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
    });
  };

  const formatDiscount = (type: CorporateAgreement['discountType'], value: number) => {
    if (type === 'percentage') {
      return `${value}%`;
    }
    return `$${value.toFixed(2)}`;
  };

  const columns = [
    {
      key: 'companyName',
      label: 'Empresa',
      sortable: true,
    },
    {
      key: 'status',
      label: 'Estado',
      sortable: true,
      render: (value: CorporateAgreement['status']) => getStatusBadge(value),
    },
    {
      key: 'memberCount',
      label: 'Miembros',
      sortable: true,
      align: 'center' as const,
    },
    {
      key: 'discount',
      label: 'Descuento',
      sortable: false,
      render: (_: any, row: CorporateAgreement) => (
        <span>{formatDiscount(row.discountType, row.discountValue)}</span>
      ),
    },
    {
      key: 'validUntil',
      label: 'Válido Hasta',
      sortable: true,
      render: (value: string) => formatDate(value),
    },
    {
      key: 'actions',
      label: 'Acciones',
      sortable: false,
      render: (_: any, row: CorporateAgreement) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails(row.id)}
            title="Ver detalles"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(row)}
            title="Editar"
          >
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Table
      data={agreements}
      columns={columns}
      loading={loading}
      emptyMessage="No hay convenios disponibles"
    />
  );
};

