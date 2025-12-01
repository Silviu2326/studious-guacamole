import React from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { useNavigate } from 'react-router-dom';
import { 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  XCircle, 
  CreditCard, 
  AlertCircle as IncidentIcon, 
  MessageSquare, 
  Settings,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { Alert as AlertType, AlertSeverity } from '../api';

interface AlertsPanelProps {
  /** Lista de alertas a mostrar */
  alerts: AlertType[];
  /** Estado de carga */
  loading?: boolean;
  /** Mensaje de error */
  error?: string;
  /** Callback para reintentar carga */
  onRetry?: () => void;
  /** Callback opcional cuando se hace clic en una alerta (para navegación futura) */
  onAlertClick?: (alert: AlertType) => void;
}

/**
 * Componente AlertsPanel
 * 
 * Muestra las alertas importantes del centro/entrenador con:
 * - Iconos según tipo y severidad
 * - Título, descripción y fecha/hora formateada
 * - Destacado visual para alertas de alta severidad (warning, critical)
 * - Diferenciación entre alertas leídas y no leídas
 * - Estructura preparada para navegación futura
 */
export const AlertsPanel: React.FC<AlertsPanelProps> = ({ 
  alerts, 
  loading = false,
  error,
  onRetry,
  onAlertClick
}) => {
  const navigate = useNavigate();

  /**
   * Obtiene el icono según la severidad de la alerta
   */
  const getSeverityIcon = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="w-5 h-5" />;
      case 'error':
        return <XCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'info':
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  /**
   * Obtiene el icono según el tipo de alerta
   */
  const getTypeIcon = (type: AlertType['type']) => {
    switch (type) {
      case 'payment':
        return <CreditCard className="w-4 h-4" />;
      case 'incident':
        return <IncidentIcon className="w-4 h-4" />;
      case 'message':
        return <MessageSquare className="w-4 h-4" />;
      case 'system':
        return <Settings className="w-4 h-4" />;
    }
  };

  /**
   * Obtiene los colores según la severidad de la alerta
   * Destaca especialmente las alertas de alta severidad (warning, critical)
   */
  const getSeverityColor = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical':
        return {
          bg: 'bg-red-50',
          icon: 'text-red-700',
          border: 'border-red-700',
          text: 'text-red-900',
          ring: 'ring-red-200',
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          icon: 'text-red-600',
          border: 'border-red-600',
          text: 'text-red-800',
          ring: 'ring-red-200',
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          icon: 'text-yellow-700',
          border: 'border-yellow-600',
          text: 'text-yellow-900',
          ring: 'ring-yellow-200',
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-50',
          icon: 'text-blue-600',
          border: 'border-blue-600',
          text: 'text-blue-900',
          ring: 'ring-blue-200',
        };
    }
  };

  /**
   * Obtiene la etiqueta del tipo de alerta
   */
  const getTypeLabel = (type: AlertType['type']) => {
    switch (type) {
      case 'payment':
        return 'Pago';
      case 'incident':
        return 'Incidencia';
      case 'message':
        return 'Mensaje';
      case 'system':
        return 'Sistema';
    }
  };

  /**
   * Verifica si una alerta tiene severidad alta (warning o critical)
   */
  const isHighSeverity = (severity: AlertSeverity): boolean => {
    return severity === 'warning' || severity === 'critical';
  };

  /**
   * Formatea la fecha y hora de la alerta
   * Muestra tiempo relativo para alertas recientes y fecha completa para más antiguas
   */
  const formatDateTime = (createdAt: Date): string => {
    const now = new Date();
    const diff = now.getTime() - createdAt.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(hours / 24);
    
    // Tiempo relativo para alertas recientes
    if (minutes < 1) return 'Hace unos momentos';
    if (minutes < 60) return `Hace ${minutes} min`;
    if (hours < 24) return `Hace ${hours} h`;
    if (days === 1) return 'Ayer';
    if (days < 7) return `Hace ${days} días`;
    
    // Fecha completa para alertas más antiguas
    return createdAt.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: createdAt.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  /**
   * Maneja el clic en una alerta
   * Prepara el componente para navegación futura
   */
  const handleAlertClick = (alert: AlertType) => {
    if (onAlertClick) {
      onAlertClick(alert);
    } else if (alert.actionUrl) {
      // Navegación por defecto si no hay callback personalizado
      navigate(alert.actionUrl);
    }
  };

  // Estado de error
  if (error) {
    return (
      <Card className="p-4 bg-white shadow-sm">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Alertas y Notificaciones
          </h3>
        </div>
        <div className="flex flex-col items-center justify-center py-8">
          <div className="p-3 bg-red-100 rounded-full mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <h4 className="text-sm font-semibold text-gray-900 mb-1">
            Error al cargar las alertas
          </h4>
          <p className="text-sm text-gray-600 text-center mb-4 max-w-xs">
            {error}
          </p>
          {onRetry && (
            <Button 
              variant="primary" 
              size="sm"
              onClick={onRetry}
              className="bg-red-600 hover:bg-red-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reintentar
            </Button>
          )}
        </div>
      </Card>
    );
  }

  // Estado de carga
  if (loading) {
    return (
      <Card className="p-4 bg-white shadow-sm">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Alertas y Notificaciones
          </h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </Card>
    );
  }

  // Estado sin alertas
  if (alerts.length === 0) {
    return (
      <Card className="p-4 bg-white shadow-sm">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Alertas y Notificaciones
          </h3>
        </div>
        <div className="text-center py-8">
          <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 font-medium">
            No hay alertas importantes
          </p>
          <p className="text-gray-500 text-sm mt-1">
            Todas las alertas están resueltas o no hay pendientes
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-white shadow-sm">
      {/* Encabezado */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Alertas y Notificaciones
        </h3>
        <p className="text-gray-600 text-sm mt-1">
          {alerts.length} {alerts.length === 1 ? 'alerta pendiente' : 'alertas pendientes'}
        </p>
      </div>

      {/* Lista de alertas */}
      <div className="space-y-3">
        {alerts.map((alert) => {
          const colors = getSeverityColor(alert.severity);
          const isUnread = !alert.isRead;
          const isHighSev = isHighSeverity(alert.severity);
          
          return (
            <div
              key={alert.id}
              onClick={() => handleAlertClick(alert)}
              className={`
                p-4 rounded-lg border-l-4 
                ${colors.border} 
                ${colors.bg} 
                transition-all duration-200
                ${isUnread ? `ring-2 ${colors.ring} font-semibold` : 'opacity-90'}
                ${isHighSev ? 'shadow-md' : 'shadow-sm'}
                ${(onAlertClick || alert.actionUrl) ? 'cursor-pointer hover:shadow-lg hover:scale-[1.01]' : ''}
              `}
              role={onAlertClick || alert.actionUrl ? "button" : undefined}
              tabIndex={onAlertClick || alert.actionUrl ? 0 : undefined}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && (onAlertClick || alert.actionUrl)) {
                  e.preventDefault();
                  handleAlertClick(alert);
                }
              }}
            >
              <div className="flex items-start gap-3">
                {/* Icono de severidad */}
                <div className={`${colors.icon} flex-shrink-0 mt-0.5`}>
                  {getSeverityIcon(alert.severity)}
                </div>
                
                {/* Contenido de la alerta */}
                <div className="flex-1 min-w-0">
                  {/* Título y estado de lectura */}
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className={`
                      text-sm font-semibold mb-1
                      ${isUnread ? colors.text : 'text-gray-700'}
                      ${isHighSev ? 'font-bold' : ''}
                    `}>
                      {alert.title}
                    </h4>
                    {isUnread && (
                      <span 
                        className="flex-shrink-0 w-2.5 h-2.5 rounded-full mt-1.5 bg-blue-600"
                        aria-label="Alerta no leída"
                      />
                    )}
                  </div>
                  
                  {/* Tipo de alerta */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 text-xs text-gray-600">
                      {getTypeIcon(alert.type)}
                      {getTypeLabel(alert.type)}
                    </span>
                    {isHighSev && (
                      <span className={`
                        inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                        ${alert.severity === 'critical' ? 'bg-red-100 text-red-900' : ''}
                        ${alert.severity === 'warning' ? 'bg-yellow-100 text-yellow-900' : ''}
                      `}>
                        {alert.severity === 'critical' ? 'Crítica' : 'Advertencia'}
                      </span>
                    )}
                  </div>
                  
                  {/* Descripción */}
                  <p className={`text-sm mb-2 ${isUnread ? 'text-gray-800' : 'text-gray-600'}`}>
                    {alert.description}
                  </p>
                  
                  {/* Pie de la alerta: fecha/hora y acción */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {formatDateTime(alert.createdAt)}
                    </span>
                    {alert.actionUrl && alert.actionLabel && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(alert.actionUrl!);
                        }}
                        className="text-xs"
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
