import React from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, UserMinus, UserCheck } from 'lucide-react';
import { ClientStatus as ClientStatusType } from '../api/client-status';

interface ClientStatusProps {
  data: ClientStatusType;
  role: 'entrenador' | 'gimnasio';
  loading?: boolean;
}

export const ClientStatus: React.FC<ClientStatusProps> = ({
  data,
  role,
  loading = false,
}) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <Card className="p-4 bg-white shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-white shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {role === 'entrenador' ? 'Estado de Clientes' : 'Estado de Socios'}
          </h3>
          <p className="text-gray-600 text-sm mt-1">
            Total: {data.total} {role === 'entrenador' ? 'clientes' : 'socios'}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/gestión-de-clientes')}
        >
          Ver todos
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-lg bg-green-100 ring-1 ring-green-200">
          <div className="flex items-center gap-2 mb-2">
            <UserCheck className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-700">
              Activos
            </span>
          </div>
          <p className="text-2xl font-bold text-green-700">
            {data.activos}
          </p>
        </div>

        <div className="p-4 rounded-lg bg-blue-100 ring-1 ring-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <UserPlus className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">
              Nuevos
            </span>
          </div>
          <p className="text-2xl font-bold text-blue-700">
            {data.nuevos}
          </p>
        </div>

        <div className="p-4 rounded-lg bg-yellow-100 ring-1 ring-yellow-200">
          <div className="flex items-center gap-2 mb-2">
            <UserMinus className="w-5 h-5 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-700">
              Inactivos
            </span>
          </div>
          <p className="text-2xl font-bold text-yellow-700">
            {data.inactivos}
          </p>
        </div>

        <div className="p-4 rounded-lg bg-indigo-100 ring-1 ring-indigo-200">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-700">
              Leads
            </span>
          </div>
          <p className="text-2xl font-bold text-indigo-700">
            {data.leadsPendientes}
          </p>
        </div>
      </div>

      {data.leadsPendientes > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Button
            variant="primary"
            fullWidth
            onClick={() => navigate('/leads')}
          >
            Gestionar {data.leadsPendientes} {data.leadsPendientes === 1 ? 'lead pendiente' : 'leads pendientes'}
          </Button>
        </div>
      )}
    </Card>
  );
};
