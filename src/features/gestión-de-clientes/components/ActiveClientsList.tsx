import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Table, Button, Badge } from '../../../components/componentsreutilizables';
import { Client } from '../types';
import { getActiveClients } from '../api/clients';
import { Users, TrendingUp, Calendar, Loader2, Package, AlertCircle, DollarSign } from 'lucide-react';
import { getMultipleClientsPaymentStatus, PaymentStatus } from '../../facturacin-cobros/utils/paymentStatus';

interface ActiveClientsListProps {
  onClientClick?: (client: Client) => void;
}

export const ActiveClientsList: React.FC<ActiveClientsListProps> = ({ onClientClick }) => {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentStatuses, setPaymentStatuses] = useState<Map<string, PaymentStatus>>(new Map());

  useEffect(() => {
    loadClients();
  }, [user]);

  useEffect(() => {
    if (clients.length > 0) {
      loadPaymentStatuses();
    }
  }, [clients]);

  const loadPaymentStatuses = async () => {
    try {
      const clientIds = clients.map(c => c.id);
      const statuses = await getMultipleClientsPaymentStatus(clientIds);
      setPaymentStatuses(statuses);
    } catch (error) {
      console.error('Error cargando estados de pago:', error);
    }
  };

  const loadClients = async () => {
    setLoading(true);
    try {
      const data = await getActiveClients(user?.role || 'entrenador', user?.id);
      setClients(data);
    } catch (error) {
      console.error('Error cargando clientes activos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (client: Client) => {
    if (client.adherenceRate && client.adherenceRate >= 80) {
      return <Badge variant="green">Excelente</Badge>;
    }
    if (client.adherenceRate && client.adherenceRate >= 60) {
      return <Badge variant="yellow">Bueno</Badge>;
    }
    return <Badge variant="gray">Regular</Badge>;
  };

  const getPaymentIndicator = (clientId: string) => {
    const status = paymentStatuses.get(clientId);
    if (!status || !status.hasPendingPayments) {
      return null;
    }

    const { severity, overdueCount, pendingCount, oldestOverdueDays } = status;

    // Determinar color y estilo según severidad
    let colorClass = '';
    let icon = <DollarSign className="w-4 h-4" />;
    let tooltip = '';

    if (severity === 'critical') {
      colorClass = 'text-red-600 bg-red-50 border-red-200';
      icon = <AlertCircle className="w-4 h-4" />;
      tooltip = `¡CRÍTICO! ${overdueCount} factura(s) vencida(s) desde hace ${oldestOverdueDays} días`;
    } else if (severity === 'danger') {
      colorClass = 'text-orange-600 bg-orange-50 border-orange-200';
      icon = <AlertCircle className="w-4 h-4" />;
      tooltip = `${overdueCount} factura(s) vencida(s) desde hace ${oldestOverdueDays} días`;
    } else if (severity === 'warning') {
      if (overdueCount > 0) {
        colorClass = 'text-yellow-600 bg-yellow-50 border-yellow-200';
        tooltip = `${overdueCount} factura(s) vencida(s) desde hace ${oldestOverdueDays} días`;
      } else {
        colorClass = 'text-blue-600 bg-blue-50 border-blue-200';
        tooltip = `${pendingCount} factura(s) pendiente(s)`;
      }
    }

    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${colorClass}`}
        title={tooltip}
      >
        {icon}
        <span className="text-xs font-semibold">
          {overdueCount > 0 ? `${overdueCount} vencida${overdueCount > 1 ? 's' : ''}` : `${pendingCount} pendiente${pendingCount > 1 ? 's' : ''}`}
        </span>
      </div>
    );
  };

  const columns = [
    {
      key: 'name',
      label: 'Nombre',
      render: (value: string, row: Client) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
            {value.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium text-gray-900">
                {value}
              </div>
              {getPaymentIndicator(row.id)}
            </div>
            {row.email && (
              <div className="text-sm text-gray-600">
                {row.email}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'planName',
      label: user?.role === 'entrenador' ? 'Plan' : 'Membresía',
      render: (value: string) => (
        <span className="text-sm text-gray-900">
          {value || 'Sin plan'}
        </span>
      ),
    },
    {
      key: 'adherenceRate',
      label: 'Adherencia',
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-600" />
          <span className="text-sm font-semibold text-gray-900">
            {value || 0}%
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      render: (_: any, row: Client) => getStatusBadge(row),
    },
    {
      key: 'lastCheckIn',
      label: 'Último Check-in',
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            {value ? new Date(value).toLocaleDateString('es-ES') : 'N/A'}
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_: any, row: Client) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onClientClick?.(row)}
          >
            Ver perfil
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </Card>
    );
  }

  if (clients.length === 0) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Package size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay clientes activos</h3>
        <p className="text-gray-600 mb-4">No se encontraron {user?.role === 'entrenador' ? 'clientes' : 'socios'} activos en este momento.</p>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
              <Users size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {user?.role === 'entrenador' ? 'Mis Clientes Activos' : 'Socios Activos'}
              </h3>
              <p className="text-sm text-gray-600">
                {clients.length} {user?.role === 'entrenador' ? 'clientes' : 'socios'} activos
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6">
        <Table
          data={clients}
          columns={columns}
          loading={false}
          emptyMessage="No hay clientes activos"
        />
      </div>
    </Card>
  );
};

