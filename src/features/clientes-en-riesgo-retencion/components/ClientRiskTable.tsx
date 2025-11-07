import React from 'react';
import { TableWithActions, Badge } from '../../../components/componentsreutilizables';
import { ClientRisk, UserRole, RiskLevel, PaymentStatus } from '../types';
import { TableColumn } from '../../../components/componentsreutilizables/Table';
import { AlertTriangle, Phone, Mail, Calendar, DollarSign, Activity, TrendingDown, FileText, User } from 'lucide-react';
import { TableAction } from '../../../components/componentsreutilizables/TableWithActions';

interface ClientRiskTableProps {
  clients: ClientRisk[];
  userType: UserRole;
  onActionClick?: (clientId: string, action: 'email' | 'log_activity' | 'view_details') => void;
  loading?: boolean;
}

export const ClientRiskTable: React.FC<ClientRiskTableProps> = ({
  clients,
  userType,
  onActionClick,
  loading = false,
}) => {
  const getRiskLevelBadge = (level: RiskLevel) => {
    const variants = {
      low: 'green' as const,
      medium: 'yellow' as const,
      high: 'red' as const,
    };
    const labels = {
      low: 'Bajo',
      medium: 'Medio',
      high: 'Alto',
    };
    return (
      <Badge variant={variants[level]} size="sm">
        {labels[level]}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status?: PaymentStatus) => {
    if (!status) return null;
    const variants: Record<PaymentStatus, 'green' | 'yellow' | 'red'> = {
      paid: 'green',
      failed: 'red',
      pending_renewal: 'yellow',
      pending: 'yellow',
    };
    const labels: Record<PaymentStatus, string> = {
      paid: 'Pagado',
      failed: 'Fallido',
      pending_renewal: 'Pendiente',
      pending: 'Pendiente',
    };
    return (
      <Badge variant={variants[status]} size="sm">
        {labels[status]}
      </Badge>
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return 'N/A';
    }
  };

  const columns: TableColumn<ClientRisk>[] = [
    {
      key: 'name',
      label: 'Cliente',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-semibold">{value}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{row.email}</div>
        </div>
      ),
    },
    {
      key: 'riskLevel',
      label: 'Riesgo',
      sortable: true,
      align: 'center',
      render: (value) => getRiskLevelBadge(value as RiskLevel),
    },
    ...(userType === 'gym'
      ? [
          {
            key: 'daysSinceLastCheckIn',
            label: 'Días sin asistir',
            sortable: true,
            align: 'center',
            render: (value) => (
              <div className="flex items-center justify-center gap-1">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="font-semibold">{value || 'N/A'}</span>
              </div>
            ),
          } as TableColumn<ClientRisk>,
          {
            key: 'membership',
            label: 'Membresía',
            sortable: true,
            render: (value) => <span>{value || 'N/A'}</span>,
          } as TableColumn<ClientRisk>,
          {
            key: 'paymentStatus',
            label: 'Estado de Pago',
            sortable: true,
            align: 'center',
            render: (value) => getPaymentStatusBadge(value as PaymentStatus),
          } as TableColumn<ClientRisk>,
          {
            key: 'mrr',
            label: 'MRR',
            sortable: true,
            align: 'right',
            render: (value) => (
              <div className="flex items-center justify-end gap-1">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <span className="font-semibold">€{value?.toFixed(2) || '0.00'}</span>
              </div>
            ),
          } as TableColumn<ClientRisk>,
        ]
      : [
          {
            key: 'missedSessions',
            label: 'Sesiones Perdidas',
            sortable: true,
            align: 'center',
            render: (value) => (
              <div className="flex items-center justify-center gap-1">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                <span className="font-semibold">{value || 0}</span>
              </div>
            ),
          } as TableColumn<ClientRisk>,
          {
            key: 'workoutAdherence',
            label: 'Adherencia Entreno',
            sortable: true,
            align: 'center',
            render: (value) => (
              <div className="flex items-center justify-center gap-1">
                <Activity className="w-4 h-4 text-gray-400" />
                <span className={`font-semibold ${(value as number) < 50 ? 'text-red-500' : (value as number) < 70 ? 'text-yellow-500' : 'text-green-500'}`}>
                  {value || 0}%
                </span>
              </div>
            ),
          } as TableColumn<ClientRisk>,
          {
            key: 'nutritionAdherence',
            label: 'Adherencia Nutrición',
            sortable: true,
            align: 'center',
            render: (value) => (
              <div className="flex items-center justify-center gap-1">
                <TrendingDown className="w-4 h-4 text-gray-400" />
                <span className={`font-semibold ${(value as number) < 50 ? 'text-red-500' : (value as number) < 70 ? 'text-yellow-500' : 'text-green-500'}`}>
                  {value || 0}%
                </span>
              </div>
            ),
          } as TableColumn<ClientRisk>,
          {
            key: 'lastCommunication',
            label: 'Última Comunicación',
            sortable: true,
            render: (value) => (
              <div className="flex items-center gap-1">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{formatDate(value as string)}</span>
              </div>
            ),
          } as TableColumn<ClientRisk>,
        ]),
  ];

  const actions: TableAction<ClientRisk>[] = onActionClick
    ? [
        {
          label: 'Ver Detalles',
          icon: <User className="w-4 h-4" />,
          variant: 'ghost',
          onClick: (row) => onActionClick(row.id, 'view_details'),
        },
        {
          label: 'Enviar Email',
          icon: <Mail className="w-4 h-4" />,
          variant: 'ghost',
          onClick: (row) => onActionClick(row.id, 'email'),
        },
        {
          label: 'Registrar Acción',
          icon: <FileText className="w-4 h-4" />,
          variant: 'primary',
          onClick: (row) => onActionClick(row.id, 'log_activity'),
        },
      ]
    : [];

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <TableWithActions
        data={clients}
        columns={columns}
        actions={actions}
        loading={loading}
        emptyMessage="No hay clientes en riesgo que mostrar"
      />
    </div>
  );
};

