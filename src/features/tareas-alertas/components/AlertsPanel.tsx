import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import { Alert, AlertFilters, AlertType } from '../types';
import { getAlerts, markAlertAsRead, markAllAlertsAsRead, getUnreadAlertsCount } from '../api';
import { getPriorityColor, getPriorityLabel } from '../api/priority';
import { Bell, CheckCircle2, AlertCircle, ExternalLink, Loader2 } from 'lucide-react';

interface AlertsPanelProps {
  role: 'entrenador' | 'gimnasio';
  maxVisible?: number;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ role, maxVisible = 10 }) => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadAlerts();
    loadUnreadCount();
  }, [role, user?.id]);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const filters: AlertFilters = {
        role,
        isRead: false,
      };
      const data = await getAlerts(filters);
      setAlerts(data.slice(0, maxVisible));
    } catch (error) {
      console.error('Error cargando alertas:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const filters: AlertFilters = { role };
      const count = await getUnreadAlertsCount(filters);
      setUnreadCount(count);
    } catch (error) {
      console.error('Error cargando contador:', error);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAlertAsRead(id);
      loadAlerts();
      loadUnreadCount();
    } catch (error) {
      console.error('Error marcando alerta como leída:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAlertsAsRead({ role });
      loadAlerts();
      loadUnreadCount();
    } catch (error) {
      console.error('Error marcando todas las alertas:', error);
    }
  };

  const getAlertIcon = (type: AlertType) => {
    switch (type) {
      case 'pago-pendiente':
      case 'factura-vencida':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'check-in-faltante':
      case 'lead-sin-seguimiento':
        return <Bell className="w-5 h-5 text-orange-600" />;
      case 'equipo-roto':
      case 'aforo-superado':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <Bell className="w-5 h-5 text-blue-600" />;
    }
  };

  const getAlertTypeLabel = (type: AlertType): string => {
    const labels: Record<AlertType, string> = {
      'pago-pendiente': 'Pago Pendiente',
      'check-in-faltante': 'Check-in Faltante',
      'lead-sin-seguimiento': 'Lead Sin Seguimiento',
      'factura-vencida': 'Factura Vencida',
      'equipo-roto': 'Equipo Roto',
      'aforo-superado': 'Aforo Superado',
      'mantenimiento': 'Mantenimiento',
      'tarea-critica': 'Tarea Crítica',
      'recordatorio': 'Recordatorio',
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Alertas en Tiempo Real
          </h3>
          {unreadCount > 0 && (
            <Badge className="bg-red-100 text-red-800 border-red-200">
              {unreadCount} sin leer
            </Badge>
          )}
        </div>
        {alerts.length > 0 && (
          <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
            Marcar todas como leídas
          </Button>
        )}
      </div>

      {alerts.length === 0 ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <CheckCircle2 size={48} className="mx-auto text-green-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay alertas pendientes</h3>
          <p className="text-gray-600">Todas las alertas están al día</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border transition-all ${
                alert.isRead
                  ? 'bg-slate-50 border-slate-200'
                  : 'bg-blue-50 border-blue-200 ring-1 ring-blue-100'
              }`}
            >
              <div className="flex items-start gap-3">
                {getAlertIcon(alert.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900">
                      {alert.title}
                    </h4>
                    <Badge className={getPriorityColor(alert.priority)}>
                      {getPriorityLabel(alert.priority)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {alert.message}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{getAlertTypeLabel(alert.type)}</span>
                    <span>
                      {new Date(alert.createdAt).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {alert.actionUrl && (
                      <a
                        href={alert.actionUrl}
                        className="text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
                      >
                        Ver detalles
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
                {!alert.isRead && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMarkAsRead(alert.id)}
                    title="Marcar como leída"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

