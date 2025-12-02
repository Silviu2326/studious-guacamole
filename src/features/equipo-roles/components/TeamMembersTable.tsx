import React from 'react';
import { Table } from '../../../components/componentsreutilizables';
import { Badge } from '../../../components/componentsreutilizables';
import { TeamMember } from '../types';
import { Edit, Power, PowerOff } from 'lucide-react';
import { Button } from '../../../components/componentsreutilizables';

interface TeamMembersTableProps {
  members: TeamMember[];
  onEdit: (member: TeamMember) => void;
  onToggleStatus: (memberId: string, currentStatus: 'active' | 'inactive' | 'pending') => void;
  loading?: boolean;
}

export const TeamMembersTable: React.FC<TeamMembersTableProps> = ({
  members,
  onEdit,
  onToggleStatus,
  loading = false,
}) => {
  const columns = [
    {
      key: 'name',
      label: 'Nombre',
      sortable: true,
    },
    {
      key: 'email',
      label: 'Correo Electrónico',
      sortable: true,
    },
    {
      key: 'role',
      label: 'Rol',
      render: (value: any, row: TeamMember) => (
        <Badge variant="blue" size="sm">
          {row.role.name}
        </Badge>
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      render: (value: any, row: TeamMember) => {
        const statusConfig = {
          active: { variant: 'green' as const, label: 'Activo' },
          inactive: { variant: 'red' as const, label: 'Inactivo' },
          pending: { variant: 'yellow' as const, label: 'Pendiente' },
        };
        const config = statusConfig[row.status] || statusConfig.active;
        return <Badge variant={config.variant} size="sm">{config.label}</Badge>;
      },
    },
    {
      key: 'lastLogin',
      label: 'Último Acceso',
      render: (value: any) => {
        if (!value) return <span className="text-gray-400">Nunca</span>;
        const date = new Date(value);
        return <span>{date.toLocaleDateString('es-ES')}</span>;
      },
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (value: any, row: TeamMember) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(row)}
            title="Editar miembro"
          >
            <Edit size={16} />
          </Button>
          {row.status !== 'pending' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleStatus(row.id, row.status)}
              title={row.status === 'active' ? 'Desactivar' : 'Activar'}
            >
              {row.status === 'active' ? (
                <PowerOff size={16} className="text-red-600" />
              ) : (
                <Power size={16} className="text-green-600" />
              )}
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <Table
      data={members}
      columns={columns}
      loading={loading}
      emptyMessage="No hay miembros del equipo registrados"
    />
  );
};

