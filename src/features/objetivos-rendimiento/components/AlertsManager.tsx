import React, { useState, useEffect } from 'react';
import { Alert } from '../types';
import { Card, Badge } from '../../../components/componentsreutilizables';
import { AlertTriangle, Info, CheckCircle, XCircle, Bell, BellOff } from 'lucide-react';

interface AlertsManagerProps {
  role: 'entrenador' | 'gimnasio';
}

// Mock data - En producción esto vendría de una API
const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'warning',
    title: 'Objetivo en riesgo',
    message: 'El objetivo de facturación mensual está por debajo del 50% del progreso esperado',
    objectiveId: '1',
    severity: 'high',
    createdAt: new Date().toISOString(),
    read: false,
  },
  {
    id: '2',
    type: 'error',
    title: 'Objetivo fallido',
    message: 'El objetivo de retención de clientes no se alcanzó en el período anterior',
    objectiveId: '2',
    severity: 'medium',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    read: false,
  },
  {
    id: '3',
    type: 'info',
    title: 'Nuevo objetivo alcanzado',
    message: 'Felicitaciones! Has alcanzado el objetivo de adherencia de clientes',
    objectiveId: '3',
    severity: 'low',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    read: true,
  },
];

export const AlertsManager: React.FC<AlertsManagerProps> = ({ role }) => {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    // En producción, cargar alertas desde API
  }, [role]);

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getSeverityBadge = (severity: Alert['severity']) => {
    const config = {
      low: { label: 'Baja', variant: 'blue' as const },
      medium: { label: 'Media', variant: 'yellow' as const },
      high: { label: 'Alta', variant: 'red' as const },
    };
    return <Badge variant={config[severity].variant}>{config[severity].label}</Badge>;
  };

  const markAsRead = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, read: true } : alert
    ));
  };

  const markAllAsRead = () => {
    setAlerts(alerts.map(alert => ({ ...alert, read: true })));
  };

  const filteredAlerts = filter === 'all' 
    ? alerts 
    : filter === 'unread' 
    ? alerts.filter(a => !a.read)
    : alerts.filter(a => a.read);

  const unreadCount = alerts.filter(a => !a.read).length;

  return (
    <div className="space-y-6">
      {/* Toolbar superior */}
      <div className="flex items-center justify-end">
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 transition-all"
          >
            Marcar todas como leídas
          </button>
        )}
      </div>

      {/* Filtros */}
      <Card className="p-4 bg-white shadow-sm">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              filter === 'all'
                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
            }`}
          >
            Todas ({alerts.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              filter === 'unread'
                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
            }`}
          >
            <Bell size={18} className={filter === 'unread' ? 'opacity-100' : 'opacity-70'} />
            No leídas ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              filter === 'read'
                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
            }`}
          >
            Leídas ({alerts.filter(a => a.read).length})
          </button>
        </div>
      </Card>

      <div className="space-y-3">
        {filteredAlerts.map((alert) => (
          <Card
            key={alert.id}
            variant="hover"
            className={`p-4 ${!alert.read ? 'border-l-4 border-l-blue-600' : ''} transition-shadow cursor-pointer`}
            onClick={() => !alert.read && markAsRead(alert.id)}
          >
            <div className="flex items-start gap-4">
              <div className="mt-1">
                {getAlertIcon(alert.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-base font-semibold text-gray-900">
                    {alert.title}
                  </h4>
                  <div className="flex items-center gap-2">
                    {getSeverityBadge(alert.severity)}
                    {!alert.read && (
                      <Bell className="w-4 h-4 text-blue-600" />
                    )}
                    {alert.read && (
                      <BellOff className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>
                <p className="text-base text-gray-600 mb-2">
                  {alert.message}
                </p>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-500">
                    {new Date(alert.createdAt).toLocaleString('es-ES')}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredAlerts.length === 0 && (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Bell size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay alertas disponibles</h3>
          <p className="text-gray-600">No se encontraron alertas para mostrar.</p>
        </Card>
      )}
    </div>
  );
};

