import React from 'react';
import { Table, Badge } from '../../../components/componentsreutilizables';
import { TableColumn } from '../../../components/componentsreutilizables/Table';
import { Supplier } from '../types';
import { Star, Edit, Eye, Building2 } from 'lucide-react';
import { ds } from '../../adherencia/ui/ds';

interface SuppliersTableProps {
  suppliers: Supplier[];
  onEdit: (supplierId: string) => void;
  onViewDetails: (supplierId: string) => void;
  loading?: boolean;
}

export const SuppliersTable: React.FC<SuppliersTableProps> = ({
  suppliers,
  onEdit,
  onViewDetails,
  loading = false,
}) => {
  const getStatusBadge = (status: Supplier['status']) => {
    const statusConfig = {
      approved: { label: 'Aprobado', variant: 'green' as const },
      pending_approval: { label: 'Pendiente', variant: 'yellow' as const },
      rejected: { label: 'Rechazado', variant: 'red' as const },
      archived: { label: 'Archivado', variant: 'gray' as const },
    };

    const config = statusConfig[status] || statusConfig.pending_approval;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const renderRating = (rating?: number) => {
    if (!rating) return <span className="text-gray-400">Sin calificación</span>;
    
    return (
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        <span className="text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const columns: TableColumn<Supplier>[] = [
    {
      key: 'name',
      label: 'Nombre',
      render: (_, supplier) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <div className={`font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {supplier.name}
            </div>
            <div className={`text-sm ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              {supplier.contact.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Categoría',
      render: (category) => (
        <span className={`text-sm ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
          {category}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      render: (status) => getStatusBadge(status as Supplier['status']),
    },
    {
      key: 'rating',
      label: 'Calificación',
      render: (rating) => renderRating(rating as number | undefined),
    },
    {
      key: 'activeContracts',
      label: 'Contratos Activos',
      align: 'center',
      render: (contracts) => (
        <span className={`font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
          {contracts || 0}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      align: 'center',
      render: (_, supplier) => (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => onViewDetails(supplier.id)}
            className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
            title="Ver detalles"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(supplier.id)}
            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="Editar"
          >
            <Edit className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Table
      data={suppliers}
      columns={columns}
      loading={loading}
      emptyMessage="No hay proveedores registrados. Crea uno nuevo para comenzar."
    />
  );
};

