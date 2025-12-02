// Componente de tabla para mostrar empleados corporativos

import React from 'react';
import { Table, Badge, Button } from '../../../components/componentsreutilizables';
import { CorporateEmployee } from '../types';
import { Eye, Power, PowerOff } from 'lucide-react';

interface CorporateEmployeeTableProps {
  employees: CorporateEmployee[];
  onStatusChange: (employeeId: string, newStatus: 'active' | 'inactive') => void;
  onViewDetails: (employeeId: string) => void;
  loading?: boolean;
}

export const CorporateEmployeeTable: React.FC<CorporateEmployeeTableProps> = ({
  employees,
  onStatusChange,
  onViewDetails,
  loading = false,
}) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Nunca';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getStatusBadge = (status: CorporateEmployee['status']) => {
    return status === 'active' ? (
      <Badge variant="green">Activo</Badge>
    ) : (
      <Badge variant="red">Inactivo</Badge>
    );
  };

  const columns = [
    {
      key: 'fullName',
      label: 'Nombre Completo',
      render: (_: any, row: CorporateEmployee) => (
        <div>
          <div className="font-semibold">{`${row.firstName} ${row.lastName}`}</div>
          <div className="text-sm text-gray-500">{row.email}</div>
        </div>
      ),
    },
    {
      key: 'employeeExternalId',
      label: 'ID Empleado',
      render: (_: any, row: CorporateEmployee) => (
        <span className="text-sm text-gray-600">{row.employeeExternalId || '-'}</span>
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      render: (_: any, row: CorporateEmployee) => getStatusBadge(row.status),
    },
    {
      key: 'lastCheckIn',
      label: 'Último Check-in',
      render: (_: any, row: CorporateEmployee) => (
        <span className="text-sm">{formatDate(row.lastCheckIn)}</span>
      ),
    },
    {
      key: 'totalCheckIns',
      label: 'Total Check-ins',
      render: (_: any, row: CorporateEmployee) => (
        <span className="font-semibold">{row.totalCheckIns}</span>
      ),
      align: 'center' as const,
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_: any, row: CorporateEmployee) => (
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
            onClick={() =>
              onStatusChange(row.id, row.status === 'active' ? 'inactive' : 'active')
            }
            title={row.status === 'active' ? 'Desactivar' : 'Activar'}
          >
            {row.status === 'active' ? (
              <PowerOff className="w-4 h-4 text-red-500" />
            ) : (
              <Power className="w-4 h-4 text-green-500" />
            )}
          </Button>
        </div>
      ),
      align: 'center' as const,
    },
  ];

  return (
    <Table
      data={employees}
      columns={columns}
      loading={loading}
      emptyMessage="No hay empleados registrados"
    />
  );
};

