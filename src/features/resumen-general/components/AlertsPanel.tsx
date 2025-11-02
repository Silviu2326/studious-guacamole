import React from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
import { Alert as AlertType } from '../api/alerts';

interface AlertsPanelProps {
  alerts: AlertType[];
  loading?: boolean;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts, loading = false }) => {
  const navigate = useNavigate();

  const getAlertIcon = (type: AlertType['type']) => {
    switch (type) {
      case 'error':
        return <XCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'info':
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getAlertColor = (type: AlertType['type']) => {
    switch (type) {
      case 'error':
        return {
          bg: 'bg-red-50',
          icon: 'text-red-600',
          border: 'border-red-600',
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          icon: 'text-yellow-600',
          border: 'border-yellow-600',
        };
      case 'success':
        return {
          bg: 'bg-green-50',
          icon: 'text-green-600',
          border: 'border-green-600',
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-50',
          icon: 'text-blue-600',
          border: 'border-blue-600',
        };
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Hace unos momentos';
    if (minutes < 60) return `Hace ${minutes} min`;
    if (hours < 24) return `Hace ${hours} h`;
    return `Hace ${Math.floor(hours / 24)} días`;
  };

  if (loading) {
    return (
      <Card className="p-4 bg-white shadow-sm">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </Card>
    );
  }

  if (alerts.length === 0) {
    return (
      <Card className="p-4 bg-white shadow-sm">
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">
            No hay alertas pendientes
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-white shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Alertas y Notificaciones
        </h3>
        <p className="text-gray-600 text-sm mt-1">
          {alerts.length} {alerts.length === 1 ? 'alerta pendiente' : 'alertas pendientes'}
        </p>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => {
          const colors = getAlertColor(alert.type);
          return (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border-l-4 ${colors.border} ${colors.bg} transition-colors`}
            >
              <div className="flex items-start gap-3">
                <div className={`${colors.icon} flex-shrink-0 mt-0.5`}>
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">
                    {alert.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {alert.message}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {formatTime(alert.timestamp)}
                    </span>
                    {alert.actionUrl && alert.actionLabel && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(alert.actionUrl!)}
                      >
                        {alert.actionLabel}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
