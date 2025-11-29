import React, { useState } from 'react';
import { Table, Button, Badge, Card } from '../../../components/componentsreutilizables';
import { Employee, EmployeeStatus } from '../types';
import { Search, Mail, UserMinus, X } from 'lucide-react';

interface EmployeeDataTableProps {
  employees: Employee[];
  loading?: boolean;
  onDeactivate: (employeeId: string) => void;
  onResendInvite: (employeeId: string) => void;
  onSearch?: (searchTerm: string) => void;
  onStatusFilter?: (status: EmployeeStatus | '') => void;
}

export const EmployeeDataTable: React.FC<EmployeeDataTableProps> = ({
  employees,
  loading = false,
  onDeactivate,
  onResendInvite,
  onSearch,
  onStatusFilter,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<EmployeeStatus | ''>('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch?.(value);
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as EmployeeStatus | '';
    setFilterStatus(value);
    onStatusFilter?.(value);
  };

  const getStatusBadge = (status: EmployeeStatus) => {
    switch (status) {
      case 'active':
        return <Badge variant="green" leftIcon={<UserMinus className="w-3 h-3" />}>Activo</Badge>;
      case 'invited':
        return <Badge variant="yellow" leftIcon={<Mail className="w-3 h-3" />}>Invitado</Badge>;
      case 'inactive':
        return <Badge variant="red" leftIcon={<UserMinus className="w-3 h-3" />}>Inactivo</Badge>;
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Nombre',
      sortable: true,
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
    },
    {
      key: 'status',
      label: 'Estado',
      render: (value: EmployeeStatus) => getStatusBadge(value),
    },
    {
      key: 'joined_date',
      label: 'Fecha de Registro',
      render: (value: string) => new Date(value).toLocaleDateString('es-ES'),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_: any, row: Employee) => (
        <div className="flex items-center gap-2">
          {row.status === 'invited' && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onResendInvite(row.id)}
            >
              <Mail className="w-4 h-4 mr-1" />
              Reenviar
            </Button>
          )}
          {row.status !== 'inactive' && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDeactivate(row.id)}
            >
              Desactivar
            </Button>
          )}
        </div>
      ),
    },
  ];

  const hasActiveFilters = filterStatus !== '';

  return (
    <div className="space-y-6">
      {/* Sistema de Filtros */}
      <Card className="mb-6 bg-white shadow-sm">
        <div className="space-y-4">
          {/* Barra de búsqueda */}
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
            <div className="flex gap-4">
              {/* Input de búsqueda */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Buscar por nombre o email..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                />
              </div>
              
              {/* Select de estado */}
              <select
                value={filterStatus}
                onChange={handleStatusFilterChange}
                className="rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 min-w-[180px]"
              >
                <option value="">Todos los estados</option>
                <option value="active">Activo</option>
                <option value="invited">Invitado</option>
                <option value="inactive">Inactivo</option>
              </select>
              
              {/* Botón limpiar filtros */}
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFilterStatus('');
                    onStatusFilter?.('');
                  }}
                  leftIcon={<X size={16} />}
                >
                  Limpiar
                </Button>
              )}
            </div>
          </div>

          {/* Resumen de resultados */}
          <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
            <span>{employees.length} {employees.length === 1 ? 'empleado encontrado' : 'empleados encontrados'}</span>
            {hasActiveFilters && (
              <span>{hasActiveFilters ? '1 filtro aplicado' : ''}</span>
            )}
          </div>
        </div>
      </Card>

      {/* Tabla */}
      <Card className="bg-white shadow-sm">
        <Table
          data={employees}
          columns={columns}
          loading={loading}
          emptyMessage="No hay empleados registrados"
        />
      </Card>
    </div>
  );
};

