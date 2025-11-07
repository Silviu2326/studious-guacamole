import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Table, Button, Badge } from '../../../components/componentsreutilizables';
import { RetentionAction } from '../types';
import { getRetentionActions } from '../api/retention';
import { Bell, Mail, MessageSquare, Phone, Gift, Clock, CheckCircle, Loader2 } from 'lucide-react';

export const RetentionAlerts: React.FC = () => {
  const { user } = useAuth();
  const [actions, setActions] = useState<RetentionAction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActions();
  }, []);

  const loadActions = async () => {
    setLoading(true);
    try {
      const data = await getRetentionActions();
      setActions(data);
    } catch (error) {
      console.error('Error cargando alertas de retención:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'whatsapp':
        return <MessageSquare className="w-4 h-4" />;
      case 'sms':
        return <MessageSquare className="w-4 h-4" />;
      case 'call':
        return <Phone className="w-4 h-4" />;
      case 'offer':
        return <Gift className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="yellow">Pendiente</Badge>;
      case 'executed':
        return <Badge variant="green">Ejecutada</Badge>;
      case 'cancelled':
        return <Badge variant="red">Cancelada</Badge>;
      default:
        return <Badge variant="gray">Desconocido</Badge>;
    }
  };

  const columns = [
    {
      key: 'type',
      label: 'Tipo',
      render: (value: string) => (
        <div className="flex items-center gap-2">
          {getActionIcon(value)}
          <span className="text-sm text-gray-900 capitalize">
            {value}
          </span>
        </div>
      ),
    },
    {
      key: 'clientId',
      label: 'Cliente ID',
      render: (value: string) => (
        <span className="text-sm text-gray-900">
          {value}
        </span>
      ),
    },
    {
      key: 'scheduledDate',
      label: 'Fecha Programada',
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            {new Date(value).toLocaleDateString('es-ES')}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      render: (value: string) => getStatusBadge(value),
    },
    {
      key: 'notes',
      label: 'Notas',
      render: (value: string) => (
        <span className="text-sm text-gray-600">
          {value || '-'}
        </span>
      ),
    },
  ];

  const pendingActions = actions.filter(a => a.status === 'pending');
  const executedActions = actions.filter(a => a.status === 'executed');

  if (loading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
                <Bell size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Alertas de Retención
                </h3>
                <p className="text-sm text-gray-600">
                  {pendingActions.length} acciones pendientes
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="p-6">
          <Table
            data={actions}
            columns={columns}
            loading={false}
            emptyMessage="No hay alertas de retención"
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card variant="hover" className="p-4">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="text-sm text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-gray-900">{pendingActions.length}</p>
            </div>
          </div>
        </Card>
        <Card variant="hover" className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Ejecutadas</p>
              <p className="text-2xl font-bold text-gray-900">{executedActions.length}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

