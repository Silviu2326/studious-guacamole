import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import { Alert, AlertFilters, AlertType } from '../types';
import { 
  getAlerts, 
  markAlertAsRead, 
  markAllAlertsAsRead, 
  getUnreadAlertsCount,
  getPriorityColor, 
  getPriorityLabel, 
  getAlertPriorityCardStyles,
  getAlertPriorityIconColor 
} from '../api';
import { Bell, CheckCircle2, AlertCircle, ExternalLink, Loader2, X, User, UserPlus, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { AlertQuickActions } from './AlertQuickActions';

interface AlertsPanelProps {
  role: 'entrenador' | 'gimnasio';
  maxVisible?: number;
  compact?: boolean;
  showHeader?: boolean;
  showMarkAllAsRead?: boolean;
  alerts?: Alert[]; // Si se proporciona, usa estas alertas en lugar de cargarlas
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ 
  role, 
  maxVisible = 10,
  compact = false,
  showHeader = true,
  showMarkAllAsRead = true,
  alerts: providedAlerts,
}) => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(!providedAlerts); // Si se proporcionan alertas, no cargar
  const [unreadCount, setUnreadCount] = useState(
    providedAlerts ? providedAlerts.filter(a => !a.isRead).length : 0
  );
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  // Si se proporcionan alertas, usarlas directamente
  const displayAlerts = providedAlerts || alerts;

  useEffect(() => {
    if (!providedAlerts) {
      loadAlerts();
      loadUnreadCount();
    } else {
      setLoading(false);
      setUnreadCount(providedAlerts.filter(a => !a.isRead).length);
    }
  }, [role, user?.id, providedAlerts]);

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

  const handleAlertUpdated = (updatedAlert: Alert) => {
    if (!providedAlerts) {
      loadAlerts();
      loadUnreadCount();
    } else {
      setAlerts(prev => prev.map(a => a.id === updatedAlert.id ? updatedAlert : a));
      if (updatedAlert.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    }
  };

  const handleShowToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleTaskCreated = () => {
    // Recargar datos si es necesario
    if (!providedAlerts) {
      loadAlerts();
    }
  };

  const getAlertIcon = (alert: Alert) => {
    // Usar el color basado en la prioridad de la alerta (sistema centralizado)
    const iconColor = getAlertPriorityIconColor(alert.priority);
    
    // Determinar el tipo de ícono según el tipo de alerta
    switch (alert.type) {
      case 'pago-pendiente':
      case 'factura-vencida':
      case 'equipo-roto':
      case 'aforo-superado':
        return <AlertCircle className={`w-5 h-5 ${iconColor}`} />;
      case 'check-in-faltante':
      case 'lead-sin-seguimiento':
      case 'recordatorio':
        return <Bell className={`w-5 h-5 ${iconColor}`} />;
      default:
        return <Bell className={`w-5 h-5 ${iconColor}`} />;
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

  const getEntityBadge = (entityType?: 'client' | 'lead' | 'other') => {
    if (!entityType || entityType === 'other') return null;
    
    if (entityType === 'client') {
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs flex items-center gap-1">
          <User className="w-3 h-3" />
          <span>Cliente</span>
        </Badge>
      );
    }
    
    if (entityType === 'lead') {
      return (
        <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-xs flex items-center gap-1">
          <UserPlus className="w-3 h-3" />
          <span>Lead</span>
        </Badge>
      );
    }
    
    return null;
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
    <>
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 animate-in slide-in-from-right-full fade-in duration-300`}>
          <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${
            toast.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            {toast.type === 'success' ? (
              <CheckCircle2 size={20} className="text-green-600" />
            ) : (
              <AlertCircle size={20} className="text-red-600" />
            )}
            <p className="text-sm font-medium">{toast.message}</p>
            <button 
              onClick={() => setToast(null)}
              className="ml-2 p-1 hover:bg-black/5 rounded-full transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <Card className="bg-white shadow-sm">
        {showHeader && (
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
          {alerts.length > 0 && showMarkAllAsRead && (
            <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
              Marcar todas como leídas
            </Button>
          )}
        </div>
      )}

      {alerts.length === 0 ? (
        !compact && (
          <Card className="p-8 text-center bg-white shadow-sm">
            <CheckCircle2 size={48} className="mx-auto text-green-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay alertas pendientes</h3>
            <p className="text-gray-600">Todas las alertas están al día</p>
          </Card>
        )
      ) : (
        <div className={compact ? "space-y-2" : "space-y-4"}>
          {displayAlerts.map((alert) => {
            // Usar estilos centralizados basados en prioridad
            const cardStyles = alert.isRead 
              ? { border: 'border', background: 'bg-slate-50', borderColor: 'border-slate-200' }
              : getAlertPriorityCardStyles(alert.priority);
            
            const isExpanded = expandedCards.has(alert.id);
            
            return (
              <div
                key={alert.id}
                className={`${compact ? 'p-3' : 'md:p-5 p-3'} rounded-xl transition-all ${
                  cardStyles.border
                } ${cardStyles.background} ${cardStyles.borderColor} ${
                  cardStyles.ring || ''
                }`}
              >
                <div className="flex items-start gap-3 relative">
                  {/* Badge en esquina superior derecha */}
                  <div className="absolute top-2 right-2 md:relative md:top-0 md:right-0 md:ml-auto flex items-center gap-2 z-10">
                    {!alert.isRead && !compact && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(alert.id);
                        }}
                        title="Marcar como leída"
                        className="min-h-[44px] min-w-[44px] p-2 md:min-h-0 md:min-w-0"
                      >
                        <CheckCircle2 className="w-5 h-5 md:w-4 md:h-4" />
                      </Button>
                    )}
                    {/* Badge de prioridad siempre visible en esquina superior derecha */}
                    <Badge className={getPriorityColor(alert.priority)}>
                      {getPriorityLabel(alert.priority)}
                    </Badge>
                  </div>

                  {getAlertIcon(alert)}
                  <div className="flex-1 min-w-0 pr-16 md:pr-0">
                    {/* Título - compacto en móvil */}
                    <div className="flex items-start justify-between gap-2 mb-1 md:mb-2">
                      <h4 className={`${compact ? 'text-base' : 'text-base md:text-lg'} font-bold text-gray-900 line-clamp-1 md:line-clamp-none`}>
                        {alert.title}
                      </h4>
                      {/* Botón expandir/colapsar en móvil */}
                      {!compact && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedCards(prev => {
                              const newSet = new Set(prev);
                              if (newSet.has(alert.id)) {
                                newSet.delete(alert.id);
                              } else {
                                newSet.add(alert.id);
                              }
                              return newSet;
                            });
                          }}
                          className="md:hidden flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
                          aria-label={isExpanded ? 'Colapsar' : 'Expandir'}
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-600" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-600" />
                          )}
                        </button>
                      )}
                    </div>
                    
                    {/* Descripción - siempre visible en desktop, expandible en móvil */}
                    {!compact && (
                      <p className={`text-sm mb-2 md:mb-3 text-gray-700 ${
                        isExpanded ? 'line-clamp-none' : 'line-clamp-1'
                      } md:line-clamp-2`}>
                        {alert.message}
                      </p>
                    )}
                    
                    {/* Metadatos - ocultos en móvil cuando está colapsado */}
                    <div className={`flex items-center flex-wrap gap-2 md:gap-3 text-xs text-gray-500 ${
                      isExpanded ? '' : 'hidden md:flex'
                    }`}>
                      {getEntityBadge(alert.entityType)}
                      {!compact && <span className="hidden sm:inline">{getAlertTypeLabel(alert.type)}</span>}
                      <span>
                        {new Date(alert.createdAt).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          ...(compact ? {} : { hour: '2-digit', minute: '2-digit' }),
                        })}
                      </span>
                      {alert.actionUrl && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(alert.actionUrl, '_blank');
                          }}
                          className="text-blue-600 hover:text-blue-700 flex items-center gap-1 min-h-[44px] px-2 md:min-h-0"
                        >
                          Ver detalles
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    
                    {/* Acciones rápidas para alertas - ocultas en móvil cuando está colapsado */}
                    {!compact && (
                      <div className={`mt-3 ${isExpanded ? '' : 'hidden md:block'}`} onClick={(e) => e.stopPropagation()}>
                        <AlertQuickActions
                          alert={alert}
                          onAlertUpdated={handleAlertUpdated}
                          onTaskCreated={handleTaskCreated}
                          onShowToast={handleShowToast}
                          compact={compact}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      </Card>
    </>
  );
};

