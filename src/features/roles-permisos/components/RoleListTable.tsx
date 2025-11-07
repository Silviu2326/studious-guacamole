import React from 'react';
import { Table } from '../../../components/componentsreutilizables';
import { Role, RoleWithUserCount } from '../types';
import { Edit, Trash2, Copy, Users } from 'lucide-react';
import { Badge } from '../../../components/componentsreutilizables';

export interface RoleListTableProps {
  roles: RoleWithUserCount[];
  onEdit: (roleId: string) => void;
  onDelete: (roleId: string) => void;
  onClone: (roleId: string) => void;
  loading?: boolean;
}

export const RoleListTable: React.FC<RoleListTableProps> = ({
  roles,
  onEdit,
  onDelete,
  onClone,
  loading = false,
}) => {
  const columns = [
    {
      key: 'name' as const,
      label: 'Nombre del Rol',
      render: (value: string, row: RoleWithUserCount) => (
        <div className="flex items-center gap-3">
          <div>
            <span className="text-base font-semibold text-gray-900">
              {value}
            </span>
            {row.isDefault && (
              <Badge variant="purple" className="ml-2">
                Por Defecto
              </Badge>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'description' as const,
      label: 'Descripción',
      render: (value: string) => (
        <span className="text-sm text-gray-600">
          {value || '-'}
        </span>
      ),
    },
    {
      key: 'userCount' as const,
      label: 'Usuarios',
      align: 'center' as const,
      render: (value: number) => (
        <div className="flex items-center justify-center gap-2">
          <Users size={16} className="text-slate-600" />
          <span className="text-base font-semibold text-gray-900">
            {value}
          </span>
        </div>
      ),
    },
    {
      key: 'permissions' as const,
      label: 'Permisos',
      align: 'center' as const,
      render: (value: string[], row: RoleWithUserCount) => (
        <div className="flex items-center justify-center">
          <Badge variant="gray">
            {row.permissions?.length || 0}
          </Badge>
        </div>
      ),
    },
    {
      key: 'actions' as const,
      label: 'Acciones',
      align: 'right' as const,
      render: (_: any, row: RoleWithUserCount) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onClone(row.id)}
            className="p-2 rounded-lg hover:bg-gray-100 text-slate-600 hover:text-blue-600 transition-all"
            title="Clonar rol"
          >
            <Copy size={16} />
          </button>
          <button
            onClick={() => onEdit(row.id)}
            className={`p-2 rounded-lg hover:bg-gray-100 text-slate-600 hover:text-blue-600 transition-all ${
              row.isDefault ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={row.isDefault}
            title={row.isDefault ? 'Los roles por defecto no se pueden editar' : 'Editar rol'}
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(row.id)}
            className={`p-2 rounded-lg hover:bg-gray-100 text-slate-600 hover:text-red-600 transition-all ${
              row.isDefault ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={row.isDefault}
            title={row.isDefault ? 'Los roles por defecto no se pueden eliminar' : 'Eliminar rol'}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Table
      data={roles}
      columns={columns}
      loading={loading}
      emptyMessage="No hay roles definidos. Crea el primer rol para empezar."
    />
  );
};

