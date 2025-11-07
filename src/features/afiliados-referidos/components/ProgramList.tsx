import React from 'react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import { TableWithActions } from '../../../components/componentsreutilizables/TableWithActions';
import { ReferralProgram, UserType } from '../types';
import { Edit, Users } from 'lucide-react';
// Helper para formatear fechas sin date-fns
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

interface ProgramListProps {
  programs: ReferralProgram[];
  isLoading: boolean;
  onEdit: (program: ReferralProgram) => void;
  onCopyCode: (code: string) => void;
  userType: UserType;
}

export const ProgramList: React.FC<ProgramListProps> = ({
  programs,
  isLoading,
  onEdit,
  onCopyCode,
  userType,
}) => {
  const getRewardLabel = (reward: { type: string; value: number }) => {
    switch (reward.type) {
      case 'percent_discount':
        return `${reward.value}% descuento`;
      case 'free_month':
        return `${reward.value} ${reward.value === 1 ? 'mes' : 'meses'} gratis`;
      case 'free_session':
        return `${reward.value} ${reward.value === 1 ? 'sesión' : 'sesiones'} gratis`;
      case 'fixed_amount':
        return `$${reward.value} descuento`;
      default:
        return `${reward.value}`;
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Nombre',
      sortable: true,
    },
    {
      key: 'period',
      label: 'Período',
      render: (_value: any, program: ReferralProgram) => (
        <div className="text-sm">
          <div className="text-gray-900">{formatDate(program.startDate)}</div>
          <div className="text-gray-600">
            hasta {formatDate(program.endDate)}
          </div>
        </div>
      ),
    },
    {
      key: 'rewards',
      label: 'Recompensas',
      render: (_value: any, program: ReferralProgram) => (
        <div className="text-sm space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Referente:</span>
            <span className="font-medium text-gray-900">{getRewardLabel(program.referrerReward)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Referido:</span>
            <span className="font-medium text-gray-900">{getRewardLabel(program.referredReward)}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'conversions',
      label: 'Conversiones',
      render: (_value: any, program: ReferralProgram) => (
        <div className="flex items-center gap-2">
          <Users size={16} className="text-gray-500" />
          <span className="font-semibold text-gray-900">{program.conversions || 0}</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      render: (_value: any, program: ReferralProgram) => (
        <Badge variant={program.isActive ? 'green' : 'gray'}>
          {program.isActive ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
  ];

  const actions = [
    {
      label: 'Editar',
      icon: <Edit size={16} />,
      variant: 'ghost' as const,
      onClick: (program: ReferralProgram) => onEdit(program),
    },
  ];

  if (isLoading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </Card>
    );
  }

  if (programs.length === 0) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Users size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No hay programas creados
        </h3>
        <p className="text-gray-600 mb-4">
          Crea tu primer programa de referidos para empezar
        </p>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-sm">
      <div className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Programas de Referidos
            </h2>
          </div>
          
          <TableWithActions
            data={programs}
            columns={columns}
            actions={actions}
            loading={isLoading}
          />
        </div>
      </div>
    </Card>
  );
};

